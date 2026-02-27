import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Activity, ShieldCheck, Zap, Layers, Clock, BarChart2, Coins, 
  Ghost, MousePointerClick, Hourglass, TrendingUp, Cpu, Briefcase, Send, 
  Anchor, Monitor, Globe, BrainCircuit, Wallet, Sunrise, FileText, Key, 
  Radio, Eye, Plus, ArrowRight, Search
} from 'lucide-react';
import { EASettings, IndicatorType, IndicatorConfig } from '../../types';
import { FOREX_SYMBOLS, TIMEFRAMES } from '@/constants';
import { IndicatorCard } from '../IndicatorCard';
import { StrategyInput } from './StrategyInput';
import { BooleanSection } from './BooleanSection';
import { SectionHeader } from '../ui/SectionHeader';
import { CheckboxItem } from '../ui/CheckboxItem';

interface ConfigFormProps {
  settings: EASettings;
  setSettings: React.Dispatch<React.SetStateAction<EASettings>>;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onGenerate: () => void;
  highlightedKeys?: Set<string>;
  analysisReasoning?: string;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ 
  settings, 
  setSettings, 
  isAnalyzing, 
  onAnalyze, 
  onGenerate,
  highlightedKeys = new Set<string>(),
  analysisReasoning = ""
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ general: true, logic: true, money: true });
  const [isIndicatorMenuOpen, setIsIndicatorMenuOpen] = useState(false);
  const indicatorMenuRef = useRef<HTMLDivElement>(null);

  // Auto-open sections if they contain highlighted keys
  useEffect(() => {
    if (highlightedKeys.size > 0) {
      const newOpenState = { ...openSections };
      
      const checkAndOpen = (sectionKey: string, dataObj: any) => {
        const keys = Object.keys(dataObj);
        if (keys.some(k => highlightedKeys.has(k))) {
          newOpenState[sectionKey] = true;
        }
      };

      checkAndOpen('money', settings.money);
      checkAndOpen('sltp', settings.sltp);
      checkAndOpen('trailing', settings.trailing);
      checkAndOpen('grid', settings.grid);
      checkAndOpen('time', settings.time);
      checkAndOpen('prot', settings.protection);
      checkAndOpen('stealth', settings.stealth);
      checkAndOpen('pending', settings.pending);
      checkAndOpen('timeExit', settings.timeExit);
      checkAndOpen('volatility', settings.volatility);
      checkAndOpen('customIndi', settings.customIndi);
      checkAndOpen('propFirm', settings.propFirm);
      checkAndOpen('remote', settings.remote);
      checkAndOpen('recovery', settings.recovery);
      checkAndOpen('gui', settings.gui);
      checkAndOpen('correlation', settings.correlation);
      checkAndOpen('aiml', settings.aiml);
      checkAndOpen('swap', settings.swap);
      checkAndOpen('breakout', settings.breakout);
      checkAndOpen('advGrid', settings.advGrid);
      checkAndOpen('logs', settings.logs);
      checkAndOpen('license', settings.license);
      checkAndOpen('advNews', settings.advNews);
      checkAndOpen('visuals', settings.visuals);
      checkAndOpen('sessions', settings.sessions);
      
      // Handle special merged section (Advanced/Display)
      const advDispKeys = [...Object.keys(settings.display), ...Object.keys(settings.advanced)];
      if (advDispKeys.some(k => highlightedKeys.has(k))) {
        newOpenState['adv'] = true;
      }

      setOpenSections(newOpenState);
    }
  }, [highlightedKeys]);

  // Close indicator menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (indicatorMenuRef.current && !indicatorMenuRef.current.contains(event.target as Node)) {
        setIsIndicatorMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateNested = <K extends keyof EASettings>(category: K, field: keyof EASettings[K], value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [field]: value
      }
    }));
  };

  const addIndicator = (type: IndicatorType) => {
    const newInd: IndicatorConfig = {
      id: Date.now().toString(),
      type,
      params: { period: 14, method: 'SMA', applyTo: 'PRICE_CLOSE', shift: 0 },
      condition: ""
    };
    setSettings(prev => ({ ...prev, indicators: [...prev.indicators, newInd] }));
    setIsIndicatorMenuOpen(false);
  };

  const applyPreset = (presetSettings: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      Object.keys(presetSettings).forEach(category => {
        const catKey = category as keyof EASettings;
        if (typeof presetSettings[category] === 'object' && !Array.isArray(presetSettings[category])) {
          (newSettings as any)[catKey] = {
            ...(newSettings[catKey] as any),
            ...presetSettings[category]
          };
        } else {
          (newSettings as any)[catKey] = presetSettings[category];
        }
      });
      return newSettings;
    });
  };

  const updateIndicator = (id: string, updated: IndicatorConfig) => {
    setSettings(prev => ({
      ...prev,
      indicators: prev.indicators.map(ind => ind.id === id ? updated : ind)
    }));
  };

  const removeIndicator = (id: string) => {
    setSettings(prev => ({
      ...prev,
      indicators: prev.indicators.filter(ind => ind.id !== id)
    }));
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Thiết kế Chiến thuật</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">MT5 MQL5</span>
        </div>
      </div>

      {/* Strategy Description */}
      <StrategyInput 
        value={settings.strategyDescription} 
        onChange={(v) => setSettings({...settings, strategyDescription: v})}
        onAnalyze={onAnalyze}
        isAnalyzing={isAnalyzing}
        reasoning={analysisReasoning}
      />

      {/* 1. General & System (Custom Layout) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <SectionHeader title="1. Cài đặt Cơ bản & Hệ thống" icon={Settings} isOpen={openSections['general']} onClick={() => toggleSection('general')} />
        {openSections['general'] && (
          <div className="p-5 border-t border-slate-800 bg-slate-900/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div>
                    <label className="text-xs text-slate-400 block mb-1">Tên EA</label>
                    <input type="text" value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm focus:border-blue-500 outline-none" />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 block mb-1">Cặp Tiền (Symbol)</label>
                    <div className="relative group">
                      <select 
                        value={settings.symbol} 
                        onChange={(e) => setSettings({...settings, symbol: e.target.value})} 
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm appearance-none cursor-pointer focus:border-blue-500 outline-none"
                      >
                        <option value="">-- Chọn Cặp Tiền --</option>
                        {FOREX_SYMBOLS.map(group => (
                          <optgroup key={group.group} label={group.group}>
                            {group.symbols.map(s => <option key={s} value={s}>{s}</option>)}
                          </optgroup>
                        ))}
                        <option value="CUSTOM">Custom (Tự nhập...)</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <Search size={14} />
                      </div>
                    </div>
                    {settings.symbol === 'CUSTOM' && (
                      <input 
                        type="text" 
                        placeholder="Nhập cặp tiền..." 
                        className="w-full mt-2 bg-slate-800 border border-slate-700 rounded p-2 text-sm focus:border-blue-500 outline-none"
                        onChange={(e) => setSettings({...settings, symbol: e.target.value})}
                      />
                    )}
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 block mb-1">Khung thời gian (TF)</label>
                    <select 
                      value={settings.timeframe} 
                      onChange={(e) => setSettings({...settings, timeframe: e.target.value})} 
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm focus:border-blue-500 outline-none"
                    >
                      {TIMEFRAMES.map(tf => <option key={tf} value={tf}>{tf}</option>)}
                    </select>
                 </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               <CheckboxItem label="Magic Number" checked={settings.general.useMagicNumber} onChange={(v) => updateNested('general', 'useMagicNumber', v)} description="ID riêng biệt cho EA" highlighted={highlightedKeys.has('useMagicNumber')} />
               <CheckboxItem label="Trade Comment" checked={settings.general.useComment} onChange={(v) => updateNested('general', 'useComment', v)} description="Ghi chú lệnh" highlighted={highlightedKeys.has('useComment')} />
               <CheckboxItem label="Slippage" checked={settings.general.useSlippage} onChange={(v) => updateNested('general', 'useSlippage', v)} description="Giới hạn trượt giá" highlighted={highlightedKeys.has('useSlippage')} />
               <CheckboxItem label="Max Spread" checked={settings.general.useMaxSpread} onChange={(v) => updateNested('general', 'useMaxSpread', v)} description="Bộ lọc giãn Spread" highlighted={highlightedKeys.has('useMaxSpread')} />
               <CheckboxItem label="Order Filling" checked={settings.general.useOrderFilling} onChange={(v) => updateNested('general', 'useOrderFilling', v)} description="FOK / IOC" highlighted={highlightedKeys.has('useOrderFilling')} />
               <CheckboxItem label="Enable Buy" checked={settings.general.enableBuy} onChange={(v) => updateNested('general', 'enableBuy', v)} highlighted={highlightedKeys.has('enableBuy')} />
               <CheckboxItem label="Enable Sell" checked={settings.general.enableSell} onChange={(v) => updateNested('general', 'enableSell', v)} highlighted={highlightedKeys.has('enableSell')} />
            </div>
          </div>
        )}
      </div>

      {/* Standard Boolean Sections */}
      <BooleanSection 
        title="2. Quản lý Vốn (Money Management)" 
        icon={Coins} 
        isOpen={openSections['money']} 
        onToggle={() => toggleSection('money')}
        data={settings.money}
        onUpdate={(key, val) => updateNested('money', key as keyof EASettings['money'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useFixedLot', label: 'Fixed Lot Size', description: 'Lot cố định (0.01)' },
          { key: 'useAutoLot', label: 'Auto Lot (%)', description: 'Theo % vốn' },
          { key: 'useMaxLot', label: 'Max Lot Limit', description: 'Giới hạn Lot tối đa' },
          { key: 'useMinLot', label: 'Min Lot Limit', description: 'Giới hạn Lot tối thiểu' },
          { key: 'useLotStep', label: 'Lot Step', description: 'Bước nhảy Lot' }
        ]}
      />

      <BooleanSection 
        title="3. Quản lý SL/TP" 
        icon={ShieldCheck} 
        isOpen={openSections['sltp']} 
        onToggle={() => toggleSection('sltp')}
        data={settings.sltp}
        onUpdate={(key, val) => updateNested('sltp', key as keyof EASettings['sltp'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useStopLoss', label: 'Stop Loss (Points)' },
          { key: 'useTakeProfit', label: 'Take Profit (Points)' },
          { key: 'useVirtual', label: 'Virtual SL/TP', description: 'Ẩn SL/TP với sàn' },
          { key: 'useAtr', label: 'ATR Based SL/TP', description: 'SL/TP theo biến động' },
          { key: 'useCandleBased', label: 'Candle Based SL', description: 'Theo nến trước đó' }
        ]}
      />

      <BooleanSection 
        title="4. Dời Lỗ & Hòa Vốn (Trailing & BE)" 
        icon={ArrowRight} 
        isOpen={openSections['trailing']} 
        onToggle={() => toggleSection('trailing')}
        data={settings.trailing}
        onUpdate={(key, val) => updateNested('trailing', key as keyof EASettings['trailing'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useBreakeven', label: 'Breakeven', description: 'Dời về hòa vốn' },
          { key: 'useTrailing', label: 'Trailing Stop', description: 'Dời lỗ theo giá' },
          { key: 'useIndicatorTrailing', label: 'Indicator Trailing', description: 'Dời theo MA/PSAR' }
        ]}
      />

      {/* 5. Indicators & Logic (Custom Layout) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <SectionHeader title="5. Logic Tín Hiệu & Chỉ Báo" icon={Activity} isOpen={openSections['logic']} onClick={() => toggleSection('logic')} />
        {openSections['logic'] && (
          <div className="p-5 border-t border-slate-800 bg-slate-900/50">
             
             <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-300">Danh sách Chỉ báo (Indicators)</label>
                  <div className="relative" ref={indicatorMenuRef}>
                    <button 
                      onClick={() => setIsIndicatorMenuOpen(!isIndicatorMenuOpen)}
                      className="bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 border border-slate-700"
                    >
                      <Plus size={14} /> Thêm Chỉ Báo
                    </button>
                    {isIndicatorMenuOpen && (
                      <div className="absolute right-0 mt-1 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-y-auto max-h-64 z-20 animate-fade-in-down">
                        {Object.values(IndicatorType).map(t => (
                          <button 
                            key={t} 
                            onClick={() => addIndicator(t)} 
                            className="block w-full text-left px-4 py-3 text-sm hover:bg-slate-700 text-slate-200 border-b border-slate-700/50 last:border-0"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                   {settings.indicators.length === 0 && <p className="text-xs text-slate-500 italic text-center py-4">Chưa có chỉ báo nào.</p>}
                   {settings.indicators.map(ind => <IndicatorCard key={ind.id} indicator={ind} onChange={updateIndicator} onRemove={removeIndicator} />)}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-slate-400 block mb-1">Điều kiện vào lệnh (Entry Logic)</label>
                   <textarea value={settings.entryLogic} onChange={(e) => setSettings({...settings, entryLogic: e.target.value})} placeholder="Mô tả khi nào vào lệnh..." className="w-full h-32 bg-slate-800 border border-slate-700 rounded p-3 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                   <label className="text-xs text-slate-400 block mb-1">Điều kiện thoát lệnh (Exit Logic)</label>
                   <textarea value={settings.exitLogic} onChange={(e) => setSettings({...settings, exitLogic: e.target.value})} placeholder="Mô tả khi nào đóng lệnh..." className="w-full h-32 bg-slate-800 border border-slate-700 rounded p-3 text-sm focus:border-blue-500 focus:outline-none" />
                </div>
             </div>
          </div>
        )}
      </div>

      <BooleanSection 
        title="6. Chiến thuật Lưới & Gấp thếp" 
        icon={Layers} 
        isOpen={openSections['grid']} 
        onToggle={() => toggleSection('grid')}
        data={settings.grid}
        onUpdate={(key, val) => updateNested('grid', key as keyof EASettings['grid'], val)}
        highlightedKeys={highlightedKeys}
        masterToggle={{ key: 'enabled', label: 'Bật Grid/DCA' }}
        items={[
          { key: 'useMaxOrders', label: 'Max Orders', description: 'Số lệnh tối đa' },
          { key: 'useDistance', label: 'Distance', description: 'Khoảng cách lệnh' },
          { key: 'useStepMultiplier', label: 'Step Multiplier', description: 'Hệ số nhân khoảng cách' },
          { key: 'useLotMultiplier', label: 'Lot Multiplier', description: 'Hệ số nhân Lot' },
          { key: 'useBasketTP', label: 'Basket TP ($)', description: 'Chốt lời tổng (USD)' },
          { key: 'useDrawdownReducer', label: 'Drawdown Reducer', description: 'Giảm tải lệnh lỗ' }
        ]}
      />

      <BooleanSection 
        title="7. Bộ Lọc Thời Gian & Tin Tức" 
        icon={Clock} 
        isOpen={openSections['time']} 
        onToggle={() => toggleSection('time')}
        data={settings.time}
        onUpdate={(key, val) => updateNested('time', key as keyof EASettings['time'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useTimeFilter', label: 'Time Filter', description: 'Giờ bắt đầu/kết thúc' },
          { key: 'useWeekendFilter', label: 'Weekend Filter', description: 'Đóng lệnh cuối tuần' },
          { key: 'useNewsFilter', label: 'News Filter', description: 'Tránh tin tức mạnh' },
          { key: 'useAutoGmt', label: 'Auto GMT', description: 'Tự động tính múi giờ' }
        ]}
      />

      <BooleanSection 
        title="8. Bảo vệ Tài khoản" 
        icon={ShieldCheck} 
        isOpen={openSections['prot']} 
        onToggle={() => toggleSection('prot')}
        data={settings.protection}
        onUpdate={(key, val) => updateNested('protection', key as keyof EASettings['protection'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useDailyLoss', label: 'Max Daily Loss', description: '% Lỗ tối đa ngày' },
          { key: 'useMaxDrawdown', label: 'Max Drawdown', description: '% Sụt giảm tổng' },
          { key: 'useTargetProfit', label: 'Target Profit', description: '% Lãi mục tiêu' },
          { key: 'useEquityStop', label: 'Equity Stop', description: 'Dừng khi vốn < X' },
          { key: 'useEquityTrailing', label: 'Equity Trailing', description: 'Dời lỗ cho toàn tài khoản' }
        ]}
      />
      <BooleanSection 
        title="9. Hiển thị & Nâng cao" 
        icon={BarChart2} 
        isOpen={openSections['adv']} 
        onToggle={() => toggleSection('adv')}
        data={{ ...settings.display, ...settings.advanced }}
        onUpdate={(key, val) => {
           // Handle merged state for display (hacky but works for UI grouping)
           if (key in settings.display) updateNested('display', key as keyof EASettings['display'], val);
           else updateNested('advanced', key as keyof EASettings['advanced'], val);
        }}
        highlightedKeys={highlightedKeys}
        items={[
           // Display
          { key: 'usePanel' as any, label: 'On-Chart Panel' },
          { key: 'usePush' as any, label: 'Push Notifications' },
           // Advanced
          { key: 'useRecovery' as any, label: 'Recovery Mode' },
          { key: 'usePartialClose' as any, label: 'Partial Close' },
          { key: 'useOneChart' as any, label: 'One Chart Setup', description: 'Multi-currency' }
        ]}
      />

      <BooleanSection 
        title="11. Stealth & Ngụy trang" 
        icon={Ghost} 
        isOpen={openSections['stealth']} 
        onToggle={() => toggleSection('stealth')}
        data={settings.stealth}
        onUpdate={(key, val) => updateNested('stealth', key as keyof EASettings['stealth'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useRandomDelay', label: 'Random Delay', description: 'Độ trễ ngẫu nhiên' },
          { key: 'useVirtualPending', label: 'Virtual Pending', description: 'Giấu lệnh chờ' },
          { key: 'useMaxOrdersPerCandle', label: 'Max Orders/Candle', description: 'Chống loop lệnh' },
          { key: 'useRetryAttempts', label: 'Retry Attempts', description: 'Thử lại khi lỗi' },
          { key: 'useSlippageControl', label: 'Slippage Control', description: 'Trượt giá dương' }
        ]}
      />

      <BooleanSection 
        title="12. Quản lý Lệnh Chờ" 
        icon={MousePointerClick} 
        isOpen={openSections['pending']} 
        onToggle={() => toggleSection('pending')}
        data={settings.pending}
        onUpdate={(key, val) => updateNested('pending', key as keyof EASettings['pending'], val)}
        highlightedKeys={highlightedKeys}
        masterToggle={{ key: 'usePendingOrder', label: 'Dùng Lệnh Chờ (Stop/Limit)' }}
        items={[
          { key: 'usePendingDistance', label: 'Distance', description: 'Khoảng cách đặt lệnh' },
          { key: 'useExpiration', label: 'Expiration', description: 'Hết hạn hủy lệnh' },
          { key: 'useFollowPrice', label: 'Follow Price', description: 'Dịch chuyển theo giá' },
          { key: 'useDeleteOpposite', label: 'Delete Opposite', description: 'Hủy khi có tín hiệu ngược' }
        ]}
      />

      <BooleanSection 
        title="13. Thoát Lệnh theo Thời gian" 
        icon={Hourglass} 
        isOpen={openSections['timeExit']} 
        onToggle={() => toggleSection('timeExit')}
        data={settings.timeExit}
        onUpdate={(key, val) => updateNested('timeExit', key as keyof EASettings['timeExit'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useMaxDuration', label: 'Max Duration', description: 'Giới hạn thời gian giữ lệnh' },
          { key: 'useFridayClose', label: 'Friday Close', description: 'Đóng lệnh tối thứ 6' },
          { key: 'useRolloverClose', label: 'Rollover Close', description: 'Tránh giờ Swap' },
          { key: 'useNewCandleClose', label: 'New Candle Close', description: 'Đóng khi nến mới' }
        ]}
      />

      <BooleanSection 
        title="14. Bộ lọc Biến động & Gap" 
        icon={TrendingUp} 
        isOpen={openSections['volatility']} 
        onToggle={() => toggleSection('volatility')}
        data={settings.volatility}
        onUpdate={(key, val) => updateNested('volatility', key as keyof EASettings['volatility'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useMaxCandleSize', label: 'Max Candle Size', description: 'Tránh biến động mạnh' },
          { key: 'useMinCandleSize', label: 'Min Candle Size', description: 'Tránh sideway quá nhỏ' },
          { key: 'useGapProtection', label: 'Gap Protection', description: 'Tránh Gap giá' },
          { key: 'useAvgSpread', label: 'Avg Spread Filter', description: 'Lọc Spread trung bình' }
        ]}
      />

      <BooleanSection 
        title="15. Custom Indicators (Ex5)" 
        icon={Cpu} 
        isOpen={openSections['customIndi']} 
        onToggle={() => toggleSection('customIndi')}
        data={settings.customIndi}
        onUpdate={(key, val) => updateNested('customIndi', key as keyof EASettings['customIndi'], val)}
        highlightedKeys={highlightedKeys}
        masterToggle={{ key: 'useCustomIndicator', label: 'Dùng Chỉ Báo Ngoài (Buffer/Arrow)' }}
        items={[
          { key: 'useBufferLogic', label: 'Buffer Logic', description: 'Index cho Buy/Sell' },
          { key: 'useStringParams', label: 'String Params', description: 'Input dạng chuỗi cho Indicator' }
        ]}
      />

      <BooleanSection 
        title="16. Tính năng Quỹ (Prop Firm)" 
        icon={Briefcase} 
        isOpen={openSections['propFirm']} 
        onToggle={() => toggleSection('propFirm')}
        data={settings.propFirm}
        onUpdate={(key, val) => updateNested('propFirm', key as keyof EASettings['propFirm'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useDailyLossReset', label: 'Daily Loss Reset', description: 'Giờ reset lỗ ngày' },
          { key: 'useConsistency', label: 'Consistency Filter', description: 'Luật nhất quán Lot' },
          { key: 'useHardNewsBlock', label: 'Hard News Block', description: 'Chặn trade tin tuyệt đối' },
          { key: 'useHedgingCheck', label: 'Hedging Check', description: 'Kiểm tra luật Hedge' }
        ]}
      />

      <BooleanSection 
        title="17. Điều khiển Telegram" 
        icon={Send} 
        isOpen={openSections['remote']} 
        onToggle={() => toggleSection('remote')}
        data={settings.remote}
        onUpdate={(key, val) => updateNested('remote', key as keyof EASettings['remote'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useTelegram', label: 'Telegram Bot', description: 'Token & ChatID' },
          { key: 'useScreenshots', label: 'Send Screenshots', description: 'Gửi ảnh chart' },
          { key: 'useCommands', label: 'Commands', description: 'Chat để điều khiển' }
        ]}
      />

      <BooleanSection 
        title="18. Xử lý Lệnh Lỗ (Adv Recovery)" 
        icon={Anchor} 
        isOpen={openSections['recovery']} 
        onToggle={() => toggleSection('recovery')}
        data={settings.recovery}
        onUpdate={(key, val) => updateNested('recovery', key as keyof EASettings['recovery'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useZoneRecovery', label: 'Zone Recovery', description: 'Hedging khóa lệnh' },
          { key: 'useRecoveryGap', label: 'Recovery Gap', description: 'Khoảng cách lệnh đối ứng' },
          { key: 'usePartialCloseLoss', label: 'Partial Close', description: 'Cắt lỗ từng phần' },
          { key: 'useDoubleLotOnLoss', label: 'Martingale Recovery', description: 'Gấp thếp khi lỗ' }
        ]}
      />

      <BooleanSection 
        title="19. Giao diện & Đồ họa (GUI)" 
        icon={Monitor} 
        isOpen={openSections['gui']} 
        onToggle={() => toggleSection('gui')}
        data={settings.gui}
        onUpdate={(key, val) => updateNested('gui', key as keyof EASettings['gui'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useDarkTheme', label: 'Theme Settings', description: 'Màu sắc Dashboard' },
          { key: 'useButtonPos', label: 'Button Position', description: 'Vị trí nút bấm' },
          { key: 'useDrawLines', label: 'Draw Lines', description: 'Vẽ Entry/Exit' },
          { key: 'useCurrencyChoice', label: 'Profit Unit', description: 'Points / Currency' }
        ]}
      />

      <BooleanSection 
        title="21. Tương Quan & Đa Cặp Tiền" 
        icon={Globe} 
        isOpen={openSections['correlation']} 
        onToggle={() => toggleSection('correlation')}
        data={settings.correlation}
        onUpdate={(key, val) => updateNested('correlation', key as keyof EASettings['correlation'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useCorrelationCheck', label: 'Check Correlation', description: 'Tránh cặp cùng chiều' },
          { key: 'useMaxExposure', label: 'Max Exposure', description: 'Giới hạn rủi ro/đồng tiền' },
          { key: 'useMaxUsdLots', label: 'Max USD Lots', description: 'Tổng lot liên quan USD' },
          { key: 'useSymbolPrefixSuffix', label: 'Symbol Fix', description: 'Hậu tố/Tiền tố cặp tiền' }
        ]}
      />

      <BooleanSection 
        title="22. AI & Machine Learning (ONNX)" 
        icon={BrainCircuit} 
        isOpen={openSections['aiml']} 
        onToggle={() => toggleSection('aiml')}
        data={settings.aiml}
        onUpdate={(key, val) => updateNested('aiml', key as keyof EASettings['aiml'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useOnnxModel', label: 'Use ONNX Model', description: 'Load model AI có sẵn' },
          { key: 'useConfidenceThreshold', label: 'Confidence %', description: 'Ngưỡng tin cậy vào lệnh' },
          { key: 'useDataNormalization', label: 'Data Norm', description: 'Chuẩn hóa dữ liệu' },
          { key: 'useRetrainingMode', label: 'Re-training', description: 'Thu thập data train lại' }
        ]}
      />

      <BooleanSection 
        title="23. Quản lý Phí & Swap" 
        icon={Wallet} 
        isOpen={openSections['swap']} 
        onToggle={() => toggleSection('swap')}
        data={settings.swap}
        onUpdate={(key, val) => updateNested('swap', key as keyof EASettings['swap'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useTotalCostCheck', label: 'Total Cost Check', description: 'Spread + Commission' },
          { key: 'useTripleSwapFilter', label: 'Triple Swap Filter', description: 'Tránh swap x3' },
          { key: 'usePositiveSwapOnly', label: 'Positive Swap Only', description: 'Chỉ đánh lệnh swap dương' },
          { key: 'useMinProfitCover', label: 'Min Profit Cover', description: 'TP > Cost * X' }
        ]}
      />

      <BooleanSection 
        title="24. Breakout & Session" 
        icon={Sunrise} 
        isOpen={openSections['breakout']} 
        onToggle={() => toggleSection('breakout')}
        data={settings.breakout}
        onUpdate={(key, val) => updateNested('breakout', key as keyof EASettings['breakout'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useAsianBox', label: 'Asian Box', description: 'Vẽ hộp phiên Á' },
          { key: 'useLondonOffset', label: 'London Offset', description: 'Tránh bẫy đầu Âu' },
          { key: 'useBoxBuffer', label: 'Box Buffer', description: 'Đệm đặt lệnh chờ' },
          { key: 'useNfpFilter', label: 'NFP Filter', description: 'Lọc ngày Non-Farm' }
        ]}
      />

      <BooleanSection 
        title="25. Grid Nâng Cao" 
        icon={Layers} 
        isOpen={openSections['advGrid']} 
        onToggle={() => toggleSection('advGrid')}
        data={settings.advGrid}
        onUpdate={(key, val) => updateNested('advGrid', key as keyof EASettings['advGrid'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useGridReset', label: 'Grid Reset', description: 'Cắt lỗ cả dây nếu quá X lệnh' },
          { key: 'useTrendGrid', label: 'Trend Grid', description: 'Chỉ nhồi thuận xu hướng' },
          { key: 'useAtrGridDistance', label: 'ATR Distance', description: 'Giãn cách theo biến động' },
          { key: 'useHedgingGrid', label: 'Hedging Grid', description: 'Vào lệnh đối ứng khóa lỗ' },
          { key: 'useSmartGrid', label: 'Smart Grid', description: 'Tự động giãn cách & nhân lot' }
        ]}
      />

      <BooleanSection 
        title="26. Logs & Debug" 
        icon={FileText} 
        isOpen={openSections['logs']} 
        onToggle={() => toggleSection('logs')}
        data={settings.logs}
        onUpdate={(key, val) => updateNested('logs', key as keyof EASettings['logs'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useFileLogging', label: 'File Logging', description: 'Ghi log ra file' },
          { key: 'useScreenshotOnError', label: 'Error Screenshot', description: 'Chụp màn hình khi lỗi' },
          { key: 'useDebugMode', label: 'Debug Mode', description: 'Hiện thông số debug' }
        ]}
      />

      <BooleanSection 
        title="27. Bản Quyền & Bảo Mật" 
        icon={Key} 
        isOpen={openSections['license']} 
        onToggle={() => toggleSection('license')}
        data={settings.license}
        onUpdate={(key, val) => updateNested('license', key as keyof EASettings['license'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useLicenseKey', label: 'License Key', description: 'Khóa kích hoạt' },
          { key: 'useAccountList', label: 'Account List', description: 'Danh sách tài khoản cho phép' },
          { key: 'useExpirationDate', label: 'Expiration Date', description: 'Ngày hết hạn' },
          { key: 'useTrialMode', label: 'Trial Mode', description: 'Chế độ dùng thử' },
          { key: 'useBrokerFilter', label: 'Broker Filter', description: 'Chỉ chạy trên Broker chỉ định' }
        ]}
      />

      <BooleanSection 
        title="28. Tin Tức Nâng Cao" 
        icon={Radio} 
        isOpen={openSections['advNews']} 
        onToggle={() => toggleSection('advNews')}
        data={settings.advNews}
        onUpdate={(key, val) => updateNested('advNews', key as keyof EASettings['advNews'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useWebRequest', label: 'WebRequest News', description: 'Lấy tin từ ForexFactory' },
          { key: 'useKeywordFilter', label: 'Keyword Filter', description: 'Lọc theo từ khóa (FOMC...)' },
          { key: 'useCurrencyFilter', label: 'Currency Filter', description: 'Chỉ lọc tin liên quan' },
          { key: 'useNewsAutoUpdate', label: 'Auto Update', description: 'Tự động cập nhật lịch tin' }
        ]}
      />

      <BooleanSection 
        title="29. Tối Ưu Hiển Thị" 
        icon={Eye} 
        isOpen={openSections['visuals']} 
        onToggle={() => toggleSection('visuals')}
        data={settings.visuals}
        onUpdate={(key, val) => updateNested('visuals', key as keyof EASettings['visuals'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useCustomFont', label: 'Custom Font', description: 'Chỉnh font/size dashboard' },
          { key: 'useButtonOpacity', label: 'Button Opacity', description: 'Độ trong suốt bảng' },
          { key: 'useProfitLineStyle', label: 'Profit Line Style', description: 'Kiểu đường hòa vốn' }
        ]}
      />

      <BooleanSection 
        title="30. Phiên Giao Dịch" 
        icon={Globe} 
        isOpen={openSections['sessions']} 
        onToggle={() => toggleSection('sessions')}
        data={settings.sessions}
        onUpdate={(key, val) => updateNested('sessions', key as keyof EASettings['sessions'], val)}
        highlightedKeys={highlightedKeys}
        items={[
          { key: 'useAsianSession', label: 'Asian Session', description: 'Giao dịch phiên Á' },
          { key: 'useLondonSession', label: 'London Session', description: 'Giao dịch phiên Âu' },
          { key: 'useNewYorkSession', label: 'New York Session', description: 'Giao dịch phiên Mỹ' },
          { key: 'useSessionOffsets', label: 'Session Offsets', description: 'Bù giờ mở/đóng phiên' }
        ]}
      />

      {/* CTA */}
      <div className="pt-6 pb-12">
        <button 
          onClick={onGenerate}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
        >
          <Zap size={20} fill="currentColor" />
          Generate Professional Prompt
        </button>
      </div>
    </div>
  );
};