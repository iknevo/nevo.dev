const DEFAULT_ADMIN_REDIRECT = "/admin";

/**
 * Keep auth redirects on this application and within the admin area.
 *
 * Auth redirect parameters are user-controlled, so values such as absolute
 * URLs, protocol-relative URLs, and backslash variants must not be passed to
 * Next's router or URL constructor unchecked.
 */
export function getSafeAdminRedirect(value?: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return DEFAULT_ADMIN_REDIRECT;
  }

  try {
    const url = new URL(value, "https://nevo.local");
    const isAdminPath = url.pathname === "/admin" || url.pathname.startsWith("/admin/");

    if (!isAdminPath) {
      return DEFAULT_ADMIN_REDIRECT;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return DEFAULT_ADMIN_REDIRECT;
  }
}
