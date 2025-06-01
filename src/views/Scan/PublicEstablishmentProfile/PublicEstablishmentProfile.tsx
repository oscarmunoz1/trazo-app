// Chakra imports
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Tag,
  TagLabel,
  Text,
  VStack,
  useColorModeValue,
  useBreakpointValue,
  Heading,
  Divider,
  Circle,
  Avatar,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Image,
  useToast
} from '@chakra-ui/react';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaLeaf,
  FaUsers,
  FaTractor,
  FaCalendar,
  FaCertificate,
  FaSeedling,
  FaGlobe,
  FaChartLine,
  FaShare,
  FaStar,
  FaTree,
  FaInfoCircle,
  FaWater,
  FaRecycle,
  FaBolt
} from 'react-icons/fa';
import {
  MdLocationOn,
  MdBusiness,
  MdEco,
  MdCalendarToday,
  MdVerified,
  MdShare,
  MdTimeline
} from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import defaultEstablishmentImage from 'assets/img/basic-auth.png';
import { useGetPublicEstablishmentQuery } from 'store/api/companyApi';
import { useGetQRCodeSummaryQuery } from 'store/api/carbonApi';
import { useIntl } from 'react-intl';
import { CarbonScore } from '../../../components/CarbonScore';
import { BadgeCarousel } from '../../../components/BadgeCarousel';
import { usePointsStore } from '../../../store/pointsStore';
import { useDisclosure } from '@chakra-ui/react';
import { ConsumerSustainabilityInfo } from '../../../components/ConsumerSustainabilityInfo';

// Type definitions
interface EstablishmentImage {
  id: number;
  url: string;
}

function PublicEstablishmentProfile() {
  const intl = useIntl();
  const titleColor = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const { establishmentId } = useParams();
  const toast = useToast();
  const pointsStore = usePointsStore();

  // Mobile-first responsive utilities
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const headerFontSize = useBreakpointValue({ base: 'xl', md: '3xl' });
  const carbonScoreSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const {
    data: establishmentData,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetPublicEstablishmentQuery(establishmentId || '', {
    skip: establishmentId === undefined
  });

  // Get carbon data for the establishment
  const {
    data: carbonData,
    error: carbonError,
    isLoading: isCarbonDataLoading,
    isError: isCarbonDataError
  } = useGetQRCodeSummaryQuery(establishmentId || '', {
    skip: establishmentId === undefined
  });

  // Helper function to get crops grown
  const getCropsGrown = () => {
    if (!establishmentData?.crops_grown) return [];
    if (Array.isArray(establishmentData.crops_grown)) {
      return establishmentData.crops_grown;
    }
    return [];
  };

  // Helper function to get image URLs in the format expected by ImageCarousel
  const getImageUrls = () => {
    if (!establishmentData?.images) return [defaultEstablishmentImage];

    // Debug logging
    console.log('Raw establishment images:', establishmentData.images);

    // Handle both formats: array of objects {id, url} or array of strings
    let imageUrls: string[] = [];

    if (Array.isArray(establishmentData.images)) {
      imageUrls = establishmentData.images
        .map((image: EstablishmentImage | string) => {
          // If image is an object with url property, extract the url
          if (typeof image === 'object' && image.url) {
            return image.url;
          }
          // If image is already a string URL, use it directly
          if (typeof image === 'string') {
            return image;
          }
          return null;
        })
        .filter(Boolean) as string[]; // Remove any null values and cast to string[]
    }

    console.log('Processed image URLs:', imageUrls);

    // Return the processed URLs or fallback to default
    return imageUrls.length > 0 ? imageUrls : [defaultEstablishmentImage];
  };

  // Helper function to parse certifications
  const getCertifications = () => {
    if (!establishmentData?.certifications) return [];
    if (typeof establishmentData.certifications === 'string') {
      return establishmentData.certifications
        .split(',')
        .map((cert: string) => cert.trim())
        .filter(Boolean);
    }
    if (Array.isArray(establishmentData.certifications)) {
      return establishmentData.certifications;
    }
    return [];
  };

  // Helper function to get sustainability practices
  const getSustainabilityPractices = () => {
    if (!establishmentData?.sustainability_practices) return [];
    if (Array.isArray(establishmentData.sustainability_practices)) {
      return establishmentData.sustainability_practices;
    }
    return [];
  };

  useEffect(() => {
    if (establishmentId) {
      refetch();
    }
  }, [establishmentId, refetch]);

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
        pointsStore.addPoints(3);
        toast({
          title: 'Points Earned',
          description: 'You earned 3 Green Points for viewing this sustainable establishment!',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  }, [carbonError, carbonData, toast, pointsStore]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${establishmentData?.name} - Sustainable Agriculture`,
        text: `Check out this sustainable farm! #Trazo #SustainableAgriculture`,
        url: window.location.href
      });
      pointsStore.addPoints(3);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (isLoading) {
    return (
      <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
        <Box bg="linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)" pt="150px" pb="120px" px={4}>
          <Container maxW="6xl" mx="auto">
            <VStack spacing={6} textAlign="center">
              <Skeleton height="20px" width="200px" />
              <Skeleton height="40px" width="300px" />
              <Skeleton height="20px" width="250px" />
            </VStack>
          </Container>
        </Box>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
        <Container maxW="6xl" mx="auto" py={20}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Establishment not found!</AlertTitle>
              <AlertDescription>
                The establishment you're looking for doesn't exist or is not available publicly.
              </AlertDescription>
            </Box>
          </Alert>
        </Container>
      </Flex>
    );
  }

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
      {/* Clean Modern Header */}
      <Box bg="linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)" pt="150px" pb="120px" px={4}>
        <Container maxW="6xl" mx="auto">
          <VStack spacing={6} textAlign="center">
            {/* Establishment Badge */}
            <Badge
              colorScheme="green"
              variant="subtle"
              fontSize="sm"
              px={4}
              py={2}
              borderRadius="full"
              textTransform="none">
              <HStack spacing={2}>
                <Icon as={FaBuilding} boxSize={4} />
                <Text fontWeight="medium">
                  {intl.formatMessage({ id: 'app.sustainableEstablishment' }) ||
                    'Sustainable Establishment'}
                </Text>
              </HStack>
            </Badge>

            {/* Main Title */}
            <VStack spacing={3}>
              <Heading
                as="h1"
                size="2xl"
                color={titleColor}
                fontWeight="bold"
                textAlign="center"
                letterSpacing="-0.02em">
                {establishmentData?.name || 'Loading...'}
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                fontWeight="normal"
                maxW={{ base: '90%', sm: '70%', lg: '60%' }}
                lineHeight="1.7"
                textAlign="center">
                {establishmentData?.description || 'Sustainable Agriculture'}
              </Text>
            </VStack>

            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full" maxW="2xl">
              <VStack>
                <Circle size="50px" bg="green.100" color="green.600">
                  <Icon as={FaTractor} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {establishmentData?.total_acreage || '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Acres
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="blue.100" color="blue.600">
                  <Icon as={FaLeaf} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {carbonData?.carbonScore || '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Eco Score
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="purple.100" color="purple.600">
                  <Icon as={FaCalendar} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {establishmentData?.year_established || '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Founded
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="orange.100" color="orange.600">
                  <Icon as={FaSeedling} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {getCropsGrown().length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Crops
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
          {/* Header with Badges */}
          <CardHeader mb="24px">
            <HStack spacing={3}>
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                {intl.formatMessage({ id: 'app.verified' })}
              </Badge>
              {establishmentData?.establishment_type && (
                <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                  {establishmentData.establishment_type}
                </Badge>
              )}
              {establishmentData?.farming_method && (
                <Badge colorScheme="purple" fontSize="md" px={3} py={1} borderRadius="full">
                  {establishmentData.farming_method}
                </Badge>
              )}
            </HStack>
            <HStack mt={4} spacing={4} align="center" justify="space-between">
              <Heading color={textColor} fontSize={headerFontSize} fontWeight="bold">
                About {establishmentData?.name}
              </Heading>
              <Button
                leftIcon={<MdShare />}
                colorScheme="green"
                variant="outline"
                onClick={handleShare}
                size="sm">
                Share
              </Button>
            </HStack>
            <Text color="gray.500" fontSize="lg" mt={1}>
              {establishmentData?.location || 'Sustainable Agriculture'}
            </Text>
          </CardHeader>

          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
              {/* Left Column */}
              <Box>
                {/* Image Gallery */}
                <Box mb={6}>
                  <ImageCarousel imagesList={getImageUrls()} />
                </Box>

                {/* Carbon Score - Enhanced Version */}
                {carbonData && (
                  <Box borderRadius="lg" mb={6} bg="white" p={5} boxShadow="md">
                    <HStack spacing={2} mb={3} justify="center">
                      <Icon as={FaLeaf} color="green.500" boxSize={6} />
                      <Heading as="h3" size={carbonScoreSize} textAlign="center">
                        {intl.formatMessage({ id: 'app.sustainabilityScore' }) ||
                          'Sustainability Score'}
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
                  </Box>
                )}

                {/* Consumer Sustainability Information */}
                <Box mb={6}>
                  <ConsumerSustainabilityInfo
                    productName={establishmentData?.name || ''}
                    carbonScore={carbonData?.carbonScore || 0}
                    sustainabilityPractices={getSustainabilityPractices().map(
                      (practice: string, index: number) => ({
                        icon: (
                          <Icon
                            as={
                              index % 5 === 0
                                ? FaWater
                                : index % 5 === 1
                                ? FaRecycle
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
                        title: practice,
                        description: practice
                      })
                    )}
                  />
                </Box>

                {/* Achievement Badges */}
                {carbonData?.badges && (
                  <Box borderRadius="lg" mb={6}>
                    <BadgeCarousel badges={carbonData.badges} />
                  </Box>
                )}
              </Box>

              {/* Right Column */}
              <Box>
                {/* Contact Information */}
                {(establishmentData?.email || establishmentData?.phone) && (
                  <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                    <HStack spacing={2} justify="center" mb={4}>
                      <Icon as={FaPhone} color="green.500" boxSize={5} />
                      <Heading as="h3" size="md" color={textColor}>
                        Contact Information
                      </Heading>
                    </HStack>
                    <VStack spacing={3} align="stretch">
                      {establishmentData?.email && (
                        <HStack>
                          <Icon as={FaEnvelope} color="blue.500" />
                          <Text fontWeight="medium">Email:</Text>
                          <Link color="blue.500" href={`mailto:${establishmentData.email}`}>
                            {establishmentData.email}
                          </Link>
                        </HStack>
                      )}
                      {establishmentData?.phone && (
                        <HStack>
                          <Icon as={FaPhone} color="green.500" />
                          <Text fontWeight="medium">Phone:</Text>
                          <Link color="green.500" href={`tel:${establishmentData.phone}`}>
                            {establishmentData.phone}
                          </Link>
                        </HStack>
                      )}
                    </VStack>
                  </Card>
                )}

                {/* Location Information */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={MdLocationOn} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Location
                    </Heading>
                  </HStack>
                  <VStack spacing={3} align="stretch">
                    {establishmentData?.address && (
                      <HStack>
                        <Icon as={FaMapMarkerAlt} color="red.500" />
                        <Text fontWeight="medium">Address:</Text>
                        <Text>{establishmentData.address}</Text>
                      </HStack>
                    )}
                    {establishmentData?.city && (
                      <HStack>
                        <Icon as={MdBusiness} color="blue.500" />
                        <Text fontWeight="medium">City:</Text>
                        <Text>{establishmentData.city}</Text>
                      </HStack>
                    )}
                    {establishmentData?.state && (
                      <HStack>
                        <Icon as={MdBusiness} color="blue.500" />
                        <Text fontWeight="medium">State:</Text>
                        <Text>{establishmentData.state}</Text>
                      </HStack>
                    )}
                    {establishmentData?.country && (
                      <HStack>
                        <Icon as={FaGlobe} color="green.500" />
                        <Text fontWeight="medium">Country:</Text>
                        <Text>{establishmentData.country}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Card>

                {/* Operations Information */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaTractor} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Operations
                    </Heading>
                  </HStack>
                  <VStack spacing={4} align="stretch">
                    {establishmentData?.farming_method && (
                      <HStack>
                        <Icon as={MdEco} color="green.500" />
                        <Text fontWeight="medium">Farming Method:</Text>
                        <Badge colorScheme="green" variant="subtle">
                          {establishmentData.farming_method}
                        </Badge>
                      </HStack>
                    )}
                    {establishmentData?.total_acreage && (
                      <HStack>
                        <Icon as={FaTractor} color="brown.500" />
                        <Text fontWeight="medium">Total Acreage:</Text>
                        <Text>{establishmentData.total_acreage} acres</Text>
                      </HStack>
                    )}
                    {establishmentData?.employee_count && (
                      <HStack>
                        <Icon as={FaUsers} color="purple.500" />
                        <Text fontWeight="medium">Employees:</Text>
                        <Text>{establishmentData.employee_count}</Text>
                      </HStack>
                    )}
                    {establishmentData?.year_established && (
                      <HStack>
                        <Icon as={FaCalendar} color="blue.500" />
                        <Text fontWeight="medium">Established:</Text>
                        <Text>{establishmentData.year_established}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Card>

                {/* Social Media */}
                {(establishmentData?.facebook || establishmentData?.instagram) && (
                  <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                    <HStack spacing={2} justify="center" mb={4}>
                      <Icon as={FaGlobe} color="green.500" boxSize={5} />
                      <Heading as="h3" size="md" color={textColor}>
                        Follow Us
                      </Heading>
                    </HStack>
                    <HStack spacing={4} justify="center">
                      {establishmentData?.facebook && (
                        <Link
                          href={establishmentData.facebook}
                          isExternal
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="all 0.2s">
                          <Circle size="50px" bg="blue.100" color="blue.600">
                            <Icon as={FaFacebook} boxSize={6} />
                          </Circle>
                        </Link>
                      )}
                      {establishmentData?.instagram && (
                        <Link
                          href={establishmentData.instagram}
                          isExternal
                          _hover={{ transform: 'scale(1.1)' }}
                          transition="all 0.2s">
                          <Circle size="50px" bg="pink.100" color="pink.600">
                            <Icon as={FaInstagram} boxSize={6} />
                          </Circle>
                        </Link>
                      )}
                    </HStack>
                  </Card>
                )}
              </Box>
            </SimpleGrid>

            {/* Crops, Certifications, and Sustainability Section */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={8}>
              {/* Crops Grown */}
              {getCropsGrown().length > 0 && (
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaSeedling} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Crops Grown
                    </Heading>
                  </HStack>
                  <Flex gap={2} flexWrap="wrap" justify="center" align="flex-start">
                    {getCropsGrown().map((crop: string, index: number) => (
                      <Tag key={index} size="md" variant="solid" colorScheme="green">
                        <TagLabel>{crop}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                </Card>
              )}

              {/* Certifications */}
              {getCertifications().length > 0 && (
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaCertificate} color="blue.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Certifications
                    </Heading>
                  </HStack>
                  <Flex gap={2} flexWrap="wrap" justify="center" align="flex-start">
                    {getCertifications().map((cert: string, index: number) => (
                      <Tag key={index} size="md" variant="solid" colorScheme="blue">
                        <TagLabel>{cert}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                </Card>
              )}

              {/* Sustainability Practices */}
              {getSustainabilityPractices().length > 0 && (
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={MdEco} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Sustainability Practices
                    </Heading>
                  </HStack>
                  <Flex gap={2} flexWrap="wrap" justify="center" align="flex-start">
                    {getSustainabilityPractices().map((practice: string, index: number) => (
                      <Tag key={index} size="md" variant="solid" colorScheme="orange">
                        <TagLabel>{practice}</TagLabel>
                      </Tag>
                    ))}
                  </Flex>
                </Card>
              )}
            </SimpleGrid>

            {/* About and Information Sections */}
            <VStack spacing={6} align="stretch">
              {/* About Section */}
              {establishmentData?.about && (
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaInfoCircle} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      About This Establishment
                    </Heading>
                  </HStack>
                  <Text lineHeight="tall" textAlign="center">
                    {establishmentData.about}
                  </Text>
                </Card>
              )}

              {/* Main Activities */}
              {establishmentData?.main_activities && (
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaTractor} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Main Activities & Services
                    </Heading>
                  </HStack>
                  <Text lineHeight="tall" textAlign="center">
                    {establishmentData.main_activities}
                  </Text>
                </Card>
              )}

              {/* Location Highlights */}
              {establishmentData?.location_highlights && (
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaMapMarkerAlt} color="orange.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Location Highlights
                    </Heading>
                  </HStack>
                  <Text lineHeight="tall" textAlign="center">
                    {establishmentData.location_highlights}
                  </Text>
                </Card>
              )}

              {/* Custom Message */}
              {establishmentData?.custom_message && (
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaStar} color="purple.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Special Message
                    </Heading>
                  </HStack>
                  <Text lineHeight="tall" textAlign="center" fontStyle="italic">
                    "{establishmentData.custom_message}"
                  </Text>
                </Card>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}

export default PublicEstablishmentProfile;
