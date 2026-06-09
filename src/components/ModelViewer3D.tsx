'use client';

import { useEffect, useRef, useState } from 'react';

interface ModelViewer3DProps {
    modelUrl: string;
    iosModelUrl?: string;
    itemName: string;
    price: number;
    currency?: string;
    onClose: () => void;
    onAR?: () => void;
}

export default function ModelViewer3D({
    modelUrl,
    iosModelUrl,
    itemName,
    price,
    currency = 'EUR',
    onClose,
    onAR,
}: ModelViewer3DProps) {
    const viewerRef = useRef<any>(null);
    const [loaded, setLoaded] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatted = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(price);

    const toggleRotate = () => {
        setAutoRotate(r => !r);
        if (viewerRef.current) {
            if (autoRotate) {
                viewerRef.current.removeAttribute('auto-rotate');
            } else {
                viewerRef.current.setAttribute('auto-rotate', '');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col overflow-hidden font-sans">

            {/* Top bar */}
            <div className="flex items-center justify-between px-5 pt-12 pb-4 relative z-10">
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center active:scale-90 transition-all"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Name badge - pill */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border border-stone-100">
                    <span className="text-base">🍽️</span>
                    <span className="font-semibold text-stone-800 text-sm">{itemName}</span>
                </div>

                {/* AR button top right */}
                {onAR && (
                    <button
                        onClick={onAR}
                        className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-orange-200"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        </svg>
                    </button>
                )}
                {!onAR && <div className="w-10" />}
            </div>

            {/* 3D Model - full center */}
            <div className="flex-1 relative flex items-center justify-center">
                {/* Loading state */}
                {!loaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                        <div className="w-12 h-12 border-3 border-stone-100 border-t-orange-500 rounded-full animate-spin" style={{ borderWidth: 3 }} />
                        <p className="text-stone-400 text-xs font-medium">Chargement du modèle...</p>
                    </div>
                )}

                {mounted && (
                    /* @ts-ignore */
                    <model-viewer
                        ref={viewerRef}
                        src={modelUrl}
                        ios-src={iosModelUrl || modelUrl.replace('.glb', '.usdz')}
                        alt={itemName}
                        camera-controls
                        auto-rotate={autoRotate ? '' : undefined}
                        auto-rotate-delay="500"
                        rotation-per-second="30deg"
                        shadow-intensity="1"
                        shadow-softness="0.8"
                        environment-image="neutral"
                        exposure="1.2"
                        loading="eager"
                        reveal="auto"
                        interaction-prompt="none"
                        onLoad={() => setLoaded(true)}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: 'transparent',
                            '--poster-color': 'transparent',
                        } as React.CSSProperties}
                    />
                )}
            </div>

            {/* Bottom panel */}
            <div className="px-6 pt-4 pb-10 flex flex-col gap-4">
                {/* Price */}
                <div className="flex items-center justify-between">
                    <div className="px-5 py-3 rounded-2xl bg-stone-50 border border-stone-100 shadow-sm">
                        <span className="text-2xl font-black text-stone-900">{formatted}</span>
                    </div>
                    {onAR && (
                        <button
                            onClick={onAR}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-200 active:scale-95 transition-all"
                        >
                            <span>✨</span>
                            Voir en RA
                        </button>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                    {/* Zoom hint */}
                    <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-stone-50 border border-stone-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        <span className="text-stone-600 text-sm font-semibold">Zoom</span>
                    </div>

                    {/* Auto-rotate toggle */}
                    <button
                        onClick={toggleRotate}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all active:scale-95
                            ${autoRotate
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200'
                                : 'bg-stone-50 border-stone-100 text-stone-600'
                            }`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        <span className="text-sm font-semibold">Tourner</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
