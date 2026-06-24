import { ClipboardList } from "lucide-react";
import type { Task } from "../../types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={32} strokeWidth={1.5} />
        <p className="empty-state-title">No tienes tareas todavía</p>
        <p className="text-sm text-gray-400">Crea tu primera tarea para empezar a organizar tu día.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}