import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { tasksApi } from "../api/tasksApi";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";

// interface UseTasksReturn {
//   tasks: Task[];
//   isLoading: boolean;
//   error: string | null;
//   createTask: (payload: CreateTaskPayload) => Promise<boolean>;
//   updateTask: (id: number, payload: UpdateTaskPayload) => Promise<boolean>;
//   deleteTask: (id: number) => Promise<boolean>;
//   toggleComplete: (id: number, completed: boolean) => Promise<boolean>;
//   refetch: () => Promise<void>;
// }

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const fetchTasks = useCallback(async (order: "asc" | "desc" = sortOrder) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await tasksApi.getAll(order);
            setTasks(data);
        } 
        catch {
            setError("No se pudieron cargar las tareas. Intenta de nuevo.");
        } 
        finally {
            setIsLoading(false);
        }
    }, [sortOrder]);

    useEffect(() => {
        fetchTasks(sortOrder);
    }, [sortOrder]);

    const changeSortOrder = (order: "asc" | "desc") => {
        setSortOrder(order);
    };

    const createTask = async (payload: CreateTaskPayload): Promise<boolean> => {
        try {
            const newTask = await tasksApi.create(payload);
            setTasks((prev) => [newTask, ...prev]);
            toast.success("Tarea creada");
            return true;
        } 
        catch {
            toast.error("No se pudo crear la tarea");
            return false;
        }
    };

    const updateTask = async (id: number, payload: UpdateTaskPayload): Promise<boolean> => {
        try {
            const updated = await tasksApi.update(id, payload);
            setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
            // Solo mostramos toast si fue una edición real de contenido, no un toggle de checkbox
            if (payload.title !== undefined || payload.description !== undefined) {
                toast.success("Tarea actualizada");
            }
            return true;
        } 
        catch {
            toast.error("No se pudo actualizar la tarea");
            return false;
        }
    };

    const deleteTask = async (id: number): Promise<boolean> => {
        try {
            await tasksApi.delete(id);
            setTasks((prev) => prev.filter((task) => task.id !== id));
            toast.success("Tarea eliminada");
            return true;
        } 
        catch {
            toast.error("No se pudo eliminar la tarea");
            return false;
        }
    };

    const toggleComplete = async (id: number, completed: boolean): Promise<boolean> => {
        return updateTask(id, { completed });
    };

    return {
        tasks,
        isLoading,
        error,
        sortOrder,
        changeSortOrder,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        refetch: fetchTasks,
    };
}