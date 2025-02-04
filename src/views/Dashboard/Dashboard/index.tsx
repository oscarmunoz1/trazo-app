// Chakra imports
import {
  Button,
  Flex,
  Grid,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  Box
} from '@chakra-ui/react';
// Custom icons
import {
  CartIcon,
  DocumentIcon,
  GlobeIcon,
  HomeIcon,
  WalletIcon
} from 'components/Icons/Icons.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  dashboardTableData,
  establishmentData,
  parcelsData,
  timelineData
} from 'variables/general';

import ActiveUsers from './components/ActiveUsers';
import BarChart from 'components/Charts/BarChart';
import Card from 'components/Card/Card';
import CardWithBackground from './components/CardWithBackground';
import CardWithImage from 'components/Card/CardWithImage';
import CarouselHorizontal from 'components/Carousel/CarouselHorizontal';
import { FaPlus } from 'react-icons/fa';
import LineChart from 'components/Charts/LineChart';
import MiniStatistics from './components/MiniStatistics';
import SalesOverview from './components/SalesOverview';
import bgImage from 'assets/img/backgroundImage.png';
import defaultEstablishmentImage from 'assets/img/basic-auth.png';
// assets
import imageFarm from 'assets/img/imageFarm.png';
import { useSelector } from 'react-redux';

export default function DashboardView() {
  const intl = useIntl();
  const { establishmentId } = useParams();
  const navigate = useNavigate();
  const [establishment, setEstablishment] = useState(null);

  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const selectedGradient = useColorModeValue(
    'linear-gradient(81.62deg, #4CAF50 2.25%, #45A049 79.87%)',
    'linear-gradient(81.62deg, #388E3C 2.25%, #2E7D32 79.87%)'
  );
  const hoverBg = useColorModeValue('green.50', 'green.900');
  const borderColor = useColorModeValue('green.200', 'green.700');

  const bgGradient = useColorModeValue(
    'linear-gradient(to right, green.50, transparent)',
    'linear-gradient(to right, green.900, transparent)'
  );
  const shadowHover = useColorModeValue(
    '0 20px 27px 0 rgba(0, 0, 0, 0.05)',
    '0 20px 27px 0 rgba(0, 0, 0, 0.2)'
  );

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);

  // to check for active links and opened collapses
  let location = useLocation();

  const iconBoxInside = useColorModeValue('white', 'white');
  let mainText = useColorModeValue('gray.700', 'gray.200');

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName, isDashboard = false) => {
    if (isDashboard) {
      return location.pathname.startsWith(routeName) ? 'active' : '';
    }
    return location.pathname === routeName ? 'active' : '';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let establishment;
    if (establishments) {
      establishment = establishments.filter(
        (establishment) => establishment.id.toString() === establishmentId
      )[0];
      setEstablishment(establishment);
    }
  }, [establishmentId, establishments]);

  const toggleAddEstablishment = () => {
    navigate('/admin/dashboard/establishment/add');
  };

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
      <Box>
        <Flex justify="space-between" align="center" mb={4} px={{ base: 2, md: 0 }}>
          <Text
            color={mainText}
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize={{ base: 'lg', md: 'xl' }}
            padding={{ base: '8px', md: '10px' }}>
            {intl.formatMessage({ id: 'app.establishments' })}
          </Text>
        </Flex>

        <Grid
          templateColumns={{
            base: 'repeat(auto-fill, minmax(200px, 1fr))',
            sm: 'repeat(auto-fill, minmax(220px, 1fr))',
            md: 'repeat(auto-fill, minmax(240px, 1fr))'
          }}
          gap={{ base: 3, md: 4 }}
          px={{ base: 2, md: 2 }}>
          {establishments ? (
            <>
              {establishments.map((prop) => (
                <NavLink
                  key={prop.id}
                  to={`/admin/dashboard/establishment/${prop.id}`}
                  style={{ textDecoration: 'none' }}>
                  <Card
                    p={{ base: 3, md: 4 }}
                    cursor="pointer"
                    bg={prop.id === establishment?.id ? 'green.500' : cardBg}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: 'lg',
                      transition: 'all 0.2s'
                    }}>
                    <Flex align="center" gap={{ base: 2, md: 3 }}>
                      <Box
                        bg={prop.id === establishment?.id ? 'white' : 'green.500'}
                        p={{ base: 1.5, md: 2 }}
                        borderRadius="md">
                        <HomeIcon
                          h={{ base: '20px', md: '24px' }}
                          w={{ base: '20px', md: '24px' }}
                          color={prop.id === establishment?.id ? 'green.500' : 'white'}
                        />
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: 'sm', md: 'md' }}
                          color={prop.id === establishment?.id ? 'white' : textColor}>
                          {prop.name}
                        </Text>
                        <Text
                          fontSize={{ base: 'xs', md: 'sm' }}
                          color={prop.id === establishment?.id ? 'white' : 'gray.500'}>
                          {`${prop.city || prop.zone || ''}, ${prop.state}`}
                        </Text>
                      </Box>
                    </Flex>
                  </Card>
                </NavLink>
              ))}
              <Button
                p="0px"
                w={{ base: '64px', md: '77px' }}
                h={{ base: '64px', md: '77px' }}
                bg="transparent"
                color="green.500"
                borderRadius="15px"
                border="2px dashed"
                borderColor="green.200"
                _hover={{
                  bg: 'green.50',
                  borderColor: 'green.500',
                  transform: 'translateY(-2px)',
                  boxShadow: shadowHover
                }}
                onClick={toggleAddEstablishment}>
                <Flex direction="column" justifyContent="center" align="center">
                  <Icon
                    as={FaPlus}
                    w={{ base: '10px', md: '12px' }}
                    h={{ base: '10px', md: '12px' }}
                    mb={{ base: '6px', md: '8px' }}
                  />
                  <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight="bold">
                    {intl.formatMessage({ id: 'app.new' })}
                  </Text>
                </Flex>
              </Button>
            </>
          ) : (
            <Card minH="115px" bg={cardBg} />
          )}
        </Grid>
      </Box>

      <Grid
        templateColumns={{ md: '1fr', lg: '1.8fr 1.2fr' }}
        templateRows={{ md: '1fr auto', lg: '1fr' }}
        my="26px"
        gap="24px">
        {establishment ? (
          <CardWithImage
            title={intl.formatMessage({ id: 'app.establishmentProfile' })}
            name={establishment?.name}
            description={establishment?.description}
            state={establishment?.state}
            city={establishment?.city}
            zone={establishment?.zone}
            readMoreLink={`/admin/dashboard/establishment/${establishment?.id}/profile`}
            bgGradient={bgGradient}
            borderLeft="4px solid"
            borderColor="green.500"
            boxShadow={shadowHover}
            _hover={{
              boxShadow: shadowHover
            }}
            image={
              <Image
                src={establishment?.image || defaultEstablishmentImage}
                alt="establishment image"
                width="100%"
                height="100%"
                objectFit={'cover'}
                borderRadius="15px"
                loading="lazy"
              />
            }
          />
        ) : (
          <Card minH="290px" bg={cardBg} />
        )}

        {establishment ? (
          <CardWithBackground
            backgroundImage={imageFarm}
            title={intl.formatMessage({ id: 'app.certifications' })}
            description={intl.formatMessage({ id: 'app.certifications_description' })}
          />
        ) : (
          <Card minH="290px" bg={cardBg} />
        )}
      </Grid>
      <CarouselHorizontal
        title={intl.formatMessage({ id: 'app.parcels' })}
        description={intl.formatMessage({ id: 'app.establishmentParcels' })}
        data={establishment?.parcels}
      />
    </Flex>
  );
}
