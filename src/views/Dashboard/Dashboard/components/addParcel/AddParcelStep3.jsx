// Chakra imports
import {
  Button,
  Checkbox,
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
  Textarea,
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
// Custom components
import React, { useEffect, useState } from 'react';
import { boolean, object, string } from 'zod';
import { useDispatch, useSelector } from 'react-redux';

import { BsFillCloudLightningRainFill } from 'react-icons/bs';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import ChemicalTab from './ChemicalTab.jsx';
import { FaPlus } from 'react-icons/fa';
import FormInput from 'components/Forms/FormInput';
import OtherTab from './OtherTab.jsx';
import { RocketIcon } from 'components/Icons/Icons';
import { SlChemistry } from 'react-icons/sl';
import { setEstablishmentParcel } from 'store/features/companySlice.jsx';
import { setForm } from 'store/features/formSlice';
import { useCreateParcelMutation } from 'store/api/productApi.js';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = object({
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

const AddEventStep3 = ({ onClose }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');

  const { establishmentId } = useParams();

  const [createEvent, { data, error, isSuccess, isLoading }] = useCreateParcelMutation();

  const dispatch = useDispatch();

  const currentParcel = useSelector((state) => state.form.currentForm?.parcel);

  const methods = useForm({
    resolver: zodResolver(formSchema)
  });

  const {
    reset,
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitSuccessful }
  } = methods;

  const onSubmit = (data) => {
    createEvent({
      ...currentParcel,
      ...data,
      establishment: parseInt(establishmentId)
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
    }
  }, [isSuccess, data]);

  const certificateValue = watch('certificate');

  return (
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
            In the following inputs you must give detailed information in order to certify this
            parcel.
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex direction="column" w="100%">
          <Stack direction="column" spacing="20px">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
                <FormControl display="flex" alignItems="center" mb="25px">
                  <Switch
                    id="certificate"
                    colorScheme="green"
                    me="10px"
                    {...register('certificate')}
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
                      <CircularProgress isIndeterminate value={1} color="#313860" size="25px" />
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
  );
};

export default AddEventStep3;
