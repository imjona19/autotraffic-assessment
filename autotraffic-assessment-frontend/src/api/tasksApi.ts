import { apiClient } from "./apiClient";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";

export const tasksApi = {
  getAll: async (sortOrder: "asc" | "desc" = "desc"): Promise<Task[]> => {
    const { data } = await apiClient.get<Task[]>("/tasks", { params: { sort: sortOrder } });
    return data;
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.post<Task>("/tasks", payload);
    return data;
  },

  update: async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
    const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },

  reorder: async (orderedIds: number[]): Promise<void> => {
    await apiClient.put("/tasks/reorder", { orderedIds });
  },

};