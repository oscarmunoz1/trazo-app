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
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { object, string } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';

import FormInput from 'components/Forms/FormInput';
import { login } from 'store/features/authSlice';
// Assets
import signInImage from 'assets/img/signIn.png';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from 'store/api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = object({
  email: string().min(1, 'Email address is required').email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters')
});

function SignIn() {
  const dispatch = useDispatch();

  // Chakra color mode
  const titleColor = useColorModeValue('green.300', 'green.200');
  const textColor = useColorModeValue('gray.400', 'white');

  const methods = useForm({
    resolver: zodResolver(loginSchema)
  });

  const [signIn, { data, isError, error, isLoading, isSuccess }] = useLoginMutation();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = methods;

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(login(data));
      navigate(location.state?.next || '/admin/dashboard');
    }
  }, [data, dispatch, isSuccess]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (values) => {
    signIn(values);
  };

  return (
    <Flex position="relative" mb="40px">
      <Flex
        h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="space-between"
        mb="30px"
        pt={{ sm: '100px', md: '0px' }}>
        <Flex
          alignItems="center"
          justifyContent="start"
          style={{ userSelect: 'none' }}
          w={{ base: '100%', md: '50%', lg: '42%' }}>
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: '150px', lg: '80px' }}>
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Welcome Back
            </Heading>
            <Text mb="36px" ms="4px" color={textColor} fontWeight="bold" fontSize="14px">
              Enter your email and password to sign in
            </Text>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <FormControl isInvalid={isError}>
                  <FormInput name="email" label="Email" placeholder="Your email address" />
                  <FormInput
                    name="password"
                    label="Password"
                    placeholder="Your password"
                    type="password"
                  />
                  {isError && <FormErrorMessage pl="4px">{error.data.detail}</FormErrorMessage>}
                  <FormControl display="flex" alignItems="center">
                    <Switch id="remember-login" colorScheme="green" me="10px" />
                    <FormLabel htmlFor="remember-login" mb="0" ms="1" fontWeight="normal">
                      Remember me
                    </FormLabel>
                  </FormControl>
                  <Button
                    fontSize="10px"
                    type="submit"
                    bg="green.300"
                    w="100%"
                    h="45"
                    mb="20px"
                    color="white"
                    mt="20px"
                    _hover={{
                      bg: 'green.200'
                    }}
                    _active={{
                      bg: 'green.400'
                    }}>
                    SIGN IN
                  </Button>
                </FormControl>
              </form>
            </FormProvider>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px">
              <Text color={textColor} fontWeight="medium">
                Don't have an account?
                <Link
                  color={titleColor}
                  as="span"
                  ms="5px"
                  fontWeight="bold"
                  onClick={() => navigate('/auth/signup')}>
                  Sign Up
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Box
          display={{ base: 'none', md: 'block' }}
          overflowX="hidden"
          h="100%"
          w={{
            base: '60vw',
            md: '51vw',
            lg: '58vw',
            xl: '40vw'
          }}
          position="absolute"
          right="0px">
          <Box
            bgImage={signInImage}
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition={{
              base: '50%',
              sm: '29%',
              smd: '29%',
              smdd: '29%',
              md: '29%',
              lg: '36%',
              xl: '40%'
            }}
            position="absolute"
            borderBottomLeftRadius="20px"></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
