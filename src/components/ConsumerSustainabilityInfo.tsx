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
  SimpleGrid,
  Flex,
  Circle
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaShoppingBasket,
  FaRecycle,
  FaAppleAlt,
  FaTruck,
  FaWater,
  FaSeedling,
  FaCarrot
} from 'react-icons/fa';
import { MdEco, MdLocalFlorist, MdNoFood } from 'react-icons/md';
import { useIntl } from 'react-intl';

interface SustainabilityPractice {
  icon: React.ReactElement;
  title: string;
  description: string;
}

interface ConsumerSustainabilityInfoProps {
  productName: string;
  carbonScore: number;
  sustainabilityPractices?: SustainabilityPractice[];
}

export const ConsumerSustainabilityInfo: React.FC<ConsumerSustainabilityInfoProps> = ({
  productName,
  carbonScore,
  sustainabilityPractices = []
}) => {
  const intl = useIntl();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('green.500', 'green.300');

  // Default sustainability practices if none provided
  const defaultPractices: SustainabilityPractice[] = [
    {
      icon: <Icon as={FaWater} color="blue.400" />,
      title: intl.formatMessage({ id: 'app.waterConservation' }),
      description: 'This product is grown using water-saving techniques like drip irrigation'
    },
    {
      icon: <Icon as={MdNoFood} color="red.400" />,
      title: intl.formatMessage({ id: 'app.reducedPesticides' }),
      description: 'Minimal or no synthetic pesticides were used in growing this product'
    },
    {
      icon: <Icon as={FaLeaf} color="green.400" />,
      title: intl.formatMessage({ id: 'app.soilHealth' }),
      description: 'Practices like cover cropping maintain soil health and capture carbon'
    },
    {
      icon: <Icon as={FaRecycle} color="purple.400" />,
      title: intl.formatMessage({ id: 'app.sustainablePackaging' }),
      description: 'This product uses recyclable or biodegradable packaging materials'
    }
  ];

  const practices = sustainabilityPractices.length > 0 ? sustainabilityPractices : defaultPractices;

  // Impact messages based on carbon score
  const getConsumerImpact = () => {
    if (carbonScore >= 80) {
      return {
        title: intl.formatMessage({ id: 'app.excellentChoice' }),
        description:
          "By choosing this product, you're supporting agricultural practices that significantly reduce carbon emissions and protect the environment."
      };
    } else if (carbonScore >= 60) {
      return {
        title: intl.formatMessage({ id: 'app.goodGreenChoice' }),
        description:
          'This product has a lower carbon footprint than average, helping reduce environmental impact.'
      };
    } else if (carbonScore >= 40) {
      return {
        title: intl.formatMessage({ id: 'app.averageImpact' }),
        description:
          'This product has an average environmental footprint. The producer is working on sustainability improvements.'
      };
    } else {
      return {
        title: intl.formatMessage({ id: 'app.improvementOpportunity' }),
        description:
          'While this product has a higher carbon footprint, your scan helps encourage the producer to adopt greener practices.'
      };
    }
  };

  const impact = getConsumerImpact();

  return (
    <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6}>
      <VStack spacing={6} align="stretch">
        <Flex
          align="center"
          justify="space-between"
          flexDirection={{ base: 'column', md: 'row' }}
          gap={4}>
          <Heading size="md" color={accentColor}>
            {intl.formatMessage({ id: 'app.sustainabilityHighlights' })}
          </Heading>
          <Flex justifyContent="flex-end" w="100%">
            <Badge
              colorScheme={
                carbonScore >= 80
                  ? 'green'
                  : carbonScore >= 60
                  ? 'blue'
                  : carbonScore >= 40
                  ? 'yellow'
                  : 'orange'
              }
              fontSize="md"
              px={2}
              py={1}
              borderRadius="full">
              {carbonScore >= 80
                ? intl.formatMessage({ id: 'app.excellentScore' })
                : carbonScore >= 60
                ? intl.formatMessage({ id: 'app.goodScore' })
                : carbonScore >= 40
                ? intl.formatMessage({ id: 'app.averageScore' })
                : intl.formatMessage({ id: 'app.fairScore' })}
              {' Score'}
            </Badge>
          </Flex>
        </Flex>

        {/* Consumer impact section */}
        <Box
          p={4}
          bg={
            carbonScore >= 80
              ? 'green.50'
              : carbonScore >= 60
              ? 'blue.50'
              : carbonScore >= 40
              ? 'yellow.50'
              : 'orange.50'
          }
          borderRadius="md">
          <HStack spacing={3} mb={2}>
            <Circle
              size="40px"
              bg={
                carbonScore >= 80
                  ? 'green.100'
                  : carbonScore >= 60
                  ? 'blue.100'
                  : carbonScore >= 40
                  ? 'yellow.100'
                  : 'orange.100'
              }>
              <Icon
                as={FaShoppingBasket}
                color={
                  carbonScore >= 80
                    ? 'green.500'
                    : carbonScore >= 60
                    ? 'blue.500'
                    : carbonScore >= 40
                    ? 'yellow.500'
                    : 'orange.500'
                }
                boxSize={5}
              />
            </Circle>
            <Heading size="sm">{impact.title}</Heading>
          </HStack>
          <Text ml={12} fontSize="sm">
            {impact.description}
          </Text>
        </Box>

        {/* Sustainability practices */}
        <Heading size="sm" mt={2}>
          {intl.formatMessage({ id: 'app.whatMakesProductSustainable' })}
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {practices.map((practice, index) => (
            <HStack
              key={index}
              p={3}
              borderRadius="md"
              borderWidth="1px"
              borderColor={borderColor}
              transition="all 0.3s"
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'sm' }}
              align="flex-start">
              <Circle size="40px" bg="green.50" mt={1}>
                {practice.icon}
              </Circle>
              <Box>
                <Text fontWeight="bold" fontSize="sm">
                  {practice.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {practice.description}
                </Text>
              </Box>
            </HStack>
          ))}
        </SimpleGrid>

        {/* Consumer actions */}
        <Box p={4} bg="blue.50" borderRadius="md" mt={2}>
          <Heading size="sm" mb={3} color="blue.600">
            {intl.formatMessage({ id: 'app.whatYouCanDo' })}
          </Heading>
          <VStack spacing={2} align="stretch">
            <HStack>
              <Icon as={FaRecycle} color="blue.500" />
              <Text fontSize="sm">{intl.formatMessage({ id: 'app.recyclePackaging' })}</Text>
            </HStack>
            <HStack>
              <Icon as={FaLeaf} color="blue.500" />
              <Text fontSize="sm">
                {intl.formatMessage({ id: 'app.shareSustainabilityStory' })}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FaCarrot} color="blue.500" />
              <Text fontSize="sm">
                {intl.formatMessage({ id: 'app.lookForHighScoreProducts' })}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};
