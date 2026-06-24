import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "../api/tasksApi";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (payload: CreateTaskPayload) => Promise<boolean>;
  updateTask: (id: number, payload: UpdateTaskPayload) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;
  toggleComplete: (id: number, completed: boolean) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await tasksApi.getAll();
            setTasks(data);
        } 
        catch {
            setError("No se pudieron cargar las tareas. Intenta de nuevo.");
        } 
        finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const createTask = async (payload: CreateTaskPayload): Promise<boolean> => {
        try {
            const newTask = await tasksApi.create(payload);
            setTasks((prev) => [newTask, ...prev]);
            return true;
        } 
        catch {
            setError("No se pudo crear la tarea.");
            return false;
        }
    };

    const updateTask = async (id: number, payload: UpdateTaskPayload): Promise<boolean> => {
        try {
            const updated = await tasksApi.update(id, payload);
            setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
            return true;
        } 
        catch {
            setError("No se pudo actualizar la tarea.");
            return false;
        }
    };

    const deleteTask = async (id: number): Promise<boolean> => {
        try {
            await tasksApi.delete(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
            return true;
        }
        catch {
            setError("No se pudo eliminar la tarea.");
            return false;
        }
    };

    // Atajo específico para el checkbox de completar/pendiente
    const toggleComplete = async (id: number, completed: boolean): Promise<boolean> => {
        return updateTask(id, { completed });
    };

    return {
        tasks,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        refetch: fetchTasks,
    };
}