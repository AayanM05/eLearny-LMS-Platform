import { ApiClient } from '@elearny/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = new ApiClient(API_BASE_URL, () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('elearny_access_token');
  }
  return null;
});
