import { ReactNode } from 'react';

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>{children}</div>;
}

export function AdminHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminButton({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}) {
  const variants = {
    primary: 'bg-blue-700 text-white hover:bg-blue-800',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function AdminInput({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label-field">{label}{required && <span className="text-red-500"> *</span>}</label>
      <input type={type} className="input-field" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function AdminTextarea({ label, value, onChange, rows = 3, required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label-field">{label}{required && <span className="text-red-500"> *</span>}</label>
      <textarea className="input-field" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function AdminToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  );
}

export function AdminSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div className="mt-6 flex justify-end">
      <AdminButton onClick={onSave} disabled={saving} variant="success">
        {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
      </AdminButton>
    </div>
  );
}
