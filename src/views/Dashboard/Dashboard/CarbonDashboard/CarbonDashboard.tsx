import React, { useState } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  useDisclosure,
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
  Tooltip
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CarbonScore } from '../../../../components/CarbonScore';
import { BadgeCarousel } from '../../../../components/BadgeCarousel';
import { Timeline } from '../../../../components/Timeline';
import { FarmerStory } from '../../../../components/FarmerStory';
import {
  useGetEstablishmentCarbonSummaryQuery,
  useGetCarbonBenchmarksQuery,
  useGetCarbonRecommendationsQuery,
  useGetProductionTimelineQuery
} from '../../../../store/api/carbonApi';
import { FaLeaf, FaChartLine, FaIndustry, FaTractor, FaWater, FaBolt } from 'react-icons/fa';
import LineChart from 'components/Charts/LineChart';

export const CarbonDashboard: React.FC = () => {
  const { establishmentId } = useParams<{ establishmentId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const { data: summary, isLoading: isLoadingSummary } = useGetEstablishmentCarbonSummaryQuery(
    establishmentId || ''
  );
  const { data: benchmarks } = useGetCarbonBenchmarksQuery();
  const { data: recommendations } = useGetCarbonRecommendationsQuery(establishmentId || '');
  const { data: timeline } = useGetProductionTimelineQuery(establishmentId || '');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');

  if (isLoadingSummary) {
    return <Text>Loading...</Text>;
  }

  if (!summary) {
    return <Text>No data available</Text>;
  }

  // Mock data for IoT sensors - In real implementation, this would come from your IoT API
  const iotData = {
    soilMoisture: 65,
    temperature: 24,
    humidity: 45,
    solarRadiation: 850,
    waterUsage: 1200,
    energyConsumption: 450
  };

  // Mock historical data - In real implementation, this would come from your API
  const historicalData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    emissions: [1200, 1150, 1100, 1050, 1000, 950],
    offsets: [800, 850, 900, 950, 1000, 1050]
  };

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        {/* Header Section */}
        <HStack justify="space-between" align="center">
          <Heading size="lg">Carbon Dashboard</Heading>
          <HStack spacing={4}>
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => setTimeRange('week')}
              isActive={timeRange === 'week'}>
              Week
            </Button>
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => setTimeRange('month')}
              isActive={timeRange === 'month'}>
              Month
            </Button>
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => setTimeRange('year')}
              isActive={timeRange === 'year'}>
              Year
            </Button>
            <Button colorScheme="green" onClick={onOpen}>
              View Farmer Story
            </Button>
          </HStack>
        </HStack>

        {/* Main Grid */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {/* Carbon Score Card */}
          <GridItem colSpan={1}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Carbon Score</Heading>
              </CardHeader>
              <CardBody>
                <CarbonScore score={summary.carbonScore} footprint={summary.netFootprint} />
              </CardBody>
            </Card>
          </GridItem>

          {/* Emissions Overview Card */}
          <GridItem colSpan={2}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Emissions Overview</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text mb={2}>Total Emissions</Text>
                    <Progress
                      value={(summary.totalEmissions / (summary.totalEmissions + 1000)) * 100}
                      colorScheme="red"
                      size="lg"
                    />
                    <Text mt={1} fontSize="sm" color="gray.500">
                      {summary.totalEmissions.toFixed(2)} kg CO2e
                    </Text>
                  </Box>
                  <Box>
                    <Text mb={2}>Total Offsets</Text>
                    <Progress
                      value={(summary.totalOffsets / (summary.totalOffsets + 1000)) * 100}
                      colorScheme="green"
                      size="lg"
                    />
                    <Text mt={1} fontSize="sm" color="gray.500">
                      {summary.totalOffsets.toFixed(2)} kg CO2e
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* IoT Sensors Card */}
          <GridItem colSpan={3}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Real-time Monitoring</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
                  <Stat>
                    <StatLabel>Soil Moisture</StatLabel>
                    <StatNumber>{iotData.soilMoisture}%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      5% from last reading
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Temperature</StatLabel>
                    <StatNumber>{iotData.temperature}°C</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      2°C from last reading
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Humidity</StatLabel>
                    <StatNumber>{iotData.humidity}%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      3% from last reading
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Solar Radiation</StatLabel>
                    <StatNumber>{iotData.solarRadiation} W/m²</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      50 W/m² from last reading
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Water Usage</StatLabel>
                    <StatNumber>{iotData.waterUsage} L</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      100L from last reading
                    </StatHelpText>
                  </Stat>
                  <Stat>
                    <StatLabel>Energy Usage</StatLabel>
                    <StatNumber>{iotData.energyConsumption} kWh</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      20 kWh from last reading
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
              </CardBody>
            </Card>
          </GridItem>

          {/* Historical Data Card */}
          <GridItem colSpan={3}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Historical Trends</Heading>
              </CardHeader>
              <CardBody>
                <LineChart
                  data={{
                    labels: historicalData.labels,
                    datasets: [
                      {
                        label: 'Emissions',
                        data: historicalData.emissions,
                        borderColor: 'red',
                        fill: false
                      },
                      {
                        label: 'Offsets',
                        data: historicalData.offsets,
                        borderColor: 'green',
                        fill: false
                      }
                    ]
                  }}
                />
              </CardBody>
            </Card>
          </GridItem>

          {/* Badges Card */}
          <GridItem colSpan={3}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Sustainability Badges</Heading>
              </CardHeader>
              <CardBody>
                <BadgeCarousel badges={summary.badges} />
              </CardBody>
            </Card>
          </GridItem>

          {/* Tabs Section */}
          <GridItem colSpan={3}>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Tabs onChange={(index) => setActiveTab(index)}>
                  <TabList>
                    <Tab>Timeline</Tab>
                    <Tab>Benchmarks</Tab>
                    <Tab>Recommendations</Tab>
                    <Tab>Emissions Breakdown</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <Timeline events={timeline || []} />
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {benchmarks?.map((benchmark) => (
                          <Box
                            key={benchmark.cropType}
                            p={4}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="md">
                            <Text fontWeight="medium">{benchmark.cropType}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {benchmark.benchmarkValue} kg CO2e/kg
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              Source: {benchmark.source} ({benchmark.year})
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        {recommendations?.map((recommendation) => (
                          <Box
                            key={recommendation.id}
                            p={4}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="md">
                            <HStack spacing={2} mb={2}>
                              <Icon
                                as={
                                  recommendation.category === 'energy'
                                    ? FaBolt
                                    : recommendation.category === 'water'
                                    ? FaWater
                                    : recommendation.category === 'soil'
                                    ? FaTractor
                                    : FaIndustry
                                }
                                color="green.500"
                              />
                              <Text fontWeight="medium">{recommendation.title}</Text>
                            </HStack>
                            <Text fontSize="sm" mb={2}>
                              {recommendation.description}
                            </Text>
                            <HStack spacing={4}>
                              <Badge colorScheme="green">
                                Savings: ${recommendation.potentialSavings}
                              </Badge>
                              <Badge colorScheme="blue">
                                Payback: {recommendation.paybackPeriod} months
                              </Badge>
                              <Badge colorScheme="purple">
                                Cost: ${recommendation.implementationCost}
                              </Badge>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Card>
                          <CardHeader>
                            <Heading size="sm">Direct Emissions</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack align="stretch" spacing={2}>
                              <HStack justify="space-between">
                                <Text>Equipment</Text>
                                <Text fontWeight="bold">45%</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>Irrigation</Text>
                                <Text fontWeight="bold">30%</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>Storage</Text>
                                <Text fontWeight="bold">25%</Text>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                        <Card>
                          <CardHeader>
                            <Heading size="sm">Indirect Emissions</Heading>
                          </CardHeader>
                          <CardBody>
                            <VStack align="stretch" spacing={2}>
                              <HStack justify="space-between">
                                <Text>Energy</Text>
                                <Text fontWeight="bold">40%</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>Transportation</Text>
                                <Text fontWeight="bold">35%</Text>
                              </HStack>
                              <HStack justify="space-between">
                                <Text>Waste</Text>
                                <Text fontWeight="bold">25%</Text>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </VStack>

      {/* Farmer Story Modal */}
      <FarmerStory
        isOpen={isOpen}
        onClose={onClose}
        farmer={{
          name: 'John Smith',
          photo: '/path/to/farmer-photo.jpg',
          bio: 'Third-generation farmer committed to sustainable agriculture',
          generation: 3,
          location: 'California',
          certifications: ['USDA Organic', 'Carbon-Neutral'],
          sustainabilityInitiatives: [
            'Solar-powered irrigation',
            'Compost-based fertilization',
            'Cover cropping'
          ],
          carbonReduction: 25000,
          yearsOfPractice: 15
        }}
      />
    </Box>
  );
};
