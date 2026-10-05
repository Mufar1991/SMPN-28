import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin, Clock, Award, ChevronRight } from 'lucide-react';
import { useData } from '@/context/DataContext';
import LoginModal from '@/components/auth/LoginModal';

const LOGO = '/assets/images/logo-smpn28.png';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer() {
  const { contact, profile, spmbLabel } = useData();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={LOGO} alt="Logo" className="h-14 w-14 object-contain" />
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">SMP Negeri 28</h3>
              <p className="text-sm text-gray-400">Kota Pontianak</p>
            </div>
          </div>
          {profile?.accreditation_status && (
            <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-blue-700 rounded-lg px-3 py-1.5 text-sm">
              <Award className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-white font-semibold leading-tight">{profile.accreditation_status}</p>
                {profile.accreditation_subtitle && (
                  <p className="text-xs text-gray-400 leading-tight">{profile.accreditation_subtitle}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/', label: 'Beranda' },
              { to: '/profil', label: 'Profil Sekolah' },
              { to: '/guru-staf', label: 'Guru & Staf' },
              { to: '/fasilitas', label: 'Fasilitas' },
              { to: '/spmb', label: spmbLabel },
              { to: '/kontak', label: 'Kontak' },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="flex items-center gap-1 hover:text-white transition-colors">
                  <ChevronRight className="w-4 h-4" /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Kontak Kami</h4>
          <ul className="space-y-3 text-sm">
            {contact?.address && (
              <li className="flex gap-2.5">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0" /> <span>{contact.address}</span>
              </li>
            )}
            {contact?.phone && (
              <li className="flex gap-2.5">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" /> <span>{contact.phone}</span>
              </li>
            )}
            {contact?.email && (
              <li className="flex gap-2.5">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" /> <span>{contact.email}</span>
              </li>
            )}
            {contact?.operating_hours && (
              <li className="flex gap-2.5">
                <Clock className="w-5 h-5 text-blue-400 shrink-0" /> <span>{contact.operating_hours}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Map + socials */}
        <div>
          <h4 className="text-white font-semibold mb-4">Peta Lokasi</h4>
          {contact?.maps_enabled && (
            <div className="rounded-xl overflow-hidden border border-gray-700 mb-4">
              <iframe
                src={contact?.maps_embed_url || "https://maps.google.com/maps?q=-0.01,109.3338&z=15&output=embed"}
                title="Peta Lokasi SMP Negeri 28 Kota Pontianak"
                className="w-full h-48 md:h-64 rounded-xl border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          <div className="flex gap-3">
            {contact?.instagram_url && (
              <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {contact?.facebook_url && (
              <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {contact?.youtube_url && (
              <a href={contact.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {contact?.tiktok_url && (
              <a href={contact.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                <TikTokIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container-custom py-4 text-center text-sm text-gray-500">
          <span
            onClick={() => setLoginOpen(true)}
            className="cursor-pointer select-none hover:text-gray-300 transition-colors"
            title="Admin Login"
          >
            &copy; 2026 SMP Negeri 28 Kota Pontianak in collaboration with MF Digitalisasi. Hak Cipta Dilindungi.
          </span>
        </div>
      </div>
    </footer>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
