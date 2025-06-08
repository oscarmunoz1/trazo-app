import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  Icon,
  Card,
  CardBody,
  SimpleGrid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
  Circle,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import {
  FaStopwatch,
  FaMobile,
  FaWifi,
  FaRocket,
  FaLeaf,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTachometerAlt,
  FaChartLine
} from 'react-icons/fa';
import { MdSpeed, MdPhoneAndroid, MdNetworkCheck } from 'react-icons/md';
import { usePerformanceMonitor, useMobileOptimization } from 'hooks/usePerformanceMonitor';

// Step 5: Performance Summary Component for 3-second loading target
interface PerformanceSummaryProps {
  showDetails?: boolean;
  compact?: boolean;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  showDetails = false,
  compact = false
}) => {
  const { metrics } = usePerformanceMonitor();
  const { isMobile, connectionType, optimizationStrategy } = useMobileOptimization();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const successColor = useColorModeValue('green.500', 'green.300');
  const warningColor = useColorModeValue('yellow.500', 'yellow.300');
  const errorColor = useColorModeValue('red.500', 'red.300');

  // Get performance status
  const getPerformanceStatus = () => {
    if (metrics.totalLoadTime === 0) return { status: 'loading', color: 'gray' };
    if (metrics.isWithinTarget) return { status: 'excellent', color: 'green' };
    if (metrics.totalLoadTime <= 5000) return { status: 'good', color: 'yellow' };
    return { status: 'needs-improvement', color: 'red' };
  };

  const { status, color } = getPerformanceStatus();

  // Compact version for dashboard widgets
  if (compact) {
    return (
      <Card size="sm" borderRadius="lg">
        <CardBody p={4}>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="medium">
                Load Performance
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme={color} size="sm">
                  {metrics.totalLoadTime > 0 ? `${metrics.totalLoadTime}ms` : 'Loading...'}
                </Badge>
                {metrics.isWithinTarget && (
                  <Icon as={FaCheckCircle} color={successColor} boxSize={3} />
                )}
              </HStack>
            </VStack>
            <Circle size="40px" bg={`${color}.100`} color={`${color}.600`}>
              <Icon as={FaStopwatch} boxSize={4} />
            </Circle>
          </HStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Box>
      {/* Main Performance Card */}
      <Card boxShadow="lg" borderRadius="xl" mb={6}>
        <CardBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <Heading size="md">
                  <HStack spacing={2}>
                    <Icon as={FaTachometerAlt} color="blue.500" />
                    <Text>Performance Dashboard</Text>
                  </HStack>
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  Step 5: Progressive Loading & Performance Optimization
                </Text>
              </VStack>

              {/* Overall status badge */}
              <Badge colorScheme={color} fontSize="md" px={3} py={1} borderRadius="full">
                {status === 'excellent'
                  ? '✅ Excellent'
                  : status === 'good'
                  ? '⚡ Good'
                  : status === 'loading'
                  ? '⏳ Loading'
                  : '⚠️ Needs Improvement'}
              </Badge>
            </HStack>

            {/* 3-Second Target Progress */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="medium">3-Second Loading Target</Text>
                <Text fontSize="sm" color="gray.600">
                  {metrics.totalLoadTime > 0 ? `${metrics.totalLoadTime}ms` : 'Measuring...'}
                </Text>
              </HStack>
              <Progress
                value={
                  metrics.totalLoadTime > 0
                    ? Math.min((metrics.totalLoadTime / 3000) * 100, 100)
                    : 0
                }
                size="lg"
                colorScheme={
                  metrics.isWithinTarget
                    ? 'green'
                    : metrics.totalLoadTime <= 5000
                    ? 'yellow'
                    : 'red'
                }
                borderRadius="full"
                bg="gray.100"
              />
              <HStack justify="space-between" mt={1}>
                <Text fontSize="xs" color="gray.500">
                  0ms
                </Text>
                <Text fontSize="xs" color="gray.500">
                  3000ms (Target)
                </Text>
              </HStack>
            </Box>

            {/* Metrics Grid */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Stat textAlign="center" p={3} bg="gray.50" borderRadius="lg">
                <StatLabel fontSize="xs">Primary Load</StatLabel>
                <StatNumber
                  fontSize="lg"
                  color={metrics.primaryLoadTime <= 1500 ? successColor : warningColor}
                >
                  {metrics.primaryLoadTime || '--'}ms
                </StatNumber>
                <StatHelpText fontSize="xs">Critical Content</StatHelpText>
              </Stat>

              <Stat textAlign="center" p={3} bg="gray.50" borderRadius="lg">
                <StatLabel fontSize="xs">Secondary Load</StatLabel>
                <StatNumber
                  fontSize="lg"
                  color={metrics.secondaryLoadTime <= 2500 ? successColor : warningColor}
                >
                  {metrics.secondaryLoadTime || '--'}ms
                </StatNumber>
                <StatHelpText fontSize="xs">Enhanced Features</StatHelpText>
              </Stat>

              <Stat textAlign="center" p={3} bg="gray.50" borderRadius="lg">
                <StatLabel fontSize="xs">Total Time</StatLabel>
                <StatNumber
                  fontSize="lg"
                  color={metrics.isWithinTarget ? successColor : errorColor}
                >
                  {metrics.totalLoadTime || '--'}ms
                </StatNumber>
                <StatHelpText fontSize="xs">
                  Complete Load
                  {metrics.isWithinTarget && <StatArrow type="increase" />}
                </StatHelpText>
              </Stat>

              <Stat textAlign="center" p={3} bg="gray.50" borderRadius="lg">
                <StatLabel fontSize="xs">Target Status</StatLabel>
                <StatNumber fontSize="lg">
                  <Icon
                    as={metrics.isWithinTarget ? FaCheckCircle : FaExclamationTriangle}
                    color={metrics.isWithinTarget ? successColor : warningColor}
                    boxSize={6}
                  />
                </StatNumber>
                <StatHelpText fontSize="xs">
                  {metrics.isWithinTarget ? 'Achieved!' : 'In Progress'}
                </StatHelpText>
              </Stat>
            </SimpleGrid>

            {/* Optimization Status */}
            <HStack spacing={4} justify="center">
              <Tooltip label={`Device: ${isMobile ? 'Mobile' : 'Desktop'}`}>
                <HStack>
                  <Icon as={isMobile ? MdPhoneAndroid : FaTachometerAlt} color="blue.500" />
                  <Text fontSize="sm">{isMobile ? 'Mobile' : 'Desktop'}</Text>
                </HStack>
              </Tooltip>

              <Tooltip label={`Connection: ${connectionType.toUpperCase()}`}>
                <HStack>
                  <Icon as={MdNetworkCheck} color="green.500" />
                  <Text fontSize="sm">{connectionType.toUpperCase()}</Text>
                </HStack>
              </Tooltip>

              <Tooltip label={`Strategy: ${optimizationStrategy}`}>
                <HStack>
                  <Icon as={FaRocket} color="purple.500" />
                  <Text fontSize="sm" textTransform="capitalize">
                    {optimizationStrategy}
                  </Text>
                </HStack>
              </Tooltip>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Step 5 Implementation Features */}
      {showDetails && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* Progressive Loading Features */}
          <Card borderRadius="xl">
            <CardBody p={6}>
              <VStack spacing={4} align="stretch">
                <HStack spacing={2}>
                  <Icon as={FaChartLine} color="green.500" />
                  <Heading size="md">Progressive Loading</Heading>
                </HStack>

                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Skeleton Screens</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Priority Data Loading</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Lazy Components</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Image Preloading</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Mobile Optimization */}
          <Card borderRadius="xl">
            <CardBody p={6}>
              <VStack spacing={4} align="stretch">
                <HStack spacing={2}>
                  <Icon as={FaMobile} color="blue.500" />
                  <Heading size="md">Mobile Optimization</Heading>
                </HStack>

                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">QR Scanning Performance</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Connection Adaptation</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Touch-First UI</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Responsive Design</Text>
                    <Icon as={FaCheckCircle} color={successColor} />
                  </HStack>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {/* Performance Tips */}
      {!metrics.isWithinTarget && metrics.totalLoadTime > 0 && (
        <Alert status="info" borderRadius="md" mt={4}>
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="sm">Performance Tips</AlertTitle>
            <AlertDescription fontSize="xs">
              {metrics.totalLoadTime > 5000
                ? 'Consider enabling lite mode for faster loading on slow connections'
                : 'Almost there! Try refreshing for better performance measurement'}
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Success Message */}
      {metrics.isWithinTarget && (
        <Alert status="success" borderRadius="md" mt={4}>
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="sm">🎉 Performance Target Achieved!</AlertTitle>
            <AlertDescription fontSize="xs">
              Your app loads in under 3 seconds - providing an excellent user experience for QR
              scanning and sustainability tracking.
            </AlertDescription>
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default PerformanceSummary;
