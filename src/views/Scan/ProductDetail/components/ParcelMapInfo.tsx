import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Icon,
  Card,
  CardBody,
  CardHeader,
  useColorModeValue,
  Button,
  Stack,
  Divider,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaMapMarkerAlt,
  FaRuler,
  FaSeedling,
  FaExpand,
  FaCompress,
  FaLeaf,
  FaInfoCircle
} from 'react-icons/fa';
import { MdLocationOn, MdTerrain } from 'react-icons/md';
import { ParcelModal } from './ParcelModal';
// Import the real map component from Parcel Dashboard
// @ts-ignore - CardWithMap is a JSX component without TypeScript declarations
import CardWithMap from '../../../Dashboard/Parcel/components/CardWithMap.jsx';

interface ParcelMapInfoProps {
  parcelData?: {
    id?: string;
    name?: string;
    location?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    area?: number;
    areaUnit?: string;
    soilType?: string;
    cropType?: string;
    plantingDate?: string;
    harvestDate?: string;
    elevation?: number;
    slope?: string;
    irrigationType?: string;
    polygon?: Array<{
      lat: number;
      lng: number;
    }>;
    map_metadata?: {
      center?: {
        lat: number;
        lng: number;
      };
      zoom?: number;
    };
    // Additional fields for modal
    description?: string;
    certified?: boolean;
    unique_code?: string;
    certification_type?: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    establishment?: {
      id?: string | number;
      name: string;
      description?: string;
      location: string;
      photo?: string;
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

export const ParcelMapInfo: React.FC<ParcelMapInfoProps> = ({ parcelData }) => {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const {
    isOpen: isParcelModalOpen,
    onOpen: onParcelModalOpen,
    onClose: onParcelModalClose
  } = useDisclosure();

  return (
    <Card bg={bgColor} shadow="lg" borderRadius="xl" w="full">
      <CardHeader>
        <HStack spacing={3}>
          <Icon as={FaMapMarkerAlt} color="green.500" boxSize={6} />
          <Heading size="md" color={textColor}>
            Parcel Information
          </Heading>
          <Badge colorScheme="green" borderRadius="full">
            Field Map
          </Badge>
        </HStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={6} align="stretch">
          {/* Interactive Map */}
          <Box position="relative">
            <CardWithMap
              polygon={parcelData?.polygon}
              center={parcelData?.map_metadata?.center}
              zoom={parcelData?.map_metadata?.zoom}
            />

            <Button
              position="absolute"
              top={2}
              right={2}
              size="sm"
              variant="outline"
              bg="white"
              leftIcon={<Icon as={isMapExpanded ? FaCompress : FaExpand} />}
              onClick={() => setIsMapExpanded(!isMapExpanded)}>
              {isMapExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </Box>

          {/* Parcel Details */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontSize="xs" color={mutedColor} fontWeight="semibold" mb={1}>
                  PARCEL NAME
                </Text>
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  {parcelData?.name || 'Field'}
                </Text>
              </Box>

              <Box>
                <Text fontSize="xs" color={mutedColor} fontWeight="semibold" mb={1}>
                  LOCATION
                </Text>
                <HStack spacing={2}>
                  <Icon as={MdLocationOn} color="green.500" />
                  <Text fontSize="md" color={textColor}>
                    {parcelData?.location || 'Location not specified'}
                  </Text>
                </HStack>
              </Box>

              {parcelData?.coordinates && (
                <Box>
                  <Text fontSize="xs" color={mutedColor} fontWeight="semibold" mb={1}>
                    COORDINATES
                  </Text>
                  <Text fontSize="sm" color={textColor} fontFamily="mono">
                    {parcelData.coordinates.latitude.toFixed(6)},{' '}
                    {parcelData.coordinates.longitude.toFixed(6)}
                  </Text>
                </Box>
              )}
            </VStack>

            <VStack align="start" spacing={4}>
              {parcelData?.area && (
                <Stat>
                  <StatLabel fontSize="xs" color={mutedColor}>
                    AREA
                  </StatLabel>
                  <StatNumber fontSize="lg" color={textColor}>
                    {parcelData.area} {parcelData.areaUnit || 'hectares'}
                  </StatNumber>
                  <StatHelpText fontSize="xs">Total cultivation area</StatHelpText>
                </Stat>
              )}

              {parcelData?.soilType && (
                <Box>
                  <Text fontSize="xs" color={mutedColor} fontWeight="semibold" mb={1}>
                    SOIL TYPE
                  </Text>
                  <HStack spacing={2}>
                    <Icon as={MdTerrain} color="brown.500" />
                    <Text fontSize="md" color={textColor}>
                      {parcelData.soilType}
                    </Text>
                  </HStack>
                </Box>
              )}

              {parcelData?.elevation && (
                <Box>
                  <Text fontSize="xs" color={mutedColor} fontWeight="semibold" mb={1}>
                    ELEVATION
                  </Text>
                  <Text fontSize="md" color={textColor}>
                    {parcelData.elevation}m above sea level
                  </Text>
                </Box>
              )}
            </VStack>
          </SimpleGrid>

          <Divider />

          {/* Cultivation Details */}
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={3}>
              Cultivation Details
            </Text>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {parcelData?.cropType && (
                <VStack align="start" spacing={1}>
                  <HStack spacing={2}>
                    <Icon as={FaSeedling} color="green.500" boxSize={4} />
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      CROP TYPE
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {parcelData.cropType}
                  </Text>
                </VStack>
              )}

              {parcelData?.irrigationType && (
                <VStack align="start" spacing={1}>
                  <HStack spacing={2}>
                    <Icon as={FaLeaf} color="blue.500" boxSize={4} />
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      IRRIGATION
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {parcelData.irrigationType}
                  </Text>
                </VStack>
              )}

              {parcelData?.slope && (
                <VStack align="start" spacing={1}>
                  <HStack spacing={2}>
                    <Icon as={FaRuler} color="orange.500" boxSize={4} />
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      SLOPE
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {parcelData.slope}
                  </Text>
                </VStack>
              )}
            </SimpleGrid>
          </Box>

          {/* Planting and Harvest Dates */}
          {(parcelData?.plantingDate || parcelData?.harvestDate) && (
            <>
              <Divider />
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {parcelData?.plantingDate && (
                  <Box>
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold" mb={1}>
                      PLANTING DATE
                    </Text>
                    <Text fontSize="md" color={textColor}>
                      {new Date(parcelData.plantingDate).toLocaleDateString()}
                    </Text>
                  </Box>
                )}

                {parcelData?.harvestDate && (
                  <Box>
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold" mb={1}>
                      HARVEST DATE
                    </Text>
                    <Text fontSize="md" color={textColor}>
                      {new Date(parcelData.harvestDate).toLocaleDateString()}
                    </Text>
                  </Box>
                )}
              </SimpleGrid>
            </>
          )}
        </VStack>
      </CardBody>

      {/* Parcel Detail Modal */}
      {parcelData && (
        <ParcelModal
          isOpen={isParcelModalOpen}
          onClose={onParcelModalClose}
          parcelData={{
            id: parcelData.id || '1',
            name: parcelData.name || 'Parcel',
            description: parcelData.description,
            area: parcelData.area || 0,
            polygon: parcelData.polygon,
            map_metadata: parcelData.map_metadata
              ? {
                  center: parcelData.map_metadata.center
                    ? ([parcelData.map_metadata.center.lat, parcelData.map_metadata.center.lng] as [
                        number,
                        number
                      ])
                    : undefined,
                  zoom: parcelData.map_metadata.zoom
                }
              : undefined,
            soil_type: parcelData.soilType,
            certification_type: parcelData.certification_type,
            certified: parcelData.certified,
            unique_code: parcelData.unique_code,
            contact_person: parcelData.contact_person,
            contact_phone: parcelData.contact_phone,
            contact_email: parcelData.contact_email,
            establishment: parcelData.establishment,
            current_history: parcelData.current_history
              ? {
                  ...parcelData.current_history,
                  crop_type: parcelData.cropType
                }
              : undefined,
            productions_completed: parcelData.productions_completed,
            total_productions: parcelData.total_productions,
            images: parcelData.images
          }}
        />
      )}
    </Card>
  );
};
