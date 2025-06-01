import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Button,
  Circle,
  Heading,
  Collapse,
  Divider,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon
} from '@chakra-ui/react';
import {
  FaWater,
  FaBolt,
  FaSeedling,
  FaLeaf,
  FaTractor,
  FaInfoCircle,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCertificate
} from 'react-icons/fa';
import { MdTimeline } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface TimelineEvent {
  id: string;
  type: string;
  description: string;
  observation?: string;
  date: string;
  certified: boolean;
  index?: number;
  // Additional optional fields that might come from API
  volume?: number;
  concentration?: number;
  area?: number;
  duration?: number;
  equipment?: string;
}

interface EnhancedProductTimelineProps {
  events: TimelineEvent[];
}

export const EnhancedProductTimeline: React.FC<EnhancedProductTimelineProps> = ({ events }) => {
  const intl = useIntl();
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Event categorization and filtering
  const categorizedEvents = useMemo(() => {
    const categories = {
      weather: events.filter((e) => e.type.includes('weather')),
      chemical: events.filter((e) => e.type.includes('chemical')),
      production: events.filter((e) => e.type.includes('production')),
      irrigation: events.filter((e) => e.type.includes('irrigation')),
      other: events.filter(
        (e) =>
          !['weather', 'chemical', 'production', 'irrigation'].some((cat) => e.type.includes(cat))
      )
    };
    return categories;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return events;
    return categorizedEvents[selectedCategory as keyof typeof categorizedEvents] || [];
  }, [events, selectedCategory, categorizedEvents]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 5);

  // Event configuration
  const getEventConfig = (type: string) => {
    if (type.includes('weather.frost'))
      return {
        icon: FaWater,
        color: 'blue.500',
        bgColor: 'blue.50',
        title: '❄️ Frost Protection',
        category: 'Weather'
      };
    if (type.includes('chemical.pesticide'))
      return {
        icon: FaBolt,
        color: 'red.500',
        bgColor: 'red.50',
        title: '🛡️ Pest Management',
        category: 'Chemical'
      };
    if (type.includes('chemical.fertilizer'))
      return {
        icon: FaSeedling,
        color: 'green.500',
        bgColor: 'green.50',
        title: '🌱 Nutrient Application',
        category: 'Chemical'
      };
    if (type.includes('chemical.herbicide'))
      return {
        icon: FaLeaf,
        color: 'orange.500',
        bgColor: 'orange.50',
        title: '🌿 Weed Control',
        category: 'Chemical'
      };
    if (type.includes('production.harvesting'))
      return {
        icon: FaTractor,
        color: 'yellow.600',
        bgColor: 'yellow.50',
        title: '🚜 Harvesting',
        category: 'Production'
      };
    if (type.includes('production.irrigation'))
      return {
        icon: FaWater,
        color: 'blue.400',
        bgColor: 'blue.50',
        title: '💧 Irrigation',
        category: 'Production'
      };
    return {
      icon: FaInfoCircle,
      color: 'gray.500',
      bgColor: 'gray.50',
      title: 'Farm Activity',
      category: 'Other'
    };
  };

  const categoryStats = useMemo(() => {
    return Object.entries(categorizedEvents).map(([key, eventList]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      count: eventList.length,
      color:
        key === 'weather'
          ? 'blue'
          : key === 'chemical'
          ? 'orange'
          : key === 'production'
          ? 'green'
          : key === 'irrigation'
          ? 'cyan'
          : 'gray'
    }));
  }, [categorizedEvents]);

  if (!events || events.length === 0) {
    return (
      <Box p={8} textAlign="center" bg="gray.50" borderRadius="xl">
        <Icon as={MdTimeline} color="gray.400" boxSize={16} mb={4} />
        <Heading as="h3" size="md" color="gray.600" mb={2}>
          {intl.formatMessage({ id: 'app.noTimelineData' }) || 'Timeline data is being prepared'}
        </Heading>
        <Text color="gray.500" fontSize="md">
          {intl.formatMessage({ id: 'app.timelineComingSoon' }) ||
            'Production journey details will be available soon'}
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Category Filter */}
      <VStack spacing={4} mb={6}>
        <SimpleGrid columns={{ base: 2, md: 6 }} spacing={2} w="full">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'solid' : 'outline'}
            colorScheme="gray"
            onClick={() => setSelectedCategory('all')}>
            All ({events.length})
          </Button>
          {categoryStats.map((category) => (
            <Button
              key={category.key}
              size="sm"
              variant={selectedCategory === category.key ? 'solid' : 'outline'}
              colorScheme={category.color}
              onClick={() => setSelectedCategory(category.key)}
              isDisabled={category.count === 0}>
              {category.label} ({category.count})
            </Button>
          ))}
        </SimpleGrid>
      </VStack>

      {/* Timeline Events */}
      <VStack spacing={4} align="stretch">
        {displayedEvents.map((event, index) => {
          const eventConfig = getEventConfig(event.type);

          return (
            <Box key={event.id} position="relative">
              {/* Timeline connector line */}
              {index < displayedEvents.length - 1 && (
                <Box
                  position="absolute"
                  left="20px"
                  top="50px"
                  width="2px"
                  height="calc(100% - 10px)"
                  bg={borderColor}
                  zIndex={0}
                />
              )}

              <HStack spacing={4} align="start" position="relative" zIndex={1}>
                {/* Event icon */}
                <Circle size="40px" bg={eventConfig.color} color="white" flexShrink={0}>
                  <Icon as={eventConfig.icon} boxSize={5} />
                </Circle>

                {/* Event content */}
                <Box
                  flex={1}
                  bg={eventConfig.bgColor}
                  p={5}
                  borderRadius="xl"
                  border="1px solid"
                  borderColor={borderColor}
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    left: '-8px',
                    top: '20px',
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderRight: `8px solid ${eventConfig.bgColor}`
                  }}>
                  <VStack align="start" spacing={3}>
                    {/* Header */}
                    <HStack justify="space-between" w="full" flexWrap="wrap">
                      <VStack align="start" spacing={1}>
                        <Heading as="h4" size="sm" color="gray.800">
                          {eventConfig.title}
                        </Heading>
                        <HStack spacing={3}>
                          <HStack spacing={1}>
                            <Icon as={FaCalendarAlt} boxSize={3} color="gray.500" />
                            <Text fontSize="sm" color="gray.600">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Text>
                          </HStack>
                          <Badge colorScheme={event.certified ? 'green' : 'gray'} size="sm">
                            {event.certified ? (
                              <HStack spacing={1}>
                                <Icon as={FaCertificate} boxSize={3} />
                                <Text>Certified</Text>
                              </HStack>
                            ) : (
                              'Standard'
                            )}
                          </Badge>
                        </HStack>
                      </VStack>

                      <Tag size="sm" colorScheme={eventConfig.color.split('.')[0]} variant="subtle">
                        <TagLabel>{eventConfig.category}</TagLabel>
                      </Tag>
                    </HStack>

                    {/* Description */}
                    {event.description && (
                      <Text fontSize="sm" color="gray.700">
                        <strong>Activity:</strong> {event.description}
                      </Text>
                    )}

                    {/* Observation */}
                    {event.observation && (
                      <Text fontSize="sm" color="gray.700">
                        <strong>Notes:</strong> {event.observation}
                      </Text>
                    )}

                    {/* Additional Details */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} w="full">
                      {event.volume && (
                        <HStack spacing={2}>
                          <Icon as={FaWater} color="blue.500" boxSize={4} />
                          <Text fontSize="sm" color="blue.600">
                            <strong>Volume:</strong> {event.volume}L
                          </Text>
                        </HStack>
                      )}

                      {event.concentration && (
                        <HStack spacing={2}>
                          <Icon as={FaBolt} color="orange.500" boxSize={4} />
                          <Text fontSize="sm" color="orange.600">
                            <strong>Concentration:</strong> {event.concentration}%
                          </Text>
                        </HStack>
                      )}

                      {event.area && (
                        <HStack spacing={2}>
                          <Icon as={FaMapMarkerAlt} color="green.500" boxSize={4} />
                          <Text fontSize="sm" color="green.600">
                            <strong>Area:</strong> {event.area} ha
                          </Text>
                        </HStack>
                      )}

                      {event.duration && (
                        <HStack spacing={2}>
                          <Icon as={FaCalendarAlt} color="purple.500" boxSize={4} />
                          <Text fontSize="sm" color="purple.600">
                            <strong>Duration:</strong> {event.duration}h
                          </Text>
                        </HStack>
                      )}

                      {event.equipment && (
                        <HStack spacing={2}>
                          <Icon as={FaTractor} color="gray.500" boxSize={4} />
                          <Text fontSize="sm" color="gray.600">
                            <strong>Equipment:</strong> {event.equipment}
                          </Text>
                        </HStack>
                      )}
                    </SimpleGrid>
                  </VStack>
                </Box>
              </HStack>
            </Box>
          );
        })}
      </VStack>

      {/* Show More/Less Button */}
      {filteredEvents.length > 5 && (
        <Flex justify="center" mt={6}>
          <Button
            variant="outline"
            colorScheme="gray"
            leftIcon={<Icon as={showAll ? FaChevronUp : FaChevronDown} />}
            onClick={() => setShowAll(!showAll)}>
            {showAll ? `Show Less` : `Show ${filteredEvents.length - 5} More Events`}
          </Button>
        </Flex>
      )}
    </Box>
  );
};
