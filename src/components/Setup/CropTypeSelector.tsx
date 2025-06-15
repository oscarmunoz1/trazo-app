import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Badge,
  Icon,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from '@chakra-ui/react';
import { FaLeaf, FaSeedling, FaAppleAlt } from 'react-icons/fa';
import { GiCorn } from 'react-icons/gi';

interface CropTemplate {
  id: string;
  name: string;
  icon: any;
  description: string;
  avgRevenue: string;
  carbonBenchmark: string;
  commonEvents: string[];
  seasonLength: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  marketDemand: 'High' | 'Medium' | 'Low';
}

const cropTemplates: CropTemplate[] = [
  {
    id: 'citrus',
    name: 'Citrus Fruits',
    icon: FaAppleAlt,
    description: 'Oranges, lemons, grapefruits - Premium California citrus',
    avgRevenue: '$8,000-15,000/acre',
    carbonBenchmark: '2.1 tons CO2e/acre',
    commonEvents: ['Irrigation', 'Pruning', 'Pest Management', 'Fertilization'],
    seasonLength: 'Year-round',
    difficulty: 'Medium',
    marketDemand: 'High'
  },
  {
    id: 'almonds',
    name: 'Almonds',
    icon: FaSeedling,
    description: "California's premium tree nut crop",
    avgRevenue: '$4,000-8,000/acre',
    carbonBenchmark: '1.8 tons CO2e/acre',
    commonEvents: ['Irrigation', 'Harvest', 'Pruning', 'Pollination'],
    seasonLength: 'Feb-Oct',
    difficulty: 'Advanced',
    marketDemand: 'High'
  },
  {
    id: 'corn',
    name: 'Corn',
    icon: GiCorn,
    description: 'Field corn for feed and ethanol production',
    avgRevenue: '$800-1,200/acre',
    carbonBenchmark: '0.9 tons CO2e/acre',
    commonEvents: ['Planting', 'Fertilization', 'Harvest', 'Tillage'],
    seasonLength: 'Apr-Oct',
    difficulty: 'Easy',
    marketDemand: 'High'
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    icon: FaLeaf,
    description: 'Nitrogen-fixing legume crop',
    avgRevenue: '$600-900/acre',
    carbonBenchmark: '0.4 tons CO2e/acre',
    commonEvents: ['Planting', 'Pest Management', 'Harvest', 'Rotation'],
    seasonLength: 'May-Oct',
    difficulty: 'Easy',
    marketDemand: 'High'
  }
];

interface CropTypeSelectorProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export const CropTypeSelector: React.FC<CropTypeSelectorProps> = ({ data, onChange, onNext }) => {
  const handleCropSelect = (crop: CropTemplate) => {
    onChange({
      ...data,
      cropType: crop.id,
      cropTemplate: crop,
      expectedRevenue: crop.avgRevenue,
      carbonBenchmark: crop.carbonBenchmark
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
          What's your primary crop?
        </Text>
        <Text color="gray.600" maxW="500px" mx="auto">
          Choose your main crop to get optimized templates, carbon benchmarks, and event tracking
          specifically designed for your farming operation.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {cropTemplates.map((crop) => (
          <Card
            key={crop.id}
            cursor="pointer"
            onClick={() => handleCropSelect(crop)}
            bg={data.cropType === crop.id ? 'green.50' : 'white'}
            borderColor={data.cropType === crop.id ? 'green.500' : 'gray.200'}
            borderWidth={2}
            _hover={{
              borderColor: 'green.400',
              transform: 'translateY(-2px)',
              shadow: 'lg'
            }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                {/* Header */}
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Icon as={crop.icon} boxSize={6} color="green.500" />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="lg" fontWeight="bold">
                        {crop.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {crop.seasonLength}
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack spacing={1}>
                    <Badge
                      colorScheme={
                        crop.difficulty === 'Easy'
                          ? 'green'
                          : crop.difficulty === 'Medium'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {crop.difficulty}
                    </Badge>
                    <Badge colorScheme="blue" variant="outline">
                      {crop.marketDemand} Demand
                    </Badge>
                  </VStack>
                </HStack>

                {/* Description */}
                <Text fontSize="sm" color="gray.700">
                  {crop.description}
                </Text>

                {/* Stats */}
                <HStack spacing={4}>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Revenue/Acre</StatLabel>
                    <StatNumber fontSize="sm" color="green.600">
                      {crop.avgRevenue}
                    </StatNumber>
                  </Stat>
                  <Stat size="sm">
                    <StatLabel fontSize="xs">Carbon Footprint</StatLabel>
                    <StatNumber fontSize="sm" color="orange.600">
                      {crop.carbonBenchmark}
                    </StatNumber>
                    <StatHelpText fontSize="xs">Industry avg</StatHelpText>
                  </Stat>
                </HStack>

                {/* Common Events */}
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={1}>
                    Common Events:
                  </Text>
                  <HStack spacing={1} flexWrap="wrap">
                    {crop.commonEvents.slice(0, 3).map((event, index) => (
                      <Badge key={index} size="sm" variant="outline">
                        {event}
                      </Badge>
                    ))}
                    {crop.commonEvents.length > 3 && (
                      <Badge size="sm" variant="outline">
                        +{crop.commonEvents.length - 3} more
                      </Badge>
                    )}
                  </HStack>
                </Box>

                {/* Selection Indicator */}
                {data.cropType === crop.id && (
                  <Box bg="green.500" color="white" p={2} borderRadius="md" textAlign="center">
                    <Text fontSize="sm" fontWeight="bold">
                      ✓ Selected - Templates Ready!
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Custom Crop Option */}
      <Card borderStyle="dashed" borderWidth={2} borderColor="gray.300">
        <CardBody textAlign="center" py={6}>
          <VStack spacing={3}>
            <Icon as={FaSeedling} boxSize={8} color="gray.400" />
            <VStack spacing={1}>
              <Text fontWeight="bold" color="gray.600">
                Don't see your crop?
              </Text>
              <Text fontSize="sm" color="gray.500">
                Contact us to add custom crop templates and benchmarks
              </Text>
            </VStack>
            <Button variant="outline" size="sm" colorScheme="gray">
              Request Custom Crop
            </Button>
          </VStack>
        </CardBody>
      </Card>

      {/* Benefits Preview */}
      {data.cropType && (
        <Box bg="blue.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
          <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>
            🎯 What you'll get with {cropTemplates.find((c) => c.id === data.cropType)?.name}:
          </Text>
          <VStack spacing={1} align="start" fontSize="sm" color="blue.600">
            <Text>• Pre-configured event templates for faster data entry</Text>
            <Text>• Industry carbon benchmarks for your crop type</Text>
            <Text>• Seasonal calendar with optimal timing recommendations</Text>
            <Text>• Crop-specific sustainability best practices</Text>
            <Text>• Revenue and carbon tracking tailored to your operation</Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
