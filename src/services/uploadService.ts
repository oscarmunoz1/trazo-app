import { useGetPresignedUrlMutation, useLocalUploadMutation } from '../store/api/fileApi';

/**
 * Custom hook for file uploads that works in both development and production
 */
export const useFileUpload = () => {
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [localUpload] = useLocalUploadMutation();

  /**
   * Upload a single file and return the URL
   */
  const uploadFile = async (file: File): Promise<string> => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (isDevelopment) {
      // In development, upload directly to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await localUpload(formData).unwrap();
      return response.file_url;
    } else {
      // In production, use S3 with presigned URL
      const { presigned_url, file_url } = await getPresignedUrl({
        filename: file.name,
        fileType: file.type,
        folder: 'establishments'
      }).unwrap();

      // Upload to S3 with fetch API (since we're not using axios)
      await fetch(presigned_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      return file_url;
    }
  };

  /**
   * Upload multiple files and return array of URLs
   */
  const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map((file) => uploadFile(file));
    return Promise.all(uploadPromises);
  };

  return { uploadFile, uploadMultipleFiles };
};
