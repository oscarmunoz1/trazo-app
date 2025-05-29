import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Badge,
  Icon,
  Tooltip,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Divider,
  useToast
} from '@chakra-ui/react';
import {
  FaMoneyBillWave,
  FaTractor,
  FaLeaf,
  FaChartLine,
  FaIndustry,
  FaBolt,
  FaWater,
  FaCalculator,
  FaGift,
  FaHandshake,
  FaSeedling,
  FaAward,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa';
import {
  useCalculateSavingsMutation,
  useGetEquipmentMarketplaceQuery,
  useGetGovernmentIncentivesQuery,
  ROISavingsAnalysis,
  EquipmentRecommendation,
  GovernmentIncentive
} from '../../../../store/api/roiApi';

interface ROIDashboardProps {
  establishmentId: string;
}

export const ROIDashboard: React.FC<ROIDashboardProps> = ({ establishmentId }) => {
  const [savingsData, setSavingsData] = useState<ROISavingsAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  // RTK Query hooks
  const [calculateSavings, { isLoading: isCalculating }] = useCalculateSavingsMutation();
  const {
    data: equipmentData,
    isLoading: isLoadingEquipment,
    error: equipmentError
  } = useGetEquipmentMarketplaceQuery({ establishment_id: establishmentId });

  const {
    data: incentivesData,
    isLoading: isLoadingIncentives,
    error: incentivesError
  } = useGetGovernmentIncentivesQuery({ establishment_id: establishmentId });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const successColor = useColorModeValue('green.500', 'green.300');
  const warningColor = useColorModeValue('orange.500', 'orange.300');

  // Calculate savings on component mount
  useEffect(() => {
    handleCalculateSavings();
  }, [establishmentId]);

  const handleCalculateSavings = async () => {
    try {
      const result = await calculateSavings({
        establishment_id: parseInt(establishmentId)
      }).unwrap();
      setSavingsData(result);

      toast({
        title: 'ROI Analysis Complete',
        description: `Found $${result.total_annual_savings.toLocaleString()} in potential annual savings`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error: any) {
      console.error('Failed to calculate savings:', error);
      toast({
        title: 'Analysis Error',
        description: error?.data?.error || 'Failed to calculate ROI. Using fallback data.',
        status: 'warning',
        duration: 5000,
        isClosable: true
      });

      // Set fallback data for demo purposes
      setSavingsData({
        establishment_id: parseInt(establishmentId),
        analysis_date: new Date().toISOString(),
        total_annual_savings: 6100,
        analysis_categories: {
          equipment_efficiency: {
            fuel_savings: 1200,
            maintenance_savings: 800,
            upgrade_recommendations: [
              {
                equipment_type: 'tractor',
                current_efficiency: 70,
                target_efficiency: 85,
                annual_savings: 1200,
                implementation_cost: 18000,
                payback_months: 18
              }
            ]
          },
          chemical_optimization: {
            efficiency_savings: 600,
            bulk_purchasing_savings: 400,
            precision_application_savings: 800,
            recommendations: [
              {
                chemical_type: 'fertilizer',
                current_usage: 100,
                optimized_usage: 85,
                annual_savings: 600
              }
            ]
          },
          energy_optimization: {
            irrigation_savings: 500,
            solar_potential_savings: 1200,
            recommendations: [
              {
                system_type: 'irrigation',
                current_cost: 2000,
                optimized_cost: 1500,
                annual_savings: 500
              }
            ]
          },
          market_opportunities: {
            premium_pricing_potential: 1000,
            sustainability_certification_value: 800,
            recommendations: [
              {
                opportunity_type: 'organic_certification',
                potential_revenue: 1000,
                implementation_effort: 'moderate'
              }
            ]
          },
          sustainability_incentives: {
            carbon_credits_potential: 1500,
            government_programs_value: 3000,
            recommendations: [
              {
                program_name: 'EQIP',
                potential_value: 3000,
                application_deadline: '2024-03-15'
              }
            ]
          }
        },
        recommendations: [
          {
            id: '1',
            category: 'equipment',
            title: 'Upgrade to Fuel-Efficient Tractor',
            description: 'Modern tractor with 30% better fuel efficiency',
            annual_savings: 1200,
            implementation_cost: 18000,
            payback_months: 18,
            priority: 'high',
            carbon_impact: 2.4,
            difficulty_level: 'moderate'
          }
        ]
      });
    }
  };

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

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return FaCheckCircle;
      case 'moderate':
        return FaClock;
      case 'complex':
        return FaExclamationTriangle;
      default:
        return FaCheckCircle;
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        {/* Header Section */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg" color={textColor}>
              <Icon as={FaMoneyBillWave} mr={2} color="green.500" />
              ROI Analysis & Cost Optimization
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Identify savings opportunities and optimize your agricultural operations
            </Text>
          </VStack>
          <Button
            colorScheme="green"
            onClick={handleCalculateSavings}
            isLoading={isCalculating}
            leftIcon={<Icon as={FaCalculator} />}
          >
            Recalculate Savings
          </Button>
        </HStack>

        {/* Savings Overview Cards */}
        {savingsData && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Annual Savings</StatLabel>
                  <StatNumber color={successColor}>
                    ${savingsData.total_annual_savings.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Target: $500-$2,000
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Equipment Savings</StatLabel>
                  <StatNumber>
                    $
                    {(
                      savingsData.analysis_categories.equipment_efficiency.fuel_savings +
                      savingsData.analysis_categories.equipment_efficiency.maintenance_savings
                    ).toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <Icon as={FaTractor} mr={1} />
                    Fuel + Maintenance
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Chemical Optimization</StatLabel>
                  <StatNumber>
                    $
                    {(
                      savingsData.analysis_categories.chemical_optimization.efficiency_savings +
                      savingsData.analysis_categories.chemical_optimization
                        .bulk_purchasing_savings +
                      savingsData.analysis_categories.chemical_optimization
                        .precision_application_savings
                    ).toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <Icon as={FaLeaf} mr={1} />
                    15-20% Reduction
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Energy Optimization</StatLabel>
                  <StatNumber>
                    $
                    {(
                      savingsData.analysis_categories.energy_optimization.irrigation_savings +
                      savingsData.analysis_categories.energy_optimization.solar_potential_savings
                    ).toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    <Icon as={FaBolt} mr={1} />
                    25% Efficiency Gain
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Main Content Tabs */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Tabs index={activeTab} onChange={setActiveTab} colorScheme="green">
              <TabList>
                <Tab>
                  <Icon as={FaChartLine} mr={2} />
                  Recommendations
                </Tab>
                <Tab>
                  <Icon as={FaTractor} mr={2} />
                  Equipment Marketplace
                </Tab>
                <Tab>
                  <Icon as={FaGift} mr={2} />
                  Government Incentives
                </Tab>
                <Tab>
                  <Icon as={FaHandshake} mr={2} />
                  Bulk Purchasing
                </Tab>
              </TabList>

              <TabPanels>
                {/* Recommendations Tab */}
                <TabPanel>
                  {savingsData ? (
                    <VStack spacing={4} align="stretch">
                      <Heading size="md" mb={4}>
                        Priority Recommendations
                      </Heading>
                      {savingsData.recommendations.map((rec: any, index: number) => (
                        <Card key={rec.id || index} borderWidth="1px" borderColor={borderColor}>
                          <CardBody>
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={2} flex="1">
                                <HStack>
                                  <Badge colorScheme={getPriorityColor(rec.priority)}>
                                    {rec.priority} priority
                                  </Badge>
                                  <Badge variant="outline">
                                    <Icon as={getDifficultyIcon(rec.difficulty_level)} mr={1} />
                                    {rec.difficulty_level}
                                  </Badge>
                                </HStack>
                                <Heading size="sm">{rec.title}</Heading>
                                <Text fontSize="sm" color="gray.600">
                                  {rec.description}
                                </Text>
                                <HStack spacing={4}>
                                  <Text fontSize="sm">
                                    <Text as="span" fontWeight="bold" color={successColor}>
                                      ${rec.annual_savings.toLocaleString()}/year
                                    </Text>{' '}
                                    savings
                                  </Text>
                                  <Text fontSize="sm">Payback: {rec.payback_months} months</Text>
                                  <Text fontSize="sm">Carbon: -{rec.carbon_impact} tons CO2e</Text>
                                </HStack>
                              </VStack>
                              <VStack spacing={2}>
                                <Text fontSize="lg" fontWeight="bold" color={successColor}>
                                  ${rec.implementation_cost.toLocaleString()}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  Implementation
                                </Text>
                              </VStack>
                            </HStack>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  ) : (
                    <VStack spacing={4}>
                      <Spinner size="lg" />
                      <Text>Analyzing your operations for savings opportunities...</Text>
                    </VStack>
                  )}
                </TabPanel>

                {/* Equipment Marketplace Tab */}
                <TabPanel>
                  {isLoadingEquipment ? (
                    <VStack spacing={4}>
                      <Spinner size="lg" />
                      <Text>Loading equipment recommendations...</Text>
                    </VStack>
                  ) : equipmentError ? (
                    <Alert status="warning">
                      <AlertIcon />
                      <AlertTitle>Equipment data unavailable</AlertTitle>
                      <AlertDescription>
                        Unable to load equipment marketplace. Please try again later.
                      </AlertDescription>
                    </Alert>
                  ) : equipmentData ? (
                    <VStack spacing={6} align="stretch">
                      <Heading size="md">Equipment Recommendations</Heading>
                      {equipmentData.equipment_recommendations.map(
                        (equipment: any, index: number) => (
                          <Card
                            key={equipment.id || index}
                            borderWidth="1px"
                            borderColor={borderColor}
                          >
                            <CardBody>
                              <Grid templateColumns="2fr 1fr" gap={6}>
                                <VStack align="start" spacing={3}>
                                  <HStack>
                                    <Badge colorScheme="blue">{equipment.category}</Badge>
                                    <Badge variant="outline" colorScheme="green">
                                      {equipment.efficiency_improvement} efficiency
                                    </Badge>
                                  </HStack>
                                  <Heading size="sm">{equipment.title}</Heading>
                                  <Text fontSize="sm" color="gray.600">
                                    {equipment.brand} - {equipment.description}
                                  </Text>

                                  <Box>
                                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                                      Features:
                                    </Text>
                                    <List spacing={1}>
                                      {equipment.features.map((feature: string, idx: number) => (
                                        <ListItem key={idx} fontSize="sm">
                                          <ListIcon as={FaCheckCircle} color="green.500" />
                                          {feature}
                                        </ListItem>
                                      ))}
                                    </List>
                                  </Box>

                                  <Box>
                                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                                      Carbon Impact:
                                    </Text>
                                    <HStack spacing={4}>
                                      <Text fontSize="sm">
                                        -{equipment.carbon_impact.co2_reduction_annually} tons
                                        CO2e/year
                                      </Text>
                                      <Text fontSize="sm">
                                        +{equipment.carbon_impact.efficiency_score_improvement}{' '}
                                        efficiency score
                                      </Text>
                                    </HStack>
                                  </Box>
                                </VStack>

                                <VStack align="center" spacing={3}>
                                  <VStack spacing={1}>
                                    <Text fontSize="xl" fontWeight="bold" color={successColor}>
                                      ${equipment.current_cost.toLocaleString()}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Purchase Price
                                    </Text>
                                  </VStack>

                                  <VStack spacing={1}>
                                    <Text fontSize="lg" fontWeight="bold" color="green.600">
                                      ${equipment.annual_savings.toLocaleString()}/year
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Annual Savings
                                    </Text>
                                  </VStack>

                                  <VStack spacing={1}>
                                    <Text fontSize="md" fontWeight="semibold">
                                      {equipment.payback_months} months
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Payback Period
                                    </Text>
                                  </VStack>

                                  <Accordion allowToggle w="100%">
                                    <AccordionItem border="none">
                                      <AccordionButton p={2}>
                                        <Box flex="1" textAlign="center">
                                          <Text fontSize="sm">Financing Options</Text>
                                        </Box>
                                        <AccordionIcon />
                                      </AccordionButton>
                                      <AccordionPanel pb={4}>
                                        <VStack spacing={2} align="stretch">
                                          {equipment.financing_options.map(
                                            (option: any, idx: number) => (
                                              <Box key={idx} p={2} bg="gray.50" borderRadius="md">
                                                <Text
                                                  fontSize="xs"
                                                  fontWeight="semibold"
                                                  textTransform="capitalize"
                                                >
                                                  {option.type.replace('_', ' ')}
                                                </Text>
                                                {option.monthly_payment && (
                                                  <Text fontSize="xs">
                                                    ${option.monthly_payment}/month (
                                                    {option.term_months} months)
                                                  </Text>
                                                )}
                                                {option.discount_amount && (
                                                  <Text fontSize="xs">
                                                    ${option.discount_amount} rebate -{' '}
                                                    {option.program}
                                                  </Text>
                                                )}
                                              </Box>
                                            )
                                          )}
                                        </VStack>
                                      </AccordionPanel>
                                    </AccordionItem>
                                  </Accordion>
                                </VStack>
                              </Grid>
                            </CardBody>
                          </Card>
                        )
                      )}
                    </VStack>
                  ) : (
                    <Text>No equipment recommendations available.</Text>
                  )}
                </TabPanel>

                {/* Government Incentives Tab */}
                <TabPanel>
                  {isLoadingIncentives ? (
                    <VStack spacing={4}>
                      <Spinner size="lg" />
                      <Text>Loading government incentives...</Text>
                    </VStack>
                  ) : incentivesError ? (
                    <Alert status="warning">
                      <AlertIcon />
                      <AlertTitle>Incentives data unavailable</AlertTitle>
                      <AlertDescription>
                        Unable to load government incentives. Please try again later.
                      </AlertDescription>
                    </Alert>
                  ) : incentivesData ? (
                    <VStack spacing={6} align="stretch">
                      <HStack justify="space-between">
                        <Heading size="md">Available Government Programs</Heading>
                        <Badge colorScheme="green" p={2}>
                          Total Value: ${incentivesData.total_potential_value.toLocaleString()}
                        </Badge>
                      </HStack>

                      {incentivesData.available_incentives.map((incentive: any, index: number) => (
                        <Card
                          key={incentive.id || index}
                          borderWidth="1px"
                          borderColor={borderColor}
                        >
                          <CardBody>
                            <VStack align="start" spacing={3}>
                              <HStack justify="space-between" w="100%">
                                <VStack align="start" spacing={1}>
                                  <HStack>
                                    <Badge colorScheme="blue">{incentive.agency}</Badge>
                                    <Badge
                                      colorScheme={
                                        incentive.application_status === 'open' ? 'green' : 'red'
                                      }
                                      variant="outline"
                                    >
                                      {incentive.application_status}
                                    </Badge>
                                  </HStack>
                                  <Heading size="sm">{incentive.program}</Heading>
                                </VStack>
                                {incentive.max_payment && (
                                  <VStack spacing={0}>
                                    <Text fontSize="lg" fontWeight="bold" color={successColor}>
                                      ${incentive.max_payment.toLocaleString()}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Max Payment
                                    </Text>
                                  </VStack>
                                )}
                              </HStack>

                              <Box>
                                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                                  Eligible Practices:
                                </Text>
                                <SimpleGrid columns={2} spacing={2}>
                                  {incentive.eligible_practices.map(
                                    (practice: string, idx: number) => (
                                      <HStack key={idx}>
                                        <Icon as={FaSeedling} color="green.500" size="sm" />
                                        <Text fontSize="sm">{practice}</Text>
                                      </HStack>
                                    )
                                  )}
                                </SimpleGrid>
                              </Box>

                              <Divider />

                              <SimpleGrid columns={3} spacing={4} w="100%">
                                {incentive.application_deadline && (
                                  <VStack spacing={1}>
                                    <Text fontSize="xs" color="gray.500">
                                      Application Deadline
                                    </Text>
                                    <Text fontSize="sm" fontWeight="semibold">
                                      {new Date(
                                        incentive.application_deadline
                                      ).toLocaleDateString()}
                                    </Text>
                                  </VStack>
                                )}
                                <VStack spacing={1}>
                                  <Text fontSize="xs" color="gray.500">
                                    Approval Time
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {incentive.estimated_approval_time}
                                  </Text>
                                </VStack>
                                {incentive.contact_info.website && (
                                  <VStack spacing={1}>
                                    <Text fontSize="xs" color="gray.500">
                                      More Info
                                    </Text>
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      variant="outline"
                                      as="a"
                                      href={incentive.contact_info.website}
                                      target="_blank"
                                    >
                                      Apply Now
                                    </Button>
                                  </VStack>
                                )}
                              </SimpleGrid>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}

                      <Card borderWidth="1px" borderColor={borderColor} bg="blue.50">
                        <CardBody>
                          <Heading size="sm" mb={3}>
                            Application Tips
                          </Heading>
                          <List spacing={2}>
                            {incentivesData.application_tips.map((tip, index) => (
                              <ListItem key={index} fontSize="sm">
                                <ListIcon as={FaCheckCircle} color="blue.500" />
                                {tip}
                              </ListItem>
                            ))}
                          </List>
                        </CardBody>
                      </Card>
                    </VStack>
                  ) : (
                    <Text>No government incentives available.</Text>
                  )}
                </TabPanel>

                {/* Bulk Purchasing Tab */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md">Bulk Purchasing Opportunities</Heading>
                    <Alert status="info">
                      <AlertIcon />
                      <AlertTitle>Coordinate with other farms</AlertTitle>
                      <AlertDescription>
                        Contact neighboring farms to increase order volumes and maximize discounts.
                        Typical savings: 12-18% on chemical inputs.
                      </AlertDescription>
                    </Alert>

                    <Card borderWidth="1px" borderColor={borderColor}>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Heading size="sm">Bulk Purchasing Benefits</Heading>
                          <SimpleGrid columns={2} spacing={4}>
                            <VStack align="start" spacing={2}>
                              <HStack>
                                <Icon as={FaMoneyBillWave} color="green.500" />
                                <Text fontWeight="semibold">Cost Savings</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                12-18% discounts on chemical inputs when ordering in bulk volumes
                              </Text>
                            </VStack>
                            <VStack align="start" spacing={2}>
                              <HStack>
                                <Icon as={FaHandshake} color="blue.500" />
                                <Text fontWeight="semibold">Supplier Relationships</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                Better terms and priority delivery with preferred supplier status
                              </Text>
                            </VStack>
                          </SimpleGrid>

                          <Button
                            colorScheme="green"
                            onClick={() => {
                              toast({
                                title: 'Feature Coming Soon',
                                description:
                                  'Bulk purchasing coordination will be available in the next update.',
                                status: 'info',
                                duration: 3000,
                                isClosable: true
                              });
                            }}
                          >
                            Start Bulk Purchase Analysis
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};
