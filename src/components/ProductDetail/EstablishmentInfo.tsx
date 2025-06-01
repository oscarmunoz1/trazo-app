import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Image,
  Badge,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Avatar,
  Flex
} from '@chakra-ui/react';
import { MdBusiness, MdLocationOn, MdInfo, MdVerifiedUser } from 'react-icons/md';
import { FaCertificate, FaMapMarkerAlt, FaBuilding } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import HTMLRenderer from 'components/Utils/HTMLRenderer';

interface EstablishmentInfoProps {
  establishment: {
    id: string;
    name: string;
    location: string;
    description: string;
    photo?: string;
    certifications?: string[];
    email?: string;
    phone?: string;
  };
}

export const EstablishmentInfo: React.FC<EstablishmentInfoProps> = ({ establishment }) => {
  const intl = useIntl();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      border="1px solid"
      borderColor={borderColor}>
      {/* Header */}
      <HStack spacing={3} mb={6}>
        <Icon as={MdBusiness} color="green.500" boxSize={6} />
        <Heading as="h3" size="lg" color="gray.800">
          {intl.formatMessage({ id: 'app.establishment' })}
        </Heading>
      </HStack>

      <VStack spacing={6} align="stretch">
        {/* Establishment Profile */}
        <HStack spacing={4} align="start">
          {establishment.photo ? (
            <Image
              src={establishment.photo}
              alt={establishment.name}
              boxSize="80px"
              objectFit="cover"
              borderRadius="full"
              border="3px solid"
              borderColor="green.100"
            />
          ) : (
            <Avatar
              name={establishment.name}
              size="xl"
              bg="green.500"
              color="white"
              icon={<FaBuilding />}
            />
          )}

          <VStack align="start" spacing={2} flex={1}>
            <Heading as="h4" size="md" color="gray.800">
              {establishment.name}
            </Heading>

            <HStack spacing={2}>
              <Icon as={FaMapMarkerAlt} color="gray.500" boxSize={4} />
              <Text color="gray.600" fontSize="sm">
                {establishment.location}
              </Text>
            </HStack>

            {/* Certifications */}
            {establishment.certifications && establishment.certifications.length > 0 && (
              <HStack spacing={2} flexWrap="wrap">
                <Icon as={FaCertificate} color="green.500" boxSize={4} />
                {establishment.certifications.map((cert, index) => (
                  <Badge key={index} colorScheme="green" variant="solid" fontSize="xs">
                    {cert}
                  </Badge>
                ))}
              </HStack>
            )}
          </VStack>
        </HStack>

        {/* Description */}
        <Box>
          <Heading as="h5" size="sm" mb={3} color="gray.700">
            {intl.formatMessage({ id: 'app.aboutEstablishment' }) || 'About This Establishment'}
          </Heading>
          <Box
            maxH="120px"
            overflowY="auto"
            p={3}
            bg="gray.50"
            borderRadius="md"
            sx={{
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-track': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray.300',
                borderRadius: '24px'
              }
            }}>
            <HTMLRenderer htmlString={establishment.description || ''} />
          </Box>
        </Box>

        {/* Contact Information */}
        {(establishment.email || establishment.phone) && (
          <Box>
            <Heading as="h5" size="sm" mb={3} color="gray.700">
              {intl.formatMessage({ id: 'app.contact' })}
            </Heading>
            <VStack spacing={2} align="start">
              {establishment.email && (
                <HStack spacing={3}>
                  <Icon as={MdInfo} color="blue.500" boxSize={4} />
                  <Text fontSize="sm" color="gray.700">
                    <strong>Email:</strong> {establishment.email}
                  </Text>
                </HStack>
              )}
              {establishment.phone && (
                <HStack spacing={3}>
                  <Icon as={MdInfo} color="blue.500" boxSize={4} />
                  <Text fontSize="sm" color="gray.700">
                    <strong>Phone:</strong> {establishment.phone}
                  </Text>
                </HStack>
              )}
            </VStack>
          </Box>
        )}

        {/* Trust Indicator */}
        <Flex
          justify="center"
          p={3}
          bg="green.50"
          borderRadius="md"
          border="1px solid"
          borderColor="green.200">
          <HStack spacing={2}>
            <Icon as={MdVerifiedUser} color="green.500" boxSize={5} />
            <Text fontSize="sm" fontWeight="medium" color="green.700">
              {intl.formatMessage({ id: 'app.verifiedEstablishment' }) ||
                'Verified Sustainable Producer'}
            </Text>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};
