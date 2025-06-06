
import React from 'react';
import { Calculator, Settings, Download } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { useBudgets } from '../hooks/useBudgets';

interface ModernHeaderProps {
  onSettingsClick: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ onSettingsClick }) => {
  const { currentBudget, exportToPDF } = useBudgets();

  const handleExport = () => {
    if (currentBudget) {
      exportToPDF(currentBudget);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
      <div className="container-modern">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl group-hover:shadow-2xl transition-all duration-200">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 blur-lg group-hover:opacity-30 transition-all duration-200" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-hierarchy-primary gradient-text">
                  Precificação CV
                </h1>
                {currentBudget && (
                  <p className="text-sm text-hierarchy-secondary font-medium">
                    Orçamento: <span className="text-hierarchy-accent">{currentBudget.name}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentBudget && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="modern-button-secondary interactive-element border-border hover:border-primary/30 shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline font-medium">Exportar</span>
              </Button>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSettingsClick}
              className="modern-button-secondary interactive-element border-border hover:border-primary/30 shadow-md hover:shadow-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline font-medium">Configurações</span>
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeader;
