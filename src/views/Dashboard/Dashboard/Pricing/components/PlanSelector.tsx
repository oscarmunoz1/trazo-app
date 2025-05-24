import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  Tag,
  useToast
} from '@chakra-ui/react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { Plan } from 'store/api/subscriptionApi';
import { motion } from 'framer-motion';
import stripeCheckoutService from 'services/StripeCheckoutService';

interface PlanSelectorProps {
  plans: Plan[];
  companyId?: string | number | null;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ plans, companyId }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bgCardButton = useColorModeValue('white', '#151f31');
  const intl = useIntl();
  const toast = useToast();

  // Helper function to translate
  const t = (id: string) => intl.formatMessage({ id });

  const [activeInterval, setActiveInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<Record<string, boolean>>({});

  // Initialize the checkout service
  React.useEffect(() => {
    stripeCheckoutService.init(intl);
  }, [intl]);

  // Handle plan subscription
  const handleSubscribe = async (planId: string) => {
    if (!companyId) {
      toast({
        title: t('app.error'),
        description: t('app.noCompanySelected'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    // Set loading state for this specific plan
    setCheckoutLoading((prev) => ({ ...prev, [planId]: true }));

    try {
      // Use the service to create a checkout session and get the URL
      const checkoutUrl = await stripeCheckoutService.createCheckoutSession({
        plan_id: planId,
        company_id: companyId.toString(),
        interval: activeInterval
      });

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Failed to get checkout URL');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: t('app.checkoutError'),
        description: t('app.pleaseTryAgain'),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setCheckoutLoading((prev) => ({ ...prev, [planId]: false }));
    }
  };

  // Helper to render feature status
  const getFeatureDisplay = (plan: Plan, featureKey: string) => {
    const feature = plan.features[featureKey as keyof typeof plan.features];

    if (!feature) return null;

    // Check if the feature has a numeric value (limit)
    if (typeof feature === 'number') {
      return (
        <Flex align="center">
          <Icon as={FaCheckCircle} color="green.500" mr={2} />
          <Text>{feature}</Text>
        </Flex>
      );
    }

    // Check if it's a boolean feature
    if (typeof feature === 'boolean') {
      return feature ? (
        <Flex align="center">
          <Icon as={FaCheckCircle} color="green.500" mr={2} />
          <Text>{t('app.included')}</Text>
        </Flex>
      ) : (
        <Flex align="center">
          <Icon as={FaTimesCircle} color="red.500" mr={2} />
          <Text>{t('app.notIncluded')}</Text>
        </Flex>
      );
    }

    // Default case for string values or other types
    return (
      <Flex align="center">
        <Icon as={FaCheckCircle} color="green.500" mr={2} />
        <Text>{String(feature)}</Text>
      </Flex>
    );
  };

  // Filter plans by selected interval
  const filteredPlans = plans.filter((plan) => plan.interval === activeInterval);

  return (
    <Box>
      <Flex justify="center" mb={8}>
        <Stack direction="row" spacing={4} align="center">
          <Text color={activeInterval === 'monthly' ? 'blue.500' : textColor}>
            {t('app.monthly')}
          </Text>
          <Switch
            isChecked={activeInterval === 'yearly'}
            onChange={() => setActiveInterval(activeInterval === 'monthly' ? 'yearly' : 'monthly')}
            colorScheme="blue"
            size="lg"
          />
          <Text color={activeInterval === 'yearly' ? 'blue.500' : textColor}>
            {t('app.yearly')}
            <Tag ml={2} colorScheme="green">
              {t('app.save20Percent')}
            </Tag>
          </Text>
        </Stack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
        {filteredPlans.map((plan) => (
          <motion.div key={plan.id} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card
              boxShadow="lg"
              borderWidth={plan.is_active ? '2px' : '1px'}
              borderColor={plan.is_active ? 'blue.500' : 'transparent'}
              position="relative"
              overflow="hidden"
            >
              {plan.is_active && (
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  bg="blue.500"
                  color="white"
                  px={3}
                  py={1}
                  borderBottomLeftRadius="md"
                >
                  {t('app.mostPopular')}
                </Box>
              )}
              <CardHeader pb={0}>
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  {plan.name}
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.500">
                  ${plan.price}
                  <Text as="span" fontSize="sm" color={textColor} fontWeight="normal">
                    /{activeInterval === 'monthly' ? t('app.month') : t('app.year')}
                  </Text>
                </Text>
                {plan.description && (
                  <Text color="gray.500" fontSize="sm" mt={2}>
                    {plan.description}
                  </Text>
                )}
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {Object.keys(plan.features).map((featureKey) => (
                    <Flex key={featureKey} justify="space-between" align="center">
                      <Text color={textColor}>{t(`app.feature.${featureKey}`)}</Text>
                      {getFeatureDisplay(plan, featureKey)}
                    </Flex>
                  ))}
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    w="100%"
                    h="50px"
                    mt={4}
                    onClick={() => handleSubscribe(plan.id.toString())}
                    isLoading={checkoutLoading[plan.id.toString()]}
                    loadingText={t('app.redirectingToCheckout')}
                  >
                    {t('app.subscribe')}
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlanSelector;
