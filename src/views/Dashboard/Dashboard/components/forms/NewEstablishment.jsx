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
  Select,
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
  useColorModeValue,
  useToast,
  CircularProgress,
  Tooltip
} from '@chakra-ui/react';
import { Form, FormProvider, useForm, useWatch } from 'react-hook-form';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { clearForm, setForm } from 'store/features/formSlice';
import { object, string } from 'zod';
import { useDispatch, useSelector } from 'react-redux';

import { BsCircleFill } from 'react-icons/bs';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CardWithMap from '../CardWithMap';
// Custom components
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import FormLayout from 'components/Forms/FormLayout';
import Header from 'views/Pages/Profile/Overview/components/Header';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import { addCompanyEstablishment } from 'store/features/companySlice';
import avatar4 from 'assets/img/avatars/avatar4.png';
import imageMap from 'assets/img/imageMap.png';
import { useCreateEstablishmentMutation } from 'store/api/companyApi';
import { useDropzone } from 'react-dropzone';
import { useGoogleMap } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';
import { useS3Upload } from 'hooks/useS3Upload';
import { useFormContext } from 'react-hook-form';
import { useFileUpload } from '../../../../../services/uploadService';
import useSubscriptionCheck from 'hooks/useSubscriptionCheck';
import SubscriptionLimitModal from 'components/Modals/SubscriptionLimitModal';
import { InfoOutlineIcon } from '@chakra-ui/icons';

const formSchemaInfo = object({
  name: string().min(1, 'Name is required'),
  country: string().min(1, 'Country is required'),
  state: string().min(1, 'State is required'),
  city: string().min(1, 'City is required'),
  address: string().min(1, 'Address is required'),
  zone: string()
});

const formSchemaDescription = object({
  about: string().min(1, 'Required'),
  main_activities: string().min(1, 'Required'),
  location_highlights: string().optional(),
  custom_message: string().optional()
});

const formSchemaSocials = object({
  facebook: string(),
  instagram: string()
});

const formSchema = object({
  name: string().min(1, 'Name is required'),
  country: string().min(1, 'Country is required'),
  state: string().min(1, 'State is required'),
  city: string().min(1, 'City is required'),
  zone: string(),
  description: string().min(1, 'Description is required'),
  facebook: string(),
  instagram: string()
});

const reducer = (state, action) => {
  if (action.type === 'SWITCH_ACTIVE') {
    if (action.payload === 'overview') {
      const newState = {
        overview: true,
        teams: false,
        projects: false
      };
      return newState;
    } else if (action.payload === 'teams') {
      const newState = {
        overview: false,
        teams: true,
        projects: false
      };
      return newState;
    } else if (action.payload === 'projects') {
      const newState = {
        overview: false,
        teams: false,
        projects: true
      };
      return newState;
    }
  }
  return state;
};

function NewEstablishment() {
  const bgColor = useColorModeValue('white', 'gray.700');
  const dispatch = useDispatch();
  const currentEstablishment = useSelector((state) => state.form.currentForm?.establishment);
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const intl = useIntl();

  // Check subscription limits
  const { isChecking, canCreate, showLimitModal, setShowLimitModal, usage, currentPlan } =
    useSubscriptionCheck('establishment');

  // When component mounts, save the current path to localStorage
  // for potential return after subscription upgrade
  useEffect(() => {
    localStorage.setItem('last_form_path', window.location.pathname);
  }, []);

  const [skills, setSkills] = useState([
    {
      name: 'chakra-ui',
      id: 1
    },
    {
      name: 'react',
      id: 2
    },
    {
      name: 'javascript',
      id: 3
    }
  ]);

  const [activeBullets, setActiveBullets] = useState({
    mainInfo: true,
    description: false,
    media: false,
    socials: false
  });

  const mainInfoTab = useRef();
  const descriptionTab = useRef();
  const mediaTab = useRef();
  const socialsTab = useRef();

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      setSkills([
        ...skills,
        {
          name: e.target.value,
          id: skills.length === 0 ? 1 : skills[skills.length - 1].id + 1
        }
      ]);
      e.target.value = '';
    }
  };

  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const bgProfile = useColorModeValue(
    'hsla(0,0%,100%,.8)',
    'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
  );

  const infoMethods = useForm({
    resolver: zodResolver(formSchemaInfo)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = infoMethods;

  const descriptionMethods = useForm({
    resolver: zodResolver(formSchemaDescription)
  });

  const { reset: descriptionReset, handleSubmit: descriptionSubmit } = descriptionMethods;

  const socialsMethods = useForm({
    resolver: zodResolver(formSchemaSocials)
  });

  const { reset: socialsReset, handleSubmit: socialsSubmit } = socialsMethods;

  const mediaFormMethods = useForm();

  const { uploadMultipleFiles } = useFileUpload();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);

  const toast = useToast();

  const onSubmitInfo = async (data) => {
    dispatch(setForm({ establishment: data }));
    descriptionTab.current.click();
  };

  const onSubmitDescription = (data) => {
    console.log('onSubmitDescription called with:', data);
    if (!mediaTab.current) {
      console.error('mediaTab ref is not set');
      return;
    }
    dispatch(
      setForm({
        establishment: {
          ...currentEstablishment,
          ...data
        }
      })
    );
    mediaTab.current.click();
  };

  const [
    createEstablishment,
    {
      data: dataEstablishment,
      error: errorEstablishment,
      isSuccess: isSuccessEstablishment,
      isLoading: isLoadingEstablishment
    }
  ] = useCreateEstablishmentMutation();

  const onSubmitSocials = (data) => {
    dispatch(
      setForm({
        establishment: {
          ...currentEstablishment,
          ...(data?.facebook && { facebook: data.facebook }),
          ...(data?.instagram && { instagram: data.instagram })
        }
      })
    );

    // Create the establishment using the uploaded image URLs
    createEstablishment({
      companyId: currentCompany.id,
      establishment: {
        ...currentEstablishment,
        uploaded_image_urls: uploadedImageUrls, // Use the stored URLs
        ...(data?.facebook && { facebook: data.facebook }),
        ...(data?.instagram && { instagram: data.instagram }),
        company: currentCompany.id
      }
    });
  };

  useEffect(() => {
    if (isSuccessEstablishment) {
      dispatch(addCompanyEstablishment(dataEstablishment));
      dispatch(clearForm());
      navigate(`/admin/dashboard/establishment/${dataEstablishment.id}`);
    }
  }, [isSuccessEstablishment]);

  const tabsList = [
    {
      ref: mainInfoTab,
      name: 'mainInfo',
      label: intl.formatMessage({ id: 'app.mainInfo' }),
      nextTab: 'description',
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          description: false,
          media: false,
          socials: false
        })
    },
    {
      ref: descriptionTab,
      name: 'description',
      label: intl.formatMessage({ id: 'app.description' }),
      nextTab: 'media',
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          description: true,
          media: false,
          socials: false
        })
    },
    {
      ref: mediaTab,
      name: 'media',
      label: intl.formatMessage({ id: 'app.media' }),
      nextTab: 'socials',
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          description: true,
          media: true,
          socials: false
        })
    },
    {
      ref: socialsTab,
      name: 'socials',
      label: intl.formatMessage({ id: 'app.socials' }),
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          description: true,
          media: true,
          socials: true
        })
    }
  ];

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Store the file names for preview purposes
      const fileNames = acceptedFiles.map((file) => file.name);
      setUploadedImageUrls(fileNames);
      console.log('Dropped files:', fileNames);
    }
  });

  const handleFileUpload = async () => {
    if (acceptedFiles.length === 0) {
      toast({
        title: intl.formatMessage({ id: 'app.noFilesSelected' }),
        description: intl.formatMessage({ id: 'app.pleaseSelectFilesToUpload' }),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload all files and get URLs
      const urls = await uploadMultipleFiles(acceptedFiles);

      // Store the uploaded URLs
      setUploadedImageUrls(urls);

      toast({
        title: intl.formatMessage({ id: 'app.uploadSuccess' }),
        description: intl.formatMessage({ id: 'app.filesUploaded' }, { count: urls.length }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Proceed to next step
      socialsTab.current.click();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: intl.formatMessage({ id: 'app.uploadError' }),
        description: intl.formatMessage({ id: 'app.fileUploadFailed' }),
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDirectFileUpload = () => {
    if (acceptedFiles.length === 0) {
      toast({
        title: intl.formatMessage({ id: 'app.noFilesSelected' }),
        description: intl.formatMessage({ id: 'app.pleaseSelectFilesToUpload' }),
        status: 'warning',
        duration: 5000,
        isClosable: true
      });
      return;
    }

    // Get the base URL from environment or use default
    const baseUrl = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8000';

    // Create a FormData object directly
    const formData = new FormData();

    // Important: use the SAME field name as in the server-side code
    formData.append('file', acceptedFiles[0]);

    // Set isUploading to show loading state
    setIsUploading(true);

    // Use fetch directly instead of form submission
    fetch(`${baseUrl}/api/local-upload/`, {
      method: 'POST',
      body: formData,
      // Important: Do NOT set Content-Type header, let the browser set it with boundary
      credentials: 'include'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Upload successful:', data);
        setUploadedImageUrls([data.file_url]);

        toast({
          title: intl.formatMessage({ id: 'app.uploadSuccess' }),
          description: intl.formatMessage({ id: 'app.filesUploaded' }, { count: 1 }),
          status: 'success',
          duration: 5000,
          isClosable: true
        });

        // Proceed to next step
        socialsTab.current.click();
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        toast({
          title: intl.formatMessage({ id: 'app.uploadError' }),
          description: `${intl.formatMessage({ id: 'app.fileUploadFailed' })}: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // Add a static country list for the dropdown
  const countryOptions = [
    {
      value: '',
      label: intl.formatMessage({ id: 'app.selectOption', defaultMessage: 'Selecciona una opción' })
    },
    { value: 'Chile', label: 'Chile' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Peru', label: 'Perú' },
    { value: 'Mexico', label: 'México' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'United States', label: 'Estados Unidos' },
    { value: 'Spain', label: 'España' },
    { value: 'Brazil', label: 'Brasil' },
    { value: 'Other', label: intl.formatMessage({ id: 'app.other', defaultMessage: 'Otro' }) }
  ];

  return (
    <>
      {/* Subscription limit modal */}
      <SubscriptionLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        resourceType="establishment"
        currentPlan={currentPlan}
        usage={usage}
      />

      <FormLayout tabsList={tabsList} activeBullets={activeBullets}>
        <TabPanel>
          <Card>
            <CardHeader mb="22px">
              <Flex flexDirection="column">
                <Text color={textColor} fontSize="xl" fontWeight="bold">
                  {intl.formatMessage({
                    id: 'app.establishmentInfo',
                    defaultMessage: 'Información del establecimiento'
                  })}
                </Text>
                <Text color="gray.500" fontSize="sm" mt={2}>
                  {intl.formatMessage({
                    id: 'app.establishmentInfoHelper',
                    defaultMessage:
                      'Completa la información principal de tu establecimiento. Estos datos serán usados para la gestión interna y la generación del perfil público.'
                  })}
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormProvider {...infoMethods}>
                <form onSubmit={handleSubmit(onSubmitInfo)} style={{ width: '100%' }}>
                  <Stack direction="column" spacing="20px" w="100%">
                    <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                      <FormControl>
                        <FormInput
                          name="name"
                          label={intl.formatMessage({ id: 'app.name' })}
                          placeholder={intl.formatMessage({ id: 'app.establishmentName' })}
                          fontSize="xs"
                          autoComplete="organization"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel htmlFor="type" fontSize="xs" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.type' })}
                          <Tooltip
                            label={intl.formatMessage({
                              id: 'app.typeHelp',
                              defaultMessage:
                                'Tipo de establecimiento (ej: planta, bodega, campo, oficina)'
                            })}
                          >
                            <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                          </Tooltip>
                        </FormLabel>
                        <Input
                          id="type"
                          name="type"
                          placeholder={intl.formatMessage({
                            id: 'app.type',
                            defaultMessage: 'Ej: campo, bodega, oficina'
                          })}
                          fontSize="xs"
                          autoComplete="off"
                          {...infoMethods.register('type')}
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                      <FormControl>
                        <FormInput
                          name="address"
                          label={intl.formatMessage({ id: 'app.address' })}
                          placeholder={intl.formatMessage({ id: 'app.establishmentAddress' })}
                          fontSize="xs"
                          autoComplete="street-address"
                        />
                      </FormControl>
                      <FormControl>
                        <FormInput
                          name="country"
                          label={intl.formatMessage({ id: 'app.country' })}
                          placeholder={intl.formatMessage({ id: 'app.establishmentCountry' })}
                          fontSize="xs"
                          autoComplete="country"
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                      <FormControl>
                        <FormInput
                          name="state"
                          label={intl.formatMessage({ id: 'app.state' })}
                          placeholder={intl.formatMessage({ id: 'app.establishmentState' })}
                          fontSize="xs"
                          autoComplete="address-level1"
                        />
                      </FormControl>
                      <FormControl>
                        <FormInput
                          name="city"
                          label={intl.formatMessage({ id: 'app.city' })}
                          placeholder={intl.formatMessage({ id: 'app.establishmentCity' })}
                          fontSize="xs"
                          autoComplete="address-level2"
                        />
                      </FormControl>
                    </Stack>
                    <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                      <FormControl>
                        <FormLabel htmlFor="zone" fontSize="xs" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.zone' })}
                          <Tooltip
                            label={intl.formatMessage({
                              id: 'app.zoneHelp',
                              defaultMessage: 'Zona o sector dentro de la ciudad o región'
                            })}
                          >
                            <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                          </Tooltip>
                        </FormLabel>
                        <Input
                          id="zone"
                          name="zone"
                          placeholder={intl.formatMessage({
                            id: 'app.zone',
                            defaultMessage: 'Ej: Norte, Sur, Centro'
                          })}
                          fontSize="xs"
                          autoComplete="off"
                          {...infoMethods.register('zone')}
                        />
                      </FormControl>
                    </Stack>
                    <Text fontWeight="bold" fontSize="lg" mt={4} mb={2}>
                      {intl.formatMessage({
                        id: 'app.contactInformation',
                        defaultMessage: 'Información de contacto'
                      })}
                    </Text>
                    <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                      <FormControl>
                        <FormLabel htmlFor="contact_person" fontSize="xs" fontWeight="bold">
                          {intl.formatMessage({
                            id: 'app.contactPerson',
                            defaultMessage: 'Persona de contacto'
                          })}
                          <Tooltip
                            label={intl.formatMessage({
                              id: 'app.contactPersonHelp',
                              defaultMessage: 'Nombre de la persona responsable del establecimiento'
                            })}
                          >
                            <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                          </Tooltip>
                        </FormLabel>
                        <Input
                          id="contact_person"
                          name="contact_person"
                          placeholder={intl.formatMessage({
                            id: 'app.contactPerson',
                            defaultMessage: 'Ej: Juan Pérez'
                          })}
                          fontSize="xs"
                          autoComplete="name"
                          {...infoMethods.register('contact_person')}
                        />
                      </FormControl>
                      <FormControl>
                        <FormInput
                          name="contact_email"
                          label={intl.formatMessage({ id: 'app.contactEmail' })}
                          placeholder={intl.formatMessage({
                            id: 'app.companyContactEmail',
                            defaultMessage: 'Ej: contacto@empresa.com'
                          })}
                          fontSize="xs"
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormControl>
                        <FormInput
                          name="contact_phone"
                          label={intl.formatMessage({ id: 'app.contactPhone' })}
                          placeholder={intl.formatMessage({
                            id: 'app.companyContactPhone',
                            defaultMessage: 'Ej: +56 9 1234 5678'
                          })}
                          fontSize="xs"
                          type="tel"
                          autoComplete="tel"
                          maxLength={20}
                        />
                      </FormControl>
                    </Stack>
                    <Text fontWeight="bold" fontSize="lg" mt={4} mb={2}>
                      {intl.formatMessage({ id: 'app.coordinates', defaultMessage: 'Coordenadas' })}
                      <Tooltip
                        label={intl.formatMessage({
                          id: 'app.coordinatesHelp',
                          defaultMessage:
                            'Latitud y longitud del establecimiento (puedes usar el mapa)'
                        })}
                      >
                        <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                      </Tooltip>
                    </Text>
                    <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                      <FormControl>
                        <FormInput
                          name="latitude"
                          label={intl.formatMessage({
                            id: 'app.latitude',
                            defaultMessage: 'Latitud'
                          })}
                          placeholder={intl.formatMessage({
                            id: 'app.latitude',
                            defaultMessage: 'Ej: -33.4489'
                          })}
                          fontSize="xs"
                          type="number"
                          autoComplete="off"
                          step="any"
                        />
                      </FormControl>
                      <FormControl>
                        <FormInput
                          name="longitude"
                          label={intl.formatMessage({
                            id: 'app.longitude',
                            defaultMessage: 'Longitud'
                          })}
                          placeholder={intl.formatMessage({
                            id: 'app.longitude',
                            defaultMessage: 'Ej: -70.6693'
                          })}
                          fontSize="xs"
                          type="number"
                          autoComplete="off"
                          step="any"
                        />
                      </FormControl>
                    </Stack>
                    <Text fontWeight="bold" fontSize="lg" mt={4} mb={2}>
                      {intl.formatMessage({
                        id: 'app.certifications',
                        defaultMessage: 'Certificaciones'
                      })}
                      <Tooltip label={intl.formatMessage({ id: 'app.certificationsHelp' })}>
                        <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                      </Tooltip>
                    </Text>
                    <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                      <FormControl w="100%">
                        <Input
                          id="certifications"
                          name="certifications"
                          placeholder={intl.formatMessage({
                            id: 'app.companyCertifications',
                            defaultMessage: 'Ej: orgánico, comercio justo'
                          })}
                          fontSize="xs"
                          autoComplete="off"
                          {...infoMethods.register('certifications')}
                        />
                      </FormControl>
                    </Stack>
                    <Button
                      variant="no-hover"
                      bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                      alignSelf="flex-end"
                      mt="24px"
                      w="100px"
                      h="35px"
                      type="submit"
                    >
                      <Text fontSize="xs" color="#fff" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.next' })}
                      </Text>
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </CardBody>
          </Card>
        </TabPanel>

        <TabPanel>
          <Card>
            <CardHeader mb="22px">
              <Flex flexDirection="column">
                <Text color={textColor} fontSize="xl" fontWeight="bold">
                  {intl.formatMessage({
                    id: 'app.description',
                    defaultMessage: 'Descripción pública'
                  })}
                </Text>
                <Text color="gray.500" fontSize="sm" mt={2}>
                  {intl.formatMessage({
                    id: 'app.descriptionHelper',
                    defaultMessage:
                      'Completa la información que será visible públicamente en el perfil del establecimiento.'
                  })}
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormProvider {...descriptionMethods}>
                <form
                  onSubmit={descriptionMethods.handleSubmit(onSubmitDescription, (errors) => {
                    console.error('Validation errors:', errors);
                  })}
                  style={{ width: '100%' }}
                >
                  <Flex direction="column" w="100%">
                    <Box
                      mb={6}
                      p={4}
                      bg="yellow.50"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="yellow.200"
                    >
                      <Text fontWeight="bold" color="yellow.800">
                        {intl.formatMessage({
                          id: 'app.publicFieldsNotice',
                          defaultMessage:
                            'La siguiente información será visible públicamente cuando alguien escanee el QR de este establecimiento.'
                        })}
                      </Text>
                    </Box>
                    <Stack direction="column" spacing="32px" w="100%">
                      <Box>
                        <Text fontWeight="bold" fontSize="xl" mb={2} mt={2}>
                          {intl.formatMessage({
                            id: 'app.aboutEstablishment',
                            defaultMessage: 'Sobre el establecimiento'
                          })}
                          <Text as="span" color="red.500" ml={1}>
                            *
                          </Text>
                        </Text>
                        <FormControl isRequired mb={4}>
                          <FormInput
                            name="about"
                            placeholder={intl.formatMessage({
                              id: 'app.aboutEstablishmentPlaceholder',
                              defaultMessage:
                                'Describe brevemente qué es este establecimiento y su propósito principal.'
                            })}
                            fontSize="sm"
                            textarea
                            minRows={2}
                          />
                        </FormControl>
                        <Text fontWeight="bold" fontSize="xl" mb={2} mt={6}>
                          {intl.formatMessage({
                            id: 'app.mainActivities',
                            defaultMessage: 'Actividades principales / Servicios'
                          })}
                          <Text as="span" color="red.500" ml={1}>
                            *
                          </Text>
                        </Text>
                        <FormControl isRequired mb={2}>
                          <FormInput
                            name="main_activities"
                            placeholder={intl.formatMessage({
                              id: 'app.mainActivitiesPlaceholder',
                              defaultMessage:
                                '¿Qué actividades, cultivos o servicios se realizan aquí?'
                            })}
                            fontSize="sm"
                            textarea
                            minRows={2}
                          />
                        </FormControl>
                      </Box>
                      <Box borderTop="1px solid" borderColor="gray.200" pt={6}>
                        <Flex align="center" mb={2}>
                          <Text fontWeight="bold" fontSize="lg">
                            {intl.formatMessage({
                              id: 'app.locationHighlights',
                              defaultMessage: 'Características de la ubicación'
                            })}
                          </Text>
                          <Tooltip
                            label={intl.formatMessage({
                              id: 'app.locationHighlightsHelp',
                              defaultMessage:
                                'Características notables, accesibilidad, geografía (opcional).'
                            })}
                          >
                            <InfoOutlineIcon ml={2} color="gray.400" cursor="pointer" />
                          </Tooltip>
                        </Flex>
                        <FormControl mb={2}>
                          <FormInput
                            name="location_highlights"
                            placeholder={intl.formatMessage({
                              id: 'app.locationHighlightsPlaceholder',
                              defaultMessage:
                                'Características notables, accesibilidad, geografía (opcional).'
                            })}
                            fontSize="sm"
                            textarea
                            minRows={2}
                          />
                        </FormControl>
                        <Text fontWeight="bold" fontSize="lg" mt={4} mb={2}>
                          {intl.formatMessage({
                            id: 'app.customMessage',
                            defaultMessage: 'Mensaje o historia personalizada'
                          })}
                        </Text>
                        <FormControl mb={2}>
                          <FormInput
                            name="custom_message"
                            placeholder={intl.formatMessage({
                              id: 'app.customMessagePlaceholder',
                              defaultMessage:
                                'Comparte una historia, mensaje o información adicional (opcional).'
                            })}
                            fontSize="sm"
                            textarea
                            minRows={2}
                          />
                        </FormControl>
                      </Box>
                    </Stack>
                    {/* Live Preview: show Step 1 info + public fields */}
                    <Box
                      mt={10}
                      mb={6}
                      p={6}
                      borderRadius="lg"
                      boxShadow="lg"
                      bg={bgColor}
                      border="2px solid #E2E8F0"
                    >
                      <Flex align="center" mb={4}>
                        <Text fontWeight="bold" fontSize="lg" mr={2}>
                          {intl.formatMessage({
                            id: 'app.publicProfilePreview',
                            defaultMessage: 'Vista previa del perfil público'
                          })}
                        </Text>
                        <Tooltip
                          label={intl.formatMessage({
                            id: 'app.publicProfilePreviewHelp',
                            defaultMessage:
                              'Así se verá tu establecimiento cuando alguien escanee el QR.'
                          })}
                        >
                          <InfoOutlineIcon color="gray.400" cursor="pointer" />
                        </Tooltip>
                      </Flex>
                      <LiveEstablishmentPreview
                        control={descriptionMethods.control}
                        intl={intl}
                        infoValues={infoMethods.getValues()}
                      />
                    </Box>
                    <Flex justify="space-between">
                      <Button
                        variant="no-hover"
                        bg={bgPrevButton}
                        alignSelf="flex-end"
                        mt="24px"
                        w="100px"
                        h="35px"
                        onClick={() => mainInfoTab.current.click()}
                      >
                        <Text fontSize="xs" color="gray.700" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.prev' })}
                        </Text>
                      </Button>
                      <Button
                        variant="no-hover"
                        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                        alignSelf="flex-end"
                        mt="24px"
                        w="100px"
                        h="35px"
                        type="submit"
                      >
                        <Text fontSize="xs" color="#fff" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.next' })}
                        </Text>
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              </FormProvider>
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel>
          <Card>
            <CardHeader mb="22px">
              <Flex flexDirection="column">
                <Text color={textColor} fontSize="xl" fontWeight="bold">
                  {intl.formatMessage({ id: 'app.media', defaultMessage: 'Multimedia' })}
                </Text>
                <Text color="gray.500" fontSize="sm" mt={2}>
                  {intl.formatMessage({
                    id: 'app.mediaInstructions',
                    defaultMessage:
                      'Sube imágenes de tu establecimiento. Formato recomendado: JPG o PNG, tamaño máximo 5MB por imagen. Estas imágenes serán visibles públicamente.'
                  })}
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormProvider {...mediaFormMethods}>
                <Flex direction="column" w="100%">
                  <Text color={textColor} fontSize="sm" fontWeight="bold" mb="12px">
                    {intl.formatMessage({
                      id: 'app.establishmentImages',
                      defaultMessage: 'Imágenes del establecimiento'
                    })}
                  </Text>
                  <Flex
                    align="center"
                    justify="center"
                    border="2px dashed #CBD5E0"
                    borderRadius="15px"
                    w="100%"
                    maxWidth={'980px'}
                    cursor="pointer"
                    overflowY={'auto'}
                    minH={'175px'}
                    bg="gray.50"
                    _hover={{ bg: 'gray.100' }}
                    tabIndex={0}
                    aria-label={intl.formatMessage({
                      id: 'app.dropFilesHereToUpload',
                      defaultMessage: 'Arrastra archivos aquí para subir'
                    })}
                    {...getRootProps({ className: 'dropzone' })}
                  >
                    <Input {...getInputProps()} />
                    <Button variant="no-hover">
                      {acceptedFiles.length > 0 ? (
                        <Flex gap="20px" p="20px" flexWrap={'wrap'}>
                          {acceptedFiles.map((file, index) => (
                            <Box key={index}>
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                style={{
                                  width: '150px',
                                  height: '100px',
                                  borderRadius: '15px',
                                  objectFit: 'contain'
                                }}
                              />
                              <Text
                                color="gray.400"
                                fontWeight="normal"
                                maxWidth="150px"
                                textOverflow={'ellipsis'}
                                overflow={'hidden'}
                              >
                                {file.name}
                              </Text>
                            </Box>
                          ))}
                        </Flex>
                      ) : (
                        <Text color="gray.400" fontWeight="normal">
                          {intl.formatMessage({
                            id: 'app.dropFilesHereToUpload',
                            defaultMessage: 'Arrastra archivos aquí para subir'
                          })}
                        </Text>
                      )}
                    </Button>
                  </Flex>
                  <Text color="gray.500" fontSize="xs" mt={2}>
                    {intl.formatMessage({
                      id: 'app.mediaHelper',
                      defaultMessage:
                        'Puedes subir hasta 5 imágenes. Imágenes de alta calidad ayudan a generar confianza.'
                    })}
                  </Text>
                  <Flex justify="space-between">
                    <Button
                      variant="no-hover"
                      bg={bgPrevButton}
                      alignSelf="flex-end"
                      mt="24px"
                      w="100px"
                      h="35px"
                      onClick={() => descriptionTab.current.click()}
                    >
                      <Text fontSize="xs" color="gray.700" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.prev' })}
                      </Text>
                    </Button>
                    <Button
                      variant="no-hover"
                      bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                      alignSelf="flex-end"
                      mt="24px"
                      w="100px"
                      h="35px"
                      onClick={handleFileUpload}
                      isLoading={isUploading}
                      loadingText={intl.formatMessage({
                        id: 'app.uploading',
                        defaultMessage: 'Subiendo...'
                      })}
                    >
                      <Text fontSize="xs" color="#fff" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.upload', defaultMessage: 'Subir' })}
                      </Text>
                    </Button>
                  </Flex>
                </Flex>
              </FormProvider>
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel maxW="800px">
          <Card>
            <CardHeader mb="32px">
              <Flex flexDirection="column">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  {intl.formatMessage({ id: 'app.socials', defaultMessage: 'Redes sociales' })}
                </Text>
                <Text color="gray.500" fontSize="sm" mt={2}>
                  {intl.formatMessage({
                    id: 'app.socialsInstructions',
                    defaultMessage:
                      'Agrega los enlaces a las redes sociales de tu establecimiento. Estos enlaces serán visibles públicamente en el perfil del establecimiento.'
                  })}
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <FormProvider {...socialsMethods}>
                <form onSubmit={socialsSubmit(onSubmitSocials)} style={{ width: '100%' }}>
                  <Flex direction="column" w="100%">
                    <Stack direction="column" spacing="20px" w="100%">
                      <FormControl>
                        <FormInput
                          name="facebook"
                          label={intl.formatMessage({ id: 'app.facebookAccount' })}
                          placeholder="https://facebook.com/empresa"
                          fontSize="xs"
                          type="url"
                          autoComplete="url"
                          pattern="https?://(www\.)?facebook.com/.*"
                          helperText={intl.formatMessage({
                            id: 'app.socialsHelper',
                            defaultMessage: 'Ejemplo: https://facebook.com/empresa'
                          })}
                        />
                      </FormControl>
                      <FormControl>
                        <FormInput
                          name="instagram"
                          label={intl.formatMessage({ id: 'app.instagramAccount' })}
                          placeholder="https://instagram.com/empresa"
                          fontSize="xs"
                          type="url"
                          autoComplete="url"
                          pattern="https?://(www\.)?instagram.com/.*"
                          helperText={intl.formatMessage({
                            id: 'app.socialsHelper',
                            defaultMessage: 'Ejemplo: https://instagram.com/empresa'
                          })}
                        />
                      </FormControl>
                    </Stack>
                    <Flex justify="space-between">
                      <Button
                        variant="no-hover"
                        bg={bgPrevButton}
                        alignSelf="flex-end"
                        mt="24px"
                        w="100px"
                        h="35px"
                        onClick={() => mediaTab.current.click()}
                      >
                        <Text fontSize="xs" color="gray.700" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.prev' })}
                        </Text>
                      </Button>
                      <Button
                        variant="no-hover"
                        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                        alignSelf="flex-end"
                        mt="24px"
                        w="100px"
                        h="35px"
                        type="submit"
                      >
                        <Text fontSize="xs" color="#fff" fontWeight="bold">
                          {intl.formatMessage({ id: 'app.send', defaultMessage: 'Enviar' })}
                        </Text>
                      </Button>
                    </Flex>
                  </Flex>
                </form>
              </FormProvider>
            </CardBody>
          </Card>
        </TabPanel>
      </FormLayout>
    </>
  );
}

// Live preview component
function LiveEstablishmentPreview({ control, intl, infoValues }) {
  const values = useWatch({ control });
  return (
    <Box>
      {/* Step 1 info */}
      {infoValues?.name && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({ id: 'app.name', defaultMessage: 'Nombre del establecimiento' })}
          </Text>
          <Text>{infoValues.name}</Text>
        </Box>
      )}
      {infoValues?.type && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({ id: 'app.type', defaultMessage: 'Tipo' })}
          </Text>
          <Text>{infoValues.type}</Text>
        </Box>
      )}
      {infoValues?.address && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({ id: 'app.address', defaultMessage: 'Dirección' })}
          </Text>
          <Text>{infoValues.address}</Text>
        </Box>
      )}
      {infoValues?.country && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({ id: 'app.country', defaultMessage: 'País' })}
          </Text>
          <Text>{infoValues.country}</Text>
        </Box>
      )}
      {infoValues?.state && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({ id: 'app.state', defaultMessage: 'Estado' })}
          </Text>
          <Text>{infoValues.state}</Text>
        </Box>
      )}
      {infoValues?.city && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({ id: 'app.city', defaultMessage: 'Ciudad' })}
          </Text>
          <Text>{infoValues.city}</Text>
        </Box>
      )}
      {infoValues?.zone && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({ id: 'app.zone', defaultMessage: 'Zona' })}
          </Text>
          <Text>{infoValues.zone}</Text>
        </Box>
      )}
      {/* Step 2 public fields */}
      {values?.about && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({
              id: 'app.aboutEstablishment',
              defaultMessage: 'Sobre el establecimiento'
            })}
          </Text>
          <Text>{values.about}</Text>
        </Box>
      )}
      {values?.main_activities && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({
              id: 'app.mainActivities',
              defaultMessage: 'Actividades principales / Servicios'
            })}
          </Text>
          <Text whiteSpace="pre-line">{values.main_activities}</Text>
        </Box>
      )}
      {values?.location_highlights && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({
              id: 'app.locationHighlights',
              defaultMessage: 'Características de la ubicación'
            })}
          </Text>
          <Text whiteSpace="pre-line">{values.location_highlights}</Text>
        </Box>
      )}
      {values?.custom_message && (
        <Box mb={4}>
          <Text fontWeight="bold" fontSize="md" mb={1}>
            {intl.formatMessage({
              id: 'app.customMessage',
              defaultMessage: 'Mensaje o historia personalizada'
            })}
          </Text>
          <Text whiteSpace="pre-line">{values.custom_message}</Text>
        </Box>
      )}
      {!(
        infoValues?.name ||
        infoValues?.type ||
        infoValues?.address ||
        infoValues?.country ||
        infoValues?.state ||
        infoValues?.city ||
        infoValues?.zone ||
        values?.about ||
        values?.main_activities ||
        values?.location_highlights ||
        values?.custom_message
      ) && (
        <Text color="gray.400">
          {intl.formatMessage({
            id: 'app.publicProfilePreviewEmpty',
            defaultMessage: 'Llena los campos para ver la vista previa.'
          })}
        </Text>
      )}
    </Box>
  );
}

export default NewEstablishment;
