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
  type: string().min(1, 'Type is required'),
  observation: string().optional()
});

const ProductionTab = ({ onSubmitHandler, onPrev, initialValues = {} }) => {
  const intl = useIntl();
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');
  const textColor = useColorModeValue('gray.700', 'white');
  const iconColor = useColorModeValue('gray.300', 'gray.700');

  // Map API format to form format
  const mapApiTypeToFormType = (apiType) => {
    if (!apiType) return '';

    const typeMapping = {
      'event.production.planting': 'PL',
      'event.production.harvesting': 'HA',
      'event.production.irrigation': 'IR',
      'event.production.pruning': 'PR'
    };

    return typeMapping[apiType] || apiType;
  };

  const formType = mapApiTypeToFormType(initialValues.type);

  const mainInfoMethods = useForm({
    resolver: zodResolver(formSchemaMainInfo),
    defaultValues: {
      type: formType || '',
      observation: initialValues.observation || ''
    }
  });

  // Update form values when initialValues change
  useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      mainInfoMethods.reset({
        type: formType || '',
        observation: initialValues.observation || ''
      });
    }
  }, [initialValues, mainInfoMethods]);

  const {
    reset: mainInfoReset,
    handleSubmit: mainInfoSubmit,
    errors: mainInfoErrors,
    formState: { errors, isSubmitSuccessful },
    register
  } = mainInfoMethods;

  console.log('initialValues', initialValues);
  console.log('formType', formType);

  return (
    <FormProvider {...mainInfoMethods}>
      <form onSubmit={mainInfoSubmit(onSubmitHandler)} style={{ width: '100%' }}>
        <Flex direction="column" w="100%">
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
            mt="4px"
            defaultValue={formType || ''}
            {...register('type')}
          >
            <option value="PL">{intl.formatMessage({ id: 'app.planting' })}</option>
            <option value="HA">{intl.formatMessage({ id: 'app.harvesting' })}</option>
            <option value="IR">{intl.formatMessage({ id: 'app.irrigation' })}</option>
            <option value="PR">{intl.formatMessage({ id: 'app.pruning' })}</option>
          </ChakraSelect>
          {errors.type && (
            <Text fontSize="sm" color="red.500" mt={'0.5rem'}>
              {errors.type.message}
            </Text>
          )}
          <FormLabel ms="4px" fontSize="xs" fontWeight="bold">
            {intl.formatMessage({ id: 'app.observations' })}
          </FormLabel>
          <Textarea
            fontSize="sm"
            ms="4px"
            borderRadius="15px"
            type="text"
            placeholder={intl.formatMessage({ id: 'app.descriptionOfTheEvent' })}
            mb="24px"
            size="lg"
            name="observation"
            defaultValue={initialValues.observation || ''}
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

export default ProductionTab;
