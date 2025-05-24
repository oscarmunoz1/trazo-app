// Chakra imports
import {
  Badge,
  Box,
  Button,
  CircularProgress,
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

import BgMusicCard from 'assets/img/BgMusicCard.png';
import BgSignUp from 'assets/img/backgroundImage.png';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import BoxBackground from '../../../views/Dashboard/Dashboard/components/BoxBackground';
import FormInput from 'components/Forms/FormInput';
import { HSeparator } from 'components/Separator/Separator';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageParcel1 from 'assets/img/ImageParcel1.png';
import TimelineRow from 'components/Tables/TimelineRow';
import { hi } from 'date-fns/locale';
import productPage1 from 'assets/img/ProductImage1.png';
import productPage2 from 'assets/img/ProductImage2.png';
import productPage3 from 'assets/img/ProductImage3.png';
import productPage4 from 'assets/img/ProductImage4.png';
import { set } from 'draft-js/lib/EditorState';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import { useSendReviewMutation } from 'store/api/reviewApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useIntl } from 'react-intl';

// import CameraCard from "./components/CameraCard";

// Assets

const registerSchema = object({
  headline: string().min(1, 'Headline is required').max(100),
  review: string().min(1, 'Review is required')
});

function ProductReview() {
  const intl = useIntl();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const { getRootProps, getInputProps } = useDropzone();
  const navigate = useNavigate();
  const { productionId, scanId } = useParams();
  const [rating, setRating] = useState(0);

  const currentUser = useSelector((state) => state.userState.user);

  const methods = useForm({
    resolver: zodResolver(registerSchema)
  });

  const {
    reset,
    handleSubmit,
    register,
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

  const [sendReview, { data, isError, error: errorReview, isLoading: isLoadingReview, isSuccess }] =
    useSendReviewMutation();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  const onSubmitHandler = (data) => {
    sendReview({
      headline: data.headline,
      written_review: data.review,
      rating: rating,
      production: historyData?.id,
      user: currentUser?.id,
      scan_id: scanId
    });
  };

  return (
    <BoxBackground
      title={intl.formatMessage({ id: 'app.productReview' })}
      subtitle={intl.formatMessage({ id: 'app.productReviewDescription' })}
    >
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="-30px" w="100%">
        <Card
          mt={{ md: '75px' }}
          w={{ sm: '100%', md: '80%', lg: '75%' }}
          p={{ sm: '16px', md: '32px', lg: '48px' }}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px"
        >
          <CardHeader mb="42px">
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              {intl.formatMessage({ id: 'app.yourReview' })}
            </Text>
          </CardHeader>
          <CardBody>
            <Flex direction="column" w="100%">
              <Flex direction={'column'} w="100%">
                <Flex direction={'row'} gap="25px">
                  {historyData?.images.length > 0 && (
                    <Image src={historyData?.images[0]} w="100px" h="80px" borderRadius="5px" />
                  )}
                  <Text fontSize="md" fontWeight={'bold'} color={textColor}>
                    {historyData?.product.name} - {historyData?.company},{' '}
                    {historyData?.parcel.establishment.name}
                  </Text>
                </Flex>
                <HSeparator my="16px" />
              </Flex>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHandler)} style={{ width: '100%' }}>
                  {isSuccess ? (
                    <>
                      <Text
                        display={'flex'}
                        fontSize={'md'}
                        fontWeight={'300'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        textAlign={'center'}
                      >
                        Review sent successfully!
                      </Text>
                      <Text
                        display={'flex'}
                        fontSize={'md'}
                        fontWeight={'300'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        textAlign={'center'}
                        pt={'10px'}
                        onClick={() => navigate(`/`)}
                        cursor={'pointer'}
                        textDecoration={'underline'}
                        color={'gray.500'}
                      >
                        {intl.formatMessage({ id: 'app.clickHereToGoBackToTheProductionPage' })}
                      </Text>
                    </>
                  ) : (
                    <Flex direction="column" gap="20px" w={'100%'}>
                      <Flex direction="column" gap="10px">
                        <Text fontSize="md" fontWeight={'bold'} color={textColor}>
                          {intl.formatMessage({ id: 'app.overallRating' })}
                        </Text>
                        <Stack
                          direction="row"
                          spacing="12px"
                          //   color="orange.300"
                          mb="16px"
                        >
                          <Icon
                            as={
                              rating == 1 ||
                              rating == 2 ||
                              rating == 3 ||
                              rating == 4 ||
                              rating == 5
                                ? BsStarFill
                                : BsStar
                            }
                            color={
                              rating == 1 ||
                              rating == 2 ||
                              rating == 3 ||
                              rating == 4 ||
                              rating == 5
                                ? 'orange.300'
                                : 'gray.300'
                            }
                            w="26px"
                            h="26px"
                            cursor={'pointer'}
                            onClick={() => setRating(1)}
                          />
                          <Icon
                            cursor={'pointer'}
                            color={
                              rating == 2 || rating == 3 || rating == 4 || rating == 5
                                ? 'orange.300'
                                : 'gray.300'
                            }
                            as={
                              rating == 2 || rating == 3 || rating == 4 || rating == 5
                                ? BsStarFill
                                : BsStar
                            }
                            w="26px"
                            h="26px"
                            onClick={() => setRating(2)}
                          />
                          <Icon
                            as={rating == 3 || rating == 4 || rating == 5 ? BsStarFill : BsStar}
                            cursor={'pointer'}
                            color={
                              rating == 3 || rating == 4 || rating == 5 ? 'orange.300' : 'gray.300'
                            }
                            w="26px"
                            h="26px"
                            onClick={() => setRating(3)}
                          />
                          <Icon
                            as={rating == 4 || rating == 5 ? BsStarFill : BsStar}
                            cursor={'pointer'}
                            color={rating == 4 || rating == 5 ? 'orange.300' : 'gray.300'}
                            w="26px"
                            h="26px"
                            onClick={() => setRating(4)}
                          />
                          <Icon
                            as={rating == 5 ? BsStarFill : BsStar}
                            cursor={'pointer'}
                            color={rating == 5 ? 'orange.300' : 'gray.300'}
                            w="26px"
                            h="26px"
                            onClick={() => setRating(5)}
                          />
                        </Stack>
                      </Flex>
                      <Flex direction="column" gap="10px">
                        <Text fontSize="md" fontWeight={'bold'} color={textColor}>
                          {intl.formatMessage({ id: 'app.addAHeadline' })}
                        </Text>
                        <FormControl>
                          <FormInput
                            name="headline"
                            placeholder={intl.formatMessage({
                              id: 'app.whatIsMostImportantToKnow'
                            })}
                            fontSize="xs"
                          />
                        </FormControl>
                      </Flex>
                      <Flex direction="column" gap="10px">
                        <Text fontSize="md" fontWeight={'bold'} color={textColor}>
                          {intl.formatMessage({ id: 'app.addAPhoto' })}
                        </Text>
                        <Flex
                          align="center"
                          justify="center"
                          border="1px dashed #E2E8F0"
                          borderRadius="15px"
                          w="100%"
                          minH="130px"
                          cursor="pointer"
                          {...getRootProps({ className: 'dropzone' })}
                        >
                          <Input {...getInputProps()} />
                          <Button variant="no-hover">
                            <Text color="gray.400" fontWeight="normal">
                              {intl.formatMessage({ id: 'app.dropFilesHereToUpload' })}
                            </Text>
                          </Button>
                        </Flex>
                      </Flex>
                      <Flex direction="column" gap="10px">
                        <Text fontSize="md" fontWeight={'bold'} color={textColor}>
                          {intl.formatMessage({ id: 'app.addAWrittenReview' })}
                        </Text>
                        <Flex direction={'column'}>
                          <Textarea
                            placeholder={intl.formatMessage({
                              id: 'app.whatDidYouLikeOrDislikeWhatDidYouUseThisProductFor'
                            })}
                            minH="120px"
                            fontSize="14px"
                            borderRadius="15px"
                            borderColor={errors.review ? 'red.500' : 'inherit'}
                            name="review"
                            ml={'4px'}
                            {...register('review')}
                          />
                          {errors.review && (
                            <Text fontSize="xs" color="red.500" mt="4px" pl="12px">
                              {errors.review.message}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                      <Button
                        bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                        _hover={{
                          bg: 'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)'
                        }}
                        alignSelf="flex-end"
                        mt="24px"
                        w={{ sm: '75px', lg: '100px' }}
                        h="35px"
                        type="submit"
                      >
                        {isLoading ? (
                          <CircularProgress isIndeterminate value={1} color="#313860" size="25px" />
                        ) : (
                          <Text fontSize="xs" color="#fff" fontWeight="bold">
                            {intl.formatMessage({ id: 'app.send' })}
                          </Text>
                        )}
                      </Button>
                    </Flex>
                  )}
                </form>
              </FormProvider>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </BoxBackground>
  );
}

export default ProductReview;
