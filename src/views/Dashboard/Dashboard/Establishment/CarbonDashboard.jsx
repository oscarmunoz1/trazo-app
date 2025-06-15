import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
  Tooltip,
  Icon,
  Text,
  Spinner,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  VStack,
  HStack,
  Button,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  useBreakpointValue,
  Container
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { InfoOutlineIcon, ChevronDownIcon, WarningIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { IoIosArrowDown } from 'react-icons/io';
import {
  FaLeaf,
  FaChartLine,
  FaIndustry,
  FaTractor,
  FaWater,
  FaBolt,
  FaMoneyBillWave,
  FaFileAlt,
  FaAward,
  FaCalculator,
  FaGift,
  FaHandshake,
  FaSeedling,
  FaSolarPanel,
  FaInfoCircle
} from 'react-icons/fa';

// Step 5: Progressive Loading Imports for Carbon Dashboard
import { ProgressiveLoader, CarbonDashboardSkeleton } from 'components/Loading/ProgressiveLoader';
import {
  usePerformanceMonitor,
  useProgressiveLoading,
  useMobileOptimization
} from 'hooks/usePerformanceMonitor';
import { PerformanceSummary } from 'components/Performance/PerformanceSummary';

// Import existing components
import CarbonFootprintTab from '../components/forms/CarbonFootprintTab';
import { useGetCarbonFootprintSummaryQuery } from 'store/api/companyApi';
import { useGetProductionsByEstablishmentQuery } from 'store/api/historyApi';

// Import Phase 1 Carbon Cost Intelligence component
import { CarbonCostInsights } from 'components/Carbon/CarbonCostInsights';

const CarbonDashboard = () => {
  const { establishmentId } = useParams();
  const bg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('green.200', 'green.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const successColor = useColorModeValue('green.500', 'green.300');

  // Step 5: Progressive Loading Implementation for Carbon Dashboard
  const { metrics, markStageComplete, resetTimer } = usePerformanceMonitor();
  const { isMobile, optimizationStrategy } = useMobileOptimization();

  // Carbon-specific progressive loading configuration
  const progressiveConfig = {
    primaryQueries: ['carbon-summary', 'establishment-data'], // Critical carbon metrics
    secondaryQueries: ['productions', 'incentives'], // Enhanced features
    enableCache: true,
    targetTime: 3000 // 3-second target for carbon analytics
  };

  const { stage, registerQueryLoad, isLoading, primaryLoaded } =
    useProgressiveLoading(progressiveConfig);

  // Mobile-first responsive design
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const cardSpacing = useBreakpointValue({ base: 4, md: 6 });
  const headerFontSize = useBreakpointValue({ base: 'xl', md: '2xl' });

  // State management
  const [viewMode, setViewMode] = useState('establishment');
  const [productionId, setProductionId] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen: isAlertOpen, onClose: onAlertClose } = useDisclosure({ defaultIsOpen: true });

  // Carbon data queries with progressive loading registration
  const { data: summaryData, isLoading: isSummaryLoading } = useGetCarbonFootprintSummaryQuery({
    establishmentId: viewMode === 'establishment' ? establishmentId : undefined,
    productionId: viewMode === 'production' ? productionId : undefined,
    year: new Date().getFullYear()
  });

  const { data: productions, isLoading: isProductionsLoading } =
    useGetProductionsByEstablishmentQuery({ establishmentId });

  // Step 5: Progressive loading initialization and query registration
  useEffect(() => {
    resetTimer(); // Reset performance timer

    // Register query loads for performance tracking
    if (summaryData && !isSummaryLoading) {
      registerQueryLoad('carbon-summary', false, summaryData);
    }
    if (establishmentId) {
      registerQueryLoad('establishment-data', false, { id: establishmentId });
    }
    if (productions && !isProductionsLoading) {
      registerQueryLoad('productions', false, productions);
    }
  }, [
    summaryData,
    isSummaryLoading,
    establishmentId,
    productions,
    isProductionsLoading,
    resetTimer,
    registerQueryLoad
  ]);

  // Carbon status calculation
  let status = 'En Progreso';
  let statusColor = 'green';
  let offsetPercentage = 0;

  if (summaryData) {
    const totalEmissions = summaryData.total_emissions || 0;
    const totalOffsets = summaryData.total_offsets || 0;
    const netCarbon = summaryData.net_carbon || totalEmissions - totalOffsets;

    if (totalEmissions > 0) {
      offsetPercentage = Math.min(100, Math.max(0, (totalOffsets / totalEmissions) * 100));
    } else if (totalOffsets > 0) {
      offsetPercentage = 100;
    } else {
      offsetPercentage = 0;
    }

    // Ensure offsetPercentage is not NaN
    if (isNaN(offsetPercentage)) {
      offsetPercentage = 0;
    }

    if (netCarbon > 0) {
      status = 'Necesita Atención';
      statusColor = 'yellow';
    }

    if (netCarbon > (summaryData.industry_average || 0) && summaryData.industry_average > 0) {
      status = 'Sobre Promedio';
      statusColor = 'red';
    }
  }

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
    if (event.target.value === 'establishment') {
      setProductionId('');
    }
  };

  const handleProductionChange = (event) => {
    setProductionId(event.target.value);
  };

  const getPriorityColor = (priority) => {
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

  return (
    <Box minH="100vh" bg={bg} py={{ base: 4, md: 8 }} px={{ base: 2, md: 6 }}>
      {/* Header Section */}
      <VStack spacing={6} align="stretch">
        <Flex
          direction={{ sm: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap="24px"
          paddingTop={12}
          w="100%"
        >
          <VStack align="start" spacing={1}>
            <Text color="gray.500" fontSize="md">
              Gestiona tu huella de carbono y optimiza costos operacionales
            </Text>
          </VStack>

          {/* View Mode Selector */}
          <Stack direction="row" spacing="10px" alignSelf={{ sm: 'flex-start', lg: 'flex-end' }}>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<IoIosArrowDown />}
                color="gray.700"
                width="fit-content"
                h="35px"
                bg="#fff"
                minW="155px"
                fontSize="xs"
              >
                {viewMode === 'establishment' ? 'ESTABLECIMIENTO' : 'PRODUCCIÓN'}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => handleViewModeChange({ target: { value: 'establishment' } })}
                  color="gray.500"
                >
                  Establecimiento
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={() => handleViewModeChange({ target: { value: 'production' } })}
                  color="gray.500"
                >
                  Producción
                </MenuItem>
              </MenuList>
            </Menu>
            {viewMode === 'production' && (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<IoIosArrowDown />}
                  color="gray.700"
                  width="fit-content"
                  h="35px"
                  bg="#fff"
                  minW="200px"
                  fontSize="xs"
                  isDisabled={isProductionsLoading}
                >
                  {(productionId &&
                    productions?.find((p) => p.id === parseInt(productionId))?.name) ||
                    'SELECCIONAR PRODUCCIÓN'}
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => handleProductionChange({ target: { value: '' } })}
                    color="gray.500"
                  >
                    Seleccionar Producción
                  </MenuItem>
                  <MenuDivider />
                  {productions?.map((prod) => (
                    <MenuItem
                      key={prod.id}
                      onClick={() => handleProductionChange({ target: { value: prod.id } })}
                      color="gray.500"
                    >
                      {prod.name || `Producción ${prod.id}`}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
          </Stack>
        </Flex>

        {/* Summary Banner */}
        <Card
          bg={cardBg}
          borderLeftWidth="6px"
          borderLeftColor={statusColor + '.500'}
          boxShadow="lg"
          borderRadius="xl"
          overflow="hidden"
        >
          <CardBody p={4}>
            <Flex align="center" justify="space-between" wrap="wrap" gap={6}>
              <Flex align="center" gap={4}>
                <Box>
                  <Heading size="md" color="green.700" mb={2}>
                    Huella de Carbono -{' '}
                    {viewMode === 'establishment' ? 'Establecimiento' : 'Producción'}
                  </Heading>
                  <HStack spacing={3}>
                    <Badge
                      colorScheme={statusColor}
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontWeight="bold"
                    >
                      {status}
                    </Badge>
                    <Tooltip
                      label={`La huella de carbono mide el total de emisiones y compensaciones de CO₂e de este ${
                        viewMode === 'establishment' ? 'establecimiento' : 'producción'
                      }.`}
                      fontSize="sm"
                    >
                      <Icon as={InfoOutlineIcon} color="gray.400" boxSize={5} cursor="help" />
                    </Tooltip>
                  </HStack>
                </Box>
              </Flex>

              {/* Metrics Grid */}
              <SimpleGrid columns={{ base: 2, md: 5 }} spacing={6} flex="1" maxW="600px">
                {isSummaryLoading ? (
                  <Spinner size="lg" />
                ) : (
                  <>
                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color="gray.500">
                        Huella Neta
                      </StatLabel>
                      <StatNumber fontSize="lg" fontWeight="bold">
                        {summaryData?.net_carbon ? summaryData.net_carbon.toFixed(2) : '0.00'} kg
                      </StatNumber>
                      <StatHelpText fontSize="xs">CO₂e</StatHelpText>
                    </Stat>

                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color="gray.500">
                        Emisiones
                      </StatLabel>
                      <StatNumber fontSize="lg" fontWeight="bold" color="red.500">
                        {summaryData?.total_emissions
                          ? summaryData.total_emissions.toFixed(2)
                          : '0.00'}{' '}
                        kg
                      </StatNumber>
                      <StatHelpText fontSize="xs">CO₂e</StatHelpText>
                    </Stat>

                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color="gray.500">
                        Compensaciones
                      </StatLabel>
                      <StatNumber fontSize="lg" fontWeight="bold" color="green.500">
                        {summaryData?.total_offsets ? summaryData.total_offsets.toFixed(2) : '0.00'}{' '}
                        kg
                      </StatNumber>
                      <StatHelpText fontSize="xs">CO₂e</StatHelpText>
                    </Stat>

                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color="gray.500">
                        Progreso
                      </StatLabel>
                      <StatNumber
                        fontSize="lg"
                        fontWeight="bold"
                        color={
                          offsetPercentage >= 100
                            ? 'green.500'
                            : offsetPercentage >= 50
                            ? 'blue.500'
                            : 'yellow.500'
                        }
                      >
                        {isNaN(offsetPercentage) ? '0' : offsetPercentage.toFixed(0)}%
                      </StatNumber>
                      <StatHelpText fontSize="xs">
                        <StatArrow type={offsetPercentage >= 50 ? 'increase' : 'decrease'} />
                        Compensado
                      </StatHelpText>
                    </Stat>

                    <Stat textAlign="center">
                      <StatLabel fontSize="xs" color="gray.500">
                        Prom. Industria
                      </StatLabel>
                      <StatNumber fontSize="lg" fontWeight="bold">
                        {summaryData?.industry_average && summaryData.industry_average > 0
                          ? summaryData.industry_average.toFixed(2)
                          : 'N/A'}
                      </StatNumber>
                      <StatHelpText fontSize="xs">kg CO₂e</StatHelpText>
                    </Stat>
                  </>
                )}
              </SimpleGrid>
            </Flex>
          </CardBody>
        </Card>

        {/* Main Tabs */}
        <Card bg={cardBg} boxShadow="lg" borderRadius="xl" overflow="hidden">
          <CardBody p={0}>
            <Tabs index={activeTab} onChange={setActiveTab} colorScheme="green" variant="enclosed">
              <TabList borderBottom="2px" borderColor="gray.100" bg="gray.50">
                <Tab
                  py={4}
                  px={6}
                  fontWeight="semibold"
                  _selected={{ bg: cardBg, borderColor: 'green.500', borderBottomColor: cardBg }}
                >
                  <Icon as={FaLeaf} mr={2} />
                  Huella de Carbono
                </Tab>
                <Tab
                  py={4}
                  px={6}
                  fontWeight="semibold"
                  _selected={{ bg: cardBg, borderColor: 'green.500', borderBottomColor: cardBg }}
                >
                  <Icon as={FaChartLine} mr={2} />
                  Análisis
                </Tab>
                <Tab
                  py={4}
                  px={6}
                  fontWeight="semibold"
                  _selected={{ bg: cardBg, borderColor: 'green.500', borderBottomColor: cardBg }}
                >
                  <Icon as={FaFileAlt} mr={2} />
                  Reportes
                </Tab>
                <Tab
                  py={4}
                  px={6}
                  fontWeight="semibold"
                  _selected={{ bg: cardBg, borderColor: 'green.500', borderBottomColor: cardBg }}
                >
                  <Icon as={FaAward} mr={2} />
                  Certificaciones
                </Tab>
              </TabList>

              <TabPanels>
                {/* Carbon Footprint Tab */}
                <TabPanel p={6}>
                  <CarbonFootprintTab
                    establishmentId={establishmentId}
                    productionId={viewMode === 'production' ? productionId : undefined}
                  />
                </TabPanel>

                {/* Analysis Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" color={textColor}>
                      Análisis de Tendencias y Benchmarks
                    </Heading>

                    {/* Progress Overview */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <Card borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel>Reducción de Emisiones</StatLabel>
                            <StatNumber color="green.500">-15%</StatNumber>
                            <StatHelpText>
                              <StatArrow type="decrease" />
                              vs. año anterior
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>

                      <Card borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel>Eficiencia Energética</StatLabel>
                            <StatNumber color="blue.500">+22%</StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              Mejora continua
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>

                      <Card borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel>Score de Sostenibilidad</StatLabel>
                            <StatNumber color="purple.500">
                              {summaryData?.carbon_score || 85}/100
                            </StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              Excelente desempeño
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Phase 1: Carbon Cost Intelligence Integration */}
                    {viewMode === 'production' && productionId && (
                      <Box>
                        <Divider my={6} />
                        <Heading size="md" color={textColor} mb={4}>
                          💰 Inteligencia de Costos de Carbono
                        </Heading>
                        <CarbonCostInsights
                          productionId={parseInt(productionId)}
                          productionName={
                            productions?.find((p) => p.id === parseInt(productionId))?.name
                          }
                        />
                      </Box>
                    )}

                    {viewMode === 'establishment' && (
                      <Box>
                        <Divider my={6} />
                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="bold">
                              💡 Análisis de Costos de Carbono
                            </Text>
                            <Text fontSize="sm">
                              Selecciona una producción específica arriba para ver análisis
                              detallados de costos de carbono, potencial de créditos de carbono, y
                              recomendaciones de eficiencia.
                            </Text>
                          </VStack>
                        </Alert>
                      </Box>
                    )}

                    <Text color="gray.500" textAlign="center" py={8}>
                      Gráficos de tendencias y análisis comparativo próximamente...
                    </Text>
                  </VStack>
                </TabPanel>

                {/* Reports Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" color={textColor}>
                      Reportes de Carbono
                    </Heading>
                    <Text color="gray.500" textAlign="center" py={8}>
                      Generación de reportes automáticos próximamente...
                    </Text>
                  </VStack>
                </TabPanel>

                {/* Certifications Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <Heading size="md" color={textColor}>
                      Certificaciones Ambientales
                    </Heading>
                    <Text color="gray.500" textAlign="center" py={8}>
                      Gestión de certificaciones próximamente...
                    </Text>
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

export default CarbonDashboard;
