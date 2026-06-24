import { useState } from "react";
import { CheckCircle2, Clock, ListChecks } from "lucide-react";
import { useTasks } from "../hooks/useTasks";
import DashboardLayout from "../components/layout/DashboardLayout";
import StatsCard from "../components/dashboard/StatsCard";
import TaskList from "../components/dashboard/TaskList";
import TaskForm from "../components/dashboard/TaskForm";
import TaskListSkeleton from "../components/dashboard/TaskListSkeleton";
import ConfirmModal from "../components/ui/ConfirmarModal";
import type { Task } from "../types/task";

export default function DashboardPage() {
  const { tasks, isLoading, error, sortOrder, changeSortOrder, createTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  const handleFormSubmit = async (payload: { title: string; description?: string }) => {
    if (taskToEdit) return updateTask(taskToEdit.id, payload);
    return createTask(payload);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTaskToEdit(null);
  };

  const handleNewTask = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  return (
    <DashboardLayout onNewTask={handleNewTask}>
      {isLoading ? (
        <TaskListSkeleton />
      ) : (
        <>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatsCard icon={ListChecks} label="Total de tareas" value={tasks.length} description="Todas tus tareas" color="#254bdc" />
            <StatsCard icon={Clock} label="Pendientes" value={pendingCount} description="Por completar" color="#F59E0B" />
            <StatsCard icon={CheckCircle2} label="Completadas" value={completedCount} description="Tareas finalizadas" color="#16A34A" />
          </div>

          <div className="card">
            <h2 className="font-heading font-semibold text-base text-[#1C2230] mb-4">Tus tareas</h2>
            <TaskList
              tasks={tasks}
              sortOrder={sortOrder}
              onSortChange={changeSortOrder}
              onToggle={toggleComplete}
              onDelete={(id) => setTaskToDelete(tasks.find((t) => t.id === id) ?? null)}
              onEdit={handleEditTask}
            />
          </div>

          <TaskForm isOpen={isFormOpen} onClose={handleCloseForm} onSubmit={handleFormSubmit} taskToEdit={taskToEdit} />

          <ConfirmModal
            isOpen={Boolean(taskToDelete)}
            title="Eliminar tarea"
            message={`¿Seguro que quieres eliminar "${taskToDelete?.title}"? Esta acción no se puede deshacer.`}
            onConfirm={handleConfirmDelete}
            onCancel={() => setTaskToDelete(null)}
          />
        </>
      )}
    </DashboardLayout>
  );
}