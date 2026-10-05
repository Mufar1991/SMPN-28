import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useData } from '@/context/DataContext';

const LOGO = '/assets/images/logo-smpn28.png';

export default function Navbar() {
  const { spmbLabel } = useData();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/profil', label: 'Profil' },
    { to: '/guru-staf', label: 'Guru & Staf' },
    { to: '/fasilitas', label: 'Fasilitas' },
    { to: '/berita', label: 'Berita' },
    { to: '/e-learning', label: 'E-Learning' },
    { to: '/ekstrakurikuler', label: 'Ekskul' },
    { to: '/spmb', label: spmbLabel },
    { to: '/kontak', label: 'Kontak' },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo + Name */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <img src={LOGO} alt="Logo SMPN 28 Pontianak" className="h-10 md:h-14 w-auto object-contain" />
              <div className="leading-tight">
                <span className="block text-sm md:text-base font-bold text-blue-900">SMP Negeri 28</span>
                <span className="block text-xs md:text-sm text-gray-500">Kota Pontianak</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? 'text-blue-700 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 text-gray-700"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-slide-in">
            <div className="container-custom py-3 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                    location.pathname === l.to ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
