import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Switch,
  Tag,
  Text,
  useColorModeValue,
  Spinner,
  useToast,
  Tooltip,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Skeleton,
  SkeletonText,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  ButtonGroup,
  UnorderedList,
  ListItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack
} from '@chakra-ui/react';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaMapMarkedAlt,
  FaLeaf,
  FaQrcode,
  FaDatabase,
  FaHeadset,
  FaExclamationTriangle,
  FaSearch,
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
  FaEnvelope,
  FaComments,
  FaExternalLinkAlt,
  FaShieldAlt,
  FaLink,
  FaCalculator,
  FaCogs,
  FaBook,
  FaChartBar,
  FaStar
} from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { loadStripe } from '@stripe/stripe-js';
import { useGetPlansQuery, useCreateCheckoutSessionMutation } from 'store/api/subscriptionApi';
import { useSubscribeBlockchainMutation, useGetAddonsQuery } from 'store/api/billingApi';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

// Load Stripe outside of component to avoid recreating it on every render
const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

function Pricing({ inDashboard = false, companyId: directCompanyId = null }) {
  const textColor = useColorModeValue('gray.700', 'white');
  const bgCardButton = useColorModeValue('white', '#151f31');
  const cardBg = useColorModeValue('white', 'gray.700');
  const intl = useIntl();

  // Add detection for new company context
  const [isNewCompany, setIsNewCompany] = React.useState(false);

  React.useEffect(() => {
    // Check if user just created a company (could be a URL param or localStorage flag)
    const urlParams = new URLSearchParams(window.location.search);
    const newCompanyFlag = urlParams.get('newCompany') || localStorage.getItem('newCompanyCreated');
    if (newCompanyFlag) {
      setIsNewCompany(true);
      localStorage.removeItem('newCompanyCreated'); // Clear the flag
    }
  }, []);

  const t = (id) => intl.formatMessage({ id });

  const [activeInterval, setActiveInterval] = useState('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isUpgradeFlow, setIsUpgradeFlow] = useState(false);
  const [upgradeResourceType, setUpgradeResourceType] = useState(null);

  // Get user and company directly from Redux state instead of useAuth
  const user = useSelector((state) => state.userState.user);
  const activeCompany = useSelector((state) => state.company.currentCompany);

  const toast = useToast();

  // Use RTK Query hooks
  const { data: plans = [], isLoading: loading, error, refetch } = useGetPlansQuery(activeInterval);
  const { data: addons = [], isLoading: addonsLoading } = useGetAddonsQuery();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [subscribeBlockchain] = useSubscribeBlockchainMutation();

  const [addonQuantities, setAddonQuantities] = useState({
    'extra-production': 1,
    'extra-parcel': 1,
    'extra-storage': 1,
    'blockchain-verification': 1
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [showChatSupport, setShowChatSupport] = useState(false);

  // Create a filtered FAQ list based on search query
  const faqs = [
    {
      question: 'app.canIChangeMyPlan',
      answer: 'app.changeSubscriptionAnswer'
    },
    {
      question: 'app.howDoesTheTrialWork',
      answer: 'app.trialWorkAnswer'
    },
    {
      question: 'app.howDoesTrialWork',
      answer: 'app.trialExplanation'
    },
    {
      question: 'app.whyCreditCardForTrial',
      answer: 'app.creditCardTrialExplanation'
    }
    // Add all other FAQs here
  ];

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;

    return faqs.filter(
      (faq) =>
        t(faq.question).toLowerCase().includes(searchQuery.toLowerCase()) ||
        t(faq.answer).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [faqs, searchQuery, t]);

  const location = useLocation();
  const navigate = useNavigate();
  const [newCompanyFlow, setNewCompanyFlow] = useState(false);
  const [urlCompanyId, setUrlCompanyId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newCompany = searchParams.get('new_company') === 'true';
    const companyIdParam = searchParams.get('company_id');
    const returnPath = searchParams.get('return');
    const resourceType = searchParams.get('resource');

    if (resourceType) {
      setUpgradeResourceType(resourceType);
    }

    if (returnPath === 'form') {
      setIsUpgradeFlow(true);
    }

    if (newCompany && companyIdParam) {
      setNewCompanyFlow(true);
      setUrlCompanyId(companyIdParam);
    }

    // Save the return path for after subscription
    if (returnPath) {
      localStorage.setItem('subscription_return_path', returnPath);
    }
  }, [location]);

  // Handle successful subscription completion
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');

    if (status === 'success') {
      // Get stored return path
      const returnPath = localStorage.getItem('subscription_return_path');
      localStorage.removeItem('subscription_return_path');

      toast({
        title: t('app.subscriptionUpgraded'),
        description: t('app.youCanNowAddMoreResources'),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Redirect back to form if specified
      if (returnPath === 'form') {
        const lastFormPath = localStorage.getItem('last_form_path');
        if (lastFormPath) {
          localStorage.removeItem('last_form_path');
          navigate(`${lastFormPath}?return=upgrade`);
        } else {
          navigate('/admin/dashboard');
        }
      }
    }
  }, [location.search, navigate, toast, t]);

  useEffect(() => {
    if (error) {
      toast({
        title: t('app.error'),
        description: t('app.errorFetchingPlans'),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
        render: () => (
          <Box p={3} bg="red.500" color="white" borderRadius="md">
            <Flex align="center">
              <Icon as={FaExclamationTriangle} mr={2} />
              <Box>
                <Text fontWeight="bold">{t('app.error')}</Text>
                <Text>{t('app.errorFetchingPlans')}</Text>
              </Box>
              <Button ml="auto" size="sm" onClick={refetch}>
                {t('app.retry')}
              </Button>
            </Flex>
          </Box>
        )
      });
    }
  }, [error, toast, t, refetch]);

  const handleSubscribe = async (planId) => {
    if (!user) {
      toast({
        title: t('app.notLoggedIn'),
        description: t('app.needLoginToSubscribe'),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      navigate('/auth/signin');
      return;
    }

    // Prioritize directly passed companyId prop, then URL param, then active company
    const targetCompanyId = directCompanyId || urlCompanyId || activeCompany?.id;

    if (!targetCompanyId) {
      toast({
        title: t('app.noCompanySelected'),
        description: t('app.createCompanyFirst'),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    try {
      setCheckoutLoading(true);

      // Create checkout session with trial parameters
      const response = await createCheckoutSession({
        plan_id: planId,
        company_id: targetCompanyId,
        interval: activeInterval,
        new_company: newCompanyFlow, // Pass this flag to the backend
        trial_days: 14 // Request a 14-day trial
      }).unwrap();

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: response.sessionId
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: t('app.error'),
        description: t('app.checkoutError'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Helper function to get feature display
  const getFeatureDisplay = (plan, featureKey) => {
    const features = plan.features || {};
    const value = features[featureKey];

    // Handle undefined values early
    if (value === undefined || value === null) {
      return '0';
    }

    switch (featureKey) {
      case 'max_establishments':
        return `${value || 0} ${
          (value || 0) === 1 ? t('app.establishment') : t('app.establishments')
        }`;
      case 'max_parcels':
        return `${value || 0} ${(value || 0) === 1 ? t('app.parcel') : t('app.parcels')}`;
      case 'max_parcels_per_establishment':
        return `${value || 0} ${t('app.parcels')} ${t('app.per')} ${t('app.establishment')}`;
      case 'max_productions_per_year':
        return `${value || 0} ${t('app.productions')}/${t('app.year')}`;
      case 'monthly_scan_limit':
        return `${(value || 0).toLocaleString()} ${t('app.scans')}/${t('app.month')}`;
      case 'storage_limit_gb':
        return `${value || 0}GB ${t('app.storage')}`;
      case 'support_response_time':
        return `${value || 0}h ${t('app.supportResponse')}`;
      case 'iot_automation_level':
        return `${value || 0}% ${t('app.iotAutomation')}`;
      case 'carbon_tracking':
        return value === 'manual'
          ? t('app.manualCarbonTracking')
          : t('app.automatedCarbonTracking');
      case 'educational_resources':
        return value
          ? t('app.educationalResourcesIncluded')
          : t('app.educationalResourcesNotIncluded');
      case 'custom_reporting':
        return value ? t('app.customReportingIncluded') : t('app.customReportingNotIncluded');
      case 'priority_support':
        return value ? t('app.prioritySupportIncluded') : t('app.prioritySupportNotIncluded');
      default:
        if (typeof value === 'boolean') {
          return value ? t('app.included') : t('app.notIncluded');
        }
        return value?.toString() || '';
    }
  };

  // Replace basic checkmark with feature-specific icons
  const getFeatureIcon = (featureKey) => {
    switch (featureKey) {
      case 'max_establishments':
        return FaBuilding;
      case 'max_parcels':
        return FaMapMarkedAlt;
      case 'max_productions_per_year':
        return FaLeaf;
      case 'monthly_scan_limit':
        return FaQrcode;
      case 'storage_limit_gb':
        return FaDatabase;
      case 'support_response_time':
        return FaHeadset;
      case 'iot_automation_level':
        return FaCogs;
      case 'carbon_tracking':
        return FaLeaf;
      case 'educational_resources':
        return FaBook;
      case 'custom_reporting':
        return FaChartBar;
      case 'priority_support':
        return FaStar;
      default:
        return FaCheckCircle;
    }
  };

  const handleAddAddon = async (addonType, quantity) => {
    if (!user) {
      toast({
        title: t('app.notLoggedIn'),
        description: t('app.needLoginToSubscribe'),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      navigate('/auth/signin');
      return;
    }

    // Prioritize directly passed companyId prop, then URL param, then active company
    const targetCompanyId = directCompanyId || urlCompanyId || activeCompany?.id;

    if (!targetCompanyId) {
      toast({
        title: t('app.noCompanySelected'),
        description: t('app.createCompanyFirst'),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    // Check if company has an active subscription
    if (!activeCompany?.subscription) {
      toast({
        title: t('app.subscriptionRequired'),
        description: t('app.needSubscriptionForAddons'),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    try {
      setCheckoutLoading(true);

      // Get the current location to return to after purchase
      const currentPath = window.location.pathname;
      const currentSearch = window.location.search;
      const returnUrl = currentPath + (currentSearch || '');

      // Create checkout session for the addon
      const response = await createCheckoutSession({
        addon_type: addonType,
        quantity: quantity,
        company_id: targetCompanyId,
        return_url: returnUrl
      }).unwrap();

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: response.sessionId
      });
    } catch (error) {
      console.error('Error creating addon checkout session:', error);
      toast({
        title: t('app.error'),
        description: t('app.checkoutError'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSubscribeBlockchain = async () => {
    if (!user) {
      toast({
        title: t('app.notLoggedIn'),
        description: t('app.needLoginToSubscribe'),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      navigate('/auth/signin');
      return;
    }

    if (!activeCompany?.subscription) {
      toast({
        title: t('app.subscriptionRequired'),
        description: 'You need an active subscription to add blockchain verification',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    try {
      setCheckoutLoading(true);

      // Call the blockchain subscription API
      const response = await subscribeBlockchain().unwrap();

      if (response.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.checkout_url;
      } else {
        throw new Error(response.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error subscribing to blockchain:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start blockchain subscription',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Filtered plans - only show upgrades from current plan
  const filteredPlans = useMemo(() => {
    if (!plans || !plans.length) return [];

    // First filter by active interval (monthly or yearly) and exclude Enterprise
    let intervalFiltered = plans.filter(
      (plan) => plan.interval === activeInterval && plan.name !== 'Enterprise'
    );

    // If user is in upgrade flow and has a current plan, only show higher tier plans
    if (isUpgradeFlow && activeCompany?.subscription_plan) {
      const currentPlanIndex = intervalFiltered.findIndex(
        (plan) => plan.id === activeCompany.subscription_plan.id
      );

      // If we found the current plan, only show plans with higher index (more expensive)
      if (currentPlanIndex >= 0) {
        return intervalFiltered.filter((_, index) => index > currentPlanIndex);
      }
    }

    // Otherwise show all plans for the selected interval (excluding Enterprise)
    return intervalFiltered;
  }, [plans, isUpgradeFlow, activeCompany, activeInterval]);

  // Helper function to determine recommended plan
  const getRecommendedPlan = (plans) => {
    // For new companies, recommend Standard plan
    if (isNewCompany) {
      return plans.find((plan) => plan.name === 'Standard');
    }
    // For existing users, recommend based on current plan or usage
    if (activeCompany?.subscription?.plan) {
      const currentPlan = activeCompany.subscription.plan.name;
      if (currentPlan === 'Basic') {
        return plans.find((plan) => plan.name === 'Standard');
      }
    }
    // Default recommendation
    return plans.find((plan) => plan.name === 'Standard');
  };

  return (
    <Box pt={inDashboard ? { base: '10px', md: '10px' } : { base: '130px', md: '80px' }}>
      {/* Hero Section */}
      <Box textAlign="center" py={{ base: 8, md: 12 }}>
        <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" color={textColor} mb={4}>
          {newCompanyFlow
            ? t('app.selectYourPlan')
            : inDashboard
            ? t('app.upgradeYourPlan')
            : t('app.pricingPlans')}
        </Text>
        <Text fontSize="xl" color="gray.500" maxW="2xl" mx="auto">
          {newCompanyFlow
            ? t('app.choosePlanToGetStarted')
            : inDashboard
            ? t('app.upgradeDescription')
            : t('app.pricingDescription')}
        </Text>

        {/* Welcome banner for new companies - Simplified and consolidated */}
        {newCompanyFlow && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            maxW="5xl"
            mx="auto"
            mt={6}
            py={6}
            borderRadius="xl"
            border="1px"
            borderColor="green.200"
            bg="green.50"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              🎉 {t('app.welcomeToTrazo')}
            </AlertTitle>
            <AlertDescription maxWidth="4xl">
              <VStack spacing={3} mt={2}>
                <Text fontWeight="medium">{t('app.yourCompanyIsReady')}</Text>

                {/* Consolidated next steps - more subtle */}
                <HStack
                  spacing={8}
                  fontSize="sm"
                  color="green.600"
                  flexWrap="wrap"
                  justify="center"
                >
                  <HStack>
                    <Text fontWeight="medium">1.</Text>
                    <Text>{t('app.step1StartTrial')}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">2.</Text>
                    <Text>{t('app.step2CreateEstablishment')}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium">3.</Text>
                    <Text>{t('app.step3StartTracking')}</Text>
                  </HStack>
                </HStack>

                <Text fontSize="sm" color="green.600" fontWeight="medium">
                  💡 {t('app.mostFarmsStartWith')} <strong>{t('app.standardPlan')}</strong> -{' '}
                  {t('app.allPlansInclude14DayTrial')}
                </Text>
              </VStack>
            </AlertDescription>
          </Alert>
        )}

        {/* Blockchain Verification Banner - Only show for non-new companies or make it subtle */}
        {!newCompanyFlow && (
          <Box mt={8} textAlign="center">
            <Alert
              status="info"
              variant="subtle"
              maxW="5xl"
              mx="auto"
              borderRadius="xl"
              border="2px"
              borderColor="green.200"
              bg="green.50"
            >
              <VStack spacing={4} w="full">
                <HStack spacing={3}>
                  <Icon as={FaShieldAlt} boxSize={8} color="green.600" />
                  <VStack spacing={1} align="start">
                    <Text fontSize="lg" fontWeight="bold" color="green.700">
                      🔗 {t('app.blockchainVerificationAvailable')}
                    </Text>
                    <Text fontSize="sm" color="green.600">
                      {t('app.addImmutableRecords')}
                    </Text>
                  </VStack>
                </HStack>
                <HStack spacing={6} fontSize="sm" color="green.600">
                  <HStack>
                    <Icon as={FaCheckCircle} />
                    <Text>{t('app.usdaVerified')}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaCheckCircle} />
                    <Text>{t('app.carbonCredits')}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaCheckCircle} />
                    <Text>{t('app.ecoFriendly')}</Text>
                  </HStack>
                </HStack>
              </VStack>
            </Alert>
          </Box>
        )}
      </Box>

      {/* Upgrade context banner */}
      {isUpgradeFlow && (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          py={4}
          mb={8}
          borderRadius="lg"
          bg={useColorModeValue('blue.50', 'blue.900')}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {t('app.chooseAPlanToUpgrade')}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {upgradeResourceType === 'establishment'
              ? t('app.upgradeToAddMoreEstablishments')
              : upgradeResourceType === 'parcel'
              ? t('app.upgradeToAddMoreParcels')
              : t('app.upgradeToAddMoreResources')}
          </AlertDescription>
        </Alert>
      )}

      <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden">
        {/* Billing toggle - make more prominent */}
        <Flex justify="center" mb="40px">
          <VStack spacing={3}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              {t('app.chooseYourBillingCycle')}
            </Text>
            <Stack direction="row" spacing={2} align="center">
              <Text fontWeight="500" color={textColor}>
                {t('app.monthly')}
              </Text>
              <Box position="relative">
                <Switch
                  size="lg"
                  colorScheme="green"
                  isChecked={activeInterval === 'yearly'}
                  onChange={() =>
                    setActiveInterval(activeInterval === 'monthly' ? 'yearly' : 'monthly')
                  }
                />
                {/* Show discount indicator for yearly */}
                {activeInterval === 'yearly' && (
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-20px"
                    bg="green.500"
                    color="white"
                    fontSize="xs"
                    borderRadius="full"
                    px={2}
                  >
                    -{t('app.twoMonthsFree')}
                  </Badge>
                )}
              </Box>
              <Text fontWeight="500" color={textColor}>
                {t('app.yearly')}
              </Text>
            </Stack>
          </VStack>
        </Flex>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} px={{ base: 4, md: 8 }}>
            {[...Array(3)].map((_, i) => (
              <Card key={i} borderRadius="xl" overflow="hidden">
                <Skeleton height="80px" />
                <SkeletonText mt="4" noOfLines={8} spacing="4" p={5} />
                <Skeleton height="40px" mt="2" />
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <>
            {isUpgradeFlow && filteredPlans.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Alert
                  status="info"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  py={6}
                  borderRadius="lg"
                >
                  <AlertIcon boxSize="40px" mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize="lg">
                    {t('app.alreadyOnHighestPlan')}
                  </AlertTitle>
                  <AlertDescription maxWidth="sm">
                    {t('app.contactSalesForCustomPlan')}
                  </AlertDescription>
                  <Button
                    mt={6}
                    colorScheme="blue"
                    leftIcon={<Icon as={FaEnvelope} />}
                    onClick={() => (window.location.href = 'mailto:sales@trazo.com')}
                  >
                    {t('app.contactSales')}
                  </Button>
                </Alert>
              </Box>
            ) : (
              <SimpleGrid
                columns={{
                  base: 1,
                  md: isUpgradeFlow && filteredPlans.length < 3 ? filteredPlans.length : 3
                }}
                spacing={10}
                px={{ base: 4, md: 8 }}
              >
                {filteredPlans.map((plan) => (
                  <Card
                    position="relative"
                    key={plan.id}
                    bg={cardBg}
                    boxShadow="lg"
                    borderRadius="20px"
                    overflow="hidden"
                    minH="500px"
                    border={newCompanyFlow && plan.name === 'Standard' ? '3px solid' : '1px solid'}
                    borderColor={
                      newCompanyFlow && plan.name === 'Standard'
                        ? 'blue.400'
                        : useColorModeValue('gray.200', 'gray.600')
                    }
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl'
                    }}
                    transition="all 0.3s ease"
                  >
                    {/* Recommended badge for Standard plan in new company flow */}
                    {/* 14-day trial badge - always in top right */}
                    <Box
                      position="absolute"
                      top="0"
                      right="0"
                      bg="green.500"
                      color="white"
                      px={3}
                      py={1}
                      borderBottomLeftRadius="md"
                      borderTopRightRadius="20px"
                      fontWeight="bold"
                      fontSize="xs"
                      zIndex={1}
                    >
                      {t('app.14DayTrial')}
                    </Box>

                    {/* Recommended badge - positioned below trial badge to avoid overlap */}
                    {newCompanyFlow && plan.name === 'Standard' && (
                      <Box
                        position="absolute"
                        top="32px"
                        right="0"
                        bg="orange.500"
                        color="white"
                        px={3}
                        py={1}
                        borderBottomLeftRadius="md"
                        fontWeight="bold"
                        fontSize="xs"
                        zIndex={2}
                      >
                        ⭐ {t('app.recommended')}
                      </Box>
                    )}

                    {/* Upgrade badge - repositioned */}
                    {isUpgradeFlow && (
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        bg="blue.500"
                        color="white"
                        px={3}
                        py={1}
                        borderBottomRightRadius="md"
                        borderTopLeftRadius="20px"
                        fontWeight="bold"
                        fontSize="xs"
                        zIndex={2}
                      >
                        {t('app.upgrade')}
                      </Box>
                    )}

                    <CardHeader
                      borderTopRadius="20px"
                      bg={plan.name === 'Corporate' ? 'green.600' : 'blue.500'}
                      py={6}
                      textAlign="center"
                      position="relative"
                    >
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color="whiteAlpha.800"
                          mb={2}
                          textTransform="uppercase"
                          letterSpacing="wide"
                        >
                          {plan.name}
                        </Text>
                        <Text mt={2} fontSize="5xl" fontWeight="bold" color="white">
                          ${plan.price}
                        </Text>
                        <Text color="whiteAlpha.800" fontSize="sm">
                          {activeInterval === 'monthly' ? t('app.perMonth') : t('app.perYear')}
                        </Text>
                      </Box>
                    </CardHeader>

                    {/* Features */}
                    <CardBody>
                      {/* Add trial info */}
                      <Box mb={4} p={2} bg="green.50" borderRadius="md">
                        <Text fontSize="sm" color="green.700">
                          <Icon as={FaCheckCircle} mr={2} />
                          {t('app.freeTrial14Days')}
                        </Text>
                      </Box>

                      <Stack spacing={4}>
                        {/* Core Features */}
                        {/* Establishments */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('max_establishments')}
                            mr="10px"
                            color="green.500"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {getFeatureDisplay(plan, 'max_establishments')}
                          </Text>
                        </Flex>

                        {/* Parcels */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('max_parcels')}
                            mr="10px"
                            color="green.500"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {plan.name === 'Basic'
                              ? `1 ${t('app.parcel')}`
                              : plan.name === 'Standard'
                              ? `2 ${t('app.parcels')}`
                              : `4 ${t('app.parcels')} ${t('app.per')} ${t('app.establishment')}`}
                          </Text>
                        </Flex>

                        {/* Productions */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('max_productions_per_year')}
                            mr="10px"
                            color="green.500"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {getFeatureDisplay(plan, 'max_productions_per_year')}
                          </Text>
                        </Flex>

                        {/* IoT Automation Level - NEW */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('iot_automation_level')}
                            mr="10px"
                            color="blue.500"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {getFeatureDisplay(plan, 'iot_automation_level')}
                          </Text>
                        </Flex>

                        {/* Carbon Tracking - NEW */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('carbon_tracking')}
                            mr="10px"
                            color="green.600"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {getFeatureDisplay(plan, 'carbon_tracking')}
                          </Text>
                        </Flex>

                        {/* Scans */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('monthly_scan_limit')}
                            mr="10px"
                            color="green.500"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {getFeatureDisplay(plan, 'monthly_scan_limit')}
                          </Text>
                        </Flex>

                        {/* Storage */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('storage_limit_gb')}
                            mr="10px"
                            color="green.500"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {getFeatureDisplay(plan, 'storage_limit_gb')}
                          </Text>
                        </Flex>

                        {/* Support Response Time */}
                        <Flex align="center">
                          <Icon
                            w="22px"
                            h="22px"
                            as={getFeatureIcon('support_response_time')}
                            mr="10px"
                            color="purple.500"
                          />
                          <Text color={textColor} fontWeight="normal" fontSize="md">
                            {getFeatureDisplay(plan, 'support_response_time')}
                          </Text>
                        </Flex>

                        {/* Educational Resources - Show if available */}
                        {plan.features?.educational_resources && (
                          <Flex align="center">
                            <Icon
                              w="22px"
                              h="22px"
                              as={getFeatureIcon('educational_resources')}
                              mr="10px"
                              color="orange.500"
                            />
                            <Text color={textColor} fontWeight="normal" fontSize="md">
                              {getFeatureDisplay(plan, 'educational_resources')}
                            </Text>
                          </Flex>
                        )}

                        {/* Custom Reporting - Show if available */}
                        {plan.features?.custom_reporting && (
                          <Flex align="center">
                            <Icon
                              w="22px"
                              h="22px"
                              as={getFeatureIcon('custom_reporting')}
                              mr="10px"
                              color="cyan.500"
                            />
                            <Text color={textColor} fontWeight="normal" fontSize="md">
                              {getFeatureDisplay(plan, 'custom_reporting')}
                            </Text>
                          </Flex>
                        )}

                        {/* Priority Support - Show if available */}
                        {plan.features?.priority_support && (
                          <Flex align="center">
                            <Icon
                              w="22px"
                              h="22px"
                              as={getFeatureIcon('priority_support')}
                              mr="10px"
                              color="yellow.500"
                            />
                            <Text color={textColor} fontWeight="normal" fontSize="md">
                              {getFeatureDisplay(plan, 'priority_support')}
                            </Text>
                          </Flex>
                        )}
                      </Stack>
                    </CardBody>

                    {/* Join Button */}
                    <CardFooter>
                      <Button
                        as={motion.button}
                        colorScheme={plan.name === 'Corporate' ? 'green' : 'blue'}
                        w="100%"
                        h="60px"
                        px={6}
                        onClick={() => handleSubscribe(plan.id)}
                        isLoading={checkoutLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        fontSize="md"
                        fontWeight="semibold"
                        borderRadius="lg"
                        _hover={{
                          bgGradient:
                            plan.name === 'Corporate'
                              ? 'linear(to-r, green.500, teal.500)'
                              : 'linear(to-r, blue.500, cyan.500)',
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg'
                        }}
                      >
                        {t('app.startFreeTrial')}
                      </Button>
                      <Text fontSize="xs" mt={2} textAlign="center" color="gray.500">
                        {t('app.creditCardRequired')}
                      </Text>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </>
        )}

        {/* Add-ons Section */}
        <Box mt={16} textAlign="center">
          <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={8}>
            {t('app.additionalServices')}
          </Text>

          {/* Simple note for new companies */}
          {newCompanyFlow && (
            <Text fontSize="sm" color="gray.600" mb={6} maxW="2xl" mx="auto">
              {t('app.addonsAvailableAfterSubscription')}
            </Text>
          )}

          {addonsLoading ? (
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} px={{ base: 4, md: 8 }} mt={8}>
              {[...Array(4)].map((_, i) => (
                <Card key={i} boxShadow="md" borderRadius="lg">
                  <Skeleton height="250px" />
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid
              columns={{ base: 1, md: addons.length }}
              spacing={8}
              px={{ base: 4, md: 8 }}
              mt={8}
            >
              {addons
                .filter((addon) => addon.is_active)
                .map((addon) => (
                  <Card
                    key={addon.id}
                    boxShadow="lg"
                    borderRadius="xl"
                    border={
                      addon.slug === 'blockchain-verification' && !newCompanyFlow
                        ? '2px solid'
                        : '1px solid'
                    }
                    borderColor={
                      addon.slug === 'blockchain-verification' && !newCompanyFlow
                        ? 'green.400'
                        : 'gray.200'
                    }
                    position="relative"
                    bg={cardBg}
                    overflow="hidden"
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'xl',
                      borderColor:
                        addon.slug === 'blockchain-verification' ? 'green.500' : 'blue.300'
                    }}
                    transition="all 0.3s ease"
                  >
                    {/* Special badge for blockchain - only for non-new companies */}
                    {addon.slug === 'blockchain-verification' && !newCompanyFlow && (
                      <Box
                        position="absolute"
                        top="0"
                        right="0"
                        bg="green.500"
                        color="white"
                        px={3}
                        py={1}
                        borderBottomLeftRadius="md"
                        fontWeight="bold"
                        fontSize="xs"
                        zIndex={1}
                      >
                        🔗 Premium
                      </Box>
                    )}

                    <CardHeader pb={2} pt={6}>
                      <VStack spacing={2}>
                        <Text fontSize="xl" fontWeight="bold" color={textColor} textAlign="center">
                          {addon.name}
                        </Text>
                        <HStack>
                          <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                            ${(addon.price * (addonQuantities[addon.slug] || 1)).toFixed(2)}
                          </Text>
                          <Text color="gray.500" fontSize="sm">
                            {addon.slug === 'blockchain-verification'
                              ? t('app.perMonth')
                              : addon.slug.includes('production')
                              ? t('app.perProduction')
                              : addon.slug.includes('parcel')
                              ? t('app.perParcel')
                              : t('app.perMonth')}
                          </Text>
                        </HStack>
                      </VStack>
                    </CardHeader>

                    <CardBody pt={2}>
                      <VStack spacing={4} align="stretch">
                        <Text textAlign="center" fontSize="sm" color="gray.600" minH="40px">
                          {addon.description}
                        </Text>

                        {/* Special features for blockchain with better styling */}
                        {addon.slug === 'blockchain-verification' && (
                          <Box
                            bg={useColorModeValue('green.50', 'green.900')}
                            p={3}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="green.200"
                          >
                            <VStack spacing={2} fontSize="sm">
                              <HStack>
                                <Icon as={FaShieldAlt} color="green.600" />
                                <Text color="green.700" fontWeight="medium">
                                  {t('app.usdaVerified')}
                                </Text>
                              </HStack>
                              <HStack>
                                <Icon as={FaLeaf} color="green.600" />
                                <Text color="green.700" fontWeight="medium">
                                  {t('app.carbonCredits')}
                                </Text>
                              </HStack>
                              <HStack>
                                <Icon as={FaLink} color="green.600" />
                                <Text color="green.700" fontWeight="medium">
                                  {t('app.immutableRecords')}
                                </Text>
                              </HStack>
                            </VStack>
                          </Box>
                        )}

                        {/* Quantity selector for non-blockchain add-ons with better styling */}
                        {addon.slug !== 'blockchain-verification' && (
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>
                              {t('app.quantity')}:
                            </Text>
                            <NumberInput
                              min={1}
                              max={10}
                              value={addonQuantities[addon.slug] || 1}
                              onChange={(valueString) =>
                                setAddonQuantities({
                                  ...addonQuantities,
                                  [addon.slug]: parseInt(valueString) || 1
                                })
                              }
                              size="sm"
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Box>
                        )}

                        <Button
                          colorScheme={addon.slug === 'blockchain-verification' ? 'green' : 'blue'}
                          isFullWidth
                          isLoading={checkoutLoading}
                          onClick={() =>
                            addon.slug === 'blockchain-verification'
                              ? handleSubscribeBlockchain()
                              : handleAddAddon(addon.slug, addonQuantities[addon.slug] || 1)
                          }
                          isDisabled={!activeCompany?.subscription}
                          size="md"
                          fontWeight="semibold"
                        >
                          {addon.slug === 'blockchain-verification'
                            ? '🔗 Add Blockchain'
                            : t('app.add')}
                        </Button>

                        {!activeCompany?.subscription && (
                          <Text
                            fontSize="xs"
                            color="orange.500"
                            textAlign="center"
                            fontStyle="italic"
                          >
                            {t('app.availableForSubscribers')}
                          </Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Enterprise Section */}
        <Box
          mt={16}
          bg={useColorModeValue('gray.50', 'gray.900')}
          borderRadius="lg"
          p={8}
          mx={{ base: 4, md: 8 }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={4}>
                {t('app.enterprisePlan')}
              </Text>
              <Text color="gray.500" mb={4}>
                {t('app.enterpriseDescription')}
              </Text>
              <Text mb={2}>
                <Icon as={FaCheckCircle} color="green.500" mr={2} />
                {t('app.unlimitedEstablishments')}
              </Text>
              <Text mb={2}>
                <Icon as={FaCheckCircle} color="green.500" mr={2} />
                {t('app.unlimitedParcels')}
              </Text>
              <Text mb={2}>
                <Icon as={FaCheckCircle} color="green.500" mr={2} />
                {t('app.unlimitedProductions')}
              </Text>
              <Text mb={2}>
                <Icon as={FaCheckCircle} color="green.500" mr={2} />
                {t('app.whiteLabel')}
              </Text>
              <Text mb={2}>
                <Icon as={FaCheckCircle} color="green.500" mr={2} />
                {t('app.apiAccess')}
              </Text>
              <Text mb={4}>
                <Icon as={FaCheckCircle} color="green.500" mr={2} />
                {t('app.dedicatedSupport')}
              </Text>
            </Box>
            <Flex direction="column" justify="center" align="center">
              <Text fontSize="5xl" fontWeight="bold" color={textColor} mb={4}>
                {t('app.customPricing')}
              </Text>
              <Button
                colorScheme="purple"
                size="lg"
                mb={4}
                onClick={() => (window.location.href = '/contact')}
              >
                {t('app.contactUs')}
              </Button>
              <Text fontSize="sm" color="gray.500">
                {t('app.startingAt')} $499/{t('app.month')}
              </Text>
            </Flex>
          </SimpleGrid>
        </Box>

        {/* FAQ Section */}
        <Box mt={16} px={{ base: 4, md: 8 }}>
          <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={8} textAlign="center">
            {t('app.frequentlyAskedQuestions')}
          </Text>

          {/* Search component for FAQs */}
          <Flex mb={6} justifyContent="center">
            <InputGroup maxW="md">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder={t('app.searchFaqs')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                borderRadius="full"
                boxShadow="sm"
              />
            </InputGroup>
          </Flex>

          {filteredFaqs.length > 0 ? (
            <Accordion allowMultiple width="100%">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  mb={4}
                >
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      {t(faq.question)}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Text color="gray.600">{t(faq.answer)}</Text>

                    {/* Add conditional content based on the FAQ */}
                    {faq.question === 'app.whatPaymentMethodsAccepted' && (
                      <Flex mt={3} wrap="wrap" gap={2}>
                        <Icon as={FaCreditCard} boxSize={6} color="gray.700" />
                        <Icon as={FaPaypal} boxSize={6} color="blue.500" />
                        <Icon as={FaApplePay} boxSize={6} color="gray.800" />
                        <Icon as={FaGooglePay} boxSize={6} color="green.500" />
                      </Flex>
                    )}

                    {(faq.question === 'app.dataSecurityQuestion' ||
                      faq.question === 'app.refundPolicyQuestion') && (
                      <Link
                        color="blue.500"
                        href={
                          faq.question === 'app.dataSecurityQuestion' ? '/privacy-policy' : '/terms'
                        }
                        isExternal
                        mt={2}
                        display="inline-block"
                      >
                        {t(
                          faq.question === 'app.dataSecurityQuestion'
                            ? 'app.viewPrivacyPolicy'
                            : 'app.viewTerms'
                        )}
                        <Icon as={FaExternalLinkAlt} mx="2px" />
                      </Link>
                    )}

                    {faq.question === 'app.supportAvailabilityQuestion' && (
                      <Button
                        leftIcon={<FaHeadset />}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        mt={3}
                        onClick={() => window.open('/support', '_blank')}
                      >
                        {t('app.contactSupport')}
                      </Button>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Box textAlign="center" py={8} color="gray.500">
              <Icon as={FaSearch} boxSize={12} mb={4} />
              <Text fontSize="lg">{t('app.noFaqsFound')}</Text>
              <Text>{t('app.tryDifferentSearch')}</Text>
            </Box>
          )}

          {/* Contact section below FAQs */}
          <Flex
            direction="column"
            align="center"
            mt={10}
            bg={useColorModeValue('gray.50', 'gray.800')}
            p={8}
            borderRadius="xl"
            boxShadow="sm"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              {t('app.stillHaveQuestions')}
            </Text>
            <Text textAlign="center" mb={6} maxW="2xl">
              {t('app.reachOutDescription')}
            </Text>
            <ButtonGroup>
              <Button
                leftIcon={<FaEnvelope />}
                colorScheme="blue"
                onClick={() => (window.location.href = 'mailto:support@trazo.com')}
              >
                {t('app.emailUs')}
              </Button>
              <Button
                leftIcon={<FaComments />}
                variant="outline"
                onClick={() => setShowChatSupport(true)}
              >
                {t('app.liveChatSupport')}
              </Button>
            </ButtonGroup>
          </Flex>
        </Box>

        {/* Quick Value Calculator */}
        <Box
          mt={16}
          bg={useColorModeValue('blue.50', 'blue.900')}
          borderRadius="xl"
          p={8}
          mx={{ base: 4, md: 8 }}
        >
          <VStack spacing={6}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
              💰 {t('app.calculateYourSavings')}
            </Text>
            <Text textAlign="center" color="gray.600" maxW="2xl">
              {t('app.seeHowMuchTrazoSaves')}
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <Box bg="white" p={6} borderRadius="lg" textAlign="center" boxShadow="sm">
                <Text fontSize="3xl" fontWeight="bold" color="green.500">
                  $2,400
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Average annual savings
                </Text>
                <Text fontSize="xs" color="gray.500">
                  on compliance documentation
                </Text>
              </Box>
              <Box bg="white" p={6} borderRadius="lg" textAlign="center" boxShadow="sm">
                <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                  15 hrs
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Time saved per month
                </Text>
                <Text fontSize="xs" color="gray.500">
                  on manual tracking
                </Text>
              </Box>
              <Box bg="white" p={6} borderRadius="lg" textAlign="center" boxShadow="sm">
                <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                  98%
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Accuracy improvement
                </Text>
                <Text fontSize="xs" color="gray.500">
                  in carbon tracking
                </Text>
              </Box>
            </SimpleGrid>

            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => setActiveInterval('yearly')}
              leftIcon={<Icon as={FaCalculator} />}
            >
              {t('app.startFreeTrial')}
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default Pricing;
