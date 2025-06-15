import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Icon,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListIcon,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import {
  FaSeedling,
  FaLeaf,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaCheckCircle,
  FaInfoCircle,
  FaRocket,
  FaAward,
  FaCalendarAlt,
  FaTools
} from 'react-icons/fa';
import { useGetCropTemplatesQuery, useGetCropTemplateDetailQuery } from 'store/api/carbonApi';

interface SmartSetupWizardProps {
  onTemplateSelect: (template: any) => void;
  onSkip: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const SmartSetupWizard: React.FC<SmartSetupWizardProps> = ({
  onTemplateSelect,
  onSkip,
  isOpen,
  onClose
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();

  const {
    data: templatesData,
    isLoading: isLoadingTemplates,
    error: templatesError
  } = useGetCropTemplatesQuery();

  const { data: templateDetail, isLoading: isLoadingDetail } = useGetCropTemplateDetailQuery(
    selectedTemplateId!,
    {
      skip: !selectedTemplateId
    }
  );

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onDetailOpen();
  };

  const handleConfirmTemplate = () => {
    if (templateDetail) {
      onTemplateSelect(templateDetail);
      onDetailClose();
      onClose();
    }
  };

  const getCropIcon = (cropType: string) => {
    const iconMap: Record<string, any> = {
      citrus: FaLeaf,
      almonds: FaSeedling,
      soybeans: FaSeedling,
      corn: FaSeedling,
      wheat: FaSeedling,
      cotton: FaLeaf
    };
    return iconMap[cropType.toLowerCase()] || FaSeedling;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoadingTemplates) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody py={8}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading smart templates...</Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (templatesError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Setup Templates</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error">
              <AlertIcon />
              Failed to load crop templates. Please try again or continue with manual setup.
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSkip}>
              Continue Manually
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      {/* Main Template Selection Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={FaRocket} color="blue.500" />
                <Heading size="lg">Smart Setup Wizard</Heading>
              </HStack>
              <Text fontSize="sm" color="gray.600" fontWeight="normal">
                Choose a pre-configured template to reduce setup time from 45+ minutes to under 15
                minutes
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Benefits Banner */}
            <Card mb={6} bg="blue.50" borderColor="blue.200">
              <CardBody>
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                  <GridItem>
                    <Stat>
                      <StatLabel fontSize="xs">Time Saved</StatLabel>
                      <StatNumber fontSize="lg" color="blue.600">
                        37 min
                      </StatNumber>
                      <StatHelpText fontSize="xs">
                        <StatArrow type="decrease" />
                        vs manual setup
                      </StatHelpText>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel fontSize="xs">Templates Available</StatLabel>
                      <StatNumber fontSize="lg" color="green.600">
                        {templatesData?.total_count || 0}
                      </StatNumber>
                      <StatHelpText fontSize="xs">USDA verified</StatHelpText>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel fontSize="xs">Avg Carbon Credits</StatLabel>
                      <StatNumber fontSize="lg" color="purple.600">
                        {templatesData?.templates?.[0]?.carbon_potential || 0}
                      </StatNumber>
                      <StatHelpText fontSize="xs">kg CO2e/ha/year</StatHelpText>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel fontSize="xs">Revenue Potential</StatLabel>
                      <StatNumber fontSize="lg" color="orange.600">
                        {formatCurrency(templatesData?.templates?.[0]?.avg_revenue || 0)}
                      </StatNumber>
                      <StatHelpText fontSize="xs">per hectare</StatHelpText>
                    </Stat>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>

            {/* Template Grid */}
            <Grid templateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
              {templatesData?.templates.map((template) => {
                const CropIcon = getCropIcon(template.crop_type);
                return (
                  <Card
                    key={template.id}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      transform: 'translateY(-2px)',
                      shadow: 'lg',
                      borderColor: 'blue.300'
                    }}
                    onClick={() => handleTemplateSelect(template.id)}
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <CardHeader pb={2}>
                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={CropIcon} color="green.500" boxSize={5} />
                          <VStack align="start" spacing={0}>
                            <Heading size="md">{template.name}</Heading>
                            <Text fontSize="sm" color="gray.600">
                              {template.crop_type.charAt(0).toUpperCase() +
                                template.crop_type.slice(1)}
                            </Text>
                          </VStack>
                        </HStack>
                        <Badge colorScheme="blue" variant="subtle">
                          {template.events_count} events
                        </Badge>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Text fontSize="sm" color="gray.700" mb={4} noOfLines={2}>
                        {template.description}
                      </Text>

                      {/* Key Metrics */}
                      <Grid templateColumns="repeat(2, 1fr)" gap={3} mb={4}>
                        <VStack align="start" spacing={1}>
                          <HStack>
                            <Icon as={FaClock} color="blue.500" boxSize={3} />
                            <Text fontSize="xs" fontWeight="medium">
                              Setup Time
                            </Text>
                          </HStack>
                          <Text fontSize="sm" fontWeight="bold">
                            {template.setup_time_minutes} minutes
                          </Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <HStack>
                            <Icon as={FaChartLine} color="green.500" boxSize={3} />
                            <Text fontSize="xs" fontWeight="medium">
                              Carbon Credits
                            </Text>
                          </HStack>
                          <Text fontSize="sm" fontWeight="bold">
                            {template.carbon_potential} kg CO2e
                          </Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <HStack>
                            <Icon as={FaDollarSign} color="orange.500" boxSize={3} />
                            <Text fontSize="xs" fontWeight="medium">
                              Revenue/ha
                            </Text>
                          </HStack>
                          <Text fontSize="sm" fontWeight="bold">
                            {formatCurrency(template.avg_revenue)}
                          </Text>
                        </VStack>
                        <VStack align="start" spacing={1}>
                          <HStack>
                            <Icon as={FaAward} color="purple.500" boxSize={3} />
                            <Text fontSize="xs" fontWeight="medium">
                              ROI Boost
                            </Text>
                          </HStack>
                          <Text fontSize="sm" fontWeight="bold">
                            {template.roi_projection.premium_pricing}
                          </Text>
                        </VStack>
                      </Grid>

                      {/* Events Preview */}
                      <Box>
                        <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={2}>
                          Key Events Preview:
                        </Text>
                        <VStack align="start" spacing={1}>
                          {template.events_preview.slice(0, 2).map((event, index) => (
                            <HStack key={index} fontSize="xs">
                              <Icon as={FaCalendarAlt} color="gray.400" boxSize={3} />
                              <Text color="gray.600">
                                {event.name} ({event.timing})
                              </Text>
                            </HStack>
                          ))}
                          {template.events_preview.length > 2 && (
                            <Text fontSize="xs" color="blue.500" fontWeight="medium">
                              +{template.events_preview.length - 2} more events
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    </CardBody>
                  </Card>
                );
              })}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSkip}>
              Skip & Setup Manually
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Template Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="hidden">
          <ModalHeader>
            <HStack>
              <Icon as={getCropIcon(templateDetail?.crop_type || '')} color="green.500" />
              <VStack align="start" spacing={0}>
                <Heading size="lg">{templateDetail?.name}</Heading>
                <Text fontSize="sm" color="gray.600" fontWeight="normal">
                  Complete template overview and ROI analysis
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY="auto" maxH="calc(90vh - 200px)">
            {isLoadingDetail ? (
              <VStack py={8}>
                <Spinner size="lg" />
                <Text>Loading template details...</Text>
              </VStack>
            ) : templateDetail ? (
              <VStack spacing={6} align="stretch">
                {/* ROI Summary */}
                <Card bg="green.50" borderColor="green.200">
                  <CardHeader pb={2}>
                    <Heading size="md" color="green.700">
                      <Icon as={FaChartLine} mr={2} />
                      ROI Analysis
                    </Heading>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                      <Stat>
                        <StatLabel fontSize="xs">Setup Time Saved</StatLabel>
                        <StatNumber fontSize="lg" color="green.600">
                          {templateDetail.roi_analysis.setup_time_saved}
                        </StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel fontSize="xs">Annual Carbon Credits</StatLabel>
                        <StatNumber fontSize="lg" color="green.600">
                          {templateDetail.roi_analysis.carbon_credits_annual}
                        </StatNumber>
                        <StatHelpText fontSize="xs">kg CO2e</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel fontSize="xs">Premium Pricing</StatLabel>
                        <StatNumber fontSize="lg" color="green.600">
                          {templateDetail.roi_analysis.premium_pricing}
                        </StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel fontSize="xs">Efficiency Savings</StatLabel>
                        <StatNumber fontSize="lg" color="green.600">
                          {templateDetail.roi_analysis.efficiency_savings}
                        </StatNumber>
                      </Stat>
                    </Grid>
                  </CardBody>
                </Card>

                {/* Events Timeline */}
                <Card>
                  <CardHeader>
                    <Heading size="md">
                      <Icon as={FaCalendarAlt} mr={2} />
                      Production Events ({templateDetail.events.length})
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {templateDetail.events.map((event, index) => (
                        <Box key={index} p={4} bg="gray.50" borderRadius="md">
                          <HStack justify="space-between" mb={2}>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold">{event.name}</Text>
                              <Text fontSize="sm" color="gray.600">
                                {event.timing} • {event.frequency}
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={0}>
                              <Text fontSize="sm" fontWeight="bold" color="green.600">
                                {event.carbon_impact > 0 ? '+' : ''}
                                {event.carbon_impact} kg CO2e
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                ~{formatCurrency(event.cost_estimate)}
                              </Text>
                            </VStack>
                          </HStack>
                          {event.efficiency_tips && (
                            <Box mt={2}>
                              <Text fontSize="xs" fontWeight="medium" color="blue.600" mb={1}>
                                💡 Efficiency Tips:
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                <Icon as={FaCheckCircle} color="green.400" mr={1} />
                                {event.efficiency_tips}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  </CardBody>
                </Card>

                {/* Sustainability Opportunities */}
                {templateDetail.sustainability_opportunities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <Heading size="md">
                        <Icon as={FaLeaf} mr={2} />
                        Sustainability Opportunities
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <List spacing={2}>
                        {templateDetail.sustainability_opportunities.map((opportunity, index) => (
                          <ListItem key={index} fontSize="sm">
                            <ListIcon as={FaCheckCircle} color="green.500" />
                            {opportunity}
                          </ListItem>
                        ))}
                      </List>
                    </CardBody>
                  </Card>
                )}

                {/* USDA Benchmark */}
                {templateDetail.benchmark && (
                  <Card>
                    <CardHeader>
                      <Heading size="md">
                        <Icon as={FaAward} mr={2} />
                        USDA Benchmark Data
                      </Heading>
                    </CardHeader>
                    <CardBody>
                      <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                        <Stat>
                          <StatLabel>Industry Average</StatLabel>
                          <StatNumber>{templateDetail.benchmark.average_emissions}</StatNumber>
                          <StatHelpText>kg CO2e/ha</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Top 25%</StatLabel>
                          <StatNumber color="green.500">
                            {templateDetail.benchmark.percentile_25}
                          </StatNumber>
                          <StatHelpText>kg CO2e/ha</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Your Target</StatLabel>
                          <StatNumber color="blue.500">
                            {templateDetail.benchmark.percentile_75}
                          </StatNumber>
                          <StatHelpText>kg CO2e/ha</StatHelpText>
                        </Stat>
                      </Grid>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDetailClose}>
              Back to Templates
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleConfirmTemplate}
              leftIcon={<FaRocket />}
              isDisabled={!templateDetail}
            >
              Use This Template
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SmartSetupWizard;
