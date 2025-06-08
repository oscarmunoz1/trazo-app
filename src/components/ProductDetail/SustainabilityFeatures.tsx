import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  Progress,
  Badge,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Circle,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaStar,
  FaShare,
  FaChartLine,
  FaInfoCircle,
  FaAward,
  FaHeart
} from 'react-icons/fa';
import { MdEco, MdTrendingUp } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { CarbonScore } from '../CarbonScore';
import { BadgeCarousel } from '../BadgeCarousel';

interface SustainabilityFeaturesProps {
  carbonScore: number;
  netFootprint: number;
  industryPercentile: number;
  relatableFootprint?: string;
  badges?: any[];
  points: number;
  onOffset: () => void;
  onShare: () => void;
  onRate: () => void;
}

export const SustainabilityFeatures: React.FC<SustainabilityFeaturesProps> = ({
  carbonScore,
  netFootprint,
  industryPercentile,
  relatableFootprint,
  badges = [],
  points,
  onOffset,
  onShare,
  onRate
}) => {
  const intl = useIntl();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getCarbonScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const getImpactLevel = (percentile: number) => {
    if (percentile >= 80) return { label: 'Exceptional', color: 'green', icon: FaAward };
    if (percentile >= 60) return { label: 'Great', color: 'blue', icon: FaLeaf };
    if (percentile >= 40) return { label: 'Good', color: 'yellow', icon: FaHeart };
    return { label: 'Standard', color: 'gray', icon: FaInfoCircle };
  };

  const impactLevel = getImpactLevel(industryPercentile);

  return (
    <VStack spacing={6} align="stretch">
      {/* Carbon Score Section */}
      <Box
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        p={6}
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={4}>
          <HStack spacing={2} justify="center">
            <Icon as={FaLeaf} color="green.500" boxSize={6} />
            <Heading as="h3" size="lg" textAlign="center">
              {intl.formatMessage({ id: 'app.carbonScore' }) || 'Carbon Score'}
            </Heading>
          </HStack>

          <CarbonScore
            score={carbonScore}
            footprint={netFootprint}
            industryPercentile={industryPercentile}
            relatableFootprint={relatableFootprint}
          />

          {/* Impact Level Indicator */}
          {industryPercentile > 0 && (
            <Box bg={`${impactLevel.color}.50`} p={4} borderRadius="lg" w="full">
              <HStack justify="center" spacing={3}>
                <Circle size="40px" bg={`${impactLevel.color}.500`} color="white">
                  <Icon as={impactLevel.icon} boxSize={5} />
                </Circle>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" color={`${impactLevel.color}.700`}>
                    {impactLevel.label} Impact!
                  </Text>
                  <Text fontSize="sm" color={`${impactLevel.color}.600`}>
                    Greener than {industryPercentile}% of similar products
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}

          {/* Relatable Footprint */}
          {relatableFootprint && (
            <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
              <HStack>
                <Icon as={FaInfoCircle} color="blue.500" />
                <Text fontSize="sm" color="blue.700">
                  {relatableFootprint}
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Achievement Badges */}
      {badges.length > 0 && (
        <Box
          bg={bgColor}
          borderRadius="xl"
          boxShadow="lg"
          p={6}
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={4}>
            <HStack spacing={2}>
              <Icon as={FaAward} color="yellow.500" boxSize={5} />
              <Heading as="h4" size="md">
                {intl.formatMessage({ id: 'app.achievements' }) || 'Sustainability Achievements'}
              </Heading>
            </HStack>
            <BadgeCarousel badges={badges} />
          </VStack>
        </Box>
      )}

      {/* Consumer Actions */}
      <Box
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        p={6}
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={6}>
          <Heading as="h4" size="md" textAlign="center">
            {intl.formatMessage({ id: 'app.takeAction' }) || 'Take Action'}
          </Heading>

          {/* Offset Section */}
          <Box
            w="full"
            p={4}
            bg="green.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="green.200"
          >
            <VStack spacing={3}>
              <HStack spacing={2}>
                <Icon as={FaLeaf} color="green.500" />
                <Heading as="h5" size="sm" color="green.700">
                  {intl.formatMessage({ id: 'app.offsetYourImpact' }) || 'Offset Your Impact'}
                </Heading>
              </HStack>

              <Text fontSize="sm" textAlign="center" color="gray.600">
                {intl.formatMessage({ id: 'app.offsetDescription' }) ||
                  'Help reduce carbon emissions by funding verified sustainability projects.'}
              </Text>

              <SimpleGrid columns={3} spacing={3} w="full">
                <Button size="sm" colorScheme="green" variant="outline" onClick={onOffset}>
                  $0.05
                </Button>
                <Button size="sm" colorScheme="green" variant="solid" onClick={onOffset}>
                  $0.10
                </Button>
                <Button size="sm" colorScheme="green" variant="outline" onClick={onOffset}>
                  $0.25
                </Button>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Points Progress */}
          <Box
            w="full"
            p={4}
            bg="blue.50"
            borderRadius="lg"
            border="1px solid"
            borderColor="blue.200"
          >
            <VStack spacing={3}>
              <HStack justify="space-between" w="full">
                <HStack spacing={2}>
                  <Icon as={FaStar} color="yellow.400" />
                  <Heading as="h5" size="sm" color="blue.700">
                    {intl.formatMessage({ id: 'app.greenPoints' }) || 'Green Points'}
                  </Heading>
                </HStack>
                <Badge colorScheme="blue" variant="solid" fontSize="sm">
                  {points} pts
                </Badge>
              </HStack>

              <Progress
                value={(points % 50) * 2}
                size="md"
                colorScheme="blue"
                borderRadius="full"
                w="full"
                bg="blue.100"
              />

              <Text fontSize="xs" color="blue.600" textAlign="center">
                {50 - (points % 50)} points to next reward level
              </Text>
            </VStack>
          </Box>

          {/* Social Actions */}
          <SimpleGrid columns={2} spacing={4} w="full">
            <Button
              leftIcon={<Icon as={FaShare} />}
              colorScheme="blue"
              variant="outline"
              onClick={onShare}
              size="md"
            >
              {intl.formatMessage({ id: 'app.share' }) || 'Share'} (+3)
            </Button>
            <Button
              leftIcon={<Icon as={FaStar} />}
              colorScheme="yellow"
              variant="outline"
              onClick={onRate}
              size="md"
            >
              {intl.formatMessage({ id: 'app.rate' }) || 'Rate'} (+2)
            </Button>
          </SimpleGrid>

          {/* Environmental Impact Stats */}
          <SimpleGrid columns={2} spacing={4} w="full">
            <Stat bg="green.50" p={3} borderRadius="md" textAlign="center">
              <StatLabel fontSize="xs" color="green.600">
                CO₂ Saved
              </StatLabel>
              <StatNumber fontSize="lg" color="green.700">
                {netFootprint.toFixed(2)} kg
              </StatNumber>
              <StatHelpText fontSize="xs" color="green.500">
                vs. average
              </StatHelpText>
            </Stat>
            <Stat bg="blue.50" p={3} borderRadius="md" textAlign="center">
              <StatLabel fontSize="xs" color="blue.600">
                Your Impact
              </StatLabel>
              <StatNumber fontSize="lg" color="blue.700">
                Top {100 - industryPercentile}%
              </StatNumber>
              <StatHelpText fontSize="xs" color="blue.500">
                eco-friendly
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        </VStack>
      </Box>
    </VStack>
  );
};
