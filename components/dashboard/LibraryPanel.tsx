import React, { useState, useEffect } from 'react';
import { Download, Search, Filter, ShoppingCart, Tag, Star, ExternalLink, RefreshCw, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import Papa from 'papaparse';
import { PaymentModal } from '../modals/PaymentModal';

interface EAItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  downloadUrl: string;
  version: string;
  author: string;
}

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1iVJ_kmdVdczW1RZAET1irpeag1S7dxMe81snB9BotUs/export?format=csv';

export const LibraryPanel: React.FC = () => {
  const [items, setItems] = useState<EAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentTarget, setPaymentTarget] = useState<EAItem | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SHEET_URL);
      const csvData = await response.text();
      
      Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedItems: EAItem[] = results.data.map((row: any, index: number) => ({
            id: row['Mã sản phẩm'] || `ea-${index}`,
            name: row['Tên Sản phẩm'] || 'Unnamed EA',
            category: row['Loại Sản phẩm'] || 'General',
            description: row['Mô tả'] || '',
            price: parseFloat(row['Giá (VND)']) || 0,
            discount: parseFloat(row['Khuyến Mại (VND)']) || 0,
            rating: 5, // Default rating as it's not in the sheet image
            downloadUrl: row['Liên kết Tải xuống'] || '#',
            version: '1.0',
            author: 'AlgoDao'
          }));
          setItems(parsedItems);
          setLoading(false);
        },
        error: (err) => {
          console.error('CSV Parsing Error:', err);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Fetch Error:', error);
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const handleDownloadClick = (item: EAItem) => {
    const finalPrice = item.price - item.discount;
    if (finalPrice > 0) {
      setPaymentTarget(item);
    } else {
      window.open(item.downloadUrl, '_blank');
    }
  };

  const handlePaymentSuccess = () => {
    if (paymentTarget) {
      window.open(paymentTarget.downloadUrl, '_blank');
      setPaymentTarget(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {paymentTarget && (
        <PaymentModal 
          eaName={paymentTarget.name}
          productId={paymentTarget.id}
          amount={paymentTarget.price - paymentTarget.discount}
          onClose={() => setPaymentTarget(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div>
           <h2 className="font-bold text-orange-400 flex items-center gap-2">
             <ShoppingCart size={20} /> Kho EA & Công cụ Giao dịch
           </h2>
           <p className="text-xs text-slate-500 mt-1">Tải về các sản phẩm đã được AlgoDao Hub kiểm định.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm EA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
            />
          </div>
          <button 
            onClick={fetchData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-slate-950/50 px-6 py-2 border-b border-slate-800 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat 
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="text-orange-500 animate-spin" size={48} />
            <p className="text-slate-400 animate-pulse">Đang tải kho dữ liệu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
            <AlertCircle size={64} className="mb-4" />
            <p className="text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const finalPrice = item.price - item.discount;
              const isFree = finalPrice <= 0;

              return (
                <div key={item.id} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 flex flex-col hover:border-orange-500/50 transition-all group shadow-lg">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold rounded uppercase tracking-wider border border-orange-500/20">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-orange-400 transition-colors">{item.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-[10px] text-slate-500">
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">v{item.version}</span>
                    <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">By {item.author}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-700/50 flex items-center justify-between">
                    <div>
                      {isFree ? (
                        <span className="text-emerald-400 font-black text-lg">MIỄN PHÍ</span>
                      ) : (
                        <div className="flex flex-col">
                          {item.discount > 0 && (
                            <span className="text-[10px] text-slate-500 line-through">
                              {new Intl.NumberFormat('vi-VN').format(item.price)}đ
                            </span>
                          )}
                          <span className="text-orange-400 font-black text-lg">
                            {new Intl.NumberFormat('vi-VN').format(finalPrice)}đ
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => handleDownloadClick(item)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg ${
                        isFree 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                        : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/20'
                      }`}
                    >
                      {isFree ? <Download size={16} /> : <Lock size={16} />}
                      {isFree ? 'Tải về' : 'Mua ngay'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
        <p>Dữ liệu được cập nhật trực tiếp từ AlgoDao Hub Cloud.</p>
        <p className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500" /> Đã kiểm định an toàn</p>
      </div>
    </div>
  );
};
