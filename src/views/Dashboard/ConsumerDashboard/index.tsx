import {
  Flex,
  Grid,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Card from 'components/Card/Card';
// import MiniStatistics from '../Dashboard/components/MiniStatistics';
import { ScanIcon, ReviewIcon } from 'components/Icons/Icons';

export default function ConsumerDashboardView() {
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const iconBoxInside = useColorModeValue('white', 'white');
  const cardColor = useColorModeValue('white', 'gray.700');

//   const scans = useSelector((state) => state.scans.totalScans);
//   const reviews = useSelector((state) => state.reviews.totalReviews);

  console.log('scans');
  console.log('reviews');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
      <Text color={mainText} bg="inherit" borderRadius="inherit" fontWeight="bold" padding="10px">
        Dashboard Overview
      </Text>
      <Grid
        templateColumns={{ sm: '1fr', md: '1fr 1fr', xl: 'repeat(2, 1fr)' }}
        gap="24px">
        {/* <MiniStatistics
          title="Total Scans"
          amount={scans || 0}
          icon={<ScanIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
        <MiniStatistics
          title="Total Reviews"
          amount={reviews || 0}
          icon={<ReviewIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        /> */}
      </Grid>

      {/* Add more consumer-specific content here */}
    </Flex>
  );
} 