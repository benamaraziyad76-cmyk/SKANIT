'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SuccessPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const slug = params.slug as string;
    const tableCode = params.tableCode as string;
    const isCash = searchParams.get('payment') === 'CASH';
    const total = searchParams.get('total') || '0.00';

    return (
        <div className="min-h-screen bg-[#f8f5f0] text-[#2c2c2c] font-serif flex items-center justify-center p-4 md:p-6 text-center">
            <div className="max-w-md w-full bg-white rounded-[4rem] p-10 md:p-16 border border-stone-100 shadow-2xl animate-scale-in">
                <div className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl",
                    isCash ? "bg-orange-500" : "bg-[#4a5d4e]"
                )}>
                    <span className="text-4xl text-white">{isCash ? "💶" : "✨"}</span>
                </div>
                
                <h1 className="text-3xl font-light italic text-[#4a5d4e] uppercase tracking-[0.2em] mb-4">
                    COMMANDE <span className="font-bold">VALIDÉE</span>
                </h1>
                <p className="text-stone-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-12">Votre commande est en préparation</p>
                
                {isCash && (
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 mb-10 shadow-inner">
                        <p className="text-orange-800 font-black uppercase text-[10px] tracking-widest mb-4">🎫 REÇU NUMÉRIQUE</p>
                        <div className="flex flex-col items-center gap-1 mb-6">
                            <span className="text-4xl font-black text-orange-600">{total}€</span>
                            <span className="text-[10px] font-bold text-orange-400 uppercase">À régler en caisse</span>
                        </div>
                        <p className="text-orange-900 text-[11px] font-black leading-relaxed uppercase border-t border-orange-200 pt-4">
                            👉 Montrez cet écran au comptoir pour valider votre commande.
                        </p>
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-sm text-stone-600 leading-relaxed mb-6">
                        Table <span className="font-black text-[#4a5d4e]">{tableCode}</span>
                    </p>
                </div>

                <div className="h-px w-12 bg-stone-200 mx-auto my-12" />

                <button 
                    onClick={() => router.push(`/r/${slug}/t/${tableCode}`)}
                    className="w-full py-5 bg-[#4a5d4e] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#3a4a3e] transition-all active:scale-95"
                >
                    Retourner au menu
                </button>
                
                <p className="mt-8 text-[9px] font-black text-orange-600 uppercase tracking-[0.3em]">LA SCAMPIA X SKANIT</p>
            </div>
        </div>
    );
}
