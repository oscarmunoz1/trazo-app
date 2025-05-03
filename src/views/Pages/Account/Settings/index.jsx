/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  Stack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Icon,
  Badge,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

// Components
import Tabs from './components/Tabs';
import BasicInfo from './components/BasicInfo';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import Header from './components/Header';

// Icons
import {
  FaCreditCard,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaPlus,
  FaWallet,
  FaInfoCircle
} from 'react-icons/fa';

// Dummy data for illustration
const paymentMethods = [
  {
    id: 1,
    card_brand: 'visa',
    last_4: '4242',
    exp_month: 12,
    exp_year: 2025,
    is_default: true
  },
  {
    id: 2,
    card_brand: 'mastercard',
    last_4: '5678',
    exp_month: 8,
    exp_year: 2024,
    is_default: false
  }
];

const invoices = [
  {
    id: 1,
    invoice_date: '2023-03-01',
    amount: 180,
    status: 'paid',
    reference: 'MS-415646'
  },
  {
    id: 2,
    invoice_date: '2023-02-10',
    amount: 250,
    status: 'paid',
    reference: 'RV-126749'
  },
  {
    id: 3,
    invoice_date: '2023-01-05',
    amount: 560,
    status: 'paid',
    reference: 'FB-212562'
  },
  {
    id: 4,
    invoice_date: '2022-12-25',
    amount: 120,
    status: 'paid',
    reference: 'QW-103578'
  }
];

function Settings() {
  const intl = useIntl();
  const navigate = useNavigate();
  const activeCompany = useSelector((state) => state.company?.currentCompany);
  const textColor = useColorModeValue('gray.700', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const [activeTab, setActiveTab] = useState('account');

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      {/* Page Header */}
      <Flex mb={6} alignItems="center" justifyContent="space-between">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            {intl.formatMessage({ id: 'app.accountSettings' }) || 'Account Settings'}
          </Text>
          <Text color="gray.500">
            {intl.formatMessage({ id: 'app.manageAccountPreferences' }) ||
              'Manage your account settings and billing preferences'}
          </Text>
        </Box>
        <Button colorScheme="blue" variant="outline" onClick={() => navigate('/admin/dashboard')}>
          {intl.formatMessage({ id: 'app.backToDashboard' }) || 'Back to Dashboard'}
        </Button>
      </Flex>

      {/* Tabs Navigation */}
      <Box w="100%" mb={6}>
        <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: '8px', md: '38px' }} w="100%">
          <Button
            borderRadius="12px"
            boxShadow={activeTab === 'account' ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'}
            bg={activeTab === 'account' ? cardBg : 'transparent'}
            transition="all .5s ease"
            w={{ sm: '100%', md: '135px' }}
            h="35px"
            onClick={() => setActiveTab('account')}>
            <Text color={textColor} fontSize="xs" fontWeight="bold">
              {intl.formatMessage({ id: 'app.account' }) || 'ACCOUNT'}
            </Text>
          </Button>
          <Button
            borderRadius="12px"
            boxShadow={activeTab === 'billing' ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'}
            bg={activeTab === 'billing' ? cardBg : 'transparent'}
            transition="all .5s ease"
            w={{ sm: '100%', md: '135px' }}
            h="35px"
            onClick={() => setActiveTab('billing')}>
            <Text color={textColor} fontSize="xs" fontWeight="bold">
              {intl.formatMessage({ id: 'app.billing' }) || 'BILLING'}
            </Text>
          </Button>
          <Button
            borderRadius="12px"
            boxShadow={activeTab === 'security' ? '0px 2px 5.5px rgba(0, 0, 0, 0.06)' : 'none'}
            bg={activeTab === 'security' ? cardBg : 'transparent'}
            transition="all .5s ease"
            w={{ sm: '100%', md: '135px' }}
            h="35px"
            onClick={() => setActiveTab('security')}>
            <Text color={textColor} fontSize="xs" fontWeight="bold">
              {intl.formatMessage({ id: 'app.security' }) || 'SECURITY'}
            </Text>
          </Button>
        </Stack>
      </Box>

      {/* Account Information */}
      {activeTab === 'account' && (
        <Stack direction="column" spacing="24px" w="100%">
          <Header />
          <BasicInfo />
        </Stack>
      )}

      {/* Billing Information */}
      {activeTab === 'billing' && (
        <Grid templateColumns={{ base: '1fr', lg: '3fr 1fr' }} gap={6}>
          <Box>
            {/* Left Column - Payment Method */}
            <Stack spacing={5}>
              {/* Credit Card Display */}
              <Card bg={cardBg} borderRadius="lg" overflow="hidden" boxShadow="md">
                <Box
                  bg="gray.800"
                  p={5}
                  borderRadius="lg"
                  position="relative"
                  h="200px"
                  overflow="hidden">
                  <Flex
                    position="absolute"
                    top="20px"
                    right="20px"
                    alignItems="center"
                    color="white">
                    <Box w="30px" h="30px" bg="rgba(255,255,255,0.2)" borderRadius="full" mr={1} />
                    <Box
                      w="30px"
                      h="30px"
                      bg="rgba(255,255,255,0.2)"
                      borderRadius="full"
                      opacity={0.8}
                    />
                  </Flex>

                  <Text color="white" fontSize="md" fontWeight="bold" mb={8}>
                    {activeCompany?.name || 'Company Name'}
                  </Text>

                  <Text color="white" fontSize="lg" letterSpacing="wider" mb={6}>
                    7812 2139 0823 XXXX
                  </Text>

                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Text color="gray.300" fontSize="xs">
                        VALID THRU
                      </Text>
                      <Text color="white" fontSize="sm">
                        09/25
                      </Text>
                    </Box>
                    <Box>
                      <Text color="gray.300" fontSize="xs">
                        CVV
                      </Text>
                      <Text color="white" fontSize="sm">
                        ***
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Card>

              {/* Payment Categories */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
                <Card p={4} borderRadius="lg" boxShadow="sm" textAlign="center">
                  <Flex direction="column" alignItems="center">
                    <Box bg="teal.50" p={3} borderRadius="lg" mb={3}>
                      <Icon as={FaMoneyBillWave} color="teal.400" boxSize={6} />
                    </Box>
                    <Text fontWeight="bold" mb={1}>
                      Salary
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Belong Interactive
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mt={2}>
                      %2000
                    </Text>
                  </Flex>
                </Card>

                <Card p={4} borderRadius="lg" boxShadow="sm" textAlign="center">
                  <Flex direction="column" alignItems="center">
                    <Box bg="cyan.50" p={3} borderRadius="lg" mb={3}>
                      <Icon as={FaWallet} color="cyan.400" boxSize={6} />
                    </Box>
                    <Text fontWeight="bold" mb={1}>
                      Paypal
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Freelance Payment
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" mt={2}>
                      %4550
                    </Text>
                  </Flex>
                </Card>
              </SimpleGrid>

              {/* Invoices */}
              <Card>
                <CardHeader>
                  <Flex align="center" justify="space-between">
                    <Flex align="center">
                      <Icon as={FaFileInvoiceDollar} mr={2} />
                      <Text fontSize="lg" fontWeight="bold">
                        {intl.formatMessage({ id: 'app.invoices' }) || 'Invoices'}
                      </Text>
                    </Flex>
                    <Button size="sm" variant="outline">
                      {intl.formatMessage({ id: 'app.viewAll' }) || 'VIEW ALL'}
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Stack spacing={4}>
                    {invoices.map((invoice) => (
                      <Flex
                        key={invoice.id}
                        justify="space-between"
                        align="center"
                        pb={3}
                        borderBottomWidth={invoice.id !== invoices.length ? '1px' : '0'}
                        borderColor="gray.100">
                        <Box>
                          <Text fontWeight="medium">{formatDate(invoice.invoice_date)}</Text>
                          <Text fontSize="sm" color="gray.500">
                            #{invoice.reference}
                          </Text>
                        </Box>
                        <Flex align="center">
                          <Text fontWeight="medium" mr={3}>
                            {formatCurrency(invoice.amount)}
                          </Text>
                          <Button
                            size="sm"
                            leftIcon={<Icon as={FaFileInvoiceDollar} />}
                            variant="outline">
                            PDF
                          </Button>
                        </Flex>
                      </Flex>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </Box>

          <Box>
            {/* Right Column - Payment Methods */}
            <Card>
              <CardHeader>
                <Flex align="center" justify="space-between">
                  <Flex align="center">
                    <Icon as={FaCreditCard} mr={2} />
                    <Text fontSize="lg" fontWeight="bold">
                      {intl.formatMessage({ id: 'app.paymentMethods' }) || 'Payment Methods'}
                    </Text>
                  </Flex>
                  <Button size="sm" leftIcon={<FaPlus />} colorScheme="blue">
                    {intl.formatMessage({ id: 'app.addNewCard' }) || 'ADD NEW CARD'}
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  {paymentMethods.map((method) => (
                    <Flex
                      key={method.id}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor="gray.200"
                      bg={cardBg}
                      justify="space-between"
                      align="center"
                      _hover={{ boxShadow: 'sm' }}>
                      <Flex align="center">
                        <Box
                          w="40px"
                          h="40px"
                          borderRadius="md"
                          bg="gray.100"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mr={3}>
                          <Icon
                            as={method.card_brand === 'visa' ? FaCreditCard : FaCreditCard}
                            color={method.card_brand === 'visa' ? 'blue.500' : 'red.500'}
                          />
                        </Box>
                        <Box>
                          <Text fontWeight="medium">
                            {method.card_brand.charAt(0).toUpperCase() + method.card_brand.slice(1)}
                            {method.is_default && (
                              <Badge ml={2} colorScheme="green" fontSize="xs">
                                Default
                              </Badge>
                            )}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            •••• {method.last_4} | Expires: {method.exp_month}/{method.exp_year}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex>
                        {!method.is_default && (
                          <Button size="sm" variant="ghost" colorScheme="blue" mr={1}>
                            {intl.formatMessage({ id: 'app.edit' }) || 'Edit'}
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                  ))}
                </Stack>

                <Box mt={5} p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    <Icon as={FaInfoCircle} mr={1} />
                    {intl.formatMessage({ id: 'app.paymentSecurityNote' }) ||
                      'Payment information is securely stored and processed by Stripe.'}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {intl.formatMessage({ id: 'app.updateBillingAddress' }) ||
                      'You can update your billing address and other details in your payment settings.'}
                  </Text>
                </Box>
              </CardBody>
            </Card>

            {/* Billing Information */}
            <Card mt={6}>
              <CardHeader>
                <Text fontSize="lg" fontWeight="bold">
                  {intl.formatMessage({ id: 'app.billingInformation' }) || 'Billing Information'}
                </Text>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Box p={4} borderWidth="1px" borderRadius="md" bg={cardBg}>
                    <Flex justifyContent="space-between" mb={2}>
                      <Text fontWeight="medium">Oliver Liam</Text>
                      <Flex>
                        <Button size="xs" colorScheme="red" variant="ghost" mr={1}>
                          DELETE
                        </Button>
                        <Button size="xs" colorScheme="blue" variant="ghost">
                          EDIT
                        </Button>
                      </Flex>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Company Name: Viking Burrito
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Email Address: oliver@burrito.com
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      VAT Number: FRB1235476
                    </Text>
                  </Box>

                  <Box p={4} borderWidth="1px" borderRadius="md" bg={cardBg}>
                    <Flex justifyContent="space-between" mb={2}>
                      <Text fontWeight="medium">Lucas Harper</Text>
                      <Flex>
                        <Button size="xs" colorScheme="red" variant="ghost" mr={1}>
                          DELETE
                        </Button>
                        <Button size="xs" colorScheme="blue" variant="ghost">
                          EDIT
                        </Button>
                      </Flex>
                    </Flex>
                    <Text fontSize="sm" color="gray.500">
                      Company Name: Stone Tech Zone
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Email Address: lucas@stone-tech.com
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      VAT Number: FRB1235476
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>
        </Grid>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <Stack direction="column" spacing="24px" w="100%">
          <ChangePassword />
          <DeleteAccount />
        </Stack>
      )}
    </Flex>
  );
}

export default Settings;
