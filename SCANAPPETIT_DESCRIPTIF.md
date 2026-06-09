# 🍽️ ScanAppetit : Présentation Ultra-Détaillée de la Plateforme

**ScanAppetit** redéfinit l'expérience de la restauration avec une solution "Phygitale" (Physique + Digitale) premium. Alliant un design moderne et des technologies innovantes (3D/AR), elle transforme un simple menu en une expérience immersive.

---

## 🎨 1. Identité Visuelle & Esthétique (Design System)

L'interface a été conçue pour offrir un sentiment de luxe et de fluidité, loin des menus QR codes génériques.

### Palette de Couleurs & Matériaux
*   **Couleur d'Accent (Amber/Vibrant Orange) :** Utilisée stratégiquement pour les boutons d'achat, les prix et les éléments interactifs. Elle stimule l'appétit et guide l'œil.
*   **Fonds de Page (Stone & Neutral) :** Utilisation de dégradés `stone-50` à `white` pour une sensation de propreté et de clarté.
*   **Mode Cuisine (Dark Mode) :** Un noir profond `stone-950` avec des accents vert émeraude pour un confort visuel maximal en environnement de travail.
*   **Glassmorphism :** Les barres de navigation utilisent un effet de "verre flouté" (Backdrop blur) pour une profondeur premium.
*   **Micro-animations :** Effets de rebond (`bounce-slow`) sur les boutons d'appel, apparitions fluides (`fade-in-up`) des plats et transitions douces.

---

## 🧩 2. Expérience Client (Le Menu Intelligent)

### Navigation & Commande
*   **Identification par Table :** Système intelligent de routing (`/r/nom-du-resto/t/num-table`) pour une gestion précise des commandes.
*   **Recherche Intuitive :** Barre de recherche ultra-rapide avec filtrage dynamique des plats.
*   **Interface AR/3D :** Chaque plat peut être visualisé en 3D ou projeté en Réalité Augmentée directement sur la table grâce à l'intégration WebXR.
*   **Personnalisation Totale :** Gestion des options (cuisson, accompagnements), des exclusions et des notes spéciales (ex: "Sans allergènes").

### Paiement & Service
*   **Panier Dynamique :** Calcul automatique du total avec gestion de la TVA (10%) et des remises.
*   **Modes de Paiement :** Choix entre un paiement sécurisé par **Carte Bancaire** ou en **Espèces**.
*   **Bouton SOS (Cloche) :** Une cloche flottante interactive permet d'appeler instantanément un serveur.

---

## 👨‍🍳 3. Écran Cuisine (Back-Office Opérationnel)

Le centre névralgique pour la préparation des commandes.

*   **Gestion des Statuts :** Passage intuitif des commandes de `Reçu` à `En préparation`, puis `Prêt` et enfin `Servi`.
*   **Indicateurs d'Allergènes :** Alerte visuelle rouge ⚠️ pour les plats contenant des allergènes critiques.
*   **Notifications Sonores :** Système de notifications "Bip" intelligent à chaque nouvelle commande (activable/désactivable).
*   **Suivi en Temps Réel :** Synchronisation instantanée entre la cuisine et le client.

---

## 💻 4. Architecture Technique

*   **Frontend :** Next.js 16 avec React 19 pour des performances de pointe.
*   **Base de Données :** Prisma avec SQLite (`dev.db`), garantissant une gestion de données locale fiable et rapide.
*   **3D Engine :** Moteur AR intégré supportant les formats GLB (Android) et USDZ (iOS).
*   **Notifications :** Toaster System (Sonner) pour des retours utilisateurs élégants.

---

## 🛡️ 🛡️ 5. Sécurité et Engagement

*   **Paiement Sécurisé :** Interface prête pour Stripe avec badges de confiance.
*   **Accessibilité :** Design inclusif avec contrastes élevés et icônes explicites.
*   **Performance :** Optimisation des images (WebP) pour un chargement instantané même en 4G.
