import React, { createContext, useContext, useState, useCallback } from 'react';

// Context for managing multi-step form state
const MultiStepFormContext = createContext();

export const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);
  if (!context) {
    throw new Error('useMultiStepForm must be used within a MultiStepFormProvider');
  }
  return context;
};

const MultiStepFormProvider = ({
  children,
  totalSteps,
  onStepChange,
  initialStep = 0,
  onComplete
}) => {
  const [activeStep, setActiveStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formData, setFormData] = useState({});

  const goToNextStep = useCallback(() => {
    if (activeStep < totalSteps - 1) {
      setCompletedSteps((prev) => [...prev, activeStep]);
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      onStepChange?.(nextStep);
    }
  }, [activeStep, totalSteps, onStepChange]);

  const goToPreviousStep = useCallback(() => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      onStepChange?.(prevStep);
    }
  }, [activeStep, onStepChange]);

  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        setActiveStep(stepIndex);
        onStepChange?.(stepIndex);
      }
    },
    [totalSteps, onStepChange]
  );

  const updateFormData = useCallback((newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const resetForm = useCallback(() => {
    setActiveStep(initialStep);
    setCompletedSteps([]);
    setFormData({});
  }, [initialStep]);

  const completeForm = useCallback(() => {
    setCompletedSteps((prev) => [...prev, activeStep]);
    onComplete?.(formData);
  }, [activeStep, formData, onComplete]);

  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === totalSteps - 1;
  const canGoNext = activeStep < totalSteps - 1;
  const canGoPrevious = activeStep > 0;

  const value = {
    // State
    activeStep,
    completedSteps,
    formData,
    totalSteps,

    // Computed properties
    isFirstStep,
    isLastStep,
    canGoNext,
    canGoPrevious,

    // Actions
    goToNextStep,
    goToPreviousStep,
    goToStep,
    updateFormData,
    resetForm,
    completeForm
  };

  return <MultiStepFormContext.Provider value={value}>{children}</MultiStepFormContext.Provider>;
};

export default MultiStepFormProvider;
