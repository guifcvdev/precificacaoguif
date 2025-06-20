
import React, { useState, useEffect } from 'react';
import AdesivoCalculator from '../components/calculators/AdesivoCalculator';
import LonaCalculator from '../components/calculators/LonaCalculator';
import PlacaPSCalculator from '../components/calculators/PlacaPSCalculator';
import PlacaACMCalculator from '../components/calculators/PlacaACMCalculator';
import FachadaCalculator from '../components/calculators/FachadaCalculator';
import LetraCaixaCalculator from '../components/calculators/LetraCaixaCalculator';
import VidroCalculator from '../components/calculators/VidroCalculator';
import LuminosoCalculator from '../components/calculators/LuminosoCalculator';
import SettingsPanel from '../components/SettingsPanel';
import ModernHeader from '../components/ModernHeader';
import ModernTabs from '../components/ModernTabs';
import ModernCalculatorWrapper from '../components/ModernCalculatorWrapper';
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

  const getTabTitle = () => {
    const titles: Record<string, string> = {
      'adesivo': 'Calculadora de Adesivo',
      'lona': 'Calculadora de Lona',
      'placa-ps': 'Calculadora de Placa em PS',
      'placa-acm': 'Calculadora de Placa em ACM',
      'fachada': 'Calculadora de Fachada Simples',
      'letra-caixa': 'Calculadora de Letra Caixa em PVC',
      'vidro': 'Calculadora de Vidro Temperado',
      'luminoso': 'Calculadora de Luminoso',
    };
    return titles[activeTab];
  };

  const renderCalculator = () => {
    const calculatorProps = {
      config: config[activeTab as keyof PricingConfig] as any
    };

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
      case 'luminoso':
        return <LuminosoCalculator config={config.luminoso} />;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <ModernHeader onSettingsClick={() => setShowSettings(true)} />

      {/* Tab Navigation */}
      <ModernTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Calculator Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModernCalculatorWrapper title={getTabTitle()}>
          {renderCalculator()}
        </ModernCalculatorWrapper>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
};

export default Index;
