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
import { configService } from '../services/configService';

const Index = () => {
  const [activeTab, setActiveTab] = useState('adesivo');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<PricingConfig>(defaultConfig);

  useEffect(() => {
    loadConfigFromSupabase();
  }, []);

  const loadConfigFromSupabase = async () => {
    try {
      console.log('🏠 [Index] Iniciando loadConfigFromSupabase...');
      
      // Tentar carregar do Supabase primeiro
      const supabaseConfig = await configService.loadConfig();
      console.log('🏠 [Index] Config carregado do Supabase:', supabaseConfig);
      
      if (supabaseConfig) {
        console.log('🏠 [Index] Aplicando config do Supabase...');
        setConfig(supabaseConfig);
        // Sincronizar com localStorage para manter compatibilidade
        localStorage.setItem('pricingConfig', JSON.stringify(supabaseConfig));
      } else {
        console.log('🏠 [Index] Não encontrou config no Supabase, tentando localStorage...');
        // Fallback: carregar do localStorage se não existir no Supabase
        const savedConfig = localStorage.getItem('pricingConfig');
        if (savedConfig) {
          console.log('🏠 [Index] Config encontrado no localStorage, migrando para Supabase...');
          const localConfig = JSON.parse(savedConfig);
          setConfig(localConfig);
          // Migrar dados do localStorage para o Supabase
          await configService.saveConfig(localConfig);
        } else {
          console.log('🏠 [Index] Nenhum config encontrado, usando padrão...');
          // Se não existir em nenhum lugar, usar configuração padrão
          setConfig(defaultConfig);
        }
      }
    } catch (error) {
      console.error('❌ [Index] Erro ao carregar configurações:', error);
      // Em caso de erro, usar localStorage como fallback
      const savedConfig = localStorage.getItem('pricingConfig');
      if (savedConfig) {
        console.log('🏠 [Index] Usando fallback do localStorage...');
        setConfig(JSON.parse(savedConfig));
      }
    }
  };

  const saveConfig = async (newConfig: PricingConfig) => {
    try {
      console.log('💾 [Index] Iniciando saveConfig...', { newConfig });
      
      // Salvar no Supabase como fonte primária
      const result = await configService.saveConfig(newConfig);
      console.log('💾 [Index] Resultado do save no Supabase:', result);
      
      if (result.success) {
        console.log('💾 [Index] Save no Supabase bem-sucedido, atualizando estado...');
        setConfig(newConfig);
        // Manter sincronização com localStorage
        localStorage.setItem('pricingConfig', JSON.stringify(newConfig));
      } else {
        console.error('❌ [Index] Erro ao salvar no Supabase:', result.error);
        // Em caso de erro, salvar apenas no localStorage
        setConfig(newConfig);
        localStorage.setItem('pricingConfig', JSON.stringify(newConfig));
      }
    } catch (error) {
      console.error('❌ [Index] Exceção ao salvar configurações:', error);
      // Em caso de erro, salvar apenas no localStorage
      setConfig(newConfig);
      localStorage.setItem('pricingConfig', JSON.stringify(newConfig));
    }
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
    switch (activeTab) {
      case 'adesivo':
        return <AdesivoCalculator config={config.adesivo} fullConfig={config} />;
      case 'lona':
        return <LonaCalculator config={config.lona} fullConfig={config} />;
      case 'placa-ps':
        return <PlacaPSCalculator config={config.placaPS} fullConfig={config} />;
      case 'placa-acm':
        return <PlacaACMCalculator config={config.placaACM} fullConfig={config} />;
      case 'fachada':
        return <FachadaCalculator config={config.fachada} fullConfig={config} />;
      case 'letra-caixa':
        return <LetraCaixaCalculator config={config.letraCaixa} fullConfig={config} />;
      case 'vidro':
        return <VidroCalculator config={config.vidro} fullConfig={config} />;
      case 'luminoso':
        return <LuminosoCalculator config={config.luminoso} fullConfig={config} />;
      default:
        return <AdesivoCalculator config={config.adesivo} fullConfig={config} />;
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
