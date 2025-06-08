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
  Input,
  InputGroup,
  InputLeftElement,
  Grid,
  Avatar,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Button
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
  FaWarehouse,
  FaSearch,
  FaAppleAlt,
  FaCarrot,
  FaGraduationCap,
  FaCoffee
} from 'react-icons/fa';
import { MdLocalFlorist, MdHome, MdGrass, MdFilterVintage, MdVerified } from 'react-icons/md';

// Form Schema
const productionSchema = object({
  productId: string().optional(),
  productName: string().optional(),
  date: string().min(1, 'Date is required'),
  type: string().min(1, 'Production type is required'),
  isOutdoor: boolean().default(true),
  ageOfPlants: number().optional(),
  numberOfPlants: number().optional(),
  soilPh: number().optional(),
  // Enhanced blockchain fields
  enableBlockchain: boolean().default(true),
  expectedHarvest: string().optional(),
  estimatedYield: number().optional(),
  irrigationMethod: string().optional(),
  productionMethod: string().optional()
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
  // Enhanced blockchain fields
  enableBlockchain?: boolean;
  expectedHarvest?: string;
  estimatedYield?: number;
  irrigationMethod?: string;
  productionMethod?: string;
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
    description: 'Certified organic farming methods',
    icon: FaLeaf,
    color: 'green',
    value: 'OR',
    blockchainBenefits: 'Enhanced carbon credit eligibility'
  },
  {
    id: 'GA',
    title: 'General Agriculture',
    description: 'Conventional farming with sustainability tracking',
    icon: FaTractor,
    color: 'blue',
    value: 'GA',
    blockchainBenefits: 'Transparent supply chain verification'
  },
  {
    id: 'SU',
    title: 'Sustainable',
    description: 'Regenerative and sustainable practices',
    icon: FaSeedling,
    color: 'purple',
    value: 'SU',
    blockchainBenefits: 'Premium carbon credit potential'
  }
];

// Irrigation method options for enhanced tracking
const irrigationMethodOptions = [
  { value: 'drip', label: 'Drip Irrigation', efficiency: 'High', carbonImpact: 'Low' },
  { value: 'sprinkler', label: 'Sprinkler System', efficiency: 'Medium', carbonImpact: 'Medium' },
  { value: 'flood', label: 'Flood Irrigation', efficiency: 'Low', carbonImpact: 'High' },
  { value: 'micro_spray', label: 'Micro Spray', efficiency: 'High', carbonImpact: 'Low' },
  { value: 'rainwater', label: 'Rainwater Only', efficiency: 'Variable', carbonImpact: 'Very Low' }
];

// Production method options for blockchain verification
const productionMethodOptions = [
  { value: 'conventional', label: 'Conventional', carbonScore: 'Standard' },
  { value: 'organic', label: 'Organic Certified', carbonScore: 'Enhanced' },
  { value: 'biodynamic', label: 'Biodynamic', carbonScore: 'Premium' },
  { value: 'regenerative', label: 'Regenerative', carbonScore: 'Premium' },
  { value: 'permaculture', label: 'Permaculture', carbonScore: 'Enhanced' }
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

// Crop categories for better organization
const cropCategories = [
  {
    id: 'fruits',
    title: 'Fruits',
    icon: FaAppleAlt,
    color: 'red',
    keywords: [
      'apple',
      'orange',
      'banana',
      'grape',
      'berry',
      'citrus',
      'avocado',
      'mango',
      'peach',
      'cherry'
    ]
  },
  {
    id: 'vegetables',
    title: 'Vegetables',
    icon: FaCarrot,
    color: 'orange',
    keywords: [
      'tomato',
      'carrot',
      'lettuce',
      'spinach',
      'broccoli',
      'cabbage',
      'pepper',
      'cucumber',
      'onion',
      'potato'
    ]
  },
  {
    id: 'grains',
    title: 'Grains & Cereals',
    icon: FaGraduationCap,
    color: 'yellow',
    keywords: ['wheat', 'corn', 'rice', 'barley', 'oat', 'quinoa', 'millet', 'sorghum']
  },
  {
    id: 'herbs',
    title: 'Herbs & Spices',
    icon: MdFilterVintage,
    color: 'green',
    keywords: ['basil', 'oregano', 'thyme', 'parsley', 'cilantro', 'rosemary', 'mint', 'sage']
  },
  {
    id: 'legumes',
    title: 'Legumes & Beans',
    icon: FaSeedling,
    color: 'purple',
    keywords: ['bean', 'pea', 'lentil', 'chickpea', 'soybean', 'alfalfa']
  },
  {
    id: 'nuts',
    title: 'Nuts & Seeds',
    icon: FaCoffee,
    color: 'brown',
    keywords: ['almond', 'walnut', 'pecan', 'hazelnut', 'sunflower', 'pumpkin']
  }
];

// Helper function to categorize crops
const categorizeCrop = (productName: string) => {
  const name = productName.toLowerCase();
  for (const category of cropCategories) {
    if (category.keywords.some((keyword) => name.includes(keyword))) {
      return category;
    }
  }
  return cropCategories[1]; // Default to vegetables
};

// Helper function to get crop growth period estimation
const getCropGrowthPeriod = (productName: string) => {
  const name = productName.toLowerCase();

  // Fruits (longer growing seasons)
  if (name.includes('citrus') || name.includes('apple') || name.includes('avocado')) {
    return { days: 365, season: 'Annual' };
  }

  // Nuts (very long growing seasons)
  if (name.includes('almond') || name.includes('walnut') || name.includes('pecan')) {
    return { days: 365, season: 'Annual' };
  }

  // Grains
  if (name.includes('corn') || name.includes('wheat')) {
    return { days: 120, season: '4 months' };
  }
  if (name.includes('rice')) {
    return { days: 150, season: '5 months' };
  }

  // Vegetables (shorter growing seasons)
  if (name.includes('lettuce') || name.includes('spinach')) {
    return { days: 60, season: '2 months' };
  }
  if (name.includes('tomato') || name.includes('pepper')) {
    return { days: 90, season: '3 months' };
  }
  if (name.includes('carrot') || name.includes('broccoli')) {
    return { days: 75, season: '2.5 months' };
  }

  // Berries
  if (name.includes('berry') || name.includes('strawberry')) {
    return { days: 180, season: '6 months' };
  }

  // Herbs (quick growing)
  if (name.includes('basil') || name.includes('cilantro') || name.includes('parsley')) {
    return { days: 30, season: '1 month' };
  }

  // Default
  return { days: 90, season: '3 months' };
};

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Array<{ value: string; label: string }>>(
    []
  );
  const intl = useIntl();
  const toast = useToast();

  // Define steps for stepper
  const steps = [
    { title: 'Product Selection', description: 'Choose product & type', icon: FaSeedling },
    { title: 'Production Details', description: 'Date & environment', icon: FaCalendarAlt },
    { title: 'Enhanced Tracking', description: 'Blockchain & sustainability', icon: FaInfoCircle },
    { title: 'Plant Details', description: 'Optional specifics', icon: FaInfoCircle }
  ];

  const methods = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      isOutdoor: true,
      type: 'OR',
      ageOfPlants: 0,
      numberOfPlants: 0,
      soilPh: 7.0,
      enableBlockchain: true,
      productionMethod: 'conventional',
      irrigationMethod: 'drip',
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

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = productOptions;

    // Filter by category
    if (selectedCategory) {
      const category = cropCategories.find((cat) => cat.id === selectedCategory);
      if (category) {
        filtered = filtered.filter((product) =>
          category.keywords.some((keyword) => product.label.toLowerCase().includes(keyword))
        );
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [productOptions, searchTerm, selectedCategory]);

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
        // Enhanced Tracking: blockchain and sustainability settings
        const trackingFieldErrors = ['productionMethod', 'irrigationMethod'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        const step2Complete = !trackingFieldErrors;

        if (process.env.NODE_ENV === 'development') {
          console.log('Step 2 validation (Enhanced Tracking):', {
            trackingFieldErrors,
            step2Complete
          });
        }

        return step2Complete;
      case 3:
        // Plant Details: optional step, check for validation errors
        const additionalFieldErrors = ['ageOfPlants', 'numberOfPlants', 'soilPh'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        const step3Complete = !additionalFieldErrors;

        if (process.env.NODE_ENV === 'development') {
          console.log('Step 3 validation (Plant Details):', {
            additionalFieldErrors,
            step3Complete
          });
        }

        return step3Complete;
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

  // Calculate form completion percentage
  const getFormCompletionPercentage = () => {
    const formData = watch();
    let completedFields = 0;
    const totalRequiredFields = 3; // product, date, type

    if (selectedProduct) completedFields++;
    if (formData.date) completedFields++;
    if (formData.type) completedFields++;

    return Math.round((completedFields / totalRequiredFields) * 100);
  };

  // Get completion status text
  const getCompletionStatusText = () => {
    const percentage = getFormCompletionPercentage();
    if (percentage === 100) return 'Ready to create production!';
    if (percentage >= 66) return 'Almost ready...';
    if (percentage >= 33) return 'Good progress...';
    return 'Getting started...';
  };

  return (
    <StandardPage
      title={isEdit ? 'Edit Production' : 'Start New Production'}
      description={`${isEdit ? 'Update' : 'Create'} a production cycle${
        parcelName ? ` for ${parcelName}` : ''
      }`}
      showBackButton
      onBack={onCancel}
    >
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
              subtitle="Select the product and farming method"
            >
              <VStack spacing={6} align="stretch">
                {/* Crop Category Filter */}
                <StandardField
                  label="Crop Category"
                  helpText="Filter products by crop type for easier selection"
                >
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={3}>
                    <Box
                      p={3}
                      borderRadius="lg"
                      border="2px solid"
                      borderColor={!selectedCategory ? 'green.500' : 'gray.200'}
                      bg={!selectedCategory ? 'green.50' : 'white'}
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: 'green.400', transform: 'translateY(-1px)' }}
                      onClick={() => setSelectedCategory('')}
                      textAlign="center"
                    >
                      <VStack spacing={2}>
                        <Icon
                          as={FaSearch}
                          color={!selectedCategory ? 'green.500' : 'gray.400'}
                          boxSize={4}
                        />
                        <Text
                          fontSize="xs"
                          fontWeight="medium"
                          color={!selectedCategory ? 'green.700' : 'gray.600'}
                        >
                          All Crops
                        </Text>
                      </VStack>
                    </Box>
                    {cropCategories.map((category) => (
                      <Box
                        key={category.id}
                        p={3}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={
                          selectedCategory === category.id ? `${category.color}.500` : 'gray.200'
                        }
                        bg={selectedCategory === category.id ? `${category.color}.50` : 'white'}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          borderColor: `${category.color}.400`,
                          transform: 'translateY(-1px)'
                        }}
                        onClick={() => setSelectedCategory(category.id)}
                        textAlign="center"
                      >
                        <VStack spacing={2}>
                          <Icon
                            as={category.icon}
                            color={
                              selectedCategory === category.id
                                ? `${category.color}.500`
                                : 'gray.400'
                            }
                            boxSize={4}
                          />
                          <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color={
                              selectedCategory === category.id
                                ? `${category.color}.700`
                                : 'gray.600'
                            }
                          >
                            {category.title}
                          </Text>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </StandardField>

                {/* Search & Product Selection */}
                <StandardField
                  label="Product"
                  required
                  error={productError}
                  helpText="Search and select your crop or create a new one"
                >
                  {/* Product Selection Dropdown */}
                  <CreatableSelect
                    value={selectedProduct}
                    onChange={(newValue) => {
                      setSelectedProduct(newValue);
                      setProductError('');
                    }}
                    options={filteredProducts}
                    styles={selectStyles}
                    placeholder="Select from filtered results or create new..."
                    isClearable
                    noOptionsMessage={() =>
                      searchTerm || selectedCategory
                        ? 'No crops found. Type to create a new one.'
                        : 'Start typing to search crops...'
                    }
                  />

                  {/* Product Info */}
                  {selectedProduct && (
                    <Box mt={3} p={4} bg="blue.50" borderRadius="lg">
                      <HStack spacing={3}>
                        <Avatar
                          size="sm"
                          icon={<Icon as={categorizeCrop(selectedProduct.label).icon} />}
                          bg={`${categorizeCrop(selectedProduct.label).color}.100`}
                          color={`${categorizeCrop(selectedProduct.label).color}.600`}
                        />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="semibold" color="blue.700">
                            {selectedProduct.label}
                          </Text>
                          <HStack spacing={2}>
                            <Badge
                              colorScheme={categorizeCrop(selectedProduct.label).color}
                              size="sm"
                            >
                              {categorizeCrop(selectedProduct.label).title}
                            </Badge>
                            <Text fontSize="xs" color="blue.600">
                              Estimated growing period:{' '}
                              {getCropGrowthPeriod(selectedProduct.label).season}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>
                  )}

                  {/* Available Products Count */}
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {filteredProducts.length} crop{filteredProducts.length !== 1 ? 's' : ''}{' '}
                    available
                    {selectedCategory &&
                      ` in ${cropCategories.find((c) => c.id === selectedCategory)?.title}`}
                    {searchTerm && ` matching "${searchTerm}"`}
                  </Text>
                </StandardField>

                {/* Production Type Selection */}
                <StandardField
                  label="Production Type"
                  required
                  error={errors.type?.message}
                  helpText="Choose your farming approach"
                >
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
                    disabled={!isStepComplete(0)}
                  >
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
              subtitle="Set the date and growing environment"
            >
              <VStack spacing={6} align="stretch">
                {/* Date Selection */}
                <StandardField
                  label="Production Date"
                  required
                  error={errors.date?.message}
                  helpText="When did this production start?"
                >
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
                    onClick={previousStep}
                  >
                    Back to Product
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={onCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      onClick={nextStep}
                      rightIcon={<FaChevronRight />}
                      disabled={!isStepComplete(1)}
                    >
                      Continue to Details
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 2: Enhanced Tracking & Blockchain */}
          {currentStep === 2 && (
            <StandardCard
              title="Enhanced Tracking & Sustainability"
              subtitle="Configure blockchain verification and sustainability tracking"
            >
              <VStack spacing={6} align="stretch">
                {/* Blockchain Verification Section */}
                <Box p={6} bg="blue.50" borderRadius="xl" border="1px solid" borderColor="blue.200">
                  <HStack spacing={3} mb={4}>
                    <Icon as={MdVerified} color="blue.600" boxSize={6} />
                    <Text fontWeight="bold" color="blue.700" fontSize="lg">
                      Blockchain Verification
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">
                      Recommended
                    </Badge>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" color="blue.700">
                          Enable Blockchain Carbon Tracking
                        </Text>
                        <Text fontSize="sm" color="blue.600">
                          Create immutable records for carbon credits and supply chain transparency
                        </Text>
                      </VStack>
                      <Switch
                        isChecked={watch('enableBlockchain')}
                        onChange={(e) => setValue('enableBlockchain', e.target.checked)}
                        colorScheme="blue"
                        size="lg"
                      />
                    </HStack>

                    {watch('enableBlockchain') && (
                      <Box
                        p={4}
                        bg="white"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="blue.100"
                      >
                        <VStack spacing={3} align="stretch">
                          <HStack>
                            <Icon as={FaCheckCircle} color="green.500" />
                            <Text fontSize="sm">
                              <Text as="span" fontWeight="semibold">
                                Carbon Credit Eligibility:
                              </Text>{' '}
                              Enabled
                            </Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaCheckCircle} color="green.500" />
                            <Text fontSize="sm">
                              <Text as="span" fontWeight="semibold">
                                Supply Chain Transparency:
                              </Text>{' '}
                              Full traceability
                            </Text>
                          </HStack>
                          <HStack>
                            <Icon as={FaCheckCircle} color="green.500" />
                            <Text fontSize="sm">
                              <Text as="span" fontWeight="semibold">
                                USDA Compliance:
                              </Text>{' '}
                              Automated verification
                            </Text>
                          </HStack>
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Box>

                {/* Production Method Selection */}
                <StandardField
                  label="Production Method"
                  required
                  helpText="Choose your agricultural approach for accurate carbon scoring"
                >
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                    {productionMethodOptions.map((method) => (
                      <Box
                        key={method.value}
                        p={4}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={
                          watch('productionMethod') === method.value ? 'green.500' : 'gray.200'
                        }
                        bg={watch('productionMethod') === method.value ? 'green.50' : 'white'}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ borderColor: 'green.400', transform: 'translateY(-1px)' }}
                        onClick={() => setValue('productionMethod', method.value)}
                      >
                        <VStack spacing={2}>
                          <Text
                            fontWeight="semibold"
                            color={
                              watch('productionMethod') === method.value ? 'green.700' : 'gray.700'
                            }
                          >
                            {method.label}
                          </Text>
                          <Badge
                            colorScheme={
                              method.carbonScore === 'Premium'
                                ? 'purple'
                                : method.carbonScore === 'Enhanced'
                                ? 'green'
                                : 'gray'
                            }
                          >
                            {method.carbonScore} Carbon Score
                          </Badge>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </StandardField>

                {/* Irrigation Method Selection */}
                <StandardField
                  label="Irrigation Method"
                  required
                  helpText="Water management impacts carbon footprint and sustainability score"
                >
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {irrigationMethodOptions.map((irrigation) => (
                      <Box
                        key={irrigation.value}
                        p={4}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={
                          watch('irrigationMethod') === irrigation.value ? 'blue.500' : 'gray.200'
                        }
                        bg={watch('irrigationMethod') === irrigation.value ? 'blue.50' : 'white'}
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ borderColor: 'blue.400', transform: 'translateY(-1px)' }}
                        onClick={() => setValue('irrigationMethod', irrigation.value)}
                      >
                        <VStack spacing={2} align="start">
                          <Text
                            fontWeight="semibold"
                            color={
                              watch('irrigationMethod') === irrigation.value
                                ? 'blue.700'
                                : 'gray.700'
                            }
                          >
                            {irrigation.label}
                          </Text>
                          <HStack spacing={3}>
                            <Badge
                              colorScheme={
                                irrigation.efficiency === 'High'
                                  ? 'green'
                                  : irrigation.efficiency === 'Medium'
                                  ? 'yellow'
                                  : 'gray'
                              }
                            >
                              {irrigation.efficiency} Efficiency
                            </Badge>
                            <Badge
                              colorScheme={
                                irrigation.carbonImpact === 'Very Low' ||
                                irrigation.carbonImpact === 'Low'
                                  ? 'green'
                                  : irrigation.carbonImpact === 'Medium'
                                  ? 'yellow'
                                  : 'red'
                              }
                            >
                              {irrigation.carbonImpact} Carbon
                            </Badge>
                          </HStack>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </StandardField>

                {/* Expected Harvest Date */}
                <StandardField
                  label="Expected Harvest Date"
                  helpText="Estimated completion date for production planning"
                >
                  <Input
                    type="date"
                    value={watch('expectedHarvest') || ''}
                    onChange={(e) => setValue('expectedHarvest', e.target.value)}
                    borderRadius="lg"
                  />
                </StandardField>

                {/* Estimated Yield */}
                <StandardField
                  label="Estimated Yield"
                  helpText="Expected production volume (optional, for carbon calculations)"
                >
                  <NumberInput
                    value={watch('estimatedYield') || 0}
                    onChange={(_, num) => setValue('estimatedYield', num || 0)}
                    min={0}
                  >
                    <NumberInputField borderRadius="lg" placeholder="e.g., 1000 (lbs, kg, units)" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </StandardField>

                {/* Sustainability Preview */}
                <Box
                  p={6}
                  bg="green.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="green.200"
                >
                  <HStack spacing={3} mb={4}>
                    <Icon as={FaLeaf} color="green.600" boxSize={6} />
                    <Text fontWeight="bold" color="green.700" fontSize="lg">
                      Sustainability Impact Preview
                    </Text>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" fontWeight="semibold" color="green.700">
                        Production Method Impact:
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        {watch('productionMethod') === 'organic' ||
                        watch('productionMethod') === 'biodynamic' ||
                        watch('productionMethod') === 'regenerative'
                          ? '🌟 Enhanced carbon sequestration potential'
                          : '✅ Standard carbon tracking enabled'}
                      </Text>
                    </VStack>

                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" fontWeight="semibold" color="green.700">
                        Water Efficiency:
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        {(() => {
                          const selectedIrrigation = irrigationMethodOptions.find(
                            (i) => i.value === watch('irrigationMethod')
                          );
                          return selectedIrrigation
                            ? `${
                                selectedIrrigation.efficiency
                              } efficiency, ${selectedIrrigation.carbonImpact.toLowerCase()} carbon impact`
                            : 'Select irrigation method for assessment';
                        })()}
                      </Text>
                    </VStack>
                  </SimpleGrid>

                  {watch('enableBlockchain') && (
                    <Box mt={4} p={3} bg="white" borderRadius="lg">
                      <HStack>
                        <Icon as={MdVerified} color="blue.500" />
                        <Text fontSize="sm" color="blue.700">
                          <Text as="span" fontWeight="semibold">
                            Blockchain Enabled:
                          </Text>{' '}
                          All sustainability metrics will be recorded on-chain for transparent
                          verification
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </Box>

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}
                  >
                    Back to Enhanced Tracking
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={onCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      type="submit"
                      isLoading={isLoading}
                      loadingText={isEdit ? 'Updating...' : 'Creating...'}
                      leftIcon={<FaCheckCircle />}
                    >
                      {isEdit ? 'Update Production' : 'Start Blockchain-Verified Production'}
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 3: Plant Details */}
          {currentStep === 3 && (
            <StandardCard
              title="Additional Details"
              subtitle="Optional information to improve tracking (can be updated later)"
            >
              <VStack spacing={6} align="stretch">
                {/* Quick Setup vs Detailed Setup Toggle */}
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <AlertTitle fontSize="sm">Optional Information</AlertTitle>
                    <AlertDescription fontSize="sm">
                      These fields help with better production tracking but can be filled later. You
                      can start your production now and add details as you progress.
                    </AlertDescription>
                  </VStack>
                </Alert>

                {/* Plant Details with better defaults */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Age of Plants (days)"
                    error={errors.ageOfPlants?.message}
                    helpText="How old are the plants? 0 for new plantings"
                  >
                    <NumberInput
                      value={watch('ageOfPlants') || 0}
                      onChange={(_, num) => setValue('ageOfPlants', num || 0)}
                      min={0}
                      max={1000}
                    >
                      <NumberInputField borderRadius="lg" placeholder="0 (new planting)" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </StandardField>

                  <StandardField
                    label="Number of Plants"
                    error={errors.numberOfPlants?.message}
                    helpText="Approximate plant count (can be updated later)"
                  >
                    <NumberInput
                      value={watch('numberOfPlants') || 0}
                      onChange={(_, num) => setValue('numberOfPlants', num || 0)}
                      min={0}
                      max={100000}
                    >
                      <NumberInputField borderRadius="lg" placeholder="Enter approximate count" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </StandardField>
                </SimpleGrid>

                {/* Soil pH with better guidance */}
                <StandardField
                  label="Soil pH"
                  error={errors.soilPh?.message}
                  helpText="Soil acidity/alkalinity level. 7.0 is neutral (default)"
                >
                  <HStack spacing={4}>
                    <NumberInput
                      value={watch('soilPh') || 7.0}
                      onChange={(_, num) => setValue('soilPh', num || 7.0)}
                      min={1}
                      max={14}
                      step={0.1}
                      precision={1}
                      flex={1}
                    >
                      <NumberInputField borderRadius="lg" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>

                    {/* pH Quick Buttons */}
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setValue('soilPh', 6.0)}
                        colorScheme={watch('soilPh') === 6.0 ? 'red' : 'gray'}
                      >
                        Acidic (6.0)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setValue('soilPh', 7.0)}
                        colorScheme={watch('soilPh') === 7.0 ? 'green' : 'gray'}
                      >
                        Neutral (7.0)
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setValue('soilPh', 8.0)}
                        colorScheme={watch('soilPh') === 8.0 ? 'blue' : 'gray'}
                      >
                        Alkaline (8.0)
                      </Button>
                    </HStack>
                  </HStack>
                </StandardField>

                {/* Smart Production Summary */}
                <Box
                  p={6}
                  bg="green.50"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="green.200"
                >
                  <HStack spacing={3} mb={4}>
                    <Icon as={FaCheckCircle} color="green.500" boxSize={6} />
                    <Text fontWeight="bold" color="green.700" fontSize="lg">
                      Ready to Start Production!
                    </Text>
                  </HStack>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} fontSize="sm">
                    <HStack>
                      <Icon
                        as={categorizeCrop(selectedProduct?.label || '').icon}
                        color="green.600"
                      />
                      <Text>
                        <Text as="span" fontWeight="semibold">
                          Crop:
                        </Text>{' '}
                        {selectedProduct?.label || 'Not selected'}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={watch('type') === 'OR' ? FaLeaf : FaTractor} color="green.600" />
                      <Text>
                        <Text as="span" fontWeight="semibold">
                          Method:
                        </Text>{' '}
                        {watch('type') === 'OR' ? 'Organic' : 'General Agriculture'}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={watch('isOutdoor') ? MdLocalFlorist : MdHome} color="green.600" />
                      <Text>
                        <Text as="span" fontWeight="semibold">
                          Environment:
                        </Text>{' '}
                        {watch('isOutdoor') ? 'Outdoor' : 'Indoor/Greenhouse'}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaCalendarAlt} color="green.600" />
                      <Text>
                        <Text as="span" fontWeight="semibold">
                          Start:
                        </Text>{' '}
                        {watch('date') ? new Date(watch('date')).toLocaleDateString() : 'Not set'}
                      </Text>
                    </HStack>

                    {selectedProduct && (
                      <HStack>
                        <Icon as={FaInfoCircle} color="green.600" />
                        <Text>
                          <Text as="span" fontWeight="semibold">
                            Expected harvest:
                          </Text>{' '}
                          {getCropGrowthPeriod(selectedProduct.label).season}
                        </Text>
                      </HStack>
                    )}

                    <HStack>
                      <Icon as={FaSeedling} color="green.600" />
                      <Text>
                        <Text as="span" fontWeight="semibold">
                          Plants:
                        </Text>{' '}
                        {watch('numberOfPlants') || 'To be determined'}
                      </Text>
                    </HStack>
                  </SimpleGrid>

                  <Divider my={4} />

                  <Text fontSize="sm" color="green.600" textAlign="center">
                    🌱 Your production will be ready to track events and progress after creation
                  </Text>
                </Box>

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}
                  >
                    Back to Enhanced Tracking
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={onCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      type="submit"
                      isLoading={isLoading}
                      loadingText={isEdit ? 'Updating...' : 'Creating...'}
                      leftIcon={<FaCheckCircle />}
                    >
                      {isEdit ? 'Update Production' : 'Start Blockchain-Verified Production'}
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
