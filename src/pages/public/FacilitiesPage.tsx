import * as Icons from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function FacilitiesPage() {
  const { facilities } = useData();
  const active = facilities.filter((f) => f.is_active);

  const getIcon = (name: string | null) => {
    if (!name) return Icons.Building2;
    const IconComp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
    return IconComp ?? Icons.Building2;
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Fasilitas Sekolah</h1>
          <p className="text-gray-500">Sarana dan prasarana yang menunjang kegiatan belajar mengajar</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((f) => {
            const Icon = getIcon(f.icon_name);
            return (
              <div key={f.id} className="card group overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img
                    src={f.image_url ?? 'https://images.pexels.com/photos/256517/pexels-photo-256517.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={f.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">{f.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
