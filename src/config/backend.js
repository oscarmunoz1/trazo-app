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
export const PARCEL_URL = (id) => `${ROOT_URL}/parcels/${id}/`;

export const HISTORY_URL = (parcelId) =>
  `${ROOT_URL}/parcels/${parcelId}/history/`;
export const CURRENT_HISTORY = (parcelId) =>
  `${ROOT_URL}/parcels/${parcelId}/current_history/`;
export const EVENT_URL = (eventId) =>
  eventId ? `${ROOT_URL}/events/${eventId}/` : `${ROOT_URL}/events/`;
