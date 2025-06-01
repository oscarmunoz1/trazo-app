// Chakra imports
import {
  Box,
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
  Badge,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  IconButton
} from '@chakra-ui/react';
import {
  FaMapMarkedAlt,
  FaTractor,
  FaEdit,
  FaTrash,
  FaShare,
  FaEye,
  FaSeedling,
  FaCertificate,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaMapMarkerAlt,
  FaGlobe,
  FaBuilding,
  FaRegCommentDots,
  FaRegListAlt,
  FaCalendar
} from 'react-icons/fa';
import { MdLocationOn, MdBusiness, MdEco, MdMoreVert } from 'react-icons/md';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import { useGetParcelQuery } from 'store/api/productApi';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import defaultParcelImage from 'assets/img/BgMusicCard.png';

function ProfileParcel() {
  const intl = useIntl();
  const titleColor = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const toast = useToast();
  const { establishmentId, parcelId } = useParams();
  const [establishment, setEstablishment] = useState(null);

  // Mobile-first responsive utilities
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const headerFontSize = useBreakpointValue({ base: 'xl', md: '3xl' });

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const currentParcel = useSelector((state) => state.product.currentParcel);

  const {
    data: parcelData,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetParcelQuery(
    { companyId: currentCompany?.id, establishmentId, parcelId },
    {
      skip:
        parcelId === undefined ||
        currentParcel?.id === parcelId ||
        currentCompany?.id === undefined ||
        !establishmentId
    }
  );

  useEffect(() => {
    let establishment;
    if (establishments) {
      establishment = establishments.filter(
        (establishment) => establishment.id.toString() === establishmentId
      )[0];
      setEstablishment(establishment);
    }
  }, [establishmentId, establishments]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${parcelData?.name} - Parcel Profile`,
        text: `Check out this sustainable parcel! #Trazo #SustainableAgriculture`,
        url: window.location.href
      });
      toast({
        title: 'Shared Successfully',
        description: 'Parcel profile shared successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
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
              <Text>Loading parcel data...</Text>
            </VStack>
          </Container>
        </Box>
      </Flex>
    );
  }

  if (error || !parcelData) {
    return (
      <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
        <Container maxW="6xl" mx="auto" py={20}>
          <Card bg={bgColor} p={6}>
            <Text color="red.500" textAlign="center">
              Error loading parcel data. Please try again.
            </Text>
          </Card>
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
            {/* Parcel Badge */}
            <Badge
              colorScheme="green"
              variant="subtle"
              fontSize="sm"
              px={4}
              py={2}
              borderRadius="full"
              textTransform="none">
              <HStack spacing={2}>
                <Icon as={FaTractor} boxSize={4} />
                <Text fontWeight="medium">
                  {intl.formatMessage({ id: 'app.parcelProfile' }) || 'Parcel Profile'}
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
                {parcelData?.name || 'Loading...'}
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                fontWeight="normal"
                maxW={{ base: '90%', sm: '70%', lg: '60%' }}
                lineHeight="1.7"
                textAlign="center">
                {establishment?.name || 'Sustainable Agriculture'}
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
                    {parcelData?.area || '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Acres
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="blue.100" color="blue.600">
                  <Icon as={FaSeedling} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {parcelData?.crop_type || '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Crop Type
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="purple.100" color="purple.600">
                  <Icon as={MdEco} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {parcelData?.soil_type || '--'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Soil Type
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="orange.100" color="orange.600">
                  <Icon as={FaCertificate} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {parcelData?.certified ? 'Yes' : 'No'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Certified
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
          {/* Header with Actions */}
          <CardHeader mb="24px">
            <HStack spacing={3}>
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                {intl.formatMessage({ id: 'app.active' }) || 'Active'}
              </Badge>
              {parcelData?.certified && (
                <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                  Certified
                </Badge>
              )}
            </HStack>
            <HStack mt={4} spacing={4} align="center" justify="space-between">
              <Heading color={textColor} fontSize={headerFontSize} fontWeight="bold">
                {intl.formatMessage({ id: 'app.parcelInformation' }) || 'Parcel Information'}
              </Heading>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<Icon as={MdMoreVert} />}
                  variant="ghost"
                  colorScheme="gray"
                  size="lg"
                />
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/change`
                      )
                    }
                    icon={<FaEdit />}>
                    <Text fontSize="sm" fontWeight="500">
                      {intl.formatMessage({ id: 'app.edit' }) || 'Edit'}
                    </Text>
                  </MenuItem>
                  <MenuItem icon={<FaShare />} onClick={handleShare}>
                    <Text fontSize="sm" fontWeight="500">
                      Share
                    </Text>
                  </MenuItem>
                  <MenuItem icon={<FaTrash />} color="red.500">
                    <Text fontSize="sm" fontWeight="500">
                      {intl.formatMessage({ id: 'app.delete' }) || 'Delete'}
                    </Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </CardHeader>

          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
              {/* Left Column */}
              <Box>
                {/* Image Gallery */}
                <Box mb={6}>
                  <ImageCarousel
                    imagesList={
                      parcelData?.images?.length > 0 ? parcelData.images : [defaultParcelImage]
                    }
                  />
                </Box>

                {/* Basic Information */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaBuilding} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Basic Information
                    </Heading>
                  </HStack>
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Icon as={FaTractor} color="green.500" />
                      <Text fontWeight="medium">Name:</Text>
                      <Text>{parcelData?.name}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaMapMarkedAlt} color="blue.500" />
                      <Text fontWeight="medium">Area:</Text>
                      <Text>{parcelData?.area} acres</Text>
                    </HStack>
                    {parcelData?.unique_code && (
                      <HStack>
                        <Icon as={FaRegListAlt} color="purple.500" />
                        <Text fontWeight="medium">Code:</Text>
                        <Text>{parcelData.unique_code}</Text>
                      </HStack>
                    )}
                    {parcelData?.crop_type && (
                      <HStack>
                        <Icon as={FaSeedling} color="green.500" />
                        <Text fontWeight="medium">Crop Type:</Text>
                        <Text>{parcelData.crop_type}</Text>
                      </HStack>
                    )}
                    {parcelData?.soil_type && (
                      <HStack>
                        <Icon as={MdEco} color="brown.500" />
                        <Text fontWeight="medium">Soil Type:</Text>
                        <Text>{parcelData.soil_type}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Card>

                {/* Contact Information */}
                {(parcelData?.contact_person ||
                  parcelData?.contact_email ||
                  parcelData?.contact_phone) && (
                  <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                    <HStack spacing={2} justify="center" mb={4}>
                      <Icon as={FaPhone} color="green.500" boxSize={5} />
                      <Heading as="h3" size="md" color={textColor}>
                        Contact Information
                      </Heading>
                    </HStack>
                    <VStack spacing={3} align="stretch">
                      {parcelData?.contact_person && (
                        <HStack>
                          <Icon as={FaUsers} color="purple.500" />
                          <Text fontWeight="medium">Contact Person:</Text>
                          <Text>{parcelData.contact_person}</Text>
                        </HStack>
                      )}
                      {parcelData?.contact_email && (
                        <HStack>
                          <Icon as={FaEnvelope} color="blue.500" />
                          <Text fontWeight="medium">Email:</Text>
                          <Link color="blue.500" href={`mailto:${parcelData.contact_email}`}>
                            {parcelData.contact_email}
                          </Link>
                        </HStack>
                      )}
                      {parcelData?.contact_phone && (
                        <HStack>
                          <Icon as={FaPhone} color="green.500" />
                          <Text fontWeight="medium">Phone:</Text>
                          <Link color="green.500" href={`tel:${parcelData.contact_phone}`}>
                            {parcelData.contact_phone}
                          </Link>
                        </HStack>
                      )}
                    </VStack>
                  </Card>
                )}
              </Box>

              {/* Right Column */}
              <Box>
                {/* Location Information */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={MdLocationOn} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Location Details
                    </Heading>
                  </HStack>
                  <VStack spacing={3} align="stretch">
                    {parcelData?.address && (
                      <HStack>
                        <Icon as={FaMapMarkerAlt} color="red.500" />
                        <Text fontWeight="medium">Address:</Text>
                        <Text>{parcelData.address}</Text>
                      </HStack>
                    )}
                    {establishment?.city && (
                      <HStack>
                        <Icon as={MdBusiness} color="blue.500" />
                        <Text fontWeight="medium">City:</Text>
                        <Text>{establishment.city}</Text>
                      </HStack>
                    )}
                    {establishment?.state && (
                      <HStack>
                        <Icon as={MdBusiness} color="blue.500" />
                        <Text fontWeight="medium">State:</Text>
                        <Text>{establishment.state}</Text>
                      </HStack>
                    )}
                    {establishment?.country && (
                      <HStack>
                        <Icon as={FaGlobe} color="green.500" />
                        <Text fontWeight="medium">Country:</Text>
                        <Text>{establishment.country}</Text>
                      </HStack>
                    )}
                    {establishment?.zone && (
                      <HStack>
                        <Icon as={MdLocationOn} color="orange.500" />
                        <Text fontWeight="medium">Zone:</Text>
                        <Text>{establishment.zone}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Card>

                {/* Certification Information */}
                {(parcelData?.certified || parcelData?.certification_type) && (
                  <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                    <HStack spacing={2} justify="center" mb={4}>
                      <Icon as={FaCertificate} color="green.500" boxSize={5} />
                      <Heading as="h3" size="md" color={textColor}>
                        Certification
                      </Heading>
                    </HStack>
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon
                          as={FaCertificate}
                          color={parcelData?.certified ? 'green.500' : 'gray.500'}
                        />
                        <Text fontWeight="medium">Status:</Text>
                        <Badge colorScheme={parcelData?.certified ? 'green' : 'gray'}>
                          {parcelData?.certified ? 'Certified' : 'Not Certified'}
                        </Badge>
                      </HStack>
                      {parcelData?.certification_type && (
                        <HStack>
                          <Icon as={FaCertificate} color="blue.500" />
                          <Text fontWeight="medium">Type:</Text>
                          <Text>{parcelData.certification_type}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </Card>
                )}

                {/* Company Information */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaBuilding} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Company & Establishment
                    </Heading>
                  </HStack>
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Icon as={FaBuilding} color="blue.500" />
                      <Text fontWeight="medium">Company:</Text>
                      <Text>{currentCompany?.name}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaTractor} color="green.500" />
                      <Text fontWeight="medium">Establishment:</Text>
                      <Text>{establishment?.name}</Text>
                    </HStack>
                  </VStack>
                </Card>
              </Box>
            </SimpleGrid>

            {/* Description Section */}
            {parcelData?.description && (
              <VStack spacing={6} align="stretch">
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
                  <HStack spacing={2} justify="center" mb={4}>
                    <Icon as={FaRegCommentDots} color="green.500" boxSize={5} />
                    <Heading as="h3" size="md" color={textColor}>
                      Description
                    </Heading>
                  </HStack>
                  <Box>
                    <HTMLRenderer htmlString={parcelData.description} />
                  </Box>
                </Card>
              </VStack>
            )}
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}

export default ProfileParcel;
