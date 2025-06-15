import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FaCheck, FaStar, FaRocket, FaBuilding } from 'react-icons/fa';

interface PlanRecommenderProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  icon: any;
  description: string;
  features: string[];
  limits: {
    parcels: string;
    productions: string;
    automation: string;
  };
  recommended?: boolean;
  popular?: boolean;
}

export const PlanRecommender: React.FC<PlanRecommenderProps> = ({ data, onChange, onNext }) => {
  // Calculate recommended plan based on farm data
  const getRecommendedPlan = () => {
    const acres = data.farmLocation?.acres || 0;
    const hasEquipment = data.equipment?.johnDeere || data.equipment?.caseIH;
    const cropType = data.cropType;

    // Basic: Small farms, manual tracking
    if (acres <= 100 && !hasEquipment) return 'basic';

    // Corporate: Large farms or premium crops
    if (acres > 500 || cropType === 'citrus' || cropType === 'almonds') return 'corporate';

    // Standard: Medium farms with some automation
    return 'standard';
  };

  const recommendedPlanId = getRecommendedPlan();

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$69/month',
      icon: FaStar,
      description: 'Perfect for small farms getting started with carbon tracking',
      features: [
        'Up to 2 parcels',
        '4 productions per parcel',
        'Basic carbon tracking',
        'QR code generation',
        'Manual event entry',
        'Basic reporting',
        'Email support'
      ],
      limits: {
        parcels: '2 parcels max',
        productions: '4 per parcel',
        automation: 'Manual entry only'
      },
      recommended: recommendedPlanId === 'basic'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$149/month',
      icon: FaRocket,
      description: 'Ideal for growing farms with equipment integration',
      features: [
        'Up to 10 parcels',
        '12 productions per parcel',
        'Advanced carbon tracking',
        '50% IoT automation',
        'John Deere integration',
        'USDA verification',
        'Advanced reporting',
        'Priority support'
      ],
      limits: {
        parcels: '10 parcels max',
        productions: '12 per parcel',
        automation: '50% automated'
      },
      recommended: recommendedPlanId === 'standard',
      popular: true
    },
    {
      id: 'corporate',
      name: 'Corporate',
      price: '$499/month',
      icon: FaBuilding,
      description: 'For large operations requiring maximum automation',
      features: [
        '25 parcels per establishment',
        'Unlimited productions',
        'Enterprise carbon tracking',
        '85% IoT automation',
        'All equipment integrations',
        'Custom reporting',
        'API access',
        'Dedicated support'
      ],
      limits: {
        parcels: '25 per establishment',
        productions: 'Unlimited',
        automation: '85% automated'
      },
      recommended: recommendedPlanId === 'corporate'
    }
  ];

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    onChange({
      ...data,
      recommendedPlan: plan.id,
      planFeatures: plan
    });
  };

  const selectedPlan = plans.find((p) => p.id === data.recommendedPlan);

  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
          Choose Your Plan
        </Text>
        <Text color="gray.600" maxW="500px" mx="auto">
          Based on your {data.farmLocation?.acres} acre {data.cropType} farm, we recommend the{' '}
          <strong>{plans.find((p) => p.recommended)?.name}</strong> plan.
        </Text>
      </Box>

      {/* Plan Recommendation Alert */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" fontWeight="bold">
            💡 Smart Recommendation
          </Text>
          <Text fontSize="sm">
            The <strong>{plans.find((p) => p.recommended)?.name}</strong> plan is perfect for your:
          </Text>
          <List fontSize="xs" spacing={0}>
            <ListItem>• {data.farmLocation?.acres} acre farm size</ListItem>
            <ListItem>• {data.cropType} crop type</ListItem>
            {data.equipment?.johnDeere && <ListItem>• John Deere equipment integration</ListItem>}
            {data.equipment?.caseIH && <ListItem>• Case IH equipment integration</ListItem>}
          </List>
        </VStack>
      </Alert>

      {/* Plan Cards */}
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={4}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            cursor="pointer"
            onClick={() => handlePlanSelect(plan)}
            bg={data.recommendedPlan === plan.id ? 'green.50' : 'white'}
            borderColor={data.recommendedPlan === plan.id ? 'green.500' : 'gray.200'}
            borderWidth={2}
            position="relative"
            _hover={{
              borderColor: 'green.400',
              transform: 'translateY(-2px)',
              shadow: 'lg'
            }}
            transition="all 0.2s"
          >
            {/* Badges */}
            {plan.recommended && (
              <Badge
                position="absolute"
                top="-8px"
                left="50%"
                transform="translateX(-50%)"
                colorScheme="blue"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
              >
                ⭐ RECOMMENDED
              </Badge>
            )}
            {plan.popular && (
              <Badge
                position="absolute"
                top="-8px"
                right="16px"
                colorScheme="orange"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                POPULAR
              </Badge>
            )}

            <CardHeader pb={2}>
              <VStack spacing={3}>
                <Icon as={plan.icon} boxSize={8} color="green.500" />
                <VStack spacing={1}>
                  <Text fontSize="xl" fontWeight="bold">
                    {plan.name}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {plan.price}
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    {plan.description}
                  </Text>
                </VStack>
              </VStack>
            </CardHeader>

            <CardBody pt={0}>
              <VStack spacing={4} align="stretch">
                {/* Key Limits */}
                <Box bg="gray.50" p={3} borderRadius="md">
                  <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={2}>
                    PLAN LIMITS:
                  </Text>
                  <VStack spacing={1} align="start" fontSize="xs">
                    <Text>📊 {plan.limits.parcels}</Text>
                    <Text>🌱 {plan.limits.productions}</Text>
                    <Text>🤖 {plan.limits.automation}</Text>
                  </VStack>
                </Box>

                {/* Features List */}
                <List spacing={1} fontSize="sm">
                  {plan.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListIcon as={FaCheck} color="green.500" />
                      {feature}
                    </ListItem>
                  ))}
                </List>

                {/* Selection Indicator */}
                {data.recommendedPlan === plan.id && (
                  <Box bg="green.500" color="white" p={2} borderRadius="md" textAlign="center">
                    <Text fontSize="sm" fontWeight="bold">
                      ✓ Selected Plan
                    </Text>
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Plan Comparison */}
      {selectedPlan && (
        <Card bg="blue.50" borderColor="blue.200" borderWidth={1}>
          <CardBody>
            <VStack spacing={3} align="start">
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold" color="blue.700">
                  📋 Your {selectedPlan.name} Plan Includes:
                </Text>
                <Badge colorScheme="blue">Selected</Badge>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold" color="blue.600">
                    Carbon Tracking:
                  </Text>
                  <Text fontSize="xs">• Automatic CO2e calculations</Text>
                  <Text fontSize="xs">• USDA-verified emission factors</Text>
                  <Text fontSize="xs">• Industry benchmarking</Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold" color="blue.600">
                    Consumer Features:
                  </Text>
                  <Text fontSize="xs">• QR code generation</Text>
                  <Text fontSize="xs">• Public transparency pages</Text>
                  <Text fontSize="xs">• Review and rating system</Text>
                </VStack>

                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="bold" color="blue.600">
                    Automation Level:
                  </Text>
                  <Text fontSize="xs">• {selectedPlan.limits.automation}</Text>
                  <Text fontSize="xs">• Equipment integrations</Text>
                  <Text fontSize="xs">• Smart event suggestions</Text>
                </VStack>
              </SimpleGrid>

              <Alert status="success" size="sm">
                <AlertIcon />
                <Text fontSize="xs">
                  Start with a 14-day free trial. Cancel anytime. Upgrade or downgrade as your farm
                  grows.
                </Text>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Enterprise Option */}
      <Card borderStyle="dashed" borderWidth={2} borderColor="purple.300" bg="purple.50">
        <CardBody textAlign="center" py={6}>
          <VStack spacing={3}>
            <Icon as={FaBuilding} boxSize={8} color="purple.500" />
            <VStack spacing={1}>
              <Text fontWeight="bold" color="purple.700">
                Need Something Bigger?
              </Text>
              <Text fontSize="sm" color="purple.600">
                Enterprise plans with unlimited everything, white-label options, and dedicated
                support starting at $999/month.
              </Text>
            </VStack>
            <Button colorScheme="purple" variant="outline" size="sm">
              Contact Sales
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
