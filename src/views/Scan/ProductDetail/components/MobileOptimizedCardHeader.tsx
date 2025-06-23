import React from 'react';
import { CardHeader, VStack, HStack, Badge, Heading, Text, Icon } from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { MdVerified, MdLocationOn } from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';
import { useIntl } from 'react-intl';
import USDACredibilityBadge from '../../../../components/Carbon/USDACredibilityBadge';

interface MobileOptimizedCardHeaderProps {
  textColor: string;
  carbonData: any;
  safeReputation: number;
  handleEducationOpen: (topic: string) => void;
}

export const MobileOptimizedCardHeader: React.FC<MobileOptimizedCardHeaderProps> = ({
  textColor,
  carbonData,
  safeReputation,
  handleEducationOpen
}) => {
  const intl = useIntl();

  return (
    <CardHeader mb={{ base: '16px', md: '24px' }} pb={0}>
      <VStack spacing={3} align="stretch">
        {/* Status Badges Row */}
        <HStack spacing={2} flexWrap="wrap" justify={{ base: 'center', md: 'flex-start' }}>
          <Badge
            colorScheme="green"
            fontSize={{ base: 'xs', md: 'sm' }}
            px={{ base: 2, md: 3 }}
            py={1}
            borderRadius="full"
            minH="28px"
            display="flex"
            alignItems="center"
          >
            <Icon as={MdVerified} mr={1} boxSize={3} />
            {intl.formatMessage({ id: 'app.verified' })}
          </Badge>

          {/* USDA Badge - Compact */}
          {carbonData?.establishment?.id && (
            <USDACredibilityBadge
              establishmentId={carbonData.establishment.id}
              compact={true}
              showDetails={false}
            />
          )}
        </HStack>

        {/* Product Title and Rating */}
        <VStack spacing={2} align={{ base: 'center', md: 'flex-start' }}>
          <Heading
            color={textColor}
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="bold"
            textAlign={{ base: 'center', md: 'left' }}
            lineHeight="1.2"
          >
            {carbonData?.farmer?.name || carbonData?.product?.name || 'Product'}
          </Heading>

          <HStack spacing={2} justify={{ base: 'center', md: 'flex-start' }}>
            <HStack spacing="2px">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  as={
                    safeReputation >= star
                      ? BsStarFill
                      : safeReputation > star - 0.5
                      ? BsStarHalf
                      : BsStar
                  }
                  w={{ base: '14px', md: '16px' }}
                  h={{ base: '14px', md: '16px' }}
                  color="orange.300"
                />
              ))}
            </HStack>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
              ({safeReputation.toFixed(1)})
            </Text>
          </HStack>
        </VStack>

        {/* Location and Performance Indicator */}
        <VStack spacing={2} align={{ base: 'center', md: 'flex-start' }}>
          <HStack spacing={2}>
            <Icon as={MdLocationOn} color="gray.400" boxSize={4} />
            <Text color="gray.500" fontSize={{ base: 'sm', md: 'md' }}>
              {carbonData?.farmer?.location || carbonData?.parcel?.location || 'Farm Location'}
            </Text>
          </HStack>

          {carbonData?.industryPercentile !== undefined && carbonData.industryPercentile > 0 && (
            <HStack spacing={2} justify={{ base: 'center', md: 'flex-start' }}>
              <Icon as={FaLeaf} color="green.500" boxSize={4} />
              <Text
                color="green.500"
                fontWeight="medium"
                fontSize={{ base: 'sm', md: 'md' }}
                textAlign={{ base: 'center', md: 'left' }}
              >
                Greener than {carbonData.industryPercentile}% of similar products
              </Text>
            </HStack>
          )}
        </VStack>
      </VStack>
    </CardHeader>
  );
};
