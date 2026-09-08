import { ApiClient } from '@elearny/api-client';
import { getSecureItem } from './storage';

let cachedToken: string | null = null;

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://elearny-lms-platform.onrender.com/api/v1';

// Synchronously return last known token; updated asynchronously on boot/auth state change
export const api = new ApiClient(API_BASE_URL, () => cachedToken);

export function updateApiToken(token: string | null) {
  cachedToken = token;
}

