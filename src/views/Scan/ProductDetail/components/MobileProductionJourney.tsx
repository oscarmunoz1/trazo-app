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
  useColorModeValue,
  Flex,
  Card,
  CardBody,
  Stack,
  useBreakpointValue
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

interface MobileProductionJourneyProps {
  events: TimelineEvent[];
}

export const MobileProductionJourney: React.FC<MobileProductionJourneyProps> = ({ events }) => {
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

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);

  // Get unique categories for filter
  const categories = ['all', ...new Set(events.map((event) => getEventConfig(event).category))];

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, isMobile ? 'MMM dd' : 'MMM dd, yyyy');
    } catch (error) {
      return 'Date unknown';
    }
  };

  return (
    <Box>
      {/* Header with Summary */}
      <VStack spacing={4} align="stretch" mb={6}>
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', sm: 'center' }}
          gap={4}
        >
          <VStack align={{ base: 'center', sm: 'start' }} spacing={1}>
            <Heading size="md" color={textColor} textAlign={{ base: 'center', sm: 'left' }}>
              Production Journey
            </Heading>
            <Text fontSize="sm" color={mutedColor} textAlign={{ base: 'center', sm: 'left' }}>
              {filteredEvents.length} activities recorded
            </Text>
          </VStack>

          <Badge
            colorScheme="green"
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
            alignSelf={{ base: 'center', sm: 'flex-start' }}
          >
            <HStack spacing={1}>
              <Icon as={MdVerified} boxSize={3} />
              <Text>{filteredEvents.filter((e) => e.certified).length} Verified</Text>
            </HStack>
          </Badge>
        </Flex>

        {/* Category Filter - Mobile Optimized */}
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          spacing={2}
          wrap="wrap"
          justify={{ base: 'center', sm: 'flex-start' }}
        >
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'solid' : 'outline'}
            colorScheme="green"
            onClick={() => setSelectedCategory('all')}
            borderRadius="full"
            fontSize="xs"
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
              display={{ base: 'none', sm: 'flex' }}
            >
              {category.replace(' Activity', '').replace(' Application', '')}
            </Button>
          ))}
        </Stack>
      </VStack>

      {/* Events List - Mobile Optimized */}
      <VStack spacing={3} align="stretch">
        {displayedEvents.map((event, index) => {
          const config = getEventConfig(event);

          return (
            <Card
              key={event.id}
              bg={config.bgColor}
              borderLeft="4px solid"
              borderColor={config.color}
              shadow="sm"
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
            >
              <CardBody p={{ base: 3, sm: 4 }}>
                <Flex direction={{ base: 'column', sm: 'row' }} gap={3}>
                  {/* Icon and Category */}
                  <Flex align="center" gap={3} minW="fit-content">
                    <Circle size="40px" bg={config.color} color="white">
                      <Icon as={config.icon} boxSize={4} />
                    </Circle>

                    <VStack align="start" spacing={0} flex="1">
                      <Badge
                        colorScheme={config.categoryColor}
                        size="sm"
                        borderRadius="full"
                        fontSize="xs"
                      >
                        {config.category}
                      </Badge>
                      {event.certified && (
                        <Badge colorScheme="green" size="xs" borderRadius="full">
                          <HStack spacing={1}>
                            <Icon as={MdVerified} boxSize={2} />
                            <Text>Verified</Text>
                          </HStack>
                        </Badge>
                      )}
                    </VStack>
                  </Flex>

                  {/* Content */}
                  <VStack align="start" spacing={2} flex="1" minW="0">
                    <Heading size="sm" color={textColor} noOfLines={2}>
                      {event.description}
                    </Heading>

                    {event.observation && (
                      <Text fontSize="sm" color={mutedColor} noOfLines={2}>
                        {event.observation}
                      </Text>
                    )}

                    {/* Metadata - Mobile Optimized */}
                    <Flex
                      direction={{ base: 'column', sm: 'row' }}
                      gap={{ base: 1, sm: 4 }}
                      fontSize="xs"
                      color={mutedColor}
                      w="full"
                    >
                      <HStack spacing={1}>
                        <Icon as={FaCalendarAlt} />
                        <Text>{formatDate(event.date)}</Text>
                      </HStack>

                      {(event.volume || event.area || event.concentration) && (
                        <Flex gap={2} wrap="wrap">
                          {event.volume && <Text>Vol: {event.volume}</Text>}
                          {event.area && <Text>Area: {event.area}</Text>}
                          {event.concentration && <Text>Conc: {event.concentration}</Text>}
                        </Flex>
                      )}
                    </Flex>
                  </VStack>

                  {/* Date on Right for Desktop */}
                  <VStack
                    align="end"
                    spacing={1}
                    minW="fit-content"
                    display={{ base: 'none', md: 'flex' }}
                  >
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      {format(parseISO(event.date), 'MMM dd')}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>
                      {format(parseISO(event.date), 'yyyy')}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>
                      {format(parseISO(event.date), 'h:mm a')}
                    </Text>
                  </VStack>
                </Flex>
              </CardBody>
            </Card>
          );
        })}
      </VStack>

      {/* Show More Button */}
      {filteredEvents.length > 3 && (
        <Flex justify="center" mt={4}>
          <Button
            variant="outline"
            colorScheme="green"
            leftIcon={<Icon as={showAll ? FaChevronUp : FaChevronDown} />}
            onClick={() => setShowAll(!showAll)}
            size="sm"
            borderRadius="full"
          >
            {showAll ? `Show Less` : `Show ${filteredEvents.length - 3} More Activities`}
          </Button>
        </Flex>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <VStack spacing={3} py={8} textAlign="center">
          <Icon as={MdTimeline} boxSize={12} color="gray.400" />
          <Heading as="h4" size="md" color="gray.600">
            No activities found
          </Heading>
          <Text fontSize="sm" color="gray.400">
            {selectedCategory === 'all'
              ? 'No production activities have been recorded yet.'
              : `No ${selectedCategory.toLowerCase()} activities found.`}
          </Text>
        </VStack>
      )}
    </Box>
  );
};
