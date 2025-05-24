import BoxBackground from '../components/BoxBackground';
import EditProduction from '../components/forms/EditProduction';
// Chakra imports
import { Flex } from '@chakra-ui/react';
import NewProduction from '../components/forms/NewProduction';
import { useIntl } from 'react-intl';

type UpdateProductionProps = {
  isEdit: boolean;
};

function UpdateProduction(props: UpdateProductionProps) {
  const intl = useIntl();
  const { isEdit } = props;
  return (
    <BoxBackground
      title={
        isEdit
          ? intl.formatMessage({ id: 'app.editProduction' })
          : intl.formatMessage({ id: 'app.addProduction' })
      }
      subtitle={
        isEdit
          ? intl.formatMessage({ id: 'app.editProductionDescription' })
          : intl.formatMessage({ id: 'app.addProductionDescription' })
      }
    >
      {isEdit ? <EditProduction /> : <NewProduction />}
    </BoxBackground>
  );
}

export default UpdateProduction;
