import React, { useState } from 'react';
import {
  Box,
  Badge,
  Text,
  VStack,
  HStack,
  Icon,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Progress,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { FiShield, FiInfo, FiCheckCircle, FiMapPin } from 'react-icons/fi';
import { useGetUSDACredibilityInfoQuery } from '../../store/api/carbonApi';

interface USDACredibilityData {
  usda_based: boolean;
  data_source: string;
  methodology: string;
  confidence_level: 'high' | 'medium' | 'low';
  regional_specificity: boolean;
  compliance_statement: string;
  credibility_score: number;
  verification_details: {
    factors_verified: boolean;
    usda_compliant: boolean;
    scientifically_validated: boolean;
    peer_reviewed: boolean;
  };
  establishment_name?: string;
  establishment_location?: string;
  regional_optimization?: boolean;
}

interface USDACredibilityBadgeProps {
  establishmentId: number;
  compact?: boolean;
  showDetails?: boolean;
}

const USDACredibilityBadge: React.FC<USDACredibilityBadgeProps> = ({
  establishmentId,
  compact = false,
  showDetails = true
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  const {
    data: credibilityData,
    isLoading: loading,
    error
  } = useGetUSDACredibilityInfoQuery(establishmentId, {
    skip: !isOpen // Only fetch when modal is opened
  });

  const handleBadgeClick = () => {
    onOpen();
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 80) return 'blue';
    if (score >= 70) return 'yellow';
    return 'orange';
  };

  if (compact) {
    return (
      <>
        <Tooltip label="Click to see USDA data verification details">
          <Badge
            colorScheme="blue"
            variant="subtle"
            cursor="pointer"
            onClick={handleBadgeClick}
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={1}
          >
            <Icon as={FiShield} boxSize={3} />
            <Text fontSize="xs">USDA Data</Text>
          </Badge>
        </Tooltip>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <Box
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        p={4}
        cursor={showDetails ? 'pointer' : 'default'}
        onClick={showDetails ? handleBadgeClick : undefined}
        _hover={showDetails ? { borderColor: 'blue.300', shadow: 'sm' } : {}}
        transition="all 0.2s"
      >
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2} flex={1}>
            <HStack>
              <Icon as={FiShield} color="blue.500" boxSize={5} />
              <Text fontWeight="semibold" color={textColor}>
                USDA-Based Carbon Data
              </Text>
            </HStack>

            <Text fontSize="sm" color="gray.500" lineHeight="short">
              Uses official USDA Agricultural Research Service emission factors for accurate carbon
              calculations
            </Text>

            <HStack spacing={2}>
              <Badge colorScheme="blue" variant="subtle">
                <Icon as={FiCheckCircle} boxSize={3} mr={1} />
                Verified Factors
              </Badge>
              <Badge colorScheme="green" variant="subtle">
                Scientifically Validated
              </Badge>
            </HStack>
          </VStack>

          {showDetails && <Icon as={FiInfo} color="gray.400" boxSize={4} />}
        </HStack>
      </Box>
      {renderModal()}
    </>
  );

  function renderModal() {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FiShield} color="blue.500" />
              <Text>USDA Data Verification</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {loading ? (
              <VStack spacing={4}>
                <Progress size="sm" isIndeterminate colorScheme="blue" w="100%" />
                <Text color="gray.500">Loading verification details...</Text>
              </VStack>
            ) : error || !credibilityData ? (
              <Text color="gray.500">Unable to load verification details</Text>
            ) : (
              <VStack spacing={6} align="stretch">
                {/* Establishment Info */}
                {credibilityData.establishment_name && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>
                      Farm Information
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm">{credibilityData.establishment_name}</Text>
                      {credibilityData.establishment_location && (
                        <HStack>
                          <Icon as={FiMapPin} boxSize={3} color="gray.400" />
                          <Text fontSize="sm" color="gray.500">
                            {credibilityData.establishment_location}
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                )}

                <Divider />

                {/* Credibility Score */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="semibold">Data Credibility Score</Text>
                    <Badge
                      colorScheme={getCredibilityColor(credibilityData.credibility_score)}
                      fontSize="sm"
                      px={3}
                      py={1}
                    >
                      {credibilityData.credibility_score}/100
                    </Badge>
                  </HStack>
                  <Progress
                    value={credibilityData.credibility_score}
                    colorScheme={getCredibilityColor(credibilityData.credibility_score)}
                    size="lg"
                    borderRadius="md"
                  />
                </Box>

                <Divider />

                {/* Data Source & Methodology */}
                <Box>
                  <Text fontWeight="semibold" mb={3}>
                    Data Source & Methodology
                  </Text>
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Icon as={FiCheckCircle} color="green.500" boxSize={4} />
                      <Text fontSize="sm">{credibilityData.data_source}</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600" pl={6}>
                      {credibilityData.methodology}
                    </Text>
                    <Text fontSize="sm" color="gray.500" pl={6}>
                      {credibilityData.compliance_statement}
                    </Text>
                  </VStack>
                </Box>

                <Divider />

                {/* Verification Details */}
                <Box>
                  <Text fontWeight="semibold" mb={3}>
                    Verification Status
                  </Text>
                  <VStack align="start" spacing={2}>
                    {Object.entries(credibilityData.verification_details).map(([key, value]) => (
                      <HStack key={key}>
                        <Icon
                          as={value ? FiCheckCircle : FiInfo}
                          color={value ? 'green.500' : 'gray.400'}
                          boxSize={4}
                        />
                        <Text fontSize="sm" textTransform="capitalize">
                          {key.replace(/_/g, ' ')}: {value ? 'Yes' : 'No'}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Regional Optimization */}
                {credibilityData.regional_optimization && (
                  <>
                    <Divider />
                    <Box>
                      <HStack mb={2}>
                        <Icon as={FiMapPin} color="blue.500" boxSize={4} />
                        <Text fontWeight="semibold">Regional Optimization</Text>
                        <Badge colorScheme="blue" variant="subtle">
                          Enhanced
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        Carbon calculations are optimized for your specific region using localized
                        USDA emission factors for improved accuracy.
                      </Text>
                    </Box>
                  </>
                )}

                {/* Confidence Level */}
                <Box>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold">Confidence Level</Text>
                    <Badge
                      colorScheme={getConfidenceColor(credibilityData.confidence_level)}
                      textTransform="capitalize"
                    >
                      {credibilityData.confidence_level}
                    </Badge>
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
};

export default USDACredibilityBadge;
