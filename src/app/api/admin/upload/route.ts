import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string || 'image'; // 'image' | 'model' | 'usdz'

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Empêcher l'analyseur statique de Vercel d'inclure tout le dossier de 800Mo
        const getCwd = () => process.cwd();
        
        // Vercel est "Read-Only". L'upload de fichiers locaux va crasher en production.
        // Il faut utiliser Supabase Storage (S3) en production.
        if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
            return NextResponse.json({ 
                error: 'En production sur Vercel, l\'upload local est impossible (Read-Only). Configurez Supabase Storage pour les images.' 
            }, { status: 501 });
        }

        // Determine upload directory
        let uploadDir: string;
        let publicPath: string;

        if (type === 'model') {
            uploadDir = path.join(getCwd(), 'public', 'models');
            publicPath = '/models/';
        } else if (type === 'usdz') {
            uploadDir = path.join(getCwd(), 'public', 'models');
            publicPath = '/models/';
        } else {
            uploadDir = path.join(getCwd(), 'public', 'images');
            publicPath = '/images/';
        }

        // Create dir if needed
        await mkdir(uploadDir, { recursive: true });

        // Sanitize filename
        const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const timestamp = Date.now();
        const filename = `${timestamp}_${originalName}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        return NextResponse.json({
            success: true,
            url: `${publicPath}${filename}`,
            filename,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
    }
}
