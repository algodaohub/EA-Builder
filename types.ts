
export enum TradeDirection {
  BOTH = 'Both (Buy & Sell)',
  LONG_ONLY = 'Long Only (Chỉ Buy)',
  SHORT_ONLY = 'Short Only (Chỉ Sell)'
}

export enum TradingMethod {
  ONE_SHOT = 'One Shot (Lệnh đơn)',
  GRID = 'Grid (Lưới giá)',
  MARTINGALE = 'Martingale (Gấp thếp)',
  HEDGING = 'Hedging (Đối ứng)',
  SCALPING = 'Scalping (Lướt sóng)',
  CUSTOM = 'Custom (Tùy chỉnh)'
}

export enum IndicatorType {
  MOVING_AVERAGE = 'Moving Average',
  RSI = 'RSI',
  MACD = 'MACD',
  BOLLINGER_BANDS = 'Bollinger Bands',
  STOCHASTIC = 'Stochastic Oscillator',
  ATR = 'ATR',
  CCI = 'CCI'
}

export interface IndicatorConfig {
  id: string;
  type: IndicatorType;
  params: Record<string, number | string>;
  condition: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

// Result structure for generation
export interface GenerationResult {
  prompt: string;
  score: number;
  analysis: string;
  title?: string;
  code?: string; // MQL5 Code
  simulation?: string; // Simulation Report
}

// 1. System & General (Feature Flags)
export interface GeneralSettings {
  useMagicNumber: boolean;
  useComment: boolean;
  useSlippage: boolean;
  useMaxSpread: boolean;
  useOrderFilling: boolean;
  enableBuy: boolean;
  enableSell: boolean;
}

// 2. Money Management (Feature Flags)
export interface MoneyManagement {
  useFixedLot: boolean;
  useAutoLot: boolean; // Risk % logic
  useMaxLot: boolean;
  useMinLot: boolean;
  useLotStep: boolean;
}

// Interface for RiskCard component
export interface RiskManagement {
  lotType: string;
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: boolean;
  trailingStopDistance: number;
  trailingStopStep: number;
}

// 3. SL / TP Management (Feature Flags)
export interface SlTpSettings {
  useStopLoss: boolean;
  useTakeProfit: boolean;
  useVirtual: boolean;
  useAtr: boolean;
  useCandleBased: boolean;
}

// 4. Trailing & Breakeven (Feature Flags)
export interface TrailingSettings {
  useBreakeven: boolean;
  useTrailing: boolean;
  useIndicatorTrailing: boolean;
}

// 6. Grid & Martingale (Feature Flags)
export interface GridSettings {
  enabled: boolean;
  useMaxOrders: boolean;
  useDistance: boolean;
  useStepMultiplier: boolean;
  useLotMultiplier: boolean;
  useBasketTP: boolean;
  useDrawdownReducer: boolean;
}

// 7. Time Filters (Feature Flags)
export interface TimeSettings {
  useTimeFilter: boolean; // Start/End Hour
  useWeekendFilter: boolean;
  useNewsFilter: boolean;
  useAutoGmt: boolean; // Auto detect GMT offset
}

// 8. Equity Protection (Feature Flags)
export interface ProtectionSettings {
  useDailyLoss: boolean;
  useMaxDrawdown: boolean;
  useTargetProfit: boolean;
  useEquityStop: boolean;
  useEquityTrailing: boolean; // Trailing SL for whole account
}

// 9. Display & Alerts (Feature Flags)
export interface DisplaySettings {
  usePanel: boolean;
  usePush: boolean;
  useEmail: boolean;
  useSound: boolean;
}

// 10. Advanced (Feature Flags)
export interface AdvancedSettings {
  useOneChart: boolean;
  useRecovery: boolean;
  usePartialClose: boolean;
}

// 11. Stealth & Humanization
export interface StealthSettings {
  useRandomDelay: boolean;
  useVirtualPending: boolean;
  useMaxOrdersPerCandle: boolean;
  useRetryAttempts: boolean;
  useSlippageControl: boolean;
}

// 12. Pending Order Management
export interface PendingSettings {
  usePendingOrder: boolean; // Main toggle
  usePendingDistance: boolean;
  useExpiration: boolean;
  useFollowPrice: boolean;
  useDeleteOpposite: boolean;
}

// 13. Time-Based Exit
export interface TimeExitSettings {
  useMaxDuration: boolean;
  useFridayClose: boolean;
  useRolloverClose: boolean;
  useNewCandleClose: boolean;
}

// 14. Volatility & Gap Filters
export interface VolatilitySettings {
  useMaxCandleSize: boolean;
  useMinCandleSize: boolean;
  useGapProtection: boolean;
  useAvgSpread: boolean;
}

// 15. Custom Indicators
export interface CustomIndiSettings {
  useCustomIndicator: boolean;
  useBufferLogic: boolean;
  useStringParams: boolean;
}

// 16. Prop Firm Features
export interface PropFirmSettings {
  useDailyLossReset: boolean;
  useConsistency: boolean;
  useHardNewsBlock: boolean;
  useHedgingCheck: boolean;
}

// 17. Remote Control
export interface RemoteSettings {
  useTelegram: boolean;
  useScreenshots: boolean;
  useCommands: boolean;
}

// 18. Advanced Recovery
export interface RecoverySettings {
  useZoneRecovery: boolean;
  useRecoveryGap: boolean;
  useRecoveryTP: boolean;
  usePartialCloseLoss: boolean;
  useDoubleLotOnLoss: boolean; // Simple Martingale recovery
}

// 19. GUI & UX
export interface GuiSettings {
  useDarkTheme: boolean;
  useButtonPos: boolean;
  useDrawLines: boolean;
  useCurrencyChoice: boolean;
}

// 21. Correlation & Multi-Currency
export interface CorrelationSettings {
  useCorrelationCheck: boolean;
  useMaxExposure: boolean;
  useMaxUsdLots: boolean;
  useSymbolPrefixSuffix: boolean;
}

// 22. AI & Machine Learning
export interface AiMlSettings {
  useOnnxModel: boolean;
  useConfidenceThreshold: boolean;
  useDataNormalization: boolean;
  useRetrainingMode: boolean;
}

// 23. Swap & Commission Management
export interface SwapCommissionSettings {
  useTotalCostCheck: boolean; // Spread + Comm
  useTripleSwapFilter: boolean;
  usePositiveSwapOnly: boolean;
  useMinProfitCover: boolean;
}

// 24. Breakout & Session
export interface BreakoutSessionSettings {
  useAsianBox: boolean;
  useLondonOffset: boolean;
  useBoxBuffer: boolean;
  useNfpFilter: boolean;
}

// 25. Advanced Grid Logic
export interface AdvGridSettings {
  useGridReset: boolean;
  useTrendGrid: boolean;
  useAtrGridDistance: boolean;
  useHedgingGrid: boolean;
  useSmartGrid: boolean; // Dynamic distance/multipliers
}

// 26. Logs & Debug
export interface LogDebugSettings {
  useFileLogging: boolean;
  useScreenshotOnError: boolean;
  useDebugMode: boolean;
}

// 27. Licensing & Security
export interface LicenseSettings {
  useLicenseKey: boolean;
  useAccountList: boolean;
  useExpirationDate: boolean;
  useTrialMode: boolean;
  useBrokerFilter: boolean;
}

// 28. Advanced News Events
export interface AdvNewsSettings {
  useWebRequest: boolean;
  useKeywordFilter: boolean;
  useCurrencyFilter: boolean;
  useNewsAutoUpdate: boolean; // Auto fetch news calendar
}

// 29. Visual Optimization
export interface VisualSettings {
  useCustomFont: boolean;
  useButtonOpacity: boolean;
  useProfitLineStyle: boolean;
}

// 30. Trading Sessions
export interface TradingSessionSettings {
  useAsianSession: boolean;
  useLondonSession: boolean;
  useNewYorkSession: boolean;
  useSessionOffsets: boolean;
}

export interface StrategyAnalysis {
  settings: Partial<EASettings>;
  reasoning: string;
}

export interface EASettings {
  name: string;
  symbol: string;
  timeframe: string;
  direction: TradeDirection;
  tradingMethod: TradingMethod;
  strategyDescription: string; // User text input for AI analysis
  entryLogic: string;
  entryExample: string;
  exitLogic: string;
  exitExample: string;
  
  // Categorized Settings
  general: GeneralSettings;
  money: MoneyManagement;
  sltp: SlTpSettings;
  trailing: TrailingSettings;
  indicators: IndicatorConfig[];
  grid: GridSettings;
  time: TimeSettings;
  protection: ProtectionSettings;
  display: DisplaySettings;
  advanced: AdvancedSettings;
  
  // New Categories
  stealth: StealthSettings;
  pending: PendingSettings;
  timeExit: TimeExitSettings;
  volatility: VolatilitySettings;
  customIndi: CustomIndiSettings;
  propFirm: PropFirmSettings;
  remote: RemoteSettings;
  recovery: RecoverySettings;
  gui: GuiSettings;

  // Even Newer Categories (21-29)
  correlation: CorrelationSettings;
  aiml: AiMlSettings;
  swap: SwapCommissionSettings;
  breakout: BreakoutSessionSettings;
  advGrid: AdvGridSettings;
  logs: LogDebugSettings;
  license: LicenseSettings;
  advNews: AdvNewsSettings;
  visuals: VisualSettings;
  sessions: TradingSessionSettings;
}

export interface SavedPrompt {
  id: string;
  timestamp: number;
  name: string;
  settings: EASettings;
  prompt: string;
}
