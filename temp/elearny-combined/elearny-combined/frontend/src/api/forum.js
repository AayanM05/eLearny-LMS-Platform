import api from "./client";

export const forumApi = {
  list: (subsectionId) => api.get(`/subsections/${subsectionId}/threads`),
  createThread: (subsectionId, questionText) =>
    api.post(`/subsections/${subsectionId}/threads`, { questionText }),
  reply: (threadId, replyText) => api.post(`/threads/${threadId}/replies`, { replyText }),
  upvote: (threadId) => api.post(`/threads/${threadId}/upvote`),
};
