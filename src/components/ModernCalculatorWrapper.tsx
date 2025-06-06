
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
    <div className="space-y-8">
      {title && (
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-hierarchy-primary gradient-text">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto shadow-lg animate-glow" />
          <p className="text-hierarchy-secondary text-base max-w-md mx-auto leading-relaxed">
            Preencha os campos abaixo para calcular o preço com precisão
          </p>
        </div>
      )}
      
      <Card className="modern-card modern-card-hover relative overflow-hidden">
        {/* Background pattern sutil */}
        <div className="absolute inset-0 bg-pattern-dots opacity-20 pointer-events-none" />
        
        {/* Gradient overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative card-content">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default ModernCalculatorWrapper;
