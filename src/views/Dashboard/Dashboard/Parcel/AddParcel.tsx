import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { StandardParcelForm } from '../../../../components/Forms/StandardParcelForm';
import {
  useCreateParcelMutation,
  useUpdateParcelMutation,
  useGetParcelQuery
} from 'store/api/productApi';
import { useToast } from '@chakra-ui/react';

interface AddParcelProps {
  isEdit?: boolean;
}

interface RootState {
  company: {
    currentCompany: {
      id: string;
      name: string;
    };
    currentEstablishment: {
      id: string;
      name: string;
    };
  };
}

function AddParcel({ isEdit = false }: AddParcelProps) {
  const intl = useIntl();
  const navigate = useNavigate();
  const toast = useToast();
  const { establishmentId, parcelId } = useParams();
  const currentCompany = useSelector((state: RootState) => state.company.currentCompany);
  const currentEstablishment = useSelector(
    (state: RootState) => state.company.currentEstablishment
  );

  const [createParcel, { isLoading: isCreating }] = useCreateParcelMutation();
  const [updateParcel, { isLoading: isUpdating }] = useUpdateParcelMutation();

  // Fetch parcel data for edit mode
  const {
    data: parcelData,
    isLoading: isLoadingParcel,
    error: parcelError
  } = useGetParcelQuery(
    {
      companyId: currentCompany?.id,
      establishmentId,
      parcelId
    },
    {
      skip: !isEdit || !parcelId || !establishmentId || !currentCompany?.id
    }
  );

  // Helper function to get initial data for edit mode
  const getInitialData = () => {
    if (!isEdit || !parcelData) return {};

    return {
      name: parcelData.name || '',
      area: parcelData.area || 0,
      description: parcelData.description || '',
      contact_phone: parcelData.contact_phone || '',
      address: parcelData.address || '',
      certified: parcelData.certified || false,
      crop_type: parcelData.crop_type || '',
      soil_type: parcelData.soil_type || '',
      unique_code: parcelData.unique_code || '',
      certification_type: parcelData.certification_type || '',
      contact_person: parcelData.contact_person || '',
      contact_email: parcelData.contact_email || '',
      polygon: parcelData.polygon || [],
      map_metadata: parcelData.map_metadata || {
        center: { lat: 40.7128, lng: -74.006 },
        zoom: 13
      }
    };
  };

  const handleSubmit = async (data: any) => {
    try {
      console.log('🎯 Parent handleSubmit received data:', data);
      console.log('🎯 Data keys:', Object.keys(data));
      console.log('🎯 Individual field values:', {
        name: data.name,
        description: data.description,
        crop_type: data.crop_type,
        soil_type: data.soil_type,
        unique_code: data.unique_code,
        certification_type: data.certification_type,
        address: data.address,
        contact_person: data.contact_person,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone
      });

      // Map the form data to match backend field names
      const parcelData = {
        name: data.name,
        area: Number(data.area),
        description: data.description,
        contact_phone: data.contact_phone || '',
        address: data.address || '',
        certified: data.certified || false,
        crop_type: data.crop_type || '',
        soil_type: data.soil_type || '',
        unique_code: data.unique_code || '',
        certification_type: data.certification_type || '',
        contact_person: data.contact_person || '',
        contact_email: data.contact_email || '',
        polygon: data.polygon || [],
        map_metadata: data.map_metadata || {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 13
        },
        establishment: parseInt(establishmentId!)
      };

      console.log('🚀 Prepared parcelData:', parcelData);

      // Handle image upload data from the enhanced form
      const imageData: any = {};
      if (data.uploaded_image_urls?.length > 0) {
        imageData.uploaded_image_urls = data.uploaded_image_urls;
      }
      if (data.images_to_delete?.length > 0) {
        imageData.images_to_delete = data.images_to_delete;
      }
      if (data.new_images?.length > 0) {
        imageData.new_images = data.new_images;
      }

      const finalData = { ...parcelData, ...imageData };

      console.log('🎪 Final data to API:', finalData);
      console.log('🎪 Final data keys:', Object.keys(finalData));

      if (isEdit && parcelId) {
        // Update existing parcel
        await updateParcel({
          companyId: currentCompany?.id,
          establishmentId,
          parcelId,
          parcelData: finalData
        }).unwrap();

        toast({
          title: 'Parcel Updated',
          description: 'The parcel has been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      } else {
        // Create new parcel
        await createParcel({
          companyId: currentCompany?.id,
          establishmentId,
          parcelData: finalData
        }).unwrap();

        toast({
          title: 'Parcel Created',
          description: 'The parcel has been successfully created.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right'
        });
      }

      navigate(`/admin/dashboard/establishment/${establishmentId}`);
    } catch (error: any) {
      console.error('Failed to save parcel:', error);

      toast({
        title: isEdit ? 'Update Failed' : 'Creation Failed',
        description:
          error?.data?.detail || 'An error occurred while saving the parcel. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  const handleCancel = () => {
    navigate(`/admin/dashboard/establishment/${establishmentId}`);
  };

  // Show loading state while fetching parcel data in edit mode
  if (isEdit && isLoadingParcel) {
    return (
      <StandardParcelForm
        onSubmit={() => {}}
        onCancel={handleCancel}
        isLoading={true}
        isEdit={true}
        establishmentName={currentEstablishment?.name || ''}
      />
    );
  }

  // Show error if failed to fetch parcel data
  if (isEdit && parcelError) {
    toast({
      title: 'Error Loading Parcel',
      description: 'Failed to load parcel data. Please try again.',
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right'
    });
    navigate(`/admin/dashboard/establishment/${establishmentId}`);
    return null;
  }

  return (
    <StandardParcelForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      initialData={getInitialData()}
      isLoading={isCreating || isUpdating}
      isEdit={isEdit}
      establishmentName={currentEstablishment?.name || ''}
    />
  );
}

export default AddParcel;
