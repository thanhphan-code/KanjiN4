# Nghiệm thu bản cục bộ

Môi trường: Windows, Node.js 24.11.1, Chromium headless do Playwright quản lý.

## Các kiểm tra đã thực hiện

- 15 bài, 181 Kanji độc nhất, 573 mục từ, 60 ví dụ, 675 câu hỏi, 5 bài đọc; đối chiếu checksum hai nguồn. Phụ lục 262 mục tái sử dụng 161 từ, thêm 101 từ và 524 câu luyện.
- TypeScript và ESLint.
- Unit/integration: chuẩn hóa reading, phân biệt âm đục/trường âm, cách đọc thay thế, scheduler, điều kiện mastery, bỏ qua, transaction chống chấm trùng, hàng đợi đúng kỹ năng, lưu thứ tự câu, schema và backup vòng kín.
- E2E: chọn bài, hoàn thành kiểm tra 8 câu, F5 giữa lượt và khôi phục kết quả, sai vào ôn.
- E2E: Bài 05 / 病, tra bệnh viện không dấu, ẩn ruby, nhập reading.
- E2E: trang chủ 1440/768/390/375/320px, không tràn ngang; đổi dark mode và giữ sau reload.
- E2E: offline sau precache, mở bài trực tiếp, chấm câu trả lời; các trang học/từ vựng/ví dụ/luyện/tra cứu/đọc/cài đặt/tiến độ ở 320px.
- E2E: tải backup, xóa hai bước, nhập bản cũ, xác nhận tiến độ phục hồi; JSON sai bị từ chối.
- Kiểm tra ảnh chụp trang chủ và màn học Bài 05 trên desktop/mobile.
- Bổ sung: build, ESLint, 17 unit/integration và 7 E2E đều đạt. Kiểm tra quiz dùng chung tiến độ từ cũ, sao lưu chế độ mới, nhóm 6 từ, tìm Romaji, che đáp án, F5 và màn hình 320/390/768/1440px. Đã xem ảnh desktop/mobile của tab Từ vựng.
- `npm audit`: không còn lỗ hổng được báo tại thời điểm kiểm tra.

Ảnh do E2E tạo nằm ở `test-results/`, không đưa vào Git. Chạy `npm run build` trước `npm run test:e2e` để kiểm tra đúng mã hiện tại.

## Giới hạn xác minh

Chưa kiểm tra trên Firefox, Safari iOS hoặc thiết bị Android/iPhone thật. Chưa xác minh chất lượng phát âm từng giọng TTS hay thao tác cài PWA trên từng hệ điều hành. Kiểm tra schema và khóa đáp án không thay thế thẩm định ngôn ngữ độc lập. Chưa công bố website lên hosting.

Các giới hạn chức năng còn lại được ghi ở `ARCHITECTURE.md` để tránh nhầm giữa bản hiện có và mọi mục tùy chọn trong PRD.
