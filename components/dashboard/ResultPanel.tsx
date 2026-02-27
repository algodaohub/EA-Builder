import React, { useState } from 'react';
import { Copy, RefreshCw, Bot, Code, Activity, Star, Terminal, Zap, Bug, X, Check, Play, PlayCircle, BookOpen, HelpCircle, ChevronRight, AlertCircle, History, Trash2, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GenerationResult, SavedPrompt } from '../../types';
import { generateMQL5Code, fixMQL5Code, simulateLogic } from '../../services/geminiService';

interface ResultPanelProps {
  result: GenerationResult | null;
  isGenerating: boolean;
  history?: SavedPrompt[];
  onApplySaved?: (saved: SavedPrompt) => void;
  onDeleteSaved?: (id: string) => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ 
  result, 
  isGenerating, 
  history = [], 
  onApplySaved, 
  onDeleteSaved 
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'analysis' | 'code' | 'simulation' | 'history'>('prompt');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isCoding, setIsCoding] = useState(false);
  
  // Fix Logic State
  const [showFixInput, setShowFixInput] = useState(false);
  const [errorLog, setErrorLog] = useState('');
  const [isFixing, setIsFixing] = useState(false);

  // Guide State
  const [showGuide, setShowGuide] = useState(false);

  // Simulation State
  const [simSymbol, setSimSymbol] = useState('XAUUSD');
  const [simulationReport, setSimulationReport] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // When result changes, reset code and simulation
  React.useEffect(() => {
    setGeneratedCode(null);
    setShowFixInput(false);
    setErrorLog('');
    setSimulationReport(null);
    setShowGuide(false);
  }, [result]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép vào bộ nhớ tạm!");
  };

  const handleGenerateCode = async () => {
    if (!result?.prompt) return;
    setIsCoding(true);
    setActiveTab('code'); // Switch to code tab immediately to show loading
    try {
      const code = await generateMQL5Code(result.prompt);
      setGeneratedCode(code);
    } catch (e) {
      setGeneratedCode("// Lỗi khi tạo code. Vui lòng thử lại.");
    } finally {
      setIsCoding(false);
    }
  };

  const handleFixCode = async () => {
    if (!generatedCode || !errorLog.trim()) return;
    setIsFixing(true);
    try {
      const fixed = await fixMQL5Code(generatedCode, errorLog);
      setGeneratedCode(fixed);
      setShowFixInput(false);
      setErrorLog('');
      alert("Đã sửa code xong! Hãy thử Compile lại.");
    } catch (e) {
      alert("Lỗi khi sửa code. Vui lòng thử lại.");
    } finally {
      setIsFixing(false);
    }
  };

  const handleSimulate = async () => {
    if (!generatedCode || !result?.prompt) {
      alert("Vui lòng tạo Code trước khi chạy mô phỏng.");
      setActiveTab('code');
      return;
    }
    setIsSimulating(true);
    try {
      const report = await simulateLogic(result.prompt, generatedCode, simSymbol);
      setSimulationReport(report);
    } catch (e) {
      setSimulationReport("Lỗi khi chạy mô phỏng.");
    } finally {
      setIsSimulating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <Bot className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={48} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-200 mb-2">Đang kiến tạo siêu phẩm...</h3>
          <p className="text-slate-400">Gemini đang tối ưu hóa thuật toán và đánh giá rủi ro.</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
        <Bot size={64} className="mb-4 text-slate-700" />
        <p className="text-lg">Chưa có dữ liệu. Vui lòng cấu hình và bấm "Generate".</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      
      {/* Guide Modal Overlay */}
      {showGuide && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
             <div className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="text-blue-400" size={20} /> Hướng dẫn Compile Code
                </h3>
                <button onClick={() => setShowGuide(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
             </div>
             <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">1</div>
                   <div>
                     <h4 className="font-semibold text-slate-200">Mở MetaEditor</h4>
                     <p className="text-sm text-slate-400">Trên phần mềm MT5, nhấn phím <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-xs">F4</kbd> để mở trình soạn thảo code.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">2</div>
                   <div>
                     <h4 className="font-semibold text-slate-200">Tạo File Mới</h4>
                     <p className="text-sm text-slate-400">Nhấn <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-xs">Ctrl + N</kbd> → Chọn <strong>Expert Advisor (template)</strong> → Đặt tên tùy ý (VD: MyEA) → Next liên tục đến khi xong.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">3</div>
                   <div>
                     <h4 className="font-semibold text-slate-200">Dán Code</h4>
                     <p className="text-sm text-slate-400">Trong cửa sổ code vừa tạo: Nhấn <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-xs">Ctrl + A</kbd> (Chọn hết) → <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-xs">Delete</kbd> (Xóa sạch). Sau đó dán code từ App này vào.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">4</div>
                   <div>
                     <h4 className="font-semibold text-slate-200">Biên dịch (Compile)</h4>
                     <p className="text-sm text-slate-400">Nhấn <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-xs">F7</kbd>. Nhìn xuống tab <strong>Errors</strong> bên dưới.</p>
                     <ul className="text-sm text-slate-400 mt-2 list-disc pl-4 space-y-1">
                        <li>Nếu báo <span className="text-red-400">Error</span>: Copy lỗi đó và dùng nút <strong>"Báo Lỗi"</strong> ở đây để AI sửa.</li>
                        <li>Nếu báo <span className="text-yellow-400">Warning</span>: Có thể bỏ qua.</li>
                        <li>Nếu không có lỗi: Quay lại MT5, tìm EA trong mục Navigator và kéo vào biểu đồ.</li>
                     </ul>
                   </div>
                </div>
             </div>
             <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
                <button onClick={() => setShowGuide(false)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">Đã Hiểu</button>
             </div>
          </div>
        </div>
      )}

      {/* Header Tabs */}
      <div className="bg-slate-950 px-2 pt-2 border-b border-slate-800 flex gap-1 shrink-0 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-t-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'prompt' 
            ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500' 
            : 'bg-slate-950 text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
          }`}
        >
          <Code size={16} /> MQL5 Prompt
        </button>
        <button 
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-t-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'code' 
            ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-500' 
            : 'bg-slate-950 text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
          }`}
        >
          <Terminal size={16} /> Source Code
        </button>
        <button 
          onClick={() => setActiveTab('simulation')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-t-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'simulation' 
            ? 'bg-slate-900 text-orange-400 border-t-2 border-orange-500' 
            : 'bg-slate-950 text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
          }`}
        >
          <PlayCircle size={16} /> Logic Sim
        </button>
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-t-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'analysis' 
            ? 'bg-slate-900 text-purple-400 border-t-2 border-purple-500' 
            : 'bg-slate-950 text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
          }`}
        >
          <Activity size={16} /> AI Review
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 px-2 text-sm font-medium rounded-t-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'history' 
            ? 'bg-slate-900 text-yellow-400 border-t-2 border-yellow-500' 
            : 'bg-slate-950 text-slate-500 hover:bg-slate-900/50 hover:text-slate-300'
          }`}
        >
          <History size={16} /> Lịch sử
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* TAB 1: PROMPT */}
        {activeTab === 'prompt' && (
          <div className="absolute inset-0 flex flex-col animate-fade-in">
             <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  onClick={handleGenerateCode}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
                >
                  <Zap size={16} fill="currentColor" /> Generate Code
                </button>
                <button 
                  onClick={() => copyToClipboard(result.prompt)}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
                >
                  <Copy size={16} /> Copy
                </button>
             </div>
             {/* Using a code-friendly font family specifically for this container */}
             <div className="flex-1 overflow-y-auto p-6 bg-[#1e1e1e] text-slate-300">
                <ReactMarkdown
                  components={{
                    code: ({node, ...props}) => (
                      <code style={{ fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace" }} className="text-sm" {...props} />
                    ),
                    pre: ({node, ...props}) => (
                      <pre style={{ fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace" }} className="whitespace-pre-wrap leading-relaxed" {...props} />
                    )
                  }}
                >
                  {result.prompt}
                </ReactMarkdown>
             </div>
          </div>
        )}

        {/* TAB 2: CODE */}
        {activeTab === 'code' && (
          <div className="absolute inset-0 flex flex-col animate-fade-in bg-[#1e1e1e]">
             {isCoding ? (
               <div className="h-full flex flex-col items-center justify-center">
                  <RefreshCw className="text-emerald-500 animate-spin mb-4" size={48} />
                  <p className="text-slate-400">Đang viết mã MQL5 (có thể mất 30-60 giây)...</p>
               </div>
             ) : !generatedCode ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Terminal size={64} className="mb-4 opacity-50" />
                  <p className="mb-4">Chưa có mã nguồn.</p>
                  <button 
                    onClick={handleGenerateCode}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
                  >
                    <Zap size={20} /> Tạo Code Ngay
                  </button>
               </div>
             ) : (
               <>
                 {/* Toolbar Overlay */}
                 <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <button 
                      onClick={() => setShowGuide(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
                    >
                      <BookOpen size={16} /> Hướng dẫn
                    </button>
                    <button 
                      onClick={() => setShowFixInput(true)}
                      className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
                    >
                      <Bug size={16} /> Báo Lỗi
                    </button>
                    <button 
                      onClick={() => copyToClipboard(generatedCode)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105"
                    >
                      <Copy size={16} /> Copy Code
                    </button>
                 </div>

                 {/* Fix Input Overlay */}
                 {showFixInput && (
                   <div className="absolute inset-x-0 top-0 bg-slate-900/95 backdrop-blur-sm z-20 border-b border-red-500/30 p-4 animate-slide-down shadow-2xl">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-red-400 font-bold flex items-center gap-2"><Bug size={18} /> Auto-Fixer</h4>
                        <button onClick={() => setShowFixInput(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
                      </div>

                      {/* Instructions */}
                      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 mb-3 text-xs text-slate-300">
                        <strong className="text-blue-400 block mb-1 flex items-center gap-1"><AlertCircle size={12}/> Hướng dẫn lấy nội dung lỗi:</strong>
                        <ol className="list-decimal pl-4 space-y-1">
                           <li>Trong MetaEditor: Nhấn <kbd className="bg-slate-700 px-1 py-0.5 rounded border border-slate-600 text-[10px] text-white">F7</kbd> để Compile (Biên dịch).</li>
                           <li>Nhìn xuống tab <strong>Errors</strong> ở đáy màn hình.</li>
                           <li>Chuột phải vào vùng danh sách lỗi &rarr; Chọn <strong>Copy</strong> (hoặc nhấn Ctrl+A rồi Ctrl+C).</li>
                           <li>Dán toàn bộ nội dung đó vào ô dưới đây.</li>
                        </ol>
                      </div>

                      <textarea 
                        value={errorLog}
                        onChange={(e) => setErrorLog(e.target.value)}
                        placeholder="Dán lỗi vào đây... Ví dụ: '}' - semicolon expected (Line 145, Col 23)..."
                        className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs font-mono text-red-300 focus:outline-none focus:border-red-500 mb-2 placeholder-slate-600"
                      />
                      <div className="flex justify-end gap-2">
                         <button 
                           onClick={handleFixCode}
                           disabled={isFixing || !errorLog.trim()}
                           className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
                         >
                           {isFixing ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
                           {isFixing ? "Đang sửa..." : "Fix Code Ngay"}
                         </button>
                      </div>
                   </div>
                 )}

                 <div className="flex-1 overflow-y-auto p-6 pt-16">
                    <pre style={{ fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace" }} className="text-sm text-emerald-300 whitespace-pre leading-relaxed">
                      {generatedCode}
                    </pre>
                 </div>
               </>
             )}
          </div>
        )}

        {/* TAB 4: SIMULATION */}
        {activeTab === 'simulation' && (
          <div className="absolute inset-0 flex flex-col animate-fade-in bg-slate-900">
             {!generatedCode ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <Terminal size={64} className="mb-4 opacity-50" />
                  <p className="mb-4">Cần tạo Code trước khi chạy mô phỏng.</p>
                  <button onClick={() => setActiveTab('code')} className="text-blue-400 hover:underline">Đi tới tab Code</button>
                </div>
             ) : (
                <>
                  {/* Simulation Controls */}
                  <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-4 shrink-0">
                     <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-slate-300">Cặp Tiền:</label>
                        <input 
                          type="text" 
                          value={simSymbol} 
                          onChange={(e) => setSimSymbol(e.target.value.toUpperCase())}
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm w-24 text-center font-bold text-orange-400"
                        />
                     </div>
                     <button 
                        onClick={handleSimulate}
                        disabled={isSimulating}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                     >
                        {isSimulating ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                        {isSimulating ? "AI Đang Đọc Code..." : "Chạy Mô Phỏng Logic"}
                     </button>
                  </div>

                  {/* Report View */}
                  <div className="flex-1 overflow-y-auto p-6 bg-[#0d1117]">
                     {simulationReport ? (
                        <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-orange-400 prose-table:border-slate-700 prose-th:bg-slate-800 prose-td:border-slate-800 max-w-none">
                           <ReactMarkdown>{simulationReport}</ReactMarkdown>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
                           <PlayCircle size={64} className="mb-4 text-orange-500/50" />
                           <p>Nhập mã cặp tiền và bấm nút để AI kiểm tra logic code của bạn.</p>
                        </div>
                     )}
                  </div>
                </>
             )}
          </div>
        )}

        {/* TAB 3 (ANALYSIS) MOVED TO END IN RENDER ORDER BUT LOGICALLY TAB 5 */}
        {activeTab === 'analysis' && (
          <div className="absolute inset-0 overflow-y-auto p-6 md:p-10 bg-gradient-to-br from-slate-900 to-slate-950 animate-fade-in">
            {/* ... Existing Analysis UI ... */}
            <div className="text-center mb-10">
               <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
                 {result.title || "Chiến Thuật Không Tên"}
               </h1>
               <p className="text-slate-500 uppercase tracking-widest text-xs font-semibold">AI Strategy Analysis</p>
            </div>

            {/* Score Visual */}
            <div className="flex justify-center mb-12 relative">
               <div className="relative w-48 h-48 md:w-64 md:h-64">
                 {/* Outer Glow */}
                 <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 ${getScoreColor(result.score, 'bg')}`}></div>
                 
                 {/* SVG Circle */}
                 <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * result.score) / 100}
                      className={`transition-all duration-1000 ease-out ${getScoreColor(result.score, 'text')}`}
                    />
                 </svg>

                 {/* Center Text */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl md:text-6xl font-black ${getScoreColor(result.score, 'text')}`}>
                      {result.score}
                    </span>
                    <span className="text-slate-400 text-xs md:text-sm font-medium uppercase mt-1">
                      Điểm Tiềm Năng
                    </span>
                 </div>
               </div>
            </div>

            {/* Analysis Grid */}
            <div className="max-w-3xl mx-auto">
               <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                 <div className="flex items-center gap-2 mb-4">
                    <Star className="text-yellow-400" size={20} fill="currentColor" />
                    <h3 className="text-lg font-bold text-slate-200">Chi tiết Đánh giá</h3>
                 </div>
                 <div className="prose prose-invert prose-p:text-slate-300 prose-headings:text-slate-200 prose-strong:text-white max-w-none">
                    <ReactMarkdown>{result.analysis}</ReactMarkdown>
                 </div>
               </div>
            </div>

          </div>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === 'history' && (
          <div className="absolute inset-0 flex flex-col animate-fade-in bg-slate-900 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <History className="text-yellow-400" size={24} /> Lịch sử Phiên bản
               </h3>
               <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                 Lưu tối đa 50 bản ghi gần nhất
               </span>
            </div>

            {history.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-60">
                <Clock size={64} className="mb-4" />
                <p>Chưa có phiên bản nào được lưu.</p>
                <p className="text-sm">Mỗi khi bạn "Generate", hệ thống sẽ tự động lưu lại tại đây.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">{item.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {new Date(item.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onDeleteSaved?.(item.id)}
                          className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Xóa phiên bản này"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button 
                          onClick={() => onApplySaved?.(item)}
                          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                        >
                          <RefreshCw size={14} /> Khôi phục
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                       <p className="text-[10px] text-slate-400 font-mono line-clamp-3">
                         {item.prompt.substring(0, 300)}...
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper for dynamic colors
const getScoreColor = (score: number, type: 'text' | 'bg'): string => {
  if (score >= 80) return type === 'text' ? 'text-emerald-400' : 'bg-emerald-500';
  if (score >= 50) return type === 'text' ? 'text-yellow-400' : 'bg-yellow-500';
  return type === 'text' ? 'text-red-400' : 'bg-red-500';
};
