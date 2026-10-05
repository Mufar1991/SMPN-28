import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';
import { adminUpdate } from '@/lib/adminApi';
import { AdminCard, AdminHeader, AdminButton } from '@/components/admin/AdminUI';
import { useToast, ToastContainer } from '@/components/admin/Toast';
import { Download, Eye, X, Filter } from 'lucide-react';
import type { SpmbApplication, SpmbDocumentField } from '@/types';

const SPMB_STORAGE_KEY = 'smpn28_spmb_data_v1';

export default function AdminSpmbData() {
  const { toasts, success, error, dismiss } = useToast();
  const [apps, setApps] = useState<SpmbApplication[]>(() => {
    try {
      const raw = localStorage.getItem(SPMB_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as SpmbApplication[];
    } catch { /* ignore */ }
    return [];
  });
  const [docFields, setDocFields] = useState<SpmbDocumentField[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SpmbApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState('Semua');

  useEffect(() => {
    (async () => {
      const [a, d] = await Promise.all([
        supabase.from('spmb_applications').select('*').order('registered_at', { ascending: false }),
        supabase.from('spmb_document_fields').select('*').order('sort_order', { ascending: true }),
      ]);
      const appsData = (a.data ?? []) as SpmbApplication[];
      setApps(appsData);
      setDocFields(d.data ?? []);
      setLoading(false);
      try { localStorage.setItem(SPMB_STORAGE_KEY, JSON.stringify(appsData)); } catch { /* ignore */ }
    })();
  }, []);

  const persistApps = (next: SpmbApplication[]) => {
    setApps(next);
    try { localStorage.setItem(SPMB_STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const filtered = statusFilter === 'Semua' ? apps : apps.filter(a => a.status === statusFilter);

  const updateStatus = async (id: string, status: string) => {
    const result = await adminUpdate<SpmbApplication>('spmb_applications', id, { status });
    if (result) {
      persistApps(apps.map(a => a.id === id ? result : a));
      success(`Status pendaftar berhasil diubah menjadi "${status}".`);
    } else {
      error('Gagal mengubah status. Coba lagi.');
    }
    setSelected(null);
  };

  const exportExcel = () => {
    const rows = filtered.map((a, i) => {
      const docs: Record<string, string> = a.documents ?? {};
      const docLinks = docFields.map(f => `${f.label}: ${docs[f.id] ?? '-'}`).join('\n');
      return {
        'No': i + 1,
        'No. Pendaftaran': a.registration_number ?? '',
        'Nama Lengkap': a.full_name,
        'NISN': a.nisn ?? '',
        'Tempat Lahir': a.birth_place ?? '',
        'Tanggal Lahir': a.birth_date ?? '',
        'Jenis Kelamin': a.gender ?? '',
        'Agama': a.religion ?? '',
        'Alamat': a.address ?? '',
        'No HP Siswa': a.phone_student ?? '',
        'Nama Ayah': a.father_name ?? '',
        'Pekerjaan Ayah': a.father_job ?? '',
        'Penghasilan Ayah': a.father_income ?? '',
        'Pendidikan Ayah': a.father_education ?? '',
        'Nama Ibu': a.mother_name ?? '',
        'Pekerjaan Ibu': a.mother_job ?? '',
        'Penghasilan Ibu': a.mother_income ?? '',
        'Pendidikan Ibu': a.mother_education ?? '',
        'Nama Wali': a.guardian_name ?? '',
        'No HP Wali': a.guardian_phone ?? '',
        'Tinggi (cm)': a.height_cm ?? '',
        'Berat (kg)': a.weight_kg ?? '',
        'Lingkar Kepala (cm)': a.head_circumference_cm ?? '',
        'No KIP': a.kip_number ?? '',
        'No KIS': a.kis_number ?? '',
        'No KKS': a.kks_number ?? '',
        'Sekolah Asal': a.previous_school ?? '',
        'No STTB': a.sttb_number ?? '',
        'Prestasi/Nilai': a.achievements ?? '',
        'Jalur Pendaftaran': a.registration_path ?? '',
        'Dokumen (URL)': docLinks,
        'Status Pendaftaran': a.status,
        'Tanggal Daftar': new Date(a.registered_at).toLocaleString('id-ID'),
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = Object.keys(rows[0] ?? {}).map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data SPMB');
    XLSX.writeFile(wb, `Data_SPMB_SMPN28_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      <AdminHeader
        title="Data SPMB"
        subtitle="Daftar pendaftar peserta didik baru"
        action={<AdminButton onClick={exportExcel} variant="success"><Download className="w-4 h-4" /> Export Excel</AdminButton>}
      />

      <AdminCard className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {['Semua', 'Menunggu', 'Diterima', 'Ditolak'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusFilter === s ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{s}</button>
          ))}
          <span className="text-sm text-gray-500 ml-auto">Total: {filtered.length} pendaftar</span>
        </div>
      </AdminCard>

      <AdminCard>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Memuat data...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada pendaftar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 px-3">No. Daftar</th>
                  <th className="py-2 px-3">Nama</th>
                  <th className="py-2 px-3">NISN</th>
                  <th className="py-2 px-3">Jalur</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-mono text-xs">{a.registration_number ?? '-'}</td>
                    <td className="py-2 px-3 font-medium text-gray-900">{a.full_name}</td>
                    <td className="py-2 px-3">{a.nisn ?? '-'}</td>
                    <td className="py-2 px-3">{a.registration_path ?? '-'}</td>
                    <td className="py-2 px-3">
                      <span className={`badge ${
                        a.status === 'Diterima' ? 'bg-green-100 text-green-700' :
                        a.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{a.status}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-500">{new Date(a.registered_at).toLocaleDateString('id-ID')}</td>
                    <td className="py-2 px-3">
                      <button onClick={() => setSelected(a)} className="text-blue-700 hover:underline flex items-center gap-1 text-xs font-medium">
                        <Eye className="w-4 h-4" /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Tutup">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{selected.full_name}</h2>
            <p className="text-sm text-gray-500 mb-4">{selected.registration_number} - {selected.registration_path}</p>

            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <Field label="NISN" value={selected.nisn} />
              <Field label="Tempat/Tgl Lahir" value={`${selected.birth_place ?? '-'}, ${selected.birth_date ?? '-'}`} />
              <Field label="Jenis Kelamin" value={selected.gender} />
              <Field label="Agama" value={selected.religion} />
              <Field label="No HP Siswa" value={selected.phone_student} />
              <Field label="Alamat" value={selected.address} />
              <Field label="Nama Ayah" value={selected.father_name} />
              <Field label="Pekerjaan Ayah" value={selected.father_job} />
              <Field label="Penghasilan Ayah" value={selected.father_income} />
              <Field label="Pendidikan Ayah" value={selected.father_education} />
              <Field label="Nama Ibu" value={selected.mother_name} />
              <Field label="Pekerjaan Ibu" value={selected.mother_job} />
              <Field label="Penghasilan Ibu" value={selected.mother_income} />
              <Field label="Pendidikan Ibu" value={selected.mother_education} />
              <Field label="Nama Wali" value={selected.guardian_name} />
              <Field label="No HP Wali" value={selected.guardian_phone} />
              <Field label="Tinggi (cm)" value={String(selected.height_cm ?? '-')} />
              <Field label="Berat (kg)" value={String(selected.weight_kg ?? '-')} />
              <Field label="Lingkar Kepala (cm)" value={String(selected.head_circumference_cm ?? '-')} />
              <Field label="No KIP" value={selected.kip_number} />
              <Field label="No KIS" value={selected.kis_number} />
              <Field label="No KKS" value={selected.kks_number} />
              <Field label="Sekolah Asal" value={selected.previous_school} />
              <Field label="No STTB" value={selected.sttb_number} />
              <Field label="Prestasi" value={selected.achievements} />
            </div>

            {/* Documents */}
            <h3 className="font-bold text-gray-900 mb-2">Dokumen Diunggah</h3>
            <div className="space-y-2 mb-6">
              {docFields.map((f) => {
                const url = selected.documents?.[f.id];
                return (
                  <div key={f.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <span className="text-gray-700">{f.label}</span>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Lihat File</a>
                    ) : (
                      <span className="text-gray-400">Tidak ada</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status actions */}
            <div className="flex gap-2 border-t border-gray-100 pt-4">
              <AdminButton onClick={() => updateStatus(selected.id, 'Diterima')} variant="success">Terima</AdminButton>
              <AdminButton onClick={() => updateStatus(selected.id, 'Ditolak')} variant="danger">Tolak</AdminButton>
              <AdminButton onClick={() => updateStatus(selected.id, 'Menunggu')} variant="secondary">Reset</AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-gray-800">{value ?? '-'}</p>
    </div>
  );
}
