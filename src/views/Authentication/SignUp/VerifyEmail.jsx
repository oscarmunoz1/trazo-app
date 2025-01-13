// Chakra imports
import { Box, CircularProgress, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Assets
import BgSignUp from 'assets/img/backgroundImage.png';
import { set } from 'react-hook-form';
import { useVerifyEmailMutation } from 'store/api/authApi';

function SignUp() {
  const textColor = useColorModeValue('gray.700', 'white');
  const titleColor = useColorModeValue('green.500', 'green.400');
  const bgColor = useColorModeValue('white', 'gray.700');

  const [isLoadingVerification, setIsLoadingVerification] = useState(true);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [verifyEmail, { isLoading, isSuccess, error, isError }] = useVerifyEmailMutation();

  useEffect(() => {
    const email = searchParams.get('email');
    const code = searchParams.get('code');
    if (email && code) {
      verifyEmail({ email, code });
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsLoadingVerification(false);
      }, 2000);
    }
  }, [isSuccess]);

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
        mt="8.5rem"
        mb="30px">
        <Text fontSize="4xl" color="white" fontWeight="bold">
          Welcome back!
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          w={{ base: '90%', sm: '60%', lg: '40%', xl: '30%' }}>
          You should be able to verify your email address. If you have not received the email, we
          will gladly send you another.
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
          {isLoadingVerification ? (
            <>
              <Flex direction="column" justifyContent="center" alignItems="center" mb="20px">
                <CircularProgress isIndeterminate value={1} color="#313860" size="25px" />
              </Flex>

              <Text fontSize="xl" color={textColor} fontWeight="bold" textAlign="center" mb="22px">
                We are verifying your email address.
              </Text>
            </>
          ) : (
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px">
              <Text color="green.400" fontWeight="bold" textAlign="center" mb="22px">
                Your account has been successfully verified. Now you can
                <Link
                  color="black"
                  mb="22px"
                  as="span"
                  ms="5px"
                  fontWeight="bold"
                  onClick={() => navigate('/auth/signin')}>
                  Sign In
                </Link>
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
