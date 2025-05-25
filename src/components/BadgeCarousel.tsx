import React, { useState } from 'react';
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  HStack,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Badge,
  Icon,
  SimpleGrid,
  Tooltip,
  Heading,
  Divider,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  TagLeftIcon
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from '@chakra-ui/icons';
import {
  FaAward,
  FaLeaf,
  FaCheckCircle,
  FaMedal,
  FaSeedling,
  FaWater,
  FaShippingFast,
  FaSun,
  FaInfoCircle,
  FaTrophy,
  FaCertificate,
  FaStar
} from 'react-icons/fa';

interface BadgeItem {
  id: string | number;
  name: string;
  description: string;
  icon?: string;
  isVerified?: boolean;
  category?: string;
  dateAchieved?: string;
  level?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface BadgeCarouselProps {
  badges: BadgeItem[];
  showCarouselControls?: boolean;
}

const getBadgeIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('carbon')) return FaLeaf;
  if (lowerName.includes('gold')) return FaMedal;
  if (lowerName.includes('silver')) return FaMedal;
  if (lowerName.includes('champion')) return FaAward;
  if (lowerName.includes('verified')) return FaCheckCircle;
  if (lowerName.includes('water')) return FaWater;
  if (lowerName.includes('transport')) return FaShippingFast;
  if (lowerName.includes('energy')) return FaSun;
  if (lowerName.includes('crop')) return FaSeedling;
  if (lowerName.includes('award')) return FaTrophy;
  if (lowerName.includes('certified')) return FaCertificate;
  return FaAward;
};

const getBadgeColor = (name: string, level?: string) => {
  const lowerName = name.toLowerCase();

  if (level) {
    switch (level.toLowerCase()) {
      case 'bronze':
        return 'orange';
      case 'silver':
        return 'gray';
      case 'gold':
        return 'yellow';
      case 'platinum':
        return 'purple';
      default:
        return 'green';
    }
  }

  if (lowerName.includes('carbon')) return 'green';
  if (lowerName.includes('water')) return 'blue';
  if (lowerName.includes('energy')) return 'yellow';
  if (lowerName.includes('sustainable')) return 'teal';
  if (lowerName.includes('organic')) return 'green';
  if (lowerName.includes('champion')) return 'purple';
  if (lowerName.includes('gold')) return 'yellow';
  if (lowerName.includes('silver')) return 'gray';
  return 'green';
};

export const BadgeCarousel: React.FC<BadgeCarouselProps> = ({
  badges,
  showCarouselControls = true
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [isViewingAll, setIsViewingAll] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleBadgeClick = (badge: BadgeItem) => {
    setSelectedBadge(badge);
    setIsViewingAll(false);
    onOpen();
  };

  const handleViewAll = () => {
    setSelectedBadge(null);
    setIsViewingAll(true);
    onOpen();
  };

  if (!badges || badges.length === 0) {
    return (
      <Box
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
        p={4}
        borderRadius="md"
        textAlign="center">
        <Text fontSize="sm" color="gray.500">
          No badges earned yet
        </Text>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      bg={bgColor}
      p={4}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}>
      <Heading size="sm" mb={4}>
        Sustainability Achievements
      </Heading>

      {/* Simple Badge Display */}
      <SimpleGrid
        columns={{ base: 2, sm: 3, md: badges.length < 4 ? badges.length : 4 }}
        spacing={3}
        mb={3}>
        {badges.map((badge) => {
          const BadgeIcon = getBadgeIcon(badge.name);
          const colorScheme = getBadgeColor(badge.name, badge.level);

          return (
            <Box
              key={badge.id}
              p={3}
              borderRadius="md"
              bg={`${colorScheme}.50`}
              borderWidth="1px"
              borderColor={`${colorScheme}.200`}
              cursor="pointer"
              onClick={() => handleBadgeClick(badge)}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
              transition="all 0.2s"
              textAlign="center">
              <VStack spacing={2}>
                <Icon as={BadgeIcon} boxSize={6} color={`${colorScheme}.500`} />
                <Text fontWeight="medium" fontSize="sm" noOfLines={2} textAlign="center">
                  {badge.name}
                </Text>
                {badge.isVerified && <Icon as={FaCheckCircle} color="green.500" boxSize={3} />}
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      {badges.length > 4 && (
        <Button size="sm" variant="link" onClick={handleViewAll} leftIcon={<InfoIcon />} mt={2}>
          View All Badges
        </Button>
      )}

      {/* Badge Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isViewingAll ? 'All Sustainability Badges' : selectedBadge?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {isViewingAll ? (
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={4}>
                {badges.map((badge) => {
                  const BadgeIcon = getBadgeIcon(badge.name);
                  const colorScheme = getBadgeColor(badge.name, badge.level);

                  return (
                    <Box
                      key={badge.id}
                      p={4}
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={`${colorScheme}.200`}
                      bg={`${colorScheme}.50`}>
                      <VStack>
                        <Icon as={BadgeIcon} boxSize={8} color={`${colorScheme}.500`} />
                        <Text fontWeight="bold">{badge.name}</Text>
                        <Text fontSize="sm" textAlign="center">
                          {badge.description}
                        </Text>
                      </VStack>
                    </Box>
                  );
                })}
              </SimpleGrid>
            ) : (
              selectedBadge && (
                <VStack spacing={4} align="stretch">
                  <Flex align="center" justify="center" mb={2}>
                    <Icon
                      as={getBadgeIcon(selectedBadge.name)}
                      boxSize={12}
                      color={`${getBadgeColor(selectedBadge.name, selectedBadge.level)}.500`}
                      mr={4}
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="xl">
                        {selectedBadge.name}
                      </Text>
                      {selectedBadge.dateAchieved && (
                        <Text fontSize="sm" color="gray.500">
                          Achieved on {selectedBadge.dateAchieved}
                        </Text>
                      )}
                      {selectedBadge.isVerified && (
                        <HStack>
                          <Icon as={FaCheckCircle} color="green.500" boxSize={3} />
                          <Text fontSize="sm" color="green.500">
                            Verified
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Flex>

                  <Divider />

                  <Text>{selectedBadge.description}</Text>
                </VStack>
              )
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
