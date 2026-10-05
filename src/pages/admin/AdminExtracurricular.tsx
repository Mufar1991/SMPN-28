import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminUI';
import FileUpload from '@/components/admin/FileUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import type { Extracurricular } from '@/types';

const CATEGORIES = ['Olahraga', 'Seni', 'Akademik', 'Kebangsaan'];

const EMPTY_FORM = {
  name: '',
  category: 'Olahraga',
  coach: '',
  schedule: '',
  description: '',
  cover_url: '',
};

export default function AdminExtracurricular() {
  const { toasts, success, error, dismiss } = useToast();
  const [list, setList] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Extracurricular | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('extracurriculars')
        .select('*')
        .order('sort_order', { ascending: true });
      setList(data ?? []);
      setLoading(false);
    })();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const openEdit = (e: Extracurricular) => {
    setEditing(e);
    setForm({
      name: e.name,
      category: e.category,
      coach: e.coach ?? '',
      schedule: e.schedule ?? '',
      description: e.description ?? '',
      cover_url: e.cover_url ?? '',
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      error('Nama ekstrakurikuler wajib diisi.');
      return;
    }
    setSaving(true);
    if (editing?.id) {
      const data = await adminUpdate<Extracurricular>('extracurriculars', editing.id, { ...form });
      setSaving(false);
      if (data) {
        setList((prev) => prev.map((e) => (e.id === editing.id ? data : e)));
        setShowForm(false);
        setEditing(null);
        setForm({ ...EMPTY_FORM });
        success('Ekstrakurikuler berhasil diperbarui.');
      } else {
        error('Gagal memperbarui ekstrakurikuler. Coba lagi.');
      }
    } else {
      const order = (list[list.length - 1]?.sort_order ?? 0) + 1;
      const data = await adminInsert<Extracurricular>('extracurriculars', {
        ...form,
        sort_order: order,
        is_active: true,
      });
      setSaving(false);
      if (data) {
        setList((prev) => [...prev, data]);
        setShowForm(false);
        setEditing(null);
        setForm({ ...EMPTY_FORM });
        success('Ekstrakurikuler baru berhasil ditambahkan.');
      } else {
        error('Gagal menambahkan ekstrakurikuler. Coba lagi.');
      }
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus ekstrakurikuler ini?')) return;
    const ok = await adminDelete('extracurriculars', id);
    setList((prev) => prev.filter((e) => e.id !== id));
    if (ok) success('Ekstrakurikuler dihapus.');
    else error('Gagal menghapus ekstrakurikuler.');
  };

  const toggle = async (e: Extracurricular) => {
    const newVal = !e.is_active;
    setList((prev) => prev.map((x) => (x.id === e.id ? { ...x, is_active: newVal } : x)));
    const result = await adminUpdate('extracurriculars', e.id, { is_active: newVal });
    if (!result) error('Gagal mengubah status ekstrakurikuler.');
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader
        title="Kelola Ekstrakurikuler"
        subtitle="Tambah, edit, atau hapus kegiatan ekstrakurikuler"
        action={
          <AdminButton onClick={openAdd}>
            <Plus className="w-4 h-4" /> Tambah Ekskul
          </AdminButton>
        }
      />

      <AdminCard>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat data...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada ekstrakurikuler.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((e) => (
              <div key={e.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-32 bg-gray-100">
                  {e.cover_url ? (
                    <img src={e.cover_url} alt={e.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      Tanpa Foto
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {e.category}
                    </span>
                    <AdminToggle checked={e.is_active} onChange={() => toggle(e)} />
                  </div>
                  <h3 className="font-bold text-gray-900">{e.name}</h3>
                  {e.coach && <p className="text-xs text-gray-500 mt-0.5">Pembina: {e.coach}</p>}
                  {e.schedule && <p className="text-xs text-gray-500">Jadwal: {e.schedule}</p>}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEdit(e)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => remove(e.id)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editing ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler'}
            </h2>
            <div className="space-y-4">
              <AdminInput
                label="Nama Ekskul"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Pramuka, Paskibra, PMR, Futsal..."
                required
              />
              <div>
                <label className="label-field">Kategori</label>
                <select
                  className="input-field"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <AdminInput
                label="Pembina / Pelatih"
                value={form.coach}
                onChange={(v) => setForm({ ...form, coach: v })}
              />
              <AdminInput
                label="Jadwal Latihan"
                value={form.schedule}
                onChange={(v) => setForm({ ...form, schedule: v })}
                placeholder="Setiap Jumat 15.00-16.30"
              />
              <AdminTextarea
                label="Deskripsi"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                rows={3}
              />
              <FileUpload
                label="Foto Kegiatan"
                value={form.cover_url}
                onChange={(v) => setForm({ ...form, cover_url: v })}
                aspectClass="w-full h-32"
              />
            </div>
            <div className="flex gap-2 mt-6">
              <AdminButton onClick={save} variant="success" disabled={saving}>
                {saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah'}
              </AdminButton>
              <AdminButton onClick={() => setShowForm(false)} variant="secondary">
                Batal
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
