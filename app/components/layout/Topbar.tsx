import { Bell, Search, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { Form } from "react-router";
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
          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-slate-700 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
          </Button>

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
              <Form method="post" action="/logout">
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={() => {
                    const form = document.createElement('form');
                    form.method = 'post';
                    form.action = '/logout';
                    document.body.appendChild(form);
                    form.submit();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </Form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
