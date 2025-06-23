import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Badge,
  Text,
  Icon,
  Tooltip,
  Skeleton,
  useColorModeValue,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { FaShieldAlt, FaLeaf, FaAward, FaChartLine } from 'react-icons/fa';
import { CheckCircleIcon, InfoOutlineIcon } from '@chakra-ui/icons';

interface USDAData {
  success: boolean;
  api_status: {
    data_source: string;
    nass_configured: boolean;
    ers_configured: boolean;
  };
  benchmark_data: {
    regional_yield: number;
    kg_per_hectare: number;
    unit: string;
  };
  carbon_calculation: {
    carbon_intensity: number;
  };
  usda_credibility: {
    score: number;
    rating: string;
  };
  api_attribution: string;
}

interface BenchmarkData {
  benchmark_comparison: {
    performance_rating: 'excellent' | 'good' | 'average' | 'below_average';
    improvement_potential: number;
  };
}

interface USDAVerificationBadgeProps {
  usdaData?: USDAData;
  benchmarkData?: BenchmarkData;
  isLoading?: boolean;
  isCompact?: boolean;
  showDetails?: boolean;
}

const USDAVerificationBadge: React.FC<USDAVerificationBadgeProps> = ({
  usdaData,
  benchmarkData,
  isLoading = false,
  isCompact = false,
  showDetails = true
}) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.700');
  const cardBg = useColorModeValue('white', 'gray.800');

  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        borderRadius="lg"
        p={isCompact ? 4 : 6}
        border="2px solid"
        borderColor={borderColor}
      >
        <VStack spacing={3}>
          <Skeleton height="20px" width="200px" />
          <Skeleton height="60px" width="100%" />
          <Skeleton height="40px" width="80%" />
        </VStack>
      </Box>
    );
  }

  if (!usdaData?.success) {
    return null;
  }

  if (isCompact) {
    return (
      <Box bg={bgColor} borderRadius="md" p={3} border="1px solid" borderColor={borderColor}>
        <HStack spacing={2} justify="center">
          <Icon as={FaShieldAlt} color="blue.500" boxSize={4} />
          <Badge colorScheme="blue" variant="solid" fontSize="xs">
            🏛️ USDA VERIFIED
          </Badge>
          <Badge colorScheme="green" variant="outline" fontSize="xs">
            {usdaData.usda_credibility.score}/100
          </Badge>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      p={6}
      border="2px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      {/* Header */}
      <VStack spacing={4} align="stretch">
        <HStack spacing={3} justify="center" flexWrap="wrap">
          <Tooltip label="Verified by USDA Government APIs" placement="top">
            <Badge
              colorScheme="blue"
              variant="solid"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              <HStack spacing={2}>
                <Icon as={FaShieldAlt} />
                <Text>🏛️ USDA VERIFIED</Text>
              </HStack>
            </Badge>
          </Tooltip>

          <Badge
            colorScheme="green"
            variant="outline"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
          >
            Government Data
          </Badge>

          <Badge
            colorScheme="green"
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="xs"
          >
            ✅ Current Data
          </Badge>
        </HStack>

        {/* Main Stats */}
        {showDetails && (
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Box bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500" fontWeight="medium">
                  <HStack spacing={1}>
                    <Icon as={FaLeaf} boxSize={3} />
                    <Text>Regional Benchmark (NASS)</Text>
                  </HStack>
                </StatLabel>
                <StatNumber fontSize="lg" fontWeight="bold" color="blue.600">
                  {usdaData.benchmark_data.kg_per_hectare.toLocaleString()} kg/hectare
                </StatNumber>
                <StatHelpText fontSize="xs">
                  <HStack spacing={1}>
                    <Icon as={CheckCircleIcon} color="green.500" boxSize={3} />
                    <Text>Government verified</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500" fontWeight="medium">
                  <HStack spacing={1}>
                    <Icon as={FaChartLine} boxSize={3} />
                    <Text>Carbon Intensity (EPA + USDA)</Text>
                  </HStack>
                </StatLabel>
                <StatNumber fontSize="lg" fontWeight="bold" color="purple.600">
                  {usdaData.carbon_calculation.carbon_intensity?.toFixed(6)} kg CO₂e/kg
                </StatNumber>
                <StatHelpText fontSize="xs">
                  <HStack spacing={1}>
                    <Icon as={InfoOutlineIcon} color="blue.500" boxSize={3} />
                    <Text>Government verified</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500" fontWeight="medium">
                  <HStack spacing={1}>
                    <Icon as={FaAward} boxSize={3} />
                    <Text>USDA Credibility Score</Text>
                  </HStack>
                </StatLabel>
                <StatNumber fontSize="lg" fontWeight="bold" color="green.600">
                  {usdaData.usda_credibility.score}/100
                </StatNumber>
                <StatHelpText fontSize="xs">
                  <Badge
                    size="sm"
                    colorScheme={usdaData.usda_credibility.score >= 90 ? 'green' : 'yellow'}
                  >
                    {usdaData.usda_credibility.rating}
                  </Badge>
                </StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>
        )}

        {/* Performance Comparison */}
        {benchmarkData && showDetails && (
          <Box bg={cardBg} p={4} borderRadius="md" boxShadow="sm">
            <VStack spacing={3}>
              <HStack justify="space-between" w="full">
                <Text fontSize="sm" fontWeight="bold" color="gray.700">
                  Performance vs Regional Average
                </Text>
                <Badge
                  colorScheme={
                    benchmarkData.benchmark_comparison.performance_rating === 'excellent'
                      ? 'green'
                      : benchmarkData.benchmark_comparison.performance_rating === 'good'
                      ? 'blue'
                      : 'yellow'
                  }
                >
                  {benchmarkData.benchmark_comparison.performance_rating}
                </Badge>
              </HStack>

              <Progress
                value={Math.max(
                  0,
                  (1 - benchmarkData.benchmark_comparison.improvement_potential) * 100
                )}
                colorScheme="green"
                size="lg"
                borderRadius="full"
                w="full"
                bg="gray.100"
              />

              <Text fontSize="xs" color="gray.600" textAlign="center">
                {((1 - benchmarkData.benchmark_comparison.improvement_potential) * 100).toFixed(1)}%
                efficiency vs regional farms
              </Text>
            </VStack>
          </Box>
        )}

        {/* Attribution */}
        {usdaData.api_attribution && (
          <Text fontSize="xs" color="gray.500" textAlign="center" fontStyle="italic" px={2}>
            {usdaData.api_attribution}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default USDAVerificationBadge;
