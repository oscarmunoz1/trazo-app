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
  Container
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
  FaChartLine
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
import React, { useEffect, useState } from 'react';
import { object, string } from 'zod';
import { useCommentHistoryMutation, useGetPublicHistoryQuery } from 'store/api/historyApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetQRCodeSummaryQuery } from 'store/api/carbonApi';
import { useAddEstablishmentCarbonFootprintMutation } from 'store/api/companyApi';
import { StarIcon, DownloadIcon } from '@chakra-ui/icons';

import BgSignUp from 'assets/img/backgroundImage.png';
// import CameraCard from "./components/CameraCard";
import FormInput from 'components/Forms/FormInput';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import ImageParcel1 from 'assets/img/ImageParcel1.png';
import TimelineRow from 'components/Tables/TimelineRow';
import productPage1 from 'assets/img/BgMusicCard.png';
import productPage2 from 'assets/img/ProductImage2.png';
import productPage3 from 'assets/img/ProductImage3.png';
import productPage4 from 'assets/img/ProductImage4.png';
import { zodResolver } from '@hookform/resolvers/zod';
import defaultEstablishmentImage from 'assets/img/basic-auth.png';
import { useIntl } from 'react-intl';
import { CarbonScore } from '../../../components/CarbonScore';
import { BadgeCarousel } from '../../../components/BadgeCarousel';
import { usePointsStore } from '../../../store/pointsStore';
import { useDisclosure } from '@chakra-ui/react';
import { EnhancedTimeline } from '../../../components/EnhancedTimeline';
import { GamifiedOffset } from '../../../components/GamifiedOffset';
import { ConsumerSustainabilityInfo } from '../../../components/ConsumerSustainabilityInfo';
import { BlockchainVerificationBadge } from '../../../components/BlockchainVerificationBadge';
import {
  EnhancedProductTimeline,
  ProductHeader,
  EstablishmentInfo
} from '../../../components/ProductDetail';

// Assets

const registerSchema = object({
  first_name: string().min(1, 'Full name is required').max(100),
  last_name: string().min(1, 'Full name is required').max(100),
  email: string().min(1, 'Email address is required').email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  password2: string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.password2, {
  path: ['password2'],
  message: 'Passwords do not match'
});

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

function Capture() {
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
      let current: any = historyData?.parcel?.establishment;
      for (const key of path) {
        if (!current || !current[key]) return fallback;
        current = current[key];
      }
      return current;
    } catch {
      return fallback;
    }
  };

  const methods = useForm({
    resolver: zodResolver(registerSchema)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = methods;

  const {
    data: historyData,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetPublicHistoryQuery(productionId || '', {
    skip: productionId === undefined
  });

  const toast = useToast();
  const {
    data: carbonData,
    error: carbonError,
    isLoading: isCarbonDataLoading,
    isError: isCarbonDataError
  } = useGetQRCodeSummaryQuery(productionId || '', {
    skip: productionId === undefined
  });

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
  const pointsStore = usePointsStore();
  const [showMore, setShowMore] = useState(false);
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const [offsetLoading, setOffsetLoading] = useState(false);
  const [offsetAmount, setOffsetAmount] = useState(0.05);
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

  // Add user analytics state
  const [userTotalOffset, setUserTotalOffset] = useState(15.5); // For demo purposes
  const [userLevel, setUserLevel] = useState(2); // For demo purposes

  // Mobile-first responsive utilities
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const headerFontSize = useBreakpointValue({ base: 'xl', md: '3xl' });
  const carbonScoreSize = useBreakpointValue({ base: 'sm', md: 'md' });

  // Progressive loading states
  const [loadingStage, setLoadingStage] = useState<'initial' | 'carbon' | 'timeline' | 'complete'>(
    'initial'
  );

  // Enhanced gamification state
  const { points, addPoints } = usePointsStore();
  const [hasScanned, setHasScanned] = useState(false);

  useEffect(() => {
    if (productionId) {
      refetch();
    }
  }, [productionId, refetch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  useEffect(() => {
    if (carbonError) {
      toast({
        title: 'Error',
        description: 'Failed to load sustainability data. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } else if (carbonData) {
      if (pointsStore.points === 0) {
        pointsStore.addPoints(5);
        toast({
          title: 'Points Earned',
          description: 'You earned 5 Green Points for scanning this product!',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  }, [carbonError, carbonData, toast, pointsStore]);

  const onSubmitHandler = () => {
    if (commentValue && historyData?.history_scan) {
      createComment({
        comment: commentValue,
        scanId: historyData.history_scan
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
          'There was a problem processing your payment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top'
      });
    } finally {
      setOffsetLoading(false);
    }
  };

  const handleFeedback = () => {
    pointsStore.addPoints(2);
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your feedback!',
      status: 'success',
      duration: 5000,
      isClosable: true
    });
    onFeedbackModalClose();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${historyData?.product.name}'s Sustainable Product`,
        text: `${carbonData?.carbonScore}/100 carbon score! #Trazo`,
        url: window.location.href
      });
      pointsStore.addPoints(3);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const fetchProductData = async () => {
    if (historyData?.id) {
      // Refresh data by refetching the relevant queries
      void refetch();
    }
  };

  // Fix places where historyData.reputation is used without optional chaining
  const safeReputation = historyData?.reputation || 0; // Default to 0 if undefined

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
              textTransform="none"
            >
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
                letterSpacing="-0.02em"
              >
                {intl.formatMessage({ id: 'app.welcome' })}
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                fontWeight="normal"
                maxW={{ base: '90%', sm: '70%', lg: '60%' }}
                lineHeight="1.7"
                textAlign="center"
              >
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
        zIndex={10}
      >
        <Card
          w={{ sm: '95%', md: '90%', lg: '85%' }}
          p={{ sm: '16px', md: '32px', lg: '48px' }}
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          borderRadius="2xl"
          bg={bgColor}
        >
          <CardHeader mb="24px">
            <HStack spacing={3}>
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                {intl.formatMessage({ id: 'app.verified' })}
              </Badge>
              {carbonData?.isUsdaVerified && (
                <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                  USDA SOE Verified
                </Badge>
              )}
            </HStack>
            <HStack mt={4} spacing={4} align="center">
              <Heading color={textColor} fontSize={headerFontSize} fontWeight="bold">
                {historyData?.product.name}
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
              {historyData?.company}
            </Text>
            {/* Industry percentile text for better visibility */}
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
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
              {/* Left Column */}
              <Box>
                {/* Product Images */}
                <Box mb={6}>
                  {historyData?.images && <ImageCarousel imagesList={historyData?.images} />}
                </Box>

                {/* Carbon Score - Enhanced Version */}
                <Box borderRadius="lg" mb={6} bg="white" p={5} boxShadow="md">
                  <HStack spacing={2} mb={3} justify="center">
                    <Icon as={FaLeaf} color="green.500" boxSize={6} />
                    <Heading as="h3" size={carbonScoreSize} textAlign="center">
                      {intl.formatMessage({ id: 'app.carbonScore' }) || 'Carbon Score'}
                    </Heading>
                  </HStack>
                  <CarbonScore
                    score={carbonData?.carbonScore || 0}
                    footprint={carbonData?.netFootprint || 0}
                    industryPercentile={carbonData?.industryPercentile || 0}
                    relatableFootprint={
                      carbonData?.relatableFootprint ||
                      intl.formatMessage({ id: 'app.calculatingFootprint' })
                    }
                  />
                  {/* Enhanced industry comparison */}
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
                  {/* Relatable footprint */}
                  {carbonData?.relatableFootprint && (
                    <Box
                      mt={3}
                      p={2}
                      borderRadius="md"
                      borderLeft="3px solid"
                      borderColor="blue.400"
                      bg="blue.50"
                    >
                      <HStack>
                        <Icon as={FaInfoCircle} color="blue.500" />
                        <Text fontSize="sm" color="blue.700">
                          {`Carbon footprint: ${carbonData.relatableFootprint}`}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                  {/* Add connection to carbon reports if available */}
                  {carbonData?.reports && carbonData.reports.length > 0 && (
                    <Text mt={2} fontSize="sm" color="gray.600" textAlign="center">
                      {intl.formatMessage({ id: 'app.viewReportsBelow' }) ||
                        'View detailed carbon reports below'}
                      <Icon as={DownloadIcon} ml={1} boxSize={3} />
                    </Text>
                  )}
                </Box>

                {/* Consumer Sustainability Information */}
                <Box mb={6}>
                  <ConsumerSustainabilityInfo
                    productName={historyData?.product?.name || ''}
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

                {/* Blockchain Verification Badge */}
                <Box mb={6}>
                  <BlockchainVerificationBadge
                    verificationData={carbonData?.blockchainVerification}
                    isLoading={isCarbonDataLoading}
                    isCompact={isMobile}
                  />
                </Box>

                {/* Achievement Badges - Enhanced Version */}
                <Box borderRadius="lg" mb={6}>
                  <BadgeCarousel badges={carbonData?.badges || []} />
                </Box>

                {/* Quick Actions - Enhanced Version */}
                <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <VStack spacing={4}>
                    {/* Offset Options with Price Points */}
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
                          }}
                        >
                          $0.05
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="green"
                          variant="solid"
                          onClick={() => {
                            setOffsetAmount(0.1);
                            onOffsetModalOpen();
                          }}
                        >
                          $0.10
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="green"
                          variant="outline"
                          onClick={() => {
                            setOffsetAmount(0.25);
                            onOffsetModalOpen();
                          }}
                        >
                          $0.25
                        </Button>
                      </HStack>
                    </Box>

                    {/* Green Points Progress */}
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

                    {/* Social Actions */}
                    <HStack spacing={3} w="full">
                      <Button
                        leftIcon={<MdShare />}
                        colorScheme="blue"
                        onClick={handleShare}
                        flex={1}
                        size="md"
                      >
                        {intl.formatMessage({ id: 'app.share' }) || 'Share'} (+3)
                      </Button>
                      <Button
                        leftIcon={<MdStar />}
                        colorScheme="yellow"
                        onClick={onFeedbackModalOpen}
                        flex={1}
                        size="md"
                      >
                        {intl.formatMessage({ id: 'app.rate' }) || 'Rate'} (+2)
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </Box>

              {/* Right Column */}
              <Box>
                {/* Establishment Information */}
                <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <HStack spacing={2} justify="center" mb={3}>
                    <Icon as={MdBusiness} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      {intl.formatMessage({ id: 'app.establishment' })}
                    </Heading>
                  </HStack>
                  <VStack spacing={4} align="stretch">
                    {/* Establishment Image */}
                    {safeEstablishmentData(['photo']) && (
                      <Flex justify="center">
                        <Image
                          src={safeEstablishmentData(['photo'])}
                          alt={historyData?.parcel?.establishment?.name || 'Establishment'}
                          boxSize="150px"
                          objectFit="cover"
                          borderRadius="full"
                        />
                      </Flex>
                    )}

                    {/* Establishment Name */}
                    <HStack>
                      <Text fontWeight="bold">{intl.formatMessage({ id: 'app.name' })}:</Text>
                      <Text>{historyData?.parcel?.establishment?.name}</Text>
                    </HStack>

                    {/* Establishment Location */}
                    <HStack>
                      <Text fontWeight="bold">{intl.formatMessage({ id: 'app.location' })}:</Text>
                      <Text>{historyData?.parcel?.establishment?.location}</Text>
                    </HStack>

                    {/* Establishment Certifications */}
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

                    {/* Establishment Description */}
                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        {intl.formatMessage({ id: 'app.description' })}:
                      </Text>
                      <Box maxH="150px" overflowY="auto" pr={2}>
                        <HTMLRenderer
                          htmlString={historyData?.parcel?.establishment?.description || ''}
                        />
                      </Box>
                    </Box>

                    {/* Contact Information */}
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

                {/* Product Details Card */}
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
                        {historyData?.parcel.establishment.name}
                      </Link>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        {intl.formatMessage({ id: 'app.location' })}
                      </Text>
                      <Text color="gray.600">{historyData?.parcel.establishment.location}</Text>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        {intl.formatMessage({ id: 'app.parcel' })}
                      </Text>
                      <Link textDecoration="underline" color="green.500">
                        {historyData?.parcel.name}
                      </Link>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" color={textColor}>
                        {intl.formatMessage({ id: 'app.production' })}
                      </Text>
                      <Text color="gray.600">
                        {`${safeDate(historyData?.start_date)} - ${safeDate(
                          historyData?.finish_date
                        )}`}
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
                      <Text color="gray.600">{safeDate(historyData?.finish_date)}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Map and Establishment Description */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                  {/* Map */}
                  <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={4} height="250px">
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      {intl.formatMessage({ id: 'app.parcelLocation' })}
                    </Text>
                    {isLoaded && historyData && (
                      <GoogleMap
                        mapContainerStyle={{
                          width: '100%',
                          height: 'calc(100% - 30px)',
                          borderRadius: '10px'
                        }}
                        zoom={historyData?.parcel?.map_metadata?.zoom || 15}
                        center={historyData?.parcel?.map_metadata?.center || { lat: 0, lng: 0 }}
                        mapTypeId="satellite"
                      >
                        <Polygon
                          path={historyData?.parcel?.polygon || []}
                          options={{
                            fillColor: '#ff0000',
                            fillOpacity: 0.35,
                            strokeColor: '#ff0000',
                            strokeOpacity: 1,
                            strokeWeight: 2
                          }}
                        />
                      </GoogleMap>
                    )}
                  </Box>

                  {/* Establishment Description */}
                  <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      {historyData?.parcel.establishment.name}
                    </Text>
                    <Box maxH="202px" overflowY="auto" pr={2}>
                      <HTMLRenderer
                        htmlString={historyData?.parcel?.establishment?.description || ''}
                      />
                    </Box>
                  </Box>
                </SimpleGrid>
              </Box>
            </SimpleGrid>

            {/* Journey Timeline - Enhanced Version */}
            <Box bg={bgColor} borderRadius="xl" boxShadow="lg" p={8} mb={6} w="100%">
              <VStack spacing={6} align="stretch">
                <HStack spacing={3} justify="center">
                  <Icon as={MdTimeline} color="green.500" boxSize={8} />
                  <Heading as="h2" size="xl" textAlign="center">
                    {intl.formatMessage({ id: 'app.journeyOfYourProduct' }) ||
                      'Recorrido de tu Producto'}
                  </Heading>
                </HStack>

                <Text textAlign="center" color="gray.600" fontSize="lg">
                  {intl.formatMessage({ id: 'app.journeyDescription' }) ||
                    'Discover the complete story of how your product was grown, harvested, and prepared with care for the environment.'}
                </Text>

                <Divider />

                {/* Fix timeline events access - handle missing events property properly */}
                {(() => {
                  // Try to get events from various possible sources
                  const events =
                    (historyData as any)?.events ||
                    (historyData as any)?.timeline_events ||
                    (historyData as any)?.production_events ||
                    [];

                  return Array.isArray(events) && events.length > 0 ? (
                    <EnhancedProductTimeline events={events} />
                  ) : (
                    <Box p={8} textAlign="center" bg="gray.50" borderRadius="xl">
                      <Icon as={MdTimeline} color="gray.400" boxSize={16} mb={4} />
                      <Heading as="h3" size="md" color="gray.600" mb={2}>
                        {intl.formatMessage({ id: 'app.noTimelineData' }) ||
                          'Timeline data is being prepared'}
                      </Heading>
                      <Text color="gray.500" fontSize="md">
                        {intl.formatMessage({ id: 'app.timelineComingSoon' }) ||
                          'Production journey details will be available soon'}
                      </Text>
                    </Box>
                  );
                })()}
              </VStack>
            </Box>

            {/* Emissions and Offsets Breakdown */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              {/* Emissions Breakdown */}
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

              {/* Offset Breakdown */}
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

                {/* Social Proof */}
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

            {/* Carbon Reports - when available */}
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
                              onClick={() => window.open(report.document!, '_blank')}
                            >
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

                {/* USDA Verification Badge */}
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

            {/* Similar Products */}
            <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
              <Text fontSize="lg" color={textColor} fontWeight="bold" mb="24px">
                {intl.formatMessage({ id: 'app.similarProducts' })}
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {historyData?.similar_histories.map((history: any) => (
                  <Box
                    key={history.id}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderRadius="lg"
                    boxShadow="sm"
                    p={4}
                    cursor="pointer"
                    onClick={() => navigate(`/production/${history.id}`, { replace: true })}
                    transition="all 0.2s"
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                  >
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

            {/* Sustainability Recommendations */}
            {/* {recommendationsData &&
              recommendationsData.recommendations &&
              recommendationsData.recommendations.length > 0 && (
                <Box mb={6}>
                  <Heading as="h3" size="md" mb={3}>
                    {intl.formatMessage({ id: 'app.sustainability' })}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {recommendationsData.recommendations.slice(0, 4).map((rec, index) => (
                      <HStack key={index} align="start" spacing={3}>
                        <Icon
                          as={
                            index % 4 === 0
                              ? FaWater
                              : index % 4 === 1
                              ? MdNoFood
                              : index % 4 === 2
                              ? FaSeedling
                              : FaLeaf
                          }
                          color="green.500"
                          boxSize={5}
                          mt={1}
                        />
                        <Box>
                          <Text fontWeight="bold">
                            {rec.title
                              .replace('Implement ', '')
                              .replace('Switch to ', '')
                              .replace('Use ', '')}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {rec.impact || rec.description}
                          </Text>
                        </Box>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
              )} */}

            {/* Feedback Section */}
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
                        leftIcon={<Icon as={FaRegCheckCircle} />}
                      >
                        {intl.formatMessage({ id: 'app.send' })}
                      </Button>
                    </Flex>
                  </>
                )}
              </FormControl>
            </Box>
          </CardBody>
        </Card>
      </Flex>

      {/* Offset Modal */}
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
              {/* Offset amount selector */}
              <Text fontWeight="medium" mt={2}>
                {intl.formatMessage({ id: 'app.selectAmount' }) || 'Select Amount:'}
              </Text>
              <SimpleGrid columns={3} spacing={3}>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant={offsetAmount === 0.05 ? 'solid' : 'outline'}
                  onClick={() => setOffsetAmount(0.05)}
                >
                  $0.05
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant={offsetAmount === 0.1 ? 'solid' : 'outline'}
                  onClick={() => setOffsetAmount(0.1)}
                >
                  $0.10
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant={offsetAmount === 0.25 ? 'solid' : 'outline'}
                  onClick={() => setOffsetAmount(0.25)}
                >
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
              isDisabled={offsetLoading}
            >
              {intl.formatMessage({ id: 'app.cancel' }) || 'Cancel'}
            </Button>
            <Button
              colorScheme="green"
              onClick={handleOffset}
              isLoading={offsetLoading}
              leftIcon={<Icon as={FaLeaf} />}
            >
              {intl.formatMessage({ id: 'app.payAmount' }, { amount: offsetAmount.toFixed(2) }) ||
                `Pay $${offsetAmount.toFixed(2)}`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Feedback Modal */}
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
    </Flex>
  );
}

export default Capture;
