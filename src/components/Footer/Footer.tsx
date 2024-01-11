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

import { Flex, Link, List, ListItem, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Flex
      flexDirection={{
        base: 'column',
        xl: 'row'
      }}
      alignItems={{
        base: 'center',
        xl: 'start'
      }}
      justifyContent="space-between"
      px="30px"
      pb="20px">
      <Text
        color="gray.400"
        textAlign={{
          base: 'center',
          xl: 'start'
        }}
        mb={{ base: '20px', xl: '0px' }}>
        &copy; {1900 + new Date().getFullYear()}
      </Text>
      <List display="flex">
        <ListItem
          me={{
            base: '20px',
            md: '44px'
          }}>
          <Link color="gray.400" href="">
            Learn
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px'
          }}>
          <Link color="gray.400" href="">
            Why us?
          </Link>
        </ListItem>
        <ListItem
          me={{
            base: '20px',
            md: '44px'
          }}>
          <Link color="gray.400" href="">
            Blog
          </Link>
        </ListItem>
        <ListItem>
          <Link color="gray.400" href="">
            Contact
          </Link>
        </ListItem>
      </List>
    </Flex>
  );
}
