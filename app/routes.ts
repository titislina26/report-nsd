import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/dashboard.tsx"),
    route("carf", "routes/carf.tsx"),
    route("field-ops", "routes/field-ops.tsx"),
    route("receipts", "routes/receipts.tsx"),
    route("settings", "routes/settings.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
