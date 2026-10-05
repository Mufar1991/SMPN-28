import { useData } from '@/context/DataContext';
import { BookOpen, Download, FileText } from 'lucide-react';

export default function ELearningPage() {
  const { elearning } = useData();
  const published = elearning.filter((e) => e.is_published);

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">E-Learning</h1>
          <p className="text-gray-500">Materi pembelajaran digital untuk siswa</p>
        </div>

        {published.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Belum ada materi tersedia.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((m) => (
              <div key={m.id} className="card p-6 group hover:border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0 group-hover:bg-blue-100 transition-colors">
                    {m.material_type === 'Quiz' || m.material_type === 'Kuis' ? <FileText className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <span className="badge bg-gray-100 text-gray-600 mb-1">{m.material_type}</span>
                    <h3 className="font-bold text-gray-900">{m.title}</h3>
                    {m.subject && <p className="text-sm text-blue-700">{m.subject}</p>}
                    {m.grade_level && <p className="text-xs text-gray-400">Kelas {m.grade_level}</p>}
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{m.description}</p>
                    {m.file_url && (
                      <a href={m.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-700 text-sm font-semibold mt-3 hover:underline">
                        <Download className="w-4 h-4" /> Unduh Materi
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
