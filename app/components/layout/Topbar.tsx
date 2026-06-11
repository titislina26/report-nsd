import { useState } from "react";
import { Bell, Search, Menu, LogOut, User, ChevronDown, CheckCheck, Circle } from "lucide-react";
import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "CARF-2026-041 Disetujui",
      desc: "Pengajuan dana sebesar Rp 2.500.000 disetujui oleh Finance.",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Pekerjaan Baru Ditugaskan",
      desc: "Tugas survey UBIQU Sulsel diberikan kepada Siti Aminah.",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      title: "Kwitansi KW-003 Berhasil Dibuat",
      desc: "Kwitansi untuk Doni Pratama siap dicetak.",
      time: "2h ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleToggleRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-x-4 border-b border-slate-100 bg-white/95 backdrop-blur-sm px-4 sm:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="-m-2 p-2 text-slate-600 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex flex-1 gap-x-4 self-stretch items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="global-search"
            className="h-9 pl-9 bg-slate-50 border-slate-200 focus-visible:bg-white text-sm placeholder:text-slate-400"
            placeholder="Cari transaksi, teknisi, kwitansi..."
            type="search"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notification Bell Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 relative cursor-pointer outline-none">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </Button>
            } />
            <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                <span className="font-semibold text-sm text-slate-900">Notifikasi</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="h-3 w-3" /> Tandai semua dibaca
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleToggleRead(n.id)}
                      className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 flex gap-2.5 ${
                        n.unread ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        {n.unread ? (
                          <Circle className="h-2.5 w-2.5 text-indigo-600 fill-indigo-600" />
                        ) : (
                          <Circle className="h-2.5 w-2.5 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <p className={`text-xs font-semibold truncate ${n.unread ? "text-slate-900" : "text-slate-700"}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs">Tidak ada notifikasi</div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex items-center gap-2 h-9 px-2 hover:bg-slate-100 rounded-lg cursor-pointer outline-none"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-slate-900 text-white text-xs font-bold">AD</AvatarFallback>
              </Avatar>
              <span className="hidden md:block text-sm font-medium text-slate-700">Admin</span>
              <ChevronDown className="hidden md:block h-3 w-3 text-slate-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-900">Admin User</span>
                  <span className="text-xs text-slate-500 truncate">admin@mahaga.com</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profil Saya
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link to="/logout" />}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex w-full items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
