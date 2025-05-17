import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';

interface FarmerStoryProps {
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
    carbonReduction: number; // in kg CO2e
    yearsOfPractice: number;
  };
}

export const FarmerStory: React.FC<FarmerStoryProps> = ({ isOpen, onClose, farmer }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg={bgColor}>
        <ModalHeader>
          <HStack spacing={4}>
            <Image
              src={farmer.photo}
              alt={farmer.name}
              boxSize="60px"
              borderRadius="full"
              objectFit="cover"
            />
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                {farmer.name}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {farmer.generation}rd Generation Farmer • {farmer.location}
              </Text>
            </Box>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="md" mb={2}>
                {farmer.bio}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {farmer.yearsOfPractice} years of sustainable farming
              </Text>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                Certifications
              </Text>
              <HStack spacing={2} wrap="wrap">
                {farmer.certifications.map((cert, index) => (
                  <Badge
                    key={index}
                    colorScheme="green"
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full">
                    {cert}
                  </Badge>
                ))}
              </HStack>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                Sustainability Initiatives
              </Text>
              <VStack align="stretch" spacing={2}>
                {farmer.sustainabilityInitiatives.map((initiative, index) => (
                  <Box
                    key={index}
                    p={3}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}>
                    <Text fontSize="sm">{initiative}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>

            <Box p={4} borderRadius="lg" bg="green.50" borderWidth="1px" borderColor="green.200">
              <Text fontWeight="medium" color="green.700" mb={1}>
                Carbon Reduction Achievement
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {farmer.carbonReduction.toLocaleString()} kg CO2e
              </Text>
              <Text fontSize="sm" color="green.600">
                Reduced through sustainable practices
              </Text>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
