import api from "./client";

export const wishlistApi = {
  list: () => api.get("/wishlist"),
  add: (courseId) => api.post(`/wishlist/${courseId}`),
  remove: (courseId) => api.delete(`/wishlist/${courseId}`),
};
