// Chakra imports
import {
  Button,
  Select as ChakraSelect,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  HStack,
  Box,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputRightAddon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Divider,
  Badge,
  Tooltip,
  SimpleGrid
} from '@chakra-ui/react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaThermometerHalf,
  FaLeaf,
  FaRulerHorizontal
} from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { number, object, string } from 'zod';

import { FaPlus } from 'react-icons/fa';
import FormInput from 'components/Forms/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';

// Enhanced form schema with USDA-compliant validation (crop type inherited from production)
const formSchemaMainInfo = object({
  type: string().min(1, 'Chemical type is required'),
  commercial_name: string().min(2, 'Commercial name must be at least 2 characters'),
  volume: string().min(1, 'Volume is required'),
  volume_unit: string().min(1, 'Volume unit is required'),
  area: string().min(1, 'Area is required'),
  area_unit: string().min(1, 'Area unit is required'),
  concentration: string().min(1, 'Concentration is required'),
  way_of_application: string().min(1, 'Application method is required'),
  weather_conditions: string().optional(),
  soil_moisture: string().optional(),
  temperature_range: string().optional(),
  wind_speed: string().optional(),
  time_period: string().optional(),
  observation: string().optional()
});

// USDA-compliant crop types for reference (crop type is inherited from production, not selected per event)
const USDA_CROP_TYPES = [
  { value: 'citrus', label: 'Citrus (Oranges, Lemons, Limes)', usdaName: 'ORANGES' },
  { value: 'corn', label: 'Corn (Field Corn)', usdaName: 'CORN' },
  { value: 'soybeans', label: 'Soybeans', usdaName: 'SOYBEANS' },
  { value: 'wheat', label: 'Wheat', usdaName: 'WHEAT' },
  { value: 'cotton', label: 'Cotton', usdaName: 'COTTON' },
  { value: 'rice', label: 'Rice', usdaName: 'RICE' },
  { value: 'tomatoes', label: 'Tomatoes', usdaName: 'TOMATOES' },
  { value: 'potatoes', label: 'Potatoes', usdaName: 'POTATOES' },
  { value: 'lettuce', label: 'Lettuce', usdaName: 'LETTUCE' },
  { value: 'carrots', label: 'Carrots', usdaName: 'CARROTS' },
  { value: 'onions', label: 'Onions', usdaName: 'ONIONS' },
  { value: 'apples', label: 'Apples', usdaName: 'APPLES' },
  { value: 'grapes', label: 'Grapes', usdaName: 'GRAPES' },
  { value: 'strawberries', label: 'Strawberries', usdaName: 'STRAWBERRIES' },
  { value: 'almonds', label: 'Almonds', usdaName: 'ALMONDS' },
  { value: 'avocados', label: 'Avocados', usdaName: 'AVOCADOS' }
];

// Enhanced intelligent defaults (crop type is inherited from production context)
const getIntelligentDefaults = (chemicalType) => {
  const defaults = {
    FE: {
      // Fertilizer
      volume: '50',
      volume_unit: 'liters',
      area: '2.0',
      area_unit: 'hectares',
      concentration: '16-16-16',
      way_of_application: 'broadcast',
      time_period: 'morning',
      weather_conditions: 'calm, dry conditions',
      soil_moisture: 'moderate',
      temperature_range: '18-25°C'
    },
    PE: {
      // Pesticide
      volume: '20',
      volume_unit: 'liters',
      area: '1.0',
      area_unit: 'hectares',
      concentration: '2.5%',
      way_of_application: 'spray',
      time_period: 'early_morning',
      weather_conditions: 'low wind, dry conditions',
      soil_moisture: 'moderate',
      temperature_range: '15-22°C'
    },
    FU: {
      // Fungicide
      volume: '15',
      volume_unit: 'liters',
      area: '1.0',
      area_unit: 'hectares',
      concentration: '1.5%',
      way_of_application: 'foliar',
      time_period: 'evening',
      weather_conditions: 'calm, humid conditions',
      soil_moisture: 'high',
      temperature_range: '20-28°C'
    },
    HE: {
      // Herbicide
      volume: '25',
      volume_unit: 'liters',
      area: '1.0',
      area_unit: 'hectares',
      concentration: '3.0%',
      way_of_application: 'spray',
      time_period: 'morning',
      weather_conditions: 'low wind, dry conditions',
      soil_moisture: 'moderate',
      temperature_range: '18-25°C'
    }
  };

  return defaults[chemicalType] || defaults.FE;
};

const ChemicalTab = ({ onSubmitHandler, onPrev, initialValues = {}, cropType = 'citrus' }) => {
  const intl = useIntl();
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.300', 'gray.700');
  const [selectedChemicalType, setSelectedChemicalType] = useState('');

  // Map API format to form format
  const mapApiTypeToFormType = (apiType) => {
    if (!apiType) return '';

    const typeMapping = {
      'event.chemical.fertilizer': 'FE',
      'event.chemical.pesticide': 'PE',
      'event.chemical.fungicide': 'FU',
      'event.chemical.herbicide': 'HE'
    };

    return typeMapping[apiType] || apiType;
  };

  const formType = mapApiTypeToFormType(initialValues.type);

  // Get intelligent defaults for the current chemical type (crop type inherited from production)
  const intelligentDefaults = getIntelligentDefaults(formType || 'FE');

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo),
    defaultValues: {
      type: formType || '',
      commercial_name: initialValues.commercial_name || '',
      volume: initialValues.volume || intelligentDefaults.volume,
      volume_unit: initialValues.volume_unit || intelligentDefaults.volume_unit,
      area: initialValues.area || intelligentDefaults.area,
      area_unit: initialValues.area_unit || intelligentDefaults.area_unit,
      concentration: initialValues.concentration || intelligentDefaults.concentration,
      way_of_application:
        initialValues.way_of_application || intelligentDefaults.way_of_application,
      weather_conditions:
        initialValues.weather_conditions || intelligentDefaults.weather_conditions,
      soil_moisture: initialValues.soil_moisture || intelligentDefaults.soil_moisture,
      temperature_range: initialValues.temperature_range || intelligentDefaults.temperature_range,
      wind_speed: initialValues.wind_speed || '',
      time_period: initialValues.time_period || intelligentDefaults.time_period,
      observation: initialValues.observation || ''
    }
  });

  const {
    reset: mainInfoReset,
    handleSubmit: mainInfoSubmit,
    errors: mainInfoErrors,
    formState: { errors, isSubmitSuccessful },
    register,
    setValue,
    watch
  } = mainInfoMethods;

  // Watch the chemical type to update defaults
  const watchedType = watch('type');

  // Update defaults when chemical type changes
  useEffect(() => {
    if (watchedType && watchedType !== selectedChemicalType) {
      setSelectedChemicalType(watchedType);

      const newDefaults = getIntelligentDefaults(watchedType);

      // Update fields with intelligent defaults
      Object.keys(newDefaults).forEach((field) => {
        const currentValue = watch(field);
        if (!currentValue || currentValue === intelligentDefaults[field]) {
          setValue(field, newDefaults[field]);
        }
      });
    }
  }, [watchedType, selectedChemicalType, setValue, watch]);

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      const mappedType = mapApiTypeToFormType(initialValues.type);
      const defaults = getIntelligentDefaults(mappedType || 'FE');

      mainInfoMethods.reset({
        type: mappedType || '',
        commercial_name: initialValues.commercial_name || '',
        volume: initialValues.volume || defaults.volume,
        volume_unit: initialValues.volume_unit || defaults.volume_unit,
        area: initialValues.area || defaults.area,
        area_unit: initialValues.area_unit || defaults.area_unit,
        concentration: initialValues.concentration || defaults.concentration,
        way_of_application: initialValues.way_of_application || defaults.way_of_application,
        weather_conditions: initialValues.weather_conditions || defaults.weather_conditions,
        soil_moisture: initialValues.soil_moisture || defaults.soil_moisture,
        temperature_range: initialValues.temperature_range || defaults.temperature_range,
        wind_speed: initialValues.wind_speed || '',
        time_period: initialValues.time_period || defaults.time_period,
        observation: initialValues.observation || ''
      });
    }
  }, [initialValues, mainInfoMethods]);

  // Enhanced submit handler with validation (crop type inherited from production)
  const handleEnhancedSubmit = (data) => {
    // Validate that no field contains "Unknown" or empty values
    const requiredFields = [
      'type',
      'commercial_name',
      'volume',
      'volume_unit',
      'area',
      'area_unit',
      'concentration',
      'way_of_application'
    ];

    const invalidFields = requiredFields.filter((field) => {
      const value = data[field]?.toString().toLowerCase();
      return (
        !value || value === 'unknown' || value === 'n/a' || value === 'na' || value.trim() === ''
      );
    });

    if (invalidFields.length > 0) {
      // Auto-fill missing fields with intelligent defaults
      const defaults = getIntelligentDefaults(data.type);
      invalidFields.forEach((field) => {
        if (defaults[field]) {
          data[field] = defaults[field];
          setValue(field, defaults[field]);
        }
      });
    }

    // Note: Crop type is inherited from production context via event.history.crop_type.name
    // USDA API mapping happens in backend based on production's crop type

    // Call the original submit handler
    onSubmitHandler(data);
  };

  return (
    <FormProvider {...mainInfoMethods}>
      <form onSubmit={mainInfoSubmit(handleEnhancedSubmit)} style={{ width: '100%' }}>
        <Flex direction="column" w="100%">
          {/* Enhanced Information Alert */}
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">USDA Compliance & Carbon Calculation</AlertTitle>
              <AlertDescription fontSize="xs">
                All fields marked with * are required for accurate carbon footprint calculations and
                USDA compliance verification. Smart defaults are provided based on your selections.
              </AlertDescription>
            </Box>
          </Alert>

          {/* Section 1: Chemical Information */}
          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <Text fontSize="md" fontWeight="bold" mb={4} color="blue.600">
              <Icon as={FaLeaf} mr={2} />
              Chemical & Crop Information
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.type}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  {intl.formatMessage({ id: 'app.type' })} *
                </FormLabel>
                <ChakraSelect
                  placeholder="Select chemical type"
                  ml="4px"
                  height={'40px'}
                  borderRadius={'15px'}
                  fontSize={'0.875rem'}
                  mb="24px"
                  {...register('type')}
                >
                  <option value="FE">Fertilizer</option>
                  <option value="PE">Pesticide</option>
                  <option value="FU">Fungicide</option>
                  <option value="HE">Herbicide</option>
                </ChakraSelect>
                <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Crop Type
                  <Tooltip label="Crop type is inherited from production - no need to select again">
                    <Icon as={FaInfoCircle} ml={1} color="green.400" />
                  </Tooltip>
                </FormLabel>
                <Box
                  ml="4px"
                  height={'40px'}
                  borderRadius={'15px'}
                  fontSize={'0.875rem'}
                  mb="24px"
                  p={2}
                  bg="green.50"
                  border="1px solid"
                  borderColor="green.200"
                  display="flex"
                  alignItems="center"
                >
                  <Text color="green.700" fontWeight="medium">
                    {cropType
                      ? USDA_CROP_TYPES.find((crop) => crop.value === cropType.toLowerCase())
                          ?.label || `${cropType} (inherited from production)`
                      : 'Inherited from production'}
                  </Text>
                </Box>
              </FormControl>
            </SimpleGrid>

            <FormControl isInvalid={!!errors.commercial_name}>
              <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                {intl.formatMessage({ id: 'app.commercialName' })} *
              </FormLabel>
              <Input
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder="e.g., Miracle-Gro All Purpose, Roundup WeatherMAX"
                mb="24px"
                {...register('commercial_name')}
              />
              <FormErrorMessage>{errors.commercial_name?.message}</FormErrorMessage>
            </FormControl>
          </Box>

          {/* Section 2: Application Details */}
          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <Text fontSize="md" fontWeight="bold" mb={4} color="green.600">
              <Icon as={FaRulerHorizontal} mr={2} />
              Application Measurements
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.volume}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Volume Applied *
                </FormLabel>
                <HStack spacing={2}>
                  <Input
                    flex={2}
                    ms="4px"
                    borderRadius="15px"
                    type="number"
                    step="0.1"
                    placeholder="50.0"
                    mb="24px"
                    {...register('volume')}
                  />
                  <ChakraSelect
                    flex={1}
                    height={'40px'}
                    borderRadius={'15px'}
                    mb="24px"
                    {...register('volume_unit')}
                  >
                    <option value="liters">Liters</option>
                    <option value="gallons">Gallons</option>
                    <option value="kg">Kilograms</option>
                    <option value="pounds">Pounds</option>
                  </ChakraSelect>
                </HStack>
                <FormErrorMessage>{errors.volume?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.area}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Area Treated *
                </FormLabel>
                <HStack spacing={2}>
                  <Input
                    flex={2}
                    ms="4px"
                    borderRadius="15px"
                    type="number"
                    step="0.1"
                    placeholder="2.0"
                    mb="24px"
                    {...register('area')}
                  />
                  <ChakraSelect
                    flex={1}
                    height={'40px'}
                    borderRadius={'15px'}
                    mb="24px"
                    {...register('area_unit')}
                  >
                    <option value="hectares">Hectares</option>
                    <option value="acres">Acres</option>
                  </ChakraSelect>
                </HStack>
                <FormErrorMessage>{errors.area?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.concentration}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Concentration/NPK *
                </FormLabel>
                <Input
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="e.g., 16-16-16, 2.5%, 1000 ppm"
                  mb="24px"
                  {...register('concentration')}
                />
                <Text fontSize="xs" color="gray.500" mt="-20px" mb="20px" ml="4px">
                  For fertilizers: NPK ratio (e.g., 16-16-16). For pesticides: concentration (e.g.,
                  2.5%)
                </Text>
                <FormErrorMessage>{errors.concentration?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.way_of_application}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  {intl.formatMessage({ id: 'app.wayOfApplication' })} *
                </FormLabel>
                <ChakraSelect
                  placeholder="Select application method"
                  ml="4px"
                  height={'40px'}
                  borderRadius={'15px'}
                  fontSize={'0.875rem'}
                  mb="24px"
                  {...register('way_of_application')}
                >
                  <option value="broadcast">Broadcast</option>
                  <option value="spray">Spray</option>
                  <option value="foliar">Foliar</option>
                  <option value="drip_irrigation">Drip Irrigation</option>
                  <option value="injection">Injection</option>
                  <option value="banded">Banded</option>
                  <option value="aerial">Aerial Application</option>
                </ChakraSelect>
                <FormErrorMessage>{errors.way_of_application?.message}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Section 3: Environmental Conditions */}
          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <Text fontSize="md" fontWeight="bold" mb={4} color="orange.600">
              <Icon as={FaThermometerHalf} mr={2} />
              Environmental Conditions
              <Badge ml={2} colorScheme="blue" fontSize="xs">
                Improves Carbon Accuracy
              </Badge>
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Weather Conditions
                </FormLabel>
                <Input
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="e.g., calm, dry conditions, 65% humidity"
                  mb="24px"
                  {...register('weather_conditions')}
                />
                <Text fontSize="xs" color="gray.500" mt="-20px" mb="20px" ml="4px">
                  Weather during application affects chemical effectiveness and carbon impact
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Temperature Range
                </FormLabel>
                <Input
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="e.g., 18-25°C or 65-77°F"
                  mb="24px"
                  {...register('temperature_range')}
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Soil Moisture
                </FormLabel>
                <ChakraSelect
                  placeholder="Select soil moisture"
                  ml="4px"
                  height={'40px'}
                  borderRadius={'15px'}
                  fontSize={'0.875rem'}
                  mb="24px"
                  {...register('soil_moisture')}
                >
                  <option value="dry">Dry</option>
                  <option value="moderate">Moderate</option>
                  <option value="moist">Moist</option>
                  <option value="wet">Wet</option>
                </ChakraSelect>
              </FormControl>

              <FormControl>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Wind Speed
                </FormLabel>
                <Input
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="e.g., 5-10 mph, calm"
                  mb="24px"
                  {...register('wind_speed')}
                />
              </FormControl>

              <FormControl>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Application Time
                </FormLabel>
                <ChakraSelect
                  placeholder="Select application time"
                  ml="4px"
                  height={'40px'}
                  borderRadius={'15px'}
                  fontSize={'0.875rem'}
                  mb="24px"
                  {...register('time_period')}
                >
                  <option value="early_morning">Early Morning (6-9 AM)</option>
                  <option value="morning">Morning (9-12 PM)</option>
                  <option value="afternoon">Afternoon (12-3 PM)</option>
                  <option value="evening">Evening (3-6 PM)</option>
                  <option value="night">Night Application</option>
                </ChakraSelect>
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Section 4: Additional Notes */}
          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
              {intl.formatMessage({ id: 'app.observations' })}
            </FormLabel>
            <Textarea
              fontSize="xs"
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="Optional: Additional notes about application conditions, target pests, equipment used, etc."
              mb="24px"
              rows={3}
              {...register('observation')}
            />
          </Box>

          {/* Enhanced Navigation */}
          <Box pt={6} mt={4} borderTop="1px" borderColor="gray.200">
            <HStack justify="space-between">
              <Button
                variant="outline"
                onClick={onPrev}
                leftIcon={<FaChevronLeft />}
                size="md"
                px={6}
                h="42px"
                borderRadius="lg"
                fontWeight="600"
                _hover={{ transform: 'translateY(-1px)' }}
                transition="all 0.3s ease"
              >
                {intl.formatMessage({ id: 'app.previous' }) || 'Previous'}
              </Button>
              <Button
                colorScheme="green"
                type="submit"
                rightIcon={<FaChevronRight />}
                size="md"
                px={6}
                h="42px"
                borderRadius="lg"
                fontWeight="600"
                boxShadow="lg"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-1px)' }}
                transition="all 0.3s ease"
              >
                {intl.formatMessage({ id: 'app.continue' }) || 'Continue'}
              </Button>
            </HStack>
          </Box>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default ChemicalTab;
