import {} from '@chakra-ui/react';

// Chakra imports
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  HStack,
  Icon,
  Link,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { object, string } from 'zod';
import { useIntl } from 'react-intl';
// Assets
import BgSignUp from 'assets/img/backgroundImage.png';
import FormInput from 'components/Forms/FormInput';
import { useNavigate } from 'react-router-dom';
import { useSignUpMutation } from 'store/api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = object({
  first_name: string().min(1, 'Full name is required').max(100),
  last_name: string().min(1, 'Full name is required').max(100),
  email: string().min(1, 'Email address is required').email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  password2: string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.password2, {
  path: ['password2'],
  message: 'Passwords do not match'
});

function SignUp() {
  const intl = useIntl();
  const titleColor = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');
  const bgIcons = useColorModeValue('green.200', 'rgba(255, 255, 255, 0.5)');
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(registerSchema)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = methods;

  const [registerUser, { isLoading, isSuccess, error, isError }] = useSignUpMutation();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (values) => {
    registerUser({ ...values, user_type: 4 });
  };

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden">
      <Box
        position="absolute"
        minH={{ base: '70vh', md: '50vh' }}
        w={{ md: 'calc(100vw - 50px)' }}
        borderRadius={{ md: '15px' }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        marginInlineEnd={'25px'}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(180deg, rgba(0,128,0,0.85) 0%, rgba(0,128,0,0.6) 100%)',
          borderRadius: '15px',
          zIndex: 0
        }}
        bgSize="cover"
        mx={{ md: 'auto' }}
        mt={{ md: '14px' }}></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        pt={'55px'}>
        <Text fontSize="4xl" color="white" fontWeight="bold">
          {intl.formatMessage({ id: 'app.welcome' })}
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: '90%', sm: '60%', lg: '40%', xl: '25%' }}>
          {intl.formatMessage({ id: 'app.youCanLoginBy' })}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p="40px"
          mx={{ base: '100px' }}
          bg={bgColor}
          boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)">
          {isSuccess ? (
            <Text color="green.400" fontWeight="bold" textAlign="center" mb="22px">
              {intl.formatMessage({ id: 'app.registrationSuccessful' })}
            </Text>
          ) : (
            <>
              <Text fontSize="xl" color={textColor} fontWeight="bold" textAlign="center" mb="22px">
                {intl.formatMessage({ id: 'app.registerWith' })}
              </Text>
              <HStack spacing="15px" justify="center" mb="22px">
                <Flex
                  justify="center"
                  align="center"
                  w="75px"
                  h="75px"
                  borderRadius="15px"
                  border="1px solid lightgray"
                  cursor="pointer"
                  transition="all .25s ease"
                  _hover={{ filter: 'brightness(120%)', bg: bgIcons }}>
                  <Link href="#">
                    <Icon
                      as={FaFacebook}
                      w="30px"
                      h="30px"
                      _hover={{ filter: 'brightness(120%)' }}
                    />
                  </Link>
                </Flex>
                <Flex
                  justify="center"
                  align="center"
                  w="75px"
                  h="75px"
                  borderRadius="15px"
                  border="1px solid lightgray"
                  cursor="pointer"
                  transition="all .25s ease"
                  _hover={{ filter: 'brightness(120%)', bg: bgIcons }}>
                  <Link href="#">
                    <Icon as={FaApple} w="30px" h="30px" _hover={{ filter: 'brightness(120%)' }} />
                  </Link>
                </Flex>
                <Flex
                  justify="center"
                  align="center"
                  w="75px"
                  h="75px"
                  borderRadius="15px"
                  border="1px solid lightgray"
                  cursor="pointer"
                  transition="all .25s ease"
                  _hover={{ filter: 'brightness(120%)', bg: bgIcons }}>
                  <Link href="#">
                    <Icon as={FaGoogle} w="30px" h="30px" _hover={{ filter: 'brightness(120%)' }} />
                  </Link>
                </Flex>
              </HStack>
              <Text fontSize="lg" color="gray.400" fontWeight="bold" textAlign="center" mb="22px">
                {intl.formatMessage({ id: 'app.or' })}
              </Text>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                  <FormControl isInvalid={errors.name}>
                    <FormInput
                      name="first_name"
                      label={intl.formatMessage({ id: 'app.firstName' })}
                      placeholder={intl.formatMessage({ id: 'app.yourFirstName' })}
                    />
                    <FormInput
                      name="last_name"
                      label={intl.formatMessage({ id: 'app.lastName' })}
                      placeholder={intl.formatMessage({ id: 'app.yourLastName' })}
                    />
                    <FormInput
                      name="email"
                      label={intl.formatMessage({ id: 'app.email' })}
                      placeholder={intl.formatMessage({ id: 'app.yourEmailAddress' })}
                    />
                    <FormInput
                      name="password"
                      label={intl.formatMessage({ id: 'app.password' })}
                      placeholder={intl.formatMessage({ id: 'app.yourPassword' })}
                      type="password"
                    />
                    <FormInput
                      name="password2"
                      label={intl.formatMessage({ id: 'app.confirmPassword' })}
                      placeholder={intl.formatMessage({ id: 'app.confirmYourPassword' })}
                      type="password"
                    />
                    {/* <FormControl display="flex" alignItems="center" mb="24px">
                  <Switch id="remember-login" colorScheme="green" me="10px" />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    fontWeight="normal"
                  >
                    Remember me
                  </FormLabel>
                </FormControl> */}
                    <Button
                      mt="12px"
                      type="submit"
                      bg="green.300"
                      fontSize="10px"
                      color="white"
                      fontWeight="bold"
                      w="100%"
                      h="45"
                      mb="24px"
                      _hover={{
                        bg: 'green.400'
                      }}
                      _active={{
                        bg: 'green.500'
                      }}>
                      {isLoading ? (
                        <CircularProgress isIndeterminate value={1} color="#313860" size="25px" />
                      ) : (
                        intl.formatMessage({ id: 'app.signUp' })
                      )}
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
                  {intl.formatMessage({ id: 'app.alreadyHaveAnAccount' })}
                  <Link
                    color={titleColor}
                    as="span"
                    ms="5px"
                    href="#"
                    fontWeight="bold"
                    onClick={() => navigate('/auth/signin')}>
                    {intl.formatMessage({ id: 'app.signIn' })}
                  </Link>
                </Text>
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
