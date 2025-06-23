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
  Tooltip,
  Select,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue
} from '@chakra-ui/react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaCheckCircle,
  FaExclamationTriangle,
  FaGlobe,
  FaRobot,
  FaLightbulb,
  FaFire,
  FaBolt
} from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useProcessVoiceEventWithAIMutation } from 'store/api/carbonApi';

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
  language_detected?: string;
  processing_time?: number;
  auto_approved?: boolean;
  confidence_factors?: {
    keyword_match: number;
    amount_detection: number;
    context_relevance: number;
    language_clarity: number;
  };
}

interface LanguagePatterns {
  keywords: string[];
  amounts: RegExp;
  products?: RegExp;
  systems?: RegExp;
}

interface MultiLanguagePatterns {
  [eventType: string]: {
    [language: string]: LanguagePatterns;
  };
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
  const [selectedLanguage, setSelectedLanguage] = useState<'en-US' | 'es-ES' | 'pt-BR'>('en-US');
  const [detectedLanguage, setDetectedLanguage] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [autoApprovalThreshold] = useState(85);
  const [processingTime, setProcessingTime] = useState(0);
  const [showConfidenceBreakdown, setShowConfidenceBreakdown] = useState(false);
  const toast = useToast();

  // RTK Query mutation hook for voice processing
  const [processVoiceEventWithAI, { isLoading: isProcessingVoice }] =
    useProcessVoiceEventWithAIMutation();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const multiLanguagePatterns: MultiLanguagePatterns = {
    fertilizer: {
      'en-US': {
        keywords: [
          'fertilizer',
          'fertilize',
          'applied',
          'spread',
          'npk',
          'nitrogen',
          'phosphorus',
          'potassium'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:pounds?|lbs?|kg|kilograms?|tons?|gallons?)/gi,
        products: /(npk|nitrogen|phosphorus|potassium|urea|ammonium|organic|compost|manure)/gi
      },
      'es-ES': {
        keywords: [
          'fertilizante',
          'fertilizar',
          'aplicar',
          'esparcir',
          'npk',
          'nitrógeno',
          'fósforo',
          'potasio'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:libras?|lbs?|kg|kilogramos?|toneladas?|galones?)/gi,
        products: /(npk|nitrógeno|fósforo|potasio|urea|amonio|orgánico|compost|estiércol)/gi
      },
      'pt-BR': {
        keywords: [
          'fertilizante',
          'fertilizar',
          'aplicar',
          'espalhar',
          'npk',
          'nitrogênio',
          'fósforo',
          'potássio'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:libras?|lbs?|kg|quilogramas?|toneladas?|galões?)/gi,
        products: /(npk|nitrogênio|fósforo|potássio|ureia|amônio|orgânico|compostagem|esterco)/gi
      }
    },
    irrigation: {
      'en-US': {
        keywords: ['irrigate', 'irrigation', 'water', 'watered', 'sprinkler', 'drip', 'flood'],
        amounts: /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|gallons?|liters?|inches?|minutes?)/gi,
        systems: /(drip|sprinkler|flood|micro|pivot|center|overhead)/gi
      },
      'es-ES': {
        keywords: ['irrigar', 'irrigación', 'regar', 'agua', 'aspersores', 'goteo', 'inundación'],
        amounts: /(\d+(?:\.\d+)?)\s*(?:horas?|hrs?|galones?|litros?|pulgadas?|minutos?)/gi,
        systems: /(goteo|aspersores|inundación|micro|pivote|central|aéreo)/gi
      },
      'pt-BR': {
        keywords: [
          'irrigar',
          'irrigação',
          'regar',
          'água',
          'aspersores',
          'gotejamento',
          'inundação'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:horas?|hrs?|galões?|litros?|polegadas?|minutos?)/gi,
        systems: /(gotejamento|aspersores|inundação|micro|pivô|central|aéreo)/gi
      }
    },
    pesticide: {
      'en-US': {
        keywords: [
          'spray',
          'sprayed',
          'pesticide',
          'herbicide',
          'insecticide',
          'fungicide',
          'pest control'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:gallons?|liters?|ounces?|oz|pounds?|lbs?|ml)/gi,
        products: /(glyphosate|atrazine|2,4-d|roundup|pesticide|herbicide|insecticide|fungicide)/gi
      },
      'es-ES': {
        keywords: [
          'rociar',
          'rociado',
          'pesticida',
          'herbicida',
          'insecticida',
          'fungicida',
          'control de plagas'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:galones?|litros?|onzas?|oz|libras?|lbs?|ml)/gi,
        products: /(glifosato|atrazina|2,4-d|roundup|pesticida|herbicida|insecticida|fungicida)/gi
      },
      'pt-BR': {
        keywords: [
          'pulverizar',
          'pulverizado',
          'pesticida',
          'herbicida',
          'inseticida',
          'fungicida',
          'controle de pragas'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:galões?|litros?|onças?|oz|libras?|lbs?|ml)/gi,
        products: /(glifosato|atrazina|2,4-d|roundup|pesticida|herbicida|inseticida|fungicida)/gi
      }
    },
    equipment: {
      'en-US': {
        keywords: [
          'tractor',
          'equipment',
          'machine',
          'fuel',
          'diesel',
          'gas',
          'mowed',
          'plowed',
          'cultivated'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:gallons?|liters?|hours?|acres?|hectares?)/gi,
        products: /(diesel|gasoline|fuel|tractor|combine|harvester|plow|cultivator)/gi
      },
      'es-ES': {
        keywords: [
          'tractor',
          'equipo',
          'máquina',
          'combustible',
          'diésel',
          'gasolina',
          'cortado',
          'arado',
          'cultivado'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:galones?|litros?|horas?|acres?|hectáreas?)/gi,
        products: /(diésel|gasolina|combustible|tractor|cosechadora|arado|cultivador)/gi
      },
      'pt-BR': {
        keywords: [
          'trator',
          'equipamento',
          'máquina',
          'combustível',
          'diesel',
          'gasolina',
          'cortado',
          'arado',
          'cultivado'
        ],
        amounts: /(\d+(?:\.\d+)?)\s*(?:galões?|litros?|horas?|acres?|hectares?)/gi,
        products: /(diesel|gasolina|combustível|trator|colheitadeira|arado|cultivador)/gi
      }
    }
  };

  const languageOptions = [
    { value: 'en-US', label: '🇺🇸 English', flag: '🇺🇸' },
    { value: 'es-ES', label: '🇪🇸 Español', flag: '🇪🇸' },
    { value: 'pt-BR', label: '🇧🇷 Português', flag: '🇧🇷' }
  ];

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
    setConfidenceScore(0);
    setProcessingTime(0);
    SpeechRecognition.startListening({
      continuous: false,
      language: selectedLanguage
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const processVoiceInput = async (text: string) => {
    const startTime = Date.now();
    setIsProcessing(true);
    setProcessingStage('🤖 Processing with AI...');

    try {
      setProcessingStage('🧠 Analyzing with OpenAI GPT...');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Use RTK Query mutation for voice processing
      const result = await processVoiceEventWithAI({
        transcript: text,
        crop_type: cropType,
        language: selectedLanguage,
        timestamp: new Date().toISOString()
      }).unwrap();

      setProcessingStage('📊 Calculating carbon impact...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      setProcessingStage('✅ Finalizing AI analysis...');
      await new Promise((resolve) => setTimeout(resolve, 300));

      const endTime = Date.now();
      const processingTimeMs = endTime - startTime;
      setProcessingTime(processingTimeMs);

      // Structure the AI response
      const parsedEvent: ParsedEventData = {
        type: result.type || 'general',
        description: result.description || text,
        date: result.date || new Date().toISOString().split('T')[0],
        detected_amounts: result.detected_amounts || [],
        detected_products: result.detected_products || [],
        detected_systems: result.detected_systems || [],
        confidence: result.confidence || 0,
        suggested_carbon_impact: result.suggested_carbon_impact || 0,
        language_detected: result.language_detected || selectedLanguage,
        processing_time: processingTimeMs,
        auto_approved: result.confidence >= autoApprovalThreshold,
        confidence_factors: result.confidence_factors || {
          keyword_match: Math.round((result.confidence || 0) * 0.4),
          amount_detection: Math.round((result.confidence || 0) * 0.25),
          context_relevance: Math.round((result.confidence || 0) * 0.2),
          language_clarity: Math.round((result.confidence || 0) * 0.15)
        }
      };

      setDetectedLanguage(parsedEvent.language_detected || selectedLanguage);
      setParsedData(parsedEvent);
      setConfidenceScore(parsedEvent.confidence);

      if (parsedEvent.confidence >= autoApprovalThreshold) {
        parsedEvent.auto_approved = true;

        toast({
          title: '🤖 AI Auto-Approved! High Confidence Detected',
          description: `${parsedEvent.confidence}% confidence - Creating event automatically`,
          status: 'success',
          duration: 3000,
          isClosable: true
        });

        setTimeout(() => {
          handleConfirmEvent(parsedEvent);
        }, 2000);
      } else {
        toast({
          title: '🧠 AI Processing Complete!',
          description: `Detected ${parsedEvent.type} event with ${parsedEvent.confidence}% confidence`,
          status: 'info',
          duration: 4000,
          isClosable: true
        });
      }
    } catch (error) {
      console.error('AI voice processing error:', error);

      // Fallback to local processing if AI fails
      setProcessingStage('🔄 Using fallback processing...');
      const fallbackEvent = parseVoiceWithConfidence(text, cropType, selectedLanguage);

      const endTime = Date.now();
      fallbackEvent.processing_time = endTime - startTime;
      fallbackEvent.language_detected = selectedLanguage;

      setParsedData(fallbackEvent);
      setConfidenceScore(fallbackEvent.confidence);

      toast({
        title: 'Voice Processed (Fallback Mode)',
        description: `AI unavailable - used pattern matching with ${fallbackEvent.confidence}% confidence`,
        status: 'warning',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const detectLanguage = (text: string): string => {
    const lowerText = text.toLowerCase();

    const spanishWords = ['fertilizante', 'regar', 'aplicar', 'tractor', 'pesticida'];
    const spanishCount = spanishWords.filter((word) => lowerText.includes(word)).length;

    const portugueseWords = ['fertilizante', 'irrigação', 'aplicar', 'trator', 'pesticida'];
    const portugueseCount = portugueseWords.filter((word) => lowerText.includes(word)).length;

    if (spanishCount > 0) return 'es-ES';
    if (portugueseCount > 0) return 'pt-BR';
    return 'en-US';
  };

  const parseVoiceWithConfidence = (
    text: string,
    crop: string,
    language: string
  ): ParsedEventData => {
    const lowerText = text.toLowerCase();

    const confidenceFactors = {
      keyword_match: 0,
      amount_detection: 0,
      context_relevance: 0,
      language_clarity: 0
    };

    let detectedType = 'general';
    let maxKeywordMatches = 0;

    for (const [eventType, langPatterns] of Object.entries(multiLanguagePatterns)) {
      const pattern = langPatterns[language] || langPatterns['en-US'];
      const keywordMatches = pattern.keywords.filter((keyword) =>
        lowerText.includes(keyword)
      ).length;

      if (keywordMatches > maxKeywordMatches) {
        maxKeywordMatches = keywordMatches;
        detectedType = eventType;
      }
    }

    confidenceFactors.keyword_match = Math.min(maxKeywordMatches * 15, 40);

    const amounts: string[] = [];
    const pattern =
      multiLanguagePatterns[detectedType]?.[language] ||
      multiLanguagePatterns[detectedType]?.['en-US'];
    if (pattern?.amounts) {
      const matches = text.match(pattern.amounts);
      if (matches) {
        amounts.push(...matches);
        confidenceFactors.amount_detection = Math.min(matches.length * 12, 25);
      }
    }

    const products: string[] = [];
    if (pattern?.products) {
      const matches = text.match(pattern.products);
      if (matches) {
        products.push(...matches);
      }
    }

    const systems: string[] = [];
    if (pattern?.systems) {
      const matches = text.match(pattern.systems);
      if (matches) {
        systems.push(...matches);
      }
    }

    const contextWords = ['today', 'yesterday', 'this morning', 'field', 'acre', 'hectare'];
    const contextMatches = contextWords.filter((word) => lowerText.includes(word)).length;
    confidenceFactors.context_relevance = Math.min(contextMatches * 5, 20);

    const wordCount = text.split(' ').length;
    const clarityScore =
      wordCount >= 5 && wordCount <= 30 ? 15 : Math.max(0, 15 - Math.abs(wordCount - 15));
    confidenceFactors.language_clarity = clarityScore;

    const totalConfidence = Object.values(confidenceFactors).reduce((sum, score) => sum + score, 0);

    const carbonImpact = calculateEnhancedCarbonImpact(detectedType, amounts, products, crop);

    return {
      type: detectedType,
      description: text.charAt(0).toUpperCase() + text.slice(1),
      date: new Date().toISOString().split('T')[0],
      detected_amounts: amounts,
      detected_products: products,
      detected_systems: systems,
      confidence: Math.round(totalConfidence),
      suggested_carbon_impact: carbonImpact,
      language_detected: language,
      confidence_factors: confidenceFactors
    };
  };

  const calculateEnhancedCarbonImpact = (
    eventType: string,
    amounts: string[],
    products: string[],
    crop: string
  ): number => {
    const baseImpacts = {
      fertilizer: 0.5,
      irrigation: 2.0,
      harvest: 0.1,
      pesticide: 8.5,
      equipment: 10.18
    };

    const baseImpact = baseImpacts[eventType as keyof typeof baseImpacts] || 1.0;

    let productMultiplier = 1.0;
    if (products.length > 0) {
      const product = products[0].toLowerCase();
      if (product.includes('organic') || product.includes('compost')) {
        productMultiplier = 0.7;
      } else if (product.includes('synthetic') || product.includes('chemical')) {
        productMultiplier = 1.3;
      }
    }

    let cropMultiplier = 1.0;
    if (crop.toLowerCase().includes('organic')) {
      cropMultiplier = 0.8;
    }

    if (amounts.length > 0) {
      const firstAmount = parseFloat(amounts[0].replace(/[^\d.]/g, ''));
      return Math.round(firstAmount * baseImpact * productMultiplier * cropMultiplier * 100) / 100;
    }

    return Math.round(baseImpact * productMultiplier * cropMultiplier * 10 * 100) / 100;
  };

  const handleConfirmEvent = (eventData?: ParsedEventData) => {
    const dataToUse = eventData || parsedData;
    if (dataToUse) {
      const eventStructure = convertToEventStructure(dataToUse);
      onEventDetected(eventStructure);

      toast({
        title: dataToUse.auto_approved ? '🤖 Auto-Created Event! ✅' : 'Event Created! ✅',
        description: `${dataToUse.type} event added to your production`,
        status: 'success',
        duration: 3000,
        isClosable: true
      });

      resetTranscript();
      setParsedData(null);
      setConfidenceScore(0);
      if (onClose) onClose();
    }
  };

  const convertToEventStructure = (voiceData: ParsedEventData) => {
    const eventType = voiceData.type;

    // Base structure with common voice data
    const baseEventStructure = {
      description: voiceData.description,
      date: voiceData.date,
      suggested_carbon_impact: voiceData.suggested_carbon_impact,
      confidence: voiceData.confidence,
      detected_amounts: voiceData.detected_amounts,
      detected_products: voiceData.detected_products,
      detected_systems: voiceData.detected_systems,
      language_detected: voiceData.language_detected,
      confidence_factors: voiceData.confidence_factors,
      source: 'voice',
      type: eventType
    };

    if (eventType === 'fertilizer') {
      return {
        ...baseEventStructure,
        event_type: 'chemical',
        chemical_type: 'FE',
        commercial_name: voiceData.detected_products[0] || 'Voice-detected Fertilizer',
        volume: voiceData.detected_amounts[0] || '50 liters',
        area: voiceData.detected_amounts[1] || '1.5 hectares',
        concentration: '16-16-16', // Default NPK for fertilizers
        way_of_application: 'broadcast',
        time_period: 'Voice application',
        observation: `Voice input: "${
          voiceData.description
        }". Detected amounts: ${voiceData.detected_amounts.join(
          ', '
        )}. Products: ${voiceData.detected_products.join(', ')}.`
      };
    } else if (eventType === 'irrigation') {
      return {
        ...baseEventStructure,
        event_type: 'production',
        production_type: 'IR',
        duration: voiceData.detected_amounts[0] || '2 hours',
        area_covered: voiceData.detected_amounts[1] || '2.0 hectares',
        equipment_used: `${voiceData.detected_systems?.[0] || 'Standard'} irrigation system`,
        observation: `Voice-detected irrigation. System: ${
          voiceData.detected_systems?.[0] || 'Standard'
        }. Duration: ${voiceData.detected_amounts[0] || 'Not specified'}. Area: ${
          voiceData.detected_amounts[1] || 'Field area'
        }.`
      };
    } else if (eventType === 'equipment') {
      return {
        ...baseEventStructure,
        event_type: 'equipment',
        equipment_type: 'FC',
        equipment_name: voiceData.detected_products[0] || 'Farm Equipment',
        fuel_amount: parseFloat(voiceData.detected_amounts[0]?.replace(/[^\d.]/g, '') || '50'),
        fuel_type: 'diesel',
        hours_used: 4,
        area_covered: '1.0 hectares',
        observation: `Voice-detected equipment usage. Fuel: ${
          voiceData.detected_amounts[0] || 'Standard amount'
        }. Equipment: ${voiceData.detected_products[0] || 'Farm machinery'}.`
      };
    } else if (eventType === 'harvest') {
      return {
        ...baseEventStructure,
        event_type: 'production',
        production_type: 'HA',
        duration: '6 hours',
        area_covered: '1.5 hectares',
        equipment_used: 'Harvester, Transport equipment',
        observation: `Voice-detected harvest. Yield: ${
          voiceData.detected_amounts[0] || 'Good yield'
        }. ${
          voiceData.detected_products.length > 0
            ? `Product: ${voiceData.detected_products[0]}`
            : 'Quality harvest completed'
        }.`
      };
    } else if (eventType === 'pesticide') {
      return {
        ...baseEventStructure,
        event_type: 'chemical',
        chemical_type: 'PE',
        commercial_name: voiceData.detected_products[0] || 'Voice-detected Pesticide',
        volume: voiceData.detected_amounts[0] || '20 liters',
        area: voiceData.detected_amounts[1] || '1.0 hectares',
        concentration: '2.5%', // Default concentration for pesticides
        way_of_application: 'spray',
        time_period: 'Voice application',
        observation: `Voice-detected pesticide application. Product: ${
          voiceData.detected_products[0] || 'Pesticide'
        }. Amount: ${voiceData.detected_amounts[0] || 'Standard amount'}.`
      };
    }

    // Default fallback for general events
    return {
      ...baseEventStructure,
      event_type: 'general',
      name: voiceData.type.charAt(0).toUpperCase() + voiceData.type.slice(1) + ' Activity',
      observation: `Voice-detected ${voiceData.type} activity. Confidence: ${voiceData.confidence}%. Details: ${voiceData.description}`
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
    <Card bg={bgColor} borderColor={borderColor}>
      <CardHeader>
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                🎤 Enhanced Voice Event Capture
              </Text>
              <Badge colorScheme="blue" variant="outline">
                Phase 2 AI
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Multi-language support with confidence-based auto-approval
            </Text>
          </VStack>

          <VStack align="end" spacing={2}>
            <HStack>
              <Icon as={FaGlobe} color="blue.500" boxSize={4} />
              <Select
                size="sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'en-US' | 'es-ES' | 'pt-BR')}
                width="120px"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </Select>
            </HStack>
            {detectedLanguage && (
              <Badge colorScheme="green" size="sm">
                Detected: {languageOptions.find((l) => l.value === detectedLanguage)?.flag}
              </Badge>
            )}
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody>
        <VStack spacing={4} align="stretch">
          <HStack justify="center" spacing={4}>
            <Tooltip
              label={listening ? 'Stop recording' : `Start voice input in ${selectedLanguage}`}
            >
              <Button
                leftIcon={<Icon as={listening ? FaMicrophoneSlash : FaMicrophone} />}
                colorScheme={listening ? 'red' : 'blue'}
                onClick={listening ? stopListening : startListening}
                isDisabled={!isActive || isProcessing || isProcessingVoice}
                size="lg"
                variant={listening ? 'solid' : 'outline'}
                _hover={{
                  transform: 'scale(1.05)',
                  boxShadow: 'lg'
                }}
                transition="all 0.2s"
              >
                {listening ? 'Stop Recording' : 'Start Voice Input'}
              </Button>
            </Tooltip>

            {(isProcessing || isProcessingVoice) && (
              <VStack spacing={1}>
                <Spinner size="md" color="blue.500" />
                <Text fontSize="xs" color="gray.500">
                  {processingTime > 0 ? `${processingTime}ms` : 'Processing...'}
                </Text>
              </VStack>
            )}
          </HStack>

          {(isProcessing || isProcessingVoice) && (
            <Box p={3} bg="blue.50" borderRadius="md">
              <VStack spacing={2}>
                <Progress value={75} colorScheme="blue" size="sm" w="full" isIndeterminate />
                <Text fontSize="sm" color="blue.600">
                  {processingStage ||
                    (isProcessingVoice ? '🤖 Processing with AI...' : 'Processing...')}
                </Text>
              </VStack>
            </Box>
          )}

          {listening && (
            <Box p={3} bg="red.50" borderRadius="md" borderWidth="2px" borderColor="red.200">
              <VStack spacing={2}>
                <Badge colorScheme="red" p={2} borderRadius="md">
                  🎤 Listening in {languageOptions.find((l) => l.value === selectedLanguage)?.flag}{' '}
                  {selectedLanguage}...
                </Badge>
                {transcript && (
                  <Text fontSize="sm" fontStyle="italic" color="gray.700">
                    "{transcript}"
                  </Text>
                )}
              </VStack>
            </Box>
          )}

          {parsedData && (
            <Box p={4} bg="green.50" borderRadius="md" borderWidth="2px" borderColor="green.200">
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="bold" color="green.700">
                    Event Detected:{' '}
                    {parsedData.type.charAt(0).toUpperCase() + parsedData.type.slice(1)}
                  </Text>
                  <HStack>
                    <CircularProgress
                      value={parsedData.confidence}
                      size="40px"
                      color={
                        parsedData.confidence >= 85
                          ? 'green.400'
                          : parsedData.confidence >= 70
                          ? 'yellow.400'
                          : 'red.400'
                      }
                    >
                      <CircularProgressLabel fontSize="xs">
                        {parsedData.confidence}%
                      </CircularProgressLabel>
                    </CircularProgress>

                    {parsedData.confidence >= autoApprovalThreshold && (
                      <Badge colorScheme="green" variant="solid">
                        <HStack spacing={1}>
                          <Icon as={FaRobot} boxSize={3} />
                          <Text>Auto-Approved</Text>
                        </HStack>
                      </Badge>
                    )}
                  </HStack>
                </HStack>

                <Text fontSize="sm" color="gray.700">
                  "{parsedData.description}"
                </Text>

                <HStack justify="space-between">
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon={<Icon as={FaLightbulb} />}
                    onClick={() => setShowConfidenceBreakdown(!showConfidenceBreakdown)}
                  >
                    {showConfidenceBreakdown ? 'Hide' : 'Show'} Confidence Details
                  </Button>

                  {parsedData.processing_time && (
                    <Badge colorScheme="blue" size="sm">
                      <HStack spacing={1}>
                        <Icon as={FaBolt} boxSize={3} />
                        <Text>{parsedData.processing_time}ms</Text>
                      </HStack>
                    </Badge>
                  )}
                </HStack>

                {showConfidenceBreakdown && parsedData.confidence_factors && (
                  <Box p={3} bg="white" borderRadius="md" borderWidth="1px">
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      Confidence Breakdown:
                    </Text>
                    <VStack spacing={1} align="stretch">
                      {Object.entries(parsedData.confidence_factors).map(([factor, score]) => (
                        <HStack key={factor} justify="space-between">
                          <Text fontSize="xs" color="gray.600">
                            {factor.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
                          </Text>
                          <Badge
                            colorScheme={score >= 15 ? 'green' : score >= 10 ? 'yellow' : 'red'}
                            size="sm"
                          >
                            {score}/40
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}

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
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" color="gray.600">
                      <strong>Estimated Carbon Impact:</strong>{' '}
                      {parsedData.suggested_carbon_impact.toFixed(2)} kg CO2e
                    </Text>
                    {parsedData.language_detected && (
                      <Badge colorScheme="blue" size="xs">
                        {
                          languageOptions.find((l) => l.value === parsedData.language_detected)
                            ?.flag
                        }{' '}
                        {parsedData.language_detected}
                      </Badge>
                    )}
                  </Flex>
                </Box>

                <HStack spacing={3}>
                  {!parsedData.auto_approved && (
                    <Button
                      leftIcon={<FaCheckCircle />}
                      colorScheme="green"
                      onClick={() => handleConfirmEvent()}
                      size="sm"
                      flex={1}
                    >
                      Create Event
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setParsedData(null)}
                    size="sm"
                    flex={parsedData.auto_approved ? 1 : undefined}
                  >
                    {parsedData.auto_approved ? 'Cancel Auto-Creation' : 'Try Again'}
                  </Button>
                </HStack>

                {parsedData.auto_approved && (
                  <Box p={2} bg="green.100" borderRadius="md" textAlign="center">
                    <Text fontSize="sm" color="green.700">
                      🤖 Creating event automatically in 2 seconds...
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          )}

          <Box p={3} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
              Example voice commands ({selectedLanguage}):
            </Text>
            <List spacing={1} fontSize="xs" color="gray.600">
              {selectedLanguage === 'en-US' && (
                <>
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
                    "Used tractor for 3 hours, consumed 15 gallons of diesel"
                  </ListItem>
                </>
              )}
              {selectedLanguage === 'es-ES' && (
                <>
                  <ListItem>
                    <ListIcon as={FaExclamationTriangle} color="blue.500" />
                    "Apliqué fertilizante hoy, 200 libras por acre, NPK 10-10-10"
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaExclamationTriangle} color="blue.500" />
                    "Regué el campo por 6 horas con sistema de goteo"
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaExclamationTriangle} color="blue.500" />
                    "Usé el tractor por 3 horas, consumí 15 galones de diésel"
                  </ListItem>
                </>
              )}
              {selectedLanguage === 'pt-BR' && (
                <>
                  <ListItem>
                    <ListIcon as={FaExclamationTriangle} color="blue.500" />
                    "Apliquei fertilizante hoje, 200 libras por acre, NPK 10-10-10"
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaExclamationTriangle} color="blue.500" />
                    "Irrigei o campo por 6 horas com sistema de gotejamento"
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaExclamationTriangle} color="blue.500" />
                    "Usei o trator por 3 horas, consumi 15 galões de diesel"
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};
