import React from 'react';
import { BookOpen, CheckCircle, Terminal, Play, AlertTriangle, FileCode, Copy, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const guideContent = `
# Hướng dẫn Xây dựng & Biên dịch EA từ A-Z

Chào mừng bạn đến với **AlgoDao Architect**. Đây là quy trình chuẩn để bạn biến một ý tưởng giao dịch thành một Robot (EA) hoạt động thực tế trên MT5.

---

### Bước 1: Hình thành ý tưởng (Tab Tư Vấn)
Nếu bạn chưa rõ ràng về logic, hãy sử dụng tab **"Tư Vấn Ý Tưởng"**. 
- Trò chuyện với AI về phương pháp của bạn.
- AI sẽ giúp bạn tối ưu hóa các điểm vào lệnh, quản lý vốn.
- Sau khi chốt ý tưởng, nhấn **"Dùng nội dung này để cấu hình"**.

### Bước 2: Cấu hình chi tiết (Tab Cấu Hình)
Tại đây, bạn sẽ cụ thể hóa các thông số kỹ thuật:
- **General**: Đặt tên EA, chọn cặp tiền, khung thời gian.
- **Entry Logic**: Mô tả chi tiết điều kiện mua/bán. Bạn có thể dùng nút **"AI Phân Tích"** để AI tự động tích chọn các tính năng phù hợp.
- **Risk Management**: Thiết lập SL/TP, Trailing Stop, hoặc các chiến lược nâng cao như Grid/Martingale.

### Bước 3: Tạo Prompt & Sinh Mã (Tab Prompt)
- Nhấn **"Generate"** để AI tạo ra bản thiết kế kỹ thuật (Prompt).
- Tại tab kết quả, nhấn **"Generate Code"**. AI sẽ viết mã nguồn MQL5 hoàn chỉnh dựa trên cấu hình của bạn.

### Bước 4: Biên dịch trong MetaEditor (MT5)
Đây là bước quan trọng nhất để tạo ra file chạy (.ex5):
1.  **Mở MetaEditor**: Trong MT5, nhấn \`F4\`.
2.  **Tạo File**: Chuột phải vào thư mục \`Experts\` -> \`New File\` -> \`Expert Advisor (template)\` -> Đặt tên.
3.  **Dán Code**: Xóa hết code mặc định trong file mới và dán toàn bộ mã nguồn từ AlgoDao vào.
4.  **Compile**: Nhấn \`F7\`. 
    - Nếu có lỗi (Error): Copy lỗi dán vào tab **"Source Code"** -> **"Báo Lỗi"** để AI sửa.
    - Nếu thành công: Bạn sẽ thấy file EA xuất hiện trong mục Navigator của MT5.

### Bước 5: Kiểm tra & Vận hành
- **Backtest**: Sử dụng Strategy Tester (\`Ctrl+R\`) trong MT5 để kiểm tra dữ liệu quá khứ.
- **Demo**: Chạy trên tài khoản Demo ít nhất 1-2 tuần.
- **Live**: Chỉ chạy tài khoản thật khi đã hiểu rõ hành vi của EA.

---
*Chúc bạn xây dựng được những hệ thống giao dịch thành công!*
`;

export const GuidePanel: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
        <BookOpen className="text-blue-400" size={24} />
        <div>
          <h2 className="font-bold text-white">Trung tâm Hỗ trợ & Hướng dẫn</h2>
          <p className="text-xs text-slate-500">Quy trình xây dựng EA chuyên nghiệp từ con số 0</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-900/50">
        <div className="max-w-3xl mx-auto prose prose-invert prose-emerald prose-headings:text-blue-400 prose-a:text-emerald-400 prose-strong:text-white prose-code:text-emerald-300">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-black mb-8 border-b border-slate-800 pb-4" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2" {...props} />,
              p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-300" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-3 mb-6 text-slate-300" {...props} />,
              li: ({node, ...props}) => <li className="pl-2" {...props} />,
              code: ({node, ...props}) => <code className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-sm" {...props} />,
              hr: () => <hr className="border-slate-800 my-10" />
            }}
          >
            {guideContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
