import React from 'react';
import { X, QrCode, ShieldCheck, CreditCard, Copy, CheckCircle, RefreshCw } from 'lucide-react';

interface PaymentModalProps {
  eaName: string;
  productId: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ORDERS_SHEET_URL = import.meta.env.VITE_ORDERS_CHECK_URL || 'https://docs.google.com/spreadsheets/d/1iVJ_kmdVdczW1RZAET1irpeag1S7dxMe81snB9BotUs/gviz/tq?tqx=out:csv&sheet=Orders';

export const PaymentModal: React.FC<PaymentModalProps> = ({ eaName, productId, amount, onClose, onSuccess }) => {
  const [copied, setCopied] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(false);
  const [orderId] = React.useState(() => {
    const now = new Date();
    const timestamp = now.getFullYear().toString().slice(-2) + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + 
                     now.getDate().toString().padStart(2, '0') + 
                     now.getHours().toString().padStart(2, '0') + 
                     now.getMinutes().toString().padStart(2, '0');
    return `PO${timestamp}${productId.replace(/\s+/g, '')}`;
  });

  // Polling for payment verification
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const checkPayment = async () => {
      try {
        // Use a cache-busting timestamp to ensure we get the latest data from the sheet
        const response = await fetch(`${ORDERS_SHEET_URL}&t=${Date.now()}`);
        const csvData = await response.text();
        
        // Simple CSV check for the orderId in the "Mã tham chiếu" column
        if (csvData.includes(orderId)) {
          onSuccess();
        }
      } catch (error) {
        console.error('Payment check failed:', error);
      }
    };

    interval = setInterval(checkPayment, 1000); // Check every 1 second
    
    return () => clearInterval(interval);
  }, [orderId, onSuccess]);

  const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  
  // New QR format: https://qr.sepay.vn/img?acc=96247ALGODAO&bank=BIDV&amount=100000&des=DH102969
  const qrUrl = `https://qr.sepay.vn/img?acc=96247ALGODAO&bank=BIDV&amount=${amount}&des=${orderId}`;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="text-emerald-400" size={20} /> Thanh toán Download
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm mb-1">Bạn đang mua bản quyền EA:</p>
            <h4 className="text-xl font-black text-white">{eaName}</h4>
            <div className="mt-4 inline-block bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl">
              <span className="text-2xl font-black text-emerald-400">{formattedAmount}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl mb-4 shadow-lg relative group">
            <img src={qrUrl} alt="QR Payment" className="w-64 h-64" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
               <QrCode className="text-slate-900/20" size={120} />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 text-emerald-400 animate-pulse">
             <RefreshCw className="animate-spin" size={18} />
             <span className="text-sm font-bold tracking-wide uppercase">Đang chờ thanh toán...</span>
          </div>

          <div className="w-full space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs">
                <p className="text-slate-500 uppercase font-bold tracking-tighter">Số tài khoản (BIDV)</p>
                <p className="text-white font-mono text-sm">96247ALGODAO</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("96247ALGODAO");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs">
                <p className="text-slate-500 uppercase font-bold tracking-tighter">Nội dung chuyển khoản</p>
                <p className="text-orange-400 font-mono text-sm">{orderId}</p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(orderId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
            <div className="p-3 bg-blue-900/20 rounded-xl border border-blue-500/30">
              <p className="text-[10px] text-blue-300 leading-relaxed">
                <ShieldCheck size={12} className="inline mr-1 mb-0.5" /> 
                Hệ thống sẽ tự động nhận diện giao dịch và trả link download ngay khi bạn chuyển khoản thành công.
              </p>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-500 text-center">
            Gặp khó khăn? Liên hệ Zalo: 0945245115 để được hỗ trợ thủ công.
          </p>
        </div>
      </div>
    </div>
  );
};
