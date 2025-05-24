import { Box, Container, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbars/AuthNavbar';
import Footer from '../components/Footer/Footer';

export default function ConsumerLayout() {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar logoText="Trazo Consumer" secondary={false} logo={''} />
      <Container maxW="container.xl" flex="1">
        <Box py={8}>
          <Outlet />
        </Box>
      </Container>
      <Footer />
    </Flex>
  );
}
