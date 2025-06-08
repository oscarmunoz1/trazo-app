import React, { useEffect, useState } from 'react';
import {
  Flex,
  Grid,
  Text,
  useColorModeValue,
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Badge,
  Button,
  Progress,
  Circle,
  Container,
  useBreakpointValue
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import {
  FaQrcode,
  FaStar,
  FaLeaf,
  FaGift,
  FaTrophy,
  FaChartLine,
  FaEye,
  FaCalendar
} from 'react-icons/fa';
import { MdTimeline, MdEco, MdVerified } from 'react-icons/md';

// Step 5: Progressive Loading Imports
import {
  ProgressiveLoader,
  CarbonDashboardSkeleton,
  MobileListSkeleton
} from 'components/Loading/ProgressiveLoader';
import {
  usePerformanceMonitor,
  useProgressiveLoading,
  useMobileOptimization,
  useImagePreloader
} from 'hooks/usePerformanceMonitor';

// Import gamification store
import { usePointsStore } from 'store/pointsStore';

export default function ConsumerDashboardView() {
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const iconBoxInside = useColorModeValue('white', 'white');
  const cardColor = useColorModeValue('white', 'gray.700');
  const bgGradient = useColorModeValue(
    'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
    'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)'
  );

  // Step 5: Progressive Loading Implementation for Consumer Experience
  const { metrics, markStageComplete, resetTimer } = usePerformanceMonitor();
  const { isMobile, optimizationStrategy } = useMobileOptimization();

  // Consumer-specific progressive loading configuration
  const progressiveConfig = {
    primaryQueries: ['user-profile', 'scan-history', 'points'], // Critical for immediate display
    secondaryQueries: ['recommendations', 'achievements', 'leaderboard'], // Enhanced features
    enableCache: true,
    targetTime: 3000 // 3-second target optimized for mobile QR scanning
  };

  const { stage, registerQueryLoad, isLoading, primaryLoaded } =
    useProgressiveLoading(progressiveConfig);

  // Mock data for consumer dashboard - in real app this would come from API
  const [userStats, setUserStats] = useState({
    totalScans: 0,
    totalPoints: 0,
    carbonOffset: '0',
    level: 1,
    nextLevelPoints: 100
  });

  // Type definitions for scan and achievement data
  interface RecentScan {
    id: number;
    product: string;
    score: number;
    date: Date;
  }

  interface Achievement {
    id: number;
    name: string;
    description: string;
    earned: boolean;
  }

  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Gamification integration
  const pointsStore = usePointsStore();

  // Mobile-first responsive design
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const cardSpacing = useBreakpointValue({ base: 4, md: 6 });
  const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  // Step 5: Preload critical images for faster rendering
  const criticalImages = ['/assets/img/qr-placeholder.png', '/assets/img/achievement-badge.png'];
  const { allLoaded: imagesLoaded } = useImagePreloader(criticalImages, true);

  useEffect(() => {
    window.scrollTo(0, 0);
    resetTimer(); // Reset performance timer

    // Step 5: Simulate progressive data loading
    const loadData = async () => {
      try {
        // Primary data - Critical for immediate display
        setTimeout(() => {
          const currentPoints = pointsStore.points || 15;
          setUserStats({
            totalScans: Math.floor(currentPoints / 5) || 3,
            totalPoints: currentPoints,
            carbonOffset: (currentPoints * 0.1).toFixed(2),
            level: Math.floor(currentPoints / 50) + 1,
            nextLevelPoints: 50 - (currentPoints % 50)
          });
          registerQueryLoad('user-profile', false, { loaded: true });
          registerQueryLoad('scan-history', false, { loaded: true });
          registerQueryLoad('points', false, { loaded: true });
        }, 500);

        // Secondary data - Enhancement features
        setTimeout(() => {
          setRecentScans([
            { id: 1, product: 'Organic Tomatoes', score: 95, date: new Date() },
            { id: 2, product: 'Free-Range Eggs', score: 88, date: new Date() },
            { id: 3, product: 'Local Honey', score: 92, date: new Date() }
          ]);
          setAchievements([
            { id: 1, name: 'Eco Warrior', description: 'Scanned 10 products', earned: true },
            { id: 2, name: 'Carbon Offset Hero', description: 'Offset 5kg CO2', earned: true },
            { id: 3, name: 'Sustainability Expert', description: 'Reach Level 5', earned: false }
          ]);
          registerQueryLoad('recommendations', false, { loaded: true });
          registerQueryLoad('achievements', false, { loaded: true });
          registerQueryLoad('leaderboard', false, { loaded: true });
        }, 1200);
      } catch (error) {
        console.error('Error loading consumer dashboard data:', error);
      }
    };

    loadData();
  }, [resetTimer, registerQueryLoad, pointsStore.points]);

  // Step 5: Show skeleton for initial loading
  if (stage === 'initial' && !primaryLoaded) {
    return <ProgressiveLoader stage={stage} type={isMobile ? 'mobile-list' : 'carbon'} />;
  }

  return (
    <Box bg={bgGradient} minH="100vh">
      <Container maxW="7xl" mx="auto" pt={{ base: '120px', md: '75px' }} pb={8}>
        {/* Step 5: Progressive Header - Shows immediately when primary data loads */}
        <VStack spacing={8} align="stretch">
          {/* Welcome Header */}
          <Box textAlign="center" py={8}>
            <VStack spacing={4}>
              <Circle size="80px" bg="green.100" color="green.600" mb={4}>
                <Icon as={FaLeaf} boxSize={10} />
              </Circle>
              <Heading size={isMobile ? 'lg' : 'xl'} color={mainText} fontWeight="bold">
                Welcome to Trazo
              </Heading>
              <Text
                fontSize={isMobile ? 'md' : 'lg'}
                color="gray.600"
                textAlign="center"
                maxW="600px"
              >
                Track your sustainability impact and earn rewards for making eco-friendly choices
              </Text>
            </VStack>
          </Box>

          {/* Step 5: Priority Stats Grid - Loads first for immediate value */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={cardSpacing}>
            <Card boxShadow="lg" borderRadius="xl">
              <CardBody p={6} textAlign="center">
                <VStack spacing={3}>
                  <Circle size="50px" bg="blue.100" color="blue.600">
                    <Icon as={FaQrcode} boxSize={6} />
                  </Circle>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={mainText}>
                      {userStats.totalScans}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Products Scanned
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            <Card boxShadow="lg" borderRadius="xl">
              <CardBody p={6} textAlign="center">
                <VStack spacing={3}>
                  <Circle size="50px" bg="yellow.100" color="yellow.600">
                    <Icon as={FaStar} boxSize={6} />
                  </Circle>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={mainText}>
                      {userStats.totalPoints}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Green Points
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            <Card boxShadow="lg" borderRadius="xl">
              <CardBody p={6} textAlign="center">
                <VStack spacing={3}>
                  <Circle size="50px" bg="green.100" color="green.600">
                    <Icon as={FaLeaf} boxSize={6} />
                  </Circle>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={mainText}>
                      {userStats.carbonOffset}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      kg CO₂ Offset
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            <Card boxShadow="lg" borderRadius="xl">
              <CardBody p={6} textAlign="center">
                <VStack spacing={3}>
                  <Circle size="50px" bg="purple.100" color="purple.600">
                    <Icon as={FaTrophy} boxSize={6} />
                  </Circle>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={mainText}>
                      {userStats.level}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Eco Level
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Step 5: Level Progress - Shows with primary data */}
          <Card boxShadow="lg" borderRadius="xl">
            <CardBody p={6}>
              <VStack spacing={4}>
                <HStack justify="space-between" w="full">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color={mainText}>
                      Level {userStats.level} Progress
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {userStats.nextLevelPoints} points to next level
                    </Text>
                  </VStack>
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    Eco Warrior
                  </Badge>
                </HStack>
                <Progress
                  value={((50 - userStats.nextLevelPoints) / 50) * 100}
                  size="lg"
                  colorScheme="green"
                  borderRadius="full"
                  w="full"
                />
              </VStack>
            </CardBody>
          </Card>

          {/* Step 5: Secondary Content - Loads progressively for enhanced experience */}
          {(stage === 'secondary' || stage === 'complete') && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
              {/* Recent Scans */}
              <Card boxShadow="lg" borderRadius="xl">
                <CardHeader>
                  <HStack spacing={3}>
                    <Icon as={FaEye} color="blue.500" boxSize={5} />
                    <Heading size="md">Recent Scans</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    {recentScans.map((scan) => (
                      <HStack key={scan.id} w="full" p={3} bg="gray.50" borderRadius="lg">
                        <Circle size="40px" bg="green.100" color="green.600">
                          <Icon as={FaLeaf} boxSize={4} />
                        </Circle>
                        <VStack align="start" flex={1} spacing={1}>
                          <Text fontWeight="medium">{scan.product}</Text>
                          <HStack>
                            <Badge colorScheme="green">Score: {scan.score}</Badge>
                            <Text fontSize="xs" color="gray.500">
                              <Icon as={FaCalendar} mr={1} />
                              Today
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Achievements */}
              <Card boxShadow="lg" borderRadius="xl">
                <CardHeader>
                  <HStack spacing={3}>
                    <Icon as={FaTrophy} color="yellow.500" boxSize={5} />
                    <Heading size="md">Achievements</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    {achievements.map((achievement) => (
                      <HStack key={achievement.id} w="full" p={3} bg="gray.50" borderRadius="lg">
                        <Circle
                          size="40px"
                          bg={achievement.earned ? 'yellow.100' : 'gray.200'}
                          color={achievement.earned ? 'yellow.600' : 'gray.500'}
                        >
                          <Icon as={achievement.earned ? MdVerified : FaTrophy} boxSize={4} />
                        </Circle>
                        <VStack align="start" flex={1} spacing={1}>
                          <Text
                            fontWeight="medium"
                            color={achievement.earned ? mainText : 'gray.500'}
                          >
                            {achievement.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {achievement.description}
                          </Text>
                        </VStack>
                        {achievement.earned && <Badge colorScheme="yellow">Earned</Badge>}
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          )}

          {/* Step 5: Quick Actions - Always available for mobile QR scanning */}
          <Card boxShadow="lg" borderRadius="xl">
            <CardBody p={6}>
              <VStack spacing={4}>
                <Heading size="md" textAlign="center">
                  Quick Actions
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                  <Button
                    leftIcon={<FaQrcode />}
                    colorScheme="green"
                    size="lg"
                    height="80px"
                    flexDirection="column"
                    onClick={() => (window.location.href = '/scan')}
                  >
                    <Text>Scan Product</Text>
                    <Text fontSize="xs">+5 points</Text>
                  </Button>

                  <Button
                    leftIcon={<FaChartLine />}
                    colorScheme="blue"
                    variant="outline"
                    size="lg"
                    height="80px"
                    flexDirection="column"
                  >
                    <Text>View Impact</Text>
                    <Text fontSize="xs">See your stats</Text>
                  </Button>

                  <Button
                    leftIcon={<FaGift />}
                    colorScheme="purple"
                    variant="outline"
                    size="lg"
                    height="80px"
                    flexDirection="column"
                  >
                    <Text>Rewards</Text>
                    <Text fontSize="xs">Redeem points</Text>
                  </Button>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
