import React from 'react';
import {
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Box,
  Icon,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { useGetCarbonFootprintSummaryQuery } from 'store/api/companyApi';
import { MdCheckCircle, MdInfo } from 'react-icons/md';

const CarbonInsightsCard = ({ establishmentId }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const year = new Date().getFullYear();
  const { data, isLoading, isError } = useGetCarbonFootprintSummaryQuery({ establishmentId, year });

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
          Perspectivas de Carbono
        </Heading>
        {isLoading ? (
          <Text>Cargando perspectivas...</Text>
        ) : isError ? (
          <Text color="red.500">No se pudieron cargar las perspectivas.</Text>
        ) : (
          <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
            <Box flex="1">
              <Heading size="sm" mb={2}>
                Comparativas
              </Heading>
              <Text fontSize="sm" mb={2}>
                Tu huella neta: <strong>{data.net_carbon?.toFixed(2) || 0} kg CO₂e</strong>
              </Text>
              <Text fontSize="sm" mb={2}>
                Promedio de la industria:{' '}
                <strong>{data.industry_average?.toFixed(2) || 'N/A'} kg CO₂e</strong>
              </Text>
              <Text
                fontSize="sm"
                color={data.net_carbon > (data.industry_average || 0) ? 'red.500' : 'green.500'}>
                {data.net_carbon > (data.industry_average || 0)
                  ? 'Estás por encima del promedio de la industria. Considera reducir emisiones.'
                  : 'Estás por debajo del promedio de la industria. ¡Buen trabajo!'}
              </Text>
            </Box>
            <Box flex="1">
              <Heading size="sm" mb={2}>
                Recomendaciones
              </Heading>
              <List spacing={2}>
                {data.recommendations && data.recommendations.length > 0 ? (
                  data.recommendations.map((rec, index) => (
                    <ListItem key={index} fontSize="sm">
                      <ListIcon as={MdInfo} color="blue.500" />
                      {rec}
                    </ListItem>
                  ))
                ) : (
                  <ListItem fontSize="sm">
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    No hay recomendaciones específicas en este momento. Continúa monitoreando tus
                    datos.
                  </ListItem>
                )}
              </List>
              <Text fontSize="xs" color="gray.500" mt={2}>
                *Las recomendaciones son generales y pueden no aplicarse a tu situación específica.
              </Text>
            </Box>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default CarbonInsightsCard;
