import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Grid,
  Icon,
  Badge,
  Box,
  Divider,
  IconButton,
  useToast,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  Skeleton
} from '@chakra-ui/react';
import {
  FaSeedling,
  FaTint,
  FaSprayCan,
  FaCut,
  FaLeaf,
  FaMicrophone,
  FaMicrophoneSlash,
  FaCamera,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaClock,
  FaRuler,
  FaTractor,
  FaFlask,
  FaTools,
  FaBug,
  FaChartLine,
  FaPlus,
  FaRobot,
  FaLightbulb
} from 'react-icons/fa';
import { StandardButton } from 'components/Design';
import { VoiceEventCapture } from 'components/Events/VoiceEventCapture';
// @ts-ignore - JS file import
import { useCreateEventMutation } from 'store/api/historyApi.js';
import {
  useGetEventTemplatesByCropTypeQuery,
  useGetAIEventSuggestionsQuery
} from 'store/api/carbonApi';
import { useGetCropTypesDropdownQuery } from 'store/api/companyApi';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// Import real USDA API hooks for enhanced suggestions
import {
  useGetUSDAEmissionFactorsQuery,
  useGetUSDABenchmarkComparisonQuery
} from 'store/api/carbonApi';
import USDASmartSuggestions from 'components/Events/USDASmartSuggestions';

interface EventTemplate {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  carbonImpact: number;
  costEstimate: number;
  efficiency_tip: string;
  typical_duration: string;
  carbonCategory: 'high' | 'medium' | 'low';
  sustainabilityScore: number;
  qrVisibility: 'high' | 'medium' | 'low';
  type: string;
  timing?: string;
  usage_count?: number;
}

interface QuickAddEventProps {
  isOpen: boolean;
  onClose: () => void;
  cropType: string;
  onEventAdded?: (event: any) => void;
}

const QuickAddEvent: React.FC<QuickAddEventProps> = ({
  isOpen,
  onClose,
  cropType,
  onEventAdded
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showVoiceCapture, setShowVoiceCapture] = useState(false);
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [eventDate, setEventDate] = useState(new Date().toISOString().slice(0, 16));
  const [eventDescription, setEventDescription] = useState('');
  const [eventObservations, setEventObservations] = useState('');
  const [applicationRate, setApplicationRate] = useState('');
  const [duration, setDuration] = useState('');
  const [templateSuggestions, setTemplateSuggestions] = useState<EventTemplate[]>([]);
  const [showTemplateSuggestions, setShowTemplateSuggestions] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // RTK Query mutation and Redux state
  const [createEvent, { isLoading: isCreatingEvent }] = useCreateEventMutation();
  const currentCompany = useSelector((state: any) => state.company.currentCompany);
  const { establishmentId, parcelId } = useParams();

  // Get crop types and find the crop type ID for the current production
  const { data: cropTypesData } = useGetCropTypesDropdownQuery();

  // Real USDA data for enhanced suggestions
  const farmState = 'CA'; // TODO: Get from establishment data

  // Real USDA API queries for enhanced event suggestions
  const { data: realUSDAData } = useGetUSDAEmissionFactorsQuery(
    {
      crop_type: cropType.toLowerCase(),
      state: farmState
    },
    {
      skip: !cropType || !isOpen // Only fetch when modal is open
    }
  );

  const { data: benchmarkData } = useGetUSDABenchmarkComparisonQuery(
    {
      carbon_intensity: 0.001, // Default value for suggestions
      crop_type: cropType.toLowerCase(),
      state: farmState
    },
    {
      skip: !cropType || !isOpen // Only fetch when modal is open
    }
  );

  // Find the crop type ID based on the cropType prop
  const currentCropTypeId = React.useMemo(() => {
    if (!cropTypesData || !cropType) return null;

    // Try to find by exact name match first
    let matchingCropType = cropTypesData.find(
      (ct: any) => ct.name.toLowerCase() === cropType.toLowerCase()
    );

    // If not found, try to find by category or slug
    if (!matchingCropType) {
      matchingCropType = cropTypesData.find(
        (ct: any) =>
          ct.category.toLowerCase().includes(cropType.toLowerCase()) ||
          ct.slug.toLowerCase().includes(cropType.toLowerCase())
      );
    }

    return matchingCropType?.id || null;
  }, [cropTypesData, cropType]);

  // Get event templates from database for the current crop type
  const { data: dbEventTemplatesData } = useGetEventTemplatesByCropTypeQuery(
    { cropTypeId: currentCropTypeId || 0 },
    { skip: !currentCropTypeId }
  );

  const getCurrentSeason = (month: number): string => {
    if (month >= 12 || month <= 2) return 'winter';
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  };

  // 🤖 AI-Powered Smart Event Suggestions (Backend now handles recent events)
  const { data: aiSuggestionsData, isLoading: isLoadingAISuggestions } =
    useGetAIEventSuggestionsQuery(
      {
        crop_type: cropType,
        location: farmState,
        season: getCurrentSeason(new Date().getMonth() + 1),
        // recent_events removed - backend fetches directly from database
        farm_context: {
          establishment_id: establishmentId,
          parcel_id: parcelId,
          current_month: new Date().getMonth() + 1
        }
      },
      {
        skip: !cropType || !isOpen // Only fetch when modal is open
      }
    );

  // 🆕 Phase 2: Smart template suggestions based on timing and recent events
  useEffect(() => {
    if (isOpen) {
      // Use AI suggestions if available, otherwise fall back to database templates
      if (aiSuggestionsData?.suggestions) {
        getAISmartSuggestions();
      } else if (dbEventTemplatesData?.templates) {
        getSmartTemplateSuggestions();
      }
    }
  }, [isOpen, aiSuggestionsData, dbEventTemplatesData]);

  // 🆕 Phase 2: Generate smart template suggestions
  const getSmartTemplateSuggestions = async () => {
    if (!dbEventTemplatesData?.templates) return;

    const currentMonth = new Date().getMonth() + 1;
    const currentSeason = getCurrentSeason(currentMonth);

    // Filter templates by timing and usage patterns
    const suggestions = dbEventTemplatesData.templates
      .filter((template) => {
        // Seasonal relevance
        const isSeasonallyRelevant =
          template.timing?.toLowerCase().includes(currentSeason) ||
          template.timing?.toLowerCase().includes('year-round');

        // High usage templates (popular ones) - based on sustainability score
        const isPopular = (template.sustainability_score || 0) > 7;

        // High carbon impact visibility (important for QR)
        const isHighVisibility = template.qr_visibility === 'high';

        return isSeasonallyRelevant || isPopular || isHighVisibility;
      })
      .sort((a, b) => {
        // Sort by relevance score
        const aScore =
          (a.sustainability_score || 0) +
          (a.qr_visibility === 'high' ? 3 : a.qr_visibility === 'medium' ? 2 : 1) +
          (a.carbon_impact || 0) / 10;
        const bScore =
          (b.sustainability_score || 0) +
          (b.qr_visibility === 'high' ? 3 : b.qr_visibility === 'medium' ? 2 : 1) +
          (b.carbon_impact || 0) / 10;
        return bScore - aScore;
      })
      .slice(0, 3); // Top 3 suggestions

    // Convert to EventTemplate format
    const templateSuggestions = suggestions.map((template) => ({
      id: `suggested-${template.id}`,
      name: `⭐ ${template.name}`,
      icon: getEventIcon(template.event_type),
      color: getEventColor(template.event_type, template.carbon_category),
      description: `${template.description} (Suggested for ${currentSeason})`,
      carbonImpact: template.carbon_impact || 0,
      costEstimate: template.cost_estimate || 0,
      efficiency_tip: template.efficiency_tips || 'Smart suggestion based on timing and usage',
      typical_duration: template.typical_duration || '2-3 hours',
      carbonCategory: template.carbon_category as 'high' | 'medium' | 'low',
      sustainabilityScore: template.sustainability_score || 7,
      qrVisibility: template.qr_visibility as 'high' | 'medium' | 'low',
      type: template.type || template.event_type
    }));

    setTemplateSuggestions(templateSuggestions);
    setShowTemplateSuggestions(templateSuggestions.length > 0);
  };

  // 🤖 NEW: Generate AI-powered smart suggestions
  const getAISmartSuggestions = () => {
    if (!aiSuggestionsData?.suggestions) return;

    const aiSuggestions = aiSuggestionsData.suggestions.map((suggestion, index) => ({
      id: `ai-${suggestion.id}-${index}`,
      name: `🤖 ${suggestion.name}`,
      icon: getEventIconFromCategory(suggestion.category),
      color: getPriorityColor(suggestion.priority),
      description: suggestion.description,
      carbonImpact: suggestion.carbon_impact,
      costEstimate: 0,
      efficiency_tip: suggestion.efficiency_tips.join('. ') || suggestion.reasoning,
      typical_duration: suggestion.estimated_duration,
      carbonCategory: getCarbonCategoryFromImpact(suggestion.carbon_impact),
      sustainabilityScore: Math.round(suggestion.confidence / 10),
      qrVisibility:
        suggestion.priority === 'high'
          ? 'high'
          : suggestion.priority === 'medium'
          ? 'medium'
          : 'low',
      type: suggestion.category,
      timing: suggestion.timing_relevance,
      usage_count: 0,
      aiPowered: true,
      confidence: suggestion.confidence,
      reasoning: suggestion.reasoning,
      bestPractices: suggestion.best_practices
    })) as EventTemplate[];

    setTemplateSuggestions(aiSuggestions);
    setShowTemplateSuggestions(aiSuggestions.length > 0);
  };

  // Helper function to get icon from AI category
  const getEventIconFromCategory = (category: string) => {
    switch (category) {
      case 'fertilization':
        return FaSeedling;
      case 'irrigation':
        return FaTint;
      case 'pest_control':
        return FaSprayCan;
      case 'harvest':
        return FaCut;
      case 'equipment':
        return FaTractor;
      case 'soil_management':
        return FaFlask;
      default:
        return FaLeaf;
    }
  };

  // Helper function to get color from priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  // Helper function to get carbon category from impact
  const getCarbonCategoryFromImpact = (impact: number): 'high' | 'medium' | 'low' => {
    if (Math.abs(impact) > 30) return 'high';
    if (Math.abs(impact) > 10) return 'medium';
    return 'low';
  };

  // 🆕 Phase 2: Track template usage when selected
  const handleTemplateSelect = (template: EventTemplate) => {
    console.log('Template selected:', template.id, 'Current selected:', selectedTemplate?.id);
    setSelectedTemplate(template);

    // Track template usage analytics
    if (template.id.startsWith('db-') || template.id.startsWith('suggested-')) {
      trackTemplateUsage(template.id);
    }

    // Pre-populate form fields with enhanced template data
    setEventDescription(`${template.name} - ${template.description}`);
    setApplicationRate(getDefaultApplicationRate(template));
    setDuration(template.typical_duration);
    setEventObservations(
      `Carbon Impact: ${template.carbonImpact} kg CO₂. Sustainability Score: ${template.sustainabilityScore}/10. QR Visibility: ${template.qrVisibility}. Efficiency Tip: ${template.efficiency_tip}`
    );

    // Show success feedback
    toast({
      title: '🎯 Template Selected',
      description: `${template.name} ready to create with optimized settings`,
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  // 🆕 Enhanced application rate defaults
  const getDefaultApplicationRate = (template: EventTemplate): string => {
    if (template.id.includes('fertilization') || template.id.includes('fertilizer'))
      return '200 lbs/acre';
    if (template.id.includes('irrigation')) return 'Variable by system';
    if (template.id.includes('pest_control') || template.id.includes('pesticide'))
      return '1-2 gallons/acre';
    if (template.id.includes('pruning')) return 'Per tree/plant';
    if (template.id.includes('bloom_nutrition')) return '150-180 lbs/acre';

    // Check database template for typical amounts
    if (template.id.startsWith('db-') || template.id.startsWith('suggested-')) {
      const dbTemplate = dbEventTemplatesData?.templates.find(
        (t) => `db-${t.id}` === template.id || `suggested-${t.id}` === template.id
      );
      if (dbTemplate?.typical_amounts?.application_rate) {
        return dbTemplate.typical_amounts.application_rate;
      }
    }

    return 'As needed';
  };

  // 🆕 Template usage tracking
  const trackTemplateUsage = async (templateId: string) => {
    try {
      // Extract actual template ID from prefixed ID
      const actualId = templateId.replace(/^(db-|suggested-)/, '');

      // Call backend to increment usage counter
      await fetch(`/api/carbon/event-templates/${actualId}/use_template/`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Template usage tracking failed:', error);
      // Non-critical error, don't show to user
    }
  };

  // Reset form when modal opens
  const resetForm = () => {
    setSelectedTemplate(null);
    setShowDetailedForm(false);
    setShowVoiceCapture(false);
    setEventDate(new Date().toISOString().slice(0, 16));
    setEventDescription('');
    setEventObservations('');
    setApplicationRate('');
    setDuration('');
  };

  // Reset when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Helper function to map event types to icons
  const getEventIcon = (eventType: string) => {
    const iconMap: Record<string, any> = {
      fertilization: FaSeedling,
      irrigation: FaTint,
      pest_control: FaSprayCan,
      pruning: FaCut,
      planting: FaSeedling,
      harvest: FaLeaf,
      soil_management: FaFlask,
      equipment: FaTractor,
      weather_protection: FaCamera,
      certification: FaChartLine,
      monitoring: FaTools,
      other: FaBug
    };
    return iconMap[eventType] || FaBug;
  };

  // Helper function to map event types to colors
  const getEventColor = (eventType: string, carbonCategory?: string) => {
    // Use carbon category for color if available
    if (carbonCategory) {
      const colorMap: Record<string, string> = {
        high: 'red',
        medium: 'orange',
        low: 'green',
        negative: 'teal',
        neutral: 'gray'
      };
      return colorMap[carbonCategory] || 'blue';
    }

    // Fallback to event type colors
    const colorMap: Record<string, string> = {
      fertilization: 'green',
      irrigation: 'blue',
      pest_control: 'orange',
      pruning: 'purple',
      planting: 'green',
      harvest: 'yellow',
      soil_management: 'brown',
      equipment: 'gray',
      weather_protection: 'cyan',
      certification: 'teal',
      monitoring: 'pink',
      other: 'gray'
    };
    return colorMap[eventType] || 'blue';
  };

  // Smart event templates based on crop type - CARBON-FOCUSED
  const getEventTemplates = (crop: string): EventTemplate[] => {
    // General templates (keep existing ones)
    const baseTemplates = [
      {
        id: 'fertilization',
        name: 'Fertilización',
        icon: FaSeedling,
        color: 'green',
        description: 'Aplicación de fertilizante',
        carbonImpact: 45,
        costEstimate: 180,
        efficiency_tip: 'Soil testing can reduce fertilizer needs by 20-30%',
        typical_duration: '2-3 hours',
        carbonCategory: 'high' as const,
        sustainabilityScore: 7,
        qrVisibility: 'high' as const,
        type: 'fertilization'
      },
      {
        id: 'irrigation',
        name: 'Riego',
        icon: FaTint,
        color: 'blue',
        description: 'Sistema de riego',
        carbonImpact: 25,
        costEstimate: 120,
        efficiency_tip: 'Smart irrigation controllers can save 25% energy',
        typical_duration: '1-2 hours setup',
        carbonCategory: 'medium' as const,
        sustainabilityScore: 8,
        qrVisibility: 'medium' as const,
        type: 'irrigation'
      },
      {
        id: 'pest_control',
        name: 'Control de Plagas',
        icon: FaSprayCan,
        color: 'orange',
        description: 'Aplicación de pesticidas',
        carbonImpact: 35,
        costEstimate: 150,
        efficiency_tip: 'IPM practices can reduce pesticide use by 40%',
        typical_duration: '3-4 hours',
        carbonCategory: 'high' as const,
        sustainabilityScore: 6,
        qrVisibility: 'high' as const,
        type: 'pest_control'
      },
      {
        id: 'pruning',
        name: 'Poda',
        icon: FaCut,
        color: 'purple',
        description: 'Poda de plantas',
        carbonImpact: 20,
        costEstimate: 200,
        efficiency_tip: 'Precision pruning reduces fuel consumption by 15%',
        typical_duration: '4-6 hours',
        carbonCategory: 'low' as const,
        sustainabilityScore: 9,
        qrVisibility: 'low' as const,
        type: 'pruning'
      }
    ];

    // Add crop-specific templates from database
    const dbTemplates: EventTemplate[] = [];
    if (dbEventTemplatesData?.templates) {
      dbEventTemplatesData.templates.forEach((template) => {
        dbTemplates.push({
          id: `db-${template.id}`,
          name: template.name,
          icon: getEventIcon(template.event_type),
          color: getEventColor(template.event_type, template.carbon_category),
          description: template.description,
          carbonImpact: template.carbon_impact || 0,
          costEstimate: template.cost_estimate || 0,
          efficiency_tip:
            template.efficiency_tips || 'Database-sourced template for optimal results',
          typical_duration: template.typical_duration || '2-3 hours',
          carbonCategory: template.carbon_category as 'high' | 'medium' | 'low',
          sustainabilityScore: template.sustainability_score || 7,
          qrVisibility: template.qr_visibility as 'high' | 'medium' | 'low',
          type: template.type || template.event_type
        });
      });
    }

    // Combine general templates with crop-specific ones
    const allTemplates = [...baseTemplates, ...dbTemplates];

    // Customize based on crop type - CARBON-OPTIMIZED (keep existing logic)
    if (crop.toLowerCase().includes('citrus')) {
      allTemplates.push({
        id: 'bloom_nutrition',
        name: 'Nutrición de Floración',
        icon: FaLeaf,
        color: 'pink',
        description: 'Nutrición específica para floración',
        carbonImpact: 30,
        costEstimate: 160,
        efficiency_tip: 'Timing-specific nutrition improves efficiency by 20%',
        typical_duration: '2-3 hours',
        carbonCategory: 'medium' as const,
        sustainabilityScore: 8,
        qrVisibility: 'medium' as const,
        type: 'bloom_nutrition'
      });
    }

    return allTemplates;
  };

  const eventTemplates = getEventTemplates(cropType);

  const handleShowDetails = () => {
    setShowDetailedForm(true);
  };

  const handleBackToTemplates = () => {
    setShowDetailedForm(false);
  };

  const handleTemplateCreate = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    try {
      // Convert template to backend event format
      const eventTypeFields = getTemplateEventFields(selectedTemplate);

      const backendEventData = {
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parseInt(parcelId || '0'),
        parcels: [parseInt(parcelId || '0')],
        event_type: getTemplateEventType(selectedTemplate),
        date: new Date().toISOString(),
        description: `${selectedTemplate.name} - Carbon Impact: ${selectedTemplate.carbonImpact} kg CO₂`,
        album: { images: [] },
        observation: `Template-created event. Sustainability Score: ${selectedTemplate.sustainabilityScore}/10. QR Visibility: ${selectedTemplate.qrVisibility}. Efficiency Tip: ${selectedTemplate.efficiency_tip}`,
        template_used: selectedTemplate.id,
        template_name: selectedTemplate.name,
        carbon_impact_estimate: selectedTemplate.carbonImpact,
        sustainability_score: selectedTemplate.sustainabilityScore,
        ...eventTypeFields
      };

      await createEvent(backendEventData).unwrap();

      toast({
        title: '🌱 Carbon Event Created Successfully!',
        description: `${selectedTemplate.name} added with ${selectedTemplate.carbonImpact} kg CO₂ impact. Visible to consumers via QR codes.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      if (onEventAdded) {
        onEventAdded(selectedTemplate);
      }

      handleClose();
    } catch (error) {
      console.error('Error creating template event:', error);
      toast({
        title: 'Error Creating Carbon Event',
        description: 'Failed to create carbon event. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Helper functions for voice data conversion
  const getEventTypeFromVoiceData = (eventData: any): number => {
    // Handle both the old format (event_type: 'irrigation') and new format (event_type: 'production')
    const eventType = eventData.event_type;

    console.log('Voice event type mapping:', eventType, eventData);

    if (eventType === 'production' || eventType === 'irrigation') {
      return 2; // Production Event
    } else if (
      eventType === 'chemical' ||
      eventType === 'fertilizer' ||
      eventType === 'pesticide'
    ) {
      return 1; // Chemical Event
    } else if (eventType === 'equipment') {
      return 4; // Equipment Event
    } else if (eventType === 'weather') {
      return 0; // Weather Event
    } else if (eventType === 'general') {
      // Check if this is actually a production event that was misclassified
      if (
        eventData.production_type ||
        eventData.description?.toLowerCase().includes('irrigat') ||
        eventData.description?.toLowerCase().includes('harvest') ||
        eventData.description?.toLowerCase().includes('plant') ||
        eventData.description?.toLowerCase().includes('prun')
      ) {
        console.log('Reclassifying general event as production based on content');
        return 2; // Production Event
      }
      return 3; // General Event
    }

    return 2; // Default to Production instead of General
  };

  const convertVoiceDataToEventFields = (eventData: any): any => {
    const eventType = eventData.event_type;

    console.log('Converting voice data fields:', eventType, eventData);

    // Handle the actual data structure from VoiceEventCapture
    if (eventType === 'production') {
      // For production events, use the production_type field
      return {
        type: eventData.production_type || 'IR', // Use production_type from VoiceEventCapture
        observation:
          eventData.observation ||
          `Production activity: ${eventData.description || 'Not specified'}`
      };
    } else if (eventType === 'chemical') {
      // For chemical events, use the chemical_type field
      return {
        type: eventData.chemical_type || 'FE', // Use chemical_type from VoiceEventCapture
        commercial_name: eventData.commercial_name || 'Chemical Product',
        volume: eventData.volume || '',
        way_of_application: eventData.way_of_application || 'broadcast',
        time_period: eventData.time_period || 'morning'
      };
    } else if (eventType === 'equipment') {
      // For equipment events, use the equipment_type field
      return {
        type: eventData.equipment_type || 'FC', // Use equipment_type from VoiceEventCapture
        equipment_name: eventData.equipment_name || 'Farm Equipment',
        fuel_amount: eventData.fuel_amount || 0,
        fuel_type: eventData.fuel_type || 'diesel'
      };
    } else if (eventType === 'general') {
      // Handle misclassified general events
      if (
        eventData.production_type ||
        eventData.description?.toLowerCase().includes('irrigat') ||
        eventData.description?.toLowerCase().includes('harvest') ||
        eventData.description?.toLowerCase().includes('plant') ||
        eventData.description?.toLowerCase().includes('prun')
      ) {
        console.log('Converting misclassified general event to production fields');
        return {
          type: eventData.production_type || 'IR', // Default to irrigation
          observation:
            eventData.observation ||
            `Production activity: ${eventData.description || 'Not specified'}`
        };
      }
      // For actual general events, provide the required name field
      return {
        name: eventData.name || `${eventData.description || 'Voice Event'}`.substring(0, 50),
        observation: eventData.observation || eventData.description || 'Voice-detected activity'
      };
    }

    // Fallback for old format or unknown types
    if (eventData.event_type === 'fertilizer') {
      return {
        type: 'FE',
        commercial_name: eventData.detected_products?.[0] || 'Fertilizer',
        volume: eventData.detected_amounts?.[0] || '',
        way_of_application: 'broadcast',
        time_period: 'morning'
      };
    } else if (eventData.event_type === 'irrigation') {
      return {
        type: 'IR',
        observation: `Duration: ${eventData.detected_amounts?.[0] || 'Not specified'}. System: ${
          eventData.detected_systems?.[0] || 'Standard'
        }`
      };
    }

    return {};
  };

  // Helper functions for template data conversion
  const getTemplateEventType = (template: EventTemplate): number => {
    // Handle database templates (prefixed with 'db-')
    if (template.id.startsWith('db-')) {
      // For database templates, we need to get the backend event type
      // This should be stored in the database template data
      const dbTemplate = dbEventTemplatesData?.templates.find((t) => `db-${t.id}` === template.id);
      if (dbTemplate?.backend_event_type !== undefined) {
        return dbTemplate.backend_event_type;
      }
    }

    // Handle AI suggestions (prefixed with 'ai-')
    if (template.id.startsWith('ai-')) {
      // Map AI categories to backend event types
      const aiCategory = template.type?.toLowerCase();
      if (
        aiCategory?.includes('fertilizer') ||
        aiCategory?.includes('pesticide') ||
        aiCategory?.includes('chemical')
      ) {
        return 1; // Chemical
      } else if (
        aiCategory?.includes('irrigation') ||
        aiCategory?.includes('harvest') ||
        aiCategory?.includes('pruning') ||
        aiCategory?.includes('planting') ||
        aiCategory?.includes('production')
      ) {
        return 2; // Production
      } else if (aiCategory?.includes('equipment') || aiCategory?.includes('machinery')) {
        return 4; // Equipment
      } else if (aiCategory?.includes('weather') || aiCategory?.includes('climate')) {
        return 0; // Weather
      }
      return 3; // General
    }

    // Map template types to backend event types (existing logic)
    if (template.id.includes('fertilizer') || template.id.includes('pesticide')) {
      return 1; // Chemical
    } else if (
      template.id.includes('irrigation') ||
      template.id.includes('harvest') ||
      template.id.includes('pruning')
    ) {
      return 2; // Production
    } else if (template.id.includes('equipment') || template.id.includes('tractor')) {
      return 4; // Equipment
    } else if (template.id.includes('weather') || template.id.includes('frost')) {
      return 0; // Weather
    }
    return 3; // General
  };

  const getTemplateEventFields = (template: EventTemplate): any => {
    // Handle database templates (prefixed with 'db-')
    if (template.id.startsWith('db-')) {
      const dbTemplate = dbEventTemplatesData?.templates.find((t) => `db-${t.id}` === template.id);
      if (dbTemplate?.backend_event_fields) {
        return {
          ...dbTemplate.backend_event_fields,
          // Add typical amounts if available
          ...(dbTemplate.typical_amounts || {})
        };
      }
    }

    // Handle AI suggestions (prefixed with 'ai-')
    if (template.id.startsWith('ai-')) {
      const eventType = getTemplateEventType(template);
      const aiCategory = template.type?.toLowerCase();

      // Map AI suggestions to appropriate backend fields based on event type
      if (eventType === 1) {
        // Chemical
        return {
          type: 'FE', // Default to fertilizer
          commercial_name: template.name.includes('Fertilizer')
            ? 'AI-Suggested Fertilizer'
            : 'AI-Suggested Chemical',
          volume: '50 lbs/acre', // Default amount
          way_of_application: 'broadcast',
          time_period: 'morning'
        };
      } else if (eventType === 2) {
        // Production
        return {
          type: aiCategory?.includes('irrigation')
            ? 'IR'
            : aiCategory?.includes('harvest')
            ? 'HA'
            : aiCategory?.includes('pruning')
            ? 'PR'
            : 'IR', // Default to irrigation
          observation: `AI-suggested ${template.name}: ${template.description}`
        };
      } else if (eventType === 4) {
        // Equipment
        return {
          type: 'FC', // Default to fuel consumption
          equipment_name: 'AI-Suggested Equipment',
          fuel_amount: 10, // Default fuel amount
          fuel_type: 'diesel'
        };
      } else if (eventType === 0) {
        // Weather
        return {
          type: 'WE', // Weather event
          observation: `AI-suggested weather event: ${template.description}`
        };
      } else {
        // General (event type 3)
        return {
          name: template.name, // Required field for general events
          observation: `AI-suggested general event: ${template.description}`
        };
      }
    }

    // Existing template field mapping
    if (template.id.includes('fertilizer')) {
      return {
        type: 'FE',
        commercial_name: 'NPK Fertilizer',
        volume: '200 lbs/acre',
        way_of_application: 'broadcast',
        time_period: 'morning'
      };
    } else if (template.id.includes('irrigation')) {
      return {
        type: 'IR',
        observation: 'Standard irrigation cycle'
      };
    } else if (template.id.includes('harvest')) {
      return {
        type: 'HA',
        observation: 'Harvest operation'
      };
    } else if (template.id.includes('pruning')) {
      return {
        type: 'PR',
        observation: 'Pruning operation'
      };
    }
    return {};
  };

  const handleVoiceEventDetected = async (eventData: any) => {
    // Handle voice-detected event
    console.log('Voice event detected:', eventData);

    // Enhanced validation for required fields based on event type
    const validateVoiceEventData = (voiceData: any) => {
      const eventType = getEventTypeFromVoiceData(voiceData);
      const eventFields = convertVoiceDataToEventFields(voiceData);

      // Required fields mapping (same as NewEvent.jsx)
      const requiredFieldsByType: { [key: number]: string[] } = {
        1: ['type', 'commercial_name', 'volume', 'area', 'concentration', 'way_of_application'], // Chemical
        2: ['type'], // Production - other fields are optional but encouraged
        4: ['type', 'equipment_name', 'fuel_amount', 'hours_used'], // Equipment
        5: ['type'], // Soil Management - specific fields should come from form inputs
        7: ['type'], // Pest Management - specific fields should come from form inputs
        0: ['type'], // Weather
        3: ['name'], // General
        6: ['type'] // Business
      };

      const requiredFields = requiredFieldsByType[eventType] || [];
      const missingFields: string[] = [];
      const detectedFields: string[] = [];

      // Check required fields and detect what was actually captured from voice
      requiredFields.forEach((field: string) => {
        const value = eventFields[field];
        if (
          !value ||
          value.toString().toLowerCase() === 'unknown' ||
          value.toString().trim() === '' ||
          value.toString().includes('Voice-detected') ||
          value.toString().includes('50 liters') ||
          value.toString().includes('1.5 hectares') ||
          value.toString().includes('16-16-16') ||
          value.toString().includes('Farm Equipment') ||
          (typeof value === 'number' && value === 50)
        ) {
          missingFields.push(field);
        } else {
          detectedFields.push(field);
        }
      });

      return {
        isValid: missingFields.length === 0,
        missingFields,
        detectedFields,
        eventType,
        eventFields
      };
    };

    const validation = validateVoiceEventData(eventData);

    // Always show the detailed form for voice events to collect missing information
    setShowVoiceCapture(false);
    setShowDetailedForm(true);

    // Create a template based on voice data for the detailed form
    const voiceTemplate: EventTemplate & { _voiceEventType?: number; _voiceEventFields?: any } = {
      id: `voice-${Date.now()}`,
      name: `Voice: ${eventData.type} Event`,
      icon: getEventIcon(eventData.event_type),
      color: getEventColor(eventData.event_type),
      description: `Complete the voice-detected ${eventData.type} event`,
      carbonImpact: eventData.suggested_carbon_impact || 0,
      costEstimate: 0,
      efficiency_tip:
        validation.missingFields.length > 0
          ? `Please provide: ${validation.missingFields.join(', ')}`
          : 'Voice detection complete - verify details',
      typical_duration: '30 minutes',
      carbonCategory: 'medium' as const,
      sustainabilityScore: 8,
      qrVisibility: 'high' as const,
      type: eventData.event_type,
      // Add custom properties to help with event type mapping
      _voiceEventType: validation.eventType,
      _voiceEventFields: validation.eventFields
    };

    setSelectedTemplate(voiceTemplate);

    // Pre-fill form with voice data (only the fields that were actually detected)
    setEventDescription(eventData.description || '');

    // Extract duration from voice data - look for detected amounts that contain time units
    let detectedDuration = '';
    if (eventData.detected_amounts && eventData.detected_amounts.length > 0) {
      // Look for time-related amounts (hours, minutes, etc.)
      const timeAmount = eventData.detected_amounts.find(
        (amount: string) =>
          amount.toLowerCase().includes('hour') ||
          amount.toLowerCase().includes('minute') ||
          amount.toLowerCase().includes('hr')
      );
      if (timeAmount) {
        detectedDuration = timeAmount;
      }
    }

    // If we have a detected duration, set it, otherwise leave empty for user input
    if (detectedDuration) {
      setDuration(detectedDuration);
    } else {
      setDuration(''); // Clear duration field so user can input
    }

    // Extract application rate if available
    if (eventData.detected_amounts && eventData.detected_amounts.length > 0) {
      // Look for non-time amounts for application rate
      const rateAmount = eventData.detected_amounts.find(
        (amount: string) =>
          !amount.toLowerCase().includes('hour') &&
          !amount.toLowerCase().includes('minute') &&
          !amount.toLowerCase().includes('hr')
      );
      if (rateAmount) {
        setApplicationRate(rateAmount);
      }
    }

    // Create detailed observation with what was detected vs what's needed
    const detectedValues = [];
    if (eventData.detected_amounts && eventData.detected_amounts.length > 0) {
      detectedValues.push(`amounts: ${eventData.detected_amounts.join(', ')}`);
    }
    if (eventData.detected_products && eventData.detected_products.length > 0) {
      detectedValues.push(`products: ${eventData.detected_products.join(', ')}`);
    }
    if (eventData.detected_systems && eventData.detected_systems.length > 0) {
      detectedValues.push(`systems: ${eventData.detected_systems.join(', ')}`);
    }

    const observationParts = [
      `Voice input: "${eventData.description}"`,
      `Confidence: ${eventData.confidence || 0}%`,
      detectedValues.length > 0
        ? `Detected: ${detectedValues.join(', ')}`
        : 'No specific values detected',
      validation.missingFields.length > 0
        ? `Please provide: ${validation.missingFields.join(', ')}`
        : 'All required fields detected'
    ].filter(Boolean);

    setEventObservations(observationParts.join(' | '));

    // Show success message about voice detection
    toast({
      title: 'Voice Event Detected! 🎤',
      description:
        validation.missingFields.length > 0
          ? `Detected ${
              eventData.type
            } event. Please complete the required fields: ${validation.missingFields.join(', ')}`
          : `Voice detection complete! Please verify the details before creating the event.`,
      status: 'info',
      duration: 6000,
      isClosable: true
    });
  };

  const handleDetailedCreate = async () => {
    if (!selectedTemplate) return;

    setIsCreating(true);
    try {
      // For voice events, use the enhanced event type mapping
      let eventType = getTemplateEventType(selectedTemplate);
      let eventTypeFields = getTemplateEventFields(selectedTemplate);

      // Check if this is a voice template with custom mapping
      if (selectedTemplate.id.startsWith('voice-') && (selectedTemplate as any)._voiceEventType) {
        eventType = (selectedTemplate as any)._voiceEventType;
        eventTypeFields = (selectedTemplate as any)._voiceEventFields || eventTypeFields;

        console.log('Using voice event type mapping:', eventType, eventTypeFields);
      }

      const backendEventData = {
        companyId: currentCompany.id,
        establishmentId: parseInt(establishmentId || '0'),
        parcelId: parseInt(parcelId || '0'),
        parcels: [parseInt(parcelId || '0')],
        event_type: eventType,
        date: eventDate,
        description: eventDescription,
        album: { images: [] },
        observation: `${eventObservations}. Application Rate: ${applicationRate}. Duration: ${duration}`,
        ...eventTypeFields
      };

      console.log('Final backend event data:', backendEventData);

      await createEvent(backendEventData).unwrap();

      toast({
        title: 'Voice Event Created! 🎤',
        description: `${selectedTemplate.name} event created successfully with voice-detected details`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      if (onEventAdded) {
        onEventAdded(selectedTemplate);
      }

      handleClose();
    } catch (error) {
      console.error('Error creating detailed event:', error);
      toast({
        title: 'Error Creating Event',
        description: 'Failed to create detailed carbon event. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh" display="flex" flexDirection="column">
        <ModalHeader>
          <HStack>
            <Icon as={FaSeedling} color="green.500" boxSize={6} />
            <Text>Quick Add Carbon Event</Text>
            <Badge colorScheme="green" size="sm">
              {cropType}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody
          flex="1"
          overflowY="auto"
          pb={selectedTemplate && !showDetailedForm ? '120px' : '4'}
        >
          {showDetailedForm ? (
            // DETAILED FORM VIEW
            <VStack spacing={6} align="stretch">
              {/* Selected Template Summary */}
              {selectedTemplate && (
                <Box p={4} bg={`${selectedTemplate.color}.50`} borderRadius="lg">
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={selectedTemplate.icon} color={`${selectedTemplate.color}.500`} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" color={`${selectedTemplate.color}.700`}>
                          {selectedTemplate.name}
                        </Text>
                        <Text fontSize="xs" color={`${selectedTemplate.color}.600`}>
                          Carbon Impact: {selectedTemplate.carbonImpact} kg CO₂
                        </Text>
                      </VStack>
                    </HStack>
                    <Badge colorScheme={selectedTemplate.color}>
                      Score: {selectedTemplate.sustainabilityScore}/10
                    </Badge>
                  </HStack>
                </Box>
              )}

              {/* Detailed Form Fields */}
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Icon as={FaClock} color="blue.500" boxSize={4} />
                      <Text>Event Date & Time</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Event Description</FormLabel>
                  <Textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Describe what was done..."
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4}>
                  <FormControl flex={1}>
                    <FormLabel>
                      <HStack>
                        <Icon as={FaRuler} color="orange.500" boxSize={4} />
                        <Text>Application Rate</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={applicationRate}
                      onChange={(e) => setApplicationRate(e.target.value)}
                      placeholder="e.g., 200 lbs/acre"
                    />
                  </FormControl>

                  <FormControl flex={1}>
                    <FormLabel>
                      <HStack>
                        <Icon as={FaClock} color="purple.500" boxSize={4} />
                        <Text>Duration</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 2-3 hours"
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Additional Observations</FormLabel>
                  <Textarea
                    value={eventObservations}
                    onChange={(e) => setEventObservations(e.target.value)}
                    placeholder="Carbon impact notes, efficiency tips, etc..."
                    rows={4}
                  />
                  <FormHelperText>
                    This information will be visible to consumers via QR codes
                  </FormHelperText>
                </FormControl>
              </VStack>

              {/* Action Buttons */}
              <HStack spacing={3}>
                <Button
                  variant="outline"
                  onClick={handleBackToTemplates}
                  leftIcon={<FaArrowLeft />}
                >
                  Back to Templates
                </Button>
                <Button
                  flex={1}
                  colorScheme="green"
                  onClick={handleDetailedCreate}
                  isLoading={isCreating}
                  loadingText="Creating Detailed Event..."
                >
                  Create Detailed Event
                </Button>
              </HStack>
            </VStack>
          ) : (
            // MAIN TEMPLATE SELECTION VIEW
            <VStack spacing={6} align="stretch">
              {/* 🆕 Phase 2: Smart Template Suggestions */}
              {showTemplateSuggestions && (
                <Box p={4} bg="blue.50" borderRadius="lg" borderWidth="2px" borderColor="blue.200">
                  <VStack spacing={3} align="stretch">
                    <HStack>
                      <Icon
                        as={aiSuggestionsData?.ai_confidence ? FaRobot : FaChartLine}
                        color="blue.500"
                      />
                      <Text fontWeight="bold" color="blue.700">
                        {aiSuggestionsData?.ai_confidence
                          ? '🤖 AI Smart Suggestions'
                          : '🎯 Smart Suggestions'}{' '}
                        for{' '}
                        {getCurrentSeason(new Date().getMonth() + 1)
                          .charAt(0)
                          .toUpperCase() + getCurrentSeason(new Date().getMonth() + 1).slice(1)}
                      </Text>
                      <Badge
                        colorScheme={aiSuggestionsData?.ai_confidence ? 'purple' : 'blue'}
                        size="sm"
                      >
                        {aiSuggestionsData?.ai_confidence ? 'OpenAI Powered' : 'AI Powered'}
                      </Badge>
                      {isLoadingAISuggestions && (
                        <Badge colorScheme="orange" size="sm">
                          Loading AI...
                        </Badge>
                      )}
                    </HStack>

                    <Text fontSize="sm" color="blue.600">
                      {aiSuggestionsData?.ai_confidence
                        ? `AI Confidence: ${aiSuggestionsData.ai_confidence}% • ${aiSuggestionsData.reasoning}`
                        : 'Based on timing, usage patterns, and carbon visibility'}
                    </Text>

                    {/* Skeleton Loading for AI Suggestions */}
                    {isLoadingAISuggestions ? (
                      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3}>
                        {[1, 2, 3].map((i) => (
                          <Box
                            key={i}
                            p={4}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor="purple.200"
                            bg="purple.50"
                          >
                            <VStack spacing={2}>
                              <Skeleton height="20px" width="80%" />
                              <Skeleton height="16px" width="60%" />
                              <HStack>
                                <Skeleton height="16px" width="40px" />
                                <Skeleton height="16px" width="30px" />
                              </HStack>
                            </VStack>
                          </Box>
                        ))}
                      </Grid>
                    ) : templateSuggestions.length > 0 ? (
                      <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3}>
                        {templateSuggestions.map((template) => {
                          const isSelected = selectedTemplate?.id === template.id;
                          console.log(
                            `Template ${template.id}: selected=${isSelected}, selectedTemplate=${selectedTemplate?.id}`
                          );

                          return (
                            <Button
                              key={template.id}
                              variant={isSelected ? 'solid' : 'outline'}
                              colorScheme={template.id.startsWith('ai-') ? 'purple' : 'blue'}
                              size="md"
                              height="auto"
                              py={3}
                              onClick={() => handleTemplateSelect(template)}
                              display="flex"
                              flexDirection="column"
                              justifyContent="center"
                              alignItems="center"
                              gap={2}
                              borderWidth={isSelected ? '3px' : '1px'}
                              borderColor={isSelected ? 'purple.400' : undefined}
                              bg={isSelected ? 'purple.100' : undefined}
                              _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: 'lg',
                                borderColor: template.id.startsWith('ai-')
                                  ? 'purple.300'
                                  : 'blue.300'
                              }}
                              transition="all 0.2s"
                            >
                              <HStack>
                                <Icon as={template.icon} boxSize={4} />
                                {template.id.startsWith('ai-') && (
                                  <Icon as={FaRobot} boxSize={3} color="purple.400" />
                                )}
                              </HStack>
                              <VStack spacing={1} align="center">
                                <Text
                                  fontSize="xs"
                                  textAlign="center"
                                  lineHeight={1.2}
                                  fontWeight="bold"
                                  noOfLines={2}
                                  maxW="180px"
                                  color={isSelected ? 'purple.700' : undefined}
                                >
                                  {template.name}
                                </Text>
                                <HStack spacing={1}>
                                  <Badge
                                    colorScheme={
                                      template.carbonImpact < 0
                                        ? 'green'
                                        : template.carbonImpact > 20
                                        ? 'red'
                                        : 'orange'
                                    }
                                    size="xs"
                                  >
                                    {template.carbonImpact > 0 ? '+' : ''}
                                    {template.carbonImpact} kg CO₂
                                  </Badge>
                                  {template.id.startsWith('ai-') && (
                                    <Badge
                                      colorScheme={isSelected ? 'purple' : 'gray'}
                                      size="xs"
                                      variant={isSelected ? 'solid' : 'outline'}
                                    >
                                      {Math.round((template as any).confidence)}%
                                    </Badge>
                                  )}
                                </HStack>
                              </VStack>
                            </Button>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                        No AI suggestions available at the moment
                      </Text>
                    )}

                    {/* AI Reasoning Display */}
                    {aiSuggestionsData?.ai_confidence && selectedTemplate?.id.startsWith('ai-') && (
                      <Box
                        p={3}
                        bg="purple.50"
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor="purple.200"
                      >
                        <VStack spacing={2} align="start">
                          <HStack>
                            <Icon as={FaLightbulb} color="purple.500" boxSize={4} />
                            <Text fontSize="sm" fontWeight="bold" color="purple.700">
                              AI Reasoning
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="purple.600">
                            {(selectedTemplate as any).reasoning}
                          </Text>
                          {(selectedTemplate as any).bestPractices &&
                            (selectedTemplate as any).bestPractices.length > 0 && (
                              <Box>
                                <Text fontSize="xs" fontWeight="bold" color="purple.700" mb={1}>
                                  Best Practices:
                                </Text>
                                {(selectedTemplate as any).bestPractices.map(
                                  (practice: string, index: number) => (
                                    <Text key={index} fontSize="xs" color="purple.600" ml={2}>
                                      • {practice}
                                    </Text>
                                  )
                                )}
                              </Box>
                            )}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Box>
              )}

              {/* Voice Input Section */}
              {!showVoiceCapture ? (
                <Box p={4} bg="blue.50" borderRadius="lg" borderWidth="2px" borderColor="blue.200">
                  <VStack spacing={3}>
                    <HStack>
                      <Icon as={FaMicrophone} color="blue.500" />
                      <Text fontWeight="bold" color="blue.700">
                        🎤 Voice Input
                      </Text>
                      <Badge colorScheme="blue" size="sm">
                        Fastest Method
                      </Badge>
                    </HStack>

                    <Text fontSize="sm" color="blue.600" textAlign="center">
                      Say: "Applied fertilizer today, 200 pounds per acre"
                    </Text>

                    <Button
                      leftIcon={<FaMicrophone />}
                      colorScheme="blue"
                      onClick={() => setShowVoiceCapture(true)}
                      size="lg"
                    >
                      Start Voice Input
                    </Button>
                  </VStack>
                </Box>
              ) : (
                <VoiceEventCapture
                  onEventDetected={handleVoiceEventDetected}
                  isActive={true}
                  cropType={cropType}
                  onClose={() => setShowVoiceCapture(false)}
                />
              )}

              <Divider />

              {/* 🆕 Enhanced Smart Templates Section */}
              <Box>
                <HStack mb={4}>
                  <Icon as={FaSeedling} color="green.500" boxSize={5} />
                  <Text fontWeight="semibold" fontSize="lg" color="green.700">
                    🌱 Smart Carbon Templates
                  </Text>
                  <Badge colorScheme="green" size="sm">
                    Consumer Visible
                  </Badge>
                </HStack>

                <Text fontSize="sm" color="gray.600" mb={4}>
                  Pre-configured events optimized for carbon tracking and consumer QR visibility
                </Text>

                {/* General Templates */}
                <Box mb={6}>
                  <Text fontWeight="medium" fontSize="md" color="gray.700" mb={3}>
                    📋 General Events
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {eventTemplates
                      .filter((template) => !template.id.startsWith('db-'))
                      .map((template) => (
                        <Box
                          key={template.id}
                          p={4}
                          borderRadius="lg"
                          borderWidth="2px"
                          borderColor={
                            selectedTemplate?.id === template.id
                              ? `${template.color}.300`
                              : 'gray.200'
                          }
                          bg={
                            selectedTemplate?.id === template.id ? `${template.color}.50` : 'white'
                          }
                          cursor="pointer"
                          onClick={() => handleTemplateSelect(template)}
                          _hover={{
                            borderColor: `${template.color}.300`,
                            transform: 'translateY(-2px)',
                            boxShadow: 'md'
                          }}
                          transition="all 0.2s"
                        >
                          <VStack spacing={3} align="start">
                            <HStack justify="space-between" width="100%">
                              <HStack>
                                <Icon
                                  as={template.icon}
                                  color={`${template.color}.500`}
                                  boxSize={4}
                                />
                                <Text fontWeight="bold" fontSize="sm">
                                  {template.name}
                                </Text>
                              </HStack>
                              <Badge
                                colorScheme={
                                  template.carbonCategory === 'high'
                                    ? 'red'
                                    : template.carbonCategory === 'medium'
                                    ? 'yellow'
                                    : 'green'
                                }
                                size="xs"
                              >
                                {template.carbonImpact} kg CO₂
                              </Badge>
                            </HStack>

                            <Text fontSize="xs" color="gray.600">
                              {template.description}
                            </Text>

                            <HStack justify="space-between" width="100%">
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" color="gray.500">
                                  Sustainability
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" color="green.600">
                                  {template.sustainabilityScore}/10
                                </Text>
                              </VStack>
                              <VStack align="end" spacing={0}>
                                <Text fontSize="xs" color="gray.500">
                                  QR Visibility
                                </Text>
                                <Badge colorScheme="blue" size="xs">
                                  {template.qrVisibility}
                                </Badge>
                              </VStack>
                            </HStack>

                            <Box p={2} bg="gray.50" borderRadius="md" width="100%">
                              <Text fontSize="xs" color="gray.600">
                                💡 {template.efficiency_tip}
                              </Text>
                            </Box>
                          </VStack>
                        </Box>
                      ))}
                  </Grid>
                </Box>

                {/* Crop-Specific Events Section */}
                {eventTemplates.filter((template) => template.id.startsWith('db-')).length > 0 && (
                  <Box>
                    <HStack mb={3}>
                      <Icon as={FaSeedling} color="green.500" boxSize={4} />
                      <Text fontWeight="semibold" fontSize="md" color="green.700">
                        🎯 {dbEventTemplatesData?.crop_type?.name || cropType} Specific Events
                      </Text>
                      <Badge colorScheme="green" size="sm">
                        Database Optimized
                      </Badge>
                    </HStack>

                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      {eventTemplates
                        .filter((template) => template.id.startsWith('db-'))
                        .map((template) => (
                          <Box
                            key={template.id}
                            p={4}
                            borderRadius="lg"
                            borderWidth="2px"
                            borderColor={
                              selectedTemplate?.id === template.id
                                ? `${template.color}.300`
                                : 'gray.200'
                            }
                            bg={
                              selectedTemplate?.id === template.id
                                ? `${template.color}.50`
                                : 'white'
                            }
                            cursor="pointer"
                            onClick={() => handleTemplateSelect(template)}
                            _hover={{
                              borderColor: `${template.color}.300`,
                              transform: 'translateY(-2px)',
                              boxShadow: 'md'
                            }}
                            transition="all 0.2s"
                          >
                            <VStack spacing={3} align="start">
                              <HStack justify="space-between" width="100%">
                                <HStack>
                                  <Icon
                                    as={template.icon}
                                    color={`${template.color}.500`}
                                    boxSize={4}
                                  />
                                  <Text fontWeight="bold" fontSize="sm">
                                    {template.name}
                                  </Text>
                                </HStack>
                                <Badge
                                  colorScheme={
                                    template.carbonCategory === 'high'
                                      ? 'red'
                                      : template.carbonCategory === 'medium'
                                      ? 'yellow'
                                      : 'green'
                                  }
                                  size="xs"
                                >
                                  {template.carbonImpact} kg CO₂
                                </Badge>
                              </HStack>

                              <Text fontSize="xs" color="gray.600">
                                {template.description}
                              </Text>

                              <HStack justify="space-between" width="100%">
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="xs" color="gray.500">
                                    Sustainability
                                  </Text>
                                  <Text fontSize="sm" fontWeight="bold" color="green.600">
                                    {template.sustainabilityScore}/10
                                  </Text>
                                </VStack>
                                <VStack align="end" spacing={0}>
                                  <Text fontSize="xs" color="gray.500">
                                    QR Visibility
                                  </Text>
                                  <Badge colorScheme="blue" size="xs">
                                    {template.qrVisibility}
                                  </Badge>
                                </VStack>
                              </HStack>

                              <Box p={2} bg="green.50" borderRadius="md" width="100%">
                                <Text fontSize="xs" color="green.700">
                                  🎯 {template.efficiency_tip}
                                </Text>
                              </Box>
                            </VStack>
                          </Box>
                        ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </VStack>
          )}
        </ModalBody>

        {/* Fixed Bottom Action Section - Only show when template is selected and not in detailed form */}
        {selectedTemplate && !showDetailedForm && (
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            p={4}
            boxShadow="0 -4px 12px rgba(0, 0, 0, 0.1)"
          >
            <VStack spacing={3}>
              <HStack justify="space-between" width="100%">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" color="green.700" fontSize="sm">
                    Ready to create: 🤖 {selectedTemplate.name}
                  </Text>
                  <Text fontSize="xs" color="green.600">
                    This event will be visible to consumers with {selectedTemplate.qrVisibility}{' '}
                    visibility on QR scans
                  </Text>
                </VStack>
                <Badge colorScheme="green" fontSize="xs">
                  {selectedTemplate.typical_duration}
                </Badge>
              </HStack>

              <HStack spacing={3} width="100%">
                <Button
                  flex={1}
                  colorScheme="green"
                  onClick={handleTemplateCreate}
                  isLoading={isCreating}
                  loadingText="Creating Carbon Event..."
                  leftIcon={<Icon as={FaSeedling} />}
                  size="md"
                >
                  Quick Create Event
                </Button>
                <Button variant="outline" colorScheme="green" onClick={handleShowDetails} size="md">
                  Add Details
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QuickAddEvent;
