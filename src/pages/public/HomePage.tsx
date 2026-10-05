import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Award, Users, BookOpen, GraduationCap, ArrowRight, Calendar, Newspaper } from 'lucide-react';
import { useData } from '@/context/DataContext';

export default function HomePage() {
  const { heroSlides, news, teachers, facilities, profile, spmbLabel } = useData();
  const [current, setCurrent] = useState(0);
  const activeSlides = heroSlides.filter((s) => s.is_active);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % activeSlides.length), 6000);
    return () => clearInterval(t);
  }, [activeSlides.length]);

  const slide = activeSlides[current];

  return (
    <>
      {/* Hero slider */}
      {slide && (
        <section className="relative h-[480px] md:h-[560px] overflow-hidden">
          <div className="absolute inset-0 transition-opacity duration-700">
            <img src={slide.image_url ?? ''} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-black/40" />
          </div>
          <div className="relative container-custom h-full flex flex-col justify-center text-white">
            <div className="max-w-2xl animate-fade-up" key={current}>
              {slide.tagline && <p className="text-blue-200 font-semibold mb-2 text-lg">{slide.tagline}</p>}
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">{slide.title}</h1>
              {slide.subtitle && <p className="text-lg md:text-xl text-gray-200 mb-6">{slide.subtitle}</p>}
              <div className="flex gap-3 flex-wrap">
                <Link to="/spmb" className="btn-primary bg-white text-blue-800 hover:bg-blue-50">
                  Daftar {spmbLabel} <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/profil" className="btn-secondary bg-transparent text-white border-white hover:bg-white/10">
                  Tentang Kami
                </Link>
              </div>
            </div>
          </div>
          {activeSlides.length > 1 && (
            <>
              <button onClick={() => setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white" aria-label="Sebelumnya">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={() => setCurrent((c) => (c + 1) % activeSlides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white" aria-label="Berikutnya">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {activeSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/50'}`} aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Stats */}
      <section className="bg-blue-900 text-white py-10">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Users, label: 'Tenaga Pendidik', value: '45+' },
            { icon: GraduationCap, label: 'Siswa Aktif', value: '850+' },
            { icon: BookOpen, label: 'Ruang Kelas', value: '24' },
            { icon: Award, label: profile?.accreditation_status ?? 'Akreditasi A', value: 'Unggul' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <s.icon className="w-10 h-10 mb-2 text-blue-200" />
              <p className="text-2xl md:text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-blue-200">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="py-16">
        <div className="container-custom grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="section-title">Tentang Sekolah Kami</h2>
            <p className="section-subtitle">Mengenal lebih dekat SMP Negeri 28 Kota Pontianak</p>
            <p className="text-gray-600 leading-relaxed mb-4">
              {profile?.history_text?.slice(0, 300) ?? 'SMP Negeri 28 Kota Pontianak'}{profile?.history_text && profile.history_text.length > 300 ? '...' : ''}
            </p>
            {profile?.visi && (
              <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded-r-lg mb-4">
                <h3 className="font-semibold text-blue-900 mb-1">Visi</h3>
                <p className="text-sm text-gray-700 italic">{profile.visi}</p>
              </div>
            )}
            <Link to="/profil" className="btn-primary">Selengkapnya <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="relative">
            <img src={profile?.history_image_url ?? 'https://images.pexels.com/photos/8617715/pexels-photo-8617715.jpeg?auto=compress&cs=tinysrgb&w=800'} alt="Sekolah" className="rounded-2xl shadow-lg w-full h-80 object-cover" />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 hidden md:block">
              <div className="flex items-center gap-2">
                <Award className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="font-bold text-gray-900">{profile?.accreditation_status ?? 'Akreditasi A'}</p>
                  <p className="text-xs text-gray-500">{profile?.accreditation_subtitle ?? 'Terakreditasi Unggul'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-16 bg-gray-100">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Berita & Pengumuman</h2>
              <p className="section-subtitle">Informasi terbaru seputar sekolah</p>
            </div>
            <Link to="/berita" className="text-blue-700 font-semibold hover:underline hidden md:flex items-center gap-1">Lihat Semua <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((n) => (
              <Link to={`/berita/${n.slug}`} key={n.id} className="card group">
                <div className="h-48 overflow-hidden">
                  <img src={n.image_url ?? ''} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="badge bg-blue-100 text-blue-700 mb-2">{n.category}</span>
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{n.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{n.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities preview */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-center">Fasilitas Unggulan</h2>
          <p className="section-subtitle text-center">Sarana dan prasarana yang menunjang kegiatan belajar</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {facilities.slice(0, 6).map((f) => (
              <div key={f.id} className="card p-5 text-center group hover:border-blue-200">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">{f.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers preview */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">Tenaga Pendidik Kami</h2>
          <p className="text-blue-200 text-lg text-center mb-10">Guru-guru profesional dan berdedikasi</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {teachers.slice(0, 5).map((t) => (
              <div key={t.id} className="text-center">
                <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full overflow-hidden border-4 border-blue-400 mb-3 bg-blue-800">
                  {t.photo_url ? (
                    <img src={t.photo_url} alt={t.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-300">
                      {t.full_name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm">{t.full_name}</h3>
                <p className="text-xs text-blue-300">{t.position}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/guru-staf" className="btn-secondary bg-white text-blue-800 border-white hover:bg-blue-50">Lihat Semua Guru</Link>
          </div>
        </div>
      </section>
    </>
  );
}
