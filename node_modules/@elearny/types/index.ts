export type Role = 'STUDENT' | 'INSTRUCTOR' | 'TEACHING_ASSISTANT' | 'ADMIN';

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';

export type ContentType = 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT';

export type PaymentStatus = 'CREATED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';

export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  approved: boolean;
  active: boolean;
  totpEnabled: boolean;
  canCreatePlatformCoupons?: boolean;
}

export interface UserSummary {
  id: number;
  name: string;
  email: string;
  role: Role;
  approved: boolean;
  totpEnabled: boolean;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  totpRequired?: boolean;
  user?: UserSummary;
}

export interface LoginRequest {
  email: string;
  password?: string;
  totpCode?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
  role?: Role;
}

export interface Category {
  id: number;
  name: string;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  level: CourseLevel;
  price: number;
  active: boolean;
  published: boolean;
  instructor: UserSummary;
  category?: Category;
  prerequisiteCourse?: Course;
  isCohortBased?: boolean;
  seatLimit?: number;
}

export interface Section {
  id: number;
  title: string;
  order: number;
  subsections?: Subsection[];
}

export interface Subsection {
  id: number;
  title: string;
  contentType: ContentType;
  contentUrl?: string;
  textContent?: string;
  order: number;
}

export interface Enrollment {
  id: number;
  user: UserSummary;
  course: Course;
  enrolledDate: string;
  revoked: boolean;
}

export interface Progress {
  id: number;
  user: UserSummary;
  subsection: Subsection;
  completedAt: string;
}

export interface Quiz {
  id: number;
  passThresholdPercent: number;
  allowMultipleAttempts: boolean;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
}

export interface QuizAttemptResponse {
  scorePercent: number;
  passed: boolean;
}

export interface Payment {
  id: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  status: PaymentStatus;
  user: UserSummary;
  course: Course;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiryDate?: string;
  validNow: boolean;
}

export interface Certificate {
  id: number;
  certificateNumber: string;
  studentName: string;
  courseTitle: string;
  issuedAt: string;
}

export interface Review {
  id: number;
  studentName: string;
  rating: number;
  comment?: string;
}

export interface ForumThread {
  id: number;
  studentName: string;
  questionText: string;
  upvotes: number;
  repliesCount: number;
  createdAt: string;
}

export interface ForumReply {
  id: number;
  authorName: string;
  authorRole: Role;
  replyText: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
