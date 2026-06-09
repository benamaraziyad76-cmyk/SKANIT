'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { formatPrice, cn } from '@/lib/utils';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { toast, Toaster } from 'sonner';
import IAAssistant from './IAAssistant';

interface Analytics {
    today: {
        revenue: number;
        orderCount: number;
        avgBasket: number;
        topDishes: { name: string; count: number; revenue: number }[];
        peakHours: { hour: number; count: number }[];
        payments?: { method: string; total: number; count: number }[];
    };
    allTime: {
        revenue: number;
        orderCount: number;
        avgBasket: number;
        topDishes: { name: string; count: number; revenue: number }[];
    };
}

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    isAvailable: boolean;
    isSignature: boolean;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
    items: MenuItem[];
}

interface Table {
    id: string;
    tableCode: string;
    label: string;
}

interface RestaurantSettings {
    id: string;
    name: string;
    slug: string;
    accentColor: string;
    themeMode: string;
}

export default function AdminDashboard() {
    const params = useParams();
    const restaurantSlug = params.slug as string;
    
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'ia' | 'menu' | 'tables' | 'settings'>('dashboard');
    const [categories, setCategories] = useState<Category[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!restaurantSlug) return;
        try {
            const [anaRes, menuRes, tableRes, restRes] = await Promise.all([
                fetch(`/api/admin/analytics?restaurantSlug=${restaurantSlug}`),
                fetch(`/api/admin/menu?restaurantSlug=${restaurantSlug}`),
                fetch(`/api/admin/tables?restaurantSlug=${restaurantSlug}`),
                fetch(`/api/admin/restaurant?restaurantSlug=${restaurantSlug}`),
            ]);

            if (anaRes.ok) setAnalytics(await anaRes.json());
            if (menuRes.ok) {
                const data = await menuRes.json();
                setCategories(data.categories || []);
            }
            if (tableRes.ok) setTables(await tableRes.json());
            if (restRes.ok) setRestaurantSettings(await restRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [restaurantSlug]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const tabs = [
        { id: 'dashboard' as const, label: '📊 Dashboard' },
        { id: 'ia' as const, label: '🤖 Assistant IA' },
        { id: 'menu' as const, label: '🍽️ Menu' },
        { id: 'tables' as const, label: '🪑 Tables' },
        { id: 'settings' as const, label: '⚙️ Réglages' },
    ];

    if (loading) return <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-black uppercase tracking-widest text-[#4a5d4e]">Chargement du Pilotage...</div>;

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-[#2c2c2c]">
            <Toaster richColors position="top-center" />
            
            <header className="bg-white/80 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#4a5d4e] flex items-center justify-center shadow-lg transform -rotate-3">
                            <span className="text-white text-2xl">🏛️</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase text-[#4a5d4e] tracking-tighter italic">La Scampia <span className="text-[#b35a38]">Admin</span></h1>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Pilotage Haute Gastronomie</p>
                        </div>
                    </div>
                    <Link href={`/r/${restaurantSlug}/t/P1`} className="px-8 py-3 rounded-full bg-[#4a5d4e] text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                        Voir le Menu ↗
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar p-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                'px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2',
                                activeTab === tab.id
                                    ? 'bg-[#4a5d4e] border-[#4a5d4e] text-white shadow-2xl scale-105'
                                    : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'dashboard' && analytics && (
                    <div className="animate-fade-in-up space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "C.A Jour", val: formatPrice(analytics.today.revenue), icon: "💰" },
                                { label: "Commandes", val: analytics.today.orderCount, icon: "📝" },
                                { label: "Panier Moyen", val: formatPrice(analytics.today.avgBasket), icon: "🧺" },
                                { label: "C.A Global", val: formatPrice(analytics.allTime.revenue), icon: "🌍" }
                            ].map((stat, i) => (
                                <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-stone-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">{stat.icon}</div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                    <p className="text-3xl font-black text-[#2c2c2c] italic">{stat.val}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#4a5d4e] mb-8 border-b pb-4">Top Plats - Aujourd'hui</h3>
                            <div className="space-y-4">
                                {analytics.today.topDishes.slice(0, 5).map((dish, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#fdfbf7] border border-stone-50">
                                        <span className="font-bold text-stone-700 uppercase text-xs tracking-widest">{dish.name}</span>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-stone-400 uppercase">Vendus</p>
                                            <p className="font-black text-stone-900">{dish.count}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ia' && <IAAssistant />}

                {activeTab === 'menu' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                        {categories.map(cat => cat.items.map(item => (
                            <div key={item.id} className="p-8 rounded-[2.5rem] bg-white border border-stone-100 flex gap-8 items-center shadow-sm">
                                <div className="w-20 h-20 rounded-2xl bg-[#fdfbf7] overflow-hidden">
                                    {item.image && <img src={item.image} className="w-full h-full object-contain p-2" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm uppercase tracking-tight text-[#2c2c2c]">{item.name}</p>
                                    <p className="font-black italic text-lg text-[#b35a38] mt-1">{item.price.toFixed(2)}€</p>
                                    <span className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase mt-3 inline-block", item.isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>
                                        {item.isAvailable ? 'En vente' : 'Épuisé'}
                                    </span>
                                </div>
                            </div>
                        )))}
                    </div>
                )}

                {activeTab === 'tables' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
                        {tables.map(table => (
                            <div key={table.id} className="p-8 rounded-[2.5rem] bg-white border border-stone-100 flex flex-col items-center gap-4 shadow-sm">
                                <div className="p-4 bg-white rounded-3xl border border-stone-50 shadow-inner">
                                    <QRCodeSVG value={`${baseUrl}/r/${restaurantSlug}/t/${table.tableCode}`} size={120} />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black italic text-[#4a5d4e] tracking-tighter">{table.tableCode}</p>
                                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{table.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-md mx-auto p-10 rounded-[3rem] bg-white border border-stone-100 shadow-xl animate-fade-in-up">
                        <h3 className="text-xl font-black uppercase text-[#4a5d4e] mb-8 italic">Style du Restaurant 🎨</h3>
                        <div className="grid grid-cols-5 gap-3 mb-8">
                            {['#4a5d4e', '#b35a38', '#2c2c2c', '#DC2626', '#E85D04'].map(color => (
                                <div key={color} className={cn("h-12 rounded-xl cursor-pointer border-2", restaurantSettings?.accentColor === color ? "border-stone-800" : "border-transparent")} style={{backgroundColor: color}} />
                            ))}
                        </div>
                        <button className="w-full py-6 bg-[#4a5d4e] text-white rounded-full font-black uppercase shadow-lg hover:scale-105 transition-all">Sauvegarder l'identité</button>
                    </div>
                )}
            </div>
        </div>
    );
}
