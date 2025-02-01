// Chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue
} from '@chakra-ui/react';
import { BellIcon, SearchIcon } from '@chakra-ui/icons';
import { FormProvider, useForm } from 'react-hook-form';
import { NavLink, useLocation, useMatch, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { object, string } from 'zod';

import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody.tsx';
import CardHeader from 'components/Card/CardHeader.tsx';
import FormInput from 'components/Forms/FormInput';
import MemberRow from './memberRow';
import Select from 'react-select';
import { es } from 'date-fns/locale';
import { useGetCompanyMembersQuery } from 'store/api/companyApi';
import { useGetUserRolesQuery } from 'store/api/userApi';
import { useIntl } from 'react-intl';
// assets
import { useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed
      ? { ...base, backgroundColor: 'gray', borderRadius: '10px' }
      : { ...base, borderRadius: '10px' };
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base;
  },
  control: (provided, state) => ({
    ...provided,
    border: '1px solid #E2E8F0',
    borderRadius: '15px',
    boxShadow: 'none',
    outline: '2px solid transparent',
    minHeight: '40px',
    fontSize: '0.75rem;',
    marginLeft: '4px'
  })
};

const formSchemaBasic = object({
  date: string().min(1, 'Date is required')
});

export default function SettingsView() {
  const { establishmentId } = useParams();
  const intl = useIntl();
  const [currentEstablishmentId, setCurrentEstablishmentId] = useState(null);
  const [establishment, setEstablishment] = useState(null);
  const [currentView, setCurrentView] = useState(null);

  const cardColor = useColorModeValue('white', 'gray.700');

  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);

  const [establishmentsOptions, setEstablishmentsOptions] = useState([]);

  const currentCompany = useSelector((state) => state.company.currentCompany);

  const establishments = useSelector((state) => state.company.currentCompany?.establishments);

  const { data: companyMembers } = useGetCompanyMembersQuery(
    {
      companyId: currentCompany?.id
    },
    {
      skip: currentCompany?.id === undefined
    }
  );

  // to check for active links and opened collapses
  let location = useLocation();
  let searchIcon = useColorModeValue('gray.700', 'gray.200');
  const bgButton = useColorModeValue(
    'linear-gradient(81.62deg, #313860 2.25%, #151928 79.87%)',
    'gray.800'
  );
  let inputBg = useColorModeValue('white', 'gray.800');
  const iconBoxInside = useColorModeValue('white', 'white');
  let mainText = useColorModeValue('gray.700', 'gray.200');
  let mainTeal = useColorModeValue('green.500', 'green.400');

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName, isDashboard = false) => {
    if (isDashboard) {
      return location.pathname.startsWith(routeName) ? 'active' : '';
    }
    return location.pathname === routeName ? 'active' : '';
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChange = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'clear':
        newValue = null;
        break;
    }
    setValue(newValue);
  };

  const onChange2 = (newValue, actionMeta) => {
    switch (actionMeta.action) {
      case 'clear':
        newValue = null;
        break;
    }
    setValue2(newValue);
  };

  const basicMethods = useForm({
    resolver: zodResolver(formSchemaBasic)
  });

  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = basicMethods;

  const onSubmitBasic = (data) => {
    console.log(data);
  };

  const { data: userRoles } = useGetUserRolesQuery();

  useEffect(() => {
    if (establishments) {
      const establishmentValues = establishments.map((establishment) => {
        return {
          value: establishment.id,
          label: establishment.name
        };
      });
      setEstablishmentsOptions(establishmentValues);
    }
  }, [establishments]);

  return (
    <Flex flexDirection="column" gap="20px" pt={{ base: '120px', md: '75px' }}>
      <Text
        color={mainText}
        color="gray.400"
        fontSize="sm"
        bg="inherit"
        borderRadius="inherit"
        fontWeight="300"
        padding="4px">
        {intl.formatMessage({ id: 'app.companySettingsDescription' })}
      </Text>
      <Card p="16px">
        <Text color={mainText} bg="inherit" borderRadius="inherit" fontWeight="bold" padding="10px">
          {intl.formatMessage({ id: 'app.inviteNewMembers' })}
        </Text>
        <Flex direction={'row'} grow={'1'} pr={'32px'}>
          <FormProvider {...basicMethods}>
            <form onSubmit={handleSubmit(onSubmitBasic)} style={{ width: '100%' }}>
              <Flex direction={{ base: 'column', lg: 'row' }} gap="10px" width={'100%'}>
                <Flex gap="10px" width={'100%'} direction={{ base: 'column', smdd: 'row' }}>
                  <Flex width={{ base: '100%', smdd: '40%' }}>
                    <FormInput
                      fontSize="xs"
                      borderRadius="15px"
                      type="text"
                      placeholder={intl.formatMessage({ id: 'app.inviteByEmail' })}
                      name="name"
                      // label="Name"
                    />
                  </Flex>
                  <FormControl width={{ base: '100%', smdd: '40%' }}>
                    <Select
                      width={'100%'}
                      value={value}
                      styles={styles}
                      isClearable={true}
                      name="colors"
                      placeholder={intl.formatMessage({ id: 'app.selectEstablishments' })}
                      isMulti
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={onChange}
                      options={establishmentsOptions}
                    />
                  </FormControl>
                  <FormControl width={{ base: '100%', smdd: '40%' }}>
                    <Select
                      width={'100%'}
                      value={value2}
                      styles={styles}
                      isClearable={true}
                      name="colors"
                      placeholder={intl.formatMessage({ id: 'app.selectRole' })}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={onChange2}
                      options={userRoles?.map((role) => {
                        return {
                          value: role.id,
                          label: role.name
                        };
                      })}
                    />
                  </FormControl>
                </Flex>
                <Flex gap={'10px'} justifyContent={'flex-end'} pt={{ base: '12px', smdd: '0' }}>
                  <Button
                    variant="outline"
                    colorScheme="green"
                    minW="120px"
                    h="40px"
                    fontSize="xs"
                    px="1.5rem"
                    onClick={() => {}}>
                    {intl.formatMessage({ id: 'app.discardChanges' })}
                  </Button>
                  <Button
                    bg={bgButton}
                    color="white"
                    h="40px"
                    fontSize="xs"
                    variant="no-hover"
                    onClick={() => {}}>
                    {intl.formatMessage({ id: 'app.sendInvite' })}
                  </Button>
                </Flex>
              </Flex>
            </form>
          </FormProvider>
        </Flex>
      </Card>
      <Card p="16px">
        <Text color={mainText} bg="inherit" borderRadius="inherit" fontWeight="bold" padding="10px">
          {intl.formatMessage({ id: 'app.membersInThisCompany' })}
        </Text>
        <Flex pt={'12px'}>
          <InputGroup
            cursor="pointer"
            bg={inputBg}
            borderRadius="15px"
            w={{
              sm: '60%',
              md: '200px'
            }}
            me={{ sm: '20px', md: '20px' }}
            _focus={{
              borderColor: { mainTeal }
            }}
            _active={{
              borderColor: { mainTeal }
            }}>
            <InputLeftElement
              children={
                <IconButton
                  bg="inherit"
                  borderRadius="inherit"
                  _hover="none"
                  _active={{
                    bg: 'inherit',
                    transform: 'none',
                    borderColor: 'transparent'
                  }}
                  _focus={{
                    boxShadow: 'none'
                  }}
                  icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}></IconButton>
              }
            />
            <Input
              fontSize="xs"
              py="11px"
              color={mainText}
              placeholder={intl.formatMessage({ id: 'app.typeHere' })}
              borderRadius="inherit"
            />
          </InputGroup>
        </Flex>
        <Card px="0px" minH="280px">
          <CardBody overflowX={{ sm: 'scroll', md: 'hidden' }}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  {[
                    intl.formatMessage({ id: 'app.name' }),
                    intl.formatMessage({ id: 'app.currentWorkingEstablishments' }),
                    intl.formatMessage({ id: 'app.role' })
                  ].map((label) => {
                    return (
                      <Th
                        color="gray.400"
                        fontSize="xs"
                        key={label}
                        paddingInlineStart={'25px'}
                        paddingInlineEnd={'25px'}>
                        {label}
                      </Th>
                    );
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {companyMembers?.map((member) => {
                  return (
                    <MemberRow
                      name={member.user}
                      establishments={member.establishments_in_charge.map((establishment) => {
                        return establishment.name;
                      })}
                      role={member.role}
                    />
                  );
                })}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Card>
    </Flex>
  );
}
