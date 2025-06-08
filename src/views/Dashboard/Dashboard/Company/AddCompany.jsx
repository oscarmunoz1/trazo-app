import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { StandardizedCompanyForm } from '../../../../components/Design';
// @ts-ignore: JS module in TS file
import { useCreateCompanyMutation } from 'store/api/companyApi';
import { setCompany } from 'store/features/companySlice';
import { setUserCompany } from 'store/features/userSlice';
import BoxBackground from '../components/BoxBackground';
// @ts-ignore: JSX component in TS file
import NewCompany from '../components/forms/NewCompany';

function AddCompany({ isEdit = false }) {
  const intl = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.userState.user);

  console.log('🏢 AddCompany: Component rendered', { isEdit, currentUser: currentUser?.id });

  // @ts-ignore: Mutation hook
  const [
    createCompany,
    { data: dataCompany, isSuccess: isSuccessCompany, isLoading, error: mutationError }
  ] = useCreateCompanyMutation();

  console.log('🏢 AddCompany: Mutation state', {
    isSuccessCompany,
    isLoading,
    hasData: !!dataCompany,
    dataCompany,
    mutationError
  });

  const handleSubmit = async (data) => {
    console.log('🏢 AddCompany: handleSubmit called with data:', data);
    console.log('🏢 AddCompany: currentUser for owner:', currentUser);

    if (!currentUser || !currentUser.id) {
      console.error('🏢 AddCompany: No authenticated user found!');
      console.error('🏢 AddCompany: currentUser state:', currentUser);
      // You might want to redirect to login or show an error
      return;
    }

    // Transform form data to match backend API field names
    const submitData = {
      name: data.name,
      contact_email: data.email, // email -> contact_email
      contact_phone: data.phone, // phone -> contact_phone
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country, // Make sure country is included
      website: data.website,
      description: data.description,
      // Note: employeeCount, zipCode, isActive are not supported by backend
      owner: currentUser.id
    };

    console.log('🏢 AddCompany: Transformed submit data:', submitData);

    try {
      console.log('🏢 AddCompany: Calling createCompany mutation...');
      const result = await createCompany(submitData).unwrap();
      console.log('🏢 AddCompany: createCompany succeeded:', result);
    } catch (error) {
      console.error('🏢 AddCompany: createCompany failed:', error);
      console.error('🏢 AddCompany: Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
    }
  };

  // Handle successful company creation with useEffect like the original form
  useEffect(() => {
    console.log('🏢 AddCompany: useEffect triggered', {
      isSuccessCompany,
      hasDataCompany: !!dataCompany,
      dataCompany
    });

    if (isSuccessCompany && dataCompany) {
      console.log('🏢 AddCompany: Processing successful company creation');
      console.log('🏢 AddCompany: Company data:', dataCompany);

      dispatch(setCompany(dataCompany));
      const { id, name } = dataCompany;
      dispatch(setUserCompany({ id, name }));

      console.log('🏢 AddCompany: Dispatched Redux actions, navigating to pricing...');
      console.log(
        '🏢 AddCompany: Navigation URL:',
        `/admin/dashboard/pricing?new_company=true&company_id=${id}`
      );

      // Redirect to pricing page for new companies
      navigate(`/admin/dashboard/pricing?new_company=true&company_id=${id}`);
    }
  }, [isSuccessCompany, dataCompany, dispatch, navigate]);

  const handleCancel = () => {
    console.log('🏢 AddCompany: handleCancel called');
    navigate('/admin/dashboard');
  };

  if (isEdit) {
    console.log('🏢 AddCompany: Rendering edit mode');
    return (
      <BoxBackground
        title={intl.formatMessage({ id: 'app.editCompany' })}
        subtitle={intl.formatMessage({ id: 'app.modifyForm' })}
      >
        <NewCompany />
      </BoxBackground>
    );
  }

  console.log('🏢 AddCompany: Rendering StandardizedCompanyForm');
  return (
    <StandardizedCompanyForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
}

export default AddCompany;
