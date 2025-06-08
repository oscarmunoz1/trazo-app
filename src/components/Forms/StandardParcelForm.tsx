import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  FormControl,
  FormLabel,
  Textarea,
  Flex,
  Badge,
  Image,
  IconButton,
  Button,
  Progress,
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
  StandardStepper
} from '../Design';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string, boolean, number } from 'zod';
import { useIntl } from 'react-intl';
import { GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import { useDropzone } from 'react-dropzone';
import { CloseIcon } from '@chakra-ui/icons';
import {
  FaMapMarkedAlt,
  FaBuilding,
  FaCloudUploadAlt,
  FaCertificate,
  FaCheckCircle,
  FaChevronRight,
  FaChevronLeft,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import { MdInfo } from 'react-icons/md';
import { Controller } from 'react-hook-form';

// Utility function to calculate polygon center
const calculatePolygonCenter = (points: Array<{ lat: number; lng: number }>) => {
  if (!points || points.length === 0) {
    return { lat: 36.7378, lng: -119.7871 }; // Fresno, CA default
  }

  // Calculate bounds
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  points.forEach((point) => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });

  // Calculate center
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return { lat: centerLat, lng: centerLng };
};

// Utility function to calculate appropriate zoom level based on polygon bounds
const calculatePolygonZoom = (points: Array<{ lat: number; lng: number }>) => {
  if (!points || points.length === 0) {
    return 13; // Default zoom
  }

  // Calculate bounds
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  points.forEach((point) => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });

  // Calculate the span of the polygon
  const latSpan = Math.abs(maxLat - minLat);
  const lngSpan = Math.abs(maxLng - minLng);
  const maxSpan = Math.max(latSpan, lngSpan);

  // Add padding factor to ensure polygon doesn't touch edges (20% padding)
  const paddedSpan = maxSpan * 1.4;

  // More conservative zoom levels to ensure full polygon visibility
  if (paddedSpan > 2.0) return 6;
  if (paddedSpan > 1.0) return 7;
  if (paddedSpan > 0.5) return 8;
  if (paddedSpan > 0.3) return 9;
  if (paddedSpan > 0.2) return 10;
  if (paddedSpan > 0.1) return 11;
  if (paddedSpan > 0.05) return 12;
  if (paddedSpan > 0.02) return 13;
  if (paddedSpan > 0.01) return 14;
  return 15;
};

// Form Schema
const parcelSchema = object({
  name: string().min(1, 'Parcel name is required').max(100, 'Name too long'),
  area: number().min(0.01, 'Area must be greater than 0'),
  description: string().min(1, 'Description is required'),
  contact_phone: string().optional(),
  address: string().optional(),
  certified: boolean().default(false),
  crop_type: string().optional(),
  soil_type: string().optional(),
  unique_code: string().optional(),
  certification_type: string().optional(),
  contact_person: string().optional(),
  contact_email: string().email('Invalid email format').optional().or(string().length(0))
});

interface ParcelFormData {
  name: string;
  area: number;
  description: string;
  contact_phone?: string;
  address?: string;
  certified: boolean;
  crop_type?: string;
  soil_type?: string;
  unique_code?: string;
  certification_type?: string;
  contact_person?: string;
  contact_email?: string;
  polygon?: Array<{ lat: number; lng: number }>;
  map_metadata?: {
    center: { lat: number; lng: number };
    zoom: number;
  };
  images?: File[];
  establishment?: number;
}

interface StandardParcelFormProps {
  onSubmit: (data: ParcelFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ParcelFormData>;
  isLoading?: boolean;
  isEdit?: boolean;
  establishmentName?: string;
}

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

export const StandardParcelForm: React.FC<StandardParcelFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  isEdit = false,
  establishmentName = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [polygon, setPolygon] = useState<Array<{ lat: number; lng: number }>>(
    initialData?.polygon || []
  );

  // Enhanced map centering logic
  const [mapCenter, setMapCenter] = useState(() => {
    if (initialData?.map_metadata?.center) {
      return initialData.map_metadata.center;
    }
    if (initialData?.polygon && initialData.polygon.length > 0) {
      return calculatePolygonCenter(initialData.polygon);
    }
    return { lat: 36.7378, lng: -119.7871 }; // Fresno, CA - Central Valley agricultural region
  });

  const [mapZoom, setMapZoom] = useState(() => {
    if (initialData?.map_metadata?.zoom) {
      return initialData.map_metadata.zoom;
    }
    if (initialData?.polygon && initialData.polygon.length > 0) {
      return calculatePolygonZoom(initialData.polygon);
    }
    return 13;
  });

  // Image upload state management
  const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string }>>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const intl = useIntl();
  const toast = useToast();

  const polygonRef = useRef<google.maps.Polygon>();
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  // Define steps for stepper
  const steps = [
    { title: 'Basic Info', description: 'Parcel details', icon: FaBuilding },
    { title: 'Location', description: 'Map & boundaries', icon: FaMapMarkedAlt },
    { title: 'Description', description: 'Details & notes', icon: MdInfo },
    { title: 'Media & Certification', description: 'Images & certification', icon: FaCertificate }
  ];

  const methods = useForm<ParcelFormData>({
    resolver: zodResolver(parcelSchema),
    defaultValues: {
      certified: false,
      area: 0,
      name: '',
      description: '',
      contact_phone: '',
      address: '',
      crop_type: '',
      soil_type: '',
      unique_code: '',
      certification_type: '',
      contact_person: '',
      contact_email: '',
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

  // Update form when initialData changes - Simplified approach
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        certified: false,
        area: 0,
        name: '',
        description: '',
        contact_phone: '',
        address: '',
        crop_type: '',
        soil_type: '',
        unique_code: '',
        certification_type: '',
        contact_person: '',
        contact_email: '',
        ...initialData
      });

      // Handle existing images for edit mode
      if (isEdit && initialData.images) {
        const formattedImages = (initialData.images as any[]).map((img: any, index: number) => ({
          id: img.id || `existing-${index}`,
          url: typeof img === 'string' ? img : img.url || img.image_url
        }));
        setExistingImages(formattedImages);
      }
    }
  }, [initialData, reset, isEdit]);

  // Update map center and zoom when polygon changes
  useEffect(() => {
    if (polygon.length >= 3) {
      const newCenter = calculatePolygonCenter(polygon);
      const newZoom = calculatePolygonZoom(polygon);
      setMapCenter(newCenter);
      setMapZoom(newZoom);
    }
  }, [polygon]);

  // Dropzone for images with comprehensive management
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const totalImages = existingImages.length + newImages.length + acceptedFiles.length;
      if (totalImages > 5) {
        toast({
          title: 'Too Many Images',
          description: 'Maximum 5 images allowed. Please remove some images first.',
          status: 'warning',
          duration: 5000,
          isClosable: true
        });
        return;
      }
      setNewImages((prev) => [...prev, ...acceptedFiles]);
    },
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === 'file-too-large') {
            toast({
              title: 'File Too Large',
              description: 'Each image must be smaller than 5MB.',
              status: 'error',
              duration: 5000,
              isClosable: true
            });
          } else if (err.code === 'file-invalid-type') {
            toast({
              title: 'Invalid File Type',
              description: 'Only JPG, PNG, and GIF images are allowed.',
              status: 'error',
              duration: 5000,
              isClosable: true
            });
          }
        });
      });
    }
  });

  // Image management functions
  const handleRemoveExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  const handleRemoveNewImage = (file: File) => {
    setNewImages((prev) => prev.filter((img) => img !== file));
  };

  const handleImageUpload = async () => {
    if (newImages.length === 0) return [];

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const formData = new FormData();
        formData.append('image', file);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + (100 / newImages.length) * Math.random() * 0.1;
            return Math.min(newProgress, (i + 0.9) * (100 / newImages.length));
          });
        }, 100);

        try {
          // Here you would make the actual API call to upload the image
          // const response = await uploadImageAPI(formData);
          // uploadedUrls.push(response.url);

          // For now, create a temporary URL for demonstration
          const url = URL.createObjectURL(file);
          uploadedUrls.push(url);

          setUploadProgress((i + 1) * (100 / newImages.length));
        } finally {
          clearInterval(progressInterval);
        }
      }

      // Move new images to existing images
      const newExistingImages = newImages.map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        url: uploadedUrls[index]
      }));

      setExistingImages((prev) => [...prev, ...newExistingImages]);
      setNewImages([]);
      setUploadProgress(100);

      toast({
        title: 'Images Uploaded',
        description: `${newImages.length} image(s) uploaded successfully.`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload images. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
      return [];
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Google Maps polygon editing
  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng: google.maps.LatLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng()
        }));
      setPolygon(nextPath);
    }
  }, []);

  const onLoadPolygon = useCallback(
    (polygonInstance: google.maps.Polygon) => {
      polygonRef.current = polygonInstance;
      const path = polygonInstance.getPath();
      listenersRef.current.push(
        path.addListener('set_at', onEdit),
        path.addListener('insert_at', onEdit),
        path.addListener('remove_at', onEdit)
      );
    },
    [onEdit]
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((listener) => listener.remove());
    polygonRef.current = undefined;
  }, []);

  const onSubmitForm = (data: ParcelFormData) => {
    try {
      console.log('🔍 Form submission data received:', data);
      console.log('🔍 All form values from watch():', watch());
      console.log('🔍 Address field specifically:', {
        fromData: data.address,
        fromWatch: watch('address'),
        isDefined: data.address !== undefined,
        isEmpty: !data.address || data.address.trim() === ''
      });

      const finalData = {
        ...data,
        polygon,
        map_metadata: {
          center: mapCenter,
          zoom: mapZoom
        },
        // Pass image data separately to match backend expectations
        uploaded_image_urls: existingImages.map((img) => img.url),
        images_to_delete: imagesToDelete,
        new_images: newImages
      };

      // Remove the images property since we're handling it differently
      const { images, ...submissionData } = finalData;

      console.log('🚀 Final submission data:', submissionData);
      console.log('🔑 Submission data keys:', Object.keys(submissionData));
      console.log('📍 Address in final data:', submissionData.address);

      onSubmit(submissionData as any);
      toast({
        title: isEdit ? 'Parcel Updated' : 'Parcel Created',
        description: `"${data.name}" has been ${isEdit ? 'updated' : 'created'} successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('❌ Form submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save parcel. Please try again.',
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
        // Basic Info: name and area required, no validation errors
        const basicFieldErrors = ['name', 'area'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        const hasName = formData.name && formData.name.trim().length > 0;
        const hasValidArea = formData.area && formData.area > 0;
        const isComplete = hasName && hasValidArea && !basicFieldErrors;

        // Debug logging for step 0
        if (process.env.NODE_ENV === 'development' && step === 0) {
          console.log('Step 0 validation:', {
            hasName,
            hasValidArea,
            basicFieldErrors,
            isComplete,
            formData: { name: formData.name, area: formData.area },
            errors: currentErrors
          });
        }

        return isComplete;
      case 1:
        // Location: polygon with at least 3 points required
        return polygon.length >= 3;
      case 2:
        // Description: description required, no validation errors in description fields
        const descriptionFieldErrors = [
          'description',
          'crop_type',
          'soil_type',
          'unique_code',
          'certification_type',
          'address',
          'contact_person',
          'contact_email'
        ].some((field) => currentErrors[field as keyof typeof currentErrors]);

        const hasDescription = formData.description && formData.description.trim().length > 0;
        const step2Complete = hasDescription && !descriptionFieldErrors;

        // Debug logging for step 2
        if (process.env.NODE_ENV === 'development' && step === 2) {
          console.log('Step 2 validation:', {
            hasDescription,
            descriptionFieldErrors,
            step2Complete,
            formData: {
              description: formData.description,
              crop_type: formData.crop_type,
              soil_type: formData.soil_type,
              unique_code: formData.unique_code,
              certification_type: formData.certification_type,
              address: formData.address,
              contact_person: formData.contact_person,
              contact_email: formData.contact_email
            },
            errors: {
              description: currentErrors.description,
              crop_type: currentErrors.crop_type,
              soil_type: currentErrors.soil_type,
              unique_code: currentErrors.unique_code,
              certification_type: currentErrors.certification_type,
              address: currentErrors.address,
              contact_person: currentErrors.contact_person,
              contact_email: currentErrors.contact_email
            }
          });
        }

        return step2Complete;
      case 3:
        // Media & Certification: optional step, check for validation errors
        const mediaFieldErrors = ['contact_phone'].some(
          (field) => currentErrors[field as keyof typeof currentErrors]
        );
        return !mediaFieldErrors;
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

  return (
    <StandardPage
      title={isEdit ? 'Edit Parcel' : 'Add New Parcel'}
      description={`${isEdit ? 'Update' : 'Create'} a parcel${
        establishmentName ? ` in ${establishmentName}` : ''
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
          {/* Step 0: Basic Information */}
          {currentStep === 0 && (
            <StandardCard title="Parcel Information" subtitle="Basic details about your parcel">
              <VStack spacing={6} align="stretch">
                {/* Name & Area */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Parcel Name"
                    required
                    error={errors.name?.message}
                    helpText="Unique name for this parcel"
                  >
                    <Input
                      {...methods.register('name')}
                      placeholder="e.g., North Field, Block A"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>

                  <StandardField
                    label="Area (acres)"
                    required
                    error={errors.area?.message}
                    helpText="Total area in acres"
                  >
                    <Controller
                      name="area"
                      control={methods.control}
                      render={({ field }) => (
                        <NumberInput
                          value={field.value || 0}
                          onChange={(_, num) => field.onChange(num || 0)}
                          min={0.01}
                          step={0.1}
                          precision={2}
                        >
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

                {/* Progress Info */}
                <StandardAlert
                  status="info"
                  title="Next Steps"
                  description="After providing basic information, you'll map the parcel boundaries and add detailed descriptions."
                />

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
                    Continue to Location
                  </StandardButton>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 1: Location Mapping */}
          {currentStep === 1 && (
            <StandardCard title="Parcel Location" subtitle="Define parcel boundaries on the map">
              <VStack spacing={6} align="stretch">
                {/* Map Container */}
                <Box borderRadius="lg" overflow="hidden" border="1px solid" borderColor="gray.200">
                  {loadError ? (
                    <Flex h="400px" align="center" justify="center" bg="red.50" direction="column">
                      <Text color="red.500" mb={2}>
                        Failed to load Google Maps
                      </Text>
                      <Text fontSize="sm" color="red.400">
                        {loadError.message}
                      </Text>
                    </Flex>
                  ) : !isLoaded ? (
                    <Flex h="400px" align="center" justify="center" bg="gray.100">
                      <Text>Loading map...</Text>
                    </Flex>
                  ) : (
                    <GoogleMap
                      mapContainerStyle={{
                        width: '100%',
                        height: '400px'
                      }}
                      zoom={mapZoom}
                      center={mapCenter}
                      onClick={(e) => {
                        if (e.latLng) {
                          const newPoint = {
                            lat: e.latLng.lat(),
                            lng: e.latLng.lng()
                          };
                          setPolygon([...polygon, newPoint]);
                        }
                      }}
                      onZoomChanged={() => {
                        // Update zoom when changed
                      }}
                      onCenterChanged={() => {
                        // Update center when changed
                      }}
                    >
                      {polygon.length > 2 && (
                        <Polygon
                          path={polygon}
                          onLoad={onLoadPolygon}
                          onUnmount={onUnmount}
                          options={{
                            fillColor: '#00ff00',
                            fillOpacity: 0.35,
                            strokeColor: '#00ff00',
                            strokeOpacity: 1,
                            strokeWeight: 2,
                            editable: true,
                            draggable: true
                          }}
                        />
                      )}
                    </GoogleMap>
                  )}
                </Box>

                {/* Map Instructions */}
                <StandardAlert
                  status="info"
                  title="Drawing Instructions"
                  description="Click on the map to add points and create the parcel boundary. You need at least 3 points to form a polygon."
                />

                {/* Polygon Info */}
                {polygon.length > 0 && (
                  <Box p={4} bg="green.50" borderRadius="lg">
                    <Text fontWeight="semibold" color="green.700" mb={2}>
                      Polygon Points: {polygon.length}
                    </Text>
                    <HStack>
                      <Badge colorScheme="green" variant="solid">
                        {polygon.length >= 3 ? 'Valid Polygon' : 'Need more points'}
                      </Badge>
                      {polygon.length > 0 && (
                        <StandardButton
                          size="sm"
                          variant="outline"
                          leftIcon={<FaTrash />}
                          onClick={() => setPolygon([])}
                        >
                          Clear Points
                        </StandardButton>
                      )}
                    </HStack>
                  </Box>
                )}

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}
                  >
                    Back to Basic Info
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
                      Continue to Description
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <StandardCard
              title="Parcel Description"
              subtitle="Detailed information about the parcel"
            >
              <VStack spacing={6} align="stretch">
                {/* Description */}
                <StandardField
                  label="Description"
                  required
                  error={errors.description?.message}
                  helpText="Describe the parcel, its characteristics, soil type, drainage, etc."
                >
                  <Textarea
                    {...methods.register('description')}
                    placeholder="Describe the parcel including soil type, drainage, topography, existing vegetation, and any other relevant characteristics..."
                    borderRadius="lg"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'green.400' }}
                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                    size="lg"
                    minH="120px"
                  />
                </StandardField>

                {/* Additional Parcel Information */}
                <Text fontSize="lg" fontWeight="semibold" color="gray.700" mt={4} mb={2}>
                  Additional Information
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Crop Type"
                    error={errors.crop_type?.message}
                    helpText="Primary crop or vegetation type"
                  >
                    <Input
                      {...methods.register('crop_type')}
                      placeholder="e.g., Tomatoes, Corn, Pasture"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>

                  <StandardField
                    label="Soil Type"
                    error={errors.soil_type?.message}
                    helpText="Type of soil in this parcel"
                  >
                    <Input
                      {...methods.register('soil_type')}
                      placeholder="e.g., Clay, Sandy loam, Silty clay"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Unique Code"
                    error={errors.unique_code?.message}
                    helpText="Internal parcel identifier or code"
                  >
                    <Input
                      {...methods.register('unique_code')}
                      placeholder="e.g., P001, NorthField-A"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>

                  <StandardField
                    label="Certification Type"
                    error={errors.certification_type?.message}
                    helpText="Type of agricultural certification"
                  >
                    <Input
                      {...methods.register('certification_type')}
                      placeholder="e.g., USDA Organic, Fair Trade"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>
                </SimpleGrid>

                <StandardField
                  label="Address"
                  error={errors.address?.message}
                  helpText="Specific address or location reference"
                >
                  <Input
                    {...methods.register('address')}
                    placeholder="e.g., 123 Farm Road, North Section"
                    borderRadius="lg"
                    borderColor="gray.300"
                    _hover={{ borderColor: 'green.400' }}
                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                    size="lg"
                  />
                </StandardField>

                {/* Contact Information */}
                <Text fontSize="lg" fontWeight="semibold" color="gray.700" mt={4} mb={2}>
                  Contact Information
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <StandardField
                    label="Contact Person"
                    error={errors.contact_person?.message}
                    helpText="Person responsible for this parcel"
                  >
                    <Input
                      {...methods.register('contact_person')}
                      placeholder="e.g., John Smith"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>

                  <StandardField
                    label="Contact Email"
                    error={errors.contact_email?.message}
                    helpText="Contact email for this parcel"
                  >
                    <Input
                      {...methods.register('contact_email')}
                      type="email"
                      placeholder="e.g., john@farm.com"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: 'green.400' }}
                      _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                      size="lg"
                    />
                  </StandardField>
                </SimpleGrid>

                {/* Summary */}
                <Box p={4} bg="gray.50" borderRadius="lg">
                  <Text fontWeight="semibold" mb={2}>
                    Parcel Summary:
                  </Text>
                  <SimpleGrid columns={2} spacing={2} fontSize="sm">
                    <Text>Name: {watch('name') || 'Not specified'}</Text>
                    <Text>Area: {watch('area') || 0} acres</Text>
                    <Text>Boundary Points: {polygon.length}</Text>
                    <Text>Status: {polygon.length >= 3 ? 'Ready' : 'Incomplete'}</Text>
                  </SimpleGrid>
                </Box>

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
                    <StandardButton variant="outline" onClick={onCancel}>
                      Cancel
                    </StandardButton>
                    <StandardButton
                      onClick={nextStep}
                      rightIcon={<FaChevronRight />}
                      disabled={!isStepComplete(2)}
                    >
                      Continue to Media
                    </StandardButton>
                  </HStack>
                </HStack>
              </VStack>
            </StandardCard>
          )}

          {/* Step 3: Media & Certification */}
          {currentStep === 3 && (
            <StandardCard
              title="Media & Certification"
              subtitle="Upload images and set certification status"
            >
              <VStack spacing={6} align="stretch">
                {/* Image Upload Section with comprehensive management */}
                <StandardField
                  label="Parcel Images"
                  helpText="Upload up to 5 high-quality images (JPG, PNG, GIF - max 5MB each)"
                >
                  <VStack spacing={4}>
                    {/* Comprehensive Dropzone with image preview */}
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
                      w="full"
                    >
                      <input {...getInputProps()} />

                      {/* Image Previews AT THE TOP of the dropzone */}
                      <Flex gap="16px" mb={2} flexWrap="wrap" justify="flex-start" minH="90px">
                        {/* Existing Images */}
                        {existingImages.map((img) => (
                          <Box key={img.id} position="relative">
                            <Image
                              src={img.url}
                              alt="Parcel"
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

                      {/* Instructions */}
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
                        size="lg"
                      >
                        Upload {newImages.length} Image{newImages.length > 1 ? 's' : ''}
                      </Button>
                    )}
                  </VStack>
                </StandardField>

                {/* Certification */}
                <StandardField
                  label="Certification"
                  helpText="Mark this parcel as certified if it meets certification standards"
                >
                  <VStack align="stretch" spacing={4}>
                    <HStack>
                      <Switch {...methods.register('certified')} colorScheme="green" size="md" />
                      <Text fontSize="sm" color="gray.600">
                        {watch('certified') ? 'Certified Parcel' : 'Not Certified'}
                      </Text>
                    </HStack>

                    {watch('certified') && (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <StandardField
                          label="Contact Number"
                          helpText="For certification inquiries"
                        >
                          <Input
                            {...methods.register('contact_phone')}
                            placeholder="(555) 123-4567"
                            borderRadius="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: 'green.400' }}
                            _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                            size="lg"
                          />
                        </StandardField>

                        <StandardField label="Certification Address" helpText="Physical address">
                          <Input
                            {...methods.register('address')}
                            placeholder="123 Farm Road, City, State"
                            borderRadius="lg"
                            borderColor="gray.300"
                            _hover={{ borderColor: 'green.400' }}
                            _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #38A169' }}
                            size="lg"
                          />
                        </StandardField>
                      </SimpleGrid>
                    )}
                  </VStack>
                </StandardField>

                {/* Final Summary */}
                <StandardAlert
                  status="success"
                  title="Ready to Submit"
                  description="Your parcel information is complete. You can always update these details later."
                />

                {/* Navigation */}
                <HStack spacing={3} justify="space-between" pt={4}>
                  <StandardButton
                    variant="outline"
                    leftIcon={<FaChevronLeft />}
                    onClick={previousStep}
                  >
                    Back to Description
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
                      {isEdit ? 'Update Parcel' : 'Create Parcel'}
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

export default StandardParcelForm;
