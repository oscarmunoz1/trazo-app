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
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { clearForm, setForm } from 'store/features/formSlice';
import { object, string } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

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
import avatar4 from 'assets/img/avatars/avatar4.png';
import { editCompanyEstablishment } from 'store/features/companySlice';
import imageMap from 'assets/img/imageMap.png';
import { useDropzone } from 'react-dropzone';
import { useEditEstablishmentMutation } from 'store/api/companyApi';
import { useGoogleMap } from '@react-google-maps/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';
const formSchemaInfo = object({
  name: string().min(1, 'Name is required'),
  country: string().min(1, 'Country is required'),
  state: string().min(1, 'State is required'),
  city: string().min(1, 'City is required'),
  address: string().min(1, 'Address is required'),
  zone: string()
});

const formSchemaDescription = object({
  description: string().min(1, 'Description is required')
});

const formSchemaSocials = object({
  facebook: string(),
  instagram: string()
});

function EditEstablishment() {
  const intl = useIntl();
  const bgColor = useColorModeValue('white', 'gray.700');
  const dispatch = useDispatch();
  const [establishment, setEstablishment] = useState(null);
  const [initialFormValues, setInitialFormValues] = useState(null);

  const { establishmentId } = useParams();
  const currentEstablishment = useSelector((state) => state.form.currentForm?.establishment);
  const navigate = useNavigate();
  const currentCompany = useSelector((state) => state.company.currentCompany);

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);

  useEffect(() => {
    let establishment;
    if (establishments) {
      establishment = establishments.filter(
        (establishment) => establishment.id.toString() === establishmentId
      )[0];
      setEstablishment(establishment);
      const { address, zone, city, state, country, name, description, facebook, instagram } =
        establishment;
      dispatch(
        setForm({
          establishment: {
            address,
            zone,
            city,
            country,
            state,
            name,
            description,
            facebook,
            instagram
          }
        })
      );
    }
  }, [establishmentId, establishments]);

  useEffect(() => {
    if (currentEstablishment) {
      setInfoValues('name', currentEstablishment.name || '');
      setInfoValues('country', currentEstablishment.country || '');
      setInfoValues('state', currentEstablishment.state || '');
      setInfoValues('city', currentEstablishment.city || '');
      setInfoValues('address', currentEstablishment.address || '');
      setInfoValues('zone', currentEstablishment.zone || '');
      setDescriptionValues('description', currentEstablishment.description);
    }
  }, [currentEstablishment]);

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

  const { getRootProps, getInputProps } = useDropzone();

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

  const socialsMethods = useForm({
    resolver: zodResolver(formSchemaSocials)
  });

  const { reset: socialsReset, handleSubmit: socialsSubmit } = socialsMethods;

  const onSubmitInfo = (data) => {
    dispatch(
      setForm({
        establishment: {
          ...currentEstablishment,
          name: data.name,
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
          zone: data.zone
        }
      })
    );
    descriptionTab.current.click();
  };

  const onSubmitDescription = (data) => {
    dispatch(
      setForm({
        establishment: {
          ...currentEstablishment,
          description: data.description
        }
      })
    );
    mediaTab.current.click();
  };

  const [
    editEstablishment,
    {
      data: dataEstablishment,
      error: errorEstablishment,
      isSuccess: isSuccessEstablishment,
      isLoading: isLoadingEstablishment
    }
  ] = useEditEstablishmentMutation();

  const onSubmitSocials = (data) => {
    editEstablishment({
      companyId: currentCompany.id,
      establishmentId,
      establishmentData: {
        ...currentEstablishment,
        ...(data?.facebook && { facebook: data.facebook }),
        ...(data?.instagram && { instagram: data.instagram })
        // company: currentCompany.id,
      }
    });
  };

  useEffect(() => {
    if (isSuccessEstablishment) {
      dispatch(editCompanyEstablishment(dataEstablishment));
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

  return (
    <FormLayout tabsList={tabsList} activeBullets={activeBullets}>
      <TabPanel>
        <Card>
          <CardHeader mb="22px">
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              {intl.formatMessage({ id: 'app.establishmentInfo' })}
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
                        placeholder="Establishment name"
                        fontSize="xs"
                        defaultValue={currentEstablishment?.name}
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="country"
                        label={intl.formatMessage({ id: 'app.establishmentCountry' })}
                        placeholder={intl.formatMessage({ id: 'app.establishmentCountry' })}
                        fontSize="xs"
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                    <FormControl>
                      <FormInput
                        name="state"
                        label={intl.formatMessage({ id: 'app.establishmentState' })}
                        placeholder={intl.formatMessage({ id: 'app.establishmentState' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="city"
                        label={intl.formatMessage({ id: 'app.establishmentCity' })}
                        placeholder={intl.formatMessage({ id: 'app.establishmentCity' })}
                        fontSize="xs"
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                    <FormControl>
                      <FormInput
                        name="address"
                        label={intl.formatMessage({ id: 'app.establishmentAddress' })}
                        placeholder={intl.formatMessage({ id: 'app.establishmentAddress' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="zone"
                        label={intl.formatMessage({ id: 'app.establishmentZone' })}
                        placeholder={intl.formatMessage({ id: 'app.establishmentZone' })}
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
                {intl.formatMessage({ id: 'app.establishmentImages' })}
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
                    {intl.formatMessage({ id: 'app.dropFilesHereToUpload' })}
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
                  onClick={() => socialsTab.current.click()}>
                  <Text fontSize="xs" color="#fff" fontWeight="bold">
                    {intl.formatMessage({ id: 'app.next' })}
                  </Text>
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </TabPanel>
      <TabPanel maxW="800px">
        <Card>
          <CardHeader mb="32px">
            <Text fontSize="lg" color={textColor} fontWeight="bold">
              {intl.formatMessage({ id: 'app.socials' })}
            </Text>
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
                        placeholder="https://"
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="instagram"
                        label={intl.formatMessage({ id: 'app.instagramAccount' })}
                        placeholder="https://"
                        fontSize="xs"
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
                      onClick={() => mediaTab.current.click()}>
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
                        {intl.formatMessage({ id: 'app.send' })}
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

export default EditEstablishment;
