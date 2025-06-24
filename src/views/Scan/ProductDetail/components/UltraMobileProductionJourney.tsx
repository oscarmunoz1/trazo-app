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
  useColorModeValue,
  Flex,
  Card,
  CardBody,
  Stack,
  useBreakpointValue,
  Divider
} from '@chakra-ui/react';
import {
  FaWater,
  FaBolt,
  FaSeedling,
  FaLeaf,
  FaTractor,
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

interface UltraMobileProductionJourneyProps {
  events: TimelineEvent[];
}

export const UltraMobileProductionJourney: React.FC<UltraMobileProductionJourneyProps> = ({
  events
}) => {
  const intl = useIntl();
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Get event configuration based on type
  const getEventConfig = (event: TimelineEvent) => {
    const type = event.type.toLowerCase();
    const description = event.description.toLowerCase();

    if (
      type.includes('chemical') ||
      description.includes('fertilizer') ||
      description.includes('spray')
    ) {
      return {
        icon: FaFlask,
        color: 'orange.500',
        bgColor: 'orange.50',
        category: 'Chemical',
        categoryColor: 'orange'
      };
    }

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
        category: 'Production',
        categoryColor: 'green'
      };
    }

    if (
      type.includes('equipment') ||
      description.includes('tractor') ||
      description.includes('machinery')
    ) {
      return {
        icon: FaTractor,
        color: 'blue.500',
        bgColor: 'blue.50',
        category: 'Equipment',
        categoryColor: 'blue'
      };
    }

    return {
      icon: MdEco,
      color: 'gray.500',
      bgColor: 'gray.50',
      category: 'General',
      categoryColor: 'gray'
    };
  };

  // Sort and filter events
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() // Most recent first
  );

  const filteredEvents =
    selectedCategory === 'all'
      ? sortedEvents
      : sortedEvents.filter((event) => {
          const config = getEventConfig(event);
          return config.category.toLowerCase() === selectedCategory.toLowerCase();
        });

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);
  const categories = ['all', ...new Set(events.map((event) => getEventConfig(event).category))];

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return {
        short: format(date, 'MMM dd'),
        time: format(date, 'h:mm a'),
        full: format(date, 'MMM dd, yyyy')
      };
    } catch (error) {
      return { short: 'Unknown', time: '', full: 'Date unknown' };
    }
  };

  return (
    <Box>
      {/* Ultra-Compact Header */}
      <VStack spacing={4} mb={6}>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align="center"
          w="full"
          gap={3}
        >
          <VStack spacing={1} align={{ base: 'center', sm: 'start' }}>
            <Heading size={{ base: 'md', md: 'lg' }} color={textColor}>
              Production Journey
            </Heading>
            <HStack spacing={4} fontSize="sm" color={mutedColor}>
              <Text>{filteredEvents.length} activities</Text>
              <Text>{filteredEvents.filter((e) => e.certified).length} verified</Text>
            </HStack>
          </VStack>

          <Badge colorScheme="green" fontSize="sm" px={3} py={2} borderRadius="full">
            <HStack spacing={1}>
              <Icon as={MdVerified} boxSize={3} />
              <Text>{filteredEvents.filter((e) => e.certified).length} Verified</Text>
            </HStack>
          </Badge>
        </Flex>

        {/* Simplified Category Filter */}
        <Stack direction="row" spacing={2} wrap="wrap" justify="center" w="full">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'solid' : 'outline'}
            colorScheme="green"
            onClick={() => setSelectedCategory('all')}
            borderRadius="full"
            fontSize="xs"
            minW="fit-content"
          >
            All Activities
          </Button>
          {categories.slice(1, 3).map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'solid' : 'outline'}
              colorScheme="gray"
              onClick={() => setSelectedCategory(category)}
              borderRadius="full"
              fontSize="xs"
              minW="fit-content"
            >
              {category}
            </Button>
          ))}
        </Stack>
      </VStack>

      {/* Mobile-First Event Cards */}
      <VStack spacing={3} align="stretch">
        {displayedEvents.map((event, index) => {
          const config = getEventConfig(event);
          const dateInfo = formatDate(event.date);

          return (
            <Card
              key={event.id}
              bg={config.bgColor}
              borderLeft="3px solid"
              borderColor={config.color}
              shadow="sm"
              borderRadius="lg"
              overflow="hidden"
            >
              <CardBody p={4}>
                {/* Single Column Mobile Layout */}
                <VStack spacing={3} align="stretch">
                  {/* Top Row: Icon + Title + Date */}
                  <Flex align="flex-start" gap={3}>
                    <Circle size="36px" bg={config.color} color="white" flexShrink={0}>
                      <Icon as={config.icon} boxSize={4} />
                    </Circle>

                    <VStack align="start" spacing={1} flex="1" minW="0">
                      <Heading
                        size="sm"
                        color={textColor}
                        noOfLines={2}
                        fontSize={{ base: 'md', md: 'lg' }}
                        lineHeight="1.4"
                      >
                        {event.description}
                      </Heading>

                      <HStack spacing={2} flexWrap="wrap">
                        <Badge
                          colorScheme={config.categoryColor}
                          size="sm"
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {config.category}
                        </Badge>
                        {event.certified && (
                          <Badge colorScheme="green" size="sm" borderRadius="full">
                            <HStack spacing={1}>
                              <Icon as={MdVerified} boxSize={2} />
                              <Text fontSize="xs">Verified</Text>
                            </HStack>
                          </Badge>
                        )}
                      </HStack>
                    </VStack>

                    {/* Date Column */}
                    <VStack spacing={0} align="end" flexShrink={0} minW="60px">
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        {dateInfo.short}
                      </Text>
                      {dateInfo.time && (
                        <Text fontSize="xs" color={mutedColor}>
                          {dateInfo.time}
                        </Text>
                      )}
                    </VStack>
                  </Flex>

                  {/* Description */}
                  {event.observation && (
                    <Box pl={10}>
                      <Text fontSize="sm" color={mutedColor} noOfLines={3} lineHeight="1.5">
                        {event.observation}
                      </Text>
                    </Box>
                  )}

                  {/* Metadata - Only show if exists */}
                  {(event.volume || event.area || event.concentration) && (
                    <>
                      <Divider />
                      <Flex
                        gap={4}
                        fontSize="xs"
                        color={mutedColor}
                        flexWrap="wrap"
                        justify="space-between"
                      >
                        {event.volume && (
                          <HStack spacing={1}>
                            <Text fontWeight="semibold" color={textColor}>
                              Vol:
                            </Text>
                            <Text>{event.volume}</Text>
                          </HStack>
                        )}
                        {event.area && (
                          <HStack spacing={1}>
                            <Text fontWeight="semibold" color={textColor}>
                              Area:
                            </Text>
                            <Text>{event.area}</Text>
                          </HStack>
                        )}
                        {event.concentration && (
                          <HStack spacing={1}>
                            <Text fontWeight="semibold" color={textColor}>
                              Conc:
                            </Text>
                            <Text>{event.concentration}</Text>
                          </HStack>
                        )}
                      </Flex>
                    </>
                  )}
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </VStack>

      {/* Show More Button */}
      {filteredEvents.length > 3 && (
        <Flex justify="center" mt={6}>
          <Button
            variant="outline"
            colorScheme="green"
            leftIcon={<Icon as={showAll ? FaChevronUp : FaChevronDown} />}
            onClick={() => setShowAll(!showAll)}
            size="sm"
            borderRadius="full"
            px={6}
          >
            {showAll ? 'Show Less' : `Show ${filteredEvents.length - 3} More Activities`}
          </Button>
        </Flex>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <VStack spacing={4} py={12} textAlign="center">
          <Circle size="80px" bg="gray.100">
            <Icon as={MdTimeline} boxSize={8} color="gray.400" />
          </Circle>
          <VStack spacing={2}>
            <Heading size="md" color="gray.600">
              No activities found
            </Heading>
            <Text fontSize="sm" color="gray.500" maxW="250px">
              {selectedCategory === 'all'
                ? 'No production activities have been recorded yet.'
                : `No ${selectedCategory.toLowerCase()} activities found.`}
            </Text>
          </VStack>
        </VStack>
      )}
    </Box>
  );
};
