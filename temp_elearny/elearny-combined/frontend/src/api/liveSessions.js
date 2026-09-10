import api from "./client";

export const liveSessionApi = {
  create: (courseId, payload) => api.post(`/courses/${courseId}/live-sessions`, payload),
  book: (slotId) => api.post(`/live-sessions/${slotId}/book`),
  joinWaitlist: (slotId) => api.post(`/live-sessions/${slotId}/waitlist`),
  cancelBooking: (bookingId) => api.post(`/live-session-bookings/${bookingId}/cancel`),
  claim: (entryId) => api.post(`/waitlist-entries/${entryId}/claim`),
};
