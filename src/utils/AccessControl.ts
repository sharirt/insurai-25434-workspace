const ADMIN_ONLY_PAGES = [
  "/ProvidersManager",
  "/AgentsManager",
  "/RequestTypesManager",
  "/ProviderEmailsManager",
];

const OFFICE_RESTRICTED_PAGES = [
  "/ProvidersManager",
  "/AgentsManager",
  "/RequestTypesManager",
];

export function isAdminRole(role: string | undefined | null): boolean {
  return role === "admin";
}

export function isPageRestricted(pathname: string): boolean {
  return ADMIN_ONLY_PAGES.some((page) => pathname.startsWith(page));
}

export function isOfficeRole(role: string | undefined | null): boolean {
  return role === "office";
}

export function canAccessPage(
  role: string | undefined | null,
  pathname: string
): boolean {
  if (isAdminRole(role)) return true;
  if (isOfficeRole(role)) {
    return !OFFICE_RESTRICTED_PAGES.some((page) => pathname.startsWith(page));
  }
  return !isPageRestricted(pathname);
}

export const ADMIN_ONLY_NAV_TITLES = [
  "ניהול יצרנים",
  "ניהול סוכנים",
  "ניהול סוגי בקשות",
  "אימיילים ליצרנים",
];

export const OFFICE_HIDDEN_NAV_TITLES = [
  "ניהול יצרנים",
  "ניהול סוכנים",
  "ניהול סוגי בקשות",
];