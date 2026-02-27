
import React, { useState, useEffect } from 'react';
import { X, Save, Key, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { apiKeyManager } from '../../services/apiKeyManager';

interface Props {
  onClose: () => void;
}

export const ApiKeySettings: React.FC<Props> = ({ onClose }) => {
  const [keyText, setKeyText] = useState('');
  const [saved, setSaved] = useState(false);
  const [hasSystemKey, setHasSystemKey] = useState(false);

  useEffect(() => {
    setKeyText(apiKeyManager.getRawText());
    // Check if there's a system key (process.env.GEMINI_API_KEY)
    const allKeys = apiKeyManager.getAllKeys();
    const storedKeys = apiKeyManager.getRawText().split('\n').filter(k => k.trim().length > 0);
    setHasSystemKey(allKeys.length > storedKeys.length);
  }, []);

  const handleSave = () => {
    const keys = keyText.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    apiKeyManager.saveKeys(keys);
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="text-yellow-400" size={20} /> Cấu hình Gemini API Keys
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3">
             <AlertTriangle className="text-blue-400 shrink-0" size={24} />
             <div className="text-xs text-slate-300 leading-relaxed">
                <p className="font-bold text-blue-300 mb-1 text-sm">Tại sao cần API Key?</p>
                <p>Hệ thống sử dụng trí tuệ nhân tạo (Gemini AI) để phân tích chiến thuật của bạn. Để AI hoạt động, bạn cần cung cấp API Key cá nhân.</p>
                <p className="mt-2 font-bold text-yellow-400">Cách lấy Key miễn phí:</p>
                <ol className="list-decimal ml-4 mt-1 space-y-1">
                  <li>Truy cập <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 underline font-bold">Google AI Studio</a></li>
                  <li>Đăng nhập bằng tài khoản Google (Gmail).</li>
                  <li>Nhấn nút <b>"Create API key"</b>.</li>
                  <li>Copy mã (bắt đầu bằng AIza...) và dán vào ô bên dưới.</li>
                </ol>
             </div>
          </div>

          <div>
             <label className="text-sm font-medium text-slate-400 mb-2 block">Danh sách API Keys (1 key / dòng)</label>
             <textarea 
               value={keyText}
               onChange={(e) => setKeyText(e.target.value)}
               placeholder="AIzaSy..."
               className="w-full h-48 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:border-yellow-500 focus:outline-none resize-none"
             />
             <div className="flex justify-between mt-2 text-xs text-slate-500">
                <div className="flex gap-3">
                  <span>Total Keys: {keyText.split('\n').filter(k => k.trim().length > 0).length}</span>
                  {hasSystemKey && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Zap size={10} fill="currentColor" /> System Key Active
                    </span>
                  )}
                </div>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Get Keys Here</a>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2">
           <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium">Hủy</button>
           <button 
             onClick={handleSave}
             className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
           >
             {saved ? <CheckCircle size={16} /> : <Save size={16} />}
             {saved ? "Đã Lưu!" : "Lưu Cấu Hình"}
           </button>
        </div>
      </div>
    </div>
  );
};
