import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminInput, AdminToggle } from '@/components/admin/AdminUI';
import FileUpload from '@/components/admin/FileUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2 } from 'lucide-react';
import type { HeroSlide } from '@/types';

const EMPTY = { title: '', subtitle: '', tagline: '', image_url: '' };

export default function AdminHero() {
  const { toasts, success, error, dismiss } = useToast();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
      setSlides(data ?? []);
      setLoading(false);
    })();
  }, []);

  const add = async () => {
    if (!adding.title.trim()) {
      error('Judul slide wajib diisi.');
      return;
    }
    if (!adding.image_url) {
      error('Gambar banner wajib diunggah.');
      return;
    }
    setSaving(true);
    const order = (slides[slides.length - 1]?.sort_order ?? -1) + 1;
    const data = await adminInsert<HeroSlide>('hero_slides', {
      title: adding.title, subtitle: adding.subtitle, tagline: adding.tagline,
      image_url: adding.image_url, sort_order: order, is_active: true,
    });
    setSaving(false);
    if (data) {
      setSlides([...slides, data]);
      setAdding(EMPTY);
      success('Slide banner berhasil ditambahkan.');
    } else {
      error('Gagal menambahkan slide. Coba lagi.');
    }
  };

  const update = async (id: string, patch: Partial<HeroSlide>) => {
    setSlides((prev) => prev.map(s => s.id === id ? { ...s, ...patch } : s));
    const result = await adminUpdate('hero_slides', id, patch);
    if (result) {
      success('Perubahan slide tersimpan.');
    } else {
      error('Gagal menyimpan perubahan slide.');
    }
  };

  const remove = async (id: string) => {
    const ok = await adminDelete('hero_slides', id);
    setSlides((prev) => prev.filter(s => s.id !== id));
    if (ok) success('Slide dihapus.');
    else error('Gagal menghapus slide.');
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader title="Kelola Banner Hero" subtitle="Atur slide yang tampil di beranda" />

      {/* Add new */}
      <AdminCard className="mb-6">
        <h3 className="font-bold text-gray-900 mb-3">Tambah Slide Baru</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <AdminInput label="Judul" value={adding.title} onChange={(v) => setAdding({ ...adding, title: v })} required />
          <AdminInput label="Subjudul" value={adding.subtitle} onChange={(v) => setAdding({ ...adding, subtitle: v })} />
          <AdminInput label="Tagline" value={adding.tagline} onChange={(v) => setAdding({ ...adding, tagline: v })} />
        </div>
        <div className="mt-4">
          <FileUpload label="Gambar Banner" value={adding.image_url} onChange={(v) => setAdding({ ...adding, image_url: v })} aspectClass="w-full h-32" />
        </div>
        <div className="mt-4">
          <AdminButton onClick={add} disabled={saving}>
            <Plus className="w-4 h-4" /> {saving ? 'Menyimpan...' : 'Tambah Slide'}
          </AdminButton>
        </div>
      </AdminCard>

      {/* List */}
      {loading ? (
        <p className="text-gray-500 text-center py-8">Memuat...</p>
      ) : slides.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Belum ada slide.</p>
      ) : (
        <div className="space-y-4">
          {slides.map((s) => (
            <AdminCard key={s.id}>
              <div className="flex items-start gap-4">
                <img src={s.image_url ?? ''} alt={s.title} className="w-32 h-20 object-cover rounded-lg shrink-0 bg-gray-100" />
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <AdminInput label="Judul" value={s.title} onChange={(v) => update(s.id, { title: v })} />
                  <AdminInput label="Subjudul" value={s.subtitle ?? ''} onChange={(v) => update(s.id, { subtitle: v })} />
                  <AdminInput label="Tagline" value={s.tagline ?? ''} onChange={(v) => update(s.id, { tagline: v })} />
                </div>
                <div className="md:col-span-2">
                  <FileUpload label="Gambar Banner" value={s.image_url ?? ''} onChange={(v) => update(s.id, { image_url: v })} aspectClass="w-full h-28" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <AdminToggle checked={s.is_active} onChange={(v) => update(s.id, { is_active: v })} label="Aktif" />
                  <button onClick={() => remove(s.id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
