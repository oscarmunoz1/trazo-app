import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
// Chakra imports
import {
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import BoxBackground from '../components/BoxBackground';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import productPage1 from 'assets/img/ProductImage1.png';
import { useGetEstablishmentQuery } from 'store/api/companyApi';
import { useSelector } from 'react-redux';
import { useState } from 'react';

function ProfileEstablishment() {
  const textColor = useColorModeValue('gray.700', 'white');

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
    <BoxBackground
      title="Establishment Profile"
      subtitle="Here you can see the information of your establishment.">
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px" width={'100%'}>
        <Card
          mt={{ md: '24px' }}
          maxWidth={{ sm: '100%', md: '100%', lg: '80%' }}
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
                      <Text fontSize="sm" fontWeight="500">
                        EDIT
                      </Text>
                    </Flex>
                  </MenuItem>
                  <MenuItem>
                    <Flex color="red.500" cursor="pointer" align="center" p="4px">
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
    </BoxBackground>
  );
}

export default ProfileEstablishment;
