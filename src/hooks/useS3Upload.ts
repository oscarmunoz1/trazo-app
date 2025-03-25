import { useCallback, useState } from 'react';
import { useGetPresignedUrlsMutation } from 'store/api/uploadApi';

type UploadFile = {
  file: File;
  presignedUrl: string;
  fields: Record<string, string>;
};

export const useS3Upload = () => {
  const [getPresignedUrls] = useGetPresignedUrlsMutation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFiles = useCallback(
    async (files: File[], entityType: string, entityId?: string) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        // Get presigned URLs from backend
        const presignedResponse = await getPresignedUrls({
          files: files.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size
          })),
          entityType,
          entityId
        }).unwrap();

        // Upload files to S3 in parallel
        const uploadPromises = files.map(async (file, index) => {
          const { url, fields } = presignedResponse[index];
          const formData = new FormData();

          Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value);
          });
          formData.append('file', file);

          const response = await fetch(url, {
            method: 'POST',
            body: formData
          });

          if (!response.ok) throw new Error('Upload failed');
          return `${url}/${fields.key}`;
        });

        const urls = await Promise.all(uploadPromises);
        setIsUploading(false);
        return urls;
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : 'File upload failed');
        setIsUploading(false);
        throw error;
      }
    },
    [getPresignedUrls]
  );

  return { uploadFiles, isUploading, uploadError };
};
