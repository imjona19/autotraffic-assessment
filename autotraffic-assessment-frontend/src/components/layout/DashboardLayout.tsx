import { useState } from "react";
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
  onNewTask: () => void;
}

export default function DashboardLayout({ children, onNewTask }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#F7F8FA] min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 min-w-0">
        <div className="px-4 sm:px-6 lg:px-8 pt-6">
          <Header onNewTask={onNewTask} onMenuClick={() => setIsSidebarOpen(true)} />
        </div>
        <main className="px-4 sm:px-6 lg:px-8 pb-8">{children}</main>
      </div>
    </div>
  );
}