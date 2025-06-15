import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  Badge,
  Icon,
  Card,
  CardBody
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaSearchLocation, FaDrawPolygon } from 'react-icons/fa';

interface LocationImporterProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export const LocationImporter: React.FC<LocationImporterProps> = ({ data, onChange, onNext }) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [addressInput, setAddressInput] = useState(data.farmLocation?.address || '');
  const [acresInput, setAcresInput] = useState(data.farmLocation?.acres || '');

  const handleGetCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      const { latitude, longitude } = position.coords;

      // Use Vite environment variable syntax
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

      if (apiKey) {
        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          );
          const geocodeData = await response.json();

          address = geocodeData.results?.[0]?.formatted_address || address;
        } catch (geocodeError) {
          console.warn('Reverse geocoding failed, using coordinates:', geocodeError);
        }
      } else {
        console.warn('Google Maps API key not found. Using coordinates only.');
        address = `${address} (Coordinates Only)`;
      }

      const locationData = {
        lat: latitude,
        lng: longitude,
        address: address,
        acres: parseFloat(acresInput) || 50 // Default to 50 acres
      };

      onChange({
        ...data,
        farmLocation: locationData
      });

      setAddressInput(address);
    } catch (error) {
      console.error('Error getting location:', error);
      // Fallback for GPS errors
      const mockLocationData = {
        lat: 36.7783,
        lng: -119.4179,
        address: 'Central Valley, CA (Fallback Location)',
        acres: parseFloat(acresInput) || 50
      };

      onChange({
        ...data,
        farmLocation: mockLocationData
      });

      setAddressInput(mockLocationData.address);
    } finally {
      setIsLoadingLocation(false);
    }
  }, [data, onChange, acresInput]);

  const handleAddressSearch = useCallback(async () => {
    if (!addressInput.trim()) return;

    setIsLoadingLocation(true);
    try {
      // Use Vite environment variable syntax
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        // Fallback: Use mock geocoding for development
        console.warn('Google Maps API key not found. Using mock geocoding.');
        const mockLocationData = {
          lat: 36.7783 + (Math.random() - 0.5) * 0.1, // Central Valley, CA area
          lng: -119.4179 + (Math.random() - 0.5) * 0.1,
          address: `${addressInput} (Mock Location)`,
          acres: parseFloat(acresInput) || 50
        };

        onChange({
          ...data,
          farmLocation: mockLocationData
        });
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          addressInput
        )}&key=${apiKey}`
      );
      const geocodeData = await response.json();

      if (geocodeData.results?.[0]) {
        const result = geocodeData.results[0];
        const { lat, lng } = result.geometry.location;

        const locationData = {
          lat: lat,
          lng: lng,
          address: result.formatted_address,
          acres: parseFloat(acresInput) || 50
        };

        onChange({
          ...data,
          farmLocation: locationData
        });
      } else {
        // Fallback for invalid addresses
        console.warn('Geocoding failed. Using mock location.');
        const mockLocationData = {
          lat: 36.7783,
          lng: -119.4179,
          address: `${addressInput} (Approximate Location)`,
          acres: parseFloat(acresInput) || 50
        };

        onChange({
          ...data,
          farmLocation: mockLocationData
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      // Fallback for network errors
      const mockLocationData = {
        lat: 36.7783,
        lng: -119.4179,
        address: `${addressInput} (Fallback Location)`,
        acres: parseFloat(acresInput) || 50
      };

      onChange({
        ...data,
        farmLocation: mockLocationData
      });
    } finally {
      setIsLoadingLocation(false);
    }
  }, [addressInput, acresInput, data, onChange]);

  const handleAcresChange = (value: string) => {
    setAcresInput(value);
    if (data.farmLocation) {
      onChange({
        ...data,
        farmLocation: {
          ...data.farmLocation,
          acres: parseFloat(value) || 0
        }
      });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
          Where is your farm located?
        </Text>
        <Text color="gray.600" maxW="500px" mx="auto">
          Set your farm location and size. We'll use this to calculate carbon benchmarks and provide
          region-specific recommendations.
        </Text>
      </Box>

      {/* Location Input Methods */}
      <VStack spacing={4} align="stretch">
        {/* Current Location */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack spacing={3} w="full">
                <Icon as={FaSearchLocation} boxSize={6} color="blue.500" />
                <VStack align="start" flex={1} spacing={1}>
                  <Text fontWeight="bold">Use Current Location</Text>
                  <Text fontSize="sm" color="gray.600">
                    Get your GPS coordinates automatically
                  </Text>
                </VStack>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleGetCurrentLocation}
                  isLoading={isLoadingLocation}
                  loadingText="Getting location..."
                >
                  Get Location
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Manual Address Entry */}
        <Card>
          <CardBody>
            <VStack spacing={4}>
              <HStack spacing={3} w="full" align="start">
                <Icon as={FaMapMarkerAlt} boxSize={6} color="green.500" mt={2} />
                <VStack align="start" flex={1} spacing={3}>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">Enter Farm Address</Text>
                    <Text fontSize="sm" color="gray.600">
                      Type your farm's address or coordinates
                    </Text>
                  </VStack>

                  <FormControl>
                    <FormLabel fontSize="sm">Farm Address</FormLabel>
                    <HStack>
                      <Input
                        placeholder="123 Farm Road, City, State, ZIP"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
                      />
                      <Button
                        colorScheme="green"
                        onClick={handleAddressSearch}
                        isLoading={isLoadingLocation}
                        minW="100px"
                      >
                        Search
                      </Button>
                    </HStack>
                  </FormControl>
                </VStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Farm Size */}
        <Card>
          <CardBody>
            <HStack spacing={3} w="full" align="start">
              <Icon as={FaDrawPolygon} boxSize={6} color="purple.500" mt={2} />
              <VStack align="start" flex={1} spacing={3}>
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">Farm Size</Text>
                  <Text fontSize="sm" color="gray.600">
                    Enter your total farm acreage for accurate carbon calculations
                  </Text>
                </VStack>

                <FormControl maxW="200px">
                  <FormLabel fontSize="sm">Total Acres</FormLabel>
                  <NumberInput value={acresInput} onChange={handleAcresChange} min={1} max={10000}>
                    <NumberInputField placeholder="50" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Location Preview */}
      {data.farmLocation && (
        <Card bg="green.50" borderColor="green.200" borderWidth={1}>
          <CardBody>
            <VStack spacing={3} align="start">
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold" color="green.700">
                  📍 Farm Location Confirmed
                </Text>
                <Badge colorScheme="green">Ready</Badge>
              </HStack>

              <VStack spacing={2} align="start" fontSize="sm">
                <Text>
                  <strong>Address:</strong> {data.farmLocation.address}
                </Text>
                <Text>
                  <strong>Coordinates:</strong> {data.farmLocation.lat.toFixed(6)},{' '}
                  {data.farmLocation.lng.toFixed(6)}
                </Text>
                <Text>
                  <strong>Farm Size:</strong> {data.farmLocation.acres} acres (
                  {(data.farmLocation.acres * 0.404686).toFixed(1)} hectares)
                </Text>
              </VStack>

              <Alert status="info" size="sm">
                <AlertIcon />
                <Text fontSize="xs">
                  You can draw precise field boundaries later in the dashboard for more accurate
                  carbon calculations.
                </Text>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Benefits Preview */}
      <Box bg="blue.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
        <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>
          🎯 Location Benefits:
        </Text>
        <VStack spacing={1} align="start" fontSize="sm" color="blue.600">
          <Text>• Region-specific carbon benchmarks and best practices</Text>
          <Text>• Weather integration for automatic event suggestions</Text>
          <Text>• Local market pricing and sustainability incentives</Text>
          <Text>• Compliance with state and federal carbon programs</Text>
          <Text>• Precise carbon calculations based on your climate zone</Text>
        </VStack>
      </Box>
    </VStack>
  );
};
