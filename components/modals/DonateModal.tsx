import React, { useState } from 'react';
import { X, Coffee, Heart, Copy, CheckCircle, CreditCard } from 'lucide-react';

interface DonateModalProps {
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('50000');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // VietQR format for donation
  const qrUrl = `https://img.vietqr.io/image/BIDV-96247ALGODAO-compact2.png?amount=${amount}&addInfo=Donate AlgoDao Architect&accountName=DAO MINH TAM`;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-[320px] w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-800 px-4 py-3 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Coffee className="text-orange-400" size={16} /> Mua tôi cốc Cafe
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 flex flex-col items-center">
          <div className="w-full mb-4">
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {['20000', '50000', '100000'].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val)}
                  className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    amount === val 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {new Intl.NumberFormat('vi-VN').format(parseInt(val))}đ
                </button>
              ))}
            </div>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Số tiền khác..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] font-bold">VND</span>
            </div>
          </div>

          <div className="bg-white p-2 rounded-xl shadow-lg w-full aspect-square flex items-center justify-center overflow-hidden">
            <img 
              src={qrUrl} 
              alt="QR Donate" 
              className="w-full h-full object-contain"
              style={{ imageRendering: 'auto' }}
            />
          </div>
          
          <p className="mt-4 text-[10px] text-slate-500 text-center leading-tight">
            Quét mã để ủng hộ tác giả.<br/>Cảm ơn bạn rất nhiều!
          </p>
        </div>
      </div>
    </div>
  );
};
