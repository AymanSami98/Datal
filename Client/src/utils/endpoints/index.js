const BASE_URL = process.env.REACT_APP_BASE_URL;

export const UPLOAD_JSON = `${BASE_URL}/api/v1/upload-json`;
export const UPLOAD_CSV = `${BASE_URL}/api/v1/upload-csv`;
export const UPDATE_ALL_CONTENTS = `${BASE_URL}/api/v1/update-all-contents`;
export const LOGIN_URL = `${BASE_URL}/api/v1/auth/login`;
export const SIGNUP_URL = `${BASE_URL}/api/v1/auth/signup`;
export const GET_ALL_DATA = `${BASE_URL}/api/v1/get-all-data`;
export const GET_MATCHED_CONTENT_AND_CONTENT_REPORTS = `${BASE_URL}/api/v1/get-matched-content-and-content-reports`;
export const GET_ALL_REPORTS = `${BASE_URL}/api/v1/get-all-reports`;
export const GET_ALL_DAILY_DURATIONS = `${BASE_URL}/api/v1/get-all-daily-durations`;
export const GET_MATCHED_USERS_AND_CUSTOMERS_REPORTS = `${BASE_URL}/api/v1/get-matched-users-and-customers-reports`;
export const getCustomerDataUrl = (userId) => `${BASE_URL}/api/v1/get-customer-data/${userId}`;
export const GET_ALL_CUSTOMERS = `${BASE_URL}/api/v1/get-all-customers`;