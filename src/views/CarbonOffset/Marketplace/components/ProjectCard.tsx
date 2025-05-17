import React from 'react';
import { Box, Image, Text, Badge, Button, Stack, Flex, useColorModeValue } from '@chakra-ui/react';
import { FaLeaf, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
  description: string;
  project_type: string;
  certification_standard: string;
  price_per_ton: number;
  available_capacity: number;
  total_capacity: number;
  verification_status: string;
  location: {
    latitude: number;
    longitude: number;
  };
  images: string[];
}

interface ProjectCardProps {
  project: Project;
  onPurchase: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPurchase }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}>
      <Image
        src={project.images[0] || '/images/placeholder-project.jpg'}
        alt={project.name}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p={6}>
        <Stack spacing={4}>
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold">
              {project.name}
            </Text>
            <Badge
              colorScheme={getVerificationColor(project.verification_status)}
              px={2}
              py={1}
              borderRadius="full">
              {project.verification_status}
            </Badge>
          </Flex>

          <Text color="gray.600" noOfLines={2}>
            {project.description}
          </Text>

          <Stack direction="row" spacing={4}>
            <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
              <Flex align="center" gap={1}>
                <FaLeaf />
                {project.project_type}
              </Flex>
            </Badge>
            <Badge colorScheme="purple" px={2} py={1} borderRadius="full">
              {project.certification_standard}
            </Badge>
          </Stack>

          <Flex justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="bold" color="green.500">
              ${project.price_per_ton}/ton
            </Text>
            <Text color="gray.500">{project.available_capacity} tons available</Text>
          </Flex>

          <Button
            colorScheme="green"
            size="lg"
            width="full"
            onClick={onPurchase}
            leftIcon={<FaCheckCircle />}>
            Purchase Offsets
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};
