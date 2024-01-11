// Chakra imports
import { Box, Button, Flex, Icon, Portal, Spacer, Text } from '@chakra-ui/react';
import { GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

// react icons
import { BsArrowRight } from 'react-icons/bs';
// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

const CardWithBackground = ({ polygon, zoom, center }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  const [mapZoom, setMapZoom] = useState(16);
  const [mapCenter, setMapCenter] = useState({ lat: -31.27006513500534, lng: -57.199462864720985 });

  useEffect(() => {
    if (zoom) setMapZoom(zoom);
    if (center) setMapCenter(center);
  }, [zoom, center]);

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
          </GoogleMap>
        )}
      </CardBody>
    </Card>
  );
};

export default CardWithBackground;
