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
  useColorModeValue,
  Container,
  Divider,
  VStack
} from '@chakra-ui/react';
import { FaApple, FaFacebook, FaGoogle } from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect } from 'react';
import { object, string } from 'zod';
import { useIntl } from 'react-intl';
// Assets
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
  const bgIcons = useColorModeValue('gray.50', 'rgba(255, 255, 255, 0.1)');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
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
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      pt="120px"
      pb={{ base: 8, md: 12 }}
    >
      <Container maxW="md" centerContent>
        <VStack spacing={8} w="100%">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Text
              fontSize={{ base: '2xl', md: '3xl' }}
              fontWeight="bold"
              color={titleColor}
              letterSpacing="tight"
            >
              {intl.formatMessage({ id: 'app.welcome' })}
            </Text>
            <Text fontSize="md" color={subtitleColor} maxW="400px" lineHeight="1.6">
              {intl.formatMessage({ id: 'app.youCanLoginBy' })}
            </Text>
          </VStack>

          {/* Main Form Card */}
          <Box
            w="100%"
            maxW="480px"
            bg={bgColor}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor={borderColor}
            p={{ base: 6, md: 8 }}
          >
            {isSuccess ? (
              <VStack spacing={4} textAlign="center">
                <Icon
                  boxSize={12}
                  color="green.500"
                  as={() => (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
                    </svg>
                  )}
                />
                <Text color="green.500" fontWeight="bold" fontSize="lg">
                  {intl.formatMessage({ id: 'app.registrationSuccessful' })}
                </Text>
                <Text color={subtitleColor} textAlign="center">
                  Please check your email to verify your account.
                </Text>
              </VStack>
            ) : (
              <VStack spacing={6}>
                {/* Social Login Section */}
                <VStack spacing={4} w="100%">
                  <Text fontSize="lg" color={textColor} fontWeight="semibold" textAlign="center">
                    {intl.formatMessage({ id: 'app.registerWith' })}
                  </Text>

                  <HStack spacing={4} justify="center" w="100%">
                    {[
                      { icon: FaFacebook, color: '#1877F2', hoverColor: '#166FE5' },
                      { icon: FaApple, color: '#000000', hoverColor: '#333333' },
                      { icon: FaGoogle, color: '#EA4335', hoverColor: '#DB3E2F' }
                    ].map((social, index) => (
                      <Flex
                        key={index}
                        justify="center"
                        align="center"
                        w="60px"
                        h="60px"
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={borderColor}
                        cursor="pointer"
                        transition="all 0.2s"
                        bg={bgIcons}
                        _hover={{
                          borderColor: social.color,
                          transform: 'translateY(-2px)',
                          shadow: 'md'
                        }}
                      >
                        <Icon as={social.icon} w="24px" h="24px" color={social.color} />
                      </Flex>
                    ))}
                  </HStack>
                </VStack>

                {/* Divider */}
                <Flex align="center" w="100%">
                  <Divider />
                  <Text
                    px={4}
                    color={subtitleColor}
                    fontWeight="medium"
                    fontSize="sm"
                    flexShrink={0}
                  >
                    {intl.formatMessage({ id: 'app.or' })}
                  </Text>
                  <Divider />
                </Flex>

                {/* Registration Form */}
                <FormProvider {...methods}>
                  <Box as="form" onSubmit={handleSubmit(onSubmitHandler)} w="100%">
                    <VStack spacing={5}>
                      <HStack spacing={4} w="100%">
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
                      </HStack>

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

                      <Button
                        type="submit"
                        bg="green.500"
                        color="white"
                        size="lg"
                        fontSize="md"
                        fontWeight="semibold"
                        w="100%"
                        h="50px"
                        borderRadius="lg"
                        isLoading={isLoading}
                        loadingText="Creating account..."
                        _hover={{
                          bg: 'green.600',
                          transform: 'translateY(-2px)',
                          shadow: 'lg'
                        }}
                        _active={{
                          bg: 'green.700'
                        }}
                        transition="all 0.2s"
                      >
                        {isLoading ? (
                          <CircularProgress isIndeterminate size="24px" color="white" />
                        ) : (
                          intl.formatMessage({ id: 'app.signUp' })
                        )}
                      </Button>
                    </VStack>
                  </Box>
                </FormProvider>

                {/* Sign In Link */}
                <Text color={subtitleColor} textAlign="center" fontSize="sm">
                  {intl.formatMessage({ id: 'app.alreadyHaveAnAccount' })}{' '}
                  <Link
                    color={titleColor}
                    fontWeight="semibold"
                    onClick={() => navigate('/auth/signin')}
                    _hover={{ textDecoration: 'underline' }}
                    cursor="pointer"
                  >
                    {intl.formatMessage({ id: 'app.signIn' })}
                  </Link>
                </Text>
              </VStack>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default SignUp;
