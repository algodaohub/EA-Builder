import React from 'react';
import { IndicatorConfig, IndicatorType } from '../types';
import { Trash2 } from 'lucide-react';

interface Props {
  indicator: IndicatorConfig;
  onChange: (id: string, updated: IndicatorConfig) => void;
  onRemove: (id: string) => void;
}

export const IndicatorCard: React.FC<Props> = ({ indicator, onChange, onRemove }) => {
  
  // Ensure params object exists to prevent crashes
  const safeParams = indicator.params || {};

  const handleParamChange = (key: string, value: string | number) => {
    // Create a new object reference to ensure React detects state change
    const updatedIndicator = {
      ...indicator,
      params: { ...safeParams, [key]: value }
    };
    onChange(indicator.id, updatedIndicator);
  };

  const renderParams = () => {
    switch (indicator.type) {
      case IndicatorType.MOVING_AVERAGE:
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400">Period</label>
              <input type="number" value={safeParams.period || 14} onChange={(e) => handleParamChange('period', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Method</label>
              <select value={safeParams.method || 'SMA'} onChange={(e) => handleParamChange('method', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm">
                <option value="SMA">Simple</option>
                <option value="EMA">Exponential</option>
                <option value="SMMA">Smoothed</option>
                <option value="LWMA">Linear Weighted</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Apply To</label>
              <select value={safeParams.applyTo || 'PRICE_CLOSE'} onChange={(e) => handleParamChange('applyTo', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm">
                <option value="PRICE_CLOSE">Close</option>
                <option value="PRICE_OPEN">Open</option>
                <option value="PRICE_HIGH">High</option>
                <option value="PRICE_LOW">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Shift</label>
              <input type="number" value={safeParams.shift || 0} onChange={(e) => handleParamChange('shift', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
          </div>
        );
      case IndicatorType.RSI:
      case IndicatorType.CCI:
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400">Period</label>
              <input type="number" value={safeParams.period || 14} onChange={(e) => handleParamChange('period', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Apply To</label>
              <select value={safeParams.applyTo || 'PRICE_CLOSE'} onChange={(e) => handleParamChange('applyTo', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm">
                <option value="PRICE_CLOSE">Close</option>
                <option value="PRICE_OPEN">Open</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400">Level Up (Sell)</label>
              <input type="number" value={safeParams.levelUp || 70} onChange={(e) => handleParamChange('levelUp', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Level Down (Buy)</label>
              <input type="number" value={safeParams.levelDown || 30} onChange={(e) => handleParamChange('levelDown', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
          </div>
        );
      case IndicatorType.BOLLINGER_BANDS:
         return (
          <div className="grid grid-cols-2 gap-2">
             <div>
              <label className="text-xs text-slate-400">Period</label>
              <input type="number" value={safeParams.period || 20} onChange={(e) => handleParamChange('period', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Deviation</label>
              <input type="number" value={safeParams.deviation || 2.0} onChange={(e) => handleParamChange('deviation', parseFloat(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Shift</label>
              <input type="number" value={safeParams.shift || 0} onChange={(e) => handleParamChange('shift', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
          </div>
         );
      case IndicatorType.MACD:
        return (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400">Fast EMA</label>
              <input type="number" value={safeParams.fastEma || 12} onChange={(e) => handleParamChange('fastEma', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Slow EMA</label>
              <input type="number" value={safeParams.slowEma || 26} onChange={(e) => handleParamChange('slowEma', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Signal SMA</label>
              <input type="number" value={safeParams.signalSma || 9} onChange={(e) => handleParamChange('signalSma', parseInt(e.target.value) || 0)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm" />
            </div>
            <div>
               <label className="text-xs text-slate-400">Apply To</label>
               <select value={safeParams.applyTo || 'PRICE_CLOSE'} onChange={(e) => handleParamChange('applyTo', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-sm">
                <option value="PRICE_CLOSE">Close</option>
                <option value="PRICE_OPEN">Open</option>
              </select>
            </div>
          </div>
        );
      default:
        return <p className="text-xs text-slate-500 italic">Cấu hình mặc định</p>;
    }
  };

  return (
    <div className="bg-slate-750 border border-slate-700 rounded-lg p-3 mb-3 hover:border-blue-500/50 transition-colors animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-blue-400 text-sm flex items-center gap-2">
          {indicator.type}
          <span className="text-xs text-slate-500 font-normal bg-slate-800 px-2 py-0.5 rounded">ID: {indicator.id.slice(-4)}</span>
        </h4>
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Stop event bubbling
            onRemove(indicator.id);
          }} 
          className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-800"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="space-y-2">
        {renderParams()}
        <div>
          <label className="text-xs text-slate-400">Logic tín hiệu / Điều kiện</label>
          <input 
            type="text" 
            placeholder="Ví dụ: Giá > MA hoặc RSI < 30"
            value={indicator.condition}
            onChange={(e) => onChange(indicator.id, { ...indicator, condition: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-sm text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};