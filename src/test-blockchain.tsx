import React from 'react';
import { Box, VStack, Heading, Text } from '@chakra-ui/react';
import { BlockchainVerificationBadge } from './components/BlockchainVerificationBadge';
import { useGetQRCodeSummaryQuery } from './store/api/carbonApi';

// Test component to demonstrate blockchain verification
export const BlockchainTest: React.FC = () => {
  // Test with a sample production ID
  const { data: carbonData, isLoading } = useGetQRCodeSummaryQuery('1');

  return (
    <Box p={8} maxW="600px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Heading>Blockchain Verification Test</Heading>

        <Text>
          This component tests the blockchain verification feature implementation. It should display
          blockchain verification data from the QR summary API.
        </Text>

        {/* Test the blockchain verification badge */}
        <Box>
          <Heading size="md" mb={4}>
            Blockchain Verification Badge:
          </Heading>
          <BlockchainVerificationBadge
            verificationData={carbonData?.blockchainVerification}
            isLoading={isLoading}
            isCompact={false}
          />
        </Box>

        {/* Show raw data for debugging */}
        <Box>
          <Heading size="md" mb={4}>
            Raw Blockchain Data:
          </Heading>
          <Box as="pre" fontSize="sm" bg="gray.100" p={4} borderRadius="md" overflow="auto">
            {JSON.stringify(carbonData?.blockchainVerification, null, 2)}
          </Box>
        </Box>

        {/* Test compact version */}
        <Box>
          <Heading size="md" mb={4}>
            Compact Version:
          </Heading>
          <BlockchainVerificationBadge
            verificationData={carbonData?.blockchainVerification}
            isLoading={isLoading}
            isCompact={true}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default BlockchainTest;
