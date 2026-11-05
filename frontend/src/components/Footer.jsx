import React from 'react';
import { ShieldAlert, Award, FileText, ExternalLink, HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#102E32] text-[#F8F6EF] border-t border-[#194B50] mt-24">
      {/* Clinical Disclaimer Banner */}
      <div className="bg-[#194B50]/60 border-b border-[#B8D9CE]/20 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center space-x-3.5">
          <ShieldAlert className="w-5 h-5 text-[#D5A86B] flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs sm:text-sm text-[#F8F6EF]/90 leading-relaxed font-normal">
            <strong className="text-[#D5A86B] font-semibold">Academic Prototype Notice:</strong> EyeFusion-AI is an AI-based research and engineering prototype developed for educational, research and demonstration purposes. It is not an FDA/CE-cleared diagnostic device. Classification outputs are generated for research and technical evaluation only and must not replace professional clinical evaluation by an ophthalmologist.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Project Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#194B50] border border-[#D5A86B] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#B8D9CE]"></div>
              </div>
              <span className="font-display font-bold text-xl text-[#F8F6EF]">
                EyeFusion<span className="text-[#D5A86B]">-AI</span>
              </span>
            </div>
            <p className="text-sm text-[#B8D9CE]/80 max-w-md leading-relaxed">
              AI-Based Multi-Class Eye Disease Classification and Prediction using Deep Learning.
              Harnessing a dual-backbone feature extraction hierarchy (EfficientNetB1 + InceptionV3)
              harmonized by Adaptive Class-Aware Feature Fusion (ACAF).
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 text-xs rounded-md bg-[#194B50] text-[#B8D9CE] border border-[#B8D9CE]/20 font-mono">
                94.31% Accuracy
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-[#194B50] text-[#B8D9CE] border border-[#B8D9CE]/20 font-mono">
                0.9913 AUROC
              </span>
              <span className="px-2.5 py-1 text-xs rounded-md bg-[#194B50] text-[#D5A86B] border border-[#D5A86B]/30 font-mono">
                ACAF Gated Fusion
              </span>
            </div>
          </div>

          {/* Column 2: Disease Classes */}
          <div>
            <h4 className="text-xs font-bold text-[#D5A86B] uppercase tracking-wider mb-4">
              Classification Targets
            </h4>
            <ul className="space-y-2 text-sm text-[#B8D9CE]/80">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5A86B]"></span>
                <span>Cataract (Lens Opacity)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5A86B]"></span>
                <span>Diabetic Retinopathy</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5A86B]"></span>
                <span>Glaucoma (Neuropathy)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5A86B]"></span>
                <span>Normal Retinal Fundus</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Architecture Stack */}
          <div>
            <h4 className="text-xs font-bold text-[#D5A86B] uppercase tracking-wider mb-4">
              Technology Stack
            </h4>
            <ul className="space-y-2 text-sm text-[#B8D9CE]/80">
              <li>TensorFlow & Keras 3.12</li>
              <li>FastAPI Async REST API</li>
              <li>React 19 + Vite + Tailwind</li>
              <li>Recharts Visualization</li>
              <li>ACAF Prototype Context</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#194B50] flex flex-col sm:flex-row items-center justify-between text-xs text-[#B8D9CE]/60 gap-4">
          <p>© 2026 EyeFusion-AI — AI Research Prototype. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#F8F6EF] transition-colors">FastAPI Service v1.0.0</span>
            <span>•</span>
            <span className="hover:text-[#F8F6EF] transition-colors">Dual-Backbone ACAF</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
