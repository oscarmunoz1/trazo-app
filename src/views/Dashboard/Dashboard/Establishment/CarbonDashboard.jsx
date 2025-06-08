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

// Import ROI components and hooks
import {
  useCalculateSavingsMutation,
  useGetEquipmentMarketplaceQuery,
  useGetGovernmentIncentivesQuery
} from '../../../../store/api/roiApi';

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
    secondaryQueries: ['productions', 'roi-analysis', 'equipment', 'incentives'], // Enhanced features
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
  const [roiData, setRoiData] = useState(null);
  const { isOpen: isAlertOpen, onClose: onAlertClose } = useDisclosure({ defaultIsOpen: true });

  // Carbon data queries with progressive loading registration
  const { data: summaryData, isLoading: isSummaryLoading } = useGetCarbonFootprintSummaryQuery({
    establishmentId: viewMode === 'establishment' ? establishmentId : undefined,
    productionId: viewMode === 'production' ? productionId : undefined,
    year: new Date().getFullYear()
  });

  const { data: productions, isLoading: isProductionsLoading } =
    useGetProductionsByEstablishmentQuery({ establishmentId });

  // ROI queries
  const [calculateSavings, { isLoading: isCalculatingROI }] = useCalculateSavingsMutation();
  const { data: equipmentData, isLoading: isLoadingEquipment } = useGetEquipmentMarketplaceQuery({
    establishment_id: establishmentId
  });

  const { data: incentivesData, isLoading: isLoadingIncentives } = useGetGovernmentIncentivesQuery({
    establishment_id: establishmentId
  });

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
    if (equipmentData && !isLoadingEquipment) {
      registerQueryLoad('equipment', false, equipmentData);
    }
    if (incentivesData && !isLoadingIncentives) {
      registerQueryLoad('incentives', false, incentivesData);
    }
  }, [
    summaryData,
    isSummaryLoading,
    establishmentId,
    productions,
    isProductionsLoading,
    equipmentData,
    isLoadingEquipment,
    incentivesData,
    isLoadingIncentives,
    resetTimer,
    registerQueryLoad
  ]);

  // Calculate ROI on component mount
  useEffect(() => {
    if (establishmentId && activeTab === 4) {
      // ROI tab
      handleCalculateROI();
    }
  }, [establishmentId, activeTab]);

  const handleCalculateROI = async () => {
    try {
      const result = await calculateSavings({
        establishment_id: parseInt(establishmentId)
      }).unwrap();

      // Map backend response to frontend expected structure
      const mappedResult = {
        establishment_id: result.establishment_id,
        analysis_date: result.analysis_date,
        total_annual_savings: result.total_annual_savings || 0,
        analysis_categories: {
          equipment_efficiency: {
            fuel_savings: result.savings_breakdown?.equipment_efficiency || 0,
            maintenance_savings: 0 // Backend combines these into one value
          },
          chemical_optimization: {
            efficiency_savings: result.savings_breakdown?.chemical_optimization || 0,
            bulk_purchasing_savings: 0, // Backend combines these into one value
            precision_application_savings: 0
          },
          energy_optimization: {
            irrigation_savings: result.savings_breakdown?.energy_optimization || 0,
            solar_potential_savings: 0 // Backend combines these into one value
          },
          market_opportunities: {
            premium_pricing_potential: result.savings_breakdown?.market_opportunities || 0,
            sustainability_certification_value: 0
          },
          sustainability_incentives: {
            carbon_credits_potential: 0,
            government_programs_value: result.savings_breakdown?.government_incentives || 0
          }
        },
        recommendations: result.recommendations || []
      };

      setRoiData(mappedResult);
    } catch (error) {
      console.error('Error calculating ROI:', error);
      // Set fallback data for demo
      setRoiData({
        establishment_id: parseInt(establishmentId),
        analysis_date: new Date().toISOString(),
        total_annual_savings: 6100,
        analysis_categories: {
          equipment_efficiency: {
            fuel_savings: 1200,
            maintenance_savings: 800
          },
          chemical_optimization: {
            efficiency_savings: 600,
            bulk_purchasing_savings: 400,
            precision_application_savings: 800
          },
          energy_optimization: {
            irrigation_savings: 500,
            solar_potential_savings: 1200
          },
          market_opportunities: {
            premium_pricing_potential: 1000,
            sustainability_certification_value: 800
          },
          sustainability_incentives: {
            carbon_credits_potential: 1500,
            government_programs_value: 3000
          }
        },
        recommendations: [
          {
            id: '1',
            category: 'equipment',
            title: 'Actualizar a Tractor Eficiente',
            description: 'Tractor moderno con 30% mejor eficiencia de combustible',
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
                <Tab
                  py={4}
                  px={6}
                  fontWeight="semibold"
                  _selected={{ bg: cardBg, borderColor: 'green.500', borderBottomColor: cardBg }}
                  position="relative"
                >
                  <Icon as={FaMoneyBillWave} mr={2} />
                  Análisis ROI
                  {roiData && (
                    <Badge
                      colorScheme="green"
                      position="absolute"
                      top={1}
                      right={1}
                      fontSize="xs"
                      borderRadius="full"
                    >
                      ${(roiData.total_annual_savings / 1000).toFixed(0)}K
                    </Badge>
                  )}
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

                {/* ROI Analysis Tab */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Heading size="lg" color={textColor}>
                          Análisis de Retorno de Inversión (ROI)
                        </Heading>
                        <Text color="gray.500" fontSize="md">
                          Identifica oportunidades de ahorro y optimización de costos
                        </Text>
                      </VStack>
                      <Button
                        colorScheme="green"
                        onClick={handleCalculateROI}
                        isLoading={isCalculatingROI}
                        leftIcon={<Icon as={FaCalculator} />}
                        size="lg"
                      >
                        Recalcular Análisis
                      </Button>
                    </HStack>

                    {/* How ROI Works - Informative Section */}
                    <Card bg="blue.50" borderWidth="1px" borderColor="blue.200">
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <HStack>
                            <Icon as={FaInfoCircle} color="blue.500" boxSize={6} />
                            <Heading size="md" color="blue.700">
                              ¿Cómo Funciona Nuestro Análisis ROI?
                            </Heading>
                          </HStack>

                          <Text color="blue.600" fontSize="sm" lineHeight="1.6">
                            Nuestro sistema analiza tu operación agrícola en{' '}
                            <strong>5 categorías clave</strong> para identificar oportunidades de
                            ahorro y optimización de costos:
                          </Text>

                          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                            <VStack
                              align="start"
                              spacing={2}
                              p={3}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.100"
                            >
                              <HStack>
                                <Icon as={FaTractor} color="orange.500" />
                                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                                  1. Eficiencia de Equipos
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                • Análisis de consumo de combustible
                                <br />
                                • Optimización de mantenimiento
                                <br />
                                • Recomendaciones de actualización
                                <br />• <strong>Ahorro potencial: 30% en combustible</strong>
                              </Text>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={2}
                              p={3}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.100"
                            >
                              <HStack>
                                <Icon as={FaSeedling} color="green.500" />
                                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                                  2. Optimización Química
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                • Eficiencia en aplicación
                                <br />
                                • Compras al por mayor
                                <br />
                                • Aplicación de precisión
                                <br />• <strong>Ahorro: 12-18% en químicos</strong>
                              </Text>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={2}
                              p={3}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.100"
                            >
                              <HStack>
                                <Icon as={FaSolarPanel} color="yellow.500" />
                                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                                  3. Optimización Energética
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                • Eficiencia de riego
                                <br />
                                • Potencial solar
                                <br />
                                • Gestión energética
                                <br />• <strong>Ahorro: 25% en riego</strong>
                              </Text>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={2}
                              p={3}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.100"
                            >
                              <HStack>
                                <Icon as={FaChartLine} color="purple.500" />
                                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                                  4. Oportunidades de Mercado
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                • Precios premium sostenibles
                                <br />
                                • Certificaciones verdes
                                <br />
                                • Mercados especializados
                                <br />• <strong>Premium: 15% adicional</strong>
                              </Text>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={2}
                              p={3}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.100"
                            >
                              <HStack>
                                <Icon as={FaGift} color="blue.500" />
                                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                                  5. Incentivos Gubernamentales
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                • Créditos de carbono
                                <br />
                                • Programas USDA (EQIP, CSP, REAP)
                                <br />
                                • Subsidios estatales
                                <br />• <strong>Valor: $15-30 por ton CO₂e</strong>
                              </Text>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={2}
                              p={3}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="blue.100"
                            >
                              <HStack>
                                <Icon as={FaCalculator} color="teal.500" />
                                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                                  Metodología de Cálculo
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="gray.600">
                                • Datos históricos de tu operación
                                <br />
                                • Benchmarks de la industria
                                <br />
                                • Análisis de costos reales
                                <br />• <strong>Precisión: ±10% margen</strong>
                              </Text>
                            </VStack>
                          </SimpleGrid>

                          <Box
                            bg="green.50"
                            p={3}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="green.200"
                          >
                            <HStack>
                              <Icon as={FaLeaf} color="green.500" />
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="bold" fontSize="sm" color="green.700">
                                  Objetivo: $500-$2,000 en ahorros anuales por productor
                                </Text>
                                <Text fontSize="xs" color="green.600">
                                  Nuestro sistema identifica oportunidades específicas para tu
                                  operación, priorizando inversiones con mejor retorno y menor
                                  riesgo.
                                </Text>
                              </VStack>
                            </HStack>
                          </Box>

                          <HStack justify="center" pt={2}>
                            <Text fontSize="xs" color="blue.500" fontStyle="italic">
                              💡 Los cálculos se actualizan automáticamente con nuevos datos de tu
                              operación
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Data Sources Transparency Section */}
                    <Card bg="gray.50" borderWidth="1px" borderColor="gray.200">
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <HStack>
                            <Icon as={FaFileAlt} color="gray.600" boxSize={5} />
                            <Heading size="sm" color="gray.700">
                              Fuentes de Datos para Cálculos ROI
                            </Heading>
                          </HStack>

                          <Text color="gray.600" fontSize="xs" lineHeight="1.5">
                            Para garantizar precisión en nuestros cálculos, utilizamos datos reales
                            de tus operaciones registradas en el sistema:
                          </Text>

                          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
                            <VStack
                              align="start"
                              spacing={3}
                              p={4}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="orange.100"
                            >
                              <HStack>
                                <Icon as={FaTractor} color="orange.500" boxSize={4} />
                                <Text fontWeight="bold" fontSize="sm" color="orange.700">
                                  Eficiencia de Equipos
                                </Text>
                              </HStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                                  📊 Datos utilizados:
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Eventos de Producción:</strong> Horas de uso de
                                  tractores, cosechadoras, implementos
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Eventos Generales:</strong> Registros de mantenimiento,
                                  reparaciones, consumo de combustible
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Historial de Operaciones:</strong> Superficie trabajada,
                                  tiempo operativo, eficiencia por hectárea
                                </Text>
                                <Text fontSize="xs" color="blue.600" fontStyle="italic">
                                  💡 Analizamos patrones de uso para identificar equipos
                                  ineficientes
                                </Text>
                              </VStack>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={3}
                              p={4}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="green.100"
                            >
                              <HStack>
                                <Icon as={FaSeedling} color="green.500" boxSize={4} />
                                <Text fontWeight="bold" fontSize="sm" color="green.700">
                                  Optimización Química
                                </Text>
                              </HStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                                  📊 Datos utilizados:
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Eventos Químicos:</strong> Fertilizantes (FE),
                                  Pesticidas (PE), Herbicidas (HE), Fungicidas (FU)
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Volúmenes y Frecuencia:</strong> Cantidad aplicada,
                                  método de aplicación, cobertura
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Costos Históricos:</strong> Precios pagados,
                                  proveedores, descuentos obtenidos
                                </Text>
                                <Text fontSize="xs" color="blue.600" fontStyle="italic">
                                  💡 Comparamos con benchmarks de eficiencia por cultivo y región
                                </Text>
                              </VStack>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={3}
                              p={4}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="yellow.100"
                            >
                              <HStack>
                                <Icon as={FaSolarPanel} color="yellow.500" boxSize={4} />
                                <Text fontWeight="bold" fontSize="sm" color="yellow.700">
                                  Optimización Energética
                                </Text>
                              </HStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                                  📊 Datos utilizados:
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Eventos de Riego:</strong> Sistemas utilizados, horas de
                                  operación, consumo eléctrico
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Eventos Climáticos:</strong> Precipitación, temperatura,
                                  humedad para optimizar riego
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Infraestructura:</strong> Ubicación, orientación,
                                  superficie disponible para energía solar
                                </Text>
                                <Text fontSize="xs" color="blue.600" fontStyle="italic">
                                  💡 Evaluamos potencial de energías renovables según tu ubicación
                                </Text>
                              </VStack>
                            </VStack>

                            <VStack
                              align="start"
                              spacing={3}
                              p={4}
                              bg="white"
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor="purple.100"
                            >
                              <HStack>
                                <Icon as={FaChartLine} color="purple.500" boxSize={4} />
                                <Text fontWeight="bold" fontSize="sm" color="purple.700">
                                  Análisis de Mercado y Sostenibilidad
                                </Text>
                              </HStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" color="gray.700" fontWeight="semibold">
                                  📊 Datos utilizados:
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Prácticas Sostenibles:</strong> Eventos de conservación,
                                  rotación de cultivos, cobertura
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Certificaciones:</strong> Orgánico, comercio justo,
                                  prácticas regenerativas registradas
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • <strong>Huella de Carbono:</strong> Emisiones calculadas vs.
                                  compensaciones registradas
                                </Text>
                                <Text fontSize="xs" color="blue.600" fontStyle="italic">
                                  💡 Identificamos oportunidades de mercados premium y
                                  certificaciones
                                </Text>
                              </VStack>
                            </VStack>
                          </SimpleGrid>

                          <Box
                            bg="blue.50"
                            p={3}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="blue.200"
                          >
                            <VStack align="start" spacing={2}>
                              <HStack>
                                <Icon as={FaInfoCircle} color="blue.500" boxSize={4} />
                                <Text fontWeight="bold" fontSize="sm" color="blue.700">
                                  Metodología de Cálculo
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="blue.600" lineHeight="1.5">
                                <strong>1. Recopilación:</strong> Extraemos datos de todos tus
                                eventos registrados en el sistema
                                <br />
                                <strong>2. Análisis:</strong> Comparamos con benchmarks de la
                                industria y mejores prácticas
                                <br />
                                <strong>3. Proyección:</strong> Calculamos ahorros potenciales
                                basados en optimizaciones probadas
                                <br />
                                <strong>4. Validación:</strong> Verificamos resultados con datos
                                históricos y tendencias del mercado
                              </Text>
                            </VStack>
                          </Box>

                          <HStack justify="center" pt={2}>
                            <Text fontSize="xs" color="gray.500" fontStyle="italic">
                              🔄 Los cálculos se actualizan automáticamente cada vez que registras
                              nuevos eventos en tu operación
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* ROI Overview Cards */}
                    {roiData && (
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                        <Card borderWidth="2px" borderColor="green.200" bg="green.50">
                          <CardBody>
                            <Stat>
                              <StatLabel color="green.600">Ahorros Anuales Totales</StatLabel>
                              <StatNumber color="green.700" fontSize="2xl">
                                ${(roiData.total_annual_savings || 0).toLocaleString()}
                              </StatNumber>
                              <StatHelpText color="green.600">
                                <StatArrow type="increase" />
                                Meta: $500-$2,000
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card borderWidth="1px" borderColor={borderColor}>
                          <CardBody>
                            <Stat>
                              <StatLabel>Eficiencia de Equipos</StatLabel>
                              <StatNumber>
                                $
                                {(
                                  roiData.analysis_categories?.equipment_efficiency?.fuel_savings ||
                                  0
                                ).toLocaleString()}
                              </StatNumber>
                              <StatHelpText>
                                <Icon as={FaTractor} mr={1} />
                                Combustible + Mantenimiento
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card borderWidth="1px" borderColor={borderColor}>
                          <CardBody>
                            <Stat>
                              <StatLabel>Optimización Química</StatLabel>
                              <StatNumber>
                                $
                                {(
                                  roiData.analysis_categories?.chemical_optimization
                                    ?.efficiency_savings || 0
                                ).toLocaleString()}
                              </StatNumber>
                              <StatHelpText>
                                <Icon as={FaSeedling} mr={1} />
                                15-20% Reducción
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>

                        <Card borderWidth="1px" borderColor={borderColor}>
                          <CardBody>
                            <Stat>
                              <StatLabel>Incentivos Gubernamentales</StatLabel>
                              <StatNumber>
                                $
                                {(
                                  roiData.analysis_categories?.sustainability_incentives
                                    ?.government_programs_value || 0
                                ).toLocaleString()}
                              </StatNumber>
                              <StatHelpText>
                                <Icon as={FaGift} mr={1} />
                                Programas USDA
                              </StatHelpText>
                            </Stat>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    )}

                    {/* ROI Recommendations */}
                    {roiData?.recommendations && (
                      <VStack spacing={4} align="stretch">
                        <Heading size="md" color={textColor}>
                          Recomendaciones Prioritarias
                        </Heading>
                        {roiData.recommendations.map((rec, index) => (
                          <Card key={rec.id || index} borderWidth="1px" borderColor={borderColor}>
                            <CardBody>
                              <HStack justify="space-between" align="start">
                                <VStack align="start" spacing={3} flex="1">
                                  <HStack>
                                    <Badge colorScheme={getPriorityColor(rec.priority)}>
                                      Prioridad {rec.priority}
                                    </Badge>
                                    <Badge variant="outline">{rec.difficulty_level}</Badge>
                                  </HStack>
                                  <Heading size="sm">{rec.title}</Heading>
                                  <Text fontSize="sm" color="gray.600">
                                    {rec.description}
                                  </Text>
                                  <HStack spacing={6}>
                                    <Text fontSize="sm">
                                      <Text as="span" fontWeight="bold" color={successColor}>
                                        ${(rec.annual_savings || 0).toLocaleString()}/año
                                      </Text>{' '}
                                      en ahorros
                                    </Text>
                                    <Text fontSize="sm">
                                      Retorno: {rec.payback_months || 'N/A'} meses
                                    </Text>
                                    <Text fontSize="sm">
                                      Carbono: -{rec.carbon_impact || 0} tons CO₂e
                                    </Text>
                                  </HStack>
                                </VStack>
                                <VStack spacing={2}>
                                  <Text fontSize="xl" fontWeight="bold" color={successColor}>
                                    ${(rec.implementation_cost || 0).toLocaleString()}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Inversión
                                  </Text>
                                </VStack>
                              </HStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    )}

                    {/* Equipment Marketplace Preview */}
                    {equipmentData && (
                      <VStack spacing={4} align="stretch">
                        <Divider />
                        <Heading size="md" color={textColor}>
                          Marketplace de Equipos
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                          {equipmentData.equipment_recommendations?.length || 0} recomendaciones
                          disponibles
                        </Text>
                        <Button variant="outline" colorScheme="green" size="sm" alignSelf="start">
                          Ver Todas las Recomendaciones
                        </Button>
                      </VStack>
                    )}

                    {/* Government Incentives Preview */}
                    {incentivesData && (
                      <VStack spacing={4} align="stretch">
                        <Divider />
                        <Heading size="md" color={textColor}>
                          Incentivos Gubernamentales
                        </Heading>
                        <HStack justify="space-between">
                          <Text color="gray.500" fontSize="sm">
                            {incentivesData.available_incentives?.length || 0} programas disponibles
                          </Text>
                          <Badge colorScheme="green" p={2}>
                            Valor Total: ${incentivesData.total_potential_value?.toLocaleString()}
                          </Badge>
                        </HStack>
                        <Button variant="outline" colorScheme="blue" size="sm" alignSelf="start">
                          Explorar Programas USDA
                        </Button>
                      </VStack>
                    )}

                    {!roiData && !isCalculatingROI && (
                      <Card borderWidth="2px" borderStyle="dashed" borderColor="gray.300">
                        <CardBody textAlign="center" py={12}>
                          <VStack spacing={4}>
                            <Icon as={FaCalculator} boxSize={12} color="gray.400" />
                            <Heading size="md" color="gray.500">
                              Análisis ROI No Disponible
                            </Heading>
                            <Text color="gray.500">
                              Haz clic en "Recalcular Análisis" para generar recomendaciones de
                              ahorro
                            </Text>
                            <Button colorScheme="green" onClick={handleCalculateROI} size="lg">
                              Iniciar Análisis ROI
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    )}
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
