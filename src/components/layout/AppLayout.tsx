import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";

export default function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-col lg:pl-72">
        <Navbar onMenuClick={() => setIsMobileSidebarOpen(true)} />

        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}