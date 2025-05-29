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

const businessSchema = object({
  type: string().min(1, 'Business event type is required'),
  name: string().min(1, 'Event name is required'),
  revenue_amount: string().optional(),
  quantity_sold: string().optional(),
  buyer_name: string().optional(),
  certification_type: string().optional(),
  inspector_name: string().optional(),
  compliance_status: string().optional(),
  carbon_credits_earned: string().optional(),
  observation: string().optional()
});

const BusinessTab = ({ onSubmitHandler, onPrev, initialValues = {} }) => {
  const intl = useIntl();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const methods = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      type: initialValues.type || 'HS',
      name: initialValues.name || '',
      revenue_amount: initialValues.revenue_amount?.toString() || '',
      quantity_sold: initialValues.quantity_sold || '',
      buyer_name: initialValues.buyer_name || '',
      certification_type: initialValues.certification_type || '',
      inspector_name: initialValues.inspector_name || '',
      compliance_status: initialValues.compliance_status || '',
      carbon_credits_earned: initialValues.carbon_credits_earned?.toString() || '',
      observation: initialValues.observation || ''
    }
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      methods.reset({
        type: initialValues.type || 'HS',
        name: initialValues.name || '',
        revenue_amount: initialValues.revenue_amount?.toString() || '',
        quantity_sold: initialValues.quantity_sold || '',
        buyer_name: initialValues.buyer_name || '',
        certification_type: initialValues.certification_type || '',
        inspector_name: initialValues.inspector_name || '',
        compliance_status: initialValues.compliance_status || '',
        carbon_credits_earned: initialValues.carbon_credits_earned?.toString() || '',
        observation: initialValues.observation || ''
      });
    }
  }, [initialValues, methods]);

  const { watch } = methods;
  const businessType = watch('type');

  const onSubmit = (data) => {
    // Convert string numbers to proper format
    const processedData = {
      ...data,
      revenue_amount: data.revenue_amount ? parseFloat(data.revenue_amount) : null,
      carbon_credits_earned: data.carbon_credits_earned
        ? parseFloat(data.carbon_credits_earned)
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
            placeholder="e.g., Harvest Sale, Certification Audit"
            isRequired
          />

          {/* Business Event Type */}
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="semibold">
              {intl.formatMessage({ id: 'app.businessEventType' }) || 'Business Event Type'}
            </FormLabel>
            <Select {...methods.register('type')} size="md">
              <option value="HS">
                {intl.formatMessage({ id: 'app.harvestSale' }) || 'Harvest Sale'}
              </option>
              <option value="CE">
                {intl.formatMessage({ id: 'app.certification' }) || 'Certification'}
              </option>
              <option value="IN">
                {intl.formatMessage({ id: 'app.inspection' }) || 'Inspection'}
              </option>
              <option value="IS">
                {intl.formatMessage({ id: 'app.insurance' }) || 'Insurance'}
              </option>
              <option value="MA">
                {intl.formatMessage({ id: 'app.marketAnalysis' }) || 'Market Analysis'}
              </option>
              <option value="CT">{intl.formatMessage({ id: 'app.contract' }) || 'Contract'}</option>
              <option value="CM">
                {intl.formatMessage({ id: 'app.compliance' }) || 'Compliance'}
              </option>
            </Select>
          </FormControl>

          {/* Sale Details */}
          {businessType === 'HS' && (
            <>
              <HStack spacing={4} align="end">
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    {intl.formatMessage({ id: 'app.revenueAmount' }) || 'Revenue Amount ($)'}
                  </FormLabel>
                  <NumberInput min={0} precision={2}>
                    <NumberInputField {...methods.register('revenue_amount')} placeholder="0.00" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormInput
                  label={intl.formatMessage({ id: 'app.quantitySold' }) || 'Quantity Sold'}
                  name="quantity_sold"
                  placeholder="e.g., 100 kg"
                />
              </HStack>

              <FormInput
                label={intl.formatMessage({ id: 'app.buyerName' }) || 'Buyer Name'}
                name="buyer_name"
                placeholder="Enter buyer company or individual name"
              />
            </>
          )}

          {/* Certification Details */}
          {businessType === 'CE' && (
            <>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  {intl.formatMessage({ id: 'app.certificationType' }) || 'Certification Type'}
                </FormLabel>
                <Select {...methods.register('certification_type')}>
                  <option value="">
                    {intl.formatMessage({ id: 'app.selectCertificationType' }) ||
                      'Select certification type'}
                  </option>
                  <option value="organic">
                    {intl.formatMessage({ id: 'app.organic' }) || 'Organic'}
                  </option>
                  <option value="carbon_credits">
                    {intl.formatMessage({ id: 'app.carbonCredits' }) || 'Carbon Credits'}
                  </option>
                  <option value="fair_trade">
                    {intl.formatMessage({ id: 'app.fairTrade' }) || 'Fair Trade'}
                  </option>
                  <option value="gmp">
                    {intl.formatMessage({ id: 'app.gmp' }) || 'Good Manufacturing Practice'}
                  </option>
                  <option value="haccp">
                    {intl.formatMessage({ id: 'app.haccp' }) || 'HACCP'}
                  </option>
                  <option value="rainforest_alliance">
                    {intl.formatMessage({ id: 'app.rainforestAlliance' }) || 'Rainforest Alliance'}
                  </option>
                  <option value="other">
                    {intl.formatMessage({ id: 'app.other' }) || 'Other'}
                  </option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  {intl.formatMessage({ id: 'app.carbonCreditsEarned' }) ||
                    'Carbon Credits Earned (tons CO2e)'}
                </FormLabel>
                <NumberInput min={0} precision={3}>
                  <NumberInputField
                    {...methods.register('carbon_credits_earned')}
                    placeholder="0.000"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </>
          )}

          {/* Inspection Details */}
          {(businessType === 'IN' || businessType === 'CM') && (
            <>
              <FormInput
                label={intl.formatMessage({ id: 'app.inspectorName' }) || 'Inspector Name'}
                name="inspector_name"
                placeholder="Enter inspector or auditor name"
              />

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  {intl.formatMessage({ id: 'app.complianceStatus' }) || 'Compliance Status'}
                </FormLabel>
                <Select {...methods.register('compliance_status')}>
                  <option value="">
                    {intl.formatMessage({ id: 'app.selectComplianceStatus' }) ||
                      'Select compliance status'}
                  </option>
                  <option value="compliant">
                    {intl.formatMessage({ id: 'app.compliant' }) || 'Compliant'}
                  </option>
                  <option value="non_compliant">
                    {intl.formatMessage({ id: 'app.nonCompliant' }) || 'Non-Compliant'}
                  </option>
                  <option value="conditional">
                    {intl.formatMessage({ id: 'app.conditional' }) || 'Conditional'}
                  </option>
                  <option value="pending">
                    {intl.formatMessage({ id: 'app.pending' }) || 'Pending'}
                  </option>
                </Select>
              </FormControl>
            </>
          )}

          {/* Contract Details */}
          {businessType === 'CT' && (
            <FormInput
              label={intl.formatMessage({ id: 'app.buyerName' }) || 'Contract Party'}
              name="buyer_name"
              placeholder="Enter contract party name"
            />
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

export default BusinessTab;
