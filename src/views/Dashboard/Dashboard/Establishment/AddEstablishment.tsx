import React, { useEffect } from 'react';
import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
// @ts-ignore: JSX component in TS file
import EditEstablishment from '../components/forms/EditEstablishment';
// @ts-ignore: JSX component in TS file
import NewEstablishment from '../components/forms/NewEstablishment';
import BoxBackground from '../components/BoxBackground';
import subscriptionToastHelper from '../../../../utils/toast/SubscriptionToastHelper';

interface Props {
  isEdit?: boolean;
}

function AddEstablishment({ isEdit = false }: Props) {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isUpgrade = searchParams.get('return') === 'upgrade';

  // Clear any subscription success toasts when this component mounts
  useEffect(() => {
    subscriptionToastHelper.clearAllSubscriptionToastFlags();
  }, []);

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
      }
    >
      {isEdit ? <EditEstablishment /> : <NewEstablishment />}
    </BoxBackground>
  );
}

export default AddEstablishment;
