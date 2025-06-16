import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Box,
  Text,
  Select,
  Input,
  Textarea,
  useColorModeValue,
  useToast,
  Spinner,
  Icon,
  SimpleGrid,
  Badge,
  Flex
} from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  FaLeaf,
  FaCloudSun,
  FaTractor,
  FaFlask,
  FaClock,
  FaPlus,
  FaTools,
  FaSeedling,
  FaBusinessTime,
  FaBug,
  FaWrench,
  FaGasPump,
  FaFlask as FaSoil,
  FaChartLine,
  FaShoppingCart,
  FaCertificate,
  FaEye,
  FaShieldAlt
} from 'react-icons/fa';
// @ts-ignore - JS file import
import { useCreateEventMutation } from 'store/api/historyApi.js';
import {
  useCalculateEventCarbonImpactMutation,
  CarbonCalculationResult
} from 'store/api/carbonApi';
import { CarbonImpactPreview } from './CarbonImpactPreview';

interface QuickAddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelId?: number;
  onEventCreated?: () => void;
}

interface EventTemplate {
  id: string;
  name: string;
  type: number;
  eventType: string;
  icon: React.ElementType;
  color: string;
  defaultData?: Record<string, any>;
  category: string;
}

const eventTemplates: EventTemplate[] = [
  // Weather Events (type 0)
  {
    id: 'frost_protection',
    name: 'Frost Protection',
    type: 0,
    eventType: 'FR',
    icon: FaCloudSun,
    color: 'blue',
    category: 'Weather',
    defaultData: { type: 'FR' }
  },
  {
    id: 'drought_monitoring',
    name: 'Drought Monitoring',
    type: 0,
    eventType: 'DR',
    icon: FaCloudSun,
    color: 'orange',
    category: 'Weather',
    defaultData: { type: 'DR' }
  },
  {
    id: 'hailstorm_damage',
    name: 'Hailstorm Damage',
    type: 0,
    eventType: 'HA',
    icon: FaCloudSun,
    color: 'red',
    category: 'Weather',
    defaultData: { type: 'HA' }
  },

  // Production Events (type 2) - FIXED: was incorrectly type 1
  {
    id: 'irrigation',
    name: 'Irrigation',
    type: 2, // ✅ FIXED: PRODUCTION_EVENT_TYPE = 2
    eventType: 'IR',
    icon: FaTractor,
    color: 'green',
    category: 'Production',
    defaultData: { type: 'IR' }
  },
  {
    id: 'pruning',
    name: 'Pruning',
    type: 2, // ✅ FIXED: PRODUCTION_EVENT_TYPE = 2
    eventType: 'PR',
    icon: FaTractor,
    color: 'purple',
    category: 'Production',
    defaultData: { type: 'PR' }
  },
  {
    id: 'harvesting',
    name: 'Harvesting',
    type: 2, // ✅ FIXED: PRODUCTION_EVENT_TYPE = 2
    eventType: 'HA',
    icon: FaTractor,
    color: 'yellow',
    category: 'Production',
    defaultData: { type: 'HA' }
  },
  {
    id: 'planting',
    name: 'Planting',
    type: 2, // ✅ FIXED: PRODUCTION_EVENT_TYPE = 2
    eventType: 'PL',
    icon: FaSeedling,
    color: 'green',
    category: 'Production',
    defaultData: { type: 'PL' }
  },

  // Chemical Events (type 1) - FIXED: was incorrectly type 2
  {
    id: 'fertilizer',
    name: 'Fertilizer Application',
    type: 1, // ✅ FIXED: CHEMICAL_EVENT_TYPE = 1
    eventType: 'FE',
    icon: FaFlask,
    color: 'green',
    category: 'Chemical',
    defaultData: { type: 'FE', way_of_application: 'broadcast' }
  },
  {
    id: 'pesticide',
    name: 'Pesticide Application',
    type: 1, // ✅ FIXED: CHEMICAL_EVENT_TYPE = 1
    eventType: 'PE',
    icon: FaFlask,
    color: 'red',
    category: 'Chemical',
    defaultData: { type: 'PE', way_of_application: 'foliar' }
  },
  {
    id: 'herbicide',
    name: 'Herbicide Application',
    type: 1, // ✅ FIXED: CHEMICAL_EVENT_TYPE = 1
    eventType: 'HE',
    icon: FaFlask,
    color: 'orange',
    category: 'Chemical',
    defaultData: { type: 'HE', way_of_application: 'broadcast' }
  },
  {
    id: 'fungicide',
    name: 'Fungicide Application',
    type: 1, // ✅ FIXED: CHEMICAL_EVENT_TYPE = 1
    eventType: 'FU',
    icon: FaFlask,
    color: 'blue',
    category: 'Chemical',
    defaultData: { type: 'FU', way_of_application: 'foliar' }
  },

  // Equipment Events (type 4)
  {
    id: 'equipment_maintenance',
    name: 'Equipment Maintenance',
    type: 4,
    eventType: 'MN',
    icon: FaTools,
    color: 'gray',
    category: 'Equipment',
    defaultData: { type: 'MN', equipment_name: 'Tractor' }
  },
  {
    id: 'fuel_consumption',
    name: 'Fuel Consumption',
    type: 4,
    eventType: 'FC',
    icon: FaGasPump,
    color: 'orange',
    category: 'Equipment',
    defaultData: { type: 'FC', fuel_type: 'diesel' }
  },
  {
    id: 'equipment_repair',
    name: 'Equipment Repair',
    type: 4,
    eventType: 'RE',
    icon: FaWrench,
    color: 'red',
    category: 'Equipment',
    defaultData: { type: 'RE' }
  },

  // Soil Management Events (type 5)
  {
    id: 'soil_test',
    name: 'Soil Test',
    type: 5,
    eventType: 'ST',
    icon: FaSoil,
    color: 'brown',
    category: 'Soil Management',
    defaultData: { type: 'ST' }
  },
  {
    id: 'organic_matter',
    name: 'Organic Matter Addition',
    type: 5,
    eventType: 'OM',
    icon: FaSeedling,
    color: 'green',
    category: 'Soil Management',
    defaultData: { type: 'OM', amendment_type: 'compost' }
  },
  {
    id: 'cover_crop',
    name: 'Cover Crop',
    type: 5,
    eventType: 'CC',
    icon: FaLeaf,
    color: 'green',
    category: 'Soil Management',
    defaultData: { type: 'CC' }
  },

  // Business Events (type 6)
  {
    id: 'harvest_sale',
    name: 'Harvest Sale',
    type: 6,
    eventType: 'HS',
    icon: FaShoppingCart,
    color: 'green',
    category: 'Business',
    defaultData: { type: 'HS' }
  },
  {
    id: 'certification',
    name: 'Certification',
    type: 6,
    eventType: 'CE',
    icon: FaCertificate,
    color: 'blue',
    category: 'Business',
    defaultData: { type: 'CE', certification_type: 'Organic' }
  },
  {
    id: 'inspection',
    name: 'Inspection',
    type: 6,
    eventType: 'IN',
    icon: FaEye,
    color: 'purple',
    category: 'Business',
    defaultData: { type: 'IN' }
  },

  // Pest Management Events (type 7)
  {
    id: 'pest_scouting',
    name: 'Pest Scouting',
    type: 7,
    eventType: 'SC',
    icon: FaBug,
    color: 'orange',
    category: 'Pest Management',
    defaultData: { type: 'SC', pest_pressure_level: 'Low' }
  },
  {
    id: 'beneficial_release',
    name: 'Beneficial Release',
    type: 7,
    eventType: 'BR',
    icon: FaShieldAlt,
    color: 'green',
    category: 'Pest Management',
    defaultData: { type: 'BR' }
  },
  {
    id: 'ipm_implementation',
    name: 'IPM Implementation',
    type: 7,
    eventType: 'IP',
    icon: FaChartLine,
    color: 'blue',
    category: 'Pest Management',
    defaultData: { type: 'IP' }
  }
];

export const QuickAddEventModal: React.FC<QuickAddEventModalProps> = ({
  isOpen,
  onClose,
  parcelId,
  onEventCreated
}) => {
  const intl = useIntl();
  const toast = useToast();
  const { establishmentId } = useParams();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
  const [eventDate, setEventDate] = useState(
    new Date().toISOString().slice(0, 16) // Current datetime-local format
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carbonCalculation, setCarbonCalculation] = useState<CarbonCalculationResult | null>(null);

  // Get current company and parcels from Redux store
  const currentCompany = useSelector((state: any) => state.company.currentCompany);

  // Get the current parcel if parcelId is provided
  const currentParcel = currentCompany?.establishments
    ?.find((est: any) => est.id === parseInt(establishmentId || '0'))
    ?.parcels?.find((p: any) => p.id === parcelId);

  // RTK Query mutations
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const [calculateCarbonImpact, { isLoading: isCalculating }] =
    useCalculateEventCarbonImpactMutation();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTemplate(null);
      setEventDate(new Date().toISOString().slice(0, 16));
      setNotes('');
      setIsSubmitting(false);
      setCarbonCalculation(null);
    }
  }, [isOpen]);

  // Calculate carbon impact when template or form data changes
  useEffect(() => {
    if (selectedTemplate && eventDate) {
      const timeoutId = setTimeout(async () => {
        // Map template type to backend event type
        const eventTypeMap: Record<
          number,
          | 'chemical'
          | 'production'
          | 'weather'
          | 'general'
          | 'equipment'
          | 'soil_management'
          | 'business'
          | 'pest_management'
        > = {
          0: 'weather',
          1: 'production',
          2: 'chemical',
          3: 'general',
          4: 'equipment',
          5: 'soil_management',
          6: 'business',
          7: 'pest_management'
        };

        const event_type = eventTypeMap[selectedTemplate.type] || 'general';

        try {
          const event_data = {
            type: selectedTemplate.eventType,
            description: notes || selectedTemplate.name,
            date: eventDate,
            observation: notes,
            // Add template-specific default data
            ...selectedTemplate.defaultData
          };

          const result = await calculateCarbonImpact({
            event_type,
            event_data
          }).unwrap();

          setCarbonCalculation(result);
        } catch (error) {
          console.error('Failed to calculate carbon impact:', error);
          // Set fallback calculation with appropriate values for new event types
          const fallbackScores: Record<number, { co2e: number; efficiency_score: number }> = {
            0: { co2e: 0.1, efficiency_score: 75 }, // Weather - minimal impact
            1: { co2e: 2.5, efficiency_score: 60 }, // Production - moderate impact
            2: { co2e: 1.8, efficiency_score: 50 }, // Chemical - higher impact
            3: { co2e: 0.5, efficiency_score: 70 }, // General - low impact
            4: { co2e: 8.0, efficiency_score: 55 }, // Equipment - higher impact (fuel)
            5: { co2e: -1.5, efficiency_score: 90 }, // Soil Management - often negative (sequestration)
            6: { co2e: 0.3, efficiency_score: 65 }, // Business - minimal direct impact
            7: { co2e: -0.2, efficiency_score: 80 } // Pest Management - often reduces chemical use
          };

          const fallback = fallbackScores[selectedTemplate.type] || fallbackScores[3];

          setCarbonCalculation({
            co2e: fallback.co2e,
            efficiency_score: fallback.efficiency_score,
            usda_verified: false,
            calculation_method: 'fallback',
            event_type: eventTypeMap[selectedTemplate.type] || 'general',
            timestamp: new Date().toISOString(),
            error: 'Calculation failed - using estimates'
          });
        }
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    } else {
      setCarbonCalculation(null);
    }
  }, [selectedTemplate, eventDate, notes, calculateCarbonImpact]);

  const handleTemplateSelect = (template: EventTemplate) => {
    setSelectedTemplate(template);
  };

  const handleQuickAdd = async () => {
    if (!selectedTemplate || !eventDate) {
      toast({
        title: intl.formatMessage({ id: 'app.error' }) || 'Error',
        description:
          intl.formatMessage({ id: 'app.pleaseSelectTemplateAndDate' }) ||
          'Please select an event template and date',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parcelId || currentParcel?.id,
        parcels: [parcelId || currentParcel?.id],
        event_type: selectedTemplate.type,
        date: eventDate,
        description: notes || selectedTemplate.name,
        ...selectedTemplate.defaultData,
        // Required for the backend
        album: { images: [] },
        observation: notes
      };

      await createEvent(eventData).unwrap();

      toast({
        title: intl.formatMessage({ id: 'app.success' }) || 'Success',
        description:
          intl.formatMessage({ id: 'app.eventCreatedSuccessfully' }) ||
          'Event created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      onEventCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }) || 'Error',
        description:
          intl.formatMessage({ id: 'app.errorCreatingEvent' }) ||
          'Failed to create event. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="xl">
        <ModalHeader color={textColor} fontSize="xl" borderBottom="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Icon as={FaPlus} color="green.500" />
            <Text>{intl.formatMessage({ id: 'app.quickAddEvent' }) || 'Quick Add Event'}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={6} align="stretch">
            {/* Event Template Selection */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={3} color={textColor}>
                {intl.formatMessage({ id: 'app.selectEventType' }) || 'Select Event Type'}
              </Text>
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={3}>
                {eventTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate?.id === template.id ? 'solid' : 'outline'}
                    colorScheme={template.color}
                    size="md"
                    height="80px"
                    onClick={() => handleTemplateSelect(template)}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg'
                    }}
                    transition="all 0.2s"
                  >
                    <Icon as={template.icon} boxSize={5} />
                    <Text fontSize="xs" textAlign="center" lineHeight={1.2}>
                      {template.name}
                    </Text>
                  </Button>
                ))}
              </SimpleGrid>
            </Box>

            {/* Selected Template Info */}
            {selectedTemplate && (
              <Box
                p={4}
                borderRadius="md"
                bg={useColorModeValue(
                  `${selectedTemplate.color}.50`,
                  `${selectedTemplate.color}.900`
                )}
                borderWidth="1px"
                borderColor={useColorModeValue(
                  `${selectedTemplate.color}.200`,
                  `${selectedTemplate.color}.700`
                )}
              >
                <HStack spacing={3}>
                  <Icon
                    as={selectedTemplate.icon}
                    color={`${selectedTemplate.color}.500`}
                    boxSize={5}
                  />
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight="bold" fontSize="sm" color={textColor}>
                      {selectedTemplate.name}
                    </Text>
                    <Badge colorScheme={selectedTemplate.color} size="sm">
                      {selectedTemplate.type === 0 && 'Weather'}
                      {selectedTemplate.type === 1 && 'Production'}
                      {selectedTemplate.type === 2 && 'Chemical'}
                    </Badge>
                  </VStack>
                </HStack>
              </Box>
            )}

            {/* Date Selection */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={2} color={textColor}>
                {intl.formatMessage({ id: 'app.date' }) || 'Date & Time'}
              </Text>
              <Input
                type="datetime-local"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                size="md"
                borderRadius="md"
              />
            </Box>

            {/* Quick Notes */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" mb={2} color={textColor}>
                {intl.formatMessage({ id: 'app.quickNotes' }) || 'Quick Notes'}
                <Text as="span" fontSize="xs" fontWeight="normal" color="gray.500" ml={1}>
                  ({intl.formatMessage({ id: 'app.optional' }) || 'optional'})
                </Text>
              </Text>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  intl.formatMessage({ id: 'app.addQuickNotesHere' }) || 'Add quick notes here...'
                }
                rows={3}
                resize="none"
                borderRadius="md"
              />
            </Box>

            {/* Carbon Impact Preview */}
            {selectedTemplate && (
              <CarbonImpactPreview
                eventType={selectedTemplate.eventType}
                formData={{ selectedTemplate, eventDate, notes }}
                calculation={carbonCalculation}
                isCalculating={isCalculating}
              />
            )}

            {/* Action Buttons */}
            <HStack spacing={3} justify="flex-end" pt={4}>
              <Button variant="outline" onClick={onClose} isDisabled={isSubmitting || isLoading}>
                {intl.formatMessage({ id: 'app.cancel' }) || 'Cancel'}
              </Button>
              <Button
                colorScheme="green"
                onClick={handleQuickAdd}
                isLoading={isSubmitting || isLoading}
                loadingText={intl.formatMessage({ id: 'app.creating' }) || 'Creating...'}
                isDisabled={!selectedTemplate || !eventDate}
                leftIcon={<Icon as={FaClock} />}
                bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                _hover={{
                  bg: 'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
                  opacity: 0.9
                }}
                color="white"
              >
                {intl.formatMessage({ id: 'app.addEvent' }) || 'Add Event'}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
