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
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Textarea,
  Button,
  Badge,
  Progress,
  Flex,
  IconButton,
  Image,
  useColorModeValue,
  Grid
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
  StandardStepper
} from '../Design';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, boolean, number, array } from 'zod';
import { useIntl } from 'react-intl';
import {
  FaBuilding,
  FaMapMarkedAlt,
  FaPhone,
  FaEnvelope,
  FaCertificate,
  FaLeaf,
  FaUsers,
  FaTractor,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
  FaPlus,
  FaArrowLeft,
  FaArrowRight,
  FaGlobe,
  FaCloudUploadAlt,
  FaTrash
} from 'react-icons/fa';
import { MdCheck, MdLocationOn, MdDescription, MdSettings, MdImage } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import { CloseIcon } from '@chakra-ui/icons';

// Services
import { useFileUpload } from '../../services/uploadService';

// Form Schema
const establishmentSchema = object({
  name: string().min(1, 'Establishment name is required').max(100, 'Name too long'),
  email: string()
    .refine((val) => !val || val.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Invalid email format'
    })
    .optional(),
  phone: string().optional(),
  address: string().optional(),
  country: string().optional(),
  state: string().optional(),
  city: string().optional(),
  zone: string().optional(),
  zipCode: string().optional(),
  description: string().optional(),
  about: string().optional(),
  main_activities: string().optional(),
  location_highlights: string().optional(),
  custom_message: string().optional(),
  facebook: string().optional(),
  instagram: string().optional(),
  establishmentType: string().optional(),
  farmingMethod: string().optional(),
  totalAcreage: number().min(0, 'Acreage must be positive').optional(),
  cropsGrown: array(string()).optional(),
  certifications: array(string()).optional(),
  employeeCount: number().optional(),
  yearEstablished: number()
    .min(1800, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .optional(),
  sustainabilityPractices: array(string()).optional(),
  isActive: boolean().default(true),
  type: string().optional(),
  latitude: number().optional(),
  longitude: number().optional(),
  // Additional contact fields for backend compatibility
  contact_person: string().optional(),
  contact_phone: string().optional(),
  contact_email: string().optional(),
  images: array(string()).optional()
});

interface EstablishmentFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zone?: string;
  zipCode?: string;
  description?: string;
  about?: string;
  main_activities?: string;
  location_highlights?: string;
  custom_message?: string;
  facebook?: string;
  instagram?: string;
  establishmentType?: string;
  farmingMethod?: string;
  totalAcreage?: number;
  cropsGrown?: string[];
  certifications?: string[];
  employeeCount?: number;
  yearEstablished?: number;
  sustainabilityPractices?: string[];
  isActive: boolean;
  type?: string;
  latitude?: number;
  longitude?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  images?: string[];
}

interface StandardEstablishmentFormProps {
  onSubmit: (data: EstablishmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<EstablishmentFormData>;
  isLoading?: boolean;
  isEdit?: boolean;
  companyName?: string;
}

export const StandardEstablishmentForm: React.FC<StandardEstablishmentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEdit = false,
  companyName = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [newCrop, setNewCrop] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newPractice, setNewPractice] = useState('');
  const intl = useIntl();
  const toast = useToast();
  const { uploadMultipleFiles } = useFileUpload();

  // Image management state
  const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string }>>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Define steps for stepper - certifications moved to operations step
  const steps = [
    { title: 'Basic Info', description: 'Business details & contact', icon: FaBuilding },
    { title: 'Location', description: 'Address & coordinates', icon: FaMapMarkedAlt },
    { title: 'Operations', description: 'Farming, practices & certifications', icon: FaTractor },
    { title: 'Media', description: 'Images', icon: MdImage }
  ];

  const methods = useForm<EstablishmentFormData>({
    resolver: zodResolver(establishmentSchema),
    defaultValues: {
      isActive: true,
      cropsGrown: [],
      certifications: [],
      sustainabilityPractices: [],
      employeeCount: 0,
      totalAcreage: 0,
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
    }
  }, [initialData, reset, methods]);

  // Debug effect to monitor form values
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name) {
        console.log(
          `Form field changed: ${name} = ${value[name as keyof typeof value]} (type: ${type})`
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Debug effect to log all form values on step change
  useEffect(() => {
    const allValues = methods.getValues();
    console.log(`Step ${currentStep} loaded. All form values:`, allValues);
  }, [currentStep, methods]);

  // Initialize existing images on edit mode
  useEffect(() => {
    if (isEdit && initialData?.images) {
      const images = Array.isArray(initialData.images)
        ? initialData.images.map((img: any, index: number) => ({
            id: `existing-${index}`,
            url: typeof img === 'string' ? img : img?.url || String(img)
          }))
        : [];
      setExistingImages(images);
    }
  }, [isEdit, initialData?.images]);

  const onSubmitForm = async (data: EstablishmentFormData) => {
    try {
      // Upload any new images first
      if (newImages.length > 0) {
        await handleImageUpload();
      }

      // Include image management data
      const formDataWithImages = {
        ...data,
        uploaded_image_urls: uploadedImageUrls,
        images_to_delete: imagesToDelete,
        new_images: newImages.length > 0 ? newImages : undefined
      };

      await onSubmit(formDataWithImages);
      toast({
        title: isEdit ? 'Establishment Updated' : 'Establishment Created',
        description: `"${data.name}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save establishment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Step validation
  const isStepComplete = (step: number) => {
    const formData = watch();

    switch (step) {
      case 0:
        // Basic Info step: name is required and email must be valid if provided
        const hasName = !!formData.name?.trim();
        const emailError = errors.email;
        const nameError = errors.name;

        // Debug logging
        console.log('Step 0 validation:', {
          hasName,
          nameError,
          emailError,
          formData: {
            name: formData.name,
            email: formData.email
          },
          watchedName: watch('name'),
          formValues: methods.getValues()
        });

        return hasName && !nameError && !emailError;
      case 1:
        return true; // Location step has no required fields
      case 2:
        return true; // Operations step has no required fields
      case 3:
        return true; // Media step has no required fields
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

  // Helper functions for dynamic arrays
  const addCrop = () => {
    if (newCrop.trim()) {
      const currentCrops = watch('cropsGrown') || [];
      setValue('cropsGrown', [...currentCrops, newCrop.trim()]);
      setNewCrop('');
    }
  };

  const removeCrop = (index: number) => {
    const currentCrops = watch('cropsGrown') || [];
    setValue(
      'cropsGrown',
      currentCrops.filter((_, i) => i !== index)
    );
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      const currentCerts = watch('certifications') || [];
      setValue('certifications', [...currentCerts, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    const currentCerts = watch('certifications') || [];
    setValue(
      'certifications',
      currentCerts.filter((_, i) => i !== index)
    );
  };

  const addPractice = () => {
    if (newPractice.trim()) {
      const currentPractices = watch('sustainabilityPractices') || [];
      setValue('sustainabilityPractices', [...currentPractices, newPractice.trim()]);
      setNewPractice('');
    }
  };

  const removePractice = (index: number) => {
    const currentPractices = watch('sustainabilityPractices') || [];
    setValue(
      'sustainabilityPractices',
      currentPractices.filter((_, i) => i !== index)
    );
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);

    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 3000
      });
      return;
    }

    // Handle image upload before proceeding from media step
    if (currentStep === 3 && newImages.length > 0) {
      await handleImageUpload();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const formValues = methods.getValues();
      console.log(
        `Moving from step ${currentStep} to step ${currentStep - 1}. Current form values:`,
        formValues
      );
      setCurrentStep(currentStep - 1);
    }
  };

  // Image upload handlers with old form pattern
  const handleRemoveExistingImage = (imageId: string) => {
    const imageToRemove = existingImages.find((img) => img.id === imageId);
    if (imageToRemove) {
      setImagesToDelete((prev) => [...prev, imageToRemove.id]);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  };

  const handleRemoveNewImage = (file: File) => {
    setNewImages((prev) => prev.filter((f) => f !== file));
  };

  // Updated dropzone with proper accept format for v11.7.1
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const totalImages = existingImages.length + newImages.length + acceptedFiles.length;
      if (totalImages > 5) {
        toast({
          title: 'Too many images',
          description: 'Maximum 5 images allowed',
          status: 'warning',
          duration: 3000
        });
        return;
      }
      setNewImages((prev) => [...prev, ...acceptedFiles]);
    },
    accept: 'image/*',
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleImageUpload = async () => {
    if (newImages.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev: number) => Math.min(prev + 10, 90));
      }, 200);

      const urls = await uploadMultipleFiles(newImages);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedImageUrls((prev) => [...prev, ...urls]);
      setNewImages([]);

      toast({
        title: 'Upload successful',
        description: `${urls.length} image(s) uploaded successfully`,
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload images. Please try again.',
        status: 'error',
        duration: 5000
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Enhanced form submission
  const handleFormSubmit = async (data: EstablishmentFormData) => {
    // Include image management data
    const formDataWithImages = {
      ...data,
      uploaded_image_urls: uploadedImageUrls,
      images_to_delete: imagesToDelete,
      new_images: newImages
    };

    await onSubmitForm(formDataWithImages);
  };

  // Step validation
  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(step);
    const result = await methods.trigger(fieldsToValidate);
    return result;
  };

  const getFieldsForStep = (step: number): (keyof EstablishmentFormData)[] => {
    switch (step) {
      case 0:
        return ['name', 'email', 'phone'];
      case 1:
        return ['address', 'city', 'state', 'country'];
      case 2:
        return ['description'];
      case 3:
        return []; // Media step has no required validations
      default:
        return [];
    }
  };

  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  return (
    <StandardPage
      title={isEdit ? 'Edit Establishment' : 'Add New Establishment'}
      description={`${isEdit ? 'Update' : 'Register'} your agricultural establishment${
        companyName ? ` under ${companyName}` : ''
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
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <StandardCard
              title="Establishment Information"
              subtitle="Basic details, contact information, and social media presence">
              <VStack spacing={6} align="stretch">
                {/* Name & Type */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Establishment Name"
                    required
                    error={errors.name?.message}
                    helpText="Farm, ranch, or facility name">
                    <Controller
                      name="name"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g., Green Valley Farm"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>

                  <StandardField
                    label="Establishment Type"
                    error={errors.establishmentType?.message}
                    helpText="Primary type of agricultural operation">
                    <Controller
                      name="establishmentType"
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select type..."
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg">
                          <option value="crop_farm">Crop Farm</option>
                          <option value="livestock_ranch">Livestock Ranch</option>
                          <option value="dairy_farm">Dairy Farm</option>
                          <option value="orchard">Orchard</option>
                          <option value="vineyard">Vineyard</option>
                          <option value="greenhouse">Greenhouse</option>
                          <option value="aquaculture">Aquaculture</option>
                          <option value="mixed_operation">Mixed Operation</option>
                        </Select>
                      )}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Contact Information */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Email Address"
                    error={errors.email?.message}
                    helpText="Primary contact email">
                    <Controller
                      name="email"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="contact@greenvalleyfarm.com"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>

                  <StandardField
                    label="Phone Number"
                    error={errors.phone?.message}
                    helpText="Contact phone number">
                    <Controller
                      name="phone"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="tel"
                          placeholder="(555) 123-4567"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Social Media */}
                <Text fontSize="lg" fontWeight="semibold" color="gray.700" mt={6} mb={2}>
                  Social Media (Optional)
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Facebook Page"
                    error={errors.facebook?.message}
                    helpText="Facebook page URL">
                    <Controller
                      name="facebook"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://facebook.com/greenvalleyfarm"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>

                  <StandardField
                    label="Instagram Profile"
                    error={errors.instagram?.message}
                    helpText="Instagram profile URL">
                    <Controller
                      name="instagram"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="https://instagram.com/greenvalleyfarm"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Description */}
                <StandardField
                  label="Description"
                  error={errors.description?.message}
                  helpText="Describe your establishment, its history, and mission">
                  <Controller
                    name="description"
                    control={methods.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Tell us about your establishment, what you produce, your farming philosophy, and what makes your operation unique..."
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        minH="120px"
                        resize="vertical"
                      />
                    )}
                  />
                </StandardField>

                {/* Active Status */}
                <StandardField
                  label="Establishment Status"
                  helpText="Activate the establishment to start managing parcels and production">
                  <Controller
                    name="isActive"
                    control={methods.control}
                    render={({ field }) => (
                      <HStack>
                        <Switch
                          isChecked={field.value}
                          onChange={field.onChange}
                          colorScheme="green"
                          size="md"
                        />
                        <Text fontSize="sm" color="gray.600">
                          {field.value ? 'Active' : 'Inactive'}
                        </Text>
                      </HStack>
                    )}
                  />
                </StandardField>

                {/* Navigation */}
                <HStack spacing={3} justify="flex-end" pt={4}>
                  <StandardButton variant="outline" onClick={onCancel}>
                    Cancel
                  </StandardButton>
                  <StandardButton
                    onClick={nextStep}
                    rightIcon={<FaChevronRight />}
                    disabled={!isStepComplete(0)}>
                    Continue to Location
                  </StandardButton>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 1: Location Information */}
          {currentStep === 1 && (
            <StandardCard
              title="Location Details"
              subtitle="Physical address and geographic coordinates">
              <VStack spacing={6} align="stretch">
                {/* Address */}
                <StandardField
                  label="Street Address"
                  error={errors.address?.message}
                  helpText="Physical address of your establishment">
                  <Controller
                    name="address"
                    control={methods.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="123 Farm Road"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        size="lg"
                      />
                    )}
                  />
                </StandardField>

                {/* City & State */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField label="City" error={errors.city?.message}>
                    <Controller
                      name="city"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Farmington"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>

                  <StandardField label="State/Province" error={errors.state?.message}>
                    <Controller
                      name="state"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="California"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Country & Zip */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField label="Country" error={errors.country?.message}>
                    <Controller
                      name="country"
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select country..."
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg">
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="MX">Mexico</option>
                          <option value="OTHER">Other</option>
                        </Select>
                      )}
                    />
                  </StandardField>

                  <StandardField label="ZIP/Postal Code" error={errors.zipCode?.message}>
                    <Controller
                      name="zipCode"
                      control={methods.control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="12345"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg"
                        />
                      )}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Zone */}
                <StandardField
                  label="Zone/Area"
                  error={errors.zone?.message}
                  helpText="Geographic zone or area designation">
                  <Controller
                    name="zone"
                    control={methods.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., North Valley, Agricultural Zone A"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        size="lg"
                      />
                    )}
                  />
                </StandardField>

                {/* Precise Coordinates Section */}
                <Box mt={8}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
                    Precise Coordinates (Optional)
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Add exact GPS coordinates for precise location mapping. You can get these from
                    Google Maps or GPS devices.
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <StandardField
                      label="Latitude"
                      error={errors.latitude?.message}
                      helpText="Decimal degrees (e.g., 40.7128)">
                      <Controller
                        name="latitude"
                        control={methods.control}
                        render={({ field }) => (
                          <NumberInput
                            value={field.value || ''}
                            onChange={(_, num) => field.onChange(num)}
                            precision={6}>
                            <NumberInputField borderRadius="lg" placeholder="40.7128" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )}
                      />
                    </StandardField>

                    <StandardField
                      label="Longitude"
                      error={errors.longitude?.message}
                      helpText="Decimal degrees (e.g., -74.0060)">
                      <Controller
                        name="longitude"
                        control={methods.control}
                        render={({ field }) => (
                          <NumberInput
                            value={field.value || ''}
                            onChange={(_, num) => field.onChange(num)}
                            precision={6}>
                            <NumberInputField borderRadius="lg" placeholder="-74.0060" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        )}
                      />
                    </StandardField>
                  </SimpleGrid>
                </Box>

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}>
                    Back to Basic Info
                  </StandardButton>

                  <HStack spacing={3}>
                    <StandardButton variant="outline" onClick={onCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton onClick={nextStep} rightIcon={<FaChevronRight />}>
                      Continue to Operations
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 2: Operations Information */}
          {currentStep === 2 && (
            <StandardCard
              title="Operations & Practices"
              subtitle="Details about your farming operations">
              <VStack spacing={6} align="stretch">
                {/* Farming Method & Acreage */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Farming Method"
                    error={errors.farmingMethod?.message}
                    helpText="Primary farming approach">
                    <Controller
                      name="farmingMethod"
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Select method..."
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'green.400' }}
                          _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                          size="lg">
                          <option value="conventional">Conventional</option>
                          <option value="organic">Organic</option>
                          <option value="sustainable">Sustainable</option>
                          <option value="biodynamic">Biodynamic</option>
                          <option value="permaculture">Permaculture</option>
                          <option value="regenerative">Regenerative</option>
                        </Select>
                      )}
                    />
                  </StandardField>

                  <StandardField
                    label="Total Acreage"
                    error={errors.totalAcreage?.message}
                    helpText="Total land area in acres">
                    <Controller
                      name="totalAcreage"
                      control={methods.control}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value || 0}
                          onChange={(_, num) => field.onChange(num || 0)}>
                          <NumberInputField borderRadius="lg" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Employee Count & Year Established */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Employee Count"
                    error={errors.employeeCount?.message}
                    helpText="Number of employees">
                    <Controller
                      name="employeeCount"
                      control={methods.control}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value || 0}
                          onChange={(_, num) => field.onChange(num || 0)}>
                          <NumberInputField borderRadius="lg" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                  </StandardField>

                  <StandardField
                    label="Year Established"
                    error={errors.yearEstablished?.message}
                    helpText="When was the establishment founded">
                    <Controller
                      name="yearEstablished"
                      control={methods.control}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value || ''}
                          onChange={(_, num) => field.onChange(num)}
                          min={1800}
                          max={new Date().getFullYear()}>
                          <NumberInputField borderRadius="lg" placeholder="e.g., 1995" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      )}
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Crops Grown */}
                <StandardField label="Crops Grown" helpText="Add crops that you produce">
                  <Controller
                    name="cropsGrown"
                    control={methods.control}
                    render={({ field }) => (
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Input
                            value={newCrop}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setNewCrop(e.target.value);
                            }}
                            placeholder="e.g., Tomatoes, Corn, Apples"
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newCrop.trim()) {
                                  field.onChange([...(field.value || []), newCrop.trim()]);
                                  setNewCrop('');
                                }
                              }
                            }}
                            borderRadius="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: 'green.400' }}
                            _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                            size="lg"
                          />
                          <StandardButton
                            onClick={() => {
                              if (newCrop.trim()) {
                                field.onChange([...(field.value || []), newCrop.trim()]);
                                setNewCrop('');
                              }
                            }}
                            leftIcon={<FaPlus />}
                            size="sm">
                            Add
                          </StandardButton>
                        </HStack>
                        {field.value?.length ? (
                          <HStack spacing={2} flexWrap="wrap">
                            {field.value.map((crop, index) => (
                              <Tag key={index} size="md" variant="solid" colorScheme="green">
                                <TagLabel>{crop}</TagLabel>
                                <TagCloseButton
                                  onClick={(e) => {
                                    e.preventDefault();
                                    field.onChange(field.value.filter((_, i) => i !== index));
                                  }}
                                />
                              </Tag>
                            ))}
                          </HStack>
                        ) : null}
                      </VStack>
                    )}
                  />
                </StandardField>

                {/* Sustainability Practices */}
                <StandardField
                  label="Sustainability Practices"
                  helpText="Environmental and sustainability practices you follow">
                  <Controller
                    name="sustainabilityPractices"
                    control={methods.control}
                    render={({ field }) => (
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Input
                            value={newPractice}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setNewPractice(e.target.value);
                            }}
                            placeholder="e.g., Cover cropping, Water conservation, Solar power"
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newPractice.trim()) {
                                  field.onChange([...(field.value || []), newPractice.trim()]);
                                  setNewPractice('');
                                }
                              }
                            }}
                            borderRadius="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: 'green.400' }}
                            _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                            size="lg"
                          />
                          <StandardButton
                            onClick={(e) => {
                              e.preventDefault();
                              if (newPractice.trim()) {
                                field.onChange([...(field.value || []), newPractice.trim()]);
                                setNewPractice('');
                              }
                            }}
                            leftIcon={<FaPlus />}
                            size="sm">
                            Add
                          </StandardButton>
                        </HStack>
                        {field.value?.length ? (
                          <HStack spacing={2} flexWrap="wrap">
                            {field.value.map((practice, index) => (
                              <Tag key={index} size="md" variant="solid" colorScheme="orange">
                                <TagLabel>{practice}</TagLabel>
                                <TagCloseButton
                                  onClick={(e) => {
                                    e.preventDefault();
                                    field.onChange(field.value.filter((_, i) => i !== index));
                                  }}
                                />
                              </Tag>
                            ))}
                          </HStack>
                        ) : null}
                      </VStack>
                    )}
                  />
                </StandardField>

                {/* Certifications */}
                <StandardField
                  label="Certifications"
                  helpText="Agricultural certifications and standards">
                  <Controller
                    name="certifications"
                    control={methods.control}
                    render={({ field }) => (
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Input
                            value={newCertification}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setNewCertification(e.target.value);
                            }}
                            placeholder="e.g., USDA Organic, Fair Trade, GAP"
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (newCertification.trim()) {
                                  field.onChange([...(field.value || []), newCertification.trim()]);
                                  setNewCertification('');
                                }
                              }
                            }}
                            borderRadius="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: 'green.400' }}
                            _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                            size="lg"
                          />
                          <StandardButton
                            onClick={() => {
                              if (newCertification.trim()) {
                                field.onChange([...(field.value || []), newCertification.trim()]);
                                setNewCertification('');
                              }
                            }}
                            leftIcon={<FaPlus />}
                            size="sm">
                            Add
                          </StandardButton>
                        </HStack>
                        {field.value?.length ? (
                          <HStack spacing={2} flexWrap="wrap">
                            {field.value.map((cert: string, index: number) => (
                              <Tag key={index} size="md" variant="solid" colorScheme="blue">
                                <TagLabel>{cert}</TagLabel>
                                <TagCloseButton
                                  onClick={() => {
                                    field.onChange(
                                      (field.value || []).filter(
                                        (_: string, i: number) => i !== index
                                      )
                                    );
                                  }}
                                />
                              </Tag>
                            ))}
                          </HStack>
                        ) : null}
                      </VStack>
                    )}
                  />
                </StandardField>

                {/* Additional Information Fields */}
                <Text fontSize="lg" fontWeight="semibold" color="gray.700" mt={6} mb={2}>
                  Additional Information
                </Text>

                <StandardField
                  label="About the Establishment"
                  error={errors.about?.message}
                  helpText="General information about your establishment">
                  <Controller
                    name="about"
                    control={methods.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Share more about your establishment's history, mission, and what makes it special..."
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        minH="120px"
                        resize="vertical"
                      />
                    )}
                  />
                </StandardField>

                <StandardField
                  label="Main Activities"
                  error={errors.main_activities?.message}
                  helpText="Primary activities and operations">
                  <Controller
                    name="main_activities"
                    control={methods.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Describe your main farming activities, products, and services..."
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        minH="120px"
                        resize="vertical"
                      />
                    )}
                  />
                </StandardField>

                <StandardField
                  label="Location Highlights"
                  error={errors.location_highlights?.message}
                  helpText="Notable features of your location">
                  <Controller
                    name="location_highlights"
                    control={methods.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Describe unique features of your location, climate advantages, or geographical benefits..."
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        minH="120px"
                        resize="vertical"
                      />
                    )}
                  />
                </StandardField>

                <StandardField
                  label="Custom Message"
                  error={errors.custom_message?.message}
                  helpText="Special message for customers or visitors">
                  <Controller
                    name="custom_message"
                    control={methods.control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="A personal message you'd like to share with customers or visitors..."
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        minH="120px"
                        resize="vertical"
                      />
                    )}
                  />
                </StandardField>

                {/* Summary Alert */}
                <StandardAlert
                  status="info"
                  title="Ready to Submit"
                  description="Your establishment information is complete. You can always update these details later."
                />

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}>
                    Back to Location
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
                      {isEdit ? 'Update Establishment' : 'Create Establishment'}
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 3: Media */}
          {currentStep === 3 && (
            <StandardCard
              title="Establishment Images"
              subtitle="Upload images to showcase your establishment">
              <VStack spacing={8} align="stretch">
                {/* Image Upload Section */}
                <StandardField
                  label="Images"
                  helpText="Upload up to 5 high-quality images (JPG, PNG, GIF - max 5MB each)">
                  <VStack spacing={4}>
                    {/* Dropzone with simplified design matching old form */}
                    <Box
                      {...getRootProps()}
                      border="2px dashed #CBD5E0"
                      borderRadius="md"
                      p={6}
                      mb={4}
                      bg="gray.50"
                      cursor="pointer"
                      minH="120px"
                      _hover={{ borderColor: 'blue.400', bg: 'gray.100' }}
                      position="relative"
                      transition="all 0.2s"
                      w="full">
                      <input {...getInputProps()} />

                      {/* Image Previews AT THE TOP of the dropzone like old form */}
                      <Flex gap="16px" mb={2} flexWrap="wrap" justify="flex-start" minH="90px">
                        {/* Existing Images */}
                        {existingImages.map((img) => (
                          <Box key={img.id} position="relative">
                            <Image
                              src={img.url}
                              alt="Establishment"
                              w="120px"
                              h="80px"
                              borderRadius="8px"
                              objectFit="cover"
                              border="1px solid #E2E8F0"
                            />
                            <IconButton
                              aria-label="Remove image"
                              icon={<CloseIcon />}
                              size="xs"
                              position="absolute"
                              top="4px"
                              right="4px"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveExistingImage(img.id);
                              }}
                            />
                          </Box>
                        ))}

                        {/* New Images */}
                        {newImages.map((file, idx) => {
                          const url = URL.createObjectURL(file);
                          return (
                            <Box key={file.name + idx} position="relative">
                              <Image
                                src={url}
                                alt={file.name}
                                w="120px"
                                h="80px"
                                borderRadius="8px"
                                objectFit="cover"
                                border="1px solid #E2E8F0"
                              />
                              <IconButton
                                aria-label="Remove new image"
                                icon={<CloseIcon />}
                                size="xs"
                                position="absolute"
                                top="4px"
                                right="4px"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveNewImage(file);
                                }}
                              />
                            </Box>
                          );
                        })}
                      </Flex>

                      {/* Instructions matching old form structure */}
                      <Flex direction="column" align="center" justify="center">
                        <Icon as={FaCloudUploadAlt} boxSize={12} color="gray.400" mb={2} />
                        <Text color="gray.500" fontSize="sm" mb={2} textAlign="center">
                          {isDragActive
                            ? 'Drop images here...'
                            : existingImages.length + newImages.length > 0
                            ? 'Drop more images here or click to select'
                            : 'Drag & drop images here, or click to select'}
                        </Text>
                        <Text color="gray.400" fontSize="xs" textAlign="center">
                          Maximum 5 images. JPG, PNG, GIF format, up to 5MB each.
                        </Text>
                        {existingImages.length + newImages.length >= 5 && (
                          <Text color="red.500" fontSize="sm" mt={2} textAlign="center">
                            Maximum of 5 images reached.
                          </Text>
                        )}
                      </Flex>
                    </Box>

                    {/* Upload Progress */}
                    {isUploading && (
                      <Box w="full">
                        <Text fontSize="sm" mb={2}>
                          Uploading images... {uploadProgress}%
                        </Text>
                        <Progress value={uploadProgress} colorScheme="green" borderRadius="full" />
                      </Box>
                    )}

                    {/* Upload Button for New Images */}
                    {newImages.length > 0 && (
                      <Button
                        onClick={handleImageUpload}
                        isLoading={isUploading}
                        loadingText="Uploading..."
                        colorScheme="green"
                        leftIcon={<FaCloudUploadAlt />}
                        size="lg">
                        Upload {newImages.length} Image{newImages.length > 1 ? 's' : ''}
                      </Button>
                    )}
                  </VStack>
                </StandardField>

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}>
                    Back to Operations
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
                      {isEdit ? 'Update Establishment' : 'Create Establishment'}
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

export default StandardEstablishmentForm;
