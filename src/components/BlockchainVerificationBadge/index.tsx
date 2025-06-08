import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Link,
  Icon,
  Tooltip,
  Badge,
  useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import { MdVerified, MdInfo, MdOpenInNew } from 'react-icons/md';
import { FaShieldAlt, FaEthereum } from 'react-icons/fa';

interface BlockchainVerificationProps {
  verified: boolean;
  transaction_hash?: string;
  record_hash?: string;
  verification_url?: string;
  network?: string;
  verification_date?: string;
  compliance_status?: boolean;
  eligible_for_credits?: boolean;
  mock_data?: boolean;
  fallback_data?: boolean;
  isCompact?: boolean;
}

interface BlockchainVerificationBadgeProps {
  verificationData?: BlockchainVerificationProps;
  isLoading?: boolean;
  isCompact?: boolean;
}

export const BlockchainVerificationBadge: React.FC<BlockchainVerificationBadgeProps> = ({
  verificationData,
  isLoading = false,
  isCompact = false
}) => {
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.600');
  const textColor = useColorModeValue('blue.700', 'blue.300');
  const iconColor = useColorModeValue('blue.600', 'blue.400');

  // Loading state
  if (isLoading) {
    return (
      <Box bg={bgColor} p={3} borderRadius="md" border="1px solid" borderColor={borderColor}>
        <HStack>
          <Spinner size="sm" color={iconColor} />
          <Text fontSize="sm" color={textColor}>
            Verifying blockchain record...
          </Text>
        </HStack>
      </Box>
    );
  }

  // No verification data
  if (!verificationData || !verificationData.verified) {
    return (
      <Box bg="gray.50" p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
        <HStack>
          <Icon as={MdInfo} color="gray.500" />
          <Text fontSize="sm" color="gray.600">
            Blockchain verification pending
          </Text>
        </HStack>
      </Box>
    );
  }

  const {
    verified,
    transaction_hash,
    verification_url,
    network,
    verification_date,
    compliance_status,
    eligible_for_credits,
    mock_data,
    fallback_data
  } = verificationData;

  // Get network icon
  const getNetworkIcon = () => {
    if (network?.includes('ethereum')) return FaEthereum;
    if (network?.includes('polygon')) return FaShieldAlt; // Using shield for Polygon
    return FaShieldAlt;
  };

  // Get network display name
  const getNetworkName = () => {
    if (network === 'ethereum') return 'Ethereum Mainnet';
    if (network === 'ethereum_testnet') return 'Ethereum Testnet';
    if (network === 'polygon_amoy') return 'Polygon Amoy Testnet';
    if (network === 'polygon_amoy_mock') return 'Polygon Amoy (Demo)';
    if (network === 'polygon_mainnet') return 'Polygon Mainnet';
    return network || 'Blockchain';
  };

  // Get verification status text
  const getStatusText = () => {
    if (mock_data) return 'Demo Mode - Mock Verification';
    if (fallback_data) return 'Fallback Verification Active';
    return 'Blockchain Verified';
  };

  // Get verification description
  const getDescription = () => {
    if (mock_data) {
      return 'This is demo data for development purposes. In production, this would be verified on the blockchain.';
    }
    if (fallback_data) {
      return 'Temporary verification mode. Full blockchain verification will be restored shortly.';
    }
    return 'Carbon data has been cryptographically verified and stored on the blockchain for immutable transparency.';
  };

  // Compact version for mobile or small spaces
  if (isCompact) {
    return (
      <Tooltip label={getDescription()} placement="top">
        <Badge
          colorScheme={mock_data || fallback_data ? 'yellow' : 'blue'}
          variant="solid"
          px={2}
          py={1}
          borderRadius="full"
        >
          <HStack spacing={1}>
            <Icon as={MdVerified} boxSize={3} />
            <Text fontSize="xs">{mock_data ? 'Demo' : fallback_data ? 'Temp' : 'Verified'}</Text>
          </HStack>
        </Badge>
      </Tooltip>
    );
  }

  // Full version
  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
    >
      <VStack spacing={3} align="stretch">
        {/* Header with verification status */}
        <HStack justify="space-between">
          <HStack>
            <Icon as={MdVerified} color={iconColor} boxSize={5} />
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              {getStatusText()}
            </Text>
          </HStack>
          {(mock_data || fallback_data) && (
            <Badge colorScheme="yellow" variant="outline" fontSize="xs">
              {mock_data ? 'DEMO' : 'TEMP'}
            </Badge>
          )}
        </HStack>

        {/* Description */}
        <Text fontSize="xs" color={textColor} lineHeight="1.4">
          {getDescription()}
        </Text>

        {/* Verification details */}
        <VStack spacing={2} align="stretch">
          {/* Network information */}
          <HStack justify="space-between">
            <HStack>
              <Icon as={getNetworkIcon()} color={iconColor} boxSize={4} />
              <Text fontSize="xs" color={textColor}>
                Network:
              </Text>
            </HStack>
            <Text fontSize="xs" fontWeight="medium" color={textColor}>
              {getNetworkName()}
            </Text>
          </HStack>

          {/* Verification date */}
          {verification_date && (
            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                Verified:
              </Text>
              <Text fontSize="xs" fontWeight="medium" color={textColor}>
                {new Date(verification_date).toLocaleDateString()}
              </Text>
            </HStack>
          )}

          {/* Compliance status */}
          {compliance_status !== undefined && (
            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                USDA Compliant:
              </Text>
              <Badge colorScheme={compliance_status ? 'green' : 'red'} size="sm">
                {compliance_status ? 'Yes' : 'No'}
              </Badge>
            </HStack>
          )}

          {/* Carbon credit eligibility */}
          {eligible_for_credits !== undefined && (
            <HStack justify="space-between">
              <Text fontSize="xs" color={textColor}>
                Credit Eligible:
              </Text>
              <Badge colorScheme={eligible_for_credits ? 'green' : 'orange'} size="sm">
                {eligible_for_credits ? 'Yes' : 'Pending'}
              </Badge>
            </HStack>
          )}
        </VStack>

        {/* Blockchain explorer link */}
        {verification_url && (
          <Box pt={2} borderTop="1px solid" borderColor={borderColor}>
            <Link
              href={verification_url}
              isExternal
              color={iconColor}
              fontSize="xs"
              fontWeight="medium"
              _hover={{ textDecoration: 'underline' }}
            >
              <HStack>
                <Text>View on Blockchain</Text>
                <Icon as={MdOpenInNew} boxSize={3} />
              </HStack>
            </Link>
          </Box>
        )}

        {/* Transaction hash (truncated) */}
        {transaction_hash && !mock_data && (
          <Box>
            <Text fontSize="xs" color={textColor} mb={1}>
              Transaction:
            </Text>
            <Text
              fontSize="xs"
              fontFamily="mono"
              color={textColor}
              bg={useColorModeValue('white', 'gray.700')}
              p={1}
              borderRadius="md"
              wordBreak="break-all"
            >
              {transaction_hash.slice(0, 10)}...{transaction_hash.slice(-8)}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default BlockchainVerificationBadge;
