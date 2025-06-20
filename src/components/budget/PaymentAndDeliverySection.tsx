
import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { formatCurrency, PricingConfig } from '../../types/pricing';

interface PaymentAndDeliverySectionProps {
  cartaoCredito: string;
  setCartaoCredito: (value: string) => void;
  prazoEntrega: string;
  setPrazoEntrega: (value: string) => void;
  config: PricingConfig;
  baseTotal: number;
}

const PaymentAndDeliverySection: React.FC<PaymentAndDeliverySectionProps> = ({
  cartaoCredito,
  setCartaoCredito,
  prazoEntrega,
  setPrazoEntrega,
  config,
  baseTotal
}) => {
  const cartaoOptions = [
    { value: '3x', label: '3x', taxa: config.cartaoCredito.taxa3x },
    { value: '6x', label: '6x', taxa: config.cartaoCredito.taxa6x },
    { value: '12x', label: '12x', taxa: config.cartaoCredito.taxa12x },
  ];

  const prazoOptions = [
    { value: '3', label: '3 dias úteis' },
    { value: '7', label: '7 dias úteis' },
    { value: '15', label: '15 dias úteis' },
    { value: '30', label: '30 dias úteis' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cartão de Crédito */}
      <div className="space-y-3">
        <Label className="form-label">
          Custos Cartão de Crédito:
        </Label>
        <RadioGroup value={cartaoCredito} onValueChange={setCartaoCredito} className="ml-4">
          {cartaoOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option.value} 
                id={`cartao-${option.value}`}
                className="checkbox-enhanced"
              />
              <Label htmlFor={`cartao-${option.value}`} className="text-body text-sm">
                {option.label} (+{option.taxa}%)
              </Label>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="" 
              id="cartao-none"
              className="checkbox-enhanced"
            />
            <Label htmlFor="cartao-none" className="text-body text-sm">
              Não aplicar
            </Label>
          </div>
        </RadioGroup>
        {cartaoCredito && (
          <div className="flex justify-between text-sm text-primary ml-6">
            <span>Taxa Cartão {cartaoCredito}:</span>
            <span className="currency-value">+{formatCurrency((baseTotal * (cartaoOptions.find(o => o.value === cartaoCredito)?.taxa || 0)) / 100)}</span>
          </div>
        )}
      </div>

      {/* Prazo de Entrega */}
      <div className="space-y-3">
        <Label className="form-label">
          Prazo de Entrega:
        </Label>
        <RadioGroup value={prazoEntrega} onValueChange={setPrazoEntrega} className="ml-4">
          {prazoOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option.value} 
                id={`prazo-${option.value}`}
                className="checkbox-enhanced"
              />
              <Label htmlFor={`prazo-${option.value}`} className="text-body text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default PaymentAndDeliverySection;
