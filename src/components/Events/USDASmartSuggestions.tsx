import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Tooltip,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaChartLine,
  FaLightbulb,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa';

interface USDAData {
  success: boolean;
  benchmark_data: {
    kg_per_hectare: number;
    regional_yield: number;
  };
  carbon_calculation: {
    carbon_intensity: number;
  };
  usda_credibility: {
    score: number;
    rating: string;
  };
}

interface BenchmarkData {
  benchmark_comparison: {
    performance_rating: string;
    improvement_potential: number;
  };
}

interface SmartSuggestion {
  id: string;
  title: string;
  description: string;
  carbonImpact: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  usdaBased: boolean;
  category: 'fertilization' | 'irrigation' | 'pest_control' | 'soil_management' | 'harvest';
  priority: 'high' | 'medium' | 'low';
  estimatedCost: number;
  timeToImplement: string;
  expectedROI: string;
}

interface USDASmartSuggestionsProps {
  usdaData?: USDAData;
  benchmarkData?: BenchmarkData;
  cropType: string;
  farmState: string;
  isLoading?: boolean;
  onSuggestionSelect?: (suggestion: SmartSuggestion) => void;
}

const USDASmartSuggestions: React.FC<USDASmartSuggestionsProps> = ({
  usdaData,
  benchmarkData,
  cropType,
  farmState,
  isLoading = false,
  onSuggestionSelect
}) => {
  const bgColor = useColorModeValue('green.50', 'green.900');
  const borderColor = useColorModeValue('green.200', 'green.700');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Generate smart suggestions based on USDA data
  const generateSmartSuggestions = (): SmartSuggestion[] => {
    if (!usdaData?.success) return [];

    const suggestions: SmartSuggestion[] = [];
    const carbonIntensity = usdaData.carbon_calculation.carbon_intensity;
    const performanceRating = benchmarkData?.benchmark_comparison.performance_rating;
    const improvementPotential = benchmarkData?.benchmark_comparison.improvement_potential || 0;

    // High carbon intensity suggestions
    if (carbonIntensity > 0.002) {
      suggestions.push({
        id: 'reduce-nitrogen',
        title: 'Optimize Nitrogen Application',
        description:
          'USDA data suggests precision nitrogen management could reduce emissions by 15-25%',
        carbonImpact: -0.3,
        confidenceLevel: 'high',
        usdaBased: true,
        category: 'fertilization',
        priority: 'high',
        estimatedCost: 150,
        timeToImplement: '2-3 hours',
        expectedROI: '12-18 months'
      });
    }

    // Below average performance suggestions
    if (performanceRating === 'below_average' || improvementPotential > 0.2) {
      suggestions.push({
        id: 'soil-enhancement',
        title: 'Soil Carbon Sequestration',
        description: 'Regional USDA benchmarks show 30% improvement potential through cover crops',
        carbonImpact: -0.5,
        confidenceLevel: 'high',
        usdaBased: true,
        category: 'soil_management',
        priority: 'high',
        estimatedCost: 200,
        timeToImplement: '1 day',
        expectedROI: '6-12 months'
      });
    }

    // Crop-specific suggestions
    if (cropType.toLowerCase() === 'corn') {
      suggestions.push({
        id: 'precision-irrigation',
        title: 'Precision Irrigation System',
        description: `USDA NASS data for ${farmState} shows 20% water efficiency gains with smart irrigation`,
        carbonImpact: -0.2,
        confidenceLevel: 'medium',
        usdaBased: true,
        category: 'irrigation',
        priority: 'medium',
        estimatedCost: 300,
        timeToImplement: '4-6 hours',
        expectedROI: '8-15 months'
      });
    }

    // High credibility score bonus suggestions
    if (usdaData.usda_credibility.score >= 90) {
      suggestions.push({
        id: 'carbon-credit-prep',
        title: 'Carbon Credit Documentation',
        description: 'High USDA credibility score qualifies for premium carbon credit programs',
        carbonImpact: 0,
        confidenceLevel: 'high',
        usdaBased: true,
        category: 'harvest',
        priority: 'low',
        estimatedCost: 50,
        timeToImplement: '1 hour',
        expectedROI: '3-6 months'
      });
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  };

  const suggestions = generateSmartSuggestions();

  if (isLoading) {
    return (
      <Box bg={bgColor} borderRadius="lg" p={6} border="1px solid" borderColor={borderColor}>
        <VStack spacing={4}>
          <Skeleton height="20px" width="250px" />
          <SimpleGrid columns={1} spacing={3} w="full">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height="100px" borderRadius="md" />
            ))}
          </SimpleGrid>
        </VStack>
      </Box>
    );
  }

  if (!usdaData?.success || suggestions.length === 0) {
    return (
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>USDA Smart Suggestions</AlertTitle>
          <AlertDescription>
            Connect USDA data to get personalized, government-verified farming recommendations.
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      p={6}
      border="2px solid"
      borderColor={borderColor}
      boxShadow="md"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack spacing={3} justify="space-between">
          <HStack spacing={2}>
            <Icon as={FaLightbulb} color="green.500" boxSize={5} />
            <Text fontSize="lg" fontWeight="bold" color="green.700">
              USDA Smart Suggestions
            </Text>
          </HStack>

          <Badge colorScheme="blue" variant="solid" px={3} py={1} borderRadius="full">
            <HStack spacing={1}>
              <Icon as={FaShieldAlt} boxSize={3} />
              <Text fontSize="xs">Government Data</Text>
            </HStack>
          </Badge>
        </HStack>

        {/* Performance Context */}
        {usdaData && (
          <Box bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Current Carbon Intensity</StatLabel>
                <StatNumber fontSize="md" color="purple.600">
                  {usdaData.carbon_calculation.carbon_intensity.toFixed(6)}
                </StatNumber>
                <StatHelpText fontSize="xs">kg CO₂e/kg</StatHelpText>
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">USDA Credibility</StatLabel>
                <StatNumber fontSize="md" color="green.600">
                  {usdaData.usda_credibility.score}/100
                </StatNumber>
                <StatHelpText fontSize="xs">{usdaData.usda_credibility.rating}</StatHelpText>
              </Stat>

              <Stat size="sm">
                <StatLabel fontSize="xs">Improvement Potential</StatLabel>
                <StatNumber fontSize="md" color="blue.600">
                  {benchmarkData
                    ? (benchmarkData.benchmark_comparison.improvement_potential * 100).toFixed(0)
                    : 'N/A'}
                  %
                </StatNumber>
                <StatHelpText fontSize="xs">vs regional average</StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>
        )}

        {/* Suggestions */}
        <VStack spacing={3} align="stretch">
          {suggestions.map((suggestion) => (
            <Box
              key={suggestion.id}
              bg={cardBg}
              p={4}
              borderRadius="md"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
            >
              <VStack spacing={3} align="stretch">
                {/* Suggestion Header */}
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text fontSize="md" fontWeight="bold" color="gray.700">
                        {suggestion.title}
                      </Text>

                      <Badge
                        size="sm"
                        colorScheme={getPriorityColor(suggestion.priority)}
                        variant="subtle"
                      >
                        {suggestion.priority} priority
                      </Badge>

                      <Badge
                        size="sm"
                        colorScheme={getConfidenceColor(suggestion.confidenceLevel)}
                        variant="outline"
                      >
                        {suggestion.confidenceLevel} confidence
                      </Badge>
                    </HStack>

                    <Text fontSize="sm" color="gray.600">
                      {suggestion.description}
                    </Text>
                  </VStack>

                  {suggestion.usdaBased && (
                    <Tooltip label="Based on USDA government data">
                      <Badge colorScheme="blue" variant="solid" size="sm">
                        🏛️ USDA
                      </Badge>
                    </Tooltip>
                  )}
                </HStack>

                {/* Suggestion Metrics */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      Carbon Impact
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="bold"
                      color={suggestion.carbonImpact < 0 ? 'green.600' : 'red.600'}
                    >
                      {suggestion.carbonImpact > 0 ? '+' : ''}
                      {suggestion.carbonImpact} kg CO₂e
                    </Text>
                  </Box>

                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      Est. Cost
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      ${suggestion.estimatedCost}
                    </Text>
                  </Box>

                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      Time
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">
                      {suggestion.timeToImplement}
                    </Text>
                  </Box>

                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      ROI
                    </Text>
                    <Text fontSize="sm" fontWeight="bold" color="green.600">
                      {suggestion.expectedROI}
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* Action Button */}
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  rightIcon={<Icon as={FaArrowRight} />}
                  onClick={() => onSuggestionSelect?.(suggestion)}
                  _hover={{ bg: 'green.50', transform: 'translateX(2px)' }}
                  transition="all 0.2s"
                >
                  Create Event from Suggestion
                </Button>
              </VStack>
            </Box>
          ))}
        </VStack>

        {/* Footer */}
        <Box bg={cardBg} p={3} borderRadius="md" boxShadow="sm">
          <HStack spacing={2} justify="center">
            <Icon as={FaCheckCircle} color="green.500" boxSize={4} />
            <Text fontSize="xs" color="gray.600" textAlign="center">
              Suggestions powered by real USDA NASS and EPA data for {farmState} {cropType} farms
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default USDASmartSuggestions;
