'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const pricingPlans = [
    {
      name: 'Starter',
      price: '49',
      desc: 'Idéal pour les petits restaurants',
      features: ['Menu Digital par QR Code', 'Jusqu\'à 50 produits', 'Interface Serveur basique', 'Support par email'],
      color: 'border-stone-200',
      btn: 'bg-stone-100 text-stone-800 hover:bg-stone-200'
    },
    {
      name: 'Pro',
      price: '99',
      desc: 'Pour les restaurants dynamiques',
      features: ['Menu Digital 3D & AR', 'Produits illimités', 'Génération de Thèmes par IA', 'Interface Cuisine & Serveur pro', 'Support prioritaire'],
      color: 'border-yellow-500 shadow-xl shadow-yellow-500/10 scale-105',
      badge: 'LE PLUS POPULAIRE',
      btn: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-stone-900 shadow-xl shadow-yellow-500/20 hover:scale-105'
    },
    {
      name: 'Entreprise',
      price: 'Sur devis',
      desc: 'Franchises et multi-établissements',
      features: ['Menus synchronisés', 'Tableau de bord multi-sites', 'Intégration caisse (POS)', 'Accompagnement dédié'],
      color: 'border-stone-200',
      btn: 'bg-stone-800 text-white hover:bg-black'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] font-sans relative overflow-x-hidden selection:bg-yellow-200 selection:text-stone-900">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-yellow-400/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-stone-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#fdfbf7]/80 backdrop-blur-xl border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg text-white font-black italic">
              S
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-stone-800">Skanit</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-stone-500">
            <a href="#features" className="hover:text-stone-900 transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Tarifs</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-stone-900 transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="px-6 py-3 rounded-full bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-stone-800 hover:scale-105 transition-all">
              Créer mon espace
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em]">La nouvelle norme en restauration</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-stone-800 tracking-tighter uppercase italic leading-[0.9] mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Transformez<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700">Vos Tables.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-stone-500 text-lg md:text-xl font-medium leading-relaxed mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Menu interactif en 3D, prise de commande instantanée par QR code et gestion intelligente de la salle. Le tout sans application à télécharger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => router.push('/register')} className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-stone-900 text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
              Démarrer Gratuitement
            </button>
            <button onClick={() => router.push('#features')} className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 font-black text-sm uppercase tracking-widest shadow-sm hover:border-yellow-400 transition-colors">
              Découvrir Skanit
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-stone-800 tracking-tighter uppercase italic">L'Expérience Parfaite</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'Menu 3D & AR', desc: 'Vos clients visualisent vos plats en réalité augmentée directement sur leur table.' },
              { icon: '⚡', title: 'Commande Ultra-Rapide', desc: 'Scan du QR code, choix des plats et commande instantanée envoyée en cuisine.' },
              { icon: '🤖', title: 'Intelligence Artificielle', desc: 'Génération automatique du design de votre menu selon votre style culinaire.' },
              { icon: '📊', title: 'Tableau de Bord', desc: 'Suivi des ventes en temps réel, gestion des stocks et de la disponibilité des plats.' },
              { icon: '👨‍🍳', title: 'Écrans Cuisine & Salle', desc: 'Synchronisation parfaite entre vos serveurs et vos cuisiniers pour un service fluide.' },
              { icon: '💳', title: 'Paiement Simplifié', desc: 'Option de paiement à table pour accélérer la rotation de vos couverts.' },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-black uppercase text-stone-800 mb-3">{feature.title}</h3>
                <p className="text-stone-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="max-w-6xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-stone-800 tracking-tighter uppercase italic">Tarifs Transparents</h2>
            <p className="text-stone-500 mt-4 font-medium">Sans engagement, sans frais cachés.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`p-8 rounded-[2.5rem] bg-white border-2 relative flex flex-col ${plan.color}`}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-stone-900 text-yellow-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-lg font-black uppercase tracking-widest text-stone-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-stone-900 tracking-tighter">{plan.price}</span>
                    {plan.price !== 'Sur devis' && <span className="text-stone-400 font-bold">€ / mois</span>}
                  </div>
                  <p className="text-stone-500 text-sm mt-4 font-medium">{plan.desc}</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-stone-600 font-medium text-sm">
                      <span className="text-green-500">✓</span> {feat}
                    </li>
                  ))}
                </ul>

                <button onClick={() => router.push('/register')} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${plan.btn}`}>
                  Commencer
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-6 py-24 relative z-10">
          <div className="p-12 md:p-20 rounded-[3rem] bg-stone-900 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic relative z-10 mb-6">
              Prêt à moderniser votre service ?
            </h2>
            <p className="text-stone-400 text-lg mb-10 relative z-10 max-w-2xl mx-auto">
              Rejoignez les restaurants qui utilisent Skanit pour augmenter leur panier moyen et fluidifier leur service.
            </p>
            <button onClick={() => router.push('/register')} className="px-10 py-5 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-stone-900 font-black text-sm uppercase tracking-widest shadow-2xl shadow-yellow-500/20 hover:scale-105 transition-transform relative z-10">
              Créer Mon Espace Restaurateur
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-stone-900 flex items-center justify-center text-white font-black italic text-xs">
              S
            </div>
            <span className="font-black uppercase tracking-widest text-stone-800 text-sm">Skanit</span>
          </div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            © 2026 Skanit Inc. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs font-bold text-stone-400 uppercase tracking-widest">
            <a href="#" className="hover:text-stone-800 transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-stone-800 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
