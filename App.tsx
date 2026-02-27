import React, { useState } from 'react';
import { EASettings, TradeDirection, TradingMethod, ChatMessage, GenerationResult, SavedPrompt } from './types';
import { generateEAPrompt, analyzeStrategy, consultStrategy } from './services/geminiService';
import { storageService } from './services/storageService';
import { Sidebar } from './components/layout/Sidebar';
import { ResultPanel } from './components/dashboard/ResultPanel';
import { ConfigForm } from './components/dashboard/ConfigForm';
import { ConsultantPanel } from './components/dashboard/ConsultantPanel';
import { GuidePanel } from './components/dashboard/GuidePanel';
import { LibraryPanel } from './components/dashboard/LibraryPanel';
import { ApiKeySettings } from './components/modals/ApiKeySettings';
import { DonateModal } from './components/modals/DonateModal';

const initialSettings: EASettings = {
  name: "TrendMaster_Pro_V1",
  symbol: "XAUUSD",
  timeframe: "H1",
  direction: TradeDirection.BOTH,
  tradingMethod: TradingMethod.ONE_SHOT,
  strategyDescription: "",
  entryLogic: "",
  entryExample: "",
  exitLogic: "",
  exitExample: "",
  
  general: {
    useMagicNumber: true,
    useComment: true,
    useSlippage: true,
    useMaxSpread: false,
    useOrderFilling: false,
    enableBuy: true,
    enableSell: true
  },
  money: {
    useFixedLot: true,
    useAutoLot: true,
    useMaxLot: false,
    useMinLot: false,
    useLotStep: false
  },
  sltp: {
    useStopLoss: true,
    useTakeProfit: true,
    useVirtual: false,
    useAtr: false,
    useCandleBased: false
  },
  trailing: {
    useBreakeven: false,
    useTrailing: false,
    useIndicatorTrailing: false
  },
  indicators: [],
  grid: {
    enabled: false,
    useMaxOrders: true,
    useDistance: true,
    useStepMultiplier: true,
    useLotMultiplier: true,
    useBasketTP: false,
    useDrawdownReducer: false
  },
  time: {
    useTimeFilter: false,
    useWeekendFilter: false,
    useNewsFilter: false,
    useAutoGmt: true
  },
  protection: {
    useDailyLoss: false,
    useMaxDrawdown: false,
    useTargetProfit: false,
    useEquityStop: false,
    useEquityTrailing: false
  },
  display: {
    usePanel: true,
    usePush: false,
    useEmail: false,
    useSound: false
  },
  advanced: {
    useOneChart: false,
    useRecovery: false,
    usePartialClose: false
  },
  stealth: {
    useRandomDelay: false,
    useVirtualPending: false,
    useMaxOrdersPerCandle: false,
    useRetryAttempts: false,
    useSlippageControl: false
  },
  pending: {
    usePendingOrder: false,
    usePendingDistance: false,
    useExpiration: false,
    useFollowPrice: false,
    useDeleteOpposite: false
  },
  timeExit: {
    useMaxDuration: false,
    useFridayClose: false,
    useRolloverClose: false,
    useNewCandleClose: false
  },
  volatility: {
    useMaxCandleSize: false,
    useMinCandleSize: false,
    useGapProtection: false,
    useAvgSpread: false
  },
  customIndi: {
    useCustomIndicator: false,
    useBufferLogic: false,
    useStringParams: false
  },
  propFirm: {
    useDailyLossReset: false,
    useConsistency: false,
    useHardNewsBlock: false,
    useHedgingCheck: false
  },
  remote: {
    useTelegram: false,
    useScreenshots: false,
    useCommands: false
  },
  recovery: {
    useZoneRecovery: false,
    useRecoveryGap: false,
    useRecoveryTP: false,
    usePartialCloseLoss: false,
    useDoubleLotOnLoss: false
  },
  gui: {
    useDarkTheme: false,
    useButtonPos: false,
    useDrawLines: false,
    useCurrencyChoice: false
  },
  correlation: {
    useCorrelationCheck: false,
    useMaxExposure: false,
    useMaxUsdLots: false,
    useSymbolPrefixSuffix: false
  },
  aiml: {
    useOnnxModel: false,
    useConfidenceThreshold: false,
    useDataNormalization: false,
    useRetrainingMode: false
  },
  swap: {
    useTotalCostCheck: false,
    useTripleSwapFilter: false,
    usePositiveSwapOnly: false,
    useMinProfitCover: false
  },
  breakout: {
    useAsianBox: false,
    useLondonOffset: false,
    useBoxBuffer: false,
    useNfpFilter: false
  },
  advGrid: {
    useGridReset: false,
    useTrendGrid: false,
    useAtrGridDistance: false,
    useHedgingGrid: false,
    useSmartGrid: false
  },
  logs: {
    useFileLogging: false,
    useScreenshotOnError: false,
    useDebugMode: false
  },
  license: {
    useLicenseKey: false,
    useAccountList: false,
    useExpirationDate: false,
    useTrialMode: false,
    useBrokerFilter: false
  },
  advNews: {
    useWebRequest: false,
    useKeywordFilter: false,
    useCurrencyFilter: false,
    useNewsAutoUpdate: false
  },
  visuals: {
    useCustomFont: false,
    useButtonOpacity: false,
    useProfitLineStyle: false
  },
  sessions: {
    useAsianSession: false,
    useLondonSession: false,
    useNewYorkSession: false,
    useSessionOffsets: false
  }
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<EASettings>(initialSettings);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReasoning, setAnalysisReasoning] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'config' | 'result' | 'consult' | 'guide' | 'library'>('config');
  
  // Highlight state for newly added features
  const [highlightedKeys, setHighlightedKeys] = useState<Set<string>>(new Set());
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);

  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);

  // Load saved prompts on mount
  React.useEffect(() => {
    setSavedPrompts(storageService.getAllPrompts());
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setActiveTab('result');
    try {
      const data = await generateEAPrompt(settings);
      setResult(data);
      
      // Save to local storage
      if (data.prompt && data.prompt.length > 100) {
        const newSaved = storageService.savePrompt({
          name: settings.name || "Untitled EA",
          settings: { ...settings },
          prompt: data.prompt
        });
        setSavedPrompts(prev => [newSaved, ...prev].slice(0, 50));
      }
    } catch (error) {
      setResult({
        prompt: "Lỗi kết nối hoặc API Key hết hạn. Vui lòng kiểm tra lại cấu hình Key.",
        score: 0,
        analysis: "Error",
        title: "Error"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!settings.strategyDescription.trim()) return;
    setIsAnalyzing(true);
    setAnalysisReasoning("");
    try {
      const { settings: updates, reasoning } = await analyzeStrategy(settings.strategyDescription);
      setAnalysisReasoning(reasoning);
      
      // Calculate which keys are newly set to true
      const newHighlights = new Set<string>();
      let toggleCount = 0;

      const extractTrueKeys = (obj: any) => {
        for (const key in obj) {
          if (typeof obj[key] === 'boolean' && obj[key] === true) {
            newHighlights.add(key);
            toggleCount++;
          } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            extractTrueKeys(obj[key]);
          }
        }
      };
      extractTrueKeys(updates);
      setHighlightedKeys(newHighlights);

      if (toggleCount === 0 && !updates.symbol && !updates.timeframe) {
        alert("AI không tìm thấy tính năng nào phù hợp trong mô tả. \n\nHãy thử dùng từ khóa cụ thể hơn, ví dụ:\n- 'Dùng Martingale gấp lệnh'\n- 'Tránh tin tức mạnh'\n- 'Cắt lỗ theo ATR'\n- 'Đóng lệnh vào thứ 6'");
      } else {
        // Clear highlights after 6 seconds
        setTimeout(() => {
          setHighlightedKeys(new Set());
        }, 6000);
      }

      // Merge updates deeply
      setSettings(prev => {
        const next = { ...prev };
        for (const [key, val] of Object.entries(updates)) {
          if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            // @ts-ignore
            next[key] = { ...prev[key], ...val };
          } else {
             // @ts-ignore
            next[key] = val;
          }
        }
        return next;
      });

      if (toggleCount > 0 || updates.symbol || updates.timeframe) {
        // Show a small success message
        const msg = document.createElement('div');
        msg.className = 'fixed bottom-10 right-10 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce font-bold border-2 border-blue-400 max-w-md';
        msg.innerHTML = `✨ AI đã tự động cấu hình ${toggleCount} tính năng!<br/><span class="text-xs font-normal opacity-90">${reasoning}</span>`;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 5000);
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi khi phân tích chiến thuật. Kiểm tra lại API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConsultantMessage = async (msg: string) => {
    setIsChatSending(true);
    const newHistory = [...chatHistory, { role: 'user', content: msg, timestamp: Date.now() } as ChatMessage];
    setChatHistory(newHistory);

    try {
      const reply = await consultStrategy(newHistory, msg);
      setChatHistory([...newHistory, { role: 'model', content: reply, timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleApplyConsultantStrategy = (strategyText: string) => {
    // Take the AI's explanation and put it into the strategy description
    setSettings(prev => ({ ...prev, strategyDescription: strategyText }));
    setActiveTab('config');
    // Optionally trigger analysis immediately
    setTimeout(() => {
       const shouldAnalyze = window.confirm("Đã sao chép ý tưởng! Bạn có muốn AI tự động tích vào các ô cấu hình dựa trên ý tưởng này không?");
       if (shouldAnalyze) {
         handleAnalyze();
       }
    }, 500);
  };

  const handleApplySaved = (saved: SavedPrompt) => {
    setSettings(saved.settings);
    setResult({
      prompt: saved.prompt,
      score: 100,
      analysis: "Restored from history",
      title: saved.name
    });
    setActiveTab('result');
  };

  const handleDeleteSaved = (id: string) => {
    storageService.deletePrompt(id);
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-inter">
      {showSettings && <ApiKeySettings onClose={() => setShowSettings(false)} />}
      
      {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenSettings={() => setShowSettings(true)}
        onOpenDonate={() => setShowDonateModal(true)}
      />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        {/* Dynamic Width Container: Wider for Consultant, contained for Config */}
        <div className={`mx-auto pb-20 h-full transition-all duration-300 ${
          activeTab === 'consult' ? 'max-w-[95%] xl:max-w-[90%]' : 'max-w-4xl'
        }`}>
          {activeTab === 'config' && (
            <ConfigForm 
              settings={settings}
              setSettings={setSettings}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
              onGenerate={handleGenerate}
              highlightedKeys={highlightedKeys}
              analysisReasoning={analysisReasoning}
            />
          )}

          {activeTab === 'result' && (
            <ResultPanel 
              result={result}
              isGenerating={isGenerating}
              history={savedPrompts}
              onApplySaved={handleApplySaved}
              onDeleteSaved={handleDeleteSaved}
            />
          )}

          {activeTab === 'guide' && <GuidePanel />}
          
          {activeTab === 'library' && <LibraryPanel />}

          {activeTab === 'consult' && (
            <ConsultantPanel 
              history={chatHistory}
              onSendMessage={handleConsultantMessage}
              onApplyStrategy={handleApplyConsultantStrategy}
              isSending={isChatSending}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
