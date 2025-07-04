// Custom icons
import { CartIcon, DocumentIcon, GlobeIcon, WalletIcon } from 'components/Icons/Icons.tsx';
// Chakra imports
import { Flex, Grid, Image, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { rtlDashboardTableData, rtlTimelineData } from 'variables/general';

import ActiveUsers from './components/ActiveUsers';
import BarChart from 'components/Charts/BarChart';
import BuiltByDevelopers from './components/BuiltByDevelopers';
import LineChart from 'components/Charts/LineChart';
import MiniStatistics from 'views/Dashboard/Default/components/MiniStatistics';
import OrdersOverview from './components/OrdersOverview';
import Projects from './components/Projects';
import React from 'react';
import SalesOverview from './components/SalesOverview';
import WorkWithTheRockets from './components/WorkWithTheRockets';
import { barChartDataRTL } from 'variables/charts';
import { barChartOptionsRTL } from 'variables/charts';
import logoChakra from 'assets/svg/logo-white.svg';
// assets
import peopleImage from 'assets/img/people-image.png';

export default function Dashboard() {
  // Chakra Color Mode

  const iconBoxInside = useColorModeValue('white', 'white');

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        <MiniStatistics
          title={'إجمالي المبيعات'}
          amount={'$53,000'}
          percentage={55}
          icon={<WalletIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={'عملاء جدد'}
          amount={'2,300'}
          percentage={5}
          icon={<GlobeIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={'مستخدمو اليوم'}
          amount={'+3,020'}
          percentage={-14}
          icon={<DocumentIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={'أموال اليوم'}
          amount={'$173,000'}
          percentage={8}
          icon={<CartIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
      </SimpleGrid>
      <Grid
        templateColumns={{ md: '1fr', lg: '1.8fr 1.2fr' }}
        templateRows={{ md: '1fr auto', lg: '1fr' }}
        my="26px"
        gap="24px"
      >
        <BuiltByDevelopers
          title={'بناها المطورون'}
          name={'لوحة معلومات Purity UI'}
          description={'من الألوان والبطاقات والطباعة إلى العناصر المعقدة ، ستجد الوثائق الكاملة.'}
          image={
            <Image src={logoChakra} alt="chakra image" minWidth={{ md: '300px', lg: 'auto' }} />
          }
        />
        <WorkWithTheRockets
          backgroundImage={peopleImage}
          title={'العمل مع الصواريخ'}
          description={
            'تكوين الثروة هو لعبة ثورية حديثة ذات محصلة إيجابية. الأمر كله يتعلق بمن يغتنم الفرصة أولاً.'
          }
        />
      </Grid>
      <Grid
        templateColumns={{ sm: '1fr', lg: '1.3fr 1.7fr' }}
        templateRows={{ sm: 'repeat(2, 1fr)', lg: '1fr' }}
        gap="24px"
        mb={{ lg: '26px' }}
      >
        <ActiveUsers
          title={'المستخدمين النشطين'}
          percentage={23}
          chart={<BarChart chartData={barChartDataRTL} chartOptions={barChartOptionsRTL} />}
        />
        <SalesOverview title={'نظرة عامة على المبيعات'} percentage={5} chart={<LineChart />} />
      </Grid>
      <Grid
        templateColumns={{ sm: '1fr', md: '1fr 1fr', lg: '2fr 1fr' }}
        templateRows={{ sm: '1fr auto', md: '1fr', lg: '1fr' }}
        gap="24px"
      >
        <Projects
          title={'المشاريع'}
          amount={30}
          captions={['Companies', 'Members', 'Budget', 'Completion']}
          data={rtlDashboardTableData}
        />
        <OrdersOverview title={'نظرة عامة على الطلبات'} amount={30} data={rtlTimelineData} />
      </Grid>
    </Flex>
  );
}
