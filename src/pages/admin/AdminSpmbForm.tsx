import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminToggle } from '@/components/admin/AdminUI';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { SpmbDocumentField } from '@/types';

export default function AdminSpmbForm() {
  const { toasts, success, error, dismiss } = useToast();
  const [fields, setFields] = useState<SpmbDocumentField[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('spmb_document_fields').select('*').order('sort_order', { ascending: true });
      setFields(data ?? []);
      setLoading(false);
    })();
  }, []);

  const add = async () => {
    setAdding(true);
    const newOrder = (fields[fields.length - 1]?.sort_order ?? 0) + 1;
    const data = await adminInsert<SpmbDocumentField>('spmb_document_fields', {
      label: 'Dokumen Baru',
      is_required: true,
      is_active: true,
      sort_order: newOrder,
    });
    setAdding(false);
    if (data) {
      setFields([...fields, data]);
      success('Dokumen baru berhasil ditambahkan.');
    } else {
      error('Gagal menambahkan dokumen. Coba lagi.');
    }
  };

  const update = async (id: string, patch: Partial<SpmbDocumentField>) => {
    setFields((prev) => prev.map(f => f.id === id ? { ...f, ...patch } : f));
    await adminUpdate('spmb_document_fields', id, patch);
  };

  const remove = async (id: string) => {
    const ok = await adminDelete('spmb_document_fields', id);
    setFields((prev) => prev.filter(f => f.id !== id));
    if (ok) success('Dokumen dihapus.');
    else error('Gagal menghapus dokumen.');
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = fields.findIndex(f => f.id === id);
    const swap = fields[idx + dir];
    if (!swap) return;
    const newFields = [...fields];
    [newFields[idx], newFields[idx + dir]] = [newFields[idx + dir], newFields[idx]];
    newFields[idx].sort_order = idx + 1;
    newFields[idx + dir].sort_order = idx + dir + 1;
    setFields(newFields);
    await Promise.all([
      adminUpdate('spmb_document_fields', newFields[idx].id, { sort_order: newFields[idx].sort_order }),
      adminUpdate('spmb_document_fields', newFields[idx + dir].id, { sort_order: newFields[idx + dir].sort_order }),
    ]);
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader
        title="Pengaturan Form & Dokumen SPMB"
        subtitle="Kelola dokumen yang harus diunggah pendaftar di langkah 5"
        action={<AdminButton onClick={add} disabled={adding}><Plus className="w-4 h-4" /> {adding ? 'Menambah...' : 'Tambah Dokumen'}</AdminButton>}
      />

      <AdminCard>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : fields.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada dokumen. Klik "Tambah Dokumen".</p>
        ) : (
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={f.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-3">
                <div className="flex flex-col">
                  <button onClick={() => move(f.id, -1)} disabled={i === 0} className="text-gray-400 hover:text-blue-700 disabled:opacity-30" aria-label="Naik"><GripVertical className="w-4 h-4 rotate-180" /></button>
                  <button onClick={() => move(f.id, 1)} disabled={i === fields.length - 1} className="text-gray-400 hover:text-blue-700 disabled:opacity-30" aria-label="Turun"><GripVertical className="w-4 h-4" /></button>
                </div>
                <input
                  className="input-field flex-1"
                  value={f.label}
                  onChange={(e) => update(f.id, { label: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="checkbox" checked={f.is_required} onChange={(e) => update(f.id, { is_required: e.target.checked })} className="w-4 h-4 rounded" />
                    <span className={f.is_required ? 'text-red-600 font-medium' : 'text-gray-500'}>{f.is_required ? 'Wajib' : 'Opsional'}</span>
                  </label>
                  <AdminToggle checked={f.is_active} onChange={(v) => update(f.id, { is_active: v })} />
                  <button onClick={() => remove(f.id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">Perubahan disimpan otomatis. Dokumen bertanda "Wajib" akan memblokir pengiriman formulir jika tidak diunggah.</p>
      </AdminCard>
    </div>
  );
}
