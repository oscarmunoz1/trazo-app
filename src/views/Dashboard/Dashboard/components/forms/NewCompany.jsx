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
  useColorModeValue,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import { GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { boolean, object, string } from 'zod';
import { clearForm, setForm } from 'store/features/formSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { BsCircleFill } from 'react-icons/bs';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter.tsx';
import CardHeader from 'components/Card/CardHeader';
import CardWithMap from '../CardWithMap';
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import Header from 'views/Pages/Profile/Overview/components/Header';
import ProfileBgImage from 'assets/img/ProfileBackground.png';
import avatar4 from 'assets/img/avatars/avatar4.png';
import imageMap from 'assets/img/imageMap.png';
import { setCompany } from 'store/features/companySlice';
import { setEstablishmentParcel } from 'store/features/companySlice';
import { setUserCompany } from 'store/features/userSlice';
import { useCreateCompanyMutation } from 'store/api/companyApi';
import { useDropzone } from 'react-dropzone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';
import FormLayout from 'components/Forms/FormLayout';
import { InfoOutlineIcon, ArrowForwardIcon } from '@chakra-ui/icons';

const formSchemaInfo = object({
  name: string().min(1, 'Name is required'),
  tradename: string().optional(),
  address: string().min(1, 'Address is required'),
  country: string().min(1, 'Country is required'),
  state: string().min(1, 'State is required'),
  city: string().min(1, 'City is required'),
  contact_email: string().email('Invalid email').optional(),
  contact_phone: string().optional(),
  website: string().optional(),
  fiscal_id: string().optional(),
  certifications: string().optional()
});

const formSchemaDescription = object({
  description: string().min(1, 'Description is required')
});

const formSchemaSocials = object({
  facebook: string(),
  instagram: string()
});

function NewCompany() {
  // Chakra color mode
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const bgColor = useColorModeValue('white', 'gray.700');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

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

  const currentCompany = useSelector((state) => state.form.currentForm?.company);

  const { getRootProps, getInputProps } = useDropzone();

  const infoMethods = useForm({
    resolver: zodResolver(formSchemaInfo)
  });

  const {
    reset: infoReset,
    handleSubmit: infoSubmit,
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

  const onSubmitInfo = (data) => {
    dispatch(setForm({ company: data }));
    descriptionTab.current.click();
  };

  const onSubmitDescription = (data) => {
    dispatch(
      setForm({
        company: {
          ...currentCompany,
          description: data.description
        }
      })
    );
    mediaTab.current.click();
  };

  const [
    createCompany,
    {
      data: dataCompany,
      error: errorCompany,
      isSuccess: isSuccessCompany,
      isLoading: isLoadingCompany
    }
  ] = useCreateCompanyMutation();

  const onSubmitSocials = (data) => {
    console.log('Submitting company data:', { ...currentCompany, ...data });

    createCompany({
      ...currentCompany,
      ...data
    })
      .unwrap()
      .then((response) => {
        console.log('Company created successfully:', response);
      })
      .catch((error) => {
        console.error('Error creating company:', error);
        toast({
          title: 'Error creating company',
          description:
            error.data?.detail || 'There was an error creating your company. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  useEffect(() => {
    if (isSuccessCompany && dataCompany) {
      dispatch(clearForm());
      dispatch(setCompany(dataCompany));
      const { id, name } = dataCompany;
      dispatch(setUserCompany({ id, name }));

      navigate(`/admin/dashboard/pricing?new_company=true&company_id=${id}`);
    }
  }, [isSuccessCompany, dataCompany, dispatch, navigate]);

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

  // Section headings localized
  const sectionHeadings = {
    general: intl.formatMessage({
      id: 'app.generalInformation',
      defaultMessage: 'Información general'
    }),
    contact: intl.formatMessage({
      id: 'app.contactInformation',
      defaultMessage: 'Información de contacto'
    }),
    compliance: intl.formatMessage({ id: 'app.compliance', defaultMessage: 'Cumplimiento' })
  };

  return (
    <FormLayout tabsList={tabsList} activeBullets={activeBullets}>
      <TabPanel>
        <Card>
          <CardHeader mb="22px">
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              {intl.formatMessage({ id: 'app.companyInfo' })}
            </Text>
          </CardHeader>
          <CardBody>
            <FormProvider {...infoMethods}>
              <form onSubmit={infoSubmit(onSubmitInfo)} style={{ width: '100%' }}>
                <Stack direction="column" spacing="20px" w="100%">
                  {/* General Info */}
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    {sectionHeadings.general}
                  </Text>
                  <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                    <FormControl>
                      <FormInput
                        name="name"
                        label={intl.formatMessage({ id: 'app.name' })}
                        placeholder={intl.formatMessage({ id: 'app.companyName' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="tradename" fontSize="xs" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.tradename' })}
                        <Tooltip
                          label={intl.formatMessage({
                            id: 'app.tradenameHelp',
                            defaultMessage:
                              'Nombre alternativo o comercial de la empresa, si aplica.'
                          })}
                        >
                          <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                        </Tooltip>
                      </FormLabel>
                      <FormInput
                        name="tradename"
                        placeholder={intl.formatMessage({ id: 'app.companyTradename' })}
                        fontSize="xs"
                      />
                    </FormControl>
                  </Stack>
                  <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                    <FormControl>
                      <FormInput
                        name="address"
                        label={intl.formatMessage({ id: 'app.address' })}
                        placeholder={intl.formatMessage({ id: 'app.companyAddress' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="country"
                        label={intl.formatMessage({ id: 'app.country' })}
                        placeholder={intl.formatMessage({ id: 'app.companyCountry' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="state"
                        label={intl.formatMessage({ id: 'app.state' })}
                        placeholder={intl.formatMessage({ id: 'app.companyState' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="city"
                        label={intl.formatMessage({ id: 'app.city' })}
                        placeholder={intl.formatMessage({ id: 'app.companyCity' })}
                        fontSize="xs"
                      />
                    </FormControl>
                  </Stack>
                  {/* Contact Info */}
                  <Text fontWeight="bold" fontSize="lg" mt={4} mb={2}>
                    {sectionHeadings.contact}
                  </Text>
                  <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                    <FormControl>
                      <FormInput
                        name="contact_email"
                        label={intl.formatMessage({ id: 'app.contactEmail' })}
                        placeholder={intl.formatMessage({ id: 'app.companyContactEmail' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="contact_phone"
                        label={intl.formatMessage({ id: 'app.contactPhone' })}
                        placeholder={intl.formatMessage({ id: 'app.companyContactPhone' })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormInput
                        name="website"
                        label={intl.formatMessage({ id: 'app.website' })}
                        placeholder={intl.formatMessage({
                          id: 'app.companyWebsite',
                          defaultMessage: 'Sitio web de la compañía (ej: https://miempresa.com)'
                        })}
                        fontSize="xs"
                      />
                    </FormControl>
                  </Stack>
                  {/* Compliance */}
                  <Text fontWeight="bold" fontSize="lg" mt={4} mb={2}>
                    {sectionHeadings.compliance}
                  </Text>
                  <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                    <FormControl>
                      <FormLabel htmlFor="fiscal_id" fontSize="xs" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.fiscalId' })}
                        <Tooltip label={intl.formatMessage({ id: 'app.fiscalIdHelp' })}>
                          <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                        </Tooltip>
                      </FormLabel>
                      <FormInput
                        name="fiscal_id"
                        placeholder={intl.formatMessage({
                          id: 'app.companyFiscalId',
                          defaultMessage: 'ID fiscal de la compañía (ej: RUT, NIT, CUIT)'
                        })}
                        fontSize="xs"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="certifications" fontSize="xs" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.certifications' })}
                        <Tooltip label={intl.formatMessage({ id: 'app.certificationsHelp' })}>
                          <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" />
                        </Tooltip>
                      </FormLabel>
                      <FormInput
                        name="certifications"
                        placeholder={intl.formatMessage({ id: 'app.companyCertifications' })}
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
                    type="submit"
                    rightIcon={<ArrowForwardIcon color="#fff" boxSize={3} ml={2} />}
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
            <Text color={textColor} fontSize="xl" fontWeight="bold" mb="3px">
              {intl.formatMessage({ id: 'app.media' })}
            </Text>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              <Text color={textColor} fontSize="sm" fontWeight="bold" mb="12px">
                {intl.formatMessage({ id: 'app.companyImage' })}
              </Text>
              <Flex
                align="center"
                justify="center"
                border="1px dashed #E2E8F0"
                borderRadius="15px"
                w="100%"
                minH="130px"
                cursor="pointer"
                {...getRootProps({ className: 'dropzone' })}
              >
                <Input {...getInputProps()} />
                <Button variant="no-hover">
                  <Text color="gray.400" fontWeight="normal">
                    {intl.formatMessage({ id: 'app.dropTheImageHereToUpload' })}
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
                  onClick={() => socialsTab.current.click()}
                >
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

export default NewCompany;
