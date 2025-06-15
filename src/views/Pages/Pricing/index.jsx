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
  VStack,
  Container,
  Heading,
  Divider
} from '@chakra-ui/react';
import {
  FaCheck,
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
  FaStar,
  FaRocket,
  FaCrown,
  FaIndustry,
  FaGift
} from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { loadStripe } from '@stripe/stripe-js';
import { useGetPlansQuery, useCreateCheckoutSessionMutation } from 'store/api/subscriptionApi';
import { useSubscribeBlockchainMutation, useGetAddonsQuery } from 'store/api/billingApi';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

// Import Trazo Design System
import {
  StandardPage,
  StandardCard,
  StandardButton,
  StandardAlert,
  StandardSection
} from 'components/Design';

// Load Stripe outside of component to avoid recreating it on every render
const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

function Pricing({ inDashboard = false, companyId: directCompanyId = null }) {
  const textColor = useColorModeValue('gray.700', 'white');
  const intl = useIntl();

  // Early check to prevent rendering during Stripe success flow
  const searchParams = new URLSearchParams(window.location.search);
  const isStripeSuccessFlow =
    searchParams.get('session_id') && searchParams.get('success') === 'true';
  const preventPricingPage = localStorage.getItem('prevent_pricing_page') === 'true';
  const skipPricingRender = localStorage.getItem('skip_pricing_render') === 'true';

  // If we're in a Stripe success flow or should prevent pricing page, don't render
  if (isStripeSuccessFlow || preventPricingPage || skipPricingRender) {
    console.log('Pricing page: Skipping render due to Stripe success flow');
    return null;
  }

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

  // Use RTK Query hooks with cache busting
  const {
    data: plans = [],
    isLoading: loading,
    error,
    refetch
  } = useGetPlansQuery(activeInterval, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true
  });
  const { data: addons = [], isLoading: addonsLoading } = useGetAddonsQuery();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [subscribeBlockchain] = useSubscribeBlockchainMutation();

  const [addonQuantities, setAddonQuantities] = useState({
    'extra-production': 1,
    'extra-parcel': 1,
    'extra-storage': 1,
    'blockchain-verification': 1
  });

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
    const planSubscribed = searchParams.get('plan_subscribed');

    // Only handle success if we're actually on the pricing page (not coming from Stripe redirect)
    if (status === 'success' && !searchParams.get('session_id')) {
      toast({
        title: t('app.subscriptionSuccessful'),
        description: t('app.subscriptionSuccessfulDescription'),
        status: 'success',
        duration: 8000,
        isClosable: true
      });

      // Show blockchain add-on suggestion after successful subscription
      if (planSubscribed === 'true') {
        setTimeout(() => {
          toast({
            title: '🔗 ¿Quieres añadir Verificación Blockchain?',
            description:
              'Ahora puedes añadir verificación blockchain por solo $5/mes. Desplázate hacia abajo para verla.',
            status: 'info',
            duration: 10000,
            isClosable: true,
            position: 'top'
          });
        }, 3000);
      }

      // Handle return path
      const returnPath = localStorage.getItem('subscription_return_path');
      if (returnPath) {
        localStorage.removeItem('subscription_return_path');
        if (returnPath === 'form') {
          navigate('/admin/dashboard');
        }
      }

      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location, toast, navigate, t]);

  // Get company ID for subscription
  const getCompanyId = () => {
    if (directCompanyId) return directCompanyId;
    if (urlCompanyId) return urlCompanyId;
    if (activeCompany && typeof activeCompany === 'object' && 'id' in activeCompany) {
      return activeCompany.id;
    }
    return null;
  };

  // Filter and sort plans properly
  const displayPlans = useMemo(() => {
    if (!plans || plans.length === 0) return [];

    // console.log('Raw plans data:', plans); // Debug log (disabled for production)

    // Filter by interval
    let intervalFiltered = plans.filter((plan) => plan.interval === activeInterval);

    // Remove duplicates by name, preferring plans with proper slugs and higher prices
    const uniquePlans = intervalFiltered.reduce((acc, plan) => {
      const existingPlan = acc.find((p) => p.name === plan.name);

      if (!existingPlan) {
        // No existing plan with this name, add it
        acc.push(plan);
      } else {
        // Plan with same name exists, keep the better one
        const currentPrice =
          typeof plan.price === 'number' ? plan.price : parseFloat(plan.price) || 0;
        const existingPrice =
          typeof existingPlan.price === 'number'
            ? existingPlan.price
            : parseFloat(existingPlan.price) || 0;

        // Prefer plans with proper slugs (containing interval) and higher prices
        const hasProperSlug = plan.slug?.includes(plan.interval);
        const existingHasProperSlug = existingPlan.slug?.includes(existingPlan.interval);

        if (hasProperSlug && !existingHasProperSlug) {
          // Replace with plan that has proper slug
          const index = acc.findIndex((p) => p.name === plan.name);
          acc[index] = plan;
        } else if (hasProperSlug === existingHasProperSlug && currentPrice > existingPrice) {
          // Both have same slug quality, prefer higher price (newer plan)
          const index = acc.findIndex((p) => p.name === plan.name);
          acc[index] = plan;
        }
      }
      return acc;
    }, []);

    // Define the correct plan order
    const planOrder = ['basic', 'standard', 'corporate', 'enterprise'];

    // Sort by the defined order
    const sorted = uniquePlans.sort((a, b) => {
      const aIndex = planOrder.findIndex((order) => a.name.toLowerCase().includes(order));
      const bIndex = planOrder.findIndex((order) => b.name.toLowerCase().includes(order));

      // If both plans are found in the order, sort by index
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }

      // If only one is found, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      // If neither is found, sort by price
      return a.price - b.price;
    });

    // Limit to 4 plans maximum
    const limitedPlans = sorted.slice(0, 4);

    // console.log('Filtered and sorted plans:', limitedPlans); // Debug log (disabled for production)

    // If in upgrade flow, filter to show only higher tier plans
    if (isUpgradeFlow && activeCompany?.subscription?.plan_name) {
      const currentPlanName = activeCompany.subscription.plan_name.toLowerCase();
      const currentIndex = planOrder.findIndex((plan) => currentPlanName.includes(plan));

      if (currentIndex !== -1) {
        return limitedPlans.filter((plan) => {
          const planIndex = planOrder.findIndex((p) => plan.name.toLowerCase().includes(p));
          return planIndex > currentIndex;
        });
      }
    }

    return limitedPlans;
  }, [plans, activeInterval, isUpgradeFlow, activeCompany]);

  // Enhanced blockchain subscription with plan integration
  const handleSubscribeBlockchain = async () => {
    const companyId = getCompanyId();
    if (!companyId) {
      toast({
        title: 'Error',
        description: 'Se requiere una empresa para continuar',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setCheckoutLoading(true);

    try {
      console.log('Creating blockchain subscription for company:', companyId);

      const result = await subscribeBlockchain().unwrap();

      console.log('Blockchain subscription result:', result);

      // Handle different response formats
      let sessionId = null;
      let checkoutUrl = null;

      if (result.sessionId || result.session_id) {
        sessionId = result.sessionId || result.session_id;
      } else if (result.checkout_url) {
        checkoutUrl = result.checkout_url;
      } else if (result.url) {
        checkoutUrl = result.url;
      }

      if (checkoutUrl) {
        // Direct redirect to URL
        window.location.href = checkoutUrl;
      } else if (sessionId) {
        // Use Stripe's redirectToCheckout
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error('Invalid response format: missing sessionId or checkout_url');
      }
    } catch (error) {
      console.error('Blockchain subscription error:', error);

      // Enhanced error handling
      let errorMessage = 'Ocurrió un error al procesar la suscripción blockchain';

      if (error.data?.error) {
        errorMessage = error.data.error;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Check if the error is due to missing subscription
      if (errorMessage.includes('subscription') || errorMessage.includes('plan')) {
        toast({
          title: 'Suscripción requerida',
          description: 'Necesitas seleccionar un plan primero para añadir verificación blockchain.',
          status: 'warning',
          duration: 7000,
          isClosable: true
        });
      } else {
        toast({
          title: 'Error en suscripción blockchain',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  const getRecommendedPlan = (plans) => {
    // For new companies, recommend Standard plan
    if (newCompanyFlow) {
      return plans.find((plan) => plan.name.toLowerCase().includes('standard')) || plans[1];
    }
    // For existing companies, recommend Corporate
    return plans.find((plan) => plan.name.toLowerCase().includes('corporate')) || plans[2];
  };

  const getPlanIcon = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return FaLeaf;
    if (name.includes('standard')) return FaRocket;
    if (name.includes('corporate')) return FaCrown;
    if (name.includes('enterprise')) return FaIndustry;
    return FaLeaf;
  };

  const getPlanColor = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return 'green';
    if (name.includes('standard')) return 'blue';
    if (name.includes('corporate')) return 'purple';
    if (name.includes('enterprise')) return 'orange';
    return 'green';
  };

  const handleSubscribe = async (planId) => {
    const companyId = getCompanyId();
    if (!companyId) {
      toast({
        title: t('app.error'),
        description: t('app.companyIdRequired'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setCheckoutLoading(true);

    try {
      console.log('Creating checkout session with:', {
        plan_id: planId,
        company_id: companyId,
        success_url: `${window.location.origin}/admin/pricing?status=success&plan_subscribed=true`,
        cancel_url: window.location.href
      });

      const result = await createCheckoutSession({
        plan_id: planId,
        company_id: companyId,
        success_url: `${window.location.origin}/admin/pricing?status=success&plan_subscribed=true`,
        cancel_url: window.location.href
      }).unwrap();

      console.log('Checkout session result:', result);

      // Handle different response formats from different APIs
      let sessionId = null;
      let checkoutUrl = null;

      if (result.sessionId) {
        // subscriptionApi format
        sessionId = result.sessionId;
      } else if (result.session_id) {
        // billingApi format
        sessionId = result.session_id;
      } else if (result.url) {
        // Direct URL format
        checkoutUrl = result.url;
      }

      const stripe = await stripePromise;

      if (checkoutUrl) {
        // Direct redirect to URL
        window.location.href = checkoutUrl;
      } else if (sessionId) {
        // Use Stripe's redirectToCheckout
        const { error } = await stripe.redirectToCheckout({
          sessionId: sessionId
        });

        if (error) {
          throw new Error(error.message);
        }
      } else {
        throw new Error('Invalid response format: missing sessionId or url');
      }
    } catch (error) {
      console.error('Subscription error:', error);

      // Enhanced error handling
      let errorMessage = error.message || t('app.subscriptionErrorDescription');

      if (error.data?.error) {
        errorMessage = error.data.error;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }

      toast({
        title: t('app.subscriptionError'),
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <StandardPage
      title={newCompanyFlow || isNewCompany ? '¡Bienvenido a Trazo!' : 'Selecciona Tu Plan'}
      description={
        newCompanyFlow || isNewCompany
          ? 'Elige el plan perfecto para comenzar con tus operaciones agrícolas'
          : 'Actualiza tu plan para desbloquear más funcionalidades'
      }
    >
      {/* Welcome Header for New Companies */}
      {(newCompanyFlow || isNewCompany) && (
        <StandardSection>
          <VStack spacing={6} py={8}>
            <Box textAlign="center">
              <Heading as="h2" size="xl" color="green.600" mb={4}>
                🎉 ¡Empresa creada exitosamente!
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto" lineHeight="1.6">
                Tu empresa{' '}
                <Text as="span" fontWeight="bold" color="green.600">
                  {activeCompany?.name || 'nueva empresa'}
                </Text>{' '}
                está lista. Ahora selecciona el plan perfecto para comenzar a rastrear tu huella de
                carbono y optimizar tus operaciones agrícolas.
              </Text>
            </Box>
            <Badge colorScheme="green" fontSize="md" px={4} py={2} borderRadius="full">
              ✨ Paso 2 de 3: Selecciona tu plan
            </Badge>
          </VStack>
        </StandardSection>
      )}

      {/* Upgrade Context Banner */}
      {isUpgradeFlow && (
        <StandardAlert
          status="info"
          title="Actualiza tu plan"
          description={
            upgradeResourceType === 'establishment'
              ? 'Necesitas más establecimientos para continuar'
              : upgradeResourceType === 'parcel'
              ? 'Necesitas más parcelas para continuar'
              : 'Actualiza tu plan para acceder a más recursos'
          }
        />
      )}

      {/* Plans Section */}
      <StandardSection
        title="Planes de Suscripción"
        description="Diseñados específicamente para productores agrícolas"
        className="plans-section"
      >
        {/* Interval Toggle */}
        <VStack spacing={8} w="full">
          <VStack spacing={4}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Elige tu ciclo de facturación
            </Text>
            <HStack spacing={1} bg="gray.100" p={1} borderRadius="lg">
              <StandardButton
                variant={activeInterval === 'monthly' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveInterval('monthly')}
                borderRadius="md"
                px={6}
              >
                Mensual
              </StandardButton>
              <StandardButton
                variant={activeInterval === 'yearly' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setActiveInterval('yearly')}
                borderRadius="md"
                px={6}
              >
                <HStack spacing={2}>
                  <Text>Anual</Text>
                  <Badge colorScheme="green" fontSize="xs" px={2} py={1} borderRadius="full">
                    Ahorra 10%
                  </Badge>
                </HStack>
              </StandardButton>
            </HStack>
          </VStack>

          {/* Plans Grid */}
          {loading ? (
            <VStack spacing={4} py={12}>
              <Spinner size="xl" color="green.500" />
              <Text color="gray.500">Cargando planes...</Text>
              <StandardButton
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                isLoading={loading}
              >
                Actualizar Precios
              </StandardButton>
            </VStack>
          ) : displayPlans.length === 0 ? (
            <StandardAlert
              status="info"
              title="Ya tienes el plan más alto"
              description="Contacta a nuestro equipo de ventas para opciones empresariales personalizadas."
            />
          ) : (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: Math.min(displayPlans.length, 4) }}
              spacing={6}
              w="full"
              justifyItems="center"
              maxW="1400px"
              mx="auto"
            >
              {displayPlans.map((plan) => {
                const isRecommended = plan.id === getRecommendedPlan(displayPlans)?.id;
                const planIcon = getPlanIcon(plan.name);
                const planColor = getPlanColor(plan.name);

                return (
                  <motion.div
                    key={plan.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{ width: '100%', maxWidth: '320px' }}
                  >
                    <StandardCard
                      variant={isRecommended ? 'elevated' : 'outline'}
                      borderColor={isRecommended ? `${planColor}.200` : 'gray.200'}
                      borderWidth={isRecommended ? '2px' : '1px'}
                      bg={isRecommended ? `${planColor}.50` : 'white'}
                      position="relative"
                      overflow="hidden"
                      h="full"
                      display="flex"
                      flexDirection="column"
                    >
                      {/* Recommended Badge */}
                      {isRecommended && (
                        <Badge
                          position="absolute"
                          top={4}
                          right={4}
                          colorScheme={planColor}
                          variant="solid"
                          fontSize="xs"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontWeight="bold"
                          zIndex={2}
                        >
                          ⭐ RECOMENDADO
                        </Badge>
                      )}

                      <CardHeader pb={4} pt={6}>
                        <VStack spacing={4} align="center">
                          {/* Plan Icon */}
                          <Box
                            p={3}
                            bg={`${planColor}.100`}
                            borderRadius="full"
                            border="2px solid"
                            borderColor={`${planColor}.200`}
                          >
                            <Icon as={planIcon} boxSize={8} color={`${planColor}.600`} />
                          </Box>

                          {/* Plan Name & Description */}
                          <VStack spacing={2} textAlign="center">
                            <Heading as="h3" size="lg" color="gray.800" fontWeight="bold">
                              {plan.name}
                            </Heading>
                            <Text
                              color="gray.600"
                              fontSize="sm"
                              textAlign="center"
                              minH="50px"
                              px={2}
                              lineHeight="1.5"
                              display="flex"
                              alignItems="center"
                            >
                              {plan.description}
                            </Text>
                          </VStack>

                          {/* Pricing */}
                          <VStack spacing={2}>
                            <HStack align="baseline" justify="center">
                              <Text fontSize="3xl" fontWeight="bold" color={`${planColor}.600`}>
                                $
                                {(() => {
                                  const price =
                                    typeof plan.price === 'number'
                                      ? plan.price
                                      : parseFloat(plan.price) || 0;

                                  // console.log(`Plan ${plan.name} price:`, price, 'Type:', typeof plan.price, 'Raw:', plan.price); // Debug disabled

                                  return price.toFixed(2);
                                })()}
                              </Text>
                              <VStack spacing={0} align="start">
                                <Text color="gray.500" fontSize="sm" fontWeight="medium">
                                  /{activeInterval === 'monthly' ? 'mes' : 'año'}
                                </Text>
                                {activeInterval === 'yearly' && (
                                  <Text fontSize="xs" color="green.600" fontWeight="medium">
                                    Ahorra 10%
                                  </Text>
                                )}
                              </VStack>
                            </HStack>
                            {activeInterval === 'yearly' && (
                              <Text fontSize="sm" color="gray.500">
                                $
                                {(() => {
                                  const price =
                                    typeof plan.price === 'number'
                                      ? plan.price
                                      : parseFloat(plan.price) || 0;
                                  return (price / 12).toFixed(0);
                                })()}
                                /mes facturado anualmente
                              </Text>
                            )}
                          </VStack>
                        </VStack>
                      </CardHeader>

                      <CardBody py={4} flex="1">
                        <VStack spacing={3} align="stretch" h="full">
                          <Box textAlign="center" mb={2}>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color="gray.700"
                              textTransform="uppercase"
                              letterSpacing="wide"
                            >
                              Características incluidas
                            </Text>
                            <Box w="40px" h="1px" bg={`${planColor}.300`} mx="auto" mt={2} />
                          </Box>

                          {/* Core Features */}
                          {plan.features?.max_establishments && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaBuilding} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                {plan.features.max_establishments === -1
                                  ? 'Establecimientos ilimitados'
                                  : `${plan.features.max_establishments} establecimiento${
                                      plan.features.max_establishments !== 1 ? 's' : ''
                                    }`}
                              </Text>
                            </HStack>
                          )}

                          {(plan.features?.max_parcels ||
                            plan.features?.max_parcels_per_establishment) && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaMapMarkedAlt} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                {plan.features.max_parcels_per_establishment
                                  ? plan.features.max_parcels_per_establishment === -1
                                    ? 'Parcelas ilimitadas por establecimiento'
                                    : `${plan.features.max_parcels_per_establishment} parcela${
                                        plan.features.max_parcels_per_establishment !== 1 ? 's' : ''
                                      } por establecimiento`
                                  : plan.features.max_parcels === -1
                                  ? 'Parcelas ilimitadas'
                                  : `${plan.features.max_parcels} parcela${
                                      plan.features.max_parcels !== 1 ? 's' : ''
                                    }`}
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.max_productions_per_year && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaLeaf} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                {plan.features.max_productions_per_year === -1
                                  ? 'Producciones ilimitadas por año'
                                  : `${plan.features.max_productions_per_year} producción${
                                      plan.features.max_productions_per_year !== 1 ? 'es' : ''
                                    } por año`}
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.monthly_scan_limit && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaQrcode} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                {plan.features.monthly_scan_limit === -1
                                  ? 'Escaneos QR ilimitados'
                                  : `${plan.features.monthly_scan_limit.toLocaleString()} escaneos QR/mes`}
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.storage_limit_gb && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaDatabase} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                {plan.features.storage_limit_gb === -1
                                  ? 'Almacenamiento ilimitado'
                                  : `${plan.features.storage_limit_gb} GB almacenamiento`}
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.support_response_time && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaHeadset} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Soporte en {plan.features.support_response_time}h
                              </Text>
                            </HStack>
                          )}

                          {/* Carbon & Tracking Features */}
                          {plan.features?.carbon_tracking && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaLeaf} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                {plan.features.carbon_tracking === 'automated'
                                  ? 'Seguimiento automático de carbono'
                                  : plan.features.carbon_tracking === 'manual'
                                  ? 'Seguimiento manual de carbono'
                                  : 'Seguimiento de carbono'}
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.blockchain_eligible && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaShieldAlt} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Elegible para blockchain
                              </Text>
                            </HStack>
                          )}

                          {/* Advanced Features */}
                          {plan.features?.educational_resources && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaBook} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Recursos educativos
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.custom_reporting && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaChartBar} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Reportes personalizados
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.priority_support && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaStar} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Soporte prioritario
                              </Text>
                            </HStack>
                          )}

                          {/* Enterprise Features */}
                          {plan.features?.api_access && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaCogs} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Acceso completo a API
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.white_label && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaCrown} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Solución marca blanca
                              </Text>
                            </HStack>
                          )}

                          {plan.features?.dedicated_support && (
                            <HStack spacing={2} align="center">
                              <Icon as={FaHeadset} color={`${planColor}.500`} boxSize={4} />
                              <Text fontSize="xs" color="gray.700" flex={1} fontWeight="medium">
                                Soporte dedicado
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                      </CardBody>

                      <CardFooter pt={4} pb={6}>
                        <VStack spacing={3} w="full">
                          <StandardButton
                            variant={isRecommended ? 'primary' : 'outline'}
                            size="md"
                            onClick={() => handleSubscribe(plan.id)}
                            isLoading={checkoutLoading}
                            loadingText="Procesando..."
                            leftIcon={<Icon as={FaCreditCard} />}
                            w="full"
                            h="10"
                            fontSize="sm"
                            fontWeight="bold"
                            colorScheme={planColor}
                            _hover={{
                              transform: 'translateY(-1px)',
                              boxShadow: 'md'
                            }}
                          >
                            {newCompanyFlow || isNewCompany
                              ? 'Comenzar Prueba Gratuita'
                              : 'Seleccionar Plan'}
                          </StandardButton>

                          {plan.features?.trial_with_card_days && (
                            <HStack spacing={1} justify="center">
                              <Icon as={FaGift} color="green.500" boxSize={3} />
                              <Text fontSize="xs" color="gray.500" textAlign="center">
                                Prueba gratuita de {plan.features.trial_with_card_days} días
                                incluida
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                      </CardFooter>
                    </StandardCard>
                  </motion.div>
                );
              })}
            </SimpleGrid>
          )}
        </VStack>
      </StandardSection>

      {/* Compact Blockchain Add-on Section */}
      <StandardSection
        title="Verificación Blockchain"
        description="Añade verificación inmutable de datos de carbono"
      >
        <Box maxW="4xl" mx="auto">
          <StandardCard variant="outline" borderColor="green.200" bg="green.50">
            <CardBody p={4}>
              <VStack spacing={4}>
                {/* Compact Header */}
                <HStack spacing={3} w="full" align="center" justify="space-between">
                  <HStack spacing={3} flex={1}>
                    <Box p={2} bg="green.100" borderRadius="full">
                      <Icon as={FaShieldAlt} boxSize={6} color="green.600" />
                    </Box>

                    <VStack align="start" spacing={1} flex={1}>
                      <Heading as="h4" size="sm" color="gray.800">
                        Verificación Blockchain
                      </Heading>
                      <Text color="gray.600" fontSize="xs">
                        Registros inmutables de carbono, verificación USDA, y acceso a mercados de
                        créditos
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing={0} align="center" minW="60px">
                    <Text fontSize="xl" fontWeight="bold" color="green.600">
                      $5
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      /mes
                    </Text>
                  </VStack>
                </HStack>

                {/* Compact Benefits */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} w="full">
                  <HStack
                    spacing={2}
                    p={2}
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="green.100"
                  >
                    <Icon as={FaCheckCircle} color="green.500" boxSize={4} />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="xs" fontWeight="bold" color="gray.700">
                        Verificación USDA
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Cumplimiento automático
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack
                    spacing={2}
                    p={2}
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="green.100"
                  >
                    <Icon as={FaCheckCircle} color="green.500" boxSize={4} />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="xs" fontWeight="bold" color="gray.700">
                        Créditos de Carbono
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Acceso a mercados
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack
                    spacing={2}
                    p={2}
                    bg="white"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="green.100"
                  >
                    <Icon as={FaCheckCircle} color="green.500" boxSize={4} />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="xs" fontWeight="bold" color="gray.700">
                        Registros Inmutables
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Blockchain transparente
                      </Text>
                    </VStack>
                  </HStack>
                </SimpleGrid>

                {/* Action Section */}
                <VStack spacing={3} w="full">
                  {activeCompany?.subscription ? (
                    <VStack spacing={2} w="full">
                      <Text fontSize="xs" color="green.600" textAlign="center" fontWeight="medium">
                        ✅ ¡Perfecto! Ya tienes un plan activo
                      </Text>
                      <HStack spacing={2} justify="center">
                        <StandardButton
                          variant="primary"
                          size="sm"
                          onClick={handleSubscribeBlockchain}
                          isLoading={checkoutLoading}
                          loadingText="Procesando..."
                          leftIcon={<Icon as={FaShieldAlt} />}
                          colorScheme="green"
                        >
                          Añadir Blockchain ($5/mes)
                        </StandardButton>
                        <StandardButton
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/admin/dashboard')}
                          leftIcon={<Icon as={FaRocket} />}
                        >
                          Ir al Dashboard
                        </StandardButton>
                      </HStack>
                    </VStack>
                  ) : (
                    <VStack spacing={2} w="full">
                      <Text fontSize="xs" color="blue.600" textAlign="center" fontWeight="medium">
                        💡 Selecciona un plan primero, luego añade verificación blockchain
                      </Text>
                      <Text fontSize="xs" color="gray.500" textAlign="center" maxW="sm">
                        Después de suscribirte a cualquier plan, podrás añadir verificación
                        blockchain por solo $5/mes adicionales
                      </Text>
                      <StandardButton
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .querySelector('.plans-section')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                        leftIcon={<Icon as={FaRocket} />}
                        colorScheme="blue"
                      >
                        Ver Planes
                      </StandardButton>
                    </VStack>
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </StandardCard>
        </Box>
      </StandardSection>

      {/* Benefits Section */}
      <StandardSection
        title="¿Por qué elegir Trazo?"
        description="Diseñado específicamente para productores agrícolas"
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <StandardCard variant="flat">
            <CardBody textAlign="center">
              <VStack spacing={4}>
                <Icon as={FaLeaf} boxSize={12} color="green.500" />
                <Heading as="h4" size="md" color="gray.700">
                  Enfoque Agrícola
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Herramientas diseñadas específicamente para productores de cítricos, almendras,
                  soja y maíz
                </Text>
              </VStack>
            </CardBody>
          </StandardCard>

          <StandardCard variant="flat">
            <CardBody textAlign="center">
              <VStack spacing={4}>
                <Icon as={FaQrcode} boxSize={12} color="blue.500" />
                <Heading as="h4" size="md" color="gray.700">
                  Trazabilidad Total
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Códigos QR para cada producto, permitiendo a los consumidores ver el origen
                  completo
                </Text>
              </VStack>
            </CardBody>
          </StandardCard>

          <StandardCard variant="flat">
            <CardBody textAlign="center">
              <VStack spacing={4}>
                <Icon as={FaChartBar} boxSize={12} color="purple.500" />
                <Heading as="h4" size="md" color="gray.700">
                  Análisis de Carbono
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Seguimiento automático de huella de carbono con benchmarks específicos por cultivo
                </Text>
              </VStack>
            </CardBody>
          </StandardCard>
        </SimpleGrid>
      </StandardSection>

      {/* FAQ Section */}
      <StandardSection
        title="Preguntas Frecuentes"
        description="Respuestas a las dudas más comunes"
      >
        <Accordion allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                ¿Puedo cambiar mi plan en cualquier momento?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} color="gray.600">
              Sí, puedes actualizar o cambiar tu plan en cualquier momento desde tu panel de
              control. Los cambios se aplicarán en tu próximo ciclo de facturación.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                ¿Cómo funciona la prueba gratuita de 14 días?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} color="gray.600">
              Todos los planes incluyen 14 días de prueba gratuita con acceso completo a todas las
              funciones. No se te cobrará hasta que termine el período de prueba.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left" fontWeight="medium">
                ¿Qué incluye la verificación blockchain?
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} color="gray.600">
              La verificación blockchain proporciona registros inmutables de tus datos de carbono,
              verificación automática contra estándares USDA, y acceso a mercados de créditos de
              carbono.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </StandardSection>
    </StandardPage>
  );
}

export default Pricing;
