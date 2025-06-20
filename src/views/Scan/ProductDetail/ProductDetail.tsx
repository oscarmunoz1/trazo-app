// Chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  ListItem,
  Progress,
  Select,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useColorModeValue,
  useBreakpointValue,
  VStack,
  Heading,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Avatar,
  Circle,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Container,
  AspectRatio,
  Center
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaRegCheckCircle,
  FaRegDotCircle,
  FaLeaf,
  FaShare,
  FaStar,
  FaTree,
  FaInfoCircle,
  FaCarSide,
  FaInfo,
  FaBuilding,
  FaWater,
  FaSeedling,
  FaTruck,
  FaTractor,
  FaSolarPanel,
  FaRecycle,
  FaBolt,
  FaChartLine,
  FaMapMarkerAlt,
  FaMap,
  FaBookOpen
} from 'react-icons/fa';
import {
  MdLocationOn,
  MdBusiness,
  MdEco,
  MdNoFood,
  MdLocalFlorist,
  MdInfo,
  MdCalendarToday,
  MdShare,
  MdStar,
  MdTimeline,
  MdVerified,
  MdPerson,
  MdPlayCircleFilled
} from 'react-icons/md';
import { FormProvider, useForm } from 'react-hook-form';
import { GoogleMap, Polygon, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useMemo, useState } from 'react';
import { object, string } from 'zod';
import { useCommentHistoryMutation, useGetPublicHistoryQuery } from 'store/api/historyApi';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetQRCodeSummaryQuery,
  useGetQRCodeQuickScoreQuery,
  useGetCompleteSummaryQuery
} from 'store/api/carbonApi';
import { useAddEstablishmentCarbonFootprintMutation } from 'store/api/companyApi';
import { StarIcon, DownloadIcon } from '@chakra-ui/icons';

import BgSignUp from 'assets/img/backgroundImage.png';
// import CameraCard from "./components/CameraCard";
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import productPage1 from 'assets/img/BgMusicCard.png';
import { zodResolver } from '@hookform/resolvers/zod';
import defaultEstablishmentImage from 'assets/img/basic-auth.png';
import { useIntl } from 'react-intl';
import { CarbonScore } from '../../../components/CarbonScore';
import { BadgeCarousel } from '../../../components/BadgeCarousel';
import { usePointsStore } from '../../../store/pointsStore';
import { useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { EnhancedTimeline } from '../../../components/EnhancedTimeline';
import { GamifiedOffset } from '../../../components/GamifiedOffset';
import { ConsumerSustainabilityInfo } from '../../../components/ConsumerSustainabilityInfo';
import { BlockchainVerificationBadge } from '../../../components/BlockchainVerificationBadge';
import { EnhancedProductTimeline } from '../../../components/ProductDetail/EnhancedProductTimeline';
import { ModernProductionJourney } from 'components/ProductDetail/ModernProductionJourney';
import PerformanceLoading from './components/PerformanceLoading';
import { CleanLoadingScreen } from './components/CleanLoadingScreen';
import { ProgressiveQRLoader } from './components/ProgressiveQRLoader';
import USDACredibilityBadge from '../../../components/Carbon/USDACredibilityBadge';
import RegionalBenchmark from '../../../components/Carbon/RegionalBenchmark';

// Import our new Week 2 Educational Components
import {
  EducationModal,
  TrustComparisonWidget,
  CarbonImpactVisualizer,
  USDAMethodologyExplainer
} from '../../../components/Education';

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

function ProductDetail() {
  const titleColor = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(productPage1);
  const { productionId } = useParams();
  const [commentValue, setCommentValue] = useState('');
  const intl = useIntl();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  // Add helper functions for safe data access
  const safeDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const safeEstablishmentData = (path: string[], fallback: any = null) => {
    try {
      // Access establishment data from unified response
      if (!completeData) return fallback;
      let current: any = completeData?.establishment || completeData?.farmer;
      for (const key of path) {
        if (!current || !current[key]) return fallback;
        current = current[key];
      }
      return current;
    } catch {
      return fallback;
    }
  };

  const toast = useToast();

  // Phase 3 Optimization: Single unified API call for all data
  const {
    data: completeData,
    error: completeError,
    isLoading: isCompleteLoading,
    isFetching: isCompleteFetching,
    refetch: refetchComplete
  } = useGetCompleteSummaryQuery(productionId || '', {
    skip: !productionId
  });

  // Extract data from unified response with backward compatibility
  const carbonData = completeData;
  const historyData = completeData;

  // Unified error and loading states
  const carbonError = completeError;
  const historyError = completeError;
  const isCarbonDataLoading = isCompleteLoading;
  const isHistoryLoading = false; // No separate history loading needed
  const isCarbonFetching = isCompleteFetching;
  const isHistoryFetching = false; // No separate history fetching needed

  // Refetch functions for backward compatibility
  const refetchCarbon = refetchComplete;
  const refetchHistory = refetchComplete;

  // Map data is now always available (no conditional loading needed)
  const [needsMapData, setNeedsMapData] = useState(true); // Always true since data is unified

  // Modal controls
  const {
    isOpen: isOffsetModalOpen,
    onOpen: onOffsetModalOpen,
    onClose: onOffsetModalClose
  } = useDisclosure();
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose
  } = useDisclosure();
  const {
    isOpen: isEducationModalOpen,
    onOpen: onEducationModalOpen,
    onClose: onEducationModalClose
  } = useDisclosure();
  const pointsStore = usePointsStore();
  const [showMore, setShowMore] = useState(false);
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const [offsetLoading, setOffsetLoading] = useState(false);
  const [offsetAmount, setOffsetAmount] = useState(0.1);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [addEstablishmentCarbonFootprint] = useAddEstablishmentCarbonFootprintMutation();

  // Restore the createComment function
  const [
    createComment,
    {
      data: dataComment,
      error: errorComment,
      isSuccess: isSuccessComment,
      isLoading: isLoadingComment
    }
  ] = useCommentHistoryMutation();

  // User analytics state
  const [userTotalOffset, setUserTotalOffset] = useState(15.5);

  // Mobile-first responsive utilities
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const headerFontSize = useBreakpointValue({ base: 'xl', md: '3xl' });
  const carbonScoreSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // Progressive loading states
  const [loadingStage, setLoadingStage] = useState<'scanning' | 'carbon' | 'details' | 'complete'>(
    'scanning'
  );

  // Points system
  const { points, addPoints } = usePointsStore();
  const [hasAwardedCarbonPoints, setHasAwardedCarbonPoints] = useState(false);
  const [hasAwardedFeedbackPoints, setHasAwardedFeedbackPoints] = useState(false);

  // Educational modal states - moved to top to fix hooks order
  const [educationTopic, setEducationTopic] = useState<string | null>(null);
  const [showTrustComparison, setShowTrustComparison] = useState(false);
  const [showCarbonVisualizer, setShowCarbonVisualizer] = useState(false);

  // Phase 3 Optimization: Enhanced loading states for unified data
  const showProgressiveLoading = isCompleteLoading;
  const hasMinimalData = completeData;
  const isInitialLoad = !completeData && isCompleteLoading;

  // Enhanced image availability check - Use unified data
  const hasImages = completeData?.images && completeData.images.length > 0;
  const productImages = completeData?.images?.map((img) => img) || [];

  // Phase 3 Optimization: Enhanced error handling with unified error state
  useEffect(() => {
    if (completeError) {
      const errorMessage = (() => {
        if ('status' in completeError) {
          switch (completeError.status) {
            case 404:
              return 'This product information is not available. Please scan a different product.';
            case 429:
              return 'Too many requests. Please wait a moment and try again.';
            case 500:
              return "Server temporarily unavailable. We're working to fix this.";
            default:
              return 'Unable to load sustainability data. Please check your connection and try again.';
          }
        }
        return 'Failed to load sustainability data. Please try again later.';
      })();

      toast({
        title: 'Connection Issue',
        description: errorMessage,
        status: 'warning',
        duration: 6000,
        isClosable: true,
        position: 'top'
      });
    } else if (completeData && pointsStore.points < 5) {
      // Award points for successful data load
      pointsStore.addPoints(5);
      toast({
        title: 'Scan Reward',
        description: 'You earned 5 Green Points for viewing the sustainability report!',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    }
  }, [completeError, completeData, toast, pointsStore]);

  const onSubmitHandler = () => {
    // Use scan ID from unified API
    const scanId = completeData?.history_scan;
    if (commentValue && scanId) {
      createComment({
        comment: commentValue,
        scanId: scanId
      });
    } else if (commentValue && !scanId) {
      // Show error if scan ID not available
      toast({
        title: 'Unable to submit comment',
        description: 'Comment system temporarily unavailable. Please try again later.',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
    }
  };

  useEffect(() => {
    if (isSuccessComment) {
      setCommentValue('');
    }
  }, [isSuccessComment]);

  // Handle offsetting carbon
  const handleOffset = async () => {
    try {
      setOffsetLoading(true);

      // In a real app, we would call the API to process the payment
      // For demo purposes, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Calculate points based on payment amount
      let pointsToAdd = 0;
      if (offsetAmount === 0.05) {
        pointsToAdd = 5;
      } else if (offsetAmount === 0.1) {
        pointsToAdd = 10;
      } else if (offsetAmount === 0.25) {
        pointsToAdd = 25;
      }

      // Update point store
      pointsStore.addPoints(pointsToAdd);

      // Show success toast
      toast({
        title: intl.formatMessage({ id: 'app.offsetSuccess' }) || 'Offset Successful!',
        description:
          intl.formatMessage(
            { id: 'app.offsetSuccessDetail' },
            {
              amount: offsetAmount.toFixed(2),
              points: pointsToAdd
            }
          ) ||
          `Thank you for contributing $${offsetAmount.toFixed(
            2
          )}. You earned ${pointsToAdd} Green Points!`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });

      onOffsetModalClose();
    } catch (error) {
      console.error('Offset error:', error);
      toast({
        title: intl.formatMessage({ id: 'app.offsetError' }) || 'Offset Failed',
        description:
          intl.formatMessage({ id: 'app.offsetErrorDetail' }) ||
          'There was an error processing your offset. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setOffsetLoading(false);
    }
  };

  const handleFeedback = () => {
    // Award points for feedback
    pointsStore.addPoints(3);

    toast({
      title: 'Thank you for your feedback!',
      description: 'You earned 3 Green Points for helping us improve.',
      status: 'success',
      duration: 3000,
      isClosable: true
    });

    onFeedbackModalClose();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${
          completeData?.farmer?.name || completeData?.product?.name || 'Product'
        }'s Sustainable Product`,
        text: `${completeData?.carbonScore}/100 carbon score! #Trazo`,
        url: window.location.href
      });
      pointsStore.addPoints(3);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Educational modal handlers
  const handleEducationOpen = (topic: string) => {
    setEducationTopic(topic);
    onEducationModalOpen();
  };

  const handleEducationClose = () => {
    setEducationTopic(null);
    onEducationModalClose();
  };

  const fetchProductData = async () => {
    const productionId = completeData?.product?.id;
    if (productionId) {
      // Refresh data by refetching the unified query
      void refetchComplete();
    }
  };

  // Fix places where reputation is used - use unified API data
  const safeReputation = completeData?.product?.reputation || 0;

  // Define optimization variables after API data is available
  const hasTimelineFromComplete = completeData?.timeline && completeData.timeline.length > 0;
  const hasLocationFromComplete = completeData?.farmer?.location || completeData?.parcel?.name;
  // All essential data comes from unified API
  const hasEssentialData = hasTimelineFromComplete && hasLocationFromComplete;

  useEffect(() => {
    // Reset points flag for new product
    if (productionId) {
      setHasAwardedCarbonPoints(false);
    }
  }, [productionId]);

  // Progressive loading callback for points system
  const onStageComplete = (stage: string) => {
    if (stage === 'carbon' && !hasAwardedCarbonPoints && completeData) {
      pointsStore.addPoints(2);
      setHasAwardedCarbonPoints(true);
    }
  };

  // Early return for loading state
  if (isCompleteLoading) {
    return <ProgressiveQRLoader loadingStage={loadingStage} onStageComplete={onStageComplete} />;
  }

  // Early return for error state
  if (completeError) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Unable to load product information</AlertTitle>
            <AlertDescription>
              Please check your connection and try again, or scan a different product.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  // Early return if no data
  if (!completeData) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>No product data available</AlertTitle>
            <AlertDescription>
              Please scan a valid QR code to view product information.
            </AlertDescription>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
      {/* Clean Modern Header */}
      <Box bg="linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)" pt="150px" pb="120px" px={4}>
        <Container maxW="6xl" mx="auto">
          <VStack spacing={6} textAlign="center">
            {/* Welcome Badge */}
            <Badge
              colorScheme="green"
              variant="subtle"
              fontSize="sm"
              px={4}
              py={2}
              borderRadius="full"
              textTransform="none">
              <HStack spacing={2}>
                <Icon as={FaLeaf} boxSize={4} />
                <Text fontWeight="medium">
                  {intl.formatMessage({ id: 'app.sustainabilityTracker' }) ||
                    'Sustainability Tracker'}
                </Text>
              </HStack>
            </Badge>

            {/* Main Welcome Title */}
            <VStack spacing={3}>
              <Heading
                as="h1"
                size="2xl"
                color={titleColor}
                fontWeight="bold"
                textAlign="center"
                letterSpacing="-0.02em">
                {intl.formatMessage({ id: 'app.welcome' })}
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                fontWeight="normal"
                maxW={{ base: '90%', sm: '70%', lg: '60%' }}
                lineHeight="1.7"
                textAlign="center">
                {intl.formatMessage({ id: 'app.welcomeMessage' })}
              </Text>
            </VStack>

            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} w="full" maxW="lg">
              <VStack>
                <Circle size="50px" bg="green.100" color="green.600">
                  <Icon as={FaLeaf} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {carbonData?.carbonScore || '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Carbon Score
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="blue.100" color="blue.600">
                  <Icon as={MdVerified} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {pointsStore.points}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Green Points
                  </Text>
                </VStack>
              </VStack>

              <VStack display={{ base: 'none', md: 'flex' }}>
                <Circle size="50px" bg="purple.100" color="purple.600">
                  <Icon as={FaChartLine} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {carbonData?.industryPercentile ? `${carbonData.industryPercentile}%` : '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Eco Ranking
                  </Text>
                </VStack>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Main Content Container - Overlapping Card */}
      <Flex
        alignItems="center"
        justifyContent="center"
        mb="60px"
        mt="-80px"
        position="relative"
        zIndex={10}>
        <Card
          w={{ sm: '95%', md: '90%', lg: '85%' }}
          p={{ sm: '16px', md: '32px', lg: '48px' }}
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          borderRadius="2xl"
          bg={bgColor}>
          <CardHeader mb="24px">
            <HStack spacing={3} flexWrap="wrap">
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                {intl.formatMessage({ id: 'app.verified' })}
              </Badge>

              {/* Enhanced USDA Credibility Badge */}
              {(carbonData as any)?.establishment?.id && (
                <VStack spacing={2}>
                  <USDACredibilityBadge
                    establishmentId={(carbonData as any).establishment.id}
                    compact={true}
                    showDetails={true}
                  />
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => handleEducationOpen('usda-methodology')}>
                    Learn about USDA standards
                  </Button>
                </VStack>
              )}
            </HStack>
            <HStack mt={4} spacing={4} align="center">
              <Heading color={textColor} fontSize={headerFontSize} fontWeight="bold">
                {(carbonData as any)?.farmer?.name ||
                  (carbonData as any)?.product?.name ||
                  'Product'}
              </Heading>
              <Stack direction="row" spacing="6px" color="orange.300">
                <Icon
                  as={safeReputation >= 1 ? BsStarFill : safeReputation > 0.5 ? BsStarHalf : BsStar}
                  w="20px"
                  h="20px"
                />
                <Icon
                  as={safeReputation >= 2 ? BsStarFill : safeReputation > 1.5 ? BsStarHalf : BsStar}
                  w="20px"
                  h="20px"
                />
                <Icon
                  as={safeReputation >= 3 ? BsStarFill : safeReputation > 2.5 ? BsStarHalf : BsStar}
                  w="20px"
                  h="20px"
                />
                <Icon
                  as={safeReputation >= 4 ? BsStarFill : safeReputation > 3.5 ? BsStarHalf : BsStar}
                  w="20px"
                  h="20px"
                />
                <Icon
                  as={
                    safeReputation === 5 ? BsStarFill : safeReputation > 4.5 ? BsStarHalf : BsStar
                  }
                  w="20px"
                  h="20px"
                />
              </Stack>
            </HStack>
            <Text color="gray.500" fontSize="lg" mt={1}>
              {(carbonData as any)?.farmer?.location ||
                (carbonData as any)?.parcel?.location ||
                'Farm Location'}
            </Text>
            {carbonData &&
              carbonData.industryPercentile !== undefined &&
              carbonData.industryPercentile > 0 && (
                <HStack mt={2}>
                  <Icon as={FaLeaf} color="green.500" />
                  <Text color="green.500" fontWeight="medium">
                    Greener than {carbonData.industryPercentile}% of similar products
                  </Text>
                </HStack>
              )}
          </CardHeader>

          <CardBody>
            {/* Phase 2: Enhanced Progressive QR Loading Experience */}
            {isInitialLoad && (
              <ProgressiveQRLoader
                loadingStage={
                  isInitialLoad
                    ? 'scanning'
                    : carbonData && isHistoryLoading
                    ? 'details'
                    : 'complete'
                }
                carbonScore={(carbonData as any)?.carbonScore}
                productName={
                  (carbonData as any)?.farmer?.name ||
                  (carbonData as any)?.product?.name ||
                  'Product'
                }
                isVerified={(carbonData as any)?.isUsdaVerified || false}
                onStageComplete={(stage) => {
                  if (stage === 'carbon' && !hasAwardedCarbonPoints) {
                    setHasAwardedCarbonPoints(true);
                    pointsStore.addPoints(2);
                  }
                }}
              />
            )}

            {/* Development Performance Monitoring */}
            {process.env.NODE_ENV === 'development' && isInitialLoad && (
              <PerformanceLoading
                isLoading={isCarbonDataLoading}
                loadingStage="initial"
                carbonQuickLoading={isCarbonDataLoading}
              />
            )}

            {carbonData && (
              <>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
                  <Box>
                    <Box mb={6}>{hasImages && <ImageCarousel imagesList={productImages} />}</Box>

                    <Box borderRadius="lg" mb={6} bg="white" p={5} boxShadow="md">
                      <CarbonScore
                        score={carbonData?.carbonScore || 0}
                        footprint={carbonData?.netFootprint || 0}
                        industryPercentile={carbonData?.industryPercentile || 0}
                        relatableFootprint={
                          carbonData?.relatableFootprint ||
                          intl.formatMessage({ id: 'app.calculatingFootprint' })
                        }
                      />

                      {/* Educational Enhancement: Learn More about Carbon Scoring */}
                      <VStack spacing={4} mt={6}>
                        {/* Educational Section Header */}
                        <Box textAlign="center" mb={2}>
                          <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
                            Learn More About This Data
                          </Text>
                          <Divider />
                        </Box>

                        {/* Primary Educational Buttons - Mobile Optimized */}
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} w="full" maxW="400px">
                          <Button
                            size={{ base: 'md', sm: 'sm' }}
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<Icon as={FaInfo} />}
                            onClick={() => handleEducationOpen('carbon-scoring')}
                            minH="44px"
                            fontSize={{ base: 'sm', sm: 'xs' }}
                            px={4}
                            _hover={{
                              transform: 'translateY(-1px)',
                              boxShadow: 'md',
                              bg: 'blue.50'
                            }}
                            transition="all 0.2s">
                            How is this calculated?
                          </Button>
                          <Button
                            size={{ base: 'md', sm: 'sm' }}
                            variant="outline"
                            colorScheme="green"
                            leftIcon={<Icon as={FaChartLine} />}
                            onClick={() => setShowTrustComparison(true)}
                            minH="44px"
                            fontSize={{ base: 'sm', sm: 'xs' }}
                            px={4}
                            _hover={{
                              transform: 'translateY(-1px)',
                              boxShadow: 'md',
                              bg: 'green.50'
                            }}
                            transition="all 0.2s">
                            Why trust this data?
                          </Button>
                        </SimpleGrid>

                        {/* Secondary Educational Actions */}
                        <HStack spacing={2} justify="center" flexWrap="wrap">
                          <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            leftIcon={<Icon as={FaBookOpen} boxSize={3} />}
                            onClick={() => handleEducationOpen('usda-methodology')}
                            minH="32px"
                            fontSize="xs"
                            _hover={{ bg: 'blue.50' }}>
                            USDA Standards
                          </Button>
                          <Text color="gray.400" fontSize="xs">
                            •
                          </Text>
                          <Button
                            size="xs"
                            variant="ghost"
                            colorScheme="green"
                            leftIcon={<Icon as={FaMapMarkerAlt} boxSize={3} />}
                            onClick={() => handleEducationOpen('regional-benchmarks')}
                            minH="32px"
                            fontSize="xs"
                            _hover={{ bg: 'green.50' }}>
                            Regional Data
                          </Button>
                        </HStack>
                      </VStack>

                      {carbonData?.industryPercentile && carbonData.industryPercentile > 0 && (
                        <Box mt={4} p={3} bg="green.50" borderRadius="md">
                          <HStack>
                            <Icon as={FaChartLine} color="green.500" />
                            <Text fontWeight="medium" color="green.700">
                              {carbonData.industryPercentile > 80
                                ? `Exceptional! This product is greener than ${carbonData.industryPercentile}% of similar products.`
                                : carbonData.industryPercentile > 50
                                ? `Great choice! Greener than ${carbonData.industryPercentile}% of similar products.`
                                : `This product is greener than ${carbonData.industryPercentile}% of similar products.`}
                            </Text>
                          </HStack>
                        </Box>
                      )}

                      {/* Educational Enhancement: Carbon Impact Visualizer */}
                      {carbonData?.netFootprint && (
                        <Box
                          mt={6}
                          p={4}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="gray.200">
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.700"
                            mb={3}
                            textAlign="center">
                            Carbon Impact Examples
                          </Text>
                          <CarbonImpactVisualizer
                            carbonValue={carbonData.netFootprint}
                            carbonUnit="kg CO2e"
                            contextData={{
                              product_name: (carbonData as any)?.product?.name,
                              farm_type: (carbonData as any)?.farmer?.name,
                              region: (carbonData as any)?.farmer?.location
                            }}
                            compact={true}
                            maxExamples={3}
                          />
                        </Box>
                      )}

                      {carbonData?.relatableFootprint && (
                        <Box
                          mt={3}
                          p={2}
                          borderRadius="md"
                          borderLeft="3px solid"
                          borderColor="blue.400"
                          bg="blue.50">
                          <HStack justify="space-between">
                            <HStack>
                              <Icon as={FaInfoCircle} color="blue.500" />
                              <Text fontSize="sm" color="blue.700">
                                {`Carbon footprint: ${carbonData.relatableFootprint}`}
                              </Text>
                            </HStack>
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => setShowCarbonVisualizer(true)}>
                              See examples
                            </Button>
                          </HStack>
                        </Box>
                      )}
                      {carbonData?.reports && carbonData.reports.length > 0 && (
                        <Text mt={2} fontSize="sm" color="gray.600" textAlign="center">
                          {intl.formatMessage({ id: 'app.viewReportsBelow' }) ||
                            'View detailed carbon reports below'}
                          <Icon as={DownloadIcon} ml={1} boxSize={3} />
                        </Text>
                      )}
                    </Box>

                    <Box mb={6}>
                      <BlockchainVerificationBadge
                        verificationData={carbonData?.blockchainVerification}
                        isLoading={isCarbonDataLoading}
                        isCompact={isMobile}
                      />
                    </Box>

                    <Box borderRadius="lg" mb={6}>
                      <BadgeCarousel badges={carbonData?.badges || []} />
                    </Box>

                    <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                      <VStack spacing={4}>
                        <Box w="full" p={4} bg="green.50" borderRadius="md">
                          <Heading as="h4" size="sm" mb={3} color="green.700">
                            <HStack>
                              <Icon as={FaLeaf} />
                              <Text>
                                {intl.formatMessage({ id: 'app.offsetYourImpact' }) ||
                                  'Offset Your Impact'}
                              </Text>
                            </HStack>
                          </Heading>
                          <Text fontSize="sm" mb={3} color="gray.600">
                            {intl.formatMessage({ id: 'app.offsetDescription' }) ||
                              'Help reduce carbon emissions by funding verified sustainability projects.'}
                          </Text>
                          <HStack spacing={3} justifyContent="center" w="full">
                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="outline"
                              onClick={() => {
                                setOffsetAmount(0.05);
                                onOffsetModalOpen();
                              }}>
                              $0.05
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="solid"
                              onClick={() => {
                                setOffsetAmount(0.1);
                                onOffsetModalOpen();
                              }}>
                              $0.10
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="green"
                              variant="outline"
                              onClick={() => {
                                setOffsetAmount(0.25);
                                onOffsetModalOpen();
                              }}>
                              $0.25
                            </Button>
                          </HStack>
                        </Box>

                        <Box w="full" p={4} bg="blue.50" borderRadius="md">
                          <HStack justify="space-between" mb={2}>
                            <Heading as="h4" size="sm" color="blue.700">
                              <HStack>
                                <Icon as={FaStar} color="yellow.400" />
                                <Text>
                                  {intl.formatMessage({ id: 'app.greenPoints' }) || 'Green Points'}
                                </Text>
                              </HStack>
                            </Heading>
                            <Badge colorScheme="blue" variant="solid">
                              {pointsStore.points} pts
                            </Badge>
                          </HStack>
                          <Progress
                            value={(pointsStore.points % 50) * 2}
                            size="sm"
                            colorScheme="blue"
                            borderRadius="full"
                            mb={2}
                          />
                          <Text fontSize="xs" color="blue.600" textAlign="right">
                            {50 - (pointsStore.points % 50)}{' '}
                            {intl.formatMessage({ id: 'app.pointsToNextReward' }) ||
                              'points to next reward'}
                          </Text>
                        </Box>

                        <HStack spacing={3} w="full">
                          <Button
                            leftIcon={<MdShare />}
                            colorScheme="blue"
                            onClick={handleShare}
                            flex={1}
                            size="md">
                            {intl.formatMessage({ id: 'app.share' }) || 'Share'} (+3)
                          </Button>
                          <Button
                            leftIcon={<MdStar />}
                            colorScheme="yellow"
                            onClick={onFeedbackModalOpen}
                            flex={1}
                            size="md">
                            {intl.formatMessage({ id: 'app.rate' }) || 'Rate'} (+2)
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  </Box>

                  <Box>
                    <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                      <HStack spacing={2} justify="center" mb={3}>
                        <Icon as={FaBuilding} color="green.500" boxSize={5} />
                        <Heading as="h3" size="md" color={textColor}>
                          {intl.formatMessage({ id: 'app.establishment' })}
                        </Heading>
                      </HStack>
                      <VStack spacing={4} align="stretch">
                        {((carbonData as any)?.farmer?.image ||
                          safeEstablishmentData(['photo'])) && (
                          <Flex justify="center">
                            <Image
                              src={
                                (carbonData as any)?.farmer?.image ||
                                safeEstablishmentData(['photo'])
                              }
                              alt={
                                (carbonData as any)?.farmer?.name ||
                                (historyData ? historyData?.parcel?.establishment?.name : null) ||
                                'Establishment'
                              }
                              boxSize="150px"
                              objectFit="cover"
                              borderRadius="full"
                            />
                          </Flex>
                        )}

                        <HStack>
                          <Text fontWeight="bold">{intl.formatMessage({ id: 'app.name' })}:</Text>
                          <Text>
                            {(carbonData as any)?.farmer?.name ||
                              (historyData ? historyData?.parcel?.establishment?.name : null)}
                          </Text>
                        </HStack>

                        <HStack>
                          <Text fontWeight="bold">
                            {intl.formatMessage({ id: 'app.location' })}:
                          </Text>
                          <Text>
                            {(carbonData as any)?.farmer?.location ||
                              (historyData ? historyData?.parcel?.establishment?.location : null)}
                          </Text>
                        </HStack>

                        {safeEstablishmentData(['certifications']) &&
                          Array.isArray(safeEstablishmentData(['certifications'])) &&
                          safeEstablishmentData(['certifications']).length > 0 && (
                            <Box>
                              <Text fontWeight="bold" mb={2}>
                                {intl.formatMessage({ id: 'app.certifications' })}:
                              </Text>
                              <HStack spacing={2} flexWrap="wrap">
                                {safeEstablishmentData(['certifications']).map(
                                  (cert: string, index: number) => (
                                    <Badge key={index} colorScheme="green" mb={1}>
                                      {cert}
                                    </Badge>
                                  )
                                )}
                              </HStack>
                            </Box>
                          )}

                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            {intl.formatMessage({ id: 'app.description' })}:
                          </Text>
                          <Box maxH="150px" overflowY="auto" pr={2}>
                            <HTMLRenderer
                              htmlString={
                                (carbonData as any)?.farmer?.description ||
                                (historyData
                                  ? historyData?.parcel?.establishment?.description
                                  : null) ||
                                ''
                              }
                            />
                          </Box>
                        </Box>

                        {safeEstablishmentData(['email']) && (
                          <Box>
                            <Text fontWeight="bold" mb={2}>
                              {intl.formatMessage({ id: 'app.contact' })}:
                            </Text>
                            <HStack>
                              <Icon as={MdInfo} color="blue.500" />
                              <Text>{safeEstablishmentData(['email'])}</Text>
                            </HStack>
                          </Box>
                        )}
                        {safeEstablishmentData(['phone']) && (
                          <Box>
                            <Text fontWeight="bold" mb={2}>
                              {intl.formatMessage({ id: 'app.contact' })}:
                            </Text>
                            <HStack>
                              <Icon as={MdInfo} color="blue.500" />
                              <Text>{safeEstablishmentData(['phone'])}</Text>
                            </HStack>
                          </Box>
                        )}
                      </VStack>
                    </Box>

                    <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                      <Heading as="h3" size="md" mb={4}>
                        {intl.formatMessage({ id: 'app.productDetails' })}
                      </Heading>

                      <SimpleGrid columns={2} spacing={4}>
                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {intl.formatMessage({ id: 'app.establishment' })}
                          </Text>
                          <Link textDecoration="underline" color="green.500">
                            {(carbonData as any)?.farmer?.name ||
                              (historyData ? historyData?.parcel?.establishment?.name : null) ||
                              'Farm'}
                          </Link>
                        </Box>

                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {intl.formatMessage({ id: 'app.location' })}
                          </Text>
                          <Text color="gray.600">
                            {(carbonData as any)?.farmer?.location ||
                              (historyData ? historyData?.parcel?.establishment?.location : null) ||
                              'Location available soon'}
                          </Text>
                        </Box>

                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {intl.formatMessage({ id: 'app.parcel' })}
                          </Text>
                          <Link textDecoration="underline" color="green.500">
                            {(carbonData as any)?.parcel?.name ||
                              (historyData ? historyData?.parcel?.name : null) ||
                              'Field'}
                          </Link>
                        </Box>

                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {intl.formatMessage({ id: 'app.production' })}
                          </Text>
                          <Text color="gray.600">
                            {historyData
                              ? `${safeDate(historyData?.start_date)} - ${safeDate(
                                  historyData?.finish_date
                                )}`
                              : 'Production dates available soon'}
                          </Text>
                        </Box>

                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {intl.formatMessage({ id: 'app.socialMedia' })}
                          </Text>
                          <HStack spacing={2}>
                            <Link href="#" color="green.500" _hover={{ color: 'green.600' }}>
                              <Icon as={FaFacebook} boxSize={5} />
                            </Link>
                            <Link href="#" color="green.500" _hover={{ color: 'green.600' }}>
                              <Icon as={FaInstagram} boxSize={5} />
                            </Link>
                            <Link href="#" color="green.500" _hover={{ color: 'green.600' }}>
                              <Icon as={FaTwitter} boxSize={5} />
                            </Link>
                          </HStack>
                        </Box>

                        <Box>
                          <Text fontWeight="bold" color={textColor}>
                            {intl.formatMessage({ id: 'app.harvestDate' })}
                          </Text>
                          <Text color="gray.600">
                            {historyData?.finish_date
                              ? safeDate(historyData.finish_date)
                              : 'Harvest date available soon'}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </Box>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                      <Box
                        bg={bgColor}
                        borderRadius="lg"
                        boxShadow="md"
                        p={6}
                        onMouseEnter={() => {
                          // Trigger history data loading when map section is hovered
                          if (!needsMapData && productionId) {
                            setNeedsMapData(true);
                            refetchHistory();
                          }
                        }}
                        onClick={() => {
                          // Also trigger on click for mobile users
                          if (!needsMapData && productionId) {
                            setNeedsMapData(true);
                            refetchHistory();
                          }
                        }}
                        cursor="pointer">
                        <HStack spacing={2} mb={3}>
                          <Icon as={FaMapMarkerAlt} color="green.500" />
                          <Text fontSize="lg" fontWeight="bold">
                            {intl.formatMessage({ id: 'app.farmLocation' }) || 'Farm Location'}
                          </Text>
                        </HStack>

                        <VStack align="start" spacing={3}>
                          <Box>
                            <Text fontWeight="semibold" color="gray.700">
                              {(carbonData as any)?.farmer?.name ||
                                (carbonData as any)?.parcel?.name ||
                                'Farm'}
                            </Text>
                            <Text color="gray.600">
                              {(carbonData as any)?.farmer?.location ||
                                (carbonData as any)?.parcel?.location ||
                                'Location information available in details'}
                            </Text>
                          </Box>

                          {(carbonData as any)?.parcel && (
                            <Box>
                              <Text fontSize="sm" color="gray.500">
                                Parcel:
                              </Text>
                              <Text fontWeight="semibold">{(carbonData as any).parcel.name}</Text>
                              {(carbonData as any).parcel.area && (
                                <Text fontSize="sm" color="gray.600">
                                  Area: {(carbonData as any).parcel.area} hectares
                                </Text>
                              )}
                            </Box>
                          )}

                          {!needsMapData && (
                            <Box mt={3} p={3} bg="green.50" borderRadius="md" w="full">
                              <HStack>
                                <Icon as={FaMap} color="green.500" />
                                <Text fontSize="sm" color="green.700">
                                  Click or hover to load interactive map
                                </Text>
                              </HStack>
                            </Box>
                          )}

                          {needsMapData && (!isLoaded || isHistoryLoading) && (
                            <Box mt={3} p={3} bg="blue.50" borderRadius="md" w="full">
                              <HStack>
                                <Icon as={FaMap} color="blue.500" />
                                <Text fontSize="sm" color="blue.700">
                                  {isHistoryLoading ? 'Loading map data...' : 'Map view loading...'}
                                </Text>
                              </HStack>
                            </Box>
                          )}

                          {needsMapData && isLoaded && historyData?.parcel?.polygon && (
                            <Box mt={3} w="full" h="150px" borderRadius="md" overflow="hidden">
                              <GoogleMap
                                mapContainerStyle={{
                                  width: '100%',
                                  height: '100%'
                                }}
                                zoom={historyData?.parcel?.map_metadata?.zoom || 15}
                                center={
                                  historyData?.parcel?.map_metadata?.center || { lat: 0, lng: 0 }
                                }
                                mapTypeId="satellite">
                                <Polygon
                                  path={historyData?.parcel?.polygon || []}
                                  options={{
                                    fillColor: '#22c55e',
                                    fillOpacity: 0.35,
                                    strokeColor: '#16a34a',
                                    strokeOpacity: 1,
                                    strokeWeight: 2
                                  }}
                                />
                              </GoogleMap>
                            </Box>
                          )}
                        </VStack>
                      </Box>

                      <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                        <HStack spacing={2} mb={3}>
                          <Icon as={FaBuilding} color="green.500" />
                          <Text fontSize="lg" fontWeight="bold">
                            {intl.formatMessage({ id: 'app.aboutFarm' }) || 'aarm'}
                          </Text>
                        </HStack>

                        <Box maxH="202px" overflowY="auto" pr={2}>
                          <HTMLRenderer
                            htmlString={
                              (carbonData as any)?.farmer?.description ||
                              historyData?.parcel?.establishment?.description ||
                              'Farm description will be available soon.'
                            }
                          />
                        </Box>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </SimpleGrid>

                {isHistoryLoading && (
                  <Box textAlign="center" py={8}>
                    <CleanLoadingScreen
                      loadingStage="product-details"
                      isMobile={isMobile}
                      showProgressBar={true}
                    />
                  </Box>
                )}
              </>
            )}

            {/* Production Timeline - Using Enhanced Timeline Design */}
            <Card bg={bgColor} borderRadius="lg" boxShadow="md" mb={6}>
              <CardHeader>
                <HStack spacing={2} justify="center">
                  <Icon as={MdTimeline} color="green.500" boxSize={5} />
                  <Heading as="h3" size="lg" color={textColor}>
                    {intl.formatMessage({ id: 'app.productionJourney' }) || 'Production Timeline'}
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                {(() => {
                  const carbonTimeline = carbonData?.timeline || [];
                  const historyEvents =
                    (historyData as any)?.production_events ||
                    (historyData as any)?.history_events ||
                    (historyData as any)?.events ||
                    [];

                  let events = carbonTimeline.length > 0 ? carbonTimeline : historyEvents;

                  if (Array.isArray(events) && events.length > 0) {
                    // Enhanced mapping with carbon transparency focus
                    const mapEventsToTimeline = (apiEvents: any[]) => {
                      return apiEvents.map((event, index) => {
                        return {
                          id: event.id?.toString() || `event_${index}`,
                          type: event.type || 'general',
                          description: event.description || 'Farm Activity',
                          observation: event.observation || '',
                          date: event.date || new Date().toISOString(),
                          certified: event.certified || false,
                          index: event.index || index,
                          volume: event.volume,
                          concentration: event.concentration,
                          area: event.area,
                          equipment: event.equipment || event.commercial_name
                        };
                      });
                    };

                    const timelineEvents = mapEventsToTimeline(events);
                    return <ModernProductionJourney events={timelineEvents} />;
                  } else {
                    return (
                      <VStack spacing={3} py={8}>
                        <Icon as={MdTimeline} boxSize={16} color="gray.400" />
                        <Heading as="h4" size="md" color="gray.600">
                          {intl.formatMessage({ id: 'app.noTimelineData' }) ||
                            'No events recorded yet'}
                        </Heading>
                        <Text fontSize="sm" color="gray.400" textAlign="center">
                          {intl.formatMessage({ id: 'app.timelineComingSoon' }) ||
                            'Production journey details will be available soon'}
                        </Text>
                      </VStack>
                    );
                  }
                })()}
              </CardBody>
            </Card>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                <Heading as="h3" size="md" mb={3}>
                  {intl.formatMessage({ id: 'app.emissionsBreakdown' })}
                </Heading>
                <Text fontWeight="bold" mb={1}>
                  {intl.formatMessage({ id: 'app.byCategory' })}:
                </Text>
                <VStack spacing={2} align="start" mb={4}>
                  {carbonData?.emissionsByCategory &&
                    Object.entries(carbonData.emissionsByCategory).map(([category, value]) => (
                      <HStack key={category} w="full" justify="space-between">
                        <Text>{category}</Text>
                        <Text>{typeof value === 'number' ? value.toFixed(2) : value} kg CO2e</Text>
                      </HStack>
                    ))}
                </VStack>
                <Text fontWeight="bold" mb={1}>
                  {intl.formatMessage({ id: 'app.bySource' })}:
                </Text>
                <VStack spacing={2} align="start">
                  {carbonData?.emissionsBySource &&
                    Object.entries(carbonData.emissionsBySource).map(([source, value]) => (
                      <HStack key={source} w="full" justify="space-between">
                        <Text>{source}</Text>
                        <Text>{typeof value === 'number' ? value.toFixed(2) : value} kg CO2e</Text>
                      </HStack>
                    ))}
                </VStack>
              </Box>

              <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                <Heading as="h3" size="md" mb={3}>
                  {intl.formatMessage({ id: 'app.offsetsBreakdown' })}
                </Heading>
                <VStack spacing={2} align="start">
                  {carbonData?.offsetsByAction &&
                    Object.entries(carbonData.offsetsByAction).map(([action, value]) => (
                      <HStack key={action} w="full" justify="space-between">
                        <Text>{action}</Text>
                        <Text>{typeof value === 'number' ? value.toFixed(2) : value} kg CO2e</Text>
                      </HStack>
                    ))}
                </VStack>

                <Box bg="green.50" mt={4} p={3} borderRadius="md">
                  <HStack>
                    <Icon as={FaLeaf} color="green.500" />
                    <Text color="green.700" fontSize="sm">
                      {carbonData?.socialProof?.totalUsers || 5000}+ users have offset{' '}
                      {(carbonData?.socialProof?.totalOffsets || 20).toFixed(1)} tons of CO2e with
                      this product
                    </Text>
                  </HStack>
                </Box>
              </Box>
            </SimpleGrid>

            {carbonData?.reports && carbonData.reports.length > 0 && (
              <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                <HStack spacing={2} mb={4}>
                  <Icon as={DownloadIcon} color="green.500" boxSize={5} />
                  <Heading as="h3" size="md">
                    {intl.formatMessage({ id: 'app.verifiedReports' }) || 'Verified Carbon Reports'}
                  </Heading>
                </HStack>

                <Text fontSize="sm" color="gray.600" mb={4}>
                  {intl.formatMessage({ id: 'app.reportsExplanation' }) ||
                    'These certified reports provide detailed carbon footprint data for this product.'}
                </Text>

                <Table variant="simple" size="sm" colorScheme="green">
                  <Thead bg="green.50">
                    <Tr>
                      <Th>{intl.formatMessage({ id: 'app.type' }) || 'Type'}</Th>
                      <Th>{intl.formatMessage({ id: 'app.period' }) || 'Period'}</Th>
                      <Th>{intl.formatMessage({ id: 'app.totalEmissions' }) || 'Emissions'}</Th>
                      <Th>{intl.formatMessage({ id: 'app.offsets' }) || 'Offsets'}</Th>
                      <Th>{intl.formatMessage({ id: 'app.document' }) || 'Report'}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {carbonData.reports.map((report) => (
                      <Tr key={report.id}>
                        <Td>
                          <Badge colorScheme={report.report_type === 'annual' ? 'green' : 'blue'}>
                            {report.report_type === 'annual'
                              ? intl.formatMessage({ id: 'app.annual' }) || 'Annual'
                              : report.report_type === 'quarterly'
                              ? intl.formatMessage({ id: 'app.quarterly' }) || 'Quarterly'
                              : intl.formatMessage({ id: 'app.custom' }) || 'Custom'}
                          </Badge>
                        </Td>
                        <Td>
                          {new Date(report.period_start).toLocaleDateString()} -{' '}
                          {new Date(report.period_end).toLocaleDateString()}
                        </Td>
                        <Td>{(report.total_emissions || 0).toFixed(2)} kg CO₂e</Td>
                        <Td>{(report.total_offsets || 0).toFixed(2)} kg CO₂e</Td>
                        <Td>
                          {report.document ? (
                            <Button
                              colorScheme="green"
                              variant="solid"
                              size="sm"
                              leftIcon={<DownloadIcon />}
                              onClick={() => window.open(report.document!, '_blank')}>
                              {intl.formatMessage({ id: 'app.view' }) || 'View'}
                            </Button>
                          ) : (
                            <Badge colorScheme="gray">N/A</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                {carbonData.isUsdaVerified && (
                  <Box mt={4} p={3} borderRadius="md" bg="blue.50">
                    <HStack>
                      <Badge px={2} py={1} colorScheme="blue" variant="solid">
                        USDA Verified
                      </Badge>
                      <Text fontSize="sm">
                        {intl.formatMessage({ id: 'app.usdaVerified' }) ||
                          'This data has been verified according to USDA Standards'}
                        {carbonData.verificationDate &&
                          ` (${new Date(carbonData.verificationDate).toLocaleDateString()})`}
                      </Text>
                    </HStack>
                  </Box>
                )}
              </Box>
            )}

            {((carbonData as any)?.similar_products?.length > 0 ||
              (historyData?.similar_histories && historyData.similar_histories.length > 0)) && (
              <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                <Text fontSize="lg" color={textColor} fontWeight="bold" mb="24px">
                  {intl.formatMessage({ id: 'app.similarProducts' })}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {(
                    (carbonData as any)?.similar_products ||
                    historyData?.similar_histories ||
                    []
                  ).map((history: any) => (
                    <Box
                      key={history.id}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderRadius="lg"
                      boxShadow="sm"
                      p={4}
                      cursor="pointer"
                      onClick={() => navigate(`/production/${history.id}`, { replace: true })}
                      transition="all 0.2s"
                      _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}>
                      <Flex align="center" mb={3}>
                        <Image
                          src={history.image || defaultEstablishmentImage}
                          boxSize="50px"
                          borderRadius="md"
                          mr={3}
                          objectFit="cover"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="md">
                            {history.product.name}
                          </Text>
                          <HStack spacing={1}>
                            {[...Array(5)].map((_, i) => (
                              <Icon
                                key={i}
                                as={
                                  history?.reputation >= i + 1
                                    ? BsStarFill
                                    : history?.reputation > i + 0.5
                                    ? BsStarHalf
                                    : BsStar
                                }
                                color="orange.300"
                                boxSize={3}
                              />
                            ))}
                          </HStack>
                        </VStack>
                      </Flex>
                      <CarbonScore score={85} footprint={0.5} isCompact />
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
              <FormControl>
                <FormLabel color={textColor} fontWeight="bold" fontSize="md">
                  {intl.formatMessage({ id: 'app.shareYourInitialProductImpression' })}
                </FormLabel>
                {isSuccessComment ? (
                  <Flex justifyContent="center" bg="green.50" p={4} borderRadius="md">
                    <HStack>
                      <Icon as={FaRegCheckCircle} color="green.500" />
                      <Text fontSize="md" color="green.700">
                        {intl.formatMessage({ id: 'app.commentSentSuccessfully' })}
                      </Text>
                    </HStack>
                  </Flex>
                ) : (
                  <>
                    <Textarea
                      placeholder={intl.formatMessage({ id: 'app.yourFirstImpressionHere' })}
                      minH="120px"
                      fontSize="14px"
                      borderRadius="15px"
                      value={commentValue}
                      onChange={(e) => setCommentValue(e.target.value)}
                      mb={4}
                    />
                    <Flex justifyContent="flex-end">
                      <Button
                        colorScheme="green"
                        px={6}
                        isDisabled={isLoadingComment || !commentValue || isSuccessComment}
                        onClick={() => onSubmitHandler()}
                        leftIcon={<Icon as={FaRegCheckCircle} />}>
                        {intl.formatMessage({ id: 'app.send' })}
                      </Button>
                    </Flex>
                  </>
                )}
              </FormControl>
            </Box>

            {/* Enhanced USDA Regional Benchmark */}
            {(carbonData as any)?.establishment?.id && (
              <Box mb={6}>
                <RegionalBenchmark
                  establishmentId={(carbonData as any).establishment.id}
                  carbonIntensity={carbonData?.netFootprint || 1.0}
                  cropType={(carbonData as any)?.product?.name?.toLowerCase() || 'corn'}
                  showTitle={true}
                  compact={false}
                />
                {/* Regional Insights Educational Section */}
                <VStack spacing={3} mt={4}>
                  <Box textAlign="center">
                    <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={2}>
                      Explore Regional Farming Data
                    </Text>
                    <Divider />
                  </Box>

                  <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} w="full" maxW="350px">
                    <Button
                      size={{ base: 'md', sm: 'sm' }}
                      variant="outline"
                      colorScheme="blue"
                      leftIcon={<Icon as={FaMapMarkerAlt} />}
                      onClick={() => handleEducationOpen('regional-benchmarks')}
                      minH="44px"
                      fontSize={{ base: 'sm', sm: 'xs' }}
                      px={3}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'md',
                        bg: 'blue.50'
                      }}
                      transition="all 0.2s">
                      Regional insights
                    </Button>
                    <Button
                      size={{ base: 'md', sm: 'sm' }}
                      variant="outline"
                      colorScheme="green"
                      leftIcon={<Icon as={FaLeaf} />}
                      onClick={() => handleEducationOpen('farming-practices')}
                      minH="44px"
                      fontSize={{ base: 'sm', sm: 'xs' }}
                      px={3}
                      _hover={{
                        transform: 'translateY(-1px)',
                        boxShadow: 'md',
                        bg: 'green.50'
                      }}
                      transition="all 0.2s">
                      Farming practices
                    </Button>
                  </SimpleGrid>
                </VStack>
              </Box>
            )}

            <Box mb={6}>
              <ConsumerSustainabilityInfo
                productName={
                  (carbonData as any)?.farmer?.name || (carbonData as any)?.product?.name || ''
                }
                carbonScore={carbonData?.carbonScore || 0}
                sustainabilityPractices={
                  carbonData?.recommendations
                    ? carbonData.recommendations.map((rec, index) => ({
                        icon: (
                          <Icon
                            as={
                              index % 5 === 0
                                ? FaWater
                                : index % 5 === 1
                                ? MdNoFood
                                : index % 5 === 2
                                ? FaSeedling
                                : index % 5 === 3
                                ? MdEco
                                : FaLeaf
                            }
                            color="green.500"
                            boxSize={5}
                          />
                        ),
                        title: rec,
                        description: rec
                      }))
                    : []
                }
              />
            </Box>
          </CardBody>
        </Card>
      </Flex>

      <Modal isOpen={isOffsetModalOpen} onClose={onOffsetModalClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FaLeaf} color="green.500" />
              <Text>{intl.formatMessage({ id: 'app.offsetNow' }) || 'Offset Now'}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                {intl.formatMessage(
                  { id: 'app.offsetDescription' },
                  {
                    amount: offsetAmount.toFixed(2),
                    weight: (carbonData?.netFootprint || 0).toFixed(2)
                  }
                ) ||
                  `By contributing $${offsetAmount.toFixed(2)}, you'll offset ${(
                    carbonData?.netFootprint || 0
                  ).toFixed(2)} kg of CO₂e through verified sustainability projects.`}
              </Text>
              <Box bg="green.50" p={3} borderRadius="md">
                <HStack>
                  <Icon as={FaInfoCircle} color="green.600" />
                  <Text fontSize="sm">
                    {intl.formatMessage({ id: 'app.offsetSupport' }) ||
                      'Your contribution supports reforestation and renewable energy projects.'}
                  </Text>
                </HStack>
              </Box>
              <Text fontWeight="medium" mt={2}>
                {intl.formatMessage({ id: 'app.selectAmount' }) || 'Select Amount:'}
              </Text>
              <SimpleGrid columns={3} spacing={3}>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant={offsetAmount === 0.05 ? 'solid' : 'outline'}
                  onClick={() => setOffsetAmount(0.05)}>
                  $0.05
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant={offsetAmount === 0.1 ? 'solid' : 'outline'}
                  onClick={() => setOffsetAmount(0.1)}>
                  $0.10
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant={offsetAmount === 0.25 ? 'solid' : 'outline'}
                  onClick={() => setOffsetAmount(0.25)}>
                  $0.25
                </Button>
              </SimpleGrid>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              mr={3}
              onClick={onOffsetModalClose}
              isDisabled={offsetLoading}>
              {intl.formatMessage({ id: 'app.cancel' }) || 'Cancel'}
            </Button>
            <Button
              colorScheme="green"
              onClick={handleOffset}
              isLoading={offsetLoading}
              leftIcon={<Icon as={FaLeaf} />}>
              {intl.formatMessage({ id: 'app.payAmount' }, { amount: offsetAmount.toFixed(2) }) ||
                `Pay $${offsetAmount.toFixed(2)}`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isFeedbackModalOpen} onClose={onFeedbackModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={MdStar} color="yellow.500" />
              <Text>{intl.formatMessage({ id: 'app.rateThisProduct' })}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text mb={2}>{intl.formatMessage({ id: 'app.rateSustainability' })}</Text>

              <Box bg="yellow.50" p={4} borderRadius="md" textAlign="center">
                <HStack spacing={2} justify="center" mb={2}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      as={StarIcon}
                      color={star <= feedbackRating ? 'yellow.400' : 'gray.300'}
                      boxSize={8}
                      cursor="pointer"
                      onClick={() => setFeedbackRating(star)}
                      transition="all 0.2s"
                      _hover={{ transform: 'scale(1.2)' }}
                    />
                  ))}
                </HStack>
                <Text fontWeight="medium" color="yellow.700">
                  {feedbackRating === 5
                    ? 'Excellent!'
                    : feedbackRating === 4
                    ? 'Very Good!'
                    : feedbackRating === 3
                    ? 'Good'
                    : feedbackRating === 2
                    ? 'Fair'
                    : 'Poor'}
                </Text>
              </Box>

              <FormControl>
                <FormLabel>Your Comments</FormLabel>
                <Textarea
                  placeholder="Share your thoughts about this product's sustainability..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  minH="120px"
                />
              </FormControl>

              <Box bg="blue.50" p={3} borderRadius="md">
                <Text fontSize="sm" color="blue.700">
                  <Icon as={FaInfoCircle} mr={2} />
                  You'll earn 2 Green Points for submitting your feedback!
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onFeedbackModalClose}>
              {intl.formatMessage({ id: 'app.cancel' })}
            </Button>
            <Button colorScheme="yellow" onClick={handleFeedback} leftIcon={<MdStar />}>
              {intl.formatMessage({ id: 'app.submitRating' })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Educational Modals - Week 2 Consumer Education Enhancement */}
      {educationTopic && (
        <EducationModal
          isOpen={isEducationModalOpen}
          onClose={handleEducationClose}
          topic={educationTopic as any}
          contextData={{
            establishment: (carbonData as any)?.establishment,
            product: (carbonData as any)?.product,
            farmer: (carbonData as any)?.farmer,
            carbonScore: carbonData?.carbonScore,
            netFootprint: carbonData?.netFootprint
          }}
          triggerSource="product-detail-page"
        />
      )}

      {/* Trust Comparison Widget Modal */}
      <Modal isOpen={showTrustComparison} onClose={() => setShowTrustComparison(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Data Trust & Accuracy</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TrustComparisonWidget
              establishmentData={(carbonData as any)?.establishment}
              contextData={{
                carbonScore: carbonData?.carbonScore,
                netFootprint: carbonData?.netFootprint
              }}
              compact={false}
              showDetails={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Carbon Impact Visualizer Modal */}
      <Modal isOpen={showCarbonVisualizer} onClose={() => setShowCarbonVisualizer(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Carbon Impact Examples</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {carbonData?.netFootprint && (
              <CarbonImpactVisualizer
                carbonValue={carbonData.netFootprint}
                carbonUnit="kg CO2e"
                contextData={{
                  product_name: (carbonData as any)?.product?.name,
                  farm_type: (carbonData as any)?.farmer?.name,
                  region: (carbonData as any)?.farmer?.location
                }}
                compact={false}
                showComparisons={true}
                maxExamples={6}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ProductDetail;
