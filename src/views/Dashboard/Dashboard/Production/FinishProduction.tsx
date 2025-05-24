import { useIntl } from 'react-intl';
import BoxBackground from '../components/BoxBackground';
import FinishProductionForm from '../components/forms/FinishProduction';
// Chakra imports
import { Flex } from '@chakra-ui/react';

function FinishProduction() {
  const intl = useIntl();
  return (
    <BoxBackground
      title={intl.formatMessage({ id: 'app.finishProduction' })}
      subtitle={intl.formatMessage({
        id: 'app.completeTheFormBelowToFinishTheCurrentProductionOnYourParcel'
      })}
    >
      <Flex alignItems="center" justifyContent="center" mb="60px" mt="20px">
        <FinishProductionForm />
      </Flex>
    </BoxBackground>
  );
}

export default FinishProduction;
