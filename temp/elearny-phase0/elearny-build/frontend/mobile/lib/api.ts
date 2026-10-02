import { Platform } from "react-native";
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from "@/lib/auth";

function resolveDefaultApiUrl(): string {
  if (Platform.OS === "android") return "http://10.0.2.2:8080";
  return "http://localhost:8080";
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? resolveDefaultApiUrl();

export type ApiFieldError = { field: string; message: string };

export type ApiError = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors: ApiFieldError[] | null;
};

export class ApiRequestError extends Error {
  constructor(public status: number, public apiError: ApiError | null) {
    super(apiError?.message ?? "Request failed");
  }

  fieldError(field: string): string | undefined {
    return this.apiError?.fieldErrors?.find((fe) => fe.field === field)?.message;
  }
}

async function rawRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let apiError: ApiError | null = null;
    try {
      apiError = await res.json();
    } catch {
      // backend unreachable or returned non-JSON
    }
    throw new ApiRequestError(res.status, apiError);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Same auto-refresh-on-401 pattern as web's api.ts — see that file's comment. */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await rawRequest<T>(path, init);
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 401 && (await getRefreshToken())) {
      try {
        const refreshToken = await getRefreshToken();
        const refreshed = await rawRequest<RefreshResponse>("/api/v1/auth/refresh", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
        await setAccessToken(refreshed.accessToken);
        return await rawRequest<T>(path, init);
      } catch {
        await clearTokens();
        throw err;
      }
    }
    throw err;
  }
}

export type UsernameAvailabilityResponse = { username: string; available: boolean };

export function checkUsernameAvailability(username: string): Promise<UsernameAvailabilityResponse> {
  return request(`/api/v1/auth/check-username?username=${encodeURIComponent(username)}`);
}

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  termsAccepted: boolean;
};

export type RegisterResponse = { id: string; firstName: string; username: string; email: string; role: string };

export function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  return request("/api/v1/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export type MessageResponse = { message: string };

export function verifyEmail(email: string, otp: string): Promise<MessageResponse> {
  return request("/api/v1/auth/verify-email", { method: "POST", body: JSON.stringify({ email, otp }) });
}

export function resendOtp(email: string): Promise<MessageResponse> {
  return request("/api/v1/auth/resend-otp", { method: "POST", body: JSON.stringify({ email }) });
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  user: RegisterResponse;
};

export type RefreshResponse = { accessToken: string; tokenType: string; expiresInSeconds: number };

export function login(usernameOrEmail: string, password: string): Promise<LoginResponse> {
  return request("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ usernameOrEmail, password }) });
}

export type ApplyInstructorPayload = {
  bio: string;
  yearsExperience: number;
  expertiseTags: string;
  portfolioUrl?: string;
  resumeUrl?: string;
};

export type InstructorApplicationResponse = {
  id: string;
  applicantFirstName: string;
  applicantLastName: string;
  applicantEmail: string;
  bio: string;
  yearsExperience: number;
  expertiseTags: string;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  status: string;
  createdAt: string;
};

export function applyToBeInstructor(payload: ApplyInstructorPayload): Promise<InstructorApplicationResponse> {
  return request("/api/v1/instructor-applications", { method: "POST", body: JSON.stringify(payload) });
}

export function listPendingApplications(): Promise<InstructorApplicationResponse[]> {
  return request("/api/v1/admin/instructor-applications");
}

export function approveApplication(id: string): Promise<MessageResponse> {
  return request(`/api/v1/admin/instructor-applications/${id}/approve`, { method: "POST" });
}

export function rejectApplication(id: string, reason: string): Promise<MessageResponse> {
  return request(`/api/v1/admin/instructor-applications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function setupInstructorAccount(payload: {
  token: string;
  otp: string;
  username: string;
  password: string;
}): Promise<MessageResponse> {
  return request("/api/v1/instructor/setup-account", { method: "POST", body: JSON.stringify(payload) });
}

export type SaveCoursePayload = {
  title: string;
  tagline?: string;
  category?: string;
  difficultyLevel?: string;
  priceCents: number;
  thumbnailUrl?: string;
  promoVideoUrl?: string;
};

export type CourseResponse = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  category: string | null;
  difficultyLevel: string | null;
  priceCents: number;
  thumbnailUrl: string | null;
  promoVideoUrl: string | null;
  status: string;
  version: number;
};

export type LessonResponse = {
  id: string;
  title: string;
  contentType: string;
  videoUrl: string | null;
  articleContent: string | null;
  resourceUrl: string | null;
  position: number;
  dripDelayDays: number;
};

export type SectionResponse = { id: string; title: string; position: number; lessons: LessonResponse[] };
export type CourseDetailResponse = CourseResponse & { sections: SectionResponse[] };

export function createCourse(payload: SaveCoursePayload): Promise<CourseResponse> {
  return request("/api/v1/instructor/courses", { method: "POST", body: JSON.stringify(payload) });
}

export function listMyCourses(): Promise<CourseResponse[]> {
  return request("/api/v1/instructor/courses");
}

export function getCourseDetail(courseId: string): Promise<CourseDetailResponse> {
  return request(`/api/v1/instructor/courses/${courseId}`);
}

export function publishCourse(courseId: string): Promise<CourseResponse> {
  return request(`/api/v1/instructor/courses/${courseId}/publish`, { method: "POST" });
}

export function addSection(courseId: string, title: string, position: number): Promise<SectionResponse> {
  return request(`/api/v1/instructor/courses/${courseId}/sections`, {
    method: "POST",
    body: JSON.stringify({ title, position }),
  });
}

export type AddLessonPayload = {
  title: string;
  contentType: string;
  videoUrl?: string;
  articleContent?: string;
  resourceUrl?: string;
  position: number;
  dripDelayDays: number;
};

export function addLesson(courseId: string, sectionId: string, payload: AddLessonPayload): Promise<LessonResponse> {
  return request(`/api/v1/instructor/courses/${courseId}/sections/${sectionId}/lessons`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
