/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Box,
  Button,
  Select as ChakraSelect,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Progress,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Spinner,
  Grid,
  Circle
} from '@chakra-ui/react';
import { BsCircleFill, BsFillCloudLightningRainFill } from 'react-icons/bs';
import {
  FaLeaf,
  FaCamera,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTools,
  FaSeedling,
  FaBusinessTime,
  FaBug,
  FaInfoCircle
} from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useReducer, useRef, useState, useCallback } from 'react';
import { clearForm, setForm } from 'store/features/formSlice';
import { object, string } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CardWithMap from '../CardWithMap';
import ChemicalTab from './ChemicalTab';
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import FormLayout from 'components/Forms/FormLayout';
import GeneralTab from './GeneralTab';
import EquipmentTab from './EquipmentTab';
import SoilManagementTab from './SoilManagementTab';
import BusinessTab from './BusinessTab';
import PestManagementTab from './PestManagementTab';
import Header from 'views/Pages/Profile/Overview/components/Header';
import ProductionTab from './ProductionTab';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import { RocketIcon } from 'components/Icons/Icons';
import Select from 'react-select';
import { SlChemistry } from 'react-icons/sl';
import WeatherTab from './WeatherTab';
import { addCompanyEstablishment } from 'store/features/companySlice';
import avatar4 from 'assets/img/avatars/avatar4.png';
import imageMap from 'assets/img/imageMap.png';
import {
  useCreateEventMutation,
  useGetEventQuery,
  useUpdateEventMutation
} from 'store/api/historyApi';
import { useCalculateEventCarbonImpactMutation } from 'store/api/carbonApi';
import { CarbonImpactPreview } from 'components/Events/CarbonImpactPreview';
import { useDropzone } from 'react-dropzone';
import { useGoogleMap } from '@react-google-maps/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';

// Enhanced form schemas with better validation
const formSchemaBasic = object({
  date: string().min(1, 'Date is required')
});

const formSchemaMainInfo = object({
  type: string().min(1, 'Event type is required')
});

const formSchemaDescription = object({
  description: string().min(1, 'Description is required')
});

const formSchemaMedia = object({});

// Event type configuration
const eventTypeConfig = [
  {
    id: 0,
    name: 'weather',
    label: 'Weather',
    icon: BsFillCloudLightningRainFill,
    color: 'blue',
    description: 'Weather events affecting your crops'
  },
  {
    id: 1,
    name: 'production',
    label: 'Production',
    icon: RocketIcon,
    color: 'green',
    description: 'Agricultural production activities'
  },
  {
    id: 2,
    name: 'chemical',
    label: 'Chemical',
    icon: SlChemistry,
    color: 'purple',
    description: 'Chemical applications and treatments'
  },
  {
    id: 3,
    name: 'general',
    label: 'General',
    icon: FaEdit,
    color: 'gray',
    description: 'Other farming activities'
  },
  {
    id: 4,
    name: 'equipment',
    label: 'Equipment',
    icon: FaTools,
    color: 'orange',
    description: 'Equipment maintenance and fuel tracking'
  },
  {
    id: 5,
    name: 'soil_management',
    label: 'Soil Management',
    icon: FaSeedling,
    color: 'brown',
    description: 'Soil testing and amendments'
  },
  {
    id: 6,
    name: 'business',
    label: 'Business',
    icon: FaBusinessTime,
    color: 'teal',
    description: 'Sales, certifications, and compliance'
  },
  {
    id: 7,
    name: 'pest_management',
    label: 'Pest Management',
    icon: FaBug,
    color: 'red',
    description: 'IPM practices and beneficial releases'
  }
];

// Step configuration
const steps = [
  { title: 'Basic Info', description: 'Event type & date' },
  { title: 'Event Details', description: 'Specific information' },
  { title: 'Description', description: 'Notes & observations' },
  { title: 'Media', description: 'Photos & documentation' }
];

function NewEvent({ isEdit = false, eventId = null }) {
  const intl = useIntl();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { parcelId, establishmentId } = useParams();
  const [searchParams] = useSearchParams();

  // Get event type from URL parameters when editing
  const eventTypeFromUrl = searchParams.get('event_type');

  // Theme colors
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.700');
  const bgActiveButton = useColorModeValue('blue.500', 'blue.300');
  const bgButtonGroup = useColorModeValue('gray.50', 'gray.700');

  // State management
  const [activeEventType, setActiveEventType] = useState(
    eventTypeFromUrl ? parseInt(eventTypeFromUrl) : 0
  );
  const [carbonCalculation, setCarbonCalculation] = useState(null);
  const [isCalculatingCarbon, setIsCalculatingCarbon] = useState(false);
  const [eventFormData, setEventFormData] = useState({});
  const [shouldShowCarbonTips, setShouldShowCarbonTips] = useState(false);

  // Redux state
  const currentEvent = useSelector((state) => state.form.currentForm?.event);
  const currentCompany = useSelector((state) => state.company.currentCompany);

  // Step management
  const [activeStep, setActiveStep] = useState(0);

  // Form methods for each step
  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16)
    }
  });

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo)
  });

  const descriptionMethods = useForm({
    resolver: zodResolver(formSchemaDescription)
  });

  const mediaMethods = useForm({
    resolver: zodResolver(formSchemaMedia)
  });

  // API mutations
  const [createEvent, { isLoading: isCreatingEvent, isSuccess: isCreateSuccess }] =
    useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent, isSuccess: isUpdateSuccess }] =
    useUpdateEventMutation();
  const [calculateCarbonImpact, { isLoading: isCalculating }] =
    useCalculateEventCarbonImpactMutation();

  // Load existing event data when editing - now using event type from URL
  const {
    data: existingEvent,
    isLoading: isLoadingEvent,
    error: eventError
  } = useGetEventQuery(
    {
      companyId: currentCompany?.id,
      establishmentId: parseInt(establishmentId || '0'),
      eventId: parseInt(eventId || '0'),
      eventType: eventTypeFromUrl ? parseInt(eventTypeFromUrl) : undefined
    },
    {
      skip: !isEdit || !currentCompany?.id || !eventId || !eventTypeFromUrl
    }
  );

  // Parcel data
  const parcels = useSelector((state) =>
    state.company.currentCompany?.establishments?.reduce((res_parcels, establishment) => {
      const establishmentParcels = establishment.parcels
        .filter((parcel) => parcel.has_current_production)
        .map((parcel) => {
          if (parcel.id === Number(parcelId)) {
            return {
              value: parcel.id,
              label: parcel.name,
              isFixed: true
            };
          }
          return {
            value: parcel.id,
            label: parcel.name
          };
        });
      return res_parcels.concat(establishmentParcels);
    }, [])
  );

  // Carbon calculation with debouncing
  const carbonTimeoutRef = useRef(null);

  const calculateCarbonWithDebounce = useCallback(
    async (formData, eventType) => {
      if (!formData || Object.keys(formData).length === 0) {
        setCarbonCalculation(null);
        setShouldShowCarbonTips(false);
        return;
      }

      // Clear previous timeout
      if (carbonTimeoutRef.current) {
        clearTimeout(carbonTimeoutRef.current);
      }

      carbonTimeoutRef.current = setTimeout(async () => {
        try {
          setIsCalculatingCarbon(true);

          // Map event type to backend format
          const eventTypeMap = {
            0: 'weather',
            1: 'production',
            2: 'chemical',
            3: 'general',
            4: 'equipment',
            5: 'soil_management',
            6: 'business',
            7: 'pest_management'
          };

          const event_type = eventTypeMap[eventType] || 'general';

          const event_data = {
            ...formData,
            date: formData.date || new Date().toISOString().slice(0, 16),
            event_type: event_type,
            // Add parcel context for better calculations
            parcel_id: parseInt(parcelId || '0'),
            establishment_id: parseInt(establishmentId || '0')
          };

          const result = await calculateCarbonImpact({
            event_type,
            event_data
          }).unwrap();

          setCarbonCalculation(result);
          setShouldShowCarbonTips(true);
        } catch (error) {
          console.error('Carbon calculation failed:', error);
          // Set fallback calculation based on event type
          const fallbackScores = {
            0: { co2e: 0.1, efficiency_score: 75 }, // Weather - minimal impact
            1: { co2e: 2.5, efficiency_score: 60 }, // Production - moderate impact
            2: { co2e: 1.8, efficiency_score: 50 }, // Chemical - higher impact
            3: { co2e: 0.5, efficiency_score: 70 }, // General - low impact
            4: { co2e: 1.0, efficiency_score: 60 }, // Equipment - moderate impact
            5: { co2e: 0.3, efficiency_score: 80 }, // Soil Management - high impact
            6: { co2e: 0.2, efficiency_score: 90 }, // Business - very high impact
            7: { co2e: 0.8, efficiency_score: 50 } // Pest Management - moderate impact
          };

          const fallback = fallbackScores[eventType] || fallbackScores[3];

          setCarbonCalculation({
            co2e: fallback.co2e,
            efficiency_score: fallback.efficiency_score,
            usda_verified: false,
            calculation_method: 'estimate',
            event_type: eventTypeMap[eventType] || 'general',
            timestamp: new Date().toISOString(),
            estimated_cost: fallback.co2e * 50, // Rough cost estimate
            warning: 'Using estimated values - calculations temporarily unavailable'
          });
          setShouldShowCarbonTips(true);
        } finally {
          setIsCalculatingCarbon(false);
        }
      }, 500);
    },
    [calculateCarbonImpact, parcelId, establishmentId]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (carbonTimeoutRef.current) {
        clearTimeout(carbonTimeoutRef.current);
      }
    };
  }, []);

  // Load existing event data and pre-fill forms when editing
  const hasLoadedExistingData = useRef(false);

  useEffect(() => {
    if (isEdit && existingEvent && !hasLoadedExistingData.current) {
      const eventDate = existingEvent.date
        ? new Date(existingEvent.date).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16);

      // Update form data state
      const initialData = {
        ...existingEvent,
        date: eventDate
      };
      setEventFormData(initialData);

      // Reset forms with existing data
      basicMethods.reset({
        date: eventDate
      });

      descriptionMethods.reset({
        description: existingEvent.description || ''
      });

      // Set event type from existing data
      const eventTypeFromData =
        existingEvent.event_type !== undefined ? existingEvent.event_type : 0;
      setActiveEventType(eventTypeFromData);

      // Store in Redux
      dispatch(
        setForm({
          event: {
            ...initialData
          }
        })
      );

      // Calculate carbon impact for existing data
      calculateCarbonWithDebounce(initialData, eventTypeFromData);

      // Mark as loaded to prevent re-initialization
      hasLoadedExistingData.current = true;
    }
  }, [isEdit, existingEvent, basicMethods, descriptionMethods, dispatch]);

  // Form submission handlers
  const onSubmitBasic = (data) => {
    const updatedData = { ...eventFormData, ...data, event_type: activeEventType };
    setEventFormData(updatedData);

    // Store in Redux
    dispatch(
      setForm({
        event: {
          ...currentEvent,
          ...updatedData
        }
      })
    );

    // Calculate carbon impact
    calculateCarbonWithDebounce(updatedData, activeEventType);

    setActiveStep(1);
  };

  const onSubmitMainInfo = (data) => {
    const updatedData = { ...eventFormData, ...data };
    setEventFormData(updatedData);

    dispatch(
      setForm({
        event: {
          ...currentEvent,
          ...updatedData
        }
      })
    );

    // Recalculate carbon with new data
    calculateCarbonWithDebounce(updatedData, activeEventType);

    setActiveStep(2);
  };

  // Handle tab form submission (Event Details step)
  const onSubmitTab = (data) => {
    const updatedData = { ...eventFormData, ...data };
    setEventFormData(updatedData);

    dispatch(
      setForm({
        event: {
          ...currentEvent,
          ...updatedData
        }
      })
    );

    // Recalculate carbon with new data
    calculateCarbonWithDebounce(updatedData, activeEventType);

    // Move to next step (Description)
    setActiveStep(2);
  };

  // Handle event type change
  const handleEventTypeChange = (eventTypeId) => {
    setActiveEventType(eventTypeId);

    // If we have form data, recalculate carbon for new event type
    if (Object.keys(eventFormData).length > 0) {
      calculateCarbonWithDebounce(eventFormData, eventTypeId);
    }
  };

  const onSubmitDescription = (data) => {
    const updatedData = { ...eventFormData, ...data };
    setEventFormData(updatedData);

    dispatch(
      setForm({
        event: {
          ...currentEvent,
          ...updatedData
        }
      })
    );

    setActiveStep(3);
  };

  // File upload
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 5,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });

  const onSubmitMedia = async () => {
    try {
      // Map frontend activeEventType to correct backend event_type
      const eventTypeMapping = {
        0: 0, // Weather -> 0
        1: 2, // Production -> 2 (FIXED: was incorrectly 1)
        2: 1, // Chemical -> 1 (FIXED: was incorrectly 2)
        3: 3, // General -> 3
        4: 4, // Equipment -> 4
        5: 5, // Soil Management -> 5
        6: 6, // Business -> 6
        7: 7 // Pest Management -> 7
      };

      const backendEventType = eventTypeMapping[activeEventType] ?? activeEventType;

      // Enhanced validation to prevent "Unknown" values
      const validateAndEnhanceEventData = (data) => {
        const enhancedData = { ...data };

        // Get current history's crop type for intelligent defaults
        const currentParcel = currentCompany?.establishments
          ?.find((est) => est.id === parseInt(establishmentId || '0'))
          ?.parcels?.find((p) => p.id === parseInt(parcelId || '0'));
        const cropType = currentParcel?.current_history?.crop_type?.name || 'general';

        // Validate required fields are present - don't add mocked values, instead ensure forms have proper inputs
        const requiredFieldsByType = {
          1: ['type', 'commercial_name', 'volume', 'area', 'concentration', 'way_of_application'], // Chemical
          2: ['type'], // Production - other fields are optional but encouraged
          4: ['type', 'equipment_name'], // Equipment - fuel data should come from form inputs
          5: ['type'], // Soil Management - specific fields should come from form inputs
          7: ['type'], // Pest Management - specific fields should come from form inputs
          0: ['type'], // Weather
          3: ['name'], // General
          6: ['type'] // Business
        };

        const requiredFields = requiredFieldsByType[backendEventType] || [];
        const missingFields = requiredFields.filter((field) => {
          const value = enhancedData[field];
          return (
            !value || value.toString().toLowerCase() === 'unknown' || value.toString().trim() === ''
          );
        });

        if (missingFields.length > 0) {
          console.warn(
            `Missing required fields for event type ${backendEventType}:`,
            missingFields
          );
          // Don't auto-fill - let the form validation catch this
          throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }

        // Ensure observation is never empty or "Unknown" - this is the only field we'll provide a fallback for
        if (
          !enhancedData.observation ||
          enhancedData.observation.toLowerCase() === 'unknown' ||
          enhancedData.observation.trim() === ''
        ) {
          const eventTypeName =
            eventTypeConfig.find((t) => t.id === activeEventType)?.label || 'Farm';
          enhancedData.observation = `${eventTypeName} activity completed successfully. Standard procedures followed for ${cropType} production.`;
        }

        return enhancedData;
      };

      const enhancedEventFormData = validateAndEnhanceEventData(eventFormData);

      const finalEventData = {
        ...enhancedEventFormData,
        event_type: backendEventType, // Use corrected event_type mapping
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parseInt(parcelId || '0'),
        parcels: [parseInt(parcelId || '0')],
        album: { images: acceptedFiles }
      };

      console.log('Final event data being sent:', finalEventData);

      if (isEdit) {
        // Update existing event
        await updateEvent({
          companyId: currentCompany.id,
          establishmentId: parseInt(establishmentId || '0'),
          eventId: parseInt(eventId || '0'),
          eventType: eventTypeFromUrl ? parseInt(eventTypeFromUrl) : backendEventType,
          ...finalEventData,
          id: existingEvent.id
        }).unwrap();

        toast({
          title: intl.formatMessage({ id: 'app.success' }) || 'Success',
          description:
            intl.formatMessage({ id: 'app.eventUpdatedSuccessfully' }) ||
            'Event updated successfully',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        // Create new event
        await createEvent(finalEventData).unwrap();

        toast({
          title: intl.formatMessage({ id: 'app.success' }) || 'Success',
          description:
            intl.formatMessage({ id: 'app.eventCreatedSuccessfully' }) ||
            'Event created successfully with complete data for carbon calculation',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }

      // Navigate back to the parcel details
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}`, {
        replace: true
      });
    } catch (error) {
      console.error('Error creating/updating event:', error);
      toast({
        title: intl.formatMessage({ id: 'app.error' }) || 'Error',
        description:
          intl.formatMessage({ id: 'app.errorCreatingEvent' }) ||
          'Failed to save event. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  // Navigation effects
  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      dispatch(clearForm());
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
    }
  }, [isCreateSuccess, isUpdateSuccess, dispatch, navigate, establishmentId, parcelId]);

  // Watch for form data changes and recalculate carbon when on event details step
  useEffect(() => {
    if (activeStep === 1 && Object.keys(eventFormData).length > 0) {
      calculateCarbonWithDebounce(eventFormData, activeEventType);
    }
  }, [eventFormData, activeEventType, activeStep]);

  // Get current history's crop type for intelligent defaults
  const currentParcel = currentCompany?.establishments
    ?.find((est) => est.id === parseInt(establishmentId || '0'))
    ?.parcels?.find((p) => p.id === parseInt(parcelId || '0'));
  const cropType = currentParcel?.current_history?.crop_type?.name || 'general';

  const tabConfig = [
    {
      id: 0,
      label: intl.formatMessage({ id: 'app.weather' }),
      component: (
        <WeatherTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    },
    {
      id: 1,
      label: intl.formatMessage({ id: 'app.production' }),
      component: (
        <ProductionTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    },
    {
      id: 2,
      label: intl.formatMessage({ id: 'app.chemical' }),
      component: (
        <ChemicalTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    },
    {
      id: 3,
      label: intl.formatMessage({ id: 'app.general' }),
      component: (
        <GeneralTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    },
    {
      id: 4,
      label: intl.formatMessage({ id: 'app.equipment' }),
      component: (
        <EquipmentTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    },
    {
      id: 5,
      label: intl.formatMessage({ id: 'app.soilManagement' }),
      component: (
        <SoilManagementTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    },
    {
      id: 6,
      label: intl.formatMessage({ id: 'app.business' }),
      component: (
        <BusinessTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    },
    {
      id: 7,
      label: intl.formatMessage({ id: 'app.pestManagement' }),
      component: (
        <PestManagementTab
          onSubmitHandler={onSubmitTab}
          onPrev={() => setActiveEventType(null)}
          initialValues={eventFormData}
          cropType={cropType}
        />
      )
    }
  ];

  return (
    <Box w="100%" bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh" pt={6}>
      {/* Loading state when editing */}
      {isEdit && isLoadingEvent && (
        <Box maxW="1200px" mx="auto" p={{ base: 4, md: 6, lg: 8 }}>
          <Card boxShadow="xl" bg={bgColor} borderRadius="2xl">
            <CardBody py={8} px={6}>
              <VStack spacing={4} align="center">
                <Spinner size="xl" color="green.500" />
                <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                  {intl.formatMessage({ id: 'app.loadingEvent' }) || 'Loading event data...'}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      )}

      {/* Error state when editing */}
      {isEdit && eventError && (
        <Box maxW="1200px" mx="auto" p={{ base: 4, md: 6, lg: 8 }}>
          <Card boxShadow="xl" bg={bgColor} borderRadius="2xl">
            <CardBody py={8} px={6}>
              <VStack spacing={4} align="center">
                <Text fontSize="lg" fontWeight="semibold" color="red.500">
                  {intl.formatMessage({ id: 'app.errorLoadingEvent' }) ||
                    'Error loading event data'}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      )}

      {/* Main Content - Show only when not loading or when creating */}
      {(!isEdit || !isLoadingEvent) && !eventError && (
        <>
          {/* Main Content */}
          <Box maxW="1200px" mx="auto" p={{ base: 4, md: 6, lg: 8 }}>
            <VStack spacing={{ base: 8, md: 10 }} align="stretch">
              {/* Header Card - Full Width */}
              <Card boxShadow="xl" bg={bgColor} borderRadius="2xl">
                <CardBody py={4} px={4}>
                  <HStack spacing={4} align="center">
                    <VStack spacing={2} align="start" flex="1">
                      <Text fontSize="xl" fontWeight="bold" color={textColor} lineHeight="1.2">
                        {isEdit
                          ? intl.formatMessage({ id: 'app.editEvent' }) || 'Edit Event'
                          : intl.formatMessage({ id: 'app.createNewEvent' }) || 'Add a new event'}
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontWeight="400">
                        {isEdit
                          ? intl.formatMessage({ id: 'app.editEventDescription' }) ||
                            'Update the event information below.'
                          : intl.formatMessage({ id: 'app.createNewEventDescription' }) ||
                            'Complete the form below to add a new event to your parcel history.'}
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

              {/* Progress Stepper - Full Width */}
              <Card boxShadow="xl" bg={bgColor} borderRadius="2xl">
                <CardBody py={0} px={6}>
                  <HStack
                    spacing={{ base: 3, md: 6 }}
                    justify="center"
                    align="center"
                    w="100%"
                    maxW="800px"
                    mx="auto"
                  >
                    {steps.map((step, index) => (
                      <React.Fragment key={index}>
                        <VStack spacing={3} align="center" flex="1">
                          <Circle
                            size={{ base: '36px', md: '44px' }}
                            bg={
                              index < activeStep
                                ? 'green.500'
                                : index === activeStep
                                ? 'green.400'
                                : 'gray.200'
                            }
                            color={index <= activeStep ? 'white' : 'gray.500'}
                            fontSize={{ base: 'sm', md: 'md' }}
                            fontWeight="bold"
                            boxShadow={index === activeStep ? 'lg' : 'md'}
                            transition="all 0.3s"
                          >
                            {index < activeStep ? (
                              <FaCheckCircle size="18px" />
                            ) : (
                              <Text>{index + 1}</Text>
                            )}
                          </Circle>
                          <VStack spacing={1} align="center">
                            <Text
                              fontSize={{ base: 'xs', md: 'sm' }}
                              fontWeight="bold"
                              color={index <= activeStep ? 'green.500' : 'gray.500'}
                              textAlign="center"
                              lineHeight="1.2"
                            >
                              {step.title}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              textAlign="center"
                              display={{ base: 'none', md: 'block' }}
                              lineHeight="1.2"
                            >
                              {step.description}
                            </Text>
                          </VStack>
                        </VStack>
                        {index < steps.length - 1 && (
                          <Box
                            height="3px"
                            flex="1"
                            bg={index < activeStep ? 'green.500' : 'gray.200'}
                            borderRadius="full"
                            mx={{ base: 1, md: 2 }}
                            transition="all 0.3s"
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </HStack>
                </CardBody>
              </Card>

              {/* Step Content */}
              <Flex direction={{ base: 'column', xl: 'row' }} gap={10} align="start">
                {/* Main Form */}
                <Box flex="1" maxW={{ base: '100%', xl: '750px' }} w="100%">
                  {activeStep === 0 && (
                    <Card boxShadow="lg" bg={bgColor} borderRadius="xl">
                      <CardHeader pb={2}>
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          {intl.formatMessage({ id: 'app.basicEventInfo' }) ||
                            'Basic Event Information'}
                        </Text>
                      </CardHeader>
                      <CardBody pt={4} pb={6} px={{ base: 4, md: 6 }}>
                        <FormProvider {...basicMethods}>
                          <form onSubmit={basicMethods.handleSubmit(onSubmitBasic)}>
                            <VStack spacing={{ base: 5, md: 6 }} align="stretch">
                              {/* Event Type Selection */}
                              <Box>
                                <FormLabel fontSize="sm" fontWeight="bold" mb={4}>
                                  {intl.formatMessage({ id: 'app.selectEventType' }) ||
                                    'Select Event Type'}
                                </FormLabel>
                                {isEdit && (
                                  <Box
                                    mb={4}
                                    p={3}
                                    bg="yellow.50"
                                    borderRadius="md"
                                    borderWidth="1px"
                                    borderColor="yellow.200"
                                  >
                                    <Text fontSize="sm" color="yellow.800">
                                      <Icon as={FaInfoCircle} mr={2} />
                                      {intl.formatMessage({ id: 'app.eventTypeCannotBeChanged' }) ||
                                        'Event type cannot be changed after creation for data integrity reasons.'}
                                    </Text>
                                  </Box>
                                )}
                                <Grid
                                  templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                                  gap={4}
                                >
                                  {eventTypeConfig.map((eventType) => (
                                    <Button
                                      key={eventType.id}
                                      variant={
                                        activeEventType === eventType.id ? 'solid' : 'outline'
                                      }
                                      colorScheme={eventType.color}
                                      size="lg"
                                      height={{ base: '120px', md: '140px' }}
                                      display="flex"
                                      flexDirection="column"
                                      justifyContent="center"
                                      alignItems="center"
                                      gap={2}
                                      p={4}
                                      onClick={() => handleEventTypeChange(eventType.id)}
                                      isDisabled={isEdit}
                                      opacity={isEdit && activeEventType !== eventType.id ? 0.4 : 1}
                                      _hover={
                                        !isEdit
                                          ? {
                                              transform: 'translateY(-2px)',
                                              boxShadow: 'lg'
                                            }
                                          : {}
                                      }
                                      transition="all 0.2s"
                                      whiteSpace="normal"
                                      overflow="hidden"
                                    >
                                      <Icon as={eventType.icon} boxSize={6} />
                                      <VStack spacing={1} width="100%">
                                        <Text fontSize="sm" fontWeight="bold" textAlign="center">
                                          {eventType.label}
                                        </Text>
                                        <Text
                                          fontSize="xs"
                                          opacity={0.8}
                                          textAlign="center"
                                          lineHeight="1.2"
                                          noOfLines={2}
                                          display={{ base: 'none', md: 'block' }}
                                        >
                                          {eventType.description}
                                        </Text>
                                      </VStack>
                                    </Button>
                                  ))}
                                </Grid>
                              </Box>

                              {/* Date Selection */}
                              <FormInput
                                label={
                                  intl.formatMessage({ id: 'app.eventDateTime' }) ||
                                  'Event Date & Time'
                                }
                                type="datetime-local"
                                name="date"
                                isRequired
                              />

                              {/* Action Buttons */}
                              <Box pt={6} mt={4} borderTop="1px" borderColor={borderColor}>
                                <HStack justify="flex-end">
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
                              </Box>
                            </VStack>
                          </form>
                        </FormProvider>
                      </CardBody>
                    </Card>
                  )}

                  {activeStep === 1 && (
                    <Card boxShadow="lg" bg={bgColor} borderRadius="xl">
                      <CardHeader pb={2}>
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          {intl.formatMessage({ id: 'app.eventDetails' }) || 'Event Details'}
                        </Text>
                      </CardHeader>
                      <CardBody pt={4} pb={6} px={{ base: 4, md: 6 }}>
                        {activeEventType === 0 && (
                          <WeatherTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                        {activeEventType === 1 && (
                          <ProductionTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                        {activeEventType === 2 && (
                          <ChemicalTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                        {activeEventType === 3 && (
                          <GeneralTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                        {activeEventType === 4 && (
                          <EquipmentTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                        {activeEventType === 5 && (
                          <SoilManagementTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                        {activeEventType === 6 && (
                          <BusinessTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                        {activeEventType === 7 && (
                          <PestManagementTab
                            onSubmitHandler={onSubmitMainInfo}
                            onPrev={goToPreviousStep}
                            initialValues={isEdit && existingEvent ? existingEvent : {}}
                            cropType={cropType}
                          />
                        )}
                      </CardBody>
                    </Card>
                  )}

                  {activeStep === 2 && (
                    <Card boxShadow="lg" bg={bgColor} borderRadius="xl">
                      <CardHeader pb={2}>
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          {intl.formatMessage({ id: 'app.description' }) || 'Description & Notes'}
                        </Text>
                      </CardHeader>
                      <CardBody pt={4} pb={6} px={{ base: 4, md: 6 }}>
                        <FormProvider {...descriptionMethods}>
                          <form
                            onSubmit={descriptionMethods.handleSubmit(onSubmitDescription)}
                            style={{ width: '100%' }}
                          >
                            <VStack spacing={{ base: 5, md: 6 }} align="stretch">
                              <Box w="100%">
                                <FormLabel
                                  fontSize="sm"
                                  fontWeight="semibold"
                                  mb={3}
                                  color={textColor}
                                >
                                  {intl.formatMessage({ id: 'app.eventDescription' }) ||
                                    'Event Description'}
                                </FormLabel>
                                <Box
                                  w="100%"
                                  h="100%"
                                  overflow="hidden"
                                  bg="white"
                                  _focusWithin={{
                                    borderColor: 'green.400',
                                    boxShadow: '0 0 0 1px var(--chakra-colors-green-400)'
                                  }}
                                  transition="all 0.3s ease"
                                >
                                  <Editor />
                                </Box>
                              </Box>

                              <Box pt={6} mt={4} borderTop="1px" borderColor={borderColor}>
                                <HStack justify="space-between">
                                  <Button
                                    variant="outline"
                                    onClick={goToPreviousStep}
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
                              </Box>
                            </VStack>
                          </form>
                        </FormProvider>
                      </CardBody>
                    </Card>
                  )}

                  {activeStep === 3 && (
                    <Card boxShadow="lg" bg={bgColor} borderRadius="xl">
                      <CardHeader pb={2}>
                        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
                          {intl.formatMessage({ id: 'app.mediaAndDocumentation' }) ||
                            'Media & Documentation'}
                        </Text>
                      </CardHeader>
                      <CardBody pt={4} pb={6} px={{ base: 4, md: 6 }}>
                        <VStack spacing={{ base: 5, md: 6 }} align="stretch">
                          <Box w="100%">
                            <FormLabel fontSize="sm" fontWeight="semibold" mb={3} color={textColor}>
                              {intl.formatMessage({ id: 'app.eventPhotos' }) || 'Event Photos'}
                            </FormLabel>
                            <Box
                              border="2px dashed"
                              borderColor={borderColor}
                              borderRadius="lg"
                              p={8}
                              minH="280px"
                              textAlign="center"
                              cursor="pointer"
                              transition="all 0.3s ease"
                              _hover={{
                                borderColor: 'green.400',
                                bg: useColorModeValue('green.50', 'green.900'),
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg'
                              }}
                              {...getRootProps()}
                            >
                              <Input {...getInputProps()} />
                              {acceptedFiles.length > 0 ? (
                                <VStack spacing={6} justify="center" h="full">
                                  <Icon as={FaCheckCircle} color="green.500" boxSize={12} />
                                  <Text fontWeight="bold" fontSize="lg" color={textColor}>
                                    {acceptedFiles.length}{' '}
                                    {intl.formatMessage({ id: 'app.filesSelected' }) ||
                                      'files selected'}
                                  </Text>
                                  <Grid
                                    templateColumns="repeat(auto-fill, minmax(140px, 1fr))"
                                    gap={6}
                                    w="100%"
                                    maxW="600px"
                                    mx="auto"
                                  >
                                    {acceptedFiles.map((file, index) => (
                                      <Box key={index} textAlign="center">
                                        <Box
                                          borderRadius="xl"
                                          overflow="hidden"
                                          mb={3}
                                          boxShadow="lg"
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{
                                              width: '100%',
                                              height: '100px',
                                              objectFit: 'cover'
                                            }}
                                          />
                                        </Box>
                                        <Text
                                          fontSize="sm"
                                          color="gray.600"
                                          noOfLines={1}
                                          fontWeight="500"
                                        >
                                          {file.name}
                                        </Text>
                                      </Box>
                                    ))}
                                  </Grid>
                                </VStack>
                              ) : (
                                <VStack spacing={6} justify="center" h="full">
                                  <Box p={4} bg="gray.100" borderRadius="full">
                                    <Icon as={FaCamera} color="gray.500" boxSize={12} />
                                  </Box>
                                  <VStack spacing={2}>
                                    <Text
                                      fontSize="lg"
                                      color="gray.600"
                                      fontWeight="600"
                                      textAlign="center"
                                    >
                                      {intl.formatMessage({ id: 'app.dragDropPhotos' }) ||
                                        'Drag & drop photos here, or click to select'}
                                    </Text>
                                    <Text fontSize="md" color="gray.500" textAlign="center">
                                      {intl.formatMessage({ id: 'app.maxFiles' }) ||
                                        'Maximum 5 files, up to 10MB each'}
                                    </Text>
                                  </VStack>
                                </VStack>
                              )}
                            </Box>
                          </Box>

                          <Box pt={6} mt={4} borderTop="1px" borderColor={borderColor}>
                            <HStack justify="space-between">
                              <Button
                                variant="outline"
                                onClick={goToPreviousStep}
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
                                onClick={onSubmitMedia}
                                isLoading={isEdit ? isUpdatingEvent : isCreatingEvent}
                                loadingText={
                                  isEdit
                                    ? intl.formatMessage({ id: 'app.updating' }) || 'Updating...'
                                    : intl.formatMessage({ id: 'app.creating' }) || 'Creating...'
                                }
                                rightIcon={<FaCheckCircle />}
                                size="md"
                                px={6}
                                h="42px"
                                borderRadius="lg"
                                fontWeight="600"
                                boxShadow="lg"
                                _hover={{ boxShadow: 'xl', transform: 'translateY(-1px)' }}
                                transition="all 0.3s ease"
                              >
                                {isEdit
                                  ? intl.formatMessage({ id: 'app.updateEvent' }) || 'Update Event'
                                  : intl.formatMessage({ id: 'app.createEvent' }) || 'Create Event'}
                              </Button>
                            </HStack>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </Box>

                {/* Carbon Impact Sidebar */}
                <Box
                  flex="0 0 auto"
                  w={{ base: '100%', xl: '400px' }}
                  position={{ xl: 'sticky' }}
                  top="80px"
                  alignSelf="flex-start"
                >
                  {activeStep === 0 && !carbonCalculation ? (
                    <Card boxShadow="lg" bg={bgColor} borderRadius="xl">
                      <CardBody>
                        <VStack spacing={4} align="center" py={8}>
                          <Icon as={FaLeaf} color="gray.400" boxSize={12} />
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            {intl.formatMessage({ id: 'app.enterEventDetailsToSeeCarbon' }) ||
                              'Enter event details to see carbon impact'}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ) : (
                    <CarbonImpactPreview
                      eventType={eventTypeConfig[activeEventType]?.name}
                      formData={eventFormData}
                      calculation={carbonCalculation}
                      isCalculating={isCalculatingCarbon || isCalculating}
                    />
                  )}

                  {/* Tips and Guidelines */}
                  {activeStep === 1 && shouldShowCarbonTips && (
                    <Card mt={6} boxShadow="lg" bg={bgColor} borderRadius="xl">
                      <CardHeader pb={2}>
                        <HStack spacing={2}>
                          <Text fontSize="lg">💡</Text>
                          <Text fontSize="sm" fontWeight="bold" color={textColor}>
                            {intl.formatMessage({ id: 'app.carbonOptimizationTips' }) ||
                              'Optimization Suggestions'}
                          </Text>
                          {carbonCalculation?.efficiency_score && (
                            <Badge
                              colorScheme={
                                carbonCalculation.efficiency_score >= 70
                                  ? 'green'
                                  : carbonCalculation.efficiency_score >= 50
                                  ? 'yellow'
                                  : 'red'
                              }
                              fontSize="xs"
                              borderRadius="full"
                            >
                              {carbonCalculation.efficiency_score}/100
                            </Badge>
                          )}
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <VStack spacing={2} align="stretch">
                          {activeEventType === 2 && (
                            <>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.usePreciseNPKValues' }) ||
                                  'Use precise NPK values for accurate calculations'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.considerDripIrrigation' }) ||
                                  'Consider drip irrigation for higher efficiency'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.applyDuringOptimalWeather' }) ||
                                  'Apply during optimal weather conditions'}
                              </Text>
                            </>
                          )}
                          {activeEventType === 1 && (
                            <>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.trackFuelConsumption' }) ||
                                  'Track fuel consumption for equipment use'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.optimizeRoutePlanning' }) ||
                                  'Optimize route planning to reduce emissions'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.combineOperationsWhenPossible' }) ||
                                  'Combine operations when possible'}
                              </Text>
                            </>
                          )}
                          {activeEventType === 0 && (
                            <>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.monitorWeatherConditions' }) ||
                                  'Monitor weather conditions for optimal timing'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.useWeatherData' }) ||
                                  'Use weather data for better planning'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.implementProtectiveMeasures' }) ||
                                  'Implement protective measures to reduce impact'}
                              </Text>
                            </>
                          )}
                          {activeEventType === 3 && (
                            <>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.documentObservations' }) ||
                                  'Document observations for future reference'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.maintainDetailedRecords' }) ||
                                  'Maintain detailed records for analysis'}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                •{' '}
                                {intl.formatMessage({ id: 'app.considerSustainablePractices' }) ||
                                  'Consider sustainable practices'}
                              </Text>
                            </>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </Box>
              </Flex>
            </VStack>
          </Box>
        </>
      )}
    </Box>
  );
}

export default NewEvent;
