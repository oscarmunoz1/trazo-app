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
  Checkbox,
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, number, boolean } from 'zod';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FormInput from 'components/Forms/FormInput';
import { useIntl } from 'react-intl';

const pestSchema = object({
  type: string().min(1, 'Pest management event type is required'),
  name: string().min(1, 'Event name is required'),
  pest_species: string().optional(),
  pest_pressure_level: string().optional(),
  beneficial_species: string().optional(),
  release_quantity: string().optional(),
  trap_count: string().optional(),
  damage_percentage: string().optional(),
  action_threshold_met: boolean().optional(),
  imp_strategy: string().optional(),
  observation: string().optional()
});

const PestManagementTab = ({ onSubmitHandler, onPrev, initialValues = {} }) => {
  const intl = useIntl();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const methods = useForm({
    resolver: zodResolver(pestSchema),
    defaultValues: {
      type: initialValues.type || 'SC',
      name: initialValues.name || '',
      pest_species: initialValues.pest_species || '',
      pest_pressure_level: initialValues.pest_pressure_level || 'Low',
      beneficial_species: initialValues.beneficial_species || '',
      release_quantity: initialValues.release_quantity || '',
      trap_count: initialValues.trap_count?.toString() || '',
      damage_percentage: initialValues.damage_percentage?.toString() || '',
      action_threshold_met: initialValues.action_threshold_met || false,
      imp_strategy: initialValues.imp_strategy || '',
      observation: initialValues.observation || ''
    }
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      methods.reset({
        type: initialValues.type || 'SC',
        name: initialValues.name || '',
        pest_species: initialValues.pest_species || '',
        pest_pressure_level: initialValues.pest_pressure_level || 'Low',
        beneficial_species: initialValues.beneficial_species || '',
        release_quantity: initialValues.release_quantity || '',
        trap_count: initialValues.trap_count?.toString() || '',
        damage_percentage: initialValues.damage_percentage?.toString() || '',
        action_threshold_met: initialValues.action_threshold_met || false,
        imp_strategy: initialValues.imp_strategy || '',
        observation: initialValues.observation || ''
      });
    }
  }, [initialValues, methods]);

  const { watch } = methods;
  const pestType = watch('type');

  const onSubmit = (data) => {
    // Convert string numbers to proper format
    const processedData = {
      ...data,
      trap_count: data.trap_count ? parseInt(data.trap_count) : null,
      damage_percentage: data.damage_percentage ? parseFloat(data.damage_percentage) : null
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
            placeholder="e.g., Pest Scouting, Beneficial Release"
            isRequired
          />

          {/* Pest Management Event Type */}
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="semibold">
              {intl.formatMessage({ id: 'app.pestManagementEventType' }) ||
                'Pest Management Event Type'}
            </FormLabel>
            <Select {...methods.register('type')} size="md">
              <option value="SC">{intl.formatMessage({ id: 'app.scouting' }) || 'Scouting'}</option>
              <option value="BR">
                {intl.formatMessage({ id: 'app.beneficialRelease' }) || 'Beneficial Release'}
              </option>
              <option value="TM">
                {intl.formatMessage({ id: 'app.trapMonitoring' }) || 'Trap Monitoring'}
              </option>
              <option value="PI">
                {intl.formatMessage({ id: 'app.pestIdentification' }) || 'Pest Identification'}
              </option>
              <option value="TA">
                {intl.formatMessage({ id: 'app.thresholdAssessment' }) || 'Threshold Assessment'}
              </option>
              <option value="IP">
                {intl.formatMessage({ id: 'app.impImplementation' }) || 'IPM Implementation'}
              </option>
            </Select>
          </FormControl>

          {/* Pest Details */}
          {(pestType === 'SC' || pestType === 'PI' || pestType === 'TA') && (
            <>
              <FormInput
                label={intl.formatMessage({ id: 'app.pestSpecies' }) || 'Pest Species'}
                name="pest_species"
                placeholder="e.g., Aphids, Spider mites, Thrips"
              />

              <HStack spacing={4} align="end">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    {intl.formatMessage({ id: 'app.pestPressureLevel' }) || 'Pest Pressure Level'}
                  </FormLabel>
                  <Select {...methods.register('pest_pressure_level')}>
                    <option value="Low">{intl.formatMessage({ id: 'app.low' }) || 'Low'}</option>
                    <option value="Medium">
                      {intl.formatMessage({ id: 'app.medium' }) || 'Medium'}
                    </option>
                    <option value="High">{intl.formatMessage({ id: 'app.high' }) || 'High'}</option>
                    <option value="Critical">
                      {intl.formatMessage({ id: 'app.critical' }) || 'Critical'}
                    </option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    {intl.formatMessage({ id: 'app.damagePercentage' }) || 'Damage Percentage (%)'}
                  </FormLabel>
                  <NumberInput min={0} max={100} precision={1}>
                    <NumberInputField
                      {...methods.register('damage_percentage')}
                      placeholder="0.0"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>
            </>
          )}

          {/* Beneficial Release Details */}
          {pestType === 'BR' && (
            <>
              <FormInput
                label={intl.formatMessage({ id: 'app.beneficialSpecies' }) || 'Beneficial Species'}
                name="beneficial_species"
                placeholder="e.g., Ladybugs, Lacewings, Predatory mites"
              />

              <FormInput
                label={intl.formatMessage({ id: 'app.releaseQuantity' }) || 'Release Quantity'}
                name="release_quantity"
                placeholder="e.g., 1000 individuals per hectare"
              />
            </>
          )}

          {/* Trap Monitoring Details */}
          {pestType === 'TM' && (
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {intl.formatMessage({ id: 'app.trapCount' }) || 'Number of Traps'}
              </FormLabel>
              <NumberInput min={0}>
                <NumberInputField {...methods.register('trap_count')} placeholder="0" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          )}

          {/* Threshold Assessment */}
          {pestType === 'TA' && (
            <FormControl>
              <Checkbox {...methods.register('action_threshold_met')}>
                {intl.formatMessage({ id: 'app.actionThresholdMet' }) ||
                  'Action threshold has been met'}
              </Checkbox>
            </FormControl>
          )}

          {/* IPM Strategy */}
          {pestType === 'IP' && (
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {intl.formatMessage({ id: 'app.impStrategy' }) || 'IPM Strategy'}
              </FormLabel>
              <Textarea
                {...methods.register('imp_strategy')}
                placeholder={
                  intl.formatMessage({ id: 'app.enterImpStrategy' }) ||
                  'Describe the integrated pest management strategy implemented...'
                }
                rows={4}
                resize="vertical"
              />
            </FormControl>
          )}

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

export default PestManagementTab;
