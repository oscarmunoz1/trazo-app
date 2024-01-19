// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  Icon,
  Input,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import { BsCircleFill } from 'react-icons/bs';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import Editor from 'components/Editor/Editor';
import FormInput from 'components/Forms/FormInput';
import { FormProvider } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

function FormLayout(props) {
  const { tabsList, activeBullets, lineWidth, lineLeft, children } = props;

  const [tabWidth, setTabWidth] = useState(0);

  // useEffect that calculates and observe the width of the tab and sets it to the state
  useEffect(() => {
    const observeWidth = (entries) => {
      for (let entry of entries) {
        setTabWidth(entry.contentRect.width);
      }
    };

    const observer = new ResizeObserver(observeWidth);
    if (tabsList[0].ref?.current) {
      observer.observe(tabsList[0].ref?.current);
    }

    return () => {
      if (tabsList[0].ref?.current) observer.unobserve(tabsList[0].ref?.current);
    };
  }, [tabsList]);

  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');

  const getLineWidth = () => {
    if (lineWidth) {
      return lineWidth;
    }
    if (tabsList.length === 4) {
      return 26;
    } else {
      return 32;
    }
  };

  const getLineLeft = (index: number) => {
    if (lineLeft) {
      if (index === tabsList.length - 2) {
        return lineLeft[0];
      } else {
        return lineLeft[1];
      }
    }
    if (tabsList.length === 4) {
      if (index === tabsList.length - 2) {
        return '32px';
      } else {
        return '52px';
      }
    } else {
      if (index === tabsList.length - 2) {
        return '32px';
      } else {
        return '43px';
      }
    }
  };

  return (
    <Flex
      direction="column"
      bg={bgColor}
      w={{ base: '100%', md: '768px' }}
      boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
      borderRadius="15px">
      <Tabs variant="unstyled" mt="24px" alignSelf="center" w="100%">
        <TabList display="flex" align="center" justifyContent={{ base: 'center' }}>
          {tabsList.map((tab, index) => {
            const lineWidth = getLineWidth();
            const lineLeft = getLineLeft(index);
            if (index === tabsList.length - 1) {
              return (
                <Tab
                  ref={tab.ref}
                  _focus="none"
                  w={{ base: '80px', smdd: '200px' }}
                  onClick={() => tab.onClick()}>
                  <Flex direction="column" justify="center" align="center">
                    <Icon
                      as={BsCircleFill}
                      color={activeBullets[tab.name] ? textColor : 'gray.300'}
                      w={activeBullets[tab.name] ? '16px' : '12px'}
                      h={activeBullets[tab.name] ? '16px' : '12px'}
                      mb="8px"
                      zIndex={1}
                    />
                    <Text
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      color={activeBullets[tab.name] ? { textColor } : 'gray.300'}
                      fontWeight={activeBullets[tab.name] ? 'bold' : 'normal'}
                      transition="all .3s ease"
                      _hover={{ color: textColor }}
                      display={{ base: 'none', smdd: 'block' }}>
                      {tab.label}
                    </Text>
                  </Flex>
                </Tab>
              );
            } else {
              return (
                <Tab
                  ref={tab.ref}
                  _focus="none"
                  w={{ base: '80px', smdd: '200px' }}
                  onClick={() => tab.onClick()}>
                  <Flex
                    direction="column"
                    justify="center"
                    align="center"
                    position="relative"
                    _before={{
                      content: "''",
                      width: `${tabWidth + lineWidth}px`,
                      height: '3px',
                      bg: activeBullets[tab.nextTab] ? textColor : 'gray.200',
                      left: {
                        base: '20px',
                        sm: '8px',
                        smdd: lineLeft
                      },
                      top: {
                        base: activeBullets[tab.name] ? '6px' : '4px',
                        sm: null
                      },
                      position: 'absolute',
                      bottom: activeBullets[tab.name] ? '40px' : '38px',

                      transition: 'all .3s ease'
                    }}>
                    <Icon
                      as={BsCircleFill}
                      color={activeBullets[tab.name] ? textColor : 'gray.300'}
                      w={activeBullets[tab.name] ? '16px' : '12px'}
                      h={activeBullets[tab.name] ? '16px' : '12px'}
                      mb="8px"
                      zIndex={1}
                    />
                    <Text
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      color={activeBullets[tab.name] ? { textColor } : 'gray.300'}
                      fontWeight={activeBullets[tab.name] ? 'bold' : 'normal'}
                      display={{ base: 'none', smdd: 'block' }}>
                      {tab.label}
                    </Text>
                  </Flex>
                </Tab>
              );
            }
          })}
        </TabList>

        <TabPanels maxW={{ md: '90%', lg: '100%' }} mx="auto">
          {children}
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default FormLayout;
