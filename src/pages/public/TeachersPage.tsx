import { useData } from '@/context/DataContext';

export default function TeachersPage() {
  const { teachers } = useData();
  const active = teachers.filter((t) => t.is_active);

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Guru & Staf</h1>
          <p className="text-gray-500">Tenaga pendidik dan kependidikan profesional kami</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {active.map((t) => (
            <div key={t.id} className="card group text-center p-6">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-100 mb-4 bg-blue-50 group-hover:border-blue-300 transition-colors">
                {t.photo_url ? (
                  <img src={t.photo_url} alt={t.full_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-blue-300">
                    {t.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900">{t.full_name}</h3>
              {t.title && <p className="text-sm text-blue-700 font-medium">{t.title}</p>}
              {t.position && <p className="text-sm text-gray-500 mt-1">{t.position}</p>}
              {t.subject && t.subject !== '-' && <p className="text-xs text-gray-400 mt-1">Mengajar: {t.subject}</p>}
              {t.nip && <p className="text-xs text-gray-400 mt-1">NIP: {t.nip}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
