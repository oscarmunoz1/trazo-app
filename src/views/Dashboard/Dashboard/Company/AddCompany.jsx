import BoxBackground from '../components/BoxBackground';
import NewCompany from '../components/forms/NewCompany';

import { useIntl } from 'react-intl';

function AddCompany({ isEdit = false }) {
  const intl = useIntl();
  return (
    <BoxBackground
      title={
        isEdit
          ? intl.formatMessage({ id: 'app.editCompany' })
          : intl.formatMessage({ id: 'app.createCompany' })
      }
      subtitle={
        isEdit
          ? intl.formatMessage({ id: 'app.modifyForm' })
          : intl.formatMessage({ id: 'app.completeForm' })
      }
    >
      <NewCompany />
    </BoxBackground>
  );
}

export default AddCompany;
