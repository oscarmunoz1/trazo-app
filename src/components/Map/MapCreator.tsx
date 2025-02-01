import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { DrawingManager, GoogleMap, Polygon, useLoadScript } from '@react-google-maps/api';
import { clearForm, setForm } from 'store/features/formSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardFooter from 'components/Card/CardFooter.tsx';
import CardHeader from 'components/Card/CardHeader';
import { setRef } from '@fullcalendar/react';
import { useIntl } from 'react-intl';

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

const MapCreator = (props) => {
  const intl = useIntl();
  const { handleNext, prevTab, center, zoom, mapPolygon } = props;
  const bgButton = useColorModeValue(
    'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
    'gray.800'
  );
  const textColor = useColorModeValue('gray.700', 'white');
  const bgPrevButton = useColorModeValue('gray.100', 'gray.100');

  const [drawingMode, setDrawingMode] = useState(false);
  const [polygon, setPolygon] = useState([]);
  const [mapRef, setMapRef] = useState(null);

  const currentParcel = useSelector((state) => state.form.currentForm?.parcel);

  const dispatch = useDispatch();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  useEffect(() => {
    if (mapPolygon) {
      setPolygon(mapPolygon);
    }
  }, [mapPolygon]);

  const onMapClick = (event) => {
    if (drawingMode) {
      const newPoint = { lat: event.latLng.lat(), lng: event.latLng.lng() };
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
            center: mapRef?.getCenter().toJSON(),
            zoom: mapRef.getZoom()
          }
        }
      })
    );
    handleNext();
  };

  const handleOnLoad = (map) => {
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
          mx="auto">
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
                zoom={zoom || 6}
                center={
                  center ||
                  mapRef?.getCenter().toJSON() || {
                    lat: -32.74197207213357,
                    lng: -56.232580159032494
                  }
                }
                mapTypeId="satellite"
                onLoad={handleOnLoad}
                onClick={onMapClick}>
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
                  onClick={() => setPolygon([])}>
                  {intl.formatMessage({ id: 'app.clear' })}
                </Button>
                <Button
                  variant="outline"
                  colorScheme="green"
                  minW="110px"
                  fontSize="xs"
                  onClick={() => setDrawingMode((prevState) => !prevState)}>
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
            onClick={() => prevTab.current.click()}>
            <Text fontSize="xs" color="gray.700" fontWeight="bold">
              {intl.formatMessage({ id: 'app.prev' })}
            </Text>
          </Button>
          <Button
            bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
            _hover={{
              bg: 'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)'
            }}
            alignSelf="flex-end"
            mt="24px"
            w={{ sm: '75px', lg: '100px' }}
            h="35px"
            onClick={handleOnFinish}>
            <Text fontSize="xs" color="#fff" fontWeight="bold">
              {intl.formatMessage({ id: 'app.next' })}
            </Text>
          </Button>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default MapCreator;
