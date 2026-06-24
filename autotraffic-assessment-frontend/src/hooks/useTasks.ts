import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { tasksApi } from "../api/tasksApi";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";

export function useTasks() {
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
            setTasks((prev) => [...prev, newTask]);
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

            if (payload.title !== undefined || payload.description !== undefined || payload.tagIds !== undefined) {
                toast.success("Tarea actualizada");
            }
            return true;
        } 
        catch 
        {
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

    const reorderTasks = async (newOrder: Task[]) => {

        setTasks(newOrder);

        try {
            await tasksApi.reorder(newOrder.map((t) => t.id));
        } 
        catch {
            toast.error("No se pudo guardar el nuevo orden");
            fetchTasks(); 
        }
    };

    return {
        tasks,
        isLoading,
        error,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
        reorderTasks,
        refetch: fetchTasks,
    };
}