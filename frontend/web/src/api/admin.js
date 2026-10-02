import api from "./client";

export const adminApi = {
  pendingInstructors: () => api.get("/admin/instructor-approvals/pending"),
  decideInstructor: (id, approve) =>
    api.post(`/admin/instructor-approvals/${id}`, null, { params: { approve } }),
  dashboard: () => api.get("/admin/dashboard"),
  // AD7: general-purpose user directory (any role) + deactivation.
  listUsers: (params) => api.get("/admin/users", { params }), // params: { role, q, page, size }
  deactivateUser: (userId, reason) =>
    api.post(`/admin/users/${userId}/deactivate`, null, { params: reason ? { reason } : {} }),
  // FR34 / I5: grant or revoke an instructor's platform-wide coupon permission.
  setCouponEligibility: (instructorId, eligible) =>
    api.post(`/admin/instructors/${instructorId}/coupon-eligibility`, null, { params: { eligible } }),
};

export const couponApi = {
  create: (payload) => api.post("/coupons", payload),
};

export const refundApi = {
  pending: () => api.get("/refunds/pending"),
  // S13: pre-check shown before the request form, same rule the server enforces on submit.
  eligibility: (paymentId) => api.get(`/refunds/payments/${paymentId}/eligibility`),
  request: (paymentId, reason) => api.post(`/refunds/payments/${paymentId}`, { reason }),
  decide: (id, payload) => api.post(`/refunds/${id}/decide`, payload),
};

export const taApi = {
  invite: (courseId, email) => api.post(`/courses/${courseId}/ta-invitations`, { email }),
  list: (courseId) => api.get(`/courses/${courseId}/ta-invitations`),
  mine: () => api.get(`/ta-invitations/mine`),
  accept: (assignmentId) => api.post(`/ta-invitations/${assignmentId}/accept`),
  revoke: (assignmentId) => api.delete(`/ta-invitations/${assignmentId}`),
};

export const availabilityApi = {
  markUnavailable: (payload) => api.post(`/instructor-availability`, payload),
  cancel: (leaveId) => api.delete(`/instructor-availability/${leaveId}`),
};

export const privacyApi = {
  exportData: () => api.get(`/privacy/export`),
  deleteAccount: () => api.post(`/privacy/delete-account`),
};

export const notificationApi = {
  list: () => api.get("/notifications"),
  markRead: (id) => api.post(`/notifications/${id}/read`),
};

export const searchApi = {
  courses: (q) => api.get("/search/courses", { params: { q } }),
  instructors: (q) => api.get("/search/instructors", { params: { q } }),
};

// AD6: four report types, each with a JSON summary (for on-screen charts) and a matching
// CSV/XLSX download. Download helpers use responseType: "blob" the same way ReportsPage.jsx does.
export const reportApi = {
  enrollmentsXlsx: (courseId) => api.get(`/reports/courses/${courseId}/enrollments.xlsx`, { responseType: "blob" }),
  revenueCsv: () => api.get("/reports/revenue.csv", { responseType: "blob" }),
  enrollmentTrend: (days = 30) => api.get("/reports/enrollment-trend", { params: { days } }),
  enrollmentTrendCsv: (days = 30) => api.get("/reports/enrollment-trend.csv", { params: { days }, responseType: "blob" }),
  topRatedCourses: (limit = 10) => api.get("/reports/top-rated-courses", { params: { limit } }),
  topRatedCoursesCsv: (limit = 10) => api.get("/reports/top-rated-courses.csv", { params: { limit }, responseType: "blob" }),
  instructorPayouts: () => api.get("/reports/instructor-payouts"),
  instructorPayoutsCsv: () => api.get("/reports/instructor-payouts.csv", { responseType: "blob" }),
};

// S12/I10: login history, backed by data that was already being recorded but had no retrieval
// endpoint until this pass.
export const accountApi = {
  loginHistory: (params) => api.get("/auth/login-history", { params }), // params: { page, size }
};
