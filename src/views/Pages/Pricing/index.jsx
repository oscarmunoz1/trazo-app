import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
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
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  ButtonGroup,
  UnorderedList,
  ListItem
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
  FaExternalLinkAlt
} from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { loadStripe } from '@stripe/stripe-js';
import { useGetPlansQuery, useCreateCheckoutSessionMutation } from 'store/api/subscriptionApi';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

// Load Stripe outside of component to avoid recreating it on every render
const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

function Pricing({ inDashboard = false }) {
  const textColor = useColorModeValue('gray.700', 'white');
  const bgCardButton = useColorModeValue('white', '#151f31');
  const intl = useIntl();

  // Helper function to translate
  const t = (id) => intl.formatMessage({ id });

  const [activeInterval, setActiveInterval] = useState('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Get user and company directly from Redux state instead of useAuth
  const user = useSelector((state) => state.userState.user);
  const activeCompany = useSelector((state) => state.company.currentCompany);

  const toast = useToast();

  // Use RTK Query hooks
  const { data: plans = [], isLoading: loading, error, refetch } = useGetPlansQuery(activeInterval);
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const [addonQuantities, setAddonQuantities] = useState({
    extraProduction: 1,
    extraParcel: 1,
    extraStorage: 1
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
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newCompany = searchParams.get('new_company') === 'true';
    const companyIdParam = searchParams.get('company_id');

    if (newCompany && companyIdParam) {
      setNewCompanyFlow(true);
      setCompanyId(companyIdParam);

      // Show a notification that subscription is required
      toast({
        title: t('app.subscriptionRequired'),
        description: t('app.pleaseSelectPlan'),
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    }
  }, [location]);

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

    // Use provided company ID from URL or active company
    const targetCompanyId = companyId || activeCompany?.id;

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

    switch (featureKey) {
      case 'max_establishments':
        return `${value} ${value === 1 ? t('app.company') : t('app.company')}`;
      case 'max_parcels':
        return `${value} ${value === 1 ? t('app.parcel') : t('app.parcels')}`;
      case 'max_parcels_per_establishment':
        return `${value} ${t('app.parcels')} ${t('app.per')} ${t('app.establishment')}`;
      case 'max_productions_per_year':
        return `${value} ${t('app.productions')}/${t('app.year')}`;
      case 'monthly_scan_limit':
        return `${value.toLocaleString()} ${t('app.scans')}/${t('app.month')}`;
      case 'storage_limit_gb':
        return `${value}GB ${t('app.storage')}`;
      case 'support_response_time':
        return `${value}h ${t('app.supportResponse')}`;
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
      default:
        return FaCheckCircle;
    }
  };

  const handleAddAddon = (addonType, quantity) => {
    // Implementation of handleAddAddon function
  };

  return (
    <Box pt={inDashboard ? { base: '10px', md: '10px' } : { base: '130px', md: '80px' }}>
      {newCompanyFlow && (
        <Box
          mb={6}
          p={4}
          borderRadius="md"
          bg="blue.50"
          color="blue.700"
          textAlign="center"
          maxW="3xl"
          mx="auto">
          <Text fontSize="lg" fontWeight="bold">
            {t('app.companyCreatedSuccessfully')}
          </Text>
          <Text>{t('app.selectSubscriptionRequired')}</Text>
        </Box>
      )}

      <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden">
        <Box
          mb="24px"
          position="relative"
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent="center">
          <Text color={textColor} fontSize="5xl" fontWeight="bold" mb="16px" textAlign="center">
            {t('app.pricingPlans')}
          </Text>
        </Box>

        {/* Billing toggle */}
        <Flex justify="center" mb="40px">
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
              {activeInterval === 'yearly' && (
                <Badge
                  colorScheme="green"
                  position="absolute"
                  top="-20px"
                  right="-20px"
                  borderRadius="full"
                  px="2">
                  {t('app.save')} 20%
                </Badge>
              )}
            </Box>
            <Text fontWeight="500" color={textColor}>
              {t('app.yearly')}
            </Text>
          </Stack>
        </Flex>

        {loading ? (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} px={{ base: 4, md: 8 }}>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton height="30px" width="40%" mb={2} />
                  <Skeleton height="40px" width="60%" />
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    {Array(6)
                      .fill('')
                      .map((_, index) => (
                        <Flex key={index} align="center">
                          <Skeleton height="20px" width="20px" mr="10px" />
                          <Skeleton height="20px" width="70%" />
                        </Flex>
                      ))}
                  </Stack>
                </CardBody>
                <CardFooter>
                  <Skeleton height="40px" width="100%" />
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} px={{ base: 4, md: 8 }}>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                boxShadow="rgba(0, 0, 0, 0.1) 0px 4px 12px"
                _hover={{
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 8px 24px',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }}
                borderRadius="xl"
                overflow="hidden"
                position="relative">
                {/* Add trial badge */}
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
                  zIndex={1}>
                  {t('app.14DayTrial')}
                </Box>

                <CardHeader
                  borderTopRadius="20px"
                  bg={plan.name === 'Corporate' ? 'green.600' : 'blue.500'}
                  py={6}
                  textAlign="center">
                  <Box>
                    <Tag size="sm" bg="whiteAlpha.200" color="white">
                      {plan.name.toUpperCase()}
                    </Tag>
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

                    {/* Establishments */}
                    <Flex align="center">
                      <Icon
                        w="22px"
                        h="22px"
                        as={getFeatureIcon('max_parcels')}
                        mr="10px"
                        color="green.500"
                      />
                      <Text color={textColor} fontWeight="normal" fontSize="md">
                        {plan.name === 'Corporate'
                          ? `2 ${t('app.establishments')}`
                          : `1 ${t('app.establishment')}`}
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

                    {/* Establishment description */}
                    <Flex align="center">
                      <Icon
                        w="22px"
                        h="22px"
                        as={
                          plan.features?.establishment_full_description
                            ? getFeatureIcon('max_establishments')
                            : FaTimesCircle
                        }
                        mr="10px"
                        color={
                          plan.features?.establishment_full_description ? 'green.500' : 'red.500'
                        }
                      />
                      <Text
                        color={textColor}
                        fontWeight="normal"
                        fontSize="md"
                        textDecoration={
                          !plan.features?.establishment_full_description ? 'line-through' : 'none'
                        }>
                        {t('app.establishmentFullDescription')}
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

                    {/* Support */}
                    <Flex align="center">
                      <Icon
                        w="22px"
                        h="22px"
                        as={getFeatureIcon('support_response_time')}
                        mr="10px"
                        color="green.500"
                      />
                      <Text color={textColor} fontWeight="normal" fontSize="md">
                        {getFeatureDisplay(plan, 'support_response_time')}
                      </Text>
                    </Flex>
                  </Stack>
                </CardBody>

                {/* Join Button */}
                <CardFooter>
                  <Button
                    as={motion.button}
                    colorScheme={plan.name === 'Corporate' ? 'green' : 'blue'}
                    w="100%"
                    py={6}
                    onClick={() => handleSubscribe(plan.id)}
                    isLoading={checkoutLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    _hover={{
                      bgGradient:
                        plan.name === 'Corporate'
                          ? 'linear(to-r, green.500, teal.500)'
                          : 'linear(to-r, blue.500, cyan.500)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}>
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

        {/* Add-ons Section */}
        <Box mt={16} textAlign="center">
          <Text color={textColor} fontSize="2xl" fontWeight="bold" mb={8}>
            {t('app.additionalServices')}
          </Text>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} px={{ base: 4, md: 8 }}>
            {/* Extra Production Add-on */}
            <Card boxShadow="md" borderRadius="lg">
              <CardHeader pb={0}>
                <Flex direction="column" align="center">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    {t('app.extraProduction')}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={4} align="center">
                  <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                    ${15 * addonQuantities.extraProduction}
                  </Text>
                  <Text color="gray.500">{t('app.perProduction')}</Text>
                  <Text textAlign="center">{t('app.extraProductionDescription')}</Text>

                  <NumberInput
                    min={1}
                    max={10}
                    value={addonQuantities.extraProduction}
                    onChange={(valueString) =>
                      setAddonQuantities({
                        ...addonQuantities,
                        extraProduction: parseInt(valueString)
                      })
                    }>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </Stack>
              </CardBody>
              <CardFooter>
                <Button
                  colorScheme="blue"
                  isFullWidth
                  onClick={() =>
                    handleAddAddon('extraProduction', addonQuantities.extraProduction)
                  }>
                  {t('app.add')}
                </Button>
              </CardFooter>
            </Card>

            {/* Extra Parcel Add-on */}
            <Card boxShadow="md" borderRadius="lg">
              <CardHeader pb={0}>
                <Flex direction="column" align="center">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    {t('app.extraParcel')}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={4} align="center">
                  <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                    $20
                  </Text>
                  <Text color="gray.500">{t('app.perParcel')}</Text>
                  <Text textAlign="center">{t('app.extraParcelDescription')}</Text>
                </Stack>
              </CardBody>
              <CardFooter pt={0}>
                <Text fontSize="sm" color="gray.500" textAlign="center" w="100%">
                  {t('app.availableForSubscribers')}
                </Text>
              </CardFooter>
            </Card>

            {/* Extra Storage Add-on */}
            <Card boxShadow="md" borderRadius="lg">
              <CardHeader pb={0}>
                <Flex direction="column" align="center">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    {t('app.extraStorage')}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={4} align="center">
                  <Text fontSize="3xl" fontWeight="bold" color={textColor}>
                    $5
                  </Text>
                  <Text color="gray.500">{t('app.perMonth')}</Text>
                  <Text textAlign="center">{t('app.extraStorageDescription')}</Text>
                </Stack>
              </CardBody>
              <CardFooter pt={0}>
                <Text fontSize="sm" color="gray.500" textAlign="center" w="100%">
                  {t('app.availableForSubscribers')}
                </Text>
              </CardFooter>
            </Card>
          </SimpleGrid>
        </Box>

        {/* Enterprise Section */}
        <Box
          mt={16}
          bg={useColorModeValue('gray.50', 'gray.900')}
          borderRadius="lg"
          p={8}
          mx={{ base: 4, md: 8 }}>
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
                onClick={() => (window.location.href = '/contact')}>
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
                  mb={4}>
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
                        display="inline-block">
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
                        onClick={() => window.open('/support', '_blank')}>
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
            boxShadow="sm">
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
                onClick={() => (window.location.href = 'mailto:support@trazo.com')}>
                {t('app.emailUs')}
              </Button>
              <Button
                leftIcon={<FaComments />}
                variant="outline"
                onClick={() => setShowChatSupport(true)}>
                {t('app.liveChatSupport')}
              </Button>
            </ButtonGroup>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export default Pricing;
