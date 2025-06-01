import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  SimpleGrid,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Text,
  Icon,
  Box,
  Badge,
  Divider,
  Input
} from '@chakra-ui/react';
import {
  StandardPage,
  StandardCard,
  StandardField,
  StandardInput,
  StandardTextarea,
  StandardSelect,
  StandardButton,
  StandardAlert,
  StandardStepper,
  StandardSelectionGrid
} from '../Design';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, boolean, number, date } from 'zod';
import { useIntl } from 'react-intl';
import CreatableSelect from 'react-select/creatable';
import {
  FaSeedling,
  FaCalendarAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
  FaTractor,
  FaLeaf,
  FaWater,
  FaCut,
  FaWarehouse
} from 'react-icons/fa';
import { MdLocalFlorist, MdHome } from 'react-icons/md';

// Form Schema
const productionSchema = object({
  productId: string().optional(),
  productName: string().optional(),
  date: string().min(1, 'Date is required'),
  type: string().min(1, 'Production type is required'),
  isOutdoor: boolean().default(true),
  ageOfPlants: number().optional(),
  numberOfPlants: number().optional(),
  soilPh: number().optional()
});

interface ProductionFormData {
  productId?: string;
  productName?: string;
  date: string;
  type: string;
  isOutdoor: boolean;
  ageOfPlants?: number;
  numberOfPlants?: number;
  soilPh?: number;
}

interface StandardProductionFormProps {
  onSubmit: (data: ProductionFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ProductionFormData>;
  isLoading?: boolean;
  isEdit?: boolean;
  parcelName?: string;
  productOptions?: Array<{ value: string; label: string }>;
}

// Production type options
const productionTypeOptions = [
  {
    id: 'OR',
    title: 'Organic',
    description: 'Organic farming methods',
    icon: FaLeaf,
    color: 'green',
    value: 'OR'
  },
  {
    id: 'GA',
    title: 'General Agriculture',
    description: 'Conventional farming',
    icon: FaTractor,
    color: 'blue',
    value: 'GA'
  }
];

// Growing environment options
const environmentOptions = [
  {
    id: 'outdoor',
    title: 'Outdoor',
    description: 'Open field cultivation',
    icon: MdLocalFlorist,
    color: 'green',
    value: 'outdoor'
  },
  {
    id: 'indoor',
    title: 'Indoor/Greenhouse',
    description: 'Controlled environment',
    icon: MdHome,
    color: 'blue',
    value: 'indoor'
  }
];

export const StandardProductionForm: React.FC<StandardProductionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEdit = false,
  parcelName = '',
  productOptions = []
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productError, setProductError] = useState<string>('');
  const intl = useIntl();
  const toast = useToast();

  // Define steps for stepper
  const steps = [
    { title: 'Product Selection', description: 'Choose product & type', icon: FaSeedling },
    { title: 'Production Details', description: 'Date & environment', icon: FaCalendarAlt },
    { title: 'Plant Details', description: 'Plant count & soil info', icon: FaInfoCircle }
  ];

  const methods = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      isOutdoor: true,
      type: 'OR',
      ageOfPlants: 0,
      numberOfPlants: 0,
      soilPh: 7.0,
      ...initialData
    }
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = methods;

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({ ...methods.getValues(), ...initialData });
      if (initialData.productId && initialData.productName) {
        setSelectedProduct({
          value: initialData.productId,
          label: initialData.productName
        });
      }
    }
  }, [initialData, reset, methods]);

  const onSubmitForm = (data: ProductionFormData) => {
    console.log('Form submission started:', {
      data,
      selectedProduct,
      hasSelectedProduct: !!selectedProduct,
      selectedProductValue: selectedProduct?.value,
      selectedProductLabel: selectedProduct?.label
    });

    // Validate product selection
    if (!selectedProduct) {
      console.log('Product validation failed - no selected product');
      setProductError('Product is required');
      return;
    }

    setProductError('');

    try {
      const finalData = {
        ...data,
        productId: String(selectedProduct.value),
        productName: selectedProduct.label
      };

      console.log('Final data to submit:', finalData);

      onSubmit(finalData);
      toast({
        title: isEdit ? 'Production Updated' : 'Production Created',
        description: `Production for "${selectedProduct.label}" has been ${
          isEdit ? 'updated' : 'created'
        } successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save production. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Step validation
  const isStepComplete = (step: number) => {
    const formData = watch();
    const currentErrors = errors;

    switch (step) {
      case 0:
        // Product Selection: product and type required, no validation errors
        const productFieldErrors = ['type'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        const step0Complete =
          selectedProduct && formData.type && !productFieldErrors && !productError;

        // Debug logging for step 0
        if (process.env.NODE_ENV === 'development') {
          console.log('Step 0 validation:', {
            selectedProduct: !!selectedProduct,
            formDataType: formData.type,
            productFieldErrors,
            productError,
            step0Complete
          });
        }

        return step0Complete;
      case 1:
        // Production Details: date and environment required, no validation errors
        const detailsFieldErrors = ['date'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        const hasDate = Boolean(
          formData.date && typeof formData.date === 'string' && formData.date.trim().length > 0
        );
        const hasEnvironment = formData.isOutdoor !== undefined && formData.isOutdoor !== null;
        const step1Complete = hasDate && hasEnvironment && !detailsFieldErrors;

        // Debug logging for step 1 - always show when validating step 1
        if (process.env.NODE_ENV === 'development') {
          console.log('Step 1 validation check:', {
            formDataDate: formData.date,
            hasDate,
            formDataIsOutdoor: formData.isOutdoor,
            hasEnvironment,
            detailsFieldErrors,
            currentErrors,
            step1Complete,
            allFormData: formData,
            checkingFromStep: currentStep
          });
        }

        return step1Complete;
      case 2:
        // Additional Info: optional step, check for validation errors
        const additionalFieldErrors = ['ageOfPlants', 'numberOfPlants', 'soilPh'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        const step2Complete = !additionalFieldErrors;

        if (process.env.NODE_ENV === 'development') {
          console.log('Step 2 validation:', {
            additionalFieldErrors,
            step2Complete
          });
        }

        return step2Complete;
      default:
        return false;
    }
  };

  // Get completed steps
  const getCompletedSteps = () => {
    const completed = [];
    for (let i = 0; i < currentStep; i++) {
      if (isStepComplete(i)) {
        completed.push(i);
      }
    }
    return completed;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Debug helper for button state
  const getButtonDebugInfo = () => {
    if (process.env.NODE_ENV === 'development') {
      const step1Valid = isStepComplete(1);
      console.log('Button debug info:', {
        currentStep,
        step1Valid,
        buttonDisabled: !step1Valid,
        formData: watch()
      });
      return step1Valid;
    }
    return isStepComplete(1);
  };

  // Custom styles for CreatableSelect
  const selectStyles = {
    control: (provided: any) => ({
      ...provided,
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      minHeight: '40px',
      fontSize: '14px'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#A0AEC0'
    })
  };

  return (
    <StandardPage
      title={isEdit ? 'Edit Production' : 'Start New Production'}
      description={`${isEdit ? 'Update' : 'Create'} a production cycle${
        parcelName ? ` for ${parcelName}` : ''
      }`}
      showBackButton
      onBack={onCancel}>
      {/* Modern Progress Stepper */}
      <StandardStepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={getCompletedSteps()}
        allowStepClick={true}
        onStepClick={(step) => setCurrentStep(step)}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          {/* Step 0: Product Selection */}
          {currentStep === 0 && (
            <StandardCard
              title="Product & Production Type"
              subtitle="Select the product and farming method">
              <VStack spacing={6} align="stretch">
                {/* Product Selection */}
                <StandardField
                  label="Product"
                  required
                  error={productError}
                  helpText="Select an existing product or create a new one">
                  <CreatableSelect
                    value={selectedProduct}
                    onChange={(newValue) => {
                      setSelectedProduct(newValue);
                      setProductError('');
                    }}
                    options={productOptions}
                    styles={selectStyles}
                    placeholder="Select or type to create a new product..."
                    isClearable
                  />
                </StandardField>

                {/* Production Type Selection */}
                <StandardField
                  label="Production Type"
                  required
                  error={errors.type?.message}
                  helpText="Choose your farming approach">
                  <StandardSelectionGrid
                    options={productionTypeOptions}
                    selectedValue={watch('type')}
                    onSelect={(value) => setValue('type', value)}
                    columns={{ base: 'repeat(2, 1fr)' }}
                    size="md"
                  />
                </StandardField>

                {/* Type Description */}
                {watch('type') && (
                  <Box p={4} bg="gray.50" borderRadius="lg">
                    <Text fontWeight="semibold" mb={2}>
                      {watch('type') === 'OR' ? 'Organic Farming' : 'General Agriculture'}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {watch('type') === 'OR'
                        ? 'Organic farming relies on natural processes, biodiversity, and cycles adapted to local conditions rather than synthetic inputs.'
                        : 'General agriculture uses conventional farming methods including synthetic fertilizers and pesticides for optimal yields.'}
                    </Text>
                  </Box>
                )}

                {/* Navigation */}
                <HStack spacing={3} justify="flex-end" pt={4}>
                  <StandardButton variant="outline" onClick={onCancel}>
                    Cancel
                  </StandardButton>
                  <StandardButton
                    onClick={nextStep}
                    rightIcon={<FaChevronRight />}
                    disabled={!isStepComplete(0)}>
                    Continue to Details
                  </StandardButton>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 1: Production Details */}
          {currentStep === 1 && (
            <StandardCard
              title="Production Details"
              subtitle="Set the date and growing environment">
              <VStack spacing={6} align="stretch">
                {/* Date Selection */}
                <StandardField
                  label="Production Date"
                  required
                  error={errors.date?.message}
                  helpText="When did this production start?">
                  <Input
                    {...methods.register('date', {
                      required: 'Production date is required'
                    })}
                    type="datetime-local"
                    borderRadius="lg"
                    onChange={(e) => {
                      console.log('Date field onChange:', {
                        value: e.target.value,
                        dateFieldValue: watch('date')
                      });
                      // Let react-hook-form handle the change
                      methods.register('date').onChange(e);
                    }}
                  />
                </StandardField>

                {/* Environment Selection */}
                <StandardField label="Growing Environment" helpText="Indoor or outdoor cultivation">
                  <StandardSelectionGrid
                    options={environmentOptions}
                    selectedValue={watch('isOutdoor') ? 'outdoor' : 'indoor'}
                    onSelect={(value) => {
                      console.log('Environment selection change:', {
                        value,
                        willSetTo: value === 'outdoor',
                        currentIsOutdoor: watch('isOutdoor'),
                        formDataBefore: watch()
                      });
                      setValue('isOutdoor', value === 'outdoor');

                      // Force validation check after setting value
                      setTimeout(() => {
                        const updatedFormData = watch();
                        console.log('After environment selection:', {
                          newIsOutdoor: updatedFormData.isOutdoor,
                          step1Valid: isStepComplete(1),
                          formDataAfter: updatedFormData
                        });
                      }, 100);
                    }}
                    columns={{ base: 'repeat(2, 1fr)' }}
                    size="md"
                  />
                </StandardField>

                {/* Environment Info */}
                <Box p={4} bg="blue.50" borderRadius="lg">
                  <HStack mb={2}>
                    <Icon
                      as={watch('isOutdoor') ? MdLocalFlorist : MdHome}
                      color="blue.600"
                      boxSize={5}
                    />
                    <Text fontWeight="semibold" color="blue.700">
                      {watch('isOutdoor') ? 'Outdoor Cultivation' : 'Indoor/Greenhouse Cultivation'}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="blue.600">
                    {watch('isOutdoor')
                      ? 'Growing in natural outdoor conditions with direct sunlight and weather exposure.'
                      : 'Growing in controlled indoor environment with regulated temperature, humidity, and lighting.'}
                  </Text>
                </Box>

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}>
                    Back to Product
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={onCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      onClick={nextStep}
                      rightIcon={<FaChevronRight />}
                      disabled={!getButtonDebugInfo()}>
                      Continue to Details
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 2: Plant Details */}
          {currentStep === 2 && (
            <StandardCard title="Plant Details" subtitle="Specify plant count and soil conditions">
              <VStack spacing={6} align="stretch">
                {/* Plant Details */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Age of Plants (days)"
                    error={errors.ageOfPlants?.message}
                    helpText="How old are the plants?">
                    <NumberInput
                      value={watch('ageOfPlants') || 0}
                      onChange={(_, num) => setValue('ageOfPlants', num || 0)}
                      min={0}>
                      <NumberInputField borderRadius="lg" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </StandardField>

                  <StandardField
                    label="Number of Plants"
                    error={errors.numberOfPlants?.message}
                    helpText="Total plant count">
                    <NumberInput
                      value={watch('numberOfPlants') || 0}
                      onChange={(_, num) => setValue('numberOfPlants', num || 0)}
                      min={0}>
                      <NumberInputField borderRadius="lg" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </StandardField>
                </SimpleGrid>

                {/* Soil pH */}
                <StandardField
                  label="Soil pH"
                  error={errors.soilPh?.message}
                  helpText="Soil acidity/alkalinity level (1-14 scale)">
                  <NumberInput
                    value={watch('soilPh') || 7.0}
                    onChange={(_, num) => setValue('soilPh', num || 7.0)}
                    min={1}
                    max={14}
                    step={0.1}
                    precision={1}>
                    <NumberInputField borderRadius="lg" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </StandardField>

                {/* pH Guide */}
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text fontWeight="semibold" mb={2}>
                    pH Scale Guide:
                  </Text>
                  <SimpleGrid columns={3} spacing={2} fontSize="sm">
                    <Text>
                      <Badge colorScheme="red" mr={2}>
                        1-6
                      </Badge>
                      Acidic
                    </Text>
                    <Text>
                      <Badge colorScheme="green" mr={2}>
                        6-8
                      </Badge>
                      Neutral
                    </Text>
                    <Text>
                      <Badge colorScheme="blue" mr={2}>
                        8-14
                      </Badge>
                      Alkaline
                    </Text>
                  </SimpleGrid>
                </Box>

                {/* Production Summary */}
                <Box p={4} bg="green.50" borderRadius="lg">
                  <Text fontWeight="semibold" color="green.700" mb={3}>
                    Production Summary:
                  </Text>
                  <SimpleGrid columns={2} spacing={2} fontSize="sm">
                    <Text>Product: {selectedProduct?.label || 'Not selected'}</Text>
                    <Text>Type: {watch('type') === 'OR' ? 'Organic' : 'General Agriculture'}</Text>
                    <Text>Environment: {watch('isOutdoor') ? 'Outdoor' : 'Indoor/Greenhouse'}</Text>
                    <Text>Start Date: {watch('date') || 'Not set'}</Text>
                    <Text>Plants: {watch('numberOfPlants') || 0}</Text>
                    <Text>Soil pH: {watch('soilPh') || 'Not measured'}</Text>
                  </SimpleGrid>

                  {/* Debug info */}
                  {process.env.NODE_ENV === 'development' && (
                    <Box mt={3} p={2} bg="yellow.100" borderRadius="md" fontSize="xs">
                      <Text fontWeight="bold">Debug - Selected Product:</Text>
                      <Text>Value: {selectedProduct?.value || 'undefined'}</Text>
                      <Text>Label: {selectedProduct?.label || 'undefined'}</Text>
                      <Text>Has Product: {selectedProduct ? 'Yes' : 'No'}</Text>
                    </Box>
                  )}
                </Box>

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}>
                    Back to Details
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={onCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      type="submit"
                      isLoading={isLoading}
                      loadingText={isEdit ? 'Updating...' : 'Creating...'}
                      leftIcon={<FaCheckCircle />}>
                      {isEdit ? 'Update Production' : 'Start Production'}
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}
        </form>
      </FormProvider>
    </StandardPage>
  );
};

export default StandardProductionForm;
