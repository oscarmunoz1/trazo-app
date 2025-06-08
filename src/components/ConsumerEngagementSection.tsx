import React from 'react';
import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Heading,
  Icon,
  Button,
  Badge,
  Progress,
  SimpleGrid,
  Avatar,
  Circle,
  Flex,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaShare,
  FaTree,
  FaGlobeAmericas,
  FaInfoCircle,
  FaRegCheckCircle,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { MdStar, MdLocationOn, MdBusiness, MdTimeline } from 'react-icons/md';
import { usePointsStore } from '../store/pointsStore';
import { useToast } from '@chakra-ui/react';
import { BadgeCarousel } from './BadgeCarousel';
import { EnhancedTimeline } from './EnhancedTimeline';
import { ConsumerSustainabilityInfo } from './ConsumerSustainabilityInfo';
import defaultEstablishmentImage from 'assets/img/basic-auth.png';

interface ConsumerEngagementSectionProps {
  historyData: any;
  carbonData: any;
  loadingStage: string;
  onShare: () => void;
  onFeedback: () => void;
  onOffset: () => void;
  onEstablishmentStory: () => void;
}

export const ConsumerEngagementSection: React.FC<ConsumerEngagementSectionProps> = ({
  historyData,
  carbonData,
  loadingStage,
  onShare,
  onFeedback,
  onOffset,
  onEstablishmentStory
}) => {
  const { points } = usePointsStore();
  const toast = useToast();

  // Responsive utilities
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardPadding = useBreakpointValue({ base: 4, md: 6 });
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <VStack spacing={6} w="100%">
      {/* Enhanced Green Points Progress - High Priority for Consumer Engagement */}
      {loadingStage >= 'carbon' && (
        <Card w="100%" bg="white" borderRadius="lg" boxShadow="md" p={cardPadding}>
          <VStack spacing={4}>
            <HStack spacing={2} w="100%" justify="space-between">
              <HStack>
                <Icon as={FaLeaf} color="green.500" boxSize={5} />
                <Text fontWeight="bold" fontSize="lg">
                  Green Points
                </Text>
              </HStack>
              <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                {points} points
              </Badge>
            </HStack>

            <Box w="100%">
              <Flex justify="space-between" mb={2}>
                <Text fontSize="sm" color="gray.600">
                  Progress to next reward
                </Text>
                <Text fontSize="sm" fontWeight="medium">
                  {points}/50 points
                </Text>
              </Flex>
              <Progress
                value={(points / 50) * 100}
                colorScheme="green"
                size="md"
                borderRadius="full"
              />
              <Text fontSize="xs" color="gray.500" mt={1} textAlign="center">
                Next reward: $5 eco-discount at 50 points
              </Text>
            </Box>

            {/* Quick Actions for Points */}
            <SimpleGrid columns={3} spacing={3} w="100%">
              <Button
                size="sm"
                leftIcon={<Icon as={FaShare} />}
                onClick={onShare}
                colorScheme="blue"
                variant="outline"
              >
                Share (+3)
              </Button>
              <Button
                size="sm"
                leftIcon={<Icon as={MdStar} />}
                onClick={onFeedback}
                colorScheme="yellow"
                variant="outline"
              >
                Rate (+2)
              </Button>
              <Button
                size="sm"
                leftIcon={<Icon as={FaTree} />}
                onClick={onOffset}
                colorScheme="green"
                variant="outline"
              >
                Offset (+5)
              </Button>
            </SimpleGrid>
          </VStack>
        </Card>
      )}

      {/* Establishment Story Card - Consumer Engagement Priority */}
      {loadingStage >= 'carbon' && historyData?.establishment && (
        <Card w="100%" bg="white" borderRadius="lg" boxShadow="md" p={cardPadding}>
          <VStack spacing={4}>
            <HStack spacing={3} w="100%" align="start">
              <Avatar
                size="lg"
                src={historyData.establishment.image || defaultEstablishmentImage}
                name={historyData.establishment.name}
              />
              <VStack align="start" flex={1} spacing={1}>
                <Heading size="md" color={textColor}>
                  {historyData.establishment.name}
                </Heading>
                <HStack>
                  <Icon as={MdLocationOn} color="gray.500" />
                  <Text fontSize="sm" color="gray.600">
                    {historyData.establishment.city}, {historyData.establishment.state}
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FaRegCheckCircle} color="green.500" />
                  <Text fontSize="sm" color="green.600" fontWeight="medium">
                    Verified Sustainable Producer
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            <Text fontSize="sm" color="gray.700" textAlign="left" noOfLines={3}>
              {historyData.establishment.about ||
                `${historyData.establishment.name} is committed to sustainable farming practices that reduce environmental impact while maintaining high-quality production.`}
            </Text>

            <Button
              leftIcon={<Icon as={MdBusiness} />}
              onClick={onEstablishmentStory}
              colorScheme="blue"
              variant="outline"
              size="sm"
              w="100%"
            >
              Learn Their Sustainability Story (+2 points)
            </Button>
          </VStack>
        </Card>
      )}

      {/* Sustainability Badges - Enhanced Display */}
      {loadingStage >= 'carbon' && carbonData?.badges && carbonData.badges.length > 0 && (
        <Card w="100%" bg="white" borderRadius="lg" boxShadow="md" p={cardPadding}>
          <VStack spacing={4}>
            <HStack spacing={2} w="100%">
              <Icon as={FaRegCheckCircle} color="yellow.500" boxSize={5} />
              <Heading size="md">Sustainability Achievements</Heading>
            </HStack>
            <BadgeCarousel badges={carbonData.badges} showCarouselControls={!isMobile} />
          </VStack>
        </Card>
      )}

      {/* Enhanced Timeline - Production Journey */}
      {loadingStage >= 'timeline' && historyData?.events && historyData.events.length > 0 && (
        <Card w="100%" bg="white" borderRadius="lg" boxShadow="md" p={cardPadding}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={2}>
              <Icon as={MdTimeline} color="blue.500" boxSize={5} />
              <Heading size="md">Production Journey</Heading>
            </HStack>

            <Text fontSize="sm" color="gray.600" mb={4}>
              Follow this product's sustainable journey from farm to your table
            </Text>

            <EnhancedTimeline
              events={historyData.events}
              showCarbonImpact={true}
              isConsumerView={true}
            />
          </VStack>
        </Card>
      )}

      {/* Educational Content - Consumer Sustainability Info */}
      {loadingStage >= 'complete' && (
        <Card w="100%" bg="white" borderRadius="lg" boxShadow="md" p={cardPadding}>
          <ConsumerSustainabilityInfo
            carbonScore={carbonData?.carbonScore || 0}
            footprint={carbonData?.netFootprint || 0}
            practices={carbonData?.sustainabilityPractices || []}
          />
        </Card>
      )}

      {/* Social Proof and Community Impact */}
      {loadingStage >= 'complete' && (
        <Card w="100%" bg="white" borderRadius="lg" boxShadow="md" p={cardPadding}>
          <VStack spacing={4}>
            <HStack spacing={2} w="100%">
              <Icon as={FaGlobeAmericas} color="blue.500" boxSize={5} />
              <Heading size="md">Community Impact</Heading>
            </HStack>

            <SimpleGrid columns={2} spacing={4} w="100%">
              <VStack>
                <Circle size="60px" bg="green.100">
                  <Icon as={FaLeaf} color="green.500" boxSize={6} />
                </Circle>
                <Text fontSize="sm" fontWeight="bold">
                  5,247 scans
                </Text>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  People learned about this product
                </Text>
              </VStack>

              <VStack>
                <Circle size="60px" bg="blue.100">
                  <Icon as={FaTree} color="blue.500" boxSize={6} />
                </Circle>
                <Text fontSize="sm" fontWeight="bold">
                  127 kg CO₂e
                </Text>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Community offset total
                </Text>
              </VStack>
            </SimpleGrid>

            <Box p={4} bg="blue.50" borderRadius="md" w="100%">
              <HStack>
                <Icon as={FaInfoCircle} color="blue.600" />
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="blue.600">
                    Make an Impact!
                  </Text>
                  <Text fontSize="xs" color="blue.600">
                    Join 847 others who've taken action on sustainable products this month.
                  </Text>
                </Box>
              </HStack>
            </Box>
          </VStack>
        </Card>
      )}
    </VStack>
  );
};
