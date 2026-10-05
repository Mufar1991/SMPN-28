import { useEffect, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const success = useCallback((msg: string) => show('success', msg), [show]);
  const error = useCallback((msg: string) => show('error', msg), [show]);
  const info = useCallback((msg: string) => show('info', msg), [show]);

  return { toasts, success, error, info, dismiss };
}

export function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, dismiss }: { toast: Toast; dismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const bg = {
    success: 'bg-white border-green-200',
    error: 'bg-white border-red-200',
    info: 'bg-white border-blue-200',
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${bg[toast.type]} pointer-events-auto transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ minWidth: '280px', maxWidth: '400px' }}
    >
      {icons[toast.type]}
      <span className="flex-1 text-sm font-medium text-gray-800">{toast.message}</span>
      <button onClick={() => dismiss(toast.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
