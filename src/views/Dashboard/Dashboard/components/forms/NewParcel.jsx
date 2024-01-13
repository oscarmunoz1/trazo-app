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
  useColorModeValue
} from '@chakra-ui/react';
import { DrawingManager, GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { boolean, object, string } from 'zod';
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
import MapCreator from 'components/Map/MapCreator';
import { setEstablishmentParcel } from 'store/features/companySlice';
import { useCreateParcelMutation } from 'store/api/productApi.js';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchemaInfo = object({
  name: string().min(1, 'Name is required'),
  area: string().min(1, 'Area is required')
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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    // onDrop,
    // accept: "image/*", // Accepted file types
    maxFiles: 5 // Maximum number of files
    // maxSize: 1024 * 1024 * 5, // Maximum file size (5 MB)
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

  const onSubmitCertificate = (data) => {
    const { product, ...currentParcelData } = currentParcel;
    if (product) {
      currentParcelData['product'] = product;
    }
    createParcel({
      companyId: currentCompany?.id,
      establishmentId,
      parcelData: {
        ...currentParcel,
        ...data,
        establishment: parseInt(establishmentId),
        album: { images: acceptedFiles },
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

  const handleMapLoad = (map) => {
    setMap(map);
  };

  const handleDrawingManagerLoad = (drawingManager) => {
    // Access to drawingManager object
  };

  const handlePolygonComplete = (polygon) => {
    setPolygon(polygon);
    setDrawingMode(false);
  };

  const toggleDrawingMode = () => {
    setDrawingMode(!drawingMode);
    if (map && polygon) {
      polygon.setMap(null); // Remove existing polygon when toggling drawing mode
      setPolygon(null);
    }
  };

  return (
    <Flex
      direction="column"
      bg={bgColor}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px">
      <Tabs variant="unstyled" mt="24px" alignSelf="center">
        <TabList display="flex" align="center">
          <Tab
            ref={mainInfoTab}
            _focus="none"
            w={{ sm: '80px', md: '200px' }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                location: false,
                description: false,
                media: false,
                certificate: false
              })
            }>
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: '80px', md: '235px' },
                height: '3px',
                bg: activeBullets.location ? textColor : 'gray.200',
                left: { sm: '12px', md: '42px' },
                top: {
                  sm: activeBullets.mainInfo ? '6px' : '4px',
                  md: null
                },
                position: 'absolute',
                bottom: activeBullets.mainInfo ? '40px' : '38px',

                transition: 'all .3s ease'
              }}>
              <Icon
                as={BsCircleFill}
                color={activeBullets.mainInfo ? textColor : 'gray.300'}
                w={activeBullets.mainInfo ? '16px' : '12px'}
                h={activeBullets.mainInfo ? '16px' : '12px'}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.mainInfo ? { textColor } : 'gray.300'}
                fontWeight={activeBullets.mainInfo ? 'bold' : 'normal'}
                display={{ sm: 'none', md: 'block' }}>
                1. Main Info
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={locationTab}
            _focus="none"
            w={{ sm: '120px', md: '250px', lg: '260px' }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                location: true,
                description: false,
                media: false,
                certificate: false
              })
            }>
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: '120px', md: '235px', lg: '235px' },
                height: '3px',
                bg: activeBullets.description ? textColor : 'gray.200',
                left: { sm: '12px', md: '38px' },
                top: {
                  sm: activeBullets.location ? '5px' : '4px',
                  md: null
                },
                position: 'absolute',
                bottom: activeBullets.location ? '40px' : '38px',

                transition: 'all .3s ease'
              }}>
              <Icon
                as={BsCircleFill}
                color={activeBullets.location ? textColor : 'gray.300'}
                w={activeBullets.location ? '16px' : '12px'}
                h={activeBullets.location ? '16px' : '12px'}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.location ? { textColor } : 'gray.300'}
                fontWeight={activeBullets.location ? 'bold' : 'normal'}
                display={{ sm: 'none', md: 'block' }}>
                2. Location
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={descriptionTab}
            _focus="none"
            w={{ sm: '80px', md: '200px' }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                location: true,
                description: true,
                media: false,
                certificate: false
              })
            }>
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: '80px', md: '200px' },
                height: '3px',
                bg: activeBullets.media ? textColor : 'gray.200',
                left: { sm: '12px', md: '46px' },
                top: {
                  sm: activeBullets.description ? '6px' : '4px',
                  md: null
                },
                position: 'absolute',
                bottom: activeBullets.description ? '40px' : '38px',

                transition: 'all .3s ease'
              }}>
              <Icon
                as={BsCircleFill}
                color={activeBullets.description ? textColor : 'gray.300'}
                w={activeBullets.description ? '16px' : '12px'}
                h={activeBullets.description ? '16px' : '12px'}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.description ? { textColor } : 'gray.300'}
                fontWeight={activeBullets.description ? 'bold' : 'normal'}
                transition="all .3s ease"
                _hover={{ color: textColor }}
                display={{ sm: 'none', md: 'block' }}>
                3. Description
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={mediaTab}
            _focus="none"
            w={{ sm: '80px', md: '200px' }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                location: true,
                description: true,
                media: true,
                certificate: false
              })
            }>
            <Flex
              direction="column"
              justify="center"
              align="center"
              position="relative"
              _before={{
                content: "''",
                width: { sm: '80px', md: '200px' },
                height: '3px',
                bg: activeBullets.certificate ? textColor : 'gray.200',
                left: { sm: '12px', md: '32px' },
                top: { sm: activeBullets.media ? '6px' : '4px', md: null },
                position: 'absolute',
                bottom: activeBullets.media ? '40px' : '38px',

                transition: 'all .3s ease'
              }}>
              <Icon
                as={BsCircleFill}
                color={activeBullets.media ? textColor : 'gray.300'}
                w={activeBullets.media ? '16px' : '12px'}
                h={activeBullets.media ? '16px' : '12px'}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.media ? { textColor } : 'gray.300'}
                fontWeight={activeBullets.media ? 'bold' : 'normal'}
                transition="all .3s ease"
                _hover={{ color: textColor }}
                display={{ sm: 'none', md: 'block' }}>
                4. Media
              </Text>
            </Flex>
          </Tab>
          <Tab
            ref={certificationTab}
            _focus="none"
            w={{ sm: '80px', md: '200px' }}
            onClick={() =>
              setActiveBullets({
                mainInfo: true,
                location: true,
                description: true,
                media: true,
                certificate: true
              })
            }>
            <Flex direction="column" justify="center" align="center">
              <Icon
                as={BsCircleFill}
                color={activeBullets.certificate ? textColor : 'gray.300'}
                w={activeBullets.certificate ? '16px' : '12px'}
                h={activeBullets.certificate ? '16px' : '12px'}
                mb="8px"
                zIndex={1}
              />
              <Text
                color={activeBullets.certificate ? { textColor } : 'gray.300'}
                fontWeight={activeBullets.certificate ? 'bold' : 'normal'}
                transition="all .3s ease"
                _hover={{ color: textColor }}
                display={{ sm: 'none', md: 'block' }}>
                5. Certificate
              </Text>
            </Flex>
          </Tab>
        </TabList>

        <TabPanels mt="24px" maxW={{ md: '90%', lg: '100%' }} mx="auto">
          <TabPanel>
            <Card>
              <CardHeader mb="22px">
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Parcel Info
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
                            label="Name"
                            placeholder="Parcel name"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="area"
                            label="Area"
                            placeholder="Parcel area"
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
                          NEXT
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
                  Description
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
                            PREV
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
                            NEXT
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
                  Media
                </Text>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  <Text color={textColor} fontSize="sm" fontWeight="bold" mb="12px">
                    Parcel images
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
                          Drop files here to upload
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
                        PREV
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
                        NEXT
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
                    Do you want to certificate this parcel?
                  </Text>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    In the following inputs you must give detailed information in order to certify
                    this parcel.
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
                            Yes, I want to certify this parcel
                          </FormLabel>
                        </FormControl>
                        <FormInput
                          fontSize="xs"
                          ms="4px"
                          borderRadius="15px"
                          type="text"
                          placeholder="Contact number of the parcel"
                          name="contactNumber"
                          label="Contact number"
                          disabled={!certificateValue}
                        />
                        <FormInput
                          fontSize="xs"
                          ms="4px"
                          borderRadius="15px"
                          type="text"
                          placeholder="Address of the parcel"
                          name="address"
                          label="Address"
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
                                SEND
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
        </TabPanels>
        {/* </form> */}
      </Tabs>
    </Flex>
  );
}

export default NewParcel;
