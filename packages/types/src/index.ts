// Shared TypeScript types (mirrors backend DTOs)

export type Role = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  details?: { field: string; issue: string }[];
  path: string;
}
