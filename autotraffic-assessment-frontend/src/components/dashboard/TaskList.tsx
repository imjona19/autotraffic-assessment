import { useState, useMemo } from "react";
import { ClipboardList, Search } from "lucide-react";
import type { Task } from "../../types/task";
import TaskItem from "./TaskItem";

type FilterValue = "all" | "pending" | "completed";

interface TaskListProps {
  tasks: Task[];
  sortOrder: "asc" | "desc";
  onSortChange: (order: "asc" | "desc") => void;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, sortOrder, onSortChange, onToggle, onDelete, onEdit }: TaskListProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      })
      .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, filter, search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}
          className="input sm:w-44"
        >
          <option value="desc">Más recientes primero</option>
          <option value="asc">Más antiguas primero</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={32} strokeWidth={1.5} />
          <p className="empty-state-title">
            {tasks.length === 0 ? "No tienes tareas todavía" : "No hay tareas que coincidan"}
          </p>
          <p className="text-sm text-gray-400">
            {tasks.length === 0
              ? "Crea tu primera tarea para empezar a organizar tu día."
              : "Intenta cambiar el filtro o el término de búsqueda."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
}