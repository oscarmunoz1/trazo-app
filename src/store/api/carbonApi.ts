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
    })
  })
});

export const {
  useGetEstablishmentCarbonSummaryQuery,
  useGetProductionCarbonSummaryQuery,
  useGetCarbonBenchmarksQuery,
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
  useCreateWeatherAlertEventMutation
} = carbonApi;
