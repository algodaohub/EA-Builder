# AlgoDao: Institutional EA Architect

**AlgoDao: Institutional EA Architect** là một công cụ chuyên nghiệp được thiết kế để giúp các nhà giao dịch xây dựng cấu trúc và tạo mã nguồn cho Expert Advisor (EA) trên nền tảng MetaTrader 5 (MT5) một cách nhanh chóng và chính xác bằng trí tuệ nhân tạo.

## 🚀 Tính năng chính

1.  **Cấu hình EA Chuyên sâu (30+ Danh mục)**: Hỗ trợ thiết lập từ các thông số cơ bản (Lot, SL/TP) đến các tính năng nâng cao như Grid, Martingale, News Filter, Trading Sessions, và AI/ML Integration.
2.  **Trợ lý Tư vấn Chiến thuật (AI Consultant)**: Trò chuyện trực tiếp với AI để làm rõ ý tưởng giao dịch. AI sẽ giúp bạn tối ưu hóa logic và tự động điền các thông số cấu hình dựa trên cuộc hội thoại.
3.  **Tạo mã MQL5 Tự động**: Chuyển đổi cấu hình của bạn thành mã nguồn MQL5 hoàn chỉnh, tuân thủ các tiêu chuẩn lập trình chuyên nghiệp.
4.  **Hệ thống Sửa lỗi Thông minh (Auto-Fixer)**: Nếu mã nguồn gặp lỗi khi biên dịch (Compile), bạn chỉ cần dán log lỗi vào, AI sẽ tự động phân tích và sửa lại code cho bạn.
5.  **Quản lý Phiên bản (Versioning)**: Tự động lưu trữ lịch sử các bản build vào Local Storage. Bạn có thể khôi phục lại bất kỳ phiên bản nào trước đó mà không lo mất dữ liệu khi reload trang.
6.  **Mô phỏng Logic (Logic Sim)**: Chạy mô phỏng kiểm tra logic của code trước khi đưa vào MetaEditor để đảm bảo chiến thuật hoạt động đúng như kỳ vọng.

## 🛠 Công nghệ sử dụng

-   **Frontend**: React 18+, TypeScript, Tailwind CSS.
-   **AI Engine**: Google Gemini 3.1 Pro (thông qua `@google/genai`).
-   **Icons**: Lucide React.
-   **Styling**: Tailwind CSS với thiết kế hiện đại, tối ưu cho cả Desktop và Mobile.

## 📦 Cài đặt và Khởi chạy

### Yêu cầu hệ thống
-   Node.js 18+
-   NPM hoặc Yarn

### Các bước cài đặt
1.  Clone dự án về máy:
    ```bash
    git clone <repository-url>
    ```
2.  Cài đặt dependencies:
    ```bash
    npm install
    ```
3.  Khởi chạy môi trường phát triển:
    ```bash
    npm run dev
    ```
4.  Mở trình duyệt tại địa chỉ: `http://localhost:3000`

## 🔑 Cấu hình API Key

Để sử dụng các tính năng AI, bạn cần có Gemini API Key:
1.  Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Tạo API Key mới.
3.  Dán Key vào mục **"Cấu hình API Keys"** trong ứng dụng.

## 💰 Ưu đãi đối tác (AlgoDAOHub)

Khi sử dụng công cụ này, bạn có cơ hội nhận được ưu đãi hoàn tiền giao dịch (Rebate) lên đến **95%** tại các sàn giao dịch đối tác:
-   **LiteFinance**: [Đăng ký tại đây](https://litefinance.com.vn/promo/codes/?code=INVITE_124150283&uid=124150283)
-   **PuPrime**: [Đăng ký tại đây](https://puvip.co/VfiAJn)

**Hỗ trợ trực tiếp:**
-   Telegram: [@daominhtam](https://t.me/daominhtam)
-   Zalo: [0945245115](https://zalo.me/0945245115)

---
*Phát triển bởi AlgoDAOHub - Nâng tầm giao dịch thuật toán.*
