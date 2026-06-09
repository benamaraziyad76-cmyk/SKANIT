import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "Skanit — L'expérience restaurant réinventée",
  description: "Plateforme SaaS de gestion restaurant et menu interactif 3D/AR.",
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FAFAF9" />
        {/* Preload 3D Engine */}
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" />
      </head>
      <body className="min-h-screen bg-background">
        <Providers>
          <Toaster position="top-center" richColors />
          {children}
        </Providers>
      </body>
    </html>
  );
}
