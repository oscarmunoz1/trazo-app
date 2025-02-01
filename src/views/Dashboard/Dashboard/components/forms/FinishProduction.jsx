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
import { BsCircleFill, BsFillCloudLightningRainFill } from 'react-icons/bs';
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
import { useDropzone } from 'react-dropzone';
import { useFinishCurrentHistoryMutation } from 'store/api/historyApi.js';
import { useGoogleMap } from '@react-google-maps/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';

const formSchemaBasic = object({
  production_amount: string()
    .min(1, 'Production amount is required')
    .transform((val) => Number(val)),
  lot_id: string().min(1, 'Lot ID is required'),
  finish_date: string().min(1, 'Lot ID is required'),
  observation: string().optional()
});

function FinishProduction() {
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
  const [productValueError, setProductValueError] = useState(null);
  const [activeButton, setActiveButton] = useState(0);
  const dispatch = useDispatch();
  const [checkBox, setCheckBox] = useState(null);
  const [productsOptions, setProductsOptions] = useState([]);

  const navigate = useNavigate();

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { parcelId, establishmentId } = useParams();

  const [finishCurrentHistory, { data, error, isSuccess, isLoading }] =
    useFinishCurrentHistoryMutation();

  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    register
  } = basicMethods;

  const onSubmitBasic = (data) => {
    finishCurrentHistory({
      companyId: currentCompany?.id,
      establishmentId,
      parcelId: parcelId,
      historyData: { ...data, album: { images: acceptedFiles } }
    });
  };

  useEffect(() => {
    if (isSuccess) {
      // dispatch(addCompanyEstablishment(dataEstablishment));
      navigate(`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/`);
    }
  }, [isSuccess]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    // onDrop,
    // accept: "image/*", // Accepted file types
    maxFiles: 5 // Maximum number of files
    // maxSize: 1024 * 1024 * 5, // Maximum file size (5 MB)
  });

  return (
    <Flex
      direction="column"
      bg={bgColor}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px">
      <Tabs variant="unstyled" mt="24px" alignSelf="center">
        <TabPanels mt="24px" maxW={{ md: '90%', lg: '100%' }} mx="auto">
          <TabPanel maxW="800px" width={'600px'}>
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  {intl.formatMessage({ id: 'app.mainInfo' })}
                </Text>
              </CardHeader>

              <CardBody>
                <FormProvider {...basicMethods}>
                  <form onSubmit={handleSubmit(onSubmitBasic)} style={{ width: '100%' }}>
                    <Flex gap={'20px'}>
                      <Flex flexDir={'column'} flexGrow={1}>
                        <FormInput
                          fontSize="xs"
                          label={intl.formatMessage({ id: 'app.productionAmount' })}
                          ms="4px"
                          borderRadius="15px"
                          type="text"
                          placeholder={intl.formatMessage({ id: 'app.volumeOfTheProduct' })}
                          mb="24px"
                          name="production_amount"
                        />
                      </Flex>
                      <Flex flexDir={'column'} flexGrow={1}>
                        <FormInput
                          fontSize="xs"
                          label={intl.formatMessage({ id: 'app.lotNumber' })}
                          ms="4px"
                          borderRadius="15px"
                          type="text"
                          placeholder={intl.formatMessage({ id: 'app.lotNumber' })}
                          mb="24px"
                          name="lot_id"
                        />
                      </Flex>
                    </Flex>
                    <Flex flexDir={'column'}>
                      <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.finishDate' })}
                      </FormLabel>
                      <FormInput
                        fontSize="xs"
                        ms="4px"
                        borderRadius="15px"
                        type="datetime-local"
                        name="finish_date"
                        placeholder="Select date and time"
                        mb="24px"
                      />
                    </Flex>
                    <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                      {intl.formatMessage({ id: 'app.observations' })}
                    </FormLabel>
                    <Textarea
                      fontSize="xs"
                      ms="4px"
                      borderRadius="15px"
                      type="text"
                      placeholder={intl.formatMessage({ id: 'app.descriptionOfTheEvent' })}
                      mb="24px"
                      {...register('observation')}
                    />
                    <Text color={textColor} fontSize="sm" fontWeight="bold" mb="12px">
                      {intl.formatMessage({ id: 'app.productionImages' })}
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
                    <Flex justifyContent={'flex-end'}>
                      <Button
                        variant="no-hover"
                        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
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
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default FinishProduction;
