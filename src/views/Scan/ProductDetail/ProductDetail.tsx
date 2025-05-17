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
  useColorModeValue,
  VStack,
  Heading,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb
} from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import {
  FaFacebook,
  FaInstagram,
  FaRegCheckCircle,
  FaRegDotCircle,
  FaTwitter,
  FaLeaf,
  FaShare,
  FaStar
} from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import { GoogleMap, Polygon, useJsApiLoader, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { object, string } from 'zod';
import { useCommentHistoryMutation, useGetPublicHistoryQuery } from 'store/api/historyApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetQRCodeSummaryQuery, useCreateOffsetMutation } from 'store/api/carbonApi';
import { MdEco, MdLocalFlorist, MdTimeline, MdShare, MdStar } from 'react-icons/md';
import { StarIcon } from '@chakra-ui/icons';

import BgSignUp from 'assets/img/backgroundImage.png';
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
import { useIntl } from 'react-intl';
import { CarbonScore } from '../../../components/CarbonScore';
import { BadgeCarousel } from '../../../components/BadgeCarousel';
import { Timeline } from '../../../components/Timeline';
import { FarmerStory } from '../../../components/FarmerStory';
import { usePointsStore } from '../../../store/pointsStore';
import { useDisclosure } from '@chakra-ui/react';

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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(productPage1);
  const { productionId } = useParams();
  const [commentValue, setCommentValue] = useState('');
  const intl = useIntl();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: options.googleMapApiKey
  });

  const methods = useForm({
    resolver: zodResolver(registerSchema)
  });

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

  const toast = useToast();
  const {
    data: carbonData,
    error: carbonError,
    isLoading: isCarbonLoading
  } = useGetQRCodeSummaryQuery(productionId || '');
  const {
    isOpen: isOffsetModalOpen,
    onOpen: onOffsetModalOpen,
    onClose: onOffsetModalClose
  } = useDisclosure();
  const {
    isOpen: isFeedbackModalOpen,
    onOpen: onFeedbackModalOpen,
    onClose: onFeedbackModalClose
  } = useDisclosure();
  const [points, addPoints] = usePointsStore();
  const [offsetAmount, setOffsetAmount] = useState(0.05);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const [
    createComment,
    {
      data: dataComment,
      error: errorComment,
      isSuccess: isSuccessComment,
      isLoading: isLoadingComment
    }
  ] = useCommentHistoryMutation();

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

  useEffect(() => {
    if (carbonError) {
      toast({
        title: 'Error',
        description: 'Failed to load sustainability data. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } else if (carbonData) {
      if (points === 0) {
        addPoints(5);
        toast({
          title: 'Points Earned',
          description: 'You earned 5 Green Points for scanning this product!',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
    }
  }, [carbonError, carbonData, toast, points, addPoints]);

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

  const handleOffset = async () => {
    try {
      await createOffset({ productionId: productionId || '', amount: offsetAmount }).unwrap();
      addPoints(5);
      toast({
        title: 'Offset Successful',
        description: `You've offset ${offsetAmount} kg CO2e`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      onOffsetModalClose();
    } catch (error) {
      toast({
        title: 'Offset Failed',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleFeedback = () => {
    addPoints(2);
    toast({
      title: 'Feedback Submitted',
      description: 'Thank you for your feedback!',
      status: 'success',
      duration: 5000,
      isClosable: true
    });
    onFeedbackModalClose();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${historyData?.product.name}'s Sustainable Product`,
        text: `${carbonData?.carbon_score}/100 carbon score! #Trazo`,
        url: window.location.href
      });
      addPoints(3);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

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
          {intl.formatMessage({ id: 'app.welcome' })}
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: '90%', sm: '60%', lg: '40%', xl: '25%' }}>
          {intl.formatMessage({ id: 'app.welcomeMessage' })}
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
              {intl.formatMessage({ id: 'app.productDetails' })}
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
                    {intl.formatMessage({ id: 'app.company' })}
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
                    {intl.formatMessage({ id: 'app.certified' })}
                  </Badge>

                  <Flex direction="column">
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.establishment' })}:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        <Link textDecoration={'underline'}>
                          {historyData?.parcel.establishment.name}
                        </Link>
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.location' })}:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {historyData?.parcel.establishment.location}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.parcel' })}:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        <Link textDecoration={'underline'}>{historyData?.parcel.name}</Link>
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.production' })}:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {`${new Date(historyData?.start_date).toLocaleDateString()} - ${new Date(
                          historyData?.finish_date
                        ).toLocaleDateString()}`}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="15px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        {intl.formatMessage({ id: 'app.socialMedia' })}:{' '}
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
                          title={
                            event.event_type != 3
                              ? intl.formatMessage({ id: `${event.type}` })
                              : event.name
                          }
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
                    {intl.formatMessage({ id: 'app.parcelLocation' })}
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
                    navigate(
                      `/admin/dashboard/production/${productionId}/review/${historyData?.history_scan}`
                    )
                  }>
                  {intl.formatMessage({ id: 'app.iBoughtIt' })}
                </Button>
              </Flex>
              <Flex pt="14px" pb="34px">
                <FormControl>
                  <FormLabel color={textColor} fontWeight="bold" fontSize="md">
                    {intl.formatMessage({ id: 'app.shareYourInitialProductImpression' })}
                  </FormLabel>
                  {isSuccessComment ? (
                    <Flex justifyContent={'center'} my="34px">
                      <Text fontSize="md" color={'gray.500'} fontWeight="normal">
                        {intl.formatMessage({ id: 'app.commentSentSuccessfully' })}
                      </Text>
                    </Flex>
                  ) : (
                    <Textarea
                      placeholder={intl.formatMessage({ id: 'app.yourFirstImpressionHere' })}
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
                      {intl.formatMessage({ id: 'app.send' })}
                    </Button>
                  </Flex>
                </FormControl>
              </Flex>
              <Text fontSize="lg" color={textColor} fontWeight="bold" mb="24px">
                {intl.formatMessage({ id: 'app.similarProducts' })}
              </Text>
              <Box w="100%">
                <Table variant="simple" w="100%">
                  <Thead>
                    <Tr>
                      <Th color="gray.400" fontSize="xs" paddingInlineStart={'0'}>
                        {intl.formatMessage({ id: 'app.name' })}
                      </Th>
                      <Th color="gray.400" fontSize="xs">
                        {intl.formatMessage({ id: 'app.review' })}
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
      <Flex direction={{ sm: 'column', md: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6} w="100%">
          <VStack spacing={3} align="center">
            <Heading as="h2" size="lg">
              {intl.formatMessage({ id: 'app.carbonScore' })}:{' '}
              {carbonData ? carbonData.carbon_score : 'N/A'}
            </Heading>
            <Progress
              value={carbonData ? carbonData.carbon_score : 0}
              size="lg"
              w="full"
              colorScheme={
                carbonData && carbonData.carbon_score > 75
                  ? 'green'
                  : carbonData && carbonData.carbon_score > 50
                  ? 'yellow'
                  : 'red'
              }
              borderRadius="md"
            />
            <Text fontSize="sm" color="gray.500">
              Top {carbonData ? carbonData.industry_percentile : 'N/A'}% in sustainable farming
            </Text>
            <Divider />
            <Text fontSize="md">
              Net Carbon Footprint: {carbonData ? carbonData.net_carbon.toFixed(2) : 'N/A'} kg CO2e
            </Text>
            <Text fontSize="sm" color="gray.600">
              Equivalent to {carbonData ? carbonData.relatable_footprint : 'N/A'}
            </Text>
          </VStack>
        </Box>
      </Flex>

      <Flex direction={{ sm: 'column', md: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6} w="100%">
          <HStack spacing={2} justify="center" mb={3}>
            <Icon as={MdEco} color="green.500" boxSize={6} />
            <Heading as="h3" size="md">
              {intl.formatMessage({ id: 'app.achievements' })}
            </Heading>
          </HStack>
          <HStack spacing={4} justify="center" wrap="wrap">
            {carbonData &&
              carbonData.badges &&
              carbonData.badges.map((badge: any, index: number) => (
                <Badge key={index} variant="subtle" colorScheme="green" p={2} borderRadius="md">
                  {badge.name}
                </Badge>
              ))}
          </HStack>
        </Box>
      </Flex>

      <Flex direction={{ sm: 'column', md: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6} w="100%">
          <HStack spacing={2} mb={3}>
            <Icon as={MdLocalFlorist} color="brown.500" boxSize={6} />
            <Heading as="h3" size="md">
              {intl.formatMessage({ id: 'app.meetYourFarmer' })}
            </Heading>
          </HStack>
          <Text fontSize="md" color="gray.700">
            {carbonData ? carbonData.farmer_story : 'Story not available.'}
          </Text>
        </Box>
      </Flex>

      <Flex direction={{ sm: 'column', md: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6} w="100%">
          <HStack spacing={2} mb={3}>
            <Icon as={MdTimeline} color="blue.500" boxSize={6} />
            <Heading as="h3" size="md">
              {intl.formatMessage({ id: 'app.journeyOfYourProduct' })}
            </Heading>
          </HStack>
          <VStack spacing={4} align="start">
            {carbonData &&
              carbonData.timeline &&
              carbonData.timeline.map((event: any, index: number) => (
                <Box
                  key={index}
                  borderLeft="2px solid"
                  borderColor="blue.200"
                  pl={4}
                  position="relative"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    left: '-6px',
                    top: '0',
                    width: '12px',
                    height: '12px',
                    borderRadius: 'full',
                    bg: 'blue.500'
                  }}>
                  <Text fontWeight="bold">
                    {event.stage} - {event.date}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {event.description}
                  </Text>
                </Box>
              ))}
          </VStack>
        </Box>
      </Flex>

      <Flex direction={{ sm: 'column', md: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6} w="100%">
          <Heading as="h3" size="md" mb={3}>
            {intl.formatMessage({ id: 'app.emissionsBreakdown' })}
          </Heading>
          <Text fontWeight="bold" mb={1}>
            {intl.formatMessage({ id: 'app.byCategory' })}:
          </Text>
          <VStack spacing={2} align="start" mb={4}>
            {carbonData &&
              carbonData.emissions_by_category &&
              Object.entries(carbonData.emissions_by_category).map(([category, value]) => (
                <HStack key={category} w="full" justify="space-between">
                  <Text>{category}</Text>
                  <Text>{(value as number).toFixed(2)} kg CO2e</Text>
                </HStack>
              ))}
          </VStack>
          <Text fontWeight="bold" mb={1}>
            {intl.formatMessage({ id: 'app.bySource' })}:
          </Text>
          <VStack spacing={2} align="start" mb={4}>
            {carbonData &&
              carbonData.emissions_by_source &&
              Object.entries(carbonData.emissions_by_source).map(([source, value]) => (
                <HStack key={source} w="full" justify="space-between">
                  <Text>{source}</Text>
                  <Text>{(value as number).toFixed(2)} kg CO2e</Text>
                </HStack>
              ))}
          </VStack>
        </Box>
      </Flex>

      <Flex direction={{ sm: 'column', md: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} mb={6} w="100%">
          <Heading as="h3" size="md" mb={3}>
            {intl.formatMessage({ id: 'app.offsetsBreakdown' })}
          </Heading>
          <VStack spacing={2} align="start">
            {carbonData &&
              carbonData.offsets_by_action &&
              Object.entries(carbonData.offsets_by_action).map(([action, value]) => (
                <HStack key={action} w="full" justify="space-between">
                  <Text>{action}</Text>
                  <Text>{(value as number).toFixed(2)} kg CO2e</Text>
                </HStack>
              ))}
          </VStack>
        </Box>
      </Flex>

      <Flex direction={{ sm: 'column', md: 'column', lg: 'row' }} mb={{ sm: '22px', lg: '44px' }}>
        <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} w="100%">
          <Heading as="h3" size="md" mb={3}>
            {intl.formatMessage({ id: 'app.takeAction' })}
          </Heading>
          <VStack spacing={3} align="center">
            <Button colorScheme="green" onClick={onOffsetModalOpen} w="full">
              {intl.formatMessage({ id: 'app.offsetNow' })} ($0.05)
            </Button>
            <Button leftIcon={<MdShare />} colorScheme="blue" onClick={handleShare} w="full">
              {intl.formatMessage({ id: 'app.share' })}
            </Button>
            <Button
              leftIcon={<MdStar />}
              colorScheme="yellow"
              onClick={onFeedbackModalOpen}
              w="full">
              {intl.formatMessage({ id: 'app.rateProduct' })}
            </Button>
            <Text fontSize="sm" color="gray.500">
              {intl.formatMessage({ id: 'app.helpEnvironment' })}
            </Text>
          </VStack>
        </Box>
      </Flex>

      <Modal isOpen={isOffsetModalOpen} onClose={onOffsetModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{intl.formatMessage({ id: 'app.offsetCarbonFootprint' })}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              {intl.formatMessage(
                { id: 'app.offsetProductFootprint' },
                { carbon: carbonData ? carbonData.net_carbon.toFixed(2) : 'N/A' }
              )}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {intl.formatMessage({ id: 'app.paymentViaStripe' })}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={() => setIsOffsetModalOpen(false)}>
              {intl.formatMessage({ id: 'app.cancel' })}
            </Button>
            <Button colorScheme="green" onClick={handleOffset}>
              {intl.formatMessage({ id: 'app.confirmOffset' })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{intl.formatMessage({ id: 'app.rateThisProduct' })}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>{intl.formatMessage({ id: 'app.rateSustainability' })}</Text>
            <HStack spacing={1} justify="center" mb={4}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  color={star <= feedbackRating ? 'yellow.400' : 'gray.300'}
                  boxSize={6}
                  cursor="pointer"
                  onClick={() => setFeedbackRating(star)}
                />
              ))}
            </HStack>
            <Textarea
              placeholder="Share your thoughts..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={() => setIsFeedbackModalOpen(false)}>
              {intl.formatMessage({ id: 'app.cancel' })}
            </Button>
            <Button colorScheme="yellow" onClick={handleFeedback}>
              {intl.formatMessage({ id: 'app.submitRating' })}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Capture;
