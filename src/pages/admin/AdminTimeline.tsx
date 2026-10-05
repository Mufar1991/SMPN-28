import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminInsert, adminUpdate, adminDelete } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton, AdminToggle } from '@/components/admin/AdminUI';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Plus, Trash2 } from 'lucide-react';
import type { SpmbRequirement, SpmbTimeline } from '@/types';

export default function AdminTimeline() {
  const { toasts, success, error, dismiss } = useToast();
  const [reqs, setReqs] = useState<SpmbRequirement[]>([]);
  const [timeline, setTimeline] = useState<SpmbTimeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingReq, setAddingReq] = useState(false);
  const [addingTimeline, setAddingTimeline] = useState(false);

  useEffect(() => {
    (async () => {
      const [r, t] = await Promise.all([
        supabase.from('spmb_requirements').select('*').order('sort_order', { ascending: true }),
        supabase.from('spmb_timeline').select('*').order('step_number', { ascending: true }),
      ]);
      setReqs(r.data ?? []);
      setTimeline(t.data ?? []);
      setLoading(false);
    })();
  }, []);

  // Requirements
  const addReq = async () => {
    setAddingReq(true);
    const order = (reqs[reqs.length - 1]?.sort_order ?? 0) + 1;
    const data = await adminInsert<SpmbRequirement>('spmb_requirements', { content: 'Persyaratan baru', sort_order: order, is_active: true });
    setAddingReq(false);
    if (data) {
      setReqs([...reqs, data]);
      success('Persyaratan baru berhasil ditambahkan.');
    } else {
      error('Gagal menambahkan persyaratan. Coba lagi.');
    }
  };
  const updateReq = async (id: string, patch: Partial<SpmbRequirement>) => {
    setReqs((prev) => prev.map(r => r.id === id ? { ...r, ...patch } : r));
    await adminUpdate('spmb_requirements', id, patch);
  };
  const removeReq = async (id: string) => {
    const ok = await adminDelete('spmb_requirements', id);
    setReqs((prev) => prev.filter(r => r.id !== id));
    if (ok) success('Persyaratan dihapus.');
    else error('Gagal menghapus persyaratan.');
  };

  // Timeline
  const addTimeline = async () => {
    setAddingTimeline(true);
    const step = (timeline[timeline.length - 1]?.step_number ?? 0) + 1;
    const data = await adminInsert<SpmbTimeline>('spmb_timeline', { step_number: step, title: 'Tahap Baru', date_range: '', description: '', is_active: true });
    setAddingTimeline(false);
    if (data) {
      setTimeline([...timeline, data]);
      success('Tahap timeline baru berhasil ditambahkan.');
    } else {
      error('Gagal menambahkan tahap timeline. Coba lagi.');
    }
  };
  const updateTimeline = async (id: string, patch: Partial<SpmbTimeline>) => {
    setTimeline((prev) => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    await adminUpdate('spmb_timeline', id, patch);
  };
  const removeTimeline = async (id: string) => {
    const ok = await adminDelete('spmb_timeline', id);
    setTimeline((prev) => prev.filter(t => t.id !== id));
    if (ok) success('Tahap timeline dihapus.');
    else error('Gagal menghapus tahap timeline.');
  };

  if (loading) return <p className="text-gray-500 text-center py-8">Memuat...</p>;

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader title="Kelola Timeline & Syarat SPMB" subtitle="Atur persyaratan dan jadwal pendaftaran" />

      {/* Requirements */}
      <AdminCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Persyaratan SPMB</h2>
          <AdminButton onClick={addReq} variant="secondary" disabled={addingReq}><Plus className="w-4 h-4" /> {addingReq ? 'Menambah...' : 'Tambah Syarat'}</AdminButton>
        </div>
        <div className="space-y-2">
          {reqs.map((r) => (
            <div key={r.id} className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
              <input className="input-field flex-1" value={r.content} onChange={(e) => updateReq(r.id, { content: e.target.value })} />
              <AdminToggle checked={r.is_active} onChange={(v) => updateReq(r.id, { is_active: v })} />
              <button onClick={() => removeReq(r.id)} className="text-red-500 p-1" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
          {reqs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Belum ada persyaratan.</p>}
        </div>
      </AdminCard>

      {/* Timeline */}
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Jadwal / Timeline SPMB</h2>
          <AdminButton onClick={addTimeline} variant="secondary" disabled={addingTimeline}><Plus className="w-4 h-4" /> {addingTimeline ? 'Menambah...' : 'Tambah Tahap'}</AdminButton>
        </div>
        <div className="space-y-3">
          {timeline.map((t) => (
            <div key={t.id} className="border border-gray-200 rounded-lg p-4 grid md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-1">
                <label className="label-field">Step</label>
                <input type="number" className="input-field" value={t.step_number} onChange={(e) => updateTimeline(t.id, { step_number: parseInt(e.target.value) || 1 })} />
              </div>
              <div className="md:col-span-3">
                <label className="label-field">Judul</label>
                <input className="input-field" value={t.title} onChange={(e) => updateTimeline(t.id, { title: e.target.value })} />
              </div>
              <div className="md:col-span-3">
                <label className="label-field">Rentang Tanggal</label>
                <input className="input-field" value={t.date_range} onChange={(e) => updateTimeline(t.id, { date_range: e.target.value })} placeholder="1 - 14 Juni 2025" />
              </div>
              <div className="md:col-span-4">
                <label className="label-field">Deskripsi</label>
                <input className="input-field" value={t.description ?? ''} onChange={(e) => updateTimeline(t.id, { description: e.target.value })} />
              </div>
              <div className="md:col-span-1 flex items-end gap-1 pb-1">
                <AdminToggle checked={t.is_active} onChange={(v) => updateTimeline(t.id, { is_active: v })} />
                <button onClick={() => removeTimeline(t.id)} className="text-red-500 p-1" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {timeline.length === 0 && <p className="text-gray-500 text-sm text-center py-4">Belum ada timeline.</p>}
        </div>
      </AdminCard>
    </div>
  );
}
