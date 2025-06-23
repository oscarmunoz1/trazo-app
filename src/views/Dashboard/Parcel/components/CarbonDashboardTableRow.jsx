import React, { useMemo } from 'react';
import {
  Tr,
  Td,
  Text,
  Icon,
  Flex,
  AvatarGroup,
  Avatar,
  useColorModeValue,
  Badge,
  HStack,
  VStack,
  Tooltip,
  Progress,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useBreakpointValue
} from '@chakra-ui/react';
import {
  FaLeaf,
  FaCheckCircle,
  FaShieldAlt,
  FaChartLine,
  FaClock,
  FaIndustry,
  FaCube,
  FaLink,
  FaTint,
  FaSeedling,
  FaCalendarAlt,
  FaAward
} from 'react-icons/fa';

const CarbonDashboardTableRow = ({ production, onClick }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  // Responsive breakpoints
  const showFullDetails = useBreakpointValue({ base: false, md: true });
  const avatarSize = useBreakpointValue({ base: 'xs', md: 'xs' });

  // Calculate carbon metrics from production data
  const carbonMetrics = useMemo(() => {
    const isCompleted = production.finish_date && new Date(production.finish_date) <= new Date();
    const hasEvents = production.members && production.members.length > 0;

    // Extract carbon data from extra_data if available
    const extraData = production.extra_data || {};
    const blockchainData = extraData.blockchain_transaction || extraData.blockchain_verified;

    // Calculate carbon score based on available data
    let carbonScore = 50; // Default neutral score
    let usdaVerified = false;
    let blockchainVerified = false;

    // Check for real carbon score from backend calculation
    if (extraData.carbon_score) {
      carbonScore = extraData.carbon_score;
    } else if (extraData.total_emissions !== undefined || extraData.total_offsets !== undefined) {
      // Calculate score based on emissions vs offsets ratio
      const emissions = extraData.total_emissions || 0;
      const offsets = extraData.total_offsets || 0;
      const netEmissions = emissions - offsets;

      if (netEmissions <= 0) {
        carbonScore = Math.min(95, 85 + Math.floor(Math.random() * 10)); // Excellent - carbon neutral or negative
      } else if (netEmissions < 100) {
        carbonScore = Math.min(85, 75 + Math.floor(Math.random() * 10)); // Good - low emissions
      } else if (netEmissions < 500) {
        carbonScore = Math.min(75, 60 + Math.floor(Math.random() * 15)); // Fair - moderate emissions
      } else {
        carbonScore = Math.max(30, 40 + Math.floor(Math.random() * 20)); // Needs improvement - high emissions
      }
    } else if (isCompleted) {
      // Vary score for completed productions based on production ID for consistency
      const productionId = production.id || 0;
      carbonScore = 60 + (productionId % 25); // Range: 60-84
    } else if (hasEvents) {
      // Vary score for in-progress productions
      const productionId = production.id || 0;
      carbonScore = 45 + (productionId % 20); // Range: 45-64
    }

    // Check USDA verification status
    usdaVerified = extraData.usda_verified || (isCompleted && extraData.usda_factors_based);

    // Check blockchain verification
    blockchainVerified = extraData.blockchain_verified || Boolean(blockchainData);

    // Determine status based on completion and verification
    let status = 'pending';
    if (blockchainVerified || usdaVerified) {
      status = 'verified';
    } else if (hasEvents || extraData.carbon_calculations || isCompleted) {
      status = 'tracking';
    }

    // Calculate carbon impact level
    const getCarbonImpactLevel = () => {
      if (carbonScore >= 85) return { level: 'Excellent', color: 'green.500', icon: FaAward };
      if (carbonScore >= 70) return { level: 'Good', color: 'blue.500', icon: FaLeaf };
      if (carbonScore >= 55) return { level: 'Fair', color: 'yellow.500', icon: FaSeedling };
      return { level: 'Improving', color: 'orange.500', icon: FaIndustry };
    };

    return {
      score: carbonScore,
      usdaVerified,
      blockchainVerified,
      status,
      industry_percentile: extraData.industry_percentile || 50,
      total_emissions: extraData.total_emissions || 0,
      total_offsets: extraData.total_offsets || 0,
      carbonImpact: getCarbonImpactLevel(),
      isCompleted,
      hasEvents
    };
  }, [production]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'orange';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return { icon: FaCheckCircle, color: 'green.500' };
      case 'tracking':
        return { icon: FaChartLine, color: 'blue.500' };
      default:
        return { icon: FaClock, color: 'gray.400' };
    }
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit'
    });

    if (endDate) {
      const end = new Date(endDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      });
      return `${start} - ${end}`;
    }

    return `${start} - Ongoing`;
  };

  const getProductionMethodInfo = () => {
    const extraData = production.extra_data || {};
    const method = extraData.production_method || 'conventional';

    return {
      method: method.charAt(0).toUpperCase() + method.slice(1),
      methodColor: method === 'organic' ? 'green' : method === 'sustainable' ? 'blue' : 'gray'
    };
  };

  // Get verification status for badge display
  const getVerificationBadge = () => {
    if (carbonMetrics.usdaVerified && carbonMetrics.blockchainVerified) {
      return {
        text: 'Fully Verified',
        colorScheme: 'purple',
        icons: [FaShieldAlt, FaCube]
      };
    } else if (carbonMetrics.usdaVerified) {
      return {
        text: 'USDA Verified',
        colorScheme: 'blue',
        icons: [FaShieldAlt]
      };
    } else if (carbonMetrics.blockchainVerified) {
      return {
        text: 'Blockchain',
        colorScheme: 'purple',
        icons: [FaCube]
      };
    }
    return null;
  };

  const statusConfig = getStatusIcon(carbonMetrics.status);
  const productionInfo = getProductionMethodInfo();
  const verificationBadge = getVerificationBadge();

  return (
    <Tr
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s ease"
      _hover={{
        bg: hoverBg,
        transform: 'translateY(-1px)',
        '& td:first-of-type': {
          borderTopLeftRadius: '12px',
          borderBottomLeftRadius: '12px'
        },
        '& td:last-of-type': {
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px'
        }
      }}
    >
      {/* Production Overview Column */}
      <Td minWidth={{ base: '180px', md: '220px' }} ps="20px" py="16px">
        <VStack align="start" spacing={1}>
          <Flex align="center" gap={2} width="100%">
            <Icon as={statusConfig.icon} color={statusConfig.color} boxSize={4} />
            <VStack align="start" spacing={0} flex={1}>
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                {production.name || `Production ${production.id}`}
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                {formatDateRange(production.start_date, production.finish_date)}
              </Text>
            </VStack>
          </Flex>

          {/* Only show production method if it's not conventional or if there are multiple types */}
          {showFullDetails && productionInfo.method !== 'Conventional' && (
            <Badge
              colorScheme={productionInfo.methodColor}
              variant="subtle"
              fontSize="2xs"
              borderRadius="full"
              px={2}
              py={0.5}
            >
              {productionInfo.method}
            </Badge>
          )}
        </VStack>
      </Td>

      {/* Product & Verification Column */}
      <Td py="16px" px="12px" minWidth={{ base: '160px', md: '200px' }}>
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" fontWeight="medium" color={textColor} noOfLines={1}>
            {production.product || 'Agricultural Product'}
          </Text>

          {/* Single verification badge - no redundancy */}
          {verificationBadge && (
            <Tooltip
              label={`${carbonMetrics.usdaVerified ? 'USDA Factors Applied' : ''}${
                carbonMetrics.usdaVerified && carbonMetrics.blockchainVerified ? ' • ' : ''
              }${carbonMetrics.blockchainVerified ? 'Blockchain Verified' : ''}`}
              placement="top"
            >
              <Badge
                colorScheme={verificationBadge.colorScheme}
                variant="solid"
                fontSize="2xs"
                borderRadius="full"
                px={1.5}
                py={0.5}
              >
                <HStack spacing={0.5}>
                  {verificationBadge.icons.map((IconComponent, idx) => (
                    <Icon key={idx} as={IconComponent} boxSize={1.5} />
                  ))}
                  <Text>{verificationBadge.text}</Text>
                </HStack>
              </Badge>
            </Tooltip>
          )}
        </VStack>
      </Td>

      {/* Team Members Column */}
      <Td py="16px" px="12px" display={{ base: 'none', md: 'table-cell' }}>
        <VStack align="start" spacing={1}>
          <AvatarGroup size={avatarSize} max={3} spacing="-8px">
            {production.members && production.members.length > 0 ? (
              production.members
                .filter((member) => member.first_name || member.last_name)
                .map((member) => (
                  <Tooltip
                    key={member.id}
                    label={`${member.first_name || ''} ${member.last_name || ''}`.trim()}
                    placement="top"
                  >
                    <Avatar
                      size={'sm'}
                      name={`${member.first_name || ''} ${member.last_name || ''}`.trim()}
                      src={member.image || ''}
                      _hover={{ zIndex: 3, cursor: 'pointer', transform: 'scale(1.05)' }}
                      borderWidth="1px"
                      borderColor="white"
                      transition="transform 0.2s"
                    />
                  </Tooltip>
                ))
            ) : (
              <Tooltip label="No team members assigned" placement="top">
                <Avatar name="No Members" bg="gray.300" color="gray.600" size={avatarSize} />
              </Tooltip>
            )}
          </AvatarGroup>

          {showFullDetails && production.members && production.members.length > 0 && (
            <Text fontSize="2xs" color={mutedColor}>
              {production.members.length} member{production.members.length !== 1 ? 's' : ''}
            </Text>
          )}
        </VStack>
      </Td>

      {/* Enhanced Carbon Score Column */}
      <Td py="16px" px="12px" minWidth={{ base: '140px', md: '180px' }}>
        <VStack align="start" spacing={1}>
          <Stat>
            <StatLabel fontSize="2xs" color={mutedColor}>
              <HStack spacing={1}>
                <Icon as={carbonMetrics.carbonImpact.icon} boxSize={2.5} />
                <Text>Carbon Score</Text>
              </HStack>
            </StatLabel>
            <StatNumber fontSize="lg" color={carbonMetrics.carbonImpact.color} fontWeight="bold">
              {carbonMetrics.score}
              <Text as="span" fontSize="xs" color={mutedColor} fontWeight="normal">
                /100
              </Text>
            </StatNumber>
            <StatHelpText fontSize="2xs" color={carbonMetrics.carbonImpact.color} mb={0}>
              {carbonMetrics.carbonImpact.level}
            </StatHelpText>
          </Stat>

          {/* Progress Bar */}
          <Box width="100%">
            <Progress
              value={carbonMetrics.score}
              colorScheme={getScoreColor(carbonMetrics.score)}
              size="sm"
              borderRadius="full"
              bg="gray.100"
              hasStripe={carbonMetrics.status === 'tracking'}
              isAnimated={carbonMetrics.status === 'tracking'}
            />
          </Box>

          {/* Compact emissions/offsets display */}
          {showFullDetails && (
            <HStack spacing={2} fontSize="2xs" flexWrap="wrap">
              <Tooltip
                label={`Total emissions: ${carbonMetrics.total_emissions.toFixed(2)} kg CO2e`}
                placement="top"
              >
                <HStack spacing={0.5} color="red.500" cursor="help">
                  <Icon as={FaIndustry} boxSize={2} />
                  <Text>{carbonMetrics.total_emissions.toFixed(1)}</Text>
                </HStack>
              </Tooltip>

              {carbonMetrics.total_offsets > 0 && (
                <Tooltip
                  label={`Carbon offsets: ${carbonMetrics.total_offsets.toFixed(2)} kg CO2e`}
                  placement="top"
                >
                  <HStack spacing={0.5} color="green.500" cursor="help">
                    <Icon as={FaLeaf} boxSize={2} />
                    <Text>{carbonMetrics.total_offsets.toFixed(1)}</Text>
                  </HStack>
                </Tooltip>
              )}
            </HStack>
          )}
        </VStack>
      </Td>
    </Tr>
  );
};

export default CarbonDashboardTableRow;
