import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Icon,
  Image,
  Flex,
  useColorModeValue,
  Badge,
  Progress,
  Heading,
  Tooltip,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  SimpleGrid,
  Avatar,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaTree,
  FaInfoCircle,
  FaTrophy,
  FaMedal,
  FaCheck,
  FaClock,
  FaCar,
  FaArrowUp,
  FaArrowDown,
  FaGlobeAmericas,
  FaStar
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionFlex = motion(Flex);
const MotionProgress = motion(Progress);

interface OffsetProject {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  pricePerKg: number;
  impact: string;
  verified: boolean;
}

interface GamifiedOffsetProps {
  isOpen: boolean;
  onClose: () => void;
  footprint: number;
  productName: string;
  onOffset: (amount: number, projectId: string) => Promise<void>;
  pointsReward?: number;
  userTotalOffset?: number;
  userLevel?: number;
}

const availableProjects: OffsetProject[] = [
  {
    id: 'reforestation',
    name: 'Reforestation Project',
    description: 'Planting trees in degraded areas to capture carbon',
    location: 'Amazon, Brazil',
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    pricePerKg: 0.1,
    impact: 'Each kg offset plants approximately 0.05 trees',
    verified: true
  },
  {
    id: 'solar',
    name: 'Solar Energy',
    description: 'Supporting solar farms that replace fossil fuel energy',
    location: 'California, USA',
    image:
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    pricePerKg: 0.08,
    impact: 'Each kg offset funds 0.25 kWh of clean energy',
    verified: true
  },
  {
    id: 'mangrove',
    name: 'Mangrove Conservation',
    description: 'Protecting mangrove forests which are powerful carbon sinks',
    location: 'Indonesia',
    image:
      'https://images.unsplash.com/photo-1562079176-11ef2e8006cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    pricePerKg: 0.12,
    impact: 'Each kg offset protects 0.1 sq meters of mangroves',
    verified: false
  }
];

export const GamifiedOffset: React.FC<GamifiedOffsetProps> = ({
  isOpen,
  onClose,
  footprint,
  productName,
  onOffset,
  pointsReward = 5,
  userTotalOffset = 0,
  userLevel = 1
}) => {
  const [offsetAmount, setOffsetAmount] = useState(0.05);
  const [selectedProject, setSelectedProject] = useState<OffsetProject>(availableProjects[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightBg = useColorModeValue('green.50', 'green.900');

  // Calculate milestone progress
  const nextMilestone = Math.ceil((userTotalOffset + offsetAmount) / 50) * 50;
  const milestoneProgress = (((userTotalOffset % 50) + offsetAmount) / 50) * 100;
  const reachedNewMilestone =
    userTotalOffset < nextMilestone && userTotalOffset + offsetAmount >= nextMilestone;

  // Trees, miles, and cost calculations
  const treesEquivalent = offsetAmount / 22; // 22 kg CO2 per tree per year
  const milesEquivalent = offsetAmount / 0.12; // 0.12 kg CO2 per mile driven
  const totalCost = offsetAmount * selectedProject.pricePerKg;

  useEffect(() => {
    if (reachedNewMilestone) {
      setShowAchievement(true);
    }
  }, [reachedNewMilestone]);

  const handleOffset = async () => {
    setIsLoading(true);
    try {
      await onOffset(offsetAmount, selectedProject.id);
      setShowSuccess(true);
      setIsLoading(false);

      // Show toast with points reward
      toast({
        title: 'Offset Successful!',
        description: `You earned ${pointsReward} green points.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Offset Failed',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setShowAchievement(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalBody pt={10} pb={6}>
            <VStack spacing={6}>
              <MotionBox
                animate={{ scale: [0.5, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 0.8 }}
              >
                <Icon as={FaCheck} boxSize={16} color="green.500" />
              </MotionBox>

              <Heading size="lg" textAlign="center">
                Thank You!
              </Heading>

              <Text textAlign="center">
                You've successfully offset <b>{offsetAmount.toFixed(2)} kg CO₂e</b> through the{' '}
                {selectedProject.name}.
              </Text>

              <Box
                p={4}
                borderRadius="md"
                bg={highlightBg}
                width="100%"
                borderWidth="1px"
                borderColor="green.200"
              >
                <HStack justify="space-between">
                  <VStack align="start">
                    <Text fontSize="sm" fontWeight="bold">
                      Your Impact
                    </Text>
                    <HStack>
                      <Icon as={FaTree} color="green.500" />
                      <Text fontSize="sm">≈ {treesEquivalent.toFixed(2)} trees</Text>
                    </HStack>
                  </VStack>

                  <VStack align="start">
                    <Text fontSize="sm" fontWeight="bold">
                      Reward
                    </Text>
                    <HStack>
                      <Icon as={FaLeaf} color="green.500" />
                      <Text fontSize="sm">+{pointsReward} points</Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>

              {reachedNewMilestone && (
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Text fontWeight="medium">You've reached the {nextMilestone} kg milestone!</Text>
                </Alert>
              )}

              <Button colorScheme="green" onClick={handleClose} width="100%">
                Continue
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (showAchievement) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalBody pt={10} pb={6}>
            <VStack spacing={6}>
              <MotionBox
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon as={FaTrophy} boxSize={24} color="yellow.400" />
              </MotionBox>

              <Heading size="lg" textAlign="center">
                Achievement Unlocked!
              </Heading>

              <Text fontSize="xl" fontWeight="bold" textAlign="center">
                {nextMilestone} kg CO₂e Milestone
              </Text>

              <Text textAlign="center">
                You've offset over {nextMilestone} kg of carbon emissions, equivalent to planting{' '}
                {(nextMilestone / 22).toFixed(0)} trees!
              </Text>

              <Badge colorScheme="green" p={2} borderRadius="full" fontSize="md">
                Eco Warrior Level {userLevel + 1}
              </Badge>

              <Button colorScheme="green" onClick={() => setShowAchievement(false)} width="100%">
                Continue to Offset
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Icon as={FaLeaf} color="green.500" />
            <Text>Offset Your Carbon Footprint</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <Box p={4} borderRadius="md" bg={highlightBg} borderWidth="1px" borderColor="green.200">
              <Text mb={2}>
                <b>{productName}</b> has a carbon footprint of <b>{footprint.toFixed(2)} kg CO₂e</b>
                . Offset some or all of this footprint to reduce your environmental impact.
              </Text>

              <HStack justify="space-between" mt={4}>
                <VStack align="start">
                  <Text fontSize="sm" fontWeight="medium">
                    Your Total Offsets
                  </Text>
                  <HStack>
                    <Icon as={FaGlobeAmericas} color="green.600" />
                    <Text fontWeight="bold">{userTotalOffset.toFixed(2)} kg</Text>
                  </HStack>
                </VStack>

                <VStack align="start">
                  <Text fontSize="sm" fontWeight="medium">
                    Current Level
                  </Text>
                  <HStack>
                    <Icon as={FaMedal} color="green.600" />
                    <Text fontWeight="bold">Level {userLevel}</Text>
                  </HStack>
                </VStack>
              </HStack>
            </Box>

            <Divider />

            <Box>
              <Heading size="sm" mb={3}>
                Choose Offset Amount
              </Heading>

              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text>Amount to offset:</Text>
                  <Text fontWeight="bold">{offsetAmount.toFixed(2)} kg CO₂e</Text>
                </HStack>

                <Slider
                  min={0.01}
                  max={footprint}
                  step={0.01}
                  value={offsetAmount}
                  onChange={setOffsetAmount}
                  colorScheme="green"
                >
                  <SliderTrack bg="green.100">
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb boxSize={6} bg="white" borderColor="green.500" borderWidth={2}>
                    <Icon as={FaLeaf} color="green.500" boxSize={3} />
                  </SliderThumb>
                </Slider>

                <SimpleGrid columns={3} spacing={4} mt={2}>
                  <Button
                    size="sm"
                    onClick={() => setOffsetAmount(0.05)}
                    variant="outline"
                    colorScheme="green"
                  >
                    0.05 kg
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setOffsetAmount(0.1)}
                    variant="outline"
                    colorScheme="green"
                  >
                    0.10 kg
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setOffsetAmount(footprint)}
                    variant="outline"
                    colorScheme="green"
                  >
                    {footprint.toFixed(2)} kg
                  </Button>
                </SimpleGrid>
              </VStack>
            </Box>

            <Box>
              <Heading size="sm" mb={3}>
                Your Environmental Impact
              </Heading>

              <MotionFlex
                p={4}
                borderRadius="md"
                bg="blue.50"
                borderWidth="1px"
                borderColor="blue.200"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                  <Stat>
                    <StatLabel>Trees Equivalent</StatLabel>
                    <StatNumber>{treesEquivalent.toFixed(2)}</StatNumber>
                    <StatHelpText>
                      <Icon as={FaTree} mr={2} />
                      Trees planted
                    </StatHelpText>
                  </Stat>

                  <Stat>
                    <StatLabel>Driving Equivalent</StatLabel>
                    <StatNumber>{milesEquivalent.toFixed(1)}</StatNumber>
                    <StatHelpText>
                      <Icon as={FaCar} mr={2} />
                      Miles not driven
                    </StatHelpText>
                  </Stat>
                </SimpleGrid>
              </MotionFlex>
            </Box>

            <Box>
              <Heading size="sm" mb={3}>
                Next Milestone Progress
              </Heading>

              <Box p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <Text fontSize="sm" mb={2}>
                  Progress toward {nextMilestone} kg milestone:
                </Text>

                <MotionProgress
                  value={milestoneProgress}
                  colorScheme="green"
                  height="12px"
                  borderRadius="full"
                  mb={2}
                  animate={
                    reachedNewMilestone
                      ? {
                          scaleX: [1, 1.03, 1],
                          scaleY: [1, 1.1, 1]
                        }
                      : {}
                  }
                  transition={{ duration: 0.5, repeat: reachedNewMilestone ? 3 : 0 }}
                />

                <Flex justify="space-between">
                  <Text fontSize="xs" color="gray.500">
                    {userTotalOffset.toFixed(1)} kg
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {nextMilestone} kg {reachedNewMilestone && '(Milestone!)'}
                  </Text>
                </Flex>

                {reachedNewMilestone && (
                  <Flex justify="center" mt={2}>
                    <Badge colorScheme="yellow" p={1}>
                      <Icon as={FaStar} mr={1} />
                      Almost there!
                    </Badge>
                  </Flex>
                )}
              </Box>
            </Box>

            <Divider />

            <Box>
              <Heading size="sm" mb={3}>
                Choose Offset Project
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {availableProjects.map((project) => (
                  <MotionBox
                    key={project.id}
                    p={3}
                    borderRadius="md"
                    borderWidth="2px"
                    borderColor={project.id === selectedProject.id ? 'green.500' : borderColor}
                    cursor="pointer"
                    onClick={() => setSelectedProject(project)}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    bg={project.id === selectedProject.id ? 'green.50' : 'transparent'}
                  >
                    <VStack spacing={2}>
                      <Box position="relative" width="100%" height="100px">
                        <Image
                          src={project.image}
                          alt={project.name}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        {project.verified && (
                          <Badge
                            position="absolute"
                            top={2}
                            right={2}
                            colorScheme="green"
                            borderRadius="full"
                            px={2}
                          >
                            <Icon as={FaCheck} mr={1} boxSize={2} />
                            Verified
                          </Badge>
                        )}
                      </Box>

                      <Text fontWeight="bold" fontSize="sm">
                        {project.name}
                      </Text>

                      <HStack>
                        <Icon as={FaMapMarkerAlt} color="gray.500" boxSize={3} />
                        <Text fontSize="xs" color="gray.500">
                          {project.location}
                        </Text>
                      </HStack>
                    </VStack>
                  </MotionBox>
                ))}
              </SimpleGrid>

              <Box mt={4} p={4} borderRadius="md" bg={highlightBg}>
                <Heading size="xs" mb={2}>
                  {selectedProject.name}
                </Heading>
                <Text fontSize="sm" mb={2}>
                  {selectedProject.description}
                </Text>
                <Text fontSize="xs" color="green.700">
                  <Icon as={FaInfoCircle} mr={1} />
                  {selectedProject.impact}
                </Text>
              </Box>
            </Box>

            <Divider />

            <HStack justify="space-between" p={2} bg="gray.50" borderRadius="md">
              <Text>Total Cost:</Text>
              <Text fontWeight="bold">${totalCost.toFixed(2)} USD</Text>
            </HStack>

            <Flex justify="center">
              <HStack bg="blue.50" p={2} borderRadius="md">
                <Icon as={FaLeaf} color="green.500" />
                <Text fontSize="sm" color="blue.700">
                  You'll earn {pointsReward} Green Points for offsetting!
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={handleOffset}
            leftIcon={<FaLeaf />}
            isLoading={isLoading}
          >
            Confirm Offset
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Icon components
const FaMapMarkerAlt = (props: any) => (
  <Icon viewBox="0 0 384 512" {...props}>
    <path
      fill="currentColor"
      d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"
    />
  </Icon>
);
