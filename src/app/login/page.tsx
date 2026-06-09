'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Erreur de connexion');
        setLoading(false);
        return;
      }

      toast.success('Connexion réussie !');
      router.push(data.redirect || '/');
      router.refresh();
    } catch (err) {
      toast.error('Erreur serveur');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(253,224,71,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(134,239,172,0.15),transparent_50%)]" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

      <div className="w-full max-w-sm z-10">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
             <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Skanit System</span>
          </div>
          
          <div className="relative mb-6">
            <h1 className="text-5xl font-black text-stone-800 tracking-tighter uppercase italic leading-none">
              BIENVENUE
            </h1>
          </div>
          
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.3em]">Connexion à votre espace</p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-[2.5rem] bg-white/60 backdrop-blur-2xl border-2 border-yellow-500/20 shadow-2xl shadow-yellow-900/5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 ml-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 px-6 rounded-2xl bg-white text-stone-700 text-sm font-medium border-2 border-stone-200 outline-none focus:border-yellow-400 transition-colors shadow-sm"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 ml-2">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-4 px-6 rounded-2xl bg-white text-stone-700 text-sm font-medium border-2 border-stone-200 outline-none focus:border-yellow-400 transition-colors shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-stone-800 to-stone-900 text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100 group mt-4 border border-stone-700"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/register" className="text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors">
              Vous n'avez pas de compte ? <span className="text-yellow-600">S'inscrire</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-stone-400 text-[8px] font-black uppercase tracking-[0.4em]">
            © 2026 Skanit Platform
          </p>
        </div>
      </div>
    </div>
  );
}
