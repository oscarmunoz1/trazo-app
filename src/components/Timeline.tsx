import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Divider,
  Avatar,
  Button,
  Tooltip
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaTractor,
  FaCloudSun,
  FaFlask,
  FaSeedling,
  FaCalendarAlt,
  FaCamera,
  FaArrowUp,
  FaArrowDown,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionHStack = motion(HStack);

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'planting' | 'harvesting' | 'weather' | 'chemical' | 'general';
  carbonImpact?: number; // in kg CO2e
  photos?: string[];
  location?: string;
  person?: {
    name: string;
    role: string;
    avatar?: string;
  };
}

interface TimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

const getEventIcon = (type: string) => {
  switch (type) {
    case 'planting':
      return FaSeedling;
    case 'harvesting':
      return FaTractor;
    case 'weather':
      return FaCloudSun;
    case 'chemical':
      return FaFlask;
    default:
      return FaLeaf;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'planting':
      return 'green.500';
    case 'harvesting':
      return 'orange.500';
    case 'weather':
      return 'blue.500';
    case 'chemical':
      return 'purple.500';
    default:
      return 'gray.500';
  }
};

export const Timeline: React.FC<TimelineProps> = ({ events, onEventClick }) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [visibleEventCount, setVisibleEventCount] = useState(3);
  const [startIndex, setStartIndex] = useState(0);

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

  const handleShowMore = () => {
    setVisibleEventCount((prev) => Math.min(prev + 3, sortedEvents.length));
  };

  const handleShowLess = () => {
    setVisibleEventCount((prev) => Math.max(prev - 3, 3));
  };

  const handleNext = () => {
    if (startIndex + visibleEventCount < sortedEvents.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const visibleEvents = sortedEvents.slice(startIndex, startIndex + visibleEventCount);

  return (
    <Box position="relative" width="100%" py={4}>
      {/* Timeline controls */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          Product Journey
        </Text>
        <HStack spacing={2}>
          <Button
            size="sm"
            leftIcon={<FaChevronLeft />}
            onClick={handlePrevious}
            isDisabled={startIndex === 0}
            variant="ghost"
          >
            Previous
          </Button>
          <Button
            size="sm"
            rightIcon={<FaChevronRight />}
            onClick={handleNext}
            isDisabled={startIndex + visibleEventCount >= sortedEvents.length}
            variant="ghost"
          >
            Next
          </Button>
        </HStack>
      </Flex>

      {/* Main timeline */}
      <Box
        position="relative"
        width="100%"
        minHeight="300px"
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        p={4}
        bg={cardBg}
        boxShadow="sm"
      >
        {/* Timeline line */}
        <Box position="absolute" left="24px" top="0" width="2px" height="100%" bg={lineColor} />

        {/* Timeline events */}
        <VStack spacing={6} align="stretch" pl={12} pt={2}>
          {visibleEvents.map((event, index) => {
            const EventIcon = getEventIcon(event.type);
            const eventColor = getEventColor(event.type);
            const hasPositiveCarbonImpact =
              event.carbonImpact !== undefined && event.carbonImpact <= 0;
            const hasNegativeCarbonImpact =
              event.carbonImpact !== undefined && event.carbonImpact > 0;

            return (
              <MotionFlex
                key={event.id}
                position="relative"
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)'
                }}
                cursor="pointer"
                onClick={() => handleEventClick(event)}
              >
                {/* Circle icon on the timeline */}
                <MotionBox
                  position="absolute"
                  left="-36px"
                  top="0"
                  bg={bgColor}
                  p={2}
                  borderRadius="full"
                  borderWidth="2px"
                  borderColor={eventColor}
                  zIndex={1}
                  whileHover={{ scale: 1.2 }}
                >
                  <Icon as={EventIcon} color={eventColor} boxSize={5} />
                </MotionBox>

                {/* Event card */}
                <Box
                  p={4}
                  bg={cardBg}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={borderColor}
                  width="100%"
                  boxShadow="sm"
                  _hover={{ boxShadow: 'md' }}
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <HStack>
                      <Text fontWeight="bold" fontSize="md">
                        {event.title}
                      </Text>
                      {event.type && (
                        <Badge
                          colorScheme={
                            event.type === 'planting'
                              ? 'green'
                              : event.type === 'harvesting'
                              ? 'orange'
                              : 'blue'
                          }
                        >
                          {event.type}
                        </Badge>
                      )}
                    </HStack>
                    <HStack>
                      <Icon as={FaCalendarAlt} color="gray.500" />
                      <Text fontSize="sm" color="gray.500">
                        {new Date(event.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Text>
                    </HStack>
                  </Flex>

                  <Text fontSize="sm" mb={3}>
                    {event.description}
                  </Text>

                  <Flex justify="space-between" wrap="wrap">
                    {/* Carbon impact */}
                    {event.carbonImpact !== undefined && (
                      <MotionHStack
                        mt={1}
                        animate={
                          hasPositiveCarbonImpact
                            ? { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 2 } }
                            : {}
                        }
                      >
                        <Icon
                          as={hasPositiveCarbonImpact ? FaArrowDown : FaArrowUp}
                          color={hasPositiveCarbonImpact ? 'green.500' : 'orange.500'}
                        />
                        <Text
                          fontSize="sm"
                          color={hasPositiveCarbonImpact ? 'green.500' : 'orange.500'}
                          fontWeight="medium"
                        >
                          {hasPositiveCarbonImpact ? 'Reduces' : 'Adds'}{' '}
                          {Math.abs(event.carbonImpact).toFixed(2)} kg CO₂e
                        </Text>
                      </MotionHStack>
                    )}

                    {/* Location */}
                    {event.location && (
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Location: {event.location}
                      </Text>
                    )}
                  </Flex>

                  {/* Photo thumbnails preview */}
                  {event.photos && event.photos.length > 0 && (
                    <HStack mt={3} spacing={2} overflowX="auto">
                      <Icon as={FaCamera} color="gray.500" />
                      {event.photos.slice(0, 3).map((photo, index) => (
                        <Image
                          key={index}
                          src={photo}
                          alt={`Event photo ${index + 1}`}
                          boxSize="40px"
                          borderRadius="md"
                          objectFit="cover"
                          border="1px solid"
                          borderColor={borderColor}
                        />
                      ))}
                      {event.photos.length > 3 && (
                        <Badge colorScheme="blue" variant="outline">
                          +{event.photos.length - 3} more
                        </Badge>
                      )}
                    </HStack>
                  )}

                  {/* Person responsible */}
                  {event.person && (
                    <HStack mt={3} spacing={2}>
                      <Avatar src={event.person.avatar} name={event.person.name} size="xs" />
                      <Text fontSize="xs" color="gray.600">
                        {event.person.name}, {event.person.role}
                      </Text>
                    </HStack>
                  )}
                </Box>
              </MotionFlex>
            );
          })}
        </VStack>

        {/* Timeline navigation */}
        {sortedEvents.length > visibleEventCount && (
          <Flex justify="center" mt={4}>
            <Text fontSize="sm" color="gray.500">
              Showing {startIndex + 1}-
              {Math.min(startIndex + visibleEventCount, sortedEvents.length)} of{' '}
              {sortedEvents.length} events
            </Text>
          </Flex>
        )}
      </Box>

      {/* Event detail modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              {selectedEvent && (
                <Icon
                  as={getEventIcon(selectedEvent.type)}
                  color={getEventColor(selectedEvent.type)}
                  mr={2}
                />
              )}
              {selectedEvent?.title}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedEvent && (
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Badge
                    colorScheme={
                      selectedEvent.type === 'planting'
                        ? 'green'
                        : selectedEvent.type === 'harvesting'
                        ? 'orange'
                        : 'blue'
                    }
                  >
                    {selectedEvent.type}
                  </Badge>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(selectedEvent.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </HStack>

                <Text>{selectedEvent.description}</Text>

                <Divider />

                {/* Carbon impact details */}
                {selectedEvent.carbonImpact !== undefined && (
                  <Box
                    p={4}
                    borderRadius="md"
                    bg={selectedEvent.carbonImpact <= 0 ? 'green.50' : 'orange.50'}
                    borderWidth="1px"
                    borderColor={selectedEvent.carbonImpact <= 0 ? 'green.200' : 'orange.200'}
                  >
                    <Flex align="center" mb={2}>
                      <Icon
                        as={selectedEvent.carbonImpact <= 0 ? FaArrowDown : FaArrowUp}
                        color={selectedEvent.carbonImpact <= 0 ? 'green.500' : 'orange.500'}
                        mr={2}
                        boxSize={5}
                      />
                      <Text
                        fontWeight="bold"
                        color={selectedEvent.carbonImpact <= 0 ? 'green.700' : 'orange.700'}
                      >
                        {selectedEvent.carbonImpact <= 0 ? 'Carbon Reduction' : 'Carbon Emission'}
                      </Text>
                    </Flex>
                    <Text color={selectedEvent.carbonImpact <= 0 ? 'green.700' : 'orange.700'}>
                      {Math.abs(selectedEvent.carbonImpact).toFixed(2)} kg CO₂e
                      {selectedEvent.carbonImpact <= 0
                        ? ` (equivalent to not driving ${(
                            Math.abs(selectedEvent.carbonImpact) / 0.12
                          ).toFixed(1)} miles)`
                        : ` (equivalent to driving ${(selectedEvent.carbonImpact / 0.12).toFixed(
                            1
                          )} miles)`}
                    </Text>
                  </Box>
                )}

                {/* Person details */}
                {selectedEvent.person && (
                  <Box p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                    <Flex align="center">
                      <Avatar
                        src={selectedEvent.person.avatar}
                        name={selectedEvent.person.name}
                        size="md"
                        mr={4}
                      />
                      <Box>
                        <Text fontWeight="bold">{selectedEvent.person.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {selectedEvent.person.role}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                )}

                {/* Photos gallery */}
                {selectedEvent.photos && selectedEvent.photos.length > 0 && (
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Photos
                    </Text>
                    <Flex wrap="wrap" gap={2}>
                      {selectedEvent.photos.map((photo, index) => (
                        <Image
                          key={index}
                          src={photo}
                          alt={`Event photo ${index + 1}`}
                          maxH="200px"
                          borderRadius="md"
                          objectFit="cover"
                          border="1px solid"
                          borderColor={borderColor}
                        />
                      ))}
                    </Flex>
                  </Box>
                )}

                {/* Location information */}
                {selectedEvent.location && (
                  <Box>
                    <Text fontWeight="medium" mb={2}>
                      Location
                    </Text>
                    <Text>{selectedEvent.location}</Text>
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
