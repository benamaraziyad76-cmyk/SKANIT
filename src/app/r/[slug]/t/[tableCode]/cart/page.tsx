'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { formatPrice, cn } from '@/lib/utils';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function CartPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const tableCode = params.tableCode as string;

    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH' | 'APPLE_PAY'>('CARD');
    const [showWaiterModal, setShowWaiterModal] = useState(false);

    const handleOrder = async (extraItems: any[] = []) => {
        setIsSubmitting(true);
        
        try {
            const allItems = [
                ...items.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    unitPrice: item.basePrice,
                    notes: item.exclusions && item.exclusions.length > 0 
                        ? item.exclusions.join(', ') + (item.notes ? ' | ' + item.notes : '') 
                        : item.notes,
                    selectedOptions: item.selectedOptions.map(opt => opt.optionItemId)
                })),
                ...extraItems
            ];

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    restaurantSlug: slug,
                    tableCode,
                    items: allItems,
                    paymentMethod,
                    total: subtotal + extraItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0)
                })
            });

            if (res.ok) {
                toast.success('Commande envoyée en cuisine !');
                const total = subtotal + extraItems.reduce((acc, curr) => acc + (curr.unitPrice * curr.quantity), 0);
                clearCart();
                setTimeout(() => router.push(`/r/${slug}/t/${tableCode}/success?payment=${paymentMethod}&total=${total.toFixed(2)}`), 1500);
            } else {
                const err = await res.json();
                toast.error(err.error || 'Erreur lors de la commande.');
            }
        } catch (error) {
            toast.error('Erreur réseau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f5f0] text-[#2c2c2c] font-serif p-6 md:p-12 relative">
            <Toaster position="top-center" richColors />
            


            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <button 
                        onClick={() => setShowWaiterModal(true)}
                        className="w-14 h-14 rounded-full bg-white border border-stone-200 flex items-center justify-center text-xl shadow-sm hover:scale-110 transition-transform"
                    >
                        🔔
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-3xl font-light italic text-[#4a5d4e] uppercase tracking-[0.2em]">
                            LA <span className="font-bold">SCAMPIA</span>
                        </h1>
                        <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mt-1">X SKANIT</span>
                    </div>
                    <div className="w-14 h-14" /> {/* Spacer */}
                </header>

                {/* --- WAITER MODAL IN CART --- */}
                {showWaiterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in">
                        <div className="bg-[#f8f5f0] rounded-[3rem] p-10 max-w-sm w-full shadow-2xl border-4 border-yellow-500/20 animate-scale-up">
                            <div className="text-center mb-10">
                                <div className="text-5xl mb-4">🤵‍♂️</div>
                                <h3 className="text-2xl font-black text-[#4a5d4e] uppercase tracking-tighter italic">Besoin d&apos;un serveur ?</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <button 
                                    onClick={() => {
                                        setPaymentMethod('CASH');
                                        toast.success("Mode de paiement 'Espèces' sélectionné.");
                                        setShowWaiterModal(false);
                                    }}
                                    className="w-full py-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left px-8 flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="block font-black text-stone-800 uppercase text-xs tracking-widest mb-1">Addition Espèces</span>
                                        <span className="block text-stone-500 text-[10px] font-bold">Le serveur viendra à votre table</span>
                                    </div>
                                    <span className="text-2xl group-hover:translate-x-1 transition-transform">💶</span>
                                </button>

                                <button 
                                    onClick={() => {
                                        toast.success("Serveur appelé !");
                                        setShowWaiterModal(false);
                                    }}
                                    className="w-full py-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left px-8 flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="block font-black text-stone-800 uppercase text-xs tracking-widest mb-1">Autre demande</span>
                                        <span className="block text-stone-500 text-[10px] font-bold">Un serveur arrive...</span>
                                    </div>
                                    <span className="text-2xl group-hover:translate-x-1 transition-transform">🛎️</span>
                                </button>
                            </div>

                            <button 
                                onClick={() => setShowWaiterModal(false)}
                                className="w-full mt-8 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest hover:text-stone-600 transition-colors"
                            >
                                Retour au panier
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {items.length === 0 ? (
                            <div className="bg-white rounded-[3rem] p-16 text-center border border-stone-100 shadow-sm">
                                <span className="text-6xl mb-6 block">🛒</span>
                                <h2 className="text-2xl font-bold text-stone-300 uppercase tracking-widest">Votre panier est vide</h2>
                                <button onClick={() => router.back()} className="mt-8 text-[#4a5d4e] font-bold border-b-2 border-[#4a5d4e] pb-1 uppercase text-xs tracking-widest">Retour au menu</button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-sm flex items-center gap-8 group animate-fade-in">
                                    <div className="w-24 h-24 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-stone-100 p-2 flex-shrink-0 flex items-center justify-center">
                                        <img src={item.menuItemImage || ''} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={item.menuItemName} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold uppercase tracking-tight text-[#2c2c2c]">{item.menuItemName}</h3>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {item.selectedOptions.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.selectedOptions.map(opt => (
                                                        <span key={opt.optionItemId} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase font-bold border border-emerald-100">
                                                            + {opt.optionGroupName}: {opt.optionItemName} {opt.priceDelta > 0 && `(+${opt.priceDelta.toFixed(2)}€)`}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.exclusions && item.exclusions.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {item.exclusions.map(exc => (
                                                        <span key={exc} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded uppercase font-bold border border-red-100">
                                                            {exc}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[#b35a38] font-black italic mt-2">{item.totalPrice.toFixed(2)}€</p>
                                        <div className="flex items-center gap-4 mt-4">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-lg hover:bg-[#4a5d4e] hover:text-white transition-colors">-</button>
                                            <span className="font-black text-lg w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-lg hover:bg-[#4a5d4e] hover:text-white transition-colors">+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-500 transition-colors text-xl">✕</button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 border border-stone-100 shadow-xl space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6">Moyen de paiement</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'CARD', label: 'Carte Bancaire', icon: '💳' },
                                        { id: 'CASH', label: 'Espèces (Payer en Caisse)', icon: '💶' }
                                    ].map((m) => (
                                        <button 
                                            key={m.id}
                                            onClick={() => setPaymentMethod(m.id as any)}
                                            className={cn(
                                                "w-full p-6 rounded-3xl border-2 flex items-center gap-4 transition-all text-left",
                                                paymentMethod === m.id ? "border-[#4a5d4e] bg-[#4a5d4e]/5 text-[#4a5d4e]" : "border-stone-50 hover:border-stone-200"
                                            )}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-2xl">{m.icon}</span>
                                                    <div>
                                                        <span className="font-black text-sm uppercase tracking-widest block">{m.label}</span>
                                                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">
                                                            {m.id === 'CASH' ? 'Validez et payez au comptoir' : 'Paiement sécurisé'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {paymentMethod === m.id && <span className="text-xs font-black text-[#4a5d4e]">✓</span>}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-stone-100">
                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">Total à payer</span>
                                    <span className="text-4xl font-black text-[#4a5d4e] italic">{subtotal.toFixed(2)}€</span>
                                </div>
                                <button 
                                    onClick={() => handleOrder()}
                                    disabled={items.length === 0 || isSubmitting}
                                    className="w-full py-6 bg-[#4a5d4e] text-white rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-[#3a4a3e] transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isSubmitting ? 'Envoi...' : 'Confirmer la commande'}
                                    <span className="text-xl">✨</span>
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-[9px] font-bold text-stone-400 uppercase tracking-widest px-8">En cliquant, vous acceptez nos conditions de vente &quot;Dolce Vita&quot;.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
