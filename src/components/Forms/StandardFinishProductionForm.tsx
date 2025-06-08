import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  SimpleGrid,
  Box,
  Text,
  Icon,
  Badge,
  useToast,
  Input as ChakraInput,
  Input,
  InputGroup,
  InputLeftElement,
  Image,
  IconButton
} from '@chakra-ui/react';
import {
  StandardPage,
  StandardCard,
  StandardField,
  StandardInput,
  StandardTextarea,
  StandardButton,
  StandardAlert,
  StandardStepper
} from '../Design/StandardComponents';
import { FaLeaf, FaCalendarAlt, FaCamera, FaUpload, FaImage, FaTrash } from 'react-icons/fa';
import { MdDescription, MdInventory, MdNumbers } from 'react-icons/md';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { useIntl } from 'react-intl';

// Enhanced form schema with better validation
const finishProductionSchema = z.object({
  production_amount: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, 'Production amount must be a number greater than 0'),
  lot_id: z.string().min(1, 'Lot number is required').max(50, 'Lot number is too long'),
  finish_date: z.string().min(1, 'Finish date is required'),
  observation: z.string().optional()
});

type FinishProductionFormData = z.infer<typeof finishProductionSchema>;

// Internal form state type that matches HTML form fields
type FormStateData = {
  production_amount: string;
  lot_id: string;
  finish_date: string;
  observation: string;
};

interface StandardFinishProductionFormProps {
  onSubmit: (data: FinishProductionFormData & { images: File[] }) => void;
  onCancel: () => void;
  initialData?: Partial<FinishProductionFormData>;
  isLoading?: boolean;
  isEdit?: boolean;
  productName?: string;
  parcelName?: string;
}

export const StandardFinishProductionForm: React.FC<StandardFinishProductionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEdit = false,
  productName = '',
  parcelName = ''
}) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  // Enhanced state management for persisting form data across steps
  const [savedFormData, setSavedFormData] = useState<Partial<FormStateData>>({});
  const intl = useIntl();
  const toast = useToast();

  // Define steps for the finish production process
  const steps = [
    {
      title: 'Production Info',
      description: 'Final details',
      icon: MdInventory
    },
    {
      title: 'Media Upload',
      description: 'Documentation',
      icon: FaCamera
    }
  ];

  const methods = useForm<FormStateData>({
    resolver: zodResolver(finishProductionSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      production_amount: '',
      lot_id: '',
      finish_date: '',
      observation: ''
    }
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = methods;

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      const formDefaults: FormStateData = {
        production_amount: initialData.production_amount?.toString() || '',
        lot_id: initialData.lot_id || '',
        finish_date: initialData.finish_date || '',
        observation: initialData.observation || ''
      };
      reset(formDefaults);
      setSavedFormData(formDefaults);
    }
  }, [initialData, reset]);

  // Restore saved form data when returning to step 1
  useEffect(() => {
    if (currentStep === 0 && Object.keys(savedFormData).length > 0) {
      console.log('🔄 Restoring saved form data to step 1:', savedFormData);
      Object.entries(savedFormData).forEach(([key, value]) => {
        setValue(key as keyof FormStateData, value);
      });
    }
  }, [currentStep, savedFormData, setValue]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (files) => {
      const newImages = [...uploadedImages, ...files].slice(0, 5);
      setUploadedImages(newImages);

      // Create preview URLs
      const newUrls = newImages.map((file) => URL.createObjectURL(file));
      setPreviewUrls((current) => {
        // Clean up old URLs
        current.forEach((url) => URL.revokeObjectURL(url));
        return newUrls;
      });

      toast({
        title: 'Images uploaded',
        description: `${files.length} image(s) added successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });
    },
    onDropRejected: (rejectedFiles) => {
      const reasons = rejectedFiles.map((file) => file.errors[0]?.message).join(', ');
      toast({
        title: 'Upload failed',
        description: reasons,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  });

  // Remove image handler
  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    // Clean up removed URL
    URL.revokeObjectURL(previewUrls[index]);

    setUploadedImages(newImages);
    setPreviewUrls(newUrls);
  };

  // Enhanced form submission handler
  const onSubmitForm = (data: FormStateData) => {
    try {
      console.log('🚀 Form submission triggered!');
      console.log('📋 Current form data:', data);
      console.log('💾 Saved form data:', savedFormData);
      console.log('📷 Uploaded images:', uploadedImages);

      // Merge current form data with saved data to ensure all fields are included
      const mergedData = {
        ...savedFormData,
        ...data
      };

      console.log('🔗 Merged form data:', mergedData);

      // Convert to the expected output format
      const finalFormData: FinishProductionFormData = {
        production_amount: Number(mergedData.production_amount || 0),
        lot_id: mergedData.lot_id || '',
        finish_date: mergedData.finish_date || '',
        observation: mergedData.observation
      };

      const finalData = {
        ...finalFormData,
        images: uploadedImages
      };

      console.log('📦 Final data to submit:', finalData);
      onSubmit(finalData);

      toast({
        title: isEdit ? 'Production Updated' : 'Production Completed',
        description: `Production has been ${isEdit ? 'updated' : 'finished'} successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('❌ Submit error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save production. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Enhanced manual submit function for the final button
  const handleManualSubmit = () => {
    console.log('🔘 Manual submit button clicked!');

    // Get current form values
    const currentValues = getValues();
    console.log('📋 Current form values:', currentValues);
    console.log('💾 Saved form data:', savedFormData);
    console.log('❌ Form errors:', errors);
    console.log('✅ Form is valid:', Object.keys(errors).length === 0);

    // Merge all data
    const allFormData = {
      ...savedFormData,
      ...currentValues
    };

    console.log('🔗 All merged form data:', allFormData);

    // Validate the merged data
    try {
      const validatedData = finishProductionSchema.parse(allFormData);
      console.log('✅ Data validation passed:', validatedData);
      onSubmitForm(allFormData);
    } catch (validationError) {
      console.error('❌ Data validation failed:', validationError);
      toast({
        title: 'Validation Error',
        description: 'Please check all required fields are filled correctly.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Enhanced step progression logic with proper data persistence
  const nextStep = () => {
    if (currentStep === 0) {
      // Save step 1 data before moving to step 2
      const currentValues = getValues();
      console.log('💾 Saving step 1 data before progression:', currentValues);
      setSavedFormData(currentValues);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      // Save current step data when going back
      const currentValues = getValues();
      setSavedFormData((prev) => ({ ...prev, ...currentValues }));
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    // Save current data before jumping to another step
    const currentValues = getValues();
    setSavedFormData((prev) => ({ ...prev, ...currentValues }));
    setCurrentStep(step);
  };

  // Watch form values for reactive validation
  const watchedValues = watch(['production_amount', 'lot_id', 'finish_date']);

  // Enhanced step validation that considers saved data
  const isStepValid = (step: number) => {
    if (step === 0) {
      // Production info step - check required fields from current values or saved data
      const currentValues = getValues();
      const effectiveValues = { ...savedFormData, ...currentValues };

      const amount = effectiveValues.production_amount;
      const lotId = effectiveValues.lot_id;
      const finishDate = effectiveValues.finish_date;

      const isValid = !!(
        amount &&
        lotId &&
        finishDate &&
        String(amount).trim() !== '' &&
        String(lotId).trim() !== '' &&
        String(finishDate).trim() !== ''
      );

      // Only log when debugging is needed (reduce console spam)
      if (process.env.NODE_ENV === 'development' && Math.random() < 0.1) {
        console.log('🔍 Step 0 validation:', {
          currentValues,
          savedFormData,
          effectiveValues,
          amount,
          lotId,
          finishDate,
          isValid
        });
      }

      return isValid;
    }
    if (step === 1) {
      // Media step - no required validation
      return true;
    }
    return false;
  };

  // Memoized validation for performance
  const isStep0Valid = React.useMemo(() => {
    const currentValues = getValues();
    const effectiveValues = { ...savedFormData, ...currentValues };

    const amount = effectiveValues.production_amount;
    const lotId = effectiveValues.lot_id;
    const finishDate = effectiveValues.finish_date;

    const isValid = !!(
      amount &&
      lotId &&
      finishDate &&
      String(amount).trim() !== '' &&
      String(lotId).trim() !== '' &&
      String(finishDate).trim() !== ''
    );

    // Debug log for troubleshooting
    console.log('🚀 Step 0 validation check:', {
      amount,
      lotId,
      finishDate,
      isValid,
      hasFormErrors: Object.keys(errors).length > 0,
      formErrors: errors
    });

    return isValid;
  }, [watchedValues, savedFormData, errors]);

  // Get completed steps
  const getCompletedSteps = () => {
    const completed = [];
    for (let i = 0; i < currentStep; i++) {
      if (isStepValid(i)) {
        completed.push(i);
      }
    }
    return completed;
  };

  return (
    <StandardPage
      title={isEdit ? 'Edit Production Completion' : 'Finish Production'}
      description={`${isEdit ? 'Update' : 'Complete'} the production cycle${
        productName ? ` for ${productName}` : ''
      }${parcelName ? ` in ${parcelName}` : ''}`}
      showBackButton
      onBack={onCancel}
      rightAction={
        <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
          <HStack spacing={1}>
            <Icon as={FaLeaf} boxSize={3} />
            <Text fontSize="sm">Final Step</Text>
          </HStack>
        </Badge>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <VStack spacing={8} align="stretch">
            {/* Progress Stepper */}
            <StandardStepper
              steps={steps}
              currentStep={currentStep}
              completedSteps={getCompletedSteps()}
              allowStepClick={true}
              onStepClick={goToStep}
            />

            {/* Step 1: Production Information */}
            {currentStep === 0 && (
              <StandardCard
                title="Production Information"
                subtitle="Enter the final details for this production cycle"
              >
                <VStack spacing={6} align="stretch">
                  {/* Production Amount & Lot Number */}
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <StandardField
                      label={
                        intl.formatMessage({ id: 'app.productionAmount' }) || 'Production Amount'
                      }
                      error={errors.production_amount?.message}
                      helpText="Total volume or quantity produced"
                      required
                    >
                      <Input
                        {...methods.register('production_amount')}
                        placeholder={
                          intl.formatMessage({ id: 'app.volumeOfTheProduct' }) ||
                          'Enter production volume'
                        }
                        type="number"
                        min="0"
                        step="0.01"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        size="lg"
                      />
                    </StandardField>

                    <StandardField
                      label={intl.formatMessage({ id: 'app.lotNumber' }) || 'Lot Number'}
                      error={errors.lot_id?.message}
                      helpText="Unique identifier for this batch"
                      required
                    >
                      <Input
                        {...methods.register('lot_id')}
                        placeholder={
                          intl.formatMessage({ id: 'app.lotNumber' }) || 'Enter lot number'
                        }
                        type="text"
                        maxLength={50}
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'green.400' }}
                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                        size="lg"
                      />
                    </StandardField>
                  </SimpleGrid>

                  {/* Finish Date */}
                  <StandardField
                    label={intl.formatMessage({ id: 'app.finishDate' }) || 'Completion Date'}
                    error={errors.finish_date?.message}
                    helpText="When was this production cycle completed?"
                    required
                  >
                    <Input
                      {...methods.register('finish_date')}
                      placeholder="Select completion date and time"
                      type="datetime-local"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>

                  {/* Observations */}
                  <StandardField
                    label={intl.formatMessage({ id: 'app.observations' }) || 'Observations'}
                    error={errors.observation?.message}
                    helpText="Additional notes about this production cycle (optional)"
                  >
                    <StandardTextarea
                      {...methods.register('observation')}
                      placeholder={
                        intl.formatMessage({ id: 'app.descriptionOfTheEvent' }) ||
                        'Enter any observations or notes'
                      }
                      rows={4}
                    />
                  </StandardField>

                  {/* Step Navigation */}
                  <HStack spacing={4} justify="flex-end" pt={4}>
                    <StandardButton variant="outline" onClick={onCancel} disabled={isLoading}>
                      Cancel
                    </StandardButton>

                    <StandardButton onClick={nextStep} disabled={!isStep0Valid}>
                      Continue to Media
                    </StandardButton>
                  </HStack>
                </VStack>
              </StandardCard>
            )}

            {/* Step 2: Media Upload */}
            {currentStep === 1 && (
              <StandardCard
                title="Production Images"
                subtitle="Upload photos documenting the completed production"
              >
                <VStack spacing={6} align="stretch">
                  {/* Image Upload Dropzone */}
                  <StandardField
                    label={
                      intl.formatMessage({ id: 'app.productionImages' }) || 'Production Images'
                    }
                    helpText="Upload up to 5 high-quality images (JPG, PNG, GIF - max 5MB each)"
                  >
                    {/* Current Images Preview */}
                    {previewUrls.length > 0 && (
                      <Box mb={4}>
                        <Text fontSize="sm" fontWeight="medium" mb={3} color="gray.600">
                          Uploaded Images ({previewUrls.length}/5)
                        </Text>
                        <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={3}>
                          {previewUrls.map((url, index) => (
                            <Box
                              key={index}
                              position="relative"
                              borderRadius="md"
                              overflow="hidden"
                            >
                              <Image
                                src={url}
                                alt={`Production image ${index + 1}`}
                                objectFit="cover"
                                h="80px"
                                w="100%"
                                borderRadius="md"
                              />
                              <IconButton
                                aria-label="Remove image"
                                icon={<FaTrash />}
                                size="xs"
                                colorScheme="red"
                                position="absolute"
                                top={1}
                                right={1}
                                onClick={() => removeImage(index)}
                              />
                            </Box>
                          ))}
                        </SimpleGrid>
                      </Box>
                    )}

                    {/* Dropzone */}
                    {uploadedImages.length < 5 && (
                      <Box
                        {...getRootProps()}
                        border="2px dashed"
                        borderColor={isDragActive ? 'green.400' : 'gray.300'}
                        borderRadius="lg"
                        p={8}
                        textAlign="center"
                        cursor="pointer"
                        transition="all 0.3s ease"
                        bg={isDragActive ? 'green.50' : 'gray.50'}
                        _hover={{
                          borderColor: 'green.400',
                          bg: 'green.50',
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg'
                        }}
                      >
                        <input {...getInputProps()} style={{ display: 'none' }} />

                        <VStack spacing={4}>
                          <Icon
                            as={isDragActive ? FaUpload : FaCamera}
                            boxSize={8}
                            color={isDragActive ? 'green.500' : 'gray.400'}
                          />
                          <VStack spacing={1}>
                            <Text fontWeight="medium" color="gray.700">
                              {isDragActive
                                ? 'Drop the images here'
                                : 'Drag and drop images here, or click to select'}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {uploadedImages.length === 0
                                ? 'Up to 5 images, max 5MB each'
                                : `${5 - uploadedImages.length} more images allowed`}
                            </Text>
                          </VStack>

                          <Badge colorScheme="blue" variant="subtle">
                            <HStack spacing={1}>
                              <Icon as={FaImage} boxSize={3} />
                              <Text fontSize="xs">JPG, PNG, GIF, WEBP</Text>
                            </HStack>
                          </Badge>
                        </VStack>
                      </Box>
                    )}
                  </StandardField>

                  {/* Upload Limit Notice */}
                  {uploadedImages.length >= 5 && (
                    <StandardAlert
                      status="info"
                      title="Upload Limit Reached"
                      description="Maximum of 5 images allowed. Remove an image to add a new one."
                    />
                  )}

                  {/* Step Navigation */}
                  <HStack spacing={4} justify="space-between" pt={4}>
                    <StandardButton variant="outline" onClick={previousStep}>
                      Back to Production Info
                    </StandardButton>

                    <StandardButton
                      isLoading={isLoading}
                      loadingText="Finishing Production..."
                      onClick={handleManualSubmit}
                      size="lg"
                    >
                      {intl.formatMessage({ id: 'app.finishProduction' }) || 'Finish Production'}
                    </StandardButton>
                  </HStack>
                </VStack>
              </StandardCard>
            )}
          </VStack>
        </form>
      </FormProvider>
    </StandardPage>
  );
};

export default StandardFinishProductionForm;
