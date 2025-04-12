import React from 'react';
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
  AlertIcon
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useIntl } from 'react-intl';
import Card from 'components/Card/Card';
import CardHeader from 'components/Card/CardHeader';
import CardBody from 'components/Card/CardBody';

export default function SubscriptionCard({ subscription, onCancel, onReactivate, onChangePlan }) {
  const textColor = useColorModeValue('gray.700', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const intl = useIntl();

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card p="16px">
      <CardHeader p="12px 5px" mb="12px">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            {intl.formatMessage({ id: 'app.yourSubscription' })}
          </Text>
          <Badge colorScheme={getStatusColor(subscription.status)}>
            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
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
              {subscription.plan.name}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.billingPeriod' })}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              {subscription.plan.interval === 'monthly'
                ? intl.formatMessage({ id: 'app.monthly' })
                : intl.formatMessage({ id: 'app.yearly' })}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.amount' })}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              ${subscription.plan.price}/
              {subscription.plan.interval === 'monthly'
                ? intl.formatMessage({ id: 'app.month' })
                : intl.formatMessage({ id: 'app.year' })}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text fontSize="md" color="gray.500">
              {intl.formatMessage({ id: 'app.currentPeriod' })}
            </Text>
            <Text fontSize="md" fontWeight="bold" color={textColor}>
              {formatDate(subscription.current_period_start)} -{' '}
              {formatDate(subscription.current_period_end)}
            </Text>
          </Flex>

          {subscription.trial_end && (
            <Box bg="blue.50" p={3} borderRadius="md">
              <Text fontSize="sm" color="blue.600">
                {intl.formatMessage({ id: 'app.trialEnds' })} {formatDate(subscription.trial_end)}
              </Text>
            </Box>
          )}

          <Divider />

          <Flex justifyContent="space-between">
            {subscription.cancel_at_period_end ? (
              <Box w="100%">
                <Alert status="warning" borderRadius="md" mb={3}>
                  <AlertIcon />
                  <Text fontSize="sm">
                    {intl.formatMessage({ id: 'app.subscriptionWillCancel' })}{' '}
                    {formatDate(subscription.current_period_end)}
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

                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" flex={1}>
                    {intl.formatMessage({ id: 'app.changePlan' })}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => onChangePlan('upgrade')}>
                      {intl.formatMessage({ id: 'app.upgradeSubscription' })}
                    </MenuItem>
                    <MenuItem onClick={() => onChangePlan('downgrade')}>
                      {intl.formatMessage({ id: 'app.downgradeSubscription' })}
                    </MenuItem>
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
              {formatDate(subscription.current_period_end)}
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
