// Chakra imports
import { Flex, Grid, Image, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { dashboardTableData, timelineData } from 'variables/general';
import { useDispatch, useSelector } from 'react-redux';

import BgMusicCard from 'assets/img/BgMusicCard.png';
import Card from 'components/Card/Card';
import CardWithImage from 'components/Card/CardWithImage';
import CardWithMap from './components/CardWithMap';
import HistoryCard from './components/HistoryCard';
import TrackList from './components/TrackList';
// assets
import imageMap from 'assets/img/imageMap.png';
import imageParcel1 from 'assets/img/ImageParcel1.png';
import { setParcel } from 'store/features/productSlice';
import { useGetParcelQuery } from 'store/api/productApi';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

export default function ParcelView() {
  const intl = useIntl();
  const { establishmentId, parcelId } = useParams();
  const dispatch = useDispatch();

  const mainText = useColorModeValue('gray.700', 'gray.200');
  const cardColor = useColorModeValue('white', 'gray.700');

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const establishment = useSelector(
    (state) =>
      state.company.currentCompany?.establishments?.filter(
        (establishment) => establishment.id === Number(establishmentId)
      )[0]
  );

  const { data, error, isLoading, isFetching, refetch } = useGetParcelQuery(
    { parcelId, establishmentId, companyId: currentCompany?.id },
    {
      skip: !parcelId || !establishmentId || !currentCompany || currentCompany?.id === undefined
    }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data) dispatch(setParcel(data));
  }, [data]);

  const historyCardTitles = [
    intl.formatMessage({ id: 'app.timeFrame' }),
    intl.formatMessage({ id: 'app.product' }),
    intl.formatMessage({ id: 'app.members' }),
    intl.formatMessage({ id: 'app.certified' })
  ];

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
      <Text
        color={mainText}
        href="#"
        bg="inherit"
        borderRadius="inherit"
        fontWeight="bold"
        padding="10px">
        {establishment?.name}
      </Text>
      <Grid
        templateColumns={{ md: '1fr', lg: '1.8fr 1.2fr' }}
        templateRows={{ md: '1fr auto', lg: '1fr' }}
        my="26px"
        gap="24px">
        {establishment ? (
          <CardWithImage
            title={`${establishment?.city || establishment?.zone || ''}, ${establishment?.state}`}
            name={data?.name}
            description={data?.description}
            state={establishment?.state}
            city={establishment?.city}
            zone={establishment?.zone}
            readMoreLink={`/admin/dashboard/establishment/${establishmentId}/parcel/${parcelId}/profile`}
            image={
              <Image
                src={data?.image || (!isLoading && !isFetching && BgMusicCard)}
                alt="chakra image"
                objectFit={'cover'}
                minWidth={{ md: '300px', lg: 'auto' }}
                width="100%"
                borderRadius="15px"
                height="100%"
              />
            }
          />
        ) : (
          <Card minH="290px" bg={cardColor} />
        )}

        <CardWithMap
          polygon={data?.polygon}
          center={data?.map_metadata?.center}
          zoom={data?.map_metadata?.zoom}
        />
      </Grid>
      <Grid
        templateColumns={{ sm: '1fr', md: '1fr', lg: '1fr 2fr' }}
        templateRows={{ sm: '1fr auto', md: '1fr', lg: '1fr' }}
        gap="24px">
        <TrackList amount={40} />
        <HistoryCard
          title={'History'}
          amount={data?.productions_completed}
          captions={historyCardTitles}
        />
      </Grid>
    </Flex>
  );
}
