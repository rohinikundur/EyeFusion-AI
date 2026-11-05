import React from 'react';
import { Award, TrendingUp, CheckCircle, Target, Sparkles, BarChart3 } from 'lucide-react';

const METRICS = [
  { label: 'Test Accuracy', value: '94.31%', subtext: 'Benchmark', icon: Target },
  { label: 'Mean AUROC', value: '0.9913', subtext: 'Discriminative', icon: Sparkles },
  { label: 'Macro F1-Score', value: '94.28%', subtext: 'Harmonized', icon: Award },
  { label: 'Matthews Corr (MCC)', value: '0.9242', subtext: 'Balanced', icon: TrendingUp },
  { label: 'Mean IoU', value: '0.8927', subtext: 'Feature Overlap', icon: BarChart3 },
];

export default function MetricsBadge({ compact = false }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        {METRICS.slice(0, 3).map((m) => (
          <div
            key={m.label}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#194B50]/30 border border-[#B8D9CE]/30 text-xs"
          >
            <m.icon className="w-3.5 h-3.5 text-[#D5A86B]" />
            <span className="text-[#B8D9CE] font-medium">{m.label}:</span>
            <span className="font-bold text-[#F8F6EF] font-mono">{m.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {METRICS.map((m) => (
        <div
          key={m.label}
          className="p-4 rounded-xl bg-white border border-[#B8D9CE]/50 shadow-sm hover:border-[#194B50] transition-all group"
        >
          <div className="flex items-center justify-between text-xs text-[#194B50]/70 mb-2">
            <span className="font-semibold">{m.subtext}</span>
            <m.icon className="w-4 h-4 text-[#D5A86B] group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-display font-extrabold text-[#102E32]">
            {m.value}
          </div>
          <div className="text-xs text-[#194B50]/90 font-medium mt-1 truncate">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
