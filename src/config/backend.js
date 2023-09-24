const ROOT_URL = "";

// Authentication and User Information URLs
export const LOGIN_URL = `${ROOT_URL}/auth/login/`;
export const SIGNUP_URL = `${ROOT_URL}/auth/register/`;
export const LOGOUT_URL = `${ROOT_URL}/auth/logout/`;
export const VERIFY_EMAIL_URL = `${ROOT_URL}/user/verifyemail/`;
export const PASSWORD_CHANGE_URL = `${ROOT_URL}/auth/password/change/`;
export const USER_DATA_URL = `${ROOT_URL}/user/me/`;
export const COMPANY_URL = (id) =>
  id ? `${ROOT_URL}/companies/${id}/` : `${ROOT_URL}/companies/`;
export const ESTABLISHMENT_URL = (id) =>
  id ? `${ROOT_URL}/establishments/${id}/` : `${ROOT_URL}/establishments/`;
export const PARCEL_URL = (id) =>
  id ? `${ROOT_URL}/parcels/${id}/` : `${ROOT_URL}/parcels/`;
export const ESTABLISHMENT_PRODUCTS_URL = (establishmentId) =>
  `${ROOT_URL}/establishments/${establishmentId}/products/`;
export const ESTABLISHMENT_HISTORIES_URL = (establishmentId) =>
  `${ROOT_URL}/establishments/${establishmentId}/histories/`;
export const ESTABLISHMENT_CHART_SCANS_VS_SALES_INFO_URL = (establishmentId) =>
  `${ROOT_URL}/establishments/${establishmentId}/get_charts_data/`;
export const SCANS_BY_ESTABLISHMENT_URL = (establishmentId) =>
  `${ROOT_URL}/scans/list_scans_by_establishment/?establishment=${establishmentId}`;
export const PRODUCT_URL = `${ROOT_URL}/products/`;

export const LAST_REVIEWS_URL = (establishmentId) =>
  `${ROOT_URL}/establishments/${establishmentId}/last_reviews/`;
export const PRODUCT_REPUTATION_URL = (establishmentId) =>
  `${ROOT_URL}/establishments/${establishmentId}/products_reputation/`;
export const PRODUCT_REPUTATION_PERCENTAGE_URL = (establishmentId) =>
  `${ROOT_URL}/establishments/${establishmentId}/rating_reviews_percentage/`;
export const REVIEW_URL = (reviewId) =>
  reviewId ? `${ROOT_URL}/reviews/${reviewId}/` : `${ROOT_URL}/reviews/`;
export const HISTORY_URL = (historyId) =>
  historyId ? `${ROOT_URL}/histories/${historyId}/` : `${ROOT_URL}/histories/`;
export const PARCEL_HISTORY_URL = (parcelId) =>
  `${ROOT_URL}/parcels/${parcelId}/history/`;
export const CURRENT_HISTORY = (parcelId) =>
  `${ROOT_URL}/parcels/${parcelId}/current_history/`;
export const FINISH_HISTORY = (parcelId) =>
  `${ROOT_URL}/parcels/${parcelId}/finish_history/`;
export const EVENT_URL = (eventId) =>
  eventId ? `${ROOT_URL}/events/${eventId}/` : `${ROOT_URL}/events/`;
export const PRODUCTION_URL = (productionId) =>
  productionId
    ? `${ROOT_URL}/histories/${productionId}/`
    : `${ROOT_URL}/histories/`;
export const PUBLIC_HISTORY_URL = (historyId) =>
  `${ROOT_URL}/histories/${historyId}/public_history/`;
export const COMMENT_HISTORY_URL = (scanId) =>
  `${ROOT_URL}/scans/${scanId}/comment/`;
