import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Grid,
  Text,
  Button,
  useColorModeValue,
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
  CardBody,
  Stack
} from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetBillingDashboardQuery,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useChangePlanMutation,
  useAddAddonMutation,
  useCreateCustomerPortalSessionMutation,
  useSetDefaultPaymentMethodMutation,
  useCreateCheckoutSessionMutation,
  useSubscribeBlockchainMutation,
  useGetBlockchainSubscriptionStatusQuery
} from 'store/api/billingApi';
import PaymentStatistics from './components/PaymentStatistics';
import SubscriptionCard from './components/SubscriptionCard';
import PaymentMethod from './components/PaymentMethod';
import Invoices from './components/Invoices';
import { MastercardIcon, VisaIcon, PayPalIcon } from 'components/Icons/Icons';
import {
  FaWallet,
  FaPlus,
  FaPlusCircle,
  FaInfoCircle,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaMinusCircle,
  FaSync,
  FaChartBar
} from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

// Helper functions for date and price formatting
const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

const formatPrice = (price, quantity = 1) => {
  if (price === null || price === undefined) return '-';
  const numPrice = Number(price);
  if (isNaN(numPrice)) return '-';
  return `$${(numPrice * quantity).toFixed(2)}`;
};

// Normal subscription data structure
const normalizeSubscription = (dashboardData, companyData) => {
  // First try subscription from dashboard
  if (dashboardData?.subscription && dashboardData.subscription.length > 0) {
    return dashboardData.subscription[0];
  }
  // Fallback to company subscription
  if (companyData?.subscription && Object.keys(companyData.subscription).length > 0) {
    return companyData.subscription;
  }
  return null;
};

function Billing() {
  const [selectedAddon, setSelectedAddon] = useState(null);
  const [addonQuantity, setAddonQuantity] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const activeCompany = useSelector((state) => state.company.currentCompany);
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const intl = useIntl();

  // Fetch all billing data at once
  const {
    data: dashboardData = { subscription: [], addons: [], paymentMethods: [], invoices: [] },
    isLoading: isDashboardLoading,
    refetch: refetchDashboard
  } = useGetBillingDashboardQuery(undefined, {
    skip: !activeCompany,
    refetchOnMountOrArgChange: true
  });

  // Use mutations
  const [cancelSubscription, { isLoading: isCancellingSubscription }] =
    useCancelSubscriptionMutation();
  const [reactivateSubscription, { isLoading: isReactivatingSubscription }] =
    useReactivateSubscriptionMutation();
  const [changePlan, { isLoading: isChangingPlan }] = useChangePlanMutation();
  const [addAddon, { isLoading: isAddingAddon }] = useAddAddonMutation();
  const [createCustomerPortalSession, { isLoading: isCreatingPortalSession }] =
    useCreateCustomerPortalSessionMutation();
  const [setDefaultPaymentMethod, { isLoading: isSettingDefaultPaymentMethod }] =
    useSetDefaultPaymentMethodMutation();
  const [createCheckoutSession, { isLoading: isCreatingCheckoutSession }] =
    useCreateCheckoutSessionMutation();
  const [subscribeBlockchain, { isLoading: isSubscribingBlockchain }] =
    useSubscribeBlockchainMutation();
  const { data: blockchainStatus } = useGetBlockchainSubscriptionStatusQuery();

  // Get normalized subscription
  const subscription = normalizeSubscription(dashboardData, activeCompany);
  const addons = dashboardData?.addons || [];
  const paymentMethods = dashboardData?.paymentMethods || [];
  const invoices = dashboardData?.invoices || [];

  // Improve the subscription detection logic
  const hasSubscription =
    (subscription !== null &&
      typeof subscription === 'object' &&
      Object.keys(subscription).length > 0) ||
    activeCompany?.has_subscription === true;

  // Reusable error handler
  const handleApiError = useCallback(
    (error, defaultMessageId) => {
      console.error('API Error:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description: error.data?.error || intl.formatMessage({ id: defaultMessageId }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    },
    [intl, toast]
  );

  // Check for success or error messages in URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const isNewCompany = searchParams.get('new_company') === 'true';
    const companyId = searchParams.get('company_id');

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

      // Refresh the data
      refetchDashboard();
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

    // Clear URL parameters after handling them
    if (success || error) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, intl, navigate, refetchDashboard]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    try {
      await cancelSubscription(subscription.id).unwrap();

      toast({
        title: intl.formatMessage({ id: 'app.subscriptionCanceled' }),
        description: intl.formatMessage({ id: 'app.subscriptionCanceledDescription' }),
        status: 'info',
        duration: 5000,
        isClosable: true
      });

      // Refresh data after cancellation
      refetchDashboard();
    } catch (error) {
      handleApiError(error, 'app.errorCancelingSubscription');
    }
  };

  const handleReactivateSubscription = async () => {
    if (!subscription) return;

    try {
      await reactivateSubscription(subscription.id).unwrap();

      toast({
        title: intl.formatMessage({ id: 'app.subscriptionReactivated' }),
        description: intl.formatMessage({ id: 'app.subscriptionReactivatedDescription' }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Refresh data after reactivation
      refetchDashboard();
    } catch (error) {
      handleApiError(error, 'app.errorReactivatingSubscription');
    }
  };

  const handleChangePlan = (planAction) => {
    console.log('Change plan:', planAction);

    // Call the API with the specific plan ID
    changePlan({
      companyId: activeCompany.id,
      planId: planAction // Now receiving direct plan ID
    })
      .unwrap()
      .then((response) => {
        console.log('Plan change response:', response);
        if (response?.url) {
          toast({
            title: intl.formatMessage({ id: 'app.redirectingToCheckout' }),
            status: 'info',
            duration: 3000,
            isClosable: true
          });
          window.location.href = response.url;
        } else {
          toast({
            title: intl.formatMessage({ id: 'app.planChangeSuccess' }),
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          refetchDashboard();
        }
      })
      .catch((error) => {
        console.error('Error changing plan:', error);
        toast({
          title: intl.formatMessage({ id: 'app.planChangeError' }),
          description: error.message || intl.formatMessage({ id: 'app.somethingWentWrong' }),
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  const handleOpenAddonModal = (addon) => {
    setSelectedAddon(addon);
    setAddonQuantity(1);
    onOpen();
  };

  const handleAddAddon = async () => {
    if (!subscription || !selectedAddon) return;

    try {
      // Get the URL parameter if we came from a specific page
      const currentLocation = window.location.search;
      const searchParams = new URLSearchParams(currentLocation);
      const fromPage = searchParams.get('from');

      // Build the return URL if we came from a specific page
      let returnUrl = null;
      if (fromPage) {
        returnUrl = `/admin/dashboard/${fromPage}`;
      }

      const response = await addAddon({
        subscriptionId: subscription.id,
        addonId: selectedAddon.id,
        quantity: addonQuantity,
        return_url: returnUrl
      }).unwrap();

      // Close the modal
      onClose();

      // If response contains a Stripe checkout URL, redirect to it
      if (response?.url) {
        toast({
          title: intl.formatMessage({ id: 'app.redirectingToCheckout' }),
          description: intl.formatMessage({ id: 'app.addonPurchaseRedirect' }),
          status: 'info',
          duration: 3000,
          isClosable: true
        });
        window.location.href = response.url;
      } else {
        // Legacy behavior - add-on applied without redirect
        toast({
          title: intl.formatMessage({ id: 'app.addonAdded' }),
          description: intl.formatMessage({ id: 'app.addonAddedDescription' }),
          status: 'success',
          duration: 5000,
          isClosable: true
        });

        // Reset the form
        setSelectedAddon(null);
        setAddonQuantity(1);

        // Refresh data after adding addon
        refetchDashboard();
      }
    } catch (error) {
      handleApiError(error, 'app.errorAddingAddon');
    }
  };

  // Function to calculate how many of each add-on are already purchased
  const getAddonQuantity = (addonSlug) => {
    if (!subscription || !subscription.addons) return 0;

    // Check if addons is an array (expected format)
    if (Array.isArray(subscription.addons)) {
      const addon = subscription.addons.find((a) => a.addon?.slug === addonSlug);
      return addon ? addon.quantity : 0;
    }
    // If addons is an object with keys (possible alternative format)
    else if (typeof subscription.addons === 'object') {
      // Try to find addon by slug in the object
      for (const key in subscription.addons) {
        const addon = subscription.addons[key];
        if (addon && addon.addon && addon.addon.slug === addonSlug) {
          return addon.quantity || 0;
        }
      }
    }

    // Default return 0 if nothing found
    return 0;
  };

  // Function to get usage info for the subscription
  const getUsageInfo = () => {
    if (!subscription) return [];

    const plan = subscription?.plan || {};
    const features = plan?.features || {};

    // Default values for metrics that might be missing
    const defaultProductions = 0;
    const defaultStorage = 0;
    const defaultMaxProductions = features?.max_productions_per_year || 0;
    const defaultMaxStorage = features?.storage_limit_gb || 0;

    // Safely get values with fallbacks
    const establishmentCount = activeCompany?.establishment_count || 0;
    const maxEstablishments = features?.max_establishments || 0;
    const parcelCount = activeCompany?.parcel_count || 0;
    const maxParcels = features?.max_parcels || 0;
    const maxParcelsPerEstablishment = features?.max_parcels_per_establishment || 0;
    const usedProductions = subscription?.used_productions || defaultProductions;
    const usedStorage = subscription?.used_storage_gb || defaultStorage;

    // Extra addons
    const extraProduction = getAddonQuantity('extra-production');
    const extraStorage = getAddonQuantity('extra-storage');

    return [
      {
        name: intl.formatMessage({ id: 'app.establishmentsUsed' }),
        value: `${establishmentCount}/${maxEstablishments}`
      },
      {
        name: intl.formatMessage({ id: 'app.parcelsUsed' }),
        value: maxParcels
          ? `${parcelCount}/${maxParcels}`
          : maxParcelsPerEstablishment
          ? `${parcelCount}/${maxParcelsPerEstablishment * maxEstablishments}`
          : `${parcelCount}/0`
      },
      {
        name: intl.formatMessage({ id: 'app.productionsUsed' }),
        value: `${usedProductions}/${defaultMaxProductions + extraProduction}`
      },
      {
        name: intl.formatMessage({ id: 'app.storageUsed' }),
        value: `${usedStorage}GB/${defaultMaxStorage + extraStorage}GB`
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
    if (!subscription || !subscription.trial_end || !subscription.current_period_start) {
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

  // Check if any data is loading
  const isLoading =
    isDashboardLoading ||
    isCancellingSubscription ||
    isReactivatingSubscription ||
    isChangingPlan ||
    isAddingAddon ||
    isCreatingPortalSession ||
    isSettingDefaultPaymentMethod ||
    isCreatingCheckoutSession ||
    isSubscribingBlockchain;

  // Right after the trial banner and before the Main Subscription Card
  // Add a collapsible section for Add-ons that's closed by default
  const [showAddons, setShowAddons] = useState(false);

  // Skip showing empty or invalid add-ons
  const validAddons = addons.filter(
    (addon) => addon && typeof addon === 'object' && addon.id && addon.name && addon.price
  );

  // Function to toggle the add-ons section visibility
  const toggleAddons = () => {
    setShowAddons(!showAddons);
  };

  // Handle setting a payment method as default
  const handleSetDefaultPaymentMethod = useCallback(
    (paymentMethodId) => {
      if (!paymentMethodId) return;

      // Use the API to set this payment method as default
      setDefaultPaymentMethod(paymentMethodId)
        .unwrap()
        .then(() => {
          toast({
            title: intl.formatMessage({ id: 'app.success' }),
            description: intl.formatMessage({ id: 'app.paymentMethodSetAsDefault' }),
            status: 'success',
            duration: 3000,
            isClosable: true
          });
          refetchDashboard(); // Refresh the dashboard data to show updated default status
        })
        .catch((error) => {
          handleApiError(error, 'app.errorSettingPaymentMethod');
        });
    },
    [setDefaultPaymentMethod, toast, intl, refetchDashboard, handleApiError]
  );

  // For adding payment methods, redirect to Stripe checkout
  const handleAddPaymentMethod = useCallback(() => {
    if (!activeCompany?.id) {
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description: intl.formatMessage({ id: 'app.companyNotSelected' }),
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    // Create checkout session specifically for adding a payment method
    createCheckoutSession({
      company_id: activeCompany.id, // Send snake_case directly
      mode: 'setup',
      success_url: window.location.href + '?refresh=true',
      cancel_url: window.location.href
    })
      .unwrap()
      .then((response) => {
        // Handle both response formats (url or sessionId)
        if (response && response.url) {
          window.location.href = response.url;
        } else if (response && response.sessionId) {
          // If backend returns sessionId, we need to construct the URL
          // This is a temporary measure until the backend response format is standardized
          window.location.href = 'https://checkout.stripe.com/pay/' + response.sessionId;
        } else {
          toast({
            title: intl.formatMessage({ id: 'app.error' }),
            description: intl.formatMessage({ id: 'app.invalidCheckoutResponse' }),
            status: 'error',
            duration: 3000,
            isClosable: true
          });
        }
      })
      .catch((error) => {
        handleApiError(error, 'app.errorCreatingCheckout');
      });
  }, [activeCompany, createCheckoutSession, toast, intl, handleApiError]);

  // Handle blockchain subscription
  const handleSubscribeBlockchain = useCallback(async () => {
    if (!hasSubscription) {
      toast({
        title: intl.formatMessage({ id: 'app.subscriptionRequired' }),
        description: 'You need an active subscription to add blockchain verification',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    try {
      const response = await subscribeBlockchain().unwrap();

      if (response.checkout_url) {
        window.location.href = response.checkout_url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      handleApiError(error, 'app.errorCreatingCheckout');
    }
  }, [subscribeBlockchain, hasSubscription, toast, intl, handleApiError]);

  return (
    <Box pt={{ base: '120px', md: '60px', xl: '60px' }}>
      {/* Page Title with Refresh Button */}
      <Flex mb={5} justifyContent="space-between" alignItems="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            {intl.formatMessage({ id: 'app.subscriptionManagement' })}
          </Text>
          <Text color="gray.500">
            {subscription
              ? intl.formatMessage({ id: 'app.manageYourSubscription' })
              : intl.formatMessage({ id: 'app.noActiveSubscription' })}
          </Text>
        </Box>

        <Button
          leftIcon={<FaSync />}
          colorScheme="blue"
          variant="outline"
          isLoading={isDashboardLoading}
          onClick={() => refetchDashboard()}
        >
          {intl.formatMessage({ id: 'app.refresh' })}
        </Button>
      </Flex>

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

      {isDashboardLoading ? (
        <Flex justify="center" align="center" h="300px">
          <Spinner size="xl" />
        </Flex>
      ) : !hasSubscription && !activeCompany?.subscription ? (
        <Box textAlign="center" p={8} bg={cardBg} borderRadius="lg" boxShadow="md">
          <Icon as={FaInfoCircle} boxSize={12} color="blue.500" mb={4} />
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            {intl.formatMessage({ id: 'app.noActiveSubscription' })}
          </Text>
          <Text mb={6} maxW="lg" mx="auto">
            {intl.formatMessage({ id: 'app.noSubscriptionDescription' })}
          </Text>
          <Button colorScheme="blue" size="lg" onClick={() => navigate('/admin/dashboard/pricing')}>
            {intl.formatMessage({ id: 'app.viewPlans' })}
          </Button>
        </Box>
      ) : (
        <Box>
          {/* Trial Banner - Always show at the top if in trial */}
          {(subscription?.status === 'trialing' ||
            activeCompany?.subscription?.status === 'trialing') && (
            <Card
              borderLeftWidth="4px"
              borderLeftColor="green.500"
              overflow="hidden"
              position="relative"
              mb={6}
            >
              {/* Progress bar for trial */}
              <Box
                position="absolute"
                bottom={0}
                left={0}
                height="4px"
                bg="green.400"
                width={
                  getTrialProgressPercentage(subscription || activeCompany?.subscription) + '%'
                }
              />

              <CardBody p={4}>
                <Flex direction="column" gap={3}>
                  <Text fontSize="lg" fontWeight="bold" color="green.700">
                    {intl.formatMessage({ id: 'app.trialActive' }) || 'Prueba Activa'}
                  </Text>

                  <Flex align="center">
                    <Text color="gray.700" paddingRight={2}>
                      {intl.formatMessage({ id: 'app.trialPeriod' }) || 'Período de Prueba'}:
                    </Text>
                    <Text fontWeight="medium">
                      {formatDate(
                        subscription?.current_period_start ||
                          activeCompany?.subscription?.current_period_start
                      )}{' '}
                      -{' '}
                      {formatDate(
                        subscription?.trial_end || activeCompany?.subscription?.trial_end
                      )}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text color="gray.700" paddingRight={2}>
                      {intl.formatMessage({ id: 'app.daysRemaining' }) || 'Días restantes'}:
                    </Text>
                    <Text fontWeight="medium">
                      {getDaysRemaining(
                        subscription?.trial_end || activeCompany?.subscription?.trial_end
                      )}{' '}
                      {intl.formatMessage({ id: 'app.days' }) || 'días'}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text color="gray.700" paddingRight={2}>
                      {intl.formatMessage({ id: 'app.billingStartsOn' }) ||
                        'La facturación comienza el'}
                      :
                    </Text>
                    <Text fontWeight="medium">
                      {formatDate(
                        subscription?.trial_end || activeCompany?.subscription?.trial_end
                      )}
                    </Text>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          )}

          {/* Main Content Layout - Two Column Grid */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            <Box>
              {/* Left Column - Main Subscription Card */}
              <Card p={0} overflow="hidden" mb={6}>
                <CardHeader p={4} bg="blue.50" borderBottomWidth="1px" borderBottomColor="blue.100">
                  <Flex justify="space-between" align="center">
                    <Flex align="center">
                      <Icon as={FaChartBar} color="blue.500" mr={2} />
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {intl.formatMessage({ id: 'app.yourSubscription' })}
                      </Text>
                    </Flex>
                    <Badge
                      colorScheme={
                        subscription?.status === 'active' || subscription?.status === 'trialing'
                          ? 'green'
                          : subscription?.status === 'canceled' ||
                            subscription?.status === 'inactive'
                          ? 'red'
                          : 'gray'
                      }
                      py={1}
                      px={2}
                    >
                      {subscription?.status
                        ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
                        : 'Unknown'}
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody p={5}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <Box>
                      <Text color="gray.500" mb={1} fontSize="sm">
                        {intl.formatMessage({ id: 'app.plan' })}
                      </Text>
                      <Text fontWeight="medium" fontSize="md">
                        {subscription?.plan?.name || '-'}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" mb={1} fontSize="sm">
                        {intl.formatMessage({ id: 'app.billingPeriod' })}
                      </Text>
                      <Text fontWeight="medium" fontSize="md">
                        {subscription?.plan?.interval === 'monthly'
                          ? intl.formatMessage({ id: 'app.monthly' })
                          : intl.formatMessage({ id: 'app.yearly' })}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" mb={1} fontSize="sm">
                        {intl.formatMessage({ id: 'app.amount' })}
                      </Text>
                      <Text fontWeight="medium" fontSize="md">
                        ${subscription?.plan?.price || 0}/
                        {subscription?.plan?.interval === 'monthly'
                          ? intl.formatMessage({ id: 'app.month' })
                          : intl.formatMessage({ id: 'app.year' })}
                      </Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" mb={1} fontSize="sm">
                        {intl.formatMessage({ id: 'app.currentPeriod' })}
                      </Text>
                      <Text fontWeight="medium" fontSize="md">
                        {formatDate(subscription?.current_period_start)} -{' '}
                        {formatDate(subscription?.current_period_end)}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {subscription?.cancel_at_period_end ? (
                    <Box w="100%" mt={3}>
                      <Alert status="warning" borderRadius="md" mb={3}>
                        <AlertIcon />
                        <Text fontSize="sm">
                          {intl.formatMessage({ id: 'app.subscriptionWillCancel' })}{' '}
                          {formatDate(subscription?.current_period_end)}
                        </Text>
                      </Alert>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={handleReactivateSubscription}
                        width="full"
                      >
                        {intl.formatMessage({ id: 'app.reactivateSubscription' })}
                      </Button>
                    </Box>
                  ) : (
                    <Flex justifyContent="flex-end" mt={4} gap={3}>
                      <Button colorScheme="red" size="sm" onClick={handleCancelSubscription}>
                        {intl.formatMessage({ id: 'app.cancelSubscription' })}
                      </Button>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => navigate('/admin/dashboard/pricing')}
                      >
                        {intl.formatMessage({ id: 'app.changePlan' })}
                      </Button>
                    </Flex>
                  )}
                </CardBody>
              </Card>

              {/* Usage Statistics Card */}
              <Card mb={6}>
                <CardHeader>
                  <Flex align="center">
                    <Icon as={FaChartBar} mr={2} />
                    <Text fontSize="lg" fontWeight="bold" color={textColor}>
                      {intl.formatMessage({ id: 'app.usageStatistics' }) || 'Estadísticas de Uso'}
                    </Text>
                  </Flex>
                </CardHeader>
                <CardBody pt={2}>
                  <Stack spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Text color="gray.600">
                        {intl.formatMessage({ id: 'app.establishmentsUsed' }) ||
                          'Establecimientos Utilizados'}
                      </Text>
                      <Text fontWeight="medium">
                        {activeCompany?.establishment_count || 0}/
                        {subscription?.plan?.features?.max_establishments || 2}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text color="gray.600">
                        {intl.formatMessage({ id: 'app.parcelsUsed' }) || 'Parcelas Utilizadas'}
                      </Text>
                      <Text fontWeight="medium">
                        {activeCompany?.parcel_count || 0}/
                        {subscription?.plan?.features?.max_parcels || 8}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text color="gray.600">
                        {intl.formatMessage({ id: 'app.productionsUsed' }) ||
                          'Producciones Utilizadas'}
                      </Text>
                      <Text fontWeight="medium">
                        {subscription?.used_productions || 0}/
                        {subscription?.plan?.features?.max_productions_per_year || 8}
                      </Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text color="gray.600">
                        {intl.formatMessage({ id: 'app.storageUsed' }) ||
                          'Almacenamiento Utilizado'}
                      </Text>
                      <Text fontWeight="medium">
                        {subscription?.used_storage_gb || '0.000'}GB/
                        {subscription?.plan?.features?.storage_limit_gb || 51}GB
                      </Text>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>

              {/* Payment Methods Card - MOVED HERE FOR BETTER UX */}
              <Card mb={6}>
                <CardHeader>
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <Icon as={FaCreditCard} mr={2} />
                      <Text fontSize="lg" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.paymentMethods' })}
                      </Text>
                    </Flex>
                    <Button
                      size="sm"
                      leftIcon={<FaPlus />}
                      colorScheme="blue"
                      isLoading={isCreatingCheckoutSession}
                      onClick={handleAddPaymentMethod}
                    >
                      {intl.formatMessage({ id: 'app.addPaymentMethod' }) ||
                        'Añadir Método de Pago'}
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  {paymentMethods.length > 0 ? (
                    <Stack spacing={4}>
                      {paymentMethods.map((method, index) => (
                        <Flex
                          key={index}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          borderColor="gray.200"
                          bg="white"
                          justify="space-between"
                          align="center"
                          _hover={{ boxShadow: 'sm' }}
                        >
                          <Flex align="center">
                            <Box
                              w="40px"
                              h="40px"
                              borderRadius="md"
                              bg="gray.100"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              mr={3}
                            >
                              {method.card_brand === 'visa' ? (
                                <VisaIcon w="70%" h="70%" />
                              ) : method.card_brand === 'mastercard' ? (
                                <MastercardIcon w="70%" h="70%" />
                              ) : method.card_brand === 'paypal' ? (
                                <PayPalIcon w="70%" h="70%" />
                              ) : (
                                <Icon as={FaWallet} w="60%" h="60%" />
                              )}
                            </Box>
                            <Box>
                              <Text fontWeight="medium">
                                {`${
                                  method.card_brand.charAt(0).toUpperCase() +
                                  method.card_brand.slice(1)
                                }`}
                                {method.is_default && (
                                  <Badge ml={2} colorScheme="green" fontSize="xs">
                                    {intl.formatMessage({ id: 'app.default' }) || 'Default'}
                                  </Badge>
                                )}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                •••• {method.last_4} | {intl.formatMessage({ id: 'app.expires' })}:{' '}
                                {method.exp_month}/{method.exp_year}
                              </Text>
                            </Box>
                          </Flex>
                          <Flex>
                            {!method.is_default && (
                              <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                mr={1}
                                isDisabled={!subscription}
                                onClick={() => handleSetDefaultPaymentMethod(method.id)}
                              >
                                {intl.formatMessage({ id: 'app.setDefault' }) || 'Set Default'}
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              isDisabled={method.is_default || !subscription}
                              onClick={() => handleSetDefaultPaymentMethod(method.id)}
                            >
                              {intl.formatMessage({ id: 'app.remove' }) || 'Remove'}
                            </Button>
                          </Flex>
                        </Flex>
                      ))}
                    </Stack>
                  ) : (
                    <Box textAlign="center" py={6}>
                      <Icon as={FaCreditCard} boxSize={10} color="gray.300" mb={3} />
                      <Text color="gray.500" mb={2}>
                        {intl.formatMessage({ id: 'app.noPaymentMethods' }) ||
                          'No hay métodos de pago agregados'}
                      </Text>
                      <Text color="gray.500" mb={4} fontSize="sm">
                        {intl.formatMessage({ id: 'app.addPaymentMethodDescription' }) ||
                          'Añade un método de pago para gestionar tus suscripciones y complementos.'}
                      </Text>
                      <Button
                        colorScheme="blue"
                        leftIcon={<FaPlus />}
                        isLoading={isCreatingCheckoutSession}
                        onClick={handleAddPaymentMethod}
                      >
                        {intl.formatMessage({ id: 'app.addPaymentMethod' }) ||
                          'Añadir Método de Pago'}
                      </Button>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </Box>

            <Box>
              {/* Right Column - Addons and Invoices */}
              {/* Complementos Section */}
              {hasSubscription && (
                <Card mb={6}>
                  <CardHeader>
                    <Flex align="center" justify="space-between">
                      <Flex align="center">
                        <Icon as={FaPlus} mr={2} />
                        <Text fontSize="lg" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.addons' }) || 'Complementos'}
                        </Text>
                      </Flex>
                    </Flex>
                  </CardHeader>

                  <CardBody>
                    {/* Complementos actuales */}
                    <Text fontSize="md" fontWeight="bold" mb={3}>
                      {intl.formatMessage({ id: 'app.currentAddons' }) || 'Complementos actuales'}
                    </Text>

                    {subscription?.addons &&
                    ((Array.isArray(subscription.addons) && subscription.addons.length > 0) ||
                      (!Array.isArray(subscription.addons) &&
                        Object.keys(subscription.addons).length > 0)) ? (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                        {Array.isArray(subscription.addons)
                          ? subscription.addons.map((addonItem) => (
                              <Box
                                key={addonItem.id || addonItem.addon?.id || Math.random()}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                boxShadow="sm"
                                _hover={{ boxShadow: 'md' }}
                                bg="white"
                              >
                                <Flex justify="space-between" align="center" mb={2}>
                                  <Flex align="center">
                                    <Box mr={2}>
                                      <Icon as={FaPlusCircle} color="green.500" />
                                    </Box>
                                    <Text fontWeight="bold">
                                      {addonItem.addon?.name ||
                                        intl.formatMessage({ id: 'app.addon' })}
                                    </Text>
                                  </Flex>
                                  <Badge colorScheme="green" fontSize="md" p={1}>
                                    {formatPrice(
                                      addonItem.addon?.price || 0,
                                      addonItem.quantity || 1
                                    )}
                                  </Badge>
                                </Flex>
                                <Flex mt={2}>
                                  <Stack w="100%" spacing={1}>
                                    <Flex justify="space-between" fontSize="sm" color="gray.500">
                                      <Text>
                                        {intl.formatMessage({ id: 'app.quantity' }) || 'Cantidad'}:
                                      </Text>
                                      <Text fontWeight="medium">{addonItem.quantity || 1}</Text>
                                    </Flex>
                                    <Flex justify="space-between" fontSize="sm" color="gray.500">
                                      <Text>
                                        {intl.formatMessage({ id: 'app.unitPrice' }) ||
                                          'Precio unitario'}
                                        :
                                      </Text>
                                      <Text fontWeight="medium">
                                        {formatPrice(addonItem.addon?.price || 0)}
                                      </Text>
                                    </Flex>
                                  </Stack>
                                </Flex>
                              </Box>
                            ))
                          : Object.entries(subscription.addons).map(([key, addonItem]) => (
                              <Box
                                key={key}
                                p={4}
                                borderWidth="1px"
                                borderRadius="md"
                                boxShadow="sm"
                                _hover={{ boxShadow: 'md' }}
                                bg="white"
                              >
                                <Flex justify="space-between" align="center" mb={2}>
                                  <Flex align="center">
                                    <Box mr={2}>
                                      <Icon as={FaPlusCircle} color="green.500" />
                                    </Box>
                                    <Text fontWeight="bold">
                                      {addonItem.addon?.name ||
                                        intl.formatMessage({ id: 'app.addon' })}
                                    </Text>
                                  </Flex>
                                  <Badge colorScheme="green" fontSize="md" p={1}>
                                    {formatPrice(
                                      addonItem.addon?.price || 0,
                                      addonItem.quantity || 1
                                    )}
                                  </Badge>
                                </Flex>
                                <Flex mt={2}>
                                  <Stack w="100%" spacing={1}>
                                    <Flex justify="space-between" fontSize="sm" color="gray.500">
                                      <Text>
                                        {intl.formatMessage({ id: 'app.quantity' }) || 'Cantidad'}:
                                      </Text>
                                      <Text fontWeight="medium">{addonItem.quantity || 1}</Text>
                                    </Flex>
                                    <Flex justify="space-between" fontSize="sm" color="gray.500">
                                      <Text>
                                        {intl.formatMessage({ id: 'app.unitPrice' }) ||
                                          'Precio unitario'}
                                        :
                                      </Text>
                                      <Text fontWeight="medium">
                                        {formatPrice(addonItem.addon?.price || 0)}
                                      </Text>
                                    </Flex>
                                  </Stack>
                                </Flex>
                              </Box>
                            ))}
                      </SimpleGrid>
                    ) : (
                      <Box
                        p={4}
                        mb={6}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="gray.200"
                        bg="gray.50"
                      >
                        <Text color="gray.500" textAlign="center">
                          {intl.formatMessage({ id: 'app.noAddonsYet' }) ||
                            'No tienes complementos activos'}
                        </Text>
                      </Box>
                    )}

                    <Divider my={4} />

                    {/* Complementos disponibles */}
                    <Text fontSize="md" fontWeight="bold" mt={6} mb={3}>
                      {intl.formatMessage({ id: 'app.availableAddons' }) ||
                        'Complementos disponibles'}
                    </Text>

                    {validAddons.length > 0 ? (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {validAddons.map((addon) => (
                          <Box
                            key={addon.id}
                            p={4}
                            borderWidth="1px"
                            borderRadius="md"
                            boxShadow="sm"
                            _hover={{ boxShadow: 'md', borderColor: 'blue.300' }}
                            bg="white"
                            transition="all 0.2s"
                          >
                            <Flex justify="space-between" align="center" mb={3}>
                              <Flex align="center">
                                <Box mr={2}>
                                  <Icon as={FaPlusCircle} color="blue.500" />
                                </Box>
                                <Text fontWeight="bold">{addon.name}</Text>
                              </Flex>
                              <Badge colorScheme="blue">{formatPrice(addon.price)}</Badge>
                            </Flex>

                            <Text fontSize="sm" color="gray.600" mb={4}>
                              {addon.description ||
                                (addon.slug === 'extra-production'
                                  ? 'Add an additional production to your yearly limit'
                                  : addon.slug === 'extra-parcel'
                                  ? 'Add an additional parcel to your subscription'
                                  : 'Add an additional year of historical data storage')}
                            </Text>

                            <Flex justify="center">
                              <Button
                                colorScheme="blue"
                                size="sm"
                                width="85%"
                                variant="outline"
                                borderRadius="md"
                                onClick={() => handleOpenAddonModal(addon)}
                              >
                                {intl.formatMessage({ id: 'app.addAddonCapacity' }) ||
                                  'app.addAddonCapacity'}
                              </Button>
                            </Flex>
                          </Box>
                        ))}
                      </SimpleGrid>
                    ) : (
                      <Box
                        p={4}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="gray.200"
                        bg="gray.50"
                      >
                        <Text color="gray.500" textAlign="center">
                          {intl.formatMessage({ id: 'app.noAddonsAvailable' }) ||
                            'No hay complementos disponibles en este momento'}
                        </Text>
                      </Box>
                    )}
                  </CardBody>
                </Card>
              )}

              {/* Invoices Section */}
              {invoices.length > 0 && (
                <Card>
                  <CardHeader>
                    <Flex align="center" justify="space-between">
                      <Flex align="center">
                        <Icon as={FaFileInvoiceDollar} mr={2} />
                        <Text fontSize="lg" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.invoices' }) || 'Facturas'}
                        </Text>
                      </Flex>
                      {invoices.length > 3 && (
                        <Button
                          variant="link"
                          size="sm"
                          colorScheme="blue"
                          onClick={() => navigate('/admin/dashboard/account/invoices')}
                        >
                          {intl.formatMessage({ id: 'app.viewAll' }) || 'Ver todo'}
                        </Button>
                      )}
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Stack spacing={3}>
                      {invoices.slice(0, 4).map((invoice, index) => (
                        <Flex
                          key={index}
                          justify="space-between"
                          align="center"
                          py={2}
                          borderBottomWidth={index === invoices.slice(0, 4).length - 1 ? 0 : '1px'}
                          borderBottomColor="gray.200"
                        >
                          <Text fontWeight="medium" fontSize="sm">
                            {invoice.invoice_id ||
                              `${new Date(invoice.invoice_date)
                                .toISOString()
                                .split('T')[0]
                                .replace(/-/g, '-')}`}
                          </Text>
                          <Flex align="center">
                            <Text fontWeight="bold" mr={3}>
                              {formatPrice(invoice.amount)}
                            </Text>
                            <Button
                              size="sm"
                              variant="link"
                              colorScheme="blue"
                              onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                              isDisabled={!invoice.invoice_pdf}
                            >
                              <Icon as={FaInfoCircle} />
                            </Button>
                          </Flex>
                        </Flex>
                      ))}
                    </Stack>
                  </CardBody>
                </Card>
              )}

              {/* Blockchain Verification Add-On */}
              <Card mt={6}>
                <CardHeader>
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <Icon as={FaCreditCard} mr={2} color="green.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        Blockchain Verification
                      </Text>
                    </Flex>
                    <Badge
                      colorScheme={blockchainStatus?.blockchainSubscribed ? 'green' : 'gray'}
                      px={3}
                      py={1}
                    >
                      {blockchainStatus?.blockchainSubscribed ? 'Active' : 'Inactive'}
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text fontSize="md" mb={4} color="gray.600">
                    Add immutable blockchain verification to your sustainability claims. Carbon data
                    stored permanently on Polygon network with USDA compliance verification.
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                    <Box>
                      <Text fontWeight="medium" mb={1}>
                        Price
                      </Text>
                      <Text color="green.600" fontSize="lg" fontWeight="bold">
                        $5/month
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" mb={1}>
                        Status
                      </Text>
                      <Text>
                        {blockchainStatus?.blockchainSubscribed
                          ? 'Blockchain verification enabled'
                          : 'Not subscribed'}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {!blockchainStatus?.blockchainSubscribed ? (
                    <Button
                      colorScheme="green"
                      size="md"
                      isLoading={isSubscribingBlockchain}
                      onClick={handleSubscribeBlockchain}
                      isDisabled={!hasSubscription}
                    >
                      Add Blockchain Verification
                    </Button>
                  ) : (
                    <Box
                      p={3}
                      bg="green.50"
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor="green.200"
                    >
                      <Text color="green.700" fontSize="sm">
                        ✅ Blockchain verification is active! Your carbon data is being
                        automatically verified and stored on the blockchain.
                      </Text>
                    </Box>
                  )}

                  {!hasSubscription && (
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Requires an active subscription to enable blockchain verification
                    </Text>
                  )}
                </CardBody>
              </Card>

              {/* Payment Security Information Box */}
              <Box mt={5} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  <Icon as={FaInfoCircle} mr={1} />
                  {intl.formatMessage({ id: 'app.paymentSecurityNote' }) ||
                    'Payment information is securely stored and processed by Stripe.'}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {intl.formatMessage({ id: 'app.updateBillingAddress' }) ||
                    'You can update your billing address and other details in your payment settings.'}
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
      )}

      {/* Add-on Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedAddon
              ? intl.formatMessage(
                  { id: 'app.addAddonTitle' },
                  { name: selectedAddon.name || intl.formatMessage({ id: 'app.addon' }) }
                )
              : intl.formatMessage({ id: 'app.addAddon' })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedAddon ? (
              <>
                <Text mb={4}>
                  {selectedAddon.description || intl.formatMessage({ id: 'app.noDescription' })}
                </Text>
                <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" mb={4}>
                  <Text mb={2} fontWeight="bold">
                    {intl.formatMessage({ id: 'app.price' })}: {formatPrice(selectedAddon.price)}
                  </Text>
                  <Text mb={4} fontSize="sm" color="gray.600">
                    {intl.formatMessage({ id: 'app.addonBilledImmediately' })}
                  </Text>
                </Box>

                <Text mb={2} fontWeight="medium">
                  {intl.formatMessage({ id: 'app.selectQuantity' })}:
                </Text>
                <NumberInput
                  value={addonQuantity}
                  min={1}
                  max={100}
                  onChange={(value) => setAddonQuantity(parseInt(value) || 1)}
                  mb={4}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <Divider my={4} />

                <Flex justify="space-between" fontWeight="bold">
                  <Text>{intl.formatMessage({ id: 'app.total' })}:</Text>
                  <Text color="green.600">{formatPrice(selectedAddon.price, addonQuantity)}</Text>
                </Flex>
              </>
            ) : (
              <Text>
                {intl.formatMessage({ id: 'app.selectAddonFirst' }) ||
                  'Please select an add-on first'}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {intl.formatMessage({ id: 'app.cancel' })}
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddAddon}
              isLoading={isAddingAddon}
              isDisabled={!selectedAddon}
            >
              {intl.formatMessage({ id: 'app.addAddon' })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Billing;
