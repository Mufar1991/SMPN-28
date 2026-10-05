import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminInput, AdminTextarea, AdminToggle } from '@/components/admin/AdminUI';
import FileUpload from '@/components/admin/FileUpload';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2, Edit3, X } from 'lucide-react';
import type { NewsItem } from '@/types';

const EMPTY = { title: '', slug: '', content: '', excerpt: '', image_url: '', category: 'Berita', is_published: true };

export default function AdminNews() {
  const { toasts, success, error, dismiss } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('news').select('*').order('published_at', { ascending: false });
      setNews(data ?? []);
      setLoading(false);
    })();
  }, []);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const startAdd = () => { setEditing({} as NewsItem); setForm(EMPTY); };
  const startEdit = (n: NewsItem) => {
    setEditing(n);
    setForm({ title: n.title, slug: n.slug, content: n.content ?? '', excerpt: n.excerpt ?? '', image_url: n.image_url ?? '', category: n.category, is_published: n.is_published });
  };

  const save = async () => {
    if (!form.title.trim()) {
      error('Judul berita wajib diisi.');
      return;
    }
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    if (editing?.id) {
      const data = await adminUpdate<NewsItem>('news', editing.id, { ...form, slug });
      setSaving(false);
      if (data) {
        setNews((prev) => prev.map(n => n.id === editing.id ? data : n));
        setEditing(null);
        success('Berita berhasil diperbarui.');
      } else {
        error('Gagal memperbarui berita. Coba lagi.');
      }
    } else {
      const data = await adminInsert<NewsItem>('news', { ...form, slug });
      setSaving(false);
      if (data) {
        setNews((prev) => [data, ...prev]);
        setEditing(null);
        success('Berita berhasil ditambahkan.');
      } else {
        error('Gagal menambahkan berita. Coba lagi.');
      }
    }
  };

  const remove = async (id: string) => {
    const ok = await adminDelete('news', id);
    setNews((prev) => prev.filter(n => n.id !== id));
    if (ok) success('Berita dihapus.');
    else error('Gagal menghapus berita.');
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader title="Kelola Berita & Agenda" subtitle="Tambah, edit, atau hapus berita" action={<AdminButton onClick={startAdd}><Plus className="w-4 h-4" /> Tambah Berita</AdminButton>} />

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setEditing(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Tutup"><X className="w-5 h-5" /></button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editing.id ? 'Edit' : 'Tambah'} Berita</h2>
            <div className="grid gap-4">
              <AdminInput label="Judul" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <AdminInput label="Slug (URL)" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="otomatis dari judul" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Kategori</label>
                  <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {['Berita', 'Pengumuman', 'Prestasi', 'Kegiatan', 'Agenda'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <FileUpload label="Gambar Berita" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} aspectClass="w-full h-32" />
              <AdminTextarea label="Ringkasan" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} rows={2} />
              <AdminTextarea label="Konten Lengkap" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={6} />
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
        ) : news.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada berita.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((n) => (
              <div key={n.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-32 overflow-hidden bg-gray-100">
                  {n.image_url && <img src={n.image_url} alt={n.title} className="w-full h-full object-cover" />}
                </div>
                <div className="p-3">
                  <span className="badge bg-blue-100 text-blue-700 mb-1">{n.category}</span>
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{n.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => startEdit(n)} className="text-blue-700 hover:underline text-xs flex items-center gap-1"><Edit3 className="w-3 h-3" /> Edit</button>
                    <button onClick={() => remove(n.id)} className="text-red-500 hover:underline text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" /> Hapus</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
