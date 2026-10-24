# Kanji Garden · 漢字の庭

Ứng dụng học Kanji N4 dành cho người Việt, frontend-only. Dữ liệu được chuyển từ hai tài liệu Markdown gốc trong thư mục dự án; không cần tài khoản, API key hoặc backend.

## Chạy trên máy

Trong **PowerShell**, tại `C:\Project\JLPTN4`:

```powershell
npm install
npm run dev
```

Mở địa chỉ Vite in ra, thông thường `http://127.0.0.1:5173`. `npm install` cài các thư viện; `npm run dev` chạy máy chủ phát triển. Cần Node.js 22.12+ hoặc 24 LTS.

## Nội dung và chức năng

- 15 bài mở sẵn, đúng 181 Kanji mục tiêu, 472 mục từ đã gộp trùng, 60 câu ví dụ.
- 120 câu kiểm tra theo bài, 15 câu đọc hiểu, 16 câu luyện bổ sung; 5 bài đọc.
- Khám phá từng chữ; âm On/Kun, Hán Việt, từ ghép, mẹo nhớ, ví dụ, ruby theo từ.
- Nhập cách đọc, chọn cách đọc/chữ/nghĩa/ngữ cảnh, flashcard không chấm, ghép cặp, nghe khi thiết bị có giọng Nhật.
- Tách tiến độ từng kỹ năng; ôn lại từ sai và các mục đến hạn; không tính việc xem thẻ là mastery.
- IndexedDB lưu nguyên tử đáp án và tiến độ; phục hồi phiên sau tải lại; lịch sử không ghi đè.
- Tra cứu Nhật/Việt không dấu; giao diện sáng/tối, chỉnh chữ Nhật và tốc độ đọc.
- Xuất JSON, kiểm tra file nhập, xem trước và xác nhận thay thế; xóa cần hai bước.
- Service worker cache toàn bộ app, dữ liệu và font để học offline sau lần tải thành công. TTS offline phụ thuộc thiết bị.

## Kiểm tra

Chạy các lệnh sau trong thư mục gốc, PowerShell:

```powershell
npm run validate:content
npm run typecheck
npm run lint
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

`validate:content` kiểm tra số lượng, ID, liên kết và đáp án. `typecheck` kiểm tra TypeScript; `lint` kiểm tra mã. `test` kiểm tra scheduler, chấm bài, lưu trữ và backup. `build` tạo bản tĩnh trong `dist`. Lệnh Playwright cài trình duyệt kiểm thử; `test:e2e` chạy luồng người dùng trên bản build.

Để kiểm tra bản production và offline:

```powershell
npm run preview
```

Mở `http://127.0.0.1:4173`, chờ thông báo tải nội dung offline rồi ngắt mạng và tải lại. Service worker chỉ hoạt động trên HTTPS hoặc localhost, không chạy bằng cách mở trực tiếp `index.html` từ File Explorer.

## Cấu trúc

```text
src/
  app/App.tsx                 Router, shell, theme, trạng thái kết nối
  components/common.tsx       Ruby, audio, empty/error state, progress
  features/
    overview.tsx              Trang chủ, thư viện, ôn tập, tiến độ
    lesson.tsx                Khám phá chữ, từ, ví dụ, flashcard, ghép cặp
    practice.tsx              Trình chấm bài, kết quả, đọc hiểu
    settings.tsx              Tùy chỉnh và sao lưu
  data/content.json           Nội dung tĩnh có ID ổn định
  domain/                     Chuẩn hóa đáp án và scheduler
  storage/                    IndexedDB, transaction, backup schema
  styles/app.css              Design tokens, responsive, dark mode
  tests/                      Unit và integration tests
scripts/                      Chuyển nguồn và kiểm tra dữ liệu
e2e/                          Kiểm thử luồng học trên trình duyệt
docs/                         Kiến trúc, rà soát nội dung, nghiệm thu
public/                       Icon và rewrite cho hosting
```

## Cập nhật nội dung

Chỉnh giáo trình gốc rồi chạy `npm run import:content`, `npm run validate:content` và kiểm tra diff của `src/data/content.json` cùng `docs/content-review.json`. Không đổi ID đã có nếu không có kế hoạch migration. Dữ liệu nguồn không được parse tại runtime để chấm bài.

Giữ nghĩa riêng theo bài với các từ trùng có cách diễn đạt khác nhau. `開く` chấp nhận `ひらく` và `あく` đúng như nguồn. Không suy diễn ruby theo từng chữ trong câu dài.

Khóa đáp án nguồn đã được đối chiếu và cấu trúc được kiểm tra tự động. Chưa có thẩm định ngôn ngữ độc lập của giáo viên. Các bài tập không phải đề JLPT chính thức; các mẹo không phải khẳng định từ nguyên.

## Triển khai static hosting

Deploy thư mục `dist`, bật HTTPS và rewrite đường dẫn SPA về `index.html`. Đã có `public/_redirects` cho Netlify và `vercel.json` cho Vercel. Không đặt secret trong mã frontend. Tiến độ gắn với origin của website; chuyển domain/port cần xuất và nhập backup.

Mã hiện được triển khai cục bộ, chưa xuất bản lên dịch vụ hosting.
"# KanjiN4" 
