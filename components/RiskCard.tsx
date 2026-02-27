import React from 'react';
import { RiskManagement } from '../types';

interface Props {
  risk: RiskManagement;
  onChange: (risk: RiskManagement) => void;
}

export const RiskCard: React.FC<Props> = ({ risk, onChange }) => {
  const handleChange = (key: keyof RiskManagement, value: any) => {
    onChange({ ...risk, [key]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1">Khối lượng lệnh (Lot Size)</label>
        <select 
          value={risk.lotType} 
          onChange={(e) => handleChange('lotType', e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white mb-2"
        >
          <option value="Fixed">Lot cố định (Fixed)</option>
          <option value="Risk % of Balance">% Rủi ro trên vốn</option>
        </select>
        <input 
          type="number" 
          value={risk.lotSize}
          onChange={(e) => handleChange('lotSize', parseFloat(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white"
          step="0.01"
        />
        <span className="text-xs text-slate-500 mt-1 block">
          {risk.lotType === 'Fixed' ? 'Ví dụ: 0.01, 0.1, 1.0' : 'Ví dụ: 1.0 = 1% tài khoản'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
           <div className="flex-1">
             <label className="block text-xs font-medium text-slate-400 mb-1">Cắt lỗ (Points)</label>
             <input type="number" value={risk.stopLoss} onChange={(e) => handleChange('stopLoss', parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" />
           </div>
           <div className="flex-1">
             <label className="block text-xs font-medium text-slate-400 mb-1">Chốt lời (Points)</label>
             <input type="number" value={risk.takeProfit} onChange={(e) => handleChange('takeProfit', parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white" />
           </div>
        </div>
      </div>

      <div className="md:col-span-2 border-t border-slate-700 pt-3 mt-1">
        <div className="flex items-center gap-2 mb-2">
          <input 
            type="checkbox" 
            id="trailing" 
            checked={risk.trailingStop} 
            onChange={(e) => handleChange('trailingStop', e.target.checked)}
            className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="trailing" className="text-sm font-medium text-slate-300">Bật Trailing Stop</label>
        </div>
        
        {risk.trailingStop && (
           <div className="flex gap-4 pl-6 animate-fade-in">
             <div className="flex-1">
               <label className="block text-xs text-slate-500">Khoảng cách (Distance)</label>
               <input type="number" value={risk.trailingStopDistance} onChange={(e) => handleChange('trailingStopDistance', parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
             </div>
             <div className="flex-1">
               <label className="block text-xs text-slate-500">Bước nhảy (Step)</label>
               <input type="number" value={risk.trailingStopStep} onChange={(e) => handleChange('trailingStopStep', parseInt(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
             </div>
           </div>
        )}
      </div>
    </div>
  );
};
