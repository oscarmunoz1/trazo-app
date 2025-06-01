import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StandardizedCompanyForm } from '../../../../components/Design';
// @ts-ignore: JS module in TS file
import { useCreateCompanyMutation } from 'store/api/companyApi';
import BoxBackground from '../components/BoxBackground';
// @ts-ignore: JSX component in TS file
import NewCompany from '../components/forms/NewCompany';

function AddCompany({ isEdit = false }) {
  const intl = useIntl();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  // @ts-ignore: Mutation hook
  const [createCompany, { isLoading }] = useCreateCompanyMutation();

  const handleSubmit = async (data) => {
    try {
      const result = await createCompany({
        ...data,
        owner: currentUser.id
      }).unwrap();

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Failed to create company:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  if (isEdit) {
    return (
      <BoxBackground
        title={intl.formatMessage({ id: 'app.editCompany' })}
        subtitle={intl.formatMessage({ id: 'app.modifyForm' })}>
        <NewCompany />
      </BoxBackground>
    );
  }

  return (
    <StandardizedCompanyForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

export default AddCompany;
