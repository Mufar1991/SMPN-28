import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminUpdate } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminInput, AdminTextarea, AdminSection, SaveBar, AdminButton } from '@/components/admin/AdminUI';
import FileUpload from '@/components/admin/FileUpload';
import { Plus, Trash2, ArrowUp, ArrowDown, Shield } from 'lucide-react';
import type { ProfileSettings } from '@/types';

export default function AdminProfile() {
  const [data, setData] = useState<ProfileSettings | null>(null);
  const [misi, setMisi] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from('profile_settings').select('*').maybeSingle();
      if (d) {
        setData(d as ProfileSettings);
        setMisi(d.misi ?? []);
      }
    })();
  }, []);

  const update = (patch: Partial<ProfileSettings>) => setData((d) => d ? { ...d, ...patch } : d);

  const addMisi = () => setMisi([...misi, 'Misi baru']);
  const updateMisi = (i: number, val: string) => setMisi(misi.map((m, idx) => idx === i ? val : m));
  const removeMisi = (i: number) => setMisi(misi.filter((_, idx) => idx !== i));
  const moveMisi = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= misi.length) return;
    const next = [...misi];
    [next[i], next[j]] = [next[j], next[i]];
    setMisi(next);
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setMsg('');
    const result = await adminUpdate<ProfileSettings>('profile_settings', data.id, {
      accreditation_status: data.accreditation_status,
      accreditation_subtitle: data.accreditation_subtitle,
      visi: data.visi,
      misi: misi,
      history_text: data.history_text,
      history_image_url: data.history_image_url,
      spmb_label: data.spmb_label,
    });
    setSaving(false);
    setMsg(result ? 'Berhasil disimpan!' : 'Gagal menyimpan.');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!data) return <p className="text-gray-500 text-center py-8">Memuat...</p>;

  return (
    <div>
      <AdminHeader title="Pengaturan Profil & Label" subtitle="Visi, misi, sejarah, akreditasi, dan label SPMB" />

      <AdminCard className="mb-6">
        <AdminSection title="Akreditasi">
          <div className="grid md:grid-cols-2 gap-4">
            <AdminInput label="Status Akreditasi" value={data.accreditation_status ?? ''} onChange={(v) => update({ accreditation_status: v })} placeholder="Akreditasi A" />
            <AdminInput label="Subjudul Akreditasi" value={data.accreditation_subtitle ?? ''} onChange={(v) => update({ accreditation_subtitle: v })} placeholder="Terakreditasi Unggul oleh BAN-S/M" />
          </div>
        </AdminSection>

        <AdminSection title="Label SPMB / PPDB">
          <AdminInput label="Label Pendaftaran" value={data.spmb_label ?? ''} onChange={(v) => update({ spmb_label: v })} placeholder="SPMB" />
          <p className="text-xs text-gray-400 mt-1">Label ini akan tampil di seluruh halaman publik (navigasi, tombol, formulir).</p>
        </AdminSection>

        <AdminSection title="Sejarah Sekolah">
          <AdminTextarea label="Sejarah / Perjalanan Kami" value={data.history_text ?? ''} onChange={(v) => update({ history_text: v })} rows={6} />
          <div className="mt-3">
            <FileUpload label="Foto Sejarah / Gedung Sekolah" value={data.history_image_url ?? ''} onChange={(v) => update({ history_image_url: v })} aspectClass="w-full h-32" />
          </div>
        </AdminSection>

        <AdminSection title="Visi">
          <AdminTextarea label="Visi Sekolah" value={data.visi ?? ''} onChange={(v) => update({ visi: v })} rows={3} />
        </AdminSection>

        <AdminSection title="Misi">
          <div className="space-y-2 mb-3">
            {misi.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <input className="input-field flex-1" value={m} onChange={(e) => updateMisi(i, e.target.value)} />
                <button onClick={() => moveMisi(i, -1)} disabled={i === 0} className="text-gray-400 hover:text-blue-700 disabled:opacity-30 p-1" aria-label="Naik"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => moveMisi(i, 1)} disabled={i === misi.length - 1} className="text-gray-400 hover:text-blue-700 disabled:opacity-30 p-1" aria-label="Turun"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => removeMisi(i)} className="text-red-500 hover:text-red-700 p-1" aria-label="Hapus"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <AdminButton onClick={addMisi} variant="secondary"><Plus className="w-4 h-4" /> Tambah Misi</AdminButton>
        </AdminSection>

        {msg && <p className={`text-sm mb-4 ${msg.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
        <SaveBar onSave={save} saving={saving} />
      </AdminCard>

      {/* Credentials info */}
      <AdminCard>
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-gray-900">Kredensial Admin</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
          <p><strong>Username:</strong> smpn28ptk@.id</p>
          <p><strong>Password:</strong> smpn28ptk@</p>
          <p className="text-xs text-gray-400 mt-2">Kredensial ini digunakan untuk mengakses panel admin.</p>
        </div>
      </AdminCard>
    </div>
  );
}
