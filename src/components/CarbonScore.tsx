import React, { useEffect, useState } from 'react';
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
  keyframes,
  Button,
  SimpleGrid,
  useBreakpointValue,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Circle
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaCarSide,
  FaClock,
  FaTree,
  FaInfoCircle,
  FaTachometerAlt,
  FaCheckCircle,
  FaGlobeAmericas,
  FaLightbulb,
  FaPlane,
  FaBolt,
  FaHome,
  FaRecycle
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
  insights?: string[];
}

export const CarbonScore: React.FC<CarbonScoreProps> = ({
  score,
  footprint,
  industryPercentile,
  relatableFootprint,
  isCompact = false,
  insights = []
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showAllComparisons, setShowAllComparisons] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('green.600', 'green.400');

  // Responsive values
  const progressSize = useBreakpointValue({ base: '80px', md: '120px' });
  const badgeSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const spacing = useBreakpointValue({ base: 3, md: 4 });

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

  const getScoreGrade = () => {
    if (score >= 90) return { grade: 'A+', text: 'Outstanding', color: 'green' };
    if (score >= 80) return { grade: 'A', text: 'Excellent', color: 'green' };
    if (score >= 70) return { grade: 'B', text: 'Good', color: 'green' };
    if (score >= 60) return { grade: 'C', text: 'Average', color: 'yellow' };
    if (score >= 40) return { grade: 'D', text: 'Below Average', color: 'orange' };
    return { grade: 'F', text: 'Needs Improvement', color: 'red' };
  };

  const getRelatableComparisons = () => {
    const absFootprint = Math.abs(footprint);

    // Multiple comparison types for better understanding
    const comparisons = [
      {
        icon: FaCarSide,
        text:
          footprint > 0
            ? `Like driving ${(absFootprint * 2.31).toFixed(1)} miles`
            : `Offsets ${(absFootprint * 2.31).toFixed(1)} miles of driving`,
        category: 'Transportation'
      },
      {
        icon: FaHome,
        text:
          footprint > 0
            ? `${(absFootprint / 0.92).toFixed(1)} hours of home energy use`
            : `Offsets ${(absFootprint / 0.92).toFixed(1)} hours of home energy`,
        category: 'Energy'
      },
      {
        icon: FaLightbulb,
        text:
          footprint > 0
            ? `${(absFootprint / 0.0004).toFixed(0)} hours of LED bulb use`
            : `Offsets ${(absFootprint / 0.0004).toFixed(0)} hours of LED bulb use`,
        category: 'Electricity'
      },
      {
        icon: FaTree,
        text:
          footprint > 0
            ? `${(absFootprint / 21.77).toFixed(1)} trees needed to offset for 1 year`
            : `Like planting ${(absFootprint / 21.77).toFixed(1)} trees`,
        category: 'Nature'
      }
    ];

    if (absFootprint > 50) {
      comparisons.push({
        icon: FaPlane,
        text:
          footprint > 0
            ? `${(absFootprint / 90).toFixed(1)} hours of flight time`
            : `Offsets ${(absFootprint / 90).toFixed(1)} hours of flight`,
        category: 'Travel'
      });
    }

    return comparisons;
  };

  const getImpactLevel = () => {
    if (footprint <= 0) return { level: 'Carbon Negative', color: 'green', icon: FaRecycle };
    if (footprint < 1) return { level: 'Very Low Impact', color: 'green', icon: FaLeaf };
    if (footprint < 5) return { level: 'Low Impact', color: 'green', icon: FaTree };
    if (footprint < 15) return { level: 'Moderate Impact', color: 'yellow', icon: FaGlobeAmericas };
    if (footprint < 30) return { level: 'High Impact', color: 'orange', icon: FaCarSide };
    return { level: 'Very High Impact', color: 'red', icon: FaBolt };
  };

  const grade = getScoreGrade();
  const impact = getImpactLevel();
  const comparisons = getRelatableComparisons();

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
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
        transition="all 0.3s"
        cursor="pointer"
        onClick={onOpen}
      >
        <MotionCircularProgress
          value={score}
          max={100}
          color={scoreColor}
          size={progressSize}
          thickness="8px"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <CircularProgressLabel fontSize="lg" fontWeight="bold">
            {score}
          </CircularProgressLabel>
        </MotionCircularProgress>

        <VStack align="start" spacing={0} flex={1}>
          <HStack>
            <Text fontWeight="bold" fontSize="sm">
              Carbon Score
            </Text>
            <Badge size={badgeSize} colorScheme={grade.color} variant="solid">
              {grade.grade}
            </Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            {comparisons[0]?.text}
          </Text>
          <Text fontSize="xs" color={impact.color} fontWeight="medium">
            {impact.level}
          </Text>
        </VStack>

        {/* Modal for detailed view */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Carbon Score Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                {/* Score display */}
                <Box textAlign="center">
                  <CircularProgress value={score} color={scoreColor} size="120px" thickness="8px">
                    <CircularProgressLabel fontSize="2xl" fontWeight="bold">
                      {score}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <HStack justify="center" mt={2}>
                    <Badge colorScheme={grade.color} variant="solid" px={3} py={1}>
                      Grade {grade.grade}
                    </Badge>
                    <Badge colorScheme={impact.color} variant="outline" px={3} py={1}>
                      {impact.level}
                    </Badge>
                  </HStack>
                </Box>

                {/* Comparisons */}
                <Box w="full">
                  <Text fontWeight="bold" mb={3}>
                    What does this mean?
                  </Text>
                  <SimpleGrid columns={1} spacing={2}>
                    {comparisons
                      .slice(0, showAllComparisons ? comparisons.length : 3)
                      .map((comp, index) => (
                        <HStack key={index} p={2} bg="gray.50" borderRadius="md">
                          <Icon as={comp.icon} color={accentColor} />
                          <Text fontSize="sm">{comp.text}</Text>
                        </HStack>
                      ))}
                  </SimpleGrid>
                  {comparisons.length > 3 && (
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => setShowAllComparisons(!showAllComparisons)}
                      mt={2}
                    >
                      {showAllComparisons
                        ? 'Show less'
                        : `Show ${comparisons.length - 3} more comparisons`}
                    </Button>
                  )}
                </Box>

                {/* Industry comparison */}
                {industryPercentile && industryPercentile > 0 && (
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Industry Leader!</AlertTitle>
                      <AlertDescription fontSize="sm">
                        This product is greener than {industryPercentile}% of similar products.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
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
        <VStack spacing={spacing}>
          <Flex direction="column" align="center">
            <HStack mb={2}>
              <Icon as={FaLeaf} color={accentColor} boxSize={5} />
              <Text fontSize="xl" fontWeight="bold">
                Carbon Score
              </Text>
            </HStack>

            <Box position="relative">
              <MotionCircularProgress
                value={score}
                max={100}
                color={scoreColor}
                size={progressSize}
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
                <CircularProgressLabel fontSize="3xl" fontWeight="bold">
                  {score}
                </CircularProgressLabel>
              </MotionCircularProgress>

              <Badge
                position="absolute"
                bottom="-2"
                right="-2"
                colorScheme={grade.color}
                borderRadius="full"
                px={3}
                py={1}
                fontSize="sm"
                fontWeight="bold"
              >
                {grade.grade}
              </Badge>
            </Box>

            <Text fontSize="lg" fontWeight="medium" color={textColor} mt={2}>
              {grade.text}
            </Text>

            {/* Industry percentile */}
            {industryPercentile && industryPercentile > 0 && (
              <Box mt={3} p={3} bg="green.50" borderRadius="md" w="full">
                <HStack justify="center">
                  <Icon as={FaTachometerAlt} color="green.600" />
                  <Text fontSize="sm" color="green.700" fontWeight="medium">
                    Better than {industryPercentile}% of similar products
                  </Text>
                </HStack>
              </Box>
            )}

            {/* Impact level */}
            <HStack
              mt={3}
              p={2}
              bg={`${impact.color}.50`}
              borderRadius="md"
              w="full"
              justify="center"
            >
              <Icon as={impact.icon} color={`${impact.color}.600`} />
              <Text fontSize="sm" color={`${impact.color}.700`} fontWeight="medium">
                {impact.level}
              </Text>
            </HStack>
          </Flex>

          <Divider />

          {/* Quick comparison preview */}
          <Box w="full">
            <Text fontSize="sm" fontWeight="medium" mb={2} textAlign="center">
              What does this mean?
            </Text>
            <VStack spacing={2}>
              {comparisons.slice(0, 2).map((comp, index) => (
                <HStack key={index} w="full" justify="center">
                  <Icon as={comp.icon} color={accentColor} boxSize={4} />
                  <Text fontSize="sm" color="gray.600">
                    {comp.text}
                  </Text>
                </HStack>
              ))}
            </VStack>
            <Button size="sm" variant="link" colorScheme="blue" mt={2} onClick={onOpen}>
              View detailed breakdown →
            </Button>
          </Box>
        </VStack>
      </MotionBox>

      {/* Enhanced Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>
            <HStack>
              <Icon as={FaLeaf} color={accentColor} />
              <Text>Carbon Score Breakdown</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6}>
              {/* Main score display */}
              <Box textAlign="center" p={6} bg="gray.50" borderRadius="lg" w="full">
                <CircularProgress value={score} color={scoreColor} size="150px" thickness="12px">
                  <CircularProgressLabel fontSize="4xl" fontWeight="bold">
                    {score}
                  </CircularProgressLabel>
                </CircularProgress>
                <HStack justify="center" mt={4} spacing={4}>
                  <Badge colorScheme={grade.color} variant="solid" px={4} py={2} fontSize="md">
                    Grade {grade.grade}
                  </Badge>
                  <Badge colorScheme={impact.color} variant="outline" px={4} py={2} fontSize="md">
                    {impact.level}
                  </Badge>
                </HStack>
                <Text fontSize="lg" fontWeight="medium" mt={2} color="gray.700">
                  {grade.text} carbon performance
                </Text>
              </Box>

              {/* Detailed comparisons */}
              <Box w="full">
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Carbon Footprint Equivalents
                </Text>
                <SimpleGrid columns={1} spacing={3}>
                  {comparisons.map((comp, index) => (
                    <Box
                      key={index}
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                    >
                      <HStack spacing={3}>
                        <Circle size="40px" bg={`${accentColor}.100`}>
                          <Icon as={comp.icon} color={accentColor} boxSize={5} />
                        </Circle>
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm" color="gray.500" fontWeight="medium">
                            {comp.category}
                          </Text>
                          <Text fontSize="md" fontWeight="medium">
                            {comp.text}
                          </Text>
                        </VStack>
                      </HStack>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Industry comparison with progress bar */}
              {industryPercentile && industryPercentile > 0 && (
                <Box w="full" p={4} bg="green.50" borderRadius="lg">
                  <VStack spacing={3}>
                    <HStack w="full" justify="space-between">
                      <Text fontSize="md" fontWeight="bold" color="green.700">
                        Industry Comparison
                      </Text>
                      <Badge colorScheme="green" variant="solid">
                        Top {100 - industryPercentile}%
                      </Badge>
                    </HStack>
                    <Progress
                      value={industryPercentile}
                      colorScheme="green"
                      size="lg"
                      w="full"
                      borderRadius="full"
                    />
                    <Text fontSize="sm" color="green.700" textAlign="center">
                      This product performs better than {industryPercentile}% of similar products in
                      the market.
                      {industryPercentile > 90 &&
                        ' This is exceptional sustainability performance!'}
                    </Text>
                  </VStack>
                </Box>
              )}

              {/* Tips for improvement */}
              {insights && insights.length > 0 && (
                <Box w="full" p={4} bg="blue.50" borderRadius="lg">
                  <HStack mb={3}>
                    <Icon as={FaLightbulb} color="blue.600" />
                    <Text fontSize="md" fontWeight="bold" color="blue.700">
                      Sustainability Insights
                    </Text>
                  </HStack>
                  <VStack spacing={2} align="start">
                    {insights.map((insight, index) => (
                      <HStack key={index} align="start">
                        <Icon as={FaCheckCircle} color="blue.500" mt={0.5} />
                        <Text fontSize="sm" color="blue.700">
                          {insight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
