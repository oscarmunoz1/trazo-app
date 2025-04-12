import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Badge,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PLANS_URL,
  SUBSCRIPTIONS_URL,
  PAYMENT_METHODS_URL,
  INVOICES_URL,
  ADDONS_URL
} from 'config/backend';
import { useAuth } from 'hooks/auth';
import PaymentStatistics from './components/PaymentStatistics';
import SubscriptionCard from './components/SubscriptionCard';
import PlanSelection from './components/PlanSelection';
import PaymentMethod from './components/PaymentMethod';
import Invoices from './components/Invoices';
import { MastercardIcon, VisaIcon, PayPalIcon } from 'components/Icons/Icons';
import { FaWallet, FaPlus, FaPlusCircle } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';

function Billing() {
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [addons, setAddons] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [activeInterval, setActiveInterval] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [addonQuantity, setAddonQuantity] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, activeCompany } = useAuth();
  const textColor = useColorModeValue('gray.700', 'white');
  const intl = useIntl();

  // Check for success or error messages in URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const isNewCompany = searchParams.get('new_company') === 'true';
    const companyId = searchParams.get('company_id');
    const sessionId = searchParams.get('session_id');

    if (success === 'true') {
      toast({
        title: intl.formatMessage({ id: 'app.subscriptionSuccess' }),
        description: intl.formatMessage({ id: 'app.subscriptionSuccessDescription' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // If this was for a new company, redirect to establishment creation
      if (isNewCompany && companyId) {
        // Use timeout to ensure user sees the success message
        setTimeout(() => {
          navigate(`/admin/dashboard/establishment/add`);
        }, 2000);
      }
    }

    if (error) {
      toast({
        title: intl.formatMessage({ id: 'app.subscriptionError' }),
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  }, [location, toast, intl, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!activeCompany) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch subscription data
        const subscriptionRes = await axios.get(SUBSCRIPTIONS_URL());
        if (subscriptionRes.data.length > 0) {
          setSubscription(subscriptionRes.data[0]);
        }

        // Fetch available plans
        const plansRes = await axios.get(PLANS_URL, {
          params: { interval: activeInterval }
        });
        setPlans(plansRes.data);

        // Fetch available add-ons
        const addonsRes = await axios.get(ADDONS_URL);
        setAddons(addonsRes.data);

        // Fetch payment methods
        const paymentMethodsRes = await axios.get(PAYMENT_METHODS_URL());
        setPaymentMethods(paymentMethodsRes.data);

        // Fetch invoices
        const invoicesRes = await axios.get(INVOICES_URL);
        setInvoices(invoicesRes.data);
      } catch (error) {
        console.error('Error fetching billing data:', error);
        toast({
          title: intl.formatMessage({ id: 'app.error' }),
          description: intl.formatMessage({ id: 'app.errorFetchingBillingData' }),
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCompany, activeInterval, toast, intl]);

  const handleBillingIntervalChange = (interval) => {
    setActiveInterval(interval);
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      await axios.post(`${SUBSCRIPTIONS_URL(subscription.id)}/cancel/`);

      // Update subscription data
      const res = await axios.get(SUBSCRIPTIONS_URL(subscription.id));
      setSubscription(res.data);

      toast({
        title: intl.formatMessage({ id: 'app.subscriptionCanceled' }),
        description: intl.formatMessage({ id: 'app.subscriptionCanceledDescription' }),
        status: 'info',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description: intl.formatMessage({ id: 'app.errorCancelingSubscription' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;

    try {
      await axios.post(`${SUBSCRIPTIONS_URL(subscription.id)}/reactivate/`);

      // Update subscription data
      const res = await axios.get(SUBSCRIPTIONS_URL(subscription.id));
      setSubscription(res.data);

      toast({
        title: intl.formatMessage({ id: 'app.subscriptionReactivated' }),
        description: intl.formatMessage({ id: 'app.subscriptionReactivatedDescription' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description: intl.formatMessage({ id: 'app.errorReactivatingSubscription' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleChangePlan = async (planId) => {
    if (!subscription) return;

    try {
      await axios.post(`${SUBSCRIPTIONS_URL(subscription.id)}/change_plan/`, {
        plan_id: planId
      });

      // Update subscription data
      const res = await axios.get(SUBSCRIPTIONS_URL(subscription.id));
      setSubscription(res.data);

      toast({
        title: intl.formatMessage({ id: 'app.planChanged' }),
        description: intl.formatMessage({ id: 'app.planChangedDescription' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error changing plan:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description: intl.formatMessage({ id: 'app.errorChangingPlan' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleOpenAddonModal = (addon) => {
    setSelectedAddon(addon);
    setAddonQuantity(1);
    onOpen();
  };

  const handleAddAddon = async () => {
    if (!subscription || !selectedAddon) return;

    try {
      await axios.post(`${SUBSCRIPTIONS_URL(subscription.id)}/add_addon/`, {
        addon_id: selectedAddon.id,
        quantity: addonQuantity
      });

      // Update subscription data
      const res = await axios.get(SUBSCRIPTIONS_URL(subscription.id));
      setSubscription(res.data);

      toast({
        title: intl.formatMessage({ id: 'app.addonAdded' }),
        description: intl.formatMessage({ id: 'app.addonAddedDescription' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      onClose();
    } catch (error) {
      console.error('Error adding add-on:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description: intl.formatMessage({ id: 'app.errorAddingAddon' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Function to calculate how many of each add-on are already purchased
  const getAddonQuantity = (addonSlug) => {
    if (!subscription || !subscription.addons) return 0;

    const addon = subscription.addons.find((a) => a.addon.slug === addonSlug);
    return addon ? addon.quantity : 0;
  };

  // Function to get usage info for the subscription
  const getUsageInfo = () => {
    if (!subscription) return [];

    const plan = subscription.plan;
    const features = plan.features || {};

    return [
      {
        name: intl.formatMessage({ id: 'app.establishmentsUsed' }),
        value: `${activeCompany?.establishment_count || 0}/${features.max_establishments || 0}`
      },
      {
        name: intl.formatMessage({ id: 'app.parcelsUsed' }),
        value: features.max_parcels
          ? `${activeCompany?.parcel_count || 0}/${features.max_parcels}`
          : `${activeCompany?.parcel_count || 0}/${
              features.max_parcels_per_establishment * features.max_establishments
            }`
      },
      {
        name: intl.formatMessage({ id: 'app.productionsUsed' }),
        value: `${subscription.used_productions}/${
          features.max_productions_per_year + getAddonQuantity('extra-production')
        }`
      },
      {
        name: intl.formatMessage({ id: 'app.storageUsed' }),
        value: `${subscription.used_storage_gb}GB/${
          features.storage_limit_gb + getAddonQuantity('extra-storage')
        }GB`
      }
    ];
  };

  // Helper functions for trial display
  const getDaysRemaining = (trialEndDate) => {
    if (!trialEndDate) return 0;

    const end = new Date(trialEndDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const getTrialProgressPercentage = (subscription) => {
    if (!subscription.trial_end || !subscription.current_period_start) {
      return 0;
    }

    const start = new Date(subscription.current_period_start);
    const end = new Date(subscription.trial_end);
    const now = new Date();

    const totalDuration = end - start;
    const elapsed = now - start;

    if (elapsed <= 0) return 0;
    if (elapsed >= totalDuration) return 100;

    return Math.round((elapsed / totalDuration) * 100);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Success/Error Alerts */}
      {new URLSearchParams(location.search).get('success') === 'true' && (
        <Alert status="success" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>{intl.formatMessage({ id: 'app.subscriptionSuccessful' })}</AlertTitle>
          <AlertDescription>
            {intl.formatMessage({ id: 'app.subscriptionSuccessfulDescription' })}
          </AlertDescription>
        </Alert>
      )}

      {new URLSearchParams(location.search).get('canceled') === 'true' && (
        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>{intl.formatMessage({ id: 'app.checkoutCanceled' })}</AlertTitle>
          <AlertDescription>
            {intl.formatMessage({ id: 'app.checkoutCanceledDescription' })}
          </AlertDescription>
        </Alert>
      )}

      {/* No Company Warning */}
      {!activeCompany && (
        <Alert status="warning" mb={4} borderRadius="md">
          <AlertIcon />
          <AlertTitle mr={2}>{intl.formatMessage({ id: 'app.noActiveCompany' })}</AlertTitle>
          <AlertDescription>
            {intl.formatMessage({ id: 'app.selectCompanyToManageBilling' })}
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Flex justify="center" align="center" h="300px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1.5fr' }} gap="20px">
          <Box>
            <Grid templateColumns="1fr" gap="20px">
              {subscription ? (
                <>
                  {/* Add this section for trial */}
                  {subscription.status === 'trialing' && (
                    <Box
                      p={4}
                      bg="green.50"
                      borderRadius="md"
                      mb={4}
                      position="relative"
                      overflow="hidden">
                      {/* Add a progress bar for trial days */}
                      {subscription.trial_end && (
                        <Box
                          position="absolute"
                          bottom={0}
                          left={0}
                          height="4px"
                          bg="green.400"
                          width={getTrialProgressPercentage(subscription) + '%'}
                        />
                      )}

                      <Flex direction="column" gap={2}>
                        <Text fontWeight="bold" color="green.700">
                          {intl.formatMessage({ id: 'app.trialActive' })}
                        </Text>

                        <Flex justify="space-between" align="center">
                          <Text color="green.700">
                            {intl.formatMessage({ id: 'app.trialPeriod' })}:
                          </Text>
                          <Text fontWeight="medium">
                            {intl.formatMessage(
                              { id: 'app.daysRemaining' },
                              {
                                days: getDaysRemaining(subscription.trial_end)
                              }
                            )}
                          </Text>
                        </Flex>

                        <Flex justify="space-between" align="center">
                          <Text color="green.700">
                            {intl.formatMessage({ id: 'app.billingStartsOn' })}:
                          </Text>
                          <Text fontWeight="medium">
                            {new Date(subscription.trial_end).toLocaleDateString()}
                          </Text>
                        </Flex>

                        <Flex justify="space-between" align="center" mt={2}>
                          <Button
                            size="sm"
                            colorScheme="gray"
                            variant="outline"
                            onClick={handleCancelSubscription}>
                            {intl.formatMessage({ id: 'app.cancelTrial' })}
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            onClick={() => window.open('mailto:support@trazo.com')}>
                            {intl.formatMessage({ id: 'app.contactSupport' })}
                          </Button>
                        </Flex>
                      </Flex>
                    </Box>
                  )}

                  <SubscriptionCard
                    subscription={subscription}
                    onCancel={handleCancelSubscription}
                    onReactivate={handleReactivateSubscription}
                    onChangePlan={handleChangePlan}
                  />

                  <PaymentStatistics
                    title={intl.formatMessage({ id: 'app.usageStatistics' })}
                    name={intl.formatMessage({ id: 'app.subscription' })}
                    data={getUsageInfo()}
                  />

                  {/* Add-ons Section */}
                  <Box bg="white" borderRadius="lg" boxShadow="md" p={5}>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      {intl.formatMessage({ id: 'app.addons' })}
                    </Text>

                    {subscription.addons && subscription.addons.length > 0 ? (
                      <>
                        {subscription.addons.map((addonItem) => (
                          <Flex
                            key={addonItem.id}
                            justify="space-between"
                            align="center"
                            mb={3}
                            p={3}
                            borderWidth="1px"
                            borderRadius="md">
                            <Box>
                              <Text fontWeight="medium">{addonItem.addon.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                ${addonItem.addon.price} x {addonItem.quantity}
                              </Text>
                            </Box>
                            <Badge>
                              ${(addonItem.addon.price * addonItem.quantity).toFixed(2)}
                            </Badge>
                          </Flex>
                        ))}
                        <Divider my={4} />
                      </>
                    ) : (
                      <Text mb={4} color="gray.500">
                        {intl.formatMessage({ id: 'app.noAddonsYet' })}
                      </Text>
                    )}

                    <Text fontSize="sm" mb={3}>
                      {intl.formatMessage({ id: 'app.addAddonDescription' })}
                    </Text>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
                      {addons.map((addon) => (
                        <Button
                          key={addon.id}
                          leftIcon={<FaPlusCircle />}
                          colorScheme="blue"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenAddonModal(addon)}>
                          {addon.name}
                        </Button>
                      ))}
                    </SimpleGrid>
                  </Box>
                </>
              ) : (
                <>
                  <Tabs isFitted variant="enclosed" colorScheme="blue">
                    <TabList mb="1em">
                      <Tab onClick={() => handleBillingIntervalChange('monthly')}>
                        {intl.formatMessage({ id: 'app.monthly' })}
                      </Tab>
                      <Tab onClick={() => handleBillingIntervalChange('yearly')}>
                        {intl.formatMessage({ id: 'app.yearly' })}
                      </Tab>
                    </TabList>
                    <TabPanels>
                      <TabPanel p={0}>
                        <PlanSelection
                          plans={plans.filter((p) => p.interval === 'monthly')}
                          activeCompanyId={activeCompany?.id}
                        />
                      </TabPanel>
                      <TabPanel p={0}>
                        <PlanSelection
                          plans={plans.filter((p) => p.interval === 'yearly')}
                          activeCompanyId={activeCompany?.id}
                        />
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </>
              )}
            </Grid>
          </Box>

          <Box>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="20px" mb="20px">
              {paymentMethods.map((method, index) => (
                <PaymentMethod
                  key={index}
                  icon={
                    method.card_brand === 'visa' ? (
                      <VisaIcon w="100%" h="100%" />
                    ) : method.card_brand === 'mastercard' ? (
                      <MastercardIcon w="100%" h="100%" />
                    ) : method.card_brand === 'paypal' ? (
                      <PayPalIcon w="100%" h="100%" />
                    ) : (
                      <Icon as={FaWallet} w="100%" h="100%" />
                    )
                  }
                  title={`${
                    method.card_brand.charAt(0).toUpperCase() + method.card_brand.slice(1)
                  } Card`}
                  subtitle={`**** **** **** ${method.last_4}`}
                  exp={`${method.exp_month}/${method.exp_year}`}
                />
              ))}
            </Grid>
          </Box>
        </Grid>
      )}
    </Box>
  );
}

export default Billing;
