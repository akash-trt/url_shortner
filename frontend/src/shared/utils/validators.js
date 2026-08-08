export function validateEmail(value) {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "That email doesn't look right.";
  return null;
}

export function validatePassword(value) {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Use at least 8 characters.";
  return null;
}

export function validateName(value) {
  if (!value.trim()) return "Name is required.";
  if (value.trim().length < 3) return "Name needs at least 3 characters.";
  return null;
}

export function validateLongUrl(value) {
  if (!value.trim()) return "Paste a URL to shorten.";
  try {
    const u = new URL(value);
    if (!["http:", "https:"].includes(u.protocol)) {
      return "Only http:// and https:// links are supported.";
    }
  } catch {
    return "That doesn't look like a valid URL — include https://";
  }
  return null;
}

export function validateAlias(value) {
  if (!value) return null; // optional
  if (!/^[a-zA-Z0-9_-]{1,30}$/.test(value)) {
    return "Use 1–30 letters, numbers, - or _ only.";
  }
  return null;
}
