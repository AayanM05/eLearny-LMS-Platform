/**
 * Every backend validation failure (400, MethodArgumentNotValidException) comes back as
 * { message: "Validation failed", validationErrors: ["email: must be a well-formed email", ...] }
 * — see GlobalExceptionHandler.handleValidation on the backend. Reading only `.message` (as
 * most catch blocks in this app used to) shows the user the useless generic string and throws
 * away the specific field-level reason. This is the one place that decision gets made, so every
 * form's error handling stays consistent going forward.
 */
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.validationErrors) && data.validationErrors.length > 0) {
    return data.validationErrors.join(" ");
  }
  return data.message || fallback;
}
