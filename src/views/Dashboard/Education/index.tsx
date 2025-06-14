import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  useColorModeValue,
  useBreakpointValue,
  useToast,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import {
  FaGraduationCap,
  FaChevronLeft,
  FaLeaf,
  FaTools,
  FaQrcode,
  FaChevronRight,
  FaGlobe,
  FaCog,
  FaDollarSign,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';

// Import subscription hook to check access
import { useGetCompanyQuery } from 'store/api/companyApi';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

// Educational content types
interface ContentSection {
  title: string;
  content: string;
}

interface EducationalContentItem {
  title: string;
  icon: IconType;
  color: string;
  description: string;
  content: {
    overview: string;
    sections: ContentSection[];
  };
}

type EducationalContentMap = {
  [key: string]: EducationalContentItem;
};

// Educational content data based on EDUCATION_FRONTEND_IMPLEMENTATION.md
const educationalContent: EducationalContentMap = {
  'carbon-management': {
    title: 'Carbon Management & Sustainability',
    icon: FaLeaf,
    color: 'green',
    description: "Learn how to measure, reduce, and monetize your farm's carbon footprint",
    content: {
      overview: `Unlock sustainability for your citrus, almonds, soybeans, and corn with Trazo's 85% IoT-automated system. Using soil moisture and weather sensors, Trazo delivers precise carbon insights, cuts costs, and prepares mid-sized farms (50–500 acres) for carbon credit markets. Integrate these practices to reduce your carbon impact by up to 10% annually and boost profitability.`,

      sections: [
        {
          title: 'IoT-Powered Carbon Tracking for Your Crops',
          content: `Trazo's automated system uses soil moisture and weather sensors to track carbon emissions for California citrus and almonds, plus Midwest soybeans and corn. Key metrics include:

• Real-time CO2 emissions from irrigation systems
• Fuel consumption tracking for equipment operation
• Soil carbon sequestration rates by crop type
• Weather impact on carbon cycling

For mid-sized producers (50–500 acres), this 85% automation reduces manual data collection, delivering precise carbon footprint measurements in under 5 minutes per field check.`
        },
        {
          title: 'Crop-Specific Carbon Strategies',
          content: `**Citrus:** Optimize drip irrigation timing to reduce water-related emissions by 15%.

**Almonds:** Balance tree growth with carbon sequestration, increasing soil health by 10%.

**Soybeans:** Maximize nitrogen fixation to earn carbon credits, boosting yield efficiency.

**Corn:** Apply synthetic fertilizers precisely, cutting emissions by 12% per acre.

These strategies leverage Trazo's IoT data, tailored for your region and farm size.`
        }
      ]
    }
  },

  'iot-automation': {
    title: 'IoT Technology & Farm Automation',
    icon: FaTools,
    color: 'blue',
    description: 'Optimize operations with smart sensors and data-driven decision making',
    content: {
      overview: `Leverage Trazo's 85% IoT automation to streamline farming for citrus, almonds, soybeans, and corn. Smart sensors optimize operations, reducing manual effort by 50% and boosting efficiency by 10% for mid-sized farms (50–500 acres). Learn to set up sensors, interpret dashboards, and troubleshoot issues to maximize automation benefits.`,

      sections: [
        {
          title: 'Smart Sensors for Targeted Crop Management',
          content: `Trazo's IoT network delivers crop-specific insights for your operation:

**California Citrus Operations:**
• Soil moisture sensors optimize drip irrigation timing
• Weather stations predict frost protection needs
• Canopy sensors monitor tree health and growth

**Deep Almond Orchards:**
• Deep soil probes monitor root zone moisture
• Yield sensors predict bloom and harvest volume

**Midwest Soybean Fields:**
• Plant health sensors detect nitrogen deficiency
• Soil compaction monitors optimize field traffic

**Midwest Corn Production:**
• Growth stage sensors guide fertilizer application
• Soil temperature sensors optimize planting dates
• Moisture sensors predict irrigation needs`
        },
        {
          title: 'Achieving 85% Automation for Maximum Efficiency',
          content: `Trazo's automation targets eliminate time-consuming manual tasks:

• Event logging in under 5 minutes
• Automated data collection from field sensors
• GPS-enabled apps for quick manual entries
• Pre-configured templates for common activities

Irrigation alerts based on soil moisture
Pest pressure alerts from trap monitoring
Equipment maintenance reminders

Labor Optimization:
• Task scheduling maximizes crew efficiency by 30%
• Equipment tracking prevents downtime
• Automated reporting saves 10 hours weekly`
        },
        {
          title: 'Dashboard Interpretation and Decision Making',
          content: `Transform IoT data into actionable farm management decisions:

• Real-time field maps show moisture levels
• Trend graphs predict optimal timing
• Alert notifications prioritize urgent tasks

Performance metrics track efficiency gains:
• 10% average yield improvement through precision timing
• 20% reduction in labor productivity costs

Data-Driven Decision Examples:
• Moisture data triggers irrigation 2 days before stress
• Soil temperature guides planting decisions
• Growth sensors optimize harvest timing`
        }
      ]
    }
  },

  'traceability-qr': {
    title: 'Product Traceability & QR Technology',
    icon: FaQrcode,
    color: 'purple',
    description: 'Build consumer trust with transparent supply chain tracking',
    content: {
      overview: `Build consumer trust with Trazo's QR codes, enabling 10,000 scans/month for citrus, almonds, soybeans, and corn. Share carbon footprints and production details, boosting engagement by 20% for mid-sized farms (50–500 acres). Learn to generate QR codes and interpret scan analytics to refine practices.`,

      sections: [
        {
          title: 'QR-Enabled Transparency',
          content: `Trazo's QR system provides consumers with real-time farm data:

• Carbon footprint details per production
• Harvest dates and growing conditions
• Soil health and water usage metrics

For mid-sized producers (50–500 acres), this transparency increases market trust by 25%.`
        },
        {
          title: 'Scan Analytics for Improvement',
          content: `Analyze 10,000 monthly scans to optimize operations:

• Geographic distribution of consumer interest
• Peak scan times for marketing campaigns
• Consumer feedback on product quality

Use insights to adjust production strategies, boosting sales by 15%.`
        }
      ]
    }
  },

  'sustainable-practices': {
    title: 'Sustainable Farming Practices',
    icon: FaGlobe,
    color: 'green',
    description: 'Implement environmentally friendly practices that improve profitability',
    content: {
      overview: `Adopt sustainable practices tailored for citrus, almonds, soybeans, and corn with Trazo's IoT insights. Reduce water use by 15% and improve profits by 8% for mid-sized farms (50–500 acres) while meeting carbon goals. Explore techniques to balance yield and sustainability.`,

      sections: [
        {
          title: 'Water and Resource Efficiency',
          content: `Trazo's IoT reduces resource use while maintaining yields:

• Optimize water pump energy by 20% with sensor scheduling
• Lower fertilizer runoff through precision application
• Reduce diesel usage with efficient field routing`
        },
        {
          title: 'Soil Health Optimization',
          content: `Enhance soil sustainability with data-driven practices:

• Minimize soil carbon loss with reduced tillage
• Preserve soil structure with timed operations

Increase organic matter by 10% annually for better crop resilience.`
        }
      ]
    }
  },

  'iot-maintenance': {
    title: 'IoT Maintenance & Troubleshooting',
    icon: FaCog,
    color: 'orange',
    description: 'Keep your smart farm systems running at peak performance',
    content: {
      overview: `Keep Trazo's 85% IoT automation running smoothly for citrus, almonds, soybeans, and corn. Expert tips help mid-sized farms (50–500 acres) maintain sensors, reducing downtime by 30%. Learn a 5-step checklist for optimal performance.`,

      sections: [
        {
          title: 'Sensor Maintenance Basics',
          content: `Ensure sensor longevity with these steps:

• Clean sensors monthly to remove debris
• Check battery levels and replace every 6 months
• Secure mounting to withstand weather changes

Prevents 90% of common failures for mid-sized farms.`
        },
        {
          title: 'Troubleshooting Guide',
          content: `Resolve issues quickly with this 5-step process:

• Verify power and connectivity status
• Restart sensors after firmware updates
• Test data transmission with dashboard
• Replace faulty units within 24 hours
• Contact support for persistent issues

Reduces maintenance time by 30% per incident.`
        }
      ]
    }
  },

  'carbon-credit-monetization': {
    title: 'Carbon Credit Monetization',
    icon: FaDollarSign,
    color: 'green',
    description: "Maximize revenue from your farm's carbon credits",
    content: {
      overview: `Maximize revenue from Trazo's carbon tracking with Blockchain-verified credits for citrus, almonds, soybeans, and corn. Mid-sized farms (50–500 acres) can earn $800–$2,400 annually by meeting USDA standards and trading via Verra/Gold Standard.`,

      sections: [
        {
          title: 'Credit Earning Process',
          content: `Turn carbon data into profit with these steps:

• Measure emissions with 85% IoT accuracy
• Verify compliance with USDA standards
• Submit data to Verra/Gold Standard markets

Achieve certification in under 3 months for mid-sized farms.`
        },
        {
          title: 'Market Revenue Potential',
          content: `Expected returns based on farm size:

• 200-acre citrus orchard: $800–2,400 annually
• 300-acre almond orchard: $1,200–3,600 annually
• 400-acre soybean farm: $800–1,800 annually
• 500-acre corn operation: $750–2,250 annually

Initial setup costs ~$500, with ROI in 6–12 months.`
        }
      ]
    }
  },

  'regional-optimization': {
    title: 'Regional Crop Optimization',
    icon: FaMapMarkerAlt,
    color: 'brown',
    description: 'Tailored strategies for California and Midwest crops',
    content: {
      overview: `Optimize citrus and almonds in California, or soybeans and corn in the Midwest, with Trazo's IoT data. Mid-sized farms (50–500 acres) can increase yields by 12% using region-specific irrigation and pest control tips tailored to local climates.`,

      sections: [
        {
          title: 'California Crop Strategies',
          content: `Enhance citrus and almond production:

• Adjust irrigation for drought resilience
• Target pest control with weather forecasts
• Increase yield by 12% with optimized pruning

Tailored for California's arid conditions.`
        },
        {
          title: 'Midwest Crop Strategies',
          content: `Boost soybeans and corn output:

• Optimize planting with soil temperature data
• Reduce weed pressure with sensor alerts
• Achieve 12% yield growth with timely harvests

Designed for Midwest rainfall patterns.`
        }
      ]
    }
  }
};

const EducationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Get current company
  const activeCompany = useSelector((state: RootState) => state.company.currentCompany);

  // State for content navigation
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  // Responsive values
  const containerMaxW = useBreakpointValue({ base: 'full', lg: '7xl' });

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');

  // Skip company query if no active company
  const { data: companyData } = useGetCompanyQuery(activeCompany?.id?.toString() || '', {
    skip: !activeCompany?.id
  });

  // Check subscription access
  const subscriptionPlan = companyData?.subscription?.plan?.name?.toLowerCase();
  const hasEducationAccess = subscriptionPlan === 'standard' || subscriptionPlan === 'corporate';

  // Handle subscription requirement
  const handleSubscriptionRequired = () => {
    toast({
      title: 'Subscription Required',
      description:
        'Agricultural Knowledge Base is available for Standard and Corporate plan subscribers. Please upgrade your plan to access this content.',
      status: 'warning',
      duration: 5000,
      isClosable: true
    });
    navigate('/subscription');
  };

  // Available categories based on EDUCATION_FRONTEND_IMPLEMENTATION.md
  const categories = [
    {
      id: 'carbon-management',
      name: 'Carbon Management & Sustainability',
      description: "Learn how to measure, reduce, and monetize your farm's carbon footprint",
      icon: FaLeaf,
      color: 'green'
    },
    {
      id: 'iot-automation',
      name: 'IoT Technology & Farm Automation',
      description: 'Optimize operations with smart sensors and data-driven decision making',
      icon: FaTools,
      color: 'blue'
    },
    {
      id: 'traceability-qr',
      name: 'Product Traceability & QR Technology',
      description: 'Build consumer trust with transparent supply chain tracking',
      icon: FaQrcode,
      color: 'purple'
    },
    {
      id: 'sustainable-practices',
      name: 'Sustainable Farming Practices',
      description: 'Implement environmentally friendly practices that improve profitability',
      icon: FaGlobe,
      color: 'green'
    },
    {
      id: 'iot-maintenance',
      name: 'IoT Maintenance & Troubleshooting',
      description: 'Keep your smart farm systems running at peak performance',
      icon: FaCog,
      color: 'orange'
    },
    {
      id: 'carbon-credit-monetization',
      name: 'Carbon Credit Monetization',
      description: "Maximize revenue from your farm's carbon credits",
      icon: FaDollarSign,
      color: 'green'
    },
    {
      id: 'regional-optimization',
      name: 'Regional Crop Optimization',
      description: 'Tailored strategies for California and Midwest crops',
      icon: FaMapMarkerAlt,
      color: 'brown'
    }
  ];

  // Show subscription barrier for Basic plan users
  if (!hasEducationAccess) {
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW={containerMaxW} py={{ base: 4, md: 8 }}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box textAlign="center" py={8}>
              <Box
                bg="linear-gradient(135deg, #4299E1, #3182CE)"
                borderRadius="full"
                w="16"
                h="16"
                mx="auto"
                mb={4}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="md"
              >
                <Icon as={FaGraduationCap} boxSize={8} color="white" />
              </Box>
              <Heading size="xl" mb={4} color={textColor} fontWeight="bold">
                Agricultural Knowledge Base
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="2xl" mx="auto" lineHeight="1.6">
                Expert insights and practical guidance for mid-sized agricultural operations
              </Text>
            </Box>

            {/* Subscription Required Alert */}
            <Box>
              <Alert
                status="info"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                maxW="2xl"
                borderRadius="xl"
                p={8}
                border="1px solid"
                borderColor="blue.200"
                mx="auto"
                my={0}
                bg={useColorModeValue('blue.50', 'blue.900')}
              >
                <AlertIcon boxSize="40px" mr={0} color="blue.500" />
                <AlertTitle mt={4} mb={2} fontSize="lg" color={textColor}>
                  Knowledge Base Available with Standard & Corporate Plans
                </AlertTitle>
                <AlertDescription maxWidth="lg" mb={6} color={mutedTextColor}>
                  Access comprehensive agricultural insights, best practices, and implementation
                  guides tailored for mid-sized farming operations (50-500 acres) in California and
                  the Midwest. Learn how Trazo's technology can transform your agricultural
                  business.
                </AlertDescription>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleSubscriptionRequired}
                  leftIcon={<Icon as={FaGraduationCap} />}
                >
                  Upgrade to Access Knowledge Base
                </Button>
              </Alert>
            </Box>

            {/* Preview of what's available */}
            <Box>
              <Box maxW="4xl" mx="auto">
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {categories.slice(0, 3).map((category, index) => (
                    <Card
                      key={index}
                      bg={cardBgColor}
                      borderRadius="xl"
                      boxShadow="sm"
                      border="1px solid"
                      borderColor={useColorModeValue('gray.100', 'gray.600')}
                      opacity={0.7}
                      transition="all 0.2s ease"
                      _hover={{
                        opacity: 1,
                        transform: 'translateY(-2px)',
                        boxShadow: 'md'
                      }}
                    >
                      <CardBody p={6} textAlign="center">
                        <Box
                          bg={`${category.color}.50`}
                          borderRadius="full"
                          w="16"
                          h="16"
                          mx="auto"
                          mb={4}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={category.icon} boxSize={6} color={`${category.color}.500`} />
                        </Box>
                        <Heading size="md" mb={2} color={textColor} fontWeight="bold">
                          {category.name}
                        </Heading>
                        <Text fontSize="sm" color={mutedTextColor} lineHeight="1.5">
                          {category.description}
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Show detailed content if a category is selected
  if (selectedContent && educationalContent[selectedContent]) {
    const content = educationalContent[selectedContent] as EducationalContentItem;
    return (
      <Box bg={bgColor} minH="100vh">
        <Container maxW="5xl" py={{ base: 4, md: 8 }}>
          <VStack spacing={8} align="stretch">
            {/* Back Navigation */}
            <Button
              variant="outline"
              leftIcon={<Icon as={FaChevronLeft} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedContent(null);
              }}
              size="sm"
              alignSelf="flex-start"
            >
              Back
            </Button>

            {/* Article Header */}
            <Box textAlign="center" py={6}>
              <Box
                bg={`${content.color}.50`}
                borderRadius="full"
                w="20"
                h="20"
                mx="auto"
                mb={6}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={content.icon} boxSize={10} color={`${content.color}.500`} />
              </Box>
              <Heading size="xl" mb={4} color={textColor}>
                {content.title}
              </Heading>
              <Text fontSize="lg" color={mutedTextColor} maxW="3xl" mx="auto" lineHeight="1.8">
                {content.content.overview}
              </Text>
            </Box>

            <Divider />

            {/* Article Content */}
            <VStack spacing={12} align="stretch">
              {content.content.sections.map((section: ContentSection, index: number) => (
                <Box key={index}>
                  <Heading size="lg" mb={6} color={textColor}>
                    {section.title}
                  </Heading>
                  <Box
                    bg={cardBgColor}
                    p={8}
                    borderRadius="xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor={useColorModeValue('gray.100', 'gray.600')}
                  >
                    <Text fontSize="md" color={textColor} lineHeight="1.8" whiteSpace="pre-line">
                      {section.content}
                    </Text>
                  </Box>
                </Box>
              ))}
            </VStack>

            {/* Call to Action */}
            <Box textAlign="center" py={8}>
              <Card bg={`${content.color}.50`} borderRadius="xl">
                <CardBody p={8}>
                  <Heading size="md" mb={4} color={textColor}>
                    Ready to implement these strategies on your farm?
                  </Heading>
                  <Text mb={6} color={mutedTextColor}>
                    Trazo's integrated platform makes it easy to track, optimize, and benefit from
                    these practices.
                  </Text>
                  <Button
                    colorScheme={content.color}
                    size="lg"
                    onClick={() => navigate('/subscription')}
                  >
                    Get Started with Trazo
                  </Button>
                </CardBody>
              </Card>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  // Main knowledge base view with 7 cards in responsive grid
  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW={containerMaxW} py={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" py={8}>
            <Icon as={FaGraduationCap} boxSize={12} color="blue.500" mb={4} />
            <Heading size="lg" mb={2} color={textColor}>
              Agricultural Knowledge Base
            </Heading>
            <Text fontSize="md" color={mutedTextColor} maxW="xl" mx="auto">
              Expert insights for mid-sized producers in California and the Midwest
            </Text>
          </Box>

          {/* Categories Grid - 7 cards in responsive layout */}
          <Box>
            <Heading size="md" mb={6} color={textColor} textAlign="center">
              Explore Key Topics for Agricultural Success
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {categories.map((category) => (
                <Card
                  key={category.id}
                  bg={cardBgColor}
                  borderRadius="xl"
                  boxShadow="md"
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'xl'
                  }}
                  onClick={() => setSelectedContent(category.id)}
                >
                  <CardBody p={8} textAlign="center">
                    <Box
                      bg={`${category.color}.50`}
                      borderRadius="full"
                      w="20"
                      h="20"
                      mx="auto"
                      mb={6}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={category.icon} boxSize={8} color={`${category.color}.500`} />
                    </Box>
                    <Heading size="md" mb={4} color={textColor} lineHeight="1.3">
                      {category.name}
                    </Heading>
                    <Text fontSize="sm" color={mutedTextColor} lineHeight="1.6" mb={6}>
                      {category.description}
                    </Text>
                    <HStack justify="center">
                      <Text fontSize="sm" color={`${category.color}.600`} fontWeight="medium">
                        Read More
                      </Text>
                      <Icon as={FaChevronRight} color={`${category.color}.600`} boxSize={3} />
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Bottom CTA */}
          <Box textAlign="center" py={8}>
            <Card bg="blue.50" borderRadius="xl">
              <CardBody p={8}>
                <Heading size="md" mb={4} color={textColor}>
                  Transform Your Agricultural Operation with Trazo
                </Heading>
                <Text mb={6} color={mutedTextColor} maxW="2xl" mx="auto">
                  Our integrated platform combines 85% IoT automation, blockchain traceability,
                  carbon tracking, and business analytics to help mid-sized agricultural operations
                  (50-500 acres) increase profitability while building sustainable practices.
                </Text>
                <HStack justify="center" spacing={4}>
                  <Button colorScheme="blue" size="lg" onClick={() => navigate('/subscription')}>
                    Upgrade Your Plan
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="lg"
                    onClick={() => window.open('/documentation', '_blank')}
                  >
                    View Documentation
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default EducationDashboard;
