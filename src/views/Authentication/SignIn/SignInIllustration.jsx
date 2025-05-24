// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
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
// Assets
import illustration from 'assets/img/signInImage.png';
import { login } from 'store/features/authSlice';
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
  // Chakra color mode
  const titleColor = useColorModeValue('green.500', 'teal.200');
  const textColor = useColorModeValue('gray.400', 'white');
  const illustrationBackground = useColorModeValue('gray.50', 'gray.700');

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const methods = useForm({
    resolver: zodResolver(loginSchema)
  });

  const [signIn, { data, isError, error, isLoading, isSuccess }] = useLoginMutation();

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = methods;

  useEffect(() => {
    if (data && isSuccess) {
      const next = location.state?.next || '/admin/dashboard/';
      dispatch(login(data));
      navigate(next, { replace: true });
      window.location.href = next;
    }
  }, [data, isSuccess]);

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
        pt={{ sm: '100px', md: '0px' }}
      >
        <Flex
          alignItems="center"
          justifyContent="start"
          mx={{ base: 'auto', lg: 'unset' }}
          style={{ userSelect: 'none' }}
          w={{ base: '100%', md: '50%', lg: '42%' }}
        >
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="48px"
            mt={{ md: '150px', lg: '80px' }}
          >
            <Heading color={titleColor} fontSize="32px" mb="10px">
              Sign In
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
                    }}
                  >
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
              mt="0px"
            >
              <Text color={textColor} fontWeight="medium">
                Don't have an account?
                <Link color={titleColor} as="span" ms="5px" fontWeight="bold">
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
          w={{ lg: '50vw', '2xl': '50vw' }}
          position="absolute"
          right="0px"
        >
          <Flex
            backgroundColor={illustrationBackground}
            justify="center"
            align="end"
            w="100%"
            h="100%"
            bgSize="cover"
            bgPosition="50%"
            position="absolute"
            borderBottomLeftRadius="20px"
          >
            <Image
              src={illustration}
              alt="illustration"
              objectFit="cover"
              width={'100%'}
              height={'100%'}
              borderRadius={'20px'}
            />
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;
