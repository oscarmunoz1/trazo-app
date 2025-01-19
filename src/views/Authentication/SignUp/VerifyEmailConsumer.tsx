import { Box, Button, Flex, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailConsumer() {
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Flex direction="column" alignItems="center" pt={{ base: "120px", md: "75px" }}>
      <Heading color={textColor} fontSize="32px" mb="24px">
        Verify Your Email
      </Heading>
      <Text color={textColor} mb="24px" textAlign="center" maxW="500px">
        We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
      </Text>
      <Button
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="200px"
        h="50"
        mb="24px"
        onClick={() => navigate('/auth/signin')}
      >
        Back to Sign In
      </Button>
    </Flex>
  );
} 