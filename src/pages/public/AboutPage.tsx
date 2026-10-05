import { Award, Target, Eye, History } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function AboutPage() {
  const { profile } = useData();
  const misiList = profile?.misi ?? [];

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Profil Sekolah</h1>
          <p className="text-gray-500">Mengenal lebih dekat SMP Negeri 28 Kota Pontianak</p>
        </div>

        {/* Akreditasi */}
        {profile?.accreditation_status && (
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-8 text-white mb-10 flex items-center gap-6">
            <Award className="w-16 h-16 text-yellow-400 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold">{profile.accreditation_status}</h2>
              <p className="text-blue-200">{profile.accreditation_subtitle}</p>
            </div>
          </div>
        )}

        {/* Sejarah */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-6 h-6 text-blue-700" />
              <h2 className="text-2xl font-bold text-gray-900">Sejarah / Perjalanan Kami</h2>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {profile?.history_text ?? 'Sejarah sekolah belum tersedia.'}
            </p>
          </div>
          <div>
            <img
              src={profile?.history_image_url ?? 'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg?auto=compress&cs=tinysrgb&w=800'}
              alt="Gedung Sekolah"
              className="rounded-2xl shadow-lg w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Visi */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-6 h-6 text-blue-700" />
            <h2 className="text-2xl font-bold text-gray-900">Visi</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed italic">
            {profile?.visi ?? 'Visi sekolah belum tersedia.'}
          </p>
        </div>

        {/* Misi */}
        <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-green-700" />
            <h2 className="text-2xl font-bold text-gray-900">Misi</h2>
          </div>
          <ul className="space-y-3">
            {misiList.length > 0 ? (
              misiList.map((m, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{m}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Misi sekolah belum tersedia.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
