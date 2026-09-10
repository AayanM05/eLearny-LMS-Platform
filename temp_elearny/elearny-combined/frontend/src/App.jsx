import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/course/BrowsePage";
import CourseDetailPage from "./pages/course/CourseDetailPage";
import CoursePlayerPage from "./pages/course/CoursePlayerPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import StudentDashboard from "./pages/student/StudentDashboard";
import WishlistPage from "./pages/student/WishlistPage";
import CertificatesPage from "./pages/student/CertificatesPage";

import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import CourseBuilderPage from "./pages/instructor/CourseBuilderPage";
import TaManagementPage from "./pages/instructor/TaManagementPage";
import LiveSessionManagementPage from "./pages/instructor/LiveSessionManagementPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CouponManagementPage from "./pages/admin/CouponManagementPage";
import RefundReviewPage from "./pages/admin/RefundReviewPage";
import ReportsPage from "./pages/admin/ReportsPage";
import CategoryManagementPage from "./pages/admin/CategoryManagementPage";

import TaDashboard from "./pages/ta/TaDashboard";
import TaCourseGradingPage from "./pages/ta/TaCourseGradingPage";

import PrivacyPage from "./pages/misc/PrivacyPage";
import AvailabilityPage from "./pages/instructor/AvailabilityPage";

import VerifyCertificatePage from "./pages/misc/VerifyCertificatePage";
import NotificationsPage from "./pages/misc/NotificationsPage";
import SecuritySettingsPage from "./pages/misc/SecuritySettingsPage";
import NotFoundPage from "./pages/misc/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Course player is full-bleed (its own sidebar layout), so it sits outside the standard Layout shell */}
            <Route
              path="/learn/:courseId"
              element={
                <ProtectedRoute roles={["STUDENT"]}>
                  <CoursePlayerPage />
                </ProtectedRoute>
              }
            />

            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/verify" element={<VerifyCertificatePage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["STUDENT"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/certificates"
                element={
                  <ProtectedRoute roles={["STUDENT"]}>
                    <CertificatesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute roles={["STUDENT"]}>
                    <WishlistPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/instructor"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:id"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <CourseBuilderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId/tas"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <TaManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId/live-sessions"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <LiveSessionManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/courses/:courseId/reports"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR", "ADMIN"]}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instructor/availability"
                element={
                  <ProtectedRoute roles={["INSTRUCTOR"]}>
                    <AvailabilityPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ta"
                element={
                  <ProtectedRoute roles={["TEACHING_ASSISTANT"]}>
                    <TaDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ta/courses/:courseId"
                element={
                  <ProtectedRoute roles={["TEACHING_ASSISTANT"]}>
                    <TaCourseGradingPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/coupons"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <CouponManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/refunds"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <RefundReviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <CategoryManagementPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings/privacy"
                element={
                  <ProtectedRoute>
                    <PrivacyPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/security"
                element={
                  <ProtectedRoute>
                    <SecuritySettingsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
