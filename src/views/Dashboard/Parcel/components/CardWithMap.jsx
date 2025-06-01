// Chakra imports
import { Box, Button, Flex, Icon, Portal, Spacer, Text } from '@chakra-ui/react';
import { GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

// react icons
import { BsArrowRight } from 'react-icons/bs';
// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';

// Utility function to calculate polygon center
const calculatePolygonCenter = (points) => {
  if (!points || points.length === 0) {
    return { lat: -31.27006513500534, lng: -57.199462864720985 }; // Default center
  }

  // Calculate bounds
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  points.forEach((point) => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });

  // Calculate center
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return { lat: centerLat, lng: centerLng };
};

// Utility function to calculate appropriate zoom level based on polygon bounds
const calculatePolygonZoom = (points) => {
  if (!points || points.length === 0) {
    return 16; // Default zoom
  }

  // Calculate bounds
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  points.forEach((point) => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  });

  // Calculate the span of the polygon
  const latSpan = Math.abs(maxLat - minLat);
  const lngSpan = Math.abs(maxLng - minLng);
  const maxSpan = Math.max(latSpan, lngSpan);

  // Add padding factor to ensure polygon doesn't touch edges (20% padding)
  const paddedSpan = maxSpan * 1.4;

  // More conservative zoom levels to ensure full polygon visibility
  if (paddedSpan > 2.0) return 6;
  if (paddedSpan > 1.0) return 7;
  if (paddedSpan > 0.5) return 8;
  if (paddedSpan > 0.3) return 9;
  if (paddedSpan > 0.2) return 10;
  if (paddedSpan > 0.1) return 11;
  if (paddedSpan > 0.05) return 12;
  if (paddedSpan > 0.02) return 13;
  if (paddedSpan > 0.01) return 14;
  return 15;
};

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

const CardWithBackground = ({ polygon, zoom, center }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  // Enhanced map centering logic - PRIORITIZE POLYGON CENTER OVER PROVIDED CENTER
  const [mapZoom, setMapZoom] = useState(() => {
    // Always calculate zoom from polygon if it exists
    if (polygon && polygon.length > 0) {
      return calculatePolygonZoom(polygon);
    }
    // Only use provided zoom if no polygon
    if (zoom) return zoom;
    return 16;
  });

  const [mapCenter, setMapCenter] = useState(() => {
    // Always calculate center from polygon if it exists
    if (polygon && polygon.length > 0) {
      return calculatePolygonCenter(polygon);
    }
    // Only use provided center if no polygon
    if (center) return center;
    return { lat: -31.27006513500534, lng: -57.199462864720985 };
  });

  useEffect(() => {
    // Update center and zoom when props change - PRIORITIZE POLYGON
    if (polygon && polygon.length > 0) {
      // Always use polygon-calculated center and zoom when polygon exists
      const newCenter = calculatePolygonCenter(polygon);
      const newZoom = calculatePolygonZoom(polygon);
      setMapCenter(newCenter);
      setMapZoom(newZoom);
    } else {
      // Only use provided props when no polygon
      if (center) {
        setMapCenter(center);
      }
      if (zoom) {
        setMapZoom(zoom);
      }
    }
  }, [zoom, center, polygon]);

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps';

  return (
    <Card maxHeight="290.5px" p="1rem">
      <CardBody p="0px" w="100%" h={{ sm: '200px', lg: '100%' }} borderRadius="15px">
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{
              width: '100%',
              height: '100%',
              borderRadius: '10px'
            }}
            zoom={mapZoom}
            center={mapCenter}
            mapTypeId="satellite">
            {polygon && polygon.length > 0 && (
              <Polygon
                path={polygon}
                options={{
                  fillColor: '#ff0000',
                  fillOpacity: 0.35,
                  strokeColor: '#ff0000',
                  strokeOpacity: 1,
                  strokeWeight: 2
                }}
              />
            )}
          </GoogleMap>
        )}
      </CardBody>
    </Card>
  );
};

export default CardWithBackground;
