// Chakra imports
import { Box, CircularProgress, Container } from '@chakra-ui/react';

const FullScreenLoader = () => {
  return (
    <Container sx={{ height: '95vh' }}>
      <Box display="flex" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
        <CircularProgress isIndeterminate value={32} color="#38A169" />
      </Box>
    </Container>
  );
};

export default FullScreenLoader;
