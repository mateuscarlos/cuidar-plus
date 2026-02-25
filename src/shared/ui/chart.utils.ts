/**
 * Sanitizes input for use in CSS styles to prevent injection attacks.
 *
 * @param value The string to sanitize
 * @param type The context of usage ('id', 'key', or 'value')
 * @returns The sanitized string
 */
export function sanitizeForStyle(
  value: string,
  type: "id" | "key" | "value",
): string {
  if (!value) {
    return "";
  }

  // For IDs and property keys, we want strict alphanumeric + dash/underscore
  if (type === "id" || type === "key") {
    return value.replace(/[^a-zA-Z0-9_-]/g, "");
  }

  // For values (colors), we need to allow valid CSS characters but block dangerous ones
  // We strip: ; (property separator), { } (block delimiters), < > (HTML tags), " ' (quotes)
  return value.replace(/[;{}<>"']/g, "");
}
