declare module 'store/api/historyApi' {
  // Public history query
  export interface PublicHistory {
    id: string;
    name: string;
    start_date: string;
    finish_date: string;
    product: {
      id: string;
      name: string;
      description: string;
    };
    parcel: {
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
    };
    company: string;
    producer: {
      id: string;
      name: string;
      photo_url: string;
      description: string;
      location: string;
    };
    reputation: number;
    history_scan: string;
    images: string[];
    similar_histories: Array<{
      id: string;
      product: {
        id: string;
        name: string;
      };
      image: string;
      reputation: number;
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

  export interface HistoryComment {
    id: string;
    text: string;
    user: string | null;
    date: string;
  }

  // Comment history mutation
  export interface CommentRequest {
    comment: string;
    scanId: string;
  }

  export interface CommentResponse {
    id: string;
    comment: string;
    scan: string;
    created_at: string;
  }

  // Function interfaces
  export function useGetPublicHistoryQuery(productionId: string): {
    data?: PublicHistory;
    isLoading: boolean;
    isError: boolean;
    error?: any;
  };

  export function useCommentHistoryMutation(): [
    (comment: { production_id: string; comment: string }) => Promise<any>,
    {
      isLoading: boolean;
      isError: boolean;
      error?: any;
      isSuccess: boolean;
      data?: any;
    }
  ];
}
