import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Icon,
  Progress,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
  useColorModeValue,
  Heading,
  Divider,
  Avatar,
  Tooltip,
  keyframes,
  Center
} from '@chakra-ui/react';
import {
  FaTrophy,
  FaLeaf,
  FaStar,
  FaMedal,
  FaRecycle,
  FaSeedling,
  FaGlobe,
  FaHeart,
  FaShare,
  FaFire,
  FaCrown,
  FaGem
} from 'react-icons/fa';
import { useIntl } from 'react-intl';
import confetti from 'canvas-confetti';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.8); }
`;

const slideInUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType;
  category: 'carbon' | 'engagement' | 'social' | 'milestone' | 'streak';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  progress: number; // 0-100
  threshold: number;
  isUnlocked: boolean;
  isNew?: boolean;
  unlockedAt?: string;
  carbonImpact?: number; // kg CO2e saved
  pointsAwarded?: number;
}

export interface CarbonMilestone {
  id: string;
  name: string;
  description: string;
  targetReduction: number; // kg CO2e
  currentReduction: number; // kg CO2e
  isCompleted: boolean;
  completedAt?: string;
  rewards: {
    points: number;
    badge?: string;
    title?: string;
  };
}

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  newAchievements: Achievement[];
  carbonMilestones: CarbonMilestone[];
  userStats: {
    totalScans: number;
    totalCarbonSaved: number;
    streakDays: number;
    socialShares: number;
    level: number;
    nextLevelPoints: number;
    currentPoints: number;
  };
  onShare?: (achievement: Achievement) => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  achievements,
  newAchievements,
  carbonMilestones,
  userStats,
  onShare
}) => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<'achievements' | 'milestones' | 'stats'>(
    'achievements'
  );
  const [celebrationShown, setCelebrationShown] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBg = useColorModeValue('gray.50', 'gray.700');

  // Trigger celebration for new achievements
  useEffect(() => {
    if (isOpen && newAchievements.length > 0 && !celebrationShown) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#48BB78', '#38A169', '#68D391', '#9AE6B4']
        });
      }, 300);
      setCelebrationShown(true);
    }
  }, [isOpen, newAchievements, celebrationShown]);

  // Reset celebration state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCelebrationShown(false);
    }
  }, [isOpen]);

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'gray';
      case 'uncommon':
        return 'green';
      case 'rare':
        return 'blue';
      case 'epic':
        return 'purple';
      case 'legendary':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'carbon':
        return FaLeaf;
      case 'engagement':
        return FaHeart;
      case 'social':
        return FaShare;
      case 'milestone':
        return FaTrophy;
      case 'streak':
        return FaFire;
      default:
        return FaStar;
    }
  };

  const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const isNew = achievement.isNew;
    const rarityColor = getRarityColor(achievement.rarity);
    const CategoryIcon = getCategoryIcon(achievement.category);

    return (
      <Card
        bg={achievement.isUnlocked ? cardBg : 'gray.100'}
        borderWidth={isNew ? '2px' : '1px'}
        borderColor={isNew ? 'gold' : borderColor}
        opacity={achievement.isUnlocked ? 1 : 0.6}
        position="relative"
        transition="all 0.3s ease"
        _hover={{
          transform: achievement.isUnlocked ? 'translateY(-2px)' : 'none',
          boxShadow: achievement.isUnlocked ? 'lg' : 'none'
        }}
        animation={isNew ? `${pulse} 2s infinite` : undefined}
      >
        {isNew && (
          <Box
            position="absolute"
            top="-2px"
            right="-2px"
            bg="gold"
            color="white"
            fontSize="xs"
            px={2}
            py={1}
            borderRadius="full"
            fontWeight="bold"
            animation={`${sparkle} 1.5s infinite`}
          >
            NEW!
          </Box>
        )}

        <CardBody p={4}>
          <VStack spacing={3} align="center">
            <Box position="relative">
              <Avatar
                bg={`${rarityColor}.500`}
                icon={<Icon as={achievement.icon} color="white" boxSize={6} />}
                size="lg"
              />
              <Icon
                as={CategoryIcon}
                position="absolute"
                bottom="-2px"
                right="-2px"
                bg="white"
                color={`${rarityColor}.500`}
                borderRadius="full"
                p={1}
                boxSize={6}
                border="2px solid white"
              />
            </Box>

            <VStack spacing={1} align="center">
              <HStack spacing={2}>
                <Text fontWeight="bold" fontSize="sm" textAlign="center" color={textColor}>
                  {achievement.name}
                </Text>
                <Badge colorScheme={rarityColor} size="sm">
                  {achievement.rarity}
                </Badge>
              </HStack>

              <Text fontSize="xs" color="gray.500" textAlign="center" noOfLines={2}>
                {achievement.description}
              </Text>
            </VStack>

            {!achievement.isUnlocked && (
              <Box w="100%">
                <Progress
                  value={achievement.progress}
                  size="sm"
                  colorScheme={rarityColor}
                  borderRadius="full"
                />
                <Text fontSize="xs" color="gray.500" textAlign="center" mt={1}>
                  {achievement.progress}% (
                  {Math.floor((achievement.threshold * achievement.progress) / 100)}/
                  {achievement.threshold})
                </Text>
              </Box>
            )}

            {achievement.isUnlocked && achievement.pointsAwarded && (
              <Badge colorScheme="green" variant="subtle">
                +{achievement.pointsAwarded} points
              </Badge>
            )}

            {achievement.isUnlocked && onShare && (
              <Button
                size="xs"
                colorScheme={rarityColor}
                variant="outline"
                leftIcon={<Icon as={FaShare} />}
                onClick={() => onShare(achievement)}
              >
                Share
              </Button>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const CarbonMilestoneCard: React.FC<{ milestone: CarbonMilestone }> = ({ milestone }) => (
    <Card
      bg={milestone.isCompleted ? 'green.50' : cardBg}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardBody p={4}>
        <VStack spacing={3}>
          <HStack spacing={3} w="100%">
            <Icon
              as={milestone.isCompleted ? FaMedal : FaLeaf}
              color={milestone.isCompleted ? 'gold' : 'green.500'}
              boxSize={6}
            />
            <VStack flex={1} align="start" spacing={1}>
              <Text fontWeight="bold" fontSize="sm" color={textColor}>
                {milestone.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {milestone.description}
              </Text>
            </VStack>
            {milestone.isCompleted && (
              <Badge colorScheme="green" variant="solid">
                Completed!
              </Badge>
            )}
          </HStack>

          <Box w="100%">
            <Flex justify="space-between" mb={2}>
              <Text fontSize="xs" color="gray.500">
                Progress: {milestone.currentReduction.toFixed(1)} / {milestone.targetReduction} kg
                CO₂e
              </Text>
              <Text fontSize="xs" color="gray.500">
                {Math.round((milestone.currentReduction / milestone.targetReduction) * 100)}%
              </Text>
            </Flex>
            <Progress
              value={(milestone.currentReduction / milestone.targetReduction) * 100}
              size="sm"
              colorScheme="green"
              borderRadius="full"
            />
          </Box>

          {milestone.rewards && (
            <HStack spacing={2} w="100%">
              <Badge colorScheme="blue" variant="outline">
                +{milestone.rewards.points} points
              </Badge>
              {milestone.rewards.badge && (
                <Badge colorScheme="purple" variant="outline">
                  {milestone.rewards.badge}
                </Badge>
              )}
              {milestone.rewards.title && (
                <Badge colorScheme="orange" variant="outline">
                  {milestone.rewards.title}
                </Badge>
              )}
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="green.500" color="white" borderTopRadius="md">
          <HStack spacing={3}>
            <Icon as={FaTrophy} />
            <Text>Your Achievements</Text>
            {newAchievements.length > 0 && (
              <Badge bg="gold" color="white" animation={`${sparkle} 1s infinite`}>
                {newAchievements.length} New!
              </Badge>
            )}
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody p={0}>
          {/* Tab Navigation */}
          <HStack spacing={0} borderBottom="1px" borderColor={borderColor}>
            {[
              { key: 'achievements', label: 'Achievements', icon: FaTrophy },
              { key: 'milestones', label: 'Carbon Goals', icon: FaLeaf },
              { key: 'stats', label: 'Your Stats', icon: FaGem }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant="ghost"
                flex={1}
                py={4}
                borderRadius={0}
                bg={activeTab === tab.key ? 'green.50' : 'transparent'}
                borderBottom={activeTab === tab.key ? '2px solid' : 'none'}
                borderColor="green.500"
                leftIcon={<Icon as={tab.icon} />}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </Button>
            ))}
          </HStack>

          <Box p={6}>
            {/* New Achievements Celebration */}
            {activeTab === 'achievements' && newAchievements.length > 0 && (
              <Box mb={6} animation={`${slideInUp} 0.5s ease-out`}>
                <Heading size="md" color="green.500" mb={3} textAlign="center">
                  🎉 Congratulations! 🎉
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  {newAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </SimpleGrid>
                <Divider my={4} />
              </Box>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <VStack spacing={6}>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4} w="100%">
                  {achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </SimpleGrid>
              </VStack>
            )}

            {/* Carbon Milestones Tab */}
            {activeTab === 'milestones' && (
              <VStack spacing={4}>
                {carbonMilestones.map((milestone) => (
                  <CarbonMilestoneCard key={milestone.id} milestone={milestone} />
                ))}
              </VStack>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <VStack spacing={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                  <Card bg={cardBg}>
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaGlobe} color="blue.500" boxSize={8} />
                        <Text fontWeight="bold" fontSize="lg" color={textColor}>
                          Total Carbon Saved
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="green.500">
                          {userStats.totalCarbonSaved.toFixed(1)} kg CO₂e
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          Equivalent to driving {(userStats.totalCarbonSaved * 2.5).toFixed(1)}{' '}
                          fewer miles
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg}>
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaFire} color="orange.500" boxSize={8} />
                        <Text fontWeight="bold" fontSize="lg" color={textColor}>
                          Current Streak
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                          {userStats.streakDays} days
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          Keep scanning to maintain your streak!
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg}>
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaHeart} color="red.500" boxSize={8} />
                        <Text fontWeight="bold" fontSize="lg" color={textColor}>
                          Products Scanned
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="red.500">
                          {userStats.totalScans}
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          You're making a difference, one scan at a time
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg}>
                    <CardBody>
                      <VStack spacing={3}>
                        <Icon as={FaShare} color="purple.500" boxSize={8} />
                        <Text fontWeight="bold" fontSize="lg" color={textColor}>
                          Social Impact
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                          {userStats.socialShares}
                        </Text>
                        <Text fontSize="sm" color="gray.500" textAlign="center">
                          Times you've shared sustainability stories
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Level Progress */}
                <Card bg={cardBg} w="100%">
                  <CardBody>
                    <VStack spacing={4}>
                      <HStack spacing={3}>
                        <Icon as={FaCrown} color="gold" boxSize={6} />
                        <Text fontWeight="bold" fontSize="lg" color={textColor}>
                          Level {userStats.level} Eco-Warrior
                        </Text>
                      </HStack>

                      <Box w="100%">
                        <Flex justify="space-between" mb={2}>
                          <Text fontSize="sm" color="gray.500">
                            {userStats.currentPoints} / {userStats.nextLevelPoints} points
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Level {userStats.level + 1}
                          </Text>
                        </Flex>
                        <Progress
                          value={(userStats.currentPoints / userStats.nextLevelPoints) * 100}
                          size="lg"
                          colorScheme="purple"
                          borderRadius="full"
                        />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={onClose}>
            Continue Your Journey
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
