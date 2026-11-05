import React from 'react';
import { Eye, Crosshair, Sparkles } from 'lucide-react';

export default function ScanVisualizer({ imagePreview, isScanning, onClear }) {
  if (!imagePreview) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0A1A1C] border border-[#B8D9CE]/40 shadow-inner group">
      
      {/* Reticle Top Info Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-gradient-to-b from-[#102E32]/90 to-transparent flex items-center justify-between text-[11px] font-mono text-[#B8D9CE]">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-3.5 h-3.5 text-[#D5A86B]" />
          <span>ROI: 224x224 RGB FUNDUS</span>
        </div>
        {isScanning ? (
          <span className="text-[#D5A86B] animate-pulse font-bold">ACAF FUSION EXTRACTING...</span>
        ) : (
          <span className="text-[#B8D9CE]/70">SCAN READY</span>
        )}
      </div>

      {/* Main Image Container */}
      <div className="relative flex items-center justify-center p-4 min-h-[300px] max-h-[380px]">
        <img
          src={imagePreview}
          alt="Retinal Fundus"
          className="max-h-[320px] max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Circular Reticle Target */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border border-[#B8D9CE]/30 border-dashed animate-spin" style={{ animationDuration: '40s' }}></div>
          <div className="absolute w-44 h-44 rounded-full border border-[#D5A86B]/25"></div>
          {/* Crosshairs */}
          <div className="absolute w-60 h-[1px] bg-[#B8D9CE]/15"></div>
          <div className="absolute h-60 w-[1px] bg-[#B8D9CE]/15"></div>
        </div>

        {/* Dynamic Scanning Animation Overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {/* Moving Laser Beam */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#D5A86B] to-transparent shadow-[0_0_15px_#D5A86B] animate-scan"></div>
            {/* Shimmer Grid Overlay */}
            <div className="absolute inset-0 bg-[#194B50]/20 backdrop-blur-[1px]"></div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="px-4 py-2.5 bg-[#102E32]/95 border-t border-[#194B50] flex items-center justify-between text-xs text-[#B8D9CE]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#D5A86B]"></span>
          <span className="font-medium text-[#F8F6EF]">Dual-Backbone Input Preprocessed</span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            disabled={isScanning}
            className="text-[11px] text-[#B8D9CE] hover:text-[#D5A86B] underline font-medium disabled:opacity-50"
          >
            Change Image
          </button>
        )}
      </div>
    </div>
  );
}
