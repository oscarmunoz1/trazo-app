import React from 'react';
import { Spinner, Flex, Text } from '@chakra-ui/react';

/**
 * Loading component for subscription verification
 * Displays a centered spinner with text while subscription status is being verified
 */
const SubscriptionLoadingState = () => (
  <Flex
    width="100%"
    height="100vh"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    bg="white"
  >
    <Spinner size="xl" color="green.500" thickness="4px" speed="0.65s" />
    <Text mt={4} fontSize="lg" fontWeight="medium" color="gray.600">
      Verifying subscription...
    </Text>
  </Flex>
);

export default SubscriptionLoadingState;
