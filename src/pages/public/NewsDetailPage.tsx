import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function NewsDetailPage() {
  const { slug } = useParams();
  const { news } = useData();
  const item = news.find((n) => n.slug === slug);

  if (!item) return <Navigate to="/berita" replace />;

  const related = news.filter((n) => n.id !== item.id && n.category === item.category).slice(0, 3);

  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        <Link to="/berita" className="inline-flex items-center gap-1 text-blue-700 font-medium mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
        </Link>

        <span className="badge bg-blue-100 text-blue-700 mb-3">{item.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{item.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {item.image_url && (
          <img src={item.image_url} alt={item.title} className="rounded-2xl w-full h-80 object-cover mb-6" />
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {item.content}
        </div>

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Berita Terkait</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link to={`/berita/${r.slug}`} key={r.id} className="card group">
                  <div className="h-32 overflow-hidden">
                    <img src={r.image_url ?? ''} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-700">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
