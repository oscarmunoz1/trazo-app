import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FaDownload, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { api } from '../../../store/api';

interface Certificate {
  purchase_id: number;
  verification_status: string;
  certificate_generated: boolean;
  certificate_url: string | null;
  last_verified_at: string;
}

export const CertificateView: React.FC = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Fetch certificates
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const response = await api.get('/carbon/offset-purchases/');
      return response.data;
    }
  });

  // Generate certificate mutation
  const generateMutation = useMutation({
    mutationFn: async (purchaseId: number) => {
      const response = await api.post(
        `/carbon/offset-purchases/${purchaseId}/generate_certificate/`
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Certificate Generated',
        description: 'Your certificate has been generated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate certificate. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  });

  const handleGenerateCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    onOpen();
  };

  const confirmGenerate = () => {
    if (selectedCertificate) {
      generateMutation.mutate(selectedCertificate.purchase_id);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Carbon Offset Certificates
          </Heading>
          <Text color="gray.600">View and manage your carbon offset certificates</Text>
        </Box>

        <Box>
          {certificates?.map((certificate: Certificate) => (
            <Box
              key={certificate.purchase_id}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              borderWidth="1px"
              borderColor={borderColor}
              mb={4}
            >
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Text fontWeight="bold">Purchase #{certificate.purchase_id}</Text>
                    <Badge colorScheme={getStatusColor(certificate.verification_status)}>
                      {certificate.verification_status}
                    </Badge>
                  </HStack>
                  <Text color="gray.600">
                    Last verified: {new Date(certificate.last_verified_at).toLocaleDateString()}
                  </Text>
                </VStack>

                <HStack spacing={4}>
                  {certificate.certificate_generated ? (
                    <Button
                      leftIcon={<FaDownload />}
                      colorScheme="blue"
                      onClick={() => window.open(certificate.certificate_url, '_blank')}
                    >
                      Download Certificate
                    </Button>
                  ) : (
                    <Button
                      leftIcon={<FaCheckCircle />}
                      colorScheme="green"
                      onClick={() => handleGenerateCertificate(certificate)}
                      isDisabled={certificate.verification_status !== 'verified'}
                    >
                      Generate Certificate
                    </Button>
                  )}
                </HStack>
              </HStack>
            </Box>
          ))}
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Certificate</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text>
                Are you sure you want to generate a certificate for Purchase #
                {selectedCertificate?.purchase_id}?
              </Text>
              <HStack justify="flex-end" spacing={4}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  colorScheme="green"
                  onClick={confirmGenerate}
                  isLoading={generateMutation.isPending}
                >
                  Generate
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};
