export function redactPii(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\+?\d[\d\s().-]{7,}\d/g, "[redacted-phone]")
    .replace(/\b(student|citizen|patient)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, "$1 [redacted-name]");
}

export function anonymizeMetadata(
  metadata: Record<string, string | number | boolean> | undefined
): Record<string, string | number | boolean> | undefined {
  if (!metadata) return undefined;

  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => !["name", "email", "phone", "studentId", "patientId"].includes(key))
  );
}
