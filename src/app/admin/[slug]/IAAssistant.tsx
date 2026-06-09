'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const iaInsights = [
  {
    id: 'staffing-samedi',
    type: 'critical' as const,
    title: 'Sous-effectif le Samedi',
    icon: '!!',
    peakHour: '13h00 - 14h30',
    metric: 'Ratio Commandes / Staff',
    metricValue: '28.3',
    metricUnit: 'commandes par cuisinier',
    threshold: '15 max recommande',
    sparkData: [4, 6, 8, 12, 22, 35, 42, 38, 28, 15, 8, 5],
    sparkLabels: ['11h','11h30','12h','12h30','13h','13h30','14h','14h30','15h','15h30','16h','16h30'],
    finding: 'Samedi midi dernier, votre ratio commandes/staff etait critique : seulement 3 cuisiniers pour 85 commandes. Le pic a ete atteint entre 13h00 et 14h30. Temps d\'attente moyen : +35 minutes.',
    recommendation: 'Ajoutez 1 a 2 cuisiniers supplementaires le samedi midi (creneau 12h-15h). Pour equilibrer votre masse salariale, retirez 1 cuisinier le lundi midi (taux de remplissage moyen de 20%).',
    savings: '~320 euros/mois',
    badges: [
      { label: 'Pic horaire', value: '13h00 - 14h30', color: '#EF4444' },
      { label: 'Sam. Midi', value: '85 cmd / 3 staff', color: '#EF4444' },
      { label: 'Lun. Midi', value: '12 cmd / 4 staff', color: '#F59E0B' },
      { label: 'Attente', value: '+35 min', color: '#EF4444' },
    ],
    staffHistory: [
      { day: 'Lundi', peakHour: '12h30', staff: 4, orders: 12, pressure: 3.0 },
      { day: 'Mardi', peakHour: '13h00', staff: 3, orders: 28, pressure: 9.3 },
      { day: 'Mercredi', peakHour: '12h30', staff: 3, orders: 32, pressure: 10.7 },
      { day: 'Jeudi', peakHour: '13h00', staff: 4, orders: 35, pressure: 8.8 },
      { day: 'Vendredi', peakHour: '13h30', staff: 4, orders: 52, pressure: 13.0 },
      { day: 'Samedi', peakHour: '13h-14h30', staff: 3, orders: 85, pressure: 28.3 },
      { day: 'Dimanche', peakHour: '13h00', staff: 3, orders: 45, pressure: 15.0 },
    ]
  },
  {
    id: 'plat-perf',
    type: 'info' as const,
    title: 'Plat sous-performant',
    icon: 'i',
    peakHour: '',
    metric: 'Marge nette par plat',
    metricValue: '2.1 euros',
    metricUnit: 'par vente',
    threshold: '4 euros moyenne carte',
    sparkData: [2, 3, 1, 2, 1, 0, 1, 2, 1, 0, 1, 1],
    sparkLabels: ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','S11','S12'],
    finding: 'L\'Escalope Gratinee ne s\'est vendue que 15 fois ce mois-ci (vs 68 pour le Big Naan). Sa marge nette est de 2.1 euros/vente, soit 48% en dessous de la moyenne.',
    recommendation: 'Envisagez de remplacer ce plat ou d\'augmenter son prix de 1 euro pour aligner la marge. Alternative : le proposer en "Plat du Jour" pour booster les ventes.',
    savings: '~85 euros/mois',
    badges: [
      { label: 'Ventes/mois', value: '15 unites', color: '#F59E0B' },
      { label: 'Marge', value: '2.1 euros/vente', color: '#F59E0B' },
      { label: 'Vs Moyenne', value: '-48%', color: '#EF4444' },
    ],
    staffHistory: []
  }
];

const aiTemplates = [
  {
    id: 'desc-plat',
    title: 'Description de Plat',
    icon: '🍔',
    description: 'Générez une description alléchante pour votre menu.',
    fields: ['Nom du plat', 'Ingrédients principaux', 'Ton (ex: gourmand, épicé, chic)'],
    placeholder: 'Ex: Burger Maison, Boeuf, Cheddar, Sauce secrète...'
  },
  {
    id: 'social-post',
    title: 'Post Réseaux Sociaux',
    icon: '📱',
    description: 'Créez un post Instagram ou TikTok viral.',
    fields: ['Sujet', 'Promotion éventuelle', 'Réseau cible'],
    placeholder: 'Ex: Nouveau plat du jour avec -20% ce midi pour Instagram'
  },
  {
    id: 'review-reply',
    title: 'Réponse aux Avis',
    icon: '⭐',
    description: 'Répondez professionnellement à un avis client.',
    fields: ['Avis du client', "Nombre d'étoiles", 'Points à aborder'],
    placeholder: 'Ex: Le client a adoré mais a trouvé le service un peu lent (4 étoiles)'
  },
  {
    id: 'sms-promo',
    title: 'SMS Promotionnel',
    icon: '💬',
    description: 'Rédigez un SMS accrocheur pour fidéliser.',
    fields: ['Offre', 'Validité', 'Cible'],
    placeholder: 'Ex: Dessert offert pour tout menu acheté ce week-end'
  }
];

export default function IAAssistant() {
  const [activeTab, setActiveTab] = useState<'insights' | 'models'>('models');
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  
  // States for Generator
  const [selectedTemplate, setSelectedTemplate] = useState(aiTemplates[0]);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');

  const activeInsights = iaInsights.filter(i => !dismissed[i.id]);

  const handleGenerate = () => {
    if (!promptInput.trim()) {
      toast.error('Veuillez entrer quelques détails pour la génération.');
      return;
    }
    setIsGenerating(true);
    setGeneratedResult('');
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      if (selectedTemplate.id === 'desc-plat') {
        setGeneratedResult("🌟 Laissez-vous tenter par notre création signature ! Un mariage parfait entre des ingrédients frais et une préparation authentique qui éveillera vos papilles. Chaque bouchée est une explosion de saveurs, soigneusement élaborée par notre chef pour vous offrir un moment gourmand inoubliable. 👨‍🍳✨");
      } else if (selectedTemplate.id === 'social-post') {
        setGeneratedResult("🚨 ALERTE GOURMANDISE ! 🚨\nVous cherchez l'excuse parfaite pour vous faire plaisir aujourd'hui ? On a ce qu'il vous faut ! 😍 Venez découvrir notre nouveauté qui fait déjà sensation. \n\n👉 Taguez la personne avec qui vous voulez partager ça en commentaire !\n📍 Retrouvez-nous au restaurant dès maintenant.\n\n#LaScampia #FoodLover #Gourmandise #Restaurant #FoodPorn");
      } else if (selectedTemplate.id === 'review-reply') {
        setGeneratedResult("Bonjour et merci beaucoup pour votre retour ! Nous sommes ravis que vous ayez apprécié la qualité de nos plats. Nous prenons bonne note de votre remarque concernant le temps d'attente ; sachez que nous travaillons activement à l'amélioration de notre service pour vous offrir une expérience toujours plus fluide. Au plaisir de vous revoir très vite ! L'équipe La Scampia.");
      } else {
        setGeneratedResult("🔥 OFFRE EXCLUSIVE ! Votre fidélité récompensée chez La Scampia : Profitez d'une surprise offerte sur votre prochaine commande avec le code SCAMPIAVIP. Valable jusqu'à dimanche ! Commandez vite : lien-vers-votre-site.com STOP au 36000");
      }
      toast.success('Génération terminée avec succès !');
    }, 1500);
  };

  return (
    <div className="animate-fade-in-up space-y-12">
      {/* ===== HERO HEADER ===== */}
      <div className="p-12 rounded-[3rem] bg-gradient-to-br from-[#1c1917] to-[#2c2c2c] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#b35a38]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#4a5d4e]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#b35a38] to-[#d4724a] flex items-center justify-center text-3xl shadow-2xl">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M16 14H8a4 4 0 0 0-4 4v2h16v-2a4 4 0 0 0-4-4z"/><circle cx="12" cy="6" r="1" fill="white"/></svg>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                Assistant IA <span className="font-light">du Patron</span>
              </h2>
              <p className="text-base text-stone-400 mt-1">
                Génération de contenus (Modèles) et Analyse stratégique
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('models')}
              className={`px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider transition-all ${activeTab === 'models' ? 'bg-[#f0c850] text-[#1c1917] shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              ✨ Modèles & Génération IA
            </button>
            <button 
              onClick={() => setActiveTab('insights')}
              className={`px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider transition-all ${activeTab === 'insights' ? 'bg-[#f0c850] text-[#1c1917] shadow-lg scale-105' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              📊 Alertes & Insights ({activeInsights.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Templates List */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#4a5d4e] mb-6 border-b border-stone-200 pb-4">Choix du Modèle</h3>
            {aiTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => { setSelectedTemplate(template); setGeneratedResult(''); }}
                className={`w-full text-left p-6 rounded-3xl transition-all border-2 ${selectedTemplate.id === template.id ? 'bg-[#4a5d4e] border-[#4a5d4e] text-white shadow-xl scale-105' : 'bg-white border-stone-100 text-[#2c2c2c] hover:border-stone-300'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <h4 className="font-black text-lg">{template.title}</h4>
                    <p className={`text-sm mt-1 ${selectedTemplate.id === template.id ? 'text-white/80' : 'text-stone-500'}`}>{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Generator Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-[3rem] bg-white border border-stone-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0c850]/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h3 className="text-2xl font-black text-[#2c2c2c] mb-2 flex items-center gap-3">
                <span className="text-3xl">{selectedTemplate.icon}</span> {selectedTemplate.title}
              </h3>
              <p className="text-stone-500 font-medium mb-8">Remplissez les détails ci-dessous pour que l'IA génère le contenu parfait pour vous.</p>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-[10px] font-black uppercase text-stone-500 mb-2 block">Détails pour l'IA (Séparez vos idées par des virgules)</label>
                  <textarea 
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder={selectedTemplate.placeholder}
                    className="w-full px-6 py-5 rounded-2xl bg-stone-50 border-2 border-stone-100 font-medium text-[#2c2c2c] focus:border-[#4a5d4e] outline-none min-h-[120px] resize-none transition-colors shadow-inner"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTemplate.fields.map((field, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-black uppercase tracking-widest">
                        + {field}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-5 rounded-2xl bg-[#4a5d4e] text-white font-black text-sm uppercase tracking-widest shadow-xl hover:bg-[#3a4a3e] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Génération en cours...
                    </>
                  ) : (
                    <>✨ Générer avec l'IA</>
                  )}
                </button>
              </div>
            </div>

            {/* Result Area */}
            {generatedResult && (
              <div className="p-8 rounded-[3rem] bg-gradient-to-br from-[#fdfbf7] to-white border-2 border-[#f0c850] shadow-lg animate-fade-in relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#f0c850] rounded-full flex items-center justify-center text-white font-black shadow-lg">IA</div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#b35a38] mb-4">Résultat Généré</h3>
                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                  <p className="text-stone-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {generatedResult}
                  </p>
                </div>
                <div className="mt-6 flex gap-4">
                  <button 
                    onClick={() => { navigator.clipboard.writeText(generatedResult); toast.success('Copié dans le presse-papier !'); }}
                    className="flex-1 py-4 rounded-xl bg-[#2c2c2c] text-[#f0c850] font-black text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-md"
                  >
                    📋 Copier le texte
                  </button>
                  <button 
                    onClick={() => { setGeneratedResult(''); handleGenerate(); }}
                    className="px-6 py-4 rounded-xl bg-stone-100 text-stone-600 font-black text-xs uppercase tracking-widest hover:bg-stone-200 transition-colors"
                  >
                    🔄 Regénérer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="animate-fade-in space-y-10">
          {/* ===== INSIGHT CARDS (Same as before) ===== */}
          {activeInsights.map((insight) => {
            const isCritical = insight.type === 'critical';
            const isSuccess = insight.type === 'success';
            const borderColor = isCritical ? 'border-red-300' : isSuccess ? 'border-emerald-300' : 'border-amber-300';
            const headerBg = isCritical ? 'bg-red-50' : isSuccess ? 'bg-emerald-50' : 'bg-amber-50';
            const accentBg = isCritical ? 'bg-red-100' : isSuccess ? 'bg-emerald-100' : 'bg-amber-100';
            const accentText = isCritical ? 'text-red-700' : isSuccess ? 'text-emerald-700' : 'text-amber-700';
            const typeLabel = isCritical ? 'CRITIQUE' : isSuccess ? 'OPPORTUNITÉ' : 'INFO';

            return (
              <div key={insight.id} className={`rounded-[3rem] bg-white border-2 ${borderColor} shadow-md overflow-hidden hover:shadow-xl transition-shadow`}>
                <div className={`${headerBg} px-10 py-8`}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl font-black text-stone-900">{insight.title}</h3>
                      <p className="text-sm text-stone-500 mt-1">Détecté automatiquement - Mis à jour il y a 2h</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={`px-5 py-3 rounded-2xl ${accentBg} ${accentText} text-sm font-black uppercase`}>
                        {typeLabel}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200">
                      <p className="text-sm font-black uppercase tracking-wider text-stone-500 mb-4">CONSTAT</p>
                      <p className="text-base text-stone-700 leading-relaxed">{insight.finding}</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-[#4a5d4e]/5 border border-[#4a5d4e]/20">
                      <p className="text-sm font-black uppercase tracking-wider text-[#4a5d4e] mb-4">RECOMMANDATION IA</p>
                      <p className="text-base text-stone-700 leading-relaxed">{insight.recommendation}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <button
                      onClick={() => { toast.success('Pris en compte !'); setDismissed(prev => ({...prev, [insight.id]: true})); }}
                      className="flex-1 py-5 rounded-full bg-[#4a5d4e] text-white font-black text-sm uppercase tracking-wider shadow-xl hover:bg-[#3a4a3e] transition-all"
                    >
                      Accepter la recommandation
                    </button>
                    <button
                      onClick={() => setDismissed(prev => ({...prev, [insight.id]: true}))}
                      className="px-10 py-5 rounded-full bg-stone-100 text-stone-500 font-black text-sm uppercase tracking-wider hover:bg-stone-200 transition-colors"
                    >
                      Ignorer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {activeInsights.length === 0 && (
            <div className="p-16 rounded-[3rem] bg-white border border-stone-100 text-center">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-xl font-black uppercase tracking-tight text-[#4a5d4e] italic">Toutes les recommandations ont été traitées</p>
              <button
                onClick={() => setDismissed({})}
                className="mt-8 px-10 py-5 rounded-full bg-[#4a5d4e] text-white font-black text-sm uppercase tracking-wider shadow-xl hover:bg-[#3a4a3e] transition-all"
              >
                Relancer l'analyse
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
