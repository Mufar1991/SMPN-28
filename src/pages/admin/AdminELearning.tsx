import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminUI';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import type { ELearningMaterial } from '@/types';

const EMPTY = { title: '', description: '', subject: '', grade_level: '', file_url: '', material_type: 'Materi', is_published: true };

export default function AdminELearning() {
  const { toasts, success, error, dismiss } = useToast();
  const [list, setList] = useState<ELearningMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ELearningMaterial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('elearning_materials').select('*').order('sort_order', { ascending: true });
      setList(data ?? []);
      setLoading(false);
    })();
  }, []);

  const startAdd = () => { setEditing({} as ELearningMaterial); setForm(EMPTY); };
  const startEdit = (m: ELearningMaterial) => {
    setEditing(m);
    setForm({ title: m.title, description: m.description ?? '', subject: m.subject ?? '', grade_level: m.grade_level ?? '', file_url: m.file_url ?? '', material_type: m.material_type, is_published: m.is_published });
  };

  const save = async () => {
    if (!form.title.trim()) {
      error('Judul materi wajib diisi.');
      return;
    }
    setSaving(true);
    if (editing?.id) {
      const data = await adminUpdate<ELearningMaterial>('elearning_materials', editing.id, form);
      setSaving(false);
      if (data) {
        setList((prev) => prev.map(m => m.id === editing.id ? data : m));
        setEditing(null);
        success('Materi e-learning berhasil diperbarui.');
      } else {
        error('Gagal memperbarui materi. Coba lagi.');
      }
    } else {
      const order = (list[list.length - 1]?.sort_order ?? 0) + 1;
      const data = await adminInsert<ELearningMaterial>('elearning_materials', { ...form, sort_order: order });
      setSaving(false);
      if (data) {
        setList((prev) => [...prev, data]);
        setEditing(null);
        success('Materi e-learning baru berhasil ditambahkan.');
      } else {
        error('Gagal menambahkan materi. Coba lagi.');
      }
    }
  };

  const remove = async (id: string) => {
    const ok = await adminDelete('elearning_materials', id);
    setList((prev) => prev.filter(m => m.id !== id));
    if (ok) success('Materi dihapus.');
    else error('Gagal menghapus materi.');
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader title="Kelola E-Learning" subtitle="Materi pembelajaran dan kuis" action={<AdminButton onClick={startAdd}><Plus className="w-4 h-4" /> Tambah Materi</AdminButton>} />

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Tutup"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing.id ? 'Edit' : 'Tambah'} Materi</h2>
            <div className="grid gap-4">
              <AdminInput label="Judul" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <AdminTextarea label="Deskripsi" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Mata Pelajaran" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
                <AdminInput label="Tingkat Kelas" value={form.grade_level} onChange={(v) => setForm({ ...form, grade_level: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Tipe</label>
                  <select className="input-field" value={form.material_type} onChange={(e) => setForm({ ...form, material_type: e.target.value })}>
                    {['Materi', 'Video', 'Kuis', 'Tugas'].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <AdminInput label="URL File" value={form.file_url} onChange={(v) => setForm({ ...form, file_url: v })} placeholder="https://..." />
              </div>
              <AdminToggle checked={form.is_published} onChange={(v) => setForm({ ...form, is_published: v })} label="Publikasikan" />
              <div className="flex gap-2 justify-end">
                <AdminButton variant="secondary" onClick={() => setEditing(null)}>Batal</AdminButton>
                <AdminButton onClick={save} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</AdminButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminCard>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada materi.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((m) => (
              <div key={m.id} className="border border-gray-200 rounded-lg p-4">
                <span className="badge bg-gray-100 text-gray-600 mb-1">{m.material_type}</span>
                <h3 className="font-semibold text-sm text-gray-900">{m.title}</h3>
                <p className="text-xs text-gray-500">{m.subject} - Kelas {m.grade_level || '-'}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => startEdit(m)} className="text-blue-700 text-xs"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(m.id)} className="text-red-500 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
