# Bổ sung 262 từ vào 15 bài

Nguồn: `BO_SUNG_HOC_TU_VUNG_N4_262_TU_15_BAI_FE.md`.

- 161 mục khớp cách viết và cách đọc được chấp nhận: dùng lại ID, nghĩa gốc và tiến độ.
- 101 mục mới: tổng danh mục 573 từ, vẫn 181 Kanji mục tiêu.
- Các dạng khác nhau như 勉強 và 勉強する giữ riêng vì khác cách đọc và loại từ.
- Theo chủ đề của bảng nguồn; mục ☆ nằm trong Mở rộng. 時計, 電池, 火事 được xếp mở rộng khi thêm liên kết bài mới. Nhãn gốc của từ đã có trong bài được giữ nguyên.
- Giữ nguyên các trường nguồn trong `supplement.entries`; `locale` là metadata ja-JP. お正月 được dùng với cách đọc おしょうがつ, giữ lại しょうがつ của nguồn và hiện ghi chú sửa. Tham khảo: https://kotobank.jp/word/御正月-2016317.
- 524 câu hỏi được tạo từ cách viết/cách đọc của 262 mục. Mỗi từ có câu chọn cách đọc và câu chọn chữ kèm nghĩa để phân biệt đồng âm. Loại cách đọc thay thế hợp lệ khỏi đáp án nhiễu.
- Các câu mẫu/ngữ cảnh soạn thêm trong tài liệu chưa đưa vào ngân hàng chấm điểm; không tự coi chúng là nội dung đã duyệt.

## Giao diện

Vào **Bài học → Từ vựng**, chọn Trọng tâm / Mở rộng / Mới bổ sung / Tất cả / Chưa vững / Đã vững. Mỗi nhóm tối đa 6 từ, có tìm kiếm Romaji, nút che cách đọc/nghĩa, phát âm, quiz và gõ Hiragana. Quiz lưu sau mỗi câu, khôi phục khi tải lại, và dùng chung hàng đợi ôn tập. Việc xem đáp án không đánh dấu thành thạo.

## Các file chính

```text
scripts/supplement-content.mjs   nhập, hợp nhất, tạo câu hỏi và báo cáo
scripts/validate-content.mjs    đối chiếu nguồn, ID, liên kết và đáp án
src/data/content.json           dữ liệu sinh tự động
src/domain/content.ts          hợp đồng dữ liệu và tra cứu metadata
src/features/vocabulary.tsx    nhóm học, tìm kiếm, che đáp án, khởi tạo quiz
src/features/lesson.tsx         tích hợp vào bài hiện tại
src/features/overview.tsx       tra cứu Romaji và nguồn nghĩa
src/storage/db.ts              chế độ luyện bổ sung
src/storage/backup.ts          nhận diện chế độ trong sao lưu
docs/supplement-review.json    thống kê và ánh xạ từng mục nguồn
e2e/supplement.spec.ts          kiểm tra luồng học và responsive
```

Giữ contentVersion 1.0.0 vì bổ sung tương thích, không đổi ID/đáp án cũ; có supplement.revision riêng. Không cần migration IndexedDB. Cố định `masteryWordIds` theo giáo trình gốc để không hạ thành tích khi thêm từ. Quiz cuối bài giữ 8 câu gốc.

Chạy tại `C:\Project\JLPTN4` bằng PowerShell:

```powershell
npm run import:content
npm run build
npm run lint
npm test
npm run test:e2e
```

Importer tái tạo dữ liệu từ hai Markdown; build kiểm chứng cả hai hash và nội dung. Các bài test kiểm tra tiến độ dùng chung, sao lưu, ẩn đáp án, khôi phục phiên và màn hình 320–1440px.
