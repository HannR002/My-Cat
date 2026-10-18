import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-gray-100 animate-scaleUp">
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDanger
                ? 'bg-rose-100 text-rose-600'
                : 'bg-amber-100 text-amber-600'
            }`}
          >
            {isDanger ? (
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            ) : (
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="confirm-modal-title"
              className="text-base font-black text-gray-900 leading-snug"
            >
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition -mr-1 -mt-1"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition active:scale-95 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
