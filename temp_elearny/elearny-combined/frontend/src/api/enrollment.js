import api from "./client";

export const enrollmentApi = {
  enrollFree: (courseId) => api.post(`/enrollments/free/${courseId}`),
  myEnrollments: () => api.get("/enrollments/me"),
  markSubsectionComplete: (subsectionId, lastPositionSeconds) =>
    api.post(`/subsections/${subsectionId}/complete`, null, {
      params: lastPositionSeconds != null ? { lastPositionSeconds } : {},
    }),
};

export const paymentApi = {
  initiate: (courseId, couponCode) =>
    api.post(`/payments/courses/${courseId}/initiate`, couponCode ? { couponCode } : {}),
};

export const certificateApi = {
  mine: () => api.get("/certificates/mine"),
  get: (id) => api.get(`/certificates/${id}`),
  download: (id) => api.get(`/certificates/${id}/download`, { responseType: "blob" }),
  verify: (code) => api.get(`/certificates/verify/${code}`),
};
