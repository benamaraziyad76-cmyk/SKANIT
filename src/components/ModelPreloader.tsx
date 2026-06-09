'use client';

import { MenuItem } from '@/lib/types';

interface ModelPreloaderProps {
    items: MenuItem[];
}

export default function ModelPreloader({ items }: ModelPreloaderProps) {
    const itemsToPreload = items.filter(item => item.modelUrl && item.isSignature);

    if (itemsToPreload.length === 0) return null;

    return (
        <div style={{ display: 'none' }} aria-hidden="true">
            {itemsToPreload.map((item) => (
                <div key={`preload-${item.id}`}>
                    {/* @ts-ignore */}
                    <model-viewer
                        src={item.modelUrl}
                        loading="eager"
                        reveal="auto"
                        style={{ width: '1px', height: '1px', visibility: 'hidden', position: 'absolute' }}
                    />
                </div>
            ))}
        </div>
    );
}
