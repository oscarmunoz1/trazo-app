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

import { BsCircleFill, BsFillCloudLightningRainFill } from 'react-icons/bs';
// Chakra imports
import {
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
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { clearForm, setForm } from 'store/features/formSlice';
import { object, string } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import CardWithMap from '../CardWithMap';
import ChemicalTab from './ChemicalTab';
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import FormLayout from 'components/Forms/FormLayout';
import GeneralTab from './GeneralTab';
import Header from 'views/Pages/Profile/Overview/components/Header';
import ProductionTab from './ProductionTab';
// import ProductionTab from "./ProductionTab";
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import { RocketIcon } from 'components/Icons/Icons';
import Select from 'react-select';
import { SlChemistry } from 'react-icons/sl';
import WeatherTab from './WeatherTab';
import { addCompanyEstablishment } from 'store/features/companySlice';
import avatar4 from 'assets/img/avatars/avatar4.png';
import imageMap from 'assets/img/imageMap.png';
import { useCreateEventMutation } from 'store/api/historyApi';
import { useDropzone } from 'react-dropzone';
import { useGoogleMap } from '@react-google-maps/api';
import { zodResolver } from '@hookform/resolvers/zod';

// Custom components
const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed
      ? { ...base, backgroundColor: 'gray', borderRadius: '10px' }
      : { ...base, borderRadius: '10px' };
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base;
  },
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #E2E8F0',
    borderRadius: '15px',
    boxShadow: 'none',
    outline: '2px solid transparent',
    minHeight: '40px',
    fontSize: '0.75rem;',
    marginLeft: '4px'
  })
};

const formSchemaBasic = object({
  date: string().min(1, 'Date is required')
});

const formSchemaMainInfo = object({
  type: string().min(1, 'Name is required')
});

const formSchemaDescription = object({
  description: string().min(1, 'Description is required')
});

const formSchemaSocials = object({
  facebook: string(),
  instagram: string()
});

const formSchemaMedia = object({});

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

const orderOptions = (values) => {
  return values?.filter((v) => v.isFixed).concat(values.filter((v) => !v.isFixed));
};

function NewEstablishment() {
  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const bgProfile = useColorModeValue(
    'hsla(0,0%,100%,.8)',
    'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
  );
  const bgColor = useColorModeValue('white', 'gray.700');
  const iconColor = useColorModeValue('gray.300', 'gray.700');
  const bgActiveButton = useColorModeValue('gray.200', 'gray.700');
  const bgButtonGroup = useColorModeValue('gray.50', 'gray.600');
  const bgTimesIcon = useColorModeValue('gray.700', 'gray.500');
  // const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState(null);

  const currentEvent = useSelector((state) => state.form.currentForm?.event);
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { parcelId, establishmentId } = useParams();

  const [activeBullets, setActiveBullets] = useState({
    basic: true,
    mainInfo: false,
    description: false,
    media: false
  });

  const basicTab = useRef();
  const mainInfoTab = useRef();
  const descriptionTab = useRef();
  const mediaTab = useRef();

  const { getRootProps, getInputProps } = useDropzone();

  const parcels = useSelector((state) =>
    state.company.currentCompany?.establishments?.reduce((res_parcels, establishment) => {
      const establishmentParcels = establishment.parcels.map((parcel) => {
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

  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = basicMethods;

  const onSubmitBasic = (data) => {
    dispatch(
      setForm({
        event: {
          ...data,
          parcels: value.map((v) => v.value),
          event_type: activeButton
        }
      })
    );
    mainInfoTab.current.click();
  };

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo)
  });

  const {
    reset: mainInfoReset,
    handleSubmit: mainInfoSubmit,
    errors: mainInfoErrors,
    register
  } = mainInfoMethods;

  const onSubmitMainInfo = (data) => {
    dispatch(
      setForm({
        event: {
          ...currentEvent,
          ...data
        }
      })
    );
    descriptionTab.current.click();
  };

  const descriptionMethods = useForm({
    resolver: zodResolver(formSchemaDescription)
  });

  const { reset: descriptionReset, handleSubmit: descriptionSubmit } = descriptionMethods;

  const onSubmitDescription = (data) => {
    dispatch(
      setForm({
        event: {
          ...currentEvent,
          description: data.description
        }
      })
    );
    mediaTab.current.click();
  };

  const mediaMethods = useForm({
    resolver: zodResolver(formSchemaMedia)
  });

  const { reset: mediaReset, handleSubmit: mediaSubmit } = mediaMethods;

  const [createEvent, { data, error, isSuccess, isLoading }] = useCreateEventMutation();

  const onSubmitMedia = (data) => {
    createEvent({
      ...currentEvent,
      companyId: currentCompany.id,
      establishmentId: parseInt(establishmentId),
      parcelId: parseInt(parcelId)
    });
  };

  useEffect(() => {
    if (isSuccess) {
      // dispatch(addCompanyEstablishment(dataEstablishment));
      dispatch(clearForm());
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
    }
  }, [isSuccess]);

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'remove-value':
      case 'pop-value':
        if (actionMeta.removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        newValue = parcels.filter((v) => v.isFixed);
        break;
    }
    setValue(orderOptions(newValue));
  };

  useEffect(() => {
    if (parcels && value === null) {
      setValue(parcels.filter((v) => v.isFixed));
    }
  }, [parcels]);

  const tabsList = [
    {
      name: 'basic',
      ref: basicTab,
      label: '1. Basic',
      nextTab: 'mainInfo',
      onClick: () =>
        setActiveBullets({
          basic: true,
          mainInfo: false,
          description: false,
          media: false
        })
    },
    {
      name: 'mainInfo',
      ref: mainInfoTab,
      label: '2. Main Info',
      nextTab: 'description',
      onClick: () =>
        setActiveBullets({
          basic: true,
          mainInfo: true,
          description: false,
          media: false
        })
    },
    {
      name: 'description',
      ref: descriptionTab,
      label: '3. Description',
      nextTab: 'media',
      onClick: () =>
        setActiveBullets({
          basic: true,
          mainInfo: true,
          description: true,
          media: false
        })
    },
    {
      name: 'media',
      ref: mediaTab,
      label: '4. Media',
      nextTab: null,
      onClick: () =>
        setActiveBullets({
          basic: true,
          mainInfo: true,
          description: true,
          media: true
        })
    }
  ];

  return (
    <FormLayout
      tabsList={tabsList}
      activeBullets={activeBullets}
      lineWidth={29}
      lineLeft={['52px', '39px']}>
      <TabPanel>
        <Card>
          <CardHeader mb="22px">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              Basic
            </Text>
          </CardHeader>
          <CardBody>
            <FormProvider {...basicMethods}>
              <form onSubmit={handleSubmit(onSubmitBasic)} style={{ width: '100%' }}>
                <Stack direction="column" spacing="20px" w="100%">
                  <Flex direction="column" w="80%" mt="10px">
                    <FormLabel ms="4px" fontSize="xs" fontWeight="bold" mb="4px" pl="12px">
                      What kind of production do you want to create?
                    </FormLabel>
                  </Flex>
                  <Flex w={'100%'} justifyContent={'center'}>
                    <Flex
                      bg={bgButtonGroup}
                      borderRadius="12px"
                      w={'fit-content'}
                      direction={{ base: 'column', smdd: 'row' }}>
                      <Button
                        variant="no-hover"
                        w="135px"
                        h="40px"
                        fontSize="xs"
                        boxShadow={
                          activeButton === 0 ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'
                        }
                        bg={activeButton === 0 ? bgActiveButton : 'transparent'}
                        onClick={() => setActiveButton(0)}>
                        WEATHER
                      </Button>
                      <Button
                        variant="no-hover"
                        w="135px"
                        h="40px"
                        fontSize="xs"
                        boxShadow={
                          activeButton === 1 ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'
                        }
                        bg={activeButton === 1 ? bgActiveButton : 'transparent'}
                        onClick={() => setActiveButton(1)}>
                        PRODUCTION
                      </Button>
                      <Button
                        variant="no-hover"
                        w="135px"
                        h="40px"
                        fontSize="xs"
                        boxShadow={
                          activeButton === 2 ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'
                        }
                        bg={activeButton === 2 ? bgActiveButton : 'transparent'}
                        onClick={() => setActiveButton(2)}>
                        CHEMICAL
                      </Button>
                      <Button
                        variant="no-hover"
                        w="135px"
                        h="40px"
                        fontSize="xs"
                        boxShadow={
                          activeButton === 3 ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'
                        }
                        bg={activeButton === 3 ? bgActiveButton : 'transparent'}
                        onClick={() => setActiveButton(3)}>
                        OTHER
                      </Button>
                    </Flex>
                  </Flex>
                  {/* <Stack
                        direction={{ sm: "column", md: "row" }}
                        spacing="30px"
                      > */}
                  {/* <FormControl>
                          <FormInput
                            name="name"
                            label="Name"
                            placeholder="Event name"
                            fontSize="xs"
                          />
                        </FormControl> */}
                  <FormControl>
                    <FormInput
                      fontSize="xs"
                      label="Date"
                      type="datetime-local"
                      name="date"
                      placeholder="Select date and time"
                    />
                  </FormControl>
                  {/* </Stack> */}
                  <Flex>
                    <FormControl>
                      <FormLabel pl={'12px'} fontSize="xs" fontWeight="bold" mb={'4px'}>
                        Select the others Parcels to which the event was applied
                      </FormLabel>
                      <Select
                        // value={parcels?.filter((v) => v.isFixed)}
                        value={value}
                        isMulti
                        styles={styles}
                        isClearable={value?.some((v) => !v.isFixed)}
                        name="colors"
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={onChange}
                        options={parcels}
                      />
                    </FormControl>
                  </Flex>

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
        <Card>
          <CardHeader mb="22px">
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              Event Info
            </Text>
          </CardHeader>
          <CardBody>
            {activeButton === 0 ? (
              <WeatherTab
                onSubmitHandler={onSubmitMainInfo}
                onPrev={() => basicTab.current.click()}
              />
            ) : activeButton === 1 ? (
              <ProductionTab
                onSubmitHandler={onSubmitMainInfo}
                onPrev={() => basicTab.current.click()}
              />
            ) : activeButton === 2 ? (
              <ChemicalTab
                onSubmitHandler={onSubmitMainInfo}
                onPrev={() => basicTab.current.click()}
              />
            ) : (
              <GeneralTab
                onSubmitHandler={onSubmitMainInfo}
                onPrev={() => basicTab.current.click()}
              />
            )}
          </CardBody>
        </Card>
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
            <FormProvider {...mediaMethods}>
              <form onSubmit={mediaSubmit(onSubmitMedia)} style={{ width: '100%' }}>
                <Flex direction="column" w="100%">
                  <Text color={textColor} fontSize="sm" fontWeight="bold" mb="12px">
                    Establishment images
                  </Text>
                  <Flex
                    align="center"
                    justify="center"
                    border="1px dashed #E2E8F0"
                    borderRadius="15px"
                    w="100%"
                    minH="130px"
                    cursor="pointer"
                    {...getRootProps({ className: 'dropzone' })}>
                    <Input {...getInputProps()} />
                    <Button variant="no-hover">
                      <Text color="gray.400" fontWeight="normal">
                        Drop files here to upload
                      </Text>
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
                      type="submit">
                      <Text fontSize="xs" color="#fff" fontWeight="bold">
                        SEND
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
  );
}

export default NewEstablishment;
