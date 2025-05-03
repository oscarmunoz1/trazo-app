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
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import { DrawingManager, GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { boolean, object, string, number } from 'zod';
import { clearForm, setForm } from 'store/features/formSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { BsCircleFill } from 'react-icons/bs';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter.tsx';
import CardHeader from 'components/Card/CardHeader';
// Custom components
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import FormLayout from 'components/Forms/FormLayout';
import MapCreator from 'components/Map/MapCreator';
import { setEstablishmentParcel } from 'store/features/companySlice';
import { useCreateParcelMutation } from 'store/api/productApi.js';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';

import { useIntl } from 'react-intl';
import { useFileUpload } from 'services/uploadService';
import useSubscriptionCheck from 'hooks/useSubscriptionCheck';
import SubscriptionLimitModal from 'components/Modals/SubscriptionLimitModal';

const formSchemaInfo = object({
  name: string().min(1, 'Name is required'),
  area: string()
    .min(1, 'Area is required')
    .refine((val) => !isNaN(parseFloat(val)), 'Area must be a valid number')
    .transform((val) => parseFloat(val))
});

const formSchemaDescription = object({
  description: string().min(1, 'Description is required')
});

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

const formSchemaCertificate = object({
  certificate: boolean(),
  contactNumber: string().refine((value, context) => {
    // Access the switchValue field value from the form context
    const { certificate } = context?.formState?.values || {};
    // Conditionally validate inputValue based on certificate
    if (certificate) {
      return z.string().min(1).check(value); // apply validation if certificate is true
    }
    return true; // skip validation if certificate is false
  }),
  address: string().refine((value, context) => {
    // Access the certificate field value from the form context
    const { certificate } = context?.formState?.values || {};
    // Conditionally validate inputValue based on certificate
    if (certificate) {
      return z.string().min(1).check(value); // apply validation if certificate is true
    }
    return true; // skip validation if certificate is false
  })
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

function NewParcel() {
  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const bgColor = useColorModeValue('white', 'gray.700');
  const dispatch = useDispatch();
  const currentEstablishment = useSelector((state) => state.form.currentForm?.establishment);
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const [path, setPath] = useState([]);
  const polygonRef = useRef();
  const listenersRef = useRef([]);
  const { establishmentId } = useParams();
  const intl = useIntl();
  const toast = useToast();

  const [drawingMode, setDrawingMode] = useState(false);
  const [polygon, setPolygon] = useState(null);
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  const [activeBullets, setActiveBullets] = useState({
    mainInfo: true,
    location: false,
    description: false,
    media: false,
    certificate: false
  });

  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadMultipleFiles } = useFileUpload();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      // Store the file names for preview purposes
      const fileNames = acceptedFiles.map((file) => file.name);
      console.log('Dropped files:', fileNames);
    }
  });

  const onMapClick = (e) => {
    setPath([...path, { lat: e.latLng.lat(), lng: e.latLng.lng() }]);
  };

  const onEdit = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng) => {
          return { lat: latLng.lat(), lng: latLng.lng() };
        });
      setPath(nextPath);
    }
  }, [setPath]);

  const onLoadPolygon = useCallback(
    (polygon) => {
      polygonRef.current = polygon;
      const path = polygon.getPath();
      listenersRef.current.push(
        path.addListener('set_at', onEdit),
        path.addListener('insert_at', onEdit),
        path.addListener('remove_at', onEdit)
      );
    },
    [onEdit]
  );
  const bgButton = useColorModeValue(
    'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
    'gray.800'
  );

  const onUnmount = useCallback(() => {
    listenersRef.current.forEach((lis) => lis.remove());
    polygonRef.current = null;
  }, []);

  const mainInfoTab = useRef();
  const locationTab = useRef();
  const descriptionTab = useRef();
  const mediaTab = useRef();
  const certificationTab = useRef();

  const currentParcel = useSelector((state) => state.form.currentForm?.parcel);

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

  const onSubmitInfo = (data) => {
    dispatch(setForm({ parcel: data }));
    locationTab.current.click();
  };

  const handleNext = () => {
    descriptionTab.current.click();
  };

  const onSubmitDescription = (data) => {
    dispatch(
      setForm({
        parcel: {
          ...currentParcel,
          description: data.description
        }
      })
    );
    mediaTab.current.click();
  };

  const methodsCertificate = useForm({
    resolver: zodResolver(formSchemaCertificate)
  });

  const {
    handleSubmit: handleSubmitCertificate,
    register: registerCertificate,
    watch,
    formState: { errors: errorsCertificate, isSubmitSuccessful: isSubmitSuccessfulCertificate }
  } = methodsCertificate;

  const certificateValue = watch('certificate');

  const [createParcel, { data, error, isSuccess, isLoading }] = useCreateParcelMutation();

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

      // Validate URLs and store only valid ones
      const validUrls = urls.filter(
        (url) => url && typeof url === 'string' && url.startsWith('http')
      );

      if (validUrls.length === 0) {
        throw new Error('No valid URLs were returned from the upload service');
      }

      // Store the uploaded URLs
      setUploadedImageUrls(validUrls);

      toast({
        title: intl.formatMessage({ id: 'app.uploadSuccess' }),
        description: intl.formatMessage({ id: 'app.filesUploaded' }, { count: validUrls.length }),
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Proceed to next step
      certificationTab.current.click();
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

  const onSubmitCertificate = (data) => {
    const { product, ...currentParcelData } = currentParcel;
    if (product) {
      currentParcelData['product'] = product;
    }

    // Ensure area is a valid number
    let area = currentParcelData.area;
    if (typeof area === 'string') {
      area = parseFloat(area) || 0;
    }

    // Filter out any invalid URLs
    const validImageUrls = uploadedImageUrls.filter(
      (url) => url && typeof url === 'string' && url.startsWith('http')
    );

    createParcel({
      companyId: currentCompany?.id,
      establishmentId,
      parcelData: {
        ...currentParcel,
        ...data,
        area: area, // Make sure area is a number
        establishment: parseInt(establishmentId),
        uploaded_image_urls: validImageUrls, // Only send valid URLs
        certified: data.certificate
      }
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(
        setEstablishmentParcel({
          parcel: data,
          establishmentId: parseInt(establishmentId)
        })
      );
      dispatch(clearForm());
      navigate(`/admin/dashboard/establishment/${establishmentId}`);
    }
  }, [isSuccess]);

  const tabsList = [
    {
      name: 'mainInfo',
      ref: mainInfoTab,
      label: intl.formatMessage({ id: 'app.mainInfo' }),
      nextTab: 'location',
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          location: false,
          description: false,
          media: false,
          certificate: false
        })
    },
    {
      name: 'location',
      ref: locationTab,
      label: intl.formatMessage({ id: 'app.location' }),
      nextTab: 'description',
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          location: true,
          description: false,
          media: false,
          certificate: false
        })
    },
    {
      name: 'description',
      ref: descriptionTab,
      label: intl.formatMessage({ id: 'app.description' }),
      nextTab: 'media',
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          location: true,
          description: true,
          media: false,
          certificate: false
        })
    },
    {
      name: 'media',
      ref: mediaTab,
      label: intl.formatMessage({ id: 'app.media' }),
      nextTab: 'certificate',
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          location: true,
          description: true,
          media: true,
          certificate: false
        })
    },
    {
      name: 'certificate',
      ref: certificationTab,
      label: intl.formatMessage({ id: 'app.certificate' }),
      onClick: () =>
        setActiveBullets({
          mainInfo: true,
          location: true,
          description: true,
          media: true,
          certificate: true
        })
    }
  ];

  // Check subscription limits
  const { isChecking, canCreate, showLimitModal, setShowLimitModal, usage, currentPlan } =
    useSubscriptionCheck('parcel', establishmentId);

  // When component mounts, save the current path to localStorage
  // for potential return after subscription upgrade
  useEffect(() => {
    localStorage.setItem('last_form_path', window.location.pathname);
  }, []);

  // Return early if subscription check is in progress
  if (isChecking) {
    return (
      <Flex justify="center" align="center" h="400px">
        <CircularProgress isIndeterminate color="blue.500" />
        <Text ml={4}>{intl.formatMessage({ id: 'app.checking' })}</Text>
      </Flex>
    );
  }

  return (
    <>
      {/* Subscription limit modal */}
      <SubscriptionLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        resourceType="parcel"
        currentPlan={currentPlan}
        usage={usage}
      />

      <FormLayout tabsList={tabsList} activeBullets={activeBullets}>
        <TabPanel>
          <Card>
            <CardHeader mb="22px">
              <Text color={textColor} fontSize="lg" fontWeight="bold">
                {intl.formatMessage({ id: 'app.parcelInfo' })}
              </Text>
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
                          placeholder={intl.formatMessage({ id: 'app.parcelName' })}
                          fontSize="xs"
                        />
                      </FormControl>
                      <FormControl>
                        <FormInput
                          name="area"
                          label={intl.formatMessage({ id: 'app.area' })}
                          placeholder={intl.formatMessage({ id: 'app.parcelArea' })}
                          fontSize="xs"
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
                      type="submit">
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
          <MapCreator handleNext={handleNext} prevTab={mainInfoTab} />
        </TabPanel>

        <TabPanel>
          <Card>
            <CardHeader mb="32px">
              <Text fontSize="lg" color={textColor} fontWeight="bold">
                {intl.formatMessage({ id: 'app.description' })}
              </Text>
            </CardHeader>
            <CardBody>
              <FormProvider {...descriptionMethods}>
                <form onSubmit={descriptionSubmit(onSubmitDescription)} style={{ width: '100%' }}>
                  <Flex direction="column" w="100%">
                    <Stack direction="column" spacing="20px" w="100%">
                      <Editor />
                    </Stack>
                    <Flex justify="space-between">
                      <Button
                        variant="no-hover"
                        bg={bgPrevButton}
                        alignSelf="flex-end"
                        mt="24px"
                        w="100px"
                        h="35px"
                        onClick={() => mainInfoTab.current.click()}>
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
                        type="submit">
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
              <Text color={textColor} fontSize="xl" fontWeight="bold" mb="3px">
                {intl.formatMessage({ id: 'app.media' })}
              </Text>
            </CardHeader>
            <CardBody>
              <Flex direction="column" w="100%">
                <Text color={textColor} fontSize="sm" fontWeight="bold" mb="12px">
                  {intl.formatMessage({ id: 'app.parcelImages' })}
                </Text>
                <Flex
                  align="center"
                  justify="center"
                  border="1px dashed #E2E8F0"
                  borderRadius="15px"
                  w="100%"
                  maxWidth={'980px'}
                  cursor="pointer"
                  overflowY={'auto'}
                  minH={'175px'}
                  {...getRootProps({ className: 'dropzone' })}>
                  <Input {...getInputProps()} />
                  <Button variant="no-hover">
                    {acceptedFiles.length > 0 ? (
                      <Flex gap="20px" p="20px" flexWrap={'wrap'}>
                        {acceptedFiles.map((file, index) => (
                          <Box key={index}>
                            <img
                              src={URL.createObjectURL(file)} // Create a preview URL for the image
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
                              overflow={'hidden'}>
                              {file.name}
                            </Text>
                          </Box>
                        ))}
                      </Flex>
                    ) : (
                      <Text color="gray.400" fontWeight="normal">
                        {intl.formatMessage({ id: 'app.dropFilesHereToUpload' })}
                      </Text>
                    )}
                  </Button>
                </Flex>
                <Flex justify="space-between">
                  <Button
                    variant="no-hover"
                    bg={bgPrevButton}
                    alignSelf="flex-end"
                    mt="24px"
                    w="100px"
                    h="35px"
                    onClick={() => descriptionTab.current.click()}>
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
                    isLoading={isUploading}
                    onClick={handleFileUpload}>
                    <Text fontSize="xs" color="#fff" fontWeight="bold">
                      {intl.formatMessage({ id: 'app.upload' })}
                    </Text>
                  </Button>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        </TabPanel>
        <TabPanel>
          <Card>
            <CardHeader mb="40px">
              <Flex
                direction="column"
                align="center"
                justify="center"
                textAlign="center"
                w="80%"
                mx="auto">
                <Text color={textColor} fontSize="lg" fontWeight="bold" mb="4px">
                  {intl.formatMessage({ id: 'app.doYouWantToCertificateThisParcel' })}
                </Text>
                <Text color="gray.400" fontWeight="normal" fontSize="sm">
                  {intl.formatMessage({
                    id: 'app.inTheFollowingInputsYouMustGiveDetailedInformationInOrderToCertifyThisParcel'
                  })}
                  parcel.
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Flex direction="column" w="100%">
                <Stack direction="column" spacing="20px">
                  <FormProvider {...methodsCertificate}>
                    <form
                      onSubmit={handleSubmitCertificate(onSubmitCertificate)}
                      style={{ width: '100%' }}>
                      <FormControl display="flex" alignItems="center" mb="25px">
                        <Switch
                          id="certificate"
                          colorScheme="green"
                          me="10px"
                          {...registerCertificate('certificate')}
                        />
                        <FormLabel htmlFor="certificate" mb="0" ms="1" fontWeight="normal">
                          {intl.formatMessage({ id: 'app.yesIWantToCertifyThisParcel' })}
                        </FormLabel>
                      </FormControl>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        placeholder={intl.formatMessage({ id: 'app.contactNumberOfTheParcel' })}
                        name="contactNumber"
                        label={intl.formatMessage({ id: 'app.contactNumber' })}
                        disabled={!certificateValue}
                      />
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="text"
                        placeholder={intl.formatMessage({ id: 'app.addressOfTheParcel' })}
                        name="address"
                        label={intl.formatMessage({ id: 'app.address' })}
                        disabled={!certificateValue}
                      />
                      <Flex justify="space-between" width={'100%'}>
                        <Button
                          variant="no-hover"
                          bg={bgPrevButton}
                          alignSelf="flex-end"
                          mt="24px"
                          w={{ sm: '75px', lg: '100px' }}
                          h="35px"
                          onClick={() => prevTab.current.click()}>
                          <Text fontSize="xs" color="gray.700" fontWeight="bold">
                            {intl.formatMessage({ id: 'app.prev' })}
                          </Text>
                        </Button>
                        <Button
                          bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                          _hover={{
                            bg: 'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)'
                          }}
                          alignSelf="flex-end"
                          mt="24px"
                          w={{ sm: '75px', lg: '100px' }}
                          h="35px"
                          type="submit">
                          {isLoading ? (
                            <CircularProgress
                              isIndeterminate
                              value={1}
                              color="#313860"
                              size="25px"
                            />
                          ) : (
                            <Text fontSize="xs" color="#fff" fontWeight="bold">
                              {intl.formatMessage({ id: 'app.send' })}
                            </Text>
                          )}
                        </Button>
                      </Flex>
                    </form>
                  </FormProvider>
                </Stack>
              </Flex>
            </CardBody>
          </Card>
        </TabPanel>
      </FormLayout>
    </>
  );
}

export default NewParcel;
