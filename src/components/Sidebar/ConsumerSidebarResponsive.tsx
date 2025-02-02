import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  Image,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import { FaCircle } from 'react-icons/fa';
import { HSeparator } from 'components/Separator/Separator';
import { HamburgerIcon } from '@chakra-ui/icons';
import IconBox from 'components/Icons/IconBox';
import logo from 'assets/img/trazo2.png';
import { useIntl } from 'react-intl';
import { Route } from 'types/common';

type ConsumerSidebarResponsiveProps = {
  display: string;
  logoText: string;
  routes: Route[];
  sidebarVariant: string;
  secondary: boolean;
};

function ConsumerSidebarResponsive(props: ConsumerSidebarResponsiveProps) {
  const intl = useIntl();
  let location = useLocation();
  const mainPanel = React.useRef();
  const btnRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  let hamburgerColor = useColorModeValue('gray.500', 'gray.200');
  let variantChange = '0.2s linear';

  const activeRoute = (regex: RegExp) => {
    return regex.test(location.pathname);
  };

  const createLinks = (routes: Route[]) => {
    const { sidebarVariant } = props;
    // Chakra Color Mode
    let activeBg = useColorModeValue('green.500', 'green.400');
    let activeAccordionBg = useColorModeValue('white', 'gray.700');
    let inactiveBg = useColorModeValue('white', 'gray.700');
    let inactiveColorIcon = useColorModeValue('green.500', 'green.400');
    let activeColorIcon = useColorModeValue('white', 'white');
    let activeColor = useColorModeValue('gray.700', 'white');
    let inactiveColor = useColorModeValue('gray.400', 'gray.400');
    let sidebarActiveShadow = '0px 7px 11px rgba(0, 0, 0, 0.04)';

    return routes?.map((prop, index) => {
      return (
        <NavLink key={index} to={`${prop.layout}/dashboard/${prop.path}`}>
          <Box>
            <HStack spacing="14px" py="15px" px="15px">
              <IconBox bg="green.400" color="white" h="30px" w="30px" transition={variantChange}>
                {prop.icon}
              </IconBox>
              <Text
                color={activeRoute(prop.regex) ? activeColor : inactiveColor}
                fontWeight={activeRoute(prop.regex) ? 'bold' : 'normal'}
                fontSize="sm">
                {Object.keys(intl?.messages).includes(`app.${prop.id}`)
                  ? intl.formatMessage({ id: `app.${prop.id}` })
                  : prop.name}
              </Text>
            </HStack>
          </Box>
        </NavLink>
      );
    });
  };

  const { logoText, routes } = props;
  const links = <>{createLinks(routes)}</>;

  if (props.secondary === true) {
    hamburgerColor = 'white';
  }

  const brand = (
    <Box pt={'35px'} mb="8px">
      <Link
        href={`${import.meta.env.VITE_APP_BASE_URL}`}
        target="_blank"
        display="flex"
        lineHeight="100%"
        mb="30px"
        fontWeight="bold"
        justifyContent="center"
        alignItems="center"
        fontSize="11px">
        <Image src={logo} alt="trazo logo" height="30px" paddingRight="10px" href="" />
      </Link>
      <HSeparator />
    </Box>
  );

  let sidebarBg = useColorModeValue('white', 'gray.700');

  return (
    <Box ref={mainPanel} display={props.display}>
      <Box display={{ sm: 'block', xl: 'none' }}>
        <>
          <HamburgerIcon
            color={hamburgerColor}
            w="18px"
            h="18px"
            me="16px"
            ref={btnRef}
            colorScheme="teal"
            cursor="pointer"
            onClick={onOpen}
          />
          <Drawer placement={'left'} isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
            <DrawerOverlay />
            <DrawerContent
              bg={sidebarBg}
              w="250px"
              maxW="250px"
              ms={{
                sm: '16px'
              }}
              my={{
                sm: '16px'
              }}
              borderRadius="16px">
              <DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
              <DrawerBody maxW="250px" px="1rem">
                <Box maxW="100%" h="100vh">
                  <Box mb="20px">{brand}</Box>
                  <Stack direction="column" mb="40px">
                    <Box>{links}</Box>
                  </Stack>
                </Box>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      </Box>
    </Box>
  );
}

export default ConsumerSidebarResponsive;
