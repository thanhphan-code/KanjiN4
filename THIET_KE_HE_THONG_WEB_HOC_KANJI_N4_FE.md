# ĐẶC TẢ THIẾT KẾ HỆ THỐNG WEB HỌC KANJI N4 — FRONTEND-ONLY

> **Tên dự án đề xuất:** KANJI GARDEN — 漢字の庭  
> **Loại tài liệu:** Product Requirements Document (PRD) + UX/UI Specification + Frontend Technical Design + Acceptance Criteria  
> **Phiên bản:** 1.0 · **Ngôn ngữ giao diện:** Tiếng Việt; nội dung học: Nhật–Việt  
> **Nguồn nội dung gốc:** `Kanji_N4_181_15_Bai_Giao_Trinh_Hoan_Chinh.md` (181 Kanji, 15 bài).  
> **Phạm vi:** Thiết kế và xây dựng **một website học Kanji N4 độc lập, chỉ cần frontend**; không backend, không yêu cầu tài khoản, không phụ thuộc ứng dụng học tập khác.  
> **Quy tắc tổ chức:** **Chỉ chia theo BÀI HỌC**. Người học tự chọn bài và học theo tốc độ của mình. **KHÔNG có lịch học theo tuần, khóa học theo tuần, hạn hoàn thành theo ngày hoặc tiến độ ép buộc**.

---

## 0. Quyết định sản phẩm (đọc trước khi code)

1. **Đối tượng:** người Việt đang học Kanji phục vụ trình độ JLPT N4; có thể vừa học N5 xong hoặc đang ôn lại chữ đã biết.
2. **Mục tiêu chính:** học **nhận diện chữ → nhớ cách đọc → hiểu nghĩa → dùng được trong từ ghép/câu → nhớ lâu**. Không biến ứng dụng thành trang chỉ lật flashcard.
3. **Nội dung chuẩn:** đúng **15 bài theo chủ đề** và **181 Kanji** của nguồn. Chữ Kanji trong các từ ghép mở rộng có thể nằm ngoài tập 181 chữ: cần đánh dấu rõ, không tự động tính thành Kanji mục tiêu.
4. **Đường học ngắn:** `Chọn bài → Học từ → Luyện chủ động → Kiểm tra → Nhận kết quả → Ôn từ sai`. Mọi chức năng phụ hỗ trợ đường học này.
5. **Ưu tiên trải nghiệm:** mobile-first; dùng tốt trên điện thoại và desktop; không có quảng cáo, không hiệu ứng gây phân tâm, không pop-up ép đăng nhập.
6. **Không bắt buộc trả phí / API / AI.** Không cần kết nối tài khoản. Mọi nội dung cốt lõi và bài tập phải chạy được khi không có API key.
7. **Không hứa hẹn sai:** hoàn thành 15 bài không đồng nghĩa vượt qua toàn bộ JLPT N4; đây là website học Kanji/từ vựng, không thay thế học ngữ pháp và luyện nghe tổng quát.
8. **Bài học mở toàn bộ từ đầu.** Có nút “Học tiếp” theo bài đang làm nhưng không khóa bài khác; không đặt ngày hoặc tuần học.
9. **Nội dung phải có nguồn và kiểm duyệt.** Không tự tạo nghĩa, cách đọc, ví dụ hoặc đáp án thiếu căn cứ trong ứng dụng khi chạy.
10. **Kết quả học ghi nhận theo từng kỹ năng; chỉ xem lời giải hoặc lật thẻ không được tính là đã thuộc.**

### In scope / Out of scope

| Bắt buộc | Không thuộc phiên bản này |
|---|---|
| 15 bài, 181 Kanji, từ ghép, Hiragana, nghĩa Việt, ví dụ, luyện tập, đọc ngắn, ôn tự động, lưu tiến độ | Đăng ký/đăng nhập, server, API trả phí, mạng xã hội, chat, bảng xếp hạng |
| TTS giọng Nhật nếu trình duyệt/thiết bị hỗ trợ, PWA/offline cho phần nội dung, xuất/nhập tiến độ | Chấm phát âm bằng AI, nhận diện nét bút Kanji tự động, live lớp học |
| Kiểm tra JLPT-style bằng câu hỏi do tài liệu cung cấp | Tự quảng cáo là đề chính thức JLPT hoặc tự tạo “đề thật” |

---

## 1. Tiêu chuẩn thành công

Một người dùng mới phải có thể:

- Vào trang, nhìn thấy **15 bài**, hiểu rõ tên chủ đề và bắt đầu bài bất kỳ mà **không cần tài khoản**.
- Học một chữ, thấy rõ **Kanji lớn, âm On/Kun, cách đọc ưu tiên, Hán Việt, nghĩa Việt**, từ ghép minh họa, phát âm từ/câu và ví dụ có furigana khi cần.
- Chuyển ngay sang **flashcard chủ động, nhập cách đọc, chọn Kanji đúng, chọn nghĩa, ghép cặp, luyện ngữ cảnh, bài đọc ngắn**.
- Sau mỗi câu biết **đúng/sai vì sao**, không chỉ một dấu tích; khi sai được đưa vào hàng đợi ôn.
- Thoát giữa chừng, tải lại trang, quay lại đúng bài/câu đang làm, **không mất tiến độ**.
- Xem riêng danh sách **từ chưa vững**, luyện lại theo nhu cầu; từ đúng nhiều lần tự động xuất hiện thưa dần.
- Điều chỉnh ẩn/hiện Hiragana, âm thanh, tốc độ đọc, kích thước chữ; dùng bằng bàn phím và màn hình cảm ứng.

### Chỉ số chất lượng sản phẩm (để kiểm thử, không hiển thị ép buộc)

| Chỉ số | Mục tiêu |
|---|---|
| Tải được toàn bộ 15 bài | 100% |
| Kanji mục tiêu độc nhất | 181/181; mỗi chữ thuộc một bài chính |
| Lưu/khôi phục tiến độ sau tải lại | Không mất dữ liệu trong thử nghiệm chuẩn |
| Trắc nghiệm | Một đáp án đúng, lời giải khớp dữ liệu, không trùng lựa chọn |
| Câu tiếng Nhật | Render đúng Unicode, ruby, xuống dòng trên mobile |
| Học offline | Nội dung/bài đã đóng gói truy cập được sau lần cài/tải đầu thành công |
| Dùng không chuột | Luồng quan trọng thao tác bàn phím được |
| Màn hình điện thoại | Không tràn ngang ở 320px, 375px, 390px |

---

## 2. Cấu trúc nội dung bài học — BẮT BUỘC GIỮ 15 BÀI

**Không lập khóa học theo tuần.** Danh sách bài học được hiển thị theo thứ tự dưới đây, nhưng cho phép vào mọi bài.

| Bài | Tên chủ đề | Số Kanji |
|---|---|---:|
| 01 | Thời gian & Mùa | 13 |
| 02 | Thiên nhiên | 11 |
| 03 | Địa danh & Nơi chốn | 12 |
| 04 | Màu sắc, Động vật & Ăn uống | 13 |
| 05 | Cơ thể & Sức khỏe | 13 |
| 06 | Gia đình & Con người | 11 |
| 07 | Nhà & Công trình | 11 |
| 08 | Di chuyển | 13 |
| 09 | Học tập | 12 |
| 10 | Ngôn ngữ & Tư duy | 11 |
| 11 | Công việc & Kinh doanh | 13 |
| 12 | Hành động hằng ngày | 13 |
| 13 | Trạng thái & Tính từ | 14 |
| 14 | Âm nhạc, Nghệ thuật & Đời sống | 10 |
| 15 | Từ trừu tượng hay gặp | 11 |
| **Tổng** | | **181** |

### Cấu trúc chuẩn của MỘT bài

1. **Tổng quan bài:** tên chủ đề, số Kanji, số từ trọng tâm, % đã học, số mục đến lượt ôn; CTA “Bắt đầu/Tiếp tục”.
2. **Kanji cần học:** dạng thẻ nhỏ dễ quét. Bấm thẻ mở chi tiết: âm On/Kun (chỉ những âm trong dữ liệu), Hán Việt, nghĩa, từ liên quan, nhóm dễ nhầm.
3. **Từ vựng & từ ghép:** chia **Trọng tâm ★** và **Mở rộng ☆**; bật bộ lọc `Tất cả / Trọng tâm / Mở rộng / Chưa thuộc / Đã thuộc`.
4. **Ví dụ trong câu:** câu Nhật, Furigana có thể bật/tắt, nút nghe và bản dịch tiếng Việt ẩn mặc định trong chế độ tự luyện.
5. **Mẹo nhớ & lưu ý:** mẹo liên tưởng ngắn, trái nghĩa/gần nghĩa, chữ hay nhầm. Gắn nhãn “Mẹo nhớ” thay vì mô tả chắc chắn về từ nguyên.
6. **Chế độ học:** các chế độ trong mục 4; bài nào thiếu dữ liệu của chế độ đó thì thông báo và ẩn lựa chọn, tuyệt đối không tạo câu sai.
7. **Kiểm tra cuối bài:** trắc nghiệm do dữ liệu bài học cung cấp; kết quả và giải thích rõ.
8. **Ôn lại:** ưu tiên mục làm sai, mục đến lượt ôn, mục chưa vững; có nút chọn “Ôn bài này” và “Ôn tất cả bài đã học”.

### Nguyên tắc nhập và quản lý dữ liệu từ tài liệu Markdown

- Nguồn có bảng Kanji, từ vựng, các mục ★/☆, 4 ví dụ/bài, câu hỏi ABCD, bài đọc ngắn và các lưu ý. **Dùng chúng làm điểm khởi đầu**; không được coi tách Markdown bằng regex là đủ bảo đảm dữ liệu học đúng.
- Xây **pipeline chuyển Markdown sang JSON có cấu trúc** lúc build/dev, không parse Markdown để chấm bài ở runtime. Nếu parser chưa đủ tin cậy, ưu tiên biên tập thủ công dữ liệu JSON đã được rà soát.
- Mỗi mục từ có **ID ổn định**. Từ lặp ở nhiều bài phải dùng chung `vocabularyId`, liên kết nhiều bài qua `lessonIds`, tránh học 2 bản ghi khác nhau và sai số tiến độ.
- Mọi câu hỏi phải có `correctOptionId` và `explanationVi`; **không đảo chữ A/B/C/D rồi giữ lại đáp án cũ**.
- Các ví dụ được thêm sau này phải đi qua kiểm tra tiếng Nhật. Không tự suy đoán hiragana từ Kanji bằng cách thay ký tự một-một; đọc biến đổi theo từ/câu.
- **Bất kỳ chữ nào ngoài 181 Kanji** xuất hiện trong từ vựng/câu vẫn hiển thị, nhưng có nhãn “Kanji mở rộng”. Không tăng số lượng 181 trong dashboard.
- Phải giữ đúng **nghĩa tiếng Việt đã cung cấp**; nếu cần cải thiện ngữ nghĩa thì ghi thay đổi minh bạch trong file rà soát nội dung, không sửa âm thầm.
- Không đưa mục “tuần học”, “lịch 5 tuần” hoặc hướng dẫn về nền tảng khác của tài liệu nguồn lên giao diện website.

---

## 3. Kiến trúc thông tin và điều hướng

### Sitemap đề xuất

```text
/
├── Trang chủ / Tổng quan
├── /lessons                         Danh sách 15 bài
│   └── /lessons/:lessonId           Tổng quan 1 bài
│       ├── /kanji                   Danh sách Kanji của bài (tab)
│       ├── /vocabulary              Từ vựng/từ ghép (tab)
│       ├── /examples                Câu ví dụ + đọc
│       ├── /practice/:mode          Các chế độ luyện bài
│       ├── /quiz                    Bài kiểm tra cuối bài
│       └── /results/:attemptId      Kết quả lần làm
├── /review                          Ôn tập tự động tất cả bài đã học
├── /library                         Tra cứu toàn bộ Kanji và từ vựng
│   ├── /kanji/:kanjiId              Chi tiết Kanji
│   └── /words/:vocabId              Chi tiết từ ghép
├── /reading                         Bài đọc ngắn
│   └── /:passageId                  Đọc + câu hỏi
├── /progress                        Tiến độ học
├── /settings                        Tùy chỉnh trải nghiệm, sao lưu dữ liệu
└── /about                           Giới thiệu/phạm vi tài liệu
```

**Trên mobile:** bottom navigation tối đa 4 mục chính: `Học bài` · `Ôn tập` · `Tra cứu` · `Tiến độ`. `Cài đặt` nằm trong menu hoặc avatar biểu tượng trung tính, **không cần tài khoản**.  
**Trên desktop:** sidebar gọn + header thanh tìm kiếm. Không cần menu nhiều tầng.  
**Deep link:** đường dẫn mở trực tiếp bài/chữ/từ phải hoạt động sau F5 khi deploy SPA (cấu hình rewrite về `index.html`).

### Trang chủ

Không làm dashboard phức tạp. Chỉ cần:

- Heading: **“Học Kanji N4, nhớ từng chữ một.”**
- Ô ngắn: `Đã học X/181 Kanji` · `Từ cần ôn Y` · `Bài đang học Z`.
- CTA chính: `Học tiếp bài đang học` (nếu mới thì `Bắt đầu Bài 01`).
- CTA thứ hai: `Ôn những từ chưa nhớ` (ẩn/disabled có mô tả nếu chưa có dữ liệu).
- Danh sách 15 bài (hiển thị grid); mỗi card: số bài, chủ đề, tổng Kanji, trạng thái tiến độ, nút vào bài.
- Không bắt nhập tên, không hỏi mục tiêu ngày, không có streak gây áp lực.

### Trang tổng quan bài học

Phần đầu trang cho thấy chính xác người học sắp làm gì:

```text
← Tất cả bài học                         [Tùy chỉnh]

BÀI 05 — CƠ THỂ & SỨC KHỎE
13 Kanji  ·  Từ vựng trọng tâm  ·  4 câu ví dụ

[Học từ vựng]    [Luyện tập]    [Kiểm tra bài]

Tiến độ bài: █████░░░  6/13 Kanji đã nắm vững cách đọc

Kanji cần học:  医 院 体 頭 顔 首 心 病 薬 力 強 弱 死

[Từ vựng] [Câu ví dụ] [Mẹo nhớ] [Kết quả]
```

Chỉ dùng tỷ lệ `6/13` minh họa UI; dữ liệu thực tế phải tính từ tiến độ người dùng.

---

## 4. Các chế độ học — chức năng cốt lõi

### 4.1. Chế độ A — Khám phá Kanji (Learn)

**Mục đích:** hiểu chữ và từ trước khi bắt đầu được chấm.

- Bài học mở với tối đa một Kanji làm nội dung chính/trang, không nhồi bảng dài trên màn hình nhỏ.
- Kanji phóng lớn; dưới là **Hán Việt · Nghĩa chính**, âm On/Kun dễ phân biệt, cách đọc ưu tiên in đậm.
- Có ít nhất 1–2 từ ghép liên quan nếu có dữ liệu; bấm từ mở popover hoặc trang chi tiết.
- Phần “Ghép từ này có nghĩa gì?” đặt cách giải thích ngắn; không khẳng định mọi từ ghép = cộng nghĩa từng chữ.
- Hiện 1 câu ứng dụng, ẩn bản dịch đến khi chạm “Xem nghĩa”.
- Nút `Nghe từ` / `Nghe câu` (phát từ/câu cụ thể theo `ja-JP`, **không mặc định đọc Kanji đơn lẻ có nhiều âm**).
- Nút `Trước` / `Tiếp` và danh sách chọn chữ.
- **Chỉ mở thẻ/xem chữ = đã xem (seen), KHÔNG tính là đã thuộc (mastered).**

### 4.2. Chế độ B — Flashcard gợi nhớ chủ động

Mặt trước có thể là `Kanji/từ ghép`, mặt sau là `Hiragana + nghĩa Việt + ví dụ`.

**Hai cách chạy:**

- **Xem lại nhanh (không chấm):** lật mặt trước/sau; ghi nhận chỉ “đã xem”.
- **Flashcard thử nhớ (có chấm tự động):** trước khi lật, người học phải chọn nghĩa hoặc nhập cách đọc; hệ thống chấm → lưu đúng/sai. Không có bốn nút tự đánh giá khó/dễ.

Tùy chỉnh: `Kanji → Nghĩa`, `Kanji → Hiragana`, `Hiragana → Kanji`, `Việt → Kanji` (đảo chiều chỉ bật khi câu hỏi có đáp án đơn trị). `Mở rộng ☆` bật bằng bộ lọc.

**Quy tắc:** thẻ có nhiều cách đọc hợp lệ phải hỏi trong **ngữ cảnh từ vựng**, không hỏi “một chữ này đọc thế nào” mà chỉ chấp nhận một âm.

### 4.3. Chế độ C — Nhập cách đọc Hiragana (Recall)

Hiện: `病院 → [____________]` → đáp án: `びょういん`.

- Có nút chọn bàn phím; hỗ trợ nhập qua IME tiếng Nhật trên thiết bị.
- Có tùy chọn cho phép **Romaji nhập vào được chuyển sang Hiragana** bằng thư viện đáng tin cậy, sau đó so sánh dữ liệu chuẩn; không tự viết thuật toán Romaji sơ sài (っ, ん, ょ, trường âm).
- Chuẩn hóa Unicode `NFKC`, khoảng trắng thừa; chuyển Katakana thành Hiragana ở nơi phù hợp; **không bỏ bừa trường âm, âm ghép, âm đục**, tránh chấm sai thành đúng.
- Cho phép danh sách `acceptedReadings` đã kiểm duyệt nếu một từ có biến thể hợp lệ.
- Sau khi chấm: đáp án, phiên âm và một mẹo nhớ ngắn.
- Nút `Bỏ qua` ghi là chưa trả lời, không tính đúng.

### 4.4. Chế độ D — Chọn Kanji đúng (Orthography)

Hiện `びょういん` cùng 4 lựa chọn; chỉ một đáp án đúng. Các phương án nhiễu phải **có trong ngân hàng đã kiểm duyệt**, không ghép ngẫu nhiên ký tự để tạo từ không tồn tại khi câu hỏi yêu cầu từ thông dụng.

### 4.5. Chế độ E — Chọn nghĩa & sử dụng trong câu

- Kanji/từ → 4 nghĩa Việt.
- Điền từ còn thiếu vào câu Nhật ngắn với 4 đáp án.
- Chọn câu dùng từ **đúng ngữ cảnh** nếu nguồn có câu hỏi dạng này.
- Tìm từ/cụm gần nghĩa (言い換え) nếu được biên soạn và xác minh.
- Luôn giải thích **vì sao đáp án đúng**; riêng câu dễ nhầm cần giải thích ngắn lý do các đáp án nhiễu không phù hợp.

### 4.6. Chế độ F — Ghép cặp (Matching)

- 4–6 cặp mỗi lượt; ghép `Kanji ↔ Hiragana` hoặc `Kanji ↔ nghĩa`.
- Trên mobile có thể chạm lần lượt 2 thẻ thay vì kéo thả; kéo thả chỉ là nâng cao.
- Ghép sai: lắc nhẹ tối đa một lần + giải thích/đánh dấu; ghép đúng: đánh dấu gọn.
- Một cặp có cách đọc/ý nghĩa trùng nhau cần được xử lý tránh ghép đa nghĩa gây mơ hồ.
- **Không dùng game ghép cặp đơn thuần để đánh dấu thành thạo hoàn toàn**; chỉ đóng góp một phần bằng chứng nhận diện.

### 4.7. Chế độ G — Luyện nghe–chọn từ (Listening recognition)

- TTS phát **một từ/câu Nhật**; người học chọn cách viết Kanji/đáp án tương ứng trong 4 lựa chọn.
- Cho phép nghe lại; tự chọn tốc độ giọng nếu trình duyệt cho phép.
- Nếu thiết bị không có giọng Nhật, **vô hiệu hóa chế độ** kèm thông báo và vẫn cho các chế độ khác dùng được.
- Không chấm phát âm người học; không xin quyền micro.
- Chỉ dùng từ/câu có **chuỗi đọc đã xác minh**; TTS trình duyệt có thể phát âm một số chữ/tên riêng khác với dữ liệu, cần QA trên Chrome/Safari/Android/iOS.

### 4.8. Chế độ H — Luyện viết và nhớ hình chữ

**MVP trung thực:** hiển thị lưới giấy nháp để người học viết chữ bằng chuột/touch; bấm `Hiện mẫu` để tự đối chiếu với Kanji chuẩn.

- Hỗ trợ xóa nét, viết lại, đổi độ dày, tải ảnh bài viết (tùy chọn).
- **Không tự động chấm nét/độ chính xác**, không đưa việc tự xem mẫu vào điểm mastery.
- Không dựng animation thứ tự nét giả nếu chưa có dữ liệu nét chuẩn được cấp phép.
- Đây là tính năng tùy chọn sau các chế độ cốt lõi.

### 4.9. Chế độ I — Đọc hiểu ngắn (Reading)

Dùng **5 bài đọc** hiện có từ giáo trình để tạo trang đọc:

- Đoạn Nhật gốc, ruby chỉ bật khi người học yêu cầu.
- Nút `Nghe đoạn` nếu có TTS phù hợp; có nút tạm dừng và nghe lại.
- Tô sáng từ trong bộ 181 chữ/từ ghép, bấm từ mở nghĩa/cách đọc mà không rời bài đọc.
- Các câu hỏi kiểm tra nội dung đọc; không tự tạo câu hỏi mới khi chưa được kiểm duyệt.
- Chỉ hiện bản dịch sau khi người học đã đọc hoặc chủ động bấm “Xem bản dịch”.
- Kết quả đọc hiểu ghi thành skill `readingContext`, không nhập nhằng với nhớ Kanji.

### 4.10. Chế độ J — Kiểm tra cuối bài (Lesson Quiz)

- Lấy câu trắc nghiệm có sẵn thuộc bài; **8 câu/bài** theo tài liệu hiện hành.
- Khi nhập đúng ngân hàng có thể tạo **bộ kiểm tra kết hợp** (đọc chữ, nhận dạng Kanji, nghĩa, ngữ cảnh, diễn đạt tương đương, cách dùng) nếu các câu được duyệt.
- Mỗi câu chỉ có một đáp án đúng; đảo vị trí phương án **cùng với ID**, không đổi `correctOptionId`.
- Cho phép điều hướng câu, tạm lưu bài làm, nộp bài, xem đáp án và câu sai.
- Có chế độ `Luyện` (xem giải thích từng câu) và `Kiểm tra` (chỉ hiện lời giải khi nộp).
- Không buộc đồng hồ đếm ngược. `Luyện áp lực thời gian` là tùy chọn trong Cài đặt nếu muốn phát triển sau.
- Không khẳng định bài test ngắn là chứng chỉ/năng lực N4 tổng thể.

### 4.11. Chế độ K — Ôn tập thông minh (Review)

Đây là cơ chế giúp **nhớ lâu** quan trọng nhất; nên có ở phiên bản đầu tiên.

- Có hai phạm vi: `Ôn bài này` và `Ôn tất cả các bài đã học`.
- Ưu tiên mục **đến lượt ôn → mục sai gần đây → mục chưa chứng minh được nhớ → mục mới**.
- Bài ôn sử dụng **nhiều kiểu hỏi** cho cùng mục (đọc, nghĩa, viết chữ, ngữ cảnh) để tránh học thuộc vị trí đáp án.
- Kết quả chấm tự động cập nhật trạng thái; không yêu cầu nhấn `Again/Hard/Good/Easy` hay chấm khó/dễ thủ công.
- Có nút `Ôn ngay` bất kỳ lúc nào, kể cả chưa đến lượt; thao tác học không bị khóa theo lịch.
- Mục sai hiện giải thích và quay lại sau một số câu khác trong phiên; không lặp tức thì gây cảm giác “vừa xem đáp án là đúng”.
- Không hiện lịch học tuần/tháng. **Lịch lặp là thông tin nội bộ để chọn từ ôn**, không là lịch học mà người dùng phải tuân theo.

---

## 5. Logic học thuộc / chống quên (chi tiết để lập trình)

### 5.1. Tiến độ học theo kỹ năng (không gộp sai)

**Mỗi từ vựng / Kanji** nên theo dõi ít nhất:

- `readingRecognition`: nhận ra cách đọc trong từ.
- `meaningRecognition`: hiểu nghĩa.
- `orthography`: từ Hiragana chọn/nhập Kanji.
- `contextUsage`: hiểu và dùng trong câu.

**Một Kanji “đã nắm vững” trên giao diện** khi phần *cốt lõi* (nhận diện cách đọc ở ít nhất một từ thường gặp + hiểu nghĩa) đã vượt ngưỡng; không yêu cầu đồng thời nắm hết các âm On/Kun hiếm.

### 5.2. Trạng thái

| Trạng thái | Ý nghĩa | UI |
|---|---|---|
| `new` | Chưa làm bài được chấm | Chưa học |
| `learning` | Đã làm, chưa đủ kết quả ổn định | Đang học |
| `reviewing` | Đã đúng nhưng cần kiểm tra lặp lại | Cần củng cố |
| `mastered` | Đã đúng ổn định ở nhiều lần riêng biệt | Đã nhớ |

Không tính chỉ số `seen` là `mastered`. Một câu đúng duy nhất cũng chưa được đánh dấu “đã nhớ”.

### 5.3. Thuật toán đơn giản, dễ hiểu và kiểm thử được

Phiên bản đầu **không cần thuật toán FSRS phức tạp**. Có thể sử dụng một scheduler xác định được:

```text
Khi trả lời đúng:
  - Tăng consecutiveCorrect; lưu timestamp.
  - Nếu từ trước chưa có bằng chứng nhớ: lần ôn tiếp theo sau ~1 ngày.
  - Nếu đã đúng ở các lần cách biệt nhau: tăng khoảng ôn (ví dụ 1 → 3 → 7 → 14 → 30 ngày).
  - Chỉ chuyển mastered khi đạt ngưỡng: >= 3 lần đúng hợp lệ,
    ở >= 2 phiên/thời điểm tách biệt, không sai gần đây.

Khi trả lời sai:
  - Đặt consecutiveCorrect về 0.
  - Ghi tăng số lần sai; đưa về learning.
  - Đưa vào hàng đợi ôn ngắn (ví dụ sau 3–5 câu trong phiên),
    sau phiên đặt lần ôn tiếp theo sớm hơn.

Khi bỏ qua hoặc chỉ lật thẻ:
  - KHÔNG tính là đúng, không nâng mức độ thành thạo.

Nếu ôn trước ngày đến lượt:
  - Vẫn cho làm; dùng kết quả để cập nhật trạng thái,
    nhưng không tăng khoảng ôn quá nhanh chỉ vì làm nhiều lượt liên tiếp.
```

**Quan trọng:** `1/3/7/14/30 ngày` là **khoảng lặp nội bộ được dùng khi cần**, không tạo “kế hoạch học 5 tuần”. Các mốc là heuristic sản phẩm, không tuyên bố đây là công thức khoa học tối ưu cho tất cả mọi người.

### 5.4. Tránh học vẹt

- Không chỉ hỏi Kanji → tiếng Việt; phải kết hợp Kanji → Hiragana → nghĩa → dùng trong câu.
- Đáp án trắc nghiệm có thể được hoán vị bằng seed khi tạo phiên; không thay đổi đáp án sau khi người học đã bắt đầu.
- Câu hỏi lặp nên ưu tiên *mẫu khác* cùng từ nếu có dữ liệu.
- Đánh dấu “dễ nhầm” với cặp như `暑い/熱い`, `早い/速い`, `市立/私立`, `借りる/貸す`, `着く/着る`.
- Luyện nghe ưu tiên từ/câu trong ngữ cảnh; không tự suy đoán cách phát âm riêng cho một Kanji đa âm.
- Không để người học xem `answer` trước khi nộp nếu đang ở chế độ kiểm tra.

### 5.5. Tính % học và kết quả

**Tỷ lệ thuộc Kanji trong bài:** `kanjiMastered / totalKanji * 100`; làm tròn hiển thị; không lấy % số trang đã lướt.

**Độ chính xác**: `correctGradedAnswers / allGradedAnswers`; không tính câu bỏ qua như đúng; có thể hiện `skipped` riêng.  
**Bài hoàn thành học:** có thể đánh dấu `đã làm kiểm tra` riêng với `đã thuộc 100%`; không tự đánh đồng.  
**Từ đến lượt ôn:** `nextReviewAt <= now` của các mục đã từng thực sự làm bài.

---

## 6. UX/UI Design System — đẹp, nhẹ, tinh tế kiểu Nhật

### 6.1. Định hướng phong cách

- **Phong cách:** Japanese minimalism / editorial learning app: nền giấy sáng, khoảng trắng thoáng, đường viền mảnh, ít trang trí.
- **Cảm giác:** bình tĩnh, tập trung, hữu ích, gần gũi; **không biến thành trang game trẻ em**.
- **Giao diện tiếng Việt 100%** cho điều hướng và giải thích; Kanji/Hiragana rõ ràng với phông Nhật phù hợp.
- **Một CTA chính mỗi màn hình**; CTA phụ dùng outline/ghost. Không có carousel quảng cáo.
- **Tập trung chữ:** Kanji phải là nhân vật chính; ví dụ và Hiragana đọc dễ ngay trên điện thoại.

### 6.2. Design tokens tham khảo

```css
:root {
  --bg: #FAF8F3;                /* giấy gạo */
  --surface: #FFFFFF;
  --surface-muted: #F3F0E9;
  --text: #242725;
  --text-secondary: #68736D;
  --primary: #2F6355;           /* xanh trà đậm */
  --primary-hover: #254F43;
  --accent: #B78351;            /* nâu gỗ nhạt */
  --danger: #B4504C;
  --success: #32735A;
  --border: #E5E3DC;
  --focus: #245C9B;
  --radius-card: 16px;
  --radius-control: 10px;
  --max-content: 1200px;
}
```

> Màu sắc chỉ là đề xuất. Kiểm tra tương phản văn bản và trạng thái theo WCAG 2.2 AA; **không dùng màu đơn độc** để diễn đạt đúng/sai.

### 6.3. Typography

- Kanji và chữ Nhật: ưu tiên font hỗ trợ Nhật (ví dụ **Noto Sans JP**) với fallback hệ thống.
- UI tiếng Việt: font sans dễ đọc, thống nhất theo hệ thống; không dùng nhiều hơn 2 font-family.
- Kanji chi tiết: desktop 88–112px, mobile 72–88px (co giãn bằng `clamp`).
- Từ ghép: desktop 36–52px, mobile 32–42px.
- Body: khoảng 15–17px, line-height 1.6–1.8; nút không nhỏ hơn vùng chạm mục tiêu dễ thao tác.
- Hiragana/ruby phải nhìn được trên màn hình nhỏ, không chồng chữ; cho phép tăng cỡ chữ Nhật.

### 6.4. Furigana chuẩn

Dùng HTML semantic ruby khi có dữ liệu căn chỉnh:

```html
<ruby>病院<rt>びょういん</rt></ruby>
```

- Nút chuyển `Hiện Furigana / Ẩn Furigana` ở đầu bài, ghi nhớ trong setting.
- Khi che cách đọc trong bài kiểm tra **phải che cả ruby**, không chỉ CSS opacity một lớp trong khi screen reader vẫn đọc lộ đáp án; dùng dữ liệu câu hỏi chỉ chứa thông tin được phép hiện.
- **Không tự động gắn Furigana theo từng ký tự** bằng cách đoán âm; từ ghép có âm biến đổi. Với câu chưa có phân đoạn token/ruby kiểm duyệt: hiển thị câu gốc và phần đọc đầy đủ ở nút “Xem cách đọc”, không gắn ruby sai.
- Khi đọc mẫu/kana-only: giữ bản đọc Nhật riêng biệt, không sửa văn bản gốc.

### 6.5. Responsive

| Khung | Bố cục |
|---|---|
| Mobile < 640px | 1 cột; bottom navigation; card chữ lớn; nút `Tiếp` sticky phía dưới trên màn luyện tập |
| Tablet 640–1023px | 2 cột danh sách bài, 1–2 cột nội dung luyện |
| Desktop ≥ 1024px | Sidebar 240px, nội dung học căn giữa max-width 840–920px; danh sách bài 3 cột |

Các thanh cố định không được che đáp án, nút tiếp hoặc bàn phím trên màn hình nhỏ; phải xử lý safe area cho iPhone.

### 6.6. Thành phần giao diện cần có

| Component | Yêu cầu |
|---|---|
| `AppShell` | Layout desktop/mobile, focus management, menu |
| `LessonCard` | Tên, số chữ, mức hoàn thành, CTA |
| `KanjiTile` | Chữ, nhãn trạng thái, bấm mở chi tiết |
| `KanjiDetail` | Chữ lớn, On/Kun, Hán Việt, nghĩa, liên hệ từ |
| `VocabularyRow` | Từ, ruby (tùy chọn), nghĩa, phát âm, mức ★/☆ |
| `JapaneseText` | Ruby/token có kiểm duyệt, hỗ trợ ẩn/hiện |
| `AudioButton` | Trạng thái loading/playing/unavailable, stop trước khi phát tiếp |
| `Flashcard` | Có mặt trước/sau, bàn phím/touch, không lật vô tình |
| `AnswerChoice` | Đáp án radio/pressable có keyboard, trạng thái đúng/sai |
| `QuizPlayer` | Số câu, điều hướng, nộp bài, tiếp tục bài dang dở |
| `PracticeResult` | Tóm tắt câu đúng/sai, lý do, từ cần ôn |
| `ReviewQueue` | Chỉ hiển thị từ đến lượt ôn/sai/chưa vững |
| `ProgressBar` | Nêu rõ số lượng thực, không chỉ % |
| `SearchBox` | Tìm Kanji/Hiragana/Việt/Hán Việt |
| `EmptyState` | Chưa có dữ liệu, chưa bắt đầu, không có từ cần ôn |
| `SettingsPanel` | TTS, ruby, cỡ chữ, chế độ tối, sao lưu dữ liệu |

### 6.7. Interaction & microcopy

- Nút học: `Bắt đầu học`, `Học tiếp`, `Luyện cách đọc`, `Làm bài kiểm tra`, `Ôn từ chưa nhớ`.
- Sau đúng: `Đúng rồi! 病院 đọc là びょういん.`
- Sau sai: `Chưa đúng. Đáp án là びょういん. Xem lại mẹo nhớ →`
- Hết ôn: `Bạn đã hoàn thành lượt ôn hiện tại. Vẫn có thể luyện thêm bất cứ lúc nào.`
- TTS không sẵn có: `Thiết bị này chưa có giọng đọc tiếng Nhật. Bạn vẫn có thể học bằng Hiragana.`
- Data lỗi: `Không tải được nội dung bài này. Thử lại` + nút retry.
- Không tạo thông báo tiêu cực kiểu “Bạn đã bỏ lỡ 5 ngày!”, không áp lực streak.

---

## 7. Tìm kiếm, thư viện và chi tiết chữ

### 7.1. Tìm kiếm toàn cục

Cho phép tìm bằng:

- **Kanji**: `病`, `病院`.
- **Hiragana**: `びょういん`.
- **Katakana/IME** ở mức hỗ trợ chuẩn hóa nếu có.
- **Tiếng Việt**: `bệnh viện`, `bệnh` (bỏ dấu cho mục đích tìm kiếm nhưng hiển thị nghĩa gốc giữ dấu).
- **Hán Việt**: `BỆNH`, `VIỆN`.

Tìm theo prefix + substring; debounce; khi tập nhỏ có thể filter local không cần search server. Kết quả nhóm theo `Kanji` / `Từ vựng`, hiển thị bài liên quan; cho phép nhảy trực tiếp vào bài.

### 7.2. Chi tiết một Kanji

Ví dụ trang `病`:

```text
病                    BỆNH
On: ビョウ / ヘイ       Kun: や(む), やまい
Nghĩa: Bệnh

Từ trọng tâm:
病院（びょういん） — Bệnh viện
病気（びょうき） — Bệnh

Liên kết: Bài 05 · Từ dễ nhầm · Ví dụ
[Nghe từ] [Luyện từ này] [Quay lại bài]
```

Đối với chữ đa nghĩa, có thể có nhiều `kanjiSense` được biên tập nhưng vẫn chỉ **một ID Kanji**.

### 7.3. Từ dễ nhầm

Trang/khối “Đừng nhầm!” ưu tiên ví dụ đã kiểm tra:

| Cặp | Ý chính |
|---|---|
| 暑い / 熱い | Nóng thời tiết / nóng đồ vật |
| 早い / 速い | Sớm / nhanh (tốc độ) |
| 借りる / 貸す | Mượn / cho mượn |
| 着く / 着る | Đến nơi / mặc áo |
| 市立 / 私立 | Do thành phố lập / tư lập; cùng đọc しりつ |
| 教える / 習う | Dạy / học từ ai đó (không gọi là cặp chủ động–bị động) |

Đây là ví dụ lớp học mở rộng; các chữ ngoài 181 không tăng thống kê Kanji cốt lõi.

---

## 8. Trang tiến độ (Progress)

Trang tiến độ chỉ cần trực quan, không quá nhiều biểu đồ:

1. **Kanji đã vững:** `x / 181` (theo kết quả học có chấm).
2. **Từ vựng:** `đã luyện / đã nhớ / cần ôn`, cho phép chọn từ trọng tâm hoặc mở rộng.
3. **15 bài:** thanh tiến độ cho từng bài, nút `Vào bài`.
4. **Kỹ năng:** `Đọc Kanji` · `Hiểu nghĩa` · `Chọn chữ` · `Dùng trong câu` — không gộp một điểm chính xác gây hiểu nhầm.
5. **Từ hay sai:** danh sách top theo số lần sai và thời điểm; `Luyện ngay`.
6. **Lịch sử quiz:** tên bài, điểm, ngày làm, số câu, nút `Xem lại lỗi sai`.
7. **Không cần** lịch học theo tuần, lịch tháng, heatmap ép ngày liên tục hoặc so sánh với người khác.

---

## 9. Frontend architecture (độc lập, có thể triển khai ngay)

### 9.1. Stack đề xuất

| Hạng mục | Lựa chọn | Vì sao |
|---|---|---|
| App | React + TypeScript + Vite | FE tĩnh, dễ phát triển và deploy |
| Routing | React Router | Deep link từng bài/từ, nested routes |
| CSS | Tailwind CSS + CSS variables | Làm UI nhanh, theme nhất quán |
| UI primitives | Component tự xây dựng hoặc thư viện accessible nhẹ | Tránh UI nặng; kiểm soát keyboard |
| Local state | Zustand hoặc React Context cho setting/phiên học | Không cần Redux nặng |
| Lưu tiến độ | IndexedDB qua Dexie (hoặc wrapper tương đương) | Bản ghi nhiều, version/migration rõ |
| Kiểm tra schema | Zod | Ràng buộc JSON dữ liệu bài học, import progress |
| Form nhập đáp án | React input/controlled state | IME Nhật, trạng thái chấm rõ |
| PWA | Plugin PWA tương thích Vite + service worker | Truy cập offline sau tải đầu |
| Unit/component tests | Vitest + React Testing Library | Scheduler, quiz, filter, renderer |
| E2E | Playwright | Học một bài trọn vẹn, lưu tiến độ, mobile |
| TTS | Web Speech API `speechSynthesis` | Không cần server/API key, phụ thuộc giọng trên thiết bị |
| Deploy | Vercel, Netlify hoặc static hosting | Không cần server API riêng |

**Tránh overengineering:** chưa cần Next.js SSR, Node backend, DB trên cloud, OAuth, Kubernetes, nhiều lớp CQRS/clean architecture hoặc AI chat.

### 9.2. Sơ đồ data flow

```text
Markdown nguồn đã được kiểm duyệt
           ↓ (script import + QA khi build)
  JSON dữ liệu tĩnh có schema
           ↓
    React / TypeScript SPA
           ├── Lesson viewer
           ├── Practice + quiz engine
           ├── Japanese text renderer
           ├── TTS service (browser)
           └── Review scheduler
                     ↓
          IndexedDB trong trình duyệt
          (tiến độ, phiên học, cài đặt)
                     ↓
             Export / Import JSON
```

**Không truyền dữ liệu học ra server.** Nếu người dùng muốn đồng bộ nhiều thiết bị trong tương lai, đó là tính năng có kiến trúc và thông báo quyền riêng tư riêng.

### 9.3. Cấu trúc thư mục đề xuất

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── ui/                     button, dialog, tabs, progress...
│   ├── japanese/               JapaneseText, Furigana, AudioButton
│   ├── learning/               Flashcard, AnswerChoice, ReviewSummary
│   └── layout/                 Header, Sidebar, MobileNav
├── features/
│   ├── home/
│   ├── lessons/
│   ├── kanji/
│   ├── vocabulary/
│   ├── practice/
│   ├── quiz/
│   ├── reading/
│   ├── review/
│   ├── progress/
│   └── settings/
├── data/
│   ├── lessons.json
│   ├── kanji.json
│   ├── vocabulary.json
│   ├── examples.json
│   ├── questions.json
│   ├── reading-passages.json
│   └── manifest.json
├── domain/
│   ├── learning-types.ts
│   ├── answer-evaluator.ts
│   ├── review-scheduler.ts
│   └── progress-calculator.ts
├── storage/
│   ├── db.ts
│   ├── repositories/
│   ├── migrations/
│   └── backup.ts
├── hooks/
├── services/
│   ├── speech.ts
│   └── content-loader.ts
├── styles/
└── tests/
scripts/
├── import-markdown.ts
├── validate-content.ts
└── verify-coverage.ts
public/
├── icons/
└── manifest.webmanifest
```

### 9.4. Không lưu source content trùng lặp vào DB người dùng

- `data/*.json` là **read-only canonical content** được deploy cùng web.
- IndexedDB chỉ lưu **progress, attempts, answer events, settings, bookmarks, active sessions**, không nhân đôi toàn bộ từ vựng nếu không cần.
- `contentVersion` dùng để xử lý cập nhật bộ đề: nội dung mới không được ghi đè/hủy dữ liệu học cũ; ID ổn định là bắt buộc.
- Bản dựng mới chỉ thay đổi dữ liệu tĩnh; dữ liệu người dùng cũ vẫn ở thiết bị của họ nếu không xóa site storage.

---

## 10. Data schema (TypeScript tham khảo có thể triển khai)

### 10.1. Nội dung chuẩn hóa

```ts
type Priority = 'core' | 'extended';
type Skill =
  | 'readingRecognition'
  | 'meaningRecognition'
  | 'orthography'
  | 'contextUsage'
  | 'listeningRecognition';

type Lesson = {
  id: string;                 // lesson-01 ... lesson-15
  order: number;
  titleVi: string;
  kanjiIds: string[];         // chữ mục tiêu duy nhất của bài
  vocabularyIds: string[];    // có thể lặp với bài khác
  exampleIds: string[];
  questionIds: string[];
  tipIds?: string[];
};

type Kanji = {
  id: string;                 // kji-病 (hoặc UUID ổn định)
  literal: string;            // 病
  hanViet: string;            // BỆNH
  onReadings: string[];       // ['ビョウ', 'ヘイ']
  kunReadings: string[];      // ['やむ', 'やまい']
  meaningVi: string;
  primaryLessonId: string;
  vocabularyIds: string[];
  notesVi?: string[];
  isTargetKanji: boolean;
};

type Vocabulary = {
  id: string;                 // word-病院
  surface: string;            // 病院
  readingHiragana: string;    // びょういん
  acceptedReadings?: string[];
  meaningVi: string;          // Bệnh viện
  meaningVariantsVi?: string[];
  lessonIds: string[];
  priority: Priority;         // ★ / ☆ sau khi duyệt dữ liệu
  kanjiIds: string[];
  exampleIds: string[];
  mnemonicVi?: string;
  tags?: string[];
  outsideTargetKanji?: string[];
};

type RubySegment = {
  text: string;               // đoạn Kanji/Kana gốc
  reading?: string;           // chỉ cung cấp khi có đọc chính xác
};

type ExampleSentence = {
  id: string;
  japanese: string;
  readingHiragana?: string;   // bản đọc đủ câu, được kiểm duyệt
  segments?: RubySegment[];   // nếu có căn chỉnh ruby đúng
  meaningVi: string;
  relatedWordIds: string[];
  lessonId: string;
};

type Question = {
  id: string;
  lessonId: string;
  type: 'kanjiReading' | 'orthography' | 'meaning' |
        'context' | 'paraphrase' | 'usage' | 'listening';
  stemJa?: string;
  stemVi?: string;
  targetWordId?: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanationVi: string;
  skill: Skill;
  isReviewed: boolean;       // chỉ câu đã được kiểm duyệt mới vào quiz
};

type ReadingPassage = {
  id: string;
  titleVi: string;
  japanese: string;
  readingHiragana?: string;
  segments?: RubySegment[];
  meaningVi: string;
  questionIds: string[];
};
```

**Ghi nhớ quan trọng về dữ liệu:** `Question` nhiều lựa chọn chỉ cho type phù hợp. Các câu nhập tự do có `acceptedAnswers` riêng, không ép vào `correctOptionId`. Không dùng `meaningVariantsVi` như danh sách đồng nghĩa tùy tiện; chỉ lưu biến thể đã kiểm duyệt.

### 10.2. Tiến độ người học

```ts
type ItemProgress = {
  itemId: string;             // word ID hoặc Kanji ID
  itemKind: 'word' | 'kanji';
  skill: Skill;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  consecutiveCorrect: number;
  successfulDistinctSessions: number;
  lastReviewedAt?: string;    // ISO timestamp
  nextReviewAt?: string;      // ISO timestamp
  intervalDays: number;
};

type AnswerEvent = {
  id: string;
  attemptId: string;
  questionId: string;
  itemId?: string;
  skill: Skill;
  answeredAt: string;
  isCorrect: boolean | null;  // null: bỏ qua, chưa chấm
  isSkipped: boolean;
  responseTimeMs?: number;
};

type QuizAttempt = {
  id: string;
  lessonId: string;
  questionOrder: string[];
  optionOrderByQuestion: Record<string, string[]>;
  answersByQuestion: Record<string, string>;
  startedAt: string;
  completedAt?: string;
  mode: 'practice' | 'test';
  contentVersion: string;
};

type UserPreferences = {
  showFurigana: boolean;
  showMeaningByDefault: boolean;
  japaneseFontScale: number;
  speechRate: number;
  voiceURI?: string;
  theme: 'light' | 'dark' | 'system';
  priorityFilter: 'core' | 'all';
};
```

**Chú ý khóa DB:** sử dụng composite key cho `ItemProgress`: `[itemKind+itemId+skill]`; một từ có thể được học trên nhiều bài mà vẫn dùng chung tiến độ. Cần thêm `schemaVersion` và migration tăng dần.

### 10.3. Bản ghi minh họa

```json
{
  "id": "word-病院",
  "surface": "病院",
  "readingHiragana": "びょういん",
  "meaningVi": "Bệnh viện",
  "lessonIds": ["lesson-05"],
  "priority": "core",
  "kanjiIds": ["kji-病", "kji-院"],
  "exampleIds": ["ex-05-01"]
}
```

Trường `priority` và `exampleIds` minh họa cách liên kết; khi import phải đối chiếu trực tiếp với tài liệu, không coi mọi ID trong ví dụ này đều tồn tại sẵn.

---

## 11. Trạng thái màn hình và các trường hợp đặc biệt

### 11.1. Trạng thái cần xử lý ở mọi màn

- Loading skeleton ngắn gọn; không để nút trống thiếu phản hồi.
- Empty `chưa học`, `không có từ cần ôn`, `chưa có câu hỏi loại này`, `không tìm thấy từ`.
- Error dữ liệu/corrupt IndexedDB: hiển thị cảnh báo, cho phép sao lưu còn đọc được; không tự động xóa toàn bộ.
- Offline: badge trạng thái tùy ngữ cảnh; tài liệu đã tải vẫn mở được.
- Quiz giữa chừng: tự lưu đáp án khi chọn, hỏi xác nhận trước khi **xóa** phiên; chuyển trang an toàn.
- Khi hoàn thành quiz: khóa attempt cũ, `Làm lại` tạo attempt mới, không ghi đè lịch sử.
- Không render câu hỏi có 0, 1, 2 đáp án đúng hoặc options trùng nội dung làm mơ hồ.
- Nếu chưa đủ phương án nhiễu có chất lượng: không hiển thị chế độ 4 lựa chọn cho mục đó; dùng câu đã được duyệt.

### 11.2. Trình phát âm tiếng Nhật

Quy tắc kỹ thuật:

1. Chỉ gọi từ **tương tác người dùng** (click/tap) và kiểm tra `speechSynthesis` có tồn tại.
2. `getVoices()` có thể trả mảng rỗng lúc khởi tạo; lắng nghe `voiceschanged` và cập nhật danh sách.
3. Ưu tiên giọng có locale `ja-JP`, cho chọn giọng và tốc độ.
4. `speechSynthesis.cancel()` trước khi phát từ khác; tránh xếp hàng âm thanh.
5. Khi không có giọng Nhật: không tự giả là phát âm chuẩn; hiển thị thông báo và không chặn học.
6. Với PWA offline: TTS có hoạt động offline hay không phụ thuộc vào giọng/thiết bị, không cam kết universal offline speech.

### 11.3. Khả năng truy cập

- Semantics `button`, `fieldset`, `radio`, `label`, `dialog` đúng chức năng.
- Focus rõ; keyboard: Enter/Space chọn, Tab chuyển, Escape đóng dialog; không chặn IME khi người dùng đang nhập tiếng Nhật.
- `aria-live` thông báo kết quả ngắn, không đọc toàn bộ UI sau mỗi đáp án.
- Color contrast kiểm tra thực tế; hỗ trợ `prefers-reduced-motion`.
- Nút âm thanh có tên dễ hiểu `Nghe cách đọc của 病院`.
- Câu trắc nghiệm cho screen reader không vô tình đọc đáp án ẩn/furigana khi đang kiểm tra.
- Ruby `<rt>` hợp lệ, tránh ảnh chữ Nhật thay cho text thật.

---

## 12. Lưu dữ liệu, backup và offline

### 12.1. Không tài khoản vẫn có tiến độ

- **IndexedDB:** lưu từng kết quả có chấm, review queue, attempt, settings, lịch sử tối giản.
- **localStorage:** chỉ cho preference nhỏ nếu cần; không dùng làm DB kết quả học chính.
- Có menu `Xuất dữ liệu` → JSON có `schemaVersion`, `contentVersion`, timestamp, attempts, item progress, preferences.
- `Nhập dữ liệu` cần: validate schema, preview số bản ghi và lựa chọn `Gộp` hoặc `Thay thế` với xác nhận rõ ràng.
- Khi gộp: theo event/attempt IDs ổn định, không cộng trùng, giải quyết `lastReviewedAt`/scheduler bằng quy tắc deterministic. Nếu không thể gộp tin cậy, chỉ hỗ trợ `Thay thế` với backup trước.
- Có nút `Xóa dữ liệu học` yêu cầu xác nhận 2 bước; không để cạnh nút tiếp tục học.
- UI ghi rõ: **“Tiến độ lưu trên trình duyệt này. Xóa dữ liệu trình duyệt hoặc đổi thiết bị có thể làm mất tiến độ nếu chưa sao lưu.”**

### 12.2. PWA và cache

- Precache app shell + icon + JSON bài học + fonts đã cấp phép/lưu phù hợp.
- Sau một lần tải đầy đủ: mở bài và làm trắc nghiệm offline được.
- Mỗi khi deploy dữ liệu mới: không xóa tiến độ ở IndexedDB.
- Test trên desktop Chrome, Android Chrome, iOS Safari / chế độ cài Home Screen nếu hỗ trợ.
- Nếu ứng dụng có nội dung tải từng phần (lazy chunks), có menu `Tải tất cả bài để học offline`; phải thông báo khi hoàn tất thật.
- Web Speech API không phải cam kết hỗ trợ giọng Nhật offline.

---

## 13. Quy tắc chấm điểm và ngân hàng câu hỏi

### 13.1. Kiểu câu ưu tiên sát phần từ vựng N4

Dựa trên nhóm dạng câu hỏi vốn được JLPT mô tả, phần ôn Kanji nên tập trung:

1. `Kanji reading`: từ Kanji → chọn cách đọc.
2. `Orthography`: Hiragana → chọn Kanji.
3. `Context`: điền từ đúng trong câu.
4. `Paraphrase`: chọn cách diễn đạt gần nghĩa.
5. `Usage`: chọn câu dùng từ đúng.

Đây là **mô phỏng cách luyện tập**, không gắn mác “đề JLPT thật”. Không tự suy ra một tỷ lệ câu hỏi chuẩn chính thức cho web nếu chưa có dữ liệu tương ứng.

### 13.2. Chấm tự động

- Trắc nghiệm: so sánh ID đáp án, không dùng text label `A/B/C/D` làm khóa thật.
- Nhập Hiragana: chuẩn hóa theo quy tắc chặt chẽ ở 4.3; biến thể chấp nhận do content data quy định.
- Nhập nghĩa Việt: nếu có dùng, chỉ chấm chính xác với danh sách từ đồng nghĩa kiểm duyệt; không dùng fuzzy match một cách tùy tiện. Mục tiêu chính nên ưu tiên chọn nghĩa để đảm bảo công bằng.
- Câu tự viết/chữ viết tay không có mô hình kiểm duyệt: **không tự động chấm đúng/sai**.
- Không suy ra tổng kỹ năng Kanji từ các bài đọc dài hoặc quiz ngoài nội dung.

### 13.3. Cấu trúc thông báo sau câu sai

```text
Kết quả: CHƯA ĐÚNG
Từ: 出発（しゅっぱつ） — xuất phát
Bạn đã chọn: ...
Đáp án đúng: ...
Giải thích: 出 + 発 thường chỉ việc bắt đầu đi.
[Nghe từ]  [Xem chi tiết]  [Câu tiếp theo]
```

Lời giải không nên chứa thông tin “bịa” hoặc từ nguyên không chắc chắn; giải thích phải bám nội dung đã biên tập.

---

## 14. Các luồng người dùng chi tiết (User Stories)

### US-01 — Người mới lần đầu mở web

`Truy cập / → thấy 15 bài → chọn Bài 01 hoặc bài bất kỳ → xem Kanji → xem từ → luyện cách đọc → có kết quả → tiến độ được lưu`.  
**AC:** không login, không onboarding dài, không cần mạng sau khi nội dung đã cache.

### US-02 — Học từ Kanji đến ngữ cảnh

`Chọn Bài 05 → 病 → 病院 → bấm nghe → ẩn Hiragana → nhập びょういん → chấm → đọc câu ví dụ`.  
**AC:** dù chữ `病` có nhiều âm, bài nhập hỏi `病院` có đáp án xác định.

### US-03 — Sai nhiều từ giống nhau

`Chọn bài → quiz → sai 借りる/貸す → kết quả đánh dấu dễ nhầm → Ôn từ sai → câu hỏi khác về cùng từ`.  
**AC:** tạo review item, giải thích phân biệt, không mark mastered vì xem đáp án.

### US-04 — Đang học rồi đóng tab

`Làm quiz 4/8 → đóng tab/F5 → quay lại → tiếp tục từ câu 5, không mất đáp án trước`.  
**AC:** attempt và thứ tự phương án đã sinh được khôi phục, điểm không thay đổi ngầm.

### US-05 — Học bằng điện thoại

`Vào web trên Android/iPhone → bấm tab Bài học → học bằng chạm → nhập kana → nghe từ → kết quả`.  
**AC:** không tràn ngang, không che keyboard, nút lớn đủ chạm, TTS có fallback.

### US-06 — Không muốn xem Hiragana

`Cài đặt → Tắt furigana → đọc ví dụ → cần hỗ trợ thì bấm “Xem cách đọc”`.  
**AC:** quyền ẩn nghĩa/cách đọc không làm rò dữ liệu đáp án ở chế độ quiz.

### US-07 — Dữ liệu cũ sau khi cập nhật website

`Đã học 8 bài → triển khai bản cập nhật câu hỏi → mở web lại → tiến độ Kanji vẫn còn`.  
**AC:** stable IDs, migration và kiểm thử update path.

### US-08 — Chuyển thiết bị

`Xuất JSON ở máy A → chuyển file → Nhập ở máy B → xác nhận → tiếp tục học`.  
**AC:** dữ liệu hợp lệ khôi phục được, file sai schema bị từ chối an toàn.

---

## 15. Những gì KHÔNG nên thêm sớm

Không đưa các chức năng dưới đây vào lõi hệ thống khi chưa hoàn thiện luồng học:

- Game thưởng xu, bảng xếp hạng, phạt streak, nhiệm vụ theo tuần.
- Chatbot AI giải nghĩa từng chữ, tự sinh quiz online không kiểm duyệt.
- Nhận diện chữ viết tay bằng AI, chấm thứ tự nét từ ảnh chụp.
- Đăng nhập/email/social login, backend, thanh toán hoặc đồng bộ cloud.
- Forum, newsfeed, lớp học, chức năng giáo viên, học nhiều cấp JLPT cùng lúc.
- “Phát âm chuẩn 100%” nếu chỉ dựa trên giọng đọc TTS của thiết bị.

Nếu mở rộng sau này, nên dựa vào nhu cầu thực, không thêm chỉ để website trông có nhiều tính năng.

---

## 16. Kế hoạch triển khai theo GIAI ĐOẠN CHỨC NĂNG (không phải lịch học)

> Những giai đoạn sau dành cho **lập trình**, không phải chia tuần bắt người học. Mỗi giai đoạn có thể hoàn thành khi đủ tiêu chí, không có thời hạn cứng.

### Giai đoạn 0 — Nội dung sạch và cấu trúc project

- [ ] Khởi tạo React + TypeScript + Vite, routing, Tailwind, theme, test.
- [ ] Import 15 bài từ file nguồn thành JSON tách `lessons/kanji/vocab/examples/questions/reading`.
- [ ] Validate đủ **181 Kanji mục tiêu độc nhất**, mỗi Kanji gán đúng `primaryLessonId`.
- [ ] Đảm bảo mọi `vocabularyId`/`questionId`/`exampleId` liên kết tồn tại.
- [ ] Kiểm tra 15 bài có dữ liệu tối thiểu; mục nào nguồn thiếu phải báo cáo, không tự bù dữ liệu ngầm.
- [ ] Kiểm tra câu trắc nghiệm, đáp án đúng, distractor trùng, ruby, dịch tiếng Việt, typo.
- [ ] Tách nội dung không thuộc web (lịch học theo tuần, hướng dẫn nhập sang ứng dụng khác).

**Definition of Done:** `npm run build`, `npm run test`, `npm run validate:content` đều đạt.

### Giai đoạn 1 — Website học bài đẹp, dễ dùng

- [ ] App shell responsive; trang chủ; 15 bài; chi tiết bài.
- [ ] Thẻ Kanji + từ ghép, filter ★/☆, tra cứu; điều hướng.
- [ ] Furigana/hiragana/meaning toggle, ví dụ, mẹo nhớ, TTS có fallback.
- [ ] Dark mode và font scale nếu không ảnh hưởng tiến độ giao diện.
- [ ] Keyboard accessibility cơ bản.

**DoD:** người dùng chọn bài bất kỳ, học chữ/từ và đọc ví dụ trơn tru trên mobile/desktop.

### Giai đoạn 2 — Luyện tập thực sự và quiz

- [ ] Flashcard khám phá + flashcard tự chấm.
- [ ] Nhập Hiragana; chọn Kanji; chọn nghĩa; ngữ cảnh; ghép cặp.
- [ ] Quiz cuối bài, trộn đáp án ổn định, đáp án + giải thích, lịch sử lần làm.
- [ ] IndexedDB autosave cho mọi attempt.
- [ ] Xử lý bỏ qua, thoát giữa chừng, câu thiếu dữ liệu, đáp án hợp lệ nhiều cách.

**DoD:** hoàn thành một bài end-to-end, F5 không mất tiến độ, không chấm nhầm.

### Giai đoạn 3 — Ôn tự động và đọc hiểu

- [ ] Scheduler có unit test; kỹ năng đọc/nghĩa/nhận diện tách biệt.
- [ ] Trang Ôn tập, hàng đợi từ sai, lên lịch lặp sau câu đúng/sai.
- [ ] 5 bài đọc nguồn, công tắc furigana, câu hỏi đọc, tra từ trong đoạn.
- [ ] Trang tiến độ với 15 bài, 181 Kanji, từ hay sai.
- [ ] Luyện nghe–chọn từ khi có giọng Nhật khả dụng.

**DoD:** sai một từ → từ vào ôn → làm đúng những lần tách biệt → tăng khoảng lặp; không cần nút tự chấm độ khó.

### Giai đoạn 4 — Hoàn thiện và vận hành ổn định

- [ ] PWA offline, cache data, test audio fallback.
- [ ] Sao lưu/khôi phục JSON, migration IndexedDB.
- [ ] Accessibility kiểm thử bằng keyboard + screen reader cơ bản.
- [ ] E2E mobile + desktop, kiểm thử cập nhật content version.
- [ ] Luyện viết tự đối chiếu mẫu (nếu còn nguồn lực).
- [ ] Deploy static hosting + sửa SPA rewrite + kiểm tra offline cài PWA.

**DoD:** website độc lập, có thể phát hành, không phải bật server riêng để học Kanji.

---

## 17. Testing checklist chi tiết

### Dữ liệu

- [ ] Có 15 `Lesson` theo đúng thứ tự/tên trong tài liệu.
- [ ] Tổng `kanjiIds` mục tiêu = 181, không trùng primary lesson.
- [ ] `Kanji.literal` đúng glyph/Unicode; không đổi chữ giản thể thành phồn thể sai.
- [ ] Mọi từ đều có `surface`, `readingHiragana`, `meaningVi`.
- [ ] Mọi câu hỏi trắc nghiệm có đúng 4 option (nếu mode 4 lựa chọn), đúng một `correctOptionId`.
- [ ] Không có option text giống nhau sau normalize gây mơ hồ.
- [ ] Đáp án giải thích và `readingHiragana` được kiểm duyệt.
- [ ] Lỗi trong tài liệu nguồn nếu được sửa phải có `content-review.md` ghi rõ.

### Học và chấm

- [ ] Lật flashcard không tăng mastered.
- [ ] Đúng 1 lần không tự thành mastered.
- [ ] Sai → về learning + có mặt trong ôn; đúng nhiều lần phù hợp → reviewing/mastered.
- [ ] Câu hỏi có nhiều cách đọc không chấm một âm duy nhất ngoài ngữ cảnh.
- [ ] Trắc nghiệm đảo option không làm đáp án biến sai.
- [ ] IME đang compose không submit nhầm khi nhấn Enter.
- [ ] Câu bỏ qua không được tính đúng.
- [ ] Không hiện đáp án trước nộp trong test mode.

### UX

- [ ] Bài 1–15 mở trực tiếp được khi paste URL và reload.
- [ ] Trang quiz sau reload phục hồi thứ tự và đáp án đã chọn.
- [ ] Mobile 320px không scroll ngang.
- [ ] TTS không có tiếng Nhật → có thông báo hữu ích, không crash.
- [ ] Cỡ chữ Kanji/ruby tăng mà không đè lên nút.
- [ ] Focus ring, labels, screen reader, reduced motion.
- [ ] Có empty state sạch cho người mới và khi ôn xong.

### Lưu dữ liệu và phát hành

- [ ] Backup/restore vòng kín cùng phiên bản.
- [ ] Backup sai schema, JSON lỗi, dữ liệu ngoài danh sách ID được chặn an toàn.
- [ ] Không mất tiến độ khi cập nhật một bài/câu hỏi.
- [ ] Offline sau khi đã tải gói dữ liệu đủ.
- [ ] Có thông báo tiến độ chỉ lưu trên thiết bị.
- [ ] Không lộ token/API key (vì app không cần secret phía client).
- [ ] Không có nội dung HTML sinh từ dữ liệu thiếu sanitize gây XSS.
- [ ] Test chính: Chrome desktop, Firefox desktop, Android Chrome, Safari iOS (nếu có thiết bị).

---

## 18. Quy tắc thực hiện cho AI coding assistant (dán cho Codex/agent)

> **Mục tiêu:** xây dựng website FE học Kanji N4 độc lập từ file PRD này và nội dung Markdown nguồn. Phải chạy được đầy đủ không có backend. Không thêm chức năng liên quan nền tảng học tập khác.

1. Đọc toàn bộ file đặc tả và file nội dung nguồn; **không hỏi thêm nếu đã có yêu cầu rõ**.
2. Trước khi code, kiểm tra repo hiện có (nếu repo trống mới scaffold); không ghi đè mã nguồn người dùng mà không xem trước.
3. **Giữ nguyên 15 bài/181 Kanji**; không chia lịch học theo tuần hoặc khóa bài.
4. Ưu tiên **tính đúng của nội dung + luồng học + lưu tiến độ** trước khi làm trang trí.
5. TTS `ja-JP` có fallback rõ ràng, không đòi API key.
6. Giao diện chất lượng sản phẩm, mobile-first, tiếng Việt, chữ Nhật có ruby hỗ trợ.
7. Bài tập tự chấm; không dùng nút thủ công phân loại khó/dễ; không đánh dấu thuộc chỉ vì đã xem.
8. Dùng IndexedDB và dữ liệu JSON tĩnh có ID ổn định; build được trên static hosting.
9. Mỗi lần thêm chức năng phải có trạng thái empty/loading/error + kiểm thử liên quan.
10. Tạo script kiểm tra nội dung và E2E học một bài. Không chèn ngữ nghĩa/âm đọc không có trong dữ liệu nếu chưa kiểm duyệt.
11. Không cho người dùng trả lời trắc nghiệm với câu hỏi chưa review. Nếu dữ liệu nguồn thiếu, **báo rõ thiếu gì**, không tự động sinh hàng loạt câu thiếu chất lượng.
12. Cuối mỗi giai đoạn lập trình: chạy `lint`, `typecheck`, `test`, `build`, tóm tắt thay đổi và hướng dẫn chạy.

### Lệnh mong đợi (có thể điều chỉnh theo repo)

```bash
npm install
npm run dev
npm run validate:content
npm run lint
npm run typecheck
npm run test
npm run build
```

### Hướng dẫn nghiệm thu thành phẩm

1. Mở web: thấy 15 bài.
2. Vào Bài 05, học `病`, `病院（びょういん）`, nghe từ nếu hỗ trợ.
3. Tắt furigana, làm câu đọc chữ, được chấm tự động.
4. Cố tình làm sai: thấy giải thích và từ nằm trong danh sách Ôn.
5. F5, dữ liệu vẫn còn, làm lại bằng dạng hỏi khác.
6. Vào bài đọc ngắn, bấm xem cách đọc và nghĩa.
7. Xem tiến độ Kanji đúng theo kỹ năng và bài học.
8. Export JSON, import ở trình duyệt test, học tiếp được.
9. Không có trang chia tuần, biểu đồ ép thời gian hay đăng nhập bắt buộc.

---

## 19. Tài liệu nguồn và nguồn tham khảo kỹ thuật

### Nội dung do người học cung cấp

- `Kanji_N4_181_15_Bai_Giao_Trinh_Hoan_Chinh.md`: cơ sở 15 bài, 181 chữ Kanji, ví dụ, bài tập theo bài, bài đọc và ghi chú dễ nhầm.
- `kanji-n4-hoc-theo-bai.md`: bản sắp xếp 15 bài ban đầu.

### Tham khảo công khai cho người lập trình

- JLPT chính thức — nhóm dạng câu hỏi N4: <https://www.jlpt.jp/e/guideline/testsections.html>
- Web Speech API / `getVoices()`: <https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices>
- IndexedDB: <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>
- Client-side storage và service workers: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_APIs/Client-side_storage>
- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>

> Các công nghệ, khoảng lặp ôn, ngưỡng mastery và thiết kế màn hình trong tài liệu này là **đề xuất thiết kế sản phẩm**, không phải nội dung có sẵn trong bộ 181 Kanji hoặc yêu cầu chính thức của kỳ thi JLPT.

---

## 20. Kết luận / Định nghĩa hoàn thành toàn bộ hệ thống

**Sản phẩm được xem là hoàn chỉnh khi:** người học có thể tự chọn **bất kỳ 1 trong 15 bài**, xem và học **181 Kanji**, tra từ ghép với Hiragana và nghĩa Việt, nghe từ/câu khi thiết bị hỗ trợ, luyện **nhận diện – nhớ cách đọc – nghĩa – ngữ cảnh**, làm quiz ABCD, học 5 đoạn đọc, tự ôn lại từ sai bằng thuật toán không cần tự chấm, theo dõi tiến độ bền vững, học tiếp sau khi tải lại, và dùng tốt trên mobile/desktop **mà không cần backend hoặc lịch học theo tuần**.

**Nguyên tắc quan trọng nhất: một website học tốt là website khiến người học thực sự NHỚ và DÙNG được chữ, không phải website có nhiều nút nhất.**
