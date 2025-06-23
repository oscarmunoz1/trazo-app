import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  VStack,
  HStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Icon,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Divider,
  List,
  ListItem,
  ListIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  FaRocket,
  FaSeedling,
  FaLeaf,
  FaClock,
  FaChartLine,
  FaCheckCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEdit,
  FaPlus,
  FaMinus,
  FaArrowRight
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, number, boolean, date } from 'zod';
import { useGetCropTemplatesQuery, useGetCropTemplateDetailQuery } from 'store/api/carbonApi';
import { useStartProductionMutation, useGetCropTypesDropdownQuery } from 'store/api/companyApi';
import { StandardPage, StandardCard, StandardButton } from 'components/Design';

// Form validation schema
const productionSchema = object({
  name: string().min(1, 'Production name is required'),
  start_date: string().min(1, 'Start date is required'),
  expected_harvest: string().optional(),
  description: string().optional(),
  production_method: string().optional(),
  irrigation_method: string().optional(),
  estimated_yield: number().optional(),
  type: string().min(1, 'Production type is required'),
  crop_type_id: string().min(1, 'Crop type is required')
});

interface ProductionFormData {
  name: string;
  start_date: string;
  expected_harvest?: string;
  description?: string;
  production_method?: string;
  irrigation_method?: string;
  estimated_yield?: number;
  type: string;
  crop_type_id: string;
}

interface QuickStartProductionProps {
  parcelId?: string;
  parcelName?: string;
  cropType?: string;
}

const QuickStartProduction: React.FC<QuickStartProductionProps> = ({
  parcelId: propParcelId,
  parcelName,
  cropType: propCropType
}) => {
  const { parcelId: paramParcelId, establishmentId } = useParams();
  const parcelId = propParcelId || paramParcelId;

  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: isTemplateOpen,
    onOpen: onTemplateOpen,
    onClose: onTemplateClose
  } = useDisclosure();

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [customEvents, setCustomEvents] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCropTypeId, setSelectedCropTypeId] = useState<string | null>(null);

  // API hooks - Dynamic template fetching based on crop type
  const { data: templatesData, isLoading: isLoadingTemplates } = useGetCropTemplatesQuery(
    selectedCropTypeId ? { crop_type: selectedCropTypeId } : undefined
  );
  const { data: templateDetail, isLoading: isLoadingDetail } = useGetCropTemplateDetailQuery(
    selectedTemplateId!,
    { skip: !selectedTemplateId }
  );
  const [startProduction] = useStartProductionMutation();
  const {
    data: cropTypesData,
    error: cropTypesError,
    isLoading: isLoadingCropTypes
  } = useGetCropTypesDropdownQuery();

  // Debug logging for crop types
  React.useEffect(() => {
    console.log('🌾 Crop Types Debug:', {
      data: cropTypesData,
      error: cropTypesError,
      isLoading: isLoadingCropTypes
    });
  }, [cropTypesData, cropTypesError, isLoadingCropTypes]);

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      name: `Production ${new Date().getFullYear()}`,
      start_date: new Date().toISOString().split('T')[0],
      type: 'OR',
      production_method: 'conventional',
      irrigation_method: 'drip',
      crop_type_id: ''
    }
  });

  // Auto-select template based on crop type
  useEffect(() => {
    if (propCropType && templatesData?.templates && cropTypesData) {
      // First find the crop type by slug to get its category
      const matchingCropType = cropTypesData.find(
        (cropType) => cropType.slug.toLowerCase() === propCropType.toLowerCase()
      );

      if (matchingCropType) {
        // Then find template by category
        const matchingTemplate = templatesData.templates.find(
          (template) => template.crop_type.toLowerCase() === matchingCropType.category.toLowerCase()
        );
        if (matchingTemplate && matchingTemplate.template_id) {
          setSelectedTemplateId(matchingTemplate.template_id.toString());
          setSelectedTemplate(matchingTemplate);
        }
      }
    }
  }, [propCropType, templatesData, cropTypesData]);

  // Auto-select crop type when propCropType is provided
  useEffect(() => {
    if (propCropType && cropTypesData) {
      const matchingCropType = cropTypesData.find(
        (cropType) => cropType.slug.toLowerCase() === propCropType.toLowerCase()
      );
      if (matchingCropType) {
        setSelectedCropTypeId(matchingCropType.id.toString());
        setValue('crop_type_id', matchingCropType.id.toString());
      }
    }
  }, [propCropType, cropTypesData, setValue]);

  // Templates are now filtered by the API based on crop type
  const filteredTemplates = templatesData?.templates || [];

  // Auto-select template when crop type changes
  useEffect(() => {
    if (selectedCropTypeId && filteredTemplates.length > 0) {
      const firstTemplate = filteredTemplates[0];
      if (firstTemplate.template_id) {
        setSelectedTemplateId(firstTemplate.template_id.toString());
        setSelectedTemplate(firstTemplate);
      }
    } else if (!selectedCropTypeId) {
      setSelectedTemplate(null);
      setSelectedTemplateId(null);
      setCustomEvents([]); // Clear events when no crop type is selected
    }
  }, [selectedCropTypeId, filteredTemplates]);

  // Clear and reload templates when crop type selection changes from dropdown
  const watchedCropTypeId = watch('crop_type_id');
  useEffect(() => {
    if (watchedCropTypeId && watchedCropTypeId !== selectedCropTypeId) {
      setSelectedCropTypeId(watchedCropTypeId);
      // Clear current template selection to force reload
      setSelectedTemplate(null);
      setSelectedTemplateId(null);
      setCustomEvents([]);
      // RTK Query will automatically refetch when selectedCropTypeId changes
    }
  }, [watchedCropTypeId, selectedCropTypeId]);

  // Auto-fill form when template is selected
  useEffect(() => {
    if (templateDetail) {
      const currentYear = new Date().getFullYear();
      setValue('name', generateProductionName(templateDetail.name, currentYear));
      setValue(
        'description',
        `${templateDetail.description} This production includes ${
          templateDetail.events?.length || 4
        } pre-configured events for optimal carbon tracking.`
      );

      // Set custom events from template
      if (templateDetail.events) {
        setCustomEvents(
          templateDetail.events.map((event, index) => ({
            ...event,
            id: `template-${index}`,
            scheduled_date: calculateEventDate(event.timing),
            enabled: true
          }))
        );
      }
    }
  }, [templateDetail, setValue]);

  const calculateEventDate = (timing: string) => {
    const startDate = new Date(watch('start_date') || new Date());

    // Parse timing like "December - February", "March - April", etc.
    const monthMap: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11
    };

    const timingLower = timing.toLowerCase();
    const firstMonth = Object.keys(monthMap).find((month) => timingLower.includes(month));

    if (firstMonth) {
      const eventDate = new Date(startDate.getFullYear(), monthMap[firstMonth], 15);
      return eventDate.toISOString().split('T')[0];
    }

    // Default to 30 days from start
    const defaultDate = new Date(startDate);
    defaultDate.setDate(defaultDate.getDate() + 30);
    return defaultDate.toISOString().split('T')[0];
  };

  // Helper function to generate production names within 30-character limit
  const generateProductionName = (templateName: string, year: number): string => {
    // Create shorter versions of template names
    const nameMap: Record<string, string> = {
      'Citrus (Oranges)': 'Citrus',
      Almonds: 'Almonds',
      Soybeans: 'Soybeans',
      'Corn (Field)': 'Corn'
    };

    const shortName = nameMap[templateName] || templateName.split(' ')[0];
    const yearStr = year.toString();

    // Format: "Citrus 2025" (max 30 chars)
    const productionName = `${shortName} ${yearStr}`;

    // Ensure it's within 30 characters
    return productionName.length <= 30 ? productionName : productionName.substring(0, 30);
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    if (template.template_id) {
      setSelectedTemplateId(template.template_id.toString()); // Convert to string and check existence
    }
    onTemplateClose();

    toast({
      title: 'Template Selected! 🚀',
      description: `${template.name} template will accelerate your production setup.`,
      status: 'success',
      duration: 4000,
      isClosable: true
    });
  };

  const handleEventToggle = (eventId: string) => {
    setCustomEvents((events) =>
      events.map((event) => (event.id === eventId ? { ...event, enabled: !event.enabled } : event))
    );
  };

  const handleEventDateChange = (eventId: string, newDate: string) => {
    setCustomEvents((events) =>
      events.map((event) => (event.id === eventId ? { ...event, scheduled_date: newDate } : event))
    );
  };

  const onSubmit = async (data: ProductionFormData) => {
    try {
      setIsCreating(true);

      // Find the selected crop type to get its slug for the backend
      const selectedCropType = cropTypesData?.find((ct) => ct.id.toString() === data.crop_type_id);

      // Ensure we have a valid crop type ID
      if (!data.crop_type_id) {
        toast({
          title: 'Missing Crop Type',
          description: 'Please select a crop type before creating the production.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        return;
      }

      const productionPayload = {
        name: data.name,
        parcel_id: parseInt(parcelId!),
        crop_type: parseInt(data.crop_type_id), // Send the numeric ID, not the slug
        start_date: data.start_date,
        expected_harvest: data.expected_harvest,
        description: data.description,
        production_method: data.production_method,
        irrigation_method: data.irrigation_method,
        estimated_yield: data.estimated_yield,
        type: data.type,
        template_id: selectedTemplate?.template_id,
        template_events: customEvents.filter((event) => event.enabled)
      };

      const result = await startProduction(productionPayload).unwrap();

      toast({
        title: 'Production Started Successfully! 🎉',
        description: `${data.name} has been created with ${
          customEvents.filter((e) => e.enabled).length
        } pre-configured events.`,
        status: 'success',
        duration: 6000,
        isClosable: true
      });

      // Navigate to production dashboard
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`);
    } catch (error: any) {
      console.error('Error creating production:', error);
      toast({
        title: 'Error Creating Production',
        description: error?.data?.error || 'Failed to create production. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsCreating(false);
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
    return iconMap[cropType?.toLowerCase()] || FaSeedling;
  };

  if (isLoadingTemplates) {
    return (
      <StandardPage title="Quick Start Production" showBackButton>
        <VStack py={8}>
          <Spinner size="xl" color="green.500" />
          <Text>Loading smart templates...</Text>
        </VStack>
      </StandardPage>
    );
  }

  return (
    <StandardPage
      title="🚀 Quick Start Production"
      description={`Start a new production cycle${
        parcelName ? ` for ${parcelName}` : ''
      } with smart templates`}
      showBackButton
      onBack={() =>
        navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`)
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={8} align="stretch">
          {/* Template Selection Section */}
          <StandardCard
            title="Smart Setup Templates"
            subtitle="Choose a pre-configured template to reduce setup time by 37+ minutes"
          >
            <VStack spacing={6} align="stretch">
              {/* Current Template Display */}
              {selectedTemplate ? (
                <Box
                  p={4}
                  bg="green.50"
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor="green.200"
                >
                  <HStack spacing={3}>
                    <Icon
                      as={getCropIcon(selectedTemplate.crop_type)}
                      color="green.500"
                      boxSize={6}
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <Text fontSize="lg" fontWeight="bold" color="green.700">
                          {selectedTemplate.name} Template Selected
                        </Text>
                        <Badge colorScheme="green" variant="solid">
                          Smart Setup
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="green.600">
                        ⏱️ Setup time reduced by 37 minutes • 📅{' '}
                        {selectedTemplate.events_count || customEvents.length} events configured •
                        💰 {selectedTemplate.carbon_potential || 500} kg CO2e/year potential
                      </Text>
                      <HStack spacing={2} mt={1}>
                        <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                          ROI: {selectedTemplate.roi_analysis?.premium_pricing || '25-40%'}
                        </Badge>
                        <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                          Efficiency:{' '}
                          {selectedTemplate.roi_analysis?.efficiency_savings || '15-25%'}
                        </Badge>
                      </HStack>
                    </VStack>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="green"
                      onClick={onTemplateOpen}
                    >
                      Change Template
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <Box
                  p={4}
                  bg="blue.50"
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor="blue.200"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{ bg: 'blue.100', borderColor: 'blue.300' }}
                  onClick={selectedCropTypeId ? onTemplateOpen : undefined}
                  opacity={selectedCropTypeId ? 1 : 0.6}
                >
                  <HStack spacing={3}>
                    <Icon as={FaRocket} color="blue.500" boxSize={6} />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="lg" fontWeight="bold" color="blue.700">
                        {selectedCropTypeId ? 'Select a Smart Template' : 'Select Crop Type First'}
                      </Text>
                      <Text fontSize="sm" color="blue.600">
                        {selectedCropTypeId
                          ? `🚀 ${filteredTemplates.length} template${
                              filteredTemplates.length !== 1 ? 's' : ''
                            } available for your crop type`
                          : '🌱 Choose your crop type above to see available templates'}
                      </Text>
                      <HStack spacing={2} mt={1}>
                        {selectedCropTypeId ? (
                          <>
                            <Badge colorScheme="green" variant="subtle" fontSize="xs">
                              {filteredTemplates.length} Templates
                            </Badge>
                            <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                              USDA Verified
                            </Badge>
                            <Badge colorScheme="orange" variant="subtle" fontSize="xs">
                              ROI Analysis
                            </Badge>
                          </>
                        ) : (
                          <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                            Select crop type to continue
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                    {selectedCropTypeId && <Icon as={FaArrowRight} color="blue.400" />}
                  </HStack>
                </Box>
              )}
            </VStack>
          </StandardCard>

          {/* Production Details Form */}
          <StandardCard title="Production Details" subtitle="Configure your production cycle">
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
              {/* Crop Type Selection - First field */}
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isRequired isInvalid={!!errors.crop_type_id}>
                  <FormLabel>Crop Type</FormLabel>
                  {/* Debug Info */}
                  {isLoadingCropTypes && (
                    <Text fontSize="sm" color="blue.500" mb={2}>
                      Loading crop types...
                    </Text>
                  )}
                  {cropTypesError && (
                    <Text fontSize="sm" color="red.500" mb={2}>
                      Error loading crop types: {JSON.stringify(cropTypesError)}
                    </Text>
                  )}
                  {!isLoadingCropTypes &&
                    !cropTypesError &&
                    (!cropTypesData || cropTypesData.length === 0) && (
                      <Text fontSize="sm" color="orange.500" mb={2}>
                        No crop types available. Expected 6 crop types from database.
                      </Text>
                    )}
                  <Controller
                    name="crop_type_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="lg"
                        placeholder="Select your crop type..."
                        onChange={(e) => {
                          field.onChange(e);
                          setSelectedCropTypeId(e.target.value);
                        }}
                      >
                        {cropTypesData?.map((cropType) => (
                          <option key={cropType.id} value={cropType.id.toString()}>
                            {cropType.name} - {cropType.category.replace('_', ' ')}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.crop_type_id && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.crop_type_id.message}
                    </Text>
                  )}
                  {selectedCropTypeId && cropTypesData && (
                    <Box mt={2} p={3} bg="green.50" borderRadius="md">
                      {(() => {
                        const selectedCropType = cropTypesData.find(
                          (ct) => ct.id.toString() === selectedCropTypeId
                        );
                        return selectedCropType ? (
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="medium" color="green.700">
                              {selectedCropType.description}
                            </Text>
                            <HStack spacing={4} fontSize="xs" color="green.600">
                              <Text>
                                <Text as="span" fontWeight="medium">
                                  Emissions:
                                </Text>{' '}
                                {selectedCropType.emissions_per_hectare} kg CO2e/ha
                              </Text>
                              <Text>
                                <Text as="span" fontWeight="medium">
                                  Carbon Credit Potential:
                                </Text>{' '}
                                {selectedCropType.carbon_credit_potential} kg CO2e/ha
                              </Text>
                            </HStack>
                          </VStack>
                        ) : null;
                      })()}
                    </Box>
                  )}
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel>Production Name</FormLabel>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="e.g., Spring 2024 Orange Harvest" size="lg" />
                    )}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired isInvalid={!!errors.start_date}>
                  <FormLabel>Start Date</FormLabel>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => <Input {...field} type="date" size="lg" />}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Expected Harvest Date</FormLabel>
                  <Controller
                    name="expected_harvest"
                    control={control}
                    render={({ field }) => <Input {...field} type="date" size="lg" />}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>Production Type</FormLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="lg">
                        <option value="OR">Orchard (Perennial Crops)</option>
                        <option value="GA">Garden (Annual Crops)</option>
                      </Select>
                    )}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Production Method</FormLabel>
                  <Controller
                    name="production_method"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="lg">
                        <option value="conventional">Conventional</option>
                        <option value="organic">Organic</option>
                        <option value="regenerative">Regenerative</option>
                        <option value="sustainable">Sustainable</option>
                      </Select>
                    )}
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>Irrigation Method</FormLabel>
                  <Controller
                    name="irrigation_method"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} size="lg">
                        <option value="drip">Drip Irrigation</option>
                        <option value="sprinkler">Sprinkler</option>
                        <option value="flood">Flood Irrigation</option>
                        <option value="micro">Micro Sprinkler</option>
                        <option value="rain">Rain Fed</option>
                      </Select>
                    )}
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Describe this production cycle, goals, and special considerations..."
                        rows={3}
                        size="lg"
                      />
                    )}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </StandardCard>

          {/* Pre-configured Events */}
          {customEvents.length > 0 && (
            <StandardCard
              title="Pre-configured Events"
              subtitle="Review and customize the events from your selected template"
            >
              <VStack spacing={4} align="stretch">
                {customEvents.map((event, index) => (
                  <Box
                    key={event.id}
                    p={4}
                    bg={event.enabled ? 'gray.50' : 'gray.100'}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={event.enabled ? 'gray.200' : 'gray.300'}
                    opacity={event.enabled ? 1 : 0.6}
                  >
                    <HStack justify="space-between" mb={2}>
                      <HStack>
                        <Switch
                          isChecked={event.enabled}
                          onChange={() => handleEventToggle(event.id)}
                          colorScheme="green"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">{event.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {event.timing} • {event.frequency}
                          </Text>
                        </VStack>
                      </HStack>
                      <VStack align="end" spacing={0}>
                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                          {event.carbon_impact > 0 ? '+' : ''}
                          {event.carbon_impact} kg CO2e
                        </Text>
                        <Input
                          type="date"
                          size="sm"
                          value={event.scheduled_date}
                          onChange={(e) => handleEventDateChange(event.id, e.target.value)}
                          isDisabled={!event.enabled}
                          width="150px"
                        />
                      </VStack>
                    </HStack>
                    {event.efficiency_tips && (
                      <Box mt={2} p={2} bg="blue.50" borderRadius="sm">
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
            </StandardCard>
          )}

          {/* Action Buttons */}
          <HStack spacing={4} justify="flex-end">
            <StandardButton
              variant="outline"
              onClick={() =>
                navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`)
              }
            >
              Cancel
            </StandardButton>
            <StandardButton
              type="submit"
              isLoading={isCreating}
              loadingText="Creating Production..."
              leftIcon={<FaRocket />}
            >
              Start Production
            </StandardButton>
          </HStack>
        </VStack>
      </form>

      {/* Template Selection Modal */}
      <Modal isOpen={isTemplateOpen} onClose={onTemplateClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <HStack>
                <Icon as={FaRocket} color="blue.500" />
                <Heading size="lg">Select Production Template</Heading>
              </HStack>
              <Text fontSize="sm" color="gray.600" fontWeight="normal">
                {selectedCropTypeId && cropTypesData ? (
                  <>
                    Templates for{' '}
                    <Text as="span" fontWeight="semibold" color="green.600">
                      {cropTypesData.find((ct) => ct.id.toString() === selectedCropTypeId)?.name}
                    </Text>{' '}
                    • {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}{' '}
                    available
                  </>
                ) : (
                  'Choose a pre-configured template to accelerate your production setup'
                )}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {filteredTemplates.length > 0 ? (
              <Grid templateColumns="repeat(auto-fit, minmax(350px, 1fr))" gap={6}>
                {filteredTemplates.map((template) => {
                  const CropIcon = getCropIcon(template.crop_type);
                  return (
                    <Card
                      key={template.template_id}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        transform: 'translateY(-2px)',
                        shadow: 'lg',
                        borderColor: 'blue.300'
                      }}
                      onClick={() => handleTemplateSelect(template)}
                      borderWidth="1px"
                      borderColor={
                        selectedTemplate?.template_id === template.template_id
                          ? 'blue.300'
                          : 'gray.200'
                      }
                      bg={
                        selectedTemplate?.template_id === template.template_id ? 'blue.50' : 'white'
                      }
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
                        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
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
                        </Grid>
                      </CardBody>
                    </Card>
                  );
                })}
              </Grid>
            ) : (
              <VStack spacing={4} py={8} textAlign="center">
                <Icon as={FaSeedling} boxSize={12} color="gray.400" />
                <VStack spacing={2}>
                  <Heading size="md" color="gray.600">
                    No Templates Available
                  </Heading>
                  <Text color="gray.500" maxW="400px">
                    {selectedCropTypeId
                      ? `We don't have pre-configured templates for ${
                          cropTypesData?.find((ct) => ct.id.toString() === selectedCropTypeId)?.name
                        } yet. You can still create a production manually.`
                      : 'Select a crop type to see available templates.'}
                  </Text>
                </VStack>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  onClick={onTemplateClose}
                  leftIcon={<FaEdit />}
                >
                  Continue Without Template
                </Button>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onTemplateClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </StandardPage>
  );
};

export default QuickStartProduction;
