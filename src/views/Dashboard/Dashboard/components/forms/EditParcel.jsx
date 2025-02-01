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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { boolean, object, string } from 'zod';
import { clearForm, setForm } from 'store/features/formSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useGetParcelQuery, useUpdateParcelMutation } from 'store/api/productApi';
import { useNavigate, useParams } from 'react-router-dom';

import { BsCircleFill } from 'react-icons/bs';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter.tsx';
import CardHeader from 'components/Card/CardHeader';
import CardWithMap from '../CardWithMap';
// Custom components
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import FormLayout from 'components/Forms/FormLayout';
import Header from 'views/Pages/Profile/Overview/components/Header';
import MapCreator from 'components/Map/MapCreator';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import avatar4 from 'assets/img/avatars/avatar4.png';
import imageMap from 'assets/img/imageMap.png';
import { setEstablishmentParcel } from 'store/features/companySlice';
import { setParcel } from 'store/features/productSlice';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';
const formSchemaInfo = object({
  name: string().min(1, 'Name is required'),
  area: string().min(1, 'Area is required')
});

const formSchemaDescription = object({
  description: string().min(1, 'Description is required')
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
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const bgColor = useColorModeValue('white', 'gray.700');
  const dispatch = useDispatch();
  const currentEstablishment = useSelector((state) => state.form.currentForm?.establishment);
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { establishmentId, parcelId } = useParams();
  const [files, setFiles] = useState([]);

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

  const mainInfoTab = useRef();
  const locationTab = useRef();
  const descriptionTab = useRef();
  const mediaTab = useRef();
  const certificationTab = useRef();

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    // onDrop,
    // accept: "image/*", // Accepted file types
    maxFiles: 5 // Maximum number of files
    // maxSize: 1024 * 1024 * 5, // Maximum file size (5 MB)
  });

  const currentParcel = useSelector((state) => state.product.currentParcel);
  const currentParcelForm = useSelector((state) => state.form.currentForm?.parcel);

  const {
    data: parcelData,
    error: errorParcel,
    isLoading: isLoadingParcel,
    isFetching,
    refetch
  } = useGetParcelQuery(
    { companyId: currentCompany?.id, establishmentId, parcelId },
    {
      skip:
        parcelId === undefined ||
        currentParcel?.id === parcelId ||
        !currentCompany ||
        !establishmentId ||
        currentCompany?.id === undefined
    }
  );

  useEffect(() => {
    if (parcelData) dispatch(setParcel(parcelData));
  }, [parcelData]);

  useEffect(() => {
    if (parcelData) {
      dispatch(setForm({ parcel: parcelData }));
    }
  }, [parcelData]);

  useEffect(() => {
    if (currentParcel) {
      setInfoValues('name', currentParcel.name || '');
      setInfoValues('area', currentParcel.area.toString() || '');
      setDescriptionValues('description', currentParcel.description);
    }
  }, [currentParcel]);

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);

  const infoMethods = useForm({
    resolver: zodResolver(formSchemaInfo)
  });

  const {
    reset,
    handleSubmit,
    setValue: setInfoValues,
    formState: { errors, isSubmitSuccessful }
  } = infoMethods;

  const descriptionMethods = useForm({
    resolver: zodResolver(formSchemaDescription)
  });

  const {
    reset: descriptionReset,
    handleSubmit: descriptionSubmit,
    setValue: setDescriptionValues
  } = descriptionMethods;

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
          ...currentParcelForm,
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

  const [updateParcel, { data, error, isSuccess, isLoading }] = useUpdateParcelMutation();

  const onSubmitCertificate = (data) => {
    const { product, ...currentParcelData } = currentParcel;
    if (product) {
      currentParcelData['product'] = product;
    }

    updateParcel({
      parcelId,
      companyId: currentCompany?.id,
      establishmentId,
      parcelData: {
        ...currentParcelData,
        ...currentParcelForm,
        establishment: parseInt(establishmentId),
        album: { images: acceptedFiles }
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
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/profile`);
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

  return (
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
        <MapCreator
          handleNext={handleNext}
          prevTab={mainInfoTab}
          center={parcelData?.map_metadata?.center}
          zoom={parcelData?.map_metadata?.zoom}
          mapPolygon={parcelData?.polygon}
        />
        {/* <Card>
              <CardHeader mb="20px">
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  textAlign="center"
                  w="80%"
                  mx="auto">
                  <Text color={textColor} fontSize="lg" fontWeight="bold" mb="4px">
                    Where is the Parcel located?
                  </Text>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    Indicate the location of the parcel
                  </Text>
                </Flex>
              </CardHeader>
              
              <CardBody justifyContent={"center"} mb="20px">
                <Flex direction="column" w="80%" h="300px">
                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                      zoom={16}
                      center={{
                        lat: -31.27006513500534,
                        lng: -57.199462864720985,
                      }}
                      mapTypeId="satellite"
                    >
                      <Polygon
                        path={[
                          { lat: -31.26835838901041, lng: -57.202751722067966 },
                          {
                            lat: -31.271918579848123,
                            lng: -57.201694589349295,
                          },
                          { lat: -31.27094552584586, lng: -57.19690586848693 },
                          { lat: -31.269076616200664, lng: -57.19727631670458 },
                        ]}
                        options={{
                          fillColor: "#ff0000",
                          fillOpacity: 0.35,
                          strokeColor: "#ff0000",
                          strokeOpacity: 1,
                          strokeWeight: 2,
                        }}
                      />
                    </GoogleMap>
                  )}
                </Flex>
              </CardBody>
              <CardFooter>
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
                      PREV
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
                    onClick={handleNext}>
                    <Text fontSize="xs" color="#fff" fontWeight="bold">
                      NEXT
                    </Text>
                  </Button>
                </Flex>
              </CardFooter>
            </Card> */}
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
                    // <Text fontSize="sm" color="green">
                    //   {files.length} file(s) selected:
                    //   {files.map((file) => (
                    //     <span key={file.path}> {file.name},</span>
                    //   ))}
                    // </Text>
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
                      {/* </Stack> */}
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
                  onClick={() => certificationTab.current.click()}>
                  <Text fontSize="xs" color="#fff" fontWeight="bold">
                    {intl.formatMessage({ id: 'app.next' })}
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
                      label="Contact number"
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
                        onClick={() => mediaTab.current.click()}>
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
                          <CircularProgress isIndeterminate value={1} color="#313860" size="25px" />
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
  );
}

export default NewParcel;
