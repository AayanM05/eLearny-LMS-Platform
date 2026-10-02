import api from "./client";

export const quizApi = {
  create: (subsectionId, payload) => api.post(`/subsections/${subsectionId}/quiz`, payload),
  getBySubsection: (subsectionId) => api.get(`/subsections/${subsectionId}/quiz`),
  attempt: (quizId, answers) => api.post(`/quizzes/${quizId}/attempts`, { answers }),
  history: (quizId) => api.get(`/quizzes/${quizId}/attempts/me`),
};

export const assignmentApi = {
  create: (subsectionId, payload) => api.post(`/subsections/${subsectionId}/assignment`, payload),
  getBySubsection: (subsectionId) => api.get(`/subsections/${subsectionId}/assignment`),
  submit: (assignmentId, fileUrl) => api.post(`/assignments/${assignmentId}/submissions`, { fileUrl }),
  submissions: (assignmentId) => api.get(`/assignments/${assignmentId}/submissions`),
  grade: (submissionId, payload) => api.post(`/assignment-submissions/${submissionId}/grade`, payload),
};
