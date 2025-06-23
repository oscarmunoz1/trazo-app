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
  InputGroup,
  InputRightAddon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { number, object, string } from 'zod';

import { FaPlus } from 'react-icons/fa';
import FormInput from 'components/Forms/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';

// Enhanced form schema with proper validation to prevent "Unknown" values
const formSchemaMainInfo = object({
  type: string().min(1, 'Production type is required'),
  duration: string().optional(),
  area_covered: string().optional(),
  equipment_used: string().optional(),
  observation: string().optional()
});

// Intelligent defaults based on production type and crop
const getProductionDefaults = (productionType, cropType = 'general') => {
  const defaults = {
    PL: {
      // Planting
      duration: '4 hours',
      area_covered: '1.0 hectares',
      equipment_used: 'Tractor, Planter',
      observation: 'Planting completed under optimal conditions'
    },
    HA: {
      // Harvesting
      duration: '6 hours',
      area_covered: '1.5 hectares',
      equipment_used: 'Harvester, Transport truck',
      observation: 'Harvest completed, good yield quality'
    },
    IR: {
      // Irrigation
      duration: '2 hours',
      area_covered: '2.0 hectares',
      equipment_used: 'Irrigation system, Pumps',
      observation: 'Irrigation cycle completed'
    },
    PR: {
      // Pruning
      duration: '3 hours',
      area_covered: '0.5 hectares',
      equipment_used: 'Pruning shears, Ladder',
      observation: 'Pruning completed for optimal growth'
    }
  };

  // Crop-specific adjustments
  const cropAdjustments = {
    citrus: { durationMultiplier: 1.5, areaMultiplier: 2.0 },
    corn: { durationMultiplier: 1.2, areaMultiplier: 3.0 },
    tomato: { durationMultiplier: 0.8, areaMultiplier: 0.3 },
    lettuce: { durationMultiplier: 0.6, areaMultiplier: 0.2 }
  };

  const baseDefaults = defaults[productionType] || defaults.PL;
  const adjustment = cropAdjustments[cropType?.toLowerCase()] || {
    durationMultiplier: 1,
    areaMultiplier: 1
  };

  return {
    ...baseDefaults,
    duration: `${Math.round(
      parseFloat(baseDefaults.duration) * adjustment.durationMultiplier
    )} hours`,
    area_covered: `${(parseFloat(baseDefaults.area_covered) * adjustment.areaMultiplier).toFixed(
      1
    )} hectares`
  };
};

const ProductionTab = ({ onSubmitHandler, onPrev, initialValues = {}, cropType = 'general' }) => {
  const intl = useIntl();
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.300', 'gray.700');
  const [selectedProductionType, setSelectedProductionType] = useState('');

  // Map API format to form format
  const mapApiTypeToFormType = (apiType) => {
    if (!apiType) return '';

    const typeMapping = {
      'event.production.planting': 'PL',
      'event.production.harvesting': 'HA',
      'event.production.irrigation': 'IR',
      'event.production.pruning': 'PR'
    };

    return typeMapping[apiType] || apiType;
  };

  const formType = mapApiTypeToFormType(initialValues.type);

  // Get intelligent defaults for the current production type
  const intelligentDefaults = getProductionDefaults(formType || 'PL', cropType);

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo),
    defaultValues: {
      type: formType || '',
      duration: initialValues.duration || intelligentDefaults.duration,
      area_covered: initialValues.area_covered || intelligentDefaults.area_covered,
      equipment_used: initialValues.equipment_used || intelligentDefaults.equipment_used,
      observation: initialValues.observation || intelligentDefaults.observation
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

  // Watch the production type to update defaults
  const watchedType = watch('type');

  // Update defaults when production type changes
  useEffect(() => {
    if (watchedType && watchedType !== selectedProductionType) {
      setSelectedProductionType(watchedType);
      const newDefaults = getProductionDefaults(watchedType, cropType);

      // Only update if current values are empty or default
      const currentDuration = watch('duration');
      const currentArea = watch('area_covered');
      const currentEquipment = watch('equipment_used');
      const currentObservation = watch('observation');

      if (!currentDuration || currentDuration === intelligentDefaults.duration) {
        setValue('duration', newDefaults.duration);
      }
      if (!currentArea || currentArea === intelligentDefaults.area_covered) {
        setValue('area_covered', newDefaults.area_covered);
      }
      if (!currentEquipment || currentEquipment === intelligentDefaults.equipment_used) {
        setValue('equipment_used', newDefaults.equipment_used);
      }
      if (!currentObservation || currentObservation === intelligentDefaults.observation) {
        setValue('observation', newDefaults.observation);
      }
    }
  }, [watchedType, selectedProductionType, cropType, setValue, watch]);

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      const mappedType = mapApiTypeToFormType(initialValues.type);
      const defaults = getProductionDefaults(mappedType || 'PL', cropType);

      mainInfoMethods.reset({
        type: mappedType || '',
        duration: initialValues.duration || defaults.duration,
        area_covered: initialValues.area_covered || defaults.area_covered,
        equipment_used: initialValues.equipment_used || defaults.equipment_used,
        observation: initialValues.observation || defaults.observation
      });
    }
  }, [initialValues, mainInfoMethods, cropType]);

  // Enhanced submit handler with validation
  const handleEnhancedSubmit = (data) => {
    // Validate that no field contains "Unknown" or empty values for required fields
    const requiredFields = ['type'];
    const optionalFields = ['duration', 'area_covered', 'equipment_used', 'observation'];

    const invalidFields = requiredFields.filter((field) => {
      const value = data[field]?.toString().toLowerCase();
      return (
        !value || value === 'unknown' || value === 'n/a' || value === 'na' || value.trim() === ''
      );
    });

    if (invalidFields.length > 0) {
      // Auto-fill missing fields with intelligent defaults
      const defaults = getProductionDefaults(data.type || 'PL', cropType);
      invalidFields.forEach((field) => {
        if (defaults[field]) {
          data[field] = defaults[field];
          setValue(field, defaults[field]);
        }
      });
    }

    // Auto-fill optional fields if they're empty to prevent "Unknown" values
    optionalFields.forEach((field) => {
      const value = data[field]?.toString().toLowerCase();
      if (
        !value ||
        value === 'unknown' ||
        value === 'n/a' ||
        value === 'na' ||
        value.trim() === ''
      ) {
        const defaults = getProductionDefaults(data.type || 'PL', cropType);
        if (defaults[field]) {
          data[field] = defaults[field];
        }
      }
    });

    // Call the original submit handler
    onSubmitHandler(data);
  };

  console.log('initialValues', initialValues);
  console.log('formType', formType);

  return (
    <FormProvider {...mainInfoMethods}>
      <form onSubmit={mainInfoSubmit(handleEnhancedSubmit)} style={{ width: '100%' }}>
        <Flex direction="column" w="100%">
          {/* Information Alert */}
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Production Event Details</AlertTitle>
              <AlertDescription fontSize="xs">
                Provide detailed information about your production activities for accurate carbon
                tracking and operational insights.
              </AlertDescription>
            </Box>
          </Alert>

          <FormControl isInvalid={!!errors.type} mb={4}>
            <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
              {intl.formatMessage({ id: 'app.type' })} *
            </FormLabel>
            <ChakraSelect
              placeholder={intl.formatMessage({ id: 'app.selectOption' })}
              placeholderTextColor="red"
              css={{ '&::placeholder': { color: 'red' } }}
              mb={errors.type ? '12px' : '24px'}
              borderColor={errors.type && 'red.500'}
              boxShadow={errors.type && '0 0 0 1px red.500'}
              borderWidth={errors.type && '2px'}
              ml="4px"
              height={'40px'}
              borderRadius={'15px'}
              fontSize={'0.875rem'}
              mt="4px"
              defaultValue={formType || ''}
              {...register('type')}
            >
              <option value="PL">{intl.formatMessage({ id: 'app.planting' })}</option>
              <option value="HA">{intl.formatMessage({ id: 'app.harvesting' })}</option>
              <option value="IR">{intl.formatMessage({ id: 'app.irrigation' })}</option>
              <option value="PR">{intl.formatMessage({ id: 'app.pruning' })}</option>
            </ChakraSelect>
            <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
          </FormControl>

          <Flex gap={'20px'} mb={4}>
            <FormControl flex={1}>
              <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                Duration
              </FormLabel>
              <InputGroup>
                <Input
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="e.g., 4 hours, 2 days"
                  {...register('duration')}
                />
                <InputRightAddon children="hrs" borderRadius="15px" />
              </InputGroup>
              <Text fontSize="xs" color="gray.500" mt={1} ml="4px">
                How long did this activity take?
              </Text>
            </FormControl>

            <FormControl flex={1}>
              <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                Area Covered
              </FormLabel>
              <InputGroup>
                <Input
                  ms="4px"
                  borderRadius="15px"
                  type="text"
                  placeholder="e.g., 1.5 hectares, 3 acres"
                  {...register('area_covered')}
                />
                <InputRightAddon children="ha" borderRadius="15px" />
              </InputGroup>
              <Text fontSize="xs" color="gray.500" mt={1} ml="4px">
                Area where activity was performed
              </Text>
            </FormControl>
          </Flex>

          <FormControl mb={4}>
            <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
              Equipment Used
            </FormLabel>
            <Input
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="e.g., Tractor, Harvester, Irrigation system"
              {...register('equipment_used')}
            />
            <Text fontSize="xs" color="gray.500" mt={1} ml="4px">
              List the main equipment or tools used
            </Text>
          </FormControl>

          <FormControl mb={6}>
            <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
              {intl.formatMessage({ id: 'app.observations' })}
            </FormLabel>
            <Textarea
              fontSize="sm"
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder="Detailed notes about conditions, results, challenges, or observations during this production activity"
              mb="24px"
              size="lg"
              name="observation"
              defaultValue={initialValues.observation || ''}
              {...register('observation')}
            />
            <Text fontSize="xs" color="gray.500" mt="-20px" mb="20px" ml="4px">
              Include details about weather conditions, yield quality, equipment performance, etc.
            </Text>
          </FormControl>

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

export default ProductionTab;
