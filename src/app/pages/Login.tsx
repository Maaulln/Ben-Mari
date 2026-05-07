import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister?: () => void;
}

export function Login({ onLogin, onRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    const success = await onLogin(email, password);
    if (!success) {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F766E] to-[#14B8A6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0F766E] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
            K
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Klinik BenMari</h1>
          <p className="text-gray-500 mt-1">Sistem Manajemen Klinik</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
              placeholder="admin@klinik.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0F766E] hover:bg-[#0D6B64] text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn size={18} />
            Login
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2 font-medium">Demo Credentials:</p>
          <div className="text-xs text-gray-500 space-y-2">
            <div className="border-b pb-2">
              <p className="font-semibold text-gray-700 mb-1">Admin:</p>
              <p>Email: <span className="font-mono">admin@klinik.com</span></p>
              <p>Password: <span className="font-mono">admin123</span></p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-1">Dokter:</p>
              <p>Email: <span className="font-mono">maria@klinik.com</span></p>
              <p>Password: <span className="font-mono">dokter123</span></p>
            </div>
          </div>
        </div>

        {/* Register Link */}
        {onRegister && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{' '}
              <button
                onClick={onRegister}
                className="text-[#0F766E] font-medium hover:underline"
              >
                Daftar sebagai Pasien
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
