import { CheckSquare, LayoutDashboard, ListTodo, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop, solo visible en mobile cuando el menú está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-100
          flex flex-col justify-between z-50 transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div>
          <div className="flex items-center justify-between px-5 py-6">
            <div className="flex items-center gap-2">
              <CheckSquare className="text-[#254bdc]" size={22} />
              <span className="font-heading font-bold text-lg text-[#1C2230]">
                Task<span className="text-[#254bdc]">Flow</span>
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 lg:hidden">
              <X size={20} />
            </button>
          </div>

          <nav className="px-3 space-y-1">
            <a href="#" className="nav-item-active">
              <LayoutDashboard size={18} />
              Dashboard
            </a>
            <a href="#" className="nav-item">
              <ListTodo size={18} />
              Tareas
            </a>
          </nav>
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#254bdc] text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="leading-tight min-w-0">
                <p className="text-sm font-medium text-[#1C2230] truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500 flex-shrink-0" title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}