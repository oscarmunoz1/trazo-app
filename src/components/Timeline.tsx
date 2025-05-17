import React from 'react';
import { Box, Flex, Text, VStack, HStack, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaLeaf, FaTractor, FaCloudSun, FaFlask } from 'react-icons/fa';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'planting' | 'harvesting' | 'weather' | 'chemical' | 'general';
  carbonImpact?: number; // in kg CO2e
  photos?: string[];
}

interface TimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'planting':
      return FaLeaf;
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
    default:
      return 'gray.500';
  }
};

export const Timeline: React.FC<TimelineProps> = ({ events, onEventClick }) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const lineColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');

  return (
    <Box position="relative" width="100%" py={4}>
      <Box
        position="absolute"
        left="50%"
        transform="translateX(-50%)"
        width="2px"
        height="100%"
        bg={lineColor}
      />

      <VStack spacing={6} align="stretch">
        {sortedEvents.map((event, index) => {
          const EventIcon = getEventIcon(event.type);
          const eventColor = getEventColor(event.type);

          return (
            <Flex
              key={event.id}
              justify="space-between"
              align="flex-start"
              position="relative"
              cursor={onEventClick ? 'pointer' : 'default'}
              onClick={() => onEventClick?.(event)}
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s">
              <Box
                flex="1"
                textAlign="right"
                pr={8}
                visibility={index % 2 === 0 ? 'visible' : 'hidden'}>
                <Text fontWeight="medium">{event.title}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(event.date).toLocaleDateString()}
                </Text>
              </Box>

              <Box
                position="relative"
                zIndex={1}
                bg={bgColor}
                p={2}
                borderRadius="full"
                borderWidth="2px"
                borderColor={eventColor}>
                <Icon as={EventIcon} color={eventColor} boxSize={5} />
              </Box>

              <Box flex="1" pl={8} visibility={index % 2 === 1 ? 'visible' : 'hidden'}>
                <Text fontWeight="medium">{event.title}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(event.date).toLocaleDateString()}
                </Text>
              </Box>
            </Flex>
          );
        })}
      </VStack>

      {events.map((event) => (
        <Box
          key={event.id}
          mt={4}
          p={4}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={lineColor}
          bg={bgColor}>
          <Text fontWeight="medium">{event.title}</Text>
          <Text fontSize="sm" color="gray.500" mb={2}>
            {new Date(event.date).toLocaleDateString()}
          </Text>
          <Text fontSize="sm">{event.description}</Text>
          {event.carbonImpact && (
            <Text fontSize="sm" color="green.500" mt={2}>
              Carbon Impact: {event.carbonImpact.toFixed(2)} kg CO2e
            </Text>
          )}
          {event.photos && event.photos.length > 0 && (
            <HStack mt={2} spacing={2} overflowX="auto">
              {event.photos.map((photo, index) => (
                <Box key={index} boxSize="60px" borderRadius="md" overflow="hidden">
                  <img
                    src={photo}
                    alt={`Event photo ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </HStack>
          )}
        </Box>
      ))}
    </Box>
  );
};
