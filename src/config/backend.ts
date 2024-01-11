const ROOT_URL = '';

// Authentication and User Information URLs
export const LOGIN_URL = `${ROOT_URL}/auth/login/`;
export const SIGNUP_URL = `${ROOT_URL}/auth/register/`;
export const LOGOUT_URL = `${ROOT_URL}/auth/logout/`;
export const VERIFY_EMAIL_URL = `${ROOT_URL}/user/verify_email/`;
export const PASSWORD_CHANGE_URL = `${ROOT_URL}/auth/password/change/`;
export const USER_DATA_URL = `${ROOT_URL}/user/me/`;

// Company and Establishment URLs
export const COMPANY_URL = (companyId?: string | undefined) =>
  companyId ? `${ROOT_URL}/companies/${companyId}/` : `${ROOT_URL}/companies/`;
export const ESTABLISHMENT_URL = (companyId: string, establishmentId?: string) =>
  establishmentId
    ? `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/`
    : `${ROOT_URL}/companies/${companyId}/establishments/`;
export const PARCEL_URL = (
  companyId: string,
  establishmentId: string,
  parcelId: string | null = null
) =>
  parcelId
    ? `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/`
    : `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/`;
export const PARCEL_UPDATE_URL = (companyId: string, establishmentId: string, parcelId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/update_parcel/`;
export const ESTABLISHMENT_PRODUCTS_URL = (companyId: string, establishmentId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/products/`;
export const ESTABLISHMENT_HISTORIES_URL = (companyId: string, establishmentId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/histories/`;
export const ESTABLISHMENT_CHART_SCANS_VS_SALES_INFO_URL = (
  companyId: string,
  establishmentId: string
) => `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/get_charts_data/`;
export const SCANS_BY_ESTABLISHMENT_URL = (companyId: string, establishmentId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/scans/list_scans_by_establishment/`;
export const PRODUCT_URL = `${ROOT_URL}/products/`;

// Review and History URLs
export const LAST_REVIEWS_URL = (companyId: string, establishmentId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/last_reviews/`;
export const PRODUCT_REPUTATION_URL = (companyId: string, establishmentId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/products_reputation/`;
export const PRODUCT_REPUTATION_PERCENTAGE_URL = (companyId: string, establishmentId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/rating_reviews_percentage/`;
export const REVIEW_URL = (reviewId: string) =>
  reviewId ? `${ROOT_URL}/reviews/${reviewId}/` : `${ROOT_URL}/reviews/`;
export const HISTORY_URL = (historyId: string) =>
  historyId ? `${ROOT_URL}/histories/${historyId}/` : `${ROOT_URL}/histories/`;
export const PARCEL_HISTORY_URL = (companyId: string, establishmentId: string, parcelId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/history/`;
export const CURRENT_HISTORY = (companyId: string, establishmentId: string, parcelId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/current_history/`;
export const FINISH_HISTORY = (companyId: string, establishmentId: string, parcelId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/finish_history/`;
export const EVENT_URL = (
  companyId: string,
  establishmentId: string,
  eventId: string,
  eventType: string
) =>
  eventId && eventType
    ? `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/events/${eventId}/?event_type=${eventType}`
    : eventId
    ? `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/events/${eventId}`
    : `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/events/`;

export const EVENT_CREATE_URL = (companyId: string, establishmentId: string) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/events/`;
export const PRODUCTION_URL = (productionId: string) =>
  productionId ? `${ROOT_URL}/histories/${productionId}/` : `${ROOT_URL}/histories/`;
export const PUBLIC_HISTORY_URL = (historyId: string) =>
  `${ROOT_URL}/histories/${historyId}/public_history/`;
export const COMMENT_HISTORY_URL = (scanId: string) =>
  `${ROOT_URL}/public_scans/${scanId}/comment/`;
