import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MapPin,
  Receipt,
  Settings,
  Wifi,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, description: "Overview & Analytics" },
  { name: "CARF & Expenses", href: "/carf", icon: FileText, description: "Manajemen Pengajuan" },
  { name: "Field Operations", href: "/field-ops", icon: MapPin, description: "Pelacakan Teknisi" },
  { name: "Receipts", href: "/receipts", icon: Receipt, description: "Generator Kwitansi" },
];

export function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-950">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-5 border-b border-slate-800">
        <div className="rounded-lg bg-white/10 p-1.5">
          <Wifi className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-white leading-none block">Mahaga</span>
          <span className="text-xs text-slate-400 leading-none">FieldOps Manager</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
        <nav className="space-y-0.5">
          {navigation.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== "/" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onLinkClick}
                className={cn(
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150"
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300",
                    "h-4 w-4 flex-shrink-0 transition-colors"
                  )}
                />
                <div className="min-w-0">
                  <div className="leading-none">{item.name}</div>
                  <div className={cn(
                    "text-xs mt-0.5 leading-none",
                    isActive ? "text-slate-300" : "text-slate-600 group-hover:text-slate-500"
                  )}>
                    {item.description}
                  </div>
                </div>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-3">
        <Link
          to="/settings"
          onClick={onLinkClick}
          className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-all duration-150"
        >
          <Settings className="h-4 w-4 flex-shrink-0 text-slate-500 group-hover:text-slate-300 transition-colors" />
          Settings
        </Link>
      </div>
    </div>
  );
}
