import React, { useEffect } from 'react';
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
  VStack,
  useColorModeValue,
  HStack,
  Icon,
  Tooltip,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Divider,
  Grid,
  GridItem,
  keyframes
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaCarSide,
  FaClock,
  FaTree,
  FaInfoCircle,
  FaTachometerAlt,
  FaCheckCircle,
  FaGlobeAmericas
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionCircularProgress = motion(CircularProgress);
const MotionBox = motion(Box);

const pulseAnimation = keyframes`
  0% { opacity: 0.7; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 0.7; transform: scale(0.98); }
`;

interface CarbonScoreProps {
  score: number;
  footprint: number;
  industryPercentile?: number;
  relatableFootprint?: string;
  isCompact?: boolean;
}

export const CarbonScore: React.FC<CarbonScoreProps> = ({
  score,
  footprint,
  industryPercentile,
  relatableFootprint,
  isCompact = false
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const scoreColor =
    score >= 80
      ? 'green.500'
      : score >= 60
      ? 'green.400'
      : score >= 40
      ? 'yellow.400'
      : score >= 20
      ? 'orange.400'
      : 'red.500';

  const relatableText =
    relatableFootprint || footprint > 0
      ? `Like driving ${(footprint / 0.115).toFixed(1)} miles`
      : footprint < 0
      ? `Like planting ${Math.abs(footprint / 20).toFixed(1)} trees`
      : 'Carbon neutral';

  if (isCompact) {
    return (
      <HStack
        spacing={3}
        p={3}
        bg={bgColor}
        borderRadius="lg"
        boxShadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
        _hover={{ transform: 'translateY(-3px)', boxShadow: 'md' }}
        transition="all 0.3s"
        cursor="pointer"
        onClick={onOpen}
      >
        <MotionCircularProgress
          value={score}
          max={100}
          color={scoreColor}
          size="60px"
          thickness="8px"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <CircularProgressLabel fontSize="lg" fontWeight="bold">
            {score}
          </CircularProgressLabel>
        </MotionCircularProgress>

        <VStack align="start" spacing={0}>
          <Text fontWeight="medium" fontSize="sm">
            Carbon Score
          </Text>
          <Text fontSize="xs" color="gray.500">
            {relatableText}
          </Text>
        </VStack>
      </HStack>
    );
  }

  return (
    <>
      <MotionBox
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        width="100%"
        borderWidth="1px"
        borderColor={borderColor}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        cursor="pointer"
        onClick={onOpen}
      >
        <VStack spacing={4}>
          <Flex direction="column" align="center">
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Carbon Score
            </Text>

            <Box position="relative">
              <MotionCircularProgress
                value={score}
                max={100}
                color={scoreColor}
                size="120px"
                thickness="8px"
                capIsRound
                animate={{
                  boxShadow: [
                    `0 0 0px ${scoreColor}`,
                    `0 0 10px ${scoreColor}`,
                    `0 0 0px ${scoreColor}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <CircularProgressLabel fontSize="2xl" fontWeight="bold">
                  {score}
                </CircularProgressLabel>
              </MotionCircularProgress>

              <Badge
                position="absolute"
                bottom="-2"
                right="-2"
                colorScheme={score >= 60 ? 'green' : score >= 40 ? 'yellow' : 'red'}
                borderRadius="full"
                px={2}
                py={1}
              >
                {score >= 80
                  ? 'Excellent'
                  : score >= 60
                  ? 'Good'
                  : score >= 40
                  ? 'Average'
                  : 'Needs Work'}
              </Badge>
            </Box>

            {industryPercentile && (
              <HStack mt={2}>
                <Icon as={FaTachometerAlt} color="blue.500" />
                <Text fontSize="sm" color="gray.600">
                  Better than {industryPercentile}% of similar products
                </Text>
              </HStack>
            )}
          </Flex>

          <Box width="100%" pt={2}>
            <HStack spacing={3} mb={3}>
              <Icon
                as={footprint < 0 ? FaLeaf : FaCarSide}
                color={footprint < 0 ? 'green.500' : 'orange.500'}
                boxSize={5}
              />
              <Text fontSize="md" fontWeight="medium">
                {footprint < 0
                  ? `${Math.abs(footprint).toFixed(2)} kg CO₂e offset`
                  : `${footprint.toFixed(2)} kg CO₂e emitted`}
              </Text>
              <Tooltip label="Carbon dioxide equivalent (CO2e) is a measure used to compare the emissions from various greenhouse gases">
                <Box as="span">
                  <Icon as={FaInfoCircle} color="gray.400" boxSize={4} />
                </Box>
              </Tooltip>
            </HStack>

            <HStack pl={8} spacing={2} mb={3}>
              <Icon as={footprint < 0 ? FaTree : FaCarSide} color="gray.500" boxSize={4} />
              <Text fontSize="sm" color="gray.600">
                {relatableText}
              </Text>
            </HStack>

            {score >= 90 && (
              <Box
                bg="green.50"
                p={3}
                borderRadius="md"
                mt={2}
                animation={`${pulseAnimation} 3s infinite`}
              >
                <HStack>
                  <Icon as={FaCheckCircle} color="green.500" />
                  <Text fontSize="sm" color="green.700">
                    Exceptional! This product has one of the lowest carbon footprints in its
                    category.
                  </Text>
                </HStack>
              </Box>
            )}

            {score >= 80 && score < 90 && (
              <Box bg="green.50" p={3} borderRadius="md" mt={2}>
                <Text fontSize="sm" color="green.700">
                  Excellent! This product has a very low carbon footprint.
                </Text>
              </Box>
            )}

            {score >= 60 && score < 80 && (
              <Box bg="green.50" p={3} borderRadius="md" mt={2}>
                <Text fontSize="sm" color="green.700">
                  Good! This product has a lower than average carbon footprint.
                </Text>
              </Box>
            )}

            {score >= 40 && score < 60 && (
              <Box bg="yellow.50" p={3} borderRadius="md" mt={2}>
                <Text fontSize="sm" color="yellow.700">
                  Average carbon footprint for this type of product.
                </Text>
              </Box>
            )}

            {score < 40 && (
              <Box bg="orange.50" p={3} borderRadius="md" mt={2}>
                <Text fontSize="sm" color="orange.700">
                  This product has room for improvement in reducing its carbon footprint.
                </Text>
              </Box>
            )}
          </Box>
        </VStack>
      </MotionBox>

      {/* Detailed Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Carbon Footprint Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={5} align="stretch">
              <Flex justify="center">
                <CircularProgress
                  value={score}
                  max={100}
                  color={scoreColor}
                  size="150px"
                  thickness="10px"
                  capIsRound
                >
                  <CircularProgressLabel fontSize="3xl" fontWeight="bold">
                    {score}
                  </CircularProgressLabel>
                </CircularProgress>
              </Flex>

              <Divider />

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <Stat>
                    <StatLabel>Carbon Emissions</StatLabel>
                    <StatNumber>{footprint.toFixed(2)} kg CO₂e</StatNumber>
                    <StatHelpText>
                      <StatArrow type={footprint < 0 ? 'decrease' : 'increase'} />
                      {industryPercentile
                        ? `${industryPercentile}% better than average`
                        : 'No comparison data'}
                    </StatHelpText>
                  </Stat>
                </GridItem>
                <GridItem>
                  <Stat>
                    <StatLabel>Environmental Impact</StatLabel>
                    <StatNumber>
                      {footprint < 0
                        ? Math.abs(footprint / 20).toFixed(1)
                        : (footprint / 0.115).toFixed(1)}
                    </StatNumber>
                    <StatHelpText>
                      {footprint < 0 ? 'Trees equivalent' : 'Miles driven equivalent'}
                    </StatHelpText>
                  </Stat>
                </GridItem>
              </Grid>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>
                  What This Means
                </Text>
                <Text fontSize="sm">
                  This product's carbon score of {score}/100 indicates its environmental impact.
                  {score >= 80
                    ? ' This is an excellent score, showing the product has a minimal carbon footprint.'
                    : score >= 60
                    ? ' This is a good score, showing the product has a lower than average carbon footprint.'
                    : score >= 40
                    ? ' This is an average score for products in this category.'
                    : ' This product has opportunities to reduce its carbon footprint.'}
                </Text>
              </Box>

              <Box bg="blue.50" p={3} borderRadius="md">
                <HStack spacing={2}>
                  <Icon as={FaGlobeAmericas} color="blue.500" />
                  <Text fontSize="sm" color="blue.700">
                    By choosing products with higher scores, you help reduce global carbon emissions
                    and combat climate change.
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
