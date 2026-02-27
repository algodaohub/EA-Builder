import { GoogleGenAI, Type } from "@google/genai";
import { EASettings, ChatMessage, GenerationResult, StrategyAnalysis } from '../types';
import { apiKeyManager, ModelPreference } from './apiKeyManager';

// --- HELPER: RETRY LOGIC WITH KEY ROTATION ---
// This function wraps the AI call. If it fails with a quota error, 
// it rotates the key and retries until all keys are exhausted.
async function withGeminiRetry<T>(
  operation: (ai: GoogleGenAI) => Promise<T>
): Promise<T> {
  let lastError: any = null;

  if (!apiKeyManager.hasAnyKeys()) {
    throw new Error("Chưa có API Key. Vui lòng vào 'Cấu hình API Keys' để nhập Key từ Google AI Studio.");
  }

  // We loop as long as there is a valid key available
  while (apiKeyManager.hasAvailableKeys()) {
    const currentKey = apiKeyManager.getActiveKey();
    
    if (!currentKey) break;

    try {
      const ai = new GoogleGenAI({ apiKey: currentKey });
      return await operation(ai); // Try to execute the AI task
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || '';
      const errorCode = error?.status || error?.response?.status;
      
      console.warn(`[Gemini Error] Key: ...${currentKey.slice(-4)} | Status: ${errorCode} | Msg: ${errorMsg}`);

      // Check for Quota Exceeded (429) or 403 (Permission Denied / Quota) or 503 (Overloaded)
      const isQuotaError = 
        errorMsg.includes('429') || 
        errorMsg.includes('403') || 
        errorMsg.includes('quota') || 
        errorMsg.includes('exhausted') ||
        errorMsg.includes('limit') ||
        errorCode === 429 ||
        errorCode === 403 || 
        errorCode === 503;

      if (isQuotaError) {
        // Mark this key as bad for this session and loop to the next key
        apiKeyManager.reportQuotaExceeded(currentKey);
        console.warn(`--> Rotating to next key due to error: ${errorMsg}`);
        continue; 
      } else {
        // If it's a logic error (e.g., Bad Request 400 - Invalid JSON), don't retry, just throw
        throw error;
      }
    }
  }

  // If we ran out of keys or loops
  throw lastError || new Error("Tất cả API Keys đều đã hết hạn mức (Quota Exceeded). Vui lòng thêm Key mới hoặc đợi 1 phút để reset.");
}


// Definition of all available flags for the AI to reference
const FEATURE_FLAGS_SCHEMA = {
  general: ["useMagicNumber", "useComment", "useSlippage", "useMaxSpread", "useOrderFilling", "enableBuy", "enableSell"],
  money: ["useFixedLot", "useAutoLot", "useMaxLot", "useMinLot", "useLotStep"],
  sltp: ["useStopLoss", "useTakeProfit", "useVirtual", "useAtr", "useCandleBased"],
  trailing: ["useBreakeven", "useTrailing", "useIndicatorTrailing"],
  grid: ["enabled", "useMaxOrders", "useDistance", "useStepMultiplier", "useLotMultiplier", "useBasketTP", "useDrawdownReducer"],
  time: ["useTimeFilter", "useWeekendFilter", "useNewsFilter", "useAutoGmt"],
  protection: ["useDailyLoss", "useMaxDrawdown", "useTargetProfit", "useEquityStop", "useEquityTrailing"],
  display: ["usePanel", "usePush", "useEmail", "useSound"],
  advanced: ["useOneChart", "useRecovery", "usePartialClose"],
  stealth: ["useRandomDelay", "useVirtualPending", "useMaxOrdersPerCandle", "useRetryAttempts", "useSlippageControl"],
  pending: ["usePendingOrder", "usePendingDistance", "useExpiration", "useFollowPrice", "useDeleteOpposite"],
  timeExit: ["useMaxDuration", "useFridayClose", "useRolloverClose", "useNewCandleClose"],
  volatility: ["useMaxCandleSize", "useMinCandleSize", "useGapProtection", "useAvgSpread"],
  customIndi: ["useCustomIndicator", "useBufferLogic", "useStringParams"],
  propFirm: ["useDailyLossReset", "useConsistency", "useHardNewsBlock", "useHedgingCheck"],
  remote: ["useTelegram", "useScreenshots", "useCommands"],
  recovery: ["useZoneRecovery", "useRecoveryGap", "useRecoveryTP", "usePartialCloseLoss", "useDoubleLotOnLoss"],
  gui: ["useDarkTheme", "useButtonPos", "useDrawLines", "useCurrencyChoice"],
  correlation: ["useCorrelationCheck", "useMaxExposure", "useMaxUsdLots", "useSymbolPrefixSuffix"],
  aiml: ["useOnnxModel", "useConfidenceThreshold", "useDataNormalization", "useRetrainingMode"],
  swap: ["useTotalCostCheck", "useTripleSwapFilter", "usePositiveSwapOnly", "useMinProfitCover"],
  breakout: ["useAsianBox", "useLondonOffset", "useBoxBuffer", "useNfpFilter"],
  advGrid: ["useGridReset", "useTrendGrid", "useAtrGridDistance", "useHedgingGrid", "useSmartGrid"],
  logs: ["useFileLogging", "useScreenshotOnError", "useDebugMode"],
  license: ["useLicenseKey", "useAccountList", "useExpirationDate", "useTrialMode", "useBrokerFilter"],
  advNews: ["useWebRequest", "useKeywordFilter", "useCurrencyFilter", "useNewsAutoUpdate"],
  visuals: ["useCustomFont", "useButtonOpacity", "useProfitLineStyle"],
  sessions: ["useAsianSession", "useLondonSession", "useNewYorkSession", "useSessionOffsets"]
};

// --- HELPER: GET MODEL BASED ON PREFERENCE ---
function getTargetModel(taskType: 'fast' | 'complex'): string {
  const pref = apiKeyManager.getModelPreference();
  const customModel = apiKeyManager.getCustomModel();

  if (pref === ModelPreference.CUSTOM) return customModel;
  if (pref === ModelPreference.FLASH) return 'gemini-3-flash-preview';
  if (pref === ModelPreference.PRO) return 'gemini-3.1-pro-preview';

  // AUTO Logic
  return taskType === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
}

// 1. Analyze existing description
export const analyzeStrategy = async (description: string): Promise<StrategyAnalysis> => {
  if (!description.trim()) return { settings: {}, reasoning: "" };
  
  const model = getTargetModel('fast');

  const systemInstruction = `
    Bạn là một Chuyên gia Phân tích Chiến thuật Định lượng (Quantitative Strategist) và Kiến trúc sư Hệ thống Giao dịch Tự động.
    
    NHIỆM VỤ:
    1. Đọc mô tả chiến thuật của người dùng.
    2. Đối chiếu với danh sách tính năng (SCHEMA) bên dưới.
    3. Trả về JSON chứa:
       - "settings": Các tính năng cần được kích hoạt (true).
       - "reasoning": Giải thích chi tiết TẠI SAO bạn chọn kích hoạt hoặc gợi ý các tính năng đó dựa trên kiến thức chuyên gia tài chính.

    SCHEMA (Danh sách tính năng khả dụng):
    ${JSON.stringify(FEATURE_FLAGS_SCHEMA, null, 2)}
    
    QUY TẮC PHÂN TÍCH:
    - **Thông minh**: Nếu nhắc đến "Scalping", hãy tự động bật "stealth.useSlippageControl" và "volatility.useAvgSpread". Giải thích rằng Scalping nhạy cảm với spread và trượt giá.
    - **An toàn**: Nếu nhắc đến "Martingale", bắt buộc bật "protection.useMaxDrawdown" và "advGrid.useGridReset". Giải thích rằng đây là các chốt chặn an toàn để tránh cháy tài khoản khi gặp chuỗi thua dài.
    - **Chuyên nghiệp**: Nhận diện cặp tiền và khung thời gian chính xác.
    
    Ví dụ Output:
    {
      "settings": {
        "symbol": "XAUUSD",
        "timeframe": "M5",
        "grid": { "enabled": true, "useLotMultiplier": true },
        "protection": { "useMaxDrawdown": true }
      },
      "reasoning": "Chiến thuật Martingale trên Vàng (XAUUSD) khung M5 đòi hỏi quản lý rủi ro cực kỳ chặt chẽ. Tôi đã kích hoạt 'Max Drawdown' để bảo vệ vốn và 'Grid Reset' để ngăn chặn việc nhồi lệnh vô hạn trong xu hướng mạnh."
    }
  `;

  try {
    return await withGeminiRetry(async (ai) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: `Phân tích chuyên sâu và cấu hình hệ thống cho mô tả sau:\n\n"${description}"`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json"
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        return {
          settings: result.settings || {},
          reasoning: result.reasoning || "AI đã phân tích và tối ưu hóa cấu hình dựa trên mô tả của bạn."
        };
      }
      return { settings: {}, reasoning: "" };
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { settings: {}, reasoning: "Lỗi khi phân tích chiến thuật." };
  }
};

// 2. Interactive Consultant
export const consultStrategy = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const systemInstruction = `
    Bạn là một Chuyên gia Tư vấn Forex & Lập trình EA theo phong cách "Phỏng vấn từng bước" (Step-by-step Interviewer).
    
    MỤC TIÊU:
    Dẫn dắt người dùng từ một ý tưởng sơ khai đến một chiến thuật hoàn chỉnh bằng cách hỏi TỪNG CÂU HỎI MỘT.

    QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
    1.  **Sử dụng Emoji** làm đầu mục để phân tách rõ ràng (✅, 🧐, ❓, 💡).
    2.  **Sử dụng Markdown List** (gạch đầu dòng) để liệt kê các ý, giúp người dùng dễ đọc nhanh.
    3.  **Thụt đầu dòng** rõ ràng cho các chi tiết phụ.

    CẤU TRÚC CÂU TRẢ LỜI MONG MUỐN:

    ✅ **Ghi nhận & Tổng hợp**:
    *   Tóm tắt ngắn gọn các thông số đã chốt (dạng danh sách).
    *   Ví dụ: 
        *   Sản phẩm: Vàng
        *   Khung: H1

    🧐 **Phân tích hiện tại**:
    *   Chỉ ra mảnh ghép còn thiếu (Entry, Exit, hay Vốn?).

    ❓ **Câu hỏi tiếp theo** (Chỉ 1 câu):
    *   Hỏi về vấn đề quan trọng nhất đang thiếu.

    💡 **Gợi ý / Ví dụ số liệu** (Rất quan trọng):
    *   Đưa ra các option A, B, C cụ thể.
    *   Ví dụ: "SL 500 points (50 pip) hay 300 points (30 pip)?"

    PHONG CÁCH:
    *   Thân thiện, chuyên nghiệp.
    *   Luôn đưa ra ví dụ số liệu cụ thể để người mới dễ hình dung.
  `;

  // Convert ChatMessage[] to Gemini content format
  const contents = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Add the new message
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }]
  });

  const model = getTargetModel('fast');

  try {
    return await withGeminiRetry(async (ai) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });
      return response.text || "Xin lỗi, mình đang suy nghĩ chút, bạn hỏi lại nhé?";
    });
  } catch (error) {
    console.error("Consultant Error:", error);
    return "Hệ thống đang bận hoặc hết Quota API, bạn thử cấu hình lại Key nhé.";
  }
};

// 3. Generate Final Prompt
export const generateEAPrompt = async (settings: EASettings): Promise<GenerationResult> => {
  
  // Construct a detailed context for the model
  const promptContext = JSON.stringify(settings, null, 2);
  const model = getTargetModel('fast'); // Prompt generation is fast enough for Flash

  const systemInstruction = `
    Bạn là một Giám đốc Chiến thuật (Chief Strategy Officer) tại một quỹ đầu cơ định lượng (Quant Hedge Fund).
    Mục tiêu: Chuyển đổi cấu hình thô thành một Bản đặc tả kỹ thuật (Technical Specification Document - TSD) đẳng cấp tổ chức.

    **NHIỆM VỤ CHI TIẾT**:
    1.  **mql5_prompt**: Viết dưới dạng SRS (Software Requirements Specification). 
        - Phải cực kỳ chi tiết về logic toán học (ví dụ: công thức tính Lot, khoảng cách Grid theo ATR).
        - Phân tách rõ ràng: Input Parameters, Entry Logic, Exit Logic, Risk Management, và Error Handling.
        - Ngôn ngữ: Tiếng Việt chuyên ngành tài chính.
    2.  **score**: Đánh giá dựa trên các tiêu chí: Edge (Lợi thế), Risk/Reward, và Robustness (Độ bền bỉ).
    3.  **analysis**: Phân tích như một Quant Auditor. 
        - Chỉ ra các "Edge Case" (trường hợp biên) mà chiến thuật có thể cháy tài khoản.
        - Đề xuất tối ưu hóa thông số (ví dụ: "Nên dùng Kelly Criterion cho quản lý vốn").
    4.  **title**: Tên chiến thuật chuyên nghiệp, mang tính định danh cao.

    **YÊU CẦU**: Phản hồi phải thể hiện sự am hiểu sâu sắc về cấu trúc thị trường (Market Structure) và quản trị rủi ro.
  `;

  try {
    return await withGeminiRetry(async (ai) => {
      const response = await ai.models.generateContent({
        model: model, 
        contents: `Tạo Prompt & Review từ cấu hình sau:\n\n${promptContext}`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING, description: "Bản đặc tả kỹ thuật SRS MQL5 đầy đủ (Markdown)." },
              score: { type: Type.INTEGER, description: "Điểm số đánh giá 0-100." },
              analysis: { type: Type.STRING, description: "Phân tích điểm mạnh/yếu (Markdown)." },
              title: { type: Type.STRING, description: "Tên chiến thuật ngầu." }
            },
            required: ["prompt", "score", "analysis", "title"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      throw new Error("Empty response");
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      prompt: "Lỗi kết nối hoặc hết Quota API. Vui lòng kiểm tra lại Settings.\nChi tiết lỗi: " + error,
      score: 0,
      analysis: "Error: " + error,
      title: "Connection Error"
    };
  }
};

// 4. Generate Code from Prompt
export const generateMQL5Code = async (prompt: string): Promise<string> => {
  const pref = apiKeyManager.getModelPreference();
  const targetModel = getTargetModel('complex');
  
  const systemInstruction = `
    You are a Senior Quantitative Developer and MQL5 Systems Engineer.
    
    TASK:
    Develop a production-grade, institutional-quality MetaTrader 5 Expert Advisor (.mq5).
    
    ENGINEERING STANDARDS:
    1.  **Architecture**: Use a clean, modular structure. Prefer Object-Oriented patterns where applicable.
    2.  **Trade Execution**: Use the <Trade/Trade.mqh> library. Implement strict checks for:
        -   Return codes (Check for TRADE_RETCODE_DONE).
        -   Slippage and Spread filters.
        -   StopLevel and FreezeLevel compliance.
    3.  **Risk Engine**: Implement hard-coded safety limits (Max Drawdown, Daily Loss) as requested in the specification.
    4.  **Performance**: Optimize for backtesting speed. Use efficient data structures.
    5.  **Reliability**: Implement auto-reconnect logic and error logging. Handle "Requotes" and "Busy Server" errors gracefully.
    6.  **Code Quality**: Professional indentation, meaningful variable names, and comprehensive comments (Vietnamese/English).

    OUTPUT:
    Return ONLY the raw MQL5 code. No explanations, no markdown wrappers.
  `;

  try {
    return await withGeminiRetry(async (ai) => {
      // If user forced a specific model (Flash or Custom), use it directly
      if (pref === ModelPreference.FLASH || pref === ModelPreference.CUSTOM) {
        const response = await ai.models.generateContent({
          model: targetModel,
          contents: `Generate MQL5 Code for this specification:\n\n${prompt}`,
          config: { 
            systemInstruction: systemInstruction,
            ...(targetModel.includes('pro') ? { thinkingConfig: { thinkingBudget: 16000 } } : {})
          }
        });
        let code = response.text || "// Error generating code.";
        code = code.replace(/```cpp/g, "").replace(/```mql5/g, "").replace(/```/g, "");
        return code;
      }

      try {
        // AUTO/PRO Logic: Try Pro first
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-pro-preview',
          contents: `Generate MQL5 Code for this specification:\n\n${prompt}`,
          config: {
            systemInstruction: systemInstruction,
            thinkingConfig: { thinkingBudget: 16000 }
          }
        });
        let code = response.text || "// Error generating code.";
        code = code.replace(/```cpp/g, "").replace(/```mql5/g, "").replace(/```/g, "");
        return code;
      } catch (proError: any) {
        // Fallback to Flash if Pro fails (Quota) and user is on AUTO
        if (pref === ModelPreference.AUTO && (proError?.message?.includes('429') || proError?.message?.includes('quota'))) {
          console.warn("Pro quota hit, falling back to Flash for code generation...");
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Generate MQL5 Code for this specification:\n\n${prompt}`,
            config: { systemInstruction: systemInstruction }
          });
          let code = response.text || "// Error generating code.";
          code = code.replace(/```cpp/g, "").replace(/```mql5/g, "").replace(/```/g, "");
          return code;
        }
        throw proError;
      }
    });
  } catch (error) {
    console.error("Code Generation Error:", error);
    return "// Error: Could not generate code due to API limits or connection issues. Please check your API Keys in Settings.";
  }
};

// 5. Fix Code based on Error Logs
export const fixMQL5Code = async (code: string, errorLog: string): Promise<string> => {
  const systemInstruction = `
    You are an Expert MQL5 Debugger.
    
    TASK:
    Analyze the provided MQL5 Source Code and the Compiler Error Log.
    Fix ALL errors and warnings. Return the fully corrected source code.

    INPUT:
    - Code: The broken MQL5 code.
    - Errors: The compiler log from MetaEditor.

    OUTPUT:
    Return ONLY the corrected raw MQL5 code. Do not wrap in Markdown blocks.
  `;

  try {
    return await withGeminiRetry(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // 3.0 Pro for Debugging
        contents: `Fix this code based on the errors:\n\nERROR LOG:\n${errorLog}\n\nSOURCE CODE:\n${code}`,
        config: {
          systemInstruction: systemInstruction,
          thinkingConfig: { thinkingBudget: 8192 }
        }
      });

      let fixedCode = response.text || code;
      fixedCode = fixedCode.replace(/```cpp/g, "").replace(/```mql5/g, "").replace(/```/g, "");
      return fixedCode;
    });
  } catch (error) {
    console.error("Code Fix Error:", error);
    return code; // Return original code on error
  }
};

// 6. Simulate Logic (Logic Trace & Validation)
export const simulateLogic = async (prompt: string, code: string, symbol: string): Promise<string> => {
  const model = getTargetModel('complex');
  const systemInstruction = `
    Bạn là một Chuyên gia Kiểm toán Thuật toán (Quant Auditor) và Kỹ sư Đảm bảo Chất lượng (QA Engineer).
    
    NHIỆM VỤ:
    Thực hiện "Kiểm thử Hộp trắng" (White-box Testing) và mô phỏng logic cho đoạn code MQL5 dựa trên Bản đặc tả kỹ thuật (TSD) cho cặp tiền ${symbol}.

    NGÔN NGỮ: TIẾNG VIỆT CHUYÊN NGÀNH.

    CẤU TRÚC BÁO CÁO (Markdown):

    ## 1. Kiểm chứng Logic (Logic Verification)
    *   **Dòng chảy lệnh (Order Flow):** Mô tả cách EA nhận diện tín hiệu và thực thi lệnh.
    *   **Xử lý rủi ro:** Kiểm tra xem các hàm cắt lỗ, quản lý vốn có hoạt động như thiết kế không.

    ## 2. Báo cáo Kiểm toán (Audit Report)
    
    🔍 **Tính Chính xác (Accuracy)**
    - Trạng thái: [✅ PASS / ⚠️ WARN / ❌ FAIL]
    - Chi tiết: Đối chiếu logic code với công thức toán học trong TSD.

    🛡️ **Tính Ổn định (Robustness)**
    - Trạng thái: [✅ PASS / ⚠️ WARN / ❌ FAIL]
    - Chi tiết: Kiểm tra xử lý lỗi server, spread giãn, và trượt giá.

    📈 **Hiệu suất (Performance)**
    - Trạng thái: [✅ PASS / ⚠️ WARN / ❌ FAIL]
    - Chi tiết: Đánh giá độ trễ thực thi và tối ưu hóa vòng lặp.

    ## 3. Khuyến nghị Kỹ thuật (Technical Recommendations)
    - Đưa ra các cải tiến cụ thể để code đạt tiêu chuẩn "Institutional Grade".
  `;

  try {
    return await withGeminiRetry(async (ai) => {
      const response = await ai.models.generateContent({
        model: model, 
        contents: `YÊU CẦU GỐC (PROMPT):\n${prompt}\n\nMÃ CẶP TIỀN: ${symbol}\n\nSOURCE CODE:\n${code}`,
        config: {
          systemInstruction: systemInstruction,
          ...(model.includes('pro') ? { thinkingConfig: { thinkingBudget: 8192 } } : {})
        }
      });
      return response.text || "Mô phỏng thất bại.";
    });
  } catch (error) {
    console.error("Simulation Error:", error);
    return "Lỗi khi chạy mô phỏng. Vui lòng kiểm tra API Key.";
  }
};
