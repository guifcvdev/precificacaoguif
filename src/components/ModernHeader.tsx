
import React, { useState } from 'react';
import { Calculator, Settings, Save, Download, Plus, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useBudgets } from '../hooks/useBudgets';

interface ModernHeaderProps {
  onSettingsClick: () => void;
}

const ModernHeader: React.FC<ModernHeaderProps> = ({ onSettingsClick }) => {
  const [budgetName, setBudgetName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { createBudget, currentBudget, exportToPDF } = useBudgets();

  const handleCreateBudget = () => {
    if (budgetName.trim()) {
      createBudget(budgetName.trim());
      setBudgetName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleExport = () => {
    if (currentBudget) {
      exportToPDF(currentBudget);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Precificação CV
                </h1>
                {currentBudget && (
                  <p className="text-sm text-muted-foreground">
                    Orçamento: {currentBudget.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Orçamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Orçamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nome do orçamento"
                    value={budgetName}
                    onChange={(e) => setBudgetName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateBudget()}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateBudget} disabled={!budgetName.trim()}>
                      Criar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {currentBudget && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={onSettingsClick}>
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Configurações</span>
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernHeader;
