export function safeNextPath(requested: string, fallback = "/") {
  const origin = "https://tourz.invalid";
  if (!requested.startsWith("/") || requested.startsWith("//") || /[\\\u0000-\u0020]/.test(requested)) return fallback;
  try {
    const url = new URL(requested, origin);
    if (url.origin !== origin || url.pathname.startsWith("//")) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
