import { BsFillCloudLightningRainFill } from 'react-icons/bs';
import { RocketIcon } from 'components/Icons/Icons';
import { SlChemistry } from 'react-icons/sl';
import { FaEdit, FaTools, FaSeedling, FaBusinessTime, FaBug } from 'react-icons/fa';

// Shared event type configuration for all forms
export const EVENT_TYPE_CONFIG = [
  {
    id: 0,
    value: 0,
    name: 'weather',
    label: 'Weather',
    icon: BsFillCloudLightningRainFill,
    color: 'blue',
    description: 'Weather events affecting your crops'
  },
  {
    id: 1,
    value: 1,
    name: 'production',
    label: 'Production',
    icon: RocketIcon,
    color: 'green',
    description: 'Agricultural production activities'
  },
  {
    id: 2,
    value: 2,
    name: 'chemical',
    label: 'Chemical',
    icon: SlChemistry,
    color: 'purple',
    description: 'Chemical applications and treatments'
  },
  {
    id: 3,
    value: 3,
    name: 'general',
    label: 'General',
    icon: FaEdit,
    color: 'gray',
    description: 'Other farming activities'
  },
  {
    id: 4,
    value: 4,
    name: 'equipment',
    label: 'Equipment',
    icon: FaTools,
    color: 'orange',
    description: 'Equipment maintenance and fuel tracking'
  },
  {
    id: 5,
    value: 5,
    name: 'soil_management',
    label: 'Soil Management',
    icon: FaSeedling,
    color: 'brown',
    description: 'Soil testing and amendments'
  },
  {
    id: 6,
    value: 6,
    name: 'business',
    label: 'Business',
    icon: FaBusinessTime,
    color: 'teal',
    description: 'Sales, certifications, and compliance'
  },
  {
    id: 7,
    value: 7,
    name: 'pest_management',
    label: 'Pest Management',
    icon: FaBug,
    color: 'red',
    description: 'IPM practices and beneficial releases'
  }
];

// Step configuration for event forms
export const EVENT_FORM_STEPS = [
  { title: 'Basic Info', description: 'Event type & date' },
  { title: 'Event Details', description: 'Specific information' },
  { title: 'Description', description: 'Notes & observations' },
  { title: 'Media', description: 'Photos & documentation' }
];

// Event type mapping for backend
export const EVENT_TYPE_MAP = {
  0: 'weather',
  1: 'production',
  2: 'chemical',
  3: 'general',
  4: 'equipment',
  5: 'soil_management',
  6: 'business',
  7: 'pest_management'
};

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
