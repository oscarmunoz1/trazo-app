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
import CreatableSelect from 'react-select/creatable';
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import Header from 'views/Pages/Profile/Overview/components/Header';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import { RocketIcon } from 'components/Icons/Icons';
import Select from 'react-select';
import { SlChemistry } from 'react-icons/sl';
import { addCompanyEstablishment } from 'store/features/companySlice';
import avatar4 from 'assets/img/avatars/avatar4.png';
import imageMap from 'assets/img/imageMap.png';
import { set } from 'date-fns';
import { setEstablishmentParcelHasProduction } from 'store/features/companySlice';
import { useCreateEventMutation } from 'store/api/historyApi';
import { useCreateProductionMutation } from 'store/api/historyApi';
import { useDropzone } from 'react-dropzone';
import { useGetEstablishmentProductsQuery } from 'store/api/productApi';
import { useGoogleMap } from '@react-google-maps/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';

// Custom components
const styles = {
  container: (provided, state) => ({
    ...provided,
    margin: '0px !important'
  }),

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
  date: string().min(1, 'Date is required'),
  age_of_plants: string(),
  number_of_plants: string(),
  soil_ph: string()
});

function NewProduction() {
  const intl = useIntl();
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
  const [isOutdoor, setIsOutdoor] = useState(true);
  const [productValueError, setProductValueError] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState(null);
  const [productsOptions, setProductsOptions] = useState([]);
  const [navigateTo, setNavigateTo] = useState(null);

  const navigate = useNavigate();

  const { parcelId, establishmentId } = useParams();

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const [
    createProduction,
    { data, isSuccess: isSuccessProduction }
  ] = useCreateProductionMutation();

  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    register
  } = basicMethods;

  const onSubmitBasic = (data, event) => {
    if (value === null) {
      setProductValueError('Product is required');
      return;
    }
    setProductValueError(null);
    if (event.nativeEvent.submitter.innerText === intl.formatMessage({ id: 'app.save' })) {
      setNavigateTo(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
    } else {
      setNavigateTo(
        `/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/event/add`
      );
    }
    const dataProduction = {
      ...data,
      product: {
        id: value.value,
        name: value.label,
        isNew: value.__isNew__
      },
      parcel: parcelId,
      is_outdoor: isOutdoor ? true : false,
      type: activeButton === 0 ? 'OR' : 'GA'
    };
    createProduction(dataProduction);
  };

  useEffect(() => {
    if (isSuccessProduction) {
      // dispatch(addCompanyEstablishment(dataEstablishment));
      dispatch(clearForm());
      dispatch(
        setEstablishmentParcelHasProduction({
          establishmentId,
          parcelId
        })
      );
      navigate(navigateTo);
      setNavigateTo(null);
    }
  }, [isSuccessProduction]);

  const { data: dataProducts, isSuccess: isSuccessProducts } = useGetEstablishmentProductsQuery(
    {
      companyId: currentCompany?.id,
      establishmentId
    },
    {
      skip: !establishmentId || !currentCompany || currentCompany?.id === undefined
    }
  );

  useEffect(() => {
    if (isSuccessProducts) {
      setProductsOptions(
        dataProducts.map((product) => ({
          value: product.id,
          label: product.name
        }))
      );
    }
  }, [isSuccessProducts]);

  return (
    <Flex
      direction="column"
      bg={bgColor}
      w={{ base: '100%', md: '768px' }}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px">
      <Tabs variant="unstyled" mt="24px" alignSelf="center" w="100%">
        <TabPanels maxW={{ md: '90%', lg: '100%' }} mx="auto">
          <TabPanel>
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  {intl.formatMessage({ id: 'app.mainInfo' })}
                </Text>
              </CardHeader>

              <CardBody>
                <FormProvider {...basicMethods}>
                  <form onSubmit={handleSubmit(onSubmitBasic)} style={{ width: '100%' }}>
                    <Stack direction="column" spacing="20px" w="100%">
                      <Flex direction="column" w="80%" mt="10px">
                        <FormLabel ms="4px" fontSize="xs" fontWeight="bold" mb="4px" pl="12px">
                          {intl.formatMessage({ id: 'app.whatKindOfProduction' })}
                        </FormLabel>
                      </Flex>
                      <Flex w={'100%'} justifyContent={'center'}>
                        <Flex bg={bgButtonGroup} borderRadius="12px" w={'fit-content'}>
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
                            {intl.formatMessage({ id: 'app.orchard' })}
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
                            {intl.formatMessage({ id: 'app.garden' })}
                          </Button>
                        </Flex>
                      </Flex>
                      <FormLabel fontSize="xs" fontWeight="bold" pl="12px">
                        {intl.formatMessage({ id: 'app.product' })}
                      </FormLabel>
                      <CreatableSelect
                        isClearable
                        options={productsOptions}
                        styles={styles}
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                      />
                      {productValueError === null && (
                        <Text fontSize="xs" color="red.500" mt={'0px'} pl={'12px'}>
                          {productValueError}
                        </Text>
                      )}
                      <Flex pt={'12px'} mt={'0px !important'}>
                        <FormInput
                          fontSize="xs"
                          label={intl.formatMessage({ id: 'app.date' })}
                          type="datetime-local"
                          name="date"
                          placeholder={intl.formatMessage({ id: 'app.selectDateAndTime' })}
                        />
                      </Flex>
                      {activeButton === 0 ? (
                        <>
                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder={intl.formatMessage({ id: 'app.ageOfPlants' })}
                            name="age_of_plants"
                            label={intl.formatMessage({ id: 'app.ageOfPlants' })}
                          />
                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder={intl.formatMessage({ id: 'app.numberOfPlants' })}
                            name="number_of_plants"
                            label={intl.formatMessage({ id: 'app.numberOfPlants' })}
                          />
                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder={intl.formatMessage({ id: 'app.averageSoilPH' })}
                            name="soil_ph"
                            label={intl.formatMessage({ id: 'app.averageSoilPH' })}
                          />
                        </>
                      ) : activeButton === 1 ? (
                        <>
                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder={intl.formatMessage({ id: 'app.averageSoilPH' })}
                            name="soil_ph"
                            label={intl.formatMessage({ id: 'app.averageSoilPH' })}
                          />
                        </>
                      ) : null}
                      <Flex direction="column" w="80%" pt="10px">
                        <FormLabel ms="4px" fontSize="xs" fontWeight="bold" mb="4px" pl="12px">
                          {intl.formatMessage({ id: 'app.whereTheProductionWillBe' })}
                        </FormLabel>
                      </Flex>
                      <Flex w={'100%'} justifyContent={'center'}>
                        <Flex bg={bgButtonGroup} borderRadius="12px" w={'fit-content'}>
                          <Button
                            variant="no-hover"
                            w="135px"
                            h="40px"
                            fontSize="xs"
                            boxShadow={isOutdoor ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'}
                            bg={isOutdoor ? bgActiveButton : 'transparent'}
                            onClick={() => setIsOutdoor(true)}>
                            {intl.formatMessage({ id: 'app.outdoor' })}
                          </Button>
                          <Button
                            variant="no-hover"
                            w="135px"
                            h="40px"
                            fontSize="xs"
                            boxShadow={!isOutdoor ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'}
                            bg={!isOutdoor ? bgActiveButton : 'transparent'}
                            onClick={() => setIsOutdoor(false)}>
                            {intl.formatMessage({ id: 'app.indoor' })}
                          </Button>
                        </Flex>
                      </Flex>
                      <Flex gap={'25px'} justifyContent={'flex-end'}>
                        <Button
                          variant="no-hover"
                          bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                          alignSelf="flex-end"
                          mt="24px"
                          w="fit-content"
                          h="35px"
                          type="submit">
                          <Text fontSize="xs" color="#fff" fontWeight="bold">
                            {intl.formatMessage({ id: 'app.saveAndAddANewEvent' })}
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
                            {intl.formatMessage({ id: 'app.save' })}
                          </Text>
                        </Button>
                      </Flex>
                    </Stack>
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default NewProduction;
