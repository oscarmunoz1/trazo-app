import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Circle,
  Heading,
  SimpleGrid,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { FaLeaf, FaChartLine } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface MobileProductHeaderProps {
  carbonData: any;
  pointsStore: any;
}

const MobileProductHeader: React.FC<MobileProductHeaderProps> = ({ carbonData, pointsStore }) => {
  const intl = useIntl();
  const titleColor = useColorModeValue('gray.800', 'white');

  return (
    <Box
      bg="linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)"
      pt={{ base: '60px', md: '150px' }}
      pb={{ base: '24px', md: '120px' }}
      px={4}>
      <Container maxW="6xl" mx="auto">
        <VStack spacing={{ base: 2, md: 6 }} textAlign="center">
          {/* Welcome Badge - Mobile Optimized */}
          <Badge
            colorScheme="green"
            variant="subtle"
            fontSize={{ base: '2xs', md: 'sm' }}
            px={{ base: 3, md: 4 }}
            py={{ base: 2, md: 2 }}
            borderRadius="full"
            textTransform="none"
            minH={{ base: '28px', md: '32px' }}>
            <HStack spacing={1}>
              <Icon as={FaLeaf} boxSize={{ base: 3, md: 4 }} />
              <Text fontWeight="medium" fontSize={{ base: '2xs', md: 'sm' }}>
                {intl.formatMessage({ id: 'app.sustainabilityTracker' }) ||
                  'Sustainability Tracker'}
              </Text>
            </HStack>
          </Badge>

          {/* Main Welcome Title - Mobile Optimized */}
          <VStack spacing={{ base: 1, md: 3 }}>
            <Heading
              as="h1"
              size={{ base: 'md', md: '2xl' }}
              color={titleColor}
              fontWeight="bold"
              textAlign="center"
              letterSpacing="-0.02em"
              lineHeight={{ base: '1.3', md: '1.1' }}>
              {intl.formatMessage({ id: 'app.welcome' })}
            </Heading>
            <Text
              fontSize={{ base: '2xs', md: 'lg' }}
              color="gray.600"
              fontWeight="normal"
              maxW={{ base: '95%', sm: '85%', lg: '60%' }}
              lineHeight="1.4"
              textAlign="center"
              display={{ base: 'block', sm: 'block' }}>
              {intl.formatMessage({ id: 'app.welcomeMessage' })}
            </Text>
          </VStack>

          {/* Quick Stats - Mobile First Layout with Enhanced Touch Targets */}
          <SimpleGrid
            columns={{ base: 2, md: 3 }}
            spacing={{ base: 2, md: 6 }}
            w="full"
            maxW={{ base: 'sm', md: 'lg' }}>
            <VStack spacing={{ base: 1, md: 2 }}>
              <Circle
                size={{ base: '44px', md: '50px' }}
                bg="green.100"
                color="green.600"
                minH="44px"
                minW="44px">
                <Icon as={FaLeaf} boxSize={{ base: 4, md: 6 }} />
              </Circle>
              <VStack spacing={0}>
                <Text fontSize={{ base: 'sm', md: 'xl' }} fontWeight="bold" color="gray.800">
                  {carbonData?.carbonScore || '--'}
                </Text>
                <Text fontSize={{ base: '3xs', md: 'sm' }} color="gray.600" textAlign="center">
                  Carbon Score
                </Text>
              </VStack>
            </VStack>

            <VStack spacing={{ base: 1, md: 2 }}>
              <Circle
                size={{ base: '44px', md: '50px' }}
                bg="blue.100"
                color="blue.600"
                minH="44px"
                minW="44px">
                <Icon as={MdVerified} boxSize={{ base: 4, md: 6 }} />
              </Circle>
              <VStack spacing={0}>
                <Text fontSize={{ base: 'sm', md: 'xl' }} fontWeight="bold" color="gray.800">
                  {pointsStore.points}
                </Text>
                <Text fontSize={{ base: '3xs', md: 'sm' }} color="gray.600" textAlign="center">
                  Green Points
                </Text>
              </VStack>
            </VStack>

            <VStack spacing={{ base: 1, md: 2 }} display={{ base: 'none', md: 'flex' }}>
              <Circle size="50px" bg="purple.100" color="purple.600" minH="44px" minW="44px">
                <Icon as={FaChartLine} boxSize={6} />
              </Circle>
              <VStack spacing={0}>
                <Text fontSize="xl" fontWeight="bold" color="gray.800">
                  {carbonData?.industryPercentile ? `${carbonData.industryPercentile}%` : '--'}
                </Text>
                <Text fontSize="sm" color="gray.600" textAlign="center">
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

export default MobileProductHeader;
