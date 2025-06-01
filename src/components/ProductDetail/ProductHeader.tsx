import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface ProductHeaderProps {
  productName: string;
  companyName: string;
  reputation: number;
  isUsdaVerified?: boolean;
  industryPercentile?: number;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  productName,
  companyName,
  reputation,
  isUsdaVerified,
  industryPercentile
}) => {
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');
  const headerFontSize = useBreakpointValue({ base: 'xl', md: '3xl' });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        as={rating >= i + 1 ? BsStarFill : rating > i + 0.5 ? BsStarHalf : BsStar}
        w="20px"
        h="20px"
        color="orange.300"
      />
    ));
  };

  return (
    <Box mb={6}>
      {/* Verification Badges */}
      <HStack spacing={3} mb={4}>
        <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
          <HStack spacing={1}>
            <Icon as={MdVerified} boxSize={4} />
            <Text>{intl.formatMessage({ id: 'app.verified' })}</Text>
          </HStack>
        </Badge>
        {isUsdaVerified && (
          <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
            <HStack spacing={1}>
              <Icon as={MdVerified} boxSize={4} />
              <Text>USDA SOE Verified</Text>
            </HStack>
          </Badge>
        )}
      </HStack>

      {/* Product Information */}
      <VStack align="start" spacing={2}>
        <Heading color={textColor} fontSize={headerFontSize} fontWeight="bold">
          {productName}
        </Heading>

        {/* Rating */}
        <HStack spacing={2}>
          <HStack spacing={1}>{renderStars(reputation)}</HStack>
          <Text fontSize="sm" color="gray.500">
            ({reputation.toFixed(1)})
          </Text>
        </HStack>

        {/* Company */}
        <Text color="gray.500" fontSize="lg">
          {companyName}
        </Text>

        {/* Industry Percentile */}
        {industryPercentile && industryPercentile > 0 && (
          <Badge colorScheme="green" variant="subtle" p={2} borderRadius="md">
            <Text fontSize="sm" fontWeight="medium">
              🌿 Greener than {industryPercentile}% of similar products
            </Text>
          </Badge>
        )}
      </VStack>
    </Box>
  );
};
