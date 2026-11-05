import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DiagnosticsPage from './pages/DiagnosticsPage';
import ArchitecturePage from './pages/ArchitecturePage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F8F6EF] text-[#102E32]">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<DiagnosticsPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/encyclopedia" element={<EncyclopediaPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
