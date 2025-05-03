import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to check if user can create more resources based on subscription limits
 * @param {string} resourceType - Type of resource to check ('establishment' or 'parcel')
 * @param {number} establishmentId - Optional: Establishment ID when checking parcels
 * @returns {Object} - Check results and modal control
 */
export const useSubscriptionCheck = (resourceType, establishmentId = null) => {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [canCreate, setCanCreate] = useState(true);
  const [usage, setUsage] = useState({});

  const location = useLocation();
  const company = useSelector((state) => state.company.currentCompany);
  const plan = company?.subscription_plan;

  // Get current usage
  useEffect(() => {
    if (company) {
      const establishments = company.establishments?.length || 0;
      let parcels = 0;

      if (resourceType === 'parcel' && establishmentId) {
        // Count parcels for specific establishment
        const establishment = company.establishments?.find(
          (e) => e.id === parseInt(establishmentId)
        );
        parcels = establishment?.parcels?.length || 0;
      } else {
        // Count all parcels across all establishments
        company.establishments?.forEach((est) => {
          parcels += est.parcels?.length || 0;
        });
      }

      setUsage({ establishments, parcels });
      setIsChecking(false);

      // Check limits based on subscription plan
      const canCreateMore = checkSubscriptionLimits(resourceType, {
        establishments,
        parcels,
        plan,
        establishmentId
      });

      setCanCreate(canCreateMore);

      // Show modal only if coming from certain paths (not from pricing page return)
      if (!canCreateMore && !location.search.includes('return=upgrade')) {
        setShowLimitModal(true);
      }
    }
  }, [company, resourceType, establishmentId, location.search]);

  /**
   * Check if user has reached subscription limits
   */
  const checkSubscriptionLimits = (type, { establishments, parcels, plan, establishmentId }) => {
    if (!plan || !plan.features) return false;

    if (type === 'establishment') {
      const maxEstablishments = plan.features.max_establishments || 1;
      return establishments < maxEstablishments;
    }

    if (type === 'parcel') {
      // Check if has per-establishment limits (Corporate plan)
      if (plan.features.max_parcels_per_establishment > 0 && establishmentId) {
        const establishment = company.establishments?.find(
          (e) => e.id === parseInt(establishmentId)
        );
        const establishmentParcels = establishment?.parcels?.length || 0;
        return establishmentParcels < plan.features.max_parcels_per_establishment;
      }

      // Check global parcel limit
      const maxParcels = plan.features.max_parcels || 1;
      return parcels < maxParcels;
    }

    return false;
  };

  return {
    isChecking,
    canCreate,
    showLimitModal,
    setShowLimitModal,
    usage,
    currentPlan: plan
  };
};

export default useSubscriptionCheck;
