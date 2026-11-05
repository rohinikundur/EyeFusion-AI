import React, { useState } from 'react';
import { BookOpen, Eye, AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

const DISEASES = [
  {
    id: 'cataract',
    name: 'Cataract',
    latin: 'Opacitas Lentis',
    category: 'Anterior Segment / Media Opacity',
    badgeColor: 'bg-[#EAF1E9] text-[#102E32] border-[#8C9A8E]',
    overview:
      'A cataract is a progressive clouding of the normally crystalline natural lens of the eye. As lens proteins denature and aggregate, light rays passing through the pupil are scattered or blocked, causing diffuse visual blur, contrast degradation, and glare.',
    fundusPresentation:
      'In retinal fundus photography, cataracts manifest as a pervasive diffuse yellowish or brownish haze across the entire image. Fine retinal vascular branches lose optical sharpness, disc margins appear blunted, and overall color contrast is significantly attenuated.',
    symptoms: [
      'Painless progressive blurring of distant and near vision',
      'Increased glare and halos around bright headlights or point lights',
      'Faded or yellowish color perception',
      'Frequent changes in eyeglass prescriptions',
    ],
    riskFactors: [
      'Advanced chronological age (>60 years)',
      'Prolonged ultraviolet (UV) solar radiation exposure',
      'Systemic diabetes mellitus',
      'Corticosteroid medication history or intraocular trauma',
    ],
    clinicalManagement:
      'Surgical phacoemulsification with intraocular lens (IOL) implantation is the definitive gold-standard treatment, routinely restoring optical clarity when indicated.',
  },
  {
    id: 'diabetic_retinopathy',
    name: 'Diabetic Retinopathy',
    latin: 'Retinopathia Diabetica',
    category: 'Retinal Microvascular Disease',
    badgeColor: 'bg-red-50 text-red-900 border-red-300',
    overview:
      'A microvascular complication of chronic diabetes mellitus characterized by microvascular occlusion, increased endothelial permeability, retinal capillary dropout, and potential aberrant neovascular proliferation driven by vascular endothelial growth factor (VEGF).',
    fundusPresentation:
      'Classic hallmarks on fundus photography include punctate red microaneurysms, intraretinal dot-and-blot hemorrhages, flame-shaped nerve fiber layer hemorrhages, bright yellow lipid exudates, cotton-wool spots, and venous beading.',
    symptoms: [
      'Often completely asymptomatic in early non-proliferative stages',
      'Fluctuating vision and progressive macular blur',
      'Sudden shower of dark floaters or cobwebs from vitreous hemorrhage',
      'Central scotoma from diabetic macular edema (DME)',
    ],
    riskFactors: [
      'Extended duration of diabetes mellitus',
      'Elevated glycosylated hemoglobin (HbA1c > 7.0%)',
      'Coexisting systemic arterial hypertension',
      'Diabetic nephropathy and dyslipidemia',
    ],
    clinicalManagement:
      'Strict glycemic and blood pressure regulation, anti-VEGF intravitreal pharmacotherapy (e.g., Aflibercept, Ranibizumab), panretinal photocoagulation (PRP), and pars plana vitrectomy for non-clearing vitreous hemorrhage.',
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    latin: 'Neuropathia Optica Glaucomatosa',
    category: 'Progressive Optic Neuropathy',
    badgeColor: 'bg-[#D5A86B]/20 text-[#102E32] border-[#D5A86B]',
    overview:
      'Glaucoma encompasses a group of progressive optic neuropathies characterized by apoptosis of retinal ganglion cells (RGCs), loss of retinal nerve fibers, and morphological excavation of the optic nerve head, leading to irreversible visual field loss.',
    fundusPresentation:
      'Fundus photography reveals an elevated vertical cup-to-disc ratio (CDR > 0.6–0.7), neuroretinal rim thinning (often breaching the ISNT rule), disc hemorrhages across disc margins, vessel baring or bayoneting, and localized peripapillary atrophy (Beta zone).',
    symptoms: [
      'Known as the "silent thief of sight" due to lack of early symptoms',
      'Gradual peripheral visual field constriction (tunnel vision)',
      'Preserved central visual acuity until advanced terminal stages',
      'Severe eye pain and haloes in acute angle-closure crises',
    ],
    riskFactors: [
      'Elevated intraocular pressure (IOP > 21 mmHg)',
      'Family history of primary open-angle glaucoma (POAG)',
      'African or Hispanic descent (POAG), East Asian descent (PACG)',
      'High myopia or thin central corneal thickness (CCT < 520 um)',
    ],
    clinicalManagement:
      'Lifelong therapeutic reduction of IOP through topical hypotensive eye drops (prostaglandin analogues, beta-blockers), selective laser trabeculoplasty (SLT), minimally invasive glaucoma surgery (MIGS), or trabeculectomy.',
  },
  {
    id: 'normal',
    name: 'Normal Retinal Fundus',
    latin: 'Fundus Oculi Normalis',
    category: 'Physiological Baseline',
    badgeColor: 'bg-[#B8D9CE]/30 text-[#102E32] border-[#194B50]/30',
    overview:
      'A physiological, healthy fundus exhibiting intact retinal neuroanatomy, clear ocular optical media, sharp optic nerve margins, healthy vascular caliber, and an intact macula without structural lesions.',
    fundusPresentation:
      'Round or vertically oval optic disc with distinct margins and healthy orange-pink neuroretinal rim conforming to the ISNT rule (Inferior > Superior > Nasal > Temporal). A normal physiological cup (CDR < 0.3-0.4), sharp vascular branching, and a dark foveal reflex.',
    symptoms: [
      'Clear, unhindered central and peripheral visual fields',
      'Normal contrast sensitivity and color vision',
      'Absence of floaters, flashes, or photopsias',
    ],
    riskFactors: [
      'Routine annual or biennial ophthalmic screening recommended',
      'Protective eyewear against solar ultraviolet exposure',
    ],
    clinicalManagement:
      'Preventive routine visual examinations every 1-2 years to establish baseline parameters and facilitate early detection of insidious ocular diseases.',
  },
];

export default function EncyclopediaPage() {
  const [selectedId, setSelectedId] = useState('cataract');
  const activeDisease = DISEASES.find((d) => d.id === selectedId) || DISEASES[0];

  return (
    <div className="space-y-10 py-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#194B50]/15 text-[#194B50] text-xs font-mono font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-[#D5A86B]" />
          <span>Clinical Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#102E32]">
          Retinal Pathology Encyclopedia
        </h1>
        <p className="text-sm sm:text-base text-[#194B50]/80 max-w-2xl mx-auto">
          Comprehensive clinical reference detailing the four classification targets recognized by the EyeFusion-AI neural network.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#EAF1E9] p-1.5 rounded-2xl border border-[#B8D9CE]/40">
        {DISEASES.map((d) => {
          const isActive = d.id === selectedId;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 ${
                isActive
                  ? 'bg-[#102E32] text-[#F8F6EF] shadow-md'
                  : 'text-[#194B50] hover:bg-white/60'
              }`}
            >
              <span>{d.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Disease Profile Card */}
      <div className="bg-white rounded-3xl p-8 lg:p-10 border border-[#B8D9CE]/60 shadow-lg space-y-8">
        
        {/* Title & Category */}
        <div className="border-b border-[#B8D9CE]/40 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${activeDisease.badgeColor}`}>
                {activeDisease.category}
              </span>
              <span className="text-xs font-serif italic text-[#194B50]/70">
                {activeDisease.latin}
              </span>
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#102E32]">
              {activeDisease.name}
            </h2>
          </div>
        </div>

        {/* Clinical Overview */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#102E32] flex items-center space-x-2">
            <Eye className="w-4 h-4 text-[#194B50]" />
            <span>Pathological Overview</span>
          </h3>
          <p className="text-sm text-[#194B50]/90 leading-relaxed">
            {activeDisease.overview}
          </p>
        </div>

        {/* Fundus Presentation */}
        <div className="p-5 rounded-2xl bg-[#F8F6EF] border border-[#B8D9CE]/50 space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#D5A86B]">
            Fundus Photography Presentation (AI Feature Targets)
          </h4>
          <p className="text-sm text-[#102E32] leading-relaxed">
            {activeDisease.fundusPresentation}
          </p>
        </div>

        {/* Symptoms & Risk Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Symptoms */}
          <div className="p-6 rounded-2xl bg-[#EAF1E9]/50 border border-[#B8D9CE]/40 space-y-3">
            <h4 className="text-sm font-bold text-[#102E32] flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-[#194B50]" />
              <span>Characteristic Clinical Symptoms</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#194B50]/90">
              {activeDisease.symptoms.map((s, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D5A86B] mt-1.5 flex-shrink-0"></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Factors */}
          <div className="p-6 rounded-2xl bg-[#EAF1E9]/50 border border-[#B8D9CE]/40 space-y-3">
            <h4 className="text-sm font-bold text-[#102E32] flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#D5A86B]" />
              <span>Key Epidemiological Risk Factors</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#194B50]/90">
              {activeDisease.riskFactors.map((r, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#194B50] mt-1.5 flex-shrink-0"></span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Clinical Management */}
        <div className="p-5 rounded-2xl bg-[#102E32] text-[#F8F6EF] space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#D5A86B]">
            Standard Clinical Management & Interventions
          </h4>
          <p className="text-xs sm:text-sm text-[#B8D9CE] leading-relaxed">
            {activeDisease.clinicalManagement}
          </p>
        </div>

      </div>

    </div>
  );
}
