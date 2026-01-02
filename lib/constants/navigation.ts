export const MAIN_NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Aircraft",
    href: "/aircraft",
  },
  {
    label: "Financing",
    href: "/financing",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
] as const;

export const DASHBOARD_NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "Home",
  },
  {
    label: "Favorites",
    href: "/dashboard/favorites",
    icon: "Heart",
  },
  {
    label: "Inquiries",
    href: "/dashboard/inquiries",
    icon: "MessageSquare",
  },
] as const;

export const ADMIN_NAV_ITEMS = [
  {
    label: "Overview",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    label: "Aircraft",
    href: "/admin/aircraft",
    icon: "Plane",
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: "MessageSquare",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "Users",
  },
] as const;
