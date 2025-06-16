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
  TagLeftIcon,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Avatar,
  AvatarBadge,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useBreakpointValue
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
  FaCertificate,
  FaThermometerHalf,
  FaCloudRain,
  FaSun,
  FaWind,
  FaDollarSign,
  FaRecycle,
  FaEye,
  FaChartLine,
  FaClock,
  FaUser,
  FaExpand,
  FaFlask,
  FaShieldAlt,
  FaAward,
  FaGlobeAmericas,
  FaHandHoldingHeart
} from 'react-icons/fa';
import { MdTimeline, MdEco, MdVerified, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface TimelineEvent {
  id: string;
  type: string;
  description: string;
  observation?: string;
  date: string;
  certified: boolean;
  index?: number;
  // Enhanced fields for better information display
  volume?: number;
  concentration?: number;
  area?: number;
  duration?: number;
  equipment?: string;
  // New fields for enhanced experience
  carbonImpact?: number; // kg CO2e
  costEstimate?: number; // USD
  weatherConditions?: {
    temperature?: number;
    humidity?: number;
    windSpeed?: number;
    conditions?: string;
  };
  sustainabilityScore?: number; // 1-10
  qrVisibility?: 'high' | 'medium' | 'low';
  operator?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
  efficiency?: number; // percentage
  consumerImpact?: string;
}

interface EnhancedProductTimelineProps {
  events: TimelineEvent[];
}

export const EnhancedProductTimeline: React.FC<EnhancedProductTimelineProps> = ({ events }) => {
  const intl = useIntl();
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Enhanced event categorization with better type detection
  const categorizedEvents = useMemo(() => {
    const categories = {
      irrigation: events.filter(
        (e) =>
          e.type.toLowerCase().includes('irrigation') ||
          e.type.toLowerCase().includes('water') ||
          e.description.toLowerCase().includes('riego') ||
          e.description.toLowerCase().includes('irrigation')
      ),
      chemical: events.filter(
        (e) =>
          e.type.toLowerCase().includes('chemical') ||
          e.type.toLowerCase().includes('fertilizer') ||
          e.type.toLowerCase().includes('pesticide')
      ),
      production: events.filter(
        (e) =>
          e.type.toLowerCase().includes('production') ||
          e.type.toLowerCase().includes('harvest') ||
          e.type.toLowerCase().includes('planting')
      ),
      weather: events.filter(
        (e) => e.type.toLowerCase().includes('weather') || e.type.toLowerCase().includes('climate')
      ),
      equipment: events.filter(
        (e) =>
          e.type.toLowerCase().includes('equipment') || e.type.toLowerCase().includes('machinery')
      ),
      other: events.filter(
        (e) =>
          !['irrigation', 'chemical', 'production', 'weather', 'equipment'].some(
            (cat) => e.type.toLowerCase().includes(cat) || e.description.toLowerCase().includes(cat)
          )
      )
    };
    return categories;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'all') return events;
    return categorizedEvents[selectedCategory as keyof typeof categorizedEvents] || [];
  }, [events, selectedCategory, categorizedEvents]);

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 4);

  // Calculate carbon impact summary
  const carbonSummary = useMemo(() => {
    const totalImpact = events.reduce((sum, event) => sum + (event.carbonImpact || 0), 0);
    const positiveImpact = events.filter((e) => (e.carbonImpact || 0) > 0).length;
    const negativeImpact = events.filter((e) => (e.carbonImpact || 0) < 0).length;
    return { totalImpact, positiveImpact, negativeImpact };
  }, [events]);

  // Enhanced event configuration with modern design
  const getEventConfig = (event: TimelineEvent) => {
    const type = event.type.toLowerCase();
    const description = event.description.toLowerCase();

    // Irrigation/Water events
    if (
      type.includes('irrigation') ||
      description.includes('riego') ||
      description.includes('irrigation')
    ) {
      return {
        icon: FaWater,
        color: 'blue.500',
        bgGradient: 'linear(to-br, blue.50, cyan.50)',
        borderColor: 'blue.200',
        title: '💧 Sistema de Riego',
        category: 'Irrigation',
        categoryColor: 'blue',
        emoji: '💧',
        priority: 'high'
      };
    }

    // Chemical events
    if (type.includes('chemical') || type.includes('fertilizer') || type.includes('pesticide')) {
      return {
        icon: FaFlask,
        color: 'orange.500',
        bgGradient: 'linear(to-br, orange.50, yellow.50)',
        borderColor: 'orange.200',
        title: '🧪 Aplicación Química',
        category: 'Chemical',
        categoryColor: 'orange',
        emoji: '🧪',
        priority: 'medium'
      };
    }

    // Production events
    if (type.includes('production') || type.includes('harvest') || type.includes('planting')) {
      return {
        icon: FaSeedling,
        color: 'green.500',
        bgGradient: 'linear(to-br, green.50, emerald.50)',
        borderColor: 'green.200',
        title: '🌱 Actividad Productiva',
        category: 'Production',
        categoryColor: 'green',
        emoji: '🌱',
        priority: 'high'
      };
    }

    // Weather events
    if (type.includes('weather') || type.includes('climate')) {
      return {
        icon: FaCloudRain,
        color: 'purple.500',
        bgGradient: 'linear(to-br, purple.50, indigo.50)',
        borderColor: 'purple.200',
        title: '🌤️ Condiciones Climáticas',
        category: 'Weather',
        categoryColor: 'purple',
        emoji: '🌤️',
        priority: 'medium'
      };
    }

    // Equipment events
    if (type.includes('equipment') || type.includes('machinery')) {
      return {
        icon: FaTractor,
        color: 'gray.600',
        bgGradient: 'linear(to-br, gray.50, slate.50)',
        borderColor: 'gray.300',
        title: '🚜 Equipamiento',
        category: 'Equipment',
        categoryColor: 'gray',
        emoji: '🚜',
        priority: 'low'
      };
    }

    // Default/Other events
    return {
      icon: FaInfoCircle,
      color: 'teal.500',
      bgGradient: 'linear(to-br, teal.50, cyan.50)',
      borderColor: 'teal.200',
      title: '📋 Actividad General',
      category: 'General',
      categoryColor: 'teal',
      emoji: '📋',
      priority: 'low'
    };
  };

  const categoryStats = useMemo(() => {
    return Object.entries(categorizedEvents).map(([key, eventList]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      count: eventList.length,
      color:
        key === 'irrigation'
          ? 'blue'
          : key === 'chemical'
          ? 'orange'
          : key === 'production'
          ? 'green'
          : key === 'weather'
          ? 'purple'
          : key === 'equipment'
          ? 'gray'
          : 'teal'
    }));
  }, [categorizedEvents]);

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onOpen();
  };

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
      {/* Carbon Impact Summary */}
      <Alert status="info" borderRadius="lg" mb={6} bg="green.50" borderColor="green.200">
        <AlertIcon as={MdEco} color="green.500" />
        <Box flex="1">
          <AlertTitle color="green.800">🌱 Transparencia de Carbono</AlertTitle>
          <AlertDescription color="green.700">
            <HStack spacing={4} mt={2}>
              <Text fontSize="sm">
                <strong>{events.length}</strong> eventos registrados
              </Text>
              <Text fontSize="sm">
                <strong>{carbonSummary.totalImpact.toFixed(1)}</strong> kg CO₂ impacto total
              </Text>
              <Text fontSize="sm">
                Visible para <strong>consumidores via QR</strong>
              </Text>
            </HStack>
          </AlertDescription>
        </Box>
      </Alert>

      {/* Enhanced Category Filter */}
      <VStack spacing={4} mb={6}>
        <Wrap spacing={2} justify="center">
          <WrapItem>
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'solid' : 'outline'}
              colorScheme="gray"
              onClick={() => setSelectedCategory('all')}
              borderRadius="full"
            >
              Todos ({events.length})
            </Button>
          </WrapItem>
          {categoryStats.map((category) => (
            <WrapItem key={category.key}>
              <Button
                size="sm"
                variant={selectedCategory === category.key ? 'solid' : 'outline'}
                colorScheme={category.color}
                onClick={() => setSelectedCategory(category.key)}
                isDisabled={category.count === 0}
                borderRadius="full"
              >
                {category.label} ({category.count})
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>

      {/* Enhanced Timeline Events */}
      <VStack spacing={6} align="stretch">
        {displayedEvents.map((event, index) => {
          const eventConfig = getEventConfig(event);
          const hasExtendedInfo =
            event.carbonImpact ||
            event.costEstimate ||
            event.weatherConditions ||
            event.sustainabilityScore;

          return (
            <Box key={event.id} position="relative">
              {/* Timeline connector line */}
              {index < displayedEvents.length - 1 && (
                <Box
                  position="absolute"
                  left={isMobile ? '24px' : '32px'}
                  top="60px"
                  width="3px"
                  height="calc(100% - 20px)"
                  bgGradient="linear(to-b, gray.200, gray.100)"
                  borderRadius="full"
                  zIndex={0}
                />
              )}

              <HStack spacing={isMobile ? 3 : 6} align="start" position="relative" zIndex={1}>
                {/* Enhanced Event Icon */}
                <VStack spacing={2}>
                  <Circle
                    size={isMobile ? '48px' : '56px'}
                    bg={eventConfig.color}
                    color="white"
                    flexShrink={0}
                    boxShadow="lg"
                    border="4px solid white"
                    position="relative"
                  >
                    <Icon as={eventConfig.icon} boxSize={isMobile ? 5 : 6} />
                    {event.certified && (
                      <Circle
                        size="20px"
                        bg="green.500"
                        color="white"
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        border="2px solid white"
                      >
                        <Icon as={MdVerified} boxSize={3} />
                      </Circle>
                    )}
                  </Circle>

                  {/* Priority indicator */}
                  {eventConfig.priority === 'high' && (
                    <Badge colorScheme="red" size="xs" borderRadius="full">
                      Alta
                    </Badge>
                  )}
                </VStack>

                {/* Enhanced Event Content Card */}
                <Box
                  flex={1}
                  bg={cardBg}
                  bgGradient={eventConfig.bgGradient}
                  p={isMobile ? 4 : 6}
                  borderRadius="2xl"
                  border="2px solid"
                  borderColor={eventConfig.borderColor}
                  boxShadow="xl"
                  position="relative"
                  cursor="pointer"
                  onClick={() => handleEventClick(event)}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '2xl',
                    borderColor: eventConfig.color
                  }}
                  transition="all 0.3s ease"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    left: '-12px',
                    top: '24px',
                    width: 0,
                    height: 0,
                    borderTop: '12px solid transparent',
                    borderBottom: '12px solid transparent',
                    borderRight: `12px solid ${eventConfig.borderColor}`
                  }}
                >
                  <VStack align="start" spacing={4}>
                    {/* Enhanced Header */}
                    <HStack justify="space-between" w="full" flexWrap="wrap">
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Text fontSize="lg" fontWeight="bold" color={textColor}>
                            {eventConfig.emoji}
                          </Text>
                          <Heading as="h4" size="md" color={textColor}>
                            {event.description || eventConfig.title}
                          </Heading>
                        </HStack>

                        <HStack spacing={4} flexWrap="wrap">
                          <HStack spacing={1}>
                            <Icon as={FaCalendarAlt} boxSize={3} color={mutedColor} />
                            <Text fontSize="sm" color={mutedColor} fontWeight="medium">
                              {new Date(event.date).toLocaleDateString('es-ES', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Text>
                          </HStack>

                          {event.operator && (
                            <HStack spacing={1}>
                              <Icon as={FaUser} boxSize={3} color={mutedColor} />
                              <Text fontSize="sm" color={mutedColor}>
                                {event.operator.name || 'Operador'}
                              </Text>
                            </HStack>
                          )}
                        </HStack>
                      </VStack>

                      <VStack align="end" spacing={2}>
                        <Tag
                          size="md"
                          colorScheme={eventConfig.categoryColor}
                          variant="solid"
                          borderRadius="full"
                        >
                          <TagLabel fontWeight="bold">{eventConfig.category}</TagLabel>
                        </Tag>

                        {event.qrVisibility && (
                          <HStack spacing={1}>
                            <Icon as={FaEye} boxSize={3} color={mutedColor} />
                            <Text fontSize="xs" color={mutedColor}>
                              QR: {event.qrVisibility}
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </HStack>

                    {/* Enhanced Metrics Grid */}
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
                      {/* Carbon Impact */}
                      {event.carbonImpact !== undefined && (
                        <Stat size="sm">
                          <StatLabel fontSize="xs" color={mutedColor}>
                            <HStack spacing={1}>
                              <Icon as={MdEco} boxSize={3} />
                              <Text>Impacto CO₂</Text>
                            </HStack>
                          </StatLabel>
                          <StatNumber
                            fontSize="md"
                            color={event.carbonImpact > 0 ? 'red.500' : 'green.500'}
                            fontWeight="bold"
                          >
                            {event.carbonImpact > 0 ? '+' : ''}
                            {event.carbonImpact} kg
                          </StatNumber>
                          <StatHelpText fontSize="xs">
                            <StatArrow type={event.carbonImpact > 0 ? 'increase' : 'decrease'} />
                            {event.carbonImpact > 0 ? 'Emisión' : 'Reducción'}
                          </StatHelpText>
                        </Stat>
                      )}

                      {/* Sustainability Score */}
                      {event.sustainabilityScore && (
                        <Stat size="sm">
                          <StatLabel fontSize="xs" color={mutedColor}>
                            <HStack spacing={1}>
                              <Icon as={FaAward} boxSize={3} />
                              <Text>Sostenibilidad</Text>
                            </HStack>
                          </StatLabel>
                          <StatNumber fontSize="md" color="green.500" fontWeight="bold">
                            {event.sustainabilityScore}/10
                          </StatNumber>
                          <Progress
                            value={event.sustainabilityScore * 10}
                            size="sm"
                            colorScheme="green"
                            borderRadius="full"
                          />
                        </Stat>
                      )}

                      {/* Cost Estimate */}
                      {event.costEstimate && (
                        <Stat size="sm">
                          <StatLabel fontSize="xs" color={mutedColor}>
                            <HStack spacing={1}>
                              <Icon as={FaDollarSign} boxSize={3} />
                              <Text>Costo Est.</Text>
                            </HStack>
                          </StatLabel>
                          <StatNumber fontSize="md" color="blue.500" fontWeight="bold">
                            ${event.costEstimate}
                          </StatNumber>
                          <StatHelpText fontSize="xs">USD</StatHelpText>
                        </Stat>
                      )}

                      {/* Efficiency */}
                      {event.efficiency && (
                        <Stat size="sm">
                          <StatLabel fontSize="xs" color={mutedColor}>
                            <HStack spacing={1}>
                              <Icon as={FaChartLine} boxSize={3} />
                              <Text>Eficiencia</Text>
                            </HStack>
                          </StatLabel>
                          <StatNumber fontSize="md" color="purple.500" fontWeight="bold">
                            {event.efficiency}%
                          </StatNumber>
                          <Progress
                            value={event.efficiency}
                            size="sm"
                            colorScheme="purple"
                            borderRadius="full"
                          />
                        </Stat>
                      )}
                    </SimpleGrid>

                    {/* Observation/Notes */}
                    {event.observation && (
                      <Box
                        p={3}
                        bg="whiteAlpha.700"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        w="full"
                      >
                        <Text fontSize="sm" color={textColor} lineHeight="1.5">
                          <Icon as={FaInfoCircle} boxSize={3} color={mutedColor} mr={2} />
                          {event.observation}
                        </Text>
                      </Box>
                    )}

                    {/* Consumer Impact Message */}
                    {event.consumerImpact && (
                      <Alert status="success" size="sm" borderRadius="lg">
                        <AlertIcon as={FaHandHoldingHeart} />
                        <AlertDescription fontSize="sm">
                          <strong>Para el consumidor:</strong> {event.consumerImpact}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Quick Details Row */}
                    <HStack spacing={4} w="full" flexWrap="wrap" pt={2}>
                      {event.area && (
                        <HStack spacing={1}>
                          <Icon as={FaMapMarkerAlt} color="green.500" boxSize={3} />
                          <Text fontSize="xs" color={mutedColor}>
                            <strong>{event.area}</strong> ha
                          </Text>
                        </HStack>
                      )}

                      {event.duration && (
                        <HStack spacing={1}>
                          <Icon as={FaClock} color="blue.500" boxSize={3} />
                          <Text fontSize="xs" color={mutedColor}>
                            <strong>{event.duration}</strong>h
                          </Text>
                        </HStack>
                      )}

                      {event.volume && (
                        <HStack spacing={1}>
                          <Icon as={FaWater} color="cyan.500" boxSize={3} />
                          <Text fontSize="xs" color={mutedColor}>
                            <strong>{event.volume}</strong>L
                          </Text>
                        </HStack>
                      )}

                      <HStack spacing={1} ml="auto">
                        <Icon as={FaExpand} color={mutedColor} boxSize={3} />
                        <Text fontSize="xs" color={mutedColor}>
                          Toca para más detalles
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>
              </HStack>
            </Box>
          );
        })}
      </VStack>

      {/* Enhanced Show More/Less Button */}
      {filteredEvents.length > 4 && (
        <Flex justify="center" mt={8}>
          <Button
            variant="outline"
            colorScheme="blue"
            size="lg"
            leftIcon={<Icon as={showAll ? FaChevronUp : FaChevronDown} />}
            onClick={() => setShowAll(!showAll)}
            borderRadius="full"
            px={8}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            transition="all 0.2s"
          >
            {showAll ? `Mostrar Menos` : `Ver ${filteredEvents.length - 4} Eventos Más`}
          </Button>
        </Flex>
      )}

      {/* Enhanced Event Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl" maxH="90vh">
          <ModalHeader>
            <HStack spacing={3}>
              {selectedEvent && (
                <>
                  <Circle size="40px" bg={getEventConfig(selectedEvent).color} color="white">
                    <Icon as={getEventConfig(selectedEvent).icon} boxSize={5} />
                  </Circle>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="bold">
                      {getEventConfig(selectedEvent).emoji} {selectedEvent.description}
                    </Text>
                    <Text fontSize="sm" color={mutedColor}>
                      {new Date(selectedEvent.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </VStack>
                </>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            {selectedEvent && (
              <VStack spacing={6} align="stretch">
                {/* Detailed Metrics */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {selectedEvent.carbonImpact !== undefined && (
                    <Stat
                      p={4}
                      bg="green.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="green.200"
                    >
                      <StatLabel color="green.700">
                        <HStack spacing={2}>
                          <Icon as={MdEco} />
                          <Text>Impacto de Carbono</Text>
                        </HStack>
                      </StatLabel>
                      <StatNumber color={selectedEvent.carbonImpact > 0 ? 'red.500' : 'green.500'}>
                        {selectedEvent.carbonImpact > 0 ? '+' : ''}
                        {selectedEvent.carbonImpact} kg CO₂
                      </StatNumber>
                      <StatHelpText>
                        {selectedEvent.carbonImpact > 0
                          ? 'Contribuye a las emisiones'
                          : 'Reduce las emisiones'}
                      </StatHelpText>
                    </Stat>
                  )}

                  {selectedEvent.sustainabilityScore && (
                    <Stat
                      p={4}
                      bg="blue.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="blue.200"
                    >
                      <StatLabel color="blue.700">
                        <HStack spacing={2}>
                          <Icon as={FaAward} />
                          <Text>Puntuación de Sostenibilidad</Text>
                        </HStack>
                      </StatLabel>
                      <StatNumber color="blue.500">
                        {selectedEvent.sustainabilityScore}/10
                      </StatNumber>
                      <Progress
                        value={selectedEvent.sustainabilityScore * 10}
                        colorScheme="blue"
                        size="lg"
                        borderRadius="full"
                        mt={2}
                      />
                    </Stat>
                  )}
                </SimpleGrid>

                {/* Weather Conditions */}
                {selectedEvent.weatherConditions && (
                  <Box
                    p={4}
                    bg="purple.50"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="purple.200"
                  >
                    <Heading size="sm" color="purple.700" mb={3}>
                      <Icon as={FaCloudRain} mr={2} />
                      Condiciones Climáticas
                    </Heading>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                      {selectedEvent.weatherConditions.temperature && (
                        <HStack>
                          <Icon as={FaThermometerHalf} color="red.500" />
                          <Text fontSize="sm">{selectedEvent.weatherConditions.temperature}°C</Text>
                        </HStack>
                      )}
                      {selectedEvent.weatherConditions.humidity && (
                        <HStack>
                          <Icon as={FaWater} color="blue.500" />
                          <Text fontSize="sm">
                            {selectedEvent.weatherConditions.humidity}% humedad
                          </Text>
                        </HStack>
                      )}
                      {selectedEvent.weatherConditions.windSpeed && (
                        <HStack>
                          <Icon as={FaWind} color="gray.500" />
                          <Text fontSize="sm">
                            {selectedEvent.weatherConditions.windSpeed} km/h
                          </Text>
                        </HStack>
                      )}
                      {selectedEvent.weatherConditions.conditions && (
                        <HStack>
                          <Icon as={FaSun} color="yellow.500" />
                          <Text fontSize="sm">{selectedEvent.weatherConditions.conditions}</Text>
                        </HStack>
                      )}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Detailed Observation */}
                {selectedEvent.observation && (
                  <Box p={4} bg="gray.50" borderRadius="lg">
                    <Heading size="sm" color="gray.700" mb={2}>
                      <Icon as={FaInfoCircle} mr={2} />
                      Notas Detalladas
                    </Heading>
                    <Text color="gray.700" lineHeight="1.6">
                      {selectedEvent.observation}
                    </Text>
                  </Box>
                )}

                {/* Consumer Impact */}
                {selectedEvent.consumerImpact && (
                  <Alert status="info" borderRadius="lg">
                    <AlertIcon as={FaGlobeAmericas} />
                    <Box>
                      <AlertTitle>Impacto para el Consumidor</AlertTitle>
                      <AlertDescription>{selectedEvent.consumerImpact}</AlertDescription>
                    </Box>
                  </Alert>
                )}

                {/* Technical Details */}
                <Box p={4} bg="teal.50" borderRadius="lg" border="1px solid" borderColor="teal.200">
                  <Heading size="sm" color="teal.700" mb={3}>
                    <Icon as={FaFlask} mr={2} />
                    Detalles Técnicos
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {selectedEvent.equipment && (
                      <HStack>
                        <Icon as={FaTractor} color="gray.600" />
                        <Text fontSize="sm">
                          <strong>Equipo:</strong> {selectedEvent.equipment}
                        </Text>
                      </HStack>
                    )}
                    {selectedEvent.area && (
                      <HStack>
                        <Icon as={FaMapMarkerAlt} color="green.500" />
                        <Text fontSize="sm">
                          <strong>Área:</strong> {selectedEvent.area} hectáreas
                        </Text>
                      </HStack>
                    )}
                    {selectedEvent.volume && (
                      <HStack>
                        <Icon as={FaWater} color="blue.500" />
                        <Text fontSize="sm">
                          <strong>Volumen:</strong> {selectedEvent.volume} litros
                        </Text>
                      </HStack>
                    )}
                    {selectedEvent.duration && (
                      <HStack>
                        <Icon as={FaClock} color="purple.500" />
                        <Text fontSize="sm">
                          <strong>Duración:</strong> {selectedEvent.duration} horas
                        </Text>
                      </HStack>
                    )}
                    {selectedEvent.concentration && (
                      <HStack>
                        <Icon as={FaBolt} color="orange.500" />
                        <Text fontSize="sm">
                          <strong>Concentración:</strong> {selectedEvent.concentration}%
                        </Text>
                      </HStack>
                    )}
                    {selectedEvent.costEstimate && (
                      <HStack>
                        <Icon as={FaDollarSign} color="green.600" />
                        <Text fontSize="sm">
                          <strong>Costo:</strong> ${selectedEvent.costEstimate} USD
                        </Text>
                      </HStack>
                    )}
                  </SimpleGrid>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
