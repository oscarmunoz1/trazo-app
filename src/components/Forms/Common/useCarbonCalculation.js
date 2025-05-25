import { useState, useCallback } from 'react';
import { useCalculateEventCarbonImpactMutation } from 'store/api/carbonApi';
import { EVENT_TYPE_MAP, FALLBACK_CARBON_SCORES } from './EventTypeConfiguration';

export const useCarbonCalculation = (parcelId, establishmentId) => {
  const [carbonCalculation, setCarbonCalculation] = useState(null);
  const [isCalculatingCarbon, setIsCalculatingCarbon] = useState(false);
  const [shouldShowCarbonTips, setShouldShowCarbonTips] = useState(false);

  const [calculateCarbonImpact] = useCalculateEventCarbonImpactMutation();

  const calculateCarbonWithDebounce = useCallback(
    async (formData, eventType) => {
      if (!formData || Object.keys(formData).length === 0) {
        setCarbonCalculation(null);
        setShouldShowCarbonTips(false);
        return;
      }

      const timeoutId = setTimeout(async () => {
        try {
          setIsCalculatingCarbon(true);

          const event_type = EVENT_TYPE_MAP[eventType] || 'general';

          const event_data = {
            ...formData,
            date: formData.date || new Date().toISOString().slice(0, 16),
            event_type: event_type,
            parcel_id: parseInt(parcelId || '0'),
            establishment_id: parseInt(establishmentId || '0')
          };

          const result = await calculateCarbonImpact({
            event_type,
            event_data
          }).unwrap();

          setCarbonCalculation(result);
          setShouldShowCarbonTips(true);
        } catch (error) {
          console.error('Carbon calculation failed:', error);

          // Set fallback calculation based on event type
          const fallback = FALLBACK_CARBON_SCORES[eventType] || FALLBACK_CARBON_SCORES[3];

          setCarbonCalculation({
            co2e: fallback.co2e,
            efficiency_score: fallback.efficiency_score,
            usda_verified: false,
            calculation_method: 'estimate',
            event_type: EVENT_TYPE_MAP[eventType] || 'general',
            timestamp: new Date().toISOString(),
            estimated_cost: fallback.co2e * 50, // Rough cost estimate
            warning: 'Using estimated values - calculations temporarily unavailable'
          });
          setShouldShowCarbonTips(true);
        } finally {
          setIsCalculatingCarbon(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    },
    [calculateCarbonImpact, parcelId, establishmentId]
  );

  const resetCalculation = useCallback(() => {
    setCarbonCalculation(null);
    setIsCalculatingCarbon(false);
    setShouldShowCarbonTips(false);
  }, []);

  return {
    carbonCalculation,
    isCalculatingCarbon,
    shouldShowCarbonTips,
    calculateCarbonWithDebounce,
    resetCalculation
  };
};
