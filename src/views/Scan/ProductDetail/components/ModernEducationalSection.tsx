import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  HStack,
  VStack,
  Circle,
  Icon,
  Text,
  Heading,
  Button,
  SimpleGrid,
  useColorModeValue
} from '@chakra-ui/react';
import { FaBookOpen, FaLeaf, FaSeedling } from 'react-icons/fa';
import { MdVerified, MdScience } from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';

interface ModernEducationalSectionProps {
  onEducationOpen: (topic: string) => void;
}

export const ModernEducationalSection: React.FC<ModernEducationalSectionProps> = ({
  onEducationOpen
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card bg={cardBg} shadow="lg" borderRadius="xl">
      <CardHeader>
        <HStack spacing={3}>
          <Circle size="40px" bg="blue.100">
            <Icon as={FaBookOpen} color="blue.600" />
          </Circle>
          <VStack align="start" spacing={0}>
            <Heading size="md" color={textColor}>
              Learn About Sustainability
            </Heading>
            <Text fontSize="sm" color={mutedColor}>
              Understand the impact of your choices
            </Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Button
            variant="ghost"
            justifyContent="start"
            h="auto"
            p={4}
            onClick={() => onEducationOpen('carbon_footprint')}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            _hover={{ bg: 'green.50', borderColor: 'green.200' }}
          >
            <VStack align="start" spacing={2} w="full">
              <HStack>
                <Icon as={FaLeaf} color="green.500" />
                <Text fontWeight="semibold">Carbon Footprint</Text>
              </HStack>
              <Text fontSize="sm" color={mutedColor} textAlign="left">
                How carbon scoring works
              </Text>
            </VStack>
          </Button>

          <Button
            variant="ghost"
            justifyContent="start"
            h="auto"
            p={4}
            onClick={() => onEducationOpen('usda_verification')}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            _hover={{ bg: 'blue.50', borderColor: 'blue.200' }}
          >
            <VStack align="start" spacing={2} w="full">
              <HStack>
                <Icon as={MdVerified} color="blue.500" />
                <Text fontWeight="semibold">USDA Standards</Text>
              </HStack>
              <Text fontSize="sm" color={mutedColor} textAlign="left">
                Government verification process
              </Text>
            </VStack>
          </Button>

          <Button
            variant="ghost"
            justifyContent="start"
            h="auto"
            p={4}
            onClick={() => onEducationOpen('blockchain_verification')}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            _hover={{ bg: 'purple.50', borderColor: 'purple.200' }}
          >
            <VStack align="start" spacing={2} w="full">
              <HStack>
                <Icon as={BsShieldCheck} color="purple.500" />
                <Text fontWeight="semibold">Blockchain Proof</Text>
              </HStack>
              <Text fontSize="sm" color={mutedColor} textAlign="left">
                Immutable data verification
              </Text>
            </VStack>
          </Button>

          <Button
            variant="ghost"
            justifyContent="start"
            h="auto"
            p={4}
            onClick={() => onEducationOpen('sustainable_practices')}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            _hover={{ bg: 'orange.50', borderColor: 'orange.200' }}
          >
            <VStack align="start" spacing={2} w="full">
              <HStack>
                <Icon as={FaSeedling} color="orange.500" />
                <Text fontWeight="semibold">Farm Practices</Text>
              </HStack>
              <Text fontSize="sm" color={mutedColor} textAlign="left">
                Sustainable farming methods
              </Text>
            </VStack>
          </Button>
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};
