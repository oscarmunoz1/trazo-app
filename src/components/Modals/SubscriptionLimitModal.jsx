import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Flex,
  useColorModeValue,
  Icon
} from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa';

/**
 * Modal to show when a user hits subscription limits
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.resourceType - Type of resource being limited ("establishment" or "parcel")
 * @param {Object} props.currentPlan - Current plan details
 * @param {Object} props.usage - Current usage details
 */
const SubscriptionLimitModal = ({ isOpen, onClose, resourceType, currentPlan, usage }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getTitle = () => {
    if (resourceType === 'establishment') {
      return intl.formatMessage({ id: 'app.establishmentLimitReached' });
    }
    return intl.formatMessage({ id: 'app.parcelLimitReached' });
  };

  const getMessage = () => {
    const planName = currentPlan?.name || 'Basic';

    if (resourceType === 'establishment') {
      return intl.formatMessage(
        { id: 'app.establishmentLimitMessage' },
        { plan: planName, limit: currentPlan?.features?.max_establishments || 1 }
      );
    }
    return intl.formatMessage(
      { id: 'app.parcelLimitMessage' },
      { plan: planName, limit: currentPlan?.features?.max_parcels || 1 }
    );
  };

  const handleUpgrade = () => {
    // Store the current path before navigating to pricing
    const currentPath = window.location.pathname;
    localStorage.setItem('last_form_path', currentPath);
    console.log('Storing path for return:', currentPath);

    // Close the modal and navigate to the pricing page with resource type
    onClose();
    // Use the correct dashboard pricing route
    navigate(`/admin/dashboard/pricing?return=form&resource=${resourceType}`);
    console.log(
      'Navigating to pricing page:',
      `/admin/dashboard/pricing?return=form&resource=${resourceType}`
    );
  };

  const handleCancel = () => {
    onClose();
    // Go back to the previous page or dashboard
    navigate(-1);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="md"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="xl" p={4}>
        <ModalHeader color={textColor} fontSize="xl">
          {getTitle()}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text color={textColor} mb={4}>
            {getMessage()}
          </Text>

          <Box
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            mb={6}
            bg={useColorModeValue('gray.50', 'gray.800')}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="bold">{intl.formatMessage({ id: 'app.currentPlan' })}</Text>
              <Text>{currentPlan?.name || 'Basic'}</Text>
            </Flex>
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold">
                {resourceType === 'establishment'
                  ? intl.formatMessage({ id: 'app.establishmentsUsed' })
                  : intl.formatMessage({ id: 'app.parcelsUsed' })}
              </Text>
              <Text>
                {resourceType === 'establishment'
                  ? `${usage?.establishments || 0}/${
                      currentPlan?.features?.max_establishments || 1
                    }`
                  : `${usage?.parcels || 0}/${currentPlan?.features?.max_parcels || 1}`}
              </Text>
            </Flex>
          </Box>

          <Text fontWeight="medium" color={textColor} mb={2}>
            {intl.formatMessage({ id: 'app.upgradeToGetMore' })}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleCancel}>
            {intl.formatMessage({ id: 'app.cancel' })}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleUpgrade}
            leftIcon={<Icon as={FaArrowUp} />}
            bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
            _hover={{
              bg: 'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
              opacity: 0.9
            }}
            color="white"
          >
            {intl.formatMessage({ id: 'app.upgradePlan' })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubscriptionLimitModal;
