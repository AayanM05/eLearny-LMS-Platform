import api from "./client";

export const courseApi = {
  browse: (params) => api.get("/courses", { params }),
  mine: () => api.get("/courses/mine"),
  get: (id) => api.get(`/courses/${id}`),
  create: (payload) => api.post("/courses", payload),
  update: (id, payload) => api.put(`/courses/${id}`, payload),
  publish: (id) => api.post(`/courses/${id}/publish`),
  unpublish: (id) => api.post(`/courses/${id}/unpublish`),
  addSection: (courseId, payload) => api.post(`/courses/${courseId}/sections`, payload),
  addSubsection: (sectionId, payload) => api.post(`/sections/${sectionId}/subsections`, payload),
  reviews: (courseId) => api.get(`/courses/${courseId}/reviews`),
  addReview: (courseId, payload) => api.post(`/courses/${courseId}/reviews`, payload),
  progress: (courseId) => api.get(`/courses/${courseId}/progress`),
  liveSessions: (courseId) => api.get(`/courses/${courseId}/live-sessions`),
};

export const categoryApi = {
  list: () => api.get("/categories"),
  create: (name) => api.post("/categories", { name }),
};
