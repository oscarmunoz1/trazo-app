import BoxBackground from '../components/BoxBackground';
import FinishProductionForm from '../components/forms/FinishProduction';
// Chakra imports
import { Flex } from '@chakra-ui/react';

function FinishProduction() {
  return (
    <BoxBackground
      title="Finish the current Production"
      subtitle="Complete the form below to finish the current production on your parcel.">
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <FinishProductionForm />
      </Flex>
    </BoxBackground>
  );
}

export default FinishProduction;
