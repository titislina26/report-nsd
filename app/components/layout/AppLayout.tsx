import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toaster } from "sonner";
import { Outlet } from "react-router";
import { Sheet, SheetContent } from "~/components/ui/sheet";

export function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <Sidebar />
      </div>

      {/* Sidebar for mobile */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-slate-950 border-r-0" showCloseButton={false}>
          <Sidebar onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col lg:pl-64">
        <Topbar onMenuClick={() => setOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}

