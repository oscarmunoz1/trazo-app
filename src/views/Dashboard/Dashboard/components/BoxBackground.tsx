// Chakra imports
import { Box, Flex, Text, useColorModeValue, Button } from '@chakra-ui/react';

import BgSignUp from 'assets/img/backgroundImage.png';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

type BoxBackgroundProps = {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  hideBanner?: boolean;
};

function BoxBackground(props: BoxBackgroundProps) {
  const { title, subtitle, children, hideBanner = false } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const intl = useIntl();

  // Get subscription from the company
  const currentCompany = useSelector((state: any) => state.company.currentCompany);
  const subscription = currentCompany?.subscription;

  // Check if we're already on the billing page to prevent infinite loop
  const isOnBillingPage = location.pathname.includes('/admin/dashboard/account/billing');

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" alignItems="center" w={'100%'}>
      <Box
        position="absolute"
        minH={{ base: '70vh', md: '50vh' }}
        borderRadius="15px"
        left="0"
        right="0"
        bgRepeat="no-repeat"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mt={{ base: '130px', md: '100px' }}
        marginInlineStart={'25px'}
        marginInlineEnd={'25px'}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'linear-gradient(180deg, rgba(0,128,0,0.85) 0%, rgba(0,128,0,0.6) 100%)',
          borderRadius: '15px',
          zIndex: 0
        }}
      ></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        width={'100%'}
        pt={'55px'}
      >
        <Text
          fontSize="4xl"
          color="white"
          marginInlineStart="25px"
          marginInlineEnd="25px"
          fontWeight="bold"
        >
          {title}
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: '90%', sm: '60%', lg: '40%', xl: '25%' }}
        >
          {subtitle}
        </Text>
      </Flex>

      {/* Trial Banner */}
      {/* {!hideBanner && subscription && subscription.status === 'trialing' && (
        <Box
          p={4}
          bg="white"
          borderRadius="lg"
          mb={4}
          mx={4}
          borderLeftWidth="4px"
          borderLeftColor="green.500"
          boxShadow="md"
          width="auto"
          maxWidth="800px">
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="green.700">
                {intl.formatMessage({ id: 'app.trialActive' })}
              </Text>
              <Text color="gray.700">
                {intl.formatMessage(
                  { id: 'app.trialEndsOn' },
                  { date: new Date(subscription.trial_end).toLocaleDateString() }
                )}
              </Text>
            </Box>
            {!isOnBillingPage && (
              <Button
                colorScheme="green"
                size="md"
                onClick={() => navigate('/admin/dashboard/account/billing')}>
                {intl.formatMessage({ id: 'app.manageTrial' })}
              </Button>
            )}
          </Flex>
        </Box>
      )} */}

      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px" w="100%">
        {children}
      </Flex>
    </Flex>
  );
}

export default BoxBackground;
