import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  ArrowDown,
  ArrowRight,
  Sparkles,
  GitMerge,
  Eye,
  CheckCircle2,
  Sliders,
  Database,
  BarChart2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function ArchitecturePage() {
  const [activeNode, setActiveNode] = useState('acaf');

  const stepDetails = {
    input: {
      title: 'Step 1: Retinal Fundus Input',
      badge: 'Input Stage',
      summary: 'High-resolution ocular fundus photography is received and scaled into the model pipeline.',
      points: [
        'Input Dimensions: 224 x 224 pixels with 3 RGB color channels.',
        'Accepts un-normalized raw pixel values directly from imaging devices.',
        'Dual built-in normalization layers route appropriate scalings to each respective backbone.',
      ],
    },
    branchA: {
      title: 'Step 2 (Branch A): EfficientNetB1 Backbone',
      badge: 'Multi-Scale Depthwise Extraction',
      summary: 'Extracts deep structural retinal representations using inverted residual depthwise convolutions.',
      points: [
        'Optimized via compound scaling for balanced network depth, width, and resolution.',
        'Global Average Pooling (GAP) aggregates spatial feature maps into a dense vector.',
        'Feature projection layer maps extracted features to a standardized 1280-dimensional embedding.',
      ],
    },
    branchB: {
      title: 'Step 2 (Branch B): InceptionV3 Backbone',
      badge: 'Multi-Frequency Spatial Extraction',
      summary: 'Extracts complementary visual features across multiple receptive field scales simultaneously.',
      points: [
        'Utilizes factorized asymmetric convolutions (e.g., 1x7 and 7x1 filters) to capture fine vascular patterns.',
        'Global Average Pooling compresses high-dimensional feature activations.',
        'Linear projection layer aligns the 2048-dimensional output to 1280 dimensions to match Branch A.',
      ],
    },
    acaf: {
      title: 'Step 3: Adaptive Class-Aware Feature Fusion (ACAF)',
      badge: 'Core Novel Contribution',
      summary: 'Harmonizes features from both backbones using learned gating and class-aware prototype memory.',
      points: [
        'Adaptive Gated Fusion: Dynamically weights EfficientNet and Inception features using a learned gating vector.',
        'Class Prototype Context: Employs trainable prototype vectors for each disease class combined with preliminary probabilities.',
        'Residual Class-Aware Refinement: Re-injects the learned prototype context back into the fused representation via a learned scaling factor.',
      ],
    },
    head: {
      title: 'Step 4: Classification Head',
      badge: 'Dense Decision Network',
      summary: 'Refines the fused representation through structured regularization layers to prevent overfitting.',
      points: [
        'Fully connected Dense layers with non-linear Rectified Linear Unit (ReLU) activations.',
        'Batch Normalization layers stabilize internal covariate shift across training batches.',
        'Dropout regularization randomly deactivates pathways to ensure robust generalization.',
      ],
    },
    output: {
      title: 'Step 5: Final Multi-Class Output',
      badge: 'Diagnostic Distribution',
      summary: 'Softmax activation generates a normalized probability distribution across the four diagnostic classes.',
      points: [
        'Cataract: Detection of optical media clouding and vascular contrast attenuation.',
        'Diabetic Retinopathy: Recognition of microaneurysms, hemorrhages, and lipid exudates.',
        'Glaucoma: Identification of optic cup-to-disc enlargement and neuroretinal rim loss.',
        'Normal: Verification of intact physiological retinal landmarks and healthy vascular trees.',
      ],
    },
  };

  const currentDetail = stepDetails[activeNode] || stepDetails.acaf;

  return (
    <div className="space-y-12 py-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#194B50]/15 text-[#194B50] text-xs font-mono font-semibold">
          <Cpu className="w-3.5 h-3.5 text-[#D5A86B]" />
          <span>EyeFusion Dual-Backbone Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#102E32]">
          Adaptive Class-Aware Feature Fusion (ACAF)
        </h1>
        <p className="text-sm sm:text-base text-[#194B50]/80 max-w-2xl mx-auto">
          Interactive architecture flow diagram demonstrating how dual convolutional backbones and adaptive prototype context cooperate to classify retinal diseases.
        </p>
      </div>

      {/* Interactive Architecture Flow Diagram Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#B8D9CE]/60 shadow-lg space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#B8D9CE]/40 gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#102E32] flex items-center space-x-2">
              <Layers className="w-5 h-5 text-[#194B50]" />
              <span>Interactive Architecture Flow</span>
            </h2>
            <p className="text-xs text-[#194B50]/70 mt-0.5">
              Hover over or click any component node to explore its technical role in the diagnostic pipeline.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#D5A86B] bg-[#102E32] px-3 py-1 rounded-full self-start sm:self-auto">
            Interactive Flowchart
          </span>
        </div>

        {/* The 5-Step Connected Flowchart */}
        <div className="space-y-6">
          
          {/* STEP 1: INPUT IMAGE */}
          <div className="flex justify-center">
            <div
              onMouseEnter={() => setActiveNode('input')}
              onClick={() => setActiveNode('input')}
              className={`w-full max-w-xl p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                activeNode === 'input'
                  ? 'bg-[#102E32] text-[#F8F6EF] border-[#D5A86B] shadow-lg ring-2 ring-[#D5A86B]/30'
                  : 'bg-[#F8F6EF] text-[#102E32] border-[#B8D9CE]/60 hover:border-[#194B50]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  activeNode === 'input' ? 'bg-[#D5A86B] text-[#102E32]' : 'bg-[#194B50]/15 text-[#194B50]'
                }`}>
                  STEP 1
                </span>
                <span className="text-xs font-mono text-[#D5A86B]">224 x 224 x 3</span>
              </div>
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#D5A86B]" />
                <span>Input Image (Retinal Fundus Photography)</span>
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${activeNode === 'input' ? 'text-[#B8D9CE]' : 'text-[#194B50]/80'}`}>
                Raw optical fundus capture in standard RGB color space.
              </p>
            </div>
          </div>

          {/* Directional Down Arrow with Parallel Branching */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
            <div className="flex items-center space-x-2 bg-[#EAF1E9] px-3 py-1 rounded-full border border-[#B8D9CE]/50 text-[11px] font-mono text-[#194B50] font-bold">
              <span>Parallel Feature Extraction</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#D5A86B]" />
            </div>
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
          </div>

          {/* STEP 2: DUAL-BACKBONE PARALLEL EXTRACTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Branch A: EfficientNetB1 */}
            <div
              onMouseEnter={() => setActiveNode('branchA')}
              onClick={() => setActiveNode('branchA')}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                activeNode === 'branchA'
                  ? 'bg-[#102E32] text-[#F8F6EF] border-[#D5A86B] shadow-lg ring-2 ring-[#D5A86B]/30'
                  : 'bg-[#F8F6EF] text-[#102E32] border-[#B8D9CE]/60 hover:border-[#194B50]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  activeNode === 'branchA' ? 'bg-[#D5A86B] text-[#102E32]' : 'bg-[#194B50]/15 text-[#194B50]'
                }`}>
                  STEP 2 — BRANCH A
                </span>
                <span className="text-xs font-mono text-[#D5A86B]">Projection: 1280-d</span>
              </div>
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-[#D5A86B]" />
                <span>EfficientNetB1 Backbone</span>
              </h3>
              <ul className={`text-xs mt-2 space-y-1 ${activeNode === 'branchA' ? 'text-[#B8D9CE]' : 'text-[#194B50]/80'}`}>
                <li>• Extracts compound-scaled depthwise retinal features</li>
                <li>• Global Average Pooling (GAP)</li>
                <li>• Projected to 1280 dimensions</li>
              </ul>
            </div>

            {/* Branch B: InceptionV3 */}
            <div
              onMouseEnter={() => setActiveNode('branchB')}
              onClick={() => setActiveNode('branchB')}
              className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                activeNode === 'branchB'
                  ? 'bg-[#102E32] text-[#F8F6EF] border-[#D5A86B] shadow-lg ring-2 ring-[#D5A86B]/30'
                  : 'bg-[#F8F6EF] text-[#102E32] border-[#B8D9CE]/60 hover:border-[#194B50]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  activeNode === 'branchB' ? 'bg-[#D5A86B] text-[#102E32]' : 'bg-[#194B50]/15 text-[#194B50]'
                }`}>
                  STEP 2 — BRANCH B
                </span>
                <span className="text-xs font-mono text-[#D5A86B]">Projection: 1280-d</span>
              </div>
              <h3 className="text-base font-bold flex items-center space-x-2">
                <GitMerge className="w-4 h-4 text-[#D5A86B]" />
                <span>InceptionV3 Backbone</span>
              </h3>
              <ul className={`text-xs mt-2 space-y-1 ${activeNode === 'branchB' ? 'text-[#B8D9CE]' : 'text-[#194B50]/80'}`}>
                <li>• Extracts multi-scale visual patterns & lesions</li>
                <li>• Global Average Pooling (GAP)</li>
                <li>• Projected to 1280 dimensions</li>
              </ul>
            </div>

          </div>

          {/* Directional Down Arrow: Convergence into ACAF */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
            <div className="flex items-center space-x-2 bg-[#EAF1E9] px-3 py-1 rounded-full border border-[#B8D9CE]/50 text-[11px] font-mono text-[#194B50] font-bold">
              <span>Convergence into ACAF Module</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#D5A86B]" />
            </div>
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
          </div>

          {/* STEP 3: ADAPTIVE CLASS-AWARE FEATURE FUSION (ACAF) */}
          <div className="max-w-4xl mx-auto">
            <div
              onMouseEnter={() => setActiveNode('acaf')}
              onClick={() => setActiveNode('acaf')}
              className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
                activeNode === 'acaf'
                  ? 'bg-[#102E32] text-[#F8F6EF] border-[#D5A86B] shadow-xl ring-2 ring-[#D5A86B]/30'
                  : 'bg-[#F8F6EF] text-[#102E32] border-[#B8D9CE]/60 hover:border-[#194B50]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                    activeNode === 'acaf' ? 'bg-[#D5A86B] text-[#102E32]' : 'bg-[#194B50]/15 text-[#194B50]'
                  }`}>
                    STEP 3 — CORE INNOVATION
                  </span>
                  <span className="text-xs font-semibold text-[#D5A86B]">
                    Adaptive Class-Aware Feature Fusion (ACAF)
                  </span>
                </div>
                <span className="text-xs font-mono text-[#D5A86B]">Learned Fusion & Context</span>
              </div>

              {/* The 3 Custom Components Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className={`p-4 rounded-xl border ${
                  activeNode === 'acaf' ? 'bg-[#194B50]/60 border-[#B8D9CE]/30' : 'bg-white border-[#B8D9CE]/40'
                }`}>
                  <div className="text-[11px] font-mono font-bold text-[#D5A86B] mb-1">01. Gated Fusion</div>
                  <h4 className="font-bold text-sm">Adaptive Gated Fusion</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${activeNode === 'acaf' ? 'text-[#B8D9CE]' : 'text-[#194B50]/80'}`}>
                    Combines features from both backbones using a learned adaptive gate vector.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  activeNode === 'acaf' ? 'bg-[#194B50]/60 border-[#B8D9CE]/30' : 'bg-white border-[#B8D9CE]/40'
                }`}>
                  <div className="text-[11px] font-mono font-bold text-[#D5A86B] mb-1">02. Prototype Context</div>
                  <h4 className="font-bold text-sm">Class Prototype Context</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${activeNode === 'acaf' ? 'text-[#B8D9CE]' : 'text-[#194B50]/80'}`}>
                    Uses preliminary class probabilities and trainable class prototypes to construct class-aware context.
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${
                  activeNode === 'acaf' ? 'bg-[#194B50]/60 border-[#B8D9CE]/30' : 'bg-white border-[#B8D9CE]/40'
                }`}>
                  <div className="text-[11px] font-mono font-bold text-[#D5A86B] mb-1">03. Residual Scaling</div>
                  <h4 className="font-bold text-sm">Residual Refinement</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${activeNode === 'acaf' ? 'text-[#B8D9CE]' : 'text-[#194B50]/80'}`}>
                    Adds the learned class context back to the fused feature representation via learned scaling.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Directional Down Arrow: Into Classification Head */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
            <div className="flex items-center space-x-2 bg-[#EAF1E9] px-3 py-1 rounded-full border border-[#B8D9CE]/50 text-[11px] font-mono text-[#194B50] font-bold">
              <span>Regularized Dense Projections</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#D5A86B]" />
            </div>
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
          </div>

          {/* STEP 4: CLASSIFICATION HEAD */}
          <div className="flex justify-center">
            <div
              onMouseEnter={() => setActiveNode('head')}
              onClick={() => setActiveNode('head')}
              className={`w-full max-w-xl p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                activeNode === 'head'
                  ? 'bg-[#102E32] text-[#F8F6EF] border-[#D5A86B] shadow-lg ring-2 ring-[#D5A86B]/30'
                  : 'bg-[#F8F6EF] text-[#102E32] border-[#B8D9CE]/60 hover:border-[#194B50]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  activeNode === 'head' ? 'bg-[#D5A86B] text-[#102E32]' : 'bg-[#194B50]/15 text-[#194B50]'
                }`}>
                  STEP 4
                </span>
                <span className="text-xs font-mono text-[#D5A86B]">Regularized Feedforward</span>
              </div>
              <h3 className="text-base font-bold flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#D5A86B]" />
                <span>Classification Head & Decision Layers</span>
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${activeNode === 'head' ? 'text-[#B8D9CE]' : 'text-[#194B50]/80'}`}>
                Dense projection layers, ReLU activations, Batch Normalization, and Dropout to prevent overfitting.
              </p>
            </div>
          </div>

          {/* Directional Down Arrow: Into Final Output */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
            <div className="flex items-center space-x-2 bg-[#EAF1E9] px-3 py-1 rounded-full border border-[#B8D9CE]/50 text-[11px] font-mono text-[#194B50] font-bold">
              <span>Softmax Probability Mapping</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#D5A86B]" />
            </div>
            <div className="w-0.5 h-6 bg-[#B8D9CE]"></div>
          </div>

          {/* STEP 5: FINAL OUTPUT (4 CLASSES) */}
          <div className="max-w-4xl mx-auto">
            <div
              onMouseEnter={() => setActiveNode('output')}
              onClick={() => setActiveNode('output')}
              className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 border ${
                activeNode === 'output'
                  ? 'bg-[#102E32] text-[#F8F6EF] border-[#D5A86B] shadow-xl ring-2 ring-[#D5A86B]/30'
                  : 'bg-[#F8F6EF] text-[#102E32] border-[#B8D9CE]/60 hover:border-[#194B50]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  activeNode === 'output' ? 'bg-[#D5A86B] text-[#102E32]' : 'bg-[#194B50]/15 text-[#194B50]'
                }`}>
                  STEP 5 — FINAL DIAGNOSTIC OUTPUT
                </span>
                <span className="text-xs font-mono text-[#D5A86B]">4-Class Softmax</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3.5 rounded-xl border text-center ${
                  activeNode === 'output' ? 'bg-[#194B50] border-[#B8D9CE]/30' : 'bg-white border-[#B8D9CE]/40'
                }`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D5A86B] mx-auto mb-1.5"></div>
                  <div className="font-bold text-xs sm:text-sm">Cataract</div>
                  <div className={`text-[10px] mt-0.5 ${activeNode === 'output' ? 'text-[#B8D9CE]' : 'text-[#194B50]/70'}`}>Media Opacity</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center ${
                  activeNode === 'output' ? 'bg-[#194B50] border-[#B8D9CE]/30' : 'bg-white border-[#B8D9CE]/40'
                }`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D5A86B] mx-auto mb-1.5"></div>
                  <div className="font-bold text-xs sm:text-sm">Diabetic Retinopathy</div>
                  <div className={`text-[10px] mt-0.5 ${activeNode === 'output' ? 'text-[#B8D9CE]' : 'text-[#194B50]/70'}`}>Microvascular Lesions</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center ${
                  activeNode === 'output' ? 'bg-[#194B50] border-[#B8D9CE]/30' : 'bg-white border-[#B8D9CE]/40'
                }`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D5A86B] mx-auto mb-1.5"></div>
                  <div className="font-bold text-xs sm:text-sm">Glaucoma</div>
                  <div className={`text-[10px] mt-0.5 ${activeNode === 'output' ? 'text-[#B8D9CE]' : 'text-[#194B50]/70'}`}>Optic Neuropathy</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center ${
                  activeNode === 'output' ? 'bg-[#194B50] border-[#B8D9CE]/30' : 'bg-white border-[#B8D9CE]/40'
                }`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D5A86B] mx-auto mb-1.5"></div>
                  <div className="font-bold text-xs sm:text-sm">Normal</div>
                  <div className={`text-[10px] mt-0.5 ${activeNode === 'output' ? 'text-[#B8D9CE]' : 'text-[#194B50]/70'}`}>Healthy Fundus</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Detail Inspection Drawer */}
        <div className="p-6 rounded-2xl bg-[#F8F6EF] border border-[#B8D9CE]/50 space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#D5A86B]" />
            <h4 className="font-bold text-sm text-[#102E32]">
              {currentDetail.title}
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-[#194B50] border border-[#B8D9CE]/40 font-semibold">
              {currentDetail.badge}
            </span>
          </div>
          <p className="text-xs text-[#194B50]/90 leading-relaxed font-medium">
            {currentDetail.summary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {currentDetail.points.map((pt, i) => (
              <div key={i} className="p-3 rounded-xl bg-white border border-[#B8D9CE]/40 text-xs text-[#102E32]">
                {pt}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
