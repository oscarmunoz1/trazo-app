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
  useColorModeValue,
  Stack,
  Divider,
  Flex,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCertificate,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaStar,
  FaInfoCircle
} from 'react-icons/fa';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';
import { CompanyModal } from './CompanyModal';
import { EstablishmentModal } from './EstablishmentModal';

interface CompanyEstablishmentInfoProps {
  companyData?: {
    name?: string;
    description?: string;
    website?: string;
    phone?: string;
    email?: string;
    location?: string;
    // Additional fields for modal
    id?: string;
    tradename?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    facebook?: string;
    instagram?: string;
    logo?: string;
    fiscal_id?: string;
    contact_email?: string;
    established_year?: number;
    employee_count?: number;
    total_establishments?: number;
    total_parcels?: number;
    certifications?: string[] | string;
    subscription_plan?: {
      name: string;
      tier: string;
    };
  };
  establishmentData?: {
    name?: string;
    location?: string;
    rating?: number;
    certifications?: string[] | string;
    establishedYear?: number;
    size?: string;
    type?: string;
    // Additional fields for modal
    id?: string | number;
    description?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zone?: string;
    latitude?: number;
    longitude?: number;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    email?: string;
    phone?: string;
    zip_code?: string;
    facebook?: string;
    instagram?: string;
    about?: string;
    main_activities?: string;
    location_highlights?: string;
    custom_message?: string;
    is_active?: boolean;
    crops_grown?: string[];
    sustainability_practices?: string[];
    employee_count?: number;
    total_acreage?: number;
    year_established?: number;
    establishment_type?: string;
    farming_method?: string;
    images?: string[];
    parcels?: Array<{
      id: string | number;
      name: string;
      area: number;
    }>;
  };
}

export const CompanyEstablishmentInfo: React.FC<CompanyEstablishmentInfoProps> = ({
  companyData,
  establishmentData
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const {
    isOpen: isCompanyModalOpen,
    onOpen: onCompanyModalOpen,
    onClose: onCompanyModalClose
  } = useDisclosure();

  const {
    isOpen: isEstablishmentModalOpen,
    onOpen: onEstablishmentModalOpen,
    onClose: onEstablishmentModalClose
  } = useDisclosure();

  const renderStars = (rating: number) => {
    return (
      <HStack spacing={1}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            as={rating >= star ? BsStarFill : rating >= star - 0.5 ? BsStarHalf : BsStar}
            color="orange.400"
            boxSize={4}
          />
        ))}
        <Text fontSize="sm" color={mutedColor} ml={2}>
          ({rating.toFixed(1)})
        </Text>
      </HStack>
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Company Information */}
      {companyData && (
        <Card bg={bgColor} shadow="md" borderRadius="xl">
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FaBuilding} color="blue.500" boxSize={6} />
                <VStack align="start" spacing={1} flex="1">
                  <Heading size="md" color={textColor}>
                    {companyData.name || 'Company Name'}
                  </Heading>
                  <Text fontSize="sm" color={mutedColor}>
                    Agricultural Producer
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  leftIcon={<FaInfoCircle />}
                  onClick={onCompanyModalOpen}
                  borderRadius="full"
                  fontSize="xs">
                  More Info
                </Button>
              </HStack>

              {companyData.description && (
                <Text fontSize="sm" color={textColor} lineHeight="1.6">
                  {companyData.description}
                </Text>
              )}

              <Divider />

              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                {companyData.location && (
                  <HStack spacing={2}>
                    <Icon as={FaMapMarkerAlt} color="green.500" boxSize={4} />
                    <Text fontSize="sm" color={textColor}>
                      {companyData.location}
                    </Text>
                  </HStack>
                )}

                {companyData.website && (
                  <HStack spacing={2}>
                    <Icon as={FaGlobe} color="blue.500" boxSize={4} />
                    <Text fontSize="sm" color="blue.500" cursor="pointer">
                      Visit Website
                    </Text>
                  </HStack>
                )}

                {companyData.phone && (
                  <HStack spacing={2}>
                    <Icon as={FaPhone} color="gray.500" boxSize={4} />
                    <Text fontSize="sm" color={textColor}>
                      {companyData.phone}
                    </Text>
                  </HStack>
                )}
              </Stack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Establishment Information */}
      {establishmentData && (
        <Card bg={bgColor} shadow="md" borderRadius="xl">
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="flex-start">
                <VStack align="start" spacing={1} flex="1">
                  <Heading size="md" color={textColor}>
                    {establishmentData.name || 'Farm Name'}
                  </Heading>
                  <HStack spacing={2}>
                    <Icon as={FaMapMarkerAlt} color="green.500" boxSize={3} />
                    <Text fontSize="sm" color={mutedColor}>
                      {establishmentData.location || 'Farm Location'}
                    </Text>
                  </HStack>
                </VStack>

                <VStack spacing={2} align="end">
                  {establishmentData.rating && establishmentData.rating > 0 && (
                    <VStack spacing={1} align="end">
                      {renderStars(establishmentData.rating)}
                    </VStack>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="green"
                    leftIcon={<FaInfoCircle />}
                    onClick={onEstablishmentModalOpen}
                    borderRadius="full"
                    fontSize="xs">
                    More Info
                  </Button>
                </VStack>
              </Flex>

              <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                {establishmentData.type && (
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      TYPE
                    </Text>
                    <Badge colorScheme="green" borderRadius="full" px={3}>
                      {establishmentData.type}
                    </Badge>
                  </VStack>
                )}

                {establishmentData.size && (
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      SIZE
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {establishmentData.size}
                    </Text>
                  </VStack>
                )}

                {establishmentData.establishedYear && (
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      ESTABLISHED
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {establishmentData.establishedYear}
                    </Text>
                  </VStack>
                )}
              </Stack>

              {establishmentData.certifications && (
                <>
                  <Divider />
                  <VStack align="start" spacing={3}>
                    <HStack spacing={2}>
                      <Icon as={FaCertificate} color="gold" boxSize={4} />
                      <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                        Certifications
                      </Text>
                    </HStack>
                    <HStack spacing={2} flexWrap="wrap">
                      {(() => {
                        // Handle both string and array formats
                        const certs = Array.isArray(establishmentData.certifications)
                          ? establishmentData.certifications
                          : typeof establishmentData.certifications === 'string'
                          ? establishmentData.certifications
                              .split(',')
                              .map((cert) => cert.trim())
                              .filter((cert) => cert)
                          : [];

                        return certs.map((cert, index) => (
                          <Badge
                            key={index}
                            colorScheme="blue"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs">
                            {cert}
                          </Badge>
                        ));
                      })()}
                    </HStack>
                  </VStack>
                </>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Company Detail Modal */}
      {companyData && (
        <CompanyModal
          isOpen={isCompanyModalOpen}
          onClose={onCompanyModalClose}
          companyData={{
            id: companyData.id || '1',
            name: companyData.name || 'Company Name',
            tradename: companyData.tradename,
            description: companyData.description,
            address: companyData.address,
            city: companyData.city,
            state: companyData.state,
            country: companyData.country,
            phone: companyData.phone,
            email: companyData.email,
            website: companyData.website,
            facebook: companyData.facebook,
            instagram: companyData.instagram,
            logo: companyData.logo,
            fiscal_id: companyData.fiscal_id,
            contact_email: companyData.contact_email,
            established_year: companyData.established_year,
            employee_count: companyData.employee_count,
            total_establishments: companyData.total_establishments,
            total_parcels: companyData.total_parcels,
            certifications: Array.isArray(companyData.certifications)
              ? companyData.certifications
              : typeof companyData.certifications === 'string'
              ? companyData.certifications
                  .split(',')
                  .map((cert) => cert.trim())
                  .filter((cert) => cert)
              : undefined,
            subscription_plan: companyData.subscription_plan
          }}
        />
      )}

      {/* Establishment Detail Modal */}
      {establishmentData && (
        <EstablishmentModal
          isOpen={isEstablishmentModalOpen}
          onClose={onEstablishmentModalClose}
          establishmentData={{
            id: establishmentData.id || '1',
            name: establishmentData.name || 'Farm Name',
            description: establishmentData.description,
            address: establishmentData.address,
            city: establishmentData.city,
            state: establishmentData.state,
            country: establishmentData.country,
            zone: establishmentData.zone,
            latitude: establishmentData.latitude,
            longitude: establishmentData.longitude,
            contact_person: establishmentData.contact_person,
            contact_phone: establishmentData.contact_phone,
            contact_email: establishmentData.contact_email,
            email: establishmentData.email,
            phone: establishmentData.phone,
            zip_code: establishmentData.zip_code,
            facebook: establishmentData.facebook,
            instagram: establishmentData.instagram,
            certifications:
              typeof establishmentData.certifications === 'string'
                ? establishmentData.certifications
                : establishmentData.certifications?.join(', '),
            about: establishmentData.about,
            main_activities: establishmentData.main_activities,
            location_highlights: establishmentData.location_highlights,
            custom_message: establishmentData.custom_message,
            is_active: establishmentData.is_active,
            crops_grown: establishmentData.crops_grown,
            sustainability_practices: establishmentData.sustainability_practices,
            employee_count: establishmentData.employee_count,
            total_acreage: establishmentData.total_acreage,
            year_established:
              establishmentData.year_established || establishmentData.establishedYear,
            establishment_type: establishmentData.establishment_type || establishmentData.type,
            farming_method: establishmentData.farming_method,
            images: establishmentData.images,
            parcels: establishmentData.parcels
          }}
        />
      )}
    </VStack>
  );
};
