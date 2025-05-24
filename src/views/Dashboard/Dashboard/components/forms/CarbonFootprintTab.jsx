import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useToast,
  Spinner,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FaLeaf, FaChartLine, FaFileAlt, FaIndustry } from 'react-icons/fa';
import {
  useGetCarbonEmissionSourcesQuery,
  useGetCarbonOffsetActionsQuery,
  useGetEstablishmentCarbonFootprintsQuery,
  useAddEstablishmentCarbonFootprintMutation,
  useUpdateEstablishmentCarbonFootprintMutation,
  useDeleteEstablishmentCarbonFootprintMutation,
  useGetCarbonCertificationsQuery,
  useAddCarbonCertificationMutation,
  useUpdateCarbonCertificationMutation,
  useDeleteCarbonCertificationMutation,
  useGetCarbonEntriesQuery
} from 'store/api/companyApi';
import CarbonReportTab from './CarbonReportTab';
import CarbonBenchmarkTab from './CarbonBenchmarkTab';

const CarbonFootprintTab = ({ establishmentId, productionId }) => {
  const toast = useToast();
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const viewMode = productionId ? 'production' : 'establishment';

  // Queries
  const { data: emissionSources = [], isLoading: loadingSources } =
    useGetCarbonEmissionSourcesQuery();

  const { data: offsetActions = [], isLoading: loadingOffsets } = useGetCarbonOffsetActionsQuery();

  const {
    data: footprintsData = [],
    isLoading: loadingFootprints,
    refetch: refetchFootprints
  } = useGetEstablishmentCarbonFootprintsQuery({
    establishmentId: establishmentId,
    productionId: productionId || undefined,
    year: selectedYear
  });

  // Use RTK Query to fetch carbon entries
  const {
    data: entriesData = [],
    isLoading: loadingEntries,
    refetch: refetchEntries
  } = useGetCarbonEntriesQuery(
    {
      establishmentId: establishmentId,
      year: selectedYear
    },
    {
      skip: !establishmentId
    }
  );

  // Handle both array and object responses
  let footprints = entriesData || []; // Use the entries data directly
  let totalEmissions = 0;
  let totalOffsets = 0;
  let netCarbon = 0;

  if (
    footprintsData &&
    !Array.isArray(footprintsData) &&
    footprintsData.total_emissions !== undefined
  ) {
    // Handle object form of response with snake_case properties
    totalEmissions = footprintsData.total_emissions || 0;
    totalOffsets = footprintsData.total_offsets || 0;
    netCarbon =
      footprintsData.net_carbon !== undefined
        ? footprintsData.net_carbon
        : totalEmissions - totalOffsets;
  } else if (
    footprintsData &&
    !Array.isArray(footprintsData) &&
    footprintsData.totalEmissions !== undefined
  ) {
    // Handle object form of response with camelCase properties
    totalEmissions = footprintsData.totalEmissions || 0;
    totalOffsets = footprintsData.totalOffsets || 0;
    netCarbon =
      footprintsData.netFootprint !== undefined
        ? footprintsData.netFootprint
        : totalEmissions - totalOffsets;
  } else {
    // Calculate from entry data
    if (Array.isArray(footprints)) {
      totalEmissions = footprints
        .filter((f) => f.type === 'emission')
        .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
      totalOffsets = footprints
        .filter((f) => f.type === 'offset')
        .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);
      netCarbon = totalEmissions - totalOffsets;
    }
  }

  // Calculate offset percentage with improved logic
  let offsetPercentage = 0;
  if (totalEmissions > 0) {
    offsetPercentage = Math.min(100, Math.max(0, (totalOffsets / totalEmissions) * 100));
  } else if (totalOffsets > 0) {
    // If there are offsets but no emissions, we're at 100%
    offsetPercentage = 100;
  }

  // Add some debugging to console
  console.log('Carbon Data:', {
    totalEmissions,
    totalOffsets,
    netCarbon,
    offsetPercentage,
    footprintsData
  });

  const {
    data: certifications = [],
    isLoading: loadingCertifications,
    refetch: refetchCertifications
  } = useGetCarbonCertificationsQuery({ establishmentId });

  // Mutations
  const [addFootprint, { isLoading: addingFootprint }] =
    useAddEstablishmentCarbonFootprintMutation();
  const [updateFootprint, { isLoading: updatingFootprint }] =
    useUpdateEstablishmentCarbonFootprintMutation();
  const [deleteFootprint, { isLoading: deletingFootprint }] =
    useDeleteEstablishmentCarbonFootprintMutation();
  const [addCertification, { isLoading: addingCertification }] =
    useAddCarbonCertificationMutation();
  const [updateCertification, { isLoading: updatingCertification }] =
    useUpdateCarbonCertificationMutation();
  const [deleteCertification, { isLoading: deletingCertification }] =
    useDeleteCarbonCertificationMutation();

  // Form
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      emission_source: '',
      offset_action: '',
      amount: 0,
      description: ''
    }
  });

  // Loading state
  if (loadingSources || loadingOffsets || loadingFootprints || loadingCertifications) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Prepare API data
      const apiData = {
        establishment: establishmentId,
        production: productionId,
        year: data.year || new Date().getFullYear(),
        type: data.type,
        source_id: data.type === 'emission' ? data.emission_source : data.offset_action,
        amount: data.amount,
        description: data.description
      };

      // Submit data
      await addFootprint(apiData).unwrap();

      // Show success message
      toast({
        title: 'Éxito',
        description: `Se ha registrado la ${
          data.type === 'emission' ? 'emisión' : 'compensación'
        } correctamente.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      // Reset form
      reset({
        year: new Date().getFullYear(),
        type: 'emission',
        emission_source: '',
        offset_action: '',
        amount: 0,
        description: ''
      });

      // Refresh data
      refetchFootprints();
      refetchEntries(); // Also refresh the entries data

      // Extra step to ensure everything is in sync
      setTimeout(() => {
        refetchFootprints();
        refetchEntries();
      }, 500);
    } catch (error) {
      console.error('Error adding footprint:', error);
      toast({
        title: 'Error',
        description: 'No se pudo registrar el dato. Intente nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Add helper function to find source name
  const getSourceName = (entry) => {
    if (!entry) return 'N/A';

    // Determine source ID from various possible formats
    let sourceId = null;
    if (entry.source_id) {
      sourceId = entry.source_id;
    } else if (entry.source && typeof entry.source === 'number') {
      sourceId = entry.source;
    } else if (entry.source && entry.source.id) {
      sourceId = entry.source.id;
    } else if (entry.emission_source) {
      sourceId = entry.emission_source;
    } else if (entry.offset_action) {
      sourceId = entry.offset_action;
    }

    if (!sourceId) return 'N/A';

    // Find source name based on type
    const sources = entry.type === 'emission' ? emissionSources : offsetActions;
    const source = sources.find((s) => s.id === sourceId);
    return source ? source.name : `ID: ${sourceId}`;
  };

  return (
    <>
      {/* Resumen Card - single, clean summary */}
      <Card bg={cardBg} mb={8} p={{ base: 4, md: 6 }} boxShadow="md" borderRadius="lg">
        <CardHeader pb={2}>
          <Flex align="center" gap={2}>
            <FaLeaf color="#38A169" />
            <Heading size="md">
              Resumen - {viewMode === 'establishment' ? 'Establecimiento' : 'Producción'}
            </Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          {/* Metrics Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={2}>
            <Box textAlign="center">
              <Stat>
                <StatLabel>Emisiones Totales</StatLabel>
                <StatNumber>{totalEmissions.toFixed(2)} kg CO₂e</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" /> Emisiones del período
                </StatHelpText>
              </Stat>
            </Box>
            <Box textAlign="center">
              <Stat>
                <StatLabel>Compensaciones</StatLabel>
                <StatNumber>{totalOffsets.toFixed(2)} kg CO₂e</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" /> Compensaciones del período
                </StatHelpText>
              </Stat>
            </Box>
            <Box textAlign="center">
              <Stat>
                <StatLabel>Huella Neta</StatLabel>
                <StatNumber>{netCarbon.toFixed(2)} kg CO₂e</StatNumber>
                <StatHelpText>
                  <StatArrow type={netCarbon >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(netCarbon).toFixed(2)} kg CO₂e
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
              sx={{
                '& > div': {
                  transitionProperty: 'width',
                  transitionDuration: '0.5s'
                }
              }}
            />
            <Text textAlign="center" fontSize="sm" color="gray.600">
              {offsetPercentage.toFixed(1)}% de las emisiones compensadas
              {offsetPercentage >= 100 && ' - ¡Carbono Neutral!'}
            </Text>
          </Box>

          {/* Carbon Score Section - if available from API */}
          {footprintsData && footprintsData.carbon_score !== undefined && (
            <Box mb={4}>
              <Heading size="sm" mb={2} color="green.700">
                Carbon Score
              </Heading>
              <Flex align="center" justify="center">
                <Box
                  bg={
                    footprintsData.carbon_score >= 80
                      ? 'green.500'
                      : footprintsData.carbon_score >= 50
                      ? 'blue.500'
                      : footprintsData.carbon_score >= 30
                      ? 'yellow.500'
                      : 'red.500'
                  }
                  color="white"
                  borderRadius="full"
                  width="100px"
                  height="100px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="2xl"
                >
                  {footprintsData.carbon_score}/100
                </Box>
              </Flex>
              <Text textAlign="center" fontSize="sm" mt={2} color="gray.600">
                {footprintsData.carbon_score >= 80
                  ? 'Excelente - Líder en sostenibilidad'
                  : footprintsData.carbon_score >= 50
                  ? 'Bueno - Carbono neutral o mejor'
                  : footprintsData.carbon_score >= 30
                  ? 'Regular - En progreso'
                  : 'Necesita mejorar'}
              </Text>
            </Box>
          )}
          {/* Divider */}
          <Divider my={4} />
          {/* Certifications Section */}
          <Box>
            <Heading size="sm" mb={2} color="green.700">
              Certificaciones de Carbono
            </Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Certificación</Th>
                  <Th>Organismo</Th>
                  <Th>Válido Desde</Th>
                  <Th>Válido Hasta</Th>
                  <Th>Documento</Th>
                </Tr>
              </Thead>
              <Tbody>
                {certifications.map((cert) => (
                  <Tr key={cert.id}>
                    <Td>{cert.certificate_id}</Td>
                    <Td>{cert.certifier}</Td>
                    <Td>{new Date(cert.issue_date).toLocaleDateString()}</Td>
                    <Td>
                      {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'N/A'}
                    </Td>
                    <Td>
                      {cert.document ? (
                        <a href={cert.document} target="_blank" rel="noopener noreferrer">
                          Ver
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      {/* Registro Card */}
      <Card bg={cardBg} mb={8} p={{ base: 4, md: 6 }} boxShadow="md" borderRadius="lg">
        <CardHeader pb={2}>
          <Flex align="center" gap={2}>
            <FaChartLine color="#3182CE" />
            <Heading size="md">Registro</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Año</FormLabel>
                <Input
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  min={2000}
                  max={2100}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Select {...register('type')}>
                  <option value="emission">Emisión</option>
                  <option value="offset">Compensación</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>
                  {watch('type') === 'emission' ? 'Fuente de Emisión' : 'Acción de Compensación'}
                </FormLabel>
                <Select
                  {...register(watch('type') === 'emission' ? 'emission_source' : 'offset_action')}
                >
                  <option value="">Seleccionar...</option>
                  {(watch('type') === 'emission' ? emissionSources : offsetActions).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Cantidad (kg CO₂e)</FormLabel>
                <Input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} />
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input {...register('description')} />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={addingFootprint}
                loadingText="Registrando..."
              >
                Registrar
              </Button>
            </Stack>
          </form>
          <Divider my={6} />
          <Box>
            <Heading size="sm" mb={2} color="blue.700">
              Historial de Registros
            </Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Fecha</Th>
                  <Th>Tipo</Th>
                  <Th>Fuente/Acción</Th>
                  <Th>Cantidad</Th>
                  <Th>Descripción</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(footprints) && footprints.length > 0 ? (
                  footprints.map((footprint) => (
                    <Tr key={footprint.id}>
                      <Td>
                        {new Date(footprint.created_at || footprint.date).toLocaleDateString()}
                      </Td>
                      <Td>{footprint.type === 'emission' ? 'Emisión' : 'Compensación'}</Td>
                      <Td>{getSourceName(footprint)}</Td>
                      <Td>{parseFloat(footprint.amount).toFixed(2)} kg CO₂e</Td>
                      <Td>{footprint.description}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center">
                      No hay registros para mostrar. Para ver el historial detallado, utilice la
                      tabla de resumen.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      {/* Reportes Card */}
      <Card bg={cardBg} mb={8} p={{ base: 4, md: 6 }} boxShadow="md" borderRadius="lg">
        <CardHeader pb={2}>
          <Flex align="center" gap={2}>
            <FaFileAlt color="#805AD5" />
            <Heading size="md">Reportes</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <CarbonReportTab establishmentId={establishmentId} />
        </CardBody>
      </Card>

      {/* Comparativa Card */}
      <Card bg={cardBg} mb={8} p={{ base: 4, md: 6 }} boxShadow="md" borderRadius="lg">
        <CardHeader pb={2}>
          <Flex align="center" gap={2}>
            <FaIndustry color="#718096" />
            <Heading size="md">Comparativa</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <CarbonBenchmarkTab establishmentId={establishmentId} />
        </CardBody>
      </Card>
    </>
  );
};

export default CarbonFootprintTab;
