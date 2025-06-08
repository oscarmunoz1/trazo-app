import React, { useState, useCallback, useMemo } from 'react';
import {
  Container,
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Button,
  Icon,
  useColorModeValue,
  useBreakpointValue,
  Divider,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  Fade,
  useToast
} from '@chakra-ui/react';
import { FaArrowLeft, FaMapMarkerAlt, FaGlobeAmericas } from 'react-icons/fa';
import { MdInfo } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

// Enhanced Components
import { ProductHeader } from './ProductHeader';
import { SustainabilityFeatures } from './SustainabilityFeatures';
import { EstablishmentInfo } from './EstablishmentInfo';
import { EnhancedProductTimeline } from './EnhancedProductTimeline';

// Existing Components
import PlaceholderImage from 'components/PlaceholderImage';
import MapComponent from 'components/Map';
import ProductDetailCard from 'components/ProductDetailCard';

interface EnhancedProductDetailProps {
  historyData: any;
  carbonData: any;
  productData: any;
  loading?: boolean;
  error?: string;
}

export const EnhancedProductDetail: React.FC<EnhancedProductDetailProps> = ({
  historyData,
  carbonData,
  productData,
  loading = false,
  error
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentPoints, setCurrentPoints] = useState(125); // Initial points from user profile

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const containerMaxW = useBreakpointValue({ base: 'full', lg: '6xl' });
  const padding = useBreakpointValue({ base: 4, md: 6, lg: 8 });

  // Memoized data processing
  const processedData = useMemo(() => {
    if (!historyData || !carbonData || !productData) return null;

    return {
      // Product information
      productName: productData.name || 'Product',
      companyName: productData.company?.name || 'Unknown Company',

      // Sustainability metrics
      carbonScore: carbonData.score || 0,
      netFootprint: carbonData.net_footprint || 0,
      industryPercentile: carbonData.industry_percentile || 0,
      relatableFootprint: carbonData.relatable_footprint,

      // Establishment data
      establishment: {
        id: historyData.establishment?.id || '',
        name: historyData.establishment?.name || 'Farm',
        location: historyData.establishment?.address || 'Location not available',
        description: historyData.establishment?.description || '',
        photo: historyData.establishment?.photo,
        certifications: historyData.establishment?.certifications || [],
        email: historyData.establishment?.email,
        phone: historyData.establishment?.phone
      },

      // Timeline events
      events: historyData.events || [],

      // Badges and achievements
      badges: carbonData.badges || [],

      // Map data
      parcel: historyData.parcel || null,

      // Product details for card
      productDetails: {
        ...productData,
        reputation: historyData.establishment?.reputation || 4.5
      }
    };
  }, [historyData, carbonData, productData]);

  // Action handlers
  const handleOffset = useCallback(() => {
    toast({
      title: 'Carbon Offset',
      description: 'Thank you for your contribution to sustainability!',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
    setCurrentPoints((prev) => prev + 10);
  }, [toast]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this sustainable product: ${processedData?.productName}`,
        text: `This product has a carbon score of ${processedData?.carbonScore}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'Product link copied to clipboard',
        status: 'success',
        duration: 2000
      });
    }
    setCurrentPoints((prev) => prev + 3);
  }, [processedData, toast]);

  const handleRate = useCallback(() => {
    toast({
      title: 'Thank you!',
      description: 'Your rating helps other consumers make sustainable choices',
      status: 'success',
      duration: 2000
    });
    setCurrentPoints((prev) => prev + 2);
  }, [toast]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <Container maxW={containerMaxW} py={padding}>
        <VStack spacing={6}>
          <Skeleton height="200px" borderRadius="xl" />
          <Skeleton height="300px" borderRadius="xl" />
          <Skeleton height="400px" borderRadius="xl" />
        </VStack>
      </Container>
    );
  }

  // Error state
  if (error || !processedData) {
    return (
      <Container maxW={containerMaxW} py={padding}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="300px"
          borderRadius="xl"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {intl.formatMessage({ id: 'app.error' }) || 'Error'}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error ||
              intl.formatMessage({ id: 'app.dataLoadError' }) ||
              'Unable to load product data'}
          </AlertDescription>
          <Button mt={4} colorScheme="red" variant="outline" onClick={handleGoBack}>
            {intl.formatMessage({ id: 'app.goBack' }) || 'Go Back'}
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW={containerMaxW} py={padding}>
        <VStack spacing={8} align="stretch">
          {/* Header Navigation */}
          <Fade in>
            <HStack spacing={4} mb={4}>
              <Button leftIcon={<Icon as={FaArrowLeft} />} variant="ghost" onClick={handleGoBack}>
                {intl.formatMessage({ id: 'app.back' }) || 'Back'}
              </Button>
            </HStack>
          </Fade>

          {/* Welcome Header */}
          <Fade in>
            <Box
              bg="linear-gradient(135deg, #48BB78 0%, #38A169 100%)"
              color="white"
              p={8}
              borderRadius="2xl"
              textAlign="center"
              position="relative"
              overflow="hidden"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.3
              }}
            >
              <VStack spacing={3} position="relative" zIndex={1}>
                <Heading as="h1" size="xl" fontWeight="bold">
                  ¡{intl.formatMessage({ id: 'app.welcome' }) || 'Bienvenido'}!
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  {intl.formatMessage({ id: 'app.welcomeSubtitle' }) ||
                    'Discover the sustainable story behind your product'}
                </Text>
              </VStack>
            </Box>
          </Fade>

          {/* Product Header */}
          <Fade in>
            <ProductHeader
              productName={processedData.productName}
              companyName={processedData.companyName}
              reputation={processedData.productDetails.reputation}
              isUsdaVerified={processedData.establishment.certifications?.includes('USDA')}
              industryPercentile={processedData.industryPercentile}
            />
          </Fade>

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Left Column */}
            <VStack spacing={8} align="stretch">
              {/* Sustainability Features */}
              <Fade in>
                <SustainabilityFeatures
                  carbonScore={processedData.carbonScore}
                  netFootprint={processedData.netFootprint}
                  industryPercentile={processedData.industryPercentile}
                  relatableFootprint={processedData.relatableFootprint}
                  badges={processedData.badges}
                  points={currentPoints}
                  onOffset={handleOffset}
                  onShare={handleShare}
                  onRate={handleRate}
                />
              </Fade>

              {/* Product Details Card */}
              <Fade in>
                <Box borderRadius="xl" overflow="hidden" boxShadow="lg">
                  <ProductDetailCard productData={processedData.productDetails} />
                </Box>
              </Fade>
            </VStack>

            {/* Right Column */}
            <VStack spacing={8} align="stretch">
              {/* Establishment Information */}
              <Fade in>
                <EstablishmentInfo establishment={processedData.establishment} />
              </Fade>

              {/* Map Section */}
              {processedData.parcel && (
                <Fade in>
                  <Box
                    bg="white"
                    borderRadius="xl"
                    boxShadow="lg"
                    p={6}
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <HStack spacing={3} mb={4}>
                      <Icon as={FaMapMarkerAlt} color="blue.500" boxSize={6} />
                      <Heading as="h3" size="lg">
                        {intl.formatMessage({ id: 'app.location' }) || 'Location'}
                      </Heading>
                    </HStack>

                    <Box borderRadius="lg" overflow="hidden" height="300px">
                      <MapComponent
                        parcel={processedData.parcel}
                        establishment={processedData.establishment}
                      />
                    </Box>
                  </Box>
                </Fade>
              )}
            </VStack>
          </SimpleGrid>

          {/* Timeline Section */}
          <Fade in>
            <Box
              bg="white"
              borderRadius="xl"
              boxShadow="lg"
              p={8}
              border="1px solid"
              borderColor="gray.200"
            >
              <VStack spacing={6} align="stretch">
                <HStack spacing={3} justify="center">
                  <Icon as={FaGlobeAmericas} color="green.500" boxSize={8} />
                  <Heading as="h2" size="xl" textAlign="center">
                    {intl.formatMessage({ id: 'app.productJourney' }) || 'Recorrido de tu Producto'}
                  </Heading>
                </HStack>

                <Text textAlign="center" color="gray.600" fontSize="lg">
                  {intl.formatMessage({ id: 'app.journeyDescription' }) ||
                    'Discover the complete story of how your product was grown, harvested, and prepared with care for the environment.'}
                </Text>

                <Divider />

                <EnhancedProductTimeline events={processedData.events} />
              </VStack>
            </Box>
          </Fade>

          {/* Footer CTA */}
          <Fade in>
            <Box
              bg="linear-gradient(135deg, #4299E1 0%, #3182CE 100%)"
              color="white"
              p={6}
              borderRadius="xl"
              textAlign="center"
            >
              <VStack spacing={4}>
                <Heading as="h3" size="lg">
                  {intl.formatMessage({ id: 'app.makeDifference' }) || 'Make a Difference'}
                </Heading>
                <Text fontSize="md" opacity={0.9}>
                  {intl.formatMessage({ id: 'app.encourageMessage' }) ||
                    'Every sustainable choice you make helps build a better future for our planet.'}
                </Text>
                <HStack spacing={4}>
                  <Button colorScheme="whiteAlpha" variant="solid" onClick={handleShare}>
                    {intl.formatMessage({ id: 'app.shareStory' }) || 'Share This Story'}
                  </Button>
                  <Button colorScheme="whiteAlpha" variant="outline" onClick={handleOffset}>
                    {intl.formatMessage({ id: 'app.offsetMore' }) || 'Offset More Carbon'}
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </Fade>
        </VStack>
      </Container>
    </Box>
  );
};
