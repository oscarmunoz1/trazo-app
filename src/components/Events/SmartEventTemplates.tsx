import React, { useState } from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Icon,
  Badge,
  Button,
  Card,
  CardBody,
  useColorModeValue,
  Alert,
  AlertIcon,
  Tooltip
} from '@chakra-ui/react';
import {
  FaSeedling,
  FaTint,
  FaSprayCan,
  FaCut,
  FaLeaf,
  FaCamera,
  FaEye,
  FaCheckCircle
} from 'react-icons/fa';

interface CarbonEventTemplate {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  carbonImpact: number;
  carbonCategory: 'high' | 'medium' | 'low';
  sustainabilityScore: number;
  qrVisibility: 'high' | 'medium' | 'low';
  usageFrequency: 'common' | 'seasonal' | 'rare';
  cropTypes: string[];
  defaultValues: {
    duration?: string;
    application_rate?: string;
    efficiency_tip: string;
  };
}

interface SmartEventTemplatesProps {
  cropType: string;
  onTemplateSelect: (template: CarbonEventTemplate) => void;
  selectedTemplate?: CarbonEventTemplate | null;
}

export const SmartEventTemplates: React.FC<SmartEventTemplatesProps> = ({
  cropType,
  onTemplateSelect,
  selectedTemplate
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Carbon-focused event templates
  const carbonEventTemplates: CarbonEventTemplate[] = [
    {
      id: 'fertilization',
      name: 'Fertilización',
      icon: FaSeedling,
      color: 'green',
      description: 'Aplicación de fertilizante orgánico/sintético',
      carbonImpact: 45,
      carbonCategory: 'high',
      sustainabilityScore: 7,
      qrVisibility: 'high',
      usageFrequency: 'common',
      cropTypes: ['citrus', 'almonds', 'soybeans', 'corn'],
      defaultValues: {
        duration: '2-3 hours',
        application_rate: '200 lbs/acre',
        efficiency_tip: 'Soil testing reduces fertilizer needs by 20-30%'
      }
    },
    {
      id: 'irrigation',
      name: 'Riego',
      icon: FaTint,
      color: 'blue',
      description: 'Sistema de riego eficiente',
      carbonImpact: 25,
      carbonCategory: 'medium',
      sustainabilityScore: 8,
      qrVisibility: 'medium',
      usageFrequency: 'common',
      cropTypes: ['citrus', 'almonds', 'soybeans', 'corn'],
      defaultValues: {
        duration: '1-2 hours setup',
        application_rate: 'Variable by system',
        efficiency_tip: 'Smart controllers save 25% energy'
      }
    },
    {
      id: 'pest_control',
      name: 'Control de Plagas',
      icon: FaSprayCan,
      color: 'orange',
      description: 'Manejo integrado de plagas (IPM)',
      carbonImpact: 35,
      carbonCategory: 'high',
      sustainabilityScore: 6,
      qrVisibility: 'high',
      usageFrequency: 'seasonal',
      cropTypes: ['citrus', 'almonds', 'soybeans', 'corn'],
      defaultValues: {
        duration: '3-4 hours',
        application_rate: '1-2 gallons/acre',
        efficiency_tip: 'IPM reduces pesticide use by 40%'
      }
    },
    {
      id: 'pruning',
      name: 'Poda',
      icon: FaCut,
      color: 'purple',
      description: 'Poda de precisión para optimización',
      carbonImpact: 20,
      carbonCategory: 'low',
      sustainabilityScore: 9,
      qrVisibility: 'low',
      usageFrequency: 'seasonal',
      cropTypes: ['citrus', 'almonds'],
      defaultValues: {
        duration: '4-6 hours',
        application_rate: 'Per tree/plant',
        efficiency_tip: 'Precision pruning reduces fuel by 15%'
      }
    },
    {
      id: 'bloom_nutrition',
      name: 'Nutrición de Floración',
      icon: FaLeaf,
      color: 'pink',
      description: 'Nutrición específica para floración',
      carbonImpact: 30,
      carbonCategory: 'medium',
      sustainabilityScore: 8,
      qrVisibility: 'medium',
      usageFrequency: 'seasonal',
      cropTypes: ['citrus', 'almonds'],
      defaultValues: {
        duration: '2-3 hours',
        application_rate: '150-180 lbs/acre',
        efficiency_tip: 'Timing-specific nutrition improves efficiency by 20%'
      }
    }
  ];

  // Filter templates by crop type
  const relevantTemplates = carbonEventTemplates.filter((template) =>
    template.cropTypes.includes(cropType.toLowerCase())
  );

  const getCarbonCategoryColor = (category: string) => {
    switch (category) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'high':
        return FaEye;
      case 'medium':
        return FaCamera;
      case 'low':
        return FaCheckCircle;
      default:
        return FaCamera;
    }
  };

  return (
    <Box>
      {/* Carbon Focus Header */}
      <Alert status="info" borderRadius="lg" mb={6}>
        <AlertIcon />
        <VStack align="start" spacing={1} flex={1}>
          <Text fontSize="sm" fontWeight="semibold">
            🌱 Carbon Transparency Templates
          </Text>
          <Text fontSize="xs">
            Pre-configured events optimized for {cropType} carbon tracking and consumer visibility
          </Text>
        </VStack>
      </Alert>

      {/* Templates Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        {relevantTemplates.map((template) => (
          <Card
            key={template.id}
            cursor="pointer"
            borderWidth="2px"
            borderColor={
              selectedTemplate?.id === template.id ? `${template.color}.300` : borderColor
            }
            bg={selectedTemplate?.id === template.id ? `${template.color}.50` : bgColor}
            onClick={() => onTemplateSelect(template)}
            _hover={{
              borderColor: `${template.color}.300`,
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            transition="all 0.2s"
          >
            <CardBody p={4}>
              <VStack spacing={3} align="start">
                {/* Header with Icon and Carbon Impact */}
                <HStack justify="space-between" width="100%">
                  <HStack>
                    <Icon as={template.icon} color={`${template.color}.500`} boxSize={5} />
                    <Text fontWeight="bold" fontSize="sm">
                      {template.name}
                    </Text>
                  </HStack>
                  <Badge colorScheme={getCarbonCategoryColor(template.carbonCategory)} size="sm">
                    {template.carbonImpact} kg CO₂
                  </Badge>
                </HStack>

                {/* Description */}
                <Text fontSize="xs" color="gray.600">
                  {template.description}
                </Text>

                {/* Metrics Row */}
                <HStack justify="space-between" width="100%">
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">
                      Sustainability Score
                    </Text>
                    <HStack>
                      <Text fontSize="sm" fontWeight="bold" color="green.600">
                        {template.sustainabilityScore}/10
                      </Text>
                    </HStack>
                  </VStack>

                  <VStack align="end" spacing={0}>
                    <Text fontSize="xs" color="gray.500">
                      QR Visibility
                    </Text>
                    <HStack>
                      <Icon
                        as={getVisibilityIcon(template.qrVisibility)}
                        color="blue.400"
                        boxSize={3}
                      />
                      <Text fontSize="xs" color="blue.600" fontWeight="medium">
                        {template.qrVisibility}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                {/* Usage Frequency Badge */}
                <HStack justify="space-between" width="100%">
                  <Badge
                    colorScheme={template.usageFrequency === 'common' ? 'green' : 'blue'}
                    size="xs"
                  >
                    {template.usageFrequency}
                  </Badge>
                  <Text fontSize="xs" color="gray.500">
                    {template.defaultValues.duration}
                  </Text>
                </HStack>

                {/* Efficiency Tip */}
                <Box p={2} bg="gray.50" borderRadius="md" width="100%">
                  <Text fontSize="xs" color="gray.600">
                    💡 {template.defaultValues.efficiency_tip}
                  </Text>
                </Box>

                {/* Selection Indicator */}
                {selectedTemplate?.id === template.id && (
                  <HStack justify="center" width="100%" pt={2}>
                    <Icon as={FaCheckCircle} color="green.500" />
                    <Text fontSize="xs" color="green.600" fontWeight="bold">
                      Template Selected
                    </Text>
                  </HStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Selected Template Summary */}
      {selectedTemplate && (
        <Box mt={6} p={4} bg="green.50" borderRadius="lg" borderWidth="1px" borderColor="green.200">
          <VStack spacing={3}>
            <HStack justify="space-between" width="100%">
              <Text fontWeight="bold" color="green.700">
                Ready to create: {selectedTemplate.name}
              </Text>
              <Badge colorScheme="green">
                Carbon Impact: {selectedTemplate.carbonImpact} kg CO₂
              </Badge>
            </HStack>

            <Text fontSize="sm" color="green.600" textAlign="center">
              This event will be visible to consumers with {selectedTemplate.qrVisibility}{' '}
              visibility on QR scans
            </Text>

            <HStack spacing={2} wrap="wrap" justify="center">
              <Badge colorScheme="blue" size="sm">
                {selectedTemplate.defaultValues.application_rate}
              </Badge>
              <Badge colorScheme="purple" size="sm">
                {selectedTemplate.defaultValues.duration}
              </Badge>
              <Badge colorScheme="green" size="sm">
                Score: {selectedTemplate.sustainabilityScore}/10
              </Badge>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
};
