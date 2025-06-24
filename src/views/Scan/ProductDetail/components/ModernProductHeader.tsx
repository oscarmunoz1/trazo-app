import React from 'react';
import {
  Box,
  Badge,
  Button,
  HStack,
  VStack,
  Circle,
  Icon,
  Text,
  Heading,
  Container,
  IconButton,
  useColorModeValue,
  useBreakpointValue,
  useToast
} from '@chakra-ui/react';
import { FaLeaf, FaShare, FaLightbulb, FaHeart, FaStar } from 'react-icons/fa';
import { MdLocationOn, MdScience } from 'react-icons/md';
import { BsShieldCheck, BsTrophy } from 'react-icons/bs';
import { BlockchainVerificationBadge } from '../../../../components/BlockchainVerificationBadge';

interface ModernProductHeaderProps {
  productName: string;
  location: string;
  carbonScore: number;
  confidenceScore: number;
  isUSDAVerified: boolean;
  eventsCount: number;
  productionId: string;
  isAuthenticated?: boolean;
  onEducationOpen: (topic: string) => void;
  onReviewOpen: () => void;
  onAuthPromptOpen: () => void;
  onShare: () => void;
}

export const ModernProductHeader: React.FC<ModernProductHeaderProps> = ({
  productName,
  location,
  carbonScore,
  confidenceScore,
  isUSDAVerified,
  eventsCount,
  productionId,
  isAuthenticated = false,
  onEducationOpen,
  onReviewOpen,
  onAuthPromptOpen,
  onShare
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('green.500', 'green.400');
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      onAuthPromptOpen();
      return;
    }
    onReviewOpen();
  };

  return (
    <Box
      bgGradient="linear(to-br, green.50, blue.50)"
      borderBottomRadius="3xl"
      overflow="hidden"
      position="relative"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="radial-gradient(circle, rgba(72, 187, 120, 0.05) 1px, transparent 1px)"
        bgSize="20px 20px"
      />

      <Container maxW="container.xl" py={8} position="relative">
        <VStack spacing={6} align="stretch">
          {/* Header with Share Button */}
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={2} flex={1}>
              {/* Trust Indicators */}
              <HStack spacing={2} flexWrap="wrap">
                {isUSDAVerified && (
                  <Badge
                    colorScheme="green"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={BsShieldCheck} boxSize={3} />
                    USDA Verified
                  </Badge>
                )}
                {confidenceScore >= 90 && (
                  <Badge
                    colorScheme="blue"
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={MdScience} boxSize={3} />
                    {Math.round(confidenceScore)}% Accuracy
                  </Badge>
                )}
                <BlockchainVerificationBadge />
              </HStack>

              {/* Product Title */}
              <Heading as="h1" size="2xl" color={textColor} fontWeight="bold" lineHeight="shorter">
                {productName}
              </Heading>

              {/* Subtitle with Location */}
              <HStack color={mutedColor} fontSize="lg">
                <Icon as={MdLocationOn} />
                <Text>{location}</Text>
              </HStack>
            </VStack>

            {/* Share Button */}
            <IconButton
              aria-label="Share product"
              icon={<Icon as={FaShare} />}
              colorScheme="green"
              variant="ghost"
              size="lg"
              borderRadius="full"
              onClick={onShare}
            />
          </HStack>

          {/* Carbon Score Hero */}
          <Box bg={cardBg} shadow="xl" borderRadius="2xl" overflow="hidden" p={8}>
            <HStack
              spacing={8}
              align="center"
              justify="space-between"
              flexDir={{ base: 'column', lg: 'row' }}
            >
              {/* Carbon Score Display */}
              <VStack spacing={4} align="center">
                <Box position="relative">
                  <Circle
                    size="200px"
                    bg="green.50"
                    border="8px solid"
                    borderColor="green.200"
                    position="relative"
                  >
                    <VStack spacing={1}>
                      <Heading size="4xl" color="green.600" fontWeight="black">
                        {carbonScore}
                      </Heading>
                      <Text fontSize="lg" color="green.600" fontWeight="semibold">
                        Carbon Score
                      </Text>
                    </VStack>

                    {/* Achievement Badge */}
                    {carbonScore >= 80 && (
                      <Badge
                        position="absolute"
                        top="-10px"
                        right="-10px"
                        colorScheme="gold"
                        variant="solid"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Icon as={BsTrophy} boxSize={3} />
                        Excellent!
                      </Badge>
                    )}
                  </Circle>
                </Box>

                {/* Quick Stats */}
                <HStack spacing={6} textAlign="center">
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                      {eventsCount}
                    </Text>
                    <Text fontSize="sm" color={mutedColor}>
                      Verified Events
                    </Text>
                  </VStack>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                      {Math.round(confidenceScore)}%
                    </Text>
                    <Text fontSize="sm" color={mutedColor}>
                      Data Accuracy
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

              {/* Value Propositions */}
              <VStack spacing={4} align="stretch" flex={1}>
                <Heading size="lg" color={textColor}>
                  Why This Matters
                </Heading>

                <VStack spacing={3} align="stretch">
                  <HStack spacing={4} align="start">
                    <Circle size="40px" bg="green.100">
                      <Icon as={FaLeaf} color="green.600" />
                    </Circle>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" color={textColor}>
                        Climate Impact
                      </Text>
                      <Text fontSize="sm" color={mutedColor}>
                        Every purchase supports sustainable farming practices
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={4} align="start">
                    <Circle size="40px" bg="blue.100">
                      <Icon as={MdScience} color="blue.600" />
                    </Circle>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" color={textColor}>
                        USDA Verified
                      </Text>
                      <Text fontSize="sm" color={mutedColor}>
                        Data backed by official government standards
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack spacing={4} align="start">
                    <Circle size="40px" bg="purple.100">
                      <Icon as={BsShieldCheck} color="purple.600" />
                    </Circle>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" color={textColor}>
                        Blockchain Verified
                      </Text>
                      <Text fontSize="sm" color={mutedColor}>
                        Immutable proof of sustainability claims
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>

                {/* CTA Buttons */}
                <HStack spacing={3} pt={4}>
                  <Button
                    colorScheme="green"
                    size="lg"
                    leftIcon={<Icon as={FaLightbulb} />}
                    onClick={() => onEducationOpen('carbon_impact')}
                    borderRadius="full"
                    flex={1}
                  >
                    Learn More
                  </Button>

                  <Button
                    variant="outline"
                    colorScheme="green"
                    size="lg"
                    leftIcon={<Icon as={isAuthenticated ? FaStar : FaHeart} />}
                    onClick={handleReviewClick}
                    borderRadius="full"
                    flex={1}
                  >
                    {isAuthenticated ? 'Leave Review' : 'Quick Feedback'}
                  </Button>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
