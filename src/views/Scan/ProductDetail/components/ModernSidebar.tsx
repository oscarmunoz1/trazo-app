import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Circle,
  Icon,
  Text,
  Heading,
  Button,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { FaCoins, FaGift, FaStar, FaHeart, FaAward, FaMedal, FaChartLine } from 'react-icons/fa';
import { CarbonImpactVisualizer } from '../../../../components/Education';

interface ModernSidebarProps {
  isAuthenticated: boolean;
  productName?: string;
  carbonScore: number;
  onAuthPrompt: () => void;
  onNavigateToAchievements: () => void;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isAuthenticated,
  productName,
  carbonScore,
  onAuthPrompt,
  onNavigateToAchievements
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack spacing={6} align="stretch">
      {/* Gamification Section - Only for Authenticated Users */}
      {isAuthenticated && (
        <Card bg={cardBg} shadow="lg" borderRadius="xl">
          <CardHeader>
            <HStack spacing={3}>
              <Circle size="40px" bg="yellow.100">
                <Icon as={FaCoins} color="yellow.600" />
              </Circle>
              <VStack align="start" spacing={0}>
                <Heading size="sm" color={textColor}>
                  Green Points
                </Heading>
                <Text fontSize="xs" color={mutedColor}>
                  Earn rewards for engagement
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={3} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="sm">Review this product</Text>
                <Badge colorScheme="green">+100 pts</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Share with friends</Text>
                <Badge colorScheme="blue">+50 pts</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Learn about sustainability</Text>
                <Badge colorScheme="purple">+25 pts</Badge>
              </HStack>

              <Button
                size="sm"
                colorScheme="green"
                leftIcon={<Icon as={FaMedal} />}
                onClick={onNavigateToAchievements}
              >
                View Achievements
              </Button>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Quick Actions for Non-Authenticated Users */}
      {!isAuthenticated && (
        <Card bg={cardBg} shadow="lg" borderRadius="xl">
          <CardHeader>
            <HStack spacing={3}>
              <Circle size="40px" bg="green.100">
                <Icon as={FaGift} color="green.600" />
              </Circle>
              <VStack align="start" spacing={0}>
                <Heading size="sm" color={textColor}>
                  Join Trazo Community
                </Heading>
                <Text fontSize="xs" color={mutedColor}>
                  Unlock rewards and detailed reviews
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" color={mutedColor}>
                Create an account to:
              </Text>

              <VStack spacing={2} align="stretch" fontSize="sm">
                <HStack>
                  <Icon as={FaStar} color="yellow.500" boxSize={3} />
                  <Text>Leave detailed reviews</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCoins} color="green.500" boxSize={3} />
                  <Text>Earn green points</Text>
                </HStack>
                <HStack>
                  <Icon as={FaAward} color="blue.500" boxSize={3} />
                  <Text>Unlock achievements</Text>
                </HStack>
                <HStack>
                  <Icon as={FaHeart} color="red.500" boxSize={3} />
                  <Text>Save favorite products</Text>
                </HStack>
              </VStack>

              <Button colorScheme="green" size="sm" onClick={onAuthPrompt} borderRadius="full">
                Sign Up Free
              </Button>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Carbon Impact Visualization */}
      <Card bg={cardBg} shadow="lg" borderRadius="xl">
        <CardHeader>
          <HStack spacing={3}>
            <Circle size="40px" bg="green.100">
              <Icon as={FaChartLine} color="green.600" />
            </Circle>
            <VStack align="start" spacing={0}>
              <Heading size="sm" color={textColor}>
                Environmental Impact
              </Heading>
              <Text fontSize="xs" color={mutedColor}>
                Your choice makes a difference
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="medium">
                Carbon Score
              </Text>
              <Badge colorScheme="green" fontSize="lg" px={3} py={1} borderRadius="full">
                {carbonScore}/100
              </Badge>
            </HStack>
            <Text fontSize="xs" color={mutedColor}>
              {carbonScore >= 80
                ? 'Excellent! This product has a very low carbon footprint.'
                : carbonScore >= 60
                ? 'Good carbon performance. Above average sustainability.'
                : 'Carbon footprint data helps you make informed choices.'}
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
