import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useColorModeValue,
  Icon,
  Fade,
  ScaleFade,
  Container,
  Badge
} from '@chakra-ui/react';
import { FaLeaf, FaQrcode, FaCheckCircle, FaSeedling, FaRecycle } from 'react-icons/fa';
import { MdEco, MdVerified } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface CleanLoadingScreenProps {
  loadingStage: 'scanning' | 'carbon-score' | 'product-details' | 'complete';
  quickCarbonData?: {
    carbonScore?: number;
    productName?: string;
  };
  showProgressBar?: boolean;
  isMobile?: boolean;
}

export const CleanLoadingScreen: React.FC<CleanLoadingScreenProps> = ({
  loadingStage,
  quickCarbonData,
  showProgressBar = true,
  isMobile = false
}) => {
  const intl = useIntl();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const primaryColor = useColorModeValue('green.500', 'green.300');

  // Eco-friendly loading tips
  const ecoTips = [
    {
      icon: FaLeaf,
      text:
        intl.formatMessage({ id: 'loading.tip.carbonScore' }) ||
        'Every scan helps track your carbon footprint'
    },
    {
      icon: FaRecycle,
      text:
        intl.formatMessage({ id: 'loading.tip.recycling' }) ||
        'Look for recycling information in product details'
    },
    {
      icon: FaSeedling,
      text:
        intl.formatMessage({ id: 'loading.tip.sustainability' }) ||
        'Support sustainable farming practices'
    },
    {
      icon: MdEco,
      text:
        intl.formatMessage({ id: 'loading.tip.greenChoice' }) ||
        'Making greener choices makes a difference'
    }
  ];

  // Rotate tips every 3 seconds during loading
  useEffect(() => {
    if (loadingStage !== 'complete') {
      const interval = setInterval(() => {
        setShowTip(false);
        setTimeout(() => {
          setCurrentTipIndex((prev) => (prev + 1) % ecoTips.length);
          setShowTip(true);
        }, 300);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [loadingStage, ecoTips.length]);

  const getStageInfo = () => {
    switch (loadingStage) {
      case 'scanning':
        return {
          message: intl.formatMessage({ id: 'loading.scanning' }) || 'Scanning product...',
          icon: FaQrcode,
          progress: 25,
          color: 'blue'
        };
      case 'carbon-score':
        return {
          message:
            intl.formatMessage({ id: 'loading.carbonScore' }) || 'Loading sustainability data...',
          icon: FaLeaf,
          progress: 60,
          color: 'green'
        };
      case 'product-details':
        return {
          message:
            intl.formatMessage({ id: 'loading.productDetails' }) ||
            'Loading product information...',
          icon: MdVerified,
          progress: 85,
          color: 'purple'
        };
      case 'complete':
        return {
          message: intl.formatMessage({ id: 'loading.complete' }) || 'Ready!',
          icon: FaCheckCircle,
          progress: 100,
          color: 'green'
        };
      default:
        return {
          message: 'Loading...',
          icon: FaLeaf,
          progress: 0,
          color: 'gray'
        };
    }
  };

  const stageInfo = getStageInfo();

  // Quick carbon score preview (show immediately when available)
  if (quickCarbonData && loadingStage === 'carbon-score') {
    return (
      <Container maxW="md" py={isMobile ? 4 : 8}>
        <ScaleFade in={true} initialScale={0.9}>
          <Box
            bg={bgColor}
            borderRadius="xl"
            border="1px solid"
            borderColor={borderColor}
            p={6}
            textAlign="center"
            boxShadow="lg"
          >
            <VStack spacing={4}>
              {/* Quick carbon score preview */}
              <Box>
                <Icon as={FaLeaf} color={primaryColor} boxSize={8} mb={2} />
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {quickCarbonData.productName || 'Product'}
                </Text>
                <HStack justify="center" mt={2}>
                  <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
                    Carbon Score: {quickCarbonData.carbonScore || '--'}
                  </Badge>
                </HStack>
              </Box>

              {/* Loading additional details */}
              <VStack spacing={3} w="full">
                <Text fontSize="sm" color={textColor}>
                  Loading complete sustainability report...
                </Text>
                <Progress
                  value={75}
                  colorScheme="green"
                  size="md"
                  borderRadius="full"
                  w="full"
                  isAnimated
                />
              </VStack>

              {/* Loading skeletons for upcoming content */}
              <VStack spacing={2} w="full" mt={4}>
                <Skeleton height="20px" width="80%" borderRadius="md" />
                <Skeleton height="15px" width="60%" borderRadius="md" />
                <HStack w="full" spacing={2}>
                  <SkeletonCircle size="8" />
                  <SkeletonCircle size="8" />
                  <SkeletonCircle size="8" />
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </ScaleFade>
      </Container>
    );
  }

  // Main loading screen
  return (
    <Container maxW="md" py={isMobile ? 4 : 8}>
      <Fade in={true}>
        <Box
          bg={bgColor}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
          p={6}
          textAlign="center"
          boxShadow="lg"
        >
          <VStack spacing={6}>
            {/* Loading icon and message */}
            <VStack spacing={3}>
              <Box position="relative">
                <Icon
                  as={stageInfo.icon}
                  color={`${stageInfo.color}.500`}
                  boxSize={12}
                  animation="pulse 2s infinite"
                />
              </Box>

              <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                {stageInfo.message}
              </Text>
            </VStack>

            {/* Progress bar */}
            {showProgressBar && (
              <Box w="full">
                <Progress
                  value={stageInfo.progress}
                  colorScheme={stageInfo.color}
                  size="lg"
                  borderRadius="full"
                  bg="gray.100"
                  isAnimated
                />
                <Text fontSize="xs" color={textColor} mt={1}>
                  {stageInfo.progress}% complete
                </Text>
              </Box>
            )}

            {/* Eco-friendly tip */}
            <Box h="50px" display="flex" alignItems="center">
              <Fade in={showTip}>
                <HStack spacing={3} color={textColor}>
                  <Icon as={ecoTips[currentTipIndex].icon} color={primaryColor} />
                  <Text fontSize="sm" textAlign="center">
                    {ecoTips[currentTipIndex].text}
                  </Text>
                </HStack>
              </Fade>
            </Box>

            {/* Loading content previews based on stage */}
            {loadingStage === 'carbon-score' && (
              <VStack spacing={3} w="full">
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  Preparing carbon footprint analysis...
                </Text>
                <HStack spacing={2} justify="center">
                  <SkeletonCircle size="10" />
                  <VStack align="start" spacing={1}>
                    <Skeleton height="15px" width="120px" />
                    <Skeleton height="12px" width="80px" />
                  </VStack>
                </HStack>
              </VStack>
            )}

            {loadingStage === 'product-details' && (
              <VStack spacing={3} w="full">
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  Loading product journey...
                </Text>
                <VStack spacing={2} w="full">
                  <Skeleton height="20px" width="90%" />
                  <Skeleton height="15px" width="70%" />
                  <Skeleton height="15px" width="80%" />
                </VStack>
              </VStack>
            )}
          </VStack>
        </Box>
      </Fade>
    </Container>
  );
};
