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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { useGetCarbonReportsQuery, useGenerateCarbonReportMutation } from 'store/api/companyApi';
import { useForm } from 'react-hook-form';

const CarbonReportTab = ({ establishmentId }) => {
  const toast = useToast();
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Queries
  const {
    data: reports = [],
    isLoading: loadingReports,
    refetch
  } = useGetCarbonReportsQuery({ establishmentId, year: selectedYear });

  // Mutations
  const [generateReport, { isLoading: generatingReport }] = useGenerateCarbonReportMutation();

  // Form
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      reportType: 'annual',
      quarter: 1
    }
  });

  // Generate report
  const onSubmit = async (data) => {
    try {
      await generateReport({
        establishment: establishmentId,
        ...data
      }).unwrap();
      toast({ title: 'Reporte generado', status: 'success' });
      onClose();
      reset();
      refetch();
    } catch (e) {
      toast({
        title: 'Error',
        description: e?.data?.detail || 'Error al generar el reporte',
        status: 'error'
      });
    }
  };

  // Loading state
  if (loadingReports) {
    return (
      <Flex align="center" justify="center" minH="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Reportes de Carbono</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Generar Reporte
        </Button>
      </Flex>

      {/* Reports Table */}
      <Card bg={cardBg}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="sm">Historial de Reportes</Heading>
            <Select
              w="200px"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </Flex>
        </CardHeader>
        <CardBody>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Tipo</Th>
                <Th>Período</Th>
                <Th>Emisiones Totales</Th>
                <Th>Compensaciones</Th>
                <Th>Huella Neta</Th>
                <Th>Documento</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reports && reports.length > 0 ? (
                reports.map((report) => (
                  <Tr key={report.id}>
                    <Td>
                      {report.report_type === 'annual'
                        ? 'Anual'
                        : report.report_type === 'quarterly'
                        ? 'Trimestral'
                        : 'Personalizado'}
                    </Td>
                    <Td>
                      {report.period_start && new Date(report.period_start).toLocaleDateString()} -{' '}
                      {report.period_end && new Date(report.period_end).toLocaleDateString()}
                    </Td>
                    <Td>{(report.total_emissions || 0).toFixed(2)} kg CO₂e</Td>
                    <Td>{(report.total_offsets || 0).toFixed(2)} kg CO₂e</Td>
                    <Td>{(report.net_footprint || 0).toFixed(2)} kg CO₂e</Td>
                    <Td>
                      {report.document ? (
                        <a href={report.document} target="_blank" rel="noopener noreferrer">
                          Ver
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    No hay reportes disponibles para este año
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Generate Report Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generar Reporte de Carbono</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
                  <FormLabel>Tipo de Reporte</FormLabel>
                  <Select {...register('reportType')}>
                    <option value="annual">Anual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="custom">Personalizado</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Trimestre</FormLabel>
                  <Select {...register('quarter', { valueAsNumber: true })}>
                    <option value={1}>Q1</option>
                    <option value={2}>Q2</option>
                    <option value={3}>Q3</option>
                    <option value={4}>Q4</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Documento (opcional)</FormLabel>
                  <Input type="file" {...register('document')} />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={generatingReport}
                  loadingText="Generando...">
                  Generar Reporte
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CarbonReportTab;
