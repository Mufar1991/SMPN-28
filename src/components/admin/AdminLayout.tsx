import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Megaphone, GraduationCap, FileText, Image as ImageIcon,
  Newspaper, Users, Building2, BookOpen, ClipboardList, Phone, Settings, Trophy,
  LogOut, Menu, X, Shield,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const LOGO = '/assets/images/logo-smpn28.png';

const MENU = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/running-text', label: 'Kelola Running Text', icon: Megaphone },
  { to: '/admin/spmb-data', label: 'Data SPMB', icon: GraduationCap },
  { to: '/admin/spmb-form', label: 'Pengaturan Form & Dokumen SPMB', icon: FileText },
  { to: '/admin/hero', label: 'Kelola Banner Hero', icon: ImageIcon },
  { to: '/admin/news', label: 'Kelola Berita & Agenda', icon: Newspaper },
  { to: '/admin/teachers', label: 'Kelola Guru & Staf', icon: Users },
  { to: '/admin/facilities', label: 'Kelola Fasilitas', icon: Building2 },
  { to: '/admin/elearning', label: 'Kelola E-Learning', icon: BookOpen },
  { to: '/admin/extracurricular', label: 'Kelola Ekstrakurikuler', icon: Trophy },
  { to: '/admin/timeline', label: 'Kelola Timeline & Syarat SPMB', icon: ClipboardList },
  { to: '/admin/contact', label: 'Kelola Kontak, Medsos & Peta', icon: Phone },
  { to: '/admin/profile', label: 'Pengaturan Profil & Label', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAdmin();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname.startsWith(to);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-blue-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 p-5 border-b border-blue-800">
          <img src={LOGO} alt="Logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="font-bold text-sm leading-tight">Admin Panel</h1>
            <p className="text-xs text-blue-300">SMPN 28 Pontianak</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto text-blue-300" aria-label="Tutup sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {MENU.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(m.to, m.end)
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <m.icon className="w-5 h-5 shrink-0" />
              <span>{m.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-blue-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-red-600 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" /> Keluar
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-700" aria-label="Buka sidebar">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Shield className="w-5 h-5 text-blue-700" />
              <span className="font-medium">Panel Administrasi</span>
            </div>
            <Link to="/" className="text-sm text-blue-700 font-medium hover:underline">Lihat Situs</Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
