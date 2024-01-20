// Chakra imports
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormLabel,
  Input,
  Stack,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useRef, useState } from 'react';
import { object, string } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';

import BoxBackground from '../components/BoxBackground';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { FiCamera } from 'react-icons/fi';
import FormInput from 'components/Forms/FormInput';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import avatar4 from 'assets/img/avatars/avatar4.png';
import { set } from 'date-fns';
import { setUser } from 'store/features/userSlice';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { useGetParcelQuery } from 'store/api/productApi';
import { useSelector } from 'react-redux';
import { useUpdateUserMutation } from 'store/api/userApi';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchemaBasic = object({
  first_name: string().min(1, 'First name is required'),
  last_name: string().min(1, 'Last name is required'),
  email: string().email('Invalid email').min(1, 'Email is required'),
  phone: string()
});

function ProfileUser() {
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');
  const navigate = useNavigate();
  const image = useRef(null);
  const [picture, setPicture] = useState(null);
  const [pictureHasChange, setPictureHasChange] = useState(false);
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.userState.user);

  useEffect(() => {
    if (currentUser) {
      setPicture(currentUser.image || '');
    }
  }, [currentUser]);

  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic)
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitSuccessful },
    register
  } = basicMethods;

  const [updateUser, { data, error, isSuccess, isLoading }] = useUpdateUserMutation();

  const onSubmitUseInfo = (data) => {
    if (currentUser) {
      updateUser({
        userId: currentUser.id,
        userData: {
          ...data,
          ...(pictureHasChange && acceptedFiles.length > 0 && { image: acceptedFiles[0] })
        }
      });
    }
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    // onDrop,
    accept: 'image/*', // Accepted file types
    maxFiles: 1 // Maximum number of files
    // maxSize: 1024 * 1024 * 5, // Maximum file size (5 MB)
  });

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setPicture(URL.createObjectURL(file));
      setPictureHasChange(true);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (currentUser) {
      setValue('first_name', currentUser.first_name || '');
      setValue('last_name', currentUser.last_name || '');
      setValue('email', currentUser.email || '');
      setValue('phone', currentUser.phone || '');
    }
  }, [currentUser]);

  useEffect(() => {
    if (isSuccess && data) {
      navigate(`/admin/dashboard/`);
    }
  }, [isSuccess, data, dispatch, navigate]);

  return (
    <BoxBackground title={'User Profile'} subtitle={'Modify the form below to edit your profile '}>
      <Flex
        direction="column"
        bg={bgColor}
        w={{ base: '100%', md: '768px' }}
        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        borderRadius="15px">
        <Tabs variant="unstyled" mt="24px" alignSelf="center" w="100%">
          <TabPanels maxW={{ md: '90%', lg: '100%' }} mx="auto">
            <TabPanel>
              <Card>
                <CardHeader mb="32px">
                  <Text fontSize="lg" color={textColor} fontWeight="bold">
                    Main Info
                  </Text>
                </CardHeader>

                <CardBody>
                  <FormProvider {...basicMethods}>
                    <form onSubmit={handleSubmit(onSubmitUseInfo)} style={{ width: '100%' }}>
                      <Stack direction="column" spacing="20px" w="100%">
                        <Box position="relative" display="inline-block">
                          <Avatar
                            ref={image}
                            src={picture}
                            w="80px"
                            h="80px"
                            me="22px"
                            borderRadius="15px">
                            <AvatarBadge
                              boxSize="1.75em"
                              bg="gray.100"
                              {...getRootProps({ className: 'dropzone' })}>
                              <FiCamera color="black" />
                              <Input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                position="absolute"
                                opacity={0}
                                aria-hidden="true"
                                width="100%"
                                height="100%"
                                top={0}
                                left={0}
                                zIndex={2}
                                cursor={'pointer'}
                                {...getInputProps()}
                              />
                            </AvatarBadge>
                          </Avatar>
                        </Box>
                        <Stack
                          direction={{ sm: 'column', md: 'row' }}
                          spacing="30px"
                          paddingTop="20px">
                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder="First name"
                            name="first_name"
                            label="First name"
                          />

                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder="Last name"
                            name="last_name"
                            label="Last name"
                          />
                        </Stack>
                        <Stack direction={{ sm: 'column', md: 'row' }} spacing="30px">
                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder="Email"
                            name="email"
                            label="Email"
                          />
                          <FormInput
                            fontSize="xs"
                            ms="4px"
                            borderRadius="15px"
                            type="text"
                            placeholder="Phone"
                            name="phone"
                            label="Phone"
                          />
                        </Stack>
                      </Stack>
                      <Flex gap={'25px'} justifyContent={'flex-end'}>
                        <Button
                          variant="no-hover"
                          bg="linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)"
                          alignSelf="flex-end"
                          mt="24px"
                          w="100px"
                          h="35px"
                          type="submit">
                          {isLoading ? (
                            <CircularProgress
                              isIndeterminate
                              value={1}
                              color="#313860"
                              size="25px"
                            />
                          ) : (
                            <Text fontSize="xs" color="#fff" fontWeight="bold">
                              SAVE
                            </Text>
                          )}
                        </Button>
                      </Flex>
                    </form>
                  </FormProvider>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </BoxBackground>
  );
}

export default ProfileUser;
