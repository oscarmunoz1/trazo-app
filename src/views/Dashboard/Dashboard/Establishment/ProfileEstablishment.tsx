// Chakra imports
import 'leaflet/dist/leaflet.css';
import {
  Badge,
  Box,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
  Stack
} from '@chakra-ui/react';
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaMapMarkerAlt,
  FaRegIdBadge,
  FaRegCommentDots,
  FaRegListAlt,
  FaRegLightbulb
} from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import BoxBackground from '../components/BoxBackground';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import HTMLRenderer from 'components/Utils/HTMLRenderer';
import ImageCarousel from 'components/ImageCarousel/ImageCarousel';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import productPage1 from 'assets/img/ProductImage1.png';
import { useGetEstablishmentQuery } from 'store/api/companyApi';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import CarbonSummaryCard from '../components/establishment/CarbonSummaryCard';

// Add type for Redux state
interface RootState {
  company: {
    currentCompany: {
      id: string;
      name: string;
    };
  };
}

function ProfileEstablishment() {
  const intl = useIntl();
  const textColor = useColorModeValue('gray.700', 'white');

  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(productPage1);
  const { establishmentId } = useParams();
  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  const currentCompany = useSelector((state: RootState) => state.company.currentCompany);

  const {
    data: establishmentData,
    error,
    isLoading
  } = useGetEstablishmentQuery(
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
      title={intl.formatMessage({ id: 'app.establishmentProfile' })}
      subtitle={intl.formatMessage({ id: 'app.establishmentSubtitle' })}>
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px" width={'100%'}>
        <Card
          p={{ base: 4, md: 8 }}
          borderRadius="2xl"
          boxShadow="xl"
          bg="white"
          w="100%"
          maxW="1100px">
          <Flex direction={{ base: 'column', md: 'row' }} gap={12} align="flex-start">
            {/* Left: Main Image and Thumbnails */}
            <Box flex="1" minW={{ base: '100%', md: '400px' }} maxW="340px">
              <ImageCarousel
                imagesList={
                  establishmentData?.images?.length > 0 ? establishmentData.images : [productPage1]
                }
              />
            </Box>
            {/* Divider for desktop */}
            <Box display={{ base: 'none', md: 'block' }} h="260px" w="1px" bg="gray.200" mx={2} />
            {/* Right: Details */}
            <Box flex="3" minW={0}>
              <Flex justify="flex-end" mb={2}>
                <Menu placement="left-start">
                  <MenuButton>
                    <Icon as={IoEllipsisVerticalSharp} color="gray.400" w="20px" h="20px" />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() =>
                        navigate(`/admin/dashboard/establishment/${establishmentId}/change`)
                      }>
                      <Flex color={textColor} cursor="pointer" align="center" p="4px">
                        <Text fontSize="sm" fontWeight="500">
                          {intl.formatMessage({ id: 'app.edit' }).toUpperCase()}
                        </Text>
                      </Flex>
                    </MenuItem>
                    <MenuItem>
                      <Flex color="red.500" cursor="pointer" align="center" p="4px">
                        <Text fontSize="sm" fontWeight="500">
                          {intl.formatMessage({ id: 'app.delete' }).toUpperCase()}
                        </Text>
                      </Flex>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
              <Text fontSize="3xl" fontWeight="bold" mb={1} noOfLines={2}>
                {establishmentData?.name ||
                  intl.formatMessage({ id: 'app.unknown', defaultMessage: 'Desconocido' })}
              </Text>
              <Text color="gray.500" mb={2} fontSize="md">
                {intl.formatMessage({ id: 'app.company' })}
              </Text>
              <Text color={textColor} fontWeight="bold" fontSize="xl" mb={4}>
                {currentCompany?.name ||
                  intl.formatMessage({ id: 'app.unknown', defaultMessage: 'Desconocido' })}
              </Text>
              <Flex gap={2} mb={4} flexWrap="wrap">
                {establishmentData?.certifications && (
                  <Badge colorScheme="green" borderRadius="md" px={3} py={1} fontSize="md">
                    <Icon as={FaRegIdBadge} mr={2} />
                    {establishmentData.certifications}
                  </Badge>
                )}
              </Flex>
              <Stack spacing={2} mb={4}>
                <Flex align="center">
                  <Icon as={FaMapMarkerAlt} color="green.400" mr={2} />
                  <Text fontWeight="bold" mr={1}>
                    {intl.formatMessage({ id: 'app.address' })}:
                  </Text>
                  <Text color="gray.600">{establishmentData?.address || '-'}</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={FaRegIdBadge} color="green.400" mr={2} />
                  <Text fontWeight="bold" mr={1}>
                    {intl.formatMessage({ id: 'app.city' })}:
                  </Text>
                  <Text color="gray.600">{establishmentData?.city || '-'}</Text>
                </Flex>
                <Flex align="center">
                  <Icon as={FaRegIdBadge} color="green.400" mr={2} />
                  <Text fontWeight="bold" mr={1}>
                    {intl.formatMessage({ id: 'app.state' })}:
                  </Text>
                  <Text color="gray.600">{establishmentData?.state || '-'}</Text>
                </Flex>
                {establishmentData?.zone && (
                  <Flex align="center">
                    <Icon as={FaRegIdBadge} color="green.400" mr={2} />
                    <Text fontWeight="bold" mr={1}>
                      {intl.formatMessage({ id: 'app.zone' })}:
                    </Text>
                    <Text color="gray.600">{establishmentData?.zone}</Text>
                  </Flex>
                )}
                {typeof establishmentData?.latitude === 'number' &&
                  typeof establishmentData?.longitude === 'number' &&
                  !isNaN(establishmentData.latitude) &&
                  !isNaN(establishmentData.longitude) && (
                    <Flex align="center">
                      <Icon as={FaMapMarkerAlt} color="green.400" mr={2} />
                      <Text fontWeight="bold" mr={1}>
                        {intl.formatMessage({ id: 'app.coordinates' })}:
                      </Text>
                      <Text color="gray.600">{`${establishmentData.latitude}, ${establishmentData.longitude}`}</Text>
                    </Flex>
                  )}
              </Stack>
              {/* Carbon summary card here */}
              {establishmentData?.id && (
                <Box mb={6}>
                  <CarbonSummaryCard establishmentId={establishmentData.id} />
                </Box>
              )}
              <Box mt={4}>
                <Text fontWeight="bold" mb={2}>
                  {intl.formatMessage({ id: 'app.socialMedia', defaultMessage: 'Redes sociales' })}:
                </Text>
                <Flex gap={3}>
                  {establishmentData?.facebook && (
                    <Link
                      href={establishmentData.facebook}
                      color="green.400"
                      fontSize="2xl"
                      isExternal
                      _hover={{ color: 'green.600', textDecoration: 'none' }}
                      aria-label="Facebook">
                      <Icon as={FaFacebook} />
                    </Link>
                  )}
                  {establishmentData?.instagram && (
                    <Link
                      href={establishmentData.instagram}
                      color="green.400"
                      fontSize="2xl"
                      isExternal
                      _hover={{ color: 'green.600', textDecoration: 'none' }}
                      aria-label="Instagram">
                      <Icon as={FaInstagram} />
                    </Link>
                  )}
                  {establishmentData?.twitter && (
                    <Link
                      href={establishmentData.twitter}
                      color="green.400"
                      fontSize="2xl"
                      isExternal
                      _hover={{ color: 'green.600', textDecoration: 'none' }}
                      aria-label="Twitter">
                      <Icon as={FaTwitter} />
                    </Link>
                  )}
                </Flex>
              </Box>
            </Box>
          </Flex>
          {/* Public Profile Section */}
          <Box mt={10} p={6} bg="gray.50" borderRadius="lg" boxShadow="md">
            <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
              {intl.formatMessage({
                id: 'app.publicProfile',
                defaultMessage: 'Perfil público del establecimiento'
              })}
            </Text>
            <Stack spacing={4}>
              {establishmentData?.about && (
                <Flex align="center">
                  <Icon as={FaRegCommentDots} color="green.400" boxSize={5} mr={2} />
                  <Text fontWeight="bold" fontSize="lg" mr={2}>
                    {intl.formatMessage({
                      id: 'app.aboutEstablishment',
                      defaultMessage: 'Sobre el establecimiento'
                    })}
                    :
                  </Text>
                  <Text>{establishmentData.about}</Text>
                </Flex>
              )}
              {establishmentData?.main_activities && (
                <Flex align="center">
                  <Icon as={FaRegListAlt} color="green.400" boxSize={5} mr={2} />
                  <Text fontWeight="bold" fontSize="lg" mr={2}>
                    {intl.formatMessage({
                      id: 'app.mainActivities',
                      defaultMessage: 'Actividades principales / Servicios'
                    })}
                    :
                  </Text>
                  <Text>{establishmentData.main_activities}</Text>
                </Flex>
              )}
              {establishmentData?.location_highlights && (
                <Flex align="center">
                  <Icon as={FaRegLightbulb} color="green.400" boxSize={5} mr={2} />
                  <Text fontWeight="bold" fontSize="lg" mr={2}>
                    {intl.formatMessage({
                      id: 'app.locationHighlights',
                      defaultMessage: 'Características de la ubicación'
                    })}
                    :
                  </Text>
                  <Text>{establishmentData.location_highlights}</Text>
                </Flex>
              )}
              {establishmentData?.custom_message && (
                <Flex align="center">
                  <Icon as={FaRegCommentDots} color="green.400" boxSize={5} mr={2} />
                  <Text fontWeight="bold" fontSize="lg" mr={2}>
                    {intl.formatMessage({
                      id: 'app.customMessage',
                      defaultMessage: 'Mensaje o historia personalizada'
                    })}
                    :
                  </Text>
                  <Text>{establishmentData.custom_message}</Text>
                </Flex>
              )}
              {![
                establishmentData?.about,
                establishmentData?.main_activities,
                establishmentData?.location_highlights,
                establishmentData?.custom_message
              ].some(Boolean) && (
                <Text color="gray.400">
                  {intl.formatMessage({
                    id: 'app.noPublicProfileInfo',
                    defaultMessage: 'Este establecimiento aún no tiene información pública cargada.'
                  })}
                </Text>
              )}
            </Stack>
          </Box>
        </Card>
      </Flex>
    </BoxBackground>
  );
}

export default ProfileEstablishment;
