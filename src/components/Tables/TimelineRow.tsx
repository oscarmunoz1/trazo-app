import React, { useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  HStack,
  VStack,
  Badge,
  Circle,
  Tooltip,
  Avatar,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  FaEllipsisH,
  FaWater,
  FaLeaf,
  FaTractor,
  FaFlask,
  FaSeedling,
  FaInfoCircle,
  FaDollarSign,
  FaChartLine,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaSun,
  FaRegCheckCircle,
  FaRegDotCircle,
  FaTint,
  FaEyeSlash,
  FaMinus
} from 'react-icons/fa';
import { MdEco } from 'react-icons/md';

// Real interfaces matching API data
interface Member {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  image?: string;
}

interface Event {
  id: number;
  type: string;
  event_type: number;
  description: string;
  date: string;
  observation?: string;
  created_by: number;
  image?: string;
  carbon_data?: CarbonCalculationResult;
}

interface TimelineRowProps {
  logo: any;
  title: string;
  date: string;
  color: string;
  isLast?: boolean;
  url: string;
  type?: string;
  event: Event;
  members: Member[];
  onEventClick?: (event: Event) => void;
}

// Real carbon calculation result from API
interface CarbonCalculationResult {
  co2e: number;
  efficiency_score: number;
  usda_factors_based?: boolean;
  verification_status?: string;
  data_source?: string;
  calculation_method: string;
  event_type: string;
  timestamp: string;
  cost_analysis?: {
    estimated_cost: number;
    cost_per_co2e: number;
  };
  error?: string;
  // Keep old field for backward compatibility during transition
  usda_verified?: boolean;
}

// Get event configuration for UI display
const getEventConfig = (type: string, description: string) => {
  const desc = description.toLowerCase();

  if (desc.includes('riego') || desc.includes('irrigation') || type.includes('irrigation')) {
    return {
      icon: FaTint,
      color: 'blue.500',
      category: 'Water Management'
    };
  }

  if (type.includes('chemical') || desc.includes('fertilizer') || desc.includes('pesticide')) {
    return {
      icon: FaFlask,
      color: 'orange.500',
      category: 'Chemical Application'
    };
  }

  if (desc.includes('harvest') || desc.includes('cosecha') || desc.includes('production')) {
    return {
      icon: FaSeedling,
      color: 'green.500',
      category: 'Production'
    };
  }

  if (desc.includes('weather') || desc.includes('climate') || desc.includes('temperature')) {
    return {
      icon: FaSun,
      color: 'purple.500',
      category: 'Weather Event'
    };
  }

  // Default configuration
  return {
    icon: FaLeaf,
    color: 'green.500',
    category: 'Farm Activity'
  };
};

// Extract real data from event observation field
const extractEventData = (event: Event) => {
  const observation = event.observation || '';

  // Extract duration (hours)
  const durationMatch = observation.match(/(\d+)\s*hour/i);
  const duration = durationMatch ? parseInt(durationMatch[1]) : null;

  // Extract amounts (kg, lbs, liters)
  const amountMatch = observation.match(/(\d+)\s*(kg|lbs?|liters?|l)/i);
  const amount = amountMatch ? parseInt(amountMatch[1]) : null;
  const unit = amountMatch ? amountMatch[2] : null;

  return {
    duration,
    amount,
    unit,
    hasQuantifiableData: duration !== null || amount !== null
  };
};

// Get operator name from members array
const getOperatorName = (event: Event, members: Member[]) => {
  const operator = members.find((member) => member.id === event.created_by);
  return operator ? operator.full_name : 'Unknown Operator';
};

// Determine QR visibility based on event type (consumer relevance)
const getQRVisibility = (event: Event): 'high' | 'medium' | 'low' => {
  const desc = event.description.toLowerCase();
  const type = event.type.toLowerCase();

  // High visibility for consumer-relevant activities
  if (type.includes('chemical') || desc.includes('pesticide') || desc.includes('fertilizer')) {
    return 'high'; // Consumers care about chemical use
  }

  if (desc.includes('harvest') || desc.includes('cosecha') || desc.includes('organic')) {
    return 'high'; // Harvest and organic practices
  }

  if (desc.includes('irrigation') || desc.includes('riego')) {
    return 'medium'; // Water management
  }

  return 'low'; // Other activities
};

function TimelineRow(props: TimelineRowProps) {
  const { logo, title, date, color, isLast, url, type, event, members, onEventClick } = props;
  const menuButtonRef = useRef();
  const textColor = useColorModeValue('gray.700', 'white.300');
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const navigate = useNavigate();

  // Mobile responsiveness
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Use embedded carbon data instead of API calls
  const carbonData = event.carbon_data || null;
  const dataLoaded = !!event.carbon_data;

  // Get event configuration
  const eventConfig = getEventConfig(event.type, event.description);

  // Extract real data from event
  const eventData = extractEventData(event);
  const operatorName = getOperatorName(event, members);
  const qrVisibility = getQRVisibility(event);

  return (
    <Flex alignItems="center" minH="78px" justifyContent="start" mb="5px">
      <Flex direction="column" h="100%" mb="auto">
        <Icon
          as={eventConfig.icon}
          bg={useColorModeValue('white.300', 'gray.700')}
          color={eventConfig.color}
          h={'30px'}
          w={'26px'}
          pe="6px"
          zIndex="1"
          position="relative"
          right={''}
          left={'-8px'}
        />
        {!isLast && <Box w="2px" bg="gray.200" h={'100%'} minH={'48px'}></Box>}
      </Flex>

      <Flex direction="column" justifyContent="flex-start" h="100%" w="100%">
        <Flex
          textAlign={'start'}
          p="10px"
          w="100%"
          borderRadius="10px"
          _focus={{
            boxShadow: 'none'
          }}
          _hover={{
            bg: hoverBg
          }}
          cursor="pointer"
          onClick={() => (onEventClick ? onEventClick(event) : navigate(url))}
          transition="all 0.2s"
        >
          <VStack align="start" w="100%" spacing={2}>
            {/* Main Event Info */}
            <HStack justify="space-between" align="start" mb={2} w="100%">
              <VStack align="start" spacing={1} flex={1}>
                <HStack spacing={2}>
                  <Text fontSize="sm" color={textColor} fontWeight="bold">
                    {title}
                  </Text>
                  <Badge
                    colorScheme={eventConfig.color.split('.')[0]}
                    variant="subtle"
                    fontSize="xs"
                    px={2}
                    py={1}
                  >
                    {eventConfig.category}
                  </Badge>
                </HStack>

                <Text fontSize="xs" color="gray.500">
                  {event.observation || 'No additional details'}
                </Text>

                <Text fontSize="xs" color="gray.400">
                  Operator: {operatorName}
                </Text>
              </VStack>

              <Text fontSize="xs" color="gray.400" textAlign="right">
                {date}
              </Text>
            </HStack>

            {/* Real Data Metrics Row */}
            <HStack spacing={4} w="100%" justify="start">
              {/* Real Carbon Impact from API */}
              {carbonData && !carbonData.error ? (
                <Tooltip
                  label={`Carbon Impact: ${carbonData.co2e > 0 ? '+' : ''}${
                    carbonData.co2e
                  } kg CO₂e${
                    carbonData.verification_status === 'usda_certified'
                      ? ' (USDA Certified)'
                      : carbonData.usda_factors_based ||
                        carbonData.verification_status === 'factors_verified'
                      ? ' (USDA Factors)'
                      : ''
                  }`}
                >
                  <HStack spacing={1}>
                    <Badge
                      colorScheme={carbonData.co2e < 0 ? 'green' : 'orange'}
                      variant="subtle"
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      {carbonData.co2e > 0 ? '+' : ''}
                      {carbonData.co2e} kg CO₂
                    </Badge>
                    {(carbonData.verification_status === 'usda_certified' ||
                      carbonData.usda_factors_based ||
                      carbonData.verification_status === 'factors_verified') && (
                      <Badge
                        colorScheme={
                          carbonData.verification_status === 'usda_certified' ? 'green' : 'blue'
                        }
                        variant="solid"
                        fontSize="xs"
                      >
                        {carbonData.verification_status === 'usda_certified'
                          ? 'USDA'
                          : 'USDA Factors'}
                      </Badge>
                    )}
                  </HStack>
                </Tooltip>
              ) : (
                <Tooltip label="Carbon impact data unavailable">
                  <Badge variant="outline" fontSize="xs" colorScheme="gray">
                    No CO₂ data
                  </Badge>
                </Tooltip>
              )}

              {/* Real Cost from API */}
              {carbonData?.cost_analysis?.estimated_cost ? (
                <Tooltip label={`Estimated Cost: $${carbonData.cost_analysis.estimated_cost}`}>
                  <HStack spacing={1}>
                    <Text fontSize="xs" color="gray.600">
                      ${carbonData.cost_analysis.estimated_cost}
                    </Text>
                  </HStack>
                </Tooltip>
              ) : eventData.hasQuantifiableData ? (
                <Tooltip label="Cost data not available for this event type">
                  <Text fontSize="xs" color="gray.400">
                    Cost: N/A
                  </Text>
                </Tooltip>
              ) : null}

              {/* QR Visibility (based on consumer relevance) */}
              <Tooltip
                label={`QR Code Visibility: ${qrVisibility} - How relevant this is to consumers`}
              >
                <HStack spacing={1}>
                  <Icon
                    as={
                      qrVisibility === 'high'
                        ? FaEye
                        : qrVisibility === 'medium'
                        ? FaMinus
                        : FaEyeSlash
                    }
                    color={
                      qrVisibility === 'high'
                        ? 'green.500'
                        : qrVisibility === 'medium'
                        ? 'yellow.500'
                        : 'gray.400'
                    }
                    boxSize="12px"
                  />
                  <Text fontSize="xs" color="gray.600" textTransform="capitalize">
                    {qrVisibility}
                  </Text>
                </HStack>
              </Tooltip>

              {/* Real Efficiency Score from API */}
              {carbonData?.efficiency_score && carbonData.efficiency_score > 0 ? (
                <Tooltip label={`Efficiency Score: ${carbonData.efficiency_score}/100`}>
                  <Badge
                    colorScheme={
                      carbonData.efficiency_score >= 70
                        ? 'green'
                        : carbonData.efficiency_score >= 50
                        ? 'yellow'
                        : 'red'
                    }
                    variant="subtle"
                    fontSize="xs"
                  >
                    {carbonData.efficiency_score}/100
                  </Badge>
                </Tooltip>
              ) : null}
            </HStack>

            {/* Data Source Indicator - Updated */}
            {carbonData && (
              <Text fontSize="xs" color="gray.400">
                {carbonData.verification_status === 'usda_certified'
                  ? '✓ USDA Certified Data'
                  : carbonData.verification_status === 'factors_verified' ||
                    carbonData.usda_factors_based
                  ? '📊 USDA Factors Used'
                  : carbonData.error
                  ? '⚠ Data Unavailable'
                  : '📈 Calculated Estimate'}
              </Text>
            )}
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default TimelineRow;
