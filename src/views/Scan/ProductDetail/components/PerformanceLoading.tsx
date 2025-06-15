import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Skeleton,
  SkeletonCircle,
  useColorModeValue,
  Alert,
  AlertIcon,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import {
  FaStopwatch,
  FaRocket,
  FaMobile,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

interface PerformanceMetrics {
  firstContentfulPaint?: number;
  timeToInteractive?: number;
  carbonScoreDisplayTime?: number;
  bundleLoadTime?: number;
  totalPageLoadTime?: number;
}

interface PerformanceLoadingProps {
  isLoading: boolean;
  loadingStage: 'initial' | 'carbon-score' | 'product-details' | 'complete';
  carbonQuickLoading?: boolean;
  carbonFullLoading?: boolean;
  historyLoading?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

const PerformanceLoading: React.FC<PerformanceLoadingProps> = ({
  isLoading,
  loadingStage,
  carbonQuickLoading = false,
  carbonFullLoading = false,
  historyLoading = false,
  onMetricsUpdate
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [startTime] = useState(Date.now());
  const [stageStartTime, setStageStartTime] = useState(Date.now());
  const [performanceScore, setPerformanceScore] = useState<
    'excellent' | 'good' | 'needs-improvement' | 'poor'
  >('excellent');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Track performance metrics according to Day 8-10 targets
  useEffect(() => {
    const currentTime = Date.now();
    const newMetrics = { ...metrics };

    switch (loadingStage) {
      case 'initial':
        if (!metrics.firstContentfulPaint) {
          newMetrics.firstContentfulPaint = currentTime - startTime;
          setStageStartTime(currentTime);
        }
        break;
      case 'carbon-score':
        if (!carbonQuickLoading && !metrics.carbonScoreDisplayTime) {
          newMetrics.carbonScoreDisplayTime = currentTime - stageStartTime;
        }
        break;
      case 'complete':
        if (!metrics.totalPageLoadTime) {
          newMetrics.totalPageLoadTime = currentTime - startTime;
          newMetrics.timeToInteractive = currentTime - startTime;
        }
        break;
    }

    if (JSON.stringify(newMetrics) !== JSON.stringify(metrics)) {
      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);

      // Calculate performance score based on Day 8-10 targets
      calculatePerformanceScore(newMetrics);
    }
  }, [loadingStage, carbonQuickLoading, startTime, stageStartTime]);

  const calculatePerformanceScore = (currentMetrics: PerformanceMetrics) => {
    const { firstContentfulPaint, carbonScoreDisplayTime, timeToInteractive } = currentMetrics;

    // Day 8-10 target metrics:
    // - First Contentful Paint: <1.5s (excellent), <2.5s (good), <4s (needs improvement)
    // - Carbon Score Display: <3s (excellent), <5s (good), <8s (needs improvement)
    // - Time to Interactive: <3.5s (excellent), <5s (good), <8s (needs improvement)

    let score = 0;
    let totalChecks = 0;

    if (firstContentfulPaint !== undefined) {
      totalChecks++;
      if (firstContentfulPaint < 1500) score += 3;
      else if (firstContentfulPaint < 2500) score += 2;
      else if (firstContentfulPaint < 4000) score += 1;
    }

    if (carbonScoreDisplayTime !== undefined) {
      totalChecks++;
      if (carbonScoreDisplayTime < 3000) score += 3;
      else if (carbonScoreDisplayTime < 5000) score += 2;
      else if (carbonScoreDisplayTime < 8000) score += 1;
    }

    if (timeToInteractive !== undefined) {
      totalChecks++;
      if (timeToInteractive < 3500) score += 3;
      else if (timeToInteractive < 5000) score += 2;
      else if (timeToInteractive < 8000) score += 1;
    }

    if (totalChecks > 0) {
      const average = score / totalChecks;
      if (average >= 2.5) setPerformanceScore('excellent');
      else if (average >= 2) setPerformanceScore('good');
      else if (average >= 1) setPerformanceScore('needs-improvement');
      else setPerformanceScore('poor');
    }
  };

  const getStageProgress = () => {
    const stages = ['initial', 'carbon-score', 'product-details', 'complete'];
    const currentIndex = stages.indexOf(loadingStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const getPerformanceColor = () => {
    switch (performanceScore) {
      case 'excellent':
        return 'green';
      case 'good':
        return 'blue';
      case 'needs-improvement':
        return 'yellow';
      case 'poor':
        return 'red';
    }
  };

  const getLoadingMessage = () => {
    switch (loadingStage) {
      case 'initial':
        return 'Initializing QR scan...';
      case 'carbon-score':
        return 'Loading carbon score...';
      case 'product-details':
        return 'Loading product details...';
      case 'complete':
        return 'Ready!';
      default:
        return 'Loading...';
    }
  };

  if (!isLoading && loadingStage === 'complete') {
    // Show performance summary when complete
    return (
      <Box bg={bgColor} p={4} borderRadius="lg" border="1px solid" borderColor={borderColor} mb={4}>
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <Icon as={FaRocket} color={getPerformanceColor()} />
            <Text fontSize="sm" fontWeight="medium">
              QR Scan Performance
            </Text>
            <Badge colorScheme={getPerformanceColor()} variant="solid" size="sm">
              {performanceScore.replace('-', ' ').toUpperCase()}
            </Badge>
          </HStack>

          <HStack spacing={4} fontSize="xs" color={textColor}>
            {metrics.carbonScoreDisplayTime && (
              <Tooltip label="Time to show carbon score">
                <HStack spacing={1}>
                  <Icon as={FaCheckCircle} color="green.500" />
                  <Text>{(metrics.carbonScoreDisplayTime / 1000).toFixed(1)}s</Text>
                </HStack>
              </Tooltip>
            )}
            {metrics.totalPageLoadTime && (
              <Tooltip label="Total page load time">
                <HStack spacing={1}>
                  <Icon as={FaStopwatch} />
                  <Text>{(metrics.totalPageLoadTime / 1000).toFixed(1)}s</Text>
                </HStack>
              </Tooltip>
            )}
          </HStack>
        </HStack>

        {/* Performance warnings for Day 8-10 targets */}
        {performanceScore === 'needs-improvement' || performanceScore === 'poor' ? (
          <Alert status="warning" size="sm" mt={2} borderRadius="md">
            <AlertIcon boxSize="12px" />
            <Text fontSize="xs">
              Performance below target. Consider checking network connection.
            </Text>
          </Alert>
        ) : null}
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      p={6}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        {/* Main loading indicator */}
        <VStack spacing={3}>
          <HStack spacing={3}>
            <Icon as={FaMobile} color="blue.500" boxSize={5} />
            <Text fontSize="lg" fontWeight="medium">
              {getLoadingMessage()}
            </Text>
          </HStack>

          <Progress
            value={getStageProgress()}
            colorScheme="blue"
            size="lg"
            borderRadius="full"
            bg="gray.100"
            w="full"
          />

          <Text fontSize="sm" color={textColor}>
            Optimized for mobile performance
          </Text>
        </VStack>

        {/* Stage-specific loading skeletons */}
        {loadingStage === 'initial' && (
          <VStack spacing={3}>
            <SkeletonCircle size="20" />
            <Skeleton height="20px" width="60%" />
            <Skeleton height="15px" width="40%" />
          </VStack>
        )}

        {loadingStage === 'carbon-score' && (
          <VStack spacing={3}>
            <HStack w="full" spacing={4}>
              <SkeletonCircle size="16" />
              <VStack align="start" spacing={2} flex={1}>
                <Skeleton height="20px" width="80%" />
                <Skeleton height="15px" width="60%" />
              </VStack>
            </HStack>
            <Skeleton height="40px" width="full" />
          </VStack>
        )}

        {loadingStage === 'product-details' && (
          <VStack spacing={2}>
            <Skeleton height="25px" width="full" />
            <Skeleton height="20px" width="80%" />
            <Skeleton height="20px" width="90%" />
            <Skeleton height="15px" width="70%" />
          </VStack>
        )}

        {/* Performance metrics display during loading */}
        {Object.keys(metrics).length > 0 && (
          <HStack spacing={4} pt={2} borderTop="1px solid" borderColor={borderColor}>
            {metrics.firstContentfulPaint && (
              <Stat size="sm">
                <StatLabel fontSize="xs">FCP</StatLabel>
                <StatNumber fontSize="sm">
                  {(metrics.firstContentfulPaint / 1000).toFixed(1)}s
                </StatNumber>
                <StatHelpText fontSize="xs" mt={0}>
                  {metrics.firstContentfulPaint < 1500
                    ? '🟢'
                    : metrics.firstContentfulPaint < 2500
                    ? '🟡'
                    : '🔴'}
                  Target: &lt;1.5s
                </StatHelpText>
              </Stat>
            )}

            {metrics.carbonScoreDisplayTime && (
              <Stat size="sm">
                <StatLabel fontSize="xs">Carbon</StatLabel>
                <StatNumber fontSize="sm">
                  {(metrics.carbonScoreDisplayTime / 1000).toFixed(1)}s
                </StatNumber>
                <StatHelpText fontSize="xs" mt={0}>
                  {metrics.carbonScoreDisplayTime < 3000
                    ? '🟢'
                    : metrics.carbonScoreDisplayTime < 5000
                    ? '🟡'
                    : '🔴'}
                  Target: &lt;3s
                </StatHelpText>
              </Stat>
            )}
          </HStack>
        )}

        {/* Mobile optimization indicator */}
        <HStack spacing={2} justify="center" pt={2}>
          <Icon as={FaMobile} color="green.500" boxSize={3} />
          <Text fontSize="xs" color={textColor}>
            Mobile-optimized progressive loading
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PerformanceLoading;
