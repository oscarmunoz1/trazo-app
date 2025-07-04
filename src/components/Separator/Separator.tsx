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

import { Flex } from '@chakra-ui/react';
import React from 'react';

type HSeparatorProps = {
  variant: string;
  children: React.ReactNode;
};

type VSeparatorProps = {
  variant: string;
  children: React.ReactNode;
};

export function HSeparator(props: HSeparatorProps) {
  const { variant, children, ...rest } = props;
  return (
    <Flex
      h="1px"
      w="100%"
      bg="linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0) 100%)"
      {...rest}
    ></Flex>
  );
}

export function VSeparator(props: VSeparatorProps) {
  const { variant, children, ...rest } = props;
  return (
    <Flex
      w="1px"
      bg="linear-gradient(0deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 49.52%, rgba(224, 225, 226, 0.15625) 99.04%)"
      {...rest}
    ></Flex>
  );
}
