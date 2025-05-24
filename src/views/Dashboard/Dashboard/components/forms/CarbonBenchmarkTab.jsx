import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Progress,
  useColorModeValue,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid
} from '@chakra-ui/react';
import { useGetCarbonBenchmarksQuery } from 'store/api/companyApi';

const CarbonBenchmarkTab = ({ establishmentId, industry }) => {
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Queries
  const { data: benchmarks = [], isLoading: loadingBenchmarks } = useGetCarbonBenchmarksQuery({
    industry,
    year: selectedYear
  });

  // Loading state
  if (loadingBenchmarks) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Calculate statistics
  const currentBenchmark = benchmarks.find((b) => b.year === selectedYear);
  const previousBenchmark = benchmarks.find((b) => b.year === selectedYear - 1);

  const yearOverYearChange = previousBenchmark
    ? ((currentBenchmark?.average_emissions - previousBenchmark.average_emissions) /
        previousBenchmark.average_emissions) *
      100
    : 0;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Comparativa de Industria</Heading>
        <Select
          w="200px"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Flex>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Promedio de Industria</StatLabel>
              <StatNumber>{currentBenchmark?.average_emissions.toFixed(2) || 0} kg CO₂e</StatNumber>
              <StatHelpText>
                <StatArrow type={yearOverYearChange >= 0 ? 'increase' : 'decrease'} />
                {Math.abs(yearOverYearChange).toFixed(1)}% vs año anterior
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Mínimo de Industria</StatLabel>
              <StatNumber>{currentBenchmark?.min_emissions.toFixed(2) || 0} kg CO₂e</StatNumber>
              <StatHelpText>Mejor desempeño en la industria</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg}>
          <CardBody>
            <Stat>
              <StatLabel>Máximo de Industria</StatLabel>
              <StatNumber>{currentBenchmark?.max_emissions.toFixed(2) || 0} kg CO₂e</StatNumber>
              <StatHelpText>Peor desempeño en la industria</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Benchmarking Table */}
      <Card bg={cardBg}>
        <CardHeader>
          <Heading size="sm">Histórico de Emisiones por Industria</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Año</Th>
                <Th>Promedio</Th>
                <Th>Mínimo</Th>
                <Th>Máximo</Th>
                <Th>Número de Empresas</Th>
              </Tr>
            </Thead>
            <Tbody>
              {benchmarks.map((benchmark) => (
                <Tr key={benchmark.year}>
                  <Td>{benchmark.year}</Td>
                  <Td>{benchmark.average_emissions.toFixed(2)} kg CO₂e</Td>
                  <Td>{benchmark.min_emissions.toFixed(2)} kg CO₂e</Td>
                  <Td>{benchmark.max_emissions.toFixed(2)} kg CO₂e</Td>
                  <Td>{benchmark.company_count}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Recommendations */}
      <Card bg={cardBg} mt={6}>
        <CardHeader>
          <Heading size="sm">Recomendaciones</Heading>
        </CardHeader>
        <CardBody>
          <Text mb={4}>
            Basado en el análisis de la industria, aquí hay algunas recomendaciones para mejorar tu
            huella de carbono:
          </Text>
          <Box>
            {currentBenchmark && (
              <>
                <Text mb={2}>
                  • Tu emisión actual está{' '}
                  {currentBenchmark.average_emissions > currentBenchmark.min_emissions
                    ? 'por encima'
                    : 'por debajo'}{' '}
                  del promedio de la industria
                </Text>
                <Text mb={2}>
                  • Las empresas líderes en la industria mantienen emisiones por debajo de{' '}
                  {currentBenchmark.min_emissions.toFixed(2)} kg CO₂e
                </Text>
                <Text>• Considera implementar las siguientes acciones para reducir tu huella:</Text>
                <Box mt={2} pl={4}>
                  <Text>1. Optimizar el uso de energía en procesos productivos</Text>
                  <Text>2. Implementar programas de reciclaje y reutilización</Text>
                  <Text>3. Considerar fuentes de energía renovable</Text>
                  <Text>4. Mejorar la eficiencia en la cadena de suministro</Text>
                </Box>
              </>
            )}
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CarbonBenchmarkTab;
