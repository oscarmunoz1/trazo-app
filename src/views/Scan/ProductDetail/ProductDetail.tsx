// Chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  Link,
  ListItem,
  Progress,
  Select,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  UnorderedList,
  useColorModeValue
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import {
  FaFacebook,
  FaInstagram,
  FaRegCheckCircle,
  FaRegDotCircle,
  FaTwitter
} from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import { GoogleMap, Polygon, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { object, string } from 'zod';
import { useCommentHistoryMutation, useGetPublicHistoryQuery } from 'store/api/historyApi';
import { useNavigate, useParams } from 'react-router-dom';

import BgSignUp from 'assets/img/backgroundImage.png';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
// import CameraCard from "./components/CameraCard";
import FormInput from 'components/Forms/FormInput';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import ImageParcel1 from 'assets/img/ImageParcel1.png';
import ProfileInformation from './components/ProfileInformation';
import TimelineRow from 'components/Tables/TimelineRow';
import productPage1 from 'assets/img/ProductImage1.png';
import productPage2 from 'assets/img/ProductImage2.png';
import productPage3 from 'assets/img/ProductImage3.png';
import productPage4 from 'assets/img/ProductImage4.png';
import { zodResolver } from '@hookform/resolvers/zod';
import defaultEstablishmentImage from 'assets/img/basic-auth.png';

// Assets

const registerSchema = object({
  first_name: string().min(1, 'Full name is required').max(100),
  last_name: string().min(1, 'Full name is required').max(100),
  email: string().min(1, 'Email address is required').email('Email Address is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(8, 'Password must be more than 8 characters')
    .max(32, 'Password must be less than 32 characters'),
  password2: string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.password2, {
  path: ['password2'],
  message: 'Passwords do not match'
});

const options = {
  googleMapApiKey: 'AIzaSyCLHij6DjbLLkhTsTvrRhwuKf8ZGXrx-Q8'
};

function Capture() {
  const titleColor = useColorModeValue('green.500', 'green.400');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');
  const bgIcons = useColorModeValue('green.200', 'rgba(255, 255, 255, 0.5)');
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(productPage1);
  const { productionId } = useParams();
  const [commentValue, setCommentValue] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  const methods = useForm({
    resolver: zodResolver(registerSchema)
  });

  const currentHistory = [
    {
      id: 60,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: true,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    },
    {
      id: 61,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: false,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    },
    {
      id: 62,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: true,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    },
    {
      id: 64,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: false,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    },
    {
      id: 60,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: true,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    },
    {
      id: 61,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: false,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    },
    {
      id: 62,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: true,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    },
    {
      id: 64,
      name: 'Nombre del evento realizado',
      description: '<p>x</p>',
      date: '2023-07-16T15:48:00Z',
      image: null,
      certified: true,
      index: 1,
      type: 'HW',
      temperature: 12,
      humidity: 12,
      time_period: null,
      observation: null,
      history: 35,
      created_by: null
    }
  ];

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = methods;

  const {
    data: historyData,
    error,
    isLoading,
    isFetching,
    refetch
  } = useGetPublicHistoryQuery(productionId || '', {
    skip: productionId === undefined
  });

  useEffect(() => {
    if (productionId) {
      refetch();
    }
  }, [productionId, refetch]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const [
    createComment,
    {
      data: dataComment,
      error: errorComment,
      isSuccess: isSuccessComment,
      isLoading: isLoadingComment
    }
  ] = useCommentHistoryMutation();

  const onSubmitHandler = () => {
    if (commentValue) {
      createComment({
        comment: commentValue,
        scanId: historyData.history_scan
      });
    }
  };

  useEffect(() => {
    if (isSuccessComment) {
      setCommentValue('');
    }
  }, [isSuccessComment]);

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden" w="100%">
      <Box
        position="absolute"
        minH={{ base: '70vh', md: '50vh' }}
        w={{ md: 'calc(100vw - 50px)' }}
        borderRadius={{ md: '15px' }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
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
        bgSize="cover"
        mx={{ md: 'auto' }}
        mt={{ md: '14px' }}></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        pt={'55px'}>
        <Text fontSize="4xl" color="white" fontWeight="bold">
          Welcome!
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: '90%', sm: '60%', lg: '40%', xl: '25%' }}>
          Here you can find all the information about the product you scanned.
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="-30px">
        <Card
          mt={{ md: '75px' }}
          w={{ sm: '100%', md: '80%', lg: '75%' }}
          p={{ sm: '16px', md: '32px', lg: '48px' }}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px">
          <CardHeader mb="42px">
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              Product Details
            </Text>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              <Flex direction={{ sm: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
                {historyData?.images && <ImageCarousel imagesList={historyData?.images} />}
                <Flex direction="column">
                  <Text color={textColor} fontSize="3xl" fontWeight="bold" mb="12px">
                    {historyData?.product.name}
                  </Text>
                  <Stack direction="row" spacing="12px" color="orange.300" mb="16px">
                    <Icon
                      as={
                        historyData?.reputation >= 1
                          ? BsStarFill
                          : historyData?.reputation > 0.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation >= 2
                          ? BsStarFill
                          : historyData?.reputation > 1.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation >= 3
                          ? BsStarFill
                          : historyData?.reputation > 2.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation >= 4
                          ? BsStarFill
                          : historyData?.reputation > 3.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                    <Icon
                      as={
                        historyData?.reputation === 5
                          ? BsStarFill
                          : historyData?.reputation > 4.5
                          ? BsStarHalf
                          : BsStar
                      }
                      w="26px"
                      h="26px"
                    />
                  </Stack>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    Company
                  </Text>
                  <Text color={textColor} fontWeight="bold" fontSize="3xl" mb="12px">
                    {historyData?.company}
                  </Text>
                  <Badge
                    colorScheme="green"
                    w="95px"
                    h="28px"
                    mb="36px"
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    CERTIFIED
                  </Badge>

                  <Flex direction="column">
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Establishment:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        <Link textDecoration={'underline'}>
                          {historyData?.parcel.establishment.name}
                        </Link>
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Location:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {historyData?.parcel.establishment.location}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Parcel:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        <Link textDecoration={'underline'}>{historyData?.parcel.name}</Link>
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Production:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {`${new Date(historyData?.start_date).toLocaleDateString()} - ${new Date(
                          historyData?.finish_date
                        ).toLocaleDateString()}`}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Social Media:{' '}
                      </Text>
                      <Flex>
                        <Link
                          href="#"
                          color="green.400"
                          fontSize="lg"
                          me="10px"
                          _hover={{ color: 'green.400' }}>
                          <Icon as={FaFacebook} />
                        </Link>
                        <Link
                          href="#"
                          color="green.400"
                          fontSize="lg"
                          me="10px"
                          _hover={{ color: 'green.400' }}>
                          <Icon as={FaInstagram} />
                        </Link>
                        <Link
                          href="#"
                          color="green.400"
                          fontSize="lg"
                          me="10px"
                          _hover={{ color: 'green.400' }}>
                          <Icon as={FaTwitter} />
                        </Link>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>

              <Flex px="24px" pb="24px" direction={'column'}>
                <Text fontSize="xl" color={textColor} fontWeight="bold" pb="24px">
                  {historyData?.parcel.establishment.name}
                </Text>
                <HTMLRenderer htmlString={historyData?.parcel.establishment.description} />
              </Flex>
              <Flex pt={'24px'} direction={{ sm: 'column', md: 'column', lg: 'row' }}>
                <Flex px="24px" width={{ md: '100%', lg: '50%' }} direction={'column'}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold" pb="24px">
                    Events
                  </Text>
                  <Flex direction="column" width={'100%'} paddingBottom={'24px'}>
                    {historyData?.events?.map((event, index, arr) => {
                      return (
                        <TimelineRow
                          key={event.id}
                          logo={event.certified ? FaRegCheckCircle : FaRegDotCircle}
                          title={event.type}
                          date={new Date(event.date).toDateString()}
                          color={event.certified ? 'green.300' : 'blue.400'}
                          index={index}
                          arrLength={arr.length}
                          isLast={index === arr.length - 1}
                        />
                      );
                    })}
                  </Flex>
                </Flex>
                <Flex
                  width={{ md: '100%', lg: '50%' }}
                  direction="column"
                  h="300px"
                  px="24px"
                  height={'340px'}>
                  <Text fontSize="xl" color={textColor} fontWeight="bold" pb="24px">
                    Parcel location
                  </Text>
                  {isLoaded && historyData && (
                    <GoogleMap
                      mapContainerStyle={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '10px'
                      }}
                      zoom={historyData?.parcel.map_metadata.zoom || 15}
                      center={historyData?.parcel.map_metadata.center || { lat: 0, lng: 0 }}
                      mapTypeId="satellite">
                      <Polygon
                        path={historyData?.parcel.polygon}
                        options={{
                          fillColor: '#ff0000',
                          fillOpacity: 0.35,
                          strokeColor: '#ff0000',
                          strokeOpacity: 1,
                          strokeWeight: 2
                        }}
                      />
                    </GoogleMap>
                  )}
                </Flex>
              </Flex>
              <Flex justifyContent={'center'} py="85px">
                <Button
                  variant="no-hover"
                  bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                  w={{ sm: '240px', md: '100%', lg: '240px' }}
                  h="50px"
                  mx={{ sm: 'auto', md: '0px' }}
                  color="#fff"
                  fontSize="xs"
                  fontWeight="bold"
                  onClick={() =>
                    navigate(`/production/${productionId}/review/${historyData?.history_scan}`)
                  }>
                  I BOUGHT IT
                </Button>
              </Flex>
              <Flex pt="14px" pb="34px">
                <FormControl>
                  <FormLabel color={textColor} fontWeight="bold" fontSize="md">
                    Share your initial product impression
                  </FormLabel>
                  {isSuccessComment ? (
                    <Flex justifyContent={'center'} my="34px">
                      <Text fontSize="md" color={'gray.500'} fontWeight="normal">
                        Comment sent successfully!
                      </Text>
                    </Flex>
                  ) : (
                    <Textarea
                      placeholder="Your first impression here..."
                      minH="120px"
                      fontSize="14px"
                      borderRadius="15px"
                      value={commentValue}
                      onChange={(e) => setCommentValue(e.target.value)}
                    />
                  )}

                  <Flex mt="24px" justifyContent={'flex-end'}>
                    <Button
                      variant="no-hover"
                      bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                      w={{ sm: '120px', md: '120px', lg: '120px' }}
                      h="50px"
                      mx={{ sm: 'auto', md: '0px' }}
                      color="#fff"
                      fontSize="xs"
                      fontWeight="bold"
                      disabled={isLoadingComment || !commentValue || isSuccessComment}
                      onClick={() => onSubmitHandler()}>
                      SEND
                    </Button>
                  </Flex>
                </FormControl>
              </Flex>
              <Text fontSize="lg" color={textColor} fontWeight="bold" mb="24px">
                Similar Products
              </Text>
              <Box w="100%">
                <Table variant="simple" w="100%">
                  <Thead>
                    <Tr>
                      <Th color="gray.400" fontSize="xs" paddingInlineStart={'0'}>
                        Name
                      </Th>
                      <Th color="gray.400" fontSize="xs">
                        Review
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {historyData?.similar_histories.map((history: any) => (
                      <Tr
                        onClick={() =>
                          navigate(`/production/${history.id}`, {
                            replace: true
                          })
                        }
                        cursor="pointer"
                        key={history.id}>
                        <Td minW="300px" paddingInlineStart={'0'}>
                          <Flex align="center">
                            <Box w="40px" h="40px" me="14px">
                              <Image
                                src={history.image || defaultEstablishmentImage}
                                w="100%"
                                h="100%"
                                borderRadius="12px"
                              />
                            </Box>
                            <Text color={textColor} fontSize="sm" fontWeight="bold">
                              {history.product.name}
                            </Text>
                          </Flex>
                        </Td>
                        <Td>
                          <Stack direction="row" spacing="12px" color="orange.300" mb="16px">
                            <Icon
                              as={
                                history?.reputation >= 1
                                  ? BsStarFill
                                  : history?.reputation > 0.5
                                  ? BsStarHalf
                                  : BsStar
                              }
                              w="18px"
                              h="18px"
                            />
                            <Icon
                              as={
                                history?.reputation >= 2
                                  ? BsStarFill
                                  : history?.reputation > 1.5
                                  ? BsStarHalf
                                  : BsStar
                              }
                              w="18px"
                              h="18px"
                            />
                            <Icon
                              as={
                                history?.reputation >= 3
                                  ? BsStarFill
                                  : history?.reputation > 2.5
                                  ? BsStarHalf
                                  : BsStar
                              }
                              w="18px"
                              h="18px"
                            />
                            <Icon
                              as={
                                history?.reputation >= 4
                                  ? BsStarFill
                                  : history?.reputation > 3.5
                                  ? BsStarHalf
                                  : BsStar
                              }
                              w="18px"
                              h="18px"
                            />
                            <Icon
                              as={
                                history?.reputation === 5
                                  ? BsStarFill
                                  : history?.reputation > 4.5
                                  ? BsStarHalf
                                  : BsStar
                              }
                              w="18px"
                              h="18px"
                            />
                          </Stack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}

export default Capture;
