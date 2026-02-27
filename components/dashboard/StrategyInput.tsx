import React from 'react';
import { BrainCircuit, RefreshCw, Zap, Trash2 } from 'lucide-react';

interface StrategyInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  reasoning?: string;
}

export const StrategyInput: React.FC<StrategyInputProps> = ({ value, onChange, onAnalyze, isAnalyzing, reasoning }) => {
  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/40 rounded-2xl p-6 mb-8 shadow-2xl relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-300">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BrainCircuit size={22} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Mô tả Chiến thuật (AI Auto-Fill)</h3>
            <p className="text-xs text-slate-400">AI sẽ tự động tích các ô cấu hình dựa trên mô tả của bạn</p>
          </div>
        </div>
        {value && (
          <button 
            onClick={() => onChange('')}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="Xóa mô tả"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ví dụ: Tôi muốn đánh Vàng khung 5 phút, rải lệnh Martingale, tránh giờ tin ra, và có cắt lỗ theo ATR. Chỉ trade phiên Âu."
        className="w-full h-36 bg-slate-950/60 border border-slate-700 rounded-xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none mb-4 transition-all placeholder:text-slate-600 leading-relaxed"
      />

      <div className="flex items-center gap-3">
        <button 
          onClick={onAnalyze}
          disabled={isAnalyzing || !value.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group/btn"
        >
          {/* Animated glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          
          {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} className="fill-current" />}
          {isAnalyzing ? "Đang phân tích logic..." : "Phân tích & Tự động Cấu hình"}
        </button>
      </div>

      {/* AI Reasoning Display */}
      {reasoning && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1 uppercase tracking-wider">
            <Zap size={12} className="fill-current" />
            Lý giải từ AI
          </div>
          <p className="text-xs text-blue-100/80 leading-relaxed italic">
            "{reasoning}"
          </p>
        </div>
      )}
    </div>
  );
};
