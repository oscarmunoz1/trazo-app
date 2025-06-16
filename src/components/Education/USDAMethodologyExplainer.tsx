import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Progress,
  Icon,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiMapPin,
  FiActivity,
  FiTarget,
  FiTrendingDown,
  FiNavigation,
  FiArrowRight,
  FiPlay
} from 'react-icons/fi';
import { useGetUSDAMethodologyContentQuery } from '../../store/api/carbonApi';

interface MethodologySection {
  title: string;
  content: string;
  icon: string;
  key_point?: string;
  technical_detail?: string;
  references?: string[];
  statistical_detail?: string;
}

interface MethodologyContent {
  title: string;
  sections: MethodologySection[];
  trust_indicators?: string[];
  interactive_features: {
    calculator_demo: boolean;
    regional_comparison: boolean;
    confidence_indicators: boolean;
    technical_details: boolean;
  };
}

interface USDAMethodologyExplainerProps {
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  establishmentData?: any;
  isOpen?: boolean;
  onClose?: () => void;
  compact?: boolean;
}

const stepIcons = {
  'data-collection': FiMapPin,
  'regional-analysis': FiNavigation,
  calculation: FiActivity,
  verification: FiShield,
  benchmarking: FiTarget,
  reporting: FiCheckCircle
};

const USDAMethodologyExplainer: React.FC<USDAMethodologyExplainerProps> = ({
  userLevel = 'beginner',
  establishmentData,
  isOpen = false,
  onClose,
  compact = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const { isOpen: isDemoOpen, onOpen: onDemoOpen, onClose: onDemoClose } = useDisclosure();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const accentColor = useColorModeValue('green.500', 'green.400');

  const {
    data: content,
    isLoading: loading,
    error,
    refetch: fetchMethodologyContent
  } = useGetUSDAMethodologyContentQuery({
    level: userLevel,
    context: establishmentData,
    source: 'usda-methodology-explainer'
  });

  const getIconComponent = (iconName: string) => {
    return stepIcons[iconName as keyof typeof stepIcons] || FiInfo;
  };

  const StepIndicator = () => {
    if (!content || compact) return null;

    return (
      <HStack spacing={2} mb={6}>
        {content.sections.map((_, index) => (
          <Box key={index} position="relative">
            <Box
              w={8}
              h={8}
              borderRadius="full"
              bg={index <= currentStep ? accentColor : 'gray.200'}
              color={index <= currentStep ? 'white' : 'gray.500'}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="sm"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => setCurrentStep(index)}
              transition="all 0.2s"
            >
              {index + 1}
            </Box>
            {index < content.sections.length - 1 && (
              <Box
                position="absolute"
                top="50%"
                left="100%"
                w={4}
                h={0.5}
                bg={index < currentStep ? accentColor : 'gray.200'}
                transform="translateY(-50%)"
                transition="all 0.2s"
              />
            )}
          </Box>
        ))}
      </HStack>
    );
  };

  const SectionCard = ({ section, index }: { section: MethodologySection; index: number }) => {
    const IconComponent = getIconComponent(section.icon);

    return (
      <Card variant="outline" borderColor={borderColor}>
        <CardBody>
          <VStack align="start" spacing={4}>
            <HStack>
              <Box p={2} borderRadius="md" bg={`${accentColor}20`} color={accentColor}>
                <Icon as={IconComponent} boxSize={5} />
              </Box>
              <Heading size="md" color={textColor}>
                {section.title}
              </Heading>
            </HStack>

            <Text color={textColor} lineHeight="tall">
              {section.content}
            </Text>

            {section.key_point && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm" fontWeight="medium">
                  {section.key_point}
                </Text>
              </Alert>
            )}

            {section.technical_detail && userLevel !== 'beginner' && (
              <Box p={3} bg="gray.50" borderRadius="md" w="full">
                <Text fontSize="sm" color="gray.600" fontStyle="italic">
                  <strong>Technical Detail:</strong> {section.technical_detail}
                </Text>
              </Box>
            )}

            {section.statistical_detail && userLevel === 'advanced' && (
              <Box p={3} bg="blue.50" borderRadius="md" w="full">
                <Text fontSize="sm" color="blue.700">
                  <strong>Statistical Method:</strong> {section.statistical_detail}
                </Text>
              </Box>
            )}

            {section.references && userLevel === 'advanced' && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={1}>
                  References:
                </Text>
                <VStack align="start" spacing={1}>
                  {section.references.map((ref, idx) => (
                    <Text key={idx} fontSize="xs" color="gray.600">
                      • {ref}
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  };

  const TrustIndicators = () => {
    if (!content?.trust_indicators || userLevel !== 'beginner') return null;

    return (
      <Box p={4} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
        <Heading size="sm" color="green.700" mb={3}>
          Why You Can Trust This Data
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
          {content.trust_indicators.map((indicator, index) => (
            <HStack key={index}>
              <Icon as={FiCheckCircle} color="green.500" />
              <Text fontSize="sm" color="green.700">
                {indicator}
              </Text>
            </HStack>
          ))}
        </SimpleGrid>
      </Box>
    );
  };

  const InteractiveDemo = () => {
    if (!content?.interactive_features.calculator_demo) return null;

    return (
      <Box p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
        <HStack justify="space-between" mb={3}>
          <VStack align="start" spacing={1}>
            <Heading size="sm" color="blue.700">
              Try It Yourself
            </Heading>
            <Text fontSize="sm" color="blue.600">
              See how USDA factors work with real farm data
            </Text>
          </VStack>
          <Button size="sm" colorScheme="blue" leftIcon={<Icon as={FiPlay} />} onClick={onDemoOpen}>
            Start Demo
          </Button>
        </HStack>
      </Box>
    );
  };

  const NavigationButtons = () => {
    if (!content || compact) return null;

    return (
      <HStack justify="space-between" mt={6}>
        <Button
          variant="outline"
          isDisabled={currentStep === 0}
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
        >
          Previous
        </Button>

        <Text fontSize="sm" color="gray.500">
          {currentStep + 1} of {content.sections.length}
        </Text>

        <Button
          colorScheme="green"
          isDisabled={currentStep === content.sections.length - 1}
          onClick={() => setCurrentStep(Math.min(content.sections.length - 1, currentStep + 1))}
          rightIcon={<Icon as={FiArrowRight} />}
        >
          Next
        </Button>
      </HStack>
    );
  };

  if (loading) {
    return (
      <VStack spacing={4} p={6}>
        <Skeleton height="40px" width="300px" />
        <Skeleton height="20px" width="100%" />
        <Skeleton height="100px" width="100%" />
        <Skeleton height="20px" width="80%" />
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="medium">Unable to Load Educational Content</Text>
          <Button size="sm" onClick={() => fetchMethodologyContent()}>
            Try Again
          </Button>
        </VStack>
      </Alert>
    );
  }

  if (!content) return null;

  const ContentBody = () => (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Heading size="lg" color={textColor} mb={2}>
          {content.title}
        </Heading>
        <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
          {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Level
        </Badge>
      </Box>

      <StepIndicator />

      {compact ? (
        <Accordion allowToggle>
          {content.sections.map((section, index) => (
            <AccordionItem key={index}>
              <AccordionButton>
                <HStack flex="1" textAlign="left">
                  <Icon as={getIconComponent(section.icon)} color={accentColor} />
                  <Text fontWeight="medium">{section.title}</Text>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <SectionCard section={section} index={index} />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <SectionCard section={content.sections[currentStep]} index={currentStep} />
      )}

      <TrustIndicators />
      <InteractiveDemo />
      <NavigationButtons />
    </VStack>
  );

  if (isOpen && onClose) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>USDA Methodology Explained</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ContentBody />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      p={6}
      maxW={compact ? '100%' : '800px'}
      mx="auto"
    >
      <ContentBody />
    </Box>
  );
};

export default USDAMethodologyExplainer;
