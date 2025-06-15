import React, { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  HStack,
  Grid,
  Button,
  Text,
  Icon,
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import {
  FaSeedling,
  FaTint,
  FaSprayCan,
  FaCut,
  FaTractor,
  FaMicrophone,
  FaMapMarkerAlt,
  FaCamera,
  FaWifi,
  FaExclamationTriangle,
  FaSync,
  FaCloudUploadAlt
} from 'react-icons/fa';
import { VoiceEventCapture } from 'components/Events/VoiceEventCapture';
// @ts-ignore - JS file import
import { useCreateEventMutation } from 'store/api/historyApi.js';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

interface FieldInterfaceProps {
  productionId: number;
  cropType: string;
  onEventCreated?: (event: any) => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface OfflineEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  location?: LocationData;
  synced: boolean;
}

const FieldInterface: React.FC<FieldInterfaceProps> = ({
  productionId,
  cropType,
  onEventCreated
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineEvents, setOfflineEvents] = useState<OfflineEvent[]>([]);
  const [showVoiceCapture, setShowVoiceCapture] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [syncingEvents, setSyncingEvents] = useState(false);
  const toast = useToast();

  // RTK Query mutation and Redux state
  const [createEvent, { isLoading: isCreatingEvent }] = useCreateEventMutation();
  const currentCompany = useSelector((state: any) => state.company.currentCompany);
  const { establishmentId, parcelId } = useParams();

  // Event types optimized for mobile field use - CARBON-FOCUSED
  const eventTypes = [
    {
      id: 'fertilizer',
      name: 'Fertilizer',
      icon: FaSeedling,
      color: 'green',
      description: 'Apply fertilizer',
      carbonImpact: 45,
      qrVisibility: 'high'
    },
    {
      id: 'irrigation',
      name: 'Irrigation',
      icon: FaTint,
      color: 'blue',
      description: 'Water application',
      carbonImpact: 25,
      qrVisibility: 'medium'
    },
    {
      id: 'pest_control',
      name: 'Pest Control',
      icon: FaSprayCan,
      color: 'orange',
      description: 'Spray pesticides',
      carbonImpact: 35,
      qrVisibility: 'high'
    },
    {
      id: 'pruning',
      name: 'Pruning',
      icon: FaCut,
      color: 'purple',
      description: 'Trim plants',
      carbonImpact: 20,
      qrVisibility: 'low'
    }
  ];

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get GPS location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineEvents.length > 0) {
      syncOfflineEvents();
    }
  }, [isOnline]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: 'GPS Not Available',
        description: 'Your device does not support GPS location',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        setCurrentLocation(locationData);
        setIsLoadingLocation(false);

        toast({
          title: 'Location Updated 📍',
          description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
          status: 'success',
          duration: 2000,
          isClosable: true
        });
      },
      (error) => {
        console.error('Location error:', error);
        setIsLoadingLocation(false);
        toast({
          title: 'Location Error',
          description: 'Could not get your current location',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleEventTypeSelect = (eventType: any) => {
    setSelectedEventType(eventType.id);

    // For mobile, immediately show voice capture for quick entry
    setShowVoiceCapture(true);
  };

  // Helper functions for mobile event conversion
  const getEventTypeFromMobileData = (event: OfflineEvent): number => {
    const eventTypeMap: { [key: string]: number } = {
      fertilizer: 1, // Chemical
      irrigation: 2, // Production
      pest_control: 1, // Chemical
      pruning: 2, // Production
      equipment: 4 // Equipment
    };
    return eventTypeMap[event.type] || 2; // Default to Production instead of General
  };

  const convertMobileEventToBackendFields = (event: OfflineEvent): any => {
    const eventType = event.type;

    if (eventType === 'fertilizer') {
      return {
        type: 'FE', // Required for ChemicalEvent
        commercial_name: event.data.detected_products?.[0] || 'Mobile Fertilizer',
        volume: event.data.detected_amounts?.[0] || '200 lbs/acre',
        way_of_application: 'broadcast',
        time_period: 'field_work'
      };
    } else if (eventType === 'irrigation') {
      return {
        type: 'IR', // Required for ProductionEvent
        observation: `Mobile irrigation entry. Duration: ${
          event.data.detected_amounts?.[0] || 'Standard cycle'
        }`
      };
    } else if (eventType === 'pest_control') {
      return {
        type: 'PE', // Required for ChemicalEvent
        commercial_name: event.data.detected_products?.[0] || 'Pesticide',
        volume: event.data.detected_amounts?.[0] || '1 gallon/acre',
        way_of_application: 'foliar',
        time_period: 'field_work'
      };
    } else if (eventType === 'pruning') {
      return {
        type: 'PR', // Required for ProductionEvent
        observation: 'Mobile pruning operation'
      };
    } else if (eventType === 'equipment') {
      return {
        type: 'FC', // Required for EquipmentEvent
        equipment_name: 'Mobile Equipment',
        fuel_amount: parseFloat(event.data.detected_amounts?.[0]?.replace(/[^\d.]/g, '') || '10'),
        fuel_type: 'diesel'
      };
    }

    return {};
  };

  const handleVoiceEventDetected = (eventData: any) => {
    const event: OfflineEvent = {
      id: `event_${Date.now()}`,
      type: selectedEventType || eventData.event_type,
      data: {
        ...eventData,
        production_id: productionId,
        location: currentLocation
      },
      timestamp: Date.now(),
      location: currentLocation || undefined,
      synced: false
    };

    if (isOnline) {
      // Try to sync immediately
      syncEvent(event);
    } else {
      // Store offline
      setOfflineEvents((prev) => [...prev, event]);
      toast({
        title: 'Event Saved Offline 📱',
        description: 'Will sync when connection is restored',
        status: 'info',
        duration: 3000,
        isClosable: true
      });
    }

    setShowVoiceCapture(false);
    setSelectedEventType(null);
  };

  const syncEvent = async (event: OfflineEvent) => {
    try {
      // Convert offline event to backend format
      const backendEventData = {
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parseInt(parcelId || '0'),
        parcels: [parseInt(parcelId || '0')],
        event_type: getEventTypeFromMobileData(event),
        date: new Date(event.timestamp).toISOString(),
        description: event.data.description || `Mobile ${event.type} event`,
        album: { images: [] },
        observation: `Mobile field entry. Location: ${
          event.location
            ? `${event.location.latitude.toFixed(6)}, ${event.location.longitude.toFixed(6)}`
            : 'Not available'
        }`,
        ...convertMobileEventToBackendFields(event)
      };

      await createEvent(backendEventData).unwrap();

      event.synced = true;

      toast({
        title: 'Event Synced ✅',
        description: 'Event uploaded to cloud',
        status: 'success',
        duration: 2000,
        isClosable: true
      });

      if (onEventCreated) {
        onEventCreated(event.data);
      }
    } catch (error) {
      console.error('Error syncing event:', error);
      // Keep in offline queue
      setOfflineEvents((prev) => [...prev, event]);
      toast({
        title: 'Sync Failed',
        description: 'Event saved offline for later sync',
        status: 'warning',
        duration: 3000,
        isClosable: true
      });
    }
  };

  const syncOfflineEvents = async () => {
    if (offlineEvents.length === 0) return;

    setSyncingEvents(true);

    try {
      // Sync each event individually
      const syncPromises = offlineEvents.map(async (event) => {
        const backendEventData = {
          companyId: currentCompany.id,
          establishmentId: parseInt(establishmentId || '0'),
          parcelId: parseInt(parcelId || '0'),
          parcels: [parseInt(parcelId || '0')],
          event_type: getEventTypeFromMobileData(event),
          date: new Date(event.timestamp).toISOString(),
          description: event.data.description || `Mobile ${event.type} event`,
          album: { images: [] },
          observation: `Mobile field entry. Location: ${
            event.location
              ? `${event.location.latitude.toFixed(6)}, ${event.location.longitude.toFixed(6)}`
              : 'Not available'
          }`,
          ...convertMobileEventToBackendFields(event)
        };

        await createEvent(backendEventData).unwrap();
        return { ...event, synced: true };
      });

      const syncedEvents = await Promise.all(syncPromises);
      setOfflineEvents([]);

      toast({
        title: 'All Events Synced! 🌐',
        description: `${syncedEvents.length} events uploaded`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      // Notify parent of all synced events
      if (onEventCreated) {
        syncedEvents.forEach((event) => onEventCreated(event.data));
      }
    } catch (error) {
      console.error('Error syncing offline events:', error);
      toast({
        title: 'Sync Failed',
        description: 'Will retry automatically',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setSyncingEvents(false);
    }
  };

  const takePhoto = () => {
    // Simulate camera functionality
    toast({
      title: 'Camera Feature',
      description: 'Photo capture would open here',
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <Container maxW="100%" p={4} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header - CARBON-FOCUSED */}
        <Card>
          <CardHeader pb={2}>
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FaSeedling} color="green.500" boxSize={5} />
                  <Text fontSize="lg" fontWeight="bold" color="gray.700">
                    🌱 Field Interface
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Carbon tracking for field work
                </Text>
              </VStack>

              {/* Connection Status */}
              <HStack>
                <Icon
                  as={isOnline ? FaWifi : FaExclamationTriangle}
                  color={isOnline ? 'green.500' : 'red.500'}
                />
                <Badge colorScheme={isOnline ? 'green' : 'red'} size="sm">
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </HStack>
            </HStack>
          </CardHeader>
        </Card>

        {/* Carbon Impact Notice - NEW */}
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={1} flex={1}>
            <Text fontSize="sm" fontWeight="semibold">
              🎯 Carbon Transparency Mode
            </Text>
            <Text fontSize="xs">Events logged here will be visible to consumers via QR codes</Text>
          </VStack>
        </Alert>

        {/* GPS Location - SIMPLIFIED */}
        <Card>
          <CardBody py={3}>
            <HStack justify="space-between" align="center">
              <HStack>
                <Icon as={FaMapMarkerAlt} color="blue.500" />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" fontWeight="semibold">
                    GPS Location
                  </Text>
                  {currentLocation ? (
                    <Text fontSize="xs" color="green.600" fontWeight="medium">
                      ✓ Location captured
                    </Text>
                  ) : (
                    <Text fontSize="xs" color="red.500">
                      Location needed for carbon tracking
                    </Text>
                  )}
                </VStack>
              </HStack>

              <Button
                size="sm"
                variant="outline"
                colorScheme={currentLocation ? 'green' : 'blue'}
                leftIcon={isLoadingLocation ? <Spinner size="xs" /> : <FaMapMarkerAlt />}
                onClick={getCurrentLocation}
                isDisabled={isLoadingLocation}>
                {isLoadingLocation ? 'Getting...' : currentLocation ? 'Update' : 'Get Location'}
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Voice Input Button - PROMINENT */}
        <Button
          size="lg"
          height="70px"
          colorScheme="blue"
          leftIcon={<FaMicrophone />}
          onClick={() => setShowVoiceCapture(true)}
          fontSize="lg"
          fontWeight="bold"
          borderRadius="xl"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 0.2s">
          🎤 Voice Input (Fastest Method)
        </Button>

        {/* Event Type Grid - CARBON-FOCUSED */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Text fontWeight="bold" color="gray.700">
                Select Event Type
              </Text>
              <Badge colorScheme="green" variant="outline">
                {cropType} Optimized
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {eventTypes.map((eventType) => (
                <Button
                  key={eventType.id}
                  height="100px"
                  p={4}
                  colorScheme={eventType.color}
                  variant="outline"
                  onClick={() => handleEventTypeSelect(eventType)}
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'lg',
                    borderColor: `${eventType.color}.400`
                  }}
                  _active={{
                    transform: 'translateY(0)',
                    shadow: 'md'
                  }}
                  transition="all 0.2s">
                  <VStack spacing={2}>
                    <Icon as={eventType.icon} boxSize={6} />
                    <Text fontSize="sm" fontWeight="bold" textAlign="center">
                      {eventType.name}
                    </Text>
                    {/* Carbon Impact Badge - NEW */}
                    <Badge colorScheme={eventType.carbonImpact > 30 ? 'red' : 'green'} size="xs">
                      {eventType.carbonImpact} kg CO₂
                    </Badge>
                    {/* QR Visibility Indicator - NEW */}
                    <HStack>
                      <Icon as={FaCamera} boxSize={3} color="gray.400" />
                      <Text fontSize="xs" color="gray.500">
                        {eventType.qrVisibility} visibility
                      </Text>
                    </HStack>
                  </VStack>
                </Button>
              ))}
            </Grid>
          </CardBody>
        </Card>

        {/* Quick Actions - SIMPLIFIED */}
        <HStack spacing={3}>
          <Button
            flex={1}
            height="50px"
            leftIcon={<FaCamera />}
            colorScheme="purple"
            variant="outline"
            onClick={takePhoto}
            borderRadius="lg">
            Take Photo
          </Button>

          <Tooltip label="Upload pending events">
            <IconButton
              height="50px"
              aria-label="Sync events"
              icon={syncingEvents ? <Spinner /> : <FaCloudUploadAlt />}
              colorScheme="green"
              variant="outline"
              onClick={syncOfflineEvents}
              isDisabled={offlineEvents.length === 0 || !isOnline}
              borderRadius="lg"
            />
          </Tooltip>
        </HStack>

        {/* Offline Events Alert - IMPROVED */}
        {offlineEvents.length > 0 && (
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontSize="sm" fontWeight="semibold">
                {offlineEvents.length} carbon events saved offline
              </Text>
              <Text fontSize="xs">Will sync automatically when connection is restored</Text>
            </VStack>
            {isOnline && (
              <Button size="xs" colorScheme="orange" onClick={syncOfflineEvents}>
                Sync Now
              </Button>
            )}
          </Alert>
        )}

        {/* Voice Capture Modal - FULL SCREEN FOR MOBILE */}
        <Modal
          isOpen={showVoiceCapture}
          onClose={() => setShowVoiceCapture(false)}
          size="full"
          motionPreset="slideInBottom">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Icon as={FaMicrophone} color="blue.500" />
                <Text>Voice Carbon Event</Text>
                <Badge colorScheme="green" size="sm">
                  Field Mode
                </Badge>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {/* Carbon Focus Notice in Voice Modal */}
              <Box p={3} bg="green.50" borderRadius="lg" mb={4}>
                <Text fontSize="sm" color="green.700" textAlign="center">
                  🌱 Say what you did - it will be visible to consumers via QR codes
                </Text>
              </Box>

              <VoiceEventCapture
                onEventDetected={handleVoiceEventDetected}
                isActive={true}
                cropType={cropType}
                onClose={() => setShowVoiceCapture(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default FieldInterface;
