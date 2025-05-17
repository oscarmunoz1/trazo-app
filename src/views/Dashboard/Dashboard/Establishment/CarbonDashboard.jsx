import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
  Tooltip,
  Icon,
  Text,
  Spinner,
  Select
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import CarbonFootprintTab from '../components/forms/CarbonFootprintTab';
import { useGetCarbonFootprintSummaryQuery } from 'store/api/companyApi';
import { useGetProductionsByEstablishmentQuery } from 'store/api/historyApi';

const CarbonDashboard = () => {
  const { establishmentId } = useParams();
  const bg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('green.200', 'green.700');
  const [viewMode, setViewMode] = useState('establishment');
  const [productionId, setProductionId] = useState('');

  // Fetch summary for banner based on view mode
  const { data: summaryData, isLoading: isSummaryLoading } = useGetCarbonFootprintSummaryQuery({
    establishmentId: viewMode === 'establishment' ? establishmentId : undefined,
    productionId: viewMode === 'production' ? productionId : undefined,
    year: new Date().getFullYear()
  });

  // Fetch productions for the establishment
  const { data: productions, isLoading: isProductionsLoading } =
    useGetProductionsByEstablishmentQuery({ establishmentId });

  // Determine status
  let status = 'On Track';
  let statusColor = 'green';
  if (summaryData && summaryData.net_footprint > 0) {
    status = 'Needs Attention';
    statusColor = 'yellow';
  }
  if (summaryData && summaryData.net_footprint > (summaryData?.industry_average || 0)) {
    status = 'Above Industry';
    statusColor = 'red';
  }

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
    if (event.target.value === 'establishment') {
      setProductionId('');
    }
  };

  const handleProductionChange = (event) => {
    setProductionId(event.target.value);
  };

  return (
    <Box minH="100vh" bg={bg} py={{ base: 4, md: 8 }} px={{ base: 2, md: 8 }}>
      {/* Breadcrumbs */}
      <Breadcrumb mb={4} fontSize="sm">
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/admin/dashboard">
            Inicio
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to={`/admin/dashboard/establishment/${establishmentId}`}>
            Establecimiento
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Huella de Carbono</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* View Mode Selector */}
      <Box mb={4}>
        <Flex gap={4}>
          <Select value={viewMode} onChange={handleViewModeChange} width="200px">
            <option value="establishment">Establecimiento</option>
            <option value="production">Producción</option>
          </Select>
          {viewMode === 'production' && (
            <Select
              value={productionId}
              onChange={handleProductionChange}
              width="200px"
              placeholder="Seleccionar Producción"
              isDisabled={isProductionsLoading}>
              {productions &&
                productions.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.name || `Producción ${prod.id}`}
                  </option>
                ))}
            </Select>
          )}
        </Flex>
      </Box>

      {/* Summary Banner */}
      <Card
        bg={cardBg}
        borderLeftWidth="4px"
        borderLeftColor={statusColor + '.500'}
        boxShadow="md"
        borderRadius="lg"
        mb={6}
        px={{ base: 3, md: 6 }}
        py={{ base: 3, md: 4 }}
        w="100%"
        maxW="100%">
        <Flex align="center" justify="space-between" wrap="wrap" gap={4}>
          <Flex align="center" gap={3}>
            <Heading size="md" color="green.700">
              Huella de Carbono - {viewMode === 'establishment' ? 'Establecimiento' : 'Producción'}
            </Heading>
            <Tooltip
              label={`La huella de carbono mide el total de emisiones y compensaciones de CO₂e de este ${
                viewMode === 'establishment' ? 'establecimiento' : 'producción'
              }. Haz clic en las pestañas para ver más detalles.`}
              fontSize="sm">
              <span>
                <Icon as={InfoOutlineIcon} color="gray.400" boxSize={5} />
              </span>
            </Tooltip>
            <Badge colorScheme={statusColor} fontSize="sm" px={2} py={1} borderRadius="md">
              {status}
            </Badge>
          </Flex>
          <Flex align="center" gap={6}>
            {isSummaryLoading ? (
              <Spinner size="md" />
            ) : (
              <>
                <Box textAlign="center">
                  <Text fontSize="xs" color="gray.500">
                    Huella Neta
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {summaryData?.net_footprint?.toFixed(2) || 0} kg CO₂e
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="xs" color="gray.500">
                    Emisiones
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {summaryData?.total_emissions?.toFixed(2) || 0} kg
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="xs" color="gray.500">
                    Compensaciones
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {summaryData?.total_offsets?.toFixed(2) || 0} kg
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="xs" color="gray.500">
                    Prom. industria
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {summaryData?.industry_average?.toFixed(2) || 'N/A'} kg
                  </Text>
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      </Card>

      {/* Main Card Content */}
      <CarbonFootprintTab
        establishmentId={establishmentId}
        productionId={viewMode === 'production' ? productionId : undefined}
      />
    </Box>
  );
};

export default CarbonDashboard;
