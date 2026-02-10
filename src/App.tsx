import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  Scale, 
  X, 
  Phone, 
  Bot, 
  MapPin, 
  Mail, 
  Linkedin, 
  Facebook,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Utility ---
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// --- Types ---
type ViewState = 'landing' | 'size-selection' | 'diagnostic' | 'results';

interface Question {
  id: number;
  category: string;
  text: string;
  detail: string;
  minEmployees?: number;
  maxEmployees?: number;
}

// --- Data: 45 Questions (15 per tier) ---
const QUESTIONS: Question[] = [
  // === TPE / ARTISAN (< 11 Salariés) ===
  { id: 101, category: "Juridique", text: "Maîtrisez-vous la procédure de reprise du personnel (Annexe 7) ?", detail: "Une erreur peut coûter des mois de salaire en Prud'hommes.", minEmployees: 0, maxEmployees: 10 },
  { id: 102, category: "Social", text: "Vos coefficients (AS, AQS) correspondent-ils aux tâches réelles ?", detail: "Un mauvais coefficient entraîne des rappels de salaire sur 3 ans.", minEmployees: 0, maxEmployees: 10 },
  { id: 103, category: "Sécurité", text: "Votre Document Unique (DUER) est-il rédigé et à jour ?", detail: "Indispensable pour éviter la faute inexcusable en cas d'accident.", minEmployees: 0, maxEmployees: 10 },
  { id: 104, category: "Rentabilité", text: "Connaissez-vous votre coût de revient horaire chargé ?", detail: "Vendre sous son seuil de rentabilité est fatal pour une TPE.", minEmployees: 0, maxEmployees: 10 },
  { id: 105, category: "RH", text: "Maîtrisez-vous les cas de recours légaux au CDD ?", detail: "Un CDD mal justifié est requalifié d'office en CDI par le juge.", minEmployees: 0, maxEmployees: 10 },
  { id: 106, category: "Inflation", text: "Appliquez-vous vos clauses de révision de prix chaque année ?", detail: "Ne pas répercuter les hausses grignote directement votre salaire.", minEmployees: 0, maxEmployees: 10 },
  { id: 107, category: "Santé", text: "Vos salariés sont-ils à jour de leurs visites médicales ?", detail: "Votre responsabilité pénale est engagée dès le premier jour de retard.", minEmployees: 0, maxEmployees: 10 },
  { id: 108, category: "Formation", text: "Utilisez-vous votre budget formation AKTO chaque année ?", detail: "C'est un droit financier que vous payez déjà dans vos charges.", minEmployees: 0, maxEmployees: 10 },
  { id: 109, category: "Vigilance", text: "Vérifiez-vous les papiers de vos sous-traitants ?", detail: "Vous êtes solidaire des amendes en cas de travail dissimulé.", minEmployees: 0, maxEmployees: 10 },
  { id: 110, category: "Réseau", text: "Avez-vous un réseau de confrères pour échanger sur vos soucis ?", detail: "L'isolement est le premier facteur d'échec du dirigeant.", minEmployees: 0, maxEmployees: 10 },
  { id: 111, category: "Temps Partiel", text: "Respectez-vous les délais pour modifier un planning ?", detail: "Le non-respect du délai de prévenance rend les heures majorables.", minEmployees: 0, maxEmployees: 10 },
  { id: 112, category: "Affichage", text: "Votre affichage obligatoire est-il complet sur vos chantiers ?", detail: "L'inspection du travail contrôle ce point systématiquement.", minEmployees: 0, maxEmployees: 10 },
  { id: 113, category: "Mutuelle", text: "Votre mutuelle est-elle conforme à la branche Propreté ?", detail: "Le panier de soins doit respecter des minima conventionnels stricts.", minEmployees: 0, maxEmployees: 10 },
  { id: 114, category: "Équipement", text: "Fournissez-vous des EPI normés et tracés à vos agents ?", detail: "La preuve de remise des équipements vous protège juridiquement.", minEmployees: 0, maxEmployees: 10 },
  { id: 115, category: "Image", text: "Vos agents portent-ils une tenue propre et logotypée ?", detail: "C'est votre premier levier de fidélisation client en TPE.", minEmployees: 0, maxEmployees: 10 },

  // === PME (11 - 49 Salariés) ===
  { id: 201, category: "Dialogue", text: "Votre CSE (Comité Social et Économique) est-il en place ?", detail: "Obligatoire dès 11 salariés. L'absence est un délit d'entrave.", minEmployees: 11, maxEmployees: 49 },
  { id: 202, category: "RH", text: "Réalisez-vous les Entretiens Professionnels (tous les 2 ans) ?", detail: "Risque d'abondement correctif du CPF de 3000€ par salarié.", minEmployees: 11, maxEmployees: 49 },
  { id: 203, category: "Social", text: "Maîtrisez-vous la procédure en cas d'inaptitude ?", detail: "C'est le premier motif de contentieux aux Prud'hommes en PME.", minEmployees: 11, maxEmployees: 49 },
  { id: 204, category: "Marchés", text: "Votre mémoire technique inclut-il des engagements RSE ?", detail: "Sans RSE chiffrée, vous perdez 20% de votre note en appel d'offres.", minEmployees: 11, maxEmployees: 49 },
  { id: 205, category: "Pénibilité", text: "Déclarez-vous les facteurs de pénibilité via la DSN ?", detail: "Le travail de nuit ou répétitif doit être déclaré précisément.", minEmployees: 11, maxEmployees: 49 },
  { id: 206, category: "Labels", text: "Êtes-vous engagé dans une démarche Qualipropre ?", detail: "C'est le sésame pour accéder aux grands donneurs d'ordres.", minEmployees: 11, maxEmployees: 49 },
  { id: 207, category: "Encadrement", text: "Vos chefs d'équipe sont-ils formés au droit social ?", detail: "Une erreur de management sur le terrain engage l'entreprise.", minEmployees: 11, maxEmployees: 49 },
  { id: 208, category: "Pilotage", text: "Suivez-vous la rentabilité par chantier chaque mois ?", detail: "Perdre le contrôle sur 2 chantiers peut couler votre bilan annuel.", minEmployees: 11, maxEmployees: 49 },
  { id: 209, category: "Insertion", text: "Gérez-vous efficacement les clauses d'insertion sociale ?", detail: "Un levier de croissance qui demande une rigueur administrative.", minEmployees: 11, maxEmployees: 49 },
  { id: 210, category: "Digital", text: "Utilisez-vous la télégestion pour prouver le passage ?", detail: "C'est la seule preuve irréfutable en cas de litige client.", minEmployees: 11, maxEmployees: 49 },
  { id: 211, category: "Recrutement", text: "Avez-vous une procédure pour éviter les discriminations ?", detail: "Obligation légale de formation pour les chargés de recrutement.", minEmployees: 11, maxEmployees: 49 },
  { id: 212, category: "Absentéisme", text: "Suivez-vous votre taux d'absentéisme par secteur ?", detail: "Un taux élevé cache souvent un problème de management local.", minEmployees: 11, maxEmployees: 49 },
  { id: 213, category: "Sécurité", text: "Réalisez-vous des 'quarts d'heure sécurité' sur site ?", detail: "La preuve de l'animation sécurité réduit votre responsabilité.", minEmployees: 11, maxEmployees: 49 },
  { id: 214, category: "Coût", text: "Intégrez-vous les coûts de structure dans vos devis ?", detail: "Oublier les frais généraux est l'erreur classique des PME.", minEmployees: 11, maxEmployees: 49 },
  { id: 215, category: "Climat", text: "Mesurez-vous la satisfaction de vos salariés ?", detail: "Réduire le turnover est votre premier gain de productivité.", minEmployees: 11, maxEmployees: 49 },

  // === GE (50+ Salariés) ===
  { id: 301, category: "Égalité", text: "Publiez-vous votre Index d'Égalité Professionnelle ?", detail: "Pénalité financière si votre score est inférieur à 75 points.", minEmployees: 50, maxEmployees: 100000 },
  { id: 302, category: "RSE", text: "Êtes-vous prêt pour le reporting extra-financier (CSRD) ?", detail: "Vos clients exigent désormais votre bilan carbone complet.", minEmployees: 50, maxEmployees: 100000 },
  { id: 303, category: "Handicap", text: "Atteignez-vous les 6% de travailleurs handicapés (OETH) ?", detail: "La contribution AGEFIPH peut coûter des dizaines de milliers d'euros.", minEmployees: 50, maxEmployees: 100000 },
  { id: 304, category: "Dialogue", text: "Votre CSE possède-t-il une commission santé (CSSCT) ?", detail: "Obligatoire dès 300 salariés ou sur décision de l'inspecteur.", minEmployees: 50, maxEmployees: 100000 },
  { id: 305, category: "Négociation", text: "Engagez-vous les Négociations Annuelles (NAO) ?", detail: "Une obligation annuelle. L'absence de PV est lourdement sanctionnée.", minEmployees: 50, maxEmployees: 100000 },
  { id: 306, category: "Données", text: "Votre BDES (Base de Données Sociales) est-elle à jour ?", detail: "L'outil central pour vos relations avec les syndicats.", minEmployees: 50, maxEmployees: 100000 },
  { id: 307, category: "QVT", text: "Avez-vous une charte sur le droit à la déconnexion ?", detail: "Majeur pour fidéliser vos cadres et réduire le risque de burn-out.", minEmployees: 50, maxEmployees: 100000 },
  { id: 308, category: "Cotisations", text: "Analysez-vous vos taux AT/MP pour réduire vos cotisations ?", detail: "À cette taille, la prévention est un levier de profit direct.", minEmployees: 50, maxEmployees: 100000 },
  { id: 309, category: "Innovation", text: "Intégrez-vous la robotique ou l'IA dans vos process ?", detail: "Indispensable pour rester compétitif sur les marchés nationaux.", minEmployees: 50, maxEmployees: 100000 },
  { id: 310, category: "Alerte", text: "Avez-vous une procédure 'Lanceur d'Alerte' ?", detail: "Obligatoire selon la Loi Sapin II pour les structures de +50.", minEmployees: 50, maxEmployees: 100000 },
  { id: 311, category: "Carbone", text: "Avez-vous réalisé votre Bilan d'Émissions Gaz à Effet de Serre ?", detail: "Obligatoire tous les 4 ans pour les entreprises de +500 salariés.", minEmployees: 50, maxEmployees: 100000 },
  { id: 312, category: "Achats", text: "Votre politique d'achats intègre-t-elle des critères RSE ?", detail: "Vos fournisseurs doivent aussi prouver leur conformité.", minEmployees: 50, maxEmployees: 100000 },
  { id: 313, category: "Synergie", text: "Vos agences régionales partagent-elles leurs bonnes pratiques ?", detail: "Harmoniser la qualité est le défi majeur des grandes structures.", minEmployees: 50, maxEmployees: 100000 },
  { id: 314, category: "Risques", text: "Avez-vous un Plan de Continuité d'Activité (PCA) ?", detail: "Essentiel pour rassurer vos clients multisites stratégiques.", minEmployees: 50, maxEmployees: 100000 },
  { id: 315, category: "Éthique", text: "Votre charte éthique est-elle diffusée à tous vos cadres ?", detail: "Protège l'entreprise contre les risques de corruption ou délit.", minEmployees: 50, maxEmployees: 100000 }
];

const FEP_SERVICES = [
  { 
    icon: Scale, 
    title: "Conseil Juridique & Social", 
    content: "Sécurisez vos décisions employeur avec notre permanence dédiée (SVP) : interprétation de la CCN Propreté, procédures disciplinaires, gestion experte des transferts (Annexe 7) et relations avec les IRP.", 
    color: "bg-blue-50 text-blue-600" 
  },
  { 
    icon: TrendingUp, 
    title: "Performance Économique", 
    content: "Défendez vos marges face aux hausses du SMIC et à l'inflation grâce aux indices officiels de révision de prix FEP, nos matrices de calcul du coût de revient et nos analyses régulières de conjoncture.", 
    color: "bg-orange-50 text-orange-600" 
  },
  { 
    icon: Award, 
    title: "Formation & Métiers", 
    content: "Valorisez votre capital humain avec l'INHNI (CQP, TFP, Apprentissage) et bénéficiez d'un accompagnement personnalisé pour l'ingénierie de financement de vos plans de formation via l'OPCO AKTO.", 
    color: "bg-green-50 text-green-600" 
  },
  { 
    icon: ShieldCheck, 
    title: "Prévention, Santé & QSE", 
    content: "Bénéficiez d'outils opérationnels pour la mise à jour de votre Document Unique (DUER), la prévention des TMS sur chantiers et de conseils d'experts pour réduire vos taux de cotisation AT/MP.", 
    color: "bg-pink-50 text-pink-600" 
  },
  { 
    icon: FileText, 
    title: "RSE & Développement Durable", 
    content: "Gagnez des marchés publics et privés en valorisant vos engagements avec le Club RSE sectoriel, l'accompagnement à la notation extra-financière et la mise en avant de vos clauses sociales et vertes.", 
    color: "bg-purple-50 text-purple-600" 
  },
  { 
    icon: Users, 
    title: "Réseau & Information", 
    content: "Rompez l'isolement du dirigeant via nos clubs thématiques (JD, Femmes de Propreté) et restez informé en temps réel avec notre newsletter FEPSE Hebdo et nos groupes d'alertes WhatsApp législatifs.", 
    color: "bg-indigo-50 text-indigo-600" 
  }
];

// --- FEP Logo ---
const FepLogo = ({ className = "h-12" }) => (
  <img 
    src="https://www.fep-sud-est.com/wp-content/uploads/2021/11/Logo_FEP_2021_SUDEST.svg" 
    alt="FEP Sud-Est" 
    className={className}
  />
);

const LeadForm = ({ onSubmit, diagnosticData = null }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', company: '', naf: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("_subject", `NOUVEAU LEAD DIRIGEANT - ${formData.company.toUpperCase()}`);
    fd.append("_cc", formData.email);
    
    // Informations identifiées pour les services
    fd.append("DIRIGEANT - Nom", formData.lastName); 
    fd.append("DIRIGEANT - Prenom", formData.firstName);
    fd.append("ENTREPRISE", formData.company); 
    fd.append("CODE NAF", formData.naf);
    fd.append("EMAIL DE CONTACT", formData.email); 
    fd.append("TELEPHONE DIRECT", formData.phone);
    
    if (diagnosticData) {
        fd.append("--- VOTRE BILAN STRATEGIQUE FEP ---", "");
        fd.append("NOTE DE CONFORMITE", `${diagnosticData.score}/10`);
        fd.append("EFFECTIF DECLARE", `${diagnosticData.employeeCount} salaries`);
        
        fd.append("1. SECURITE JURIDIQUE", "Acces illimite a la permanence CCN Propreté et aide aux transferts Annexe 7.");
        fd.append("2. PERFORMANCE ECO", "Indices de revision de prix et matrices de calcul du cout de revient.");
        fd.append("3. FORMATION", "Ingenierie AKTO et acces prioritaire aux formations metiers INHNI.");
        fd.append("4. STRATEGIE RSE", "Accompagnement et valorisation des appels d'offres.");
        fd.append("5. RESEAUTAGE", "Acces aux Clubs Dirigeants pour rompre l'isolement.");
        
        fd.append("POUR ALLER PLUS LOIN", "Contactez Sofia Soltane au 06 50 28 26 95");
    }

    try {
        await fetch("https://formsubmit.co/ajax/services@fep-sud-est.com", { method: "POST", body: fd });
    } catch (err) { console.error(err); }
    setIsSubmitting(false);
    onSubmit();
  };

  return (
    <div className="bg-white p-10 rounded-[2rem] shadow-2xl border border-slate-100 max-w-lg mx-auto text-left">
      <h3 className="text-2xl font-black mb-2 text-[#004A8F]">Recevoir mon rapport</h3>
      <p className="text-slate-500 mb-8 font-medium">Le bilan complet de votre diagnostic vous sera envoyé instantanément.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Prénom" required className="bg-slate-50 border p-4 rounded-xl w-full text-slate-900" onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input placeholder="Nom" required className="bg-slate-50 border p-4 rounded-xl w-full text-slate-900" onChange={e => setFormData({...formData, lastName: e.target.value})} />
        </div>
        <input placeholder="Entreprise" required className="bg-slate-50 border p-4 rounded-xl w-full text-slate-900" onChange={e => setFormData({...formData, company: e.target.value})} />
        <input placeholder="Code NAF" required className="bg-slate-50 border p-4 rounded-xl w-full text-slate-900" onChange={e => setFormData({...formData, naf: e.target.value})} />
        <input placeholder="Email pro" type="email" required className="bg-slate-50 border p-4 rounded-xl w-full text-slate-900" onChange={e => setFormData({...formData, email: e.target.value})} />
        <input placeholder="Téléphone" required className="bg-slate-50 border p-4 rounded-xl w-full text-slate-900" onChange={e => setFormData({...formData, phone: e.target.value})} />
        <button disabled={isSubmitting} className="w-full bg-[#F39C12] text-white font-bold py-5 rounded-2xl hover:bg-[#E67E22] transition shadow-lg text-lg uppercase tracking-wider">
          {isSubmitting ? "Envoi..." : "Obtenir mon Rapport"}
        </button>
      </form>
    </div>
  );
};

// --- App ---
export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [diagResult, setDiagResult] = useState<{score: number, answers: boolean[], employeeCount: number} | null>(null);

  const resetApp = () => { setView('landing'); setEmployeeCount(0); setScore(0); setAnswers([]); setDiagResult(null); };

  const currentQuestions = QUESTIONS.filter(q => {
    const rangeOk = (!q.minEmployees || employeeCount >= q.minEmployees) && (!q.maxEmployees || employeeCount <= q.maxEmployees);
    return rangeOk;
  }).slice(0, 10);

  const renderContent = () => {
    switch(view) {
      case 'landing':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <section className="bg-slate-900 text-white py-32 px-6 text-center">
              <div className="container mx-auto">
                <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">Sécurisez votre <span className="text-[#F39C12]">croissance</span>.</h1>
                <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-300 font-medium">Diagnostic de conformité gratuit pour les dirigeants de la propreté en PACA, Corse et Languedoc-Roussillon.</p>
                <button onClick={() => setView('size-selection')} className="bg-[#F39C12] text-white text-xl font-bold py-6 px-16 rounded-[2rem] shadow-2xl hover:scale-105 transition-all">Lancer mon diagnostic</button>
              </div>
            </section>
            <section className="py-24 container mx-auto px-6 grid md:grid-cols-3 gap-10">
              {FEP_SERVICES.map((s, i) => (
                <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-slate-50 text-[#007BC0] mx-auto"><s.icon /></div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900">{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{s.content}</p>
                </div>
              ))}
            </section>
          </motion.div>
        );
      case 'size-selection':
        return (
          <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-16 rounded-[4rem] shadow-2xl max-w-xl w-full">
              <h2 className="text-4xl font-black mb-12">Votre effectif (ETP)</h2>
              <input type="number" autoFocus placeholder="0" className="text-7xl font-black border-b-4 border-[#007BC0] outline-none text-center w-full text-[#007BC0] mb-12" onChange={e => setEmployeeCount(parseInt(e.target.value))} />
              <button onClick={() => setView('diagnostic')} className="w-full bg-[#007BC0] text-white py-6 rounded-[2rem] font-black text-xl shadow-xl">Démarrer le diagnostic</button>
            </motion.div>
          </div>
        );
      case 'diagnostic':
        const idx = answers.length;
        if (idx >= currentQuestions.length) { setDiagResult({score, answers, employeeCount}); setView('results'); return null; }
        const q = currentQuestions[idx];
        return (
          <div className="min-h-[80vh] container mx-auto max-w-3xl flex flex-col justify-center px-6">
            <div className="w-full h-2 bg-slate-100 rounded-full mb-12 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${(idx / currentQuestions.length) * 100}%` }} className="h-full bg-[#007BC0]"></motion.div></div>
            <motion.div key={q.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <span className="text-[#F39C12] font-black text-sm mb-4 block uppercase tracking-widest">{q.category}</span>
              <h2 className="text-4xl font-black mb-8 leading-tight">{q.text}</h2>
              <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 mb-12 italic text-lg text-blue-900/70">" {q.detail} "</div>
              <div className="grid grid-cols-2 gap-8">
                <button onClick={() => { setScore(score + 1); setAnswers([...answers, true]); }} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] font-black text-3xl hover:border-green-500 transition-all shadow-xl shadow-slate-100 uppercase">OUI</button>
                <button onClick={() => setAnswers([...answers, false])} className="p-10 bg-white border-2 border-slate-100 rounded-[3rem] font-black text-3xl hover:border-red-500 transition-all shadow-xl shadow-slate-100 uppercase">NON</button>
              </div>
            </motion.div>
          </div>
        );
      case 'results':
        return (
          <div className="py-20 container mx-auto max-w-5xl px-6 text-center">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 text-white rounded-[4rem] p-16 shadow-2xl">
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-10" />
                <h2 className="text-5xl font-black mb-6 tracking-tight text-white">Analyse Terminée.</h2>
                <p className="text-2xl text-slate-400 mb-8 max-w-2xl mx-auto font-medium">Votre diagnostic pour vos {employeeCount} salariés est prêt.</p>
                <div className="bg-white/10 p-6 rounded-2xl mb-12 max-w-md mx-auto border border-white/20">
                    <p className="text-white font-bold text-lg mb-2">Besoin d'aide sur vos résultats ?</p>
                    <p className="text-slate-300">Contactez Sofia Soltane au <a href="tel:0650282695" className="text-[#F39C12] font-black">06 50 28 26 95</a></p>
                </div>
                <LeadForm onSubmit={() => { alert("Votre rapport a été envoyé avec succès !"); resetApp(); }} diagnosticData={diagResult} />
             </motion.div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-50">
        <div onClick={resetApp} className="cursor-pointer"><FepLogo /></div>
        <div className="hidden md:flex gap-8 font-bold text-sm">
          <button onClick={resetApp} className="hover:text-[#007BC0] transition">Accueil</button>
          <button onClick={() => setView('size-selection')} className="bg-[#007BC0] text-white px-6 py-2 rounded-full hover:bg-[#0069A5] transition shadow-sm uppercase font-black tracking-widest text-xs">Mon Diagnostic</button>
        </div>
      </nav>
      <main>{renderContent()}</main>
      <footer className="bg-slate-900 text-white py-24 px-6 border-t border-slate-800">
        <div className="container mx-auto grid md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-1">
            <FepLogo className="h-10 brightness-200 mb-8" />
            <p className="text-slate-400 leading-relaxed font-medium italic">Accompagner et défendre les entreprises de propreté en PACA, Corse et Languedoc-Roussillon.</p>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-lg text-[#F39C12]">Contact</h4>
            <div className="text-slate-400 space-y-4 font-medium">
              <p className="flex items-center gap-3"><MapPin size={18} className="text-[#007BC0]" /> 8 Rue John Maynard Keynes, 13013</p>
              <p className="flex items-center gap-3"><Phone size={18} className="text-[#007BC0]" /> <a href="tel:0650282695">06 50 28 26 95</a></p>
              <p className="flex items-center gap-3"><Mail size={18} className="text-[#007BC0]" /> <a href="mailto:services@fep-sud-est.com">services@fep-sud-est.com</a></p>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-lg text-white">Partenaires</h4>
            <ul className="text-slate-400 space-y-4 font-medium">
              <li><a href="https://www.akto.fr/" target="_blank" className="hover:text-white">AKTO Formation</a></li>
              <li><a href="https://www.inhni.com/" target="_blank" className="hover:text-white">INHNI Apprentissage</a></li>
              <li><a href="https://www.monde-proprete.com/" target="_blank" className="hover:text-white">Monde de la Propreté</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-8 text-lg text-white">Rejoindre</h4>
            <a href="https://www.fep-sud-est.com/adherer/" target="_blank" className="block bg-[#007BC0] text-white text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#0069A5] transition">Adhérer en ligne</a>
            <div className="flex gap-6 mt-8 justify-center md:justify-start">
              <Linkedin className="text-slate-400 hover:text-white transition cursor-pointer" />
              <Facebook className="text-slate-400 hover:text-white transition cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} FEP Sud-Est • PACA • CORSE • LANGUEDOC-ROUSSILLON
        </div>
      </footer>
    </div>
  );
}