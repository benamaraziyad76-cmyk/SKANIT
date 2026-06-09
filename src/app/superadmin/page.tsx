'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';

// --- MOCK DATA FOR THE ULTIMATE DEMO ---
const INITIAL_RESTAURANTS = [
  { id: '1', name: 'La Scampia', slug: 'la-scampia', subscription: 299, ordersToday: 45, plan: 'PRO', status: 'ACTIVE', lastActive: 'Il y a 5 min', location: 'Paris, FR' },
  { id: '2', name: 'Le Petit Naples', slug: 'petit-naples', subscription: 499, ordersToday: 82, plan: 'ENTERPRISE', status: 'ACTIVE', lastActive: 'Il y a 12 min', location: 'Lyon, FR' },
  { id: '3', name: 'O\'Tacos - Centre', slug: 'otacos-centre', subscription: 499, ordersToday: 156, plan: 'ENTERPRISE', status: 'ACTIVE', lastActive: 'À l\'instant', location: 'Marseille, FR' },
  { id: '4', name: 'Sushi Shop', slug: 'sushi-shop', subscription: 299, ordersToday: 64, plan: 'PRO', status: 'ACTIVE', lastActive: 'Il y a 2 heures', location: 'Bordeaux, FR' },
  { id: '5', name: 'Burger Station', slug: 'burger-station', subscription: 99, ordersToday: 21, plan: 'STARTER', status: 'SUSPENDED', lastActive: 'Il y a 3 jours', location: 'Nice, FR' },
  { id: '6', name: 'Pizzeria Bella', slug: 'pizzeria-bella', subscription: 299, ordersToday: 16, plan: 'PRO', status: 'ACTIVE', lastActive: 'Il y a 1 heure', location: 'Lille, FR' },
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS);
  const [showNewRestaurant, setShowNewRestaurant] = useState(false);
  const [newRest, setNewRest] = useState({ name: '', slug: '', subscription: 299, plan: 'PRO' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const stats = useMemo(() => {
    const active = restaurants.filter(r => r.status === 'ACTIVE').length;
    const totalMRR = restaurants.reduce((acc, r) => acc + (r.status === 'ACTIVE' ? r.subscription : 0), 0);
    const totalOrders = restaurants.reduce((acc, r) => acc + r.ordersToday, 0);
    return {
      monthlyRevenue: totalMRR,
      activeRestaurants: active,
      totalOrdersToday: totalOrders,
      churnRate: "1.2%",
      customerLTV: "4,200€"
    };
  }, [restaurants]);

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, status: newStatus } : r));
    
    if (newStatus === 'SUSPENDED') {
      toast.error(`Accès révoqué pour ce client.`);
    } else {
      toast.success(`Accès rétabli !`);
    }
  };

  const addRestaurant = () => {
    if (!newRest.name || !newRest.slug) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    const created = {
      ...newRest,
      id: Math.random().toString(36).substr(2, 9),
      ordersToday: 0,
      status: 'ACTIVE',
      lastActive: 'À l\'instant',
      location: 'Nouveau Déploiement'
    };
    setRestaurants([created as any, ...restaurants]);
    setShowNewRestaurant(false);
    setNewRest({ name: '', slug: '', subscription: 299, plan: 'PRO' });
    toast.success('Instance déployée avec succès !');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#08080a] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Toaster position="top-center" richColors theme="dark" />
      
      {/* --- ELITE DESIGN ELEMENTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse opacity-50" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[150px] rounded-full animate-pulse delay-1000 opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100" />
      </div>

      {/* --- NAVIGATION BAR --- */}
      <nav className="relative z-50 border-b border-white/[0.04] bg-[#08080a]/80 backdrop-blur-3xl sticky top-0">
        <div className="max-w-[1600px] mx-auto px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl border border-white/20">
                <span className="font-black text-2xl tracking-tighter italic">S</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none italic uppercase">Skanit <span className="text-indigo-400">Pilot</span></h1>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                Infrastructure v3.0 • SaaS OS
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden xl:flex items-center gap-8 px-8 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Global Health</span>
                <span className="text-xs font-black text-emerald-400">OPTIMAL</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Nodes</span>
                <span className="text-xs font-black text-white">12/12 ACTIVE</span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1600px] mx-auto px-10 py-16">
        
        {/* --- INTRO SECTION --- */}
        <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-widest">Système de Pilotage Centralisé</span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter italic uppercase leading-none">
              Console <span className="text-indigo-500">Stratégique</span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl font-medium">Gérez votre empire SaaS. Surveillez la croissance, gérez les abonnements et déployez de nouveaux restaurants instantanément.</p>
          </div>
          
          <div className="flex gap-5">
            <button 
              onClick={() => setShowNewRestaurant(true)}
              className="px-10 py-5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.5rem] hover:bg-indigo-500 transition-all shadow-[0_25px_50px_-12px_rgba(79,70,229,0.5)] flex items-center gap-4 group"
            >
              <span className="text-2xl group-hover:rotate-90 transition-transform">＋</span> Déployer un Nouveau Restaurant
            </button>
          </div>
        </div>

        {/* --- KPI GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-24">
          
          {/* MAIN REVENUE CARD */}
          <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <p className="text-[11px] text-white/60 font-black uppercase tracking-[0.3em]">Monthly Recurring Revenue (MRR)</p>
                <div className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl">Live Metrics</div>
              </div>
              <div className="flex items-baseline gap-6">
                <h3 className="text-8xl font-black tracking-tighter italic">
                  {stats.monthlyRevenue.toLocaleString('fr-FR')}€
                </h3>
                <div className="flex flex-col">
                   <span className="text-emerald-400 font-black text-xl">↑ 14.2%</span>
                   <span className="text-white/30 text-[10px] font-black uppercase">vs M-1</span>
                </div>
              </div>
              
              <div className="mt-16 grid grid-cols-3 gap-10 pt-10 border-t border-white/10">
                 <div>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">Churn Rate</p>
                    <p className="text-2xl font-black italic">{stats.churnRate}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">SaaS LTV</p>
                    <p className="text-2xl font-black italic">{stats.customerLTV}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-2">Payback Period</p>
                    <p className="text-2xl font-black italic">3.4 Mois</p>
                 </div>
              </div>
            </div>
          </div>

          {/* SECONDARY STATS */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="bg-white/[0.02] border border-white/[0.06] p-10 rounded-[3rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl group-hover:scale-125 transition-transform">🍔</div>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-3">Unités Déployées</p>
              <h4 className="text-6xl font-black italic">{stats.activeRestaurants} <span className="text-white/10 text-3xl font-normal not-italic">/ {restaurants.length}</span></h4>
              <div className="mt-8 flex items-center gap-3">
                 <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[84%]" />
                 </div>
                 <span className="text-[10px] font-black text-indigo-400">84%</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.06] p-10 rounded-[3rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-6xl group-hover:scale-125 transition-transform">⚡</div>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mb-3">Total Commandes 24h</p>
              <h4 className="text-6xl font-black italic">{stats.totalOrdersToday}</h4>
              <div className="mt-8 flex items-center gap-3">
                 <div className="h-2 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[65%]" />
                 </div>
                 <span className="text-[10px] font-black text-emerald-400">VOLUME ÉLEVÉ</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CLIENTS LIST --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
          
          <div className="xl:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/30">Management des Instances</h3>
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">Tous ({restaurants.length})</div>
                <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">MRR Décroissant</div>
              </div>
            </div>

            <div className="bg-white/[0.01] border border-white/[0.04] rounded-[3.5rem] overflow-hidden backdrop-blur-3xl shadow-3xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.04] bg-white/[0.02]">
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Restaurant</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Performance</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Abonnement</th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {restaurants.sort((a,b) => b.subscription - a.subscription).map((restaurant) => (
                    <tr key={restaurant.id} className="hover:bg-white/[0.02] transition-all group">
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-xl font-black border border-white/10 shadow-xl group-hover:scale-110 transition-transform">
                            {restaurant.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-lg tracking-tight uppercase italic group-hover:text-indigo-400 transition-colors">{restaurant.name}</p>
                            <p className="text-[10px] text-white/20 font-mono tracking-widest mt-1">/{restaurant.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-10">
                        <p className="font-black text-md italic">{restaurant.ordersToday} CMD</p>
                        <p className="text-[10px] font-bold uppercase text-emerald-500 tracking-widest mt-1.5 flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           {restaurant.lastActive}
                        </p>
                      </td>
                      <td className="px-10 py-10">
                        <div className="flex items-center gap-3">
                           <span className="text-white/20 font-black text-sm">€</span>
                           <input 
                            type="number" 
                            value={restaurant.subscription} 
                            onChange={(e) => setRestaurants(restaurants.map(r => r.id === restaurant.id ? {...r, subscription: parseInt(e.target.value) || 0} : r))}
                            className="w-20 bg-transparent border-b border-white/10 focus:border-indigo-500 outline-none text-xl font-black italic text-indigo-400 transition-all"
                           />
                        </div>
                        <p className="text-[9px] font-black text-white/20 uppercase mt-2">{restaurant.plan} PLAN</p>
                      </td>
                      <td className="px-10 py-10">
                         <button 
                          onClick={() => toggleStatus(restaurant.id, restaurant.status)}
                          className={cn(
                            "w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95",
                            restaurant.status === 'ACTIVE' 
                              ? "bg-white text-black border-white hover:bg-red-500 hover:text-white hover:border-red-500" 
                              : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                          )}
                         >
                           {restaurant.status === 'ACTIVE' ? 'Suspendre' : 'Réactiver'}
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- ACTIVITY FEED --- */}
          <div className="space-y-10">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 px-4">Flux des Déploiements</h3>
            <div className="bg-white/[0.01] border border-white/[0.04] rounded-[3.5rem] p-12 space-y-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
              {[
                { rest: "La Scampia", action: "Plat 3D publié", time: "2m", icon: "✨", col: "text-indigo-400" },
                { rest: "O'Tacos", action: "Paiement CB encaissé", time: "8m", icon: "💳", col: "text-emerald-400" },
                { rest: "Le Petit Naples", action: "Service démarré", time: "12m", icon: "🚀", col: "text-purple-400" },
                { rest: "Sushi Shop", action: "Upgrade Vers ENTERPRISE", time: "45m", icon: "👑", col: "text-amber-400" },
                { rest: "Burger Station", action: "Accès suspendu (Impayé)", time: "1h", icon: "⛔", col: "text-red-400" },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 relative group">
                  {i !== 4 && <div className="absolute top-12 left-6 bottom-[-30px] w-px bg-white/5" />}
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl z-10 group-hover:scale-110 transition-transform shadow-lg">
                    {item.icon}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white/60">{item.rest}</p>
                      <span className="text-[10px] font-bold text-white/20">{item.time}</span>
                    </div>
                    <p className={cn("text-sm font-black mt-2 italic", item.col)}>{item.action}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-5 mt-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:bg-white/10 transition-all border border-white/5 hover:text-white">
                Voir toutes les Logs ↗
              </button>
            </div>

            {/* AI Assistant Insight */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 relative overflow-hidden group">
               <div className="absolute -bottom-10 -right-10 text-8xl opacity-10 group-hover:rotate-12 transition-transform">🤖</div>
               <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  Skanit AI Insight
               </h4>
               <p className="text-sm text-white/60 leading-relaxed italic font-medium">
                  &quot;Le restaurant <span className="text-white font-bold">O&apos;Tacos</span> a doublé son volume de commandes aujourd&apos;hui. Pensez à lui proposer l&apos;option &apos;Multi-Bornes&apos; pour optimiser son flux.&quot;
               </p>
            </div>
          </div>
        </div>
      </main>

      {/* --- DEPLOYMENT MODAL --- */}
      {showNewRestaurant && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-10 animate-fade-in">
          <div className="w-full max-w-2xl bg-[#08080a] border border-white/10 rounded-[4rem] p-16 shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] animate-scale-up border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <h3 className="text-5xl font-black text-white mb-4 italic uppercase tracking-tighter leading-none">Déploiement <span className="text-indigo-500">Immédiat</span></h3>
              <p className="text-white/30 text-sm font-medium mb-16 uppercase tracking-widest">Configuration de la nouvelle instance SaaS</p>
              
              <div className="grid grid-cols-2 gap-10">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 block">Identité Commerciale</label>
                  <input 
                    type="text" 
                    value={newRest.name}
                    onChange={(e) => setNewRest({...newRest, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-xl text-white focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all font-black uppercase placeholder:text-white/10"
                    placeholder="NOM DU RESTAURANT"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 block">Identifiant URL (Slug)</label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6">
                    <span className="text-white/20 font-mono text-sm">/</span>
                    <input 
                      type="text" 
                      value={newRest.slug}
                      onChange={(e) => setNewRest({...newRest, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                      className="w-full bg-transparent py-5 text-white font-mono focus:outline-none placeholder:text-white/10"
                      placeholder="mon-restaurant"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 block">Tarif Mensuel (€)</label>
                  <input 
                    type="number" 
                    value={newRest.subscription}
                    onChange={(e) => setNewRest({...newRest, subscription: parseInt(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-indigo-400 text-xl font-black focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 block">Sélection du Tier</label>
                  <div className="grid grid-cols-3 gap-5">
                    {['STARTER', 'PRO', 'ENTERPRISE'].map(plan => (
                      <button 
                        key={plan}
                        onClick={() => setNewRest({...newRest, plan})}
                        className={cn(
                          "py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 transition-all",
                          newRest.plan === plan ? "bg-white text-black border-white shadow-2xl scale-105" : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                        )}
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-8 mt-20">
                <button 
                  onClick={() => setShowNewRestaurant(false)}
                  className="flex-1 px-10 py-6 bg-white/5 text-white/40 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={addRestaurant}
                  className="flex-1 px-10 py-6 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30"
                >
                  Confirmer le Déploiement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
