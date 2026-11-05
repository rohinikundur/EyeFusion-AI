import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Eye, Cpu, BookOpen, Info, ShieldCheck, Menu, X } from 'lucide-react';
import api from '../api/client';

export default function Navbar() {
  const [isHealthy, setIsHealthy] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkServerHealth = async () => {
      try {
        const res = await api.getHealth();
        if (isMounted) setIsHealthy(res.status === 'healthy' && res.model_loaded);
      } catch {
        if (isMounted) setIsHealthy(false);
      }
    };
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { to: '/', label: 'Diagnostics', icon: Eye },
    { to: '/architecture', label: 'ACAF Architecture', icon: Cpu },
    { to: '/encyclopedia', label: 'Pathology Guide', icon: BookOpen },
    { to: '/about', label: 'Metrics & Research', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#102E32]/95 backdrop-blur-md border-b border-[#194B50]/60 text-[#F8F6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <NavLink to="/" className="flex items-center space-x-3.5 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#194B50] to-[#102E32] border border-[#B8D9CE]/30 p-2 flex items-center justify-center shadow-lg group-hover:border-[#D5A86B] transition-all">
              <div className="w-full h-full rounded-full border-2 border-[#D5A86B] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#B8D9CE] group-hover:scale-125 transition-transform"></div>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-xl tracking-tight text-[#F8F6EF]">
                  EyeFusion<span className="text-[#D5A86B] font-extrabold">-AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-[#194B50] text-[#B8D9CE] rounded-full border border-[#B8D9CE]/20">
                  Dual-Backbone
                </span>
              </div>
              <p className="text-[11px] text-[#B8D9CE]/70 tracking-wide font-medium">
                Retinal Disease Classification & Clinical Intelligence
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#194B50] text-[#F8F6EF] shadow-sm border border-[#B8D9CE]/30 font-semibold'
                      : 'text-[#B8D9CE]/80 hover:text-[#F8F6EF] hover:bg-[#194B50]/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#D5A86B]" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Server Engine Status Badge */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#194B50]/70 border border-[#B8D9CE]/20 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                {isHealthy === true ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8D9CE] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B8D9CE]"></span>
                  </>
                ) : isHealthy === false ? (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400"></span>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400 animate-pulse"></span>
                )}
              </span>
              <span className="text-[#F8F6EF]/90 font-medium font-mono text-[11px]">
                {isHealthy === true
                  ? 'ACAF Engine Ready'
                  : isHealthy === false
                  ? 'API Offline'
                  : 'Connecting...'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#B8D9CE] hover:text-[#F8F6EF] hover:bg-[#194B50]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#102E32] border-b border-[#194B50] px-4 pt-2 pb-5 space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-[#194B50] text-[#F8F6EF]'
                    : 'text-[#B8D9CE] hover:bg-[#194B50]/40'
                }`
              }
            >
              <Icon className="w-5 h-5 text-[#D5A86B]" />
              <span>{label}</span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-[#194B50]/70 flex items-center justify-between text-xs text-[#B8D9CE]">
            <span>Model Server:</span>
            <span className="font-semibold text-[#D5A86B]">
              {isHealthy ? 'FastAPI 2.21 + Keras 3' : 'Connecting...'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
