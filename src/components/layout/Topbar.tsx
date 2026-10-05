import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Phone, Mail, Clock, ChevronRight } from 'lucide-react';
import { useData } from '@/context/DataContext';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Topbar() {
  const { runningText, contact } = useData();
  const speedClass =
    runningText?.speed === 'slow' ? 'marquee-slow'
    : runningText?.speed === 'fast' ? 'marquee-fast'
    : 'marquee-normal';

  return (
    <div className="relative z-40">
      {/* Info bar */}
      <div className="bg-blue-900 text-white text-xs">
        <div className="container-custom flex items-center justify-between py-1.5">
          <div className="hidden md:flex items-center gap-4">
            {contact?.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> {contact.phone}
              </span>
            )}
            {contact?.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {contact.email}
              </span>
            )}
            {contact?.operating_hours && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {contact.operating_hours}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            {contact?.instagram_url && (
              <a href={contact.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-blue-200 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {contact?.facebook_url && (
              <a href={contact.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-200 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {contact?.youtube_url && (
              <a href={contact.youtube_url} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-blue-200 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            )}
            {contact?.tiktok_url && (
              <a href={contact.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-blue-200 transition-colors">
                <TikTokIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Running text */}
      {runningText?.is_enabled && (
        <div
          className="overflow-hidden whitespace-nowrap py-2 text-sm font-medium"
          style={{ backgroundColor: runningText.bg_color, color: runningText.text_color }}
        >
          <div className="container-custom flex items-center">
            <div className="overflow-hidden flex-1">
              <div className={`inline-block ${speedClass}`}>
                <span className="mr-8">{runningText.content}</span>
                {runningText.link_url && runningText.link_label && (
                  <Link
                    to={runningText.link_url}
                    className="inline-flex items-center gap-1 underline font-semibold ml-2"
                    style={{ color: runningText.text_color }}
                  >
                    {runningText.link_label} <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
