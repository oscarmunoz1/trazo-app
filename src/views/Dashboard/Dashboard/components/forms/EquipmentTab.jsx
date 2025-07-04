import React, { useEffect } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, number } from 'zod';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FormInput from 'components/Forms/FormInput';
import { useIntl } from 'react-intl';

const equipmentSchema = object({
  type: string().min(1, 'Equipment event type is required'),
  name: string().min(1, 'Event name is required'),
  equipment_name: string().optional(),
  fuel_amount: string().optional(),
  fuel_type: string().optional(),
  maintenance_cost: string().optional(),
  hours_used: string().optional(),
  area_covered: string().optional(),
  observation: string().optional()
});

const EquipmentTab = ({ onSubmitHandler, onPrev, initialValues = {} }) => {
  const intl = useIntl();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const methods = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      type: initialValues.type || 'MN',
      name: initialValues.name || '',
      equipment_name: initialValues.equipment_name || '',
      fuel_amount: initialValues.fuel_amount?.toString() || '',
      fuel_type: initialValues.fuel_type || 'diesel',
      maintenance_cost: initialValues.maintenance_cost?.toString() || '',
      hours_used: initialValues.hours_used?.toString() || '',
      area_covered: initialValues.area_covered || '',
      observation: initialValues.observation || ''
    }
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      methods.reset({
        type: initialValues.type || 'MN',
        name: initialValues.name || '',
        equipment_name: initialValues.equipment_name || '',
        fuel_amount: initialValues.fuel_amount?.toString() || '',
        fuel_type: initialValues.fuel_type || 'diesel',
        maintenance_cost: initialValues.maintenance_cost?.toString() || '',
        hours_used: initialValues.hours_used?.toString() || '',
        area_covered: initialValues.area_covered || '',
        observation: initialValues.observation || ''
      });
    }
  }, [initialValues, methods]);

  const { watch } = methods;
  const equipmentType = watch('type');

  const onSubmit = (data) => {
    console.log('Raw form data:', data); // Debug log

    // Helper function to safely parse numeric values
    const parseNumericField = (value) => {
      console.log('Parsing value:', value, 'Type:', typeof value); // Debug log

      // Handle various input types
      if (value === null || value === undefined) {
        return null;
      }

      // Convert to string and trim
      const stringValue = String(value).trim();

      // If empty string, return null
      if (stringValue === '') {
        return null;
      }

      // Try to parse as float
      const parsed = parseFloat(stringValue);

      // If parsing failed (NaN), return null
      if (isNaN(parsed)) {
        console.warn('Failed to parse numeric value:', value);
        return null;
      }

      return parsed;
    };

    // Convert string numbers to proper format and only include relevant fields
    const processedData = {
      ...data,
      // Only include fuel-related fields for Fuel Consumption events
      fuel_amount: equipmentType === 'FC' ? parseNumericField(data.fuel_amount) : undefined,
      fuel_type: equipmentType === 'FC' ? data.fuel_type : undefined,

      // Only include maintenance cost for relevant event types
      maintenance_cost: ['MN', 'RE', 'BD'].includes(equipmentType)
        ? parseNumericField(data.maintenance_cost)
        : undefined,

      // Hours used is optional for all types
      hours_used: parseNumericField(data.hours_used)
    };

    console.log('Processed data before cleanup:', processedData); // Debug log

    // Remove undefined fields to avoid sending them to the backend
    Object.keys(processedData).forEach((key) => {
      if (processedData[key] === undefined) {
        delete processedData[key];
      }
    });

    console.log('Final processed data:', processedData); // Debug log
    onSubmitHandler(processedData);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing={6} align="stretch">
          {/* Event Name */}
          <FormInput
            label={intl.formatMessage({ id: 'app.eventName' }) || 'Event Name'}
            name="name"
            placeholder="e.g., Tractor Maintenance, Fuel Consumption"
            isRequired
          />

          {/* Equipment Event Type */}
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="semibold">
              {intl.formatMessage({ id: 'app.equipmentEventType' }) || 'Equipment Event Type'}
            </FormLabel>
            <Select {...methods.register('type')} size="md">
              <option value="MN">
                {intl.formatMessage({ id: 'app.maintenance' }) || 'Maintenance'}
              </option>
              <option value="RE">{intl.formatMessage({ id: 'app.repair' }) || 'Repair'}</option>
              <option value="CA">
                {intl.formatMessage({ id: 'app.calibration' }) || 'Calibration'}
              </option>
              <option value="FC">
                {intl.formatMessage({ id: 'app.fuelConsumption' }) || 'Fuel Consumption'}
              </option>
              <option value="BD">
                {intl.formatMessage({ id: 'app.breakdown' }) || 'Breakdown'}
              </option>
              <option value="EI">
                {intl.formatMessage({ id: 'app.inspection' }) || 'Inspection'}
              </option>
            </Select>
          </FormControl>

          {/* Equipment Name */}
          <FormInput
            label={intl.formatMessage({ id: 'app.equipmentName' }) || 'Equipment Name'}
            name="equipment_name"
            placeholder="e.g., John Deere Tractor Model X"
          />

          {/* Fuel-specific fields */}
          {equipmentType === 'FC' && (
            <>
              <HStack spacing={4} align="end">
                <FormControl flex="2">
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    {intl.formatMessage({ id: 'app.fuelAmount' }) || 'Fuel Amount (L)'}
                  </FormLabel>
                  <NumberInput min={0} precision={2} step={0.1}>
                    <NumberInputField {...methods.register('fuel_amount')} placeholder="0.0" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl flex="2">
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    {intl.formatMessage({ id: 'app.fuelType' }) || 'Fuel Type'}
                  </FormLabel>
                  <Select {...methods.register('fuel_type')}>
                    <option value="diesel">
                      {intl.formatMessage({ id: 'app.diesel' }) || 'Diesel'}
                    </option>
                    <option value="gasoline">
                      {intl.formatMessage({ id: 'app.gasoline' }) || 'Gasoline'}
                    </option>
                    <option value="natural_gas">
                      {intl.formatMessage({ id: 'app.naturalGas' }) || 'Natural Gas'}
                    </option>
                    <option value="biodiesel">
                      {intl.formatMessage({ id: 'app.biodiesel' }) || 'Biodiesel'}
                    </option>
                  </Select>
                </FormControl>
              </HStack>
            </>
          )}

          {/* Maintenance/Repair cost */}
          {(equipmentType === 'MN' || equipmentType === 'RE' || equipmentType === 'BD') && (
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {intl.formatMessage({ id: 'app.maintenanceCost' }) || 'Cost ($)'}
              </FormLabel>
              <NumberInput min={0} precision={2} step={0.01}>
                <NumberInputField {...methods.register('maintenance_cost')} placeholder="0.00" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          )}

          {/* Hours Used */}
          <HStack spacing={4} align="end">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {intl.formatMessage({ id: 'app.hoursUsed' }) || 'Hours Used'}
              </FormLabel>
              <NumberInput min={0} precision={1} step={0.1}>
                <NumberInputField {...methods.register('hours_used')} placeholder="0.0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormInput
              label={intl.formatMessage({ id: 'app.areaCovered' }) || 'Area Covered'}
              name="area_covered"
              placeholder="e.g., 10 hectares"
            />
          </HStack>

          {/* Observations */}
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="semibold">
              {intl.formatMessage({ id: 'app.observations' }) || 'Observations'}
            </FormLabel>
            <Textarea
              {...methods.register('observation')}
              placeholder={
                intl.formatMessage({ id: 'app.enterObservations' }) ||
                'Enter any additional observations...'
              }
              rows={3}
              resize="vertical"
            />
          </FormControl>

          {/* Action Buttons */}
          <HStack justify="space-between" pt={6} mt={4} borderTop="1px" borderColor={borderColor}>
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
        </VStack>
      </form>
    </FormProvider>
  );
};

export default EquipmentTab;
