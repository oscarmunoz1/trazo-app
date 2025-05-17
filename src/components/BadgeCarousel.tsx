import React from 'react';
import { Box, Flex, Image, Text, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  isVerified?: boolean;
}

interface BadgeCarouselProps {
  badges: Badge[];
  onBadgeClick?: (badge: Badge) => void;
}

export const BadgeCarousel: React.FC<BadgeCarouselProps> = ({ badges, onBadgeClick }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsPerPage = useBreakpointValue({ base: 1, md: 3, lg: 4 }) || 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + itemsPerPage >= badges.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerPage < 0
        ? Math.max(0, badges.length - itemsPerPage)
        : prevIndex - itemsPerPage
    );
  };

  const visibleBadges = badges.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <Box position="relative" width="100%" px={4}>
      <Flex direction="row" align="center" justify="space-between" width="100%" position="relative">
        <IconButton
          aria-label="Previous badges"
          icon={<ChevronLeftIcon />}
          onClick={prevSlide}
          position="absolute"
          left="-2"
          zIndex={2}
          variant="ghost"
          isDisabled={currentIndex === 0}
        />

        <Flex gap={4} width="100%" justify="center" align="center" overflow="hidden">
          {visibleBadges.map((badge) => (
            <Box
              key={badge.id}
              p={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
              cursor={onBadgeClick ? 'pointer' : 'default'}
              onClick={() => onBadgeClick?.(badge)}
              _hover={{ shadow: 'md' }}
              transition="all 0.2s"
              textAlign="center"
              minW="120px">
              <Image src={badge.icon} alt={badge.name} boxSize="60px" mx="auto" mb={2} />
              <Text fontWeight="medium" fontSize="sm">
                {badge.name}
              </Text>
              {badge.isVerified && (
                <Text fontSize="xs" color="green.500" mt={1}>
                  USDA Verified
                </Text>
              )}
            </Box>
          ))}
        </Flex>

        <IconButton
          aria-label="Next badges"
          icon={<ChevronRightIcon />}
          onClick={nextSlide}
          position="absolute"
          right="-2"
          zIndex={2}
          variant="ghost"
          isDisabled={currentIndex + itemsPerPage >= badges.length}
        />
      </Flex>
    </Box>
  );
};
