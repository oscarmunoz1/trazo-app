import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tooltip,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiMapPin, FiAward } from 'react-icons/fi';
import { useGetRegionalBenchmarkQuery } from '../../store/api/carbonApi';

interface RegionalBenchmarkProps {
  establishmentId: number;
  carbonIntensity?: number;
  cropType?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const RegionalBenchmark: React.FC<RegionalBenchmarkProps> = ({
  establishmentId,
  carbonIntensity = 1.0,
  cropType = 'corn',
  showTitle = true,
  compact = false
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const {
    data: benchmarkData,
    isLoading: loading,
    error
  } = useGetRegionalBenchmarkQuery({
    establishmentId,
    carbonIntensity,
    cropType
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'green';
      case 'above_average':
        return 'blue';
      case 'good':
        return 'teal';
      case 'average':
        return 'yellow';
      case 'below_average':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'excellent':
        return FiAward;
      case 'above_average':
        return FiTrendingUp;
      case 'good':
        return FiTrendingUp;
      case 'average':
        return FiMapPin;
      case 'below_average':
        return FiTrendingDown;
      default:
        return FiMapPin;
    }
  };

  const formatPercentage = (value: number) => {
    return `${Math.abs(value)}%`;
  };

  if (loading) {
    return (
      <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="lg" p={4}>
        <VStack spacing={3} align="stretch">
          <Skeleton height="20px" />
          <Skeleton height="40px" />
          <Skeleton height="16px" />
        </VStack>
      </Box>
    );
  }

  if (error || !benchmarkData || benchmarkData.level === 'unknown') {
    return (
      <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="lg" p={4}>
        <VStack spacing={2}>
          <Icon as={FiMapPin} color="gray.400" boxSize={6} />
          <Text color="gray.500" textAlign="center">
            Regional benchmark data not available for this location and crop type
          </Text>
        </VStack>
      </Box>
    );
  }

  if (compact) {
    return (
      <HStack spacing={3} align="center">
        <Badge
          colorScheme={getLevelColor(benchmarkData.level)}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="full"
        >
          <HStack spacing={1}>
            <Icon as={getLevelIcon(benchmarkData.level)} boxSize={3} />
            <Text fontSize="xs" textTransform="capitalize">
              {benchmarkData.level.replace('_', ' ')}
            </Text>
          </HStack>
        </Badge>

        {benchmarkData.percentile && (
          <Text fontSize="sm" color="gray.500">
            Top {100 - benchmarkData.percentile}% in region
          </Text>
        )}
      </HStack>
    );
  }

  return (
    <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="lg" p={4}>
      <VStack spacing={4} align="stretch">
        {showTitle && (
          <HStack>
            <Icon as={FiMapPin} color="blue.500" boxSize={5} />
            <Text fontWeight="semibold" color={textColor}>
              Regional Performance
            </Text>
          </HStack>
        )}

        {/* Performance Level */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon
                as={getLevelIcon(benchmarkData.level)}
                color={`${getLevelColor(benchmarkData.level)}.500`}
                boxSize={5}
              />
              <Text fontWeight="medium" textTransform="capitalize">
                {benchmarkData.level.replace('_', ' ')} Performance
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {benchmarkData.message}
            </Text>
          </VStack>

          {benchmarkData.percentile && (
            <Badge colorScheme={getLevelColor(benchmarkData.level)} fontSize="sm" px={3} py={1}>
              {benchmarkData.percentile}th percentile
            </Badge>
          )}
        </HStack>

        {/* Progress Bar */}
        {benchmarkData.percentile && (
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.500">
                Regional Ranking
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                Top {100 - benchmarkData.percentile}%
              </Text>
            </HStack>
            <Progress
              value={benchmarkData.percentile}
              colorScheme={getLevelColor(benchmarkData.level)}
              size="lg"
              borderRadius="md"
            />
          </Box>
        )}

        {/* Comparison Stats */}
        {benchmarkData.regional_average && (
          <HStack spacing={6} justify="space-around">
            <Stat textAlign="center">
              <StatLabel fontSize="xs">Your Farm</StatLabel>
              <StatNumber fontSize="lg">
                {benchmarkData.carbon_intensity?.toFixed(2)} kg CO₂e
              </StatNumber>
            </Stat>

            <Stat textAlign="center">
              <StatLabel fontSize="xs">Regional Average</StatLabel>
              <StatNumber fontSize="lg">
                {benchmarkData.regional_average.toFixed(2)} kg CO₂e
              </StatNumber>
            </Stat>
          </HStack>
        )}

        {/* Improvement/Performance Indicator */}
        {benchmarkData.improvement_vs_average !== undefined && (
          <Box bg="green.50" border="1px solid" borderColor="green.200" borderRadius="md" p={3}>
            <HStack>
              <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
              <Text fontSize="sm" color="green.700" fontWeight="medium">
                {formatPercentage(benchmarkData.improvement_vs_average)} better than regional
                average
              </Text>
            </HStack>
          </Box>
        )}

        {benchmarkData.improvement_potential !== undefined && (
          <Box bg="orange.50" border="1px solid" borderColor="orange.200" borderRadius="md" p={3}>
            <HStack>
              <Icon as={FiTrendingUp} color="orange.500" boxSize={4} />
              <Text fontSize="sm" color="orange.700" fontWeight="medium">
                {formatPercentage(benchmarkData.improvement_potential)} improvement potential
              </Text>
            </HStack>
          </Box>
        )}

        {/* Location Context */}
        {benchmarkData.state && benchmarkData.crop_type && (
          <HStack justify="center" pt={2}>
            <Text fontSize="xs" color="gray.400" textAlign="center">
              Compared to {benchmarkData.crop_type} farms in {benchmarkData.state}
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default RegionalBenchmark;
