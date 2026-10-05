import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Megaphone, Newspaper, Users, TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminCard } from '@/components/admin/AdminUI';
import type { SpmbApplication } from '@/types';

export default function AdminDashboard() {
  const [apps, setApps] = useState<SpmbApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('spmb_applications').select('*').order('registered_at', { ascending: false });
      setApps(data ?? []);
      setLoading(false);
    })();
  }, []);

  const stats = [
    { label: 'Total Pendaftar', value: apps.length, icon: GraduationCap, color: 'blue' },
    { label: 'Menunggu Verifikasi', value: apps.filter(a => a.status === 'Menunggu').length, icon: Clock, color: 'yellow' },
    { label: 'Diterima', value: apps.filter(a => a.status === 'Diterima').length, icon: CheckCircle2, color: 'green' },
    { label: 'Berkas Ditolak', value: apps.filter(a => a.status === 'Ditolak').length, icon: AlertCircle, color: 'red' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan statistik dan pendaftaran terbaru</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <AdminCard key={i} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[s.color]}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Recent registrations */}
      <AdminCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-700" /> Pendaftar Terbaru
          </h2>
          <Link to="/admin/spmb-data" className="text-sm text-blue-700 font-medium hover:underline">Lihat Semua</Link>
        </div>
        {apps.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">Belum ada pendaftar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="py-2 px-3">No. Daftar</th>
                  <th className="py-2 px-3">Nama</th>
                  <th className="py-2 px-3">Jalur</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {apps.slice(0, 5).map((a) => (
                  <tr key={a.id} className="border-b border-gray-100">
                    <td className="py-2 px-3 font-mono text-xs">{a.registration_number ?? '-'}</td>
                    <td className="py-2 px-3 font-medium text-gray-900">{a.full_name}</td>
                    <td className="py-2 px-3">{a.registration_path ?? '-'}</td>
                    <td className="py-2 px-3">
                      <span className={`badge ${
                        a.status === 'Diterima' ? 'bg-green-100 text-green-700' :
                        a.status === 'Ditolak' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{a.status}</span>
                    </td>
                    <td className="py-2 px-3 text-gray-500">{new Date(a.registered_at).toLocaleDateString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
