import { useRef, useState } from 'react';
import { Upload, X, ImagePlus } from 'lucide-react';

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  accept?: string;
  maxSizeMB?: number;
  aspectClass?: string;
  placeholder?: string;
}

export default function FileUpload({
  label,
  value,
  onChange,
  accept = 'image/*',
  maxSizeMB = 2,
  aspectClass = 'w-32 h-20',
  placeholder = 'Klik untuk memilih foto',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    setError('');
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran maksimal ${maxSizeMB}MB.`);
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Gagal membaca file.');
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="label-field">{label}</label>
      <div className="flex items-start gap-3">
        <div
          onClick={() => inputRef.current?.click()}
          className={`${aspectClass} rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors overflow-hidden shrink-0 bg-gray-50`}
        >
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : loading ? (
            <span className="text-xs text-gray-400">Memuat...</span>
          ) : (
            <div className="text-center text-gray-400">
              <ImagePlus className="w-6 h-6 mx-auto mb-1" />
              <span className="text-[10px]">{placeholder}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Pilih File
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Hapus
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          <p className="text-[11px] text-gray-400 mt-1">Maks {maxSizeMB}MB. JPG/PNG/WebP.</p>
        </div>
      </div>
    </div>
  );
}
