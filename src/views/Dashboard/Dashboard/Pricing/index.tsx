import PricingContent from '../../../../views/Pages/Pricing/index';
import { useLocation } from 'react-router-dom';

function DashboardPricing() {
  // This component reuses the pricing page content but in the dashboard layout
  const location = useLocation();

  return <PricingContent inDashboard={true} />;
}

export default DashboardPricing;
