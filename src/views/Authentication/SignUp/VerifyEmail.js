// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  Link,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { TypeOf, object, string } from "zod";

// Assets
import BgSignUp from "assets/img/basic-auth.png";
import FormInput from "components/Forms/FormInput";
import { useNavigate } from "react-router-dom";
import { useVerifyEmailMutation } from "store/features/authApi";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = object({
  verification_code: string().min(1, "Verification code is required").max(100),
});

function SignUp() {
  const titleColor = useColorModeValue("green.300", "green.200");
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const bgIcons = useColorModeValue("green.200", "rgba(255, 255, 255, 0.5)");
  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(registerSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  const [
    verifyEmail,
    { isLoading, isSuccess, error, isError },
  ] = useVerifyEmailMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/auth/verifyemail");
    }
  }, [isLoading]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (values) => {
    verifyEmail(values?.verification_code);
  };

  return (
    <Flex
      direction="column"
      alignSelf="center"
      justifySelf="center"
      overflow="hidden"
    >
      <Box
        position="absolute"
        minH={{ base: "70vh", md: "50vh" }}
        w={{ md: "calc(100vw - 50px)" }}
        borderRadius={{ md: "15px" }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mx={{ md: "auto" }}
        mt={{ md: "14px" }}
      ></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="8.5rem"
        mb="30px"
      >
        <Text fontSize="4xl" color="white" fontWeight="bold">
          Welcome back!
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          w={{ base: "90%", sm: "60%", lg: "40%", xl: "30%" }}
        >
          We send you a verification code to your email address. Please enter
          the code to verify your email address.
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Flex
          direction="column"
          w="445px"
          background="transparent"
          borderRadius="15px"
          p="40px"
          mx={{ base: "100px" }}
          bg={bgColor}
          boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
          <Text
            fontSize="xl"
            color={textColor}
            fontWeight="bold"
            textAlign="center"
            mb="22px"
          >
            Enter de code
          </Text>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
              <FormControl isInvalid={errors.name}>
                <FormInput
                  name="verification_code"
                  label="Code verification"
                  placeholder="Your code verification"
                  mb="24px"
                />

                <Button
                  type="submit"
                  bg="green.300"
                  fontSize="10px"
                  color="white"
                  fontWeight="bold"
                  w="100%"
                  h="45"
                  mb="24px"
                  _hover={{
                    bg: "green.200",
                  }}
                  _active={{
                    bg: "green.400",
                  }}
                >
                  VERIFY
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
              Have you already verified your email?
              <Link
                color={titleColor}
                as="span"
                ms="5px"
                href="#"
                fontWeight="bold"
              >
                Sign In
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default SignUp;
