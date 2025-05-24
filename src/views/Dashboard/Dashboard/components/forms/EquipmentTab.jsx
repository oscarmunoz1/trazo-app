import React from 'react';
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

const EquipmentTab = ({ onSubmitHandler, onPrev }) => {
  const intl = useIntl();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const methods = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      type: 'MA',
      name: '',
      equipment_name: '',
      fuel_amount: '',
      fuel_type: 'diesel',
      maintenance_cost: '',
      hours_used: '',
      area_covered: '',
      observation: ''
    }
  });

  const { watch } = methods;
  const equipmentType = watch('type');

  const onSubmit = (data) => {
    // Convert string numbers to proper format
    const processedData = {
      ...data,
      fuel_amount: data.fuel_amount ? parseFloat(data.fuel_amount) : null,
      maintenance_cost: data.maintenance_cost ? parseFloat(data.maintenance_cost) : null,
      hours_used: data.hours_used ? parseFloat(data.hours_used) : null
    };
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
              <option value="MA">
                {intl.formatMessage({ id: 'app.maintenance' }) || 'Maintenance'}
              </option>
              <option value="RE">{intl.formatMessage({ id: 'app.repair' }) || 'Repair'}</option>
              <option value="CA">
                {intl.formatMessage({ id: 'app.calibration' }) || 'Calibration'}
              </option>
              <option value="FC">
                {intl.formatMessage({ id: 'app.fuelConsumption' }) || 'Fuel Consumption'}
              </option>
              <option value="BR">
                {intl.formatMessage({ id: 'app.breakdown' }) || 'Breakdown'}
              </option>
              <option value="IN">
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
                  <NumberInput min={0}>
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
          {(equipmentType === 'MA' || equipmentType === 'RE' || equipmentType === 'BR') && (
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {intl.formatMessage({ id: 'app.maintenanceCost' }) || 'Cost ($)'}
              </FormLabel>
              <NumberInput min={0}>
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
              <NumberInput min={0} precision={1}>
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
              transition="all 0.3s ease">
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
              transition="all 0.3s ease">
              {intl.formatMessage({ id: 'app.continue' }) || 'Continue'}
            </Button>
          </HStack>
        </VStack>
      </form>
    </FormProvider>
  );
};

export default EquipmentTab;
