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
  Divider
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
  productId: string().min(1, 'Product is required'),
  productName: string().min(1, 'Product name is required'),
  date: string().min(1, 'Date is required'),
  type: string().min(1, 'Production type is required'),
  isOutdoor: boolean().default(true),
  ageOfPlants: number().optional(),
  numberOfPlants: number().optional(),
  soilPh: number().optional(),
  observation: string().optional()
});

interface ProductionFormData {
  productId: string;
  productName: string;
  date: string;
  type: string;
  isOutdoor: boolean;
  ageOfPlants?: number;
  numberOfPlants?: number;
  soilPh?: number;
  observation?: string;
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
    value: true
  },
  {
    id: 'indoor',
    title: 'Indoor/Greenhouse',
    description: 'Controlled environment',
    icon: MdHome,
    color: 'blue',
    value: false
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
    { title: 'Additional Info', description: 'Plant details & notes', icon: FaInfoCircle }
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
    // Validate product selection
    if (!selectedProduct) {
      setProductError('Product is required');
      return;
    }

    setProductError('');

    try {
      const finalData = {
        ...data,
        productId: selectedProduct.value,
        productName: selectedProduct.label
      };

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
        return selectedProduct && formData.type && !productFieldErrors && !productError;
      case 1:
        // Production Details: date required, no validation errors
        const detailsFieldErrors = ['date'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        return formData.date && !detailsFieldErrors;
      case 2:
        // Additional Info: optional step, check for validation errors
        const additionalFieldErrors = [
          'ageOfPlants',
          'numberOfPlants',
          'soilPh',
          'observation'
        ].some((field) => currentErrors[field as keyof typeof currentErrors]);
        return !additionalFieldErrors;
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
                  <StandardInput
                    {...methods.register('date')}
                    type="datetime-local"
                    leftElement={<Icon as={FaCalendarAlt} color="gray.400" />}
                  />
                </StandardField>

                {/* Environment Selection */}
                <StandardField label="Growing Environment" helpText="Indoor or outdoor cultivation">
                  <StandardSelectionGrid
                    options={environmentOptions}
                    selectedValue={watch('isOutdoor') ? 'outdoor' : 'indoor'}
                    onSelect={(value) => setValue('isOutdoor', value === 'outdoor')}
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
                      disabled={!isStepComplete(1)}>
                      Continue to Details
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 2: Additional Information */}
          {currentStep === 2 && (
            <StandardCard
              title="Additional Information"
              subtitle="Optional details about plants and conditions">
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

                {/* Observations */}
                <StandardField
                  label="Observations"
                  error={errors.observation?.message}
                  helpText="Any additional notes about this production">
                  <StandardTextarea
                    {...methods.register('observation')}
                    placeholder="Record any observations about soil conditions, plant health, weather conditions, or other relevant factors..."
                  />
                </StandardField>

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
