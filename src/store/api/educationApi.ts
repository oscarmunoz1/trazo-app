import baseApi from './baseApi';

// Education API Types
export interface EducationCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  is_active: boolean;
  subscription_level: 'basic' | 'standard' | 'corporate';
  created_at: string;
  updated_at: string;
}

export interface EducationCourse {
  id: number;
  title: string;
  description: string;
  category: EducationCategory;
  level: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration_minutes: number;
  is_active: boolean;
  subscription_level: 'basic' | 'standard' | 'corporate';
  prerequisites: string[];
  learning_objectives: string[];
  created_at: string;
  updated_at: string;
  lessons_count: number;
  user_progress?: UserEducationProgress;
}

export interface EducationLesson {
  id: number;
  course: number;
  title: string;
  content: string;
  content_type: 'text' | 'video' | 'interactive' | 'quiz';
  order: number;
  estimated_duration_minutes: number;
  video_url?: string;
  quiz_data?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_progress?: UserEducationProgress;
}

export interface UserEducationProgress {
  id: number;
  user: number;
  course?: number;
  lesson?: number;
  progress_percentage: number;
  time_spent_minutes: number;
  is_completed: boolean;
  quiz_score?: number;
  last_accessed: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EducationCertificate {
  id: number;
  user: number;
  course: EducationCourse;
  issued_at: string;
  certificate_id: string;
  certificate_url: string;
  is_valid: boolean;
  created_at: string;
}

export interface EducationBookmark {
  id: number;
  user: number;
  course?: EducationCourse;
  lesson?: EducationLesson;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface FarmerQuestionAnswer {
  id: number;
  question: string;
  answer: string;
  category: EducationCategory;
  is_featured: boolean;
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface EducationDashboard {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_certificates: number;
  total_time_spent_minutes: number;
  current_streak_days: number;
  recent_courses: EducationCourse[];
  recommended_courses: EducationCourse[];
  certificates: EducationCertificate[];
}

// Education API endpoints
export const educationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Categories
    getEducationCategories: builder.query<EducationCategory[], void>({
      query: () => ({
        url: 'education/categories/',
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Education']
    }),

    // Courses
    getEducationCourses: builder.query<EducationCourse[], { category_id?: number; level?: string }>(
      {
        query: (params) => ({
          url: 'education/courses/',
          method: 'GET',
          params,
          credentials: 'include'
        }),
        providesTags: ['Education']
      }
    ),

    getEducationCourse: builder.query<EducationCourse, number>({
      query: (courseId) => ({
        url: `education/courses/${courseId}/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Education']
    }),

    // Lessons
    getCourseLessons: builder.query<EducationLesson[], number>({
      query: (courseId) => ({
        url: `education/courses/${courseId}/lessons/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Education']
    }),

    getEducationLesson: builder.query<EducationLesson, number>({
      query: (lessonId) => ({
        url: `education/lessons/${lessonId}/`,
        method: 'GET',
        credentials: 'include'
      }),
      providesTags: ['Education']
    }),

    // Note: These endpoints don't exist in the current backend
    // Keeping them as placeholders for future implementation
    // For now, they'll return mock data or handle gracefully

    // FAQ (maps to /faqs/ endpoint in backend)
    getFarmerQuestions: builder.query<
      FarmerQuestionAnswer[],
      {
        category_id?: number;
        search?: string;
        featured?: boolean;
      }
    >({
      query: (params) => ({
        url: 'education/faqs/',
        method: 'GET',
        params,
        credentials: 'include'
      }),
      providesTags: ['Education']
    }),

    getFarmerQuestion: builder.query<FarmerQuestionAnswer, number>({
      query: (questionId) => ({
        url: `education/faqs/${questionId}/`,
        method: 'GET',
        credentials: 'include'
      }),
      invalidatesTags: ['Education']
    })

    // Note: Search and Analytics endpoints don't exist in backend yet
  }),
  overrideExisting: false
});

// Export hooks (only for endpoints that actually exist)
export const {
  useGetEducationCategoriesQuery,
  useGetEducationCoursesQuery,
  useGetEducationCourseQuery,
  useGetCourseLessonsQuery,
  useGetEducationLessonQuery,
  useGetFarmerQuestionsQuery,
  useGetFarmerQuestionQuery
} = educationApi;
