import BoxBackground from '../components/BoxBackground';
import EditEstablishment from '../components/forms/EditEstablishment';
import NewEstablishment from '../components/forms/NewEstablishment';
import { useIntl } from 'react-intl';

function AddEstablishment({ isEdit = false }) {
  const intl = useIntl();
  return (
    <BoxBackground
      title={
        isEdit
          ? intl.formatMessage({ id: 'app.editEstablishment' })
          : intl.formatMessage({ id: 'app.addEstablishment' })
      }
      subtitle={
        isEdit
          ? intl.formatMessage({ id: 'app.editEstablishmentSubtitle' })
          : intl.formatMessage({ id: 'app.addEstablishmentSubtitle' })
      }>
      {isEdit ? <EditEstablishment /> : <NewEstablishment />}
    </BoxBackground>
  );
}

export default AddEstablishment;
