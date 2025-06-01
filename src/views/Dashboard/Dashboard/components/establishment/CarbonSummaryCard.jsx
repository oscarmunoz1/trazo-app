import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
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
  Progress,
  HStack,
  VStack,
  Icon,
  SimpleGrid,
  Divider
} from '@chakra-ui/react';
import { FaLeaf, FaChartLine } from 'react-icons/fa';
import { MdEco } from 'react-icons/md';
import { useGetCarbonFootprintSummaryQuery } from 'store/api/companyApi';
import { useNavigate } from 'react-router-dom';

const CarbonSummaryCard = ({ establishmentId }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const navigate = useNavigate();
  const year = new Date().getFullYear();
  const { data, isLoading, isError } = useGetCarbonFootprintSummaryQuery({ establishmentId, year });

  // Calculate offset percentage
  let offsetPercentage = 0;
  if (data) {
    const totalEmissions = data.total_emissions || 0;
    const totalOffsets = data.total_offsets || 0;

    if (totalEmissions > 0) {
      offsetPercentage = Math.min(100, Math.max(0, (totalOffsets / totalEmissions) * 100));
    } else if (totalOffsets > 0) {
      offsetPercentage = 100;
    }
  }

  if (isLoading) {
    return (
      <Card bg={bgColor} p={6}>
        <VStack spacing={4}>
          <Spinner size="lg" color="green.500" />
          <Text color="gray.500">Cargando datos de huella de carbono...</Text>
        </VStack>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card bg={bgColor} p={6}>
        <VStack spacing={4}>
          <Icon as={MdEco} color="red.500" boxSize={8} />
          <Text color="red.500" textAlign="center">
            No se pudo cargar la huella de carbono
          </Text>
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </VStack>
      </Card>
    );
  }

  return (
    <Card bg={bgColor} p={6}>
      <CardHeader pb={2}>
        <Flex align="center" gap={2}>
          <FaLeaf color="#38A169" />
          <Heading size="md" color="green.700">
            Huella Neta
          </Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        {/* Metrics Grid */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
          <Box textAlign="center">
            <Stat>
              <StatLabel>Emisiones Totales</StatLabel>
              <StatNumber>{(data?.total_emissions || 0).toFixed(2)} kg CO₂e</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" /> Emisiones del período
              </StatHelpText>
            </Stat>
          </Box>
          <Box textAlign="center">
            <Stat>
              <StatLabel>Compensaciones</StatLabel>
              <StatNumber>{(data?.total_offsets || 0).toFixed(2)} kg CO₂e</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" /> Compensaciones del período
              </StatHelpText>
            </Stat>
          </Box>
          <Box textAlign="center">
            <Stat>
              <StatLabel>Huella Neta</StatLabel>
              <StatNumber>{(data?.net_carbon || 0).toFixed(2)} kg CO₂e</StatNumber>
              <StatHelpText>
                <StatArrow type={(data?.net_carbon || 0) >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(data?.net_carbon || 0).toFixed(2)} kg CO₂e
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Divider */}
        <Divider my={4} />

        {/* Progress Section */}
        <Box mb={4}>
          <Heading size="sm" mb={2} color="green.700">
            Progreso de Compensación
          </Heading>
          <Progress
            value={offsetPercentage}
            colorScheme={
              offsetPercentage >= 100 ? 'green' : offsetPercentage >= 50 ? 'blue' : 'yellow'
            }
            size="lg"
            borderRadius="md"
            mb={2}
            height="20px"
          />
          <Text textAlign="center" fontSize="sm" color="gray.600">
            {offsetPercentage.toFixed(1)}% de las emisiones compensadas
            {offsetPercentage >= 100 && ' - ¡Carbono Neutral!'}
          </Text>
        </Box>

        {/* View Details Button */}
        <Flex justify="center">
          <Button
            colorScheme="green"
            size="sm"
            onClick={() => navigate(`/admin/dashboard/establishment/${establishmentId}/carbon`)}
            leftIcon={<Icon as={FaChartLine} />}>
            Ver Detalles
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default CarbonSummaryCard;
