import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

const LOGO = '/assets/images/logo-smpn28.png';

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      setUsername('');
      setPassword('');
      setShowPass(false);
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      onClose();
      navigate('/admin');
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Tutup">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <img src={LOGO} alt="Logo" className="h-20 w-20 object-contain mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Login Admin Panel</h2>
          <p className="text-sm text-gray-500 mt-1">SMP Negeri 28 Kota Pontianak</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-username" className="label-field">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field pl-10"
                placeholder="Masukkan username"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="label-field">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <button type="submit" className="w-full btn-primary justify-center">
            <Shield className="w-5 h-5" /> Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
