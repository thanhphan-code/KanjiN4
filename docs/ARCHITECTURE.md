# Thiết kế hệ thống đã triển khai

## Các quyết định chính

1. React + TypeScript + Vite, React Router, CSS variables. Dùng CSS thuần thay Tailwind vì dự án chưa có quy ước và giao diện này không cần thêm một lớp công cụ.
2. Dexie/IndexedDB cho tiến độ, phiên học và cài đặt. Không dùng localStorage làm cơ sở dữ liệu học tập, không có backend hoặc cloud sync.
3. Nội dung JSON tĩnh từ giáo trình. Stable ID chữ `k-病`, từ `w-病院-びょういん`, câu `q-05.01`; từ có nhiều âm được phân biệt bằng mặt chữ và reading. Biến thể cách đọc được giữ từ nguồn.
4. Phần UI mở toàn bộ bài; không tuần, streak, thời hạn, khóa học hoặc quảng cáo.
5. Nền sáng, xanh trà, font Be Vietnam Pro + Noto Sans JP đóng gói tại chỗ. Chữ Kanji là trọng tâm, mỗi lần một chữ. Mobile dùng bốn mục điều hướng và cài đặt ở header.

## Luồng dữ liệu

```text
Giáo trình Markdown
  → scripts/import-content.mjs
  → src/data/content.json + docs/content-review.json
  → scripts/validate-content.mjs
  → React UI / câu hỏi / tra cứu
  → submitAnswer: transaction attempts + progress
  → scheduler từng itemId + skill
  → reviewPlan / tiến độ / backup JSON
```

Không render HTML từ nguồn: toàn bộ chuỗi nội dung qua JSX escaping. Ruby chỉ gắn theo cả từ có reading đã cung cấp. Câu dài có bản đọc độc lập, ẩn mặc định.

## Schema lưu trữ phiên bản 1

| Bảng | Khóa | Chức năng |
|---|---|---|
| progress | `itemId|skill` | Đúng/sai, chuỗi đúng, thời điểm hợp lệ, lịch ôn, trạng thái |
| attempts | UUID | Thứ tự câu/lựa chọn, đáp án, bản nháp, câu hiện tại, thời điểm hoàn tất |
| meta | ID | Preferences, bài gần nhất, chữ đang xem, bài đã mở |

Transaction chặn chấm trùng khi bấm nhiều lần; UI gửi expected item/index để không dùng thao tác từ tab cũ cho câu mới. Hoàn thành khóa attempt cũ; luyện lại sinh UUID mới. Thứ tự chỉ xáo khi tạo, không xáo sau reload. Không lưu toàn bộ giáo trình vào IndexedDB.

## Chính sách học và ôn

- Đúng lần đầu: reviewing, ôn sau 1 ngày.
- Chỉ tăng mốc khi có lần đúng cách thời điểm hợp lệ trước ít nhất 24 giờ: 1 → 3 → 7 → 14 → 30 ngày.
- Mastered cần >=3 lần đúng liên tiếp và >=2 thời điểm hợp lệ cách nhau 24 giờ. Sai xóa chuỗi và bằng chứng tách biệt, trở về learning, đặt hạn 5 phút; mục sai được đưa vào ôn ngay.
- Xem thẻ, ghép cặp và bỏ qua không tạo mastery.
- Kanji vững khi mọi từ ★ liên quan trong bài chính đã vững kỹ năng đọc; nếu không có từ ★ thì dùng các từ ☆ liên quan đã có trong nguồn. Nút luyện ngay trong chi tiết chữ sử dụng cùng tập từ này; đây là chính sách bảo thủ được ghi rõ trong trang Giới thiệu.
- Review giữ kỹ năng đã sai. Với reading, chuyển sang nhập cách đọc; các kỹ năng khác dùng câu nguồn đúng kỹ năng. Câu thiếu target word được lưu theo question ID, không đoán từ liên quan.
- Kiểm tra cuối bài giấu lời giải đến khi kết thúc. Luyện riêng hiển thị ngay sau nộp.
- Độ chính xác bỏ qua câu skipped ở mẫu số; hiển thị riêng đúng/tổng và số bỏ qua.

Các khoảng ôn là heuristic của sản phẩm, không phải khẳng định khoa học tối ưu.

## Backup và bảo vệ dữ liệu

Zod kiểm tra version, ID nội dung, chỉ số câu, lựa chọn, kiểu dữ liệu và giới hạn. File tối đa 10 MB. Bản nhập có preview số bản ghi và cần xác nhận thay thế; xuất dữ liệu cũ trước khi thay. Không gộp event theo cách có thể cộng trùng. Toàn bộ thay thế trong transaction. Xóa dữ liệu có hai bước, yêu cầu nhập `XÓA`.

Không analytics hoặc API ngoài. Font và câu hỏi nằm trong bundle/cache. Không token hoặc secret. Nội dung nguồn không được đánh giá như script.

## Offline và cập nhật

Vite PWA precache app, CSS, JSON đã bundle, font WOFF2 và icon. Cập nhật ở trạng thái chờ, không reload giữa câu học. IndexedDB độc lập cache. Content version không khớp sẽ giữ tiến độ và yêu cầu tạo phiên mới; migration nội dung khác phiên bản cần triển khai trước khi đổi version.

## Giới hạn được giữ minh bạch

- Không chấm phát âm, không giả thứ tự nét, không tự sinh đáp án bằng AI.
- Canvas luyện viết là tùy chọn trong PRD, chưa triển khai.
- Không có Romaji tự động; hỗ trợ IME Hiragana và chuẩn hóa Katakana.
- Sai được đưa vào hàng đợi và có nút luyện lại cuối lượt; chưa tự chèn lại sau 3–5 câu trong cùng attempt để giữ lịch sử lần làm đơn giản.
- Flashcard xem nhanh/ghép cặp không tính điểm; không phục hồi vị trí phiên xem nhanh sau reload. Phiên luyện có chấm và vị trí chữ đã được lưu.
- Ba bài kiểm tra chặng nằm ngoài quiz 15 bài chưa đưa lên UI; vẫn giữ nguyên trong nguồn gốc.
- TTS, giọng Nhật, offline speech và cài đặt PWA khác nhau giữa trình duyệt; cần QA thiết bị thật.

## Tài liệu kỹ thuật đã đối chiếu

- [Vite](https://vite.dev/guide/)
- [Dexie React](https://dexie.org/docs/Tutorial/React)
- [Vite PWA](https://vite-pwa-org.netlify.app/guide/)
