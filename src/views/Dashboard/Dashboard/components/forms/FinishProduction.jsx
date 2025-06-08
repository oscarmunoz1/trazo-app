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
  Image,
  IconButton,
  Flex,
  Textarea,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  useColorModeValue,
  Tabs,
  TabPanels,
  TabPanel
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
} from '../../../../../components/Design/StandardComponents';
import { FaLeaf, FaCalendarAlt, FaCamera, FaUpload, FaImage, FaTrash } from 'react-icons/fa';
import { MdDescription, MdInventory, MdNumbers } from 'react-icons/md';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFinishCurrentHistoryMutation } from 'store/api/historyApi.js';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import FormInput from 'components/Forms/FormInput';

// Enhanced form schema with better validation
const finishProductionSchema = z.object({
  production_amount: z
    .string()
    .min(1, 'Production amount is required')
    .transform((val) => Number(val))
    .refine((val) => val > 0, 'Production amount must be greater than 0'),
  lot_id: z.string().min(1, 'Lot number is required').max(50, 'Lot number is too long'),
  finish_date: z.string().min(1, 'Finish date is required'),
  observation: z.string().optional()
});

function FinishProduction() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const { parcelId, establishmentId } = useParams();
  const currentCompany = useSelector((state) => state.company.currentCompany);

  // Chakra color mode (keep for compatibility with old UI)
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');

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

  const [finishCurrentHistory, { isLoading, isSuccess }] = useFinishCurrentHistoryMutation();

  const methods = useForm({
    resolver: zodResolver(finishProductionSchema),
    defaultValues: {
      production_amount: '',
      lot_id: '',
      finish_date: '',
      observation: ''
    }
  });

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = methods;

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
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
  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);

    // Clean up removed URL
    URL.revokeObjectURL(previewUrls[index]);

    setUploadedImages(newImages);
    setPreviewUrls(newUrls);
  };

  // Form submission handler
  const onSubmitForm = (data) => {
    try {
      const finalData = {
        ...data,
        production_amount: Number(data.production_amount),
        album: { images: uploadedImages }
      };

      finishCurrentHistory({
        companyId: currentCompany?.id,
        establishmentId,
        parcelId: parcelId,
        historyData: finalData
      });

      toast({
        title: 'Production Completed',
        description: 'Production has been finished successfully.',
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

  const handleCancel = () => {
    navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
  };

  // Handle successful submission
  useEffect(() => {
    if (isSuccess) {
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
    }
  }, [isSuccess, navigate, establishmentId, parcelId]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Step progression logic
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

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Check if current step is valid
  const isStepValid = (step) => {
    if (step === 0) {
      // Production info step - check required fields
      const formData = methods.getValues();
      return formData.production_amount && formData.lot_id && formData.finish_date;
    }
    if (step === 1) {
      // Media step - no required validation
      return true;
    }
    return false;
  };

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
      title="Finish Production"
      description="Complete the production cycle by entering final details and uploading documentation"
      showBackButton
      onBack={handleCancel}
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
                      <StandardInput
                        {...methods.register('production_amount')}
                        placeholder={
                          intl.formatMessage({ id: 'app.volumeOfTheProduct' }) ||
                          'Enter production volume'
                        }
                        leftElement={<Icon as={MdInventory} color="gray.400" />}
                        type="number"
                        min="0"
                        step="0.01"
                      />
                    </StandardField>

                    <StandardField
                      label={intl.formatMessage({ id: 'app.lotNumber' }) || 'Lot Number'}
                      error={errors.lot_id?.message}
                      helpText="Unique identifier for this batch"
                      required
                    >
                      <StandardInput
                        {...methods.register('lot_id')}
                        placeholder={
                          intl.formatMessage({ id: 'app.lotNumber' }) || 'Enter lot number'
                        }
                        leftElement={<Icon as={MdNumbers} color="gray.400" />}
                        maxLength={50}
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
                    <StandardInput
                      {...methods.register('finish_date')}
                      placeholder="Select completion date and time"
                      leftElement={<Icon as={FaCalendarAlt} color="gray.400" />}
                      type="datetime-local"
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
                      leftElement={<Icon as={MdDescription} color="gray.400" />}
                    />
                  </StandardField>

                  {/* Step Navigation */}
                  <HStack spacing={4} justify="flex-end" pt={4}>
                    <StandardButton variant="outline" onClick={handleCancel} isDisabled={isLoading}>
                      Cancel
                    </StandardButton>

                    <StandardButton onClick={nextStep} isDisabled={!isStepValid(0)}>
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
                        <ChakraInput {...getInputProps()} />

                        <VStack spacing={4}>
                          <Icon
                            as={isDragActive ? FaUpload : FaCamera}
                            boxSize={8}
                            color={isDragActive ? 'green.500' : 'gray.400'}
                          />
                          <VStack spacing={1}>
                            <Text fontWeight="medium" color="gray.700">
                              {isDragActive
                                ? intl.formatMessage({ id: 'app.dropFilesHere' }) ||
                                  'Drop files here'
                                : intl.formatMessage({ id: 'app.dragDropOrClick' }) ||
                                  'Drag & drop images here, or click to select'}
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
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Finishing Production..."
                      size="lg"
                      px={8}
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
}

export default FinishProduction;
