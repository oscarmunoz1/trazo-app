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
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  Heading,
  Divider,
  Circle,
  Avatar,
  useToast,
  IconButton,
  Progress,
  useBreakpointValue,
  Center
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import {
  FaRegCheckCircle,
  FaRegDotCircle,
  FaSeedling,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBuilding,
  FaCertificate,
  FaLeaf,
  FaTractor,
  FaEdit,
  FaTrash,
  FaShare,
  FaEye,
  FaQrcode,
  FaDownload,
  FaClock,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaRegCommentDots,
  FaRegListAlt,
  FaChartLine,
  FaClipboardList,
  FaFlag
} from 'react-icons/fa';
import {
  MdLocationOn,
  MdBusiness,
  MdEco,
  MdMoreVert,
  MdTimeline,
  MdVerified,
  MdDateRange,
  MdNaturePeople,
  MdOutdoorGrill,
  MdHome
} from 'react-icons/md';
import { FiDownload } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Components
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import TimelineRow from 'components/Tables/TimelineRow';
import { useGetPublicHistoryQuery } from 'store/api/historyApi';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  ProductHeader,
  EstablishmentInfo,
  EnhancedProductTimeline
} from 'components/ProductDetail';

// Add interface for Redux state
interface RootState {
  company: {
    currentCompany: {
      establishments: any[];
    };
  };
}

function ProfileProduction() {
  const intl = useIntl();
  const titleColor = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const toast = useToast();
  const { establishmentId, productionId, parcelId } = useParams();
  const [establishment, setEstablishment] = useState<any>(null);
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  // Mobile-first responsive utilities
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const headerFontSize = useBreakpointValue({ base: 'xl', md: '3xl' });

  const establishments = useSelector(
    (state: RootState) => state.company.currentCompany?.establishments
  );
  const {
    data: historyData,
    isLoading,
    isError,
    isSuccess
  } = useGetPublicHistoryQuery(productionId || '', {
    skip: !productionId
  });

  useEffect(() => {
    let establishment: any;
    if (establishments) {
      establishment = establishments.filter(
        (establishment: any) => establishment.id.toString() === establishmentId
      )[0];
      setEstablishment(establishment);
    }
  }, [establishmentId, establishments]);

  // Generate QR code URL based on backend media serving
  const getQRCodeUrl = () => {
    // Use the QR code URL directly from the backend response
    return historyData?.qr_code || null;
  };

  const downloadQRCode = async () => {
    try {
      if (!historyData?.qr_code && !historyData?.history_scan) {
        toast({
          title: 'QR Code Not Available',
          description: 'No QR code data found for this production.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top-right'
        });
        return;
      }

      // Use the QR code URL from backend or fallback to generated URL
      const qrUrl =
        historyData?.qr_code ||
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/media/qr_codes/${
          historyData?.name || 'production'
        }-${historyData?.start_date?.split('T')[0] || 'date'}.png`;

      // Open QR code in new window for download
      window.open(qrUrl, '_blank');

      toast({
        title: 'QR Code Opened',
        description: 'QR code opened in new window. Right-click to save.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to open QR code. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${historyData?.product?.name || 'Production'} - Production Profile`,
        text: `Check out this sustainable production! #Trazo #SustainableAgriculture`,
        url: window.location.href
      });
      toast({
        title: 'Shared Successfully',
        description: 'Production profile shared successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Helper function for safe reputation access
  const safeReputation = historyData?.reputation || 0;

  // Format dates safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Map API events to TimelineEvent format for EnhancedProductTimeline
  const mapEventsToTimeline = (apiEvents: any[]) => {
    return apiEvents.map((event) => ({
      id: event.id.toString(),
      type: event.type || 'general',
      description: event.description || '',
      observation: event.observation || '',
      date: event.date,
      certified: true, // Assume all events are certified for now
      index: event.index || 0,
      // Map additional fields
      volume: event.volume ? parseFloat(event.volume) : undefined,
      concentration: event.concentration ? parseFloat(event.concentration) : undefined,
      area: event.area ? parseFloat(event.area) : undefined,
      equipment: event.commercial_name || undefined
    }));
  };

  if (isLoading) {
    return (
      <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
        <Box bg="linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)" pt="150px" pb="120px" px={4}>
          <Container maxW="6xl" mx="auto">
            <VStack spacing={6} textAlign="center">
              <Text>Loading production data...</Text>
            </VStack>
          </Container>
        </Box>
      </Flex>
    );
  }

  if (isError || !historyData) {
    return (
      <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
        <Container maxW="6xl" mx="auto" py={20}>
          <Card bg={bgColor} p={6}>
            <Text color="red.500" textAlign="center">
              Error loading production data. Please try again.
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
            {/* Production Badge */}
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
                <Icon as={FaSeedling} boxSize={4} />
                <Text fontWeight="medium">
                  {intl.formatMessage({ id: 'app.productionProfile' }) || 'Production Profile'}
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
                letterSpacing="-0.02em"
              >
                {historyData?.product?.name || historyData?.name || 'Loading...'}
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                fontWeight="normal"
                maxW={{ base: '90%', sm: '70%', lg: '60%' }}
                lineHeight="1.7"
                textAlign="center"
              >
                {`${formatDate(historyData?.start_date)} - ${formatDate(historyData?.finish_date)}`}
              </Text>
            </VStack>

            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full" maxW="2xl">
              <VStack>
                <Circle size="50px" bg="green.100" color="green.600">
                  <Icon as={FaSeedling} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {historyData?.product?.name ? 'Organic' : 'General'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Production Type
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="blue.100" color="blue.600">
                  <Icon as={MdOutdoorGrill} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    Outdoor
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Environment
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="purple.100" color="purple.600">
                  <Icon as={FaClipboardList} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {historyData?.events?.length || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Events
                  </Text>
                </VStack>
              </VStack>

              <VStack>
                <Circle size="50px" bg="orange.100" color="orange.600">
                  <Icon as={FaFlag} boxSize={6} />
                </Circle>
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    {historyData?.finish_date ? 'Finished' : 'Active'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Status
                  </Text>
                </VStack>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Main Content Container - Overlapping Card */}
      <Container maxW="7xl" mx="auto" px={containerPadding}>
        <Card
          mt="-80px"
          mb="60px"
          p={cardPadding}
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          borderRadius="2xl"
          bg={bgColor}
          position="relative"
          zIndex={10}
        >
          {/* Header with Actions */}
          <CardHeader mb="24px">
            <HStack justify="space-between" align="flex-start" mb={6}>
              <HStack spacing={3} flexWrap="wrap">
                <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                  {intl.formatMessage({ id: 'app.certified' })}
                </Badge>
                <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
                  Sustainable
                </Badge>
              </HStack>

              {/* Action Menu */}
              <Menu isOpen={isOpen1} onClose={onClose1}>
                <MenuButton
                  as={IconButton}
                  icon={<Icon as={MdMoreVert} />}
                  variant="ghost"
                  size="sm"
                  onClick={onOpen1}
                />
                <MenuList>
                  <MenuItem
                    icon={<Icon as={FaEdit} />}
                    onClick={() =>
                      navigate(
                        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/production/${productionId}/change`
                      )
                    }
                  >
                    {intl.formatMessage({ id: 'app.edit' })}
                  </MenuItem>
                  <MenuItem icon={<Icon as={FaQrcode} />} onClick={downloadQRCode}>
                    Download QR Code
                  </MenuItem>
                  <MenuItem icon={<Icon as={FaShare} />} onClick={handleShare}>
                    Share Production
                  </MenuItem>
                  <Divider />
                  <MenuItem icon={<Icon as={FaTrash} />} color="red.500" _hover={{ bg: 'red.50' }}>
                    {intl.formatMessage({ id: 'app.delete' })}
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            {/* Use ProductHeader component */}
            <ProductHeader
              productName={historyData?.product?.name || historyData?.name || 'Production'}
              companyName={historyData?.company || 'Unknown Company'}
              reputation={safeReputation}
              isUsdaVerified={false}
              industryPercentile={undefined}
            />
          </CardHeader>

          <CardBody p={0}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
              {/* Left Column */}
              <VStack spacing={6} align="stretch">
                {/* Image Gallery */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md" overflow="hidden">
                  <CardBody p={0}>
                    {historyData?.images && historyData.images.length > 0 ? (
                      <ImageCarousel imagesList={historyData.images} />
                    ) : (
                      <Box
                        bg="gray.100"
                        height="250px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <VStack spacing={2}>
                          <Icon as={FaSeedling} boxSize={12} color="gray.400" />
                          <Text color="gray.500">No images available</Text>
                        </VStack>
                      </Box>
                    )}
                  </CardBody>
                </Card>

                {/* Production Details */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md">
                  <CardHeader>
                    <HStack spacing={2} justify="center">
                      <Icon as={FaSeedling} color="green.500" boxSize={5} />
                      <Heading as="h3" size="md" color={textColor}>
                        Production Details
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={FaLeaf} color="green.500" />
                        <Text fontWeight="medium">Product:</Text>
                        <Text>{historyData?.product?.name}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaCertificate} color="blue.500" />
                        <Text fontWeight="medium">Type:</Text>
                        <Badge colorScheme="green" variant="subtle">
                          Sustainable Production
                        </Badge>
                      </HStack>
                      <HStack>
                        <Icon as={MdOutdoorGrill} color="purple.500" />
                        <Text fontWeight="medium">Environment:</Text>
                        <Text>Outdoor</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaCalendarAlt} color="blue.500" />
                        <Text fontWeight="medium">Start Date:</Text>
                        <Text>{formatDate(historyData?.start_date)}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FaFlag} color="orange.500" />
                        <Text fontWeight="medium">Finish Date:</Text>
                        <Text>{formatDate(historyData?.finish_date) || 'In Progress'}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Location Information */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md">
                  <CardHeader>
                    <HStack spacing={2} justify="center">
                      <Icon as={MdLocationOn} color="green.500" boxSize={5} />
                      <Heading as="h3" size="md" color={textColor}>
                        Location Information
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Icon as={FaBuilding} color="blue.500" />
                        <Text fontWeight="medium">Establishment:</Text>
                        <Link
                          color="blue.500"
                          onClick={() =>
                            navigate(`/admin/dashboard/establishment/${establishmentId}`)
                          }
                          cursor="pointer"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {historyData?.parcel?.establishment?.name || 'Unknown'}
                        </Link>
                      </HStack>
                      <HStack>
                        <Icon as={FaTractor} color="green.500" />
                        <Text fontWeight="medium">Parcel:</Text>
                        <Link
                          color="green.500"
                          onClick={() =>
                            navigate(
                              `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`
                            )
                          }
                          cursor="pointer"
                          _hover={{ textDecoration: 'underline' }}
                        >
                          {historyData?.parcel?.name || 'Unknown'}
                        </Link>
                      </HStack>
                      <HStack>
                        <Icon as={FaMapMarkerAlt} color="red.500" />
                        <Text fontWeight="medium">Location:</Text>
                        <Text>
                          {historyData?.parcel?.establishment?.location || 'Not specified'}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>

              {/* Right Column */}
              <VStack spacing={6} align="stretch">
                {/* QR Code Display Card */}
                <Card bg={bgColor} borderRadius="lg" boxShadow="md">
                  <CardHeader>
                    <HStack spacing={2} justify="center">
                      <Icon as={FaQrcode} color="green.500" boxSize={5} />
                      <Heading as="h3" size="md" color={textColor}>
                        QR Code
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4}>
                      <Center>
                        <Box
                          boxSize="200px"
                          bg="white"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="2px solid"
                          borderColor="gray.200"
                          overflow="hidden"
                        >
                          {historyData?.qr_code ? (
                            <Image
                              src={historyData.qr_code}
                              alt="Production QR Code"
                              boxSize="100%"
                              objectFit="contain"
                              onError={(e) => {
                                console.log('QR image failed to load:', historyData.qr_code);
                              }}
                            />
                          ) : (
                            <VStack spacing={2}>
                              <Icon as={FaQrcode} boxSize={12} color="gray.400" />
                              <Text fontSize="sm" color="gray.500" textAlign="center">
                                {historyData?.history_scan
                                  ? 'QR Code Generating...'
                                  : 'QR Code Not Available'}
                              </Text>
                            </VStack>
                          )}
                        </Box>
                      </Center>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {historyData?.qr_code
                          ? 'Scan this QR code to view production details'
                          : historyData?.history_scan
                          ? `Scan ID: #${historyData.history_scan} - QR code will appear when generated`
                          : 'QR code will be generated when production is published'}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="green"
                        leftIcon={<Icon as={FaDownload} />}
                        onClick={downloadQRCode}
                        variant={historyData?.qr_code ? 'solid' : 'outline'}
                        isDisabled={!historyData?.qr_code && !historyData?.history_scan}
                      >
                        {historyData?.qr_code ? 'Download QR Code' : 'Generate QR Code'}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Producer Information - Reuse EstablishmentInfo component */}
                {historyData?.parcel?.establishment && (
                  <EstablishmentInfo establishment={historyData.parcel.establishment} />
                )}
              </VStack>
            </SimpleGrid>

            {/* Events Timeline - Use Enhanced Timeline */}
            <Card bg={bgColor} borderRadius="lg" boxShadow="md" mb={6}>
              <CardHeader>
                <HStack spacing={2} justify="center">
                  <Icon as={MdTimeline} color="green.500" boxSize={5} />
                  <Heading as="h3" size="lg" color={textColor}>
                    Production Timeline
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                {historyData?.events && historyData.events.length > 0 ? (
                  <EnhancedProductTimeline events={mapEventsToTimeline(historyData.events)} />
                ) : (
                  <VStack spacing={3} py={8}>
                    <Icon as={MdTimeline} boxSize={16} color="gray.400" />
                    <Heading as="h4" size="md" color="gray.600">
                      No events recorded yet
                    </Heading>
                    <Text fontSize="sm" color="gray.400" textAlign="center">
                      Events will appear here as the production progresses
                    </Text>
                  </VStack>
                )}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </Container>
    </Flex>
  );
}

export default ProfileProduction;
