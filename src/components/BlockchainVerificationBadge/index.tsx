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
  Spinner,
  Divider,
  Progress,
  Button,
  useBreakpointValue
} from '@chakra-ui/react';
import { MdVerified, MdInfo, MdOpenInNew, MdSecurity } from 'react-icons/md';
import { FaShieldAlt, FaEthereum, FaCheck, FaCertificate } from 'react-icons/fa';

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
  usda_verified?: boolean;
  usda_compliance_percentage?: number;
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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('green.200', 'green.600');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const iconColor = useColorModeValue('green.600', 'green.400');
  const uspGreen = useColorModeValue('green.600', 'green.400');
  const blockchainBlue = useColorModeValue('blue.600', 'blue.400');

  // Responsive sizing
  const badgeSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const spacing = useBreakpointValue({ base: 2, md: 3 });
  const padding = useBreakpointValue({ base: 3, md: 4 });

  // Loading state
  if (isLoading) {
    return (
      <Box
        bg={bgColor}
        p={padding}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <HStack spacing={spacing}>
          <Spinner size="sm" color={iconColor} />
          <Text fontSize="sm" color={textColor}>
            Verifying data integrity...
          </Text>
        </HStack>
      </Box>
    );
  }

  // No verification data
  if (!verificationData) {
    return (
      <Box
        bg="gray.50"
        p={padding}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <HStack spacing={spacing}>
          <Icon as={MdInfo} color="gray.500" />
          <Text fontSize="sm" color="gray.600">
            Verification in progress
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
    fallback_data,
    usda_verified,
    usda_compliance_percentage
  } = verificationData;

  // Get network icon
  const getNetworkIcon = () => {
    if (network?.includes('ethereum')) return FaEthereum;
    if (network?.includes('polygon')) return FaShieldAlt;
    return FaShieldAlt;
  };

  // Get network display name
  const getNetworkName = () => {
    if (network === 'ethereum') return 'Ethereum';
    if (network === 'ethereum_testnet') return 'Ethereum Testnet';
    if (network === 'polygon_amoy') return 'Polygon Amoy';
    if (network === 'polygon_amoy_mock') return 'Polygon (Demo)';
    if (network === 'polygon_mainnet') return 'Polygon';
    return 'Blockchain';
  };

  // Enhanced status display
  const getVerificationStatus = () => {
    const hasUSDA = usda_verified && usda_compliance_percentage && usda_compliance_percentage > 70;
    const hasBlockchain = verified && !mock_data && !fallback_data;

    if (hasUSDA && hasBlockchain) return 'fully_verified';
    if (hasUSDA || hasBlockchain) return 'partially_verified';
    if (mock_data || fallback_data) return 'demo_mode';
    return 'pending';
  };

  const status = getVerificationStatus();

  // Compact version for mobile or small spaces
  if (isCompact) {
    return (
      <HStack spacing={2} justify="center">
        {/* USDA Badge */}
        {usda_verified && (
          <Tooltip label="USDA verified sustainable practices" placement="top">
            <Badge
              colorScheme="green"
              variant="solid"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              <HStack spacing={1}>
                <Icon as={FaCertificate} boxSize={3} />
                <Text>USDA</Text>
              </HStack>
            </Badge>
          </Tooltip>
        )}

        {/* Blockchain Badge */}
        {verified && (
          <Tooltip label="Blockchain secured and immutable" placement="top">
            <Badge
              colorScheme={mock_data || fallback_data ? 'yellow' : 'blue'}
              variant="solid"
              px={2}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              <HStack spacing={1}>
                <Icon as={MdVerified} boxSize={3} />
                <Text>{mock_data ? 'Demo' : 'Secured'}</Text>
              </HStack>
            </Badge>
          </Tooltip>
        )}
      </HStack>
    );
  }

  // Full version with enhanced trust indicators
  return (
    <Box
      bg={bgColor}
      p={padding}
      borderRadius="lg"
      border="2px solid"
      borderColor={status === 'fully_verified' ? 'green.300' : borderColor}
      boxShadow="md"
      position="relative"
    >
      <VStack spacing={4} align="stretch">
        {/* Header with trust level indicator */}
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <Icon
              as={status === 'fully_verified' ? MdSecurity : MdVerified}
              color={status === 'fully_verified' ? uspGreen : iconColor}
              boxSize={6}
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="md" fontWeight="bold" color={textColor}>
                {status === 'fully_verified'
                  ? 'Fully Verified'
                  : status === 'partially_verified'
                  ? 'Verified'
                  : status === 'demo_mode'
                  ? 'Demo Mode'
                  : 'Verification Pending'}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Data integrity guaranteed
              </Text>
            </VStack>
          </HStack>

          {/* Trust level badge */}
          <Badge
            colorScheme={
              status === 'fully_verified'
                ? 'green'
                : status === 'partially_verified'
                ? 'blue'
                : status === 'demo_mode'
                ? 'yellow'
                : 'gray'
            }
            variant="solid"
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
          >
            {status === 'fully_verified'
              ? 'CERTIFIED'
              : status === 'partially_verified'
              ? 'VERIFIED'
              : status === 'demo_mode'
              ? 'DEMO'
              : 'PENDING'}
          </Badge>
        </HStack>

        <Divider />

        {/* Verification details grid */}
        <VStack spacing={3} align="stretch">
          {/* USDA Verification */}
          {usda_verified && (
            <Box p={3} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
              <HStack justify="space-between" mb={2}>
                <HStack spacing={2}>
                  <Icon as={FaCertificate} color={uspGreen} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium" color={uspGreen}>
                    USDA Standards Compliance
                  </Text>
                </HStack>
                <Badge colorScheme="green" variant="solid" fontSize="xs">
                  {usda_compliance_percentage || 100}%
                </Badge>
              </HStack>

              {usda_compliance_percentage && (
                <Progress
                  value={usda_compliance_percentage}
                  colorScheme="green"
                  size="sm"
                  borderRadius="full"
                  mb={2}
                />
              )}

              <Text fontSize="xs" color="green.700">
                Carbon calculations verified against USDA emission factors
              </Text>
            </Box>
          )}

          {/* Blockchain Verification */}
          {verified && (
            <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
              <HStack justify="space-between" mb={2}>
                <HStack spacing={2}>
                  <Icon as={getNetworkIcon()} color={blockchainBlue} boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium" color={blockchainBlue}>
                    Blockchain Security
                  </Text>
                </HStack>
                <Badge
                  colorScheme={mock_data || fallback_data ? 'yellow' : 'blue'}
                  variant="solid"
                  fontSize="xs"
                >
                  {getNetworkName()}
                </Badge>
              </HStack>

              <Text fontSize="xs" color="blue.700" mb={2}>
                {mock_data
                  ? 'Demo mode - In production, data would be cryptographically secured'
                  : fallback_data
                  ? 'Temporary verification - Full blockchain integration restoring'
                  : 'Data cryptographically secured and immutable'}
              </Text>

              {/* Verification date */}
              {verification_date && !mock_data && (
                <Text fontSize="xs" color="blue.600">
                  Secured: {new Date(verification_date).toLocaleDateString()}
                </Text>
              )}
            </Box>
          )}

          {/* Carbon Credits Eligibility */}
          {eligible_for_credits && (
            <Box p={2} bg="yellow.50" borderRadius="md" border="1px solid" borderColor="yellow.200">
              <HStack spacing={2}>
                <Icon as={FaCheck} color="yellow.600" boxSize={3} />
                <Text fontSize="xs" color="yellow.700" fontWeight="medium">
                  Eligible for carbon credit marketplace
                </Text>
              </HStack>
            </Box>
          )}
        </VStack>

        {/* Action buttons */}
        {transaction_hash && verification_url && !mock_data && (
          <HStack spacing={2} pt={2}>
            <Button
              as={Link}
              href={verification_url}
              isExternal
              size="xs"
              colorScheme="blue"
              variant="outline"
              leftIcon={<MdOpenInNew />}
              flex={1}
            >
              View on Explorer
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  );
};

export default BlockchainVerificationBadge;
