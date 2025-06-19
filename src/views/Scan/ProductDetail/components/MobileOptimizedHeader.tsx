import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Badge,
  Heading,
  Text,
  Icon,
  Circle,
  SimpleGrid
} from '@chakra-ui/react';
import { FaLeaf, FaChartLine } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface MobileOptimizedHeaderProps {
  titleColor: string;
  carbonScore?: number;
  greenPoints: number;
  industryPercentile?: number;
  productName?: string;
  location?: string;
}

export const MobileOptimizedHeader: React.FC<MobileOptimizedHeaderProps> = ({
  titleColor,
  carbonScore,
  greenPoints,
  industryPercentile,
  productName,
  location
}) => {
  const intl = useIntl();

  return (
    <Box
      bg="linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)"
      pt={{ base: '120px', md: '150px' }}
      pb={{ base: '60px', md: '120px' }}
      px={4}>
      <Container maxW="6xl" mx="auto">
        <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
          {/* Compact Welcome Badge */}
          <Badge
            colorScheme="green"
            variant="subtle"
            fontSize={{ base: 'xs', md: 'sm' }}
            px={{ base: 3, md: 4 }}
            py={{ base: 1, md: 2 }}
            borderRadius="full"
            textTransform="none">
            <HStack spacing={2}>
              <Icon as={FaLeaf} boxSize={{ base: 3, md: 4 }} />
              <Text fontWeight="medium">
                {intl.formatMessage({ id: 'app.sustainabilityTracker' }) ||
                  'Sustainability Tracker'}
              </Text>
            </HStack>
          </Badge>

          {/* Compact Main Title */}
          <VStack spacing={{ base: 2, md: 3 }}>
            <Heading
              as="h1"
              size={{ base: 'xl', md: '2xl' }}
              color={titleColor}
              fontWeight="bold"
              textAlign="center"
              letterSpacing="-0.02em"
              lineHeight="1.2">
              {productName || intl.formatMessage({ id: 'app.welcome' })}
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              fontWeight="normal"
              maxW={{ base: '95%', sm: '80%', lg: '60%' }}
              lineHeight="1.6"
              textAlign="center">
              {location || intl.formatMessage({ id: 'app.welcomeMessage' })}
            </Text>
          </VStack>

          {/* Mobile-Optimized Quick Stats */}
          <SimpleGrid columns={3} spacing={{ base: 4, md: 6 }} w="full" maxW="sm">
            <VStack spacing={1}>
              <Circle size={{ base: '40px', md: '50px' }} bg="green.100" color="green.600">
                <Icon as={FaLeaf} boxSize={{ base: 4, md: 6 }} />
              </Circle>
              <VStack spacing={0}>
                <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="gray.800">
                  {carbonScore || '--'}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" textAlign="center">
                  Carbon Score
                </Text>
              </VStack>
            </VStack>

            <VStack spacing={1}>
              <Circle size={{ base: '40px', md: '50px' }} bg="blue.100" color="blue.600">
                <Icon as={MdVerified} boxSize={{ base: 4, md: 6 }} />
              </Circle>
              <VStack spacing={0}>
                <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="gray.800">
                  {greenPoints}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" textAlign="center">
                  Green Points
                </Text>
              </VStack>
            </VStack>

            <VStack spacing={1}>
              <Circle size={{ base: '40px', md: '50px' }} bg="purple.100" color="purple.600">
                <Icon as={FaChartLine} boxSize={{ base: 4, md: 6 }} />
              </Circle>
              <VStack spacing={0}>
                <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color="gray.800">
                  {industryPercentile ? `${industryPercentile}%` : '--'}
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.600" textAlign="center">
                  Eco Ranking
                </Text>
              </VStack>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
};
