import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminInput, AdminToggle } from '@/components/admin/AdminUI';
import FileUpload from '@/components/admin/FileUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import type { Teacher } from '@/types';

const EMPTY = { full_name: '', title: '', nip: '', nuptk: '', position: '', subject: '', category: 'Guru', photo_url: '' };

export default function AdminTeachers() {
  const { toasts, success, error, dismiss } = useToast();
  const [list, setList] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('teachers').select('*').order('sort_order', { ascending: true });
      setList(data ?? []);
      setLoading(false);
    })();
  }, []);

  const startAdd = () => { setEditing({} as Teacher); setForm(EMPTY); };
  const startEdit = (t: Teacher) => {
    setEditing(t);
    setForm({ full_name: t.full_name, title: t.title ?? '', nip: t.nip ?? '', nuptk: t.nuptk ?? '', position: t.position ?? '', subject: t.subject ?? '', category: t.category, photo_url: t.photo_url ?? '' });
  };

  const save = async () => {
    if (!form.full_name.trim()) {
      error('Nama lengkap wajib diisi.');
      return;
    }
    setSaving(true);
    if (editing?.id) {
      const data = await adminUpdate<Teacher>('teachers', editing.id, form);
      setSaving(false);
      if (data) {
        setList((prev) => prev.map(t => t.id === editing.id ? data : t));
        setEditing(null);
        success('Data guru berhasil diperbarui.');
      } else {
        error('Gagal memperbarui data guru. Coba lagi.');
      }
    } else {
      const order = (list[list.length - 1]?.sort_order ?? 0) + 1;
      const data = await adminInsert<Teacher>('teachers', { ...form, sort_order: order, is_active: true });
      setSaving(false);
      if (data) {
        setList((prev) => [...prev, data]);
        setEditing(null);
        success('Guru baru berhasil ditambahkan.');
      } else {
        error('Gagal menambahkan guru. Coba lagi.');
      }
    }
  };

  const remove = async (id: string) => {
    const ok = await adminDelete('teachers', id);
    setList((prev) => prev.filter(t => t.id !== id));
    if (ok) success('Data guru dihapus.');
    else error('Gagal menghapus data guru.');
  };

  const toggle = async (t: Teacher) => {
    const newVal = !t.is_active;
    setList((prev) => prev.map(x => x.id === t.id ? { ...x, is_active: newVal } : x));
    const result = await adminUpdate('teachers', t.id, { is_active: newVal });
    if (!result) error('Gagal mengubah status guru.');
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader title="Kelola Guru & Staf" subtitle="Profil guru dan staf sekolah" action={<AdminButton onClick={startAdd}><Plus className="w-4 h-4" /> Tambah Guru</AdminButton>} />

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Tutup"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing.id ? 'Edit' : 'Tambah'} Guru</h2>
            <div className="grid gap-4">
              <AdminInput label="Nama Lengkap" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Gelar / Jabatan" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
                <AdminInput label="Posisi" value={form.position} onChange={(v) => setForm({ ...form, position: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="NIP" value={form.nip} onChange={(v) => setForm({ ...form, nip: v })} />
                <AdminInput label="NUPTK" value={form.nuptk} onChange={(v) => setForm({ ...form, nuptk: v })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Kategori</label>
                  <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {['Pimpinan', 'Guru', 'Staf'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <AdminInput label="Mata Pelajaran" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
              </div>
              <FileUpload label="Foto" value={form.photo_url} onChange={(v) => setForm({ ...form, photo_url: v })} aspectClass="w-24 h-24" placeholder="Pilih foto" />
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
          <p className="text-gray-500 text-center py-8">Belum ada guru.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map((t) => (
              <div key={t.id} className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-blue-50 mb-2">
                  {t.photo_url ? <img src={t.photo_url} alt={t.full_name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-300">{t.full_name.charAt(0)}</div>}
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{t.full_name}</h3>
                <p className="text-xs text-gray-500">{t.position ?? t.title}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button onClick={() => startEdit(t)} className="text-blue-700 text-xs"><Edit3 className="w-3.5 h-3.5" /></button>
                  <label className="cursor-pointer"><AdminToggle checked={t.is_active} onChange={() => toggle(t)} /></label>
                  <button onClick={() => remove(t.id)} className="text-red-500 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
