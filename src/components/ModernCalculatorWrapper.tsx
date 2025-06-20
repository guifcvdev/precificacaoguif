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
  return <div className="space-y-6">
      {title && <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-slate-900">
            {title}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto" />
        </div>}
      
      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="space-y-6">
          {children}
        </div>
      </Card>
    </div>;
};
export default ModernCalculatorWrapper;