import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { adminUpdate } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminInput, AdminToggle, AdminSection, SaveBar } from '@/components/admin/AdminUI';
import type { ContactSettings } from '@/types';

export default function AdminContact() {
  const [data, setData] = useState<ContactSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data: d } = await supabase.from('contact_settings').select('*').maybeSingle();
      if (d) setData(d as ContactSettings);
    })();
  }, []);

  const update = (patch: Partial<ContactSettings>) => setData((d) => d ? { ...d, ...patch } : d);

  const save = async () => {
    if (!data) return;
    setSaving(true);
    setMsg('');
    const result = await adminUpdate<ContactSettings>('contact_settings', data.id, {
      address: data.address, phone: data.phone, email: data.email, operating_hours: data.operating_hours,
      instagram_url: data.instagram_url, facebook_url: data.facebook_url, youtube_url: data.youtube_url, tiktok_url: data.tiktok_url,
      maps_embed_url: data.maps_embed_url, maps_enabled: data.maps_enabled,
    });
    setSaving(false);
    setMsg(result ? 'Berhasil disimpan!' : 'Gagal menyimpan.');
    setTimeout(() => setMsg(''), 3000);
  };

  if (!data) return <p className="text-gray-500 text-center py-8">Memuat...</p>;

  return (
    <div>
      <AdminHeader title="Kelola Kontak, Medsos & Peta" subtitle="Atur informasi kontak dan lokasi sekolah" />
      <AdminCard>
        <AdminSection title="Informasi Kontak">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label-field">Alamat</label>
              <textarea className="input-field" rows={2} value={data.address ?? ''} onChange={(e) => update({ address: e.target.value })} />
            </div>
            <AdminInput label="Nomor Telepon" value={data.phone ?? ''} onChange={(v) => update({ phone: v })} />
            <AdminInput label="Email" value={data.email ?? ''} onChange={(v) => update({ email: v })} />
            <div className="md:col-span-2">
              <AdminInput label="Jam Operasional" value={data.operating_hours ?? ''} onChange={(v) => update({ operating_hours: v })} />
            </div>
          </div>
        </AdminSection>

        <AdminSection title="Media Sosial">
          <div className="grid md:grid-cols-2 gap-4">
            <AdminInput label="Instagram URL" value={data.instagram_url ?? ''} onChange={(v) => update({ instagram_url: v })} placeholder="https://instagram.com/..." />
            <AdminInput label="Facebook URL" value={data.facebook_url ?? ''} onChange={(v) => update({ facebook_url: v })} placeholder="https://facebook.com/..." />
            <AdminInput label="YouTube URL" value={data.youtube_url ?? ''} onChange={(v) => update({ youtube_url: v })} placeholder="https://youtube.com/..." />
            <AdminInput label="TikTok URL" value={data.tiktok_url ?? ''} onChange={(v) => update({ tiktok_url: v })} placeholder="https://tiktok.com/..." />
          </div>
        </AdminSection>

        <AdminSection title="Google Maps Embed">
          <div className="mb-4">
            <AdminToggle checked={data.maps_enabled} onChange={(v) => update({ maps_enabled: v })} label="Tampilkan peta di situs publik" />
          </div>
          <AdminInput label="Google Maps Embed Link" value={data.maps_embed_url ?? ''} onChange={(v) => update({ maps_embed_url: v })} placeholder="https://maps.google.com/maps?q=...&output=embed" />
          <button
            type="button"
            onClick={() => update({ maps_embed_url: "https://maps.google.com/maps?q=-0.01,109.3338&z=15&output=embed" })}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            Gunakan URL default
          </button>
          {(data.maps_embed_url || "https://maps.google.com/maps?q=-0.01,109.3338&z=15&output=embed") && (
            <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
              <iframe
                src={data.maps_embed_url || "https://maps.google.com/maps?q=-0.01,109.3338&z=15&output=embed"}
                title="Preview Peta"
                className="w-full h-48 md:h-64 rounded-xl border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </AdminSection>

        {msg && <p className={`text-sm mb-4 ${msg.includes('Gagal') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
        <SaveBar onSave={save} saving={saving} />
      </AdminCard>
    </div>
  );
}
