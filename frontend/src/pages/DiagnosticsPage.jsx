import React, { useState, useRef } from 'react';
import {
  Upload,
  Eye,
  Crosshair,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  Zap,
  RotateCcw,
  Shield,
  Layers,
} from 'lucide-react';
import api from '../api/client';
import ScanVisualizer from '../components/ScanVisualizer';
import PredictionCard from '../components/PredictionCard';

export default function DiagnosticsPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Handle uploaded local file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid retinal image file (JPEG or PNG).');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
    setPredictionResult(null);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setErrorMessage('Please upload a JPEG or PNG image.');
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
    setPredictionResult(null);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Run prediction on currently selected file
  const handleRunInference = async () => {
    if (!selectedFile) return;

    try {
      setIsScanning(true);
      setErrorMessage(null);
      const result = await api.predict(selectedFile);
      setPredictionResult(result);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.detail ||
          'Inference execution failed. Ensure the backend server is reachable.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setPredictionResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-10 py-8">
      
      {/* Hero Workspace Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#102E32] via-[#194B50] to-[#102E32] text-[#F8F6EF] p-8 lg:p-12 shadow-2xl border border-[#B8D9CE]/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-[#D5A86B]/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#194B50]/80 border border-[#B8D9CE]/30 text-xs text-[#D5A86B] font-mono">
            <Zap className="w-3.5 h-3.5" />
            <span>EfficientNetB1 + InceptionV3 + ACAF Deep Learning System</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-[#F8F6EF] leading-tight">
            AI-Powered Multi-Class <br />
            <span className="text-[#D5A86B]">Retinal Disease Classification</span>
          </h1>
          <p className="text-base sm:text-lg text-[#B8D9CE]/90 leading-relaxed max-w-2xl">
            Upload retinal fundus photography to classify Cataract, Diabetic Retinopathy, and Glaucoma using an AI-powered deep learning model.
          </p>
        </div>
      </section>

      {/* Main Diagnostic Workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload / Image Scanning Area */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-[#B8D9CE]/50 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#102E32] flex items-center space-x-2">
                <Upload className="w-4 h-4 text-[#194B50]" />
                <span>Upload Fundus Photography</span>
              </h3>
              {imagePreview && (
                <button
                  onClick={handleReset}
                  className="text-xs text-[#194B50] hover:text-red-600 flex items-center space-x-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Drop Zone */}
            {!imagePreview ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#B8D9CE] hover:border-[#194B50] bg-[#F8F6EF]/60 hover:bg-[#F8F6EF] rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group space-y-3"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-[#194B50]/10 group-hover:bg-[#194B50]/20 flex items-center justify-center text-[#194B50] transition-colors">
                  <Eye className="w-7 h-7 text-[#194B50] group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#102E32]">
                    Drag & drop retinal image here
                  </p>
                  <p className="text-xs text-[#194B50]/70 mt-1">
                    or click to browse from local computer
                  </p>
                </div>
                <div className="inline-block px-3 py-1 rounded-md bg-white border border-[#B8D9CE]/40 text-[11px] font-mono text-[#194B50]/80">
                  JPEG, JPG, PNG up to 15 MB
                </div>
              </div>
            ) : (
              <ScanVisualizer
                imagePreview={imagePreview}
                isScanning={isScanning}
                onClear={handleReset}
              />
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/jpg"
              className="hidden"
            />

            {/* Run Analysis Action Button */}
            {imagePreview && !predictionResult && (
              <button
                onClick={handleRunInference}
                disabled={isScanning}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#102E32] to-[#194B50] hover:from-[#194B50] hover:to-[#102E32] text-[#F8F6EF] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 tracking-normal"
                style={{ fontVariantLigatures: 'none' }}
              >
                {isScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#D5A86B] border-t-transparent rounded-full animate-spin"></div>
                    <span>Executing ACAF Gated Inference...</span>
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4 text-[#D5A86B]" />
                    <span>Run Disease Classification</span>
                  </>
                )}
              </button>
            )}

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Prediction Results & Explanation */}
        <div className="lg:col-span-7">
          {predictionResult ? (
            <PredictionCard
              result={predictionResult}
              onReset={handleReset}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-[#B8D9CE]/40 p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F8F6EF] border border-[#B8D9CE]/40 flex items-center justify-center text-[#194B50]">
                <Layers className="w-8 h-8 text-[#194B50]/60" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-[#102E32]">
                  Awaiting Fundus Photography Scan
                </h3>
                <p className="text-xs sm:text-sm text-[#194B50]/70 leading-relaxed">
                  Upload a retinal fundus photograph to begin AI-powered classification and view the model's four-class probability distribution.
                </p>
              </div>

              {/* Workflow Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left max-w-xl mx-auto">
                <div className="p-3 rounded-xl bg-[#F8F6EF] border border-[#B8D9CE]/30">
                  <div className="text-[11px] font-mono text-[#D5A86B] font-bold">STEP 01</div>
                  <div className="font-semibold text-xs text-[#102E32] mt-0.5">Input Image</div>
                  <div className="text-[11px] text-[#194B50]/70 mt-1">224×224 RGB raw tensor scale</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F6EF] border border-[#B8D9CE]/30">
                  <div className="text-[11px] font-mono text-[#D5A86B] font-bold">STEP 02</div>
                  <div className="font-semibold text-xs text-[#102E32] mt-0.5">ACAF Fusion</div>
                  <div className="text-[11px] text-[#194B50]/70 mt-1">Dual-backbone adaptive gating</div>
                </div>
                <div className="p-3 rounded-xl bg-[#F8F6EF] border border-[#B8D9CE]/30">
                  <div className="text-[11px] font-mono text-[#D5A86B] font-bold">STEP 03</div>
                  <div className="font-semibold text-xs text-[#102E32] mt-0.5">Softmax Result</div>
                  <div className="text-[11px] text-[#194B50]/70 mt-1">4-class probability distribution</div>
                </div>
              </div>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
