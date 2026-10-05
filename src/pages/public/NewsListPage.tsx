import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function NewsListPage() {
  const { news } = useData();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(news.map((n) => n.category)))];
  const filtered = news.filter((n) => {
    const matchCat = cat === 'Semua' || n.category === cat;
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Berita & Agenda</h1>
          <p className="text-gray-500">Informasi terbaru seputar kegiatan sekolah</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat === c ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Tidak ada berita ditemukan.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((n) => (
              <Link to={`/berita/${n.slug}`} key={n.id} className="card group">
                <div className="h-48 overflow-hidden">
                  <img src={n.image_url ?? ''} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-blue-100 text-blue-700">{n.category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(n.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{n.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{n.excerpt}</p>
                  <span className="text-blue-700 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
