'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-store';
import { MenuData, MenuItem, OptionGroup, OptionItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Toaster, toast } from 'sonner';

function ItemModal({ 
    item, 
    categories, 
    onClose, 
    onAdd,
    onAddSuggestion
}: { 
    item: MenuItem; 
    categories: any[];
    onClose: () => void; 
    onAdd: (cartItem: any) => void;
    onAddSuggestion: (cartItem: any) => void;
}) {
    const { subtotal } = useCart();
    const [step, setStep] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
    const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);
    const [addedSuggestions, setAddedSuggestions] = useState<Set<string>>(new Set());
    
    // Generic demo exclusions based on what user asked to see
    const demoExclusions = ['Sans Salade', 'Sans Tomate', 'Sans Oignon', 'Sans Sauce'];

    // Find upsell items (Drinks & Desserts)
    const upsellItems = categories
        .filter(c => c.name.toLowerCase().includes('boisson') || c.name.toLowerCase().includes('dessert'))
        .flatMap(c => c.items)
        .filter(i => i.id !== item.id)
        .slice(0, 4);

    const toggleOption = (group: OptionGroup, option: OptionItem) => {
        setSelectedOptions(prev => {
            const current = prev[group.id] || [];
            if (group.type === 'radio') {
                const next = { ...prev, [group.id]: [option.id] };
                // Reset meat selection if size changes to ensure validity
                if (group.name.toUpperCase().includes("NOMBRE DE VIANDES")) {
                    const meatGroup = item.optionGroups?.find(g => g.name.toUpperCase().includes("CHOIX DES VIANDES"));
                    if (meatGroup) next[meatGroup.id] = [];
                }
                return next;
            } else {
                // Selection Limit for Tacos Meats
                if (group.name.toUpperCase().includes("CHOIX DES VIANDES")) {
                    const sizeGroup = item.optionGroups?.find(g => g.name.toUpperCase().includes("NOMBRE DE VIANDES"));
                    if (sizeGroup) {
                        const selectedSizeId = prev[sizeGroup.id]?.[0];
                        const selectedSize = sizeGroup.options.find(o => o.id === selectedSizeId)?.name || '';
                        
                        let limit = 1;
                        if (selectedSize.includes('2')) limit = 2;
                        if (selectedSize.includes('3')) limit = 3;

                        if (!current.includes(option.id) && current.length >= limit) {
                            toast.error(`Sélection limitée à ${limit} viande(s) !`);
                            return prev;
                        }
                    }
                }

                if (current.includes(option.id)) {
                    return { ...prev, [group.id]: current.filter(id => id !== option.id) };
                } else {
                    return { ...prev, [group.id]: [...current, option.id] };
                }
            }
        });
    };

    const toggleExclusion = (exc: string) => {
        setSelectedExclusions(prev => 
            prev.includes(exc) ? prev.filter(e => e !== exc) : [...prev, exc]
        );
    };

    const calculateTotal = () => {
        let total = item.price;
        if (item.optionGroups) {
            item.optionGroups.forEach(group => {
                const selected = selectedOptions[group.id] || [];
                selected.forEach(optId => {
                    const opt = group.options.find(o => o.id === optId);
                    if (opt) total += (opt.priceDelta || 0);
                });
            });
        }
        return total * quantity;
    };

    const handleAdd = () => {
        // Validation for Tacos Meats
        const sizeGroup = item.optionGroups?.find(g => g.name.toUpperCase().includes("NOMBRE DE VIANDES"));
        const meatGroup = item.optionGroups?.find(g => g.name.toUpperCase().includes("CHOIX DES VIANDES"));
        if (sizeGroup && meatGroup) {
            const selectedSizeId = selectedOptions[sizeGroup.id]?.[0];
            if (!selectedSizeId) {
                toast.error("Veuillez choisir la taille (nombre de viandes) !");
                return;
            }
            const selectedSize = sizeGroup.options.find(o => o.id === selectedSizeId)?.name || '';
            const selectedMeatsCount = selectedOptions[meatGroup.id]?.length || 0;
            
            let required = 1;
            if (selectedSize.includes('2')) required = 2;
            if (selectedSize.includes('3')) required = 3;

            if (selectedMeatsCount !== required) {
                toast.error(`Veuillez choisir exactement ${required} viande(s) !`);
                return;
            }
        }

        const optionsList: any[] = [];
        if (item.optionGroups) {
            item.optionGroups.forEach(group => {
                const selected = selectedOptions[group.id] || [];
                selected.forEach(optId => {
                    const opt = group.options.find(o => o.id === optId);
                    if (opt) {
                        optionsList.push({
                            id: opt.id,
                            optionItemId: opt.id,
                            optionItemName: opt.name,
                            optionGroupName: group.name,
                            priceDelta: opt.priceDelta
                        });
                    }
                });
            });
        }

        onAdd({
            id: Math.random().toString(), // unique cart id
            menuItemId: item.id,
            menuItemName: item.name,
            basePrice: item.price,
            quantity: quantity,
            menuItemImage: item.image,
            selectedOptions: optionsList,
            exclusions: selectedExclusions,
            notes: '',
            totalPrice: calculateTotal()
        });
    };

    const renderStepIndicators = () => (
        <div className="flex justify-center gap-3 mb-10">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                    <div className={cn(
                        "h-2 rounded-full transition-all duration-500", 
                        step === s ? "w-10 bg-[#f0c850]" : step > s ? "w-6 bg-stone-800" : "w-4 bg-stone-200"
                    )} />
                </div>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="bg-stone-50 w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in">
                
                {/* Header Info: Dark Premium Dolce Vita */}
                <div className="relative bg-[#2c2c2c] shrink-0 p-8 flex items-center gap-6 border-b border-stone-800 overflow-hidden">
                    {/* Subtle Pattern Background */}
                    <div className="absolute inset-0 bg-[url('/pattern-scampia.png..png')] bg-cover opacity-10 pointer-events-none" />
                    
                    <button onClick={onClose} className="relative z-10 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-xl hover:bg-white/20 transition-colors border border-white/10">✕</button>
                    
                    <div className="relative z-10 w-24 h-24 bg-stone-50 rounded-3xl p-1 shadow-2xl border border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden flex items-center justify-center">
                        {/* Fond Motif */}
                        <div className="absolute inset-0 bg-[url('/pattern-scampia.png..png')] bg-cover opacity-20" />
                        {/* Assiette Blanche */}
                        <div className="absolute inset-1.5 bg-white rounded-full shadow-sm" />
                        <img src={item.image || 'https://via.placeholder.com/150'} className="w-[85%] h-[85%] object-contain relative z-10" alt={item.name} />
                    </div>
                    
                    <div className="relative z-10 flex-1">
                        <p className="text-[#f0c850] text-[10px] font-black uppercase tracking-[0.3em] mb-1">Détails du produit</p>
                        <h2 className="text-2xl font-black uppercase text-white tracking-tight leading-none">{item.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                             <span className="text-white/60 font-bold text-sm">Prix de base :</span>
                             <span className="text-[#f0c850] font-black text-xl">{item.price.toFixed(2)}€</span>
                        </div>
                    </div>
                    
                    {/* Floating Total Badge inside modal */}
                    <div className="absolute top-8 right-8 bg-[#f0c850] text-[#2c2c2c] px-4 py-2 rounded-xl font-black text-xs shadow-xl hidden md:block">
                        TOTAL PANIER : {(subtotal + (step === 3 ? calculateTotal() : 0)).toFixed(2)}€
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 pb-32 no-scrollbar bg-white">
                    {renderStepIndicators()}

                    {/* --- STEP 1: CUSTOMIZATION --- */}
                    {step === 1 && (
                        <div className="animate-fade-in-up">
                            <h3 className="text-2xl font-black text-[#2c2c2c] uppercase tracking-wider text-center mb-8">Personnalisez</h3>
                            
                            {/* Option Groups from DB */}
                            {item.optionGroups && item.optionGroups.map(group => (
                                <div key={group.id} className="mb-8 bg-stone-50 p-6 rounded-3xl border border-stone-200">
                                    <div className="flex justify-between items-end mb-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-[#2c2c2c]">{group.name}</h3>
                                        {group.required && <span className="bg-red-500/10 text-red-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">Obligatoire</span>}
                                    </div>
                                    <div className="space-y-2">
                                        {group.options.map(opt => {
                                            const isSelected = (selectedOptions[group.id] || []).includes(opt.id);
                                            return (
                                                <label key={opt.id} className={cn(
                                                    "flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all bg-white",
                                                    isSelected ? "border-[#f0c850] shadow-sm" : "border-stone-200 hover:border-stone-300"
                                                )}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-6 h-6 border-2 flex items-center justify-center",
                                                            group.type === 'radio' ? "rounded-full" : "rounded-md",
                                                            isSelected ? "border-[#f0c850] bg-[#f0c850]" : "border-stone-300"
                                                        )}>
                                                            {isSelected && <span className="text-black font-black text-[12px]">✓</span>}
                                                        </div>
                                                        <span className="font-bold text-stone-700 text-sm uppercase">{opt.name}</span>
                                                    </div>
                                                    {opt.priceDelta > 0 && <span className="font-black text-[#e8b830] text-sm">+ {opt.priceDelta.toFixed(2)}€</span>}
                                                    <input type={group.type} className="hidden" checked={isSelected} onChange={() => toggleOption(group, opt)} />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Generic Exclusions for Demo */}
                            <div className="mb-8 bg-[#f8f5f0] p-6 rounded-3xl">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#2c2c2c] mb-4">Retirer des ingrédients</h3>
                                <div className="flex flex-wrap gap-2">
                                    {demoExclusions.map(exc => {
                                        const isExcluded = selectedExclusions.includes(exc);
                                        return (
                                            <button 
                                                key={exc}
                                                onClick={() => toggleExclusion(exc)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full border-2 text-xs font-bold uppercase tracking-wider transition-all",
                                                    isExcluded ? "border-red-500 bg-red-500/10 text-red-600" : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
                                                )}
                                            >
                                                {isExcluded ? '✓ ' : ''}{exc}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 2: UPSELLS --- */}
                    {step === 2 && (
                        <div className="animate-fade-in-up">
                            <h3 className="text-2xl font-black text-[#2c2c2c] uppercase tracking-wider text-center mb-2">Pour accompagner</h3>
                            <p className="text-center text-stone-400 font-bold uppercase text-[10px] tracking-widest mb-8">Le total actuel de votre panier est de <span className="text-[#e8b830]">{subtotal.toFixed(2)}€</span></p>
                            
                            {upsellItems.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {upsellItems.map(upsell => {
                                        const isAdded = addedSuggestions.has(upsell.id);
                                        return (
                                            <div key={upsell.id} className="bg-stone-50 p-4 rounded-3xl border border-stone-200 text-center flex flex-col justify-between hover:border-stone-300 transition-colors">
                                                <div>
                                                    <span className="font-black text-xs uppercase text-[#2c2c2c] h-8 flex items-center justify-center">{upsell.name}</span>
                                                    <span className="block text-[#e8b830] font-black mt-1">{upsell.price.toFixed(2)}€</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        onAddSuggestion({
                                                            id: Math.random().toString(),
                                                            menuItemId: upsell.id,
                                                            menuItemName: upsell.name,
                                                            basePrice: upsell.price,
                                                            quantity: 1,
                                                            menuItemImage: upsell.image,
                                                            selectedOptions: [],
                                                            exclusions: [],
                                                            notes: '',
                                                            totalPrice: upsell.price
                                                        });
                                                        setAddedSuggestions(prev => new Set([...prev, upsell.id]));
                                                        toast.success(`${upsell.name} ajouté ! Nouveau total : ${(subtotal + upsell.price).toFixed(2)}€`);
                                                    }}
                                                    className={`mt-4 w-full py-3 rounded-xl font-black text-[11px] uppercase transition-colors ${isAdded ? 'bg-[#2c2c2c] text-[#f0c850] cursor-default' : 'bg-white border-2 border-stone-200 text-[#2c2c2c] hover:bg-stone-100'}`}
                                                >
                                                    {isAdded ? '✓ Ajouté !' : 'Ajouter'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-center text-stone-400 font-bold uppercase text-xs">Aucune suggestion pour le moment.</p>
                            )}
                        </div>
                    )}

                    {/* --- STEP 3: VALIDATION --- */}
                    {step === 3 && (
                        <div className="animate-fade-in-up text-center">
                            <h3 className="text-2xl font-black text-[#2c2c2c] uppercase tracking-wider text-center mb-8">Dernière étape</h3>
                            
                            <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200 shadow-sm mb-8">
                                <span className="block text-sm font-black text-stone-500 uppercase tracking-widest mb-4">Combien en voulez-vous ?</span>
                                <div className="flex items-center justify-center gap-6">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-16 rounded-2xl bg-white border-2 border-stone-200 text-[#2c2c2c] font-black text-2xl hover:bg-stone-100 transition-colors">-</button>
                                    <span className="font-black text-5xl text-[#2c2c2c] w-12 text-center">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-16 h-16 rounded-2xl bg-[#f0c850] text-[#2c2c2c] font-black text-2xl shadow-sm hover:bg-[#e8b830] transition-colors">+</button>
                                </div>
                            </div>
                            
                            <p className="text-sm font-bold text-stone-500 uppercase tracking-widest">Le total de ce plat s'élève à</p>
                            <p className="text-5xl font-black text-[#2c2c2c] mt-2">{calculateTotal().toFixed(2)}€</p>
                            
                            {subtotal > 0 && (
                                <p className="mt-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Total final panier après validation : <span className="text-[#2c2c2c]">{(subtotal + calculateTotal()).toFixed(2)}€</span></p>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-stone-100 p-8 flex justify-between gap-4 shadow-[0_-20px_40px_rgba(0,0,0,0.03)] z-30">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 text-[#2c2c2c] font-black text-2xl flex items-center justify-center hover:bg-stone-100 transition-all active:scale-95">←</button>
                    ) : (
                        <div className="w-16 h-16" />
                    )}
                    
                    {step < 3 ? (
                        <button 
                            onClick={() => setStep(step + 1)}
                            className="flex-1 bg-[#2c2c2c] text-white h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                        >
                            Étape Suivante
                        </button>
                    ) : (
                        <button 
                            onClick={handleAdd}
                            className="flex-1 bg-gradient-to-r from-[#f0c850] to-[#e8b830] text-[#2c2c2c] h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-[0_10px_30px_rgba(240,200,80,0.3)] hover:scale-[1.02] transition-all active:scale-[0.98] border border-[#d4a520]/30"
                        >
                            Valider ({(subtotal + calculateTotal()).toFixed(2)}€ total)
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MenuPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const tableCode = params.tableCode as string;

    const { addItem, totalItems, subtotal } = useCart();

    const [data, setData] = useState<MenuData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [showWaiterModal, setShowWaiterModal] = useState(false);

    useEffect(() => {
        if (!slug) return;
        let isFirstLoad = true;
        const load = () => {
            fetch(`/api/restaurants/${slug}/menu`)
                .then(res => res.json())
                .then(d => {
                    setData(d);
                    if (isFirstLoad) {
                        setLoading(false);
                        if (d.categories && d.categories.length > 0) {
                            setActiveCategory(prev => prev || d.categories[0].id);
                        }
                        isFirstLoad = false;
                    }
                })
                .catch(() => { if(isFirstLoad) setLoading(false); });
        };
        load();
        const interval = setInterval(load, 2500);
        return () => clearInterval(interval);
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen bg-[#f8f5f0] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#4a5d4e] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const categories = data?.categories || [];
    const sidebarCategories = categories.map(cat => ({
        id: cat.id,
        label: cat.name,
        icon: cat.icon || '🍽️'
    }));

    const getAllItems = () => categories.flatMap(c => c.items);
    
    const filteredItems = () => {
        if (!activeCategory) return [];
        return categories.find(c => c.id === activeCategory)?.items || [];
    };

    const accentColor = data?.restaurant?.accentColor || '#f0c850';
    const themeMode = data?.restaurant?.themeMode || 'italien';

    const themeStyles = {
        italien: {
            container: "min-h-screen bg-[#f8f5f0] text-[#2c2c2c] font-serif flex flex-col md:flex-row overflow-hidden relative",
            sidebarWrapper: "w-full md:w-32 lg:w-40 bg-white border-r border-stone-200 flex flex-row md:flex-col py-6 z-30 shrink-0 overflow-x-auto md:overflow-x-visible no-scrollbar",
            categoryBtn: "bg-white text-stone-400 border-transparent hover:bg-stone-50",
            activeCatBtn: "active-cat",
            mainBg: "bg-[#f4f6f8]",
            card: "w-full bg-white rounded-[2rem] p-3 shadow-md border-2 border-stone-100 theme-hover-border transition-all flex flex-col items-center",
            imgContainer: "w-full aspect-square bg-[#f8f8f8] rounded-[1.5rem] flex items-center justify-center relative overflow-hidden mb-3",
            img: "w-[85%] h-[85%] object-contain transition-transform duration-300 group-hover:scale-105",
            footer: "fixed bottom-0 left-0 md:left-32 lg:left-40 right-0 h-28 bg-white border-t border-stone-200 flex items-center justify-between px-6 md:px-10 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
        },
        luxe: {
            container: "min-h-screen bg-[#111] text-stone-200 font-serif flex flex-col md:flex-row overflow-hidden relative",
            sidebarWrapper: "w-full md:w-32 lg:w-40 bg-[#1a1a1a] border-r border-stone-800 flex flex-row md:flex-col py-6 z-30 shrink-0 overflow-x-auto md:overflow-x-visible no-scrollbar",
            categoryBtn: "bg-transparent text-stone-500 border-transparent hover:bg-white/5",
            activeCatBtn: "theme-text border-b-4 md:border-b-0 md:border-r-4 theme-border bg-black/20",
            mainBg: "bg-[#111]",
            card: "w-full bg-[#1a1a1a] rounded-sm p-4 shadow-2xl border border-stone-800 theme-hover-border transition-all flex flex-col items-center",
            imgContainer: "w-full aspect-square bg-[#111] rounded-sm flex items-center justify-center relative overflow-hidden mb-3",
            img: "w-[90%] h-[90%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110",
            footer: "fixed bottom-0 left-0 md:left-32 lg:left-40 right-0 h-28 bg-[#1a1a1a] border-t border-stone-800 flex items-center justify-between px-6 md:px-10 z-40 shadow-2xl"
        },
        fastfood: {
            container: "min-h-screen bg-[#fafafa] text-black font-sans flex flex-col overflow-hidden relative",
            sidebarWrapper: "w-full bg-white border-b border-stone-200 flex flex-row py-4 z-30 shrink-0 overflow-x-auto no-scrollbar",
            categoryBtn: "bg-stone-100 text-stone-500 rounded-full mx-2 px-6 py-2 shrink-0 border-2 border-transparent",
            activeCatBtn: "theme-bg text-white rounded-full mx-2 px-6 py-2 shrink-0 shadow-lg",
            mainBg: "bg-[#fafafa]",
            card: "w-full bg-white rounded-2xl p-4 shadow-sm border-2 border-stone-200 theme-hover-border transition-all flex flex-col items-center",
            imgContainer: "w-full aspect-square bg-transparent rounded-xl flex items-center justify-center relative overflow-hidden mb-3",
            img: "w-[100%] h-[100%] object-contain scale-110 transition-transform duration-200 group-hover:rotate-3",
            footer: "fixed bottom-0 left-0 right-0 h-28 bg-white border-t border-stone-200 flex items-center justify-between px-6 md:px-10 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.08)]"
        },
        healthy: {
            container: "min-h-screen bg-[#f4f7f5] text-[#2c4c3b] font-sans flex flex-col md:flex-row-reverse overflow-hidden relative",
            sidebarWrapper: "w-full md:w-32 lg:w-40 bg-white/60 backdrop-blur-xl border-l border-white flex flex-row md:flex-col py-6 z-30 shrink-0 overflow-x-auto md:overflow-x-visible no-scrollbar",
            categoryBtn: "bg-transparent text-[#2c4c3b]/50 border-transparent hover:bg-white/50 rounded-[2rem] mx-2",
            activeCatBtn: "bg-white theme-text shadow-sm rounded-[2rem] mx-2",
            mainBg: "bg-transparent",
            card: "w-full bg-white/80 backdrop-blur-sm rounded-[3rem] p-3 shadow-lg border border-white theme-hover-border transition-all flex flex-col items-center",
            imgContainer: "w-full aspect-square bg-white rounded-full shadow-inner flex items-center justify-center relative overflow-hidden mb-3",
            img: "w-[100%] h-[100%] object-cover rounded-full transition-transform duration-700 group-hover:scale-105",
            footer: "fixed bottom-0 left-0 md:right-32 lg:right-40 right-0 h-28 bg-white/80 backdrop-blur-xl border-t border-white flex items-center justify-between px-6 md:px-10 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]"
        }
    };
    
    const style = themeStyles[themeMode as keyof typeof themeStyles] || themeStyles.italien;

    return (
        <div className={style.container}>
            <style>{`
                .theme-bg { background-color: ${accentColor} !important; }
                .theme-text { color: ${accentColor} !important; }
                .theme-border { border-color: ${accentColor} !important; }
                .theme-border-b { border-bottom-color: ${accentColor} !important; }
                .theme-hover-border:hover { border-color: ${accentColor} !important; }
                .active-cat { background-color: #2c2c2c !important; color: ${accentColor} !important; border-color: ${accentColor} !important; }
            `}</style>
            <Toaster position="top-center" richColors />

            {selectedItem && (
                <ItemModal 
                    item={selectedItem} 
                    categories={categories}
                    onClose={() => setSelectedItem(null)}
                    onAdd={(cartItem) => {
                        addItem(cartItem);
                        setSelectedItem(null);
                        toast.success(`${cartItem.menuItemName} ajouté !`);
                    }}
                    onAddSuggestion={(item) => addItem(item)}
                />
            )}

            {/* Dolce Vita Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#4a5d4e 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            {/* --- SIDEBAR (LA TIGE) --- */}
            <aside className={style.sidebarWrapper}>
                <div className={cn("px-4 mb-8 flex-col items-center text-center", themeMode === 'fastfood' ? 'hidden' : 'hidden md:flex')}>
                    {/* Logo Borne */}
                    <div className="w-16 h-16 theme-bg rounded-full flex items-center justify-center shadow-sm mb-2">
                         <span className="text-xl font-black text-white tracking-tighter">LS</span>
                    </div>
                </div>
                
                <div className={cn("flex gap-3 px-4", themeMode === 'fastfood' ? 'flex-row items-center w-full' : 'flex-row md:flex-col w-full')}>
                    {sidebarCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 py-6 px-2 transition-all md:w-full group text-center",
                                themeMode !== 'fastfood' && "border-b md:border-b-0 md:border-r-4",
                                activeCategory === cat.id ? style.activeCatBtn : style.categoryBtn
                            )}
                        >
                            <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                            <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                                {cat.label}
                            </span>
                        </button>
                    ))}
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className={cn("flex-1 flex flex-col relative z-10 overflow-hidden", style.mainBg)}>
                
                {/* TOP BAR: Real Coords */}
                <div className={cn("w-full text-stone-400 text-[9px] md:text-xs font-black uppercase tracking-[0.15em] py-4 px-6 flex flex-col sm:flex-row justify-between items-center z-20 shrink-0 gap-3 border-b", themeMode === 'luxe' ? 'bg-[#1a1a1a] border-stone-800' : 'bg-white border-stone-100')}>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span className="theme-text flex items-center gap-1">📍 127 RUE SAINT-HILAIRE, ROUEN</span>
                        <span className="hidden sm:inline opacity-20">|</span>
                        <span className="text-stone-500 flex items-center gap-1">📞 02 76 00 17 23</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className={cn("border-b-2 theme-border-b pb-0.5", themeMode === 'luxe' ? 'text-white' : 'text-[#2c2c2c]')}>OUVERT JUSQU'À 00:00</span>
                        <a href="https://www.instagram.com/lascampia_eat" target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-1.5 transition-colors", themeMode === 'luxe' ? 'text-stone-300 hover:text-white' : 'text-stone-800 hover:text-[#E1306C]')}>
                            <span className="text-base md:text-lg">📸</span>
                            <span className={cn("border-b border-transparent", themeMode === 'luxe' ? 'hover:border-white' : 'hover:border-[#E1306C]')}>@lascampia_eat</span>
                        </a>
                    </div>
                </div>

                {/* PROMO BANNER: Kiosk Style (Solid & Clean) */}
                <div 
                    onClick={() => {
                        if (data?.restaurant?.promoCategoryId) {
                            setActiveCategory(data.restaurant.promoCategoryId);
                            toast.info("Découvrez nos nouveautés !");
                        }
                    }}
                    className={cn(
                        "w-full h-32 md:h-44 relative theme-bg shrink-0 flex items-center overflow-hidden transition-all active:scale-[0.99]",
                        data?.restaurant?.promoCategoryId ? "cursor-pointer" : "",
                        themeMode === 'luxe' && "grayscale opacity-80 hover:grayscale-0 hover:opacity-100"
                    )}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                        <img 
                            src={data?.restaurant?.promoImage || "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80"} 
                            alt="Promo Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content at Bottom Left */}
                    <div className="relative z-20 px-8 pb-4 flex flex-col justify-end h-full w-full">
                        <div className="self-start">
                            <h2 className="text-lg md:text-2xl font-black uppercase tracking-[0.2em] text-black leading-none drop-shadow-sm">
                                {data?.restaurant?.promoText || "NOUVEAUTÉS"}
                            </h2>
                        </div>
                    </div>
                </div>

                <header className="px-6 md:px-10 pt-8 pb-4 flex justify-between items-center shrink-0">
                    <div>
                        <h1 className={cn("text-3xl font-black uppercase tracking-wider flex items-center gap-3", themeMode === 'luxe' ? 'text-white' : 'text-[#2c2c2c]')}>
                            <span className="bg-[#2c2c2c] text-white w-10 h-10 flex items-center justify-center rounded-xl text-xl">🍽️</span>
                            {sidebarCategories.find(c => c.id === activeCategory)?.label || 'Menu'}
                        </h1>
                    </div>
                </header>

                <div className={cn("flex-1 overflow-y-auto px-6 md:px-10 pb-44 no-scrollbar relative", style.mainBg)}>
                    <div className="max-w-6xl mx-auto pt-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
                        {filteredItems().map((item) => {
                            const activeCat = categories.find(c => c.id === activeCategory);
                            const catName = (activeCat?.name || '').toLowerCase();
                            const isTacos = catName.includes('tacos');
                            const isSandwich = catName.includes('sandwich');
                            
                            const imgSrc = item.image 
                                ? item.image 
                                : isSandwich 
                                    ? 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=600&q=80'
                                    : 'https://via.placeholder.com/300x200?text=Produit';

                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className="cursor-pointer group flex flex-col items-center text-center relative"
                                >
                                    {/* Carte Style Borne Digitale (Zéro Flou) */}
                                    <div className={style.card}>
                                        <div className={style.imgContainer}>
                                            <img 
                                                src={imgSrc} 
                                                className={style.img} 
                                                alt={item.name}
                                            />
                                            
                                            {/* Badge Prix Kiosque Solide */}
                                            <div className="absolute top-2 right-2 bg-[#2c2c2c] theme-text px-3 py-1 rounded-lg font-black text-xs shadow-md border border-white/10">
                                                {item.price.toFixed(2)}€
                                            </div>
                                        </div>
                                        
                                        <div className="w-full pb-2">
                                            <h4 className={cn("text-[12px] font-black uppercase tracking-tight text-center line-clamp-2 h-8 flex items-center justify-center", themeMode === 'luxe' ? 'text-white' : 'text-[#2c2c2c]')}>
                                                {item.name}
                                            </h4>

                                            {isTacos && (
                                                <div className="mt-2 w-full theme-bg text-[#2c2c2c] text-[9px] font-black uppercase py-2.5 rounded-xl text-center shadow-sm">
                                                    Personnaliser 🌮
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

                {/* --- BORNE PERMANENT FOOTER --- */}
                <div className={style.footer}>
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setShowWaiterModal(true)}
                            className="flex flex-col items-center justify-center gap-1 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-[#f4f6f8] flex items-center justify-center text-2xl group-hover:bg-[#e8b830]/20 transition-colors">🔔</div>
                            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest group-hover:text-[#e8b830] transition-colors">Appeler</span>
                        </button>
                        
                        <div className="h-14 w-px bg-stone-200 hidden sm:block"></div>

                        <div className="hidden sm:flex flex-col">
                            <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", themeMode === 'luxe' ? 'text-stone-500' : 'text-stone-400')}>Table {tableCode}</p>
                            <div className="flex items-baseline gap-1">
                                <span className={cn("text-sm font-bold", themeMode === 'luxe' ? 'text-stone-400' : 'text-stone-500')}>Total :</span>
                                <span className={cn("text-4xl font-black tracking-tighter", themeMode === 'luxe' ? 'text-white' : 'text-[#2c2c2c]')}>{subtotal.toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => router.push(`/r/${slug}/t/${tableCode}/cart`)}
                        className="h-20 px-12 theme-bg text-[#2c2c2c] rounded-2xl font-black tracking-[0.2em] uppercase text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(240,200,80,0.3)] flex items-center gap-6 border-b-4 theme-border-b"
                    >
                        <span>Voir ma commande</span>
                        <div className="flex items-center gap-2">
                            <span className="w-10 h-10 bg-[#2c2c2c] theme-text rounded-full flex items-center justify-center text-lg shadow-inner font-black">
                                {totalItems}
                            </span>
                        </div>
                    </button>
                </div>

                {/* --- WAITER CALL MODAL --- */}
                {showWaiterModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-[2rem] p-10 max-w-sm w-full shadow-2xl border-4 border-[#f0c850] animate-scale-up">
                            <div className="text-center mb-10">
                                <div className="text-5xl mb-4">🔔</div>
                                <h3 className="text-2xl font-black text-[#2c2c2c] uppercase tracking-wider">Demander de l'aide</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <button 
                                    onClick={() => {
                                        toast.success("Demande d'addition envoyée !");
                                        toast.info("Veuillez vous diriger vers la caisse pour l'encaissement.");
                                        setShowWaiterModal(false);
                                    }}
                                    className="w-full py-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left px-8 flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="block font-black text-stone-800 uppercase text-xs tracking-widest mb-1">Payer l&apos;addition</span>
                                        <span className="block text-stone-500 text-[10px] font-bold">Espèces / Chèque</span>
                                    </div>
                                    <span className="text-2xl group-hover:translate-x-1 transition-transform">💶</span>
                                </button>

                                <button 
                                    onClick={() => {
                                        toast.success("Le serveur arrive !");
                                        setShowWaiterModal(false);
                                    }}
                                    className="w-full py-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left px-8 flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="block font-black text-stone-800 uppercase text-xs tracking-widest mb-1">Besoin d&apos;aide</span>
                                        <span className="block text-stone-500 text-[10px] font-bold">Question sur la carte</span>
                                    </div>
                                    <span className="text-2xl group-hover:translate-x-1 transition-transform">💬</span>
                                </button>
                            </div>

                            <button 
                                onClick={() => setShowWaiterModal(false)}
                                className="w-full mt-8 py-4 text-stone-400 font-bold uppercase text-[10px] tracking-widest hover:text-stone-600 transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
