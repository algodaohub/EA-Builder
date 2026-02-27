import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle, Sparkles, Type } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../../types';

interface ConsultantPanelProps {
  history: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
  onApplyStrategy: (strategy: string) => void;
  isSending: boolean;
}

export const ConsultantPanel: React.FC<ConsultantPanelProps> = ({ history, onSendMessage, onApplyStrategy, isSending }) => {
  const [input, setInput] = useState('');
  const [fontSize, setFontSize] = useState(16); // Default font size
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const msg = input;
    setInput('');
    await onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Extract the last AI message to suggest applying it
  const lastAiMessage = history.length > 0 && history[history.length - 1].role === 'model' 
    ? history[history.length - 1].content 
    : '';

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center flex-wrap gap-4 shrink-0">
        <div>
           <h2 className="font-semibold text-emerald-400 flex items-center gap-2">
             <Sparkles size={18} /> Trợ lý Tư Vấn Chiến Thuật
           </h2>
           <p className="text-xs text-slate-500 mt-1">Dành cho người mới - Mình sẽ giúp bạn làm rõ ý tưởng.</p>
        </div>
        
        {/* Font Size Control */}
        <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
           <Type size={14} className="text-slate-400" />
           <input 
             type="range" 
             min="12" 
             max="28" 
             step="1"
             value={fontSize} 
             onChange={(e) => setFontSize(Number(e.target.value))}
             className="w-24 md:w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
             title="Kéo để chỉnh cỡ chữ"
           />
           <span className="text-xs text-slate-500 font-mono w-8 text-right">{fontSize}px</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5" ref={scrollRef}>
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
            <Bot size={48} className="mb-4 text-emerald-500" />
            <p className="text-center max-w-md text-base">
              Chào bạn! Bạn có ý tưởng gì trong đầu chưa? <br/>
              Ví dụ: "Mình muốn trade Vàng khi RSI quá bán" hay "Đánh Hedging gỡ lệnh"... <br/>
              Cứ nói tự nhiên nhé, mình sẽ giúp bạn trau chuốt nó!
            </p>
          </div>
        )}
        
        {history.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div 
              style={{ fontSize: `${fontSize}px` }}
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-3 shadow-sm transition-all duration-200 break-words overflow-hidden
              ${msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none whitespace-pre-wrap' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              }`}
            >
              {msg.role === 'user' ? (
                // User messages are plain text to avoid markdown "code" background issues
                msg.content
              ) : (
                // AI messages use Markdown with optimized spacing
                <ReactMarkdown 
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1 marker:text-emerald-500/80" {...props} />,
                    code: ({node, ...props}) => <code className="bg-black/20 rounded px-1.5 py-0.5 font-mono text-[0.9em] break-all border border-white/5" {...props} />,
                    pre: ({node, ...props}) => <pre className="bg-slate-950/50 rounded p-2 overflow-x-auto my-2 text-sm font-mono whitespace-pre border border-slate-700" {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isSending && (
           <div className="flex gap-3">
             <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-1">
                <Bot size={18} />
             </div>
             <div className="bg-slate-800 px-5 py-4 rounded-2xl rounded-tl-none border border-slate-700">
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-bounce"></div>
                 <div className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
           </div>
        )}
      </div>

      {/* Action Bar (Apply Strategy) */}
      {lastAiMessage && (
        <div className="px-4 py-3 bg-slate-900/80 backdrop-blur border-t border-slate-800 flex justify-end shrink-0">
          <button 
            onClick={() => onApplyStrategy(lastAiMessage)}
            className="text-sm flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-800/50 hover:bg-emerald-900/50 font-medium"
          >
            <CheckCircle size={16} /> Dùng nội dung này để cấu hình
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ fontSize: `${Math.max(14, fontSize - 2)}px` }}
            placeholder="Mô tả ý tưởng của bạn tại đây... (Shift+Enter để xuống dòng)"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-emerald-500 min-h-[80px] resize-y transition-all duration-200 shadow-inner leading-relaxed break-words"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="absolute right-3 bottom-3 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">AI sẽ hỏi lại để làm rõ phương pháp của bạn. Hãy kiên nhẫn trả lời nhé!</p>
      </div>
    </div>
  );
};