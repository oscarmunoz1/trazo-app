import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaMoneyBillWave,
  FaTools,
  FaTree,
  FaSolarPanel,
  FaWater,
  FaTractor,
  FaRecycle,
  FaLightbulb
} from 'react-icons/fa';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  costSavings: string;
  implementation: string;
  category: string;
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  isCompact?: boolean;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  isCompact = false
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('green.500', 'green.300');

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fertilizer':
        return FaLeaf;
      case 'fuel':
        return FaTractor;
      case 'energy':
        return FaSolarPanel;
      case 'irrigation':
        return FaWater;
      case 'offset':
        return FaTree;
      case 'technology':
        return FaLightbulb;
      case 'soil':
        return FaRecycle;
      default:
        return FaLeaf;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'green';
      case 'medium difficulty':
        return 'yellow';
      case 'difficult':
      case 'difficult initially, easy long-term':
        return 'orange';
      default:
        return 'blue';
    }
  };

  if (isCompact) {
    return (
      <Box
        bg={bgColor}
        borderRadius="md"
        boxShadow="sm"
        p={4}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="sm" mb={3} color={accentColor}>
          Sustainability Recommendations
        </Heading>
        <VStack align="stretch" spacing={2}>
          {recommendations.slice(0, 3).map((rec) => (
            <HStack
              key={rec.id}
              spacing={3}
              p={2}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Icon as={getCategoryIcon(rec.category)} color={accentColor} boxSize={5} />
              <Text fontWeight="medium" fontSize="sm">
                {rec.title}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      boxShadow="md"
      p={6}
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Heading size="md" mb={4} color={accentColor}>
        Sustainability Recommendations
      </Heading>
      <Text fontSize="sm" mb={4} color="gray.600">
        Based on this product's carbon footprint, here are some recommendations for improving
        sustainability:
      </Text>

      <Accordion allowMultiple defaultIndex={[0]}>
        {recommendations.map((rec, index) => (
          <AccordionItem key={rec.id} border="none" mb={3}>
            <AccordionButton
              p={3}
              borderRadius="md"
              _hover={{ bg: 'green.50' }}
              borderWidth="1px"
              borderColor={borderColor}
            >
              <HStack flex="1" spacing={4} align="center">
                <Icon as={getCategoryIcon(rec.category)} color={accentColor} boxSize={6} />
                <Box textAlign="left">
                  <Text fontWeight="bold">{rec.title}</Text>
                </Box>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} pt={3} px={4}>
              <VStack align="stretch" spacing={3}>
                <Text>{rec.description}</Text>

                <Divider />

                <HStack spacing={6} wrap="wrap">
                  <Box flex="1" minW="150px">
                    <Text fontSize="xs" color="gray.500">
                      POTENTIAL IMPACT
                    </Text>
                    <HStack>
                      <Icon as={FaLeaf} color="green.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {rec.impact}
                      </Text>
                    </HStack>
                  </Box>

                  <Box flex="1" minW="150px">
                    <Text fontSize="xs" color="gray.500">
                      COST SAVINGS
                    </Text>
                    <HStack>
                      <Icon as={FaMoneyBillWave} color="green.500" />
                      <Text fontSize="sm" fontWeight="medium">
                        {rec.costSavings}
                      </Text>
                    </HStack>
                  </Box>

                  <Box flex="1" minW="150px">
                    <Text fontSize="xs" color="gray.500">
                      IMPLEMENTATION
                    </Text>
                    <Badge colorScheme={getDifficultyColor(rec.implementation)}>
                      {rec.implementation}
                    </Badge>
                  </Box>
                </HStack>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
};
