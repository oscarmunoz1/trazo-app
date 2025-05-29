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

const soilSchema = object({
  type: string().min(1, 'Soil management event type is required'),
  name: string().min(1, 'Event name is required'),
  soil_ph: string().optional(),
  organic_matter_percentage: string().optional(),
  amendment_type: string().optional(),
  amendment_amount: string().optional(),
  carbon_sequestration_potential: string().optional(),
  observation: string().optional()
});

const SoilManagementTab = ({ onSubmitHandler, onPrev, initialValues = {} }) => {
  const intl = useIntl();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const methods = useForm({
    resolver: zodResolver(soilSchema),
    defaultValues: {
      type: initialValues.type || 'ST',
      name: initialValues.name || '',
      soil_ph: initialValues.soil_ph?.toString() || '',
      organic_matter_percentage: initialValues.organic_matter_percentage?.toString() || '',
      amendment_type: initialValues.amendment_type || '',
      amendment_amount: initialValues.amendment_amount || '',
      carbon_sequestration_potential:
        initialValues.carbon_sequestration_potential?.toString() || '',
      observation: initialValues.observation || ''
    }
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      methods.reset({
        type: initialValues.type || 'ST',
        name: initialValues.name || '',
        soil_ph: initialValues.soil_ph?.toString() || '',
        organic_matter_percentage: initialValues.organic_matter_percentage?.toString() || '',
        amendment_type: initialValues.amendment_type || '',
        amendment_amount: initialValues.amendment_amount || '',
        carbon_sequestration_potential:
          initialValues.carbon_sequestration_potential?.toString() || '',
        observation: initialValues.observation || ''
      });
    }
  }, [initialValues, methods]);

  const { watch } = methods;
  const soilType = watch('type');

  const onSubmit = (data) => {
    // Convert string numbers to proper format
    const processedData = {
      ...data,
      soil_ph: data.soil_ph ? parseFloat(data.soil_ph) : null,
      organic_matter_percentage: data.organic_matter_percentage
        ? parseFloat(data.organic_matter_percentage)
        : null,
      carbon_sequestration_potential: data.carbon_sequestration_potential
        ? parseFloat(data.carbon_sequestration_potential)
        : null
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
            placeholder="e.g., Soil Test, pH Adjustment, Organic Matter Addition"
            isRequired
          />

          {/* Soil Management Event Type */}
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="semibold">
              {intl.formatMessage({ id: 'app.soilManagementEventType' }) ||
                'Soil Management Event Type'}
            </FormLabel>
            <Select {...methods.register('type')} size="md">
              <option value="ST">
                {intl.formatMessage({ id: 'app.soilTest' }) || 'Soil Test'}
              </option>
              <option value="PA">
                {intl.formatMessage({ id: 'app.phAdjustment' }) || 'pH Adjustment'}
              </option>
              <option value="OM">
                {intl.formatMessage({ id: 'app.organicMatter' }) || 'Organic Matter Addition'}
              </option>
              <option value="CC">
                {intl.formatMessage({ id: 'app.coverCrop' }) || 'Cover Crop'}
              </option>
              <option value="TI">{intl.formatMessage({ id: 'app.tillage' }) || 'Tillage'}</option>
              <option value="CO">
                {intl.formatMessage({ id: 'app.composting' }) || 'Composting'}
              </option>
            </Select>
          </FormControl>

          {/* Soil Test Results */}
          {(soilType === 'ST' || soilType === 'PA') && (
            <HStack spacing={4} align="end">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  {intl.formatMessage({ id: 'app.soilPH' }) || 'Soil pH'}
                </FormLabel>
                <NumberInput min={0} max={14} precision={1} step={0.1}>
                  <NumberInputField {...methods.register('soil_ph')} placeholder="7.0" />
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
                    {...methods.register('organic_matter_percentage')}
                    placeholder="3.5"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>
          )}

          {/* Amendment Details */}
          {(soilType === 'PA' || soilType === 'OM' || soilType === 'CO') && (
            <>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  {intl.formatMessage({ id: 'app.amendmentType' }) || 'Amendment Type'}
                </FormLabel>
                <Select {...methods.register('amendment_type')}>
                  <option value="">
                    {intl.formatMessage({ id: 'app.selectAmendmentType' }) ||
                      'Select amendment type'}
                  </option>
                  <option value="compost">
                    {intl.formatMessage({ id: 'app.compost' }) || 'Compost'}
                  </option>
                  <option value="manure">
                    {intl.formatMessage({ id: 'app.manure' }) || 'Manure'}
                  </option>
                  <option value="lime">{intl.formatMessage({ id: 'app.lime' }) || 'Lime'}</option>
                  <option value="sulfur">
                    {intl.formatMessage({ id: 'app.sulfur' }) || 'Sulfur'}
                  </option>
                  <option value="biochar">
                    {intl.formatMessage({ id: 'app.biochar' }) || 'Biochar'}
                  </option>
                  <option value="gypsum">
                    {intl.formatMessage({ id: 'app.gypsum' }) || 'Gypsum'}
                  </option>
                  <option value="other">
                    {intl.formatMessage({ id: 'app.other' }) || 'Other'}
                  </option>
                </Select>
              </FormControl>

              <FormInput
                label={intl.formatMessage({ id: 'app.amendmentAmount' }) || 'Amendment Amount'}
                name="amendment_amount"
                placeholder="e.g., 5 tons/hectare"
              />
            </>
          )}

          {/* Cover Crop Details */}
          {soilType === 'CC' && (
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold">
                {intl.formatMessage({ id: 'app.carbonSequestrationPotential' }) ||
                  'Carbon Sequestration Potential (kg CO2e/ha)'}
              </FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField
                  {...methods.register('carbon_sequestration_potential')}
                  placeholder="0.00"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
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

export default SoilManagementTab;
