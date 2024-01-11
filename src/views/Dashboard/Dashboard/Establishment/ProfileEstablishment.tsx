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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FaFacebook, FaInstagram, FaPencilAlt, FaTrashAlt, FaTwitter } from 'react-icons/fa';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BgSignUp from 'assets/img/basic-auth.png';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import FormInput from 'components/Forms/FormInput';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import NewEstablishment from '../components/forms/NewEstablishment';
import productPage1 from 'assets/img/ProductImage1.png';
import productPage2 from 'assets/img/ProductImage2.png';
import productPage3 from 'assets/img/ProductImage3.png';
import productPage4 from 'assets/img/ProductImage4.png';
import { useGetEstablishmentQuery } from 'store/api/companyApi';
import { useSelector } from 'react-redux';
import { useSignUpMutation } from 'store/api/authApi';
import { zodResolver } from '@hookform/resolvers/zod';

function ProfileEstablishment() {
  const titleColor = useColorModeValue('green.300', 'green.200');
  const textColor = useColorModeValue('gray.700', 'white');
  const bgColor = useColorModeValue('white', 'gray.700');
  const bgIcons = useColorModeValue('green.200', 'rgba(255, 255, 255, 0.5)');
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(productPage1);
  const { establishmentId } = useParams();
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const { data: establishmentData, error, isLoading } = useGetEstablishmentQuery(
    {
      companyId: currentCompany?.id,
      establishmentId
    },
    {
      skip: !establishmentId || currentCompany?.id === undefined
    }
  );

  return (
    <Flex direction="column" alignSelf="center" justifySelf="center" overflow="hidden">
      <Box
        position="absolute"
        minH={{ base: '70vh', md: '50vh' }}
        borderRadius={{ md: '15px' }}
        left="0"
        right="0"
        bgRepeat="no-repeat"
        overflow="hidden"
        zIndex="-1"
        top="0"
        bgImage={BgSignUp}
        bgSize="cover"
        mt={{ md: '100px' }}
        marginInlineStart={'25px'}
        marginInlineEnd={'25px'}></Box>
      <Flex
        direction="column"
        textAlign="center"
        justifyContent="center"
        align="center"
        mt="6.5rem"
        pt={'55px'}>
        <Text fontSize="4xl" color="white" fontWeight="bold">
          Establishment Profile
        </Text>
        <Text
          fontSize="md"
          color="white"
          fontWeight="normal"
          mt="10px"
          mb="26px"
          w={{ base: '90%', sm: '60%', lg: '40%', xl: '25%' }}>
          Here you can see the information of your establishment.
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <Card
          mt={{ md: '24px' }}
          maxWidth={{ sm: '95%', md: '85%', lg: '80%' }}
          px="0px"
          pt={{ sm: '16px', md: '32px', lg: '0px' }}
          boxShadow="rgba(0, 0, 0, 0.05) 0px 20px 27px 0px">
          <CardHeader justifyContent="end">
            <Flex p="24px" align="center" justify="center">
              <Menu isOpen={isOpen1} onClose={onClose1}>
                <MenuButton onClick={onOpen1} alignSelf="flex-start">
                  <Icon as={IoEllipsisVerticalSharp} color="gray.400" w="20px" h="20px" />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      navigate(`/admin/dashboard/establishment/${establishmentId}/change`)
                    }>
                    <Flex color={textColor} cursor="pointer" align="center" p="4px">
                      {/* <Icon as={FaPencilAlt} me="4px" /> */}
                      <Text fontSize="sm" fontWeight="500">
                        EDIT
                      </Text>
                    </Flex>
                  </MenuItem>
                  <MenuItem>
                    <Flex color="red.500" cursor="pointer" align="center" p="4px">
                      {/* <Icon as={FaTrashAlt} me="4px" /> */}
                      <Text fontSize="sm" fontWeight="500">
                        DELETE
                      </Text>
                    </Flex>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </CardHeader>
          <CardBody px={{ sm: '16px', md: '32px', lg: '48px' }}>
            <Flex direction={'column'}>
              <Flex direction={{ sm: 'column', lg: 'row' }} mb={{ sm: '42px', lg: '48px' }}>
                <ImageCarousel imagesList={establishmentData?.images} />

                <Flex direction="column">
                  <Text color={textColor} fontSize="3xl" fontWeight="bold" mb="12px">
                    {establishmentData?.name}
                  </Text>
                  <Text color="gray.400" fontWeight="normal" fontSize="sm">
                    Company
                  </Text>
                  <Text color={textColor} fontWeight="bold" fontSize="2xl" mb="12px">
                    {currentCompany?.name}
                  </Text>
                  {/* <Badge
                    colorScheme="green"
                    w="95px"
                    h="28px"
                    mb="40px"
                    borderRadius="15px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    CERTIFIED
                  </Badge> */}
                  <Flex direction="column">
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        Address:
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishmentData?.address}
                      </Text>
                    </Flex>

                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        City:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishmentData?.city}
                      </Text>
                    </Flex>
                    <Flex align="center" mb="10px">
                      <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                        State:{' '}
                      </Text>
                      <Text fontSize="md" color="gray.500" fontWeight="400">
                        {establishmentData?.state}
                      </Text>
                    </Flex>
                    {establishmentData?.zone && (
                      <Flex align="center" mb="10px">
                        <Text fontSize="md" color={textColor} fontWeight="bold" me="10px">
                          Zone:
                        </Text>
                        <Text fontSize="md" color="gray.500" fontWeight="400">
                          {establishmentData?.zone}
                        </Text>
                      </Flex>
                    )}
                    <Flex align="center" mb="10px">
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
              <Flex px="24px" pb="24px">
                <HTMLRenderer htmlString={establishmentData?.description} />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </Flex>
  );
}

export default ProfileEstablishment;
