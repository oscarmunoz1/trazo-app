import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Icon,
  Image,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  Flex,
  Link,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Avatar,
  Button,
  useBreakpointValue,
  Progress,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import {
  FaRuler,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaCalendarAlt,
  FaCertificate,
  FaLeaf,
  FaSeedling,
  FaTractor,
  FaAward,
  FaGlobe,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTree,
  FaWater,
  FaRecycle,
  FaShieldAlt,
  FaLayerGroup,
  FaCompass,
  FaExpand,
  FaMapSigns,
  FaFlask,
  FaThermometerHalf,
  FaEye
} from 'react-icons/fa';
// Import the real map component from Parcel Dashboard
// @ts-ignore - CardWithMap is a JSX component without TypeScript declarations
import CardWithMap from '../../../Dashboard/Parcel/components/CardWithMap.jsx';

interface ParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelData: {
    id: string | number;
    name: string;
    description?: string;
    area: number;
    certified?: boolean;
    polygon?: any;
    map_metadata?: {
      center?: [number, number];
      zoom?: number;
    };
    soil_type?: string;
    unique_code?: string;
    certification_type?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    establishment?: {
      name: string;
      location: string;
    };
    current_history?: {
      id: string | number;
      name: string;
      start_date: string;
      finish_date?: string;
      crop_type?: string;
    };
    productions_completed?: number;
    total_productions?: number;
    images?: string[];
  };
}

export const ParcelModal: React.FC<ParcelModalProps> = ({ isOpen, onClose, parcelData }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const modalSize = useBreakpointValue({ base: 'full', md: 'xl', lg: '4xl' });

  const getCertificationColor = (certified: boolean) => {
    return certified ? 'green' : 'gray';
  };

  const getSoilTypeIcon = (soilType: string) => {
    switch (soilType?.toLowerCase()) {
      case 'clay':
        return FaFlask;
      case 'sandy':
        return FaLayerGroup;
      case 'loam':
        return FaSeedling;
      default:
        return FaLayerGroup;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize} scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="xl" maxH="90vh">
        <ModalHeader p={6} pb={4} borderBottom="1px" borderColor={borderColor}>
          <HStack spacing={4}>
            <Box p={3} borderRadius="lg" bg={useColorModeValue('green.50', 'green.900')}>
              <Icon as={FaRuler} boxSize={6} color={accentColor} />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="lg" color={textColor}>
                {parcelData.name}
              </Heading>
              <HStack spacing={2}>
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {parcelData.area} hectares
                </Badge>
                {parcelData.certified && (
                  <Badge
                    colorScheme={getCertificationColor(parcelData.certified)}
                    variant="solid"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    <Icon as={FaCheckCircle} mr={1} boxSize={2} />
                    Certified
                  </Badge>
                )}
                {parcelData.unique_code && (
                  <Badge
                    colorScheme="purple"
                    variant="outline"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {parcelData.unique_code}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody p={6} overflowY="auto">
          <VStack spacing={6} align="stretch">
            {/* Description */}
            {parcelData.description && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Text color={textColor} lineHeight="tall">
                    {parcelData.description}
                  </Text>
                </CardBody>
              </Card>
            )}

            {/* Key Statistics */}
            <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
              <CardBody p={6}>
                <Heading size="md" color={textColor} mb={4}>
                  Parcel Overview
                </Heading>
                <StatGroup>
                  <Stat>
                    <StatLabel color="gray.500">Area</StatLabel>
                    <StatNumber color={accentColor}>{parcelData.area} ha</StatNumber>
                  </Stat>
                  {parcelData.productions_completed !== undefined && (
                    <Stat>
                      <StatLabel color="gray.500">Completed Productions</StatLabel>
                      <StatNumber color={accentColor}>
                        {parcelData.productions_completed}
                      </StatNumber>
                    </Stat>
                  )}
                  {parcelData.total_productions !== undefined && (
                    <Stat>
                      <StatLabel color="gray.500">Total Productions</StatLabel>
                      <StatNumber color={accentColor}>{parcelData.total_productions}</StatNumber>
                    </Stat>
                  )}
                  {parcelData.establishment && (
                    <Stat>
                      <StatLabel color="gray.500">Establishment</StatLabel>
                      <StatNumber color={accentColor} fontSize="md">
                        {parcelData.establishment.name}
                      </StatNumber>
                    </Stat>
                  )}
                </StatGroup>
              </CardBody>
            </Card>

            {/* Interactive Map */}
            {(parcelData.polygon || parcelData.map_metadata) && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    <HStack>
                      <Icon as={FaMapMarkerAlt} color={accentColor} />
                      <Text>Location & Boundaries</Text>
                    </HStack>
                  </Heading>
                  <Box borderRadius="lg" overflow="hidden" minH="400px">
                    <CardWithMap
                      parcel={{
                        polygon: parcelData.polygon,
                        map_metadata: parcelData.map_metadata,
                        name: parcelData.name,
                        area: parcelData.area
                      }}
                    />
                  </Box>
                  {parcelData.map_metadata?.center && (
                    <HStack mt={3} spacing={4} fontSize="sm" color="gray.500">
                      <HStack>
                        <Icon as={FaCompass} />
                        <Text>
                          Center: {parcelData.map_metadata.center[0].toFixed(4)},{' '}
                          {parcelData.map_metadata.center[1].toFixed(4)}
                        </Text>
                      </HStack>
                      {parcelData.map_metadata.zoom && (
                        <HStack>
                          <Icon as={FaExpand} />
                          <Text>Zoom: {parcelData.map_metadata.zoom}</Text>
                        </HStack>
                      )}
                    </HStack>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Current Production */}
            {parcelData.current_history && (
              <Card
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="lg"
                border="1px"
                borderColor="blue.200"
              >
                <CardBody p={6}>
                  <HStack mb={3}>
                    <Icon as={FaSeedling} color="blue.500" />
                    <Heading size="md" color="blue.700">
                      Current Production
                    </Heading>
                  </HStack>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text color="blue.600" fontWeight="medium">
                        {parcelData.current_history.name}
                      </Text>
                      <Badge colorScheme="blue" variant="subtle">
                        Active
                      </Badge>
                    </HStack>
                    {parcelData.current_history.crop_type && (
                      <HStack>
                        <Icon as={FaSeedling} color="blue.500" />
                        <Text color="blue.600" fontSize="sm">
                          Crop: {parcelData.current_history.crop_type}
                        </Text>
                      </HStack>
                    )}
                    <HStack>
                      <Icon as={FaCalendarAlt} color="blue.500" />
                      <Text color="blue.600" fontSize="sm">
                        Started:{' '}
                        {new Date(parcelData.current_history.start_date).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Soil and Environmental Data */}
            {parcelData.soil_type && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    <HStack>
                      <Icon as={getSoilTypeIcon(parcelData.soil_type)} color={accentColor} />
                      <Text>Soil & Environment</Text>
                    </HStack>
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={3}>
                      <Icon as={FaLayerGroup} color={accentColor} />
                      <Text color={textColor}>
                        <Text as="span" fontWeight="medium">
                          Soil Type:
                        </Text>{' '}
                        {parcelData.soil_type}
                      </Text>
                    </HStack>
                    {parcelData.establishment?.location && (
                      <HStack spacing={3}>
                        <Icon as={FaMapMarkerAlt} color={accentColor} />
                        <Text color={textColor}>
                          <Text as="span" fontWeight="medium">
                            Location:
                          </Text>{' '}
                          {parcelData.establishment.location}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Certification Information */}
            {(parcelData.certified || parcelData.certification_type) && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    <HStack>
                      <Icon as={FaCertificate} color={accentColor} />
                      <Text>Certification Status</Text>
                    </HStack>
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={3}>
                      <Icon
                        as={parcelData.certified ? FaCheckCircle : FaEye}
                        color={parcelData.certified ? 'green.500' : 'gray.400'}
                      />
                      <Text color={textColor}>
                        <Text as="span" fontWeight="medium">
                          Status:
                        </Text>{' '}
                        {parcelData.certified ? 'Certified' : 'Not Certified'}
                      </Text>
                    </HStack>
                    {parcelData.certification_type && (
                      <HStack spacing={3}>
                        <Icon as={FaAward} color={accentColor} />
                        <Text color={textColor}>
                          <Text as="span" fontWeight="medium">
                            Type:
                          </Text>{' '}
                          {parcelData.certification_type}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Contact Information */}
            {(parcelData.contact_person ||
              parcelData.contact_phone ||
              parcelData.contact_email) && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    Parcel Contact
                  </Heading>
                  <VStack spacing={4} align="stretch">
                    {parcelData.contact_person && (
                      <HStack spacing={3}>
                        <Icon as={FaUsers} color={accentColor} />
                        <Text color={textColor}>
                          <Text as="span" fontWeight="medium">
                            Contact Person:
                          </Text>{' '}
                          {parcelData.contact_person}
                        </Text>
                      </HStack>
                    )}
                    {parcelData.contact_phone && (
                      <HStack spacing={3}>
                        <Icon as={FaPhone} color={accentColor} />
                        <Link href={`tel:${parcelData.contact_phone}`} color={textColor}>
                          {parcelData.contact_phone}
                        </Link>
                      </HStack>
                    )}
                    {parcelData.contact_email && (
                      <HStack spacing={3}>
                        <Icon as={FaEnvelope} color={accentColor} />
                        <Link href={`mailto:${parcelData.contact_email}`} color={textColor}>
                          {parcelData.contact_email}
                        </Link>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Production History Summary */}
            {parcelData.productions_completed !== undefined &&
              parcelData.productions_completed > 0 && (
                <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                  <CardBody p={6}>
                    <Heading size="md" color={textColor} mb={4}>
                      <HStack>
                        <Icon as={FaTree} color={accentColor} />
                        <Text>Production History</Text>
                      </HStack>
                    </Heading>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text color="gray.500">Completed Productions This Year:</Text>
                        <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                          {parcelData.productions_completed}
                        </Badge>
                      </HStack>
                      {parcelData.total_productions !== undefined && (
                        <HStack justify="space-between">
                          <Text color="gray.500">Total Productions:</Text>
                          <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                            {parcelData.total_productions}
                          </Badge>
                        </HStack>
                      )}
                      <Progress
                        value={
                          (parcelData.productions_completed / (parcelData.total_productions || 1)) *
                          100
                        }
                        colorScheme="green"
                        size="sm"
                        borderRadius="full"
                      />
                      <Text color="gray.500" fontSize="sm" textAlign="center">
                        Production Activity Level
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )}

            {/* Images Gallery */}
            {parcelData.images && parcelData.images.length > 0 && (
              <Card bg={cardBg} borderRadius="lg" border="1px" borderColor={borderColor}>
                <CardBody p={6}>
                  <Heading size="md" color={textColor} mb={4}>
                    Parcel Gallery
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {parcelData.images.map((image, index) => (
                      <Box key={index} borderRadius="lg" overflow="hidden">
                        <Image
                          src={image}
                          alt={`${parcelData.name} - Image ${index + 1}`}
                          w="full"
                          h="150px"
                          objectFit="cover"
                          _hover={{ transform: 'scale(1.05)' }}
                          transition="transform 0.2s"
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                </CardBody>
              </Card>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ParcelModal;
