import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Spinner,
  Progress,
  Tooltip,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Divider
} from '@chakra-ui/react';
import { FaLeaf, FaDollarSign, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { useIntl } from 'react-intl';

interface CarbonCalculation {
  co2e: number;
  efficiency_score: number;
  usda_verified: boolean;
  calculation_method: string;
  breakdown?: {
    nitrogen_emissions?: number;
    phosphorus_emissions?: number;
    potassium_emissions?: number;
    application_efficiency?: number;
    volume_liters?: number;
    area_hectares?: number;
  };
  cost_analysis?: {
    estimated_cost: number;
    cost_per_co2e: number;
  };
  recommendations?: Array<{
    type: string;
    title: string;
    description: string;
    potential_savings: number;
    carbon_reduction: number;
  }>;
}

interface CarbonImpactPreviewProps {
  eventType: string;
  formData: any;
  calculation?: CarbonCalculation | null;
  isCalculating?: boolean;
}

export const CarbonImpactPreview: React.FC<CarbonImpactPreviewProps> = ({
  eventType,
  formData,
  calculation,
  isCalculating = false
}) => {
  const intl = useIntl();
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');

  const [showDetails, setShowDetails] = useState(false);

  // Helper function to get carbon score color
  const getCarbonScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  // Helper function to get impact level
  const getImpactLevel = (co2e: number) => {
    if (co2e === 0) return { level: 'None', color: 'gray' };
    if (co2e <= 5) return { level: 'Very Low', color: 'green' };
    if (co2e <= 15) return { level: 'Low', color: 'yellow' };
    if (co2e <= 30) return { level: 'Moderate', color: 'orange' };
    if (co2e <= 60) return { level: 'High', color: 'red' };
    return { level: 'Very High', color: 'red' };
  };

  const formatCO2e = (amount: number) => {
    if (amount === 0) return '0';
    if (amount < 0.1) return '< 0.1';
    if (amount < 1) return amount.toFixed(2);
    if (amount < 10) return amount.toFixed(1);
    return Math.round(amount).toString();
  };

  if (!calculation && !isCalculating) {
    return (
      <Card size="sm" bg={bgColor} borderRadius="md">
        <CardBody>
          <HStack spacing={3}>
            <Icon as={FaLeaf} color="gray.400" boxSize={5} />
            <Text fontSize="sm" color="gray.500">
              Enter event details to see carbon impact
            </Text>
          </HStack>
        </CardBody>
      </Card>
    );
  }

  if (isCalculating) {
    return (
      <Card size="sm" bg={bgColor} borderRadius="md">
        <CardBody>
          <HStack spacing={3}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="sm" color={textColor}>
              Calculating carbon impact...
            </Text>
          </HStack>
        </CardBody>
      </Card>
    );
  }

  if (!calculation) return null;

  const impactLevel = getImpactLevel(calculation.co2e);
  const efficiencyColor = getCarbonScoreColor(calculation.efficiency_score);

  return (
    <Card size="sm" bg={bgColor} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
      <CardHeader pb={2}>
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Icon as={FaLeaf} color="green.500" boxSize={4} />
            <Heading size="sm" color={textColor}>
              Carbon Impact Preview
            </Heading>
          </HStack>
          {calculation.usda_verified && (
            <Tooltip label="Calculated using USDA verified emission factors">
              <Badge colorScheme="green" size="sm">
                <HStack spacing={1}>
                  <Icon as={FaCheckCircle} boxSize={3} />
                  <Text fontSize="xs">USDA Verified</Text>
                </HStack>
              </Badge>
            </Tooltip>
          )}
        </HStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          {/* Main Impact Display */}
          <HStack justify="space-between" align="center">
            <VStack spacing={0} align="start">
              <HStack spacing={2}>
                <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                  {formatCO2e(calculation.co2e)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  kg CO₂e
                </Text>
                <Badge colorScheme={impactLevel.color} size="sm">
                  {impactLevel.level}
                </Badge>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                Carbon footprint estimate
              </Text>
            </VStack>

            <VStack spacing={0} align="end">
              <HStack spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color={`${efficiencyColor}.500`}>
                  {Math.round(calculation.efficiency_score)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  /100
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                Efficiency Score
              </Text>
            </VStack>
          </HStack>

          {/* Cost Analysis */}
          {calculation.cost_analysis && calculation.cost_analysis.estimated_cost > 0 && (
            <>
              <Divider />
              <HStack justify="space-between">
                <HStack spacing={2}>
                  <Icon as={FaDollarSign} color="blue.500" boxSize={4} />
                  <VStack spacing={0} align="start">
                    <Text fontSize="md" fontWeight="semibold" color={textColor}>
                      ${calculation.cost_analysis.estimated_cost.toFixed(2)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Estimated cost
                    </Text>
                  </VStack>
                </HStack>

                {calculation.cost_analysis.cost_per_co2e > 0 && (
                  <VStack spacing={0} align="end">
                    <Text fontSize="sm" color={textColor}>
                      ${calculation.cost_analysis.cost_per_co2e.toFixed(2)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      per kg CO₂e
                    </Text>
                  </VStack>
                )}
              </HStack>
            </>
          )}

          {/* Recommendations Preview */}
          {calculation.recommendations && calculation.recommendations.length > 0 && (
            <>
              <Divider />
              <VStack spacing={2} align="stretch">
                <HStack spacing={2}>
                  <Icon as={FaLightbulb} color="yellow.500" boxSize={4} />
                  <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                    Optimization Suggestions ({calculation.recommendations.length})
                  </Text>
                </HStack>

                {calculation.recommendations.slice(0, 2).map((rec, index) => (
                  <Alert key={index} status="info" size="sm" borderRadius="md">
                    <AlertIcon boxSize={3} />
                    <Box>
                      <AlertTitle fontSize="xs">{rec.title}</AlertTitle>
                      <AlertDescription fontSize="xs">
                        Save ${rec.potential_savings} • Reduce {rec.carbon_reduction.toFixed(1)} kg
                        CO₂e
                      </AlertDescription>
                    </Box>
                  </Alert>
                ))}

                {calculation.recommendations.length > 2 && (
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    +{calculation.recommendations.length - 2} more suggestions
                  </Text>
                )}
              </VStack>
            </>
          )}

          {/* Detailed Breakdown (Expandable) */}
          {calculation.breakdown && (
            <>
              <Divider />
              <Box>
                <Text
                  fontSize="xs"
                  color="blue.500"
                  cursor="pointer"
                  onClick={() => setShowDetails(!showDetails)}
                  _hover={{ textDecoration: 'underline' }}
                >
                  {showDetails ? 'Hide' : 'Show'} calculation details
                </Text>

                {showDetails && (
                  <VStack spacing={1} mt={2} align="stretch">
                    {calculation.breakdown.nitrogen_emissions && (
                      <HStack justify="space-between" fontSize="xs">
                        <Text color="gray.600">Nitrogen (N)</Text>
                        <Text color={textColor}>
                          {calculation.breakdown.nitrogen_emissions.toFixed(2)} kg CO₂e
                        </Text>
                      </HStack>
                    )}
                    {calculation.breakdown.phosphorus_emissions && (
                      <HStack justify="space-between" fontSize="xs">
                        <Text color="gray.600">Phosphorus (P₂O₅)</Text>
                        <Text color={textColor}>
                          {calculation.breakdown.phosphorus_emissions.toFixed(2)} kg CO₂e
                        </Text>
                      </HStack>
                    )}
                    {calculation.breakdown.potassium_emissions && (
                      <HStack justify="space-between" fontSize="xs">
                        <Text color="gray.600">Potassium (K₂O)</Text>
                        <Text color={textColor}>
                          {calculation.breakdown.potassium_emissions.toFixed(2)} kg CO₂e
                        </Text>
                      </HStack>
                    )}
                    {calculation.breakdown.application_efficiency && (
                      <HStack justify="space-between" fontSize="xs">
                        <Text color="gray.600">Application Efficiency</Text>
                        <Text color={textColor}>
                          {Math.round(calculation.breakdown.application_efficiency * 100)}%
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                )}
              </Box>
            </>
          )}

          {/* Efficiency Progress Bar */}
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.500">
                Application Efficiency
              </Text>
              <Text fontSize="xs" color={textColor}>
                {Math.round(calculation.efficiency_score)}%
              </Text>
            </HStack>
            <Progress
              value={calculation.efficiency_score}
              colorScheme={efficiencyColor}
              size="sm"
              borderRadius="md"
            />
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};
