import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Info,
  ShieldCheck,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';

const CLASS_CONFIG = {
  normal: {
    color: '#194B50',
    barColor: '#194B50',
    badge: 'bg-[#B8D9CE]/30 text-[#102E32] border-[#194B50]/40',
    tag: 'Normal Healthy Retina',
    severity: 'Negative for Major Pathologies',
    summary: 'The fundus architecture exhibits normal optic nerve head morphology, intact neuroretinal rim, healthy retinal vascular distribution, and absence of microaneurysms or hard exudates.',
  },
  glaucoma: {
    color: '#D5A86B',
    barColor: '#D5A86B',
    badge: 'bg-[#D5A86B]/25 text-[#102E32] border-[#D5A86B]',
    tag: 'Glaucomatous Optic Neuropathy',
    severity: 'High Clinical Priority',
    summary: 'Detected structural characteristics consistent with glaucomatous damage, including enlarged optic cup-to-disc ratio (CDR), neuroretinal rim thinning, and vascular displacement.',
  },
  diabetic_retinopathy: {
    color: '#E06D53',
    barColor: '#E06D53',
    badge: 'bg-red-100 text-red-900 border-red-300',
    tag: 'Diabetic Retinopathy',
    severity: 'Urgent Ophthalmological Evaluation',
    summary: 'Identified microvascular retinal lesions characteristic of diabetic retinopathy, including microaneurysms, scattered blot hemorrhages, and lipid exudation.',
  },
  cataract: {
    color: '#8C9A8E',
    barColor: '#8C9A8E',
    badge: 'bg-[#EAF1E9] text-[#102E32] border-[#8C9A8E]',
    tag: 'Cataract (Lens Opacity)',
    severity: 'Clinical Evaluation Recommended',
    summary: 'Identified diffuse optical haziness and contrast attenuation characteristic of crystalline lens opacification, obscuring crisp visualization of posterior retinal structures.',
  },
};

export default function PredictionCard({ result, onReset }) {
  if (!result) return null;

  const {
    predicted_class,
    predicted_display_name,
    confidence_percentage,
    probabilities,
    detailed_probabilities,
    filename,
  } = result;

  const currentConfig = CLASS_CONFIG[predicted_class] || CLASS_CONFIG.normal;

  // Prepare chart data for Recharts
  const chartData = (detailed_probabilities || []).map((item) => ({
    name: item.display_name,
    key: item.label,
    percentage: item.percentage,
    probability: item.probability,
    color: CLASS_CONFIG[item.label]?.barColor || '#194B50',
  }));

  const handleExportReport = () => {
    const reportText = `
============================================================
              EyeFusion-AI CLINICAL REPORT SUMMARY
============================================================
Date/Time:       ${new Date().toLocaleString()}
Image Filename:  ${filename}
Primary Target:  ${predicted_display_name.toUpperCase()}
Confidence:      ${confidence_percentage}%
Classification:  ${currentConfig.severity}

------------------------------------------------------------
PREDICTION PROBABILITY DISTRIBUTION:
------------------------------------------------------------
${(detailed_probabilities || [])
  .map(
    (p) =>
      `• ${p.display_name.padEnd(24)}: ${p.percentage.toFixed(2)}% (prob: ${p.probability})`
  )
  .join('\n')}

------------------------------------------------------------
MODEL SPECIFICATIONS:
------------------------------------------------------------
Architecture:    EfficientNetB1 + InceptionV3 + ACAF
Trained AUROC:   0.9913
Reported Acc:    94.31%

------------------------------------------------------------
DISCLAIMER:
EyeFusion-AI is an academic research prototype and not a 
medical device. Always confirm findings with a licensed 
ophthalmologist.
============================================================
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EyeFusion_Report_${predicted_class}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-[#B8D9CE]/50 overflow-hidden transition-all duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#102E32] to-[#194B50] text-[#F8F6EF] px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#D5A86B] uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Multi-Class Inference Result</span>
            </div>
            <h3 className="text-xl font-display font-bold text-[#F8F6EF]">
              Diagnostic Prediction Analysis
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F8F6EF]/10 hover:bg-[#F8F6EF]/20 text-xs font-semibold text-[#F8F6EF] border border-[#B8D9CE]/30 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-[#D5A86B]" />
              <span>Export Report</span>
            </button>
            {onReset && (
              <button
                onClick={onReset}
                className="px-3 py-1.5 rounded-lg bg-[#D5A86B] hover:bg-[#D5A86B]/90 text-xs font-bold text-[#102E32] transition-colors"
              >
                Scan Another
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">
        
        {/* Main Verdict Card */}
        <div className="p-6 rounded-2xl bg-[#F8F6EF] border border-[#B8D9CE]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${currentConfig.badge}`}>
                {currentConfig.tag}
              </span>
              <span className="text-xs text-[#194B50] font-mono">
                File: <span className="font-semibold text-[#102E32]">{filename}</span>
              </span>
            </div>
            <h2 className="text-3xl font-display font-extrabold text-[#102E32]">
              {predicted_display_name}
            </h2>
            <p className="text-sm text-[#194B50]/80 leading-relaxed">
              {currentConfig.summary}
            </p>
          </div>

          {/* Confidence Score Pill */}
          <div className="flex-shrink-0 bg-white p-5 rounded-2xl border border-[#B8D9CE]/50 shadow-sm text-center min-w-[170px]">
            <p className="text-xs font-semibold text-[#194B50]/70 uppercase tracking-wider mb-1">
              Confidence Score
            </p>
            <div className="text-4xl font-display font-extrabold text-[#102E32]">
              {confidence_percentage}%
            </div>
            <div className="w-full bg-[#EAF1E9] h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${confidence_percentage}%`,
                  backgroundColor: currentConfig.color,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recharts Probability Visualizer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#102E32] flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#194B50]" />
              <span>Full Class Probability Distribution</span>
            </h4>
            <span className="text-xs text-[#194B50]/70 font-mono">
              Softmax Output (Sum = 1.0)
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 30, left: 20, bottom: 8 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  unit="%"
                  tick={{ fill: '#194B50', fontSize: 12 }}
                  axisLine={{ stroke: '#B8D9CE' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#102E32', fontSize: 13, fontWeight: 600 }}
                  axisLine={{ stroke: '#B8D9CE' }}
                  width={150}
                />
                <Tooltip
                  formatter={(value, name, props) => [`${value}%`, 'Confidence']}
                  contentStyle={{
                    backgroundColor: '#102E32',
                    borderColor: '#194B50',
                    borderRadius: '8px',
                    color: '#F8F6EF',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#D5A86B', fontWeight: 600 }}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.key === predicted_class ? entry.color : '#B8D9CE'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Granular Probabilities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {detailed_probabilities?.map((item) => {
            const isTop = item.label === predicted_class;
            return (
              <div
                key={item.label}
                className={`p-3.5 rounded-xl border transition-all ${
                  isTop
                    ? 'bg-[#EAF1E9]/80 border-[#194B50] shadow-sm'
                    : 'bg-white border-[#B8D9CE]/30'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#194B50]/80 mb-1">
                  <span className="font-medium truncate">{item.display_name}</span>
                  {isTop && (
                    <span className="w-2 h-2 rounded-full bg-[#D5A86B]"></span>
                  )}
                </div>
                <div className="text-xl font-display font-bold text-[#102E32]">
                  {item.percentage}%
                </div>
                <div className="text-[11px] font-mono text-[#194B50]/60 mt-0.5">
                  p = {item.probability.toFixed(5)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-4 rounded-xl bg-[#EAF1E9] border border-[#B8D9CE]/60 flex items-start space-x-3 text-xs text-[#194B50]/90">
          <Info className="w-4 h-4 text-[#D5A86B] flex-shrink-0 mt-0.5" />
          <p>
            <strong>Diagnostic Note:</strong> AI model predictions are derived from learned visual patterns across EfficientNetB1 and InceptionV3 feature spaces. They must be validated against clinical ophthalmoscopy, optical coherence tomography (OCT), and intraocular pressure (IOP) readings.
          </p>
        </div>

      </div>
    </div>
  );
}
