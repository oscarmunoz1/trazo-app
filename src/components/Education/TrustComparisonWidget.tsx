import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Progress,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  Tooltip,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import {
  FiShield,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiTarget,
  FiTrendingUp,
  FiDatabase,
  FiMapPin,
  FiClock,
  FiUsers
} from 'react-icons/fi';
import EducationModal, { EducationTopic } from './EducationModal';
import { useGetTrustComparisonDataQuery } from '../../store/api/carbonApi';

interface TrustMetric {
  label: string;
  generic_value: number;
  usda_value: number;
  unit: string;
  description: string;
  confidence_level: number;
}

interface TrustComparison {
  title: string;
  subtitle: string;
  metrics: TrustMetric[];
  data_sources: {
    generic: DataSource;
    usda: DataSource;
  };
  trust_indicators: TrustIndicator[];
  accuracy_improvement: number;
  last_updated: string;
}

interface DataSource {
  name: string;
  type: 'generic' | 'government' | 'peer_reviewed' | 'industry';
  reliability_score: number;
  data_points: number;
  regional_specificity: boolean;
  last_updated: string;
  verification_method: string;
}

interface TrustIndicator {
  category: string;
  generic_score: number;
  usda_score: number;
  max_score: number;
  description: string;
  icon: string;
}

interface TrustComparisonWidgetProps {
  establishmentData?: any;
  contextData?: any;
  compact?: boolean;
  showDetails?: boolean;
}

const TrustComparisonWidget: React.FC<TrustComparisonWidgetProps> = ({
  establishmentData,
  contextData,
  compact = false,
  showDetails = true
}) => {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const warningColor = useColorModeValue('orange.500', 'orange.400');

  const {
    data: comparison,
    isLoading: loading,
    error,
    refetch: fetchTrustComparison
  } = useGetTrustComparisonDataQuery({
    establishmentId: establishmentData?.id,
    context: contextData
  });

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'government':
        return FiShield;
      case 'peer_reviewed':
        return FiCheckCircle;
      case 'industry':
        return FiUsers;
      default:
        return FiDatabase;
    }
  };

  const getTrustIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'accuracy':
        return FiTarget;
      case 'reliability':
        return FiShield;
      case 'regional':
        return FiMapPin;
      case 'timeliness':
        return FiClock;
      case 'verification':
        return FiCheckCircle;
      default:
        return FiInfo;
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'yellow';
    return 'red';
  };

  const MetricComparison = ({ metric }: { metric: TrustMetric }) => {
    const improvement = ((metric.usda_value - metric.generic_value) / metric.generic_value) * 100;
    const isImprovement = improvement > 0;

    return (
      <Card variant="outline" borderColor={borderColor}>
        <CardBody p={4}>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="medium" color={textColor}>
                {metric.label}
              </Text>
              <Tooltip label={metric.description}>
                <Icon as={FiInfo} color="gray.400" cursor="help" />
              </Tooltip>
            </HStack>

            <SimpleGrid columns={2} spacing={4}>
              {/* Generic Estimate */}
              <Box
                p={3}
                bg="orange.50"
                borderRadius="md"
                border="1px solid"
                borderColor="orange.200"
              >
                <VStack spacing={2}>
                  <HStack>
                    <Icon as={FiAlertTriangle} color={warningColor} boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium" color="orange.700">
                      Generic Estimate
                    </Text>
                  </HStack>
                  <Text fontSize="lg" fontWeight="bold" color="orange.800">
                    {metric.generic_value.toFixed(2)} {metric.unit}
                  </Text>
                  <Badge colorScheme="orange" size="sm">
                    Low Confidence
                  </Badge>
                </VStack>
              </Box>

              {/* USDA-Based */}
              <Box p={3} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
                <VStack spacing={2}>
                  <HStack>
                    <Icon as={FiShield} color={accentColor} boxSize={4} />
                    <Text fontSize="sm" fontWeight="medium" color="green.700">
                      USDA-Based
                    </Text>
                  </HStack>
                  <Text fontSize="lg" fontWeight="bold" color="green.800">
                    {metric.usda_value.toFixed(2)} {metric.unit}
                  </Text>
                  <Badge colorScheme="green" size="sm">
                    {metric.confidence_level}% Confidence
                  </Badge>
                </VStack>
              </Box>
            </SimpleGrid>

            {/* Improvement Indicator */}
            <Box p={2} bg={isImprovement ? 'green.50' : 'blue.50'} borderRadius="md">
              <HStack justify="center">
                <Icon
                  as={isImprovement ? FiTrendingUp : FiInfo}
                  color={isImprovement ? 'green.600' : 'blue.600'}
                />
                <Text
                  fontSize="sm"
                  color={isImprovement ? 'green.700' : 'blue.700'}
                  fontWeight="medium"
                >
                  {isImprovement
                    ? `${Math.abs(improvement).toFixed(1)}% more accurate`
                    : 'More precise calculation'}
                </Text>
              </HStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const DataSourceComparison = () => {
    if (!comparison || !showDetails) return null;

    return (
      <Box>
        <Heading size="sm" color={textColor} mb={3}>
          Data Source Comparison
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {/* Generic Source */}
          <Card variant="outline" borderColor="orange.200">
            <CardHeader pb={2}>
              <HStack>
                <Icon
                  as={getSourceIcon(comparison.data_sources.generic.type)}
                  color={warningColor}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium" color={textColor}>
                    {comparison.data_sources.generic.name}
                  </Text>
                  <Badge colorScheme="orange" size="sm">
                    Generic
                  </Badge>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Reliability
                  </Text>
                  <Badge
                    colorScheme={getScoreColor(
                      comparison.data_sources.generic.reliability_score,
                      100
                    )}
                  >
                    {comparison.data_sources.generic.reliability_score}%
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Data Points
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {comparison.data_sources.generic.data_points.toLocaleString()}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Regional Data
                  </Text>
                  <Badge
                    colorScheme={
                      comparison.data_sources.generic.regional_specificity ? 'green' : 'red'
                    }
                  >
                    {comparison.data_sources.generic.regional_specificity ? 'Yes' : 'No'}
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* USDA Source */}
          <Card variant="outline" borderColor="green.200">
            <CardHeader pb={2}>
              <HStack>
                <Icon as={getSourceIcon(comparison.data_sources.usda.type)} color={accentColor} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium" color={textColor}>
                    {comparison.data_sources.usda.name}
                  </Text>
                  <Badge colorScheme="green" size="sm">
                    Government
                  </Badge>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Reliability
                  </Text>
                  <Badge
                    colorScheme={getScoreColor(comparison.data_sources.usda.reliability_score, 100)}
                  >
                    {comparison.data_sources.usda.reliability_score}%
                  </Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Data Points
                  </Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {comparison.data_sources.usda.data_points.toLocaleString()}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Regional Data
                  </Text>
                  <Badge
                    colorScheme={
                      comparison.data_sources.usda.regional_specificity ? 'green' : 'red'
                    }
                  >
                    {comparison.data_sources.usda.regional_specificity ? 'Yes' : 'No'}
                  </Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    );
  };

  const TrustIndicators = () => {
    if (!comparison?.trust_indicators || !showDetails) return null;

    return (
      <Box>
        <Heading size="sm" color={textColor} mb={3}>
          Trust Indicators
        </Heading>
        <VStack spacing={3}>
          {comparison.trust_indicators.map((indicator, index) => {
            const IconComponent = getTrustIcon(indicator.category);
            return (
              <Card key={index} variant="outline" borderColor={borderColor} w="full">
                <CardBody p={3}>
                  <HStack justify="space-between" mb={2}>
                    <HStack>
                      <Icon as={IconComponent} color={accentColor} />
                      <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        {indicator.category}
                      </Text>
                    </HStack>
                    <Tooltip label={indicator.description}>
                      <Icon as={FiInfo} color="gray.400" cursor="help" />
                    </Tooltip>
                  </HStack>

                  <SimpleGrid columns={2} spacing={4}>
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.500">
                        Generic
                      </Text>
                      <Progress
                        value={(indicator.generic_score / indicator.max_score) * 100}
                        colorScheme="orange"
                        size="sm"
                        w="full"
                      />
                      <Text fontSize="xs" color="orange.600">
                        {indicator.generic_score}/{indicator.max_score}
                      </Text>
                    </VStack>

                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.500">
                        USDA
                      </Text>
                      <Progress
                        value={(indicator.usda_score / indicator.max_score) * 100}
                        colorScheme="green"
                        size="sm"
                        w="full"
                      />
                      <Text fontSize="xs" color="green.600">
                        {indicator.usda_score}/{indicator.max_score}
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>
            );
          })}
        </VStack>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box p={4}>
        <VStack spacing={4}>
          <Skeleton height="40px" width="100%" />
          <Skeleton height="120px" width="100%" />
          <Skeleton height="80px" width="100%" />
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="medium">Unable to Load Trust Comparison</Text>
          <Text fontSize="sm">Unable to load trust comparison. Please try again.</Text>
          <Button size="sm" onClick={() => fetchTrustComparison()}>
            Try Again
          </Button>
        </VStack>
      </Alert>
    );
  }

  if (!comparison) return null;

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
            {comparison.title}
          </Heading>
          <Text color="gray.600" fontSize="sm" mb={3}>
            {comparison.subtitle}
          </Text>

          {/* Overall Improvement Badge */}
          <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
            {comparison.accuracy_improvement}% More Accurate with USDA Data
          </Badge>
        </Box>

        {/* Metrics Comparison */}
        <Box>
          <Heading size="sm" color={textColor} mb={3}>
            Data Comparison
          </Heading>
          <VStack spacing={4}>
            {comparison.metrics.map((metric, index) => (
              <MetricComparison key={index} metric={metric} />
            ))}
          </VStack>
        </Box>

        <DataSourceComparison />
        <TrustIndicators />

        {/* Learn More Button */}
        {showDetails && (
          <Box textAlign="center" pt={2}>
            <Button variant="outline" colorScheme="green" size="sm" onClick={onModalOpen}>
              Learn More About Trust Indicators
            </Button>
          </Box>
        )}

        {/* Last Updated */}
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Last updated: {new Date(comparison.last_updated).toLocaleDateString()}
        </Text>
      </VStack>

      {/* Education Modal */}
      <EducationModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        topic="trust-indicators"
        contextData={comparison}
        triggerSource="trust-comparison-widget"
      />
    </Box>
  );
};

export default TrustComparisonWidget;
