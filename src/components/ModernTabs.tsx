
import React from 'react';
import { FileText, Package, Square, Layers, Building, Type, Shield } from 'lucide-react';

interface ModernTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ModernTabs: React.FC<ModernTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'adesivo', label: 'Adesivo', icon: FileText, color: 'from-red-400 to-pink-400' },
    { id: 'lona', label: 'Lona', icon: Package, color: 'from-blue-400 to-cyan-400' },
    { id: 'placa-ps', label: 'Placa em PS', icon: Square, color: 'from-green-400 to-emerald-400' },
    { id: 'placa-acm', label: 'Placa em ACM', icon: Layers, color: 'from-purple-400 to-violet-400' },
    { id: 'fachada', label: 'Fachada Simples', icon: Building, color: 'from-orange-400 to-red-400' },
    { id: 'letra-caixa', label: 'Letra Caixa em PVC', icon: Type, color: 'from-teal-400 to-cyan-400' },
    { id: 'vidro', label: 'Vidro Temperado', icon: Shield, color: 'from-indigo-400 to-purple-400' },
  ];

  return (
    <div className="bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto py-3 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex items-center space-x-3 px-5 py-3 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-white shadow-lg transform scale-105 bg-slate-700 dark:bg-slate-700/80'
                    : 'text-hierarchy-secondary hover:text-hierarchy-primary hover:bg-accent/50 hover:scale-102'
                }`}
              >
                {isActive && (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-20 rounded-xl transition-all duration-300`} />
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full shadow-lg" />
                  </>
                )}
                
                <div className="relative z-10 flex items-center space-x-3">
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 shadow-lg' 
                      : 'group-hover:bg-accent/30'
                  }`}>
                    <Icon className={`w-4 h-4 transition-all duration-300 ${
                      isActive 
                        ? 'scale-110 text-white' 
                        : 'group-hover:scale-105 text-hierarchy-secondary group-hover:text-hierarchy-primary'
                    }`} />
                  </div>
                  <span className={`hidden sm:inline transition-all duration-300 ${
                    isActive 
                      ? 'font-semibold text-white' 
                      : 'group-hover:font-medium'
                  }`}>
                    {tab.label}
                  </span>
                </div>
                
                {/* Hover indicator */}
                <div className={`absolute inset-0 rounded-xl border-2 transition-all duration-300 ${
                  isActive 
                    ? 'border-transparent' 
                    : 'border-transparent group-hover:border-blue-400/30'
                }`} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernTabs;
