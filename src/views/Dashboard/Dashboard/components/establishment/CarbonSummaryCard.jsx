import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Badge,
  Button,
  useColorModeValue,
  Spinner,
  Progress
} from '@chakra-ui/react';
import { useGetCarbonFootprintSummaryQuery } from 'store/api/companyApi';
import { useNavigate } from 'react-router-dom';

const CarbonSummaryCard = ({ establishmentId }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const { data, isLoading, isError } = useGetCarbonFootprintSummaryQuery({ establishmentId, year });

  // Determine status
  let status = 'On Track';
  let statusColor = 'green';
  if (data && data.net_carbon > 0) {
    status = 'Needs Attention';
    statusColor = 'yellow';
  }
  if (data && data.net_carbon > (data.industry_average || 0)) {
    status = 'Above Industry';
    statusColor = 'red';
  }

  // Calculate progress towards carbon neutrality (0% if net carbon > 0, up to 100% if net carbon <= 0)
  const progress = data
    ? Math.max(0, Math.min(100, 100 - (data.net_carbon / (data.industry_average || 1)) * 100))
    : 0;

  return (
    <Card
      bg={cardBg}
      w="100%"
      minH={{ base: '80px', md: '120px' }}
      maxH={{ base: '160px', md: '140px' }}
      boxShadow="md"
      borderRadius="lg"
      px={{ base: 3, md: 6 }}
      py={{ base: 2, md: 3 }}
      display="flex"
      alignItems="center"
      justifyContent="center">
      <CardBody w="100%" p={0}>
        {isLoading ? (
          <Flex align="center" justify="center" w="100%" h="100%">
            <Spinner size="lg" />
          </Flex>
        ) : isError ? (
          <Text color="red.500">No se pudo cargar la huella de carbono.</Text>
        ) : (
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align="center"
            justify="space-between"
            w="100%"
            h="100%"
            gap={{ base: 2, md: 6 }}>
            {/* Title, Status, and Carbon Score */}
            <Flex align="center" gap={3} minW="180px">
              <Heading size="sm" fontWeight="bold" mr={2}>
                Huella de Carbono
              </Heading>
              <Badge colorScheme={statusColor} fontSize="sm" px={2} py={1} borderRadius="md">
                {status}
              </Badge>
              <Badge colorScheme="blue" fontSize="sm" px={2} py={1} borderRadius="md">
                Score: {data?.carbon_score || 'N/A'}
              </Badge>
            </Flex>
            {/* Main Metric and Progress */}
            <Flex align="center" gap={2} minW="180px" direction="column">
              <Stat mb={0} minW="120px">
                <StatLabel fontSize="sm">Huella Neta</StatLabel>
                <StatNumber fontSize="xl">{data?.net_carbon?.toFixed(2) || 0} kg CO₂e</StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow
                    type={(data?.year_over_year_change || 0) >= 0 ? 'increase' : 'decrease'}
                  />
                  {Math.abs(data?.year_over_year_change || 0).toFixed(1)}% vs año anterior
                </StatHelpText>
              </Stat>
              <Progress value={progress} size="xs" width="100%" colorScheme="green" />
              <Text fontSize="xs" color="gray.500">
                Progreso hacia neutralidad
              </Text>
            </Flex>
            {/* Emissions/Offsets */}
            <Flex align="center" gap={4} minW="200px">
              <Box textAlign="center">
                <Text fontSize="xs" color="gray.500">
                  Emisiones
                </Text>
                <Text fontWeight="bold" fontSize="md">
                  {data?.total_emissions?.toFixed(2) || 0} kg
                </Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="xs" color="gray.500">
                  Compensaciones
                </Text>
                <Text fontWeight="bold" fontSize="md">
                  {data?.total_offsets?.toFixed(2) || 0} kg
                </Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="xs" color="gray.500">
                  Prom. industria
                </Text>
                <Text fontWeight="bold" fontSize="md">
                  {data?.industry_average?.toFixed(2) || 'N/A'} kg
                </Text>
              </Box>
            </Flex>
            {/* Details Button */}
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => navigate(`/dashboard/establishment/${establishmentId}/carbon`)}
              minW="110px"
              mt={{ base: 2, md: 0 }}>
              Ver detalles
            </Button>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default CarbonSummaryCard;
