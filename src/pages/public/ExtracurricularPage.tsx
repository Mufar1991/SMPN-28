import { useData } from '@/context/DataContext';
import { Trophy, Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORY_STYLES: Record<string, string> = {
  Olahraga: 'bg-green-100 text-green-700',
  Seni: 'bg-purple-100 text-purple-700',
  Akademik: 'bg-blue-100 text-blue-700',
  Kebangsaan: 'bg-red-100 text-red-700',
};

export default function ExtracurricularPage() {
  const { extracurriculars, loading } = useData();
  const active = extracurriculars.filter((e) => e.is_active);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Ekstrakurikuler</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Wadah pengembangan minat, bakat, dan karakter siswa SMP Negeri 28 Pontianak
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-gray-500 text-center py-12">Memuat data ekstrakurikuler...</p>
        ) : active.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Belum ada data ekstrakurikuler.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-44 overflow-hidden bg-gray-100">
                  {e.cover_url ? (
                    <img
                      src={e.cover_url}
                      alt={e.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Trophy className="w-12 h-12" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_STYLES[e.category] ?? 'bg-gray-100 text-gray-700'}`}
                    >
                      {e.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{e.name}</h3>
                  {e.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{e.description}</p>
                  )}
                  <div className="space-y-1.5 text-sm text-gray-500">
                    {e.coach && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>{e.coach}</span>
                      </div>
                    )}
                    {e.schedule && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{e.schedule}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/spmb"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors"
          >
            Daftar SPMB <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
