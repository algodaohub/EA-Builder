import React from 'react';
import { Bot, Settings, Code, Zap, MessageSquareMore, Key, ExternalLink, Send, MessageCircle, BookOpen, ShoppingCart } from 'lucide-react';

interface SidebarProps {
  activeTab: 'config' | 'result' | 'consult' | 'guide' | 'library';
  setActiveTab: (tab: 'config' | 'result' | 'consult' | 'guide' | 'library') => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenSettings }) => {
  return (
    <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col shrink-0">
      <div className="flex items-center gap-2 mb-8 text-blue-400">
        <Bot size={28} className="text-emerald-400" />
        <h1 className="font-bold text-lg tracking-tight">AlgoDao Architect</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
         <button onClick={() => setActiveTab('consult')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'consult' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/50' : 'text-emerald-400 hover:bg-slate-800 border border-emerald-900/30'}`}>
           <MessageSquareMore size={18} /> Tư Vấn Ý Tưởng
         </button>
         <div className="py-2 border-b border-slate-800/50 mb-2"></div>
         <button onClick={() => setActiveTab('config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'config' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800'}`}>
           <Settings size={18} /> Cấu hình EA
         </button>
         <button onClick={() => setActiveTab('result')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'result' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800'}`}>
           <Code size={18} /> Prompt Đã Tạo
         </button>
         <div className="py-2 border-b border-slate-800/50 mb-2"></div>
         <button onClick={() => setActiveTab('library')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'library' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-orange-400 hover:bg-slate-800'}`}>
           <ShoppingCart size={18} /> Kho EA & Công cụ
         </button>
         <button onClick={() => setActiveTab('guide')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'guide' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
           <BookOpen size={18} /> Hướng dẫn A-Z
         </button>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        {/* PR Section */}
        <div className="mb-6 p-4 bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
            <Zap size={14} className="fill-current" /> Ưu Đãi Hoàn Tiền
          </div>
          <p className="text-[11px] text-white font-bold mb-3">
            Hoàn tiền giao dịch lên đến <span className="text-emerald-400 text-lg font-black">95%</span>
          </p>
          
          <div className="space-y-2 mb-4">
            <a 
              href="https://litefinance.com.vn/promo/codes/?code=INVITE_124150283&uid=124150283" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-[11px] text-white font-bold transition-all group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={12} className="text-emerald-400" /> LiteFinance
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider group-hover:bg-emerald-500 group-hover:text-white transition-colors">Đăng ký</span>
            </a>
            <a 
              href="https://puvip.co/VfiAJn" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 rounded-lg text-[11px] text-white font-bold transition-all group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink size={12} className="text-emerald-400" /> PuPrime
              </span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider group-hover:bg-emerald-500 group-hover:text-white transition-colors">Đăng ký</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a href="https://t.me/daominhtam" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded transition-all">
              <Send size={10} /> Telegram
            </a>
            <a href="https://zalo.me/0945245115" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded transition-all">
              <MessageCircle size={10} /> Zalo
            </a>
          </div>
        </div>

        {onOpenSettings && (
          <div className="mb-4">
            <button 
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/30 transition-all mb-1"
            >
              <Key size={14} className="text-yellow-500" /> Cấu hình API Keys
            </button>
            <p className="text-[10px] text-slate-500 px-2">Cần thiết để AI phân tích chiến thuật. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Lấy Key tại đây</a></p>
          </div>
        )}
        <div className="text-xs text-slate-500 font-bold tracking-widest text-center py-2 bg-slate-900/50 rounded-lg border border-slate-800/50">
           AlgoDAOHub
        </div>
      </div>
    </div>
  );
};
