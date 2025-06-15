import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Icon,
  Badge,
  useColorModeValue,
  Divider,
  Alert,
  AlertIcon,
  SimpleGrid,
  Flex,
  Container,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast
} from '@chakra-ui/react';
import {
  FaRocket,
  FaWrench,
  FaClock,
  FaCheckCircle,
  FaBuilding,
  FaMapMarkerAlt,
  FaLeaf,
  FaChartLine,
  FaUsers,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaChevronRight,
  FaChevronLeft,
  FaSeedling,
  FaWater,
  FaRecycle,
  FaBolt,
  FaBug,
  FaGlobe,
  FaIdCard,
  FaStore,
  FaAppleAlt
} from 'react-icons/fa';
import { GiCorn, GiTreeBranch } from 'react-icons/gi';
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
} from '../../../../components/Design';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, boolean, number, array } from 'zod';
// @ts-ignore: JS module in TS file
import { useCreateCompanyMutation } from 'store/api/companyApi';
import { setCompany } from 'store/features/companySlice';
// @ts-ignore: JS module in TS file
import { setUserCompany } from 'store/features/userSlice';
import BoxBackground from '../components/BoxBackground';
// @ts-ignore: JSX component in TS file
import NewCompany from '../components/forms/NewCompany';

// Company validation schema
const companySchema = object({
  name: string().min(1, 'Company name is required'),
  tradename: string().optional(),
  email: string().email('Invalid email address'),
  phone: string().optional(),
  address: string().optional(),
  city: string().optional(),
  state: string().optional(),
  country: string().optional(),
  zipCode: string().optional(),
  website: string().url('Invalid website URL').optional().or(string().length(0)),
  description: string().optional(),
  fiscalId: string().optional(),
  facebook: string().url('Invalid Facebook URL').optional().or(string().length(0)),
  instagram: string().url('Invalid Instagram URL').optional().or(string().length(0)),
  certifications: string().optional(),
  employeeCount: number().min(1).optional(),
  isActive: boolean().optional(),
  industry: string().optional(),
  primaryCrop: string().min(1, 'Please select your primary crop'),
  sustainabilityGoals: array(string()).optional()
});

// CompanyFormData interface (for reference):
// name, tradename, email, phone, address, country, state, city, zipCode,
// website, description, employeeCount, isActive, industry, fiscalId,
// facebook, instagram, certifications, primaryCrop, sustainabilityGoals

// Crop Templates with carbon benchmarks and proper React icons
const CROP_TEMPLATES = [
  {
    id: 'citrus',
    title: 'Citrus Fruits',
    description: 'Oranges, lemons, limes, grapefruits',
    icon: FaAppleAlt, // Using apple icon as closest to citrus
    region: 'California',
    carbonBenchmark: '2.1 kg CO₂/kg',
    seasonality: 'Year-round harvest',
    industry: 'Fruit Production',
    sustainabilityTips: [
      'Drip irrigation reduces water usage by 30%',
      'Integrated pest management cuts pesticide use',
      'Cover crops improve soil carbon sequestration'
    ],
    recommendedGoals: ['water_conservation', 'carbon_reduction', 'soil_health']
  },
  {
    id: 'almonds',
    title: 'Almonds',
    description: 'Tree nuts with high water requirements',
    icon: GiTreeBranch, // Tree branch icon for tree nuts
    region: 'California',
    carbonBenchmark: '3.2 kg CO₂/kg',
    seasonality: 'August-October harvest',
    industry: 'Fruit Production',
    sustainabilityTips: [
      'Precision irrigation saves 20% water',
      'Bee-friendly practices support pollination',
      'Hull and shell recycling reduces waste'
    ],
    recommendedGoals: ['water_conservation', 'biodiversity', 'waste_reduction']
  },
  {
    id: 'soybeans',
    title: 'Soybeans',
    description: 'Nitrogen-fixing legume crop',
    icon: FaSeedling, // Seedling icon for soybeans
    region: 'Midwest',
    carbonBenchmark: '0.8 kg CO₂/kg',
    seasonality: 'September-November harvest',
    industry: 'Grain & Cereal Production',
    sustainabilityTips: [
      'No-till farming preserves soil carbon',
      'Natural nitrogen fixation reduces fertilizer',
      'Crop rotation improves soil health'
    ],
    recommendedGoals: ['soil_health', 'carbon_reduction', 'biodiversity']
  },
  {
    id: 'corn',
    title: 'Corn',
    description: 'Field corn and sweet corn varieties',
    icon: GiCorn, // Corn icon from game-icons
    region: 'Midwest',
    carbonBenchmark: '1.1 kg CO₂/kg',
    seasonality: 'September-November harvest',
    industry: 'Grain & Cereal Production',
    sustainabilityTips: [
      'Variable rate fertilizer application',
      'Cover crops prevent soil erosion',
      'Precision planting optimizes yields'
    ],
    recommendedGoals: ['soil_health', 'carbon_reduction', 'renewable_energy']
  }
];

// Sustainability Goals
const SUSTAINABILITY_GOALS = [
  {
    id: 'carbon_reduction',
    title: 'Reduce Carbon Footprint',
    description: 'Lower greenhouse gas emissions',
    icon: FaLeaf,
    color: 'green'
  },
  {
    id: 'water_conservation',
    title: 'Water Conservation',
    description: 'Optimize water usage efficiency',
    icon: FaWater,
    color: 'blue'
  },
  {
    id: 'soil_health',
    title: 'Soil Health Improvement',
    description: 'Enhance soil quality and fertility',
    icon: FaSeedling,
    color: 'orange'
  },
  {
    id: 'biodiversity',
    title: 'Biodiversity Enhancement',
    description: 'Support ecosystem diversity',
    icon: FaBug,
    color: 'purple'
  },
  {
    id: 'waste_reduction',
    title: 'Waste Reduction',
    description: 'Minimize agricultural waste',
    icon: FaRecycle,
    color: 'teal'
  },
  {
    id: 'renewable_energy',
    title: 'Renewable Energy',
    description: 'Adopt clean energy solutions',
    icon: FaBolt,
    color: 'yellow'
  }
];

function AddCompany({ isEdit = false }) {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.user);
  const [currentStep, setCurrentStep] = useState(0);
  const toast = useToast();

  console.log('🏢 AddCompany: Component rendered', { isEdit, currentUser: currentUser?.id });

  // @ts-ignore: Mutation hook
  const [
    createCompany,
    { data: dataCompany, isSuccess: isSuccessCompany, isLoading, error: mutationError }
  ] = useCreateCompanyMutation();

  console.log('🏢 AddCompany: Mutation state', {
    isSuccessCompany,
    isLoading,
    hasData: !!dataCompany,
    dataCompany,
    mutationError
  });

  // Define steps for stepper
  const steps = [
    { title: 'Crop Focus', description: 'Select your primary crop', icon: FaSeedling },
    { title: 'Company Info', description: 'Basic company details', icon: FaBuilding },
    { title: 'Location', description: 'Address & contact', icon: FaMapMarkerAlt },
    { title: 'Sustainability', description: 'Goals & practices', icon: FaLeaf }
  ];

  const methods = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      isActive: true,
      employeeCount: 1,
      sustainabilityGoals: [],
      country: 'US' // Default to US for agricultural focus
    }
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors, isValid }
  } = methods;

  const selectedCrop = watch('primaryCrop');
  const selectedCropTemplate = CROP_TEMPLATES.find((crop) => crop.id === selectedCrop);
  const sustainabilityGoals = watch('sustainabilityGoals') || [];
  const currentDescription = watch('description');

  // Add useEffect to debug description changes
  useEffect(() => {
    console.log('🔍 Description field changed:', {
      currentDescription,
      selectedCrop,
      selectedCropTemplate: selectedCropTemplate?.title
    });
  }, [currentDescription, selectedCrop, selectedCropTemplate]);

  const handleFormSubmit = async (data) => {
    console.log('🏢 AddCompany: handleSubmit called with data:', data);
    console.log('🏢 AddCompany: currentUser for owner:', currentUser);

    if (!currentUser || !currentUser.id) {
      console.error('🏢 AddCompany: No authenticated user found!');
      console.error('🏢 AddCompany: currentUser state:', currentUser);
      return;
    }

    // Debug: Check current form values using watch
    const currentFormValues = {
      name: watch('name'),
      tradename: watch('tradename'),
      email: watch('email'),
      phone: watch('phone'),
      address: watch('address'),
      city: watch('city'),
      state: watch('state'),
      country: watch('country'),
      zipCode: watch('zipCode'),
      website: watch('website'),
      description: watch('description'),
      fiscalId: watch('fiscalId'),
      facebook: watch('facebook'),
      instagram: watch('instagram'),
      certifications: watch('certifications'),
      employeeCount: watch('employeeCount'),
      isActive: watch('isActive'),
      industry: watch('industry'),
      primaryCrop: watch('primaryCrop'),
      sustainabilityGoals: watch('sustainabilityGoals')
    };

    console.log('🏢 AddCompany: Current form values (watch):', currentFormValues);

    // Log all form fields collected
    console.log('🏢 AddCompany: Form fields collected (data param):', {
      name: data.name,
      tradename: data.tradename,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zipCode: data.zipCode,
      website: data.website,
      description: data.description,
      fiscalId: data.fiscalId,
      facebook: data.facebook,
      instagram: data.instagram,
      certifications: data.certifications,
      employeeCount: data.employeeCount,
      isActive: data.isActive,
      industry: data.industry,
      primaryCrop: data.primaryCrop,
      sustainabilityGoals: data.sustainabilityGoals
    });

    // Transform form data to match backend API field names
    const submitData = {
      name: data.name,
      tradename: data.tradename || '', // Ensure empty string instead of undefined
      contact_email: data.email, // email -> contact_email
      contact_phone: data.phone || '', // phone -> contact_phone
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || 'US', // Include country field
      website: data.website || '',
      description: data.description || '', // Make sure description is properly captured
      fiscal_id: data.fiscalId || '', // fiscalId -> fiscal_id
      facebook: data.facebook || '', // Include facebook field
      instagram: data.instagram || '', // Include instagram field
      certifications: data.certifications || '', // Include certifications field
      owner: currentUser.id,
      // Additional fields that could be useful for backend
      zip_code: data.zipCode || '', // Include ZIP code
      employee_count: data.employeeCount || 1, // Include employee count
      industry: data.industry || '', // Include industry
      is_active: data.isActive !== undefined ? data.isActive : true, // Include active status
      // ✅ NEW: Include Step 4 sustainability data as JSON string
      sustainability_metadata: JSON.stringify({
        primaryCrop: data.primaryCrop,
        sustainabilityGoals: data.sustainabilityGoals || [],
        carbonBenchmark: selectedCropTemplate?.carbonBenchmark,
        region: selectedCropTemplate?.region,
        seasonality: selectedCropTemplate?.seasonality
      })
    };

    console.log('🏢 AddCompany: Transformed submit data:', submitData);
    console.log('🏢 AddCompany: Fields that might not be supported by backend:', {
      zip_code: submitData.zip_code,
      employee_count: submitData.employee_count,
      industry: submitData.industry,
      is_active: submitData.is_active,
      sustainability_metadata: submitData.sustainability_metadata,
      primaryCrop: data.primaryCrop,
      sustainabilityGoals: data.sustainabilityGoals
    });

    // Debug Step 4 sustainability data specifically
    console.log('🏢 AddCompany: Step 4 Sustainability Data:', {
      primaryCrop: data.primaryCrop,
      sustainabilityGoals: data.sustainabilityGoals,
      selectedCropTemplate: selectedCropTemplate?.title,
      carbonBenchmark: selectedCropTemplate?.carbonBenchmark,
      recommendedGoals: selectedCropTemplate?.recommendedGoals,
      sustainabilityMetadata: submitData.sustainability_metadata
    });

    try {
      console.log('🏢 AddCompany: Calling createCompany mutation...');
      const result = await createCompany(submitData).unwrap();
      console.log('🏢 AddCompany: createCompany succeeded:', result);

      // ✅ NEW: Compare sent vs received data
      console.log('🔍 AddCompany: Data comparison analysis:');
      console.log('📤 Sent to backend:', submitData);
      console.log('📥 Received from backend:', result);

      // Check which fields are missing in response
      const sentFields = Object.keys(submitData);
      const receivedFields = Object.keys(result);
      const missingInResponse = sentFields.filter((field) => !receivedFields.includes(field));
      const extraInResponse = receivedFields.filter((field) => !sentFields.includes(field));

      console.log('❌ Fields sent but not in response:', missingInResponse);
      console.log('➕ Extra fields in response:', extraInResponse);
      console.log('🔍 Specific field analysis:', {
        fiscal_id: { sent: submitData.fiscal_id, received: result.fiscal_id },
        zip_code: { sent: submitData.zip_code, received: result.zip_code },
        employee_count: { sent: submitData.employee_count, received: result.employee_count },
        industry: { sent: submitData.industry, received: result.industry },
        is_active: { sent: submitData.is_active, received: result.is_active },
        sustainability_metadata: {
          sent: submitData.sustainability_metadata,
          received: result.sustainability_metadata,
          parsed: submitData.sustainability_metadata
            ? JSON.parse(submitData.sustainability_metadata)
            : null
        }
      });
    } catch (error) {
      console.error('🏢 AddCompany: createCompany failed:', error);
      console.error('🏢 AddCompany: Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
    }
  };

  // Handle successful company creation with useEffect like the original form
  useEffect(() => {
    console.log('🏢 AddCompany: useEffect triggered', {
      isSuccessCompany,
      hasDataCompany: !!dataCompany,
      dataCompany
    });

    if (isSuccessCompany && dataCompany) {
      console.log('🏢 AddCompany: Processing successful company creation');
      console.log('🏢 AddCompany: Company data:', dataCompany);

      dispatch(setCompany(dataCompany));
      const { id, name } = dataCompany;
      dispatch(setUserCompany({ id, name }));

      console.log('🏢 AddCompany: Dispatched Redux actions, navigating to pricing...');
      console.log(
        '🏢 AddCompany: Navigation URL:',
        `/admin/dashboard/pricing?new_company=true&company_id=${id}`
      );

      // Redirect to pricing page for new companies
      navigate(`/admin/dashboard/pricing?new_company=true&company_id=${id}`);
    }
  }, [isSuccessCompany, dataCompany, dispatch, navigate]);

  const handleCancel = () => {
    console.log('🏢 AddCompany: handleCancel called');
    navigate('/admin/dashboard');
  };

  // Step validation
  const isStepComplete = (step) => {
    const name = watch('name');
    const email = watch('email');
    const primaryCrop = watch('primaryCrop');
    const hasErrors = Object.keys(errors).length > 0;

    switch (step) {
      case 0:
        return !!primaryCrop;
      case 1:
        return !!name && !!email && !hasErrors;
      case 2:
        return true; // Location is optional
      case 3:
        return true; // Sustainability goals are optional
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

  const handleCropSelect = (cropId) => {
    console.log('🌱 handleCropSelect: Called with cropId:', cropId);
    setValue('primaryCrop', cropId);
    const cropTemplate = CROP_TEMPLATES.find((crop) => crop.id === cropId);
    console.log('🌱 handleCropSelect: Found crop template:', cropTemplate);

    if (cropTemplate) {
      // Auto-set industry based on crop
      setValue('industry', cropTemplate.industry);
      console.log('🌱 handleCropSelect: Set industry to:', cropTemplate.industry);

      // Pre-fill description with crop-specific info
      const autoDescription = `Agricultural company specializing in ${cropTemplate.title.toLowerCase()} production in the ${
        cropTemplate.region
      } region. We focus on sustainable farming practices and carbon footprint reduction.`;

      setValue('description', autoDescription);
      console.log('🌱 handleCropSelect: Set description to:', autoDescription);

      // Auto-select recommended sustainability goals
      setValue('sustainabilityGoals', cropTemplate.recommendedGoals);
      console.log(
        '🌱 handleCropSelect: Set sustainability goals to:',
        cropTemplate.recommendedGoals
      );

      // Force form to re-render and validate to show the changes
      trigger(['description', 'industry', 'sustainabilityGoals']).then(() => {
        console.log('🌱 handleCropSelect: Form triggered successfully');
        console.log('🌱 handleCropSelect: Current form values after trigger:', {
          primaryCrop: watch('primaryCrop'),
          industry: watch('industry'),
          description: watch('description'),
          sustainabilityGoals: watch('sustainabilityGoals')
        });
      });
    }
  };

  const handleSustainabilityToggle = (goalId) => {
    const currentGoals = sustainabilityGoals || [];
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter((id) => id !== goalId)
      : [...currentGoals, goalId];
    setValue('sustainabilityGoals', newGoals);
  };

  // Custom sustainability goal selection component
  const SustainabilityGoalCard = ({ goal, isSelected, onToggle }) => (
    <Box
      as="button"
      type="button"
      onClick={() => onToggle(goal.id)}
      p={4}
      borderRadius="lg"
      border="2px solid"
      borderColor={isSelected ? `${goal.color}.500` : 'gray.200'}
      bg={isSelected ? `${goal.color}.50` : 'white'}
      _hover={{
        borderColor: isSelected ? `${goal.color}.600` : `${goal.color}.300`,
        bg: isSelected ? `${goal.color}.100` : `${goal.color}.50`,
        transform: 'translateY(-2px)',
        shadow: 'md'
      }}
      transition="all 0.2s"
      cursor="pointer"
      position="relative"
      w="full"
    >
      {isSelected && (
        <Box
          position="absolute"
          top={2}
          right={2}
          bg={`${goal.color}.500`}
          color="white"
          borderRadius="full"
          p={1}
        >
          <Icon as={FaCheckCircle} boxSize={3} />
        </Box>
      )}

      <VStack spacing={3} align="center">
        <Box
          bg={isSelected ? `${goal.color}.500` : `${goal.color}.100`}
          color={isSelected ? 'white' : `${goal.color}.600`}
          p={3}
          borderRadius="full"
        >
          <Icon as={goal.icon} boxSize={6} />
        </Box>

        <VStack spacing={1} align="center">
          <Text
            fontWeight="bold"
            fontSize="sm"
            color={isSelected ? `${goal.color}.700` : 'gray.700'}
            textAlign="center"
          >
            {goal.title}
          </Text>
          <Text
            fontSize="xs"
            color={isSelected ? `${goal.color}.600` : 'gray.500'}
            textAlign="center"
          >
            {goal.description}
          </Text>
        </VStack>
      </VStack>
    </Box>
  );

  if (isEdit) {
    console.log('🏢 AddCompany: Rendering edit mode');
    return (
      <BoxBackground
        title={intl.formatMessage({ id: 'app.editCompany' })}
        subtitle={intl.formatMessage({ id: 'app.modifyForm' })}
      >
        <NewCompany />
      </BoxBackground>
    );
  }

  return (
    <StandardPage
      title="Set Up Your Agricultural Company"
      description="Create your company profile with crop-specific insights and sustainability tracking"
      showBackButton
      onBack={handleCancel}
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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Step 0: Crop Selection */}
          {currentStep === 0 && (
            <StandardCard
              title="What's Your Primary Crop?"
              subtitle="Choose your main agricultural focus to get personalized insights and benchmarks"
            >
              <VStack spacing={6} align="stretch">
                <StandardSelectionGrid
                  options={CROP_TEMPLATES.map((crop) => ({
                    id: crop.id,
                    title: crop.title,
                    description: `${crop.description} • ${crop.region}`,
                    icon: crop.icon,
                    value: crop.id
                  }))}
                  selectedValue={selectedCrop || ''}
                  onSelect={handleCropSelect}
                  columns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                />

                {selectedCropTemplate && (
                  <VStack spacing={4}>
                    <StandardAlert
                      status="success"
                      title={`${selectedCropTemplate.title} Selected`}
                      description={`Carbon benchmark: ${selectedCropTemplate.carbonBenchmark} • ${selectedCropTemplate.seasonality}`}
                    />

                    <Box
                      bg="green.50"
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="green.200"
                      w="full"
                    >
                      <Text fontWeight="bold" color="green.700" mb={3}>
                        🌱 Smart Setup Benefits:
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                        <HStack spacing={2}>
                          <Icon as={FaCheckCircle} color="green.500" boxSize={3} />
                          <Text fontSize="sm" color="green.600">
                            Industry auto-filled: {selectedCropTemplate.industry}
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Icon as={FaCheckCircle} color="green.500" boxSize={3} />
                          <Text fontSize="sm" color="green.600">
                            {selectedCropTemplate.recommendedGoals.length} sustainability goals
                            pre-selected
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Icon as={FaCheckCircle} color="green.500" boxSize={3} />
                          <Text fontSize="sm" color="green.600">
                            Carbon benchmarks included
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Icon as={FaCheckCircle} color="green.500" boxSize={3} />
                          <Text fontSize="sm" color="green.600">
                            Company description generated
                          </Text>
                        </HStack>
                      </SimpleGrid>
                    </Box>
                  </VStack>
                )}

                {/* Navigation */}
                <HStack spacing={3} justify="flex-end" pt={4}>
                  <StandardButton variant="outline" onClick={handleCancel}>
                    Cancel
                  </StandardButton>
                  <StandardButton
                    onClick={nextStep}
                    rightIcon={<FaChevronRight />}
                    disabled={!isStepComplete(0)}
                  >
                    Continue to Company Info
                  </StandardButton>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <StandardCard
              title="Company Information"
              subtitle={
                selectedCropTemplate
                  ? `${selectedCropTemplate.title} farming company details`
                  : 'Basic details about your agricultural company'
              }
            >
              <VStack spacing={6} align="stretch">
                {selectedCropTemplate && (
                  <Flex justify="space-between" align="center" bg="gray.50" p={3} borderRadius="lg">
                    <HStack spacing={2}>
                      <Icon as={selectedCropTemplate.icon} fontSize="lg" color="green.500" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" fontSize="sm">
                          {selectedCropTemplate.title} Focus
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          Industry auto-filled as "{selectedCropTemplate.industry}"
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme="green" variant="subtle">
                      Smart Setup
                    </Badge>
                  </Flex>
                )}

                {/* Company Name & Trade Name */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Company Name"
                    required
                    error={errors.name?.message}
                    helpText="Enter your company's legal name"
                  >
                    <StandardInput
                      {...methods.register('name')}
                      placeholder="e.g., Green Valley Farms LLC"
                      leftElement={<Icon as={FaBuilding} color="gray.400" />}
                    />
                  </StandardField>

                  <StandardField
                    label="Trade Name"
                    error={errors.tradename?.message}
                    helpText="Business name if different from legal name"
                  >
                    <StandardInput
                      {...methods.register('tradename')}
                      placeholder="e.g., Green Valley Organics"
                      leftElement={<Icon as={FaStore} color="gray.400" />}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Email & Phone */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Email Address"
                    required
                    error={errors.email?.message}
                    helpText="Primary contact email for the company"
                  >
                    <StandardInput
                      {...methods.register('email')}
                      type="email"
                      placeholder="contact@greenvalleyfarms.com"
                      leftElement={<Icon as={FaEnvelope} color="gray.400" />}
                    />
                  </StandardField>

                  <StandardField
                    label="Phone Number"
                    error={errors.phone?.message}
                    helpText="Company contact phone number"
                  >
                    <StandardInput
                      {...methods.register('phone')}
                      type="tel"
                      placeholder="(555) 123-4567"
                      leftElement={<Icon as={FaPhone} color="gray.400" />}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Website & Fiscal ID */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Website"
                    error={errors.website?.message}
                    helpText="Company website URL"
                  >
                    <StandardInput
                      {...methods.register('website')}
                      type="url"
                      placeholder="https://www.greenvalleyfarms.com"
                      leftElement={<Icon as={FaGlobe} color="gray.400" />}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Industry & Employee Count */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Industry Type"
                    error={errors.industry?.message}
                    helpText="Primary agricultural focus"
                  >
                    <StandardSelect
                      {...methods.register('industry')}
                      value={watch('industry') || ''}
                    >
                      <option value="">Select industry...</option>
                      <option value="Fruit Production">Fruit Production</option>
                      <option value="Vegetable Production">Vegetable Production</option>
                      <option value="Grain & Cereal Production">Grain & Cereal Production</option>
                      <option value="Livestock">Livestock</option>
                      <option value="Dairy Farming">Dairy Farming</option>
                      <option value="Organic Farming">Organic Farming</option>
                      <option value="Mixed Agriculture">Mixed Agriculture</option>
                    </StandardSelect>
                  </StandardField>

                  <StandardField
                    label="Employee Count"
                    error={errors.employeeCount?.message}
                    helpText="Approximate number of employees"
                  >
                    <NumberInput
                      value={watch('employeeCount') || 1}
                      onChange={(_, num) => setValue('employeeCount', num || 1)}
                      min={1}
                    >
                      <NumberInputField borderRadius="lg" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </StandardField>
                </SimpleGrid>

                {/* Company Description */}
                <StandardField
                  label="Company Description"
                  error={errors.description?.message}
                  helpText={
                    selectedCropTemplate &&
                    currentDescription?.includes('Agricultural company specializing')
                      ? '✨ Auto-generated based on your crop selection. Feel free to customize it!'
                      : 'Describe your agricultural operations, products, and mission'
                  }
                >
                  <Controller
                    name="description"
                    control={methods.control}
                    render={({ field }) => (
                      <StandardTextarea
                        {...field}
                        placeholder="Tell us about your agricultural company, what you produce, your farming practices, and your sustainability goals..."
                        rows={4}
                        bg={
                          selectedCropTemplate &&
                          currentDescription?.includes('Agricultural company specializing')
                            ? 'green.50'
                            : 'white'
                        }
                        borderColor={
                          selectedCropTemplate &&
                          currentDescription?.includes('Agricultural company specializing')
                            ? 'green.200'
                            : 'gray.200'
                        }
                      />
                    )}
                  />
                  {selectedCropTemplate &&
                    currentDescription?.includes('Agricultural company specializing') && (
                      <Text fontSize="xs" color="green.600" mt={1}>
                        💡 This description was automatically generated. You can edit it to better
                        reflect your company.
                      </Text>
                    )}
                </StandardField>

                {/* Social Media & Certifications */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Facebook Page"
                    error={errors.facebook?.message}
                    helpText="Facebook business page URL (optional)"
                  >
                    <StandardInput
                      {...methods.register('facebook')}
                      type="url"
                      placeholder="https://facebook.com/yourcompany"
                      leftElement={<Icon as={FaGlobe} color="gray.400" />}
                    />
                  </StandardField>

                  <StandardField
                    label="Instagram Profile"
                    error={errors.instagram?.message}
                    helpText="Instagram business profile URL (optional)"
                  >
                    <StandardInput
                      {...methods.register('instagram')}
                      type="url"
                      placeholder="https://instagram.com/yourcompany"
                      leftElement={<Icon as={FaGlobe} color="gray.400" />}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Certifications */}
                <StandardField
                  label="Certifications"
                  error={errors.certifications?.message}
                  helpText="List any agricultural certifications (e.g., Organic, Fair Trade, USDA, etc.)"
                >
                  <StandardTextarea
                    {...methods.register('certifications')}
                    placeholder="e.g., USDA Organic, Fair Trade Certified, Rainforest Alliance, etc."
                    rows={2}
                  />
                </StandardField>

                {/* Active Status */}
                <StandardField
                  label="Company Status"
                  helpText="Activate the company to start using Trazo services"
                >
                  <HStack>
                    <Switch {...methods.register('isActive')} colorScheme="green" size="md" />
                    <Text fontSize="sm" color="gray.600">
                      {watch('isActive') ? 'Active' : 'Inactive'}
                    </Text>
                  </HStack>
                </StandardField>

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}
                  >
                    Back to Crop Selection
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={handleCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      onClick={nextStep}
                      rightIcon={<FaChevronRight />}
                      disabled={!isStepComplete(1)}
                    >
                      Continue to Location
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 2: Location Information */}
          {currentStep === 2 && (
            <StandardCard
              title="Location Details"
              subtitle="Where is your agricultural operation based?"
            >
              <VStack spacing={6} align="stretch">
                {/* Address */}
                <StandardField
                  label="Street Address"
                  error={errors.address?.message}
                  helpText="Physical address of your main operation"
                >
                  <StandardInput
                    {...methods.register('address')}
                    placeholder="123 Farm Road"
                    leftElement={<Icon as={FaMapMarkerAlt} color="gray.400" />}
                  />
                </StandardField>

                {/* City & State */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField label="City" error={errors.city?.message}>
                    <StandardInput {...methods.register('city')} placeholder="Farmington" />
                  </StandardField>

                  <StandardField label="State/Province" error={errors.state?.message}>
                    <StandardInput
                      {...methods.register('state')}
                      placeholder={
                        selectedCropTemplate?.region === 'California'
                          ? 'California'
                          : selectedCropTemplate?.region === 'Midwest'
                          ? 'Iowa'
                          : 'State/Province'
                      }
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Country & Zip */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField label="Country" error={errors.country?.message}>
                    <StandardSelect {...methods.register('country')}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="MX">Mexico</option>
                      <option value="OTHER">Other</option>
                    </StandardSelect>
                  </StandardField>

                  <StandardField label="ZIP/Postal Code" error={errors.zipCode?.message}>
                    <StandardInput {...methods.register('zipCode')} placeholder="12345" />
                  </StandardField>
                </SimpleGrid>

                {/* Business Verification (Optional) */}
                <Box>
                  <Text fontWeight="bold" fontSize="md" mb={3} color="gray.700">
                    Business Verification (Optional)
                  </Text>
                  <StandardField
                    label="Tax ID / RUT"
                    error={errors.fiscalId?.message}
                    helpText="Tax identification number - useful for B2B relationships and compliance reporting"
                  >
                    <StandardInput
                      {...methods.register('fiscalId')}
                      placeholder="12-3456789-0"
                      leftElement={<Icon as={FaIdCard} color="gray.400" />}
                    />
                  </StandardField>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    💡 This helps verify your business for larger buyers and regulatory compliance.
                    You can add this later if needed.
                  </Text>
                </Box>

                {/* Location Info Alert */}
                <StandardAlert
                  status="info"
                  title="Location Benefits"
                  description="Providing location information helps us offer region-specific sustainability insights and regulatory compliance assistance."
                />

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}
                  >
                    Back to Company Info
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={handleCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton onClick={nextStep} rightIcon={<FaChevronRight />}>
                      Continue to Sustainability
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 3: Sustainability Goals */}
          {currentStep === 3 && (
            <StandardCard
              title="Sustainability Goals"
              subtitle="Review and customize your sustainability objectives"
            >
              <VStack spacing={6} align="stretch">
                {selectedCropTemplate && (
                  <Box
                    bg="blue.50"
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="blue.200"
                  >
                    <Text fontWeight="bold" color="blue.700" mb={2}>
                      🎯 Pre-selected for {selectedCropTemplate.title}:
                    </Text>
                    <Text fontSize="sm" color="blue.600" mb={3}>
                      Based on your crop selection, we've recommended the most impactful
                      sustainability goals for your operation.
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {selectedCropTemplate.recommendedGoals.map((goalId) => {
                        const goal = SUSTAINABILITY_GOALS.find((g) => g.id === goalId);
                        return goal ? (
                          <Badge key={goalId} colorScheme="blue" variant="subtle">
                            {goal.title}
                          </Badge>
                        ) : null;
                      })}
                    </HStack>
                  </Box>
                )}

                {/* Custom Sustainability Goals Grid */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {SUSTAINABILITY_GOALS.map((goal) => (
                    <SustainabilityGoalCard
                      key={goal.id}
                      goal={goal}
                      isSelected={sustainabilityGoals.includes(goal.id)}
                      onToggle={handleSustainabilityToggle}
                    />
                  ))}
                </SimpleGrid>

                {sustainabilityGoals.length > 0 && (
                  <StandardAlert
                    status="success"
                    title={`${sustainabilityGoals.length} Goals Selected`}
                    description="We'll help you track progress and provide actionable insights to achieve these goals."
                  />
                )}

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}
                  >
                    Back to Location
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={handleCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Creating Company..."
                      leftIcon={<FaRocket />}
                    >
                      Create Company
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
}

export default AddCompany;
