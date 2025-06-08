import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  HStack,
  VStack,
  SimpleGrid,
  Box,
  Text,
  IconButton,
  Badge,
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Icon,
  Flex,
  Circle,
  useToast
} from '@chakra-ui/react';
import {
  StandardPage,
  StandardCard,
  StandardForm,
  StandardField,
  StandardInput,
  StandardTextarea,
  StandardSelect,
  StandardButton,
  StandardAlert,
  StandardGrid
} from '../Design/StandardComponents';
import {
  FaCloud,
  FaSeedling,
  FaFlask,
  FaTractor,
  FaBug,
  FaMountain,
  FaCamera,
  FaCloudRain,
  FaLeaf,
  FaFire,
  FaWind,
  FaSnowflake,
  FaChevronRight,
  FaChevronLeft,
  FaCheck
} from 'react-icons/fa';
import { MdCheck, MdLocationOn } from 'react-icons/md';
import { useIntl } from 'react-intl';

// Event Type Configuration
const EVENT_TYPES = [
  {
    id: 'weather',
    name: 'Weather Event',
    description: 'Record weather conditions affecting your crops',
    icon: FaCloud,
    color: 'blue',
    value: 0,
    subtypes: [
      { id: 'frost', name: 'Frost', icon: FaSnowflake },
      { id: 'drought', name: 'Drought', icon: FaFire },
      { id: 'heavy_rain', name: 'Heavy Rain', icon: FaCloudRain },
      { id: 'high_winds', name: 'High Winds', icon: FaWind }
    ]
  },
  {
    id: 'production',
    name: 'Production Activity',
    description: 'Track planting, harvesting, and maintenance',
    icon: FaSeedling,
    color: 'green',
    value: 2, // ✅ CORRECT: PRODUCTION_EVENT_TYPE = 2
    subtypes: [
      { id: 'planting', name: 'Planting', icon: FaSeedling },
      { id: 'harvesting', name: 'Harvesting', icon: FaLeaf },
      { id: 'irrigation', name: 'Irrigation', icon: FaCloudRain },
      { id: 'pruning', name: 'Pruning', icon: FaLeaf }
    ]
  },
  {
    id: 'chemical',
    name: 'Chemical Application',
    description: 'Log fertilizers, pesticides, and treatments',
    icon: FaFlask,
    color: 'orange',
    value: 1, // ✅ CORRECT: CHEMICAL_EVENT_TYPE = 1
    subtypes: [
      { id: 'fertilizer', name: 'Fertilizer', icon: FaFlask },
      { id: 'pesticide', name: 'Pesticide', icon: FaBug },
      { id: 'herbicide', name: 'Herbicide', icon: FaLeaf },
      { id: 'fungicide', name: 'Fungicide', icon: FaFlask }
    ]
  },
  {
    id: 'equipment',
    name: 'Equipment & Fuel',
    description: 'Track machinery usage and fuel consumption',
    icon: FaTractor,
    color: 'purple',
    value: 4,
    subtypes: [
      { id: 'maintenance', name: 'Maintenance', icon: FaTractor },
      { id: 'fuel_consumption', name: 'Fuel Usage', icon: FaFire },
      { id: 'repair', name: 'Repair', icon: FaTractor }
    ]
  },
  {
    id: 'soil',
    name: 'Soil Management',
    description: 'Monitor soil health and amendments',
    icon: FaMountain,
    color: 'brown',
    value: 5,
    subtypes: [
      { id: 'soil_test', name: 'Soil Test', icon: FaFlask },
      { id: 'ph_adjustment', name: 'pH Adjustment', icon: FaMountain },
      { id: 'organic_matter', name: 'Organic Matter', icon: FaLeaf }
    ]
  },
  {
    id: 'pest',
    name: 'Pest Management',
    description: 'IPM practices and beneficial releases',
    icon: FaBug,
    color: 'red',
    value: 7,
    subtypes: [
      { id: 'scouting', name: 'Scouting', icon: FaBug },
      { id: 'beneficial_release', name: 'Beneficial Release', icon: FaLeaf },
      { id: 'trap_monitoring', name: 'Trap Monitoring', icon: FaBug }
    ]
  }
];

interface EventFormData {
  eventType: string;
  subtype: string;
  date: string;
  description: string;
  location?: string;
  // Dynamic fields based on event type
  [key: string]: any;
}

interface StandardEventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EventFormData>;
  isLoading?: boolean;
}

export const StandardEventForm: React.FC<StandardEventFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EventFormData>({
    eventType: '',
    subtype: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    ...initialData
  });
  const [estimatedCarbonImpact, setEstimatedCarbonImpact] = useState<number | null>(null);

  const intl = useIntl();
  const toast = useToast();

  // Get current event type configuration
  const selectedEventType = EVENT_TYPES.find((type) => type.id === formData.eventType);
  const isStepComplete = (step: number) => {
    if (step === 1) return formData.eventType && formData.subtype && formData.date;
    if (step === 2) return true; // Step 2 is optional details
    return false;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isStepComplete(1)) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all required fields in Step 1',
        status: 'warning',
        duration: 3000
      });
      return;
    }

    onSubmit(formData);
  };

  // Calculate estimated carbon impact based on event type
  useEffect(() => {
    if (formData.eventType && formData.subtype) {
      // Simplified carbon impact estimation
      const impacts: Record<string, Record<string, number>> = {
        chemical: { fertilizer: 2.5, pesticide: 1.2, herbicide: 0.8 },
        equipment: { fuel_consumption: 3.2, maintenance: 0.5 },
        production: { irrigation: 1.8, planting: 0.3 },
        soil: { organic_matter: -1.5, ph_adjustment: 0.2 },
        pest: { beneficial_release: -0.8, scouting: 0.1 },
        weather: { drought: 0, frost: 0 }
      };

      const impact = impacts[formData.eventType]?.[formData.subtype] || 0;
      setEstimatedCarbonImpact(impact);
    }
  }, [formData.eventType, formData.subtype]);

  return (
    <StandardPage
      title="Add New Event"
      description="Record agricultural activities and environmental conditions"
      showBackButton
      onBack={onCancel}
    >
      {/* Progress Indicator */}
      <StandardCard>
        <HStack spacing={8} justify="center" mb={6}>
          <HStack spacing={2}>
            <Circle size="40px" bg={currentStep >= 1 ? 'green.500' : 'gray.300'} color="white">
              {isStepComplete(1) ? <Icon as={MdCheck} /> : <Text fontWeight="bold">1</Text>}
            </Circle>
            <VStack spacing={0} align="start">
              <Text fontWeight="semibold" fontSize="sm">
                Step 1
              </Text>
              <Text fontSize="xs" color="gray.500">
                Event Details
              </Text>
            </VStack>
          </HStack>

          <Box w="40px" h="2px" bg={currentStep >= 2 ? 'green.500' : 'gray.300'} />

          <HStack spacing={2}>
            <Circle size="40px" bg={currentStep >= 2 ? 'green.500' : 'gray.300'} color="white">
              <Text fontWeight="bold">2</Text>
            </Circle>
            <VStack spacing={0} align="start">
              <Text fontWeight="semibold" fontSize="sm">
                Step 2
              </Text>
              <Text fontSize="xs" color="gray.500">
                Additional Info
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </StandardCard>

      {/* Step 1: Event Type & Basics */}
      {currentStep === 1 && (
        <StandardCard
          title="Step 1: What happened?"
          subtitle="Select the type of event you want to record"
        >
          <VStack spacing={6} align="stretch">
            {/* Event Type Selection */}
            <StandardField label="Event Type" required>
              <StandardGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {EVENT_TYPES.map((eventType) => (
                  <Box
                    key={eventType.id}
                    p={4}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={
                      formData.eventType === eventType.id ? `${eventType.color}.500` : 'gray.200'
                    }
                    bg={formData.eventType === eventType.id ? `${eventType.color}.50` : 'white'}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: `${eventType.color}.300`,
                      transform: 'translateY(-2px)'
                    }}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, eventType: eventType.id, subtype: '' }))
                    }
                  >
                    <VStack spacing={3}>
                      <Circle
                        size="50px"
                        bg={`${eventType.color}.100`}
                        color={`${eventType.color}.600`}
                      >
                        <Icon as={eventType.icon} boxSize={6} />
                      </Circle>

                      <VStack spacing={1}>
                        <Text fontWeight="semibold" fontSize="md" textAlign="center">
                          {eventType.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {eventType.description}
                        </Text>
                      </VStack>

                      {formData.eventType === eventType.id && (
                        <Badge colorScheme={eventType.color} variant="solid">
                          Selected
                        </Badge>
                      )}
                    </VStack>
                  </Box>
                ))}
              </StandardGrid>
            </StandardField>

            {/* Subtype Selection */}
            {selectedEventType && (
              <StandardField label={`${selectedEventType.name} Type`} required>
                <StandardGrid columns={{ base: 2, md: 4 }} spacing={3}>
                  {selectedEventType.subtypes.map((subtype) => (
                    <Box
                      key={subtype.id}
                      p={3}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={
                        formData.subtype === subtype.id
                          ? `${selectedEventType.color}.500`
                          : 'gray.200'
                      }
                      bg={
                        formData.subtype === subtype.id ? `${selectedEventType.color}.50` : 'white'
                      }
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: `${selectedEventType.color}.300` }}
                      onClick={() => setFormData((prev) => ({ ...prev, subtype: subtype.id }))}
                    >
                      <HStack spacing={2}>
                        <Icon as={subtype.icon} color={`${selectedEventType.color}.600`} />
                        <Text
                          fontSize="sm"
                          fontWeight={formData.subtype === subtype.id ? 'semibold' : 'normal'}
                        >
                          {subtype.name}
                        </Text>
                      </HStack>
                    </Box>
                  ))}
                </StandardGrid>
              </StandardField>
            )}

            {/* Date Selection */}
            <StandardField label="Date" required>
              <StandardInput
                type="date"
                value={formData.date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </StandardField>

            {/* Dynamic Fields Based on Event Type */}
            {selectedEventType && formData.subtype && (
              <DynamicEventFields
                eventType={formData.eventType}
                subtype={formData.subtype}
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Carbon Impact Preview */}
            {estimatedCarbonImpact !== null && (
              <StandardAlert
                status={
                  estimatedCarbonImpact > 0
                    ? 'warning'
                    : estimatedCarbonImpact < 0
                    ? 'success'
                    : 'info'
                }
                title="Estimated Carbon Impact"
                description={
                  estimatedCarbonImpact > 0
                    ? `This activity may generate approximately ${estimatedCarbonImpact} kg CO₂e`
                    : estimatedCarbonImpact < 0
                    ? `This activity may offset approximately ${Math.abs(
                        estimatedCarbonImpact
                      )} kg CO₂e`
                    : 'This activity has minimal carbon impact'
                }
              />
            )}

            {/* Step 1 Actions */}
            <HStack spacing={3} justify="flex-end">
              <StandardButton variant="outline" onClick={onCancel}>
                Cancel
              </StandardButton>
              <StandardButton
                onClick={() => setCurrentStep(2)}
                rightIcon={<FaChevronRight />}
                disabled={!isStepComplete(1)}
              >
                Continue to Details
              </StandardButton>
            </HStack>
          </VStack>
        </StandardCard>
      )}

      {/* Step 2: Additional Details */}
      {currentStep === 2 && (
        <StandardCard
          title="Step 2: Additional Details"
          subtitle="Optional information to enhance your record"
        >
          <VStack spacing={6} align="stretch">
            {/* Description */}
            <StandardField
              label="Description"
              helpText="Add any notes, observations, or additional context"
            >
              <StandardTextarea
                value={formData.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe what happened, conditions observed, or any other relevant details..."
              />
            </StandardField>

            {/* Location (if GPS available) */}
            <StandardField label="Location" helpText="Specific area within your operation">
              <StandardInput
                value={formData.location || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                placeholder="e.g., North Field Block A, Greenhouse #2"
                leftElement={<Icon as={MdLocationOn} color="gray.400" />}
              />
            </StandardField>

            {/* Photo Upload Placeholder */}
            <StandardField
              label="Photos"
              helpText="Add photos to document this event (coming soon)"
            >
              <Box
                p={8}
                borderRadius="lg"
                border="2px dashed"
                borderColor="gray.300"
                textAlign="center"
                bg="gray.50"
              >
                <VStack spacing={2}>
                  <Icon as={FaCamera} boxSize={8} color="gray.400" />
                  <Text color="gray.500" fontSize="sm">
                    Photo upload will be available in the next update
                  </Text>
                </VStack>
              </Box>
            </StandardField>

            {/* Step 2 Actions */}
            <HStack spacing={3} justify="space-between">
              <StandardButton
                variant="outline"
                leftIcon={<FaChevronLeft />}
                onClick={() => setCurrentStep(1)}
              >
                Back to Event Details
              </StandardButton>

              <HStack spacing={3}>
                <StandardButton variant="outline" onClick={onCancel}>
                  Cancel
                </StandardButton>
                <StandardButton onClick={handleSubmit} isLoading={isLoading} leftIcon={<FaCheck />}>
                  Save Event
                </StandardButton>
              </HStack>
            </HStack>
          </VStack>
        </StandardCard>
      )}
    </StandardPage>
  );
};

// Dynamic Fields Component
const DynamicEventFields: React.FC<{
  eventType: string;
  subtype: string;
  formData: EventFormData;
  setFormData: React.Dispatch<React.SetStateAction<EventFormData>>;
}> = ({ eventType, subtype, formData, setFormData }) => {
  // Chemical Application Fields
  if (eventType === 'chemical') {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <StandardField label="Product Name">
          <StandardInput
            value={formData.productName || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData((prev) => ({ ...prev, productName: e.target.value }))
            }
            placeholder="e.g., Miracle-Gro All Purpose"
          />
        </StandardField>

        <StandardField label="Application Rate">
          <StandardInput
            value={formData.applicationRate || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData((prev) => ({ ...prev, applicationRate: e.target.value }))
            }
            placeholder="e.g., 2 lbs per acre"
          />
        </StandardField>

        <StandardField label="Area Treated">
          <StandardInput
            value={formData.areaTreated || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData((prev) => ({ ...prev, areaTreated: e.target.value }))
            }
            placeholder="e.g., 5 acres"
          />
        </StandardField>

        <StandardField label="Application Method">
          <StandardSelect
            value={formData.applicationMethod || ''}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setFormData((prev) => ({ ...prev, applicationMethod: e.target.value }))
            }
          >
            <option value="">Select method...</option>
            <option value="spray">Spray Application</option>
            <option value="granular">Granular Broadcast</option>
            <option value="injection">Soil Injection</option>
            <option value="drench">Soil Drench</option>
          </StandardSelect>
        </StandardField>
      </SimpleGrid>
    );
  }

  // Equipment Fields
  if (eventType === 'equipment') {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <StandardField label="Equipment Name">
          <StandardInput
            value={formData.equipmentName || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData((prev) => ({ ...prev, equipmentName: e.target.value }))
            }
            placeholder="e.g., John Deere 8320R"
          />
        </StandardField>

        {subtype === 'fuel_consumption' && (
          <>
            <StandardField label="Fuel Amount (Gallons)">
              <NumberInput
                value={formData.fuelAmount || ''}
                onChange={(value) => setFormData((prev) => ({ ...prev, fuelAmount: value }))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </StandardField>

            <StandardField label="Fuel Type">
              <StandardSelect
                value={formData.fuelType || ''}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFormData((prev) => ({ ...prev, fuelType: e.target.value }))
                }
              >
                <option value="">Select fuel type...</option>
                <option value="diesel">Diesel</option>
                <option value="gasoline">Gasoline</option>
                <option value="biodiesel">Biodiesel</option>
              </StandardSelect>
            </StandardField>
          </>
        )}

        <StandardField label="Hours Used">
          <NumberInput
            value={formData.hoursUsed || ''}
            onChange={(value) => setFormData((prev) => ({ ...prev, hoursUsed: value }))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </StandardField>
      </SimpleGrid>
    );
  }

  // Production Fields
  if (eventType === 'production') {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <StandardField label="Area">
          <StandardInput
            value={formData.area || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData((prev) => ({ ...prev, area: e.target.value }))
            }
            placeholder="e.g., 10 acres, Block A"
          />
        </StandardField>

        {subtype === 'harvesting' && (
          <StandardField label="Quantity Harvested">
            <StandardInput
              value={formData.quantityHarvested || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, quantityHarvested: e.target.value }))
              }
              placeholder="e.g., 2,500 lbs"
            />
          </StandardField>
        )}

        {subtype === 'irrigation' && (
          <StandardField label="Water Amount">
            <StandardInput
              value={formData.waterAmount || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, waterAmount: e.target.value }))
              }
              placeholder="e.g., 1,000 gallons"
            />
          </StandardField>
        )}
      </SimpleGrid>
    );
  }

  // Default: return basic observation field
  return (
    <StandardField label="Observation">
      <StandardTextarea
        value={formData.observation || ''}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          setFormData((prev) => ({ ...prev, observation: e.target.value }))
        }
        placeholder="Record any specific observations about this event..."
      />
    </StandardField>
  );
};

export default StandardEventForm;
