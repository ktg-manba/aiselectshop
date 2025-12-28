function normalizeUrl(value: string) {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function getLogoUrl(officialUrl?: string) {
  const normalized = normalizeUrl(officialUrl ?? "");
  if (!normalized) return "";
  try {
    const url = new URL(normalized);
    const domain = url.hostname.replace(/^www\./i, "");
    if (!domain) return "";
    const token = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
    const base = `https://img.logo.dev/${domain}`;
    const query = new URLSearchParams({ size: "128", format: "png", retina: "true" });
    if (token) query.set("token", token);
    return `${base}?${query.toString()}`;
  } catch {
    return "";
  }
}
