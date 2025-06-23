import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select as ChakraSelect,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  SimpleGrid,
  Badge,
  Tooltip,
  FormErrorMessage
} from '@chakra-ui/react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSeedling,
  FaRulerHorizontal,
  FaThermometerHalf,
  FaInfoCircle
} from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, number } from 'zod';
import { FaPlus } from 'react-icons/fa';
import FormInput from 'components/Forms/FormInput';
import { useIntl } from 'react-intl';

const formSchemaSoilManagement = object({
  type: string().min(1, 'Soil management type is required'),
  area: string().min(1, 'Area is required'),
  area_unit: string().min(1, 'Area unit is required'),
  soil_ph: string().optional(),
  organic_matter_percentage: string().optional(),
  soil_texture: string().optional(),
  soil_moisture: string().optional(),
  depth: string().optional(),
  depth_unit: string().optional(),
  equipment_used: string().optional(),
  weather_conditions: string().optional(),
  temperature_range: string().optional(),
  observation: string().optional()
});

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

const getSoilManagementDefaults = (soilType) => {
  const defaults = {
    ST: {
      area: '2.0',
      area_unit: 'hectares',
      soil_ph: '6.5',
      organic_matter_percentage: '3.5',
      soil_texture: 'loam',
      soil_moisture: 'moderate',
      depth: '30',
      depth_unit: 'cm',
      equipment_used: 'soil auger',
      weather_conditions: 'dry conditions',
      temperature_range: '20-25°C'
    },
    PA: {
      area: '2.0',
      area_unit: 'hectares',
      soil_ph: '6.8',
      organic_matter_percentage: '4.0',
      soil_texture: 'clay loam',
      soil_moisture: 'moist',
      depth: '20',
      depth_unit: 'cm',
      equipment_used: 'tractor with disc harrow',
      weather_conditions: 'optimal planting conditions',
      temperature_range: '18-22°C'
    },
    TI: {
      area: '2.0',
      area_unit: 'hectares',
      soil_ph: '7.0',
      organic_matter_percentage: '3.0',
      soil_texture: 'sandy loam',
      soil_moisture: 'moderate',
      depth: '25',
      depth_unit: 'cm',
      equipment_used: 'cultivator',
      weather_conditions: 'dry, workable conditions',
      temperature_range: '15-25°C'
    }
  };

  return defaults[soilType] || defaults.ST;
};

const SoilManagementTab = ({
  onSubmitHandler,
  onPrev,
  initialValues = {},
  cropType = 'citrus'
}) => {
  const intl = useIntl();
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.300', 'gray.700');
  const [selectedSoilType, setSelectedSoilType] = useState('');

  const mapApiTypeToFormType = (apiType) => {
    if (!apiType) return '';

    const typeMapping = {
      'event.soil.testing': 'ST',
      'event.soil.planting': 'PA',
      'event.soil.tillage': 'TI'
    };

    return typeMapping[apiType] || apiType;
  };

  const formType = mapApiTypeToFormType(initialValues.type);

  const intelligentDefaults = getSoilManagementDefaults(formType || 'ST');

  const methods = useForm({
    resolver: zodResolver(formSchemaSoilManagement),
    defaultValues: {
      type: formType || '',
      area: initialValues.area || intelligentDefaults.area,
      area_unit: initialValues.area_unit || intelligentDefaults.area_unit,
      soil_ph: initialValues.soil_ph || intelligentDefaults.soil_ph,
      organic_matter_percentage:
        initialValues.organic_matter_percentage || intelligentDefaults.organic_matter_percentage,
      soil_texture: initialValues.soil_texture || intelligentDefaults.soil_texture,
      soil_moisture: initialValues.soil_moisture || intelligentDefaults.soil_moisture,
      depth: initialValues.depth || intelligentDefaults.depth,
      depth_unit: initialValues.depth_unit || intelligentDefaults.depth_unit,
      equipment_used: initialValues.equipment_used || intelligentDefaults.equipment_used,
      weather_conditions:
        initialValues.weather_conditions || intelligentDefaults.weather_conditions,
      temperature_range: initialValues.temperature_range || intelligentDefaults.temperature_range,
      observation: initialValues.observation || ''
    }
  });

  const {
    reset,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch
  } = methods;

  const watchedType = watch('type');

  useEffect(() => {
    if (watchedType && watchedType !== selectedSoilType) {
      setSelectedSoilType(watchedType);

      const newDefaults = getSoilManagementDefaults(watchedType);

      Object.keys(newDefaults).forEach((field) => {
        const currentValue = watch(field);
        if (!currentValue || currentValue === intelligentDefaults[field]) {
          setValue(field, newDefaults[field]);
        }
      });
    }
  }, [watchedType, selectedSoilType, setValue, watch]);

  const handleEnhancedSubmit = (data) => {
    const requiredFields = ['type', 'area', 'area_unit'];

    const invalidFields = requiredFields.filter((field) => {
      const value = data[field]?.toString().toLowerCase();
      return (
        !value || value === 'unknown' || value === 'n/a' || value === 'na' || value.trim() === ''
      );
    });

    if (invalidFields.length > 0) {
      const defaults = getSoilManagementDefaults(data.type);
      invalidFields.forEach((field) => {
        if (defaults[field]) {
          data[field] = defaults[field];
          setValue(field, defaults[field]);
        }
      });
    }

    // Note: Crop type is inherited from production context via event.history.crop_type.name
    // USDA API mapping happens in backend based on production's crop type

    onSubmitHandler(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleEnhancedSubmit)} style={{ width: '100%' }}>
        <Flex direction="column" w="100%">
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">USDA Compliance & Soil Carbon Calculation</AlertTitle>
              <AlertDescription fontSize="xs">
                All fields marked with * are required for accurate soil carbon calculations and USDA
                compliance verification. Smart defaults are provided based on your selections.
              </AlertDescription>
            </Box>
          </Alert>

          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <Text fontSize="md" fontWeight="bold" mb={4} color="green.600">
              <Icon as={FaSeedling} mr={2} />
              Soil Management & Crop Information
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.type}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  {intl.formatMessage({ id: 'app.soilManagementType' }) || 'Soil Management Type'} *
                </FormLabel>
                <ChakraSelect
                  placeholder="Select soil management type"
                  ml="4px"
                  height={'40px'}
                  borderRadius={'15px'}
                  fontSize={'0.875rem'}
                  mb="24px"
                  {...register('type')}
                >
                  <option value="ST">Soil Testing</option>
                  <option value="PA">Planting/Amendment</option>
                  <option value="TI">Tillage</option>
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
          </Box>

          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <Text fontSize="md" fontWeight="bold" mb={4} color="blue.600">
              <Icon as={FaRulerHorizontal} mr={2} />
              Area and Physical Measurements
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.area}>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Area Managed *
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

              <FormControl>
                <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                  Working Depth
                </FormLabel>
                <HStack spacing={2}>
                  <Input
                    flex={2}
                    ms="4px"
                    borderRadius="15px"
                    type="number"
                    step="1"
                    placeholder="30"
                    mb="24px"
                    {...register('depth')}
                  />
                  <ChakraSelect
                    flex={1}
                    height={'40px'}
                    borderRadius={'15px'}
                    mb="24px"
                    {...register('depth_unit')}
                  >
                    <option value="cm">Centimeters</option>
                    <option value="inches">Inches</option>
                  </ChakraSelect>
                </HStack>
              </FormControl>
            </SimpleGrid>
          </Box>

          {(watch('type') === 'ST' || watch('type') === 'PA') && (
            <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
              <Text fontSize="md" fontWeight="bold" mb={4} color="orange.600">
                <Icon as={FaThermometerHalf} mr={2} />
                Soil Properties
                <Badge ml={2} colorScheme="green" fontSize="xs">
                  Improves Carbon Accuracy
                </Badge>
              </Text>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    {intl.formatMessage({ id: 'app.soilPH' }) || 'Soil pH'}
                  </FormLabel>
                  <NumberInput min={0} max={14} precision={1} step={0.1}>
                    <NumberInputField {...register('soil_ph')} placeholder="6.5" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    {intl.formatMessage({ id: 'app.organicMatterPercentage' }) ||
                      'Organic Matter (%)'}
                  </FormLabel>
                  <NumberInput min={0} max={100} precision={1} step={0.1}>
                    <NumberInputField
                      {...register('organic_matter_percentage')}
                      placeholder="3.5"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Soil Texture
                  </FormLabel>
                  <ChakraSelect
                    placeholder="Select soil texture"
                    height={'40px'}
                    borderRadius={'15px'}
                    fontSize={'0.875rem'}
                    {...register('soil_texture')}
                  >
                    <option value="clay">Clay</option>
                    <option value="clay_loam">Clay Loam</option>
                    <option value="loam">Loam</option>
                    <option value="sandy_loam">Sandy Loam</option>
                    <option value="sand">Sand</option>
                    <option value="silt">Silt</option>
                    <option value="silt_loam">Silt Loam</option>
                  </ChakraSelect>
                </FormControl>
              </SimpleGrid>
            </Box>
          )}

          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <Text fontSize="md" fontWeight="bold" mb={4} color="purple.600">
              <Icon as={FaThermometerHalf} mr={2} />
              Environmental Conditions & Equipment
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
                  placeholder="e.g., dry, workable conditions"
                  mb="24px"
                  {...register('weather_conditions')}
                />
                <Text fontSize="xs" color="gray.500" mt="-20px" mb="20px" ml="4px">
                  Weather during soil management affects carbon impact
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

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                  Equipment Used
                </FormLabel>
                <Input
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="e.g., tractor with disc harrow, soil auger"
                  mb="24px"
                  {...register('equipment_used')}
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
            <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
              {intl.formatMessage({ id: 'app.observations' }) || 'Observations'}
            </FormLabel>
            <Textarea
              fontSize="xs"
              ms="4px"
              borderRadius="15px"
              placeholder="Optional: Additional notes about soil conditions, management goals, etc."
              mb="24px"
              rows={3}
              {...register('observation')}
            />
          </Box>

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

export default SoilManagementTab;
