import React, { useState } from 'react';
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
  Image,
  Heading,
  Badge,
  SimpleGrid,
  Divider,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaTractor,
  FaMapMarkerAlt,
  FaAward,
  FaClock,
  FaLeaf,
  FaCalendarAlt,
  FaTree,
  FaSeedling,
  FaUsers,
  FaHistory,
  FaChevronRight
} from 'react-icons/fa';

export interface FarmerStoryProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: {
    name: string;
    photo: string;
    bio: string;
    generation: number;
    location: string;
    certifications: string[];
    sustainabilityInitiatives: string[];
    carbonReduction: number;
    yearsOfPractice: number;
    familyHistory?: string;
    farmSize?: number;
    products?: string[];
    achievements?: Array<{
      year: number;
      title: string;
      description: string;
    }>;
    gallery?: string[];
    impactStory?: string;
  };
}

export const FarmerStory: React.FC<FarmerStoryProps> = ({ isOpen, onClose, farmer }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const highlightBg = useColorModeValue('green.50', 'green.900');
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="green.500" color="white" borderTopRadius="md">
          <HStack spacing={3}>
            <Icon as={FaLeaf} />
            <Text>Meet {farmer.name}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody p={0}>
          <Tabs isFitted colorScheme="green" index={activeTab} onChange={setActiveTab}>
            <TabList>
              <Tab>
                <Icon as={FaUsers} mr={2} /> About
              </Tab>
              <Tab>
                <Icon as={FaHistory} mr={2} /> Journey
              </Tab>
              <Tab>
                <Icon as={FaLeaf} mr={2} /> Impact
              </Tab>
            </TabList>

            <TabPanels>
              {/* About Tab */}
              <TabPanel p={6}>
                <HStack spacing={4} align="start" mb={6}>
                  <Avatar
                    src={farmer.photo}
                    name={farmer.name}
                    size="xl"
                    border="3px solid"
                    borderColor="green.500"
                  />
                  <VStack align="start" spacing={2}>
                    <Heading as="h3" size="md" color={textColor}>
                      {farmer.name}
                    </Heading>

                    <HStack>
                      <Icon as={FaMapMarkerAlt} color="green.500" />
                      <Text fontSize="md" color="gray.600">
                        {farmer.location}
                      </Text>
                    </HStack>

                    <HStack>
                      <Icon as={FaTractor} color="green.500" />
                      <Text fontSize="md" color="gray.600">
                        {farmer.generation}
                        {farmer.generation === 1
                          ? 'st'
                          : farmer.generation === 2
                          ? 'nd'
                          : farmer.generation === 3
                          ? 'rd'
                          : 'th'}{' '}
                        Generation Farmer
                      </Text>
                    </HStack>

                    <HStack>
                      <Icon as={FaClock} color="green.500" />
                      <Text fontSize="md" color="gray.600">
                        {farmer.yearsOfPractice} years of sustainable farming
                      </Text>
                    </HStack>

                    {farmer.farmSize && (
                      <HStack>
                        <Icon as={FaSeedling} color="green.500" />
                        <Text fontSize="md" color="gray.600">
                          {farmer.farmSize} acres
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </HStack>

                <Text mb={4}>{farmer.bio}</Text>

                {farmer.familyHistory && (
                  <Box mb={4}>
                    <Heading as="h4" size="sm" mb={2}>
                      Family Heritage
                    </Heading>
                    <Text>{farmer.familyHistory}</Text>
                  </Box>
                )}

                {farmer.certifications && farmer.certifications.length > 0 && (
                  <Box mb={4}>
                    <Heading as="h4" size="sm" mb={2}>
                      Certifications
                    </Heading>
                    <Flex wrap="wrap" gap={2}>
                      {farmer.certifications.map((cert, index) => (
                        <Badge key={index} colorScheme="green" px={2} py={1} borderRadius="full">
                          <HStack spacing={1}>
                            <Icon as={FaAward} />
                            <Text>{cert}</Text>
                          </HStack>
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                )}

                {farmer.products && farmer.products.length > 0 && (
                  <Box mb={4}>
                    <Heading as="h4" size="sm" mb={2}>
                      Our Products
                    </Heading>
                    <Flex wrap="wrap" gap={2}>
                      {farmer.products.map((product, index) => (
                        <Badge key={index} colorScheme="blue" px={2} py={1} borderRadius="full">
                          {product}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                )}
              </TabPanel>

              {/* Journey Tab */}
              <TabPanel p={6}>
                {farmer.achievements && farmer.achievements.length > 0 ? (
                  <Box position="relative">
                    <Box
                      position="absolute"
                      left="18px"
                      top="0"
                      height="100%"
                      width="2px"
                      bg="green.200"
                      zIndex={0}
                    />

                    <VStack align="stretch" spacing={6} position="relative">
                      {farmer.achievements.map((achievement, index) => (
                        <Flex key={index} pl={10} position="relative">
                          <Box
                            position="absolute"
                            left="0"
                            top="0"
                            borderRadius="full"
                            bg="green.100"
                            border="2px solid"
                            borderColor="green.500"
                            width="38px"
                            height="38px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            zIndex={1}
                          >
                            <Text fontWeight="bold" color="green.700">
                              {achievement.year}
                            </Text>
                          </Box>

                          <Box
                            p={4}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                            width="100%"
                            _hover={{ bg: 'gray.50' }}
                          >
                            <Text fontWeight="bold" mb={1}>
                              {achievement.title}
                            </Text>
                            <Text fontSize="sm">{achievement.description}</Text>
                          </Box>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                ) : (
                  <Text>No journey milestones recorded yet.</Text>
                )}

                {farmer.gallery && farmer.gallery.length > 0 && (
                  <Box mt={6}>
                    <Heading as="h4" size="sm" mb={3}>
                      Farm Gallery
                    </Heading>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                      {farmer.gallery.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`Farm image ${index + 1}`}
                          borderRadius="md"
                          objectFit="cover"
                          height="120px"
                        />
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
              </TabPanel>

              {/* Impact Tab */}
              <TabPanel p={6}>
                {farmer.sustainabilityInitiatives &&
                  farmer.sustainabilityInitiatives.length > 0 && (
                    <Box mb={6}>
                      <Heading as="h4" size="sm" mb={3}>
                        Sustainability Initiatives
                      </Heading>
                      <VStack align="start" spacing={3}>
                        {farmer.sustainabilityInitiatives.map((initiative, index) => (
                          <HStack key={index} spacing={2} align="start">
                            <Icon as={FaLeaf} color="green.500" mt={1} />
                            <Text>{initiative}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}

                {farmer.carbonReduction && (
                  <Box mb={6} p={4} bg={highlightBg} borderRadius="md">
                    <VStack spacing={1} align="center">
                      <Heading as="h4" size="md" color="green.600">
                        {farmer.carbonReduction.toLocaleString()} kg
                      </Heading>
                      <Text color="green.600" fontWeight="medium">
                        Carbon Reduction
                      </Text>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        Total carbon emissions reduced through sustainable practices
                      </Text>
                    </VStack>
                  </Box>
                )}

                {farmer.impactStory && (
                  <Box mb={4}>
                    <Heading as="h4" size="sm" mb={2}>
                      Impact Story
                    </Heading>
                    <Box
                      p={4}
                      borderRadius="md"
                      borderLeft="4px solid"
                      borderColor="green.500"
                      bg="gray.50"
                    >
                      <Text fontStyle="italic">{farmer.impactStory}</Text>
                    </Box>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter bg="gray.50">
          <Button colorScheme="green" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
