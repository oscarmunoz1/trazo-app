import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  Text,
  Heading,
  Badge,
  Button,
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Spinner,
  VStack,
  HStack,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Progress,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import {
  FaCloudSun,
  FaThermometerHalf,
  FaTint,
  FaWind,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaSync,
  FaEye,
  FaCompass,
  FaCalendarAlt,
  FaClock,
  FaLeaf,
  FaTractor,
  FaSeedling
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import {
  useGetCurrentWeatherConditionsQuery,
  useGetWeatherAlertsQuery,
  useGetWeatherRecommendationsQuery,
  useGetWeatherForecastQuery,
  useCreateWeatherAlertEventMutation
} from 'store/api/carbonApi';

const WeatherDashboard = () => {
  const { establishmentId } = useParams();
  const toast = useToast();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const alertBg = useColorModeValue('orange.50', 'orange.900');

  // Weather API queries
  const {
    data: currentWeatherData,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather
  } = useGetCurrentWeatherConditionsQuery(
    { establishmentId },
    {
      skip: !establishmentId,
      pollingInterval: autoRefresh ? 300000 : 0 // Poll every 5 minutes if auto-refresh enabled
    }
  );

  const {
    data: alertsData,
    isLoading: alertsLoading,
    refetch: refetchAlerts
  } = useGetWeatherAlertsQuery(
    { establishmentId },
    {
      skip: !establishmentId,
      pollingInterval: autoRefresh ? 600000 : 0 // Poll every 10 minutes
    }
  );

  const {
    data: recommendationsData,
    isLoading: recommendationsLoading,
    refetch: refetchRecommendations
  } = useGetWeatherRecommendationsQuery(
    { establishmentId },
    {
      skip: !establishmentId,
      pollingInterval: autoRefresh ? 900000 : 0 // Poll every 15 minutes
    }
  );

  const {
    data: forecastData,
    isLoading: forecastLoading,
    refetch: refetchForecast
  } = useGetWeatherForecastQuery(
    { establishmentId, days: 5 },
    {
      skip: !establishmentId
    }
  );

  const [createWeatherAlert, { isLoading: creatingAlert }] = useCreateWeatherAlertEventMutation();

  const weather = currentWeatherData?.weather;
  const alerts = alertsData?.alerts || [];
  const recommendations = recommendationsData?.recommendations;
  const forecast = forecastData?.forecast || [];

  const refreshAllData = () => {
    refetchWeather();
    refetchAlerts();
    refetchRecommendations();
    refetchForecast();
    toast({
      title: 'Weather Data Refreshed',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
  };

  const handleCreateAlert = async (recommendation) => {
    if (!weather || !recommendation) return;

    try {
      await createWeatherAlert({
        establishment_id: establishmentId,
        weather_data: weather,
        recommendations: [recommendation]
      }).unwrap();

      toast({
        title: 'Weather Alert Created',
        description: 'Alert has been added to pending events for review',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
    } catch (error) {
      console.error('Error creating weather alert:', error);
      toast({
        title: 'Alert Creation Failed',
        description: error.data?.error || 'Failed to create weather alert',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp > 95) return 'red.500';
    if (temp > 85) return 'orange.500';
    if (temp > 75) return 'yellow.500';
    if (temp > 65) return 'green.500';
    if (temp > 50) return 'blue.500';
    return 'purple.500';
  };

  const getHumidityColor = (humidity) => {
    if (humidity < 30 || humidity > 85) return 'orange.500';
    if (humidity < 40 || humidity > 75) return 'yellow.500';
    return 'green.500';
  };

  const getWindSpeedColor = (windSpeed) => {
    if (windSpeed > 25) return 'red.500';
    if (windSpeed > 15) return 'orange.500';
    if (windSpeed > 10) return 'yellow.500';
    return 'green.500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return FaExclamationTriangle;
      case 'medium':
        return FaInfoCircle;
      case 'low':
        return FaCheckCircle;
      default:
        return FaInfoCircle;
    }
  };

  if (weatherLoading) {
    return (
      <Box p={6} display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading weather data...</Text>
        </VStack>
      </Box>
    );
  }

  if (weatherError) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Weather Data Unavailable</AlertTitle>
          <AlertDescription>
            Unable to load weather data. Please check your establishment location settings.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg">Weather Monitoring</Heading>
          <HStack spacing={3}>
            <Button
              leftIcon={<FaSync />}
              variant="outline"
              size="sm"
              onClick={refreshAllData}
              isLoading={weatherLoading || alertsLoading || recommendationsLoading}
            >
              Refresh
            </Button>
            <Button
              variant={autoRefresh ? 'solid' : 'outline'}
              colorScheme={autoRefresh ? 'green' : 'gray'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto-Refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </HStack>
        </Flex>

        {/* Current Weather Conditions */}
        {weather && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={FaCloudSun} mr={2} color="blue.500" />
                Current Conditions
                <Badge ml={2} colorScheme="blue" variant="subtle">
                  {weather.source?.toUpperCase()}
                </Badge>
              </Heading>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                <Stat>
                  <StatLabel display="flex" alignItems="center">
                    <Icon as={FaThermometerHalf} mr={1} />
                    Temperature
                  </StatLabel>
                  <StatNumber color={getTemperatureColor(weather.temperature)}>
                    {weather.temperature}°F
                  </StatNumber>
                  <StatHelpText>{weather.temperature_c}°C</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel display="flex" alignItems="center">
                    <Icon as={FaTint} mr={1} />
                    Humidity
                  </StatLabel>
                  <StatNumber color={getHumidityColor(weather.humidity)}>
                    {weather.humidity}%
                  </StatNumber>
                  <StatHelpText>
                    <Progress
                      value={weather.humidity}
                      size="sm"
                      colorScheme={getHumidityColor(weather.humidity).split('.')[0]}
                      mt={1}
                    />
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel display="flex" alignItems="center">
                    <Icon as={FaWind} mr={1} />
                    Wind Speed
                  </StatLabel>
                  <StatNumber color={getWindSpeedColor(weather.wind_speed)}>
                    {weather.wind_speed} mph
                  </StatNumber>
                  <StatHelpText>
                    {weather.wind_direction && (
                      <Flex alignItems="center">
                        <Icon as={FaCompass} mr={1} />
                        {weather.wind_direction}°
                      </Flex>
                    )}
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel display="flex" alignItems="center">
                    <Icon as={FaEye} mr={1} />
                    Conditions
                  </StatLabel>
                  <StatNumber fontSize="md">{weather.description}</StatNumber>
                  <StatHelpText>
                    <Flex alignItems="center">
                      <Icon as={FaClock} mr={1} />
                      {new Date(weather.timestamp).toLocaleTimeString()}
                    </Flex>
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <Card bg={alertBg} borderColor="orange.300">
            <CardBody>
              <Heading size="md" mb={4} display="flex" alignItems="center" color="orange.600">
                <Icon as={FaExclamationTriangle} mr={2} />
                Active Weather Alerts ({alerts.length})
              </Heading>

              <VStack spacing={3} align="stretch">
                {alerts.map((alert, index) => (
                  <Alert key={index} status="warning" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle fontSize="sm">{alert.title}</AlertTitle>
                      <AlertDescription fontSize="xs" mt={1}>
                        {alert.description}
                      </AlertDescription>
                      {alert.instruction && (
                        <Text fontSize="xs" mt={2} fontWeight="bold">
                          Action: {alert.instruction}
                        </Text>
                      )}
                    </Box>
                    <Badge colorScheme="orange" variant="subtle">
                      {alert.severity}
                    </Badge>
                  </Alert>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Agricultural Recommendations */}
        {recommendations && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={FaLeaf} mr={2} color="green.500" />
                Agricultural Recommendations
                {recommendationsData?.summary?.requires_immediate_action && (
                  <Badge ml={2} colorScheme="red" variant="solid">
                    Action Required
                  </Badge>
                )}
              </Heading>

              <Accordion allowMultiple>
                {['critical', 'high', 'medium', 'low'].map((priority) => {
                  const recs = recommendations[priority] || [];
                  if (recs.length === 0) return null;

                  const PriorityIcon = getPriorityIcon(priority);

                  return (
                    <AccordionItem key={priority}>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <HStack>
                            <Icon as={PriorityIcon} color={`${getPriorityColor(priority)}.500`} />
                            <Text fontWeight="medium" textTransform="capitalize">
                              {priority} Priority ({recs.length})
                            </Text>
                          </HStack>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <VStack spacing={4} align="stretch">
                          {recs.map((rec, index) => (
                            <Box
                              key={index}
                              p={4}
                              borderWidth="1px"
                              borderRadius="md"
                              borderColor={`${getPriorityColor(priority)}.200`}
                            >
                              <Flex justify="space-between" align="start" mb={2}>
                                <VStack align="start" spacing={1} flex="1">
                                  <Text fontWeight="bold" fontSize="sm">
                                    {rec.title}
                                  </Text>
                                  <Text fontSize="xs" color="gray.600">
                                    {rec.description}
                                  </Text>
                                </VStack>
                                <Button
                                  size="xs"
                                  colorScheme={getPriorityColor(priority)}
                                  variant="outline"
                                  leftIcon={<Icon as={FaTractor} />}
                                  onClick={() => handleCreateAlert(rec)}
                                  isLoading={creatingAlert}
                                >
                                  Create Alert
                                </Button>
                              </Flex>

                              <Divider my={2} />

                              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="xs" fontWeight="bold">
                                    Recommended Actions:
                                  </Text>
                                  {rec.actions.map((action, actionIndex) => (
                                    <Text key={actionIndex} fontSize="xs" color="gray.600">
                                      • {action}
                                    </Text>
                                  ))}
                                </VStack>

                                <VStack align="start" spacing={1}>
                                  <HStack>
                                    <Text fontSize="xs" fontWeight="bold">
                                      Timing:
                                    </Text>
                                    <Text fontSize="xs">{rec.timing}</Text>
                                  </HStack>
                                  <HStack>
                                    <Text fontSize="xs" fontWeight="bold">
                                      Carbon Impact:
                                    </Text>
                                    <Text fontSize="xs">{rec.carbon_impact}</Text>
                                  </HStack>
                                  <HStack>
                                    <Text fontSize="xs" fontWeight="bold">
                                      Cost Impact:
                                    </Text>
                                    <Text fontSize="xs">{rec.cost_impact}</Text>
                                  </HStack>
                                </VStack>
                              </SimpleGrid>
                            </Box>
                          ))}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardBody>
          </Card>
        )}

        {/* Weather Forecast */}
        {forecast.length > 0 && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={FaCalendarAlt} mr={2} color="purple.500" />
                5-Day Forecast
              </Heading>

              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Period</Th>
                      <Th>Temperature</Th>
                      <Th>Wind</Th>
                      <Th>Conditions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {forecast.slice(0, 10).map((period, index) => (
                      <Tr key={index}>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="medium">
                              {period.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {new Date(period.start_time).toLocaleDateString()}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontWeight="medium" color={getTemperatureColor(period.temperature)}>
                            {period.temperature}°{period.temperature_unit}
                          </Text>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">{period.wind_speed}</Text>
                            <Text fontSize="xs" color="gray.500">
                              {period.wind_direction}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Tooltip label={period.description} placement="top">
                            <Text fontSize="sm" noOfLines={2}>
                              {period.short_forecast}
                            </Text>
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        )}

        {/* Weather Integration Info */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              Weather Integration Features
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack align="start" spacing={3}>
                <Heading size="sm" color="blue.500">
                  Real-Time Monitoring
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  • NOAA Weather Service integration for accurate data
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Automatic weather alerts and notifications
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • 5-day forecast for operation planning
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Location-specific agricultural recommendations
                </Text>
              </VStack>

              <VStack align="start" spacing={3}>
                <Heading size="sm" color="green.500">
                  Smart Agriculture
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  • Weather-based operation timing recommendations
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Crop protection alerts for extreme conditions
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Irrigation optimization based on humidity
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Carbon impact assessment for weather responses
                </Text>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default WeatherDashboard;
