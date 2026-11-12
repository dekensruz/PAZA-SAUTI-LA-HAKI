import React from 'react';
import { brand } from '@/lib/media';

/** Logo dans le style de la barre de navigation d'origine (utilisé dans l'administration). */
export const Logo: React.FC<{ light?: boolean; compact?: boolean }> = ({ light, compact }) => (
  <span className="flex items-center gap-3">
    <span className="bg-white rounded-full p-1 w-11 h-11 flex items-center justify-center shadow-sm border border-gray-100 overflow-hidden shrink-0">
      <img src={brand.logo} alt="Paza Sauti La Haki Logo" className="w-full h-full object-contain" />
    </span>
    {!compact && (
      <span className="flex flex-col">
        <span className={`font-heading font-bold text-lg tracking-tight leading-none ${light ? 'text-white' : 'text-paza-dark dark:text-white'}`}>PAZA SAUTI</span>
        <span className="font-heading font-bold text-paza-red text-base tracking-tight leading-none">LA HAKI</span>
      </span>
    )}
  </span>
);
