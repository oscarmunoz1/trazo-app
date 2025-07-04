/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { AiFillBackward, AiFillForward } from 'react-icons/ai';
// Chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Progress,
  Spacer,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { BsBatteryCharging, BsMusicNoteBeamed } from 'react-icons/bs';
import {
  ClockIcon,
  DocumentIcon,
  RocketIcon,
  SettingsIcon,
  WalletIcon
} from 'components/Icons/Icons';
import {
  FaCheckCircle,
  FaLightbulb,
  FaPaypal,
  FaPlay,
  FaRegLightbulb,
  FaShare,
  FaUser,
  FaWallet
} from 'react-icons/fa';
import React, { useState } from 'react';
import { RiArrowDropRightLine, RiMastercardFill } from 'react-icons/ri';
import {
  lineChartDataWidgets1,
  lineChartDataWidgets2,
  lineChartDataWidgets3,
  lineChartOptionsWidgets1,
  lineChartOptionsWidgets2,
  lineChartOptionsWidgets3
} from 'variables/charts';

import BackgroundCard1 from 'assets/img/BackgroundCard1.png';
import BgMusicCard from 'assets/img/BgMusicCard.png';
import Calories from './components/Calories';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import Categories from './components/Categories';
import City from './components/City';
import EventCalendar from 'components/Calendars/EventCalendar';
import FullBody from './components/FullBody';
import { HSeparator } from 'components/Separator/Separator';
import IconBox from 'components/Icons/IconBox';
import Income from './components/Income';
import Lights from './components/Lights';
import LineChart from 'components/Charts/LineChart';
import OrdersOverview from './components/OrdersOverview';
import PaymentCard from './components/PaymentCard';
import PaymentStatistics from './components/PaymentStatistics';
import SomeKindOfBlues from './components/SomeKindOfBlues';
import Steps from './components/Steps';
import Tasks from '../Projects/General/components/Tasks';
import TimelineRow from 'components/Tables/TimelineRow';
import UpcomingEvents from './components/UpcomingEvents';
import WidgetsStatistics from './components/WidgetsStatistics';
import { calendarDataWidgets } from 'variables/calendar';
import { timelineData } from 'variables/general';

function Widgets() {
  const textColor = useColorModeValue('gray.700', 'white');
  const iconTeal = useColorModeValue('green.400', 'green.400');

  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      <Grid
        templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: '1fr 1fr 2fr' }}
        templateRows="1fr"
        gap="24px"
        mb="24px"
      >
        <Stack direction="column" spacing="24px">
          <WidgetsStatistics
            icon={<Icon as={BsBatteryCharging} h={'24px'} w={'24px'} color={iconTeal} />}
            title={'Battery Health'}
            percentage={99}
          />
          <WidgetsStatistics
            icon={<Icon as={BsMusicNoteBeamed} h={'24px'} w={'24px'} color={iconTeal} />}
            title={'Music Volume'}
            percentage={30}
          />
        </Stack>
        <Income />
        <Tasks />
      </Grid>
      <Grid
        templateColumns={{
          sm: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)'
        }}
        gap="24px"
        mb="24px"
      >
        <UpcomingEvents />
        <Stack direction={{ sm: 'column', md: 'row' }} spacing="24px">
          <PaymentStatistics
            icon={<Icon h={'24px'} w={'24px'} color="white" as={FaWallet} />}
            title={'Salary'}
            description={'Belong interactive'}
            amount={2000}
          />
          <PaymentStatistics
            icon={<Icon h={'24px'} w={'24px'} color="white" as={FaPaypal} />}
            title={'Paypal'}
            description={'Freelance Payment'}
            amount={4550}
          />
        </Stack>
        <PaymentCard />
      </Grid>
      <Grid
        templateColumns={{
          sm: '1fr',
          md: '1fr 1fr',
          lg: '1.5fr 1fr 1.2fr 1fr 1fr'
        }}
        gap="24px"
        mb="24px"
      >
        <FullBody />
        <Lights />
        <Calories />
        <City />
        <Steps />
      </Grid>
      <Grid templateColumns={{ sm: '1fr', lg: '1fr .5fr .7fr' }} gap="24px">
        <Card minH="550px">
          <CardHeader mb="6px">
            <Flex direction="column">
              <Text color={textColor} fontSize="lg" fontWeight="bold" mb="6px">
                Calendar
              </Text>
              <Text color="gray.400" fontSize="sm" fontWeight="normal">
                Wednesday, 2021
              </Text>
            </Flex>
          </CardHeader>
          <CardBody position="relative" display="block" height="100%">
            <EventCalendar initialDate="2021-10-01" calendarData={calendarDataWidgets} />
          </CardBody>
        </Card>
        <Stack direction="column" spacing="24px">
          <Categories />
          <SomeKindOfBlues />
        </Stack>
        <OrdersOverview title={'Orders Overview'} amount={30} data={timelineData} />
      </Grid>
    </Flex>
  );
}

export default Widgets;
