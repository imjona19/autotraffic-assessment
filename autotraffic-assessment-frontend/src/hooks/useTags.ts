import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { tagsApi } from "../api/tagsApi";
import type { Tag } from "../types/tag";

export function useTags() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTags = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await tagsApi.getAll();
            setTags(data);
        } 
        catch {
            toast.error("No se pudieron cargar las etiquetas");
        } 
        finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const createTag = async (name: string, color: string): Promise<Tag | null> => {
        try {
            const newTag = await tagsApi.create({ name, color });
            setTags((prev) => [...prev, newTag]);
            return newTag;
        } 
        catch (err: any) {
            toast.error(err.response?.data?.message || "No se pudo crear la etiqueta");
            return null;
        }
    };

    const deleteTag = async (id: number) => {
        try {
            await tagsApi.delete(id);
            setTags((prev) => prev.filter((t) => t.id !== id));
            toast.success("Etiqueta eliminada");
        } 
        catch {
            toast.error("No se pudo eliminar la etiqueta");
        }
    };

    return { tags, isLoading, createTag, deleteTag };
}