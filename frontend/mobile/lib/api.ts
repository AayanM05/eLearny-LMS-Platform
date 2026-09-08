import { ApiClient } from '@elearny/api-client';
import { getSecureItem } from './storage';

let cachedToken: string | null = null;

// Synchronously return last known token; updated asynchronously on boot/auth state change
export const api = new ApiClient('http://10.0.2.2:8080/api/v1', () => cachedToken);

export function updateApiToken(token: string | null) {
  cachedToken = token;
}
