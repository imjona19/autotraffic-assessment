import { apiClient } from "./apiClient";
import type { Tag } from "../types/tag";

export const tagsApi = {
    getAll: async (): Promise<Tag[]> => {
        const { data } = await apiClient.get<Tag[]>("/tags");
        return data;
    },
    create: async (payload: { name: string; color?: string }): Promise<Tag> => {
        const { data } = await apiClient.post<Tag>("/tags", payload);
        return data;
    },
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/tags/${id}`);
    },
};