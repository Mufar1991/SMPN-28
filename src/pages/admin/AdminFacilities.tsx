import { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminUI';
import FileUpload from '@/components/admin/FileUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import type { Facility } from '@/types';

const EMPTY = { name: '', description: '', image_url: '', icon_name: 'Building2' };
const ICON_OPTIONS = ['Building2', 'School', 'FlaskConical', 'Monitor', 'BookOpen', 'Dumbbell', 'Users', 'Library', 'Wifi', 'Coffee', 'Music', 'Camera'];

export default function AdminFacilities() {
  const { toasts, success, error, dismiss } = useToast();
  const [list, setList] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Facility | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('facilities').select('*').order('sort_order', { ascending: true });
      setList(data ?? []);
      setLoading(false);
    })();
  }, []);

  const startAdd = () => { setEditing({} as Facility); setForm(EMPTY); };
  const startEdit = (f: Facility) => {
    setEditing(f);
    setForm({ name: f.name, description: f.description ?? '', image_url: f.image_url ?? '', icon_name: f.icon_name ?? 'Building2' });
  };

  const save = async () => {
    if (!form.name.trim()) {
      error('Nama fasilitas wajib diisi.');
      return;
    }
    setSaving(true);
    if (editing?.id) {
      const data = await adminUpdate<Facility>('facilities', editing.id, form);
      setSaving(false);
      if (data) {
        setList((prev) => prev.map(f => f.id === editing.id ? data : f));
        setEditing(null);
        success('Fasilitas berhasil diperbarui.');
      } else {
        error('Gagal memperbarui fasilitas. Coba lagi.');
      }
    } else {
      const order = (list[list.length - 1]?.sort_order ?? 0) + 1;
      const data = await adminInsert<Facility>('facilities', { ...form, sort_order: order, is_active: true });
      setSaving(false);
      if (data) {
        setList((prev) => [...prev, data]);
        setEditing(null);
        success('Fasilitas baru berhasil ditambahkan.');
      } else {
        error('Gagal menambahkan fasilitas. Coba lagi.');
      }
    }
  };

  const remove = async (id: string) => {
    const ok = await adminDelete('facilities', id);
    setList((prev) => prev.filter(f => f.id !== id));
    if (ok) success('Fasilitas dihapus.');
    else error('Gagal menghapus fasilitas.');
  };

  const toggle = async (f: Facility) => {
    const newVal = !f.is_active;
    setList((prev) => prev.map(x => x.id === f.id ? { ...x, is_active: newVal } : x));
    const result = await adminUpdate('facilities', f.id, { is_active: newVal });
    if (!result) error('Gagal mengubah status fasilitas.');
  };

  const getIcon = (name: string) => {
    const IconComp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
    return IconComp ?? Icons.Building2;
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader title="Kelola Fasilitas" subtitle="Sarana dan prasarana sekolah" action={<AdminButton onClick={startAdd}><Plus className="w-4 h-4" /> Tambah Fasilitas</AdminButton>} />

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Tutup"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing.id ? 'Edit' : 'Tambah'} Fasilitas</h2>
            <div className="grid gap-4">
              <AdminInput label="Nama Fasilitas" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <AdminTextarea label="Deskripsi" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
              <FileUpload label="Gambar Fasilitas" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} aspectClass="w-full h-32" />
              <div>
                <label className="label-field">Ikon</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((name) => {
                    const Icon = getIcon(name);
                    return (
                      <button key={name} type="button" onClick={() => setForm({ ...form, icon_name: name })}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${form.icon_name === name ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
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
          <p className="text-gray-500 text-center py-8">Belum ada fasilitas.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((f) => {
              const Icon = getIcon(f.icon_name ?? 'Building2');
              return (
                <div key={f.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">{f.name}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{f.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => startEdit(f)} className="text-blue-700 text-xs"><Edit3 className="w-3.5 h-3.5" /></button>
                        <label className="cursor-pointer"><AdminToggle checked={f.is_active} onChange={() => toggle(f)} /></label>
                        <button onClick={() => remove(f.id)} className="text-red-500 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
