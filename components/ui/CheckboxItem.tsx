import React from 'react';
import { CheckSquare } from 'lucide-react';

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  highlighted?: boolean;
}

export const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onChange, description, highlighted }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 relative overflow-hidden
      ${highlighted 
        ? 'bg-emerald-900/30 border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
        : checked 
          ? 'bg-blue-900/20 border-blue-500/50' 
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
      }
    `}
  >
    {/* Highlight Flash Effect */}
    {highlighted && (
       <div className="absolute inset-0 bg-emerald-400/10 animate-pulse pointer-events-none"></div>
    )}

    <div className={`w-5 h-5 flex items-center justify-center rounded border shrink-0 transition-colors
      ${highlighted
         ? 'bg-emerald-500 border-emerald-500 text-white'
         : checked 
            ? 'bg-blue-500 border-blue-500 text-white' 
            : 'border-slate-500 text-transparent'
      }
    `}>
       {checked && <CheckSquare size={14} fill="currentColor" className="text-white" />}
    </div>
    <div>
      <div className={`text-sm font-medium ${highlighted ? 'text-emerald-200' : (checked ? 'text-blue-200' : 'text-slate-300')}`}>{label}</div>
      {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
    </div>
  </div>
);