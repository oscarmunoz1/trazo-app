import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Circle,
  Icon,
  Heading,
  Text,
  Flex,
  Badge,
  Button,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { MdTimeline } from 'react-icons/md';
import {
  FaLeaf,
  FaCertificate,
  FaChartLine,
  FaCheckCircle,
  FaSeedling,
  FaLink,
  FaShieldAlt,
  FaUsers,
  FaLock,
  FaEye,
  FaClock,
  FaGlobe,
  FaTint,
  FaBug
} from 'react-icons/fa';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

// API imports
import { useGetCompleteSummaryQuery } from '../../../store/api/carbonApi';

// Modern components (keeping the ones you like)
import {
  ModernEducationalSection,
  ModernSidebar,
  UltraMobileProductionJourney,
  CompanyEstablishmentInfo,
  ParcelMapInfo,
  ProductDetailsSection,
  SimilarProducts
} from './components';

// Other components
import { ModernProductionJourney } from '../../../components/ProductDetail/ModernProductionJourney';
import { ProgressiveQRLoader } from './components/ProgressiveQRLoader';
import { usePointsStore } from '../../../store/pointsStore';
import USDACredibilityBadge from '../../../components/Carbon/USDACredibilityBadge';
import { CarbonScore } from '../../../components/CarbonScore';
import ImageCarousel from '../../../components/ImageCarousel/ImageCarousel';

// Educational modal content
const EducationModal = ({
  isOpen,
  onClose,
  topic
}: {
  isOpen: boolean;
  onClose: () => void;
  topic: string | null;
}) => {
  const getModalContent = () => {
    switch (topic) {
      case 'carbon_footprint':
        return {
          title: 'Carbon Footprint Scoring',
          content: (
            <VStack align="start" spacing={6}>
              <Text fontSize="lg" color="gray.700">
                <strong>Carbon scoring</strong> measures the total greenhouse gas emissions
                throughout the entire agricultural production lifecycle, from farm operations to
                your table.
              </Text>

              <Box>
                <Heading size="sm" mb={3} color="green.600">
                  How We Calculate Carbon Scores
                </Heading>
                <VStack align="start" spacing={3}>
                  <HStack align="start" spacing={3}>
                    <Circle size="8px" bg="green.500" mt={2} />
                    <Box>
                      <Text fontWeight="semibold">Farm Operations (40%)</Text>
                      <Text fontSize="sm" color="gray.600">
                        Energy use, equipment efficiency, soil management, and fertilizer
                        application
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="8px" bg="blue.500" mt={2} />
                    <Box>
                      <Text fontWeight="semibold">Transportation (25%)</Text>
                      <Text fontSize="sm" color="gray.600">
                        Distance traveled, shipping method, and logistics efficiency
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="8px" bg="purple.500" mt={2} />
                    <Box>
                      <Text fontWeight="semibold">Processing & Packaging (20%)</Text>
                      <Text fontSize="sm" color="gray.600">
                        Manufacturing energy, packaging materials, and waste reduction
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="8px" bg="orange.500" mt={2} />
                    <Box>
                      <Text fontWeight="semibold">Land Use & Soil Health (15%)</Text>
                      <Text fontSize="sm" color="gray.600">
                        Carbon sequestration, biodiversity preservation, and regenerative practices
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Heading size="sm" mb={3} color="green.600">
                  Score Interpretation
                </Heading>
                <SimpleGrid columns={1} spacing={2}>
                  <HStack>
                    <Badge colorScheme="green" variant="solid">
                      90-100
                    </Badge>
                    <Text fontSize="sm">Exceptional - Leading sustainability practices</Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme="green" variant="outline">
                      70-89
                    </Badge>
                    <Text fontSize="sm">Good - Above average environmental performance</Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme="yellow" variant="solid">
                      50-69
                    </Badge>
                    <Text fontSize="sm">Fair - Meeting basic sustainability standards</Text>
                  </HStack>
                  <HStack>
                    <Badge colorScheme="red" variant="solid">
                      Below 50
                    </Badge>
                    <Text fontSize="sm">Needs improvement - High environmental impact</Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              <Box
                bg="green.50"
                p={4}
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="green.500">
                <Text fontSize="sm" fontWeight="medium">
                  💡 <strong>Did you know?</strong> Choosing products with higher carbon scores can
                  reduce your personal carbon footprint by up to 30% annually.
                </Text>
              </Box>
            </VStack>
          )
        };
      case 'usda_verification':
        return {
          title: 'USDA Verification Standards',
          content: (
            <VStack align="start" spacing={6}>
              <Text fontSize="lg" color="gray.700">
                <strong>USDA verification</strong> is a rigorous certification process that ensures
                agricultural products meet the highest federal standards for quality, safety, and
                environmental responsibility.
              </Text>

              <Box>
                <Heading size="sm" mb={3} color="blue.600">
                  Verification Process
                </Heading>
                <VStack align="start" spacing={4}>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="blue.100">
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        1
                      </Text>
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">Application & Documentation</Text>
                      <Text fontSize="sm" color="gray.600">
                        Farms submit detailed records of practices, inputs, and production methods
                        for the past 3 years
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="blue.100">
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        2
                      </Text>
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">On-Site Inspection</Text>
                      <Text fontSize="sm" color="gray.600">
                        Certified inspectors conduct thorough field evaluations and interview farm
                        personnel
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="blue.100">
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        3
                      </Text>
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">Laboratory Testing</Text>
                      <Text fontSize="sm" color="gray.600">
                        Scientific analysis of soil, water, and produce samples for contaminants and
                        quality markers
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="blue.100">
                      <Text fontSize="sm" fontWeight="bold" color="blue.600">
                        4
                      </Text>
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">Certification Decision</Text>
                      <Text fontSize="sm" color="gray.600">
                        Independent review board evaluates all evidence and grants certification
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Heading size="sm" mb={3} color="blue.600">
                  What USDA Verification Guarantees
                </Heading>
                <SimpleGrid columns={1} spacing={3}>
                  <HStack align="start">
                    <Icon as={FaCheckCircle} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Product Safety:</strong> Free from harmful chemicals and contaminants
                    </Text>
                  </HStack>
                  <HStack align="start">
                    <Icon as={FaCheckCircle} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Environmental Protection:</strong> Sustainable farming practices that
                      protect ecosystems
                    </Text>
                  </HStack>
                  <HStack align="start">
                    <Icon as={FaCheckCircle} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Worker Safety:</strong> Fair labor practices and safe working
                      conditions
                    </Text>
                  </HStack>
                  <HStack align="start">
                    <Icon as={FaCheckCircle} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Traceability:</strong> Complete supply chain documentation and
                      accountability
                    </Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              <Box
                bg="blue.50"
                p={4}
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="blue.500">
                <Text fontSize="sm" fontWeight="medium">
                  🏛️ <strong>Government Backed:</strong> USDA verification is backed by federal
                  oversight and carries legal weight, ensuring the highest standards of
                  accountability.
                </Text>
              </Box>
            </VStack>
          )
        };
      case 'blockchain_verification':
        return {
          title: 'Blockchain Data Verification',
          content: (
            <VStack align="start" spacing={6}>
              <Text fontSize="lg" color="gray.700">
                <strong>Blockchain technology</strong> creates an immutable, transparent ledger that
                records every step of the agricultural supply chain, from seed to shelf.
              </Text>

              <Box>
                <Heading size="sm" mb={3} color="purple.600">
                  How Blockchain Works in Agriculture
                </Heading>
                <VStack align="start" spacing={4}>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="purple.100">
                      <Icon as={FaSeedling} color="purple.600" boxSize={4} />
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">Farm Data Recording</Text>
                      <Text fontSize="sm" color="gray.600">
                        Every farming activity, input application, and harvest is automatically
                        recorded with timestamps and GPS coordinates
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="purple.100">
                      <Icon as={FaLink} color="purple.600" boxSize={4} />
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">Supply Chain Tracking</Text>
                      <Text fontSize="sm" color="gray.600">
                        Products are tracked through processing, packaging, and distribution with
                        cryptographic verification
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="purple.100">
                      <Icon as={FaShieldAlt} color="purple.600" boxSize={4} />
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">Immutable Records</Text>
                      <Text fontSize="sm" color="gray.600">
                        Once data is recorded, it cannot be altered or deleted, ensuring permanent
                        transparency
                      </Text>
                    </Box>
                  </HStack>
                  <HStack align="start" spacing={3}>
                    <Circle size="30px" bg="purple.100">
                      <Icon as={FaUsers} color="purple.600" boxSize={4} />
                    </Circle>
                    <Box>
                      <Text fontWeight="semibold">Consumer Access</Text>
                      <Text fontSize="sm" color="gray.600">
                        You can view the complete history of your product through secure,
                        decentralized verification
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Heading size="sm" mb={3} color="purple.600">
                  Benefits of Blockchain Verification
                </Heading>
                <SimpleGrid columns={1} spacing={3}>
                  <HStack align="start">
                    <Icon as={FaLock} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Tamper-Proof:</strong> Cryptographic security prevents data
                      manipulation
                    </Text>
                  </HStack>
                  <HStack align="start">
                    <Icon as={FaEye} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Full Transparency:</strong> Complete visibility into every step of
                      production
                    </Text>
                  </HStack>
                  <HStack align="start">
                    <Icon as={FaClock} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Real-Time Updates:</strong> Instant verification of sustainability
                      claims
                    </Text>
                  </HStack>
                  <HStack align="start">
                    <Icon as={FaGlobe} color="green.500" mt={1} />
                    <Text fontSize="sm">
                      <strong>Global Standard:</strong> Internationally recognized verification
                      system
                    </Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              <Box
                bg="purple.50"
                p={4}
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="purple.500">
                <Text fontSize="sm" fontWeight="medium">
                  🔗 <strong>Trust Through Technology:</strong> Blockchain eliminates the need to
                  "trust" claims—you can verify everything independently through the decentralized
                  network.
                </Text>
              </Box>
            </VStack>
          )
        };
      case 'sustainable_practices':
        return {
          title: 'Sustainable Farm Practices',
          content: (
            <VStack align="start" spacing={6}>
              <Text fontSize="lg" color="gray.700">
                <strong>Sustainable farming</strong> integrates environmental stewardship, economic
                viability, and social responsibility to create resilient agricultural systems that
                protect our planet for future generations.
              </Text>

              <Box>
                <Heading size="sm" mb={3} color="green.600">
                  Core Sustainable Practices
                </Heading>
                <VStack align="start" spacing={4}>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaTint} color="blue.500" />
                      <Text fontWeight="semibold">Water Stewardship</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" pl={6}>
                      Precision irrigation, rainwater harvesting, and wetland preservation to
                      protect this precious resource
                    </Text>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaSeedling} color="green.500" />
                      <Text fontWeight="semibold">Soil Health Management</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" pl={6}>
                      Cover cropping, composting, reduced tillage, and crop rotation to build
                      living, fertile soil
                    </Text>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaBug} color="orange.500" />
                      <Text fontWeight="semibold">Integrated Pest Management</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" pl={6}>
                      Biological controls, beneficial insects, and targeted treatments to minimize
                      chemical inputs
                    </Text>
                  </Box>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={FaLeaf} color="purple.500" />
                      <Text fontWeight="semibold">Biodiversity Conservation</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" pl={6}>
                      Habitat corridors, pollinator gardens, and diverse crop varieties to support
                      ecosystem health
                    </Text>
                  </Box>
                </VStack>
              </Box>

              <Box>
                <Heading size="sm" mb={3} color="green.600">
                  Environmental Impact
                </Heading>
                <SimpleGrid columns={2} spacing={4}>
                  <VStack align="center" bg="green.50" p={3} borderRadius="md">
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                      75%
                    </Text>
                    <Text fontSize="xs" textAlign="center">
                      Reduction in synthetic pesticide use
                    </Text>
                  </VStack>
                  <VStack align="center" bg="blue.50" p={3} borderRadius="md">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      40%
                    </Text>
                    <Text fontSize="xs" textAlign="center">
                      Less water consumption
                    </Text>
                  </VStack>
                  <VStack align="center" bg="purple.50" p={3} borderRadius="md">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      60%
                    </Text>
                    <Text fontSize="xs" textAlign="center">
                      Increase in soil carbon storage
                    </Text>
                  </VStack>
                  <VStack align="center" bg="orange.50" p={3} borderRadius="md">
                    <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                      3x
                    </Text>
                    <Text fontSize="xs" textAlign="center">
                      More biodiversity on farms
                    </Text>
                  </VStack>
                </SimpleGrid>
              </Box>

              <Box
                bg="green.50"
                p={4}
                borderRadius="md"
                borderLeft="4px solid"
                borderLeftColor="green.500">
                <Text fontSize="sm" fontWeight="medium">
                  🌱 <strong>Regenerative Impact:</strong> These practices don't just maintain the
                  environment—they actively improve it, leaving the land healthier for future
                  generations.
                </Text>
              </Box>
            </VStack>
          )
        };
      default:
        return {
          title: 'Learn More',
          content: <Text>Educational content coming soon!</Text>
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{modalContent.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{modalContent.content}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

function ProductDetail() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const intl = useIntl();
  const pointsStore = usePointsStore();

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const headerFontSize = { base: '2xl', md: '3xl', lg: '4xl' };

  // API query
  const {
    data: completeData,
    error: completeError,
    isLoading: isCompleteLoading
  } = useGetCompleteSummaryQuery(productionId || '', {
    skip: !productionId
  });

  // Educational modal
  const {
    isOpen: isEducationOpen,
    onOpen: onEducationOpen,
    onClose: onEducationClose
  } = useDisclosure();
  const [educationTopic, setEducationTopic] = useState<string | null>(null);

  const handleEducationOpen = (topic: string) => {
    setEducationTopic(topic);
    onEducationOpen();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${completeData?.farmer?.name || 'Product'}'s Sustainable Product`,
        text: `${completeData?.carbonScore}/100 carbon score! #Trazo`,
        url: window.location.href
      });
      pointsStore.addPoints(3);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Calculate reputation for stars
  const safeReputation = Math.max(0, Math.min(5, (completeData as any)?.reputation || 4.2));

  // Check if we have product images
  const productImages = (completeData as any)?.images || [];
  const hasImages = productImages.length > 0;

  // Loading state
  if (isCompleteLoading) {
    return <ProgressiveQRLoader loadingStage="scanning" onStageComplete={() => {}} />;
  }

  // Error state
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

  // No data state
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
      {/* Welcome Header Section */}
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
                    'Rastreador de Sostenibilidad'}
                </Text>
              </HStack>
            </Badge>

            {/* Welcome Message */}
            <Heading as="h1" size="2xl" fontWeight="bold" color="green.600" textAlign="center">
              {intl.formatMessage({ id: 'app.welcome' }) || '¡Bienvenido!'}
            </Heading>

            <Text fontSize="lg" color="gray.600" maxW="2xl" textAlign="center">
              {intl.formatMessage({ id: 'app.welcomeMessage' }) ||
                'Aquí puedes encontrar toda la información sobre el producto escaneado.'}
            </Text>

            {/* Metrics Cards */}
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={6} w="full" maxW="600px" mt={8}>
              {/* Carbon Score */}
              <VStack spacing={3}>
                <Circle size="60px" bg="green.100">
                  <Icon as={FaLeaf} color="green.600" boxSize={6} />
                </Circle>
                <Heading size="xl" color={textColor}>
                  {completeData?.carbonScore || 50}
                </Heading>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Carbon Score
                </Text>
              </VStack>

              {/* Verified Events */}
              <VStack spacing={3}>
                <Circle size="60px" bg="blue.100">
                  <Icon as={FaCertificate} color="blue.600" boxSize={6} />
                </Circle>
                <Heading size="xl" color={textColor}>
                  {(() => {
                    const events = completeData?.timeline || completeData?.events || [];
                    return Array.isArray(events) ? events.filter((e) => e.certified).length : 0;
                  })()}
                </Heading>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Verified Events
                </Text>
              </VStack>

              {/* Eco Ranking */}
              <VStack spacing={3}>
                <Circle size="60px" bg="purple.100">
                  <Icon as={FaChartLine} color="purple.600" boxSize={6} />
                </Circle>
                <Heading size="xl" color={textColor}>
                  {completeData?.industryPercentile || 45}%
                </Heading>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Eco Ranking
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Main Content Card */}
      <Flex
        alignItems="center"
        justifyContent="center"
        mb="60px"
        mt="-80px"
        position="relative"
        zIndex={10}>
        <Card
          w={{ sm: '95%', md: '90%', lg: '85%' }}
          p={{ sm: '0px', md: '32px', lg: '48px' }}
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          borderRadius="2xl"
          bg={useColorModeValue('white', 'gray.800')}>
          <CardHeader mb="24px">
            <HStack spacing={3} flexWrap="wrap">
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                {intl.formatMessage({ id: 'app.verified' }) || 'Verificado'}
              </Badge>

              {/* Enhanced USDA Credibility Badge */}
              {(completeData as any)?.establishment?.id && (
                <VStack spacing={2}>
                  <USDACredibilityBadge
                    establishmentId={(completeData as any).establishment.id}
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
                {(completeData as any)?.farmer?.name ||
                  (completeData as any)?.product?.name ||
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
              {(completeData as any)?.farmer?.location ||
                (completeData as any)?.parcel?.location ||
                'Farm Location'}
            </Text>

            {completeData &&
              completeData.industryPercentile !== undefined &&
              completeData.industryPercentile > 0 && (
                <HStack mt={2}>
                  <Icon as={FaLeaf} color="green.500" />
                  <Text color="green.500" fontWeight="medium">
                    Greener than {completeData.industryPercentile}% of similar products
                  </Text>
                </HStack>
              )}
          </CardHeader>

          <CardBody>
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={10}>
              <Box>
                {/* Product Images */}
                <Box mb={6}>{hasImages && <ImageCarousel imagesList={productImages} />}</Box>

                {/* Carbon Score */}
                {/* <Box borderRadius="lg" mb={6} bg="white" p={5} boxShadow="md"> */}
                <CarbonScore
                  score={completeData?.carbonScore || 0}
                  footprint={completeData?.netFootprint || 0}
                  industryPercentile={completeData?.industryPercentile || 0}
                  relatableFootprint={
                    completeData?.relatableFootprint ||
                    intl.formatMessage({ id: 'app.calculatingFootprint' }) ||
                    'Calculating footprint...'
                  }
                />
                {/* </Box> */}
              </Box>

              {/* Right Column - Modern Sidebar */}
              <ModernSidebar
                isAuthenticated={false}
                productName={completeData?.farmer?.name || completeData?.product?.name}
                carbonScore={completeData?.carbonScore || 0}
                onAuthPrompt={() => navigate('/auth/signin')}
                onNavigateToAchievements={() => navigate('/achievements')}
              />
            </SimpleGrid>

            {/* Modern Educational Section */}
            <ModernEducationalSection onEducationOpen={handleEducationOpen} />

            {/* Mobile-Optimized Production Journey */}
            <Card bg={useColorModeValue('white', 'gray.800')} shadow="lg" borderRadius="xl" mt={8}>
              <CardBody p={{ base: 4, md: 6 }}>
                {(() => {
                  const events = completeData?.timeline || completeData?.events || [];

                  if (Array.isArray(events) && events.length > 0) {
                    const timelineEvents = events.map((event, index) => ({
                      id: event.id?.toString() || `event_${index}`,
                      type: event.type || 'general',
                      description: event.description || event.observation || 'Event recorded',
                      observation: event.observation || '',
                      date: event.date || new Date().toISOString(),
                      certified: event.certified || false,
                      index: index,
                      volume: event.volume?.toString(),
                      concentration: event.concentration?.toString(),
                      area: event.area?.toString(),
                      equipment: event.equipment
                    }));
                    return <UltraMobileProductionJourney events={timelineEvents} />;
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

            {/* Additional Information Sections */}
            <VStack spacing={8} mt={8}>
              {/* Company and Establishment Information */}
              <CompanyEstablishmentInfo
                companyData={{
                  // Use company data from the enhanced API response
                  id: (completeData as any)?.farmer?.company?.id,
                  name: (completeData as any)?.farmer?.company?.name || 'Company Information',
                  description: (completeData as any)?.farmer?.company?.description,
                  address: (completeData as any)?.farmer?.company?.address,
                  city: (completeData as any)?.farmer?.company?.city,
                  state: (completeData as any)?.farmer?.company?.state,
                  country: (completeData as any)?.farmer?.company?.country,
                  phone: (completeData as any)?.farmer?.company?.phone,
                  email: (completeData as any)?.farmer?.company?.email,
                  website: (completeData as any)?.farmer?.company?.website,
                  facebook: (completeData as any)?.farmer?.company?.facebook,
                  instagram: (completeData as any)?.farmer?.company?.instagram,
                  logo: (completeData as any)?.farmer?.company?.logo,
                  fiscal_id: (completeData as any)?.farmer?.company?.fiscal_id,
                  contact_email: (completeData as any)?.farmer?.company?.contact_email
                }}
                establishmentData={{
                  // Use complete farmer/establishment data from enhanced API response
                  id: (completeData as any)?.farmer?.id,
                  name: (completeData as any)?.farmer?.name,
                  description: (completeData as any)?.farmer?.description,
                  address: (completeData as any)?.farmer?.address,
                  city: (completeData as any)?.farmer?.city,
                  state: (completeData as any)?.farmer?.state,
                  country: (completeData as any)?.farmer?.country,
                  zone: (completeData as any)?.farmer?.zone,
                  latitude: (completeData as any)?.farmer?.latitude,
                  longitude: (completeData as any)?.farmer?.longitude,
                  contact_person: (completeData as any)?.farmer?.contact_person,
                  contact_phone: (completeData as any)?.farmer?.contact_phone,
                  contact_email: (completeData as any)?.farmer?.contact_email,
                  email: (completeData as any)?.farmer?.email,
                  phone: (completeData as any)?.farmer?.phone,
                  zip_code: (completeData as any)?.farmer?.zip_code,
                  facebook: (completeData as any)?.farmer?.facebook,
                  instagram: (completeData as any)?.farmer?.instagram,
                  about: (completeData as any)?.farmer?.about,
                  main_activities: (completeData as any)?.farmer?.main_activities,
                  location_highlights: (completeData as any)?.farmer?.location_highlights,
                  custom_message: (completeData as any)?.farmer?.custom_message,
                  is_active: (completeData as any)?.farmer?.is_active,
                  crops_grown: (completeData as any)?.farmer?.crops_grown,
                  sustainability_practices: (completeData as any)?.farmer?.sustainability_practices,
                  employee_count: (completeData as any)?.farmer?.employee_count,
                  total_acreage: (completeData as any)?.farmer?.total_acreage,
                  year_established: (completeData as any)?.farmer?.year_established,
                  establishment_type: (completeData as any)?.farmer?.establishment_type,
                  farming_method: (completeData as any)?.farmer?.farming_method,
                  location: (completeData as any)?.farmer?.location,
                  rating: safeReputation,
                  certifications: (completeData as any)?.farmer?.certifications || []
                }}
              />

              {/* Parcel Information with Map */}
              <ParcelMapInfo
                parcelData={{
                  id: (completeData as any)?.parcel?.id?.toString(),
                  name: (completeData as any)?.parcel?.name,
                  location: (completeData as any)?.farmer?.location,
                  coordinates:
                    (completeData as any)?.farmer?.latitude &&
                    (completeData as any)?.farmer?.longitude
                      ? {
                          latitude: (completeData as any)?.farmer?.latitude,
                          longitude: (completeData as any)?.farmer?.longitude
                        }
                      : undefined,
                  area: (completeData as any)?.parcel?.area,
                  areaUnit: 'hectares',
                  soilType: (completeData as any)?.parcel?.soilType,
                  cropType: (completeData as any)?.product?.name,
                  plantingDate: (completeData as any)?.start_date,
                  harvestDate: (completeData as any)?.finish_date,
                  elevation: (completeData as any)?.parcel?.elevation,
                  slope: (completeData as any)?.parcel?.slope,
                  irrigationType: (completeData as any)?.parcel?.irrigationType,
                  polygon: (completeData as any)?.parcel?.polygon,
                  map_metadata: (completeData as any)?.parcel?.map_metadata,
                  // Additional fields for modal
                  description: (completeData as any)?.parcel?.description,
                  certification_type: (completeData as any)?.parcel?.certification_type,
                  certified: (completeData as any)?.parcel?.certified,
                  unique_code: (completeData as any)?.parcel?.unique_code,
                  contact_person:
                    (completeData as any)?.parcel?.contact_person ||
                    (completeData as any)?.farmer?.contact_person,
                  contact_phone:
                    (completeData as any)?.parcel?.contact_phone ||
                    (completeData as any)?.farmer?.contact_phone,
                  contact_email:
                    (completeData as any)?.parcel?.contact_email ||
                    (completeData as any)?.farmer?.contact_email,
                  current_history: (completeData as any)?.parcel?.current_history,
                  establishment: {
                    id: (completeData as any)?.farmer?.id,
                    name: (completeData as any)?.farmer?.name || 'Farm',
                    description: (completeData as any)?.farmer?.description,
                    location: (completeData as any)?.farmer?.location || 'Location not specified',
                    photo: (completeData as any)?.farmer?.photo
                  }
                }}
              />

              {/* Similar Products */}
              <SimilarProducts
                currentProductId={productionId}
                products={
                  (completeData as any)?.similar_products ||
                  (completeData as any)?.similarHistories ||
                  []
                }
              />
            </VStack>
          </CardBody>
        </Card>
      </Flex>

      {/* Education Modal */}
      <EducationModal isOpen={isEducationOpen} onClose={onEducationClose} topic={educationTopic} />
    </Flex>
  );
}

export default ProductDetail;
