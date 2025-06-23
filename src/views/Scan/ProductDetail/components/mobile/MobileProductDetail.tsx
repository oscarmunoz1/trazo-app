import React, { useState, useEffect, lazy, Suspense } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useColorModeValue,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Icon,
  Badge,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Container,
  Flex
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShare, FaStar, FaLeaf } from 'react-icons/fa';
import {
  useGetCarbonQuickScoreQuery,
  useGetProductBasicsQuery,
  useGetProductFullDetailsQuery
} from 'store/api/optimizedQrApi';
import { CarbonScore } from '../../../../../components/CarbonScore';
import { useAddEstablishmentCarbonFootprintMutation } from 'store/api/companyApi';
import { usePointsStore } from '../../../../../store/pointsStore';
import { useIntl } from 'react-intl';
import MobileEducationalSection from './MobileEducationalSection';
import ImageCarousel from '../../../../../components/ImageCarousel/ImageCarousel';

// Lazy loaded components for non-critical UI
// Use dynamic imports with default exports
const LazyProductHeader = lazy(() =>
  import('../../../../../components/ProductDetail/ProductHeader').then((module) => ({
    default: module.ProductHeader
  }))
);
const LazyEstablishmentInfo = lazy(() =>
  import('../../../../../components/ProductDetail/EstablishmentInfo').then((module) => ({
    default: module.EstablishmentInfo
  }))
);
const LazyEnhancedProductTimeline = lazy(() =>
  import('../../../../../components/ProductDetail/EnhancedProductTimeline').then((module) => ({
    default: module.EnhancedProductTimeline
  }))
);
const LazyBlockchainVerificationBadge = lazy(() =>
  import('../../../../../components/BlockchainVerificationBadge').then((module) => ({
    default: module.BlockchainVerificationBadge
  }))
);

// Simple loading skeletons for each lazy component
const ProductHeaderSkeleton = () => (
  <Box w="100%" p={4}>
    <SkeletonText mt="4" noOfLines={2} spacing="4" />
    <Skeleton height="200px" mt={4} borderRadius="md" />
    <HStack mt={4}>
      <SkeletonCircle size="8" />
      <SkeletonText noOfLines={1} width="40%" />
    </HStack>
  </Box>
);

const EstablishmentInfoSkeleton = () => (
  <Box w="100%" p={4}>
    <SkeletonText mt="4" noOfLines={1} spacing="4" />
    <HStack mt={4}>
      <SkeletonCircle size="12" />
      <VStack align="start">
        <SkeletonText noOfLines={1} width="60%" />
        <SkeletonText noOfLines={1} width="40%" />
      </VStack>
    </HStack>
    <SkeletonText mt={4} noOfLines={3} spacing="4" />
  </Box>
);

const TimelineSkeleton = () => (
  <Box w="100%" p={4}>
    <SkeletonText mt="4" noOfLines={1} spacing="4" />
    <VStack mt={4} spacing={4}>
      {[1, 2, 3].map((i) => (
        <HStack key={i} w="100%">
          <SkeletonCircle size="8" />
          <VStack align="start" flex={1}>
            <SkeletonText noOfLines={1} width="30%" />
            <SkeletonText noOfLines={2} width="90%" />
          </VStack>
        </HStack>
      ))}
    </VStack>
  </Box>
);

const MobileProductDetail: React.FC = () => {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const intl = useIntl();
  const pointsStore = usePointsStore();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // State for modals
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
  const [offsetAmount, setOffsetAmount] = useState(0.05);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [offsetLoading, setOffsetLoading] = useState(false);

  // Performance metrics
  const [carbonScoreLoadTime, setCarbonScoreLoadTime] = useState<number | null>(null);
  const [fullPageLoadTime, setFullPageLoadTime] = useState<number | null>(null);
  const pageLoadStart = performance.now();

  // Progressive loading queries
  // Priority 1: Carbon score - load immediately, smallest payload
  const {
    data: carbonScoreData,
    error: carbonScoreError,
    isLoading: isCarbonScoreLoading
  } = useGetCarbonQuickScoreQuery(productionId || '', {
    skip: productionId === undefined
  });

  // Track carbon score load time
  useEffect(() => {
    if (carbonScoreData && !carbonScoreLoadTime) {
      setCarbonScoreLoadTime(performance.now() - pageLoadStart);
    }
  }, [carbonScoreData, carbonScoreLoadTime, pageLoadStart]);

  // Priority 2: Basic product info - load after carbon score
  const {
    data: productBasicsData,
    error: productBasicsError,
    isLoading: isProductBasicsLoading
  } = useGetProductBasicsQuery(productionId || '', {
    skip: productionId === undefined || !carbonScoreData
  });

  // Priority 3: Full details - load last
  const {
    data: productFullDetailsData,
    error: productFullDetailsError,
    isLoading: isProductFullDetailsLoading
  } = useGetProductFullDetailsQuery(productionId || '', {
    skip: productionId === undefined || !productBasicsData
  });

  // Track full page load time
  useEffect(() => {
    if (productFullDetailsData && !fullPageLoadTime) {
      setFullPageLoadTime(performance.now() - pageLoadStart);

      // Log performance metrics
      console.log(`Carbon score loaded in: ${carbonScoreLoadTime}ms`);
      console.log(`Full page loaded in: ${performance.now() - pageLoadStart}ms`);

      // Here you could send metrics to analytics
    }
  }, [productFullDetailsData, fullPageLoadTime, carbonScoreLoadTime, pageLoadStart]);

  const [addEstablishmentCarbonFootprint] = useAddEstablishmentCarbonFootprintMutation();

  // Handlers
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Carbon Footprint for ${productBasicsData?.name || 'Product'}`,
          text: `Check out the carbon footprint for this product: ${
            carbonScoreData?.carbonScore || 'N/A'
          } score`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied to clipboard',
        status: 'success',
        duration: 2000
      });
    }
  };

  const handleOffset = async () => {
    setOffsetLoading(true);
    try {
      // Handle offset logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call

      pointsStore.addPoints(Math.floor(offsetAmount * 100));

      toast({
        title: 'Carbon offset successful!',
        description: `You've offset ${offsetAmount} kg of CO2e`,
        status: 'success',
        duration: 3000
      });

      onOffsetModalClose();
    } catch (error) {
      toast({
        title: 'Offset failed',
        description: 'There was an error processing your offset',
        status: 'error',
        duration: 3000
      });
    } finally {
      setOffsetLoading(false);
    }
  };

  const handleFeedback = () => {
    // Feedback submission logic
    toast({
      title: 'Feedback submitted',
      description: 'Thank you for your feedback!',
      status: 'success',
      duration: 3000
    });
    onFeedbackModalClose();
  };

  // Show error state if data loading fails
  const hasError = carbonScoreError || productBasicsError || productFullDetailsError;
  const isInitialLoading = isCarbonScoreLoading && !carbonScoreData;

  if (hasError && !isInitialLoading) {
    return (
      <Container maxW="container.sm" p={4}>
        <VStack spacing={4} align="center" justify="center" minH="50vh">
          <Text fontSize="lg" fontWeight="bold" color="red.500">
            Error loading product information
          </Text>
          <Text>Please try again later or scan a different QR code.</Text>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.sm" p={0}>
      {/* Sticky Header with Carbon Score - Reduced Height for Mobile */}
      <Box
        position="sticky"
        top={0}
        zIndex={10}
        bg={bgColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
        px={4}
        py={{ base: 2, md: 3 }}
        shadow="sm"
        minH={{ base: '60px', md: '80px' }}
      >
        <HStack justify="space-between" align="center" h="full">
          <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" noOfLines={1}>
            {productBasicsData?.name || 'Product Details'}
          </Text>

          {isCarbonScoreLoading ? (
            <Skeleton height={{ base: '50px', md: '60px' }} width="120px" borderRadius="md" />
          ) : (
            <CarbonScore
              score={carbonScoreData?.carbonScore || 0}
              footprint={carbonScoreData?.netFootprint || 0}
              relatableFootprint={carbonScoreData?.relatableFootprint}
              isCompact={true}
            />
          )}
        </HStack>
      </Box>

      {/* Main Content Area - Mobile-First Component Ordering */}
      <VStack spacing={{ base: 3, md: 4 }} align="stretch" p={{ base: 3, md: 4 }} pb="90px">
        {/* MOBILE PRIORITY 1: Carbon Score (Full Version) - Always First */}
        {carbonScoreData && (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            borderColor={borderColor}
            bg={bgColor}
            p={{ base: 3, md: 4 }}
          >
            <CarbonScore
              score={carbonScoreData.carbonScore}
              footprint={carbonScoreData.netFootprint}
              relatableFootprint={carbonScoreData.relatableFootprint}
            />

            {/* Mobile Educational Section */}
            <MobileEducationalSection
              carbonData={carbonScoreData}
              handleEducationOpen={(topic) => {
                // Handle education modal opening
                console.log('Opening education for:', topic);
              }}
              setShowTrustComparison={(show) => {
                // Handle trust comparison
                console.log('Show trust comparison:', show);
              }}
            />
          </Box>
        )}

        {/* MOBILE PRIORITY 2: Product Header with Image - Second */}
        {productBasicsData && (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            borderColor={borderColor}
            bg={bgColor}
          >
            {/* Add Image Carousel */}
            <Box p={{ base: 3, md: 4 }}>
              <ImageCarousel imagesList={productFullDetailsData?.images || []} />
            </Box>

            <Suspense fallback={<ProductHeaderSkeleton />}>
              <LazyProductHeader
                productName={productBasicsData.name}
                companyName={productBasicsData.company.name}
                reputation={4.5}
                isUsdaVerified={productFullDetailsData?.isUsdaVerified}
                industryPercentile={productFullDetailsData?.industryPercentile}
              />
            </Suspense>
          </Box>
        )}

        {/* MOBILE PRIORITY 3: Production Timeline - Third */}
        {productFullDetailsData?.timeline && productFullDetailsData.timeline.length > 0 && (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            borderColor={borderColor}
            bg={bgColor}
          >
            <Suspense fallback={<TimelineSkeleton />}>
              <LazyEnhancedProductTimeline
                events={productFullDetailsData.timeline}
                isCompact={true}
              />
            </Suspense>
          </Box>
        )}

        {/* MOBILE PRIORITY 4: Verification Badge - Fourth */}
        {productFullDetailsData?.blockchainVerification && (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            borderColor={borderColor}
            bg={bgColor}
          >
            <Suspense fallback={<Skeleton height="60px" borderRadius="md" />}>
              <LazyBlockchainVerificationBadge
                verificationData={{
                  verified: productFullDetailsData.blockchainVerification.verified || false,
                  transaction_hash: productFullDetailsData.blockchainVerification.transaction_hash,
                  record_hash: productFullDetailsData.blockchainVerification.record_hash,
                  verification_url: productFullDetailsData.blockchainVerification.verification_url,
                  network: productFullDetailsData.blockchainVerification.network
                }}
              />
            </Suspense>
          </Box>
        )}

        {/* MOBILE PRIORITY 5: Establishment Info - Fifth */}
        {productFullDetailsData?.establishment && (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            borderColor={borderColor}
            bg={bgColor}
          >
            <Suspense fallback={<EstablishmentInfoSkeleton />}>
              <LazyEstablishmentInfo
                establishment={{
                  id: productFullDetailsData.establishment.id,
                  name: productFullDetailsData.establishment.name,
                  location:
                    productFullDetailsData.establishment.location?.address ||
                    'Location unavailable',
                  description: productFullDetailsData.establishment.description || '',
                  photo: productFullDetailsData.establishment.image,
                  certifications:
                    productFullDetailsData.establishment.certifications?.map((cert) => cert.name) ||
                    []
                }}
              />
            </Suspense>
          </Box>
        )}
      </VStack>

      {/* Fixed Bottom Action Bar - Enhanced Touch Targets */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        p={{ base: 3, md: 4 }}
        bg={bgColor}
        borderTopWidth="1px"
        borderColor={borderColor}
        shadow="lg"
        zIndex={5}
      >
        <HStack spacing={{ base: 2, md: 4 }} justify="space-around">
          <Button
            colorScheme="green"
            leftIcon={<Icon as={FaLeaf} boxSize={{ base: 4, md: 5 }} />}
            onClick={onOffsetModalOpen}
            isDisabled={isCarbonScoreLoading}
            flex={1}
            minH={{ base: '48px', md: '52px' }}
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="medium"
            borderRadius="lg"
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: 'lg'
            }}
            _active={{
              transform: 'translateY(0)',
              boxShadow: 'md'
            }}
            transition="all 0.2s"
          >
            Offset
          </Button>

          <Button
            colorScheme="blue"
            leftIcon={<Icon as={FaShare} boxSize={{ base: 4, md: 5 }} />}
            onClick={handleShare}
            flex={1}
            minH={{ base: '48px', md: '52px' }}
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="medium"
            borderRadius="lg"
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: 'lg'
            }}
            _active={{
              transform: 'translateY(0)',
              boxShadow: 'md'
            }}
            transition="all 0.2s"
          >
            Share
          </Button>

          <Button
            colorScheme="yellow"
            leftIcon={<Icon as={FaStar} boxSize={{ base: 4, md: 5 }} />}
            onClick={onFeedbackModalOpen}
            flex={1}
            minH={{ base: '48px', md: '52px' }}
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="medium"
            borderRadius="lg"
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: 'lg'
            }}
            _active={{
              transform: 'translateY(0)',
              boxShadow: 'md'
            }}
            transition="all 0.2s"
          >
            Review
          </Button>
        </HStack>
      </Box>

      {/* Modals */}
      {/* Offset Modal */}
      <Modal isOpen={isOffsetModalOpen} onClose={onOffsetModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Offset Carbon Footprint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>
                Offset {offsetAmount} kg of CO2e for {(offsetAmount * 0.5).toFixed(2)} USD
              </Text>
              {/* Offset amount slider would go here */}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleOffset} isLoading={offsetLoading}>
              Purchase Offset
            </Button>
            <Button variant="ghost" onClick={onOffsetModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Feedback Modal */}
      <Modal isOpen={isFeedbackModalOpen} onClose={onFeedbackModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Leave a Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>How would you rate this product?</Text>
              {/* Star rating component would go here */}
              {/* Feedback form would go here */}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleFeedback}>
              Submit Review
            </Button>
            <Button variant="ghost" onClick={onFeedbackModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default MobileProductDetail;
