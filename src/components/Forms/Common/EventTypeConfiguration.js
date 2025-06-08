import { BsFillCloudLightningRainFill } from 'react-icons/bs';
import { RocketIcon } from 'components/Icons/Icons';
import { SlChemistry } from 'react-icons/sl';
import { FaEdit, FaTools, FaSeedling, FaBusinessTime, FaBug } from 'react-icons/fa';

// Shared event type configuration for all forms
// CRITICAL: These values MUST match the backend constants in trazo-back/history/constants.py
export const EVENT_TYPE_CONFIG = [
  {
    id: 0,
    value: 0, // WEATHER_EVENT_TYPE = 0
    name: 'weather',
    label: 'Weather',
    icon: BsFillCloudLightningRainFill,
    color: 'blue',
    description: 'Weather events affecting your crops'
  },
  {
    id: 1,
    value: 2, // ✅ FIXED: PRODUCTION_EVENT_TYPE = 2 (was incorrectly 1)
    name: 'production',
    label: 'Production',
    icon: RocketIcon,
    color: 'green',
    description: 'Agricultural production activities'
  },
  {
    id: 2,
    value: 1, // ✅ FIXED: CHEMICAL_EVENT_TYPE = 1 (was incorrectly 2)
    name: 'chemical',
    label: 'Chemical',
    icon: SlChemistry,
    color: 'purple',
    description: 'Chemical applications and treatments'
  },
  {
    id: 3,
    value: 3, // GENERAL_EVENT_TYPE = 3
    name: 'general',
    label: 'General',
    icon: FaEdit,
    color: 'gray',
    description: 'Other farming activities'
  },
  {
    id: 4,
    value: 4, // EQUIPMENT_EVENT_TYPE = 4
    name: 'equipment',
    label: 'Equipment',
    icon: FaTools,
    color: 'orange',
    description: 'Equipment maintenance and fuel tracking'
  },
  {
    id: 5,
    value: 5, // SOIL_MANAGEMENT_EVENT_TYPE = 5
    name: 'soil_management',
    label: 'Soil Management',
    icon: FaSeedling,
    color: 'brown',
    description: 'Soil testing and amendments'
  },
  {
    id: 6,
    value: 6, // BUSINESS_EVENT_TYPE = 6
    name: 'business',
    label: 'Business',
    icon: FaBusinessTime,
    color: 'teal',
    description: 'Sales, certifications, and compliance'
  },
  {
    id: 7,
    value: 7, // PEST_MANAGEMENT_EVENT_TYPE = 7
    name: 'pest_management',
    label: 'Pest Management',
    icon: FaBug,
    color: 'red',
    description: 'IPM practices and beneficial releases'
  }
];

// Reverse mapping for consistency (backend value -> frontend config)
export const EVENT_TYPE_VALUE_TO_CONFIG = EVENT_TYPE_CONFIG.reduce((acc, config) => {
  acc[config.value] = config;
  return acc;
}, {});

// Event type mapping for backend (corrected to match backend constants)
export const EVENT_TYPE_MAP = {
  0: 'weather', // WEATHER_EVENT_TYPE = 0
  1: 'chemical', // ✅ FIXED: CHEMICAL_EVENT_TYPE = 1
  2: 'production', // ✅ FIXED: PRODUCTION_EVENT_TYPE = 2
  3: 'general', // GENERAL_EVENT_TYPE = 3
  4: 'equipment', // EQUIPMENT_EVENT_TYPE = 4
  5: 'soil_management', // SOIL_MANAGEMENT_EVENT_TYPE = 5
  6: 'business', // BUSINESS_EVENT_TYPE = 6
  7: 'pest_management' // PEST_MANAGEMENT_EVENT_TYPE = 7
};

// Reverse mapping (name -> backend value)
export const EVENT_NAME_TO_TYPE = Object.entries(EVENT_TYPE_MAP).reduce((acc, [value, name]) => {
  acc[name] = parseInt(value);
  return acc;
}, {});

// Step configuration for event forms
export const EVENT_FORM_STEPS = [
  { title: 'Basic Info', description: 'Event type & date' },
  { title: 'Event Details', description: 'Specific information' },
  { title: 'Description', description: 'Notes & observations' },
  { title: 'Media', description: 'Photos & documentation' }
];

// Fallback carbon calculation scores
export const FALLBACK_CARBON_SCORES = {
  0: { co2e: 0.1, efficiency_score: 75 }, // Weather
  1: { co2e: 2.5, efficiency_score: 60 }, // Production
  2: { co2e: 1.8, efficiency_score: 50 }, // Chemical
  3: { co2e: 0.5, efficiency_score: 70 }, // General
  4: { co2e: 8.0, efficiency_score: 55 }, // Equipment
  5: { co2e: -1.5, efficiency_score: 90 }, // Soil Management
  6: { co2e: 0.3, efficiency_score: 85 }, // Business
  7: { co2e: -0.8, efficiency_score: 80 } // Pest Management
};
