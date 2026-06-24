import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X } from "lucide-react";
import Input from "../ui/Input";
import type { Task } from "../../types/task";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; description?: string }) => Promise<boolean>;
  taskToEdit?: Task | null;
}

export default function TaskForm({ isOpen, onClose, onSubmit, taskToEdit }: TaskFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = Boolean(taskToEdit);

    // Rellena el formulario si estamos editando, o lo limpia si es una nueva tarea
    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description ?? "");
        } else {
            setTitle("");
            setDescription("");
        }
        setError("");
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("El título es obligatorio");
            return;
        }

        setIsSubmitting(true);

        const success = await onSubmit({ title: title.trim(), description: description.trim() || undefined });
        
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