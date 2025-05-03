import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Badge,
  Stack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Spinner,
  VStack,
  ButtonGroup,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { ChevronDownIcon, ArrowUpIcon, ArrowDownIcon, CloseIcon } from '@chakra-ui/icons';
import { useIntl } from 'react-intl';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';
import { useGetPlansQuery, useCreateCheckoutSessionMutation } from 'store/api/subscriptionApi';

const defaultFormatDate = (date) => {
  if (!date) return '-';
  return new Date(date * 1000).toLocaleDateString();
};

const defaultFormatPrice = (price) => {
  if (price === undefined || price === null || isNaN(price)) return '-';
  return `$${(price / 100).toFixed(2)}`;
};

export default function SubscriptionCard({
  subscription,
  onCancel,
  onReactivate,
  onChangePlan,
  formatDate = defaultFormatDate,
  formatPrice = defaultFormatPrice,
  company
}) {
  const textColor = useColorModeValue('gray.700', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const intl = useIntl();
  const [planMenuIsOpen, setPlanMenuIsOpen] = useState(false);
  const { data: allPlans, isLoading } = useGetPlansQuery('');
  const toast = useToast();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  // Manually sort available plans based on price
  const availablePlans = useMemo(() => {
    if (!allPlans || !subscription?.plan) return { upgrades: [], downgrades: [] };

    const currentPlanPrice = subscription.plan.price || 0;
    const currentPlanId = subscription.plan.id;

    const upgrades = allPlans
      .filter((plan) => plan.price > currentPlanPrice && plan.id !== currentPlanId)
      .sort((a, b) => a.price - b.price);

    const downgrades = allPlans
      .filter((plan) => plan.price < currentPlanPrice && plan.id !== currentPlanId)
      .sort((a, b) => b.price - a.price);

    return { upgrades, downgrades };
  }, [allPlans, subscription]);

  // Helper function to safely format dates
  const formatDateInternal = (dateString) => {
    if (!dateString) return intl.formatMessage({ id: 'app.notAvailable' });
    try {
      // Check if the date is in seconds (Unix timestamp) or milliseconds
      const timestamp = String(dateString).length <= 10 ? dateString * 1000 : dateString;
      const date = new Date(timestamp);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return intl.formatMessage({ id: 'app.notAvailable' });
      }

      return date.toLocaleDateString();
    } catch (e) {
      return intl.formatMessage({ id: 'app.notAvailable' });
    }
  };

  // Helper function to safely format prices
  const formatPriceInternal = (price) => {
    if (price === undefined || price === null || isNaN(price)) {
      return intl.formatMessage({ id: 'app.notAvailable' });
    }
    return `$${(price / 100).toFixed(2)}`;
  };

  // Get the first available upgrade plan ID
  const getPlanUpgradeId = () => {
    if (!availablePlans || !availablePlans.upgrades || availablePlans.upgrades.length === 0) {
      return null;
    }
    return availablePlans.upgrades[0].id;
  };

  // Get the first available downgrade plan ID
  const getPlanDowngradeId = () => {
    if (!availablePlans || !availablePlans.downgrades || availablePlans.downgrades.length === 0) {
      return null;
    }
    return availablePlans.downgrades[0].id;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'green';
      case 'past_due':
      case 'unpaid':
      case 'incomplete':
        return 'red';
      case 'canceled':
        return 'gray';
      default:
        return 'blue';
    }
  };

  const handleCancelConfirm = () => {
    onCancel();
    onClose();
  };

  // Get the plan interval safely
  const planInterval =
    subscription?.plan?.interval === 'monthly'
      ? intl.formatMessage({ id: 'app.month' })
      : intl.formatMessage({ id: 'app.year' });

  const handleChangePlan = (planId) => {
    if (!planId || !company?.id) return;

    // Create checkout session for the selected plan
    createCheckoutSession({
      planId: planId,
      companyId: company.id,
      successUrl: window.location.origin + '/admin/dashboard/stripe-success',
      cancelUrl: window.location.origin + '/admin/dashboard/billing'
    })
      .unwrap()
      .then((response) => {
        // Redirect to Stripe checkout
        if (response && response.url) {
          window.location.href = response.url;
        }
      })
      .catch((error) => {
        console.error('Error creating checkout session:', error);
        toast({
          title: intl.formatMessage({ id: 'app.error' }),
          description: intl.formatMessage({ id: 'app.errorCreatingCheckout' }),
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  return (
    <Card p="16px">
      <CardHeader p="12px 5px" mb="12px">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            {intl.formatMessage({ id: 'app.yourSubscription' })}
          </Text>
          <Badge colorScheme={getStatusColor(subscription?.status || 'unknown')}>
            {subscription?.status
              ? subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
              : intl.formatMessage({ id: 'app.unknown' })}
          </Badge>
        </Flex>
      </CardHeader>
      <CardBody px="5px">
        <Stack spacing={4}>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.plan' })}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              {subscription?.plan?.name || '-'}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.billingPeriod' })}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              {subscription?.plan?.interval === 'monthly'
                ? intl.formatMessage({ id: 'app.monthly' })
                : intl.formatMessage({ id: 'app.yearly' })}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.amount' })}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              {formatPriceInternal(subscription?.plan?.price)}/{planInterval}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.currentPeriod' })}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              {formatDateInternal(subscription?.current_period_start)} -{' '}
              {formatDateInternal(subscription?.current_period_end)}
            </Text>
          </Flex>

          {subscription?.trial_end && (
            <Box bg="blue.50" p={3} borderRadius="md">
              <Text fontSize="sm" color="blue.600">
                {intl.formatMessage({ id: 'app.trialEnds' })}{' '}
                {formatDateInternal(subscription?.trial_end)}
              </Text>
            </Box>
          )}

          <Divider />

          <Flex justifyContent="space-between">
            {subscription?.cancel_at_period_end ? (
              <Box w="100%">
                <Alert status="warning" borderRadius="md" mb={3}>
                  <AlertIcon />
                  <Text fontSize="sm">
                    {intl.formatMessage({ id: 'app.subscriptionWillCancel' })}{' '}
                    {formatDateInternal(subscription?.current_period_end)}
                  </Text>
                </Alert>
                <Button colorScheme="blue" size="sm" onClick={onReactivate} width="full">
                  {intl.formatMessage({ id: 'app.reactivateSubscription' })}
                </Button>
              </Box>
            ) : (
              <Stack direction={{ base: 'column', sm: 'row' }} spacing={3} w="100%">
                <Button colorScheme="red" size="sm" onClick={onOpen} flex={1}>
                  {intl.formatMessage({ id: 'app.cancelSubscription' })}
                </Button>

                <Menu
                  onOpen={() => setPlanMenuIsOpen(true)}
                  onClose={() => setPlanMenuIsOpen(false)}>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    size="sm"
                    flex={1}
                    colorScheme="blue">
                    {intl.formatMessage({ id: 'app.changePlan' })}
                  </MenuButton>
                  <MenuList maxH="300px" overflowY="auto">
                    {isLoading ? (
                      <Flex justify="center" p={2}>
                        <Spinner size="sm" />
                      </Flex>
                    ) : (
                      <>
                        {availablePlans.upgrades && availablePlans.upgrades.length > 0 && (
                          <>
                            <Box px={3} pt={2} pb={1} bg="gray.50">
                              <Text fontSize="xs" fontWeight="bold" color="gray.700">
                                {intl.formatMessage({ id: 'app.upgrades' })}
                              </Text>
                            </Box>
                            {availablePlans.upgrades.map((plan) => (
                              <MenuItem
                                key={`upgrade-${plan.id}`}
                                onClick={() => handleChangePlan(plan.id)}
                                icon={<ArrowUpIcon color="green.500" />}
                                py={2}>
                                <Flex direction="column" align="start">
                                  <Text fontWeight="medium">{plan.name}</Text>
                                  <Text fontSize="xs" color="gray.600">
                                    {formatPriceInternal(plan.price)}/
                                    {plan.interval === 'monthly'
                                      ? intl.formatMessage({ id: 'app.monthly' })
                                      : intl.formatMessage({ id: 'app.yearly' })}
                                  </Text>
                                </Flex>
                              </MenuItem>
                            ))}
                          </>
                        )}

                        {availablePlans.downgrades && availablePlans.downgrades.length > 0 && (
                          <>
                            <Box px={3} pt={2} pb={1} bg="gray.50">
                              <Text fontSize="xs" fontWeight="bold" color="gray.700">
                                {intl.formatMessage({ id: 'app.downgrades' })}
                              </Text>
                            </Box>
                            {availablePlans.downgrades.map((plan) => (
                              <MenuItem
                                key={`downgrade-${plan.id}`}
                                onClick={() => handleChangePlan(plan.id)}
                                icon={<ArrowDownIcon color="gray.500" />}
                                py={2}>
                                <Flex direction="column" align="start">
                                  <Text fontWeight="medium">{plan.name}</Text>
                                  <Text fontSize="xs" color="gray.600">
                                    {formatPriceInternal(plan.price)}/
                                    {plan.interval === 'monthly'
                                      ? intl.formatMessage({ id: 'app.monthly' })
                                      : intl.formatMessage({ id: 'app.yearly' })}
                                  </Text>
                                </Flex>
                              </MenuItem>
                            ))}
                          </>
                        )}

                        {(!availablePlans.upgrades || availablePlans.upgrades.length === 0) &&
                          (!availablePlans.downgrades ||
                            availablePlans.downgrades.length === 0) && (
                            <Text px={3} py={2}>
                              {intl.formatMessage({ id: 'app.noOtherPlansAvailable' })}
                            </Text>
                          )}
                      </>
                    )}
                  </MenuList>
                </Menu>
              </Stack>
            )}
          </Flex>
        </Stack>
      </CardBody>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{intl.formatMessage({ id: 'app.confirmCancellation' })}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{intl.formatMessage({ id: 'app.cancelConfirmationText' })}</Text>
            <Text mt={4} fontWeight="bold">
              {intl.formatMessage({ id: 'app.serviceAvailableUntil' })}{' '}
              {formatDateInternal(subscription?.current_period_end)}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              {intl.formatMessage({ id: 'app.goBack' })}
            </Button>
            <Button colorScheme="red" onClick={handleCancelConfirm}>
              {intl.formatMessage({ id: 'app.confirmCancellation' })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
