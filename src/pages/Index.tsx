
import React, { useState, useEffect } from 'react';
import { Calculator, Settings, FileText, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import AdesivoCalculator from '../components/calculators/AdesivoCalculator';
import LonaCalculator from '../components/calculators/LonaCalculator';
import PlacaPSCalculator from '../components/calculators/PlacaPSCalculator';
import PlacaACMCalculator from '../components/calculators/PlacaACMCalculator';
import FachadaCalculator from '../components/calculators/FachadaCalculator';
import LetraCaixaCalculator from '../components/calculators/LetraCaixaCalculator';
import VidroCalculator from '../components/calculators/VidroCalculator';
import SettingsPanel from '../components/SettingsPanel';
import { PricingConfig, defaultConfig } from '../types/pricing';

const Index = () => {
  const [activeTab, setActiveTab] = useState('adesivo');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<PricingConfig>(defaultConfig);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const savedConfig = localStorage.getItem('pricingConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveConfig = (newConfig: PricingConfig) => {
    setConfig(newConfig);
    localStorage.setItem('pricingConfig', JSON.stringify(newConfig));
  };

  const tabs = [
    { id: 'adesivo', label: 'Adesivo', icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'lona', label: 'Lona', icon: FileText, gradient: 'from-green-500 to-emerald-500' },
    { id: 'placa-ps', label: 'Placa em PS', icon: FileText, gradient: 'from-purple-500 to-pink-500' },
    { id: 'placa-acm', label: 'Placa em ACM', icon: FileText, gradient: 'from-orange-500 to-red-500' },
    { id: 'fachada', label: 'Fachada Simples', icon: FileText, gradient: 'from-indigo-500 to-purple-500' },
    { id: 'letra-caixa', label: 'Letra Caixa em PVC', icon: FileText, gradient: 'from-teal-500 to-green-500' },
    { id: 'vidro', label: 'Vidro Temperado', icon: FileText, gradient: 'from-gray-500 to-slate-500' },
  ];

  const renderCalculator = () => {
    switch (activeTab) {
      case 'adesivo':
        return <AdesivoCalculator config={config.adesivo} />;
      case 'lona':
        return <LonaCalculator config={config.lona} />;
      case 'placa-ps':
        return <PlacaPSCalculator config={config.placaPS} />;
      case 'placa-acm':
        return <PlacaACMCalculator config={config.placaACM} />;
      case 'fachada':
        return <FachadaCalculator config={config.fachada} />;
      case 'letra-caixa':
        return <LetraCaixaCalculator config={config.letraCaixa} />;
      case 'vidro':
        return <VidroCalculator config={config.vidro} />;
      default:
        return <AdesivoCalculator config={config.adesivo} />;
    }
  };

  if (showSettings) {
    return (
      <SettingsPanel 
        config={config} 
        onSave={saveConfig}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-bg theme-transition">
      {/* Header */}
      <div className="header-gradient theme-transition border-b border-border shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 animate-fade-in">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Precificação CV
                </h1>
                <p className="text-sm text-muted-foreground">Sistema de cálculo de preços modernizado</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 animate-fade-in">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-all duration-200 border border-border shadow-sm hover:shadow-md"
                title={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-foreground" />
                )}
              </button>
              
              <button
                onClick={() => setShowSettings(true)}
                className="modern-button-primary flex items-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Configurações</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border theme-transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-300 relative group ${
                    isActive
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-br ${tab.gradient} text-white shadow-md` 
                      : 'bg-muted group-hover:bg-muted/80'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="modern-card overflow-hidden animate-scale-in">
          {renderCalculator()}
        </div>
      </div>
    </div>
  );
};

export default Index;
