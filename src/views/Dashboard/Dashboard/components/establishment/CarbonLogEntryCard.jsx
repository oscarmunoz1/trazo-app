import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Textarea,
  useColorModeValue,
  Spinner,
  FormControl,
  FormLabel,
  useToast
} from '@chakra-ui/react';
import { useCreateCarbonEntryMutation } from 'store/api/companyApi';

const CarbonLogEntryCard = ({ establishmentId }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const toast = useToast();
  const [createCarbonEntry, { isLoading }] = useCreateCarbonEntryMutation();
  const [formData, setFormData] = useState({
    type: 'emission',
    source: '',
    amount: '',
    description: '',
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        establishment: establishmentId,
        type: formData.type,
        source: formData.source || null,
        amount: parseFloat(formData.amount) || 0,
        description: formData.description,
        year: parseInt(formData.year),
        date: formData.date
      };
      await createCarbonEntry(payload).unwrap();
      toast({
        title: 'Entrada registrada',
        description: 'La entrada de carbono ha sido registrada con éxito.',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      // Reset form
      setFormData({
        type: 'emission',
        source: '',
        amount: '',
        description: '',
        year: new Date().getFullYear().toString(),
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo registrar la entrada de carbono.',
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
      mt={4}>
      <CardBody w="100%" p={0}>
        <Heading size="md" mb={4}>
          Registrar Entrada de Carbono
        </Heading>
        <form onSubmit={handleSubmit}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Tipo</FormLabel>
              <Select name="type" value={formData.type} onChange={handleChange}>
                <option value="emission">Emisión</option>
                <option value="offset">Compensación</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Fuente (opcional)</FormLabel>
              <Input
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Ej. Fertilizante, Combustible"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Cantidad</FormLabel>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Cantidad en unidad"
              />
            </FormControl>
          </Flex>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4} mb={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Año</FormLabel>
              <Input name="year" type="number" value={formData.year} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Fecha</FormLabel>
              <Input name="date" type="date" value={formData.date} onChange={handleChange} />
            </FormControl>
          </Flex>
          <FormControl mb={4}>
            <FormLabel fontSize="sm">Descripción</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detalles adicionales sobre esta entrada"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="green"
            isLoading={isLoading}
            loadingText="Registrando...">
            Registrar Entrada
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default CarbonLogEntryCard;
