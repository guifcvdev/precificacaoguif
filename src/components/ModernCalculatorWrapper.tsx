
import React from 'react';
import { Card } from './ui/card';

interface ModernCalculatorWrapperProps {
  children: React.ReactNode;
  title?: string;
}

const ModernCalculatorWrapper: React.FC<ModernCalculatorWrapperProps> = ({ 
  children, 
  title 
}) => {
  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-hierarchy-primary bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto shadow-lg" />
          <p className="text-hierarchy-muted text-sm">
            Preencha os campos abaixo para calcular o preço
          </p>
        </div>
      )}
      
      <Card className="modern-card modern-card-dark p-8 relative overflow-hidden">
        {/* Background decorativo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
        
        <div className="relative space-y-8">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default ModernCalculatorWrapper;
