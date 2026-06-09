'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
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

interface Ingredient {
    id: string;
    name: string;
    stock: number;
    minStock: number;
    unit: string;
}

interface OptionItem {
    id: string;
    name: string;
    priceDelta: number;
    isDefault: boolean;
}

interface OptionGroup {
    id: string;
    name: string;
    type: 'radio' | 'checkbox';
    required: boolean;
    options: OptionItem[];
}

interface Table {
    id: string;
    tableCode: string;
    label: string;
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
    modelUrl?: string | null;
    iosModelUrl?: string | null;
    optionGroups?: OptionGroup[];
}

interface Category {
    id: string;
    name: string;
    items: MenuItem[];
}

interface RestaurantSettings {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    logo: string | null;
    accentColor: string;
    themeMode: string;
    font: string;
    taxRate: number;
    currency: string;
    openingHours: string | null;
    promoImage: string | null;
    promoText: string | null;
    promoPrice: number | null;
    promoCategoryId: string | null;
}

export default function AdminDashboard() {
    const params = useParams();
    const restaurantSlug = params.slug as string;
    
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'menu' | 'tables' | 'stocks' | 'settings' | 'ia'>('dashboard');
    const [categories, setCategories] = useState<Category[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings | null>(null);
    const [settingsSaving, setSettingsSaving] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
    const [previewThemeColor, setPreviewThemeColor] = useState<string | null>(null);
    const [previewThemeImage, setPreviewThemeImage] = useState<string | null>(null);
    const [originalThemeColor, setOriginalThemeColor] = useState<string | null>(null);
    const isPreviewingRef = useRef(false);

    // Forms
    const [newTableCode, setNewTableCode] = useState('');
    const [newTableLabel, setNewTableLabel] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Create Menu Item & Category
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItem, setNewItem] = useState<Partial<MenuItem>>({ name: '', price: 0, categoryId: '', description: '' });

    const router = useRouter(); 
    const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';

    const checkAuth = useCallback(async () => {
        setIsAuthorized(true);
        setLoading(false);
    }, []);

    const fetchData = useCallback(async () => {
        if (!restaurantSlug) return;
        try {
            const [anaRes, menuRes, tableRes, ingRes, restRes] = await Promise.all([
                fetch(`/api/admin/analytics?restaurantSlug=${restaurantSlug}`),
                fetch(`/api/admin/menu?restaurantSlug=${restaurantSlug}`),
                fetch(`/api/admin/tables?restaurantSlug=${restaurantSlug}`),
                fetch(`/api/admin/ingredients?restaurantSlug=${restaurantSlug}`),
                fetch(`/api/admin/restaurant?restaurantSlug=${restaurantSlug}`),
            ]);

            if (anaRes.ok) setAnalytics(await anaRes.json());
            if (menuRes.ok) {
                const data = await menuRes.json();
                setCategories(data.categories || []);
            }
            if (tableRes.ok) setTables(await tableRes.json());
            if (ingRes.ok) setIngredients(await ingRes.json());
            if (restRes.ok && !isPreviewingRef.current) setRestaurantSettings(await restRes.json());
        } catch (e) {
            console.error(e);
        }
    }, [restaurantSlug]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthorized) {
            fetchData();
            const interval = setInterval(fetchData, 10000);
            return () => clearInterval(interval);
        }
    }, [fetchData, isAuthorized]);

    const saveSettings = async () => {
        if (!restaurantSettings) return;
        setSettingsSaving(true);
        try {
            const res = await fetch('/api/admin/restaurant', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...restaurantSettings, slug: restaurantSlug }),
            });
            if (res.ok) toast.success('Réglages sauvegardés !');
            else toast.error('Erreur lors de la sauvegarde');
        } catch {
            toast.error('Erreur réseau');
        } finally {
            setSettingsSaving(false);
        }
    };

    const addTable = async () => {
        if (!newTableCode || !newTableLabel) return;
        setLoading(true);
        await fetch('/api/admin/tables', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ restaurantSlug, tableCode: newTableCode, label: newTableLabel }),
        });
        setNewTableCode('');
        setNewTableLabel('');
        setLoading(false);
        fetchData();
    };

    const deleteTable = async (id: string) => {
        if (!confirm('Supprimer cette table ?')) return;
        await fetch(`/api/admin/tables?id=${id}`, { method: 'DELETE' });
        fetchData();
    };

    const toggleAvailability = async (item: MenuItem) => {
        await fetch('/api/admin/menu', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id, isAvailable: !item.isAvailable }),
        });
        fetchData();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setUploadingItemId(itemId);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'image');

            const uploadRes = await fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            });

            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                const newImageUrl = uploadData.url;

                // Update the menu item in DB
                const updateRes = await fetch('/api/admin/menu', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: itemId, image: newImageUrl }),
                });

                if (updateRes.ok) {
                    toast.success('Image mise à jour !');
                    fetchData();
                    if (editingItem && editingItem.id === itemId) {
                        setEditingItem({...editingItem, image: newImageUrl});
                    }
                } else {
                    toast.error('Erreur lors de la mise à jour en base');
                }
            } else {
                toast.error('Erreur lors de l\'upload du fichier');
            }
        } catch (error) {
            toast.error('Erreur réseau');
        } finally {
            setUploadingItemId(null);
        }
    };

    const createCategory = async () => {
        if (!newCategoryName) return;
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName, restaurantSlug })
            });
            if (res.ok) {
                toast.success('Catégorie créée !');
                setIsAddingCategory(false);
                setNewCategoryName('');
                fetchData();
            } else {
                toast.error('Erreur lors de la création');
            }
        } catch {
            toast.error('Erreur réseau');
        }
    };

    const createMenuItem = async () => {
        if (!newItem.name || !newItem.categoryId) {
            toast.error('Nom et catégorie requis');
            return;
        }
        try {
            const res = await fetch('/api/admin/menu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newItem, restaurantSlug })
            });
            if (res.ok) {
                toast.success('Plat créé !');
                setIsAddingItem(false);
                setNewItem({ name: '', price: 0, categoryId: '', description: '' });
                fetchData();
            } else {
                toast.error('Erreur lors de la création');
            }
        } catch {
            toast.error('Erreur réseau');
        }
    };

    const saveMenuItem = async (item: MenuItem) => {
        try {
            const res = await fetch('/api/admin/menu', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    image: item.image,
                    optionGroups: item.optionGroups
                }),
            });
            if (res.ok) {
                toast.success('Plat mis à jour !');
                setEditingItem(null);
                fetchData();
            } else {
                toast.error('Erreur lors de la mise à jour');
            }
        } catch {
            toast.error('Erreur réseau');
        }
    };

    const tabs = [
        { id: 'dashboard' as const, label: '📊 Dashboard' },
        { id: 'ia' as const, label: '🤖 IA' },
        { id: 'menu' as const, label: '🍽️ Menu' },
        { id: 'tables' as const, label: '🪑 Tables' },
        { id: 'settings' as const, label: '⚙️ Réglages' },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
        } catch {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    if (loading) return null;
    if (!isAuthorized) return null;

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-[#2c2c2c]">
            <Toaster richColors position="top-center" />
            
            <header className="bg-white/80 backdrop-blur-xl border-b border-stone-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-colors" style={{ backgroundColor: restaurantSettings?.accentColor || '#4a5d4e' }}>
                                <span className="text-white text-2xl">🏛️</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-black uppercase tracking-tighter italic transition-colors" style={{ color: restaurantSettings?.accentColor || '#4a5d4e' }}>
                                    {restaurantSettings?.name || 'Chargement...'} <span className="text-[#b35a38]">Admin</span>
                                </h1>
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">Pilotage Haute Gastronomie x Skanit</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href={`/r/${restaurantSlug}/t/P1`} className="px-6 py-2.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105" style={{ backgroundColor: restaurantSettings?.accentColor || '#4a5d4e' }}>
                                Voir le Menu ↗
                            </Link>
                            <button onClick={handleLogout} className="px-6 py-2.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-red-100 hover:text-red-600 transition-colors">
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
                <div className="flex gap-3 mb-12 overflow-x-auto no-scrollbar p-1">
                    {tabs.map(tab => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    'px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2',
                                    isActive
                                        ? 'text-white shadow-2xl scale-105'
                                        : 'bg-white text-stone-400 border-stone-100 hover:border-stone-200'
                                )}
                                style={isActive ? { backgroundColor: restaurantSettings?.accentColor || '#4a5d4e', borderColor: restaurantSettings?.accentColor || '#4a5d4e' } : {}}
                            >
                                {tab.label.split(' ')[1] || tab.label}
                            </button>
                        );
                    })}
                </div>

                {activeTab === 'dashboard' && analytics && (
                    <div className="animate-fade-in-up space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {[
                                { label: "Chiffre d'Affaires", val: formatPrice(analytics.today.revenue), icon: "💰" },
                                { label: "Commandes du Jour", val: analytics.today.orderCount, icon: "📝" },
                                { label: "Panier Moyen", val: formatPrice(analytics.today.avgBasket), icon: "🧺" },
                                { 
                                    label: "Heure de Pic", 
                                    val: analytics.today.peakHours && analytics.today.peakHours.length > 0 
                                        ? `${[...analytics.today.peakHours].sort((a,b) => b.count - a.count)[0].hour}h00` 
                                        : "N/A", 
                                    icon: "🕐" 
                                },
                                { label: "Revenu Global", val: formatPrice(analytics.allTime.revenue), icon: "🌍" }
                            ].map((stat, i) => (
                                <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-stone-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl group-hover:scale-125 transition-transform">{stat.icon}</div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3">{stat.label}</p>
                                    <p className="text-3xl font-black text-[#2c2c2c] italic">{stat.val}</p>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-sm">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#4a5d4e] mb-8 border-b border-stone-100 pb-4">Plats les plus vendus</h3>
                                <div className="space-y-4">
                                    {analytics.today.topDishes.map((dish, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#fdfbf7] border border-stone-50">
                                            <div className="flex items-center gap-4">
                                                <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-black text-[10px] text-stone-400">{i+1}</span>
                                                <span className="font-bold text-stone-700 uppercase text-xs tracking-widest">{dish.name}</span>
                                            </div>
                                            <div className="flex gap-8">
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-stone-400 uppercase">Vendus</p>
                                                    <p className="font-black text-stone-900">{dish.count}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] font-black text-stone-400 uppercase">Revenu</p>
                                                    <p className="font-black text-[#b35a38] italic">{formatPrice(dish.revenue)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-sm flex flex-col min-h-[400px]">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#4a5d4e] mb-8 border-b border-stone-100 pb-4">Activité par Heure</h3>
                                <div className="flex-1 mt-4 h-full min-h-[250px] relative w-full">
                                    {analytics.today.peakHours && analytics.today.peakHours.length > 0 ? (
                                        (() => {
                                            const maxCount = 100;
                                            const sortedHours = [...analytics.today.peakHours].sort((a, b) => a.hour - b.hour);
                                            const width = 800;
                                            const height = 200;
                                            const paddingLeft = 40;
                                            const points = sortedHours.map((h, i) => ({
                                                x: paddingLeft + (i / (sortedHours.length - 1)) * (width - paddingLeft),
                                                y: height - (Math.min(h.count, maxCount) / maxCount) * height,
                                                count: h.count,
                                                hour: h.hour
                                            }));

                                            const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                                            const areaData = `${pathData} L ${width} ${height} L ${paddingLeft} ${height} Z`;

                                            // Generate Y-axis ticks
                                            const yTicks = [0, 20, 40, 60, 80, 100];

                                            return (
                                                <div className="w-full h-full pb-8 pl-4">
                                                    <svg viewBox={`0 0 ${width} ${height + 40}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                                        {/* Grid Lines (Light Blue) */}
                                                        {yTicks.map((tick, i) => (
                                                            <g key={`grid-${i}`}>
                                                                {tick > 0 && (
                                                                    <line x1={paddingLeft} y1={height - (tick / maxCount) * height} x2={width} y2={height - (tick / maxCount) * height} stroke="#c7ecee" strokeWidth="1.5" />
                                                                )}
                                                                <text x={paddingLeft - 10} y={height - (tick / maxCount) * height} textAnchor="end" alignmentBaseline="middle" className="text-[14px] fill-[#2f3640] font-medium">{tick}</text>
                                                            </g>
                                                        ))}

                                                        {/* Line Chart */}
                                                        <path d={pathData} fill="none" stroke="#ff5252" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                                        
                                                        {/* X-Axis labels */}
                                                        {points.map((p, i) => (
                                                            <text key={`x-${i}`} x={p.x} y={height + 25} textAnchor="middle" className="text-[14px] fill-[#2f3640] font-medium">{p.hour}h</text>
                                                        ))}

                                                        {/* Axes with Arrows */}
                                                        {/* Y Axis */}
                                                        <line x1={paddingLeft} y1={height} x2={paddingLeft} y2={-10} stroke="#2f3640" strokeWidth="2" />
                                                        <polygon points={`${paddingLeft}, -15 ${paddingLeft - 5}, -3 ${paddingLeft + 5}, -3`} fill="#2f3640" />
                                                        
                                                        {/* X Axis */}
                                                        <line x1={paddingLeft} y1={height} x2={width + 10} y2={height} stroke="#2f3640" strokeWidth="2" />
                                                        <polygon points={`${width + 15}, ${height} ${width + 3}, ${height - 5} ${width + 3}, ${height + 5}`} fill="#2f3640" />
                                                    </svg>
                                                    <div className="absolute top-0 left-0 text-[11px] font-bold text-[#2f3640] -translate-y-8 translate-x-4 flex flex-col items-center">
                                                        <span>nombre</span>
                                                        <span>de cmd</span>
                                                    </div>
                                                    <div className="absolute bottom-0 right-0 text-[11px] font-bold text-[#2f3640] translate-y-6 flex flex-col items-start">
                                                        <span>heures</span>
                                                    </div>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold text-xs uppercase tracking-widest">Aucune donnée pour aujourd'hui</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ia' && <IAAssistant />}

                {activeTab === 'menu' && (
                    <div className="animate-fade-in-up space-y-12">
                        {restaurantSettings && (
                            <div className="bg-white p-8 rounded-[2.5rem] border-4 border-[#f0c850] shadow-xl mb-12">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-2xl">🚀</span>
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#2c2c2c]">Mise en Avant (Bannière)</h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-stone-400 mb-1 block">Texte Principal</label>
                                            <input 
                                                value={restaurantSettings.promoText || ''} 
                                                onChange={e => setRestaurantSettings({...restaurantSettings, promoText: e.target.value})} 
                                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 font-black uppercase text-xs focus:border-[#f0c850] outline-none" 
                                                placeholder="NOUVEAUTÉS"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-stone-400 mb-1 block">Prix (€)</label>
                                            <input 
                                                type="number" step="0.01"
                                                value={restaurantSettings.promoPrice || ''} 
                                                onChange={e => setRestaurantSettings({...restaurantSettings, promoPrice: parseFloat(e.target.value) || null})} 
                                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 font-black text-xs focus:border-[#f0c850] outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-stone-400 mb-1 block">Lien de la bannière</label>
                                            <select 
                                                value={restaurantSettings.promoCategoryId || ''} 
                                                onChange={e => setRestaurantSettings({...restaurantSettings, promoCategoryId: e.target.value})} 
                                                className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-100 font-black uppercase text-[10px] focus:border-[#f0c850] outline-none"
                                            >
                                                <option value="">Aucun lien</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase text-stone-400 mb-1 block">Photo de fond</label>
                                            <div className="relative w-full h-[46px] bg-[#2c2c2c] rounded-xl overflow-hidden flex items-center justify-center border-2 border-[#2c2c2c]">
                                                {uploadingItemId === 'promo' ? (
                                                    <span className="text-[10px] font-black text-[#f0c850] animate-pulse">CHARGEMENT...</span>
                                                ) : (
                                                    <>
                                                        <span className="text-[10px] font-black text-[#f0c850] uppercase tracking-widest">Changer la Photo 📸</span>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                 const file = e.target.files?.[0];
                                                                 if (!file) return;
                                                                 setUploadingItemId('promo');
                                                                 try {
                                                                     const formData = new FormData();
                                                                     formData.append('file', file);
                                                                     const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                                                                     if (uploadRes.ok) {
                                                                         const data = await uploadRes.json();
                                                                         setRestaurantSettings({...restaurantSettings, promoImage: data.url});
                                                                         toast.success('Bannière mise à jour !');
                                                                     }
                                                                 } finally { setUploadingItemId(null); }
                                                             }}
                                                             className="absolute inset-0 opacity-0 cursor-pointer"
                                                         />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="w-full h-24 rounded-2xl overflow-hidden border-2 border-stone-100 relative bg-stone-50">
                                            {restaurantSettings.promoImage ? (
                                                <img src={restaurantSettings.promoImage} className="w-full h-full object-cover" alt="Promo" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs font-bold uppercase tracking-widest">Aperçu</div>
                                            )}
                                        </div>
                                        <button 
                                            onClick={saveSettings} 
                                            disabled={settingsSaving}
                                            className="w-full py-4 bg-[#2c2c2c] text-[#f0c850] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                                        >
                                            {settingsSaving ? 'Sauvegarde...' : 'VALIDER LA BANNIÈRE'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 mb-8">
                            <button onClick={() => setIsAddingCategory(true)} className="px-6 py-3 bg-[#4a5d4e] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#3a4a3e] transition-colors">+ Nouvelle Catégorie</button>
                            <button onClick={() => setIsAddingItem(true)} className="px-6 py-3 bg-[#e8b830] text-[#2c2c2c] rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-[#d4a520] transition-colors">+ Nouveau Plat</button>
                        </div>
                        {categories.map(cat => (
                            <div key={cat.id} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400">{cat.name}</h3>
                                    <div className="flex-1 h-px bg-stone-100" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {cat.items.map(item => (
                                        <div key={item.id} className="p-8 rounded-[2.5rem] bg-white border border-stone-200 flex gap-8 items-center shadow-sm hover:border-stone-300 transition-colors">
                                            <div className="w-24 h-24 rounded-3xl bg-stone-50 flex-shrink-0 overflow-hidden border border-stone-100">
                                                {item.image ? <img src={item.image} className="w-full h-full object-contain p-2" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🍕</div>}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-black text-sm uppercase tracking-tight text-[#2c2c2c]">{item.name}</span>
                                                <div className="mt-2 font-black text-lg text-[#e8b830]">{item.price.toFixed(2)}€</div>
                                                <div className="flex gap-2 mt-4">
                                                    <button onClick={() => setEditingItem(item)} className="px-5 py-2 rounded-xl bg-[#2c2c2c] text-[10px] font-black uppercase tracking-widest text-[#f0c850] hover:bg-black transition-colors shadow-sm">Éditer</button>
                                                    <button onClick={() => toggleAvailability(item)} className="px-5 py-2 rounded-xl bg-stone-100 text-[10px] font-black uppercase tracking-widest text-[#2c2c2c] hover:bg-stone-200 transition-colors shadow-sm">{item.isAvailable ? 'Désactiver' : 'Activer'}</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'tables' && (
                    <div className="animate-fade-in-up space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="p-10 rounded-[3rem] bg-white border border-stone-200 shadow-sm h-fit">
                                <h3 className="text-xl font-black uppercase tracking-wider text-[#2c2c2c] mb-8">Nouvelle Table 🪑</h3>
                                <div className="space-y-6">
                                    <input value={newTableCode} onChange={e => setNewTableCode(e.target.value)} className="w-full px-6 py-4 rounded-xl bg-stone-50 border-2 border-stone-200 font-black uppercase focus:border-[#f0c850] outline-none" placeholder="EX: P1" />
                                    <input value={newTableLabel} onChange={e => setNewTableLabel(e.target.value)} className="w-full px-6 py-4 rounded-xl bg-stone-50 border-2 border-stone-200 font-bold focus:border-[#f0c850] outline-none" placeholder="EX: Terrasse Sud" />
                                    <button onClick={addTable} className="w-full py-5 bg-[#2c2c2c] text-[#f0c850] rounded-xl font-black text-xs uppercase hover:bg-black transition-colors">Enregistrer</button>
                                </div>
                            </div>
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {tables.map(table => (
                                    <div key={table.id} className="p-8 rounded-[2.5rem] bg-white border border-stone-200 flex items-center gap-8 shadow-sm relative hover:border-stone-300 transition-colors">
                                        <button onClick={() => deleteTable(table.id)} className="absolute top-4 right-4 text-stone-300 hover:text-red-500 font-bold transition-colors">✕</button>
                                        <div className="p-4 bg-white rounded-2xl border border-stone-100 shadow-sm">
                                            <QRCodeSVG value={`${baseUrl}/r/${restaurantSlug}/t/${table.tableCode}`} size={100} level="H" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-[#2c2c2c] tracking-tighter">{table.tableCode}</p>
                                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{table.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && restaurantSettings && (
                    <div className="animate-fade-in-up space-y-12 max-w-3xl mx-auto">
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-[#1c1917] to-[#2c2c2c] text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0c850]/10 rounded-full blur-[80px] pointer-events-none" />
                            <div className="relative z-10 flex flex-col lg:flex-row gap-10">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black uppercase tracking-wider mb-2 flex items-center gap-3">
                                        <span className="text-4xl">✨</span> Générateur de Thèmes IA
                                    </h3>
                                    <p className="text-stone-400 text-sm mb-8">L'IA configure automatiquement les couleurs et le style de votre menu. Aperçu en temps réel sur le téléphone ci-contre.</p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { id: 'luxe', label: 'Gastronomie Luxe', icon: '✨', color: '#2c2c2c', desc: 'Élégant, minimaliste, premium', image: '' },
                                            { id: 'fastfood', label: 'Street Food', icon: '🔥', color: '#DC2626', desc: 'Dynamique, stimule l\'appétit', image: '' },
                                            { id: 'italien', label: 'Trattoria', icon: '🍝', color: '#f0c850', desc: 'Chaud, convivial, familial', image: '' },
                                            { id: 'healthy', label: 'Bio & Healthy', icon: '🥗', color: '#4a5d4e', desc: 'Naturel, frais, végétarien', image: '' },
                                        ].map(theme => (
                                            <button 
                                                key={theme.id}
                                                onClick={() => {
                                                    isPreviewingRef.current = true;
                                                    if (!originalThemeColor && restaurantSettings) {
                                                        setOriginalThemeColor(restaurantSettings.accentColor);
                                                    }
                                                    const newSettings = { ...restaurantSettings, accentColor: theme.color, themeMode: theme.id };
                                                    setRestaurantSettings(newSettings);
                                                    setPreviewThemeColor(theme.color);
                                                    setPreviewThemeImage(theme.image);
                                                    fetch('/api/admin/restaurant', {
                                                        method: 'PATCH',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ ...newSettings, slug: restaurantSlug }),
                                                    }).catch(() => {});
                                                }}
                                                className="text-left p-5 rounded-2xl bg-white/5 border-2 border-white/10 hover:border-[#f0c850] hover:bg-white/10 transition-all group"
                                            >
                                                <div className="flex items-center gap-4 mb-2">
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white/20" style={{ backgroundColor: theme.color }}>
                                                        {theme.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-sm uppercase tracking-wide group-hover:text-[#f0c850] transition-colors">{theme.label}</h4>
                                                        <p className="text-[10px] text-stone-400 font-bold">{theme.desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center lg:w-80">
                                    <div className="w-[300px] h-[600px] bg-white rounded-[3rem] border-[12px] border-[#111] shadow-2xl relative overflow-hidden flex-shrink-0 animate-fade-in ring-4 ring-white/10">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111] rounded-b-xl z-50"></div>
                                        <iframe 
                                            src={`/r/${restaurantSlug}/t/P1`} 
                                            className="w-full h-full border-none"
                                            title="Aperçu Mobile"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-white border border-stone-200 shadow-sm">
                            <h3 className="text-xl font-black uppercase tracking-wider text-[#2c2c2c] mb-10">Couleurs Personnalisées 🎨</h3>
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase text-stone-500 block">Ajustement Manuel de la Nuance</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['#2c2c2c', '#f0c850', '#e8b830', '#DC2626', '#E85D04', '#4a5d4e'].map(color => (
                                            <button 
                                                key={color} 
                                                onClick={async () => {
                                                    const newSettings = { ...restaurantSettings, accentColor: color };
                                                    setRestaurantSettings(newSettings);
                                                    try {
                                                        await fetch('/api/admin/restaurant', {
                                                            method: 'PATCH',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ ...newSettings, slug: restaurantSlug }),
                                                        });
                                                    } catch (e) {}
                                                }} 
                                                className={cn("w-14 h-14 rounded-xl border-4 transition-all", restaurantSettings.accentColor === color ? "border-stone-800 scale-110" : "border-stone-100")} 
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {editingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-hidden">
                        <div className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative border-4 border-[#f0c850]">
                            {/* Sticky Header */}
                            <div className="p-8 pb-4 border-b border-stone-100 flex justify-between items-center bg-white rounded-t-[1.8rem] z-10">
                                <h2 className="text-2xl font-black uppercase tracking-wider text-[#2c2c2c]">Modifier le Plat</h2>
                                <button onClick={() => setEditingItem(null)} className="text-stone-400 hover:text-stone-800 font-bold text-xl transition-colors">✕</button>
                            </div>
                            
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 custom-scrollbar">
                                {/* Basic Info Section */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-stone-500 mb-2 block">Nom du produit</label>
                                        <input 
                                            value={editingItem.name} 
                                            onChange={e => setEditingItem({...editingItem, name: e.target.value})} 
                                            className="w-full px-5 py-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-black uppercase focus:border-[#f0c850] outline-none transition-all" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-stone-500 mb-2 block">Prix (€)</label>
                                            <input 
                                                type="number" step="0.01" 
                                                value={editingItem.price} 
                                                onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})} 
                                                className="w-full px-5 py-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-black focus:border-[#f0c850] outline-none transition-all" 
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-stone-500 mb-2 block">Photo du produit</label>
                                            <div className="relative w-full h-[56px] bg-[#2c2c2c] border-2 border-[#2c2c2c] rounded-xl overflow-hidden flex items-center justify-center group">
                                                {uploadingItemId === editingItem.id ? (
                                                    <span className="text-[10px] font-black text-[#f0c850] animate-pulse">ENVOI...</span>
                                                ) : (
                                                    <>
                                                        <span className="text-[10px] font-black text-[#f0c850] uppercase tracking-widest group-hover:scale-110 transition-transform">Changer Photo 📸</span>
                                                        <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;
                                                                setUploadingItemId(editingItem.id);
                                                                try {
                                                                    const formData = new FormData();
                                                                    formData.append('file', file);
                                                                    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                                                                    if (res.ok) {
                                                                        const data = await res.json();
                                                                        setEditingItem({...editingItem, image: data.url});
                                                                        toast.success('Photo mise à jour !');
                                                                    }
                                                                } finally { setUploadingItemId(null); }
                                                            }}
                                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-stone-500 mb-2 block">Description</label>
                                        <textarea 
                                            value={editingItem.description || ''} 
                                            onChange={e => setEditingItem({...editingItem, description: e.target.value})} 
                                            className="w-full px-5 py-4 rounded-xl bg-stone-50 border-2 border-stone-100 font-medium focus:border-[#f0c850] outline-none h-24 resize-none transition-all" 
                                            placeholder="Ingrédients, détails..."
                                        />
                                    </div>
                                </div>

                                {/* Variants Section */}
                                <div className="space-y-4 pt-6 border-t border-stone-100">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[11px] font-black uppercase text-[#e8b830] tracking-[0.2em] flex items-center gap-2">
                                            <span>⚡</span> Configuration des Variantes
                                        </h3>
                                    </div>
                                    
                                    {editingItem.optionGroups && editingItem.optionGroups.length > 0 ? (
                                        <div className="space-y-4">
                                            {editingItem.optionGroups.map((group, gIdx) => (
                                                <div key={group.id} className="p-5 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-stone-400 uppercase mb-1">Groupe</span>
                                                            <input 
                                                                value={group.name} 
                                                                onChange={e => {
                                                                    const newGroups = [...(editingItem.optionGroups || [])];
                                                                    newGroups[gIdx].name = e.target.value;
                                                                    setEditingItem({...editingItem, optionGroups: newGroups});
                                                                }}
                                                                className="bg-transparent font-black uppercase text-[11px] outline-none border-b border-transparent focus:border-[#f0c850] w-full" 
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[8px] font-black text-stone-400 uppercase mb-1">Type</span>
                                                            <span className="text-[9px] font-black bg-[#2c2c2c] px-2 py-1 rounded-lg text-[#f0c850] uppercase tracking-widest">{group.type === 'radio' ? 'Unique' : 'Plusieurs'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {group.options.map((opt, oIdx) => (
                                                            <div key={opt.id} className="flex gap-3 items-center bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
                                                                <input 
                                                                    value={opt.name} 
                                                                    onChange={e => {
                                                                        const newGroups = [...(editingItem.optionGroups || [])];
                                                                        newGroups[gIdx].options[oIdx].name = e.target.value;
                                                                        setEditingItem({...editingItem, optionGroups: newGroups});
                                                                    }}
                                                                    className="flex-1 text-[11px] font-bold outline-none uppercase"
                                                                />
                                                                <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                                                                    <span className="text-[9px] font-black text-stone-400">+</span>
                                                                    <input 
                                                                        type="number" step="0.1"
                                                                        value={opt.priceDelta} 
                                                                        onChange={e => {
                                                                            const newGroups = [...(editingItem.optionGroups || [])];
                                                                            newGroups[gIdx].options[oIdx].priceDelta = parseFloat(e.target.value) || 0;
                                                                            setEditingItem({...editingItem, optionGroups: newGroups});
                                                                        }}
                                                                        className="w-12 text-[11px] font-black text-[#e8b830] outline-none bg-transparent"
                                                                    />
                                                                    <span className="text-[9px] font-black text-[#e8b830]">€</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 border-2 border-dashed border-stone-100 rounded-3xl text-center">
                                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Aucune variante sur ce plat</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sticky Footer */}
                            <div className="p-8 border-t border-stone-100 bg-stone-50 rounded-b-[1.8rem]">
                                <button 
                                    onClick={() => saveMenuItem(editingItem)} 
                                    className="w-full py-5 bg-[#2c2c2c] text-[#f0c850] rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-xl"
                                >
                                    Enregistrer les Modifications
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* --- ADD CATEGORY MODAL --- */}
                {isAddingCategory && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative border-4 border-[#4a5d4e]">
                            <button onClick={() => setIsAddingCategory(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 font-bold text-xl">✕</button>
                            <h2 className="text-xl font-black uppercase tracking-wider text-[#2c2c2c] mb-6">Nouvelle Catégorie</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-stone-500 mb-1 block">Nom de la catégorie</label>
                                    <input 
                                        value={newCategoryName} 
                                        onChange={e => setNewCategoryName(e.target.value)} 
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-200 font-black uppercase focus:border-[#4a5d4e] outline-none" 
                                        placeholder="Ex: Pizzas, Boissons..."
                                    />
                                </div>
                                <button 
                                    onClick={createCategory} 
                                    className="w-full py-4 mt-4 bg-[#4a5d4e] text-white rounded-xl font-black text-xs uppercase hover:bg-[#3a4a3e] transition-colors"
                                >
                                    Créer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ADD ITEM MODAL --- */}
                {isAddingItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative border-4 border-[#e8b830]">
                            <button onClick={() => setIsAddingItem(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 font-bold text-xl">✕</button>
                            <h2 className="text-2xl font-black uppercase tracking-wider text-[#2c2c2c] mb-6">Nouveau Plat</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-stone-500 mb-1 block">Catégorie</label>
                                    <select 
                                        value={newItem.categoryId} 
                                        onChange={e => setNewItem({...newItem, categoryId: e.target.value})} 
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-200 font-black uppercase focus:border-[#e8b830] outline-none"
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-stone-500 mb-1 block">Nom du plat</label>
                                    <input 
                                        value={newItem.name} 
                                        onChange={e => setNewItem({...newItem, name: e.target.value})} 
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-200 font-black uppercase focus:border-[#e8b830] outline-none" 
                                        placeholder="Ex: Pizza Margherita"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-stone-500 mb-1 block">Prix (€)</label>
                                    <input 
                                        type="number" step="0.01" 
                                        value={newItem.price || ''} 
                                        onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})} 
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-200 font-black focus:border-[#e8b830] outline-none" 
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-stone-500 mb-1 block">Description</label>
                                    <textarea 
                                        value={newItem.description || ''} 
                                        onChange={e => setNewItem({...newItem, description: e.target.value})} 
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-2 border-stone-200 font-medium focus:border-[#e8b830] outline-none h-24 resize-none" 
                                    />
                                </div>
                                <button 
                                    onClick={createMenuItem} 
                                    className="w-full py-4 mt-4 bg-[#e8b830] text-[#2c2c2c] rounded-xl font-black text-xs uppercase hover:bg-[#d4a520] transition-colors"
                                >
                                    Créer le plat
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Preview Theme Banner */}
            {previewThemeColor && restaurantSettings && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 flex flex-col md:flex-row items-center gap-8 z-50 animate-fade-in-up" style={{ borderColor: previewThemeColor }}>
                    <div className="flex flex-col gap-4 items-center">
                        <div className="text-center">
                            <span className="font-black text-[#2c2c2c] uppercase tracking-widest text-lg flex items-center gap-2 justify-center">
                                <span className="animate-pulse text-2xl">✨</span> Sauvegarder ce style ?
                            </span>
                            <p className="text-stone-500 text-sm font-medium mt-1">Le rendu final est visible sur le téléphone au-dessus.</p>
                        </div>
                        <div className="flex items-center gap-4 w-full">
                            <button 
                                onClick={async () => {
                                    try {
                                        await fetch('/api/admin/restaurant', {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ...restaurantSettings, slug: restaurantSlug }),
                                        });
                                        toast.success("Le nouveau thème a été enregistré avec succès !");
                                    } catch (e) {
                                        toast.error("Erreur lors de l'enregistrement du thème.");
                                    }
                                    setPreviewThemeColor(null);
                                    setPreviewThemeImage(null);
                                    setOriginalThemeColor(null);
                                    isPreviewingRef.current = false;
                                }} 
                                className="flex-1 py-4 rounded-xl text-white font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-transform" 
                                style={{ backgroundColor: previewThemeColor }}
                            >
                                Accepter ✅
                            </button>
                            <button 
                                onClick={() => {
                                    if (originalThemeColor) {
                                        const reverted = { ...restaurantSettings, accentColor: originalThemeColor };
                                        setRestaurantSettings(reverted);
                                        fetch('/api/admin/restaurant', {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ...reverted, slug: restaurantSlug }),
                                        }).catch(() => {});
                                    }
                                    setPreviewThemeColor(null);
                                    setPreviewThemeImage(null);
                                    setOriginalThemeColor(null);
                                    isPreviewingRef.current = false;
                                }} 
                                className="px-6 py-4 rounded-xl bg-stone-100 text-stone-600 font-black uppercase tracking-widest text-sm hover:bg-stone-200 transition-colors"
                            >
                                Annuler ❌
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
