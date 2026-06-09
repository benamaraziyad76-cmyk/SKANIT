'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';

interface OrderItem {
    id: string;
    quantity: number;
    menuItem: { name: string };
    notes: string | null;
}

interface Order {
    id: string;
    orderNumber: number;
    status: string;
    table: { label: string };
    items: OrderItem[];
    createdAt: string;
}

export default function WaiterDashboard() {
    const params = useParams();
    const router = useRouter();
    const restaurantSlug = params.slug as string;
    
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`/api/orders?restaurantSlug=${restaurantSlug}`);
            if (res.ok) {
                const data = await res.json();
                setOrders(data.filter((o: Order) => ['READY'].includes(o.status)));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [restaurantSlug]);

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 3000); // Polling faster
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: newStatus }),
            });
            toast.success(`Commande servie ! ✅`);
            fetchOrders();
        } catch (e) {
            toast.error('Erreur lors de la mise à jour');
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-[#fdfbf7] text-stone-900 font-sans p-6 relative overflow-hidden">
            {/* Dolce Vita Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <Toaster richColors position="top-center" />
            <header className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20 text-white border border-yellow-300">🍋</div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic">La Salle</h1>
                        <p className="text-yellow-600 text-xs font-bold uppercase tracking-widest">{restaurantSlug}</p>
                    </div>
                </div>
                <button
                    onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        router.push('/login');
                    }}
                    className="px-6 py-3 rounded-2xl bg-white border-2 border-yellow-200 text-xs font-bold hover:bg-yellow-50 transition-all text-stone-600"
                >
                    Déconnexion
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {orders.map(order => (
                    <div key={order.id} className="p-6 rounded-3xl bg-white/80 backdrop-blur-sm shadow-xl shadow-yellow-900/5 border-2 border-yellow-200 hover:border-yellow-400 transition-colors">
                        <div className="flex justify-between items-center mb-6 border-b border-yellow-100 pb-4">
                            <span className="text-3xl font-black text-stone-800 font-serif">#{order.orderNumber}</span>
                            <span className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-800 font-black text-sm border border-yellow-200 shadow-sm">{order.table.label}</span>
                        </div>
                        <div className="space-y-3 mb-8">
                            {order.items.map(item => (
                                <div key={item.id} className="flex gap-3 text-sm font-bold text-stone-700">
                                    <span className="text-yellow-600">{item.quantity}x</span>
                                    <span>{item.menuItem.name}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => updateStatus(order.id, 'SERVED')}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-green-500 text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-green-500/20 border border-green-300"
                        >
                            Marquer comme Servi
                        </button>
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white/50 rounded-3xl border-2 border-dashed border-yellow-200">
                        <div className="text-6xl mb-4 opacity-70">🌿</div>
                        <p className="text-stone-500 font-bold uppercase tracking-widest mt-4">Aucune commande prête à servir</p>
                    </div>
                )}
            </div>
        </div>
    );
}
