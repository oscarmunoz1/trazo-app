import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Button,
  Divider,
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Tooltip,
  Progress,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Image,
  Link,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaUser,
  FaLeaf,
  FaEye,
  FaEyeSlash,
  FaMinus,
  FaTint,
  FaFlask,
  FaSeedling,
  FaSun,
  FaCertificate,
  FaExternalLinkAlt,
  FaChartLine,
  FaDollarSign,
  FaClock
} from 'react-icons/fa';
import { MdVerified, MdInfo, MdOpenInNew } from 'react-icons/md';
import { useDeleteEventMutation } from 'store/api/historyApi';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

// Types
interface Member {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
}

interface Event {
  id: number;
  type: string;
  event_type: number;
  description: string;
  date: string;
  observation?: string;
  created_by: number;
  image?: string;
  name?: string;
  certified?: boolean;
  carbon_data?: CarbonCalculationResult;
}

interface CarbonCalculationResult {
  co2e: number;
  efficiency_score: number;
  usda_factors_based?: boolean;
  verification_status?: string;
  data_source?: string;
  calculation_method: string;
  event_type: string;
  timestamp: string;
  cost_analysis?: {
    estimated_cost: number;
    cost_per_co2e: number;
  };
  error?: string;
  // Keep old field for backward compatibility during transition
  usda_verified?: boolean;
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
  members: Member[];
  onEventUpdated?: () => void;
  onEventDeleted?: () => void;
}

// Helper functions
const getEventConfig = (type: string, description: string) => {
  const desc = description.toLowerCase();

  if (desc.includes('riego') || desc.includes('irrigation') || type.includes('irrigation')) {
    return {
      icon: FaTint,
      color: 'blue.500',
      category: 'Water Management',
      bgGradient: 'linear(to-r, blue.400, cyan.400)'
    };
  }

  if (type.includes('chemical') || desc.includes('fertilizer') || desc.includes('pesticide')) {
    return {
      icon: FaFlask,
      color: 'orange.500',
      category: 'Chemical Application',
      bgGradient: 'linear(to-r, orange.400, yellow.400)'
    };
  }

  if (desc.includes('harvest') || desc.includes('cosecha') || desc.includes('production')) {
    return {
      icon: FaSeedling,
      color: 'green.500',
      category: 'Production',
      bgGradient: 'linear(to-r, green.400, emerald.400)'
    };
  }

  if (desc.includes('weather') || desc.includes('climate') || desc.includes('temperature')) {
    return {
      icon: FaSun,
      color: 'purple.500',
      category: 'Weather Event',
      bgGradient: 'linear(to-r, purple.400, indigo.400)'
    };
  }

  return {
    icon: FaLeaf,
    color: 'green.500',
    category: 'Farm Activity',
    bgGradient: 'linear(to-r, green.400, emerald.400)'
  };
};

const extractEventData = (event: Event) => {
  const observation = event.observation || '';

  const durationMatch = observation.match(/(\d+)\s*hour/i);
  const duration = durationMatch ? parseInt(durationMatch[1]) : null;

  const amountMatch = observation.match(/(\d+)\s*(kg|lbs?|liters?|l)/i);
  const amount = amountMatch ? parseInt(amountMatch[1]) : null;
  const unit = amountMatch ? amountMatch[2] : null;

  return {
    duration,
    amount,
    unit,
    hasQuantifiableData: duration !== null || amount !== null
  };
};

const getQRVisibility = (event: Event): 'high' | 'medium' | 'low' => {
  const desc = event.description.toLowerCase();
  const type = event.type.toLowerCase();

  if (type.includes('chemical') || desc.includes('pesticide') || desc.includes('fertilizer')) {
    return 'high';
  }

  if (desc.includes('harvest') || desc.includes('cosecha') || desc.includes('organic')) {
    return 'high';
  }

  if (desc.includes('irrigation') || desc.includes('riego')) {
    return 'medium';
  }

  return 'low';
};

// Helper function to convert technical calculation methods to user-friendly descriptions
const getCalculationMethodDescription = (
  method: string,
  carbonData: CarbonCalculationResult
): string => {
  // Check if using USDA factors (new field) or fallback to old field
  const isUsdaFactorsBased = carbonData.usda_factors_based ?? carbonData.usda_verified ?? false;

  // Convert technical method names to user-friendly descriptions
  if (method.includes('production_irrigation') || method.includes('irrigation')) {
    return isUsdaFactorsBased
      ? 'Based on USDA irrigation emission standards'
      : 'Estimated using industry irrigation benchmarks';
  }

  if (
    method.includes('chemical') ||
    method.includes('fertilizer') ||
    method.includes('pesticide')
  ) {
    return isUsdaFactorsBased
      ? 'Based on USDA chemical application standards'
      : 'Estimated using agricultural chemical emission factors';
  }

  if (method.includes('equipment') || method.includes('fuel')) {
    return isUsdaFactorsBased
      ? 'Based on USDA equipment emission standards'
      : 'Estimated using equipment fuel consumption data';
  }

  if (method.includes('production_activity') || method.includes('crop_specific')) {
    return isUsdaFactorsBased
      ? 'Based on USDA crop-specific emission factors'
      : 'Estimated using crop production benchmarks';
  }

  if (method.includes('soil_management') || method.includes('soil')) {
    return isUsdaFactorsBased
      ? 'Based on USDA soil management standards'
      : 'Estimated using soil carbon sequestration models';
  }

  if (method.includes('weather') || method.includes('climate')) {
    return 'Estimated using climate impact models';
  }

  if (method.includes('general_event')) {
    return 'Standard baseline calculation for farm activities';
  }

  if (method.includes('unavailable') || method.includes('error')) {
    return 'Carbon data temporarily unavailable';
  }

  // Fallback for unknown methods
  return isUsdaFactorsBased
    ? 'Verified using USDA agricultural standards'
    : 'Estimated using agricultural emission benchmarks';
};

// Helper function to get data source confidence level
const getDataSourceConfidence = (
  carbonData: CarbonCalculationResult
): 'high' | 'medium' | 'low' => {
  if (carbonData.error) return 'low';
  if (carbonData.usda_verified) return 'high';
  if (
    carbonData.calculation_method.includes('standard') ||
    carbonData.calculation_method.includes('specific')
  )
    return 'medium';
  return 'low';
};

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  event,
  members,
  onEventUpdated,
  onEventDeleted
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentCompany } = useSelector((state: RootState) => state.company);

  // Get URL parameters
  const { establishmentId, parcelId } = useParams<{
    establishmentId: string;
    parcelId: string;
  }>();

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  // Modal size based on screen
  const modalSize = useBreakpointValue({ base: 'full', md: '4xl' });

  // State for carbon data - now using embedded data
  const [carbonData, setCarbonData] = useState<CarbonCalculationResult | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Delete confirmation modal
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // API hooks - only need delete now
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  // Load carbon data when modal opens - now uses embedded data
  useEffect(() => {
    if (isOpen && event) {
      // Use embedded carbon data if available, otherwise provide fallback
      if (event.carbon_data) {
        setCarbonData(event.carbon_data);
        setDataLoaded(true);
      } else {
        // Fallback for events without embedded carbon data
        setCarbonData({
          co2e: 0.1,
          efficiency_score: 50.0,
          usda_factors_based: false,
          verification_status: 'estimated',
          data_source: 'Unknown',
          calculation_method: 'embedded_data_unavailable',
          event_type: 'unknown',
          timestamp: new Date().toISOString(),
          error: 'Carbon data not available in event response'
        });
        setDataLoaded(true);
      }
    }
  }, [isOpen, event]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCarbonData(null);
      setDataLoaded(false);
    }
  }, [isOpen]);

  if (!event) return null;

  const eventConfig = getEventConfig(event.type, event.description);
  const eventData = extractEventData(event);
  const qrVisibility = getQRVisibility(event);
  const operator = members.find((member) => member.id === event.created_by);

  const handleEdit = () => {
    navigate(
      `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/${event.id}/change?event_type=${event.event_type}`
    );
    onClose();
  };

  const handleDelete = () => {
    if (!currentCompany || !establishmentId || !event) return;

    deleteEvent({
      companyId: currentCompany.id.toString(),
      establishmentId: establishmentId,
      eventId: event.id.toString(),
      eventType: event.event_type.toString()
    })
      .unwrap()
      .then(() => {
        toast({
          title: 'Event Deleted',
          description: 'The event has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        onDeleteClose();
        onClose();
        onEventDeleted?.();
      })
      .catch((error: any) => {
        console.error('Failed to delete event:', error);
        toast({
          title: 'Error Deleting Event',
          description: 'An error occurred while deleting the event.',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          bg={bgColor}
          borderRadius="xl"
          maxH="90vh"
          display="flex"
          flexDirection="column"
        >
          {/* Modern Minimalist Header */}
          <ModalHeader p={6} pb={4} borderBottom="1px" borderColor={borderColor} flexShrink={0}>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={3} flex={1}>
                <HStack spacing={3}>
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={useColorModeValue(
                      `${eventConfig.color.split('.')[0]}.50`,
                      `${eventConfig.color.split('.')[0]}.900`
                    )}
                  >
                    <Icon as={eventConfig.icon} boxSize={6} color={eventConfig.color} />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xl" fontWeight="bold" color={textColor}>
                      {event.event_type !== 3
                        ? intl.formatMessage({ id: event.type }) || event.description
                        : event.name || event.description}
                    </Text>
                    <Badge
                      colorScheme={eventConfig.color.split('.')[0]}
                      variant="subtle"
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {eventConfig.category}
                    </Badge>
                  </VStack>
                </HStack>

                <HStack spacing={6} color="gray.500" fontSize="sm">
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} boxSize={4} />
                    <Text>{new Date(event.date).toLocaleDateString()}</Text>
                  </HStack>
                  {operator && (
                    <HStack spacing={2}>
                      <Icon as={FaUser} boxSize={4} />
                      <Text>{operator.full_name}</Text>
                    </HStack>
                  )}
                  {event.certified && (
                    <HStack spacing={2}>
                      <Icon as={MdVerified} boxSize={4} color="green.500" />
                      <Text color="green.500" fontWeight="medium">
                        Certified
                      </Text>
                    </HStack>
                  )}
                </HStack>
              </VStack>

              <ModalCloseButton position="static" size="lg" />
            </HStack>
          </ModalHeader>

          <ModalBody p={6} overflowY="auto" flex={1}>
            <VStack spacing={6} align="stretch">
              {/* Event Details Section */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
                  Event Details
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box p={4} bg={cardBg} borderRadius="lg">
                    <Text fontSize="sm" color="gray.500" mb={1}>
                      Description
                    </Text>
                    <Text fontWeight="medium">{event.description}</Text>
                  </Box>

                  {event.observation && (
                    <Box p={4} bg={cardBg} borderRadius="lg">
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Observations
                      </Text>
                      <Text fontWeight="medium">{event.observation}</Text>
                    </Box>
                  )}

                  {eventData.duration && (
                    <Box p={4} bg={cardBg} borderRadius="lg">
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Duration
                      </Text>
                      <Text fontWeight="medium">{eventData.duration} hours</Text>
                    </Box>
                  )}

                  {eventData.amount && (
                    <Box p={4} bg={cardBg} borderRadius="lg">
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        Amount Applied
                      </Text>
                      <Text fontWeight="medium">
                        {eventData.amount} {eventData.unit}
                      </Text>
                    </Box>
                  )}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Carbon Impact Section */}
              <Box>
                <HStack justify="space-between" align="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    Carbon Impact Analysis
                  </Text>
                  {carbonData && carbonData.error && <Spinner size="sm" color="red.500" />}
                </HStack>

                {carbonData && !carbonData.error ? (
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    {/* Carbon Impact */}
                    <Stat
                      bg={cardBg}
                      p={4}
                      borderRadius="lg"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <StatLabel>Carbon Impact</StatLabel>
                      <StatNumber color={carbonData.co2e < 0 ? 'green.500' : 'orange.500'}>
                        {carbonData.co2e > 0 ? '+' : ''}
                        {carbonData.co2e} kg CO₂
                      </StatNumber>
                      <StatHelpText>
                        <StatArrow type={carbonData.co2e > 0 ? 'increase' : 'decrease'} />
                        {carbonData.co2e > 0 ? 'Emission' : 'Reduction'}
                      </StatHelpText>
                      {carbonData.usda_verified && (
                        <Badge colorScheme="blue" variant="solid" fontSize="xs" mt={2}>
                          <HStack spacing={1}>
                            <Icon as={FaCertificate} boxSize={3} />
                            <Text>USDA Verified</Text>
                          </HStack>
                        </Badge>
                      )}
                    </Stat>

                    {/* Efficiency Score */}
                    {carbonData.efficiency_score > 0 && (
                      <Stat
                        bg={cardBg}
                        p={4}
                        borderRadius="lg"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>Efficiency Score</StatLabel>
                        <StatNumber>{carbonData.efficiency_score}/100</StatNumber>
                        <Progress
                          value={carbonData.efficiency_score}
                          colorScheme={
                            carbonData.efficiency_score >= 70
                              ? 'green'
                              : carbonData.efficiency_score >= 50
                              ? 'yellow'
                              : 'red'
                          }
                          size="sm"
                          mt={2}
                          borderRadius="full"
                        />
                      </Stat>
                    )}

                    {/* Cost Analysis */}
                    {carbonData.cost_analysis?.estimated_cost && (
                      <Stat
                        bg={cardBg}
                        p={4}
                        borderRadius="lg"
                        border="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>Estimated Cost</StatLabel>
                        <StatNumber>${carbonData.cost_analysis.estimated_cost}</StatNumber>
                        <StatHelpText>
                          ${carbonData.cost_analysis.cost_per_co2e?.toFixed(2)}/kg CO₂
                        </StatHelpText>
                      </Stat>
                    )}
                  </SimpleGrid>
                ) : carbonData && carbonData.error ? (
                  <Box textAlign="center" py={8}>
                    <Spinner size="lg" color="red.500" />
                    <Text mt={4} color="red.500">
                      {carbonData.error}
                    </Text>
                  </Box>
                ) : (
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <Text>Carbon impact data is not available for this event type.</Text>
                  </Alert>
                )}
              </Box>

              <Divider />

              {/* Consumer Visibility Section */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4} color={textColor}>
                  Consumer Transparency
                </Text>

                <HStack spacing={4} align="center">
                  <HStack spacing={2}>
                    <Icon
                      as={
                        qrVisibility === 'high'
                          ? FaEye
                          : qrVisibility === 'medium'
                          ? FaMinus
                          : FaEyeSlash
                      }
                      color={
                        qrVisibility === 'high'
                          ? 'green.500'
                          : qrVisibility === 'medium'
                          ? 'yellow.500'
                          : 'gray.400'
                      }
                      boxSize={5}
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium" textTransform="capitalize">
                        {qrVisibility} QR Visibility
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {qrVisibility === 'high' && 'Highly relevant to consumers'}
                        {qrVisibility === 'medium' && 'Moderately relevant to consumers'}
                        {qrVisibility === 'low' && 'Internal farming activity'}
                      </Text>
                    </VStack>
                  </HStack>

                  <Tooltip
                    label="This indicates how relevant this event is to consumers scanning your product QR codes"
                    placement="top"
                    hasArrow
                  >
                    <Box cursor="help">
                      <Icon as={MdInfo} color="gray.400" boxSize={4} />
                    </Box>
                  </Tooltip>
                </HStack>
              </Box>

              {/* Data Source Information - Updated to use new fields */}
              {carbonData && (
                <Box p={4} bg={cardBg} borderRadius="lg">
                  <HStack justify="space-between" align="start" mb={3}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        Carbon Data Source
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {getCalculationMethodDescription(carbonData.calculation_method, carbonData)}
                      </Text>
                      {carbonData.data_source && (
                        <Text fontSize="xs" color="gray.400" fontStyle="italic">
                          Source: {carbonData.data_source}
                        </Text>
                      )}
                    </VStack>
                    <Badge
                      colorScheme={
                        carbonData.verification_status === 'usda_certified' ||
                        carbonData.verification_status === 'factors_verified' ||
                        carbonData.usda_factors_based
                          ? 'green'
                          : carbonData.error
                          ? 'red'
                          : 'blue'
                      }
                      variant="subtle"
                      fontSize="xs"
                    >
                      {carbonData.verification_status === 'usda_certified'
                        ? '✓ USDA Certified'
                        : carbonData.verification_status === 'factors_verified' ||
                          carbonData.usda_factors_based
                        ? '📊 USDA Factors'
                        : carbonData.error
                        ? '⚠ Data Unavailable'
                        : '📈 Estimated'}
                    </Badge>
                  </HStack>

                  {/* Data confidence indicator - Updated */}
                  <HStack spacing={2} align="center">
                    <Text fontSize="xs" color="gray.400">
                      Confidence:
                    </Text>
                    <HStack spacing={1}>
                      {[1, 2, 3].map((level) => (
                        <Box
                          key={level}
                          w={2}
                          h={2}
                          borderRadius="full"
                          bg={
                            level <=
                            (getDataSourceConfidence(carbonData) === 'high'
                              ? 3
                              : getDataSourceConfidence(carbonData) === 'medium'
                              ? 2
                              : 1)
                              ? carbonData.verification_status === 'usda_certified'
                                ? 'green.400'
                                : carbonData.usda_factors_based ||
                                  carbonData.verification_status === 'factors_verified'
                                ? 'blue.400'
                                : 'yellow.400'
                              : 'gray.200'
                          }
                        />
                      ))}
                    </HStack>
                    <Text fontSize="xs" color="gray.500" textTransform="capitalize">
                      {getDataSourceConfidence(carbonData)}
                    </Text>
                  </HStack>
                </Box>
              )}
            </VStack>
          </ModalBody>

          {/* Fixed Footer */}
          <ModalFooter
            borderTop="1px"
            borderColor={borderColor}
            p={6}
            flexShrink={0}
            bg={useColorModeValue('white', 'gray.800')}
            borderBottomRadius="xl"
          >
            <HStack spacing={3} w="full" justify="space-between">
              <Button
                variant="ghost"
                onClick={onClose}
                size="lg"
                color="gray.600"
                _hover={{ bg: 'gray.100' }}
              >
                Close
              </Button>

              <HStack spacing={3}>
                <Button
                  leftIcon={<FaEdit />}
                  colorScheme="blue"
                  variant="solid"
                  onClick={handleEdit}
                  size="lg"
                  borderRadius="lg"
                  fontWeight="semibold"
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.2s"
                >
                  Edit Event
                </Button>

                <Button
                  leftIcon={<FaTrash />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={onDeleteOpen}
                  size="lg"
                  borderRadius="lg"
                  fontWeight="semibold"
                  isLoading={isDeleting}
                  loadingText="Deleting..."
                  _hover={{
                    bg: 'red.50',
                    color: 'red.600'
                  }}
                  transition="all 0.2s"
                >
                  Delete
                </Button>
              </HStack>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modern Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent borderRadius="xl" p={2}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold" pb={4}>
              <HStack spacing={3}>
                <Box p={2} borderRadius="lg" bg="red.50">
                  <Icon as={FaTrash} boxSize={5} color="red.500" />
                </Box>
                <Text>Delete Event</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody pb={6}>
              <VStack align="start" spacing={3}>
                <Text color="gray.600">
                  Are you sure you want to delete this event? This action cannot be undone.
                </Text>
                <Box p={3} bg="red.50" borderRadius="lg" w="full">
                  <Text fontSize="sm" color="red.700" fontWeight="medium">
                    ⚠️ This will permanently remove:
                  </Text>
                  <VStack align="start" spacing={1} mt={2} fontSize="sm" color="red.600">
                    <Text>• Event details and observations</Text>
                    <Text>• Associated carbon impact data</Text>
                    <Text>• Consumer QR code visibility</Text>
                  </VStack>
                </Box>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter pt={4}>
              <HStack spacing={3} w="full" justify="flex-end">
                <Button
                  ref={cancelRef}
                  onClick={onDeleteClose}
                  variant="ghost"
                  size="lg"
                  borderRadius="lg"
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDelete}
                  size="lg"
                  borderRadius="lg"
                  fontWeight="semibold"
                  isLoading={isDeleting}
                  loadingText="Deleting..."
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: 'lg'
                  }}
                  transition="all 0.2s"
                >
                  Delete Event
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
