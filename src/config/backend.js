const ROOT_URL = "";

// Authentication and User Information URLs
export const LOGIN_URL = `${ROOT_URL}/auth/login/`;
export const LOGOUT_URL = `${ROOT_URL}/auth/logout/`;
export const PASSWORD_CHANGE_URL = `${ROOT_URL}/auth/password/change/`;
export const USER_DATA_URL = `${ROOT_URL}/user/me/`;
export const COMPANY_URL = (id) => `${ROOT_URL}/companies/${id}/`;
export const PARCEL_URL = (id) => `${ROOT_URL}/parcels/${id}/`;
