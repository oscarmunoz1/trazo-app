# Common Form Components

This directory contains reusable form components that provide a consistent structure and design across all forms in the Trazo application. These components follow the patterns established in the Add Event flow.

## Available Components

### Core Components

1. **MultiStepFormProvider** - Context provider for managing multi-step form state
2. **FormContainer** - Main container with responsive layout and sidebar support
3. **FormHeader** - Consistent header with title, description, and actions
4. **FormStepper** - Progress stepper for multi-step forms
5. **FormCard** - Consistent card wrapper for form sections
6. **SelectionGrid** - Generic selection grid for options, categories, etc.
7. **MediaUpload** - Drag-and-drop file upload component
8. **FormNavigationButtons** - Standardized navigation buttons
9. **FormInput** - Enhanced input component

## Quick Start

### Basic Single-Step Form

```jsx
import {
  FormContainer,
  FormHeader,
  FormCard,
  FormInput,
  FormNavigationButtons
} from 'components/Forms/Common';
import { useForm, FormProvider } from 'react-hook-form';

const SimpleForm = () => {
  const methods = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <FormContainer>
      <FormHeader title="Add Company" description="Enter company information below" />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormCard
            title="Company Details"
            actions={
              <FormNavigationButtons
                showPrevious={false}
                nextLabel="Create Company"
                isLoading={false}
              />
            }
          >
            <FormInput name="name" label="Company Name" isRequired />
            <FormInput name="email" label="Email" type="email" isRequired />
            <FormInput name="description" label="Description" />
          </FormCard>
        </form>
      </FormProvider>
    </FormContainer>
  );
};
```

### Multi-Step Form

```jsx
import {
  FormContainer,
  FormHeader,
  FormStepper,
  FormCard,
  MultiStepFormProvider,
  useMultiStepForm
} from 'components/Forms/Common';

const steps = [
  { title: 'Basic Info', description: 'Company details' },
  { title: 'Location', description: 'Address & location' },
  { title: 'Settings', description: 'Preferences' }
];

const MultiStepFormContent = () => {
  const { activeStep, completedSteps, formData, updateFormData, goToNextStep, goToPreviousStep } =
    useMultiStepForm();

  const onSubmitStep = (data) => {
    updateFormData(data);
    goToNextStep();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <FormCard title="Company Information">{/* Step 0 content */}</FormCard>;
      case 1:
        return <FormCard title="Location Details">{/* Step 1 content */}</FormCard>;
      case 2:
        return <FormCard title="Settings">{/* Step 2 content */}</FormCard>;
    }
  };

  return (
    <FormContainer>
      <FormHeader title="Add New Company" />
      <FormStepper steps={steps} activeStep={activeStep} completedSteps={completedSteps} />
      {renderStepContent()}
    </FormContainer>
  );
};

const AddCompanyForm = () => {
  return (
    <MultiStepFormProvider totalSteps={3}>
      <MultiStepFormContent />
    </MultiStepFormProvider>
  );
};
```

### Form with Sidebar

```jsx
const FormWithSidebar = () => {
  const renderSidebar = () => (
    <VStack spacing={4}>
      <Card>
        <CardBody>
          <Text>Help & Tips</Text>
          <Text fontSize="sm" color="gray.600">
            Tips and guidance for filling out the form
          </Text>
        </CardBody>
      </Card>
    </VStack>
  );

  return (
    <FormContainer sidebarContent={renderSidebar()}>
      <FormHeader title="Form with Sidebar" />
      {/* Form content */}
    </FormContainer>
  );
};
```

## Component Reference

### MultiStepFormProvider

Provides context for managing multi-step form state.

**Props:**

- `totalSteps: number` - Total number of steps
- `initialStep?: number` - Starting step (default: 0)
- `onStepChange?: (step: number) => void` - Callback when step changes
- `onComplete?: (formData: object) => void` - Callback when form is completed

**Hook: useMultiStepForm()**

Returns:

- `activeStep: number` - Current step index
- `completedSteps: number[]` - Array of completed step indices
- `formData: object` - Accumulated form data
- `isFirstStep: boolean` - Whether on first step
- `isLastStep: boolean` - Whether on last step
- `goToNextStep: () => void` - Navigate to next step
- `goToPreviousStep: () => void` - Navigate to previous step
- `goToStep: (index: number) => void` - Navigate to specific step
- `updateFormData: (data: object) => void` - Merge data into form state
- `resetForm: () => void` - Reset form to initial state

### FormContainer

Main container providing consistent layout and responsive behavior.

**Props:**

- `children: ReactNode` - Main form content
- `sidebarContent?: ReactNode` - Optional sidebar content
- `maxWidth?: string` - Maximum container width (default: '1200px')
- `spacing?: ResponsiveValue` - Vertical spacing between elements
- `sidebarWidth?: ResponsiveValue` - Sidebar width
- `sidebarPosition?: string` - Sidebar CSS position (default: 'sticky')
- `sidebarTop?: string` - Sidebar top offset (default: '80px')

### FormHeader

Consistent header component with title, description, and optional actions.

**Props:**

- `title: string` - Main title
- `description?: string` - Optional description
- `icon?: ReactElement` - Optional icon
- `actions?: ReactNode` - Optional action buttons
- `titleSize?: string` - Title font size (default: 'xl')
- `descriptionSize?: string` - Description font size (default: 'sm')

### FormStepper

Progress stepper for multi-step forms.

**Props:**

- `steps: Array<{title: string, description?: string, icon?: IconType}>` - Step configuration
- `activeStep: number` - Current active step
- `completedSteps?: number[]` - Completed steps
- `showCard?: boolean` - Whether to wrap in card (default: true)
- `showConnectors?: boolean` - Whether to show connecting lines (default: true)
- `showDescriptions?: boolean` - Whether to show step descriptions (default: true)
- `size?: 'sm' | 'md' | 'lg'` - Stepper size (default: 'md')
- `colorScheme?: string` - Color scheme (default: 'green')
- `onStepClick?: (index: number) => void` - Step click handler
- `allowStepClick?: boolean` - Whether steps are clickable (default: false)

### FormCard

Consistent card wrapper for form sections.

**Props:**

- `title?: string` - Card title
- `subtitle?: string` - Card subtitle
- `icon?: ReactElement` - Optional icon
- `children: ReactNode` - Card content
- `actions?: ReactNode` - Footer actions (typically navigation buttons)
- `headerActions?: ReactNode` - Header actions
- `showHeader?: boolean` - Whether to show header (default: true)
- `showBorder?: boolean` - Whether to show border (default: true)
- `spacing?: number` - Internal spacing (default: 6)
- `titleSize?: string` - Title font size (default: 'lg')

### SelectionGrid

Generic selection grid for options, categories, or types.

**Props:**

- `options: Array<{value: any, label: string, description?: string, icon?: IconType, color?: string}>` - Options to display
- `selectedValue?: any` - Currently selected value (single selection)
- `selectedValues?: any[]` - Currently selected values (multiple selection)
- `onSelect: (value: any | any[]) => void` - Selection handler
- `columns?: ResponsiveValue` - Grid columns (default: {base: 1, md: 2, lg: 4})
- `allowMultiple?: boolean` - Allow multiple selection (default: false)
- `variant?: 'button' | 'card'` - Display variant (default: 'button')
- `colorScheme?: string` - Color scheme (default: 'green')
- `showDescriptions?: boolean` - Show option descriptions (default: true)
- `height?: ResponsiveValue` - Option height (default: {base: '120px', md: '140px'})
- `renderOption?: (option, isSelected) => ReactNode` - Custom option renderer

### MediaUpload

Drag-and-drop file upload component.

**Props:**

- `onFilesChange: (files: File[]) => void` - File change handler
- `acceptedFiles?: File[]` - Currently accepted files
- `maxFiles?: number` - Maximum number of files (default: 5)
- `maxSize?: number` - Maximum file size in bytes (default: 10MB)
- `accept?: object` - File type restrictions (default: {'image/\*': []})
- `multiple?: boolean` - Allow multiple files (default: true)
- `disabled?: boolean` - Whether upload is disabled (default: false)
- `showPreviews?: boolean` - Show file previews (default: true)
- `previewType?: 'grid' | 'list'` - Preview layout (default: 'grid')
- `placeholder?: string` - Custom placeholder text
- `description?: string` - Custom description text
- `height?: string` - Upload area height (default: '280px')

### FormNavigationButtons

Standardized navigation buttons for forms.

**Props:**

- `onPrevious?: () => void` - Previous button handler
- `onNext?: () => void` - Next button handler (for non-submit buttons)
- `isLoading?: boolean` - Loading state (default: false)
- `showPrevious?: boolean` - Show previous button (default: true)
- `previousLabel?: string` - Previous button text (default: 'Previous')
- `nextLabel?: string` - Next button text (default: 'Continue')
- `nextType?: 'submit' | 'button'` - Next button type (default: 'submit')
- `nextColorScheme?: string` - Next button color (default: 'green')
- `isNextDisabled?: boolean` - Disable next button (default: false)
- `isPreviousDisabled?: boolean` - Disable previous button (default: false)
- `spacing?: string` - Button spacing (default: 'space-between')

## Design Patterns

### Consistent Styling

All components follow these design principles:

- **Cards**: `boxShadow="lg"`, `borderRadius="xl"`, responsive padding
- **Colors**: Use `useColorModeValue` for light/dark mode support
- **Spacing**: Consistent spacing scale (base: 4, md: 6, lg: 8)
- **Typography**: Semantic font sizes and weights
- **Transitions**: Smooth 0.3s ease transitions
- **Hover Effects**: Subtle elevation and transform effects

### Responsive Behavior

- **Mobile First**: All components are designed mobile-first
- **Breakpoints**: `base`, `md`, `lg`, `xl` breakpoints
- **Layout**: Single column on mobile, two-column with sidebar on desktop
- **Touch Friendly**: 42px minimum touch targets

### Form Validation

Use React Hook Form with Zod for validation:

```jsx
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';

const schema = object({
  name: string().min(1, 'Name is required'),
  email: string().email('Invalid email')
});

const methods = useForm({
  resolver: zodResolver(schema)
});
```

### Error Handling

Implement consistent error handling:

```jsx
const { data, isLoading, error } = useQuery();

if (isLoading) {
  return (
    <FormContainer>
      <FormHeader title="Loading..." />
      <Center py={20}>
        <Spinner size="xl" color="green.500" />
      </Center>
    </FormContainer>
  );
}

if (error) {
  return (
    <FormContainer>
      <FormHeader title="Error" />
      <Center py={20}>
        <Text color="red.500">Failed to load data</Text>
      </Center>
    </FormContainer>
  );
}
```

## Migration Guide

To migrate existing forms to use these components:

1. **Replace layout components**: Change custom layouts to `FormContainer`
2. **Add form header**: Use `FormHeader` for consistent titles
3. **Wrap content in cards**: Use `FormCard` for form sections
4. **Update navigation**: Replace custom buttons with `FormNavigationButtons`
5. **Multi-step forms**: Wrap with `MultiStepFormProvider` and use `useMultiStepForm`
6. **Selection grids**: Replace custom selection UI with `SelectionGrid`
7. **File uploads**: Replace custom upload UI with `MediaUpload`

## Best Practices

1. **Always use FormProvider**: Wrap forms with React Hook Form's FormProvider
2. **Consistent validation**: Use Zod schemas for form validation
3. **Loading states**: Show loading spinners for async operations
4. **Error handling**: Provide clear error messages and fallback UI
5. **Accessibility**: Ensure all components are accessible with proper ARIA labels
6. **Testing**: Test forms across different screen sizes and input methods
7. **Performance**: Use React.memo for expensive components
8. **Internationalization**: Use react-intl for all user-facing text

## Examples

See the following files for complete examples:

- `EditEvent.jsx` - Complex multi-step form with sidebar
- `NewEvent.jsx` - Original implementation reference
- Event type tabs - Simple form sections with validation

This component system ensures consistency, maintainability, and excellent user experience across all forms in the Trazo application.
