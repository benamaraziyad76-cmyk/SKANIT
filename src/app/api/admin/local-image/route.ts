import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');
  
  if (!filePath) {
    return new NextResponse('No path provided', { status: 400 });
  }
  
  try {
    const file = fs.readFileSync(filePath);
    return new NextResponse(file, { 
      headers: { 
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      } 
    });
  } catch (e) {
    console.error(e);
    return new NextResponse('File not found', { status: 404 });
  }
}
