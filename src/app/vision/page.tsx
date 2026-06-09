'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function VisionPage() {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const startProcessing = () => {
        setIsProcessing(true);
        setStep(2);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 5;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setIsProcessing(false);
                setStep(3);
            }
            setProgress(p);
        }, 150);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Header Status Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500">Dish3D Pro — AI Engine v2.4</span>
                </div>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                    Quitter
                </button>
            </div>

            <main className="max-w-xl mx-auto px-6 pt-24 pb-32">
                {/* Step Indicator */}
                <div className="flex justify-between mb-12 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10 -translate-y-1/2 z-0" />
                    {[1, 2, 3].map((s) => (
                        <div 
                            key={s}
                            className={cn(
                                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                step >= s ? "bg-cyan-500 border-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]" : "bg-black border-white/20 text-white/40"
                            )}
                        >
                            <span className="font-black text-xs">{s}</span>
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <h1 className="text-4xl font-black tracking-tighter mb-4 leading-tight">
                            Numérisez vos <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 italic">chefs-d&apos;œuvre.</span>
                        </h1>
                        <p className="text-stone-400 text-sm leading-relaxed mb-10">
                            Prenez une vidéo de 15 secondes en tournant autour de votre plat. Notre IA s’occupe du reste pour générer un modèle 3D digne d&apos;un studio.
                        </p>

                        <div className="relative group cursor-pointer" onClick={startProcessing}>
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-stone-900 flex flex-col items-center justify-center p-10 text-center">
                                <img 
                                    src="/artifacts/dish_scanner.png" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
                                    alt="Dish Scanner" 
                                />
                                <div className="relative z-10">
                                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:scale-110 transition-transform">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                    </div>
                                    <span className="text-lg font-bold block mb-2">Importer une Capture</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Vidéo (MOV, MP4) ou Photos (RAW/JPG)</span>
                                </div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500/50 w-1/3 animate-[loading_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="relative w-48 h-48 mb-12">
                            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />
                            <div 
                                className="absolute inset-0 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" 
                                style={{ animationDuration: '0.8s' }}
                            />
                            <div className="absolute inset-4 rounded-full bg-white/5 backdrop-blur-3xl flex items-center justify-center">
                                <span className="text-4xl font-black text-cyan-400">{Math.round(progress)}%</span>
                            </div>
                            
                            {/* Scanning particles simulation */}
                            <div className="absolute -top-4 left-1/2 w-1 h-24 bg-gradient-to-b from-cyan-500 to-transparent -translate-x-1/2 animate-bounce opacity-50" />
                        </div>

                        <h2 className="text-2xl font-black tracking-tighter mb-4 uppercase italic">
                            Analyse Photogrammétrique <br /> en cours
                        </h2>
                        <div className="space-y-4 max-w-xs mx-auto">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-cyan-500/60">
                                <span>Maillage Géométrique</span>
                                <span>OK</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                <span>Rendu Texture 8K</span>
                                <span className={progress > 60 ? "text-cyan-500" : ""}>{progress > 60 ? 'OK' : '...' }</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
                                <span>Optimisation Mesh</span>
                                <span className={progress > 90 ? "text-cyan-500" : ""}>{progress > 90 ? 'OK' : '...' }</span>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in zoom-in-95 duration-700">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase italic">Modèle Généré</h1>
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Temps de traitement : 18.4s</span>
                            </div>
                        </div>

                        <div className="aspect-square rounded-3xl bg-stone-900 border border-white/10 relative overflow-hidden mb-8 shadow-2xl">
                            {/* @ts-ignore */}
                            <model-viewer
                                src="https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Noodles/glTF-Binary/Noodles.glb"
                                ar
                                ar-modes="webxr scene-viewer quick-look"
                                camera-controls
                                auto-rotate
                                shadow-intensity="2"
                                environment-image="neutral"
                                exposure="1"
                                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                            >
                                <button slot="ar-button" className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white text-black font-black text-[10px] uppercase tracking-widest shadow-2xl border-2 border-white/50 active:scale-95 transition-all">
                                    Visualiser sur Table (RA)
                                </button>
                            </model-viewer>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Exporter GLB/USDZ</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Intégrer au Menu</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Nav Simulation */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-64 h-16 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 flex items-center justify-around px-8 shadow-2xl z-50">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_cyan]" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
        </div>
    );
}
