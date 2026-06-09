'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Custom procedural 3D Component matching the photo
function MosqueModel() {
    const group = useRef<THREE.Group>(null);

    return (
        <group ref={group} scale={[1, 1, 1]} position={[0, -1, 0]}>
            {/* Main Building Base (Beige/Yellow as in photo) */}
            <mesh position={[-1, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 3, 6]} />
                <meshStandardMaterial color="#EEDCAE" roughness={0.9} />
            </mesh>

            {/* Entrance / Lower Glass Section (Right side of the building) */}
            <mesh position={[1.5, 1.25, 3.01]} castShadow receiveShadow>
                <boxGeometry args={[3, 2.5, 0.1]} />
                <meshStandardMaterial color="#2B3A42" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Canopy above entrance */}
            <mesh position={[1.5, 2.5, 3.5]} castShadow receiveShadow>
                <boxGeometry args={[3.2, 0.1, 1]} />
                <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
            </mesh>

            {/* Top Banner (Frieze) with Arabic text placeholder */}
            <mesh position={[-1, 3.1, 3.01]} castShadow receiveShadow>
                <boxGeometry args={[10, 0.4, 0.05]} />
                <meshStandardMaterial color="#E8F1EC" roughness={0.5} />
            </mesh>
            <mesh position={[-1, 3.1, 3.04]} receiveShadow>
                {/* A dark green band running along the wall block */}
                <boxGeometry args={[9.6, 0.15, 0.01]} />
                <meshStandardMaterial color="#407A52" roughness={0.5} />
            </mesh>

            {/* The Dome (Green Hemisphere on the left roof) */}
            <mesh position={[-3, 3, 0]} castShadow receiveShadow>
                <sphereGeometry args={[2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#6EB081" roughness={0.4} metalness={0.1} />
            </mesh>
            {/* Dome base rim */}
            <mesh position={[-3, 3.05, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[2.05, 2.05, 0.1, 32]} />
                <meshStandardMaterial color="#EEDCAE" roughness={0.8} />
            </mesh>
            {/* Dome spire/ball */}
            <mesh position={[-3, 5.1, 0]} castShadow receiveShadow>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Minaret Tower (White, attached on the right side) */}
            <mesh position={[5, 4, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 8, 2]} />
                <meshStandardMaterial color="#FDFDFD" roughness={0.6} />
            </mesh>

            {/* Minaret Top Rim */}
            <mesh position={[5, 8.1, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 0.2, 2.2]} />
                <meshStandardMaterial color="#E0E0E0" />
            </mesh>

            {/* Minaret Roof (Octagonal/Pyramid Green top) */}
            <mesh position={[5, 9.2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0, 1.4, 2.2, 8]} />
                <meshStandardMaterial color="#6EB081" roughness={0.4} />
            </mesh>
            
            {/* Minaret spire/ball */}
            <mesh position={[5, 10.3, 0]} castShadow receiveShadow>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Windows on Minaret (Dark slots) */}
            {[-1, 0, 1, 2].map(y => (
                <group key={y} position={[5, 4 + y*1.2, 0]}>
                    <mesh position={[0, 0, 1.01]}>
                        <boxGeometry args={[0.4, 0.8, 0.05]} />
                        <meshStandardMaterial color="#222222" />
                    </mesh>
                    <mesh position={[0, 0, -1.01]}>
                        <boxGeometry args={[0.4, 0.8, 0.05]} />
                        <meshStandardMaterial color="#222222" />
                    </mesh>
                    <mesh position={[1.01, 0, 0]}>
                        <boxGeometry args={[0.05, 0.8, 0.4]} />
                        <meshStandardMaterial color="#222222" />
                    </mesh>
                </group>
            ))}

            {/* Grounds / Plaza Platform */}
            <mesh position={[0, -0.05, 0]} receiveShadow>
                <boxGeometry args={[22, 0.1, 18]} />
                <meshStandardMaterial color="#D1D5D8" />
            </mesh>
            
            {/* Some basic styled trees/bushes mapped from the photo foreground */}
            {[[-4, 0, 4.5], [-7, 0, 2], [3, 0, 6], [7, 0, 4], [8, 0, -3]].map((pos, i) => (
                <group key={`tree-${i}`} position={pos as [number,number,number]}>
                    <mesh position={[0, 0.5, 0]} castShadow>
                        <cylinderGeometry args={[0.1, 0.1, 1]} />
                        <meshStandardMaterial color="#6D4C41" />
                    </mesh>
                    <mesh position={[0, 1.3, 0]} castShadow>
                         {/* Uneven low poly tree sphere */}
                         <dodecahedronGeometry args={[1, 0]} />
                         <meshStandardMaterial color="#558B2F" roughness={0.9} flatShading />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

export default function Mosquee3DPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-24">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-lg border-b border-stone-200 z-50 px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-stone-900">Mosquée El Mohssinine</h1>
                    <p className="text-xs text-stone-500 mt-0.5">Grand Mare, Rouen — Création Sur Mesure 3D</p>
                </div>
                <button
                    onClick={() => window.history.back()}
                    className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200"
                >
                    ✕
                </button>
            </header>

            <div className="pt-24 px-6 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-full bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden relative" style={{ height: '70vh', minHeight: '500px' }}>
                    
                    {/* Explications et Labels */}
                    <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-2">
                        <span className="bg-emerald-600/90 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full border border-emerald-500 shadow-emerald-200 shadow-md w-fit">
                            ✨ Modèle 3D reconstruit via votre photo !
                        </span>
                        <div className="bg-white/80 backdrop-blur px-3 py-2 rounded-xl border border-stone-200 text-[10px] text-stone-600 w-fit">
                            <b>Ce que j'ai fait :</b> J'ai analysé votre photo (façade beige, dôme vert, minaret blanc carré à toiture verte pyramidale) et j'ai <b>codé</b> de toutes pièces cette architecture en 3D dans votre navigateur pour que vous puissiez zoomer et tourner autour en temps réel.
                        </div>
                    </div>

                    {/* Canvas React Three Fiber pour le rendu 3D */}
                    <Canvas shadows camera={{ position: [0, 5, 20], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight 
                            position={[10, 20, 10]} 
                            castShadow 
                            intensity={1.5} 
                            shadow-mapSize={[1024, 1024]} 
                        />
                        <Environment preset="city" />
                        
                        <Suspense fallback={null}>
                            <MosqueModel />
                            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={30} blur={2} />
                        </Suspense>
                        
                        <OrbitControls 
                            autoRotate 
                            autoRotateSpeed={0.5} 
                            minDistance={5} 
                            maxDistance={30} 
                            maxPolarAngle={Math.PI / 2 - 0.05} // empêche de passer sous le sol
                        />
                    </Canvas>

                    <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                        <p className="text-xs font-medium text-stone-400 pointer-events-none mb-3 bg-white/70 px-4 py-1.5 rounded-full">
                            Faites glisser pour tourner • Pincez pour zoomer
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
