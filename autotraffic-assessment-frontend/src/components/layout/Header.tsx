import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  onNewTask: () => void;
  onMenuClick: () => void;
}

export default function Header({ onNewTask, onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3 min-w-0">
        <button onClick={onMenuClick} className="text-gray-500 hover:text-gray-700 lg:hidden mt-1">
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#1C2230] truncate">
            ¡Hola, {firstName}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">Vamos a darle orden a tu día.</p>
        </div>
      </div>

      <button onClick={onNewTask} className="btn-primary flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
        <span className="text-lg leading-none">+</span>
        <span className="hidden sm:inline">Nueva tarea</span>
      </button>
    </div>
  );
}