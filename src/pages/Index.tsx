
import React, { useState, useEffect } from 'react';
import { Calculator, Settings, FileText } from 'lucide-react';
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
    { id: 'adesivo', label: 'Adesivo', icon: FileText },
    { id: 'lona', label: 'Lona', icon: FileText },
    { id: 'placa-ps', label: 'Placa em PS', icon: FileText },
    { id: 'placa-acm', label: 'Placa em ACM', icon: FileText },
    { id: 'fachada', label: 'Fachada Simples', icon: FileText },
    { id: 'letra-caixa', label: 'Letra Caixa em PVC', icon: FileText },
    { id: 'vidro', label: 'Vidro Temperado', icon: FileText },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Precificação CV</h1>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {renderCalculator()}
        </div>
      </div>
    </div>
  );
};

export default Index;
