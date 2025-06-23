import { baseApi } from './baseApi';

export interface HistoryScan {
  id: string;
  user: string | null;
  date: string;
  comment: string | null;
}

export interface HistoryParcel {
  id: string;
  name: string;
  establishment: {
    id: string;
    name: string;
    location: string;
    description: string;
  };
  map_metadata: {
    center: {
      lat: number;
      lng: number;
    };
    zoom: number;
  };
  polygon: Array<{
    lat: number;
    lng: number;
  }>;
}

export interface HistoryProducer {
  id: string;
  name: string;
  photo_url: string;
  description: string;
  location: string;
}

export interface PublicHistory {
  id: string;
  name: string;
  start_date: string;
  finish_date: string;
  product: {
    id: string;
    name: string;
  };
  parcel: HistoryParcel;
  company: string;
  producer: HistoryProducer;
  reputation: number;
  certificate_percentage: number;
  history_scan: string;
  qr_code?: string;
  similar_histories: Array<{
    id: string;
    product: {
      id: string;
      name: string;
    };
    image: string;
    reputation: number;
  }>;
  images: string[];
  events: Array<{
    id: number;
    image: string | null;
    type: string;
    event_type: number;
    description: string;
    date: string;
    index: number;
    commercial_name: string;
    volume: string;
    concentration: string;
    area: string;
    way_of_application: string;
    time_period: string;
    observation: string;
    album: any;
    history: number;
    created_by: number;
  }>;
  timeline: Array<{
    id: string;
    date: string;
    title: string;
    description: string;
    type: string;
    carbonImpact?: number;
    location?: string;
    person?: {
      name: string;
      role: string;
      avatar: string;
    };
    photos?: string[];
  }>;
}

export interface CommentHistoryRequest {
  comment: string;
  scanId: string;
}

export interface CommentHistoryResponse {
  id: string;
  comment: string;
  scan: string;
  created_at: string;
}

export interface DeleteEventRequest {
  companyId: string;
  establishmentId: string;
  eventId: string;
  eventType: string | number;
}

export const historyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicHistory: builder.query<PublicHistory, string>({
      query: (historyId) => ({
        url: `histories/${historyId}/public_history/`,
        method: 'GET'
      }),
      providesTags: (result, error, historyId) =>
        result ? [{ type: 'History', id: historyId }] : []
    }),

    commentHistory: builder.mutation<CommentHistoryResponse, CommentHistoryRequest>({
      query: ({ comment, scanId }) => ({
        url: `public_scans/${scanId}/comment/`,
        method: 'POST',
        body: { comment }
      }),
      invalidatesTags: ['History']
    }),

    deleteEvent: builder.mutation<void, DeleteEventRequest>({
      query: ({ companyId, establishmentId, eventId, eventType }) => ({
        url: `companies/${companyId}/establishments/${establishmentId}/events/${eventId}/?event_type=${eventType}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: (result, error, { eventId }) =>
        result ? [{ type: 'Event', id: eventId }, 'History'] : []
    })
  })
});

export const { useGetPublicHistoryQuery, useCommentHistoryMutation, useDeleteEventMutation } =
  historyApi;
