import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { DrawingManager, GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import { clearForm, setForm } from 'store/features/formSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter';
import CardHeader from 'components/Card/CardHeader';
import { setRef } from '@fullcalendar/react';
import { useIntl } from 'react-intl';

interface PolygonPoint {
  lat: number;
  lng: number;
}

interface MapCreatorProps {
  handleNext: () => void;
  prevTab: React.RefObject<HTMLButtonElement>;
  center?: PolygonPoint;
  zoom?: number;
  mapPolygon?: PolygonPoint[];
}

// Utility function to calculate polygon center
const calculatePolygonCenter = (points: PolygonPoint[]): PolygonPoint => {
  if (!points || points.length === 0) {
    return { lat: -32.74197207213357, lng: -56.232580159032494 }; // Default center
  }

  // Calculate bounds
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  points.forEach((point: PolygonPoint) => {
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
const calculatePolygonZoom = (points: PolygonPoint[]): number => {
  if (!points || points.length === 0) {
    return 6; // Default zoom
  }

  // Calculate bounds
  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLng = points[0].lng;
  let maxLng = points[0].lng;

  points.forEach((point: PolygonPoint) => {
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

const MapCreator: React.FC<MapCreatorProps> = (props) => {
  const intl = useIntl();
  const { handleNext, prevTab, center, zoom, mapPolygon } = props;
  const bgButton = useColorModeValue(
    'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
    'gray.800'
  );
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');

  const [drawingMode, setDrawingMode] = useState(false);
  const [polygon, setPolygon] = useState<PolygonPoint[]>([]);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Enhanced map centering logic
  const [mapCenter, setMapCenter] = useState<PolygonPoint>(() => {
    if (center) return center;
    if (mapPolygon && mapPolygon.length > 0) {
      return calculatePolygonCenter(mapPolygon);
    }
    return { lat: -32.74197207213357, lng: -56.232580159032494 };
  });

  const [mapZoom, setMapZoom] = useState<number>(() => {
    if (zoom) return zoom;
    if (mapPolygon && mapPolygon.length > 0) {
      return calculatePolygonZoom(mapPolygon);
    }
    return 6;
  });

  const currentParcel = useSelector((state: any) => state.form.currentForm?.parcel);

  const dispatch = useDispatch();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  useEffect(() => {
    if (mapPolygon) {
      setPolygon(mapPolygon);
      // Update map center and zoom when polygon is provided
      const newCenter = calculatePolygonCenter(mapPolygon);
      const newZoom = calculatePolygonZoom(mapPolygon);
      setMapCenter(newCenter);
      setMapZoom(newZoom);
    }
  }, [mapPolygon]);

  // Update map center when polygon changes during editing
  useEffect(() => {
    if (polygon.length >= 3) {
      const newCenter = calculatePolygonCenter(polygon);
      const newZoom = calculatePolygonZoom(polygon);
      setMapCenter(newCenter);
      setMapZoom(newZoom);
    }
  }, [polygon]);

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (drawingMode && event.latLng) {
      const newPoint: PolygonPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      setPolygon([...polygon, newPoint]);
    }
  };

  const handleOnFinish = () => {
    dispatch(
      setForm({
        parcel: {
          ...currentParcel,
          polygon,
          map_metadata: {
            center: mapRef?.getCenter()?.toJSON() || mapCenter,
            zoom: mapRef ? mapRef.getZoom() : mapZoom
          }
        }
      })
    );
    handleNext();
  };

  const handleOnLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };

  return (
    <Card>
      <CardHeader mb="20px">
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          w="80%"
          mx="auto"
        >
          <Text color={textColor} fontSize="lg" fontWeight="bold" mb="4px">
            {intl.formatMessage({ id: 'app.whereIsTheParcelLocated' })}
          </Text>
          <Text color="gray.400" fontWeight="normal" fontSize="sm">
            {intl.formatMessage({ id: 'app.indicateTheLocationOfTheParcel' })}
          </Text>
        </Flex>
      </CardHeader>

      <CardBody justifyContent={'center'} mb="20px">
        <Flex direction="column" w="80%" h="300px">
          {isLoaded && (
            <>
              <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px'
                }}
                zoom={mapZoom}
                center={mapCenter}
                mapTypeId="satellite"
                onLoad={handleOnLoad}
                onClick={onMapClick}
              >
                <Polygon
                  path={polygon}
                  options={{
                    fillColor: '#ff0000',
                    fillOpacity: 0.35,
                    strokeColor: '#ff0000',
                    strokeOpacity: 1,
                    strokeWeight: 2
                  }}
                  editable={true}
                  draggable={true}
                />
              </GoogleMap>
              <Flex mt="20px" justifyContent={'flex-end'} gap={'20px'}>
                <Button
                  bg={bgButton}
                  color="white"
                  fontSize="xs"
                  variant="no-hover"
                  onClick={() => setPolygon([])}
                >
                  {intl.formatMessage({ id: 'app.clear' })}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  minW="110px"
                  fontSize="xs"
                  onClick={() => setDrawingMode((prevState) => !prevState)}
                >
                  {drawingMode
                    ? intl.formatMessage({ id: 'app.stopEditing' })
                    : intl.formatMessage({ id: 'app.editMode' })}
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </CardBody>
      <CardFooter>
        <Flex justify="space-between" width={'100%'}>
          <Button
            variant="no-hover"
            bg={bgPrevButton}
            alignSelf="flex-end"
            mt="24px"
            w={{ sm: '75px', lg: '100px' }}
            h="35px"
            onClick={() => prevTab.current?.click()}
          >
            <Text fontSize="xs" color="gray.700" fontWeight="bold">
              PREV
            </Text>
          </Button>
          <Button
            bg={bgButton}
            _hover={{
              bg: bgButton
            }}
            alignSelf="flex-end"
            mt="24px"
            w={{ sm: '75px', lg: '100px' }}
            h="35px"
            onClick={handleOnFinish}
          >
            <Text fontSize="xs" color="#fff" fontWeight="bold">
              NEXT
            </Text>
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default MapCreator;
