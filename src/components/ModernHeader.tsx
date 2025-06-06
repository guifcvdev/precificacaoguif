
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
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 blur-lg" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-hierarchy-primary bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Precificação CV
                </h1>
                {currentBudget && (
                  <p className="text-sm text-hierarchy-muted font-medium">
                    Orçamento: <span className="text-hierarchy-secondary">{currentBudget.name}</span>
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
                className="border-border/60 bg-background/50 hover:bg-accent/80 hover:border-border shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline font-medium">Exportar</span>
              </Button>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onSettingsClick}
              className="border-border/60 bg-background/50 hover:bg-accent/80 hover:border-border shadow-md hover:shadow-lg transition-all duration-300"
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
