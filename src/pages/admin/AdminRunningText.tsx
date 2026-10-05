import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminUpdate } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminInput, AdminToggle, AdminSection, SaveBar } from '@/components/admin/AdminUI';
import type { RunningText } from '@/types';

export default function AdminRunningText() {
  const [data, setData] = useState<RunningText | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from('running_text').select('*').maybeSingle();
      if (d) setData(d as RunningText);
    })();
  }, []);

  const update = (patch: Partial<RunningText>) => setData((d) => d ? { ...d, ...patch } : d);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setMsg('');
    const result = await adminUpdate<RunningText>('running_text', data.id, {
      is_enabled: data.is_enabled,
      content: data.content,
      link_url: data.link_url,
      link_label: data.link_label,
      bg_color: data.bg_color,
      text_color: data.text_color,
      speed: data.speed,
    });
    setSaving(false);
    setMsg(result ? 'Berhasil disimpan!' : 'Gagal menyimpan.');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!data) return <p className="text-gray-500">Memuat...</p>;

  return (
    <div>
      <AdminHeader title="Kelola Running Text" subtitle="Pengumuman berjalan di bagian atas website" />
      <AdminCard>
        <AdminSection title="Pengaturan Tampilan">
          <div className="mb-4">
            <AdminToggle checked={data.is_enabled} onChange={(v) => update({ is_enabled: v })} label="Tampilkan running text" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">Teks Pengumuman</label>
              <textarea className="input-field" rows={2} value={data.content} onChange={(e) => update({ content: e.target.value })} />
            </div>
            <AdminInput label="URL Tujuan (Opsional)" value={data.link_url ?? ''} onChange={(v) => update({ link_url: v })} placeholder="/spmb atau https://..." />
            <AdminInput label="Label Tombol" value={data.link_label ?? ''} onChange={(v) => update({ link_label: v })} placeholder="Daftar Sekarang" />
          </div>
        </AdminSection>

        <AdminSection title="Warna">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="label-field">Warna Latar</label>
              <div className="flex gap-2">
                <input type="color" className="w-12 h-10 rounded border border-gray-300" value={data.bg_color} onChange={(e) => update({ bg_color: e.target.value })} />
                <input className="input-field" value={data.bg_color} onChange={(e) => update({ bg_color: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label-field">Warna Teks</label>
              <div className="flex gap-2">
                <input type="color" className="w-12 h-10 rounded border border-gray-300" value={data.text_color} onChange={(e) => update({ text_color: e.target.value })} />
                <input className="input-field" value={data.text_color} onChange={(e) => update({ text_color: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="label-field">Preset Cepat</label>
              <div className="flex gap-1">
                <button onClick={() => update({ bg_color: '#dc2626', text_color: '#ffffff' })} className="w-8 h-8 rounded bg-red-600" title="Merah (Urgent)" />
                <button onClick={() => update({ bg_color: '#2563eb', text_color: '#ffffff' })} className="w-8 h-8 rounded bg-blue-600" title="Biru (Umum)" />
                <button onClick={() => update({ bg_color: '#d4a017', text_color: '#1f2937' })} className="w-8 h-8 rounded bg-yellow-600" title="Emas (SPMB)" />
              </div>
            </div>
          </div>
        </AdminSection>

        <AdminSection title="Kecepatan Scroll">
          <div className="flex gap-2">
            {(['slow', 'normal', 'fast'] as const).map((s) => (
              <button key={s} onClick={() => update({ speed: s })} className={`px-4 py-2 rounded-lg text-sm font-medium ${
                data.speed === s ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                {s === 'slow' ? 'Lambat' : s === 'normal' ? 'Normal' : 'Cepat'}
              </button>
            ))}
          </div>
        </AdminSection>

        {msg && <p className={`text-sm mb-4 ${msg.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
        <SaveBar onSave={save} saving={saving} />
      </AdminCard>
    </div>
  );
}
