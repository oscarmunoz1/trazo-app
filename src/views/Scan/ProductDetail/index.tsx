import React from 'react';
import { useBreakpointValue } from '@chakra-ui/react';
import { lazy, Suspense } from 'react';
import ProductDetail from './ProductDetail';

// Lazy load the mobile view for better performance
const MobileProductDetail = lazy(() => import('./components/mobile/MobileProductDetail'));

const ProductDetailContainer: React.FC = () => {
  // Determine if we should use mobile view based on screen size
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Use suspense to handle lazy loading of mobile component
  return (
    <Suspense fallback={<ProductDetail />}>
      {isMobile ? <MobileProductDetail /> : <ProductDetail />}
    </Suspense>
  );
};

export default ProductDetailContainer;
