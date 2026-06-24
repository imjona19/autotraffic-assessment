import { useState, useMemo } from "react";
import { ClipboardList, Search, Info } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import type { Task } from "../../types/task";
import TaskItem from "./TaskItem";

type FilterValue = "all" | "pending" | "completed";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onReorder: (newOrder: Task[]) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder }: TaskListProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const isFiltering = filter !== "all" || search.trim() !== "";

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      })
      .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, filter, search]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    onReorder(arrayMove(tasks, oldIndex, newIndex));
  };

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

        <select value={filter} onChange={(e) => setFilter(e.target.value as FilterValue)} className="input sm:w-44">
          <option value="all">Todas las tareas</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Completadas</option>
        </select>
      </div>

      {isFiltering && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Info size={14} />
          Quita los filtros para reordenar tus tareas arrastrándolas.
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <ClipboardList size={32} strokeWidth={1.5} />
          <p className="empty-state-title">{tasks.length === 0 ? "No tienes tareas todavía" : "No hay tareas que coincidan"}</p>
          <p className="text-sm text-gray-400">
            {tasks.length === 0 ? "Crea tu primera tarea para empezar a organizar tu día." : "Intenta cambiar el filtro o el término de búsqueda."}
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  dragDisabled={isFiltering}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}