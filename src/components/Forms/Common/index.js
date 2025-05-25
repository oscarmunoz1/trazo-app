// Common Form Components
export { default as MultiStepFormProvider, useMultiStepForm } from './MultiStepFormProvider';
export { default as FormContainer } from './FormContainer';
export { default as FormHeader } from './FormHeader';
export { default as FormStepper } from './FormStepper';
export { default as FormCard } from './FormCard';
export { default as SelectionGrid } from './SelectionGrid';
export { default as MediaUpload } from './MediaUpload';
export { default as CarbonOptimizationTips } from './CarbonOptimizationTips';

// Common Form Hooks
export { useCarbonCalculation } from './useCarbonCalculation';

// Common Form Configurations
export {
  EVENT_TYPE_CONFIG,
  EVENT_FORM_STEPS,
  EVENT_TYPE_MAP,
  FALLBACK_CARBON_SCORES
} from './EventTypeConfiguration';

// Common Form Schemas
export {
  formSchemaBasic,
  formSchemaMainInfo,
  formSchemaDescription,
  formSchemaMedia,
  companyFormSchema,
  parcelFormSchema
} from './FormSchemas';

// Re-export existing form components for consistency
export { default as EventFormLayout } from '../EventFormLayout';
export { default as EventFormStepper } from '../EventFormStepper';
export { default as EventTypeSelector } from '../EventTypeSelector';
export { default as FormNavigationButtons } from '../FormNavigationButtons';
export { default as FormInput } from '../FormInput';
