import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Youtube } from 'lucide-react';
import { useData } from '@/context/DataContext';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function ContactPage() {
  const { contact } = useData();

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Hubungi Kami</h1>
          <p className="text-gray-500">Silakan hubungi kami melalui kontak di bawah ini</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>
            <div className="space-y-4">
              {contact?.address && (
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Alamat</h3>
                    <p className="text-gray-600">{contact.address}</p>
                  </div>
                </div>
              )}
              {contact?.phone && (
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telepon</h3>
                    <p className="text-gray-600">{contact.phone}</p>
                  </div>
                </div>
              )}
              {contact?.email && (
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{contact.email}</p>
                  </div>
                </div>
              )}
              {contact?.operating_hours && (
                <div className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Jam Operasional</h3>
                    <p className="text-gray-600">{contact.operating_hours}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Socials */}
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Media Sosial</h2>
            <div className="flex gap-3">
              {contact?.instagram_url && (
                <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-lg bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-pink-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {contact?.facebook_url && (
                <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {contact?.youtube_url && (
                <a href={contact.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-11 h-11 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {contact?.tiktok_url && (
                <a href={contact.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-11 h-11 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-800 transition-colors">
                  <TikTokIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Map */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Peta Lokasi</h2>
            {contact?.maps_enabled ? (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src={contact?.maps_embed_url || "https://maps.google.com/maps?q=-0.01,109.3338&z=15&output=embed"}
                  title="Peta Lokasi SMP Negeri 28 Kota Pontianak"
                  className="w-full h-48 md:h-64 rounded-xl border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-gray-100 h-96 flex items-center justify-center text-gray-400">
                Peta lokasi tidak ditampilkan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
