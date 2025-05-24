import React from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  Flex,
  Icon,
  Divider,
  Avatar,
  Button,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaTractor,
  FaMapMarkerAlt,
  FaAward,
  FaClock,
  FaQuoteLeft,
  FaQuoteRight,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

export interface InlineFarmerStoryProps {
  name: string;
  photo: string;
  location: string;
  bio: string;
  story: string;
  certifications: string[];
  sustainabilityInitiatives: string[];
  generation: number;
  yearsOfPractice: number;
}

export const InlineFarmerStory: React.FC<InlineFarmerStoryProps> = ({
  name,
  photo,
  location,
  bio,
  story,
  certifications,
  sustainabilityInitiatives,
  generation,
  yearsOfPractice
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { isOpen, onToggle } = useDisclosure();

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <Avatar src={photo} name={name} size="xl" border="3px solid" borderColor="green.500" />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="xl" color={textColor}>
            {name}
          </Text>
          <HStack>
            <Icon as={FaMapMarkerAlt} color="green.500" />
            <Text fontSize="md" color="gray.600">
              {location}
            </Text>
          </HStack>
          <HStack>
            <Icon as={FaTractor} color="green.500" />
            <Text fontSize="md" color="gray.600">
              {generation}
              {generation === 1
                ? 'st'
                : generation === 2
                ? 'nd'
                : generation === 3
                ? 'rd'
                : 'th'}{' '}
              Generation Farmer
            </Text>
          </HStack>
          <HStack>
            <Icon as={FaClock} color="green.500" />
            <Text fontSize="md" color="gray.600">
              {yearsOfPractice} years of sustainable farming
            </Text>
          </HStack>
        </VStack>
      </HStack>

      <Text color="gray.600">{bio}</Text>

      {certifications && certifications.length > 0 && (
        <Box>
          <Text fontWeight="semibold" mb={2}>
            Certifications
          </Text>
          <Flex wrap="wrap" gap={2}>
            {certifications.map((cert, index) => (
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

      <Button
        onClick={onToggle}
        variant="outline"
        colorScheme="green"
        size="sm"
        width="100%"
        rightIcon={<Icon as={isOpen ? FaChevronUp : FaChevronDown} />}
      >
        {isOpen ? 'Read Less' : "Read Farmer's Story"}
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Box
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          bg="green.50"
          position="relative"
        >
          <Icon
            as={FaQuoteLeft}
            position="absolute"
            top={2}
            left={2}
            color="green.200"
            boxSize={6}
          />
          <Box px={8} py={4}>
            <Text color="gray.700" fontStyle="italic">
              {story}
            </Text>
          </Box>
          <Icon
            as={FaQuoteRight}
            position="absolute"
            bottom={2}
            right={2}
            color="green.200"
            boxSize={6}
          />
        </Box>

        {sustainabilityInitiatives && sustainabilityInitiatives.length > 0 && (
          <Box mt={4}>
            <Text fontWeight="semibold" mb={2}>
              Sustainability Initiatives
            </Text>
            <VStack align="start" spacing={2}>
              {sustainabilityInitiatives.map((initiative, index) => (
                <HStack key={index} spacing={2} align="start">
                  <Text color="green.500" fontWeight="bold">
                    •
                  </Text>
                  <Text>{initiative}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
      </Collapse>
    </VStack>
  );
};
