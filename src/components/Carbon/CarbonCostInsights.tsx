import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Progress,
  Alert,
  AlertIcon,
  List,
  ListItem,
  ListIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Button
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaDollarSign,
  FaAward,
  FaLightbulb,
  FaArrowUp,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useGetProductionCarbonEconomicsQuery } from '../../store/api/carbonCostApi';

interface CarbonCostInsightsProps {
  productionId: number;
  productionName?: string;
}

export const CarbonCostInsights: React.FC<CarbonCostInsightsProps> = ({
  productionId,
  productionName
}) => {
  const {
    data: economicsData,
    isLoading,
    error,
    refetch
  } = useGetProductionCarbonEconomicsQuery(productionId);

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <VStack spacing={4} py={8}>
            <Spinner size="lg" color="green.500" />
            <Text color="gray.600">Loading carbon economics...</Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  if (error || !economicsData?.success) {
    return (
      <Card>
        <CardBody>
          <Alert status="error">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Unable to load carbon insights</Text>
              <Text fontSize="sm">{error ? 'Network error occurred' : 'No data available'}</Text>
              <Button size="sm" onClick={() => refetch()}>
                Try Again
              </Button>
            </VStack>
          </Alert>
        </CardBody>
      </Card>
    );
  }

  const { data } = economicsData;
  const { carbon_credit_potential, efficiency_tips, premium_eligibility, next_actions } = data;

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                💰 Carbon Economics
              </Text>
              <Text fontSize="sm" color="gray.600">
                {productionName || `Production ${productionId}`} • Carbon-focused insights only
              </Text>
            </VStack>
            <Badge colorScheme="green" variant="outline">
              Simplified View
            </Badge>
          </HStack>
        </CardHeader>
      </Card>

      {/* Carbon Credit Potential */}
      <Card>
        <CardHeader>
          <HStack spacing={3}>
            <Icon as={FaLeaf} boxSize={6} color="green.500" />
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold">
                Carbon Credit Potential
              </Text>
              <Text fontSize="sm" color="gray.600">
                Revenue opportunity from carbon sequestration
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Stat>
              <StatLabel>Carbon Sequestered</StatLabel>
              <StatNumber color="green.600">
                {carbon_credit_potential.tons_sequestered.toFixed(2)} tons
              </StatNumber>
              <StatHelpText>CO2 equivalent captured</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Market Rate</StatLabel>
              <StatNumber>${carbon_credit_potential.market_rate_per_ton}/ton</StatNumber>
              <StatHelpText>Current market average</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>Potential Revenue</StatLabel>
              <StatNumber color="green.600">
                ${carbon_credit_potential.potential_revenue.toFixed(2)}
              </StatNumber>
              <StatHelpText>
                <Badge colorScheme="blue" size="sm">
                  {carbon_credit_potential.confidence} confidence
                </Badge>
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          {carbon_credit_potential.next_steps.length > 0 && (
            <Box mt={4} p={3} bg="green.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="bold" color="green.700" mb={2}>
                Next Steps:
              </Text>
              <List spacing={1} fontSize="sm">
                {carbon_credit_potential.next_steps.map((step, index) => (
                  <ListItem key={index}>
                    <ListIcon as={FaCheckCircle} color="green.500" />
                    {step}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Premium Pricing Eligibility */}
      <Card>
        <CardHeader>
          <HStack spacing={3}>
            <Icon as={FaAward} boxSize={6} color="purple.500" />
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold">
                Premium Pricing Eligibility
              </Text>
              <Text fontSize="sm" color="gray.600">
                Sustainability-based pricing opportunities
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">
                  Eligibility Level:{' '}
                  <Badge
                    colorScheme={
                      premium_eligibility.level === 'premium'
                        ? 'green'
                        : premium_eligibility.level === 'sustainable'
                        ? 'blue'
                        : premium_eligibility.level === 'basic'
                        ? 'yellow'
                        : 'gray'
                    }
                    size="lg"
                  >
                    {premium_eligibility.level.toUpperCase()}
                  </Badge>
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Potential premium: {premium_eligibility.potential_premium}
                </Text>
              </VStack>
              <VStack align="end" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {premium_eligibility.score}/100
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Sustainability Score
                </Text>
              </VStack>
            </HStack>

            <Progress
              value={premium_eligibility.score}
              colorScheme={
                premium_eligibility.score >= 80
                  ? 'green'
                  : premium_eligibility.score >= 50
                  ? 'blue'
                  : 'yellow'
              }
              size="lg"
              borderRadius="full"
            />

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              <HStack>
                <Icon
                  as={
                    premium_eligibility.criteria_met.carbon_tracking
                      ? FaCheckCircle
                      : FaExclamationTriangle
                  }
                  color={
                    premium_eligibility.criteria_met.carbon_tracking ? 'green.500' : 'orange.500'
                  }
                />
                <Text fontSize="sm">Carbon Tracking</Text>
              </HStack>
              <HStack>
                <Icon
                  as={
                    premium_eligibility.criteria_met.regular_monitoring
                      ? FaCheckCircle
                      : FaExclamationTriangle
                  }
                  color={
                    premium_eligibility.criteria_met.regular_monitoring ? 'green.500' : 'orange.500'
                  }
                />
                <Text fontSize="sm">Regular Monitoring</Text>
              </HStack>
              <HStack>
                <Icon
                  as={
                    premium_eligibility.criteria_met.carbon_sequestration
                      ? FaCheckCircle
                      : FaExclamationTriangle
                  }
                  color={
                    premium_eligibility.criteria_met.carbon_sequestration
                      ? 'green.500'
                      : 'orange.500'
                  }
                />
                <Text fontSize="sm">Carbon Sequestration</Text>
              </HStack>
            </SimpleGrid>

            {premium_eligibility.next_steps.length > 0 && (
              <Box p={3} bg="purple.50" borderRadius="md">
                <Text fontSize="sm" fontWeight="bold" color="purple.700" mb={2}>
                  Improve Your Score:
                </Text>
                <List spacing={1} fontSize="sm">
                  {premium_eligibility.next_steps.map((step, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FaArrowUp} color="purple.500" />
                      {step}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Efficiency Tips (Carbon-focused only) */}
      {efficiency_tips.length > 0 && (
        <Card>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaLightbulb} boxSize={6} color="yellow.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  Carbon Efficiency Tips
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Focused on carbon-heavy activities only
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={4} align="stretch">
              {efficiency_tips.map((tip, index) => (
                <Box
                  key={index}
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg={
                    tip.priority === 'high'
                      ? 'red.50'
                      : tip.priority === 'medium'
                      ? 'yellow.50'
                      : 'blue.50'
                  }
                >
                  <VStack align="start" spacing={2}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold" color="gray.700">
                        {tip.title}
                      </Text>
                      <Badge
                        colorScheme={
                          tip.priority === 'high'
                            ? 'red'
                            : tip.priority === 'medium'
                            ? 'yellow'
                            : 'blue'
                        }
                        size="sm"
                      >
                        {tip.priority} priority
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {tip.description}
                    </Text>
                    <HStack spacing={4} fontSize="xs">
                      <Text>
                        <strong>Savings:</strong> {tip.potential_savings}
                      </Text>
                      <Text>
                        <strong>Carbon Impact:</strong> {tip.carbon_impact}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Next Actions */}
      {next_actions.length > 0 && (
        <Card>
          <CardHeader>
            <HStack spacing={3}>
              <Icon as={FaDollarSign} boxSize={6} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  Recommended Actions
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Simple next steps to improve carbon economics
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={3} align="stretch">
              {next_actions.map((action, index) => (
                <Box
                  key={index}
                  p={3}
                  bg="blue.50"
                  borderLeft="4px solid"
                  borderColor="blue.500"
                  borderRadius="md"
                >
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="blue.700">
                      {action.action}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {action.description}
                    </Text>
                    <Text fontSize="xs" color="blue.600">
                      <strong>Impact:</strong> {action.impact}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Footer Note */}
      <Alert status="info" size="sm">
        <AlertIcon />
        <Text fontSize="xs">
          <strong>Carbon-Focused Insights:</strong> These recommendations focus exclusively on
          carbon-related opportunities. We avoid complex farm management features to stay aligned
          with our carbon transparency mission.
        </Text>
      </Alert>
    </VStack>
  );
};
