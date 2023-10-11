const ROOT_URL = "";

// Authentication and User Information URLs
export const LOGIN_URL = `${ROOT_URL}/auth/login/`;
export const SIGNUP_URL = `${ROOT_URL}/auth/register/`;
export const LOGOUT_URL = `${ROOT_URL}/auth/logout/`;
export const VERIFY_EMAIL_URL = `${ROOT_URL}/user/verify_email/`;
export const PASSWORD_CHANGE_URL = `${ROOT_URL}/auth/password/change/`;
export const USER_DATA_URL = `${ROOT_URL}/user/me/`;

// Company and Establishment URLs
export const COMPANY_URL = (companyId) =>
  companyId ? `${ROOT_URL}/companies/${companyId}/` : `${ROOT_URL}/companies/`;
export const ESTABLISHMENT_URL = (companyId, establishmentId) =>
  establishmentId
    ? `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/`
    : `${ROOT_URL}/companies/${companyId}/establishments/`;
export const PARCEL_URL = (companyId, establishmentId, parcelId = null) =>
  parcelId
    ? `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/`
    : `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/`;
export const ESTABLISHMENT_PRODUCTS_URL = (companyId, establishmentId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/products/`;
export const ESTABLISHMENT_HISTORIES_URL = (companyId, establishmentId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/histories/`;
export const ESTABLISHMENT_CHART_SCANS_VS_SALES_INFO_URL = (
  companyId,
  establishmentId
) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/get_charts_data/`;
export const SCANS_BY_ESTABLISHMENT_URL = (companyId, establishmentId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/scans/list_scans_by_establishment/`;
export const PRODUCT_URL = `${ROOT_URL}/products/`;

// Review and History URLs
export const LAST_REVIEWS_URL = (companyId, establishmentId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/last_reviews/`;
export const PRODUCT_REPUTATION_URL = (companyId, establishmentId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/products_reputation/`;
export const PRODUCT_REPUTATION_PERCENTAGE_URL = (companyId, establishmentId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/rating_reviews_percentage/`;
export const REVIEW_URL = (reviewId) =>
  reviewId ? `${ROOT_URL}/reviews/${reviewId}/` : `${ROOT_URL}/reviews/`;
export const HISTORY_URL = (historyId) =>
  historyId ? `${ROOT_URL}/histories/${historyId}/` : `${ROOT_URL}/histories/`;
export const PARCEL_HISTORY_URL = (companyId, establishmentId, parcelId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/history/`;
export const CURRENT_HISTORY = (companyId, establishmentId, parcelId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/current_history/`;
export const FINISH_HISTORY = (companyId, establishmentId, parcelId) =>
  `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/finish_history/`;
export const EVENT_URL = (companyId, establishmentId, parcelId, eventId) =>
  eventId
    ? `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/events/${eventId}/`
    : `${ROOT_URL}/companies/${companyId}/establishments/${establishmentId}/parcels/${parcelId}/events/`;
export const PRODUCTION_URL = (productionId) =>
  productionId
    ? `${ROOT_URL}/histories/${productionId}/`
    : `${ROOT_URL}/histories/`;
export const PUBLIC_HISTORY_URL = (historyId) =>
  `${ROOT_URL}/histories/${historyId}/public_history/`;
export const COMMENT_HISTORY_URL = (scanId) =>
  `${ROOT_URL}/scans/${scanId}/comment/`;
