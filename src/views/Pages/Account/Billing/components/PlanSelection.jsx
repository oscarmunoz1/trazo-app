import React from 'react';
import {
  SimpleGrid,
  Box,
  Button,
  Text,
  Flex,
  Stack,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  Badge,
  Icon,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { FaRegLightbulb } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useCreateCheckoutSessionMutation } from 'store/api/subscriptionApi';

const PlanSelection = ({ plans, activeCompanyId }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightColor = useColorModeValue('blue.50', 'blue.800');

  // Use the createCheckoutSession mutation from RTK Query
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();

  // Function to handle subscription checkout
  const handleSubscribe = async (planId, interval) => {
    try {
      // Create a checkout session
      const response = await createCheckoutSession({
        plan_id: planId,
        company_id: activeCompanyId,
        interval: interval
      }).unwrap();

      // Redirect to Stripe checkout
      if (response && response.sessionId) {
        window.location.href = `https://checkout.stripe.com/pay/${response.sessionId}`;
      } else {
        console.error('Invalid response from checkout session:', response);
        toast({
          title: intl.formatMessage({ id: 'app.error' }),
          description: intl.formatMessage({ id: 'app.errorCreatingCheckout' }),
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }),
        description: error.data?.error || intl.formatMessage({ id: 'app.errorCreatingCheckout' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  if (!plans || plans.length === 0) {
    return (
      <Box textAlign="center" p={6}>
        <Text>{intl.formatMessage({ id: 'app.noOptions' })}</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: plans.length > 2 ? 3 : plans.length }} spacing={6} py={6}>
      {plans.map((plan) => {
        const features = plan.features || {};
        const isPopular = plan.slug.includes('standard');

        return (
          <Box
            key={plan.id}
            borderWidth="1px"
            borderColor={isPopular ? 'blue.500' : borderColor}
            borderRadius="lg"
            overflow="hidden"
            bg={cardBg}
            position="relative"
            boxShadow={isPopular ? 'md' : 'sm'}
            transform={isPopular ? 'scale(1.03)' : 'scale(1)'}
            transition="transform 0.2s"
            _hover={{ boxShadow: 'lg', transform: isPopular ? 'scale(1.05)' : 'scale(1.03)' }}>
            {isPopular && (
              <Badge
                position="absolute"
                top={0}
                right={0}
                mt={2}
                mr={2}
                colorScheme="blue"
                borderRadius="full"
                px={3}
                py={1}>
                Popular
              </Badge>
            )}

            <Box p={6} bg={isPopular ? highlightColor : 'transparent'}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                {plan.name}
              </Text>
              <Text mb={6} color="gray.500" fontSize="sm">
                {plan.description}
              </Text>

              <Text fontSize="3xl" fontWeight="extrabold" color={textColor}>
                ${plan.price}
                <Text as="span" fontSize="md" fontWeight="medium" color="gray.500">
                  /{' '}
                  {intl.formatMessage({
                    id: plan.interval === 'monthly' ? 'app.month' : 'app.year'
                  })}
                </Text>
              </Text>

              <Button
                mt={6}
                w="full"
                colorScheme={isPopular ? 'blue' : 'gray'}
                variant={isPopular ? 'solid' : 'outline'}
                onClick={() => handleSubscribe(plan.id, plan.interval)}
                isLoading={isLoading}>
                {intl.formatMessage({ id: 'app.buyNow' })}
              </Button>
            </Box>

            <Box p={6}>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  {features.max_establishments || 0}{' '}
                  {intl.formatMessage({ id: 'app.establishments' })}
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  {features.max_parcels || 0} {intl.formatMessage({ id: 'app.parcels' })}
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  {features.max_productions_per_year || 0}{' '}
                  {intl.formatMessage({ id: 'app.productions' })} /{' '}
                  {intl.formatMessage({ id: 'app.year' })}
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  {features.monthly_scan_limit || 0} {intl.formatMessage({ id: 'app.scans' })} /{' '}
                  {intl.formatMessage({ id: 'app.month' })}
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckIcon} color="green.500" />
                  {features.storage_limit_gb || 0} GB {intl.formatMessage({ id: 'app.storage' })}
                </ListItem>
                <ListItem>
                  <ListIcon
                    as={features.establishment_full_description ? CheckIcon : CloseIcon}
                    color={features.establishment_full_description ? 'green.500' : 'red.500'}
                  />
                  {intl.formatMessage({ id: 'app.establishmentFullDescription' })}
                </ListItem>
              </List>

              {(plan.slug.includes('basic') || plan.slug.includes('free')) && (
                <Flex mt={6} align="center">
                  <Icon as={FaRegLightbulb} color="blue.500" mr={2} />
                  <Text fontSize="sm" color="gray.500">
                    {intl.formatMessage({ id: 'app.upgradeToGetMore' })}
                  </Text>
                </Flex>
              )}
            </Box>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

export default PlanSelection;
