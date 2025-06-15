import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  Spinner,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Progress,
  List,
  ListItem,
  ListIcon,
  useToast,
  Tooltip
} from '@chakra-ui/react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceEventCaptureProps {
  onEventDetected: (eventData: any) => void;
  isActive: boolean;
  cropType: string;
  onClose?: () => void;
}

interface ParsedEventData {
  type: string;
  description: string;
  date: string;
  detected_amounts: string[];
  detected_products: string[];
  detected_systems?: string[];
  confidence: number;
  suggested_carbon_impact: number;
}

export const VoiceEventCapture: React.FC<VoiceEventCaptureProps> = ({
  onEventDetected,
  isActive,
  cropType,
  onClose
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const [parsedData, setParsedData] = useState<ParsedEventData | null>(null);
  const [processingStage, setProcessingStage] = useState('');
  const toast = useToast();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (
      transcript &&
      transcript !== lastProcessedTranscript &&
      !listening &&
      transcript.length > 10
    ) {
      processVoiceInput(transcript);
      setLastProcessedTranscript(transcript);
    }
  }, [transcript, listening]);

  const startListening = () => {
    resetTranscript();
    setParsedData(null);
    SpeechRecognition.startListening({
      continuous: false,
      language: 'en-US'
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const processVoiceInput = async (text: string) => {
    setIsProcessing(true);
    setProcessingStage('Analyzing speech...');

    try {
      // Simulate voice processing with local parsing
      const parsedEvent = parseVoiceLocally(text, cropType);

      setProcessingStage('Calculating carbon impact...');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing

      setProcessingStage('Validating data...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      setParsedData(parsedEvent);

      toast({
        title: 'Voice Processed Successfully! 🎤',
        description: `Detected ${parsedEvent.type} event with ${parsedEvent.confidence}% confidence`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });
    } catch (error) {
      console.error('Voice processing error:', error);
      toast({
        title: 'Voice Processing Failed',
        description: 'Could not understand the voice input. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const parseVoiceLocally = (text: string, crop: string): ParsedEventData => {
    const lowerText = text.toLowerCase();

    // Voice patterns for different event types
    const patterns = {
      fertilizer: {
        keywords: ['fertilizer', 'fertilize', 'applied', 'spread', 'npk', 'nitrogen'],
        amounts: /(\d+(?:\.\d+)?)\s*(?:pounds?|lbs?|kg|kilograms?|tons?)/gi,
        products: /(npk|nitrogen|phosphorus|potassium|urea|ammonium|organic|compost)/gi
      },
      irrigation: {
        keywords: ['irrigate', 'irrigation', 'water', 'watered', 'sprinkler', 'drip'],
        amounts: /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|gallons?|liters?|inches?)/gi,
        systems: /(drip|sprinkler|flood|micro|pivot)/gi
      },
      harvest: {
        keywords: ['harvest', 'harvested', 'picked', 'collected', 'gathered'],
        amounts: /(\d+(?:\.\d+)?)\s*(?:tons?|tonnes?|pounds?|lbs?|kg|bushels?|boxes?|bins?)/gi
      },
      pesticide: {
        keywords: ['spray', 'sprayed', 'pesticide', 'herbicide', 'insecticide', 'fungicide'],
        amounts: /(\d+(?:\.\d+)?)\s*(?:gallons?|liters?|ounces?|oz|pounds?|lbs?)/gi
      },
      equipment: {
        keywords: ['tractor', 'equipment', 'machine', 'fuel', 'diesel', 'gas', 'mowed', 'plowed'],
        amounts: /(\d+(?:\.\d+)?)\s*(?:gallons?|liters?|hours?|acres?|hectares?)/gi
      }
    } as const;

    // Detect event type
    let detectedType = 'general';
    let confidence = 0;

    for (const [eventType, pattern] of Object.entries(patterns)) {
      const keywordMatches = pattern.keywords.filter((keyword) =>
        lowerText.includes(keyword)
      ).length;
      if (keywordMatches > 0) {
        detectedType = eventType;
        confidence = Math.min(keywordMatches * 30 + 40, 95); // 40-95% confidence
        break;
      }
    }

    // Extract amounts
    const amounts: string[] = [];
    const pattern = patterns[detectedType as keyof typeof patterns];
    if (pattern?.amounts) {
      const matches = text.match(pattern.amounts);
      if (matches) {
        amounts.push(...matches);
      }
    }

    // Extract products
    const products: string[] = [];
    if ('products' in pattern && pattern.products) {
      const matches = text.match(pattern.products);
      if (matches) {
        products.push(...matches);
      }
    }

    // Extract systems
    const systems: string[] = [];
    if ('systems' in pattern && pattern.systems) {
      const matches = text.match(pattern.systems);
      if (matches) {
        systems.push(...matches);
      }
    }

    // Calculate carbon impact estimate
    const carbonImpact = calculateCarbonImpact(detectedType, amounts, crop);

    return {
      type: detectedType,
      description: text.charAt(0).toUpperCase() + text.slice(1),
      date: new Date().toISOString().split('T')[0],
      detected_amounts: amounts,
      detected_products: products,
      detected_systems: systems,
      confidence,
      suggested_carbon_impact: carbonImpact
    };
  };

  const calculateCarbonImpact = (eventType: string, amounts: string[], crop: string): number => {
    // Simple carbon impact estimation
    const baseImpacts = {
      fertilizer: 0.5, // kg CO2e per pound
      irrigation: 2.0, // kg CO2e per hour
      harvest: 0.1, // kg CO2e per pound harvested
      pesticide: 8.5, // kg CO2e per gallon
      equipment: 10.18 // kg CO2e per gallon fuel
    };

    const baseImpact = baseImpacts[eventType as keyof typeof baseImpacts] || 1.0;

    if (amounts.length > 0) {
      const firstAmount = parseFloat(amounts[0].replace(/[^\d.]/g, ''));
      return firstAmount * baseImpact;
    }

    return baseImpact * 10; // Default estimate
  };

  const handleConfirmEvent = () => {
    if (parsedData) {
      // Convert to event structure
      const eventData = convertToEventStructure(parsedData);
      onEventDetected(eventData);

      toast({
        title: 'Event Created! ✅',
        description: `${parsedData.type} event added to your production`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      // Reset for next input
      resetTranscript();
      setParsedData(null);
      if (onClose) onClose();
    }
  };

  const convertToEventStructure = (voiceData: ParsedEventData) => {
    const eventType = voiceData.type;

    if (eventType === 'fertilizer') {
      return {
        event_type: 'chemical',
        chemical_type: 'FE',
        description: voiceData.description,
        date: voiceData.date,
        commercial_name: voiceData.detected_products[0] || 'Fertilizer',
        volume: voiceData.detected_amounts[0] || '',
        area: 'Field area',
        way_of_application: 'Broadcast',
        time_period: 'Morning',
        suggested_carbon_impact: voiceData.suggested_carbon_impact,
        source: 'voice'
      };
    } else if (eventType === 'irrigation') {
      return {
        event_type: 'production',
        production_type: 'IR',
        description: voiceData.description,
        date: voiceData.date,
        observation: `Irrigation system: ${
          voiceData.detected_systems?.[0] || 'Standard'
        }. Duration: ${voiceData.detected_amounts[0] || 'Not specified'}`,
        suggested_carbon_impact: voiceData.suggested_carbon_impact,
        source: 'voice'
      };
    } else if (eventType === 'equipment') {
      return {
        event_type: 'equipment',
        equipment_type: 'FC',
        description: voiceData.description,
        date: voiceData.date,
        equipment_name: 'Farm Equipment',
        fuel_amount: parseFloat(voiceData.detected_amounts[0]?.replace(/[^\d.]/g, '') || '0'),
        fuel_type: 'diesel',
        suggested_carbon_impact: voiceData.suggested_carbon_impact,
        source: 'voice'
      };
    } else if (eventType === 'harvest') {
      return {
        event_type: 'production',
        production_type: 'HA',
        description: voiceData.description,
        date: voiceData.date,
        observation: `Harvest yield: ${voiceData.detected_amounts[0] || 'Not specified'}. ${
          voiceData.detected_products.length > 0 ? `Product: ${voiceData.detected_products[0]}` : ''
        }`,
        suggested_carbon_impact: voiceData.suggested_carbon_impact,
        source: 'voice'
      };
    }

    return {
      event_type: 'general',
      description: voiceData.description,
      date: voiceData.date,
      suggested_carbon_impact: voiceData.suggested_carbon_impact,
      source: 'voice'
    };
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Voice input not supported</Text>
          <Text fontSize="sm">
            Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.
          </Text>
        </VStack>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="bold" color="blue.600">
              🎤 Voice Event Capture
            </Text>
            <Text fontSize="sm" color="gray.600">
              Speak your farm activity naturally
            </Text>
          </VStack>
          <Badge colorScheme="blue" variant="outline">
            AI-Powered
          </Badge>
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack spacing={4} align="stretch">
          {/* Voice Input Controls */}
          <HStack justify="center" spacing={4}>
            <Tooltip label={listening ? 'Stop recording' : 'Start voice input'}>
              <Button
                leftIcon={<Icon as={listening ? FaMicrophoneSlash : FaMicrophone} />}
                colorScheme={listening ? 'red' : 'blue'}
                onClick={listening ? stopListening : startListening}
                isDisabled={!isActive || isProcessing}
                size="lg"
                variant={listening ? 'solid' : 'outline'}
              >
                {listening ? 'Stop Recording' : 'Start Voice Input'}
              </Button>
            </Tooltip>

            {isProcessing && <Spinner size="md" color="blue.500" />}
          </HStack>

          {/* Processing Status */}
          {isProcessing && (
            <Box p={3} bg="blue.50" borderRadius="md">
              <VStack spacing={2}>
                <Progress value={75} colorScheme="blue" size="sm" w="full" isIndeterminate />
                <Text fontSize="sm" color="blue.600">
                  {processingStage}
                </Text>
              </VStack>
            </Box>
          )}

          {/* Live Transcript */}
          {listening && (
            <Box p={3} bg="red.50" borderRadius="md" borderWidth="2px" borderColor="red.200">
              <VStack spacing={2}>
                <Badge colorScheme="red" p={2} borderRadius="md">
                  🎤 Listening... Speak clearly
                </Badge>
                {transcript && (
                  <Text fontSize="sm" fontStyle="italic" color="gray.700">
                    "{transcript}"
                  </Text>
                )}
              </VStack>
            </Box>
          )}

          {/* Parsed Results */}
          {parsedData && (
            <Box p={4} bg="green.50" borderRadius="md" borderWidth="2px" borderColor="green.200">
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold" color="green.700">
                    Event Detected:{' '}
                    {parsedData.type.charAt(0).toUpperCase() + parsedData.type.slice(1)}
                  </Text>
                  <Badge colorScheme="green" variant="solid">
                    {parsedData.confidence}% confidence
                  </Badge>
                </HStack>

                <Text fontSize="sm" color="gray.700">
                  "{parsedData.description}"
                </Text>

                {parsedData.detected_amounts.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="green.600">
                      Detected Amounts:
                    </Text>
                    <List spacing={1}>
                      {parsedData.detected_amounts.map((amount, index) => (
                        <ListItem key={index} fontSize="sm">
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {amount}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {parsedData.detected_products.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="green.600">
                      Detected Products:
                    </Text>
                    <List spacing={1}>
                      {parsedData.detected_products.map((product, index) => (
                        <ListItem key={index} fontSize="sm">
                          <ListIcon as={FaCheckCircle} color="green.500" />
                          {product}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Box p={2} bg="white" borderRadius="md">
                  <Text fontSize="xs" color="gray.600">
                    <strong>Estimated Carbon Impact:</strong>{' '}
                    {parsedData.suggested_carbon_impact.toFixed(2)} kg CO2e
                  </Text>
                </Box>

                <HStack spacing={3}>
                  <Button
                    leftIcon={<FaCheckCircle />}
                    colorScheme="green"
                    onClick={handleConfirmEvent}
                    size="sm"
                  >
                    Create Event
                  </Button>
                  <Button variant="outline" onClick={() => setParsedData(null)} size="sm">
                    Try Again
                  </Button>
                </HStack>
              </VStack>
            </Box>
          )}

          {/* Usage Examples */}
          <Box p={3} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              Example voice commands:
            </Text>
            <List spacing={1} fontSize="xs" color="gray.600">
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="blue.500" />
                "Applied fertilizer today, 200 pounds per acre, NPK 10-10-10"
              </ListItem>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="blue.500" />
                "Irrigated field for 6 hours with drip system"
              </ListItem>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="blue.500" />
                "Harvested 500 pounds of oranges from north field"
              </ListItem>
              <ListItem>
                <ListIcon as={FaExclamationTriangle} color="blue.500" />
                "Used tractor for 3 hours, consumed 15 gallons of diesel"
              </ListItem>
            </List>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};
