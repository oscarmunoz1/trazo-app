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
          {/* <TabPanel>
            <Card>
              <CardHeader mb="22px">
                <Text color={textColor} fontSize="lg" fontWeight="bold">
                  Establishment Info
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...infoMethods}>
                  <form onSubmit={handleSubmit(onSubmitInfo)} style={{ width: '100%' }}>
                    <Stack direction="column" spacing="20px" w="100%">
                      <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                        <FormControl>
                          <FormInput
                            name="name"
                            label="Name"
                            placeholder="Establishment name"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="country"
                            label="Country"
                            placeholder="Establishment country"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>
                      <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                        <FormControl>
                          <FormInput
                            name="state"
                            label="State"
                            placeholder="Establishment state"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="city"
                            label="City"
                            placeholder="Establishment city"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>
                      <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                        <FormControl>
                          <FormInput
                            name="address"
                            label="Address"
                            placeholder="Establishment address"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="zone"
                            label="Zone"
                            placeholder="Establishment zone"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>

                      <Button
                        variant="no-hover"
                        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                        alignSelf="flex-end"
                        mt="24px"
                        w="100px"
                        h="35px"
                        type="submit">
                        <Text fontSize="xs" color="#fff" fontWeight="bold">
                          NEXT
                        </Text>
                      </Button>
                    </Stack>
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Description
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...descriptionMethods}>
                  <form onSubmit={descriptionSubmit(onSubmitDescription)} style={{ width: '100%' }}>
                    <Flex direction="column" w="100%">
                      <Stack direction="column" spacing="20px" w="100%">
                        <Editor />
                      </Stack>
                      <Flex justify="space-between">
                        <Button
                          variant="no-hover"
                          bg={bgPrevButton}
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          onClick={() => mainInfoTab.current.click()}>
                          <Text fontSize="xs" color="gray.700" fontWeight="bold">
                            PREV
                          </Text>
                        </Button>
                        <Button
                          variant="no-hover"
                          bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          type="submit">
                          <Text fontSize="xs" color="#fff" fontWeight="bold">
                            NEXT
                          </Text>
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <CardHeader mb="22px">
                <Text color={textColor} fontSize="xl" fontWeight="bold" mb="3px">
                  Media
                </Text>
              </CardHeader>
              <CardBody>
                <Flex direction="column" w="100%">
                  <Text color={textColor} fontSize="sm" fontWeight="bold" mb="12px">
                    Establishment images
                  </Text>
                  <Flex
                    align="center"
                    justify="center"
                    border="1px dashed #E2E8F0"
                    borderRadius="15px"
                    w="100%"
                    minH="130px"
                    cursor="pointer"
                    {...getRootProps({ className: 'dropzone' })}>
                    <Input {...getInputProps()} />
                    <Button variant="no-hover">
                      <Text color="gray.400" fontWeight="normal">
                        Drop files here to upload
                      </Text>
                    </Button>
                  </Flex>
                  <Flex justify="space-between">
                    <Button
                      variant="no-hover"
                      bg={bgPrevButton}
                      alignSelf="flex-end"
                      mt="24px"
                      w="100px"
                      h="35px"
                      onClick={() => descriptionTab.current.click()}>
                      <Text fontSize="xs" color="gray.700" fontWeight="bold">
                        PREV
                      </Text>
                    </Button>
                    <Button
                      variant="no-hover"
                      bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                      alignSelf="flex-end"
                      mt="24px"
                      w="100px"
                      h="35px"
                      onClick={() => socialsTab.current.click()}>
                      <Text fontSize="xs" color="#fff" fontWeight="bold">
                        NEXT
                      </Text>
                    </Button>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel maxW="800px">
            <Card>
              <CardHeader mb="32px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Socials
                </Text>
              </CardHeader>
              <CardBody>
                <FormProvider {...socialsMethods}>
                  <form onSubmit={socialsSubmit(onSubmitSocials)} style={{ width: '100%' }}>
                    <Flex direction="column" w="100%">
                      <Stack direction="column" spacing="20px" w="100%">
                        <FormControl>
                          <FormInput
                            name="facebook"
                            label="Facebook Account"
                            placeholder="https://"
                            fontSize="xs"
                          />
                        </FormControl>
                        <FormControl>
                          <FormInput
                            name="instagram"
                            label="Instagram Account"
                            placeholder="https://"
                            fontSize="xs"
                          />
                        </FormControl>
                      </Stack>
                      <Flex justify="space-between">
                        <Button
                          variant="no-hover"
                          bg={bgPrevButton}
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          onClick={() => mediaTab.current.click()}>
                          <Text fontSize="xs" color="gray.700" fontWeight="bold">
                            PREV
                          </Text>
                        </Button>

                        <Button
                          variant="no-hover"
                          bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          type="submit">
                          <Text fontSize="xs" color="#fff" fontWeight="bold">
                            SEND
                          </Text>
                        </Button>
                      </Flex>
                    </Flex>
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Flex>
  );
}

export default FormLayout;
