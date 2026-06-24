import { Trash2, Pencil, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types/task";
import { formatRelativeDate } from "../../utils/formatDate";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  dragDisabled: boolean;
}

export default function TaskItem({ task, onToggle, onDelete, onEdit, dragDisabled }: TaskItemProps) {
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: dragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-stretch bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className={`w-1 flex-shrink-0 ${task.completed ? "bg-green-500" : "bg-gray-200"}`} />

      {!dragDisabled && (
        <button
          {...attributes}
          {...listeners}
          className="px-2 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0"
          title="Arrastrar para reordenar"
        >
          <GripVertical size={16} />
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-1 px-4 py-3 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
            className="w-4 h-4 accent-[#254bdc] cursor-pointer flex-shrink-0"
          />
          <div className="min-w-0">
            <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-gray-400" : "text-[#1C2230]"}`}>
              {task.title}
            </p>
            {task.description && <p className="text-xs text-gray-400 truncate">{task.description}</p>}
            {task.tags && task.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {task.tags.map((tag) => (
                  <span key={tag.id} className="badge" style={{ backgroundColor: `${tag.color}1A`, color: tag.color }}>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-7 sm:pl-0 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className={task.completed ? "badge-completed" : "badge-pending"}>
              {task.completed ? "Completada" : "Pendiente"}
            </span>
            <span className="text-xs text-gray-400 hidden md:inline">{formatRelativeDate(task.created_at)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onEdit(task)} className="text-gray-300 hover:text-[#254bdc] transition-colors" title="Editar tarea">
              <Pencil size={16} />
            </button>
            <button onClick={() => onDelete(task.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Eliminar tarea">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}