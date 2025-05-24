import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Stack,
  useToast,
  Badge,
  Flex,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../../../store/api';
import { ProjectCard } from './components/ProjectCard';
import { PurchaseConfirmation } from './components/PurchaseConfirmation';
import { FilterSidebar } from './components/FilterSidebar';
import { ProjectDetails } from './components/ProjectDetails';

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

export const Marketplace: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState({
    project_type: '',
    certification: '',
    min_price: '',
    max_price: '',
    min_capacity: ''
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch projects with filters
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await api.get(`/carbon/offset-projects/?${params}`);
      return response.data;
    }
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async ({ projectId, amount }: { projectId: number; amount: number }) => {
      const response = await api.post(`/carbon/offset-projects/${projectId}/purchase/`, {
        amount
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Purchase Successful',
        description: 'Your carbon offset purchase has been completed.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Purchase Failed',
        description: 'There was an error processing your purchase.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  });

  const handlePurchase = (project: Project) => {
    setSelectedProject(project);
    onOpen();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg" mb={2}>
            Carbon Offset Marketplace
          </Heading>
          <Text color="gray.600">Browse and purchase verified carbon offset projects</Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '250px 1fr' }} gap={8}>
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

          <Box>
            {isLoading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                }}
                gap={6}
              >
                {projects?.map((project: Project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onPurchase={() => handlePurchase(project)}
                  />
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Stack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Purchase Carbon Offsets</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProject && (
              <PurchaseConfirmation
                project={selectedProject}
                onPurchase={(amount) =>
                  purchaseMutation.mutate({
                    projectId: selectedProject.id,
                    amount
                  })
                }
                isLoading={purchaseMutation.isPending}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};
