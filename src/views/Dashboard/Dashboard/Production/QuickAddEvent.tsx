import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Grid,
  Icon,
  Badge,
  Box,
  Divider,
  IconButton,
  useToast,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText
} from '@chakra-ui/react';
import {
  FaSeedling,
  FaTint,
  FaSprayCan,
  FaCut,
  FaLeaf,
  FaMicrophone,
  FaMicrophoneSlash,
  FaCamera,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaClock,
  FaRuler,
  FaTractor,
  FaFlask,
  FaTools,
  FaBug,
  FaChartLine
} from 'react-icons/fa';
import { StandardButton } from 'components/Design';
import { VoiceEventCapture } from 'components/Events/VoiceEventCapture';
// @ts-ignore - JS file import
import { useCreateEventMutation } from 'store/api/historyApi.js';
import { useGetEventTemplatesByCropTypeQuery } from 'store/api/carbonApi';
import { useGetCropTypesQuery } from 'store/api/companyApi';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

interface EventTemplate {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  carbonImpact: number;
  costEstimate: number;
  efficiency_tip: string;
  typical_duration: string;
  carbonCategory: 'high' | 'medium' | 'low';
  sustainabilityScore: number;
  qrVisibility: 'high' | 'medium' | 'low';
  type: string;
}

interface QuickAddEventProps {
  isOpen: boolean;
  onClose: () => void;
  cropType: string;
  onEventAdded?: (event: any) => void;
}

const QuickAddEvent: React.FC<QuickAddEventProps> = ({
  isOpen,
  onClose,
  cropType,
  onEventAdded
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showVoiceCapture, setShowVoiceCapture] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 16));
  const [eventDescription, setEventDescription] = useState('');
  const [eventObservations, setEventObservations] = useState('');
  const [applicationRate, setApplicationRate] = useState('');
  const [duration, setDuration] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // RTK Query mutation and Redux state
  const [createEvent, { isLoading: isCreatingEvent }] = useCreateEventMutation();
  const currentCompany = useSelector((state: any) => state.company.currentCompany);
  const { establishmentId, parcelId } = useParams();

  // Get crop types and find the crop type ID for the current production
  const { data: cropTypesData } = useGetCropTypesQuery();

  // Find the crop type ID based on the cropType prop
  const currentCropTypeId = React.useMemo(() => {
    if (!cropTypesData || !cropType) return null;

    // Try to find by exact name match first
    let matchingCropType = cropTypesData.find(
      (ct: any) => ct.name.toLowerCase() === cropType.toLowerCase()
    );

    // If not found, try to find by category or slug
    if (!matchingCropType) {
      matchingCropType = cropTypesData.find(
        (ct: any) =>
          ct.category.toLowerCase().includes(cropType.toLowerCase()) ||
          ct.slug.toLowerCase().includes(cropType.toLowerCase())
      );
    }

    return matchingCropType?.id || null;
  }, [cropTypesData, cropType]);

  // Get event templates from database for the current crop type
  const { data: dbEventTemplatesData } = useGetEventTemplatesByCropTypeQuery(
    { cropTypeId: currentCropTypeId },
    { skip: !currentCropTypeId }
  );

  // Reset form when modal opens
  const resetForm = () => {
    setSelectedTemplate(null);
    setShowDetailedForm(false);
    setShowVoiceCapture(false);
    setEventDate(new Date().toISOString().slice(0, 16));
    setEventDescription('');
    setEventObservations('');
    setApplicationRate('');
    setDuration('');
  };

  // Reset when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Helper function to map event types to icons
  const getEventIcon = (eventType: string) => {
    const iconMap: Record<string, any> = {
      fertilization: FaSeedling,
      irrigation: FaTint,
      pest_control: FaSprayCan,
      pruning: FaCut,
      planting: FaSeedling,
      harvest: FaLeaf,
      soil_management: FaFlask,
      equipment: FaTractor,
      weather_protection: FaCamera,
      certification: FaChartLine,
      monitoring: FaTools,
      other: FaBug
    };
    return iconMap[eventType] || FaBug;
  };

  // Helper function to map event types to colors
  const getEventColor = (eventType: string, carbonCategory?: string) => {
    // Use carbon category for color if available
    if (carbonCategory) {
      const colorMap: Record<string, string> = {
        high: 'red',
        medium: 'orange',
        low: 'green',
        negative: 'teal',
        neutral: 'gray'
      };
      return colorMap[carbonCategory] || 'blue';
    }

    // Fallback to event type colors
    const colorMap: Record<string, string> = {
      fertilization: 'green',
      irrigation: 'blue',
      pest_control: 'orange',
      pruning: 'purple',
      planting: 'green',
      harvest: 'yellow',
      soil_management: 'brown',
      equipment: 'gray',
      weather_protection: 'cyan',
      certification: 'teal',
      monitoring: 'pink',
      other: 'gray'
    };
    return colorMap[eventType] || 'blue';
  };

  // Smart event templates based on crop type - CARBON-FOCUSED
  const getEventTemplates = (crop: string): EventTemplate[] => {
    // General templates (keep existing ones)
    const baseTemplates = [
      {
        id: 'fertilization',
        name: 'Fertilización',
        icon: FaSeedling,
        color: 'green',
        description: 'Aplicación de fertilizante',
        carbonImpact: 45,
        costEstimate: 180,
        efficiency_tip: 'Soil testing can reduce fertilizer needs by 20-30%',
        typical_duration: '2-3 hours',
        carbonCategory: 'high' as const,
        sustainabilityScore: 7,
        qrVisibility: 'high' as const,
        type: 'fertilization'
      },
      {
        id: 'irrigation',
        name: 'Riego',
        icon: FaTint,
        color: 'blue',
        description: 'Sistema de riego',
        carbonImpact: 25,
        costEstimate: 120,
        efficiency_tip: 'Smart irrigation controllers can save 25% energy',
        typical_duration: '1-2 hours setup',
        carbonCategory: 'medium' as const,
        sustainabilityScore: 8,
        qrVisibility: 'medium' as const,
        type: 'irrigation'
      },
      {
        id: 'pest_control',
        name: 'Control de Plagas',
        icon: FaSprayCan,
        color: 'orange',
        description: 'Aplicación de pesticidas',
        carbonImpact: 35,
        costEstimate: 150,
        efficiency_tip: 'IPM practices can reduce pesticide use by 40%',
        typical_duration: '3-4 hours',
        carbonCategory: 'high' as const,
        sustainabilityScore: 6,
        qrVisibility: 'high' as const,
        type: 'pest_control'
      },
      {
        id: 'pruning',
        name: 'Poda',
        icon: FaCut,
        color: 'purple',
        description: 'Poda de plantas',
        carbonImpact: 20,
        costEstimate: 200,
        efficiency_tip: 'Precision pruning reduces fuel consumption by 15%',
        typical_duration: '4-6 hours',
        carbonCategory: 'low' as const,
        sustainabilityScore: 9,
        qrVisibility: 'low' as const,
        type: 'pruning'
      }
    ];

    // Add crop-specific templates from database
    const dbTemplates: EventTemplate[] = [];
    if (dbEventTemplatesData?.templates) {
      dbEventTemplatesData.templates.forEach((template) => {
        dbTemplates.push({
          id: `db-${template.id}`,
          name: template.name,
          icon: getEventIcon(template.event_type),
          color: getEventColor(template.event_type, template.carbon_category),
          description: template.description,
          carbonImpact: template.carbon_impact || 0,
          costEstimate: template.cost_estimate || 0,
          efficiency_tip:
            template.efficiency_tips || 'Database-sourced template for optimal results',
          typical_duration: template.typical_duration || '2-3 hours',
          carbonCategory: template.carbon_category as 'high' | 'medium' | 'low',
          sustainabilityScore: template.sustainability_score || 7,
          qrVisibility: template.qr_visibility as 'high' | 'medium' | 'low',
          type: template.type || template.event_type
        });
      });
    }

    // Combine general templates with crop-specific ones
    const allTemplates = [...baseTemplates, ...dbTemplates];

    // Customize based on crop type - CARBON-OPTIMIZED (keep existing logic)
    if (crop.toLowerCase().includes('citrus')) {
      allTemplates.push({
        id: 'bloom_nutrition',
        name: 'Nutrición de Floración',
        icon: FaLeaf,
        color: 'pink',
        description: 'Nutrición específica para floración',
        carbonImpact: 30,
        costEstimate: 160,
        efficiency_tip: 'Timing-specific nutrition improves efficiency by 20%',
        typical_duration: '2-3 hours',
        carbonCategory: 'medium' as const,
        sustainabilityScore: 8,
        qrVisibility: 'medium' as const,
        type: 'bloom_nutrition'
      });
    }

    return allTemplates;
  };

  const eventTemplates = getEventTemplates(cropType);

  const handleTemplateSelect = (template: EventTemplate) => {
    setSelectedTemplate(template);
    // Pre-populate form fields with template data
    setEventDescription(`${template.name} - ${template.description}`);
    setApplicationRate(
      template.id === 'fertilization'
        ? '200 lbs/acre'
        : template.id === 'irrigation'
        ? 'Variable by system'
        : template.id === 'pest_control'
        ? '1-2 gallons/acre'
        : template.id === 'pruning'
        ? 'Per tree/plant'
        : '150-180 lbs/acre'
    );
    setDuration(template.typical_duration);
    setEventObservations(
      `Carbon Impact: ${template.carbonImpact} kg CO₂. Sustainability Score: ${template.sustainabilityScore}/10. QR Visibility: ${template.qrVisibility}. Tip: ${template.efficiency_tip}`
    );
  };

  const handleShowDetails = () => {
    setShowDetailedForm(true);
  };

  const handleBackToTemplates = () => {
    setShowDetailedForm(false);
  };

  const handleTemplateCreate = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    try {
      // Convert template to backend event format
      const eventTypeFields = getTemplateEventFields(selectedTemplate);

      const backendEventData = {
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parseInt(parcelId || '0'),
        parcels: [parseInt(parcelId || '0')],
        event_type: getTemplateEventType(selectedTemplate),
        date: new Date().toISOString(),
        description: `${selectedTemplate.name} - Carbon Impact: ${selectedTemplate.carbonImpact} kg CO₂`,
        album: { images: [] },
        // Use 'observation' (singular) instead of 'observations' to match backend model
        observation: `Template-created event. Sustainability Score: ${selectedTemplate.sustainabilityScore}/10. QR Visibility: ${selectedTemplate.qrVisibility}`,
        // Spread the event-specific fields
        ...eventTypeFields
      };

      await createEvent(backendEventData).unwrap();

      toast({
        title: 'Carbon Event Created! 🌱',
        description: `${selectedTemplate.name} event added with ${selectedTemplate.carbonImpact} kg CO₂ impact`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      if (onEventAdded) {
        onEventAdded(selectedTemplate);
      }

      handleClose();
    } catch (error) {
      console.error('Error creating template event:', error);
      toast({
        title: 'Error Creating Event',
        description: 'Failed to create carbon event. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Helper functions for voice data conversion
  const getEventTypeFromVoiceData = (eventData: any): number => {
    // Handle both the old format (event_type: 'irrigation') and new format (event_type: 'production')
    const eventType = eventData.event_type;

    if (eventType === 'production' || eventType === 'irrigation') {
      return 2; // Production Event
    } else if (
      eventType === 'chemical' ||
      eventType === 'fertilizer' ||
      eventType === 'pesticide'
    ) {
      return 1; // Chemical Event
    } else if (eventType === 'equipment') {
      return 4; // Equipment Event
    } else if (eventType === 'weather') {
      return 0; // Weather Event
    }

    return 2; // Default to Production instead of General
  };

  const convertVoiceDataToEventFields = (eventData: any): any => {
    const eventType = eventData.event_type;

    // Handle the actual data structure from VoiceEventCapture
    if (eventType === 'production') {
      // For production events, use the production_type field
      return {
        type: eventData.production_type || 'IR', // Use production_type from VoiceEventCapture
        observation:
          eventData.observation ||
          `Production activity: ${eventData.description || 'Not specified'}`
      };
    } else if (eventType === 'chemical') {
      // For chemical events, use the chemical_type field
      return {
        type: eventData.chemical_type || 'FE', // Use chemical_type from VoiceEventCapture
        commercial_name: eventData.commercial_name || 'Chemical Product',
        volume: eventData.volume || '',
        way_of_application: eventData.way_of_application || 'broadcast',
        time_period: eventData.time_period || 'morning'
      };
    } else if (eventType === 'equipment') {
      // For equipment events, use the equipment_type field
      return {
        type: eventData.equipment_type || 'FC', // Use equipment_type from VoiceEventCapture
        equipment_name: eventData.equipment_name || 'Farm Equipment',
        fuel_amount: eventData.fuel_amount || 0,
        fuel_type: eventData.fuel_type || 'diesel'
      };
    }

    // Fallback for old format or unknown types
    if (eventData.event_type === 'fertilizer') {
      return {
        type: 'FE',
        commercial_name: eventData.detected_products?.[0] || 'Fertilizer',
        volume: eventData.detected_amounts?.[0] || '',
        way_of_application: 'broadcast',
        time_period: 'morning'
      };
    } else if (eventData.event_type === 'irrigation') {
      return {
        type: 'IR',
        observation: `Duration: ${eventData.detected_amounts?.[0] || 'Not specified'}. System: ${
          eventData.detected_systems?.[0] || 'Standard'
        }`
      };
    }

    return {};
  };

  // Helper functions for template data conversion
  const getTemplateEventType = (template: EventTemplate): number => {
    // Handle database templates (prefixed with 'db-')
    if (template.id.startsWith('db-')) {
      // For database templates, we need to get the backend event type
      // This should be stored in the database template data
      const dbTemplate = dbEventTemplatesData?.templates.find((t) => `db-${t.id}` === template.id);
      if (dbTemplate?.backend_event_type !== undefined) {
        return dbTemplate.backend_event_type;
      }
    }

    // Map template types to backend event types (existing logic)
    if (template.id.includes('fertilizer') || template.id.includes('pesticide')) {
      return 1; // Chemical
    } else if (
      template.id.includes('irrigation') ||
      template.id.includes('harvest') ||
      template.id.includes('pruning')
    ) {
      return 2; // Production
    } else if (template.id.includes('equipment') || template.id.includes('tractor')) {
      return 4; // Equipment
    } else if (template.id.includes('weather') || template.id.includes('frost')) {
      return 0; // Weather
    }
    return 3; // General
  };

  const getTemplateEventFields = (template: EventTemplate): any => {
    // Handle database templates (prefixed with 'db-')
    if (template.id.startsWith('db-')) {
      const dbTemplate = dbEventTemplatesData?.templates.find((t) => `db-${t.id}` === template.id);
      if (dbTemplate?.backend_event_fields) {
        return {
          ...dbTemplate.backend_event_fields,
          // Add typical amounts if available
          ...(dbTemplate.typical_amounts || {})
        };
      }
    }

    // Existing template field mapping
    if (template.id.includes('fertilizer')) {
      return {
        type: 'FE',
        commercial_name: 'NPK Fertilizer',
        volume: '200 lbs/acre',
        way_of_application: 'broadcast',
        time_period: 'morning'
      };
    } else if (template.id.includes('irrigation')) {
      return {
        type: 'IR',
        observation: 'Standard irrigation cycle'
      };
    } else if (template.id.includes('harvest')) {
      return {
        type: 'HA',
        observation: 'Harvest operation'
      };
    } else if (template.id.includes('pruning')) {
      return {
        type: 'PR',
        observation: 'Pruning operation'
      };
    }
    return {};
  };

  const handleVoiceEventDetected = async (eventData: any) => {
    // Handle voice-detected event
    console.log('Voice event detected:', eventData);

    setIsCreating(true);
    try {
      // Convert voice data to backend event format
      const eventTypeFields = convertVoiceDataToEventFields(eventData);

      const backendEventData = {
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parseInt(parcelId || '0'),
        parcels: [parseInt(parcelId || '0')],
        event_type: getEventTypeFromVoiceData(eventData),
        date: new Date().toISOString(),
        description: eventData.description || `Voice-created ${eventData.event_type} event`,
        album: { images: [] },
        // Use 'observation' (singular) instead of 'observations' to match backend model
        observation: `Voice input: "${eventData.raw_transcript || ''}" | Confidence: ${
          eventData.confidence
        }%`,
        // Spread the event-specific fields (type, observation, commercial_name, etc.)
        ...eventTypeFields
      };

      console.log('Sending backend event data:', backendEventData);

      await createEvent(backendEventData).unwrap();

      toast({
        title: 'Voice Event Created! 🎤',
        description: `${eventData.event_type} event successfully added to production`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      if (onEventAdded) {
        onEventAdded(eventData);
      }

      setShowVoiceCapture(false);
      onClose(); // Close the main modal after successful voice event creation
    } catch (error) {
      console.error('Error creating voice event:', error);
      toast({
        title: 'Error Creating Voice Event',
        description: 'Failed to create event from voice input. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDetailedCreate = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    try {
      // Convert template and detailed form data to backend event format
      const eventTypeFields = getTemplateEventFields(selectedTemplate);

      const backendEventData = {
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parseInt(parcelId || '0'),
        parcels: [parseInt(parcelId || '0')],
        event_type: getTemplateEventType(selectedTemplate),
        date: eventDate,
        description: eventDescription,
        album: { images: [] },
        // Use 'observation' (singular) instead of 'observations' to match backend model
        observation: `${eventObservations}. Application Rate: ${applicationRate}. Duration: ${duration}`,
        // Spread the event-specific fields (includes 'type' field)
        ...eventTypeFields
      };

      await createEvent(backendEventData).unwrap();

      toast({
        title: 'Detailed Carbon Event Created! 🌱',
        description: `${selectedTemplate.name} event with detailed information added successfully`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      if (onEventAdded) {
        onEventAdded(selectedTemplate);
      }

      handleClose();
    } catch (error) {
      console.error('Error creating detailed event:', error);
      toast({
        title: 'Error Creating Event',
        description: 'Failed to create detailed carbon event. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <HStack>
            {showDetailedForm && (
              <IconButton
                aria-label="Back to templates"
                icon={<FaArrowLeft />}
                variant="ghost"
                size="sm"
                onClick={handleBackToTemplates}
              />
            )}
            <Icon as={FaSeedling} color="green.500" />
            <Text>{showDetailedForm ? 'Event Details' : 'Quick Add Event'}</Text>
            <Badge colorScheme="green" variant="subtle">
              Carbon Tracking
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pb={6} overflowY="auto">
          {!showDetailedForm ? (
            // TEMPLATE SELECTION VIEW
            <VStack spacing={6} align="stretch">
              {/* Carbon Impact Notice */}
              <Box p={4} bg="green.50" borderRadius="lg" borderWidth="1px" borderColor="green.200">
                <HStack>
                  <Icon as={FaLeaf} color="green.500" />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" color="green.700" fontSize="sm">
                      🌱 Carbon Transparency Focus
                    </Text>
                    <Text fontSize="xs" color="green.600">
                      Events logged here will be visible to consumers via QR codes
                    </Text>
                  </VStack>
                </HStack>
              </Box>

              {/* Voice Input Section */}
              {!showVoiceCapture ? (
                <Box p={4} bg="blue.50" borderRadius="lg" borderWidth="2px" borderColor="blue.200">
                  <VStack spacing={3}>
                    <HStack>
                      <Icon as={FaMicrophone} color="blue.500" />
                      <Text fontWeight="bold" color="blue.700">
                        Voice Input
                      </Text>
                      <Badge colorScheme="blue" size="sm">
                        Fastest Method
                      </Badge>
                    </HStack>

                    <Text fontSize="sm" color="blue.600" textAlign="center">
                      Say: "Applied fertilizer today, 200 pounds per acre"
                    </Text>

                    <Button
                      leftIcon={<FaMicrophone />}
                      colorScheme="blue"
                      onClick={() => setShowVoiceCapture(true)}
                      size="lg">
                      Start Voice Input
                    </Button>
                  </VStack>
                </Box>
              ) : (
                <VoiceEventCapture
                  onEventDetected={handleVoiceEventDetected}
                  isActive={true}
                  cropType={cropType}
                  onClose={() => setShowVoiceCapture(false)}
                />
              )}

              <Divider />

              {/* Smart Templates Section */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    Carbon Impact Templates
                  </Text>
                  <Badge colorScheme="green" variant="outline">
                    {cropType} Optimized
                  </Badge>
                </HStack>

                {/* General Events Section */}
                <Box mb={6}>
                  <HStack mb={3}>
                    <Icon as={FaTools} color="gray.500" boxSize={4} />
                    <Text fontWeight="semibold" fontSize="md" color="gray.700">
                      General Events
                    </Text>
                    <Badge colorScheme="gray" size="sm">
                      Common
                    </Badge>
                  </HStack>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {eventTemplates
                      .filter((template) => !template.id.startsWith('db-'))
                      .map((template) => (
                        <Box
                          key={template.id}
                          p={4}
                          borderRadius="lg"
                          borderWidth="2px"
                          borderColor={
                            selectedTemplate?.id === template.id
                              ? `${template.color}.400`
                              : 'gray.200'
                          }
                          bg={
                            selectedTemplate?.id === template.id ? `${template.color}.100` : 'white'
                          }
                          cursor="pointer"
                          onClick={() => handleTemplateSelect(template)}
                          _hover={{
                            borderColor: `${template.color}.300`,
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg'
                          }}
                          boxShadow={selectedTemplate?.id === template.id ? 'lg' : 'sm'}
                          transform={
                            selectedTemplate?.id === template.id ? 'translateY(-2px)' : 'none'
                          }
                          transition="all 0.2s"
                          position="relative">
                          {/* Selection indicator */}
                          {selectedTemplate?.id === template.id && (
                            <Box
                              position="absolute"
                              top={2}
                              right={2}
                              w={6}
                              h={6}
                              bg={`${template.color}.500`}
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center">
                              <Icon as={FaCamera} color="white" boxSize={3} />
                            </Box>
                          )}
                          <VStack spacing={3} align="start">
                            <HStack justify="space-between" width="100%">
                              <HStack>
                                <Icon
                                  as={template.icon}
                                  color={`${template.color}.500`}
                                  boxSize={5}
                                />
                                <Text
                                  fontWeight="bold"
                                  fontSize="sm"
                                  color={
                                    selectedTemplate?.id === template.id
                                      ? `${template.color}.700`
                                      : 'inherit'
                                  }>
                                  {template.name}
                                </Text>
                              </HStack>
                              <Badge
                                colorScheme={
                                  template.carbonCategory === 'high'
                                    ? 'red'
                                    : template.carbonCategory === 'medium'
                                    ? 'yellow'
                                    : 'green'
                                }
                                size="sm">
                                {template.carbonImpact} kg CO₂
                              </Badge>
                            </HStack>

                            <Text fontSize="xs" color="gray.600">
                              {template.description}
                            </Text>

                            <HStack justify="space-between" width="100%">
                              <HStack>
                                <Icon as={FaCamera} color="gray.400" boxSize={3} />
                                <Text fontSize="xs" color="gray.500">
                                  QR Visibility: {template.qrVisibility}
                                </Text>
                              </HStack>
                              <Text fontSize="xs" color="green.600" fontWeight="bold">
                                Score: {template.sustainabilityScore}/10
                              </Text>
                            </HStack>

                            <Box
                              p={2}
                              bg={
                                selectedTemplate?.id === template.id
                                  ? `${template.color}.50`
                                  : 'gray.50'
                              }
                              borderRadius="md"
                              width="100%">
                              <Text fontSize="xs" color="gray.600">
                                💡 {template.efficiency_tip}
                              </Text>
                            </Box>
                          </VStack>
                        </Box>
                      ))}
                  </Grid>
                </Box>

                {/* Crop-Specific Events Section */}
                {eventTemplates.filter((template) => template.id.startsWith('db-')).length > 0 && (
                  <Box>
                    <HStack mb={3}>
                      <Icon as={FaSeedling} color="green.500" boxSize={4} />
                      <Text fontWeight="semibold" fontSize="md" color="green.700">
                        {dbEventTemplatesData?.crop_type?.name || cropType} Specific Events
                      </Text>
                      <Badge colorScheme="green" size="sm">
                        Crop Optimized
                      </Badge>
                    </HStack>

                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      {eventTemplates
                        .filter((template) => template.id.startsWith('db-'))
                        .map((template) => (
                          <Box
                            key={template.id}
                            p={4}
                            borderRadius="lg"
                            borderWidth="2px"
                            borderColor={
                              selectedTemplate?.id === template.id
                                ? `${template.color}.400`
                                : 'green.200'
                            }
                            bg={
                              selectedTemplate?.id === template.id
                                ? `${template.color}.100`
                                : 'green.50'
                            }
                            cursor="pointer"
                            onClick={() => handleTemplateSelect(template)}
                            _hover={{
                              borderColor: `${template.color}.300`,
                              transform: 'translateY(-2px)',
                              boxShadow: 'lg'
                            }}
                            boxShadow={selectedTemplate?.id === template.id ? 'lg' : 'sm'}
                            transform={
                              selectedTemplate?.id === template.id ? 'translateY(-2px)' : 'none'
                            }
                            transition="all 0.2s"
                            position="relative">
                            {/* Selection indicator */}
                            {selectedTemplate?.id === template.id && (
                              <Box
                                position="absolute"
                                top={2}
                                right={2}
                                w={6}
                                h={6}
                                bg={`${template.color}.500`}
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                <Icon as={FaCamera} color="white" boxSize={3} />
                              </Box>
                            )}
                            <VStack spacing={3} align="start">
                              <HStack justify="space-between" width="100%">
                                <HStack>
                                  <Icon
                                    as={template.icon}
                                    color={`${template.color}.500`}
                                    boxSize={5}
                                  />
                                  <Text
                                    fontWeight="bold"
                                    fontSize="sm"
                                    color={
                                      selectedTemplate?.id === template.id
                                        ? `${template.color}.700`
                                        : 'inherit'
                                    }>
                                    {template.name}
                                  </Text>
                                  <Badge colorScheme="green" size="xs" variant="solid">
                                    DB
                                  </Badge>
                                </HStack>
                                <Badge
                                  colorScheme={
                                    template.carbonCategory === 'high'
                                      ? 'red'
                                      : template.carbonCategory === 'medium'
                                      ? 'yellow'
                                      : template.carbonCategory === 'low'
                                      ? 'green'
                                      : template.carbonCategory === 'negative'
                                      ? 'teal'
                                      : 'gray'
                                  }
                                  size="sm">
                                  {template.carbonImpact} kg CO₂
                                </Badge>
                              </HStack>

                              <Text fontSize="xs" color="gray.600">
                                {template.description}
                              </Text>

                              <HStack justify="space-between" width="100%">
                                <HStack>
                                  <Icon as={FaCamera} color="gray.400" boxSize={3} />
                                  <Text fontSize="xs" color="gray.500">
                                    QR Visibility: {template.qrVisibility}
                                  </Text>
                                </HStack>
                                <Text fontSize="xs" color="green.600" fontWeight="bold">
                                  Score: {template.sustainabilityScore}/10
                                </Text>
                              </HStack>

                              <Box
                                p={2}
                                bg={
                                  selectedTemplate?.id === template.id
                                    ? `${template.color}.50`
                                    : 'green.100'
                                }
                                borderRadius="md"
                                width="100%">
                                <Text fontSize="xs" color="green.700">
                                  💡 {template.efficiency_tip}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                        ))}
                    </Grid>
                  </Box>
                )}
              </Box>

              {/* Selected Template Actions */}
              {selectedTemplate && (
                <Box
                  p={4}
                  bg="green.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="green.200">
                  <VStack spacing={3}>
                    <HStack justify="space-between" width="100%">
                      <Text fontWeight="bold" color="green.700">
                        Ready to log: {selectedTemplate.name}
                      </Text>
                      <Badge colorScheme="green">{selectedTemplate.typical_duration}</Badge>
                    </HStack>

                    <HStack spacing={3} width="100%">
                      <Button
                        flex={1}
                        colorScheme="green"
                        onClick={handleTemplateCreate}
                        isLoading={isCreating}
                        loadingText="Creating...">
                        Quick Create Event
                      </Button>
                      <Button variant="outline" colorScheme="green" onClick={handleShowDetails}>
                        Add Details
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </VStack>
          ) : (
            // DETAILED FORM VIEW
            <VStack spacing={6} align="stretch">
              {/* Template Summary */}
              {selectedTemplate && (
                <Box
                  p={4}
                  bg={`${selectedTemplate.color}.50`}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={`${selectedTemplate.color}.200`}>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon
                        as={selectedTemplate.icon}
                        color={`${selectedTemplate.color}.500`}
                        boxSize={5}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" color={`${selectedTemplate.color}.700`}>
                          {selectedTemplate.name}
                        </Text>
                        <Text fontSize="xs" color={`${selectedTemplate.color}.600`}>
                          Carbon Impact: {selectedTemplate.carbonImpact} kg CO₂
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme={selectedTemplate.color}>
                      Score: {selectedTemplate.sustainabilityScore}/10
                    </Badge>
                  </HStack>
                </Box>
              )}

              {/* Detailed Form Fields */}
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Icon as={FaClock} color="blue.500" boxSize={4} />
                      <Text>Event Date & Time</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Event Description</FormLabel>
                  <Textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Describe what was done..."
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4}>
                  <FormControl flex={1}>
                    <FormLabel>
                      <HStack>
                        <Icon as={FaRuler} color="orange.500" boxSize={4} />
                        <Text>Application Rate</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={applicationRate}
                      onChange={(e) => setApplicationRate(e.target.value)}
                      placeholder="e.g., 200 lbs/acre"
                    />
                  </FormControl>

                  <FormControl flex={1}>
                    <FormLabel>
                      <HStack>
                        <Icon as={FaClock} color="purple.500" boxSize={4} />
                        <Text>Duration</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 2-3 hours"
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Additional Observations</FormLabel>
                  <Textarea
                    value={eventObservations}
                    onChange={(e) => setEventObservations(e.target.value)}
                    placeholder="Carbon impact notes, efficiency tips, etc..."
                    rows={4}
                  />
                  <FormHelperText>
                    This information will be visible to consumers via QR codes
                  </FormHelperText>
                </FormControl>
              </VStack>

              {/* Action Buttons */}
              <HStack spacing={3}>
                <Button
                  variant="outline"
                  onClick={handleBackToTemplates}
                  leftIcon={<FaArrowLeft />}>
                  Back to Templates
                </Button>
                <Button
                  flex={1}
                  colorScheme="green"
                  onClick={handleDetailedCreate}
                  isLoading={isCreating}
                  loadingText="Creating Detailed Event...">
                  Create Detailed Event
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuickAddEvent;
