import React, { useState } from 'react';
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
  Progress,
  useBreakpointValue,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Wrap,
  WrapItem
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
  FaCertificate,
  FaFlask,
  FaShieldAlt,
  FaRecycle,
  FaGlobeAmericas
} from 'react-icons/fa';
import { MdTimeline, MdEco, MdVerified, MdAgriculture } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { format, parseISO } from 'date-fns';
import HTMLRenderer from 'components/Utils/HTMLRenderer';

interface TimelineEvent {
  id: string;
  type: string;
  description: string;
  observation?: string;
  date: string;
  certified: boolean;
  index?: number;
  volume?: string;
  concentration?: string;
  area?: string;
  equipment?: string;
}

interface ModernProductionJourneyProps {
  events: TimelineEvent[];
}

export const ModernProductionJourney: React.FC<ModernProductionJourneyProps> = ({ events }) => {
  const intl = useIntl();
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Get event configuration based on type
  const getEventConfig = (event: TimelineEvent) => {
    const type = event.type.toLowerCase();
    const description = event.description.toLowerCase();

    // Chemical events
    if (
      type.includes('chemical') ||
      description.includes('fertilizer') ||
      description.includes('spray')
    ) {
      return {
        icon: FaFlask,
        color: 'orange.500',
        bgColor: 'orange.50',
        borderColor: 'orange.200',
        category: 'Chemical Application',
        categoryColor: 'orange'
      };
    }

    // Production events
    if (
      type.includes('production') ||
      description.includes('harvest') ||
      description.includes('planting') ||
      description.includes('bee')
    ) {
      return {
        icon: MdAgriculture,
        color: 'green.500',
        bgColor: 'green.50',
        borderColor: 'green.200',
        category: 'Production Activity',
        categoryColor: 'green'
      };
    }

    // Equipment events
    if (
      type.includes('equipment') ||
      description.includes('tractor') ||
      description.includes('machinery') ||
      description.includes('cultivation')
    ) {
      return {
        icon: FaTractor,
        color: 'blue.500',
        bgColor: 'blue.50',
        borderColor: 'blue.200',
        category: 'Equipment Operation',
        categoryColor: 'blue'
      };
    }

    // Soil management
    if (type.includes('soil') || description.includes('compost') || description.includes('soil')) {
      return {
        icon: FaSeedling,
        color: 'brown.500',
        bgColor: 'yellow.50',
        borderColor: 'yellow.200',
        category: 'Soil Management',
        categoryColor: 'yellow'
      };
    }

    // Water/irrigation
    if (
      type.includes('irrigation') ||
      description.includes('water') ||
      description.includes('sprinkler')
    ) {
      return {
        icon: FaWater,
        color: 'cyan.500',
        bgColor: 'cyan.50',
        borderColor: 'cyan.200',
        category: 'Water Management',
        categoryColor: 'cyan'
      };
    }

    // Default/general
    return {
      icon: MdEco,
      color: 'gray.500',
      bgColor: 'gray.50',
      borderColor: 'gray.200',
      category: 'General Activity',
      categoryColor: 'gray'
    };
  };

  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter events based on category
  const filteredEvents =
    selectedCategory === 'all'
      ? sortedEvents
      : sortedEvents.filter((event) => {
          const config = getEventConfig(event);
          return config.category.toLowerCase().includes(selectedCategory.toLowerCase());
        });

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 4);

  // Get unique categories for filter
  const categories = ['all', ...new Set(events.map((event) => getEventConfig(event).category))];

  return (
    <Card bg={bgColor} shadow="lg" borderRadius="xl">
      <CardHeader pb={2}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Circle size="40px" bg="green.100">
                <Icon as={MdTimeline} color="green.600" boxSize={5} />
              </Circle>
              <VStack align="start" spacing={0}>
                <Heading size="md" color={textColor}>
                  Production Journey
                </Heading>
                <Text fontSize="sm" color={mutedColor}>
                  {events.length} activities recorded
                </Text>
              </VStack>
            </HStack>
            <Badge colorScheme="green" variant="subtle" px={3} py={1}>
              {events.filter((e) => e.certified).length} Verified
            </Badge>
          </HStack>

          {/* Category Filter */}
          <Wrap spacing={2}>
            {categories.map((category) => (
              <WrapItem key={category}>
                <Button
                  size="sm"
                  variant={selectedCategory === category ? 'solid' : 'outline'}
                  colorScheme={selectedCategory === category ? 'green' : 'gray'}
                  onClick={() => setSelectedCategory(category)}
                  textTransform="capitalize"
                >
                  {category === 'all' ? 'All Activities' : category}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </VStack>
      </CardHeader>

      <CardBody pt={2}>
        <VStack spacing={4} align="stretch">
          {displayedEvents.map((event, index) => {
            const config = getEventConfig(event);
            const isLast = index === displayedEvents.length - 1;

            return (
              <Box key={event.id} position="relative">
                <HStack spacing={4} align="start">
                  {/* Timeline connector */}
                  <VStack spacing={0}>
                    <Circle
                      size="40px"
                      bg={config.bgColor}
                      border="2px solid"
                      borderColor={config.borderColor}
                    >
                      <Icon as={config.icon} color={config.color} boxSize={5} />
                    </Circle>
                    {!isLast && <Box w="2px" h="60px" bg={borderColor} mt={2} />}
                  </VStack>

                  {/* Event content */}
                  <Box flex={1} pb={isLast ? 0 : 4}>
                    <Card
                      size="sm"
                      bg={config.bgColor}
                      border="1px solid"
                      borderColor={config.borderColor}
                    >
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          {/* Event header */}
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={1} flex={1}>
                              <HStack spacing={2}>
                                <Badge
                                  size="sm"
                                  colorScheme={config.categoryColor}
                                  variant="subtle"
                                >
                                  {config.category}
                                </Badge>
                                {event.certified && (
                                  <Badge size="sm" colorScheme="green" variant="solid">
                                    <HStack spacing={1}>
                                      <Icon as={MdVerified} boxSize={3} />
                                      <Text fontSize="xs">Verified</Text>
                                    </HStack>
                                  </Badge>
                                )}
                              </HStack>
                              <Text fontWeight="semibold" fontSize="md" color={textColor}>
                                <HTMLRenderer htmlString={event.description} />
                              </Text>
                              {event.observation && (
                                <Text fontSize="sm" color={mutedColor}>
                                  {event.observation}
                                </Text>
                              )}
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Text fontSize="xs" color={mutedColor}>
                                {format(parseISO(event.date), 'MMM dd, yyyy')}
                              </Text>
                              <Text fontSize="xs" color={mutedColor}>
                                {format(parseISO(event.date), 'h:mm a')}
                              </Text>
                            </VStack>
                          </HStack>

                          {/* Event details */}
                          {(event.volume ||
                            event.concentration ||
                            event.area ||
                            event.equipment) && (
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                              {event.volume && (
                                <VStack spacing={1}>
                                  <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                                    Volume
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {event.volume}
                                  </Text>
                                </VStack>
                              )}
                              {event.concentration && (
                                <VStack spacing={1}>
                                  <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                                    Concentration
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {event.concentration}
                                  </Text>
                                </VStack>
                              )}
                              {event.area && (
                                <VStack spacing={1}>
                                  <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                                    Area
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {event.area}
                                  </Text>
                                </VStack>
                              )}
                              {event.equipment && (
                                <VStack spacing={1}>
                                  <Text fontSize="xs" color={mutedColor} fontWeight="medium">
                                    Equipment
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {event.equipment}
                                  </Text>
                                </VStack>
                              )}
                            </SimpleGrid>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </Box>
                </HStack>
              </Box>
            );
          })}

          {/* Show more/less button */}
          {filteredEvents.length > 4 && (
            <Box textAlign="center" pt={4}>
              <Button
                variant="ghost"
                colorScheme="green"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                leftIcon={<Icon as={showAll ? FaChevronUp : FaChevronDown} />}
              >
                {showAll ? `Show Less` : `Show ${filteredEvents.length - 4} More Activities`}
              </Button>
            </Box>
          )}

          {/* Summary stats */}
          <Box pt={4} borderTop="1px solid" borderColor={borderColor}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <VStack>
                <Text fontSize="lg" fontWeight="bold" color="green.500">
                  {events.filter((e) => e.certified).length}
                </Text>
                <Text fontSize="xs" color={mutedColor} textAlign="center">
                  Verified Events
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="lg" fontWeight="bold" color="blue.500">
                  {new Set(events.map((e) => getEventConfig(e).category)).size}
                </Text>
                <Text fontSize="xs" color={mutedColor} textAlign="center">
                  Activity Types
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="lg" fontWeight="bold" color="orange.500">
                  {Math.round(
                    (new Date().getTime() - new Date(events[0]?.date || new Date()).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </Text>
                <Text fontSize="xs" color={mutedColor} textAlign="center">
                  Days Tracked
                </Text>
              </VStack>
              <VStack>
                <Text fontSize="lg" fontWeight="bold" color="purple.500">
                  100%
                </Text>
                <Text fontSize="xs" color={mutedColor} textAlign="center">
                  Transparency
                </Text>
              </VStack>
            </SimpleGrid>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};
