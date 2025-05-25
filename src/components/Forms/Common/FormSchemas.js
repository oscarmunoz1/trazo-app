import { object, string } from 'zod';

// Shared form validation schemas for event forms
export const formSchemaBasic = object({
  date: string().min(1, 'Date is required')
});

export const formSchemaMainInfo = object({
  type: string().min(1, 'Event type is required')
});

export const formSchemaDescription = object({
  description: string().min(1, 'Description is required')
});

export const formSchemaMedia = object({});

// Additional schemas for other forms can be added here
export const companyFormSchema = object({
  name: string().min(1, 'Company name is required'),
  email: string().email('Invalid email address'),
  description: string().optional()
});

export const parcelFormSchema = object({
  name: string().min(1, 'Parcel name is required'),
  area: string().min(1, 'Area is required'),
  location: string().optional()
});
