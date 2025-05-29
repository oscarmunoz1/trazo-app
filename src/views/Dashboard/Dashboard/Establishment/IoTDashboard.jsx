import React, { useState } from 'react';
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
  StatArrow,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  FaWifi,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryEmpty,
  FaTractor,
  FaCloudSun,
  FaSeedling,
  FaTools,
  FaPlay,
  FaSync,
  FaExclamationTriangle,
  FaPlus,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaTint,
  FaWind
} from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import {
  useGetIoTDeviceStatusQuery,
  useSimulateIoTDataMutation,
  useListIoTDevicesQuery,
  useRegisterIoTDeviceMutation,
  useUpdateIoTDeviceMutation,
  useDeleteIoTDeviceMutation,
  useGetPendingEventsQuery,
  useApproveEventMutation,
  useRejectEventMutation,
  useListAutomationRulesQuery,
  // Weather API hooks
  useGetCurrentWeatherConditionsQuery,
  useGetWeatherRecommendationsQuery
} from 'store/api/carbonApi';

const IoTDashboard = () => {
  const { establishmentId } = useParams();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingDevice, setEditingDevice] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Form state for device registration
  const [deviceForm, setDeviceForm] = useState({
    device_id: '',
    device_type: '',
    name: '',
    manufacturer: '',
    model: '',
    latitude: '',
    longitude: '',
    notes: ''
  });

  // RTK Query hooks
  const {
    data: deviceStatusData,
    isLoading,
    error,
    refetch
  } = useGetIoTDeviceStatusQuery(establishmentId, {
    skip: !establishmentId
  });

  const {
    data: deviceListData,
    isLoading: devicesLoading,
    refetch: refetchDevices
  } = useListIoTDevicesQuery(establishmentId, {
    skip: !establishmentId
  });

  const [simulateIoTData, { isLoading: simulationLoading }] = useSimulateIoTDataMutation();
  const [registerDevice, { isLoading: registerLoading }] = useRegisterIoTDeviceMutation();
  const [updateDevice, { isLoading: updateLoading }] = useUpdateIoTDeviceMutation();
  const [deleteDevice, { isLoading: deleteLoading }] = useDeleteIoTDeviceMutation();

  // Pending events and automation
  const {
    data: pendingEventsData,
    isLoading: pendingEventsLoading,
    refetch: refetchPendingEvents
  } = useGetPendingEventsQuery(establishmentId, {
    skip: !establishmentId,
    pollingInterval: 30000 // Poll every 30 seconds for new events
  });

  const {
    data: automationRulesData,
    isLoading: rulesLoading,
    refetch: refetchRules
  } = useListAutomationRulesQuery(establishmentId, {
    skip: !establishmentId
  });

  const [approveEvent, { isLoading: approveLoading }] = useApproveEventMutation();
  const [rejectEvent, { isLoading: rejectLoading }] = useRejectEventMutation();

  // Weather API hooks
  const {
    data: weatherConditionsData,
    isLoading: weatherConditionsLoading,
    refetch: refetchWeatherConditions
  } = useGetCurrentWeatherConditionsQuery(establishmentId, {
    skip: !establishmentId
  });

  const {
    data: weatherRecommendationsData,
    isLoading: weatherRecommendationsLoading,
    refetch: refetchWeatherRecommendations
  } = useGetWeatherRecommendationsQuery(establishmentId, {
    skip: !establishmentId
  });

  const devices = deviceStatusData?.devices || [];
  const deviceSummary = deviceStatusData?.summary || {};
  const pendingEvents = pendingEventsData?.pending_events || [];
  const automationRules = automationRulesData?.rules || [];

  // Weather data
  const weatherConditions = weatherConditionsData?.weather;
  const weatherRecommendations = weatherRecommendationsData?.recommendations;
  const hasWeatherAlerts =
    weatherRecommendations &&
    ((weatherRecommendations.critical && weatherRecommendations.critical.length > 0) ||
      (weatherRecommendations.high && weatherRecommendations.high.length > 0));

  const deviceTypes = [
    { value: 'fuel_sensor', label: 'Fuel Consumption Sensor', icon: FaTractor },
    { value: 'weather_station', label: 'Weather Station', icon: FaCloudSun },
    { value: 'soil_moisture', label: 'Soil Moisture Sensor', icon: FaSeedling },
    { value: 'irrigation', label: 'Irrigation Controller', icon: FaSeedling },
    { value: 'equipment_monitor', label: 'Equipment Monitor', icon: FaTools },
    { value: 'gps_tracker', label: 'GPS Tracker', icon: FaMapMarkerAlt }
  ];

  const resetForm = () => {
    setDeviceForm({
      device_id: '',
      device_type: '',
      name: '',
      manufacturer: '',
      model: '',
      latitude: '',
      longitude: '',
      notes: ''
    });
    setEditingDevice(null);
  };

  const handleOpenModal = (device = null) => {
    if (device) {
      setEditingDevice(device);
      setDeviceForm({
        device_id: device.device_id || '',
        device_type: device.device_type || '',
        name: device.name || '',
        manufacturer: device.manufacturer || '',
        model: device.model || '',
        latitude: device.location?.lat?.toString() || '',
        longitude: device.location?.lng?.toString() || '',
        notes: device.notes || ''
      });
    } else {
      resetForm();
    }
    onOpen();
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const deviceData = {
        ...deviceForm,
        establishment_id: establishmentId,
        latitude: deviceForm.latitude ? parseFloat(deviceForm.latitude) : undefined,
        longitude: deviceForm.longitude ? parseFloat(deviceForm.longitude) : undefined
      };

      if (editingDevice) {
        await updateDevice({ id: editingDevice.id, data: deviceData }).unwrap();
        toast({
          title: 'Device Updated',
          description: `${deviceForm.name} has been updated successfully`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        await registerDevice(deviceData).unwrap();
        toast({
          title: 'Device Registered',
          description: `${deviceForm.name} has been registered successfully`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }

      handleCloseModal();
      refetch();
      refetchDevices();
    } catch (error) {
      console.error('Error saving device:', error);
      toast({
        title: editingDevice ? 'Update Error' : 'Registration Error',
        description: error.data?.error || 'Failed to save device',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleDeleteDevice = async (device) => {
    if (window.confirm(`Are you sure you want to delete ${device.name}?`)) {
      try {
        await deleteDevice(device.id).unwrap();
        toast({
          title: 'Device Deleted',
          description: `${device.name} has been deleted successfully`,
          status: 'success',
          duration: 5000,
          isClosable: true
        });
        refetch();
        refetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
        toast({
          title: 'Delete Error',
          description: error.data?.error || 'Failed to delete device',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  };

  const simulateData = async (deviceType) => {
    try {
      const result = await simulateIoTData({
        establishment_id: establishmentId,
        device_type: deviceType
      }).unwrap();

      toast({
        title: 'IoT Data Simulated',
        description: result.workflow || result.message,
        status: 'success',
        duration: 6000,
        isClosable: true
      });

      // Refresh data to show new pending events or auto-processed entries
      refetch();
      refetchPendingEvents();
    } catch (error) {
      console.error('Error simulating data:', error);
      toast({
        title: 'Simulation Error',
        description: error.data?.error || 'Failed to simulate IoT data',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'fuel_sensor':
        return FaTractor;
      case 'weather_station':
        return FaCloudSun;
      case 'soil_moisture':
        return FaSeedling;
      case 'equipment_monitor':
        return FaTools;
      default:
        return FaWifi;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      case 'maintenance':
        return 'yellow';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getBatteryIcon = (batteryLevel) => {
    if (batteryLevel > 60) return FaBatteryFull;
    if (batteryLevel > 20) return FaBatteryHalf;
    return FaBatteryEmpty;
  };

  const getBatteryColor = (batteryLevel) => {
    if (batteryLevel > 60) return 'green';
    if (batteryLevel > 20) return 'yellow';
    return 'red';
  };

  // Weather condition helpers
  const getTemperatureColor = (temp) => {
    if (temp > 95) return 'red.500';
    if (temp > 85) return 'orange.500';
    if (temp > 75) return 'yellow.500';
    if (temp > 65) return 'green.500';
    return 'blue.500';
  };

  const getWeatherIcon = (description) => {
    if (description?.toLowerCase().includes('rain')) return FaCloudSun;
    if (description?.toLowerCase().includes('cloud')) return FaCloudSun;
    if (description?.toLowerCase().includes('sun')) return FaCloudSun;
    return FaCloudSun;
  };

  const refreshAllData = () => {
    refetch();
    refetchPendingEvents();
    refetchWeatherConditions();
    refetchWeatherRecommendations();
    toast({
      title: 'Data Refreshed',
      description: 'IoT and weather data has been updated',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };

  const handleApproveEvent = async (event) => {
    try {
      await approveEvent({
        data_point_id: event.data_point_id,
        event_data: event.suggested_carbon_entry
      }).unwrap();

      toast({
        title: 'Event Approved',
        description: `Carbon entry created: ${event.suggested_carbon_entry.amount.toFixed(
          2
        )} kg CO2e`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      refetchPendingEvents();
      refetch(); // Refresh main dashboard
    } catch (error) {
      console.error('Error approving event:', error);
      toast({
        title: 'Approval Error',
        description: error.data?.error || 'Failed to approve event',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleRejectEvent = async (event, reason = 'User rejected') => {
    try {
      await rejectEvent({
        data_point_id: event.data_point_id,
        reason: reason
      }).unwrap();

      toast({
        title: 'Event Rejected',
        description: 'Event has been rejected and marked as processed',
        status: 'info',
        duration: 5000,
        isClosable: true
      });

      refetchPendingEvents();
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast({
        title: 'Rejection Error',
        description: error.data?.error || 'Failed to reject event',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  if (isLoading) {
    return (
      <Box p={6} display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error loading IoT data!</AlertTitle>
          <AlertDescription>
            Failed to load IoT device status. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={{ base: 4, md: 8 }} px={{ base: 2, md: 6 }}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex
          direction={{ sm: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap="24px"
          paddingTop={12}
          w="100%">
          <VStack align="start" spacing={1}>
            <Text color="gray.500" fontSize="md">
              Monitorea y gestiona dispositivos IoT conectados a tu establecimiento
            </Text>
          </VStack>

          <HStack spacing={3} alignSelf={{ sm: 'flex-start', lg: 'flex-end' }}>
            <Button
              leftIcon={<FaPlus />}
              colorScheme="green"
              h="35px"
              fontSize="xs"
              onClick={() => handleOpenModal()}>
              Add Device
            </Button>
            <Button
              leftIcon={<FaPlay />}
              colorScheme="blue"
              h="35px"
              fontSize="xs"
              isLoading={simulationLoading}
              onClick={() => simulateData('fuel_sensor')}>
              Simulate Fuel Data
            </Button>
            <Button
              leftIcon={<FaCloudSun />}
              colorScheme="teal"
              h="35px"
              fontSize="xs"
              isLoading={simulationLoading}
              onClick={() => simulateData('weather_station')}>
              Simulate Weather Data
            </Button>
            <Button
              leftIcon={<FaSync />}
              variant="outline"
              h="35px"
              fontSize="xs"
              onClick={refreshAllData}>
              Refresh
            </Button>
          </HStack>
        </Flex>

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Devices</StatLabel>
                <StatNumber>{deviceSummary.total_devices || 0}</StatNumber>
                <StatHelpText>Connected to establishment</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Online Devices</StatLabel>
                <StatNumber color="green.500">{deviceSummary.online_devices || 0}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {deviceSummary.total_devices > 0
                    ? Math.round((deviceSummary.online_devices / deviceSummary.total_devices) * 100)
                    : 0}
                  % uptime
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Offline Devices</StatLabel>
                <StatNumber color="red.500">{deviceSummary.offline_devices || 0}</StatNumber>
                <StatHelpText>Need attention</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Low Battery</StatLabel>
                <StatNumber color="orange.500">{deviceSummary.low_battery_devices || 0}</StatNumber>
                <StatHelpText>Below 20%</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Weather Monitoring Section */}
        {weatherConditions && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Heading size="md" mb={4} display="flex" alignItems="center">
                <Icon as={FaCloudSun} mr={2} color="blue.500" />
                Current Weather Conditions
                {hasWeatherAlerts && (
                  <Badge ml={2} colorScheme="orange" variant="solid">
                    Weather Alerts
                  </Badge>
                )}
              </Heading>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={4}>
                <Stat>
                  <StatLabel display="flex" alignItems="center">
                    <Icon as={FaThermometerHalf} mr={1} />
                    Temperature
                  </StatLabel>
                  <StatNumber color={getTemperatureColor(weatherConditions.temperature)}>
                    {weatherConditions.temperature}°F
                  </StatNumber>
                  <StatHelpText>{weatherConditions.temperature_c}°C</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel display="flex" alignItems="center">
                    <Icon as={FaTint} mr={1} />
                    Humidity
                  </StatLabel>
                  <StatNumber>{weatherConditions.humidity}%</StatNumber>
                  <StatHelpText>
                    {weatherConditions.humidity < 30 || weatherConditions.humidity > 85 ? (
                      <Text color="orange.500" fontSize="xs">
                        Attention needed
                      </Text>
                    ) : (
                      <Text color="green.500" fontSize="xs">
                        Normal range
                      </Text>
                    )}
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel display="flex" alignItems="center">
                    <Icon as={FaWind} mr={1} />
                    Wind Speed
                  </StatLabel>
                  <StatNumber>{weatherConditions.wind_speed} mph</StatNumber>
                  <StatHelpText>
                    {weatherConditions.wind_speed > 25 ? (
                      <Text color="red.500" fontSize="xs">
                        High winds
                      </Text>
                    ) : (
                      <Text color="green.500" fontSize="xs">
                        Safe conditions
                      </Text>
                    )}
                  </StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Conditions</StatLabel>
                  <StatNumber fontSize="sm">{weatherConditions.description}</StatNumber>
                  <StatHelpText>
                    <Badge colorScheme="blue" variant="subtle">
                      {weatherConditions.source?.toUpperCase()}
                    </Badge>
                  </StatHelpText>
                </Stat>
              </SimpleGrid>

              {/* Weather Recommendations */}
              {weatherRecommendations && (
                <Box>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="bold">
                      Agricultural Recommendations:
                    </Text>
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme="blue"
                      leftIcon={<Icon as={FaCloudSun} />}
                      onClick={() =>
                        window.open(`/dashboard/establishment/${establishmentId}/weather`, '_blank')
                      }>
                      View Full Weather Dashboard
                    </Button>
                  </Flex>
                  <VStack spacing={2} align="stretch">
                    {weatherRecommendations.critical?.map((rec, index) => (
                      <Alert key={`critical-${index}`} status="error" size="sm">
                        <AlertIcon />
                        <AlertTitle fontSize="xs">CRITICAL:</AlertTitle>
                        <AlertDescription fontSize="xs">{rec.title}</AlertDescription>
                      </Alert>
                    ))}
                    {weatherRecommendations.high?.map((rec, index) => (
                      <Alert key={`high-${index}`} status="warning" size="sm">
                        <AlertIcon />
                        <AlertTitle fontSize="xs">HIGH:</AlertTitle>
                        <AlertDescription fontSize="xs">{rec.title}</AlertDescription>
                      </Alert>
                    ))}
                    {weatherRecommendations.medium?.slice(0, 2).map((rec, index) => (
                      <Alert key={`medium-${index}`} status="info" size="sm">
                        <AlertIcon />
                        <AlertTitle fontSize="xs">MEDIUM:</AlertTitle>
                        <AlertDescription fontSize="xs">{rec.title}</AlertDescription>
                      </Alert>
                    ))}
                  </VStack>
                </Box>
              )}
            </CardBody>
          </Card>
        )}

        {/* Weather Loading State */}
        {weatherConditionsLoading && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Flex align="center" justify="center" minH="100px">
                <VStack spacing={2}>
                  <Spinner size="md" />
                  <Text fontSize="sm">Loading weather data...</Text>
                </VStack>
              </Flex>
            </CardBody>
          </Card>
        )}

        {/* Alerts */}
        {deviceSummary.offline_devices > 0 && (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Device Alert!</AlertTitle>
            <AlertDescription>
              {deviceSummary.offline_devices} device(s) are currently offline. Check connectivity
              and power status.
            </AlertDescription>
          </Alert>
        )}

        {deviceSummary.low_battery_devices > 0 && (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>Battery Alert!</AlertTitle>
            <AlertDescription>
              {deviceSummary.low_battery_devices} device(s) have low battery levels. Schedule
              maintenance soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Workflow Information Alert */}
        {pendingEventsData?.auto_processed_count > 0 && (
          <Alert status="success">
            <AlertIcon />
            <AlertTitle>Smart Processing Active!</AlertTitle>
            <AlertDescription>
              {pendingEventsData.auto_processed_count} high-confidence events were automatically
              processed.
              {pendingEvents.length > 0 && ` ${pendingEvents.length} events require manual review.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Workflow Explanation */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              IoT Workflow & Smart Processing
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FaPlay} color="green.500" />
                  <Text fontWeight="bold" color="green.500">
                    Auto-Approved
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  High confidence events (&gt;90%) are automatically processed into carbon entries
                </Text>
                <Badge colorScheme="green" variant="subtle">
                  {pendingEventsData?.auto_processed_count || 0} processed today
                </Badge>
              </VStack>

              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FaExclamationTriangle} color="orange.500" />
                  <Text fontWeight="bold" color="orange.500">
                    Manual Review
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Medium confidence events (70-90%) require your approval before processing
                </Text>
                <Badge colorScheme="orange" variant="subtle">
                  {pendingEvents.length} pending approval
                </Badge>
              </VStack>

              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FaSync} color="blue.500" />
                  <Text fontWeight="bold" color="blue.500">
                    Continuous Monitoring
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  System monitors IoT data 24/7 and processes events based on confidence scores
                </Text>
                <Badge colorScheme="blue" variant="subtle">
                  Real-time processing
                </Badge>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Device List */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              Device Status
            </Heading>

            {devices.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500">No IoT devices found for this establishment.</Text>
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Use the simulation buttons above to test the IoT integration.
                </Text>
              </Box>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Device</Th>
                      <Th>Type</Th>
                      <Th>Status</Th>
                      <Th>Battery</Th>
                      <Th>Signal</Th>
                      <Th>Data Points Today</Th>
                      <Th>Last Update</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {devices.map((device) => {
                      const DeviceIcon = getDeviceIcon(device.device_type);
                      const BatteryIcon = getBatteryIcon(device.battery_level);

                      return (
                        <Tr key={device.device_id}>
                          <Td>
                            <HStack>
                              <Icon as={DeviceIcon} color="blue.500" />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">{device.equipment}</Text>
                                <Text fontSize="sm" color="gray.500">
                                  {device.device_id}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge colorScheme="blue" variant="subtle">
                              {device.device_type.replace('_', ' ')}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack>
                              <Icon
                                as={device.status === 'online' ? FaWifi : FaExclamationTriangle}
                                color={getStatusColor(device.status) + '.500'}
                              />
                              <Badge colorScheme={getStatusColor(device.status)}>
                                {device.status}
                              </Badge>
                            </HStack>
                          </Td>
                          <Td>
                            {device.battery_level ? (
                              <HStack>
                                <Icon
                                  as={BatteryIcon}
                                  color={getBatteryColor(device.battery_level) + '.500'}
                                />
                                <Text>{device.battery_level}%</Text>
                              </HStack>
                            ) : (
                              <Text color="gray.400">N/A</Text>
                            )}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                device.signal_strength === 'excellent'
                                  ? 'green'
                                  : device.signal_strength === 'strong'
                                  ? 'blue'
                                  : device.signal_strength === 'weak'
                                  ? 'orange'
                                  : 'gray'
                              }
                              variant="subtle">
                              {device.signal_strength || 'Unknown'}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontWeight="medium">{device.data_points_today}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">
                              {new Date(device.last_update).toLocaleString()}
                            </Text>
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<FaEllipsisV />}
                                variant="ghost"
                                size="sm"
                                aria-label="Device actions"
                              />
                              <MenuList>
                                <MenuItem icon={<FaEdit />} onClick={() => handleOpenModal(device)}>
                                  Edit Device
                                </MenuItem>
                                <MenuItem
                                  icon={<FaTrash />}
                                  color="red.500"
                                  onClick={() => handleDeleteDevice(device)}>
                                  Delete Device
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>

        {/* Pending Events */}
        {pendingEvents.length > 0 && (
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="md">Events Requiring Approval</Heading>
                <Badge colorScheme="orange" variant="solid">
                  {pendingEvents.length} pending
                </Badge>
              </Flex>

              <Alert status="info" mb={4}>
                <AlertIcon />
                <AlertTitle>Manual Review Required</AlertTitle>
                <AlertDescription>
                  These events have medium confidence scores and need your approval before creating
                  carbon entries. High-confidence events are automatically processed in the
                  background.
                </AlertDescription>
              </Alert>

              <VStack spacing={4}>
                {pendingEvents.map((event) => (
                  <Card key={event.id} w="full" variant="outline">
                    <CardBody>
                      <Flex justify="space-between" align="start">
                        <VStack align="start" spacing={2} flex={1}>
                          <HStack>
                            <Icon as={getDeviceIcon(event.event_type)} color="blue.500" />
                            <Text fontWeight="bold">{event.device_name}</Text>
                            <Badge colorScheme="blue" variant="subtle">
                              {event.event_type.replace('_', ' ')}
                            </Badge>
                            <Badge
                              colorScheme={
                                event.confidence > 0.9
                                  ? 'green'
                                  : event.confidence > 0.7
                                  ? 'yellow'
                                  : 'orange'
                              }
                              variant="subtle">
                              {Math.round(event.confidence * 100)}% confidence
                            </Badge>
                          </HStack>

                          {event.suggested_carbon_entry && (
                            <Box>
                              <Text fontSize="sm" color="gray.600">
                                <strong>Suggested Carbon Entry:</strong>
                              </Text>
                              <Text fontSize="sm">{event.suggested_carbon_entry.description}</Text>
                              <Text fontSize="sm" fontWeight="bold" color="red.500">
                                +{event.suggested_carbon_entry.amount.toFixed(2)} kg CO2e
                              </Text>
                            </Box>
                          )}

                          {event.suggested_action && (
                            <Box>
                              <Text fontSize="sm" color="gray.600">
                                <strong>Suggested Action:</strong>
                              </Text>
                              <Text fontSize="sm">{event.suggested_action.description}</Text>
                              <Badge
                                colorScheme={
                                  event.suggested_action.priority === 'high'
                                    ? 'red'
                                    : event.suggested_action.priority === 'medium'
                                    ? 'orange'
                                    : 'green'
                                }>
                                {event.suggested_action.priority} priority
                              </Badge>
                            </Box>
                          )}

                          <Text fontSize="xs" color="gray.500">
                            Detected: {new Date(event.timestamp).toLocaleString()}
                          </Text>
                        </VStack>

                        <VStack spacing={2}>
                          {event.suggested_carbon_entry && (
                            <Button
                              size="sm"
                              colorScheme="green"
                              isLoading={approveLoading}
                              onClick={() => handleApproveEvent(event)}>
                              Approve & Create Entry
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme="red"
                            isLoading={rejectLoading}
                            onClick={() => handleRejectEvent(event)}>
                            Reject
                          </Button>
                          {event.auto_approve_recommended && (
                            <Text fontSize="xs" color="green.500" textAlign="center">
                              ✓ Auto-approve recommended
                            </Text>
                          )}
                        </VStack>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Automation Rules Summary */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Automation Rules</Heading>
              <Badge colorScheme="blue" variant="solid">
                {automationRules.filter((rule) => rule.is_active).length} active
              </Badge>
            </Flex>

            {automationRules.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Text color="gray.500">No automation rules configured.</Text>
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Automation rules help automatically process IoT data into carbon events.
                </Text>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {automationRules.slice(0, 4).map((rule) => (
                  <Box key={rule.id} p={3} border="1px" borderColor={borderColor} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium" fontSize="sm">
                        {rule.name}
                      </Text>
                      <Badge colorScheme={rule.is_active ? 'green' : 'gray'} size="sm">
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      {rule.description || `${rule.trigger_type} trigger → ${rule.action_type}`}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Triggered {rule.trigger_count} times
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            )}
          </CardBody>
        </Card>

        {/* IoT Integration Info */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Heading size="md" mb={4}>
              IoT Integration Features
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack align="start" spacing={3}>
                <Heading size="sm" color="blue.500">
                  Automated Data Collection
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  • John Deere fuel sensors automatically log consumption
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Weather stations provide real-time environmental data
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Soil moisture sensors optimize irrigation schedules
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Equipment monitors track operational efficiency
                </Text>
              </VStack>

              <VStack align="start" spacing={3}>
                <Heading size="sm" color="green.500">
                  Carbon Impact Automation
                </Heading>
                <Text fontSize="sm" color="gray.600">
                  • Automatic carbon footprint calculations
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Real-time emissions tracking
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Weather-based operation recommendations
                </Text>
                <Text fontSize="sm" color="gray.600">
                  • Predictive maintenance alerts
                </Text>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Device Registration Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingDevice ? 'Edit IoT Device' : 'Register New IoT Device'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Device ID</FormLabel>
                    <Input
                      placeholder="e.g., JD_TRACTOR_001"
                      value={deviceForm.device_id}
                      onChange={(e) => setDeviceForm({ ...deviceForm, device_id: e.target.value })}
                      isDisabled={editingDevice} // Can't change device ID when editing
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Device Type</FormLabel>
                    <Select
                      placeholder="Select device type"
                      value={deviceForm.device_type}
                      onChange={(e) =>
                        setDeviceForm({ ...deviceForm, device_type: e.target.value })
                      }>
                      {deviceTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Device Name</FormLabel>
                    <Input
                      placeholder="e.g., John Deere 6120M Tractor"
                      value={deviceForm.name}
                      onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Manufacturer</FormLabel>
                    <Input
                      placeholder="e.g., John Deere"
                      value={deviceForm.manufacturer}
                      onChange={(e) =>
                        setDeviceForm({ ...deviceForm, manufacturer: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Model</FormLabel>
                    <Input
                      placeholder="e.g., 6120M"
                      value={deviceForm.model}
                      onChange={(e) => setDeviceForm({ ...deviceForm, model: e.target.value })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Location (Optional)</FormLabel>
                    <HStack>
                      <NumberInput
                        placeholder="Latitude"
                        value={deviceForm.latitude}
                        onChange={(value) => setDeviceForm({ ...deviceForm, latitude: value })}>
                        <NumberInputField placeholder="Latitude" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <NumberInput
                        placeholder="Longitude"
                        value={deviceForm.longitude}
                        onChange={(value) => setDeviceForm({ ...deviceForm, longitude: value })}>
                        <NumberInputField placeholder="Longitude" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </HStack>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <Textarea
                    placeholder="Additional notes about this device..."
                    value={deviceForm.notes}
                    onChange={(e) => setDeviceForm({ ...deviceForm, notes: e.target.value })}
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={registerLoading || updateLoading}
                isDisabled={!deviceForm.device_id || !deviceForm.device_type || !deviceForm.name}>
                {editingDevice ? 'Update Device' : 'Register Device'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default IoTDashboard;
