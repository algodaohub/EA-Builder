import React from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { CheckboxItem } from '../ui/CheckboxItem';
import { LucideIcon } from 'lucide-react';

interface ItemConfig<T> {
  key: keyof T;
  label: string;
  description?: string;
}

interface BooleanSectionProps<T> {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  data: T;
  onUpdate: (key: keyof T, value: boolean) => void;
  items: ItemConfig<T>[];
  masterToggle?: { key: keyof T; label: string };
  highlightedKeys?: Set<string>;
}

export function BooleanSection<T>({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  data, 
  onUpdate, 
  items,
  masterToggle,
  highlightedKeys
}: BooleanSectionProps<T>) {
  // Check if master toggle is present and enabled
  const isMasterEnabled = masterToggle ? !!data[masterToggle.key] : true;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <SectionHeader title={title} icon={icon} isOpen={isOpen} onClick={onToggle} />
      {isOpen && (
        <div className="p-5 border-t border-slate-800 bg-slate-900/50">
          {masterToggle && (
             <div className={`flex items-center gap-2 mb-4 p-2 rounded transition-all ${highlightedKeys?.has(String(masterToggle.key)) ? 'bg-emerald-900/20 border border-emerald-500/50' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={!!data[masterToggle.key]} 
                  onChange={(e) => onUpdate(masterToggle.key, e.target.checked)} 
                  className="w-4 h-4" 
                />
                <span className="font-semibold text-slate-300">{masterToggle.label}</span>
                {highlightedKeys?.has(String(masterToggle.key)) && <span className="text-xs text-emerald-400 font-bold ml-2 animate-pulse">NEW!</span>}
             </div>
          )}
          
          {isMasterEnabled && (
             <div className={`grid grid-cols-2 md:grid-cols-3 gap-3 ${masterToggle ? 'animate-fade-in' : ''}`}>
               {items.map((item) => (
                 <CheckboxItem 
                    key={String(item.key)}
                    label={item.label}
                    checked={!!data[item.key]}
                    onChange={(v) => onUpdate(item.key, v)}
                    description={item.description}
                    highlighted={highlightedKeys?.has(String(item.key))}
                 />
               ))}
             </div>
          )}
        </div>
      )}
    </div>
  );
}