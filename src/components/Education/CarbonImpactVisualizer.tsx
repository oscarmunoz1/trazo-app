import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  Tooltip,
  Button,
  Progress,
  Flex,
  Image,
  useDisclosure
} from '@chakra-ui/react';
import {
  FiHome,
  FiZap,
  FiDroplet,
  FiTruck,
  FiInfo,
  FiTrendingDown,
  FiTrendingUp,
  FiRefreshCw,
  FiNavigation,
  FiActivity,
  FiTarget
} from 'react-icons/fi';
import EducationModal from './EducationModal';
import { useGetCarbonImpactExamplesQuery } from '../../store/api/carbonApi';

interface CarbonExample {
  category: string;
  icon: string;
  value: number;
  unit: string;
  description: string;
  context: string;
  visual_aid?: string;
  comparison_type: 'equivalent' | 'offset' | 'saved';
}

interface CarbonImpactData {
  carbon_value: number;
  carbon_unit: string;
  examples: CarbonExample[];
  context: {
    farm_type?: string;
    region?: string;
    time_period?: string;
  };
  impact_level: 'low' | 'medium' | 'high';
  positive_impact: boolean;
  last_updated: string;
}

interface CarbonImpactVisualizerProps {
  carbonValue: number;
  carbonUnit?: string;
  contextData?: any;
  compact?: boolean;
  showComparisons?: boolean;
  maxExamples?: number;
}

const iconMap = {
  car: FiNavigation,
  home: FiHome,
  electricity: FiZap,
  water: FiDroplet,
  truck: FiTruck,
  plane: FiActivity,
  tree: FiTarget,
  recycle: FiRefreshCw
};

const CarbonImpactVisualizer: React.FC<CarbonImpactVisualizerProps> = ({
  carbonValue,
  carbonUnit = 'kg CO2e',
  contextData,
  compact = false,
  showComparisons = true,
  maxExamples = 6
}) => {
  const [selectedExample, setSelectedExample] = useState<any>(null);

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const positiveColor = useColorModeValue('green.500', 'green.400');
  const negativeColor = useColorModeValue('red.500', 'red.400');

  const {
    data: impactData,
    isLoading: loading,
    error,
    refetch: fetchCarbonExamples
  } = useGetCarbonImpactExamplesQuery(
    {
      value: carbonValue,
      unit: carbonUnit,
      maxExamples,
      context: contextData
    },
    {
      skip: carbonValue === undefined || carbonValue === null
    }
  );

  const getIcon = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || FiInfo;
  };

  const getImpactColor = (impactLevel: string, positiveImpact: boolean) => {
    if (positiveImpact) {
      return positiveColor;
    }

    switch (impactLevel) {
      case 'high':
        return 'red.500';
      case 'medium':
        return 'orange.500';
      case 'low':
        return 'yellow.500';
      default:
        return 'gray.500';
    }
  };

  const getComparisonTypeColor = (type: string) => {
    switch (type) {
      case 'equivalent':
        return 'blue';
      case 'offset':
        return 'green';
      case 'saved':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getComparisonTypeLabel = (type: string) => {
    switch (type) {
      case 'equivalent':
        return 'Same as';
      case 'offset':
        return 'Offset by';
      case 'saved':
        return 'Saves';
      default:
        return 'Equals';
    }
  };

  const ExampleCard = ({ example }: { example: any }) => {
    const IconComponent = getIcon(example.icon);
    const comparisonColor = getComparisonTypeColor(example.comparison_type);

    return (
      <Card
        variant="outline"
        borderColor={borderColor}
        cursor="pointer"
        onClick={() => setSelectedExample(example)}
        _hover={{
          borderColor: accentColor,
          transform: 'translateY(-2px)',
          shadow: 'md'
        }}
        transition="all 0.2s"
      >
        <CardBody p={4}>
          <VStack spacing={3} align="center">
            <Box
              p={3}
              borderRadius="full"
              bg={`${comparisonColor}.50`}
              color={`${comparisonColor}.600`}
            >
              <Icon as={IconComponent} boxSize={6} />
            </Box>

            <VStack spacing={1} textAlign="center">
              <Badge colorScheme={comparisonColor} size="sm">
                {getComparisonTypeLabel(example.comparison_type)}
              </Badge>

              <Text fontWeight="bold" fontSize="lg" color={textColor}>
                {example.value.toLocaleString()} {example.unit}
              </Text>

              <Text fontSize="sm" color="gray.600" fontWeight="medium">
                {example.category}
              </Text>

              <Text fontSize="xs" color="gray.500" textAlign="center" lineHeight="short">
                {example.description}
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const ImpactSummary = () => {
    if (!impactData) return null;

    const impactColor = getImpactColor(impactData.impact_level, impactData.positive_impact);
    const ImpactIcon = impactData.positive_impact ? FiTrendingDown : FiTrendingUp;

    return (
      <Box
        p={4}
        bg={`${impactData.positive_impact ? 'green' : 'red'}.50`}
        borderRadius="md"
        border="1px solid"
        borderColor={`${impactData.positive_impact ? 'green' : 'red'}.200`}
      >
        <HStack justify="space-between" mb={3}>
          <HStack>
            <Icon as={ImpactIcon} color={impactColor} boxSize={5} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" color={impactColor}>
                {impactData.carbon_value.toFixed(2)} {impactData.carbon_unit}
              </Text>
              <Text fontSize="sm" color={`${impactData.positive_impact ? 'green' : 'red'}.700`}>
                {impactData.positive_impact ? 'Carbon Reduced' : 'Carbon Impact'}
              </Text>
            </VStack>
          </HStack>

          <Badge
            colorScheme={impactData.positive_impact ? 'green' : 'red'}
            textTransform="capitalize"
          >
            {impactData.impact_level} Impact
          </Badge>
        </HStack>

        {impactData.context && (
          <VStack spacing={1} align="start">
            {impactData.context.farm_type && (
              <Text fontSize="xs" color="gray.600">
                Farm Type: {impactData.context.farm_type}
              </Text>
            )}
            {impactData.context.region && (
              <Text fontSize="xs" color="gray.600">
                Region: {impactData.context.region}
              </Text>
            )}
            {impactData.context.time_period && (
              <Text fontSize="xs" color="gray.600">
                Period: {impactData.context.time_period}
              </Text>
            )}
          </VStack>
        )}
      </Box>
    );
  };

  const ExampleModal = () => {
    if (!selectedExample) return null;

    return (
      <EducationModal
        isOpen={!!selectedExample}
        onClose={() => setSelectedExample(null)}
        topic="carbon-examples"
        contextData={{
          example: selectedExample,
          carbon_value: carbonValue,
          carbon_unit: carbonUnit
        }}
        triggerSource="carbon-impact-visualizer"
      />
    );
  };

  if (loading) {
    return (
      <Box p={4}>
        <VStack spacing={4}>
          <Skeleton height="60px" width="100%" />
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} w="full">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} height="120px" />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="medium">Unable to Load Carbon Examples</Text>
          <Text fontSize="sm">Unable to load carbon impact examples. Please try again.</Text>
          <Button size="sm" onClick={() => fetchCarbonExamples()}>
            Try Again
          </Button>
        </VStack>
      </Alert>
    );
  }

  if (!impactData) return null;

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={compact ? 4 : 6}
      maxW="100%"
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size={compact ? 'md' : 'lg'} color={textColor} mb={2}>
            Carbon Impact in Context
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Understanding your carbon footprint through everyday comparisons
          </Text>
        </Box>

        {/* Impact Summary */}
        <ImpactSummary />

        {/* Examples Grid */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="sm" color={textColor}>
              Real-World Comparisons
            </Heading>
            {showComparisons && (
              <Button size="sm" variant="outline" onClick={onModalOpen}>
                Learn More
              </Button>
            )}
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: compact ? 2 : 3 }} spacing={4}>
            {impactData.examples.slice(0, maxExamples).map((example, index) => (
              <ExampleCard key={index} example={example} />
            ))}
          </SimpleGrid>
        </Box>

        {/* Context Information */}
        {!compact && (
          <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
            <HStack>
              <Icon as={FiInfo} color="blue.600" />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="medium" color="blue.700">
                  How We Calculate These Comparisons
                </Text>
                <Text fontSize="xs" color="blue.600">
                  Examples are based on EPA and USDA data for average emissions. Click any example
                  to learn more about the calculation method.
                </Text>
              </VStack>
            </HStack>
          </Box>
        )}

        {/* Last Updated */}
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Examples updated: {new Date(impactData.last_updated).toLocaleDateString()}
        </Text>
      </VStack>

      {/* Modals */}
      <ExampleModal />

      <EducationModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        topic="carbon-examples"
        contextData={impactData}
        triggerSource="carbon-impact-visualizer-learn-more"
      />
    </Box>
  );
};

export default CarbonImpactVisualizer;
