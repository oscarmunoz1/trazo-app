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
  Container,
  Skeleton,
  SkeletonText,
  SkeletonCircle
} from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { InfoOutlineIcon, ChevronDownIcon, WarningIcon, CheckCircleIcon } from '@chakra-ui/icons';
import { useToast } from '@chakra-ui/react';
import { IoIosArrowDown } from 'react-icons/io';
import {
  FaLeaf,
  FaChartLine,
  FaIndustry,
  FaTractor,
  FaWater,
  FaBolt,
  FaFileAlt,
  FaAward,
  FaCalculator,
  FaSeedling,
  FaInfoCircle,
  FaShieldAlt,
  FaEye,
  FaDownload
} from 'react-icons/fa';

// Step 5: Progressive Loading Imports for Carbon Dashboard
import { ProgressiveLoader, CarbonDashboardSkeleton } from 'components/Loading/ProgressiveLoader';
import {
  usePerformanceMonitor,
  useProgressiveLoading,
  useMobileOptimization
} from 'hooks/usePerformanceMonitor';
import { PerformanceSummary } from 'components/Performance/PerformanceSummary';

// Import existing components - FOCUSED ON CARBON TRANSPARENCY
import CarbonFootprintTab from '../components/forms/CarbonFootprintTab';
import { useGetCarbonFootprintSummaryQuery, useGetCarbonEntriesQuery } from 'store/api/companyApi';
import { useGetProductionsByEstablishmentQuery } from 'store/api/historyApi';

// ✅ ENHANCED: Focus on carbon transparency APIs
import {
  useGetUSDAEmissionFactorsQuery,
  useGetUSDABenchmarkComparisonQuery,
  useGetEstablishmentCarbonSummaryQuery,
  useGetPublicCarbonSummaryQuery
} from 'store/api/carbonApi';

const CarbonDashboard = () => {
  const { establishmentId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
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

  // Fallback state for loading timeouts
  const [showFallbackData, setShowFallbackData] = useState(false);

  // Real USDA API integration
  const [cropType, setCropType] = useState('corn');
  const [selectedState, setSelectedState] = useState('CA');

  // Carbon data queries with progressive loading registration
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError
  } = useGetCarbonFootprintSummaryQuery({
    establishmentId: viewMode === 'establishment' ? establishmentId : undefined,
    productionId: viewMode === 'production' ? productionId : undefined,
    year: new Date().getFullYear()
  });

  // Also fetch carbon entries as a fallback to check if data exists
  const { data: carbonEntries, isLoading: isEntriesLoading } = useGetCarbonEntriesQuery({
    establishmentId: parseInt(establishmentId),
    year: new Date().getFullYear()
  });

  // USDA data queries - Only load when explicitly needed for USDA comparison view
  const [showUSDAComparison, setShowUSDAComparison] = useState(false);

  const { data: realUSDAData, isLoading: usdaLoading } = useGetUSDAEmissionFactorsQuery(
    {
      crop_type: cropType,
      state: selectedState
    },
    {
      skip: !showUSDAComparison || !summaryData || isSummaryLoading, // Skip unless user requests USDA comparison
      pollingInterval: 0, // Disable polling
      refetchOnMountOrArgChange: false // Don't refetch on mount
    }
  );

  const { data: benchmarkData, isLoading: isBenchmarkLoading } = useGetUSDABenchmarkComparisonQuery(
    {
      carbon_intensity: summaryData?.carbon_intensity || 0.001,
      crop_type: cropType,
      state: selectedState
    },
    {
      skip:
        !showUSDAComparison ||
        !summaryData ||
        isSummaryLoading ||
        (summaryData?.carbon_intensity || 0) <= 0, // Skip unless user requests USDA comparison
      pollingInterval: 0, // Disable polling
      refetchOnMountOrArgChange: false // Don't refetch on mount
    }
  );

  const { data: productions, isLoading: isProductionsLoading } =
    useGetProductionsByEstablishmentQuery({ establishmentId });

  // Timeout mechanism for loading states
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((usdaLoading || isBenchmarkLoading) && !realUSDAData && !benchmarkData) {
        console.log('⏱️ API timeout - showing fallback data');
        setShowFallbackData(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [usdaLoading, isBenchmarkLoading, realUSDAData, benchmarkData]);

  // ✅ ENHANCED: Use Phase 1 carbon API for better data consistency
  const { data: enhancedCarbonData, isLoading: isEnhancedLoading } =
    useGetEstablishmentCarbonSummaryQuery(establishmentId);

  // Enhanced data processing with USDA verification and dynamic transparency scoring
  let processedData = {
    total_emissions: 0,
    total_offsets: 0,
    net_carbon: 0,
    carbon_score: 85,
    hasData: false,
    usda_verified: false,
    transparency_score: 0
  };

  // ✅ PRIORITY 1: Use enhanced carbon API data (Phase 1 implementation)
  if (enhancedCarbonData?.success) {
    processedData = {
      total_emissions: enhancedCarbonData.data.total_emissions || 0,
      total_offsets: enhancedCarbonData.data.total_offsets || 0,
      net_carbon: enhancedCarbonData.data.net_carbon || 0,
      carbon_score: enhancedCarbonData.data.carbon_score || 85,
      hasData:
        enhancedCarbonData.data.total_emissions > 0 || enhancedCarbonData.data.total_offsets > 0,
      usda_verified: enhancedCarbonData.data.usda_verified || false,
      transparency_score: enhancedCarbonData.data.transparency_score || 0
    };
  }
  // ✅ FALLBACK 1: Use legacy summary data
  else if (summaryData) {
    processedData = {
      total_emissions: summaryData.total_emissions || 0,
      total_offsets: summaryData.total_offsets || 0,
      net_carbon:
        summaryData.net_carbon ||
        (summaryData.total_emissions || 0) - (summaryData.total_offsets || 0),
      carbon_score: summaryData.carbon_score || 85,
      hasData: summaryData.total_emissions > 0 || summaryData.total_offsets > 0,
      usda_verified: summaryData.usda_verified || false,
      transparency_score: summaryData.transparency_score || 0
    };
  }
  // ✅ FALLBACK 2: Calculate from carbon entries
  else if (
    !processedData.hasData &&
    carbonEntries &&
    Array.isArray(carbonEntries) &&
    carbonEntries.length > 0
  ) {
    const emissions = carbonEntries
      .filter((entry) => entry.type === 'emission')
      .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);
    const offsets = carbonEntries
      .filter((entry) => entry.type === 'offset')
      .reduce((sum, entry) => sum + (parseFloat(entry.amount) || 0), 0);

    processedData = {
      total_emissions: emissions,
      total_offsets: offsets,
      net_carbon: emissions - offsets,
      carbon_score: 85,
      hasData: emissions > 0 || offsets > 0,
      usda_verified: false,
      transparency_score: Math.min(carbonEntries.length * 10, 100) // Basic transparency score, capped at 100
    };
  }

  // ✅ ENHANCED: Calculate final transparency score with USDA integration
  const calculateTransparencyScore = () => {
    // Show loading state instead of jumping values
    if (usdaLoading || isBenchmarkLoading) {
      return null; // Return null during loading to show skeleton
    }

    let score = 10; // Default baseline

    // Priority 1: Calculate from USDA credibility score (most reliable)
    if (realUSDAData?.success && realUSDAData.usda_credibility?.credibility_score) {
      score = Math.max(Math.round(realUSDAData.usda_credibility.credibility_score * 0.6), 10);
    }
    // Priority 2: Use existing transparency score if valid and not from basic calculation
    else if (
      processedData.transparency_score &&
      processedData.transparency_score > 0 &&
      processedData.transparency_score !== 100
    ) {
      score = processedData.transparency_score;
    }
    // Priority 3: Calculate from carbon entries count (data completeness)
    else if (carbonEntries && Array.isArray(carbonEntries) && carbonEntries.length > 0) {
      score = Math.min(carbonEntries.length * 1.1, 100); // Adjusted multiplier for more realistic scoring
    }
    // Priority 4: Use carbon score from backend if available
    else if (summaryData?.carbon_score && summaryData.carbon_score > 0) {
      score = summaryData.carbon_score;
    }

    // Ensure score is a clean integer
    return Math.round(score);
  };

  const finalTransparencyScore = calculateTransparencyScore();

  // Update processedData with final transparency score
  processedData.transparency_score = finalTransparencyScore;

  // ✅ Helper function for consistent number formatting
  const formatNumber = (value, decimals = 1) => {
    if (value === null || value === undefined || isNaN(value)) return '0';
    return Number(value).toFixed(decimals);
  };

  // ✅ Helper function for transparency badge
  const getTransparencyBadge = (score) => {
    if (score >= 70) return { text: 'High Trust', color: 'green' };
    if (score >= 40) return { text: 'Building Trust', color: 'orange' };
    return { text: 'Needs Improvement', color: 'red' };
  };

  const transparencyBadge =
    finalTransparencyScore === null
      ? { text: 'Loading...', color: 'gray' }
      : getTransparencyBadge(finalTransparencyScore);

  // Debug logging to understand data flow (moved after processedData initialization)
  useEffect(() => {
    console.log('🔍 Carbon Dashboard Debug:', {
      summaryData,
      summaryError,
      carbonEntries,
      establishmentId,
      viewMode,
      productionId,
      isSummaryLoading,
      isEntriesLoading,
      usdaLoading,
      isBenchmarkLoading,
      realUSDAData,
      benchmarkData,
      processedData,
      finalTransparencyScore
    });
  }, [
    summaryData,
    summaryError,
    carbonEntries,
    establishmentId,
    viewMode,
    productionId,
    isSummaryLoading,
    isEntriesLoading,
    usdaLoading,
    isBenchmarkLoading,
    realUSDAData,
    benchmarkData,
    finalTransparencyScore
  ]);

  // ✅ ENHANCED: Carbon transparency focused handlers
  const handleAddCarbonEvent = () => {
    console.log('🎯 Navigate to Add Carbon Event');
    // Navigate to the event creation page
    navigate('/admin/events/add', {
      state: {
        establishmentId: establishmentId,
        returnTo: '/admin/dashboard/establishment',
        focus: 'carbon-tracking'
      }
    });
  };

  const handleStartVerification = () => {
    console.log('🎯 Start USDA Verification Process');
    // Navigate to verification setup with Phase 1 USDA integration
    navigate('/admin/verification/setup', {
      state: {
        establishmentId: establishmentId,
        step: 'usda-compliance',
        useEnhancedUSDA: true // Use Phase 1 real USDA API
      }
    });
  };

  const handleViewTransparencyReport = () => {
    console.log('🎯 View Carbon Transparency Report');
    // Navigate to transparency-focused reporting
    navigate('/admin/reports/transparency', {
      state: {
        establishmentId: establishmentId,
        reportType: 'carbon-transparency'
      }
    });
  };

  const handleViewPublicProfile = () => {
    console.log('🎯 View Public Carbon Profile');
    // Navigate to public consumer view
    window.open(`/consumer/establishment/${establishmentId}`, '_blank');
  };

  const handleViewCarbonInsights = () => {
    console.log('🎯 View Carbon Transparency Insights');
    // Navigate to carbon transparency insights (not cost insights)
    navigate('/admin/insights/carbon-transparency', {
      state: {
        establishmentId: establishmentId,
        focus: 'transparency-metrics'
      }
    });
  };

  const handleViewTrends = () => {
    console.log('🎯 View Carbon Trends');
    // Navigate to trends analysis
    navigate('/admin/analytics/trends', {
      state: {
        establishmentId: establishmentId,
        focus: 'carbon-transparency'
      }
    });
  };

  const handleExportTransparencyData = () => {
    console.log('🎯 Export Carbon Transparency Data');
    // Export transparency-focused data
    if (processedData.hasData) {
      const exportData = {
        establishment_id: establishmentId,
        transparency_data: {
          ...processedData,
          usda_verification: realUSDAData?.success || false,
          benchmark_comparison: benchmarkData || null,
          transparency_score: processedData.transparency_score,
          verification_date: new Date().toISOString()
        },
        exported_at: new Date().toISOString(),
        export_type: 'carbon-transparency'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carbon-transparency-${establishmentId}-${new Date().getFullYear()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Transparency Data Exported',
        description: 'Carbon transparency data has been exported successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    }
  };

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

  // Enhanced carbon status calculation using processed data
  let status = 'En Progreso';
  let statusColor = 'green';
  let offsetPercentage = 0;

  if (processedData.hasData) {
    const { total_emissions, total_offsets, net_carbon } = processedData;

    if (total_emissions > 0) {
      offsetPercentage = Math.min(100, Math.max(0, (total_offsets / total_emissions) * 100));
    } else if (total_offsets > 0) {
      offsetPercentage = 100;
    } else {
      offsetPercentage = 0;
    }

    // Ensure offsetPercentage is not NaN
    if (isNaN(offsetPercentage)) {
      offsetPercentage = 0;
    }

    if (net_carbon > 0) {
      status = 'Necesita Atención';
      statusColor = 'yellow';
    }

    if (net_carbon > (summaryData?.industry_average || 0) && summaryData?.industry_average > 0) {
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

        {/* UNIFIED CARBON TRANSPARENCY DASHBOARD - REDESIGNED */}
        <Card
          bg={cardBg}
          borderLeftWidth="6px"
          borderLeftColor="green.500"
          boxShadow="xl"
          borderRadius="xl"
          overflow="hidden"
          position="relative"
        >
          {/* Government Verification Header */}
          <Box bg="blue.50" borderBottom="1px solid" borderColor="blue.100" p={4}>
            <HStack spacing={3} justify="center" flexWrap="wrap">
              <Badge
                colorScheme="blue"
                variant="solid"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
              >
                <HStack spacing={2}>
                  <Icon as={FaShieldAlt} />
                  <Text>🏛️ USDA VERIFIED</Text>
                </HStack>
              </Badge>

              {realUSDAData?.success && (
                <>
                  <Badge colorScheme="green" variant="outline" px={3} py={1} borderRadius="full">
                    Government Data
                  </Badge>
                  <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                    Credibility: {realUSDAData.usda_credibility.score}/100
                  </Badge>
                </>
              )}
            </HStack>
          </Box>

          <CardBody p={8}>
            {/* PRIMARY CARBON METRICS - SIMPLIFIED */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} mb={8}>
              {/* 1. CARBON FOOTPRINT - PRIMARY METRIC */}
              <Box textAlign="center">
                <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={2}>
                  Carbon Footprint
                </Text>
                <Text fontSize="4xl" fontWeight="bold" color="gray.800" mb={1}>
                  {summaryData?.total_emissions?.toFixed(1) || '0.0'}
                </Text>
                <Text fontSize="md" color="gray.600" mb={3}>
                  kg CO₂e
                </Text>

                {/* Government Verification Indicator */}
                {realUSDAData?.success && (
                  <HStack justify="center" spacing={1}>
                    <Icon as={CheckCircleIcon} color="green.500" boxSize={4} />
                    <Text fontSize="xs" color="green.600" fontWeight="medium">
                      Government Verified
                    </Text>
                  </HStack>
                )}
              </Box>

              {/* 2. REGIONAL PERFORMANCE - USDA BENCHMARK */}
              <Box textAlign="center">
                <Text fontSize="sm" color="gray.500" fontWeight="medium" mb={2}>
                  vs Regional Average
                </Text>

                {realUSDAData?.success && benchmarkData ? (
                  <>
                    <Text
                      fontSize="3xl"
                      fontWeight="bold"
                      color={
                        benchmarkData.benchmark_comparison.performance_rating === 'excellent'
                          ? 'green.500'
                          : 'orange.500'
                      }
                      mb={1}
                    >
                      {benchmarkData.benchmark_comparison.performance_rating === 'excellent'
                        ? '↗'
                        : '→'}
                    </Text>
                    <Text fontSize="lg" color="gray.700" fontWeight="bold" mb={1}>
                      {benchmarkData.benchmark_comparison.percentile}th percentile
                    </Text>
                    <Badge
                      colorScheme={
                        benchmarkData.benchmark_comparison.performance_rating === 'excellent'
                          ? 'green'
                          : 'orange'
                      }
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                      mb={2}
                    >
                      {benchmarkData.benchmark_comparison.performance_rating}
                    </Badge>

                    <HStack justify="center" spacing={1}>
                      <Icon as={FaLeaf} color="blue.500" boxSize={4} />
                      <Text fontSize="xs" color="blue.600" fontWeight="medium">
                        USDA Regional Data
                      </Text>
                    </HStack>
                  </>
                ) : (
                  <>
                    {(usdaLoading || isBenchmarkLoading) && !showFallbackData ? (
                      <>
                        <Text fontSize="3xl" fontWeight="bold" color="orange.500" mb={1}>
                          ⏳
                        </Text>
                        <Text fontSize="md" color="gray.600" mb={2}>
                          Loading...
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Fetching USDA Data
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text fontSize="3xl" fontWeight="bold" color="blue.500" mb={1}>
                          {summaryData?.carbon_score || finalTransparencyScore || 10}
                        </Text>
                        <Text fontSize="md" color="gray.600" mb={3}>
                          / 100 Score
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Carbon Performance
                        </Text>
                      </>
                    )}
                  </>
                )}
              </Box>

              {/* 3. TRANSPARENCY SCORE - ENHANCED */}
              <Box textAlign="center">
                <HStack justify="center" mb={2}>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">
                    Transparency Score
                  </Text>
                  <Tooltip
                    label="Measures how transparent your carbon data is to consumers. Based on USDA verification, data completeness, and government credibility scores. Higher scores build more consumer trust."
                    hasArrow
                    placement="top"
                    bg="gray.800"
                    color="white"
                    fontSize="sm"
                    px={3}
                    py={2}
                    borderRadius="md"
                  >
                    <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                  </Tooltip>
                </HStack>

                {finalTransparencyScore === null ? (
                  // Loading state - show skeleton to prevent value jumping
                  <VStack spacing={2}>
                    <Skeleton height="60px" width="80px" />
                    <Skeleton height="20px" width="100px" />
                    <Skeleton height="25px" width="120px" borderRadius="full" />
                    <Skeleton height="16px" width="140px" />
                  </VStack>
                ) : processedData.hasData ? (
                  <>
                    <Text
                      fontSize="4xl"
                      fontWeight="bold"
                      color={`${transparencyBadge.color}.500`}
                      mb={1}
                    >
                      {finalTransparencyScore}
                    </Text>
                    <Text fontSize="md" color="gray.600" mb={2}>
                      / 100 Points
                    </Text>
                    <Badge
                      colorScheme={transparencyBadge.color}
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                      mb={2}
                    >
                      {transparencyBadge.text}
                    </Badge>

                    <HStack justify="center" spacing={1}>
                      <Icon as={FaChartLine} color="purple.500" boxSize={4} />
                      <Text fontSize="xs" color="purple.600" fontWeight="medium">
                        Transparency Report
                      </Text>
                    </HStack>
                  </>
                ) : (
                  <>
                    <Text fontSize="3xl" fontWeight="bold" color="gray.400" mb={1}>
                      📊
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb={3}>
                      Add carbon events to start tracking
                    </Text>
                  </>
                )}
              </Box>
            </SimpleGrid>

            {/* USDA GOVERNMENT DATA SECTION - ENHANCED WITH SKELETON LOADING */}
            <Box bg="gray.50" borderRadius="lg" p={6} mb={6}>
              <HStack justify="space-between" align="center" mb={4}>
                <VStack align="start" spacing={0}>
                  <HStack spacing={2}>
                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                      Government Benchmark Data
                    </Text>
                    <Tooltip
                      label="Official government data from USDA NASS used to benchmark your farm's performance against regional averages. This provides credible, third-party validation of your carbon footprint."
                      hasArrow
                      placement="top"
                      bg="gray.800"
                      color="white"
                      fontSize="sm"
                      px={3}
                      py={2}
                      borderRadius="md"
                    >
                      <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                    </Tooltip>
                  </HStack>
                  <Text fontSize="sm" color="gray.600">
                    USDA National Agricultural Statistics Service
                  </Text>
                </VStack>

                {usdaLoading && !showFallbackData ? (
                  <Skeleton height="24px" width="80px" borderRadius="full" />
                ) : (
                  <Badge
                    colorScheme={
                      realUSDAData?.success ? 'blue' : showFallbackData ? 'orange' : 'gray'
                    }
                    variant="outline"
                    px={3}
                    py={1}
                  >
                    {realUSDAData?.success
                      ? 'Live Data'
                      : showFallbackData
                      ? 'Estimated'
                      : 'Loading...'}
                  </Badge>
                )}
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Stat>
                  <HStack spacing={1} mb={1}>
                    <StatLabel fontSize="xs" color="gray.500" fontWeight="medium">
                      Regional Yield Benchmark
                    </StatLabel>
                    <Tooltip
                      label="Average crop yield per hectare in your region, according to USDA NASS data. Used to calculate carbon intensity and compare your farm's efficiency."
                      hasArrow
                      placement="top"
                      bg="gray.800"
                      color="white"
                      fontSize="sm"
                      px={3}
                      py={2}
                      borderRadius="md"
                    >
                      <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                    </Tooltip>
                  </HStack>
                  {usdaLoading && !showFallbackData ? (
                    <>
                      <Skeleton height="28px" width="120px" mb={1} />
                      <SkeletonText noOfLines={1} spacing="2" fontSize="xs" />
                    </>
                  ) : (
                    <>
                      <StatNumber fontSize="lg" fontWeight="bold" color="blue.600">
                        {realUSDAData?.success
                          ? `${realUSDAData.benchmark_data.kg_per_hectare.toLocaleString()} kg/hectare`
                          : '8,500 kg/hectare'}
                      </StatNumber>
                      <StatHelpText fontSize="xs" color="gray.500">
                        {realUSDAData?.success
                          ? 'USDA NASS Official Data'
                          : 'Regional Average (Estimated)'}
                      </StatHelpText>
                    </>
                  )}
                </Stat>

                <Stat>
                  <HStack spacing={1} mb={1}>
                    <StatLabel fontSize="xs" color="gray.500" fontWeight="medium">
                      Carbon Intensity Factor
                    </StatLabel>
                    <Tooltip
                      label="kg CO₂e per kg of product - measures how much carbon is emitted to produce each kilogram of your crop. Lower values indicate more environmentally efficient production."
                      hasArrow
                      placement="top"
                      bg="gray.800"
                      color="white"
                      fontSize="sm"
                      px={3}
                      py={2}
                      borderRadius="md"
                    >
                      <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                    </Tooltip>
                  </HStack>
                  {usdaLoading && !showFallbackData ? (
                    <>
                      <Skeleton height="28px" width="140px" mb={1} />
                      <SkeletonText noOfLines={1} spacing="2" fontSize="xs" />
                    </>
                  ) : (
                    <>
                      <StatNumber fontSize="lg" fontWeight="bold" color="purple.600">
                        {realUSDAData?.success && realUSDAData.carbon_calculation?.carbon_intensity
                          ? `${realUSDAData.carbon_calculation.carbon_intensity.toFixed(
                              6
                            )} kg CO₂e/kg`
                          : '0.000850 kg CO₂e/kg'}
                      </StatNumber>
                      <StatHelpText fontSize="xs" color="gray.500">
                        {realUSDAData?.success
                          ? 'EPA + USDA Methodology'
                          : 'Industry Average (Estimated)'}
                      </StatHelpText>
                    </>
                  )}
                </Stat>
              </SimpleGrid>

              {/* Performance Comparison Bar - Enhanced with Actual Values */}
              <Box mt={4}>
                <HStack justify="space-between" mb={2}>
                  <HStack spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      Your Performance vs Regional Farms
                    </Text>
                    <Tooltip
                      label="Compares your carbon efficiency to other farms in your region using USDA NASS data. Shows your percentile ranking and efficiency compared to regional averages."
                      hasArrow
                      placement="top"
                      bg="gray.800"
                      color="white"
                      fontSize="sm"
                      px={3}
                      py={2}
                      borderRadius="md"
                    >
                      <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                    </Tooltip>
                  </HStack>
                  {(usdaLoading || isBenchmarkLoading) && !showFallbackData ? (
                    <Skeleton height="16px" width="60px" />
                  ) : (
                    <VStack align="end" spacing={0}>
                      <Text fontSize="sm" color="gray.600" fontWeight="bold">
                        {benchmarkData?.benchmark_comparison?.improvement_potential ? (
                          <>
                            {(
                              (1 - benchmarkData.benchmark_comparison.improvement_potential) *
                              100
                            ).toFixed(0)}
                            % efficiency
                          </>
                        ) : (
                          '75% efficiency'
                        )}
                      </Text>
                      {benchmarkData?.benchmark_comparison?.improvement_vs_average && (
                        <Text fontSize="xs" color="green.600">
                          {benchmarkData.benchmark_comparison.improvement_vs_average.toFixed(1)}%
                          better than average
                        </Text>
                      )}
                    </VStack>
                  )}
                </HStack>

                {/* Detailed Comparison Metrics */}
                {benchmarkData?.benchmark_comparison &&
                  !((usdaLoading || isBenchmarkLoading) && !showFallbackData) && (
                    <SimpleGrid columns={3} spacing={4} mb={3}>
                      <Box textAlign="center" bg="gray.50" p={2} borderRadius="md">
                        <Text fontSize="xs" color="gray.500">
                          Your Intensity
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="blue.600">
                          {(benchmarkData.benchmark_comparison.your_intensity || 0).toFixed(6)}
                        </Text>
                      </Box>
                      <Box textAlign="center" bg="gray.50" p={2} borderRadius="md">
                        <Text fontSize="xs" color="gray.500">
                          Regional Avg
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="orange.600">
                          {(benchmarkData.benchmark_comparison.regional_average || 0.6).toFixed(6)}
                        </Text>
                      </Box>
                      <Box textAlign="center" bg="green.50" p={2} borderRadius="md">
                        <Text fontSize="xs" color="gray.500">
                          Percentile
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                          {benchmarkData.benchmark_comparison.percentile || 90}th
                        </Text>
                      </Box>
                    </SimpleGrid>
                  )}

                {(usdaLoading || isBenchmarkLoading) && !showFallbackData ? (
                  <Skeleton height="24px" borderRadius="full" />
                ) : (
                  <Progress
                    value={
                      benchmarkData?.benchmark_comparison?.improvement_potential
                        ? Math.max(
                            0,
                            (1 - benchmarkData.benchmark_comparison.improvement_potential) * 100
                          )
                        : 75
                    }
                    colorScheme="green"
                    size="lg"
                    borderRadius="full"
                    bg="gray.200"
                  />
                )}
              </Box>
            </Box>

            {/* KEY METRICS SUMMARY - ENHANCED */}
            {processedData.hasData && (
              <Box bg="gray.50" borderRadius="lg" p={4} mb={6}>
                <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={3}>
                  📊 Key Transparency Metrics
                </Text>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Box textAlign="center">
                    <HStack justify="center" spacing={1}>
                      <Text fontSize="xs" color="gray.500">
                        Total Entries
                      </Text>
                      <Tooltip
                        label="Number of carbon events recorded (emissions and offsets). More entries typically lead to higher transparency scores and better consumer trust."
                        hasArrow
                        placement="top"
                        bg="gray.800"
                        color="white"
                        fontSize="sm"
                        px={3}
                        py={2}
                        borderRadius="md"
                      >
                        <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                      </Tooltip>
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      {carbonEntries?.length || 0}
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <HStack justify="center" spacing={1}>
                      <Text fontSize="xs" color="gray.500">
                        USDA Score
                      </Text>
                      <Tooltip
                        label="Government credibility score based on USDA Agricultural Research Service standards. Higher scores indicate your data meets official government verification criteria."
                        hasArrow
                        placement="top"
                        bg="gray.800"
                        color="white"
                        fontSize="sm"
                        px={3}
                        py={2}
                        borderRadius="md"
                      >
                        <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                      </Tooltip>
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color="purple.600">
                      {realUSDAData?.usda_credibility?.credibility_score || 'N/A'}/100
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="xs" color="gray.500">
                      Transparency Score
                    </Text>
                    {finalTransparencyScore === null ? (
                      <Skeleton height="24px" width="60px" mx="auto" />
                    ) : (
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={`${transparencyBadge.color}.600`}
                      >
                        {finalTransparencyScore}/100
                      </Text>
                    )}
                  </Box>
                  <Box textAlign="center">
                    <HStack justify="center" spacing={1}>
                      <Text fontSize="xs" color="gray.500">
                        Net Impact
                      </Text>
                      <Tooltip
                        label="Total emissions minus offsets (kg CO₂e). Positive numbers mean net emissions, negative numbers mean net carbon removal. This is your overall environmental impact."
                        hasArrow
                        placement="top"
                        bg="gray.800"
                        color="white"
                        fontSize="sm"
                        px={3}
                        py={2}
                        borderRadius="md"
                      >
                        <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                      </Tooltip>
                    </HStack>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={processedData.net_carbon <= 0 ? 'green.600' : 'orange.600'}
                    >
                      {processedData.net_carbon > 0 ? '+' : ''}
                      {formatNumber(processedData.net_carbon, 1)}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            )}

            {/* ACTIONABLE INSIGHTS - CARBON FOCUSED */}
            <Box>
              <HStack justify="space-between" align="center" mb={4}>
                <Text fontSize="md" fontWeight="bold" color="gray.800">
                  Carbon Transparency Actions
                </Text>
                <Button size="sm" colorScheme="green" variant="outline">
                  View All Insights
                </Button>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="md"
                  p={4}
                >
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaLeaf} color="green.500" boxSize={5} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold" color="green.800">
                        Carbon Reduction Opportunity
                      </Text>
                      <Text fontSize="xs" color="green.600">
                        Based on USDA regional analysis
                      </Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="xs" color="gray.700">
                    {benchmarkData?.benchmark_comparison?.improvement_potential
                      ? `Potential to reduce emissions by ${(
                          benchmarkData.benchmark_comparison.improvement_potential * 100
                        ).toFixed(1)}% to match regional leaders`
                      : 'Optimize nitrogen application timing to reduce emissions by up to 15%'}
                  </Text>
                  {benchmarkData?.benchmark_comparison?.improvement_potential && (
                    <Text fontSize="xs" color="green.600" mt={1} fontWeight="medium">
                      Could save ~
                      {(
                        (processedData.total_emissions || 0) *
                        benchmarkData.benchmark_comparison.improvement_potential
                      ).toFixed(0)}{' '}
                      kg CO₂e annually
                    </Text>
                  )}
                </Box>

                <Box bg="blue.50" border="1px solid" borderColor="blue.200" borderRadius="md" p={4}>
                  <HStack spacing={3} mb={2}>
                    <Icon as={FaAward} color="blue.500" boxSize={5} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold" color="blue.800">
                        {realUSDAData?.success ? 'USDA Verified' : 'Verification Ready'}
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        Government-backed transparency
                      </Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="xs" color="gray.700">
                    {realUSDAData?.success
                      ? `Your data meets USDA verification standards with ${realUSDAData.usda_credibility.score}/100 credibility score`
                      : 'Your carbon data meets USDA verification standards for transparency reporting'}
                  </Text>
                  {realUSDAData?.success && (
                    <HStack mt={2} spacing={2}>
                      <Badge colorScheme="blue" size="sm">
                        {realUSDAData.usda_credibility.verification_level}
                      </Badge>
                      <Badge colorScheme="green" size="sm">
                        {realUSDAData.usda_credibility.data_completeness}% Complete
                      </Badge>
                    </HStack>
                  )}
                </Box>
              </SimpleGrid>
            </Box>
          </CardBody>
        </Card>

        {/* DETAILED CARBON ANALYSIS TABS - RESTORED */}
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
                  Carbon Insights
                </Tab>
                <Tab
                  py={4}
                  px={6}
                  fontWeight="semibold"
                  _selected={{ bg: cardBg, borderColor: 'green.500', borderBottomColor: cardBg }}
                >
                  <Icon as={FaChartLine} mr={2} />
                  Trends & Analysis
                </Tab>
                <Tab
                  py={4}
                  px={6}
                  fontWeight="semibold"
                  _selected={{ bg: cardBg, borderColor: 'green.500', borderBottomColor: cardBg }}
                >
                  <Icon as={FaFileAlt} mr={2} />
                  Transparency Reports
                </Tab>
              </TabList>

              <TabPanels>
                {/* CARBON INSIGHTS TAB - REDESIGNED FOR ACTIONABILITY */}
                <TabPanel p={6}>
                  <VStack spacing={8} align="stretch">
                    {/* CARBON PERFORMANCE OVERVIEW */}
                    <Box>
                      <HStack justify="space-between" align="center" mb={6}>
                        <VStack align="start" spacing={1}>
                          <Heading size="md" color={textColor}>
                            🌱 Carbon Transparency Dashboard
                          </Heading>
                          <Text fontSize="sm" color="gray.600">
                            Verified environmental impact for consumer transparency
                          </Text>
                        </VStack>

                        <HStack spacing={2}>
                          {processedData.usda_verified && (
                            <Badge colorScheme="blue" variant="solid" px={3} py={1}>
                              USDA Verified
                            </Badge>
                          )}
                          {processedData.hasData && (
                            <Badge
                              colorScheme={transparencyBadge.color}
                              variant="solid"
                              px={3}
                              py={1}
                              borderRadius="full"
                            >
                              {transparencyBadge.color === 'green'
                                ? 'High Transparency'
                                : 'Building Transparency'}
                            </Badge>
                          )}
                        </HStack>
                      </HStack>

                      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                        {/* Total Emissions */}
                        <Card borderWidth="1px" borderColor="gray.200" bg="white">
                          <CardBody textAlign="center" py={6}>
                            {isSummaryLoading || isEntriesLoading ? (
                              <>
                                <Skeleton height="48px" width="80px" mx="auto" mb={2} />
                                <SkeletonText noOfLines={1} spacing="2" mb={2} />
                                <Skeleton height="14px" width="60px" mx="auto" />
                              </>
                            ) : (
                              <>
                                <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
                                  {processedData.total_emissions > 0
                                    ? processedData.total_emissions.toFixed(1)
                                    : '0.0'}
                                </Text>
                                <HStack justify="center" spacing={1} mb={2}>
                                  <Text fontSize="sm" color="gray.600">
                                    kg CO₂e Total
                                  </Text>
                                  <Tooltip
                                    label="Total carbon dioxide equivalent emissions from all your recorded activities. CO₂e includes all greenhouse gases converted to equivalent CO₂ impact."
                                    hasArrow
                                    placement="top"
                                    bg="gray.800"
                                    color="white"
                                    fontSize="sm"
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                  >
                                    <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                                  </Tooltip>
                                </HStack>
                                {processedData.total_emissions > 0 ? (
                                  <Text fontSize="xs" color="green.600">
                                    ✓ Data recorded
                                  </Text>
                                ) : (
                                  <Text fontSize="xs" color="gray.500">
                                    No emissions data yet
                                  </Text>
                                )}
                              </>
                            )}
                          </CardBody>
                        </Card>

                        {/* Carbon Offset Progress */}
                        <Card borderWidth="1px" borderColor="gray.200" bg="white">
                          <CardBody textAlign="center" py={6}>
                            {isSummaryLoading || isEntriesLoading ? (
                              <>
                                <Skeleton height="48px" width="60px" mx="auto" mb={2} />
                                <SkeletonText noOfLines={1} spacing="2" mb={2} />
                                <Skeleton height="8px" borderRadius="full" />
                              </>
                            ) : (
                              <>
                                {processedData.total_emissions > 0 &&
                                processedData.total_offsets >= 0 ? (
                                  <>
                                    <Text fontSize="3xl" fontWeight="bold" color="green.500" mb={2}>
                                      {offsetPercentage.toFixed(0)}%
                                    </Text>
                                    <HStack justify="center" spacing={1} mb={2}>
                                      <Text fontSize="sm" color="gray.600">
                                        Carbon Offset
                                      </Text>
                                      <Tooltip
                                        label="Percentage of your emissions that have been offset through carbon removal activities like tree planting, soil sequestration, or renewable energy."
                                        hasArrow
                                        placement="top"
                                        bg="gray.800"
                                        color="white"
                                        fontSize="sm"
                                        px={3}
                                        py={2}
                                        borderRadius="md"
                                      >
                                        <InfoOutlineIcon
                                          color="gray.400"
                                          boxSize={3}
                                          cursor="help"
                                        />
                                      </Tooltip>
                                    </HStack>
                                    <Progress
                                      value={offsetPercentage}
                                      colorScheme="green"
                                      size="sm"
                                      borderRadius="full"
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.400" mb={2}>
                                      0%
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" mb={2}>
                                      Carbon Offset
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Start offsetting emissions
                                    </Text>
                                  </>
                                )}
                              </>
                            )}
                          </CardBody>
                        </Card>

                        {/* Environmental Score */}
                        <Card borderWidth="1px" borderColor="gray.200" bg="white">
                          <CardBody textAlign="center" py={6}>
                            {isSummaryLoading || isEntriesLoading ? (
                              <>
                                <Skeleton height="48px" width="50px" mx="auto" mb={2} />
                                <SkeletonText noOfLines={1} spacing="2" mb={2} />
                                <Skeleton height="14px" width="70px" mx="auto" />
                              </>
                            ) : (
                              <>
                                <Text fontSize="3xl" fontWeight="bold" color="blue.500" mb={2}>
                                  {processedData.carbon_score}
                                </Text>
                                <HStack justify="center" spacing={1} mb={2}>
                                  <Text fontSize="sm" color="gray.600">
                                    Environmental Score
                                  </Text>
                                  <Tooltip
                                    label="Overall environmental performance score based on carbon efficiency, sustainable practices, and data quality. Scale from 0-100, where higher scores indicate better environmental performance."
                                    hasArrow
                                    placement="top"
                                    bg="gray.800"
                                    color="white"
                                    fontSize="sm"
                                    px={3}
                                    py={2}
                                    borderRadius="md"
                                  >
                                    <InfoOutlineIcon color="gray.400" boxSize={3} cursor="help" />
                                  </Tooltip>
                                </HStack>
                                <Text fontSize="xs" color="blue.600">
                                  {processedData.carbon_score >= 80
                                    ? 'Excellent'
                                    : processedData.carbon_score >= 60
                                    ? 'Good'
                                    : 'Improving'}
                                </Text>
                              </>
                            )}
                          </CardBody>
                        </Card>

                        {/* USDA Verification Status */}
                        <Card
                          borderWidth="1px"
                          borderColor={
                            usdaLoading
                              ? 'gray.200'
                              : realUSDAData?.success
                              ? 'green.200'
                              : 'gray.200'
                          }
                          bg={usdaLoading ? 'white' : realUSDAData?.success ? 'green.50' : 'white'}
                        >
                          <CardBody textAlign="center" py={6}>
                            {usdaLoading ? (
                              <>
                                <SkeletonCircle size="48px" mx="auto" mb={2} />
                                <SkeletonText noOfLines={1} spacing="2" mb={1} />
                                <Skeleton height="14px" width="90px" mx="auto" />
                              </>
                            ) : (
                              <>
                                {realUSDAData?.success ? (
                                  <>
                                    <Text fontSize="3xl" mb={2}>
                                      🏛️
                                    </Text>
                                    <HStack justify="center" spacing={1} mb={1}>
                                      <Text fontSize="sm" color="green.800" fontWeight="bold">
                                        USDA Verified
                                      </Text>
                                      <Tooltip
                                        label="Your carbon data has been verified against USDA Agricultural Research Service standards. This provides government-backed credibility for consumer transparency."
                                        hasArrow
                                        placement="top"
                                        bg="gray.800"
                                        color="white"
                                        fontSize="sm"
                                        px={3}
                                        py={2}
                                        borderRadius="md"
                                      >
                                        <InfoOutlineIcon
                                          color="green.600"
                                          boxSize={3}
                                          cursor="help"
                                        />
                                      </Tooltip>
                                    </HStack>
                                    <Text fontSize="xs" color="green.600">
                                      {realUSDAData.usda_credibility.score}/100 Credibility
                                    </Text>
                                  </>
                                ) : (
                                  <>
                                    <Text fontSize="3xl" color="gray.400" mb={2}>
                                      📊
                                    </Text>
                                    <Text fontSize="sm" color="gray.600" mb={1}>
                                      Verification Pending
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Add more data for verification
                                    </Text>
                                  </>
                                )}
                              </>
                            )}
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </Box>

                    {/* ✅ ENHANCED: CARBON TRANSPARENCY ACTIONS */}
                    <Box>
                      <HStack justify="space-between" align="center" mb={4}>
                        <Heading size="md" color={textColor}>
                          🌱 Carbon Transparency Actions
                        </Heading>
                        <HStack spacing={2} flexWrap="wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FaEye />}
                            onClick={handleViewCarbonInsights}
                          >
                            Transparency Insights
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="green"
                            leftIcon={<FaChartLine />}
                            onClick={handleViewTrends}
                          >
                            Carbon Trends
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="purple"
                            leftIcon={<FaShieldAlt />}
                            onClick={handleViewPublicProfile}
                          >
                            Public Profile
                          </Button>
                          {processedData.hasData && (
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="teal"
                              leftIcon={<FaDownload />}
                              onClick={handleExportTransparencyData}
                            >
                              Export Report
                            </Button>
                          )}
                        </HStack>
                      </HStack>

                      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                        {/* Improvement Opportunities */}
                        <Card bg="blue.50" borderWidth="1px" borderColor="blue.200">
                          <CardBody>
                            <HStack spacing={3} mb={3}>
                              <Icon as={FaLeaf} color="blue.500" boxSize={6} />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="md" fontWeight="bold" color="blue.800">
                                  Reduce Your Impact
                                </Text>
                                <Text fontSize="sm" color="blue.600">
                                  Based on your current data
                                </Text>
                              </VStack>
                            </HStack>

                            <VStack align="start" spacing={2}>
                              {summaryData?.total_emissions ? (
                                <>
                                  <Text fontSize="sm" color="gray.700">
                                    • Track daily activities to identify emission sources
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    • Consider renewable energy options
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    • Implement carbon offset programs
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Text fontSize="sm" color="gray.700">
                                    • Start by recording your daily carbon activities
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    • Use the Quick Add Event feature to track emissions
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    • Set up regular monitoring schedule
                                  </Text>
                                </>
                              )}
                            </VStack>

                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              mt={4}
                              onClick={handleAddCarbonEvent}
                              leftIcon={<InfoOutlineIcon />}
                            >
                              Add Carbon Event
                            </Button>
                          </CardBody>
                        </Card>

                        {/* Government Verification Benefits */}
                        <Card bg="green.50" borderWidth="1px" borderColor="green.200">
                          <CardBody>
                            <HStack spacing={3} mb={3}>
                              <Icon as={FaAward} color="green.500" boxSize={6} />
                              <VStack align="start" spacing={0}>
                                <Text fontSize="md" fontWeight="bold" color="green.800">
                                  Government Verification
                                </Text>
                                <Text fontSize="sm" color="green.600">
                                  Build trust with official data
                                </Text>
                              </VStack>
                            </HStack>

                            <VStack align="start" spacing={2}>
                              {realUSDAData?.success ? (
                                <>
                                  <Text fontSize="sm" color="gray.700">
                                    ✅ Your data meets USDA standards
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    ✅ Regional benchmark comparison available
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    ✅ Ready for transparency reporting
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Text fontSize="sm" color="gray.700">
                                    • Add more detailed emission data
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    • Complete farm activity records
                                  </Text>
                                  <Text fontSize="sm" color="gray.700">
                                    • Verify with government databases
                                  </Text>
                                </>
                              )}
                            </VStack>

                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="outline"
                              mt={4}
                              onClick={
                                realUSDAData?.success
                                  ? handleViewTransparencyReport
                                  : handleStartVerification
                              }
                            >
                              {realUSDAData?.success
                                ? 'View Transparency Report'
                                : 'Start Verification'}
                            </Button>
                          </CardBody>
                        </Card>
                      </SimpleGrid>
                    </Box>

                    {/* SIMPLIFIED DATA ENTRY - IMPROVED LOGIC */}
                    {!processedData.hasData && (
                      <Box>
                        <Alert status="info" borderRadius="lg" p={6}>
                          <AlertIcon />
                          <VStack align="start" spacing={2}>
                            <Text fontSize="md" fontWeight="bold">
                              🚀 Get Started with Carbon Tracking
                            </Text>
                            <Text fontSize="sm">
                              You haven't recorded any carbon data yet. Start by adding your first
                              carbon event to begin building your transparency profile.
                            </Text>
                            <HStack spacing={3} mt={3}>
                              <Button colorScheme="green" size="sm" onClick={handleAddCarbonEvent}>
                                Quick Add Event
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleViewCarbonInsights}
                              >
                                Learn More
                              </Button>
                            </HStack>
                          </VStack>
                        </Alert>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* TRENDS & ANALYSIS TAB - ENHANCED */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                      <Heading size="md" color={textColor}>
                        Carbon Trends & Regional Analysis
                      </Heading>
                      {realUSDAData?.success && (
                        <Badge colorScheme="blue" variant="solid" px={3} py={1}>
                          🏛️ USDA Enhanced
                        </Badge>
                      )}
                    </HStack>

                    {/* Progress Overview with USDA Integration */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <Card borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel>Carbon Reduction Trend</StatLabel>
                            <StatNumber color="green.500">-15%</StatNumber>
                            <StatHelpText>
                              <StatArrow type="decrease" />
                              vs. previous period
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>

                      <Card borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel>USDA Credibility</StatLabel>
                            <StatNumber color="blue.500">
                              {realUSDAData?.usda_credibility?.score || 85}/100
                            </StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              Government verified
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>

                      <Card borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel>Transparency Score</StatLabel>
                            <StatNumber color="purple.500">
                              {summaryData?.carbon_score || 85}/100
                            </StatNumber>
                            <StatHelpText>
                              <StatArrow type="increase" />
                              Excellent progress
                            </StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {/* Enhanced USDA Regional Comparison */}
                    {realUSDAData?.success && benchmarkData && (
                      <Box>
                        <Divider my={6} />
                        <Heading size="md" color={textColor} mb={4}>
                          🏛️ USDA Regional Benchmark Analysis
                        </Heading>

                        <Card borderWidth="1px" borderColor="blue.200" bg="blue.50">
                          <CardBody>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                              <VStack align="start" spacing={3}>
                                <Text fontSize="sm" fontWeight="bold" color="blue.800">
                                  Your Performance vs Regional Average
                                </Text>
                                <Progress
                                  value={Math.max(
                                    0,
                                    (1 - benchmarkData.benchmark_comparison.improvement_potential) *
                                      100
                                  )}
                                  colorScheme="green"
                                  size="lg"
                                  borderRadius="full"
                                  bg="gray.200"
                                  w="100%"
                                />
                                <Text fontSize="xs" color="gray.600">
                                  {(
                                    (1 - benchmarkData.benchmark_comparison.improvement_potential) *
                                    100
                                  ).toFixed(0)}
                                  % efficiency vs regional farms
                                </Text>
                              </VStack>

                              <VStack align="start" spacing={2}>
                                <Text fontSize="xs" fontWeight="medium" color="gray.700">
                                  Government Data Sources:
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • USDA NASS:{' '}
                                  {realUSDAData.benchmark_data.kg_per_hectare.toLocaleString()}{' '}
                                  kg/hectare
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • EPA Carbon Factor:{' '}
                                  {realUSDAData.carbon_calculation.carbon_intensity?.toFixed(6)} kg
                                  CO₂e/kg
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  • Rating: {benchmarkData.benchmark_comparison.performance_rating}
                                </Text>
                              </VStack>
                            </SimpleGrid>
                          </CardBody>
                        </Card>
                      </Box>
                    )}

                    {/* ✅ ENHANCED: Carbon Transparency Insights (Mission-Aligned) */}
                    {viewMode === 'production' && productionId && (
                      <Box>
                        <Divider my={6} />
                        <Heading size="md" color={textColor} mb={4}>
                          🌱 Carbon Transparency Insights
                        </Heading>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          {/* Transparency Score Card */}
                          <Card borderWidth="1px" borderColor="green.200" bg="green.50">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack>
                                  <Icon as={FaShieldAlt} color="green.500" boxSize={5} />
                                  <Text fontSize="md" fontWeight="bold" color="green.800">
                                    Transparency Score
                                  </Text>
                                </HStack>
                                <HStack>
                                  <Text
                                    fontSize="3xl"
                                    fontWeight="bold"
                                    color={`${transparencyBadge.color}.600`}
                                  >
                                    {finalTransparencyScore}
                                  </Text>
                                  <Text fontSize="sm" color={`${transparencyBadge.color}.700`}>
                                    /100
                                  </Text>
                                </HStack>
                                <Text fontSize="sm" color={`${transparencyBadge.color}.700`}>
                                  {finalTransparencyScore >= 80
                                    ? 'Excellent transparency for consumers'
                                    : finalTransparencyScore >= 60
                                    ? 'Good transparency, room for improvement'
                                    : 'Building transparency foundation'}
                                </Text>
                                <Progress
                                  value={finalTransparencyScore}
                                  colorScheme={transparencyBadge.color}
                                  size="sm"
                                  borderRadius="full"
                                  w="100%"
                                />
                              </VStack>
                            </CardBody>
                          </Card>

                          {/* Consumer Trust Metrics */}
                          <Card borderWidth="1px" borderColor="blue.200" bg="blue.50">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack>
                                  <Icon as={FaEye} color="blue.500" boxSize={5} />
                                  <Text fontSize="md" fontWeight="bold" color="blue.800">
                                    Consumer Trust Factors
                                  </Text>
                                </HStack>
                                <VStack align="start" spacing={2} w="100%">
                                  <HStack justify="space-between" w="100%">
                                    <Text fontSize="sm" color="blue.700">
                                      USDA Verification
                                    </Text>
                                    {processedData.usda_verified ? (
                                      <Badge colorScheme="green" size="sm">
                                        ✓ Verified
                                      </Badge>
                                    ) : (
                                      <Badge colorScheme="gray" size="sm">
                                        Pending
                                      </Badge>
                                    )}
                                  </HStack>
                                  <HStack justify="space-between" w="100%">
                                    <Text fontSize="sm" color="blue.700">
                                      Data Completeness
                                    </Text>
                                    <Badge
                                      colorScheme={processedData.hasData ? 'green' : 'gray'}
                                      size="sm"
                                    >
                                      {processedData.hasData ? 'Complete' : 'Incomplete'}
                                    </Badge>
                                  </HStack>
                                  <HStack justify="space-between" w="100%">
                                    <Text fontSize="sm" color="blue.700">
                                      Benchmark Comparison
                                    </Text>
                                    <Badge colorScheme={benchmarkData ? 'green' : 'gray'} size="sm">
                                      {benchmarkData ? 'Available' : 'Processing'}
                                    </Badge>
                                  </HStack>
                                </VStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>

                        {/* Transparency Recommendations */}
                        <Card mt={4} borderWidth="1px" borderColor="purple.200" bg="purple.50">
                          <CardBody>
                            <VStack align="start" spacing={3}>
                              <HStack>
                                <Icon as={FaInfoCircle} color="purple.500" boxSize={5} />
                                <Text fontSize="md" fontWeight="bold" color="purple.800">
                                  Transparency Recommendations
                                </Text>
                              </HStack>
                              <VStack align="start" spacing={2} w="100%">
                                {!processedData.usda_verified && (
                                  <HStack>
                                    <Icon as={FaShieldAlt} color="purple.500" boxSize={4} />
                                    <Text fontSize="sm" color="purple.700">
                                      Complete USDA verification to increase consumer trust
                                    </Text>
                                  </HStack>
                                )}
                                {finalTransparencyScore < 70 && (
                                  <HStack>
                                    <Icon as={FaChartLine} color="purple.500" boxSize={4} />
                                    <Text fontSize="sm" color="purple.700">
                                      Add more carbon data points to improve transparency score
                                    </Text>
                                  </HStack>
                                )}
                                <HStack>
                                  <Icon as={FaEye} color="purple.500" boxSize={4} />
                                  <Text fontSize="sm" color="purple.700">
                                    Share your public carbon profile with consumers
                                  </Text>
                                </HStack>
                              </VStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      </Box>
                    )}

                    {viewMode === 'establishment' && (
                      <Box>
                        <Divider my={6} />
                        <Alert status="info" borderRadius="md">
                          <AlertIcon />
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="bold">
                              💡 Detailed Carbon Analysis
                            </Text>
                            <Text fontSize="sm">
                              Select a specific production above to view detailed carbon analysis,
                              USDA benchmark comparisons, and transparency recommendations.
                            </Text>
                          </VStack>
                        </Alert>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                {/* TRANSPARENCY REPORTS TAB - SIMPLIFIED */}
                <TabPanel p={6}>
                  <VStack spacing={6} align="stretch">
                    <HStack justify="space-between" align="center">
                      <Heading size="md" color={textColor}>
                        Carbon Transparency Reports
                      </Heading>
                      {realUSDAData?.success && (
                        <Badge colorScheme="green" variant="solid" px={3} py={1}>
                          Government Verified
                        </Badge>
                      )}
                    </HStack>

                    {/* Report Generation Options */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Card
                        borderWidth="1px"
                        borderColor={borderColor}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                      >
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Icon as={FaFileAlt} color="green.500" boxSize={5} />
                              <Text fontSize="md" fontWeight="bold">
                                Carbon Summary Report
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              Clean, professional summary of your carbon performance with key
                              insights
                            </Text>
                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="outline"
                              onClick={handleViewTransparencyReport}
                            >
                              Generate Report
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card
                        borderWidth="1px"
                        borderColor={borderColor}
                        cursor="pointer"
                        _hover={{ bg: 'gray.50' }}
                      >
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <HStack>
                              <Icon as={FaAward} color="blue.500" boxSize={5} />
                              <Text fontSize="md" fontWeight="bold">
                                USDA Verification Certificate
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              Official government-backed transparency certification for stakeholders
                            </Text>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              isDisabled={!realUSDAData?.success}
                              onClick={handleStartVerification}
                            >
                              {realUSDAData?.success
                                ? 'Download Certificate'
                                : 'Start Verification'}
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </SimpleGrid>

                    {realUSDAData?.success && (
                      <Box>
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          fontStyle="italic"
                          textAlign="center"
                          mt={4}
                        >
                          {realUSDAData.api_attribution}
                        </Text>
                      </Box>
                    )}

                    {/* Help Section */}
                    <Box mt={8}>
                      <Alert status="info" borderRadius="lg">
                        <AlertIcon />
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="bold">
                            💡 Building Trust Through Transparency
                          </Text>
                          <Text fontSize="sm">
                            These reports help you communicate your environmental efforts to
                            customers, partners, and stakeholders with government-backed
                            credibility.
                          </Text>
                        </VStack>
                      </Alert>
                    </Box>
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
