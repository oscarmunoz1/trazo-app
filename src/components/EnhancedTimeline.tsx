import React from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Image,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaTractor,
  FaCloudSun,
  FaFlask,
  FaSeedling,
  FaWater,
  FaShippingFast,
  FaStore
} from 'react-icons/fa';
import { AiFillInfoCircle } from 'react-icons/ai';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type:
    | 'planting'
    | 'harvesting'
    | 'weather'
    | 'chemical'
    | 'general'
    | 'processing'
    | 'transport'
    | 'retail';
  carbonImpact?: number; // in kg CO2e
  photos?: string[];
  additionalInfo?: string;
}

interface Farmer {
  name: string;
  photo: string;
  bio: string;
  generation: number;
  location: string;
  certifications: string[];
  sustainabilityInitiatives: string[];
  carbonReduction: number;
  yearsOfPractice: number;
}

interface EnhancedTimelineProps {
  events: TimelineEvent[];
  farmer: Farmer;
  onEventClick?: (event: TimelineEvent) => void;
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'planting':
      return FaSeedling;
    case 'harvesting':
      return FaTractor;
    case 'weather':
      return FaCloudSun;
    case 'chemical':
      return FaFlask;
    case 'processing':
      return FaLeaf;
    case 'transport':
      return FaShippingFast;
    case 'retail':
      return FaStore;
    default:
      return FaLeaf;
  }
};

const getEventColor = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'planting':
      return 'green.500';
    case 'harvesting':
      return 'orange.500';
    case 'weather':
      return 'blue.500';
    case 'chemical':
      return 'purple.500';
    case 'processing':
      return 'teal.500';
    case 'transport':
      return 'cyan.500';
    case 'retail':
      return 'pink.500';
    default:
      return 'gray.500';
  }
};

export const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({
  events,
  farmer,
  onEventClick
}) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = React.useState<TimelineEvent | null>(null);

  const lineColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onOpen();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <Box position="relative" width="100%" py={4}>
      {/* Farmer introduction at the top */}
      <Flex
        bg={cardBg}
        p={4}
        borderRadius="lg"
        mb={6}
        boxShadow="md"
        align="center"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Image
          src={farmer.photo || 'https://via.placeholder.com/100?text=Farmer'}
          alt={farmer.name}
          boxSize="60px"
          borderRadius="full"
          objectFit="cover"
          mr={4}
        />
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            {farmer.name}
          </Text>
          <Text fontSize="sm">
            {farmer.generation}rd Generation Farmer • {farmer.location}
          </Text>
          <HStack mt={1} spacing={2} flexWrap="wrap">
            {farmer.certifications.slice(0, 2).map((cert, i) => (
              <Badge key={i} colorScheme="green">
                {cert}
              </Badge>
            ))}
          </HStack>
        </Box>
      </Flex>

      {/* Timeline line */}
      <Box
        position="absolute"
        left="24px"
        top="160px" // Adjusted to account for farmer introduction
        width="2px"
        height="calc(100% - 160px)"
        bg={lineColor}
      />

      {/* Timeline events */}
      <VStack spacing={4} align="stretch" pl={12}>
        {sortedEvents.map((event, index) => {
          const EventIcon = getEventIcon(event.type);
          const eventColor = getEventColor(event.type);

          return (
            <Box
              key={event.id}
              position="relative"
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => handleEventClick(event)}
            >
              {/* Circle icon on the timeline */}
              <Box
                position="absolute"
                left="-36px"
                top="0"
                bg={bgColor}
                p={2}
                borderRadius="full"
                borderWidth="2px"
                borderColor={eventColor}
                zIndex={1}
              >
                <Icon as={EventIcon} color={eventColor} boxSize={5} />
              </Box>

              {/* Event card */}
              <Box
                p={4}
                bg={cardBg}
                borderRadius="md"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="sm"
                _hover={{ boxShadow: 'md' }}
              >
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontWeight="bold" fontSize="md">
                    {event.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </Flex>
                <Text fontSize="sm" mb={2}>
                  {event.description}
                </Text>

                {/* Carbon impact if available */}
                {event.carbonImpact !== undefined && (
                  <HStack mt={2}>
                    <Icon
                      as={FaLeaf}
                      color={event.carbonImpact <= 0 ? 'green.500' : 'orange.500'}
                    />
                    <Text
                      fontSize="sm"
                      color={event.carbonImpact <= 0 ? 'green.500' : 'orange.500'}
                    >
                      Carbon Impact: {event.carbonImpact > 0 ? '+' : ''}
                      {event.carbonImpact.toFixed(2)} kg CO2e
                    </Text>
                  </HStack>
                )}

                {/* Photos preview */}
                {event.photos && event.photos.length > 0 && (
                  <HStack mt={2} spacing={2} overflow="hidden">
                    {event.photos.slice(0, 3).map((photo, i) => (
                      <Image
                        key={i}
                        src={photo}
                        alt={`Event photo ${i + 1}`}
                        boxSize="50px"
                        borderRadius="md"
                        objectFit="cover"
                      />
                    ))}
                    {event.photos.length > 3 && (
                      <Box
                        bg="gray.100"
                        boxSize="50px"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="xs">+{event.photos.length - 3}</Text>
                      </Box>
                    )}
                  </HStack>
                )}

                {/* Additional info indicator */}
                {event.additionalInfo && (
                  <Flex mt={2} align="center">
                    <Icon as={AiFillInfoCircle} color="blue.500" mr={1} />
                    <Text fontSize="xs" color="blue.500">
                      Tap for more details
                    </Text>
                  </Flex>
                )}
              </Box>
            </Box>
          );
        })}
      </VStack>

      {/* Detail modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedEvent?.title}
            <Text fontSize="sm" color="gray.500">
              {selectedEvent &&
                new Date(selectedEvent.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedEvent && (
              <VStack align="stretch" spacing={4}>
                <Text>{selectedEvent.description}</Text>

                {selectedEvent.additionalInfo && (
                  <Box p={4} bg="blue.50" borderRadius="md">
                    <Text>{selectedEvent.additionalInfo}</Text>
                  </Box>
                )}

                {selectedEvent.carbonImpact !== undefined && (
                  <Box
                    p={4}
                    bg={selectedEvent.carbonImpact <= 0 ? 'green.50' : 'orange.50'}
                    borderRadius="md"
                  >
                    <Text fontWeight="bold">
                      Carbon Impact: {selectedEvent.carbonImpact > 0 ? '+' : ''}
                      {selectedEvent.carbonImpact.toFixed(2)} kg CO2e
                    </Text>
                    {selectedEvent.carbonImpact <= 0 ? (
                      <Text fontSize="sm">
                        This practice helped reduce carbon emissions, equivalent to not driving{' '}
                        {Math.abs(selectedEvent.carbonImpact * 8.7).toFixed(2)} miles in a car.
                      </Text>
                    ) : (
                      <Text fontSize="sm">
                        This necessary practice contributed to the carbon footprint, equivalent to
                        driving {Math.abs(selectedEvent.carbonImpact * 8.7).toFixed(2)} miles in a
                        car.
                      </Text>
                    )}
                  </Box>
                )}

                {selectedEvent.photos && selectedEvent.photos.length > 0 && (
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Photos
                    </Text>
                    <Flex flexWrap="wrap" gap={2}>
                      {selectedEvent.photos.map((photo, i) => (
                        <Image
                          key={i}
                          src={photo}
                          alt={`Event photo ${i + 1}`}
                          maxH="200px"
                          borderRadius="md"
                        />
                      ))}
                    </Flex>
                  </Box>
                )}

                {/* Related farmer story if applicable */}
                {selectedEvent.type === 'planting' && (
                  <Box p={4} bg="green.50" borderRadius="md">
                    <Flex align="center" mb={2}>
                      <Image
                        src={farmer.photo || 'https://via.placeholder.com/100?text=Farmer'}
                        alt={farmer.name}
                        boxSize="40px"
                        borderRadius="full"
                        objectFit="cover"
                        mr={2}
                      />
                      <Text fontWeight="bold">{farmer.name}'s Note</Text>
                    </Flex>
                    <Text fontSize="sm" fontStyle="italic">
                      "As a {farmer.generation}rd generation farmer, I've seen how sustainable
                      practices like these have transformed our land over the years. We've been
                      implementing {farmer.sustainabilityInitiatives[0].toLowerCase()} for{' '}
                      {farmer.yearsOfPractice} years now, and the results speak for themselves."
                    </Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
