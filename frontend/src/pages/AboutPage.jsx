import React from 'react';
import { Award, ShieldAlert, Cpu, BarChart2, BookOpen, CheckCircle, ExternalLink } from 'lucide-react';
import MetricsBadge from '../components/MetricsBadge';

export default function AboutPage() {
  const verifiedResults = [
    { metric: 'Test Accuracy', score: '94.31%', description: 'Overall top-1 multi-class classification accuracy across unseen test set fundus images.' },
    { metric: 'Macro Precision', score: '94.28%', description: 'Equal-weight average precision per disease class, preventing majority class bias.' },
    { metric: 'Macro Recall (Sensitivity)', score: '94.22%', description: 'Proportion of true positive pathology cases correctly detected by the network.' },
    { metric: 'Macro F1-Score', score: '94.28%', description: 'Harmonic mean of precision and recall ensuring balanced clinical reliability.' },
    { metric: 'Mean AUROC', score: '0.9913', description: 'Area under the receiver operating characteristic curve across all four diagnostic categories.' },
    { metric: 'Matthews Correlation (MCC)', score: '0.9242', description: 'Quality coefficient indicating high predictive reliability even under severe class imbalance.' },
    { metric: 'Mean IoU', score: '0.8927', description: 'Intersection-over-Union measuring discriminative feature saliency coherence.' },
  ];

  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#102E32]">
          EyeFusion-AI Research & Evaluation
        </h1>
        <p className="text-sm sm:text-base text-[#194B50]/80 max-w-2xl mx-auto">
          AI-Based Multi-Class Eye Disease Classification and Prediction using Deep Learning
          and Adaptive Class-Aware Feature Fusion (ACAF).
        </p>
      </div>

      {/* Experimental Results Table */}
      <div className="bg-white rounded-3xl p-8 border border-[#B8D9CE]/60 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B8D9CE]/40 pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#102E32] flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-[#194B50]" />
              <span>Measured Experimental Benchmarks</span>
            </h2>
            <p className="text-xs text-[#194B50]/70 mt-0.5">
              Strictly measured empirical performance obtained on the held-out test dataset.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#EAF1E9] text-[#194B50] text-xs font-mono font-bold self-start sm:self-auto">
            Empirical Results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#B8D9CE]/50 text-[#194B50] font-mono text-xs">
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Clinical Significance & Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8D9CE]/30">
              {verifiedResults.map((r) => (
                <tr key={r.metric} className="hover:bg-[#F8F6EF]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#102E32]">{r.metric}</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-base text-[#194B50] whitespace-nowrap">
                    {r.score}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#194B50]/80 leading-relaxed">
                    {r.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Research Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-[#B8D9CE]/60 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-[#102E32] flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#194B50]" />
            <span>Dual-Backbone Feature Synthesis</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#194B50]/80 leading-relaxed">
            Standard single-backbone convolutional networks often struggle to concurrently resolve
            localized microvascular lesions (such as punctate diabetic microaneurysms) and global morphological alterations (such as optic cup-to-disc ratio expansion in glaucoma). EyeFusion-AI resolves this by concurrently extracting features via EfficientNetB1 and InceptionV3.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#B8D9CE]/60 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-[#102E32] flex items-center space-x-2">
            <Award className="w-4 h-4 text-[#D5A86B]" />
            <span>Adaptive Class-Aware Refinement</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#194B50]/80 leading-relaxed">
            ACAF introduces a class prototype memory matrix that preserves representative feature vectors for Cataract, Diabetic Retinopathy, Glaucoma, and Normal eyes. Preliminary predictions modulate the fused representations via residual scaling, achieving an AUROC of 0.9913.
          </p>
        </div>

      </div>

      {/* Academic Disclaimer Notice */}
      <div className="p-6 rounded-3xl bg-[#102E32] text-[#F8F6EF] border border-[#D5A86B]/40 space-y-3">
        <div className="flex items-center space-x-2 text-[#D5A86B] font-mono text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Ethics & Clinical Disclaimer</span>
        </div>
        <h3 className="text-lg font-display font-bold text-[#F8F6EF]">
          Academic Prototype Designation
        </h3>
        <p className="text-xs sm:text-sm text-[#B8D9CE] leading-relaxed">
          EyeFusion-AI is an AI-based research and engineering prototype developed for educational, research and demonstration purposes. The application is not certified as a medical diagnostic device and is not intended for clinical decision-making, patient diagnosis or treatment prescription. All classification outputs are intended for research and technical evaluation only. Always seek advice from a qualified ophthalmologist or licensed healthcare professional regarding eye health concerns.
        </p>
      </div>

    </div>
  );
}
