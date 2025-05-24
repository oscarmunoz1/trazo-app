import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Flex,
  Heading,
  Button,
  Select,
  useColorModeValue,
  Spinner,
  Text,
  useToast,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useGenerateCarbonReportMutation } from 'store/api/companyApi';

const CarbonReportsCard = ({ establishmentId }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const toast = useToast();
  const [generateReport, { isLoading }] = useGenerateCarbonReportMutation();
  const [reportType, setReportType] = useState('annual');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [quarter, setQuarter] = useState('1');

  const handleGenerateReport = async () => {
    try {
      const payload = {
        establishment: establishmentId,
        year: parseInt(year),
        report_type: reportType,
        quarter: reportType === 'quarterly' ? parseInt(quarter) : 1
      };
      await generateReport(payload).unwrap();
      toast({
        title: 'Reporte generado',
        description: `El reporte ${
          reportType === 'annual' ? 'anual' : 'trimestral'
        } para ${year} ha sido generado con éxito.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo generar el reporte.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Card
      bg={cardBg}
      w="100%"
      boxShadow="md"
      borderRadius="lg"
      px={{ base: 3, md: 6 }}
      py={{ base: 2, md: 3 }}
      mt={4}
    >
      <CardBody w="100%" p={0}>
        <Heading size="md" mb={4}>
          Generar Reporte de Carbono
        </Heading>
        <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={4}>
          <FormControl>
            <FormLabel fontSize="sm">Tipo de Reporte</FormLabel>
            <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="annual">Anual</option>
              <option value="quarterly">Trimestral</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Año</FormLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)}>
              {[0, -1, -2, -3].map((offset) => (
                <option key={offset} value={(new Date().getFullYear() + offset).toString()}>
                  {new Date().getFullYear() + offset}
                </option>
              ))}
            </Select>
          </FormControl>
          {reportType === 'quarterly' && (
            <FormControl>
              <FormLabel fontSize="sm">Trimestre</FormLabel>
              <Select value={quarter} onChange={(e) => setQuarter(e.target.value)}>
                <option value="1">Q1 (Ene-Mar)</option>
                <option value="2">Q2 (Abr-Jun)</option>
                <option value="3">Q3 (Jul-Sep)</option>
                <option value="4">Q4 (Oct-Dic)</option>
              </Select>
            </FormControl>
          )}
        </Flex>
        <Button
          colorScheme="green"
          onClick={handleGenerateReport}
          isLoading={isLoading}
          loadingText="Generando..."
        >
          Generar Reporte
        </Button>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Los reportes generados estarán disponibles para descargar en la sección de detalles.
        </Text>
      </CardBody>
    </Card>
  );
};

export default CarbonReportsCard;
