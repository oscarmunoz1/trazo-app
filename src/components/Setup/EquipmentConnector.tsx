import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Badge,
  Icon,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  SimpleGrid
} from '@chakra-ui/react';
import { FaTractor, FaWifi, FaPlug, FaTools } from 'react-icons/fa';

interface EquipmentConnectorProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
}

export const EquipmentConnector: React.FC<EquipmentConnectorProps> = ({
  data,
  onChange,
  onNext
}) => {
  const handleEquipmentToggle = (equipmentType: string, enabled: boolean) => {
    onChange({
      ...data,
      equipment: {
        ...data.equipment,
        [equipmentType]: enabled
      }
    });
  };

  const handleOtherEquipment = (value: string) => {
    const otherEquipment = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    onChange({
      ...data,
      equipment: {
        ...data.equipment,
        other: otherEquipment
      }
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box textAlign="center">
        <Text fontSize="2xl" fontWeight="bold" color="green.600" mb={2}>
          Connect Your Equipment
        </Text>
        <Text color="gray.600" maxW="500px" mx="auto">
          Connect your existing farm equipment for automatic carbon tracking. This is optional - you
          can always add equipment later.
        </Text>
      </Box>

      {/* Major Equipment Brands */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {/* John Deere */}
        <Card
          borderColor={data.equipment?.johnDeere ? 'green.500' : 'gray.200'}
          borderWidth={2}
          bg={data.equipment?.johnDeere ? 'green.50' : 'white'}
        >
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <HStack spacing={3}>
                  <Icon as={FaTractor} boxSize={8} color="green.600" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      John Deere
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      MyJohnDeere API Integration
                    </Text>
                  </VStack>
                </HStack>
                <Switch
                  colorScheme="green"
                  size="lg"
                  isChecked={data.equipment?.johnDeere || false}
                  onChange={(e) => handleEquipmentToggle('johnDeere', e.target.checked)}
                />
              </HStack>

              <VStack spacing={2} align="start" fontSize="sm">
                <Text color="gray.700">
                  <strong>Automatic tracking:</strong>
                </Text>
                <Text>• Fuel consumption from all connected machines</Text>
                <Text>• Operating hours and field coverage</Text>
                <Text>• GPS location and movement patterns</Text>
                <Text>• Maintenance schedules and alerts</Text>
              </VStack>

              {data.equipment?.johnDeere && (
                <Alert status="success" size="sm">
                  <AlertIcon />
                  <Text fontSize="xs">
                    John Deere integration will be configured after setup completion.
                  </Text>
                </Alert>
              )}

              <Badge colorScheme="green" variant="outline" alignSelf="start">
                85% Automation Level
              </Badge>
            </VStack>
          </CardBody>
        </Card>

        {/* Case IH */}
        <Card
          borderColor={data.equipment?.caseIH ? 'red.500' : 'gray.200'}
          borderWidth={2}
          bg={data.equipment?.caseIH ? 'red.50' : 'white'}
        >
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <HStack spacing={3}>
                  <Icon as={FaTractor} boxSize={8} color="red.600" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      Case IH
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      AFS Connect Integration
                    </Text>
                  </VStack>
                </HStack>
                <Switch
                  colorScheme="red"
                  size="lg"
                  isChecked={data.equipment?.caseIH || false}
                  onChange={(e) => handleEquipmentToggle('caseIH', e.target.checked)}
                />
              </HStack>

              <VStack spacing={2} align="start" fontSize="sm">
                <Text color="gray.700">
                  <strong>Automatic tracking:</strong>
                </Text>
                <Text>• Fuel usage and efficiency metrics</Text>
                <Text>• Field operations and timing</Text>
                <Text>• Equipment performance data</Text>
                <Text>• Precision agriculture insights</Text>
              </VStack>

              {data.equipment?.caseIH && (
                <Alert status="success" size="sm">
                  <AlertIcon />
                  <Text fontSize="xs">
                    Case IH integration will be configured after setup completion.
                  </Text>
                </Alert>
              )}

              <Badge colorScheme="red" variant="outline" alignSelf="start">
                75% Automation Level
              </Badge>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Other Equipment */}
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={3}>
              <Icon as={FaTools} boxSize={6} color="purple.500" />
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">
                  Other Equipment
                </Text>
                <Text fontSize="sm" color="gray.600">
                  List other equipment for manual tracking
                </Text>
              </VStack>
            </HStack>

            <FormControl>
              <FormLabel fontSize="sm">Equipment List (comma-separated)</FormLabel>
              <Input
                placeholder="New Holland tractor, Kubota harvester, irrigation system..."
                value={data.equipment?.other?.join(', ') || ''}
                onChange={(e) => handleOtherEquipment(e.target.value)}
              />
            </FormControl>

            <Alert status="info" size="sm">
              <AlertIcon />
              <Text fontSize="xs">
                Other equipment will require manual fuel and usage entry, but you'll still get
                accurate carbon calculations and tracking.
              </Text>
            </Alert>
          </VStack>
        </CardBody>
      </Card>

      {/* No Equipment Option */}
      <Card borderStyle="dashed" borderWidth={2} borderColor="gray.300">
        <CardBody textAlign="center" py={6}>
          <VStack spacing={3}>
            <Icon as={FaPlug} boxSize={8} color="gray.400" />
            <VStack spacing={1}>
              <Text fontWeight="bold" color="gray.600">
                No Equipment to Connect?
              </Text>
              <Text fontSize="sm" color="gray.500">
                No problem! You can track carbon manually and add equipment later.
              </Text>
            </VStack>
            <Badge colorScheme="gray" variant="outline">
              Manual Entry Mode
            </Badge>
          </VStack>
        </CardBody>
      </Card>

      {/* Benefits Summary */}
      <Box bg="blue.50" p={4} borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
        <Text fontSize="sm" fontWeight="bold" color="blue.700" mb={2}>
          🎯 Equipment Integration Benefits:
        </Text>
        <VStack spacing={1} align="start" fontSize="sm" color="blue.600">
          <Text>• Automatic fuel consumption tracking (no manual entry)</Text>
          <Text>• Real-time carbon impact calculations</Text>
          <Text>• Equipment efficiency monitoring and recommendations</Text>
          <Text>• Maintenance scheduling based on carbon optimization</Text>
          <Text>• Detailed operational reports for sustainability compliance</Text>
        </VStack>
      </Box>

      {/* Connection Status */}
      {(data.equipment?.johnDeere ||
        data.equipment?.caseIH ||
        data.equipment?.other?.length > 0) && (
        <Card bg="green.50" borderColor="green.200" borderWidth={1}>
          <CardBody>
            <VStack spacing={3} align="start">
              <HStack justify="space-between" w="full">
                <Text fontWeight="bold" color="green.700">
                  🔧 Equipment Configuration
                </Text>
                <Badge colorScheme="green">Ready</Badge>
              </HStack>

              <VStack spacing={1} align="start" fontSize="sm">
                {data.equipment?.johnDeere && <Text>✅ John Deere API integration enabled</Text>}
                {data.equipment?.caseIH && <Text>✅ Case IH AFS Connect integration enabled</Text>}
                {data.equipment?.other?.length > 0 && (
                  <Text>✅ {data.equipment.other.length} other equipment items listed</Text>
                )}
              </VStack>

              <Text fontSize="xs" color="green.600">
                Equipment connections will be finalized after account setup.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};
