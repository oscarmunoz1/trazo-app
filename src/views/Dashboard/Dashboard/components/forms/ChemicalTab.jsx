// Chakra imports
import {
  Button,
  Select as ChakraSelect,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  HStack,
  Box
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { number, object, string } from 'zod';

import { FaPlus } from 'react-icons/fa';
import FormInput from 'components/Forms/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';

// Custom components

const formSchemaMainInfo = object({
  type: string().min(1, 'Name is required'),
  commercial_name: string().min(1, 'Commercial Name is required'),
  volume: string().min(1, 'Volume is required'),
  area: string().min(1, 'Area is required'),
  observation: string(),
  way_of_application: string().min(1, 'Way of application is required')
});

const ChemicalTab = ({ onSubmitHandler, onPrev, initialValues = {} }) => {
  const intl = useIntl();
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.300', 'gray.700');

  // Map API format to form format
  const mapApiTypeToFormType = (apiType) => {
    if (!apiType) return '';

    const typeMapping = {
      'event.chemical.fertilizer': 'FE',
      'event.chemical.pesticide': 'PE',
      'event.chemical.fungicide': 'FU',
      'event.chemical.herbicide': 'HE'
    };

    return typeMapping[apiType] || apiType;
  };

  const formType = mapApiTypeToFormType(initialValues.type);

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo),
    defaultValues: {
      type: formType || '',
      commercial_name: initialValues.commercial_name || '',
      volume: initialValues.volume || '',
      area: initialValues.area || '',
      way_of_application: initialValues.way_of_application || '',
      observation: initialValues.observation || ''
    }
  });

  const {
    reset: mainInfoReset,
    handleSubmit: mainInfoSubmit,
    errors: mainInfoErrors,
    formState: { errors, isSubmitSuccessful },
    register
  } = mainInfoMethods;

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      const mappedType = mapApiTypeToFormType(initialValues.type);
      mainInfoMethods.reset({
        type: mappedType || '',
        commercial_name: initialValues.commercial_name || '',
        volume: initialValues.volume || '',
        area: initialValues.area || '',
        way_of_application: initialValues.way_of_application || '',
        observation: initialValues.observation || ''
      });
    }
  }, [initialValues, mainInfoMethods]);

  return (
    <FormProvider {...mainInfoMethods}>
      <form onSubmit={mainInfoSubmit(onSubmitHandler)} style={{ width: '100%' }}>
        <Flex direction="column" w="100%">
          <Flex gap={'20px'}>
            <Flex flexDir={'column'} flex={1}>
              <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
                {intl.formatMessage({ id: 'app.type' })}
              </FormLabel>
              <ChakraSelect
                placeholder={intl.formatMessage({ id: 'app.selectOption' })}
                placeholderTextColor="red"
                css={{ '&::placeholder': { color: 'red' } }}
                mb={errors.type ? '12px' : '24px'}
                borderColor={errors.type && 'red.500'}
                boxShadow={errors.type && '0 0 0 1px red.500'}
                borderWidth={errors.type && '2px'}
                ml="4px"
                height={'40px'}
                borderRadius={'15px'}
                fontSize={'0.875rem'}
                noOptionsMessage={() => intl.formatMessage({ id: 'app.noOptions' })}
                label={intl.formatMessage({ id: 'app.type' })}
                {...register('type')}
              >
                <option value="FE">{intl.formatMessage({ id: 'app.fertilizer' })}</option>
                <option value="PE">{intl.formatMessage({ id: 'app.pesticide' })}</option>
                <option value="FU">{intl.formatMessage({ id: 'app.fungicide' })}</option>
                <option value="HE">{intl.formatMessage({ id: 'app.herbicide' })}</option>
              </ChakraSelect>
              {errors.type && (
                <Text fontSize="sm" color="red.500" mt={'0.5rem'}>
                  {errors.type.message}
                </Text>
              )}
            </Flex>
            <Flex flex={1}>
              <FormInput
                fontSize="xs"
                label={intl.formatMessage({ id: 'app.wayOfApplication' })}
                ms="4px"
                borderRadius="15px"
                type="text"
                placeholder={intl.formatMessage({ id: 'app.wayOfApplication' })}
                mb="24px"
                name="way_of_application"
              />
            </Flex>
          </Flex>
          <Flex gap={'20px'}>
            <FormInput
              fontSize="xs"
              label={intl.formatMessage({ id: 'app.commercialName' })}
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder={intl.formatMessage({ id: 'app.commercialNameOfTheProduct' })}
              mb="24px"
              name="commercial_name"
            />
          </Flex>
          <Flex gap={'20px'}>
            <FormInput
              fontSize="xs"
              label={intl.formatMessage({ id: 'app.volume' })}
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder={intl.formatMessage({ id: 'app.volumeOfTheProduct' })}
              mb="24px"
              name="volume"
            />
            <FormInput
              fontSize="xs"
              label={intl.formatMessage({ id: 'app.area' })}
              ms="4px"
              borderRadius="15px"
              type="text"
              placeholder={intl.formatMessage({ id: 'app.areaOfApplication' })}
              mb="24px"
              name="area"
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
            name="observation"
            {...register('observation')}
          />
          <Box pt={6} mt={4} borderTop="1px" borderColor="gray.200">
            <HStack justify="space-between">
              <Button
                variant="outline"
                onClick={onPrev}
                leftIcon={<FaChevronLeft />}
                size="md"
                px={6}
                h="42px"
                borderRadius="lg"
                fontWeight="600"
                _hover={{ transform: 'translateY(-1px)' }}
                transition="all 0.3s ease"
              >
                {intl.formatMessage({ id: 'app.previous' }) || 'Previous'}
              </Button>
              <Button
                colorScheme="green"
                type="submit"
                rightIcon={<FaChevronRight />}
                size="md"
                px={6}
                h="42px"
                borderRadius="lg"
                fontWeight="600"
                boxShadow="lg"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-1px)' }}
                transition="all 0.3s ease"
              >
                {intl.formatMessage({ id: 'app.continue' }) || 'Continue'}
              </Button>
            </HStack>
          </Box>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default ChemicalTab;
