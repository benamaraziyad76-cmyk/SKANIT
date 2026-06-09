'use client';

import { useEffect, useRef, useState } from 'react';

interface ARExperienceProps {
    modelUrl: string;
    iosModelUrl?: string;
    itemName: string;
    onClose: () => void;
    forcedMode?: 'ar' | '3d';
    isHidden?: boolean;
}

export default function ARExperience({ modelUrl, iosModelUrl, itemName, onClose, forcedMode = '3d', isHidden = false }: ARExperienceProps) {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [arSupported, setArSupported] = useState<boolean | null>(null);
    const [mounted, setMounted] = useState(false);
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        // Vérification du support AR
        const checkAR = async () => {
            setMounted(true);
            if (typeof navigator !== 'undefined' && 'xr' in navigator) {
                try {
                    const supported = await (navigator as any).xr?.isSessionSupported('immersive-ar');
                    setArSupported(supported);
                } catch {
                    setArSupported(false);
                }
            } else {
                // iOS Quick Look ou Scene Viewer Android fallback
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                const isAndroid = /Android/.test(navigator.userAgent);
                setArSupported(isIOS || isAndroid);
            }
        };
        checkAR();
    }, []);

    useEffect(() => {
        if (!isHidden && loaded && forcedMode === 'ar' && viewerRef.current) {
            // Lancement direct en AR une fois chargé et visible
            const timer = setTimeout(() => {
                try {
                    viewerRef.current.activateAR();
                } catch (err) {
                    console.error("Impossible de lancer l'AR automatiquement :", err);
                }
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [loaded, forcedMode, isHidden]);

    return (
        <div 
            className={`fixed inset-0 z-[1000] bg-black flex flex-col font-sans overflow-hidden transition-opacity duration-300`}
            style={{ 
                opacity: isHidden ? 0 : 1, 
                pointerEvents: isHidden ? 'none' : 'auto',
                // Move offscreen when hidden to completely avoid invisible click interception
                transform: isHidden ? 'translateY(100%)' : 'translateY(0)'
            }}
        >
            {/* Header overlay */}
            <div className="absolute top-0 left-0 right-0 z-[1010] flex items-start justify-between p-5 pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10">
                        <p className="text-white font-black text-xs uppercase tracking-widest">{itemName}</p>
                        <p className="text-white/50 text-[9px] uppercase tracking-widest mt-0.5">
                            {loaded ? (arSupported ? '✅ AR Disponible' : '🌐 Mode 3D') : 'Chargement...'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="pointer-events-auto w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Minimal Background Blur Overlay during loading */}
            {/* Ultra-minimalist Loading - Gone almost instantly */}
            {!loaded && (
                <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-md flex flex-col items-center justify-center z-[2000] animate-fade-out">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-orange-500 rounded-full animate-spin mb-3" />
                    <p className="text-white text-[8px] font-black uppercase tracking-[0.3em]">Skanit</p>
                </div>
            )}

            {/* Fullscreen AR Viewer */}
            <div className="flex-1 w-full h-full relative">
                {mounted && (
                    <>
                        {/* @ts-ignore */}
                        <model-viewer
                            ref={viewerRef}
                            src={modelUrl}
                            ios-src={iosModelUrl || modelUrl.replace('.glb', '.usdz')}
                            alt={itemName}
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            ar-placement="floor"
                            ar-scale="fixed"
                            camera-controls
                            auto-rotate
                            shadow-intensity="1.5"
                            shadow-softness="1"
                            environment-image="neutral"
                            exposure="1.1"
                            interaction-prompt="none"
                            loading="eager"
                            reveal="auto"
                            onProgress={(event: any) => {
                                const p = Math.floor(event.detail.totalProgress * 100);
                                setProgress(p);
                                if (p === 100) setLoaded(true);
                            }}
                            onLoad={() => {
                                setLoaded(true);
                                setProgress(100);
                            }}
                            onError={() => setError("Erreur de chargement")}
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'transparent',
                                '--poster-color': 'transparent'
                            } as React.CSSProperties}
                        >
                            {/* Bouton AR personnalisé - Orange, Petit, Élégant */}
                            <button
                                slot="ar-button"
                                style={{
                                    position: 'absolute',
                                    bottom: '40px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 'auto',
                                    padding: '10px 20px',
                                    borderRadius: '12px',
                                    background: '#E85D04',
                                    color: 'white',
                                    fontWeight: '900',
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.2em',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                    boxShadow: '0 4px 15px rgba(232,93,4,0.4)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    zIndex: 10,
                                    transition: 'all 0.2s ease',
                                }}
                                className="active:scale-90"
                            >
                                <span>✨</span>
                                Placer Directement
                            </button>

                            <div slot="progress-bar" style={{ display: 'none' }}></div>
                        </model-viewer>
                    </>
                )}

                {/* AR Not Supported message */}
                {loaded && arSupported === false && forcedMode === 'ar' && (
                    <div className="absolute bottom-8 left-4 right-4 z-[1003]">
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl text-center">
                            <p className="text-amber-300 text-xs font-bold">
                                ⚠️ La RA n'est pas prise en charge sur cet appareil.
                            </p>
                            <p className="text-amber-400/70 text-[10px] mt-1">
                                Profitez du modèle 3D interactif ci-dessus !
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
