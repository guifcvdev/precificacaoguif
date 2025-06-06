
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
    <div className="bg-background/95 backdrop-blur-xl border-b border-border shadow-lg sticky top-16 z-40">
      <div className="container-modern">
        <div className="flex space-x-1 overflow-x-auto py-4 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`tab-modern ${isActive ? 'active' : ''} group min-w-fit`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/20 shadow-lg' 
                    : 'group-hover:bg-accent/10'
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-200 ${
                    isActive 
                      ? 'text-primary scale-110' 
                      : 'text-hierarchy-secondary group-hover:text-accent group-hover:scale-105'
                  }`} />
                </div>
                <span className={`hidden sm:inline transition-all duration-200 ${
                  isActive 
                    ? 'font-semibold text-primary' 
                    : 'text-hierarchy-secondary group-hover:text-accent-foreground group-hover:font-medium'
                }`}>
                  {tab.label}
                </span>
                
                {/* Glow effect para tab ativa */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl border border-primary/30 shadow-lg shadow-primary/20 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModernTabs;
