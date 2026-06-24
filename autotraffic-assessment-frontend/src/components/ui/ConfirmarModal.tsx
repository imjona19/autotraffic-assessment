interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-heading font-semibold text-lg text-[#1C2230] mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-cancel">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}