import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input";
import { useTags } from "../../hooks/useTags";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "../../types/task";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; description?: string; tagIds?: number[] }) => Promise<boolean>;
  taskToEdit?: Task | null;
}

export default function TaskForm({ isOpen, onClose, onSubmit, taskToEdit }: TaskFormProps) {
    // 1. Todos los useState primero
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [newTagName, setNewTagName] = useState("");

    // 2. Hooks personalizados
    const { tags, createTag } = useTags();

    const isEditMode = Boolean(taskToEdit);

    // 3. Todos los useEffect después, en cualquier orden entre ellos, pero antes del return
    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description ?? "");
        } 
        else {
            setTitle("");
            setDescription("");
        }
        
        setError("");
    }, [taskToEdit, isOpen]);

    useEffect(() => {
        if (taskToEdit?.tags) {
            setSelectedTagIds(taskToEdit.tags.map((t) => t.id));
        } 
        else {
            setSelectedTagIds([]);
        }
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const toggleTag = (id: number) => {
        setSelectedTagIds((prev) =>
            prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
        );
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        const tag = await createTag(newTagName.trim(), "#254bdc");

        if (tag) {
            setSelectedTagIds((prev) => [...prev, tag.id]);
            setNewTagName("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("El título es obligatorio");
            return;
        }

        setIsSubmitting(true);

        const success = await onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            tagIds: selectedTagIds,
        });

        setIsSubmitting(false);

        if (success) {
            onClose();
        } 
        else {
            setError("Ocurrió un error al guardar la tarea. Intenta de nuevo.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading font-semibold text-lg text-[#1C2230]">
                        {isEditMode ? "Editar tarea" : "Nueva tarea"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        id="title"
                        label="Título"
                        placeholder="Ej. Diseñar mockups para la nueva funcionalidad"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>

                        <textarea
                            id="description"
                            className="input resize-none"
                            rows={3}
                            placeholder="Agrega detalles sobre esta tarea..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Etiquetas</label>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={`badge transition-all ${
                                        selectedTagIds.includes(tag.id) ? "ring-2 ring-offset-1" : "opacity-50 hover:opacity-100"
                                    }`}
                                    style={{
                                        backgroundColor: `${tag.color}1A`,
                                        color: tag.color,
                                        ...(selectedTagIds.includes(tag.id) && ({ "--tw-ring-color": tag.color } as any)),
                                    }}
                                    >
                                    {tag.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Nueva etiqueta..."
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="input flex-1 text-sm"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleCreateTag();
                                    }
                                }}
                            />
                            <button type="button" onClick={handleCreateTag} className="btn-secondary text-sm">
                                Agregar
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    <div className="flex justify-end gap-2 mt-2">
                        <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : isEditMode ? "Guardar cambios" : "Crear tarea"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}