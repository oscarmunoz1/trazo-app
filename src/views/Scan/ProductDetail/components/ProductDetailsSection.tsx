import React from 'react';
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
  Stack,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Flex
} from '@chakra-ui/react';
import {
  FaBox,
  FaWeight,
  FaCalendarAlt,
  FaLeaf,
  FaCertificate,
  FaThermometerHalf,
  FaTint,
  FaSeedling,
  FaIndustry,
  FaRecycle
} from 'react-icons/fa';
import { MdEco, MdGrade } from 'react-icons/md';

interface ProductDetailsSectionProps {
  productData?: {
    name?: string;
    category?: string;
    variety?: string;
    description?: string;
    weight?: number;
    weightUnit?: string;
    volume?: number;
    volumeUnit?: string;
    harvestDate?: string;
    packagingDate?: string;
    expiryDate?: string;
    batchNumber?: string;
    grade?: string;
    color?: string;
    size?: string;
    moistureContent?: number;
    organicCertified?: boolean;
    nonGMO?: boolean;
    fairTrade?: boolean;
  };
  sustainabilityMetrics?: {
    carbonFootprint?: number;
    waterUsage?: number;
    energyUsage?: number;
    recyclablePackaging?: boolean;
    locallySourced?: boolean;
    sustainabilityScore?: number;
  };
}

export const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  productData,
  sustainabilityMetrics
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Product Information */}
      <Card bg={bgColor} shadow="md" borderRadius="xl">
        <CardHeader>
          <HStack spacing={3}>
            <Icon as={FaBox} color="blue.500" boxSize={6} />
            <Heading size="md" color={textColor}>
              Product Detailss
            </Heading>
          </HStack>
        </CardHeader>

        <CardBody pt={0}>
          <VStack spacing={6} align="stretch">
            {/* Basic Product Info */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack align="start" spacing={4}>
                <VStack align="start" spacing={2} w="full">
                  <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                    PRODUCT NAME
                  </Text>
                  <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                    {productData?.name || 'Product Name'}
                  </Text>
                </VStack>

                {productData?.category && (
                  <VStack align="start" spacing={2} w="full">
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      CATEGORY
                    </Text>
                    <Badge colorScheme="green" borderRadius="full" px={3}>
                      {productData.category}
                    </Badge>
                  </VStack>
                )}

                {productData?.variety && (
                  <VStack align="start" spacing={2} w="full">
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      VARIETY
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                      {productData.variety}
                    </Text>
                  </VStack>
                )}

                {productData?.batchNumber && (
                  <VStack align="start" spacing={2} w="full">
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      BATCH NUMBER
                    </Text>
                    <Text fontSize="sm" color={textColor} fontFamily="mono">
                      {productData.batchNumber}
                    </Text>
                  </VStack>
                )}
              </VStack>

              <VStack align="start" spacing={4}>
                {productData?.description && (
                  <VStack align="start" spacing={2} w="full">
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      DESCRIPTION
                    </Text>
                    <Text fontSize="sm" color={textColor} lineHeight="1.6">
                      {productData.description}
                    </Text>
                  </VStack>
                )}

                {/* Physical Properties */}
                <SimpleGrid columns={2} spacing={4} w="full">
                  {productData?.weight && (
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                        WEIGHT
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        {productData.weight} {productData.weightUnit || 'kg'}
                      </Text>
                    </VStack>
                  )}

                  {productData?.volume && (
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                        VOLUME
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        {productData.volume} {productData.volumeUnit || 'L'}
                      </Text>
                    </VStack>
                  )}

                  {productData?.grade && (
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                        GRADE
                      </Text>
                      <Badge colorScheme="blue" size="sm">
                        {productData.grade}
                      </Badge>
                    </VStack>
                  )}

                  {productData?.size && (
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                        SIZE
                      </Text>
                      <Text fontSize="sm" color={textColor}>
                        {productData.size}
                      </Text>
                    </VStack>
                  )}
                </SimpleGrid>
              </VStack>
            </SimpleGrid>

            <Divider />

            {/* Dates */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {productData?.harvestDate && (
                <VStack align="start" spacing={2}>
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} color="green.500" boxSize={4} />
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      HARVEST DATE
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {formatDate(productData.harvestDate)}
                  </Text>
                </VStack>
              )}

              {productData?.packagingDate && (
                <VStack align="start" spacing={2}>
                  <HStack spacing={2}>
                    <Icon as={FaBox} color="blue.500" boxSize={4} />
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      PACKAGING DATE
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {formatDate(productData.packagingDate)}
                  </Text>
                </VStack>
              )}

              {productData?.expiryDate && (
                <VStack align="start" spacing={2}>
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} color="orange.500" boxSize={4} />
                    <Text fontSize="xs" color={mutedColor} fontWeight="semibold">
                      BEST BEFORE
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color={textColor}>
                    {formatDate(productData.expiryDate)}
                  </Text>
                </VStack>
              )}
            </SimpleGrid>

            {/* Certifications */}
            {(productData?.organicCertified || productData?.nonGMO || productData?.fairTrade) && (
              <>
                <Divider />
                <VStack align="start" spacing={3}>
                  <HStack spacing={2}>
                    <Icon as={FaCertificate} color="gold" boxSize={5} />
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      Certifications
                    </Text>
                  </HStack>
                  <HStack spacing={3} flexWrap="wrap">
                    {productData.organicCertified && (
                      <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                        <HStack spacing={1}>
                          <Icon as={FaLeaf} boxSize={3} />
                          <Text>Organic</Text>
                        </HStack>
                      </Badge>
                    )}
                    {productData.nonGMO && (
                      <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                        <HStack spacing={1}>
                          <Icon as={FaSeedling} boxSize={3} />
                          <Text>Non-GMO</Text>
                        </HStack>
                      </Badge>
                    )}
                    {productData.fairTrade && (
                      <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                        <HStack spacing={1}>
                          <Icon as={MdGrade} boxSize={3} />
                          <Text>Fair Trade</Text>
                        </HStack>
                      </Badge>
                    )}
                  </HStack>
                </VStack>
              </>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
