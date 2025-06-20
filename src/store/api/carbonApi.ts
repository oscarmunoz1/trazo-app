import { baseApi } from './baseApi';

export interface CarbonSummary {
  totalEmissions: number;
  totalOffsets: number;
  netFootprint: number;
  carbonScore: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    isVerified: boolean;
  }>;
}

export interface CarbonBenchmark {
  cropType: string;
  benchmarkValue: number; // kg CO2e/kg
  source: string;
  year: number;
}

export interface CarbonRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost: number;
  paybackPeriod: number; // in months
  category: 'energy' | 'water' | 'waste' | 'soil' | 'equipment';
}

export interface CarbonEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'planting' | 'harvesting' | 'weather' | 'chemical' | 'general';
  carbonImpact: number;
  photos?: string[];
}

// IoT-related interfaces
export interface IoTDevice {
  device_id: string;
  equipment: string;
  device_type: 'fuel_sensor' | 'weather_station' | 'soil_moisture' | 'equipment_monitor';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  battery_level?: number;
  signal_strength?: 'excellent' | 'strong' | 'weak' | 'poor';
  data_points_today: number;
  last_update: string;
}

export interface IoTDeviceDetails {
  id: number;
  device_id: string;
  device_type:
    | 'fuel_sensor'
    | 'weather_station'
    | 'soil_moisture'
    | 'irrigation'
    | 'equipment_monitor'
    | 'gps_tracker';
  name: string;
  manufacturer: string;
  model: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  battery_level?: number;
  location: {
    lat?: number;
    lng?: number;
  };
  installed_date: string;
  last_seen?: string;
  last_maintenance?: string;
  configuration: Record<string, any>;
  notes: string;
  needs_maintenance: boolean;
  total_data_points: number;
  recent_data?: Array<{
    timestamp: string;
    data: Record<string, any>;
    quality_score: number;
    processed: boolean;
  }>;
}

export interface IoTDeviceRegistration {
  device_id: string;
  device_type:
    | 'fuel_sensor'
    | 'weather_station'
    | 'soil_moisture'
    | 'irrigation'
    | 'equipment_monitor'
    | 'gps_tracker';
  establishment_id: string;
  name: string;
  manufacturer?: string;
  model?: string;
  latitude?: number;
  longitude?: number;
  configuration?: Record<string, any>;
  notes?: string;
}

export interface IoTDeviceType {
  value: string;
  label: string;
}

export interface IoTDeviceStatus {
  devices: IoTDevice[];
  summary: {
    total_devices: number;
    online_devices: number;
    offline_devices: number;
    low_battery_devices: number;
  };
}

export interface AutomationRule {
  id: number;
  name: string;
  device_type: string;
  trigger_type: 'threshold' | 'pattern' | 'schedule' | 'weather' | 'combination';
  trigger_config: Record<string, any>;
  action_type:
    | 'create_event'
    | 'send_alert'
    | 'update_status'
    | 'trigger_webhook'
    | 'generate_report';
  action_config: Record<string, any>;
  is_active: boolean;
  last_triggered?: string;
  trigger_count: number;
  description: string;
  created_at: string;
}

export interface AutomationRuleCreate {
  name: string;
  establishment_id: string;
  device_type?: string;
  trigger_type: 'threshold' | 'pattern' | 'schedule' | 'weather' | 'combination';
  trigger_config: Record<string, any>;
  action_type:
    | 'create_event'
    | 'send_alert'
    | 'update_status'
    | 'trigger_webhook'
    | 'generate_report';
  action_config: Record<string, any>;
  description?: string;
  is_active?: boolean;
}

export interface PendingEvent {
  id: string;
  data_point_id: number;
  device_id: string;
  device_name: string;
  event_type: 'fuel_consumption' | 'irrigation_needed' | 'weather_alert' | 'maintenance_required';
  suggested_carbon_entry?: {
    type: 'emission' | 'offset';
    source: string;
    amount: number;
    description: string;
    raw_data: Record<string, any>;
  };
  suggested_action?: {
    type: string;
    priority: 'low' | 'medium' | 'high';
    description: string;
    estimated_water_needed?: string;
  };
  timestamp: string;
  confidence: number;
  auto_approve_recommended: boolean;
}

export interface PendingEventsResponse {
  establishment_id: string;
  pending_events: PendingEvent[];
  total_count: number;
  last_updated: string;
}

export interface EventApproval {
  data_point_id: number;
  event_data: {
    type: 'emission' | 'offset';
    source: string;
    amount: number;
    description: string;
  };
}

export interface EventRejection {
  data_point_id: number;
  reason?: string;
}

export interface IoTDataSimulation {
  establishment_id: string;
  device_type: 'fuel_sensor' | 'weather_station' | 'soil_moisture' | 'equipment_monitor';
}

export interface IoTSimulationResponse {
  success: boolean;
  message: string;
  data_points_created?: number;
  carbon_entries_created?: number;
}

export interface CarbonCalculationResult {
  co2e: number;
  efficiency_score: number;
  usda_verified: boolean;
  calculation_method: string;
  event_type:
    | 'chemical'
    | 'production'
    | 'weather'
    | 'general'
    | 'equipment'
    | 'soil_management'
    | 'business'
    | 'pest_management';
  timestamp: string;
  breakdown?: {
    nitrogen_emissions?: number;
    phosphorus_emissions?: number;
    potassium_emissions?: number;
    application_efficiency?: number;
    volume_liters?: number;
    area_hectares?: number;
    fuel_amount?: number;
    fuel_type?: string;
    equipment_type?: string;
    carbon_sequestration?: number;
    carbon_release?: number;
    soil_ph?: number;
    organic_matter?: number;
    transport_emissions?: number;
    carbon_credits?: number;
    revenue_impact?: number;
    chemical_avoidance?: number;
    monitoring_emissions?: number;
    pest_pressure?: string;
  };
  cost_analysis?: {
    estimated_cost: number;
    cost_per_co2e: number;
  };
  recommendations?: Array<{
    type: string;
    title: string;
    description: string;
    potential_savings: number;
    carbon_reduction: number;
  }>;
  error?: string;
  warning?: string;
}

export interface EventCarbonCalculationRequest {
  event_type:
    | 'chemical'
    | 'production'
    | 'weather'
    | 'general'
    | 'equipment'
    | 'soil_management'
    | 'business'
    | 'pest_management';
  event_data: Record<string, any>;
}

export interface QRCodeSummary {
  carbonScore: number;
  totalEmissions: number;
  totalOffsets: number;
  netFootprint: number;
  relatableFootprint: string; // e.g., "like driving 1 mile"
  industryPercentile: number;
  industryAverage: number;
  isUsdaVerified?: boolean;
  verificationDate?: string;
  // Enhanced blockchain verification data
  blockchainVerification?: {
    verified: boolean;
    transaction_hash?: string;
    record_hash?: string;
    verification_url?: string;
    network?: string;
    verification_date?: string;
    compliance_status?: boolean;
    eligible_for_credits?: boolean;
    mock_data?: boolean;
    fallback_data?: boolean;
  };
  reports?: Array<{
    id: string;
    period_start: string;
    period_end: string;
    total_emissions: number;
    total_offsets: number;
    net_footprint: number;
    document: string | null;
    report_type: string;
  }>;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  farmer?: {
    id: string;
    name: string;
    location: string;
    description: string;
    photo?: string;
    email?: string;
    phone?: string;
    website?: string;
    certifications?: Array<{
      name: string;
      icon?: string;
      description?: string;
    }>;
  };
  farmerStory?: string;
  timeline?: Array<{
    date: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  emissionsByCategory?: Record<string, number>;
  emissionsBySource?: Record<string, number>;
  offsetsByAction?: Record<string, number>;
  recommendations?: string[];
  socialProof?: {
    totalScans: number;
    totalOffsets: number;
    totalUsers: number;
    averageRating: number;
  };
}

// Phase 2 Optimization: Unified Complete Summary Interface
export interface CompleteSummary {
  // Essential product info
  product: {
    id: string;
    name: string;
    reputation: number;
  };

  // Production dates
  start_date?: string;
  finish_date?: string;

  // Carbon metrics (complete from qr-summary)
  carbonScore: number;
  totalEmissions: number;
  totalOffsets: number;
  netFootprint: number;
  relatableFootprint: string;
  industryPercentile: number;
  industryAverage: number;
  isUsdaVerified: boolean;
  cropType: string;
  benchmarkSource: string;

  // Emissions breakdown
  emissionsByCategory: Record<string, number>;
  emissionsBySource: Record<string, number>;
  offsetsByAction: Record<string, number>;

  // Production timeline (combined events)
  timeline: Array<{
    id: string;
    type: string;
    description: string;
    observation: string;
    date: string;
    certified: boolean;
    index: number;
    volume?: number;
    concentration?: number;
    area?: number;
    equipment?: string;
  }>;
  production_events: Array<any>; // Alias for compatibility
  events: Array<any>; // Alias for compatibility

  // Establishment info (from history data)
  farmer: {
    id: string;
    name: string;
    description: string;
    location: string;
    photo?: string;
    certifications: string[];
    email: string;
    phone: string;
  };
  establishment: any; // Alias for history API compatibility

  // Map data (from history API)
  parcel: {
    id: string;
    name: string;
    area?: number;
    polygon: any;
    map_metadata: any;
    establishment?: {
      id: string;
      name: string;
      description: string;
      location: string;
      photo?: string;
    };
  } | null;

  // Images
  images?: Array<{
    id: string;
    image: string;
    name: string;
  }>;

  // Similar products
  similar_products: Array<{
    id: string;
    product: { name: string };
    reputation: number;
    image?: string;
  }>;
  similar_histories: Array<any>; // Alias for history API compatibility

  // Scan tracking
  history_scan: string;

  // Sustainability features
  recommendations: string[];
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    color?: string;
  }>;
  reports?: Array<{
    id: string;
    period_start: string;
    period_end: string;
    total_emissions: number;
    total_offsets: number;
    net_footprint: number;
    document: string | null;
    report_type: string;
  }>;
  blockchainVerification: {
    verified: boolean;
    transaction_hash?: string;
    verification_date: string;
    certifying_body: string;
    error?: string;
  };
  socialProof: {
    totalScans: number;
    totalOffsets: number;
    totalUsers: number;
    averageRating: number;
    companyScans: number;
  };

  // Metadata
  verificationDate: string;
  cache_hit: boolean;
  timestamp: string;
  api_version: string;
}

// Weather API interfaces
export interface WeatherConditions {
  temperature: number;
  temperature_c: number;
  humidity: number;
  wind_speed: number;
  wind_direction?: number;
  pressure?: number;
  visibility?: number;
  description: string;
  timestamp: string;
  source: 'noaa' | 'openweather';
  station_id?: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  urgency: 'immediate' | 'expected' | 'future';
  certainty: 'observed' | 'likely' | 'possible';
  event: string;
  onset?: string;
  expires?: string;
  areas: string;
  instruction?: string;
}

export interface WeatherRecommendation {
  type:
    | 'heat_stress_alert'
    | 'heat_advisory'
    | 'freeze_warning'
    | 'high_wind_alert'
    | 'low_humidity_alert'
    | 'high_humidity_alert'
    | 'optimal_conditions';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions: string[];
  carbon_impact: string;
  cost_impact: string;
  timing: string;
}

export interface WeatherForecast {
  name: string;
  temperature: number;
  temperature_unit: string;
  wind_speed: string;
  wind_direction: string;
  description: string;
  short_forecast: string;
  is_daytime: boolean;
  start_time: string;
  end_time: string;
}

export interface WeatherResponse {
  status: 'success' | 'error';
  establishment_id?: string;
  location: {
    lat: number;
    lng: number;
  };
  weather?: WeatherConditions;
  alerts?: WeatherAlert[];
  alert_count?: number;
  recommendations?: {
    critical: WeatherRecommendation[];
    high: WeatherRecommendation[];
    medium: WeatherRecommendation[];
    low: WeatherRecommendation[];
    total_count: number;
  };
  summary?: {
    critical_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
    requires_immediate_action: boolean;
  };
  forecast?: WeatherForecast[];
  forecast_days?: number;
  timestamp: string;
  error?: string;
}

export interface WeatherAlertEventRequest {
  establishment_id: string;
  weather_data: WeatherConditions;
  recommendations: WeatherRecommendation[];
}

export interface WeatherAlertEventResponse {
  status: 'success' | 'error';
  message: string;
  data_point_id?: number;
  device_id?: number;
  requires_approval: boolean;
  confidence: number;
  recommendations_count: number;
  error?: string;
}

export interface CropTemplate {
  id: string;
  template_id?: number; // New field for actual template ID
  name: string;
  crop_type: string;
  crop_type_name?: string; // New field for display name
  description: string;
  events_count: number;
  carbon_potential: number;
  avg_revenue: number;
  setup_time_minutes: number;
  usage_count: number;
  carbon_benchmark: {
    emissions_range: string;
    industry_average: number;
    best_practice: number;
  };
  events_preview: Array<{
    name: string;
    type: string;
    timing: string;
    carbon_impact: number;
  }>;
  sustainability_practices: string[];
  roi_projection: {
    carbon_credits_value: number;
    premium_pricing: string;
    cost_savings: string;
  };
  // New fields from database
  system_type?: string;
  management_intensity?: string;
  is_verified?: boolean;
  source?: string;
}

export interface CropTemplatesResponse {
  templates: CropTemplate[];
  total_count: number;
  categories: string[];
  metadata: {
    generated_at?: string;
    version: string;
    source: string;
  };
}

export interface CropTemplateDetail {
  id: string;
  template_id?: number; // New field for actual template ID
  name: string;
  description: string;
  crop_type: string;
  crop_type_name?: string; // New field for display name
  events: Array<{
    id?: number; // New field for event ID
    name: string;
    event_type?: string; // More specific field name
    type: string;
    timing: string;
    frequency?: string;
    carbon_sources: string[];
    typical_amount: number | any; // Can be object
    carbon_impact: number;
    cost_estimate: number;
    labor_hours?: number; // New field
    efficiency_tips: string;
    order_sequence?: number; // New field
    usda_practice_code?: string; // New field
    is_required?: boolean; // New field
  }>;
  carbon_sources: Array<{
    id: number;
    name: string;
    category: string;
    emission_factor: number;
    unit: string;
  }>;
  benchmark?: {
    crop_type: string;
    region: string;
    average_emissions: number;
    percentile_25: number;
    percentile_75: number;
    usda_verified: boolean;
  };
  carbon_credit_potential: number;
  estimated_revenue: number;
  sustainability_opportunities: string[];
  efficiency_tips: string[];
  premium_pricing_potential: string;
  typical_costs: number;
  target_yield?: any; // New field
  labor_hours_per_acre?: number; // New field
  sustainability_score?: number; // New field
  source?: string; // New field
  is_verified?: boolean; // New field
  roi_analysis: {
    setup_time_saved: string;
    carbon_credits_annual: number;
    premium_pricing: string;
    efficiency_savings: string;
  };
  // New fields from database
  system_type?: string;
  management_intensity?: string;
  irrigation_system?: string;
  fertility_program?: string;
  pest_management?: string;
}

// Educational content interfaces
export interface USDAMethodologyContent {
  title: string;
  subtitle?: string;
  overview: string;
  sections: Array<{
    title: string;
    content: string;
    icon: string;
    type: 'explanation' | 'example' | 'comparison' | 'process' | 'data';
    key_takeaway?: string;
    technical_detail?: string;
    references?: string[];
    statistical_detail?: string;
  }>;
  trust_indicators?: string[];
  interactive_features: {
    calculator_demo: boolean;
    regional_comparison: boolean;
    confidence_indicators: boolean;
    technical_details: boolean;
  };
  quick_facts?: string[];
  related_topics?: string[];
  external_resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'research' | 'government' | 'video';
    description: string;
  }>;
  confidence_level?: number;
  last_updated?: string;
}

export interface RegionalBenchmarkData {
  level: 'excellent' | 'above_average' | 'good' | 'average' | 'below_average' | 'unknown';
  percentile: number | null;
  message: string;
  regional_average: number | null;
  improvement_vs_average?: number;
  improvement_potential?: number;
  establishment_name?: string;
  crop_type?: string;
  state?: string;
  carbon_intensity?: number;
}

export interface USDACredibilityData {
  usda_based: boolean;
  data_source: string;
  methodology: string;
  confidence_level: 'high' | 'medium' | 'low';
  regional_specificity: boolean;
  compliance_statement: string;
  credibility_score: number;
  verification_details: {
    factors_verified: boolean;
    usda_compliant: boolean;
    scientifically_validated: boolean;
    peer_reviewed: boolean;
  };
  establishment_name?: string;
  establishment_location?: string;
  regional_optimization?: boolean;
}

export interface CarbonImpactData {
  carbon_value: number;
  carbon_unit: string;
  examples: Array<{
    category: string;
    icon: string;
    value: number;
    unit: string;
    description: string;
    context: string;
    visual_aid?: string;
    comparison_type: 'equivalent' | 'offset' | 'saved';
  }>;
  context: {
    farm_type?: string;
    region?: string;
    time_period?: string;
  };
  impact_level: 'low' | 'medium' | 'high';
  positive_impact: boolean;
  last_updated: string;
}

export interface TrustComparisonData {
  title: string;
  subtitle: string;
  metrics: Array<{
    label: string;
    generic_value: number;
    usda_value: number;
    unit: string;
    description: string;
    confidence_level: number;
  }>;
  data_sources: {
    generic: {
      name: string;
      type: 'generic' | 'government' | 'peer_reviewed' | 'industry';
      reliability_score: number;
      data_points: number;
      regional_specificity: boolean;
      last_updated: string;
      verification_method: string;
    };
    usda: {
      name: string;
      type: 'generic' | 'government' | 'peer_reviewed' | 'industry';
      reliability_score: number;
      data_points: number;
      regional_specificity: boolean;
      last_updated: string;
      verification_method: string;
    };
  };
  trust_indicators: Array<{
    category: string;
    generic_score: number;
    usda_score: number;
    max_score: number;
    description: string;
    icon: string;
  }>;
  accuracy_improvement: number;
  last_updated: string;
}

export interface RegionalFarmingPractices {
  efficiency_rank: number | string;
  key_practices: Array<{
    name: string;
    description: string;
    carbon_benefit: string;
    adoption_rate: string;
  }>;
  climate_advantages?: string[];
  sustainability_story: string;
  state_name?: string;
  state_code?: string;
}

// General Education Content Interface (for EducationModal)
export interface EducationContent {
  title: string;
  subtitle?: string;
  overview: string;
  sections: Array<{
    title: string;
    content: string;
    icon: string;
    type: 'explanation' | 'example' | 'comparison' | 'process' | 'data';
    visual_aid?: {
      type: 'chart' | 'diagram' | 'comparison' | 'timeline' | 'map';
      data?: any;
      description: string;
    };
    interactive_element?: {
      type: 'calculator' | 'slider' | 'comparison' | 'quiz';
      config: any;
    };
    key_takeaway?: string;
  }>;
  quick_facts?: string[];
  related_topics?: Array<
    | 'usda-methodology'
    | 'carbon-scoring'
    | 'regional-benchmarks'
    | 'trust-indicators'
    | 'farming-practices'
    | 'carbon-examples'
    | 'verification-process'
    | 'sustainability-metrics'
  >;
  external_resources?: Array<{
    title: string;
    url: string;
    type: 'article' | 'research' | 'government' | 'video';
    description: string;
  }>;
  confidence_level?: number;
  last_updated?: string;
}

export interface EventTemplateFromDB {
  id: number;
  name: string;
  event_type: string;
  description: string;
  timing: string;
  carbon_impact: number;
  carbon_category: 'high' | 'medium' | 'low' | 'negative' | 'neutral';
  cost_estimate: number;
  sustainability_score: number;
  qr_visibility: 'high' | 'medium' | 'low' | 'hidden';
  crop_type_name: string;
  production_template_name: string;
  backend_event_type: number;
  backend_event_fields: Record<string, any>;
  typical_amounts: Record<string, any>;
  efficiency_tips?: string;
  typical_duration?: string;
  type: string; // Translation key for event name display
}

export interface EventTemplatesResponse {
  crop_type: {
    id: number;
    name: string;
    slug: string;
    category: string;
  };
  templates: EventTemplateFromDB[];
}

export const carbonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Producer endpoints
    getEstablishmentCarbonSummary: builder.query<CarbonSummary, string>({
      query: (establishmentId) => ({
        url: `carbon/establishments/${establishmentId}/summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getProductionCarbonSummary: builder.query<CarbonSummary, string>({
      query: (productionId) => ({
        url: `carbon/productions/${productionId}/summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getCarbonBenchmarks: builder.query<CarbonBenchmark[], void>({
      query: () => ({
        url: 'carbon/benchmarks/',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['CarbonBenchmarks']
    }),

    // Phase 1 Optimization: Quick carbon score for progressive loading
    getQRCodeQuickScore: builder.query<
      { carbonScore: number; totalEmissions: number; totalOffsets: number; cache_hit?: boolean },
      string
    >({
      query: (productionId) => ({
        url: `carbon/public/productions/${productionId}/qr-summary/?quick=true`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    // Consumer endpoints
    getQRCodeSummary: builder.query<QRCodeSummary, string>({
      query: (productionId) => ({
        url: `carbon/public/productions/${productionId}/qr-summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getPublicCarbonSummary: builder.query<CarbonSummary, string>({
      query: (productionId) => ({
        url: `carbon/public/productions/${productionId}/summary/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    getProductionTimeline: builder.query<CarbonEvent[], string>({
      query: (productionId) => ({
        url: `carbon/productions/${productionId}/timeline/`,
        method: 'GET'
      }),
      providesTags: ['CarbonSummary']
    }),

    // Offset endpoints
    createOffset: builder.mutation<
      { success: boolean; transactionId: string },
      {
        production: string; // Changed from productionId to production to match backend expectations
        amount: number;
        source_id: string;
        type: string;
        year: number;
      }
    >({
      query: (data) => ({
        url: 'carbon/offsets/',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['CarbonSummary']
    }),

    // Real-time event carbon calculation
    calculateEventCarbonImpact: builder.mutation<
      CarbonCalculationResult,
      EventCarbonCalculationRequest
    >({
      query: (data) => ({
        url: 'carbon/calculate-event-impact/',
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    }),

    // IoT endpoints
    getIoTDeviceStatus: builder.query<IoTDeviceStatus, string>({
      query: (establishmentId) => ({
        url: `carbon/iot-devices/device_status/?establishment_id=${establishmentId}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['IoTDevice', 'IoTData']
    }),

    // IoT Device Management
    listIoTDevices: builder.query<{ devices: IoTDeviceDetails[]; total_count: number }, string>({
      query: (establishmentId) => ({
        url: `carbon/iot-devices/?establishment_id=${establishmentId}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['IoTDevice']
    }),

    getIoTDevice: builder.query<IoTDeviceDetails, number>({
      query: (deviceId) => ({
        url: `carbon/iot-devices/${deviceId}/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['IoTDevice']
    }),

    registerIoTDevice: builder.mutation<
      { id: number; device_id: string; message: string },
      IoTDeviceRegistration
    >({
      query: (data) => ({
        url: 'carbon/iot-devices/',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['IoTDevice']
    }),

    updateIoTDevice: builder.mutation<
      { id: number; device_id: string; message: string },
      { id: number; data: Partial<IoTDeviceRegistration> }
    >({
      query: ({ id, data }) => ({
        url: `carbon/iot-devices/${id}/`,
        method: 'PUT',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['IoTDevice']
    }),

    deleteIoTDevice: builder.mutation<{ message: string }, number>({
      query: (deviceId) => ({
        url: `carbon/iot-devices/${deviceId}/`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['IoTDevice']
    }),

    getIoTDeviceTypes: builder.query<{ device_types: IoTDeviceType[] }, void>({
      query: () => ({
        url: 'carbon/iot-devices/device_types/',
        method: 'GET',
        credentials: 'include'
      })
    }),

    // Automation Rules
    listAutomationRules: builder.query<{ rules: AutomationRule[]; total_count: number }, string>({
      query: (establishmentId) => ({
        url: `carbon/automation-rules/?establishment_id=${establishmentId}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['AutomationRule']
    }),

    createAutomationRule: builder.mutation<
      { id: number; name: string; message: string },
      AutomationRuleCreate
    >({
      query: (data) => ({
        url: 'carbon/automation-rules/',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['AutomationRule']
    }),

    // Pending Events and Approvals
    getPendingEvents: builder.query<PendingEventsResponse, string>({
      query: (establishmentId) => ({
        url: `carbon/automation-rules/pending_events/?establishment_id=${establishmentId}`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['PendingEvent', 'IoTData']
    }),

    approveEvent: builder.mutation<
      { carbon_entry_id: number; message: string; co2e_amount: number },
      EventApproval
    >({
      query: (data) => ({
        url: 'carbon/automation-rules/approve_event/',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['PendingEvent', 'IoTData', 'CarbonSummary']
    }),

    rejectEvent: builder.mutation<{ message: string; reason: string }, EventRejection>({
      query: (data) => ({
        url: 'carbon/automation-rules/reject_event/',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['PendingEvent', 'IoTData']
    }),

    simulateIoTData: builder.mutation<IoTSimulationResponse, IoTDataSimulation>({
      query: (data) => ({
        url: 'carbon/iot-devices/simulate_data/',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['IoTDevice', 'IoTData', 'CarbonSummary']
    }),

    // Weather API endpoints
    getCurrentWeatherConditions: builder.query<
      WeatherResponse,
      { establishmentId?: string; lat?: number; lng?: number }
    >({
      query: ({ establishmentId, lat, lng }) => {
        const params = new URLSearchParams();
        if (establishmentId) params.append('establishment_id', establishmentId);
        if (lat !== undefined) params.append('lat', lat.toString());
        if (lng !== undefined) params.append('lng', lng.toString());

        return {
          url: `carbon/weather/current/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Weather']
    }),

    getWeatherAlerts: builder.query<
      WeatherResponse,
      { establishmentId?: string; lat?: number; lng?: number }
    >({
      query: ({ establishmentId, lat, lng }) => {
        const params = new URLSearchParams();
        if (establishmentId) params.append('establishment_id', establishmentId);
        if (lat !== undefined) params.append('lat', lat.toString());
        if (lng !== undefined) params.append('lng', lng.toString());

        return {
          url: `carbon/weather/alerts/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Weather']
    }),

    getWeatherRecommendations: builder.query<
      WeatherResponse,
      { establishmentId?: string; lat?: number; lng?: number; establishmentType?: string }
    >({
      query: ({ establishmentId, lat, lng, establishmentType }) => {
        const params = new URLSearchParams();
        if (establishmentId) params.append('establishment_id', establishmentId);
        if (lat !== undefined) params.append('lat', lat.toString());
        if (lng !== undefined) params.append('lng', lng.toString());
        if (establishmentType) params.append('establishment_type', establishmentType);

        return {
          url: `carbon/weather/recommendations/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Weather']
    }),

    getWeatherForecast: builder.query<
      WeatherResponse,
      { establishmentId?: string; lat?: number; lng?: number; days?: number }
    >({
      query: ({ establishmentId, lat, lng, days = 7 }) => {
        const params = new URLSearchParams();
        if (establishmentId) params.append('establishment_id', establishmentId);
        if (lat !== undefined) params.append('lat', lat.toString());
        if (lng !== undefined) params.append('lng', lng.toString());
        params.append('days', days.toString());

        return {
          url: `carbon/weather/forecast/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Weather']
    }),

    createWeatherAlertEvent: builder.mutation<WeatherAlertEventResponse, WeatherAlertEventRequest>({
      query: (data) => ({
        url: 'carbon/weather/create-alert-event/',
        method: 'POST',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['Weather', 'IoTData', 'PendingEvent']
    }),

    // Phase 2 Optimization: Unified Complete Summary Endpoint
    getCompleteSummary: builder.query<CompleteSummary, string>({
      query: (productionId) => ({
        url: `carbon/public/productions/${productionId}/complete/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['CarbonSummary']
    }),

    getCropTemplates: builder.query<CropTemplatesResponse, { crop_type?: string } | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.crop_type) {
          searchParams.append('crop_type', params.crop_type);
        }

        return {
          url: `/carbon/crop-templates/${
            searchParams.toString() ? `?${searchParams.toString()}` : ''
          }`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['CropTemplate']
    }),

    getCropTemplateDetail: builder.query<CropTemplateDetail, string>({
      query: (templateId) => ({
        url: `/carbon/crop-templates/${templateId}/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: (result, error, templateId) => [{ type: 'CropTemplate', id: templateId }]
    }),

    // NEW: Get event templates by crop type
    getEventTemplatesByCropType: builder.query<EventTemplatesResponse, { cropTypeId: number }>({
      query: ({ cropTypeId }) => ({
        url: `/carbon/event-templates/by_crop_type/`,
        params: { crop_type_id: cropTypeId },
        credentials: 'include'
      }),
      providesTags: ['EventTemplate']
    }),

    // Educational Content Endpoints
    getUSDAMethodologyContent: builder.query<
      USDAMethodologyContent,
      { level?: 'beginner' | 'intermediate' | 'advanced'; context?: any; source?: string }
    >({
      query: ({ level = 'beginner', context, source }) => {
        const params = new URLSearchParams({ level });
        if (context) params.append('context', JSON.stringify(context));
        if (source) params.append('source', source);

        return {
          url: `carbon/education/usda-methodology/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Education']
    }),

    getRegionalBenchmark: builder.query<
      RegionalBenchmarkData,
      { establishmentId: number; carbonIntensity?: number; cropType?: string }
    >({
      query: ({ establishmentId, carbonIntensity, cropType }) => {
        const params = new URLSearchParams();
        if (carbonIntensity) params.append('carbon_intensity', carbonIntensity.toString());
        if (cropType) params.append('crop_type', cropType);

        return {
          url: `carbon/regional-benchmark/${establishmentId}/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Education']
    }),

    getUSDACredibilityInfo: builder.query<USDACredibilityData, number>({
      query: (establishmentId) => ({
        url: `carbon/usda-credibility/${establishmentId}/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Education']
    }),

    getCarbonImpactExamples: builder.query<
      CarbonImpactData,
      { value: number; unit?: string; maxExamples?: number; context?: any }
    >({
      query: ({ value, unit = 'kg CO2e', maxExamples = 6, context }) => {
        const params = new URLSearchParams({
          value: value.toString(),
          unit,
          max_examples: maxExamples.toString()
        });
        if (context) params.append('context', JSON.stringify(context));

        return {
          url: `carbon/education/carbon-examples/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Education']
    }),

    getTrustComparisonData: builder.query<
      TrustComparisonData,
      { establishmentId?: number; context?: any }
    >({
      query: ({ establishmentId, context }) => {
        const params = new URLSearchParams();
        if (establishmentId) params.append('establishment_id', establishmentId.toString());
        if (context) params.append('context', JSON.stringify(context));

        return {
          url: `carbon/education/trust-comparison/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Education']
    }),

    getRegionalFarmingPractices: builder.query<
      RegionalFarmingPractices,
      { state: string; cropType: string }
    >({
      query: ({ state, cropType }) => ({
        url: `carbon/education/regional-farming-practices/${state}/${cropType}/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Education']
    }),

    getEducationContent: builder.query<
      EducationContent,
      {
        topic: string;
        level?: 'beginner' | 'intermediate' | 'advanced';
        context?: any;
        source?: string;
      }
    >({
      query: ({ topic, level = 'beginner', context, source }) => {
        const params = new URLSearchParams({ level });
        if (context) params.append('context', JSON.stringify(context));
        if (source) params.append('source', source);

        return {
          url: `carbon/education/${topic}/?${params.toString()}`,
          method: 'GET',
          credentials: 'include'
        };
      },
      providesTags: ['Education']
    })
  })
});

export const {
  useGetEstablishmentCarbonSummaryQuery,
  useGetProductionCarbonSummaryQuery,
  useGetCarbonBenchmarksQuery,
  useGetQRCodeQuickScoreQuery,
  useGetQRCodeSummaryQuery,
  useGetPublicCarbonSummaryQuery,
  useGetProductionTimelineQuery,
  useCreateOffsetMutation,
  useCalculateEventCarbonImpactMutation,
  useGetIoTDeviceStatusQuery,
  useSimulateIoTDataMutation,
  useListIoTDevicesQuery,
  useGetIoTDeviceQuery,
  useRegisterIoTDeviceMutation,
  useUpdateIoTDeviceMutation,
  useDeleteIoTDeviceMutation,
  useGetIoTDeviceTypesQuery,
  useListAutomationRulesQuery,
  useCreateAutomationRuleMutation,
  useGetPendingEventsQuery,
  useApproveEventMutation,
  useRejectEventMutation,
  // Weather API hooks
  useGetCurrentWeatherConditionsQuery,
  useGetWeatherAlertsQuery,
  useGetWeatherRecommendationsQuery,
  useGetWeatherForecastQuery,
  useCreateWeatherAlertEventMutation,
  // Phase 2 Optimization: Unified Complete Summary
  useGetCompleteSummaryQuery,
  useGetCropTemplatesQuery,
  useGetCropTemplateDetailQuery,
  // Educational Content hooks
  useGetUSDAMethodologyContentQuery,
  useGetRegionalBenchmarkQuery,
  useGetUSDACredibilityInfoQuery,
  useGetCarbonImpactExamplesQuery,
  useGetTrustComparisonDataQuery,
  useGetRegionalFarmingPracticesQuery,
  useGetEducationContentQuery,
  // NEW: Get event templates by crop type
  useGetEventTemplatesByCropTypeQuery
} = carbonApi;
