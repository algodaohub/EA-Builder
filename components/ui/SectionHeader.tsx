import React from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onClick: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon, isOpen, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors border-b border-slate-700/50 text-left">
    <div className="flex items-center gap-3">
      <Icon className="text-blue-400" size={20} />
      <span className="font-semibold text-slate-200">{title}</span>
    </div>
    {isOpen ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
  </button>
);