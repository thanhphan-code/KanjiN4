# PHỤ LỤC MỞ RỘNG HỌC TỪ VỰNG N4 — 262 TỪ / 15 BÀI

> **Dự án:** Kanji Garden — Website học Kanji N4 **frontend-only**, độc lập hoàn toàn với ứng dụng nào khác.  
> **Tài liệu này là phần bổ sung, không thay thế:** `THIET_KE_HE_THONG_WEB_HOC_KANJI_N4_FE.md` (đặc tả FE) và `Kanji_N4_181_15_Bai_Giao_Trinh_Hoan_Chinh.md` (giáo trình 181 Kanji).  
> **Nguồn dữ liệu bổ sung:** 3 file TXT người dùng cung cấp, lần lượt có 100 + 100 + 62 từ. Tên file nguồn chỉ dùng để truy vết; **không tích hợp hay phụ thuộc StudyFlow**.  
> **Nguyên tắc:** **15 bài theo chủ đề; tự do chọn bài; KHÔNG chia theo tuần, KHÔNG bắt buộc mục tiêu mỗi ngày.** Các mốc ôn là thuật toán nội bộ, không phải lịch học ép buộc.  
> **Phân biệt xuất xứ:** Bảng **262 từ** bên dưới chép theo nguồn, bảo toàn nghĩa tiếng Việt và loại từ gốc. **Câu ví dụ, câu hỏi và quy tắc thiết kế** là nội dung **bổ sung mới**, cần được duyệt tiếng Nhật trước khi phát hành chính thức.

---

## 1. Phạm vi, mục tiêu và nguyên tắc nội dung

**Mục tiêu phần bổ sung:** đưa toàn bộ 262 từ thành nội dung học có tương tác thực sự trong cùng **15 bài Kanji hiện hữu**; không tạo thêm một khóa học rời hoặc trang chép danh sách dài. Mỗi từ phải có **Kanji/cách viết → Hiragana → nghĩa Việt → loại từ → phát âm → luyện chủ động → kết quả tự động → ôn lại**.

- Duy trì **181 Kanji mục tiêu** của giáo trình gốc. **262 là số mục từ vựng bổ sung**, **KHÔNG cộng thành 443 Kanji**. Chữ ngoài bộ 181 có thể có trong từ và ví dụ nhưng phải gắn nhãn `Kanji mở rộng` khi xem chi tiết.
- Từ nào đã tồn tại trong giáo trình gốc phải **hợp nhất theo danh mục từ vựng dùng chung**, không tạo hai lần tiến độ hoặc hai flashcard độc lập do nguồn khác nhau. Hợp nhất không có nghĩa ghi đè nghĩa Việt nguyên bản: lưu mọi `sourceGloss` và hiển thị đúng nghĩa của nguồn tương ứng.
- **Giữ nguyên 6 trường nguồn**: `surface | meaningVi | partOfSpeech | locale | hiragana | romaji`. ID, bài học, cấp độ học trước/mở rộng là **metadata bổ sung** do tài liệu này thiết kế.
- **Không tự sửa** các từ có cách phân loại đặc biệt như `同じ`, `好きな`, `元気な`; cần trường `dictionaryForm` để đặt câu sau khi kiểm duyệt. `開く（あく）` theo đúng dữ liệu nguồn, không tự điền thêm cách đọc vào đáp án chuẩn khi chưa duyệt.
- Đảm bảo những từ có **cùng cách đọc nhưng khác Kanji** (`切る・着る`) không xuất hiện đồng thời như hai đáp án được cho là có thể phân biệt chỉ bằng một bản ghi âm không có ngữ cảnh.
- Nội dung từ nguồn ở đây không tự động là “danh sách chính thức JLPT N4” hoặc “đề thi thật”. Đây là danh mục học do người dùng cung cấp, tổ chức lại phục vụ luyện tập.

### 1.1. Phân tích dữ liệu nguồn (đã kiểm đếm)

| Nguồn | Dải ID ổn định | Số từ |
|---|---|---:|
| `StudyFlow_Phan_1_100_tu_Kanji_Khong_Ngoac(1).txt` | `V001–V100` | 100 |
| `StudyFlow_Phan_2_100_tu_Kanji_Khong_Ngoac(1).txt` | `V101–V200` | 100 |
| `StudyFlow_Phan_3_62_tu_Kanji_Khong_Ngoac(1).txt` | `V201–V262` | 62 |
| **Tổng** | **V001–V262** | **262 mục, 262 cách viết không trùng** |


| Loại từ như nguồn | Số mục |
|---|---:|
| Tính từ い | 25 |
| Cụm tính từ い | 2 |
| Tính từ な | 10 |
| Động từ | 68 |
| Danh từ | 153 |
| Tính từ な (đặc biệt) | 1 |
| Trạng từ / cụm từ | 1 |
| Trạng từ | 2 |


**Lưu ý phân loại:** “từ trọng tâm” bên dưới là **ưu tiên sư phạm do tài liệu này đề xuất**, không phải đánh giá tần suất thống kê chính thức. Phần mở rộng vẫn luôn có thể được học bất kỳ lúc nào.

## 2. Cách hoạt động trên website (kế thừa đặc tả FE)

### 2.1. Cấu trúc trang Bài học

```text
Danh sách 15 bài (mở khóa toàn bộ)
  └─ Bài XX — Tên chủ đề
     ├─ [Kanji]          181 chữ chia vào 15 bài như giáo trình gốc
     ├─ [Từ vựng]       Từ bổ sung theo bài + từ ghép gốc đã hợp nhất
     │    ├─ Học trước (★)
     │    ├─ Mở rộng (☆)
     │    ├─ Đã nắm vững / Đang học / Chưa học
     │    └─ Từ dễ nhầm
     ├─ [Câu ví dụ]      Nhật + (ẩn/hiện Hiragana) + dịch Việt + nghe
     ├─ [Luyện nhớ]      Flashcard chủ động / Gõ Hiragana / Chọn nghĩa
     │                   Chọn Kanji / Ghép cặp / Nghe chọn / Ngữ cảnh
     ├─ [Kiểm tra]      Đảo vị trí đáp án, chấm tự động, giải thích
     └─ [Ôn lại]        Ưu tiên các từ trả lời sai và đến lượt ôn
```

**Trang 262 từ không phải mục điều hướng cấp cao:** người học học các từ này ngay trong 15 bài. Có thể tìm toàn bộ bằng mục **Tra cứu**.

### 2.2. Luồng học tối ưu từng bài (không ràng buộc lịch)

1. **Khám phá:** hiển thị từng nhóm 5–8 từ, không đổ tất cả lên một màn hình. Mặt chữ rõ, cho phép bật Furigana, TTS, ẩn nghĩa.
2. **Đoán trước khi xem:** ẩn cách đọc/nghĩa theo chế độ; người học bấm `Hiện đáp án` chỉ ghi `seen`, **không đánh dấu thuộc**.
3. **Nhớ chủ động:** gõ Hiragana, chọn nghĩa, chọn Kanji theo cách đọc, nghe rồi chọn từ. Ít nhất 2 loại câu khác nhau cho từ trọng tâm nếu dữ liệu cho phép.
4. **Ngữ cảnh:** đọc 3 câu mẫu của bài và câu từ giáo trình gốc, xem bản dịch sau khi tự thử; dùng câu hỏi ngữ cảnh đã duyệt.
5. **Kiểm tra:** có chế độ luyện (giải thích ngay) và chế độ bài kiểm tra (giải thích sau khi nộp). Người học có thể làm lại bất kỳ lúc nào.
6. **Ôn lại:** hệ thống tự lấy những từ còn sai, chưa ổn định hoặc đến lượt ôn; từ đúng nhiều lần, cách biệt thời gian sẽ xuất hiện thưa hơn. **Không dùng bốn nút tự đánh giá mức độ khó/dễ.**

### 2.3. Tính năng nhỏ nhưng thiết yếu

| Tính năng | Quy tắc cụ thể |
|---|---|
| Lọc | `Tất cả / Học trước ★ / Mở rộng ☆ / Chưa học / Sai nhiều / Đến lượt ôn` |
| Tìm | Kanji, Hiragana, nghĩa Việt không dấu/có dấu, Romaji; tìm xuyên 15 bài |
| Cách đọc | Bật/tắt Hiragana ở thẻ; trong quiz che tuyệt đối chuỗi đáp án khỏi HTML hiện ra trước khi nộp |
| Nghe | Web Speech API `ja-JP` nếu thiết bị có giọng Nhật; nếu không có, thông báo và cho học tiếp không âm thanh |
| Flashcard | Chế độ tự xem không tính điểm; chế độ gõ/chọn mới được chấm |
| Gõ Hiragana | Chuẩn hóa Unicode và Katakana/Hiragana hợp lệ; không xóa trường âm/っ/ん; Romaji conversion qua thư viện có kiểm chứng |
| Tránh mơ hồ | Không ra câu `切る` và `着る` chỉ dựa vào `きる` dưới dạng nghe không ngữ cảnh |
| Cặp dễ nhầm | Cặp từ tương tự ưu tiên xuất hiện trong bài ôn kèm ví dụ khác nhau |
| Lưu tự động | IndexedDB lưu từ đã gặp, bài đang làm, kết quả được chấm, thời điểm cần ôn; cài đặt đơn giản tùy chọn localStorage |
| Tiếp tục | Mở lại đúng bài và từ/câu đang luyện sau F5; khi nội dung đổi phiên bản vẫn giữ tiến độ theo ID ổn định |
| Sao lưu | Xuất/nhập JSON có `schemaVersion`, đối chiếu ID và cảnh báo ghi đè, không tải dữ liệu lên server |
| Riêng tư | Không tài khoản, không backend, không analytics xâm nhập; dữ liệu nằm trên thiết bị/trình duyệt |

### 2.4. Bài nào có nhiều từ?

- Số từ gán vào bài **không cố chia đều** vì ưu tiên chủ đề và liên hệ Kanji.
- Bài có nhiều từ tự chia **nhóm nhỏ 5–8 từ/lượt**; vẫn là **một bài**, không tạo bài 16/17 hoặc chia thành tuần.
- Từ ★ hiện trước, từ ☆ hiện sau; người học có thể bỏ lọc và học toàn bộ.
- Các bài học phải tránh áp lực kiểu “hôm nay phải thuộc 30 từ”; tiến độ dựa vào kết quả chấm.

---

## 3. Phân phối toàn bộ 262 từ theo 15 bài

**Quy tắc phân phối:** mỗi từ có **một bài chính** để kiểm đếm, có thể có liên kết sang bài khác bằng `relatedLessonIds`. Không nhân bản tiến độ. **Bảng dưới đây là nguồn chỉ dẫn đầy đủ để seed dữ liệu cho frontend**, mọi nghĩa/loại từ/Hiragana/Romaji giữ theo TXT.


| Bài | Chủ đề | Từ bổ sung | ★ Học trước | ☆ Mở rộng |
|---:|---|---:|---:|---:|
| 01 | Thời gian & Mùa | 23 | 13 | 10 |
| 02 | Thiên nhiên | 11 | 8 | 3 |
| 03 | Địa danh & Nơi chốn | 18 | 10 | 8 |
| 04 | Màu sắc, Động vật & Ăn uống | 24 | 13 | 11 |
| 05 | Cơ thể & Sức khỏe | 16 | 12 | 4 |
| 06 | Gia đình & Con người | 15 | 11 | 4 |
| 07 | Nhà & Công trình | 9 | 7 | 2 |
| 08 | Di chuyển | 22 | 11 | 11 |
| 09 | Học tập | 18 | 11 | 7 |
| 10 | Ngôn ngữ & Tư duy | 17 | 10 | 7 |
| 11 | Công việc & Kinh doanh | 16 | 10 | 6 |
| 12 | Hành động hằng ngày | 22 | 11 | 11 |
| 13 | Trạng thái & Tính từ | 25 | 12 | 13 |
| 14 | Âm nhạc, Nghệ thuật & Đời sống | 17 | 10 | 7 |
| 15 | Từ trừu tượng hay gặp | 9 | 7 | 2 |
| **Tổng** | | **262** | **156** | **106** |

### BÀI 01 — Thời gian & Mùa (23 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V005 | ☆ | 暖かい | あたたかい | Ấm áp | Tính từ い | atatakai |
| V006 | ★ | 暑い | あつい | Nóng (thời tiết) | Tính từ い | atsui |
| V007 | ★ | 寒い | さむい | Lạnh (thời tiết) | Tính từ い | samui |
| V008 | ☆ | 涼しい | すずしい | Mát mẻ | Tính từ い | suzushii |
| V144 | ★ | 朝 | あさ | Buổi sáng | Danh từ | asa |
| V145 | ★ | 明日 | あした | Ngày mai | Danh từ | ashita |
| V146 | ★ | 今朝 | けさ | Sáng nay | Danh từ | kesa |
| V147 | ☆ | 今度 | こんど | Lần này; lần tới | Danh từ | kondo |
| V148 | ☆ | 今晩 | こんばん | Tối nay | Danh từ | konban |
| V149 | ★ | 今夜 | こんや | Đêm nay | Danh từ | konya |
| V150 | ★ | 夏休み | なつやすみ | Kỳ nghỉ hè | Danh từ | natsuyasumi |
| V151 | ★ | 昼 | ひる | Ban ngày; buổi trưa | Danh từ | hiru |
| V152 | ☆ | 昼休み | ひるやすみ | Giờ nghỉ trưa | Danh từ | hiruyasumi |
| V153 | ☆ | 夕方 | ゆうがた | Chiều tối | Danh từ | yuugata |
| V154 | ★ | 夜 | よる | Buổi tối; ban đêm | Danh từ | yoru |
| V155 | ★ | 秋 | あき | Mùa thu | Danh từ | aki |
| V156 | ☆ | 季節 | きせつ | Mùa (trong năm) | Danh từ | kisetsu |
| V157 | ★ | 夏 | なつ | Mùa hè | Danh từ | natsu |
| V158 | ★ | 春 | はる | Mùa xuân | Danh từ | haru |
| V159 | ★ | 冬 | ふゆ | Mùa đông | Danh từ | fuyu |
| V205 | ☆ | お正月 | しょうがつ | Tết Dương lịch; dịp đầu năm ở Nhật | Danh từ | shougatsu |
| V235 | ☆ | 時計 | とけい | Đồng hồ | Danh từ | tokei |
| V238 | ☆ | 日曜日 | にちようび | Chủ Nhật | Danh từ | nichiyoubi |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 明日の朝は寒いです。 | あしたのあさはさむいです。 | Sáng mai trời lạnh. |
| 夏休みは楽しいです。 | なつやすみはたのしいです。 | Kỳ nghỉ hè thật vui. |
| 今夜、友達と会います。 | こんや、ともだちとあいます。 | Tối nay tôi sẽ gặp bạn. |

**Điểm cần phân biệt:**

- `今朝（けさ）` là cách đọc đặc biệt; không suy ra từng chữ.
- `今夜` và `今晩` gần nghĩa nhưng cách đọc khác.
- Chú ý `暑い` nói về thời tiết, không lẫn với `熱い` khi nói đồ vật nóng.

**Bộ kiểm tra mẫu Bài 01 — 3 câu ABCD đã viết sẵn:**


**Q01-01 [reading]** 「今朝」の読み方は？  
**A.** いまあさ / **B.** けさ / **C.** こんや / **D.** あした

<details><summary>Đáp án & giải thích</summary>

**B. けさ** — `今朝` đọc đặc biệt là `けさ`.

</details>


**Q01-02 [meaning]** 「昼休み」はどういう意味？  
**A.** Bữa sáng / **B.** Giờ nghỉ trưa / **C.** Đêm nay / **D.** Kỳ nghỉ hè

<details><summary>Đáp án & giải thích</summary>

**B. Giờ nghỉ trưa** — `昼` = trưa, `休み` = nghỉ.

</details>


**Q01-03 [context]** 明日の朝は ____ です。  
**A.** 寒い / **B.** 朝 / **C.** 春 / **D.** 今夜

<details><summary>Đáp án & giải thích</summary>

**A. 寒い** — `寒い` là tính từ い, phù hợp vị trí trước です và ngữ cảnh trời lạnh.

</details>


### BÀI 02 — Thiên nhiên (11 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V010 | ☆ | 明るい | あかるい | Sáng; vui vẻ | Tính từ い | akarui |
| V013 | ☆ | 暗い | くらい | Tối; u ám | Tính từ い | kurai |
| V164 | ★ | 池 | いけ | Ao; hồ nhỏ | Danh từ | ike |
| V171 | ★ | 海 | うみ | Biển | Danh từ | umi |
| V207 | ★ | 風 | かぜ | Gió | Danh từ | kaze |
| V226 | ★ | 台風 | たいふう | Bão; bão nhiệt đới | Danh từ | taifuu |
| V231 | ★ | 天気 | てんき | Thời tiết | Danh từ | tenki |
| V240 | ★ | 林 | はやし | Rừng thưa; lùm cây | Danh từ | hayashi |
| V242 | ☆ | 光 | ひかり | Ánh sáng | Danh từ | hikari |
| V253 | ★ | 森 | もり | Rừng | Danh từ | mori |
| V257 | ★ | 雪 | ゆき | Tuyết | Danh từ | yuki |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| この森はとても暗いです。 | このもりはとてもくらいです。 | Khu rừng này rất tối. |
| 海の近くは風が強いです。 | うみのちかくはかぜがつよいです。 | Gần biển gió mạnh. |
| 今日は天気がいいです。 | きょうはてんきがいいです。 | Hôm nay thời tiết đẹp. |

**Điểm cần phân biệt:**

- `森` (rừng rậm) và `林` (rừng thưa) là mẹo gợi nhớ hình chữ, không áp dụng cứng cho mọi ngữ cảnh.
- `暗い` và `明るい` là cặp đối nghĩa thường dùng để miêu tả không gian.
- `台風` là bão nhiệt đới; `風` là gió.

**Bộ kiểm tra mẫu Bài 02 — 3 câu ABCD đã viết sẵn:**


**Q02-01 [reading]** 「台風」の読み方は？  
**A.** だいかぜ / **B.** たいふう / **C.** だいふう / **D.** たふう

<details><summary>Đáp án & giải thích</summary>

**B. たいふう** — `台風（たいふう）` là bão nhiệt đới.

</details>


**Q02-02 [meaning]** 「池」の nghĩa là gì?  
**A.** Biển / **B.** Rừng / **C.** Ao; hồ nhỏ / **D.** Tuyết

<details><summary>Đáp án & giải thích</summary>

**C. Ao; hồ nhỏ** — `池（いけ）` = ao, hồ nhỏ.

</details>


**Q02-03 [context]** 海の近くは ____ が強いです。  
**A.** 風 / **B.** 池 / **C.** 森 / **D.** 天気

<details><summary>Đáp án & giải thích</summary>

**A. 風** — `風が強い` là cách nói gió mạnh.

</details>


### BÀI 03 — Địa danh & Nơi chốn (18 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V017 | ☆ | 近い | ちかい | Gần | Tính từ い | chikai |
| V111 | ★ | 京都市 | きょうとし | Thành phố Kyoto | Danh từ | kyoutoshi |
| V112 | ☆ | 京都府 | きょうとふ | Phủ Kyoto | Danh từ | kyoutofu |
| V117 | ★ | 東京都 | とうきょうと | Đô Tokyo | Danh từ | toukyouto |
| V118 | ★ | 所 | ところ | Nơi; chỗ | Danh từ | tokoro |
| V119 | ☆ | 長野県 | ながのけん | Tỉnh Nagano | Danh từ | naganoken |
| V120 | ★ | 場所 | ばしょ | Địa điểm; nơi chốn | Danh từ | basho |
| V179 | ☆ | 海外 | かいがい | Nước ngoài; hải ngoại | Danh từ | kaigai |
| V206 | ★ | 世界 | せかい | Thế giới | Danh từ | sekai |
| V211 | ★ | 近所 | きんじょ | Hàng xóm; khu vực lân cận | Danh từ | kinjo |
| V212 | ★ | 区 | く | Quận | Danh từ | ku |
| V220 | ☆ | 市民 | しみん | Công dân; cư dân thành phố | Danh từ | shimin |
| V222 | ★ | 住所 | じゅうしょ | Địa chỉ | Danh từ | juusho |
| V227 | ★ | 地図 | ちず | Bản đồ | Danh từ | chizu |
| V229 | ☆ | 地理 | ちり | Địa lý | Danh từ | chiri |
| V250 | ★ | 町 | まち | Thị trấn; phố | Danh từ | machi |
| V251 | ☆ | 真ん中 | まんなか | Chính giữa; trung tâm | Danh từ | mannaka |
| V252 | ☆ | 村 | むら | Làng; xã | Danh từ | mura |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 私は京都市に住んでいます。 | わたしはきょうとしにすんでいます。 | Tôi đang sống ở thành phố Kyoto. |
| 家の近所に銀行があります。 | いえのきんじょにぎんこうがあります。 | Gần nhà tôi có ngân hàng. |
| この町の地図を見てください。 | このまちのちずをみてください。 | Hãy xem bản đồ của thị trấn này. |

**Điểm cần phân biệt:**

- `京都市` là thành phố, `京都府` là đơn vị cấp tỉnh/phủ; không đánh đồng.
- `所` đọc `ところ`, còn `場所` đọc `ばしょ`.
- `近い` là gần theo khoảng cách, `近所` là khu lân cận.

**Bộ kiểm tra mẫu Bài 03 — 3 câu ABCD đã viết sẵn:**


**Q03-01 [reading]** 「住所」の読み方は？  
**A.** じゅうしょう / **B.** じゅうしょ / **C.** すみしょ / **D.** じゅしょ

<details><summary>Đáp án & giải thích</summary>

**B. じゅうしょ** — `住所（じゅうしょ）` nghĩa là địa chỉ.

</details>


**Q03-02 [meaning]** 「近所」の nghĩa là gì?  
**A.** Địa điểm / **B.** Thành phố / **C.** Hàng xóm; khu vực lân cận / **D.** Quận

<details><summary>Đáp án & giải thích</summary>

**C. Hàng xóm; khu vực lân cận** — `近所（きんじょ）` chỉ khu vực lân cận.

</details>


**Q03-03 [context]** 私は京都市に ____。  
**A.** 住んでいます / **B.** 歌っています / **C.** 売っています / **D.** 降りています

<details><summary>Đáp án & giải thích</summary>

**A. 住んでいます** — `〜に住んでいます` diễn đạt đang cư trú ở một nơi.

</details>


### BÀI 04 — Màu sắc, Động vật & Ăn uống (24 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V001 | ★ | 青い | あおい | Xanh dương; xanh | Tính từ い | aoi |
| V002 | ★ | 赤い | あかい | Đỏ | Tính từ い | akai |
| V003 | ★ | 黒い | くろい | Đen | Tính từ い | kuroi |
| V004 | ★ | 白い | しろい | Trắng | Tính từ い | shiroi |
| V083 | ★ | 注文する | ちゅうもんする | Đặt hàng; gọi món | Động từ | chuumonsuru |
| V110 | ☆ | 食堂 | しょくどう | Nhà ăn; quán ăn | Danh từ | shokudou |
| V160 | ★ | 味 | あじ | Vị; hương vị | Danh từ | aji |
| V168 | ☆ | 犬 | いぬ | Con chó | Danh từ | inu |
| V170 | ☆ | 色 | いろ | Màu sắc | Danh từ | iro |
| V175 | ★ | お茶 | おちゃ | Trà | Danh từ | ocha |
| V193 | ☆ | 子犬 | こいぬ | Chó con | Danh từ | koinu |
| V198 | ☆ | 米 | こめ | Gạo | Danh từ | kome |
| V210 | ★ | 牛肉 | ぎゅうにく | Thịt bò | Danh từ | gyuuniku |
| V215 | ☆ | 小鳥 | ことり | Chim nhỏ | Danh từ | kotori |
| V216 | ★ | ご飯 | ごはん | Cơm; bữa ăn | Danh từ | gohan |
| V223 | ☆ | 食料品 | しょくりょうひん | Lương thực; thực phẩm | Danh từ | shokuryouhin |
| V228 | ☆ | 茶色 | ちゃいろ | Màu nâu | Danh từ | chairo |
| V233 | ☆ | 動物 | どうぶつ | Động vật | Danh từ | doubutsu |
| V236 | ★ | 鳥 | とり | Chim | Danh từ | tori |
| V237 | ★ | 肉 | にく | Thịt | Danh từ | niku |
| V241 | ☆ | 晩ご飯 | ばんごはん | Bữa tối | Danh từ | bangohan |
| V255 | ★ | 野菜 | やさい | Rau củ | Danh từ | yasai |
| V256 | ☆ | 夕食 | ゆうしょく | Bữa tối | Danh từ | yuushoku |
| V262 | ★ | 料理 | りょうり | Món ăn; nấu ăn | Danh từ | ryouri |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 私は牛肉が好きです。 | わたしはぎゅうにくがすきです。 | Tôi thích thịt bò. |
| この料理には野菜がたくさん入っています。 | このりょうりにはやさいがたくさんはいっています。 | Món ăn này có nhiều rau củ. |
| お茶を一つください。 | おちゃをひとつください。 | Cho tôi một phần trà. |

**Điểm cần phân biệt:**

- `青い・赤い・黒い・白い` cùng là tính từ い.
- `お茶` và `茶色` có cùng 茶 nhưng chức năng nghĩa khác nhau.
- `料理` có thể chỉ món ăn hoặc việc nấu ăn; cần xem câu.

**Bộ kiểm tra mẫu Bài 04 — 3 câu ABCD đã viết sẵn:**


**Q04-01 [reading]** 「牛肉」の読み方は？  
**A.** うしにく / **B.** ぎゅうにく / **C.** ぎゅにく / **D.** うしじく

<details><summary>Đáp án & giải thích</summary>

**B. ぎゅうにく** — `牛肉` đọc là `ぎゅうにく`.

</details>


**Q04-02 [meaning]** 「野菜」の nghĩa là gì?  
**A.** Rau củ / **B.** Bữa tối / **C.** Hình dạng / **D.** Thịt bò

<details><summary>Đáp án & giải thích</summary>

**A. Rau củ** — `野菜（やさい）` nghĩa là rau củ.

</details>


**Q04-03 [context]** レストランで ____ を注文しました。  
**A.** 牛肉 / **B.** 住所 / **C.** 地図 / **D.** 教室

<details><summary>Đáp án & giải thích</summary>

**A. 牛肉** — `牛肉` là món/nguyên liệu có thể gọi trong nhà hàng.

</details>


### BÀI 05 — Cơ thể & Sức khỏe (16 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V028 | ★ | 元気な | げんきな | Khỏe mạnh; đầy sức sống | Tính từ な | genkina |
| V044 | ★ | 安心する | あんしんする | Yên tâm | Động từ | anshinsuru |
| V050 | ★ | 運動する | うんどうする | Vận động; tập thể dục | Động từ | undousuru |
| V071 | ☆ | 死ぬ | しぬ | Chết | Động từ | shinu |
| V079 | ☆ | 世話をする | せわをする | Chăm sóc; giúp đỡ | Động từ | sewaosuru |
| V089 | ★ | 入院する | にゅういんする | Nhập viện | Động từ | nyuuinsuru |
| V121 | ★ | 病院 | びょういん | Bệnh viện | Danh từ | byouin |
| V134 | ★ | 医者 | いしゃ | Bác sĩ | Danh từ | isha |
| V161 | ★ | 頭 | あたま | Đầu | Danh từ | atama |
| V182 | ★ | 顔 | かお | Khuôn mặt | Danh từ | kao |
| V186 | ★ | 体 | からだ | Cơ thể | Danh từ | karada |
| V189 | ☆ | 気持ち | きもち | Cảm giác; tâm trạng | Danh từ | kimochi |
| V192 | ★ | 首 | くび | Cổ | Danh từ | kubi |
| V197 | ☆ | 心 | こころ | Trái tim; tâm hồn | Danh từ | kokoro |
| V213 | ★ | 薬 | くすり | Thuốc | Danh từ | kusuri |
| V243 | ★ | 病気 | びょうき | Bệnh tật | Danh từ | byouki |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 母は病院にいます。 | はははびょういんにいます。 | Mẹ tôi đang ở bệnh viện. |
| 毎朝、運動します。 | まいあさ、うんどうします。 | Mỗi sáng tôi tập thể dục. |
| 薬を飲んで、休んでください。 | くすりをのんで、やすんでください。 | Hãy uống thuốc rồi nghỉ ngơi. |

**Điểm cần phân biệt:**

- `病院` (bệnh viện), `医者` (bác sĩ), `薬` (thuốc) nên học thành chuỗi ngữ cảnh.
- `頭・顔・首・体` là bộ phận cơ thể; học với cách đọc đúng của cả từ.
- `安心する` là yên tâm; mở ví dụ ngữ cảnh trước khi hiện nghĩa.

**Bộ kiểm tra mẫu Bài 05 — 3 câu ABCD đã viết sẵn:**


**Q05-01 [reading]** 「病院」の読み方は？  
**A.** びょいん / **B.** びょういん / **C.** びょうえん / **D.** びょうにん

<details><summary>Đáp án & giải thích</summary>

**B. びょういん** — `病院（びょういん）` nghĩa là bệnh viện.

</details>


**Q05-02 [meaning]** 「薬」の nghĩa là gì?  
**A.** Thuốc / **B.** Bác sĩ / **C.** Trái tim / **D.** Bệnh viện

<details><summary>Đáp án & giải thích</summary>

**A. Thuốc** — `薬（くすり）` nghĩa là thuốc.

</details>


**Q05-03 [context]** 頭が痛いので、____ へ行きます。  
**A.** 病院 / **B.** 銀行 / **C.** 工場 / **D.** 映画館

<details><summary>Đáp án & giải thích</summary>

**A. 病院** — Đau đầu nên đi bệnh viện là đáp án phù hợp ngữ cảnh nhất.

</details>


### BÀI 06 — Gia đình & Con người (15 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V029 | ★ | 親切な | しんせつな | Tốt bụng; tử tế | Tính từ な | shinsetsuna |
| V047 | ☆ | 産む | うむ | Sinh con; đẻ | Động từ | umu |
| V105 | ☆ | 別れる | わかれる | Chia tay; chia ly | Động từ | wakareru |
| V123 | ★ | 兄 | あに | Anh trai (của mình) | Danh từ | ani |
| V124 | ★ | 姉 | あね | Chị gái (của mình) | Danh từ | ane |
| V125 | ★ | 妹 | いもうと | Em gái | Danh từ | imouto |
| V126 | ★ | 弟 | おとうと | Em trai | Danh từ | otouto |
| V127 | ★ | お兄さん | おにいさん | Anh trai (cách gọi lịch sự; người khác) | Danh từ | oniisan |
| V128 | ★ | お姉さん | おねえさん | Chị gái (cách gọi lịch sự; người khác) | Danh từ | oneesan |
| V129 | ★ | 親 | おや | Cha mẹ; phụ huynh | Danh từ | oya |
| V130 | ★ | 兄弟 | きょうだい | Anh chị em; anh em ruột | Danh từ | kyoudai |
| V131 | ★ | 姉妹 | しまい | Chị em gái | Danh từ | shimai |
| V132 | ☆ | 母親 | ははおや | Mẹ | Danh từ | hahaoya |
| V133 | ★ | 両親 | りょうしん | Bố mẹ; song thân | Danh từ | ryoushin |
| V204 | ☆ | 主人 | しゅじん | Chồng (của mình); chủ | Danh từ | shujin |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 私には兄と姉がいます。 | わたしにはあにとあねがいます。 | Tôi có anh trai và chị gái. |
| 両親はとても親切です。 | りょうしんはとてもしんせつです。 | Bố mẹ tôi rất tốt bụng. |
| 母親に手紙を書きました。 | ははおやにてがみをかきました。 | Tôi đã viết thư cho mẹ. |

**Điểm cần phân biệt:**

- `兄・姉` dùng khi nói về anh/chị của mình; `お兄さん・お姉さん` dùng trong cách gọi lịch sự theo ngữ cảnh.
- `兄弟` có thể dùng theo nghĩa anh chị em rộng; không chỉ giới hạn anh trai và em trai.
- `親切な` có `な` trong dạng bổ nghĩa danh từ.

**Bộ kiểm tra mẫu Bài 06 — 3 câu ABCD đã viết sẵn:**


**Q06-01 [reading]** 「両親」の読み方は？  
**A.** りょうしん / **B.** りょうおや / **C.** ふたおや / **D.** りょうじん

<details><summary>Đáp án & giải thích</summary>

**A. りょうしん** — `両親（りょうしん）` nghĩa là bố mẹ.

</details>


**Q06-02 [meaning]** 「妹」の nghĩa là gì?  
**A.** Chị gái / **B.** Em trai / **C.** Em gái / **D.** Mẹ

<details><summary>Đáp án & giải thích</summary>

**C. Em gái** — `妹（いもうと）` là em gái.

</details>


**Q06-03 [context]** 母と父は私の ____ です。  
**A.** 両親 / **B.** 姉妹 / **C.** 兄弟 / **D.** 親切

<details><summary>Đáp án & giải thích</summary>

**A. 両親** — `両親` chỉ bố và mẹ.

</details>


### BÀI 07 — Nhà & Công trình (9 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V077 | ★ | 住む | すむ | Sinh sống; cư trú | Động từ | sumu |
| V080 | ★ | 建てる | たてる | Xây dựng (nhà; công trình) | Động từ | tateru |
| V114 | ☆ | 大使館 | たいしかん | Đại sứ quán | Danh từ | taishikan |
| V115 | ★ | 建物 | たてもの | Tòa nhà; công trình | Danh từ | tatemono |
| V122 | ★ | 旅館 | りょかん | Nhà trọ kiểu Nhật | Danh từ | ryokan |
| V174 | ★ | 屋上 | おくじょう | Sân thượng; mái bằng | Danh từ | okujou |
| V225 | ★ | 台所 | だいどころ | Nhà bếp | Danh từ | daidokoro |
| V248 | ☆ | 引き出し | ひきだし | Ngăn kéo | Danh từ | hikidashi |
| V249 | ★ | 本屋 | ほんや | Hiệu sách; cửa hàng sách | Danh từ | honya |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 駅の近くに旅館があります。 | えきのちかくにりょかんがあります。 | Gần nhà ga có một nhà trọ kiểu Nhật. |
| この建物は新しいです。 | このたてものはあたらしいです。 | Tòa nhà này mới. |
| 台所で料理を作ります。 | だいどころでりょうりをつくります。 | Tôi nấu ăn trong bếp. |

**Điểm cần phân biệt:**

- `建てる` là xây dựng, `建物` là tòa nhà.
- `旅館` là nhà trọ/khách trọ kiểu Nhật; `台所` là nhà bếp.
- `住む` thường đi với trợ từ に cho nơi cư trú.

**Bộ kiểm tra mẫu Bài 07 — 3 câu ABCD đã viết sẵn:**


**Q07-01 [reading]** 「建物」の読み方は？  
**A.** けんもの / **B.** たてもの / **C.** たつもの / **D.** けんぶつ

<details><summary>Đáp án & giải thích</summary>

**B. たてもの** — `建物（たてもの）` là tòa nhà.

</details>


**Q07-02 [meaning]** 「台所」の nghĩa là gì?  
**A.** Sân thượng / **B.** Nhà bếp / **C.** Hiệu sách / **D.** Nhà trọ

<details><summary>Đáp án & giải thích</summary>

**B. Nhà bếp** — `台所（だいどころ）` là nhà bếp.

</details>


**Q07-03 [context]** 料理をするときは、____ を使います。  
**A.** 台所 / **B.** 映画館 / **C.** 図書館 / **D.** 大使館

<details><summary>Đáp án & giải thích</summary>

**A. 台所** — Nhà bếp phù hợp nhất khi nấu ăn.

</details>


### BÀI 08 — Di chuyển (22 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V043 | ★ | 歩く | あるく | Đi bộ | Động từ | aruku |
| V045 | ☆ | 動く | うごく | Chuyển động; hoạt động | Động từ | ugoku |
| V049 | ★ | 運転する | うんてんする | Lái xe | Động từ | untensuru |
| V052 | ☆ | 送る | おくる | Gửi; tiễn; đưa đi | Động từ | okuru |
| V056 | ★ | 降りる | おりる | Xuống (xe; tàu) | Động từ | oriru |
| V059 | ★ | 帰る | かえる | Trở về nhà | Động từ | kaeru |
| V061 | ☆ | 通う | かよう | Đi lại thường xuyên (đến trường; nơi làm việc) | Động từ | kayou |
| V073 | ★ | 出発する | しゅっぱつする | Xuất phát; khởi hành | Động từ | shuppatsusuru |
| V076 | ☆ | 進む | すすむ | Tiến lên; tiến triển | Động từ | susumu |
| V085 | ★ | 着く | つく | Đến nơi | Động từ | tsuku |
| V087 | ☆ | 止まる | とまる | Dừng lại | Động từ | tomaru |
| V088 | ☆ | 間に合う | まにあう | Kịp giờ; kịp thời | Động từ | maniau |
| V091 | ★ | 乗る | のる | Lên; đi (phương tiện) | Động từ | noru |
| V092 | ☆ | 運ぶ | はこぶ | Vận chuyển; mang đi | Động từ | hakobu |
| V094 | ★ | 走る | はしる | Chạy | Động từ | hashiru |
| V104 | ☆ | 旅行する | りょこうする | Du lịch | Động từ | ryokousuru |
| V138 | ★ | 自転車 | じてんしゃ | Xe đạp | Danh từ | jitensha |
| V139 | ☆ | 自動車 | じどうしゃ | Ô tô; xe hơi | Danh từ | jidousha |
| V140 | ☆ | 信号 | しんごう | Tín hiệu; đèn giao thông | Danh từ | shingou |
| V141 | ★ | 交通 | こうつう | Giao thông | Danh từ | koutsuu |
| V142 | ★ | 地下鉄 | ちかてつ | Tàu điện ngầm | Danh từ | chikatetsu |
| V143 | ☆ | 特急 | とっきゅう | Tàu tốc hành đặc biệt | Danh từ | tokkyuu |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 毎朝、自転車で学校へ通います。 | まいあさ、じてんしゃでがっこうへかよいます。 | Mỗi sáng tôi đi học bằng xe đạp. |
| 次の駅で降ります。 | つぎのえきでおります。 | Tôi xuống ở ga kế tiếp. |
| 電車はもう出発しました。 | でんしゃはもうしゅっぱつしました。 | Tàu đã khởi hành rồi. |

**Điểm cần phân biệt:**

- `乗る` (lên phương tiện) ↔ `降りる` (xuống phương tiện).
- `帰る` (trở về) khác `返す` (trả lại đồ).
- `出発する` (khởi hành) khác `着く` (đến nơi).

**Bộ kiểm tra mẫu Bài 08 — 3 câu ABCD đã viết sẵn:**


**Q08-01 [reading]** 「自転車」の読み方は？  
**A.** じどうしゃ / **B.** じてんしゃ / **C.** してんしゃ / **D.** じでんしゃ

<details><summary>Đáp án & giải thích</summary>

**B. じてんしゃ** — `自転車（じてんしゃ）` là xe đạp.

</details>


**Q08-02 [meaning]** 「降りる」の nghĩa là gì?  
**A.** Lên xe / **B.** Xuống xe; tàu / **C.** Vận chuyển / **D.** Đi bộ

<details><summary>Đáp án & giải thích</summary>

**B. Xuống xe; tàu** — `降りる（おりる）` là xuống phương tiện.

</details>


**Q08-03 [context]** 次の駅で電車を ____。  
**A.** 降ります / **B.** 乗ります / **C.** 歌います / **D.** 買います

<details><summary>Đáp án & giải thích</summary>

**A. 降ります** — Có trợ từ を và ngữ cảnh xuống tàu ở ga tiếp theo: `電車を降ります`.

</details>


### BÀI 09 — Học tập (18 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V053 | ★ | 教える | おしえる | Dạy; chỉ bảo | Động từ | oshieru |
| V068 | ☆ | 研究する | けんきゅうする | Nghiên cứu | Động từ | kenkyuusuru |
| V069 | ★ | 答える | こたえる | Trả lời | Động từ | kotaeru |
| V070 | ★ | 質問する | しつもんする | Đặt câu hỏi | Động từ | shitsumonsuru |
| V081 | ☆ | 注意する | ちゅういする | Chú ý; cẩn thận | Động từ | chuuisuru |
| V090 | ★ | 習う | ならう | Học (từ người hướng dẫn) | Động từ | narau |
| V098 | ★ | 勉強する | べんきょうする | Học tập | Động từ | benkyousuru |
| V107 | ★ | 教室 | きょうしつ | Phòng học; lớp học | Danh từ | kyoushitsu |
| V113 | ☆ | 大学院 | だいがくいん | Trường cao học; bậc sau đại học | Danh từ | daigakuin |
| V116 | ★ | 図書館 | としょかん | Thư viện | Danh từ | toshokan |
| V181 | ☆ | 科学 | かがく | Khoa học | Danh từ | kagaku |
| V185 | ☆ | 紙 | かみ | Giấy | Danh từ | kami |
| V188 | ★ | 漢字 | かんじ | Chữ Hán; Kanji | Danh từ | kanji |
| V191 | ★ | 教科書 | きょうかしょ | Sách giáo khoa | Danh từ | kyoukasho |
| V199 | ☆ | 作文 | さくぶん | Bài văn; tập làm văn | Danh từ | sakubun |
| V201 | ☆ | 字 | じ | Chữ; ký tự | Danh từ | ji |
| V219 | ★ | 試験 | しけん | Kỳ thi; bài kiểm tra | Danh từ | shiken |
| V254 | ★ | 問題 | もんだい | Vấn đề; câu hỏi | Danh từ | mondai |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 図書館で勉強します。 | としょかんでべんきょうします。 | Tôi học ở thư viện. |
| 試験の問題に答えます。 | しけんのもんだいにこたえます。 | Tôi trả lời câu hỏi của bài thi. |
| 先生に質問します。 | せんせいにしつもんします。 | Tôi đặt câu hỏi cho giáo viên. |

**Điểm cần phân biệt:**

- `習う` là học từ người hướng dẫn, `教える` là dạy.
- `質問する` (đặt câu hỏi) ↔ `答える` (trả lời).
- `試験` là kỳ thi; `問題` là câu hỏi/vấn đề.

**Bộ kiểm tra mẫu Bài 09 — 3 câu ABCD đã viết sẵn:**


**Q09-01 [reading]** 「試験」の読み方は？  
**A.** しけん / **B.** じけん / **C.** しげん / **D.** しつけん

<details><summary>Đáp án & giải thích</summary>

**A. しけん** — `試験（しけん）` là kỳ thi.

</details>


**Q09-02 [meaning]** 「教科書」の nghĩa là gì?  
**A.** Phòng học / **B.** Sách giáo khoa / **C.** Đáp án / **D.** Thư viện

<details><summary>Đáp án & giải thích</summary>

**B. Sách giáo khoa** — `教科書（きょうかしょ）` nghĩa là sách giáo khoa.

</details>


**Q09-03 [context]** 分からないところは先生に ____。  
**A.** 質問します / **B.** 乗ります / **C.** 洗います / **D.** 売ります

<details><summary>Đáp án & giải thích</summary>

**A. 質問します** — `先生に質問します` là đặt câu hỏi cho thầy/cô.

</details>


### BÀI 10 — Ngôn ngữ & Tư duy (17 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V009 | ☆ | 頭がいい | あたまがいい | Thông minh | Cụm tính từ い | atamagaii |
| V015 | ★ | 正しい | ただしい | Đúng; chính xác | Tính từ い | tadashii |
| V054 | ★ | 思い出す | おもいだす | Nhớ ra; hồi tưởng | Động từ | omoidasu |
| V055 | ★ | 思う | おもう | Nghĩ; cho rằng | Động từ | omou |
| V064 | ★ | 考える | かんがえる | Suy nghĩ; cân nhắc | Động từ | kangaeru |
| V065 | ☆ | 強調する | きょうちょうする | Nhấn mạnh | Động từ | kyouchousuru |
| V074 | ★ | 知る | しる | Biết | Động từ | shiru |
| V075 | ☆ | 信じる | しんじる | Tin tưởng | Động từ | shinjiru |
| V078 | ★ | 説明する | せつめいする | Giải thích | Động từ | setsumeisuru |
| V165 | ★ | 意見 | いけん | Ý kiến | Danh từ | iken |
| V169 | ★ | 意味 | いみ | Ý nghĩa | Danh từ | imi |
| V173 | ★ | 英語 | えいご | Tiếng Anh | Danh từ | eigo |
| V202 | ★ | 自分 | じぶん | Bản thân | Danh từ | jibun |
| V203 | ☆ | 小説 | しょうせつ | Tiểu thuyết | Danh từ | shousetsu |
| V224 | ☆ | 説明 | せつめい | Sự giải thích | Danh từ | setsumei |
| V245 | ☆ | 文 | ぶん | Câu văn; văn bản ngắn | Danh từ | bun |
| V246 | ☆ | 文学 | ぶんがく | Văn học | Danh từ | bungaku |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| この漢字の意味を教えてください。 | このかんじのいみをおしえてください。 | Hãy cho tôi biết nghĩa của chữ Kanji này. |
| 英語で説明します。 | えいごでせつめいします。 | Tôi giải thích bằng tiếng Anh. |
| 彼の意見は正しいと思います。 | かれのいけんはただしいとおもいます。 | Tôi nghĩ ý kiến của anh ấy đúng. |

**Điểm cần phân biệt:**

- `思う` thiên về ý nghĩ/nhận định, `考える` thiên về suy xét; không gọi đây là cặp chủ động–bị động.
- `意味` = ý nghĩa, `意見` = ý kiến.
- `知る` = biết; không tự động thay bằng `分かる` trong mọi câu.

**Bộ kiểm tra mẫu Bài 10 — 3 câu ABCD đã viết sẵn:**


**Q10-01 [reading]** 「意見」の読み方は？  
**A.** いけん / **B.** いみ / **C.** しけん / **D.** いげん

<details><summary>Đáp án & giải thích</summary>

**A. いけん** — `意見（いけん）` nghĩa là ý kiến.

</details>


**Q10-02 [meaning]** 「思い出す」の nghĩa là gì?  
**A.** Nhớ ra; hồi tưởng / **B.** Học thuộc lòng / **C.** Thông báo / **D.** Tính toán

<details><summary>Đáp án & giải thích</summary>

**A. Nhớ ra; hồi tưởng** — `思い出す` = nhớ ra/hồi tưởng.

</details>


**Q10-03 [context]** この言葉の ____ を教えてください。  
**A.** 意味 / **B.** 映画 / **C.** 料理 / **D.** 住所

<details><summary>Đáp án & giải thích</summary>

**A. 意味** — Xin cho biết `意味` (ý nghĩa) của từ này.

</details>


### BÀI 11 — Công việc & Kinh doanh (16 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V048 | ★ | 売る | うる | Bán | Động từ | uru |
| V086 | ☆ | 作る | つくる | Làm; chế tạo | Động từ | tsukuru |
| V095 | ★ | 働く | はたらく | Làm việc | Động từ | hataraku |
| V103 | ☆ | 利用する | りようする | Sử dụng; tận dụng | Động từ | riyousuru |
| V108 | ★ | 銀行 | ぎんこう | Ngân hàng | Danh từ | ginkou |
| V109 | ★ | 工場 | こうじょう | Nhà máy; công xưởng | Danh từ | koujou |
| V136 | ★ | 仕事 | しごと | Công việc | Danh từ | shigoto |
| V137 | ★ | 店員 | てんいん | Nhân viên cửa hàng | Danh từ | tenin |
| V180 | ★ | 買い物 | かいもの | Mua sắm | Danh từ | kaimono |
| V194 | ☆ | 工業 | こうぎょう | Công nghiệp | Danh từ | kougyou |
| V195 | ☆ | 工事 | こうじ | Công trình; thi công | Danh từ | kouji |
| V200 | ☆ | 産業 | さんぎょう | Ngành công nghiệp; sản nghiệp | Danh từ | sangyou |
| V214 | ☆ | 計画 | けいかく | Kế hoạch | Danh từ | keikaku |
| V217 | ★ | 品物 | しなもの | Hàng hóa; đồ vật | Danh từ | shinamono |
| V258 | ★ | 用事 | ようじ | Công việc cần làm; việc bận | Danh từ | youji |
| V260 | ★ | 料金 | りょうきん | Phí; tiền dịch vụ | Danh từ | ryoukin |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 母は銀行で働いています。 | はははぎんこうではたらいています。 | Mẹ tôi làm việc ở ngân hàng. |
| お店で品物を買いました。 | おみせでしなものをかいました。 | Tôi đã mua hàng ở cửa hàng. |
| 料金を確認してください。 | りょうきんをかくにんしてください。 | Hãy kiểm tra mức phí. |

**Điểm cần phân biệt:**

- `仕事` (công việc), `働く` (làm việc), `店員` (nhân viên cửa hàng) liên kết thành bối cảnh.
- `料金` chỉ phí/giá dịch vụ; `品物` chỉ hàng hóa/đồ vật.
- `工場` là nhà máy; `工事` là công trình/thi công.

**Bộ kiểm tra mẫu Bài 11 — 3 câu ABCD đã viết sẵn:**


**Q11-01 [reading]** 「銀行」の読み方は？  
**A.** きんこう / **B.** ぎんこう / **C.** ぎんぎょう / **D.** ぎんこ

<details><summary>Đáp án & giải thích</summary>

**B. ぎんこう** — `銀行（ぎんこう）` = ngân hàng.

</details>


**Q11-02 [meaning]** 「料金」の nghĩa là gì?  
**A.** Quần áo / **B.** Phí; tiền dịch vụ / **C.** Nguyên liệu / **D.** Công việc

<details><summary>Đáp án & giải thích</summary>

**B. Phí; tiền dịch vụ** — `料金（りょうきん）` = phí, tiền dịch vụ.

</details>


**Q11-03 [context]** この店では ____ を売っています。  
**A.** 品物 / **B.** 交通 / **C.** 試験 / **D.** 兄弟

<details><summary>Đáp án & giải thích</summary>

**A. 品物** — `品物を売る` là bán hàng hóa.

</details>


### BÀI 12 — Hành động hằng ngày (22 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V038 | ★ | 開ける | あける | Mở (một vật gì đó) | Động từ | akeru |
| V039 | ★ | 開く | あく | Mở; được mở (tự động từ) | Động từ | aku |
| V040 | ☆ | 集まる | あつまる | Tập trung; tụ họp | Động từ | atsumaru |
| V041 | ☆ | 集める | あつめる | Thu thập; tập hợp | Động từ | atsumeru |
| V042 | ★ | 洗う | あらう | Rửa; giặt | Động từ | arau |
| V051 | ★ | 起きる | おきる | Thức dậy | Động từ | okiru |
| V057 | ★ | 終わる | おわる | Kết thúc | Động từ | owaru |
| V058 | ☆ | 返す | かえす | Trả lại | Động từ | kaesu |
| V060 | ★ | 貸す | かす | Cho mượn | Động từ | kasu |
| V062 | ★ | 借りる | かりる | Mượn; thuê | Động từ | kariru |
| V066 | ☆ | 切る | きる | Cắt | Động từ | kiru |
| V072 | ★ | 閉める | しめる | Đóng (cửa; đồ vật) | Động từ | shimeru |
| V082 | ☆ | 中止する | ちゅうしする | Hủy; đình chỉ | Động từ | chuushisuru |
| V084 | ☆ | 使う | つかう | Sử dụng | Động từ | tsukau |
| V093 | ★ | 始める | はじめる | Bắt đầu | Động từ | hajimeru |
| V096 | ☆ | 引く | ひく | Kéo; giật | Động từ | hiku |
| V099 | ★ | 待つ | まつ | Chờ; đợi | Động từ | matsu |
| V100 | ☆ | 回す | まわす | Xoay; quay (vật gì đó) | Động từ | mawasu |
| V101 | ★ | 持つ | もつ | Cầm; mang; sở hữu | Động từ | motsu |
| V102 | ☆ | 用意する | よういする | Chuẩn bị | Động từ | youisuru |
| V208 | ☆ | 切手 | きって | Tem bưu điện | Danh từ | kitte |
| V230 | ☆ | 手紙 | てがみ | Thư (viết tay) | Danh từ | tegami |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| ドアを開けてください。 | ドアをあけてください。 | Hãy mở cửa. |
| 図書館で本を借りました。 | としょかんでほんをかりました。 | Tôi đã mượn sách ở thư viện. |
| 毎朝、七時に起きます。 | まいあさ、しちじにおきます。 | Mỗi sáng tôi thức dậy lúc bảy giờ. |

**Điểm cần phân biệt:**

- `切る` và `着る` cùng đọc `きる` nhưng nghĩa khác nhau; câu hỏi nghe đơn lẻ không thể phân biệt bằng âm.
- `借りる` (mượn) ↔ `貸す` (cho mượn); `返す` là trả lại.
- `開ける` (mở cái gì đó) ↔ `開く（あく）` (tự mở) theo cách đọc của nguồn; `開く` còn có cách đọc khác ngoài nguồn, cần quản lý biến thể trước khi tạo bài kiểm tra.

**Bộ kiểm tra mẫu Bài 12 — 3 câu ABCD đã viết sẵn:**


**Q12-01 [reading]** 「借りる」の読み方は？  
**A.** かす / **B.** かりる / **C.** きりる / **D.** かえる

<details><summary>Đáp án & giải thích</summary>

**B. かりる** — `借りる（かりる）` = mượn/thuê, khác `貸す（かす）`.

</details>


**Q12-02 [meaning]** 「返す」の nghĩa là gì?  
**A.** Trả lại / **B.** Trở về nhà / **C.** Cho mượn / **D.** Đóng cửa

<details><summary>Đáp án & giải thích</summary>

**A. Trả lại** — `返す（かえす）` nghĩa là trả lại.

</details>


**Q12-03 [context]** 寒いので、コートを ____。  
**A.** 着ます / **B.** 切ります / **C.** 開けます / **D.** 止めます

<details><summary>Đáp án & giải thích</summary>

**A. 着ます** — Mặc áo khoác là `着ます` (từ `着る`), không phải `切ります` (cắt).

</details>


### BÀI 13 — Trạng thái & Tính từ (25 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V011 | ★ | 重い | おもい | Nặng | Tính từ い | omoi |
| V012 | ★ | 軽い | かるい | Nhẹ | Tính từ い | karui |
| V014 | ☆ | 細かい | こまかい | Nhỏ; chi tiết; tỉ mỉ | Tính từ い | komakai |
| V018 | ☆ | 都合がいい | つごうがいい | Thuận tiện; phù hợp về thời gian | Cụm tính từ い | tsugougaii |
| V019 | ★ | 強い | つよい | Mạnh | Tính từ い | tsuyoi |
| V020 | ☆ | 低い | ひくい | Thấp | Tính từ い | hikui |
| V021 | ★ | 広い | ひろい | Rộng | Tính từ い | hiroi |
| V022 | ☆ | 太い | ふとい | To; dày (vật dài hoặc hình trụ) | Tính từ い | futoi |
| V023 | ☆ | 細い | ほそい | Mảnh; thon; nhỏ | Tính từ い | hosoi |
| V024 | ★ | 短い | みじかい | Ngắn | Tính từ い | mijikai |
| V025 | ★ | 良い | よい | Tốt | Tính từ い | yoi |
| V026 | ★ | 弱い | よわい | Yếu | Tính từ い | yowai |
| V027 | ★ | 悪い | わるい | Xấu; tệ | Tính từ い | warui |
| V031 | ★ | 大事な | だいじな | Quan trọng; quý giá | Tính từ な | daijina |
| V032 | ★ | 大切な | たいせつな | Quan trọng; quý báu | Tính từ な | taisetsuna |
| V033 | ★ | 大変な | たいへんな | Vất vả; nghiêm trọng | Tính từ な | taihenna |
| V034 | ☆ | 特別な | とくべつな | Đặc biệt | Tính từ な | tokubetsuna |
| V035 | ☆ | 不便な | ふべんな | Bất tiện | Tính từ な | fubenna |
| V036 | ☆ | 変な | へんな | Kỳ lạ; kỳ quặc | Tính từ な | henna |
| V037 | ☆ | 有名な | ゆうめいな | Nổi tiếng | Tính từ な | yuumeina |
| V063 | ☆ | 変わる | かわる | Thay đổi | Động từ | kawaru |
| V097 | ☆ | 変化する | へんかする | Biến đổi; thay đổi | Động từ | henkasuru |
| V176 | ★ | 同じ | おなじ | Giống nhau; cùng một | Tính từ な (đặc biệt) | onaji |
| V184 | ☆ | 形 | かたち | Hình dạng | Danh từ | katachi |
| V234 | ☆ | 特に | とくに | Đặc biệt là; nhất là | Trạng từ | tokuni |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| このかばんは重いです。 | このかばんはおもいです。 | Chiếc túi này nặng. |
| この道は広いですが、車が多いです。 | このみちはひろいですが、くるまがおおいです。 | Con đường này rộng nhưng có nhiều xe. |
| 同じ答えを書きました。 | おなじこたえをかきました。 | Tôi đã viết cùng một đáp án. |

**Điểm cần phân biệt:**

- `重い` ↔ `軽い`, `強い` ↔ `弱い`.
- `太い` (to/dày đồ dài) và `細い` (mảnh) là một cặp dễ nhầm.
- `同じ` được nguồn xếp “Tính từ な (đặc biệt)”; không tự động tạo mẫu `同じな + danh từ`.

**Bộ kiểm tra mẫu Bài 13 — 3 câu ABCD đã viết sẵn:**


**Q13-01 [reading]** 「軽い」の読み方は？  
**A.** おもい / **B.** かるい / **C.** ひろい / **D.** ほそい

<details><summary>Đáp án & giải thích</summary>

**B. かるい** — `軽い（かるい）` là nhẹ.

</details>


**Q13-02 [meaning]** 「大切な」の nghĩa là gì?  
**A.** Kỳ lạ / **B.** Quan trọng; quý báu / **C.** Bất tiện / **D.** Nhẹ

<details><summary>Đáp án & giải thích</summary>

**B. Quan trọng; quý báu** — `大切な` = quan trọng/quý báu.

</details>


**Q13-03 [context]** このかばんは軽いですが、あのかばんは ____。  
**A.** 重い / **B.** 楽しい / **C.** 近い / **D.** 正しい

<details><summary>Đáp án & giải thích</summary>

**A. 重い** — `重い` là nặng, trái nghĩa với `軽い`.

</details>


### BÀI 14 — Âm nhạc, Nghệ thuật & Đời sống (17 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V016 | ☆ | 楽しい | たのしい | Vui; thú vị | Tính từ い | tanoshii |
| V030 | ★ | 好きな | すきな | Thích; yêu thích | Tính từ な | sukina |
| V046 | ★ | 歌う | うたう | Hát | Động từ | utau |
| V067 | ★ | 着る | きる | Mặc (áo; quần áo phần thân trên) | Động từ | kiru |
| V106 | ★ | 映画館 | えいがかん | Rạp chiếu phim | Danh từ | eigakan |
| V135 | ★ | 歌手 | かしゅ | Ca sĩ | Danh từ | kashu |
| V172 | ★ | 映画 | えいが | Phim điện ảnh | Danh từ | eiga |
| V177 | ☆ | 音 | おと | Âm thanh; tiếng động | Danh từ | oto |
| V178 | ★ | 音楽 | おんがく | Âm nhạc | Danh từ | ongaku |
| V190 | ★ | 着物 | きもの | Kimono; trang phục truyền thống Nhật | Danh từ | kimono |
| V196 | ☆ | 声 | こえ | Giọng nói; tiếng nói | Danh từ | koe |
| V218 | ☆ | 試合 | しあい | Trận đấu | Danh từ | shiai |
| V221 | ★ | 写真 | しゃしん | Ảnh chụp | Danh từ | shashin |
| V232 | ☆ | 電池 | でんち | Pin | Danh từ | denchi |
| V239 | ☆ | 人形 | にんぎょう | Búp bê | Danh từ | ningyou |
| V244 | ★ | 服 | ふく | Quần áo | Danh từ | fuku |
| V259 | ☆ | 洋服 | ようふく | Quần áo kiểu Tây | Danh từ | youfuku |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 私は音楽を聞くのが好きです。 | わたしはおんがくをきくのがすきです。 | Tôi thích nghe nhạc. |
| 映画館で映画を見ました。 | えいがかんでえいがをみました。 | Tôi đã xem phim ở rạp. |
| この写真はきれいです。 | このしゃしんはきれいです。 | Bức ảnh này đẹp. |

**Điểm cần phân biệt:**

- `切る（きる）` ở Bài 12 khác `着る（きる）` ở bài này; phải cho ngữ cảnh khi kiểm tra.
- `映画` là phim; `映画館` là rạp chiếu phim.
- `音` = âm thanh, `声` = giọng nói, `音楽` = âm nhạc.

**Bộ kiểm tra mẫu Bài 14 — 3 câu ABCD đã viết sẵn:**


**Q14-01 [reading]** 「映画館」の読み方は？  
**A.** えいがかん / **B.** えいかん / **C.** えがかん / **D.** えいがけん

<details><summary>Đáp án & giải thích</summary>

**A. えいがかん** — `映画館（えいがかん）` là rạp chiếu phim.

</details>


**Q14-02 [meaning]** 「写真」の nghĩa là gì?  
**A.** Âm nhạc / **B.** Ảnh chụp / **C.** Búp bê / **D.** Phim điện ảnh

<details><summary>Đáp án & giải thích</summary>

**B. Ảnh chụp** — `写真（しゃしん）` nghĩa là ảnh chụp.

</details>


**Q14-03 [context]** 映画を見るために、____ に行きます。  
**A.** 映画館 / **B.** 病院 / **C.** 銀行 / **D.** 工場

<details><summary>Đáp án & giải thích</summary>

**A. 映画館** — Đến rạp chiếu phim để xem phim.

</details>


### BÀI 15 — Từ trừu tượng hay gặp (9 từ bổ sung)

**Bộ từ gốc (giữ nguyên nội dung nguồn, được đổi vị trí theo chủ đề):**

| ID | Ưu tiên | Từ tiếng Nhật | Hiragana | Nghĩa tiếng Việt — nguyên bản | Loại từ — nguyên bản | Romaji |
|---|:---:|---|---|---|---|---|
| V162 | ★ | 以下 | いか | Trở xuống; không vượt quá | Danh từ | ika |
| V163 | ★ | 以外 | いがい | Ngoài ra; ngoại trừ | Danh từ | igai |
| V166 | ★ | 以上 | いじょう | Trở lên; ít nhất | Danh từ | ijou |
| V167 | ★ | 一回 | いっかい | Một lần | Danh từ | ikkai |
| V183 | ☆ | 火事 | かじ | Hỏa hoạn; cháy nhà | Danh từ | kaji |
| V187 | ★ | 代わりに | かわりに | Thay cho; thay vì | Trạng từ / cụm từ | kawarini |
| V209 | ★ | 急に | きゅうに | Đột nhiên; bất ngờ | Trạng từ | kyuuni |
| V247 | ☆ | 分野 | ぶんや | Lĩnh vực | Danh từ | bunya |
| V261 | ★ | 両方 | りょうほう | Cả hai phía; cả hai | Danh từ | ryouhou |

**3 câu ví dụ vận dụng (tự biên soạn mới; cần QA trước khi publish):**

| Câu tiếng Nhật | Đọc Hiragana toàn câu | Dịch tiếng Việt |
|---|---|---|
| 十八歳以上の人が参加できます。 | じゅうはっさいいじょうのひとがさんかできます。 | Người từ 18 tuổi trở lên có thể tham gia. |
| コーヒー以外の飲み物をください。 | コーヒーいがいののみものをください。 | Xin cho tôi đồ uống khác cà phê. |
| この二つは両方とも大切です。 | このふたつはりょうほうともたいせつです。 | Cả hai điều này đều quan trọng. |

**Điểm cần phân biệt:**

- `以上` = từ mức trở lên, `以下` = từ mức trở xuống; không đảo hướng so sánh.
- `以外` = ngoài/ngoại trừ, không cùng chức năng với `以上`.
- `急に` là đột nhiên, `代わりに` là thay vì/thay cho.

**Bộ kiểm tra mẫu Bài 15 — 3 câu ABCD đã viết sẵn:**


**Q15-01 [reading]** 「以上」の読み方は？  
**A.** いか / **B.** いじょう / **C.** いがい / **D.** いっかい

<details><summary>Đáp án & giải thích</summary>

**B. いじょう** — `以上（いじょう）` nghĩa là trở lên/ít nhất.

</details>


**Q15-02 [meaning]** 「以外」の nghĩa là gì?  
**A.** Trở xuống; không vượt quá / **B.** Trở lên; ít nhất / **C.** Ngoài ra; ngoại trừ / **D.** Cả hai phía; cả hai

<details><summary>Đáp án & giải thích</summary>

**C. Ngoài ra; ngoại trừ** — `以外（いがい）` = ngoài/ngoại trừ.

</details>


**Q15-03 [context]** コーヒー ____ の飲み物をください。  
**A.** 以外 / **B.** 以上 / **C.** 以下 / **D.** 両方

<details><summary>Đáp án & giải thích</summary>

**A. 以外** — `コーヒー以外` = ngoại trừ cà phê.

</details>


---

## 4. Ngân hàng bài tập, thuật toán tạo câu và chấm điểm

**Phân loại dữ liệu bài tập:**

1. **45 câu ABCD biên soạn sẵn trong Mục 3** (3 câu × 15 bài): dùng ngay sau khi biên tập và kiểm duyệt.
2. **Câu đọc / nghĩa sinh có kiểm soát từ 262 mục:** tạo tại **build time**, không cần AI hoặc backend; chỉ dùng khi có phương án nhiễu rõ ràng, đúng chính tả và đủ 4 đáp án khác nhau.
3. **Câu ngữ cảnh, gần nghĩa, chọn cách dùng đúng:** **chỉ lấy từ bộ câu được duyệt**; không tạo bằng cách ghép từ vào mẫu câu ngẫu nhiên.
4. **Luyện nghe:** đọc từ hoặc câu đã có cách đọc kiểm duyệt; nếu TTS không khả dụng thì chế độ này không bắt buộc.

### 4.1. Bộ dạng bài bắt buộc

| Dạng | Đề hiển thị | Trả lời | Năng lực ghi nhận | Kiểm soát lỗi |
|---|---|---|---|---|
| Nhận diện cách đọc | `病院` | Chọn `びょういん` trong ABCD | `readingRecognition` | Đáp án nhiễu không trùng |
| Gõ cách đọc | `映画館` | Nhập `えいがかん` | `readingRecall` | So sánh Kana chuẩn, không chấp nhận sai trường âm |
| Chọn nghĩa | `料金` | Chọn nghĩa Việt đúng | `meaningRecognition` | Tránh nghĩa đồng nghĩa giữa đáp án |
| Chọn chính tả | `かるい` | Chọn `軽い` | `orthography` | Cùng Hiragana/đa cách viết phải nêu ngữ cảnh |
| Nghe chọn từ | TTS đọc `やさい` | Chọn `野菜` | `listeningRecognition` | Không hỏi nếu nghe có thể khớp nhiều đáp án |
| Ghép cặp | `兄` ↔ `あに` | Chạm cặp | `matching` | Không nâng `mastered` chỉ từ matching |
| Ngữ cảnh | `寒いので、コートを ____。` | Chọn `着ます` | `contextUsage` | Câu chỉ được duyệt khi duy nhất một đáp án phù hợp |
| Nhận biết cặp dễ nhầm | `借りる / 貸す` | Chọn theo tình huống | `contrastUsage` | Có giải thích khác biệt |

### 4.2. Lưu ý quan trọng với tính đúng/sai

- **Không chấm như nhau cho mọi nghĩa đồng cấp:** nếu từ có nhiều nghĩa (ví dụ `料理`, `今度`), phải gắn nghĩa theo `senseId` và thiết kế distractor không vô tình cũng đúng.
- **Không chấp nhận từ cùng cách đọc nếu prompt thiếu ngữ cảnh:** `きる` có cả `切る` (cắt) và `着る` (mặc). Với quiz Kana → Kanji, phải ghi thêm nghĩa Việt hoặc câu đầy đủ.
- **Cặp động từ đi/người khác:** `借りる` / `貸す`; `開ける` / `開く` phải xuất hiện trong ngữ cảnh có trợ từ và chủ thể.
- TTS không thay thế kana nguồn. Nếu TTS đọc khác nguồn, hiển thị trạng thái **cần QA audio** thay vì tự thay kana trong dữ liệu.
- Sau khi nộp, luôn hiện đáp án đúng + Hiragana + nghĩa tiếng Việt + giải thích ngắn và nút `Ôn lại`.
- Sai được gắn lại vào phiên học sau vài câu khác; không cho “nhìn đáp án rồi chọn lại ngay” được tính thành chứng cứ nhớ lâu.

### 4.3. Ôn cách quãng (tự động, không có nút rating)

- `seen`: đã mở nội dung, **không tính nhớ**.
- `new`: chưa có kết quả tự kiểm tra được chấm.
- `learning`: có lỗi hoặc chưa có bằng chứng ổn định.
- `reviewing`: đã đúng nhưng cần kiểm tra lại qua phiên sau.
- `mastered`: tối thiểu 3 lần đúng trên ít nhất 2 phiên cách biệt, trong đó có cả **đọc/nhớ nghĩa**, không có lỗi gần đây.
- Khi sai: ghi lỗi vào tiến độ theo **ID từ + kỹ năng**, lên ôn lại sau **3–5 câu khác**, và rút ngắn lịch ôn tiếp theo.
- Khi đúng: tăng lần đúng, nhưng **đúng liên tục trong một lần ngồi không tăng khoảng cách ôn như nhiều phiên khác nhau**.
- Khi ôn trước hạn: cho phép; không khóa bằng lịch và không tăng bậc bất hợp lý.
- Thuật toán đơn giản kế thừa đặc tả gốc (khoảng nhắc nội bộ có thể dùng `1 → 3 → 7 → 14 → 30 ngày`), không hiển thị thành kế hoạch tuần.

### 4.4. Ưu tiên bài kiểm tra và kiểm soát nội dung thiếu

- Bài nào chưa có 4 phương án nhiễu hợp lệ thì **dùng gõ đáp án** hoặc ghép cặp, không tạo ABCD sai.
- Khi câu hỏi phụ thuộc dữ liệu chưa duyệt (ví dụ cách dùng `同じ`), phải hiển thị trạng thái **Chưa có câu ngữ cảnh** chứ không giả tạo nội dung.
- Cho phép tự chọn phạm vi `Từ ★`, `Toàn bài`, `Sai nhiều`, `Ôn toàn bộ các bài đã bắt đầu`.
- Ngân hàng trộn các kỹ năng theo lượt, đảm bảo 1 lần làm không chỉ xuất hiện 1 loại câu.

---

## 5. Data contract frontend và nhập dữ liệu 262 từ

### 5.1. Dữ liệu từ vựng (ví dụ TypeScript)

```ts
export type LessonId =
  | 'L01' | 'L02' | 'L03' | 'L04' | 'L05'
  | 'L06' | 'L07' | 'L08' | 'L09' | 'L10'
  | 'L11' | 'L12' | 'L13' | 'L14' | 'L15';

export type VocabSource = {
  kind: 'user-txt' | 'kanji-curriculum';
  file: string;
  line: number;
  meaningViRaw: string;      // giữ 100% nghĩa nguồn, dấu ; và ngoặc
  partOfSpeechRaw?: string;  // giữ nhãn loại từ trong nguồn
};

export type VocabularyEntry = {
  id: string;                // V001..V262 từ nguồn TXT; id chung theo canonical index
  surface: string;           // viết Kanji/Kana theo nguồn
  hiragana: string;
  romaji: string;
  locale: 'ja-JP';
  primaryLessonId: LessonId;
  relatedLessonIds: LessonId[];
  learningTier: 'core' | 'extended';
  sourceGlosses: VocabSource[];
  dictionaryForm?: string;  // chỉ thêm sau khi duyệt (vd 好きな → 好き)
  acceptedReadings?: string[];
  senses?: { senseId: string; meaningVi: string }[]; // Không ghi đè meaningViRaw
  relatedKanjiIds?: string[]; // chỉ link 181 chữ đã có; ngoài 181 = extended
  audioText?: string;         // có thể là surface, nhưng không đoán âm Kanji đơn
  verifiedExampleIds?: string[];
  confusionGroupIds?: string[];
  contentReviewStatus: 'source-preserved' | 'editor-reviewed';
};

export type Exercise = {
  id: string;
  lessonId: LessonId;
  wordIds: string[];
  kind: 'reading' | 'reading-input' | 'meaning' | 'orthography'
      | 'listening' | 'context' | 'contrast' | 'matching';
  questionText: string;
  options?: { id: string; text: string }[];
  correctOptionId?: string;
  acceptedAnswers?: string[];
  explanationVi: string;
  editorialStatus: 'draft' | 'approved';
  // Không được dùng câu context chưa approved cho kiểm tra chính thức.
};
```

### 5.2. Quy tắc sinh JSON tại build time

```text
Input: 3 file nguồn TXT (100 + 100 + 62 dòng không rỗng)
  1. Đọc bằng UTF-8 BOM aware.
  2. Mỗi dòng phải có đúng 6 trường khi tách bằng dấu | .
  3. Trim khoảng trắng phân cách từng cột, nhưng giữ nguyên nội dung nghĩa,
     dấu câu, ngoặc và ký tự đặc biệt nằm BÊN TRONG nghĩa.
  4. Kiểm tra đủ 262 dòng, 262 surface khác nhau, lang = ja-JP.
  5. Gán V001..V262 theo thứ tự file 1 → file 2 → file 3.
  6. Gán primaryLessonId theo bảng Bài 01..15 của Mục 3.
  7. Gắn learningTier ★/☆ như Mục 3. Không đoán cấp JLPT tự động.
  8. Hợp nhất catalog theo khóa ổn định; giữ mọi sourceGloss; KHÔNG ghi đè.
  9. Xuất JSON đã validate + báo cáo kiểm tra dữ liệu.
 10. Nếu phát hiện lỗi nội dung/âm đọc, dừng build câu hỏi liên quan và lập
     bảng errata để duyệt, KHÔNG âm thầm sửa source.
```

**Cảnh báo triển khai quan trọng:** Không nên dùng `surface` đơn độc làm `wordId` trong mọi trường hợp vì có từ đồng tự khác nghĩa/cách đọc. Với bộ hiện tại 262 cách viết không trùng; `V001..V262` dùng ổn trong phạm vi nguồn này. Khi nhập từ giáo trình 181 Kanji, dùng mapping `surface + reading + sense` đã duyệt để hợp nhất mục trùng; giữ stable IDs và source provenance.

### 5.3. Schema tiến độ (IndexedDB)

```ts
export type StudyProgress = {
  wordId: string;
  skill: 'readingRecognition' | 'readingRecall'
       | 'meaningRecognition' | 'orthography' | 'contextUsage'
       | 'listeningRecognition' | 'contrastUsage';
  seenAt?: string;
  gradedCorrect: number;
  gradedWrong: number;
  consecutiveCorrect: number;
  lastGradedAt?: string;
  lastDistinctSessionId?: string;
  distinctSuccessfulSessions: number;
  nextReviewAt?: string;
  state: 'new' | 'learning' | 'reviewing' | 'mastered';
};
```

- `Mastered` cấp từ khi có **đủ chứng cứ trên nhiều lần**, không khi chỉ bấm lật thẻ hoặc nghe TTS.
- Bảng `attempts` lưu `attemptId`, câu hỏi, đáp án gốc, `selectedOptionId`, kết quả, `sessionId`, thời gian. Hỗ trợ resume khi reload.
- Lưu `schemaVersion` và migration để lần cập nhật nội dung mới không làm mất dữ liệu cũ.
- Không đồng bộ đám mây vì phạm vi **frontend-only**; nhắc người dùng xuất backup nếu xóa dữ liệu trình duyệt.

### 5.4. Cấu trúc thư mục gợi ý (phần bổ sung)

```text
src/
  content/
    source/
      n4-vocab-part1.txt
      n4-vocab-part2.txt
      n4-vocab-part3.txt
    generated/
      vocabulary.json       # 262 mục, provenance + primaryLessonId
      lesson-vocab-map.json # 15 mapping bài
      exercises-approved.json
      examples-approved.json
    editorial/
      confusion-pairs.ts
      reading-variants.ts
      errata.md
  features/
    lessons/components/VocabularyLessonPanel.tsx
    practice/components/ReadingInput.tsx
    practice/components/ContrastPractice.tsx
    review/domain/scheduler.ts
    progress/storage/learningDb.ts
  scripts/
    validate-vocabulary.ts
    import-vocabulary.ts
```

Đây là cấu trúc bổ sung **vào dự án frontend hiện tại theo file đặc tả**, không yêu cầu tạo thêm backend, API hay ứng dụng khác. Sử dụng thư mục và module hiện hữu nếu đã có tính năng tương tự; không tạo trùng hai hệ thống quiz/progress.

---

## 6. Những màn hình cần nâng cấp (hành vi chi tiết)

### 6.1. Card từ vựng

```text
┌─────────────────────────────────────────┐
│ BÀI 12   ★ HỌC TRƯỚC       [🔊 Nghe]   │
│                                         │
│              借りる                     │
│          [Ẩn/Hiện かりる]              │
│                                         │
│ Mượn; thuê                             │
│ Động từ                                │
│                                         │
│ [Xem câu ví dụ]  [Thử nhớ] [Tiếp →]  │
└─────────────────────────────────────────┘
```

- Ẩn nghĩa và Hiragana là trạng thái luyện tập; khi hiện đáp án, chỉ ghi nhận đã xem.
- Nút `Nghe` phát tiếng Nhật, không phát nghĩa tiếng Việt.
- Chuyển từ bằng mũi tên/bàn phím và cảm ứng. Không lật ngẫu nhiên khi cuộn trang.
- Nêu rõ nếu từ có nhiều nghĩa, các từ dễ nhầm và bài học liên quan.

### 6.2. Màn hình luyện nhớ

```text
BÀI 12 — Luyện cách dùng    Câu 2 / 10

寒いので、コートを ____。

○ 着ます
○ 切ります
○ 開けます
○ 止めます

[Kiểm tra đáp án]

Sau khi trả lời:
✓ Đúng / ✕ Chưa đúng
着る（きる） = Mặc (áo; quần áo phần thân trên)
切る（きる） = Cắt
[Tiếp tục]       [Xem từ dễ nhầm]
```

- Không hiển thị đáp án/chấm sớm khi người học chưa bấm nộp.
- Các câu hỏi không có ngữ cảnh được kiểm duyệt phải dùng dạng **đọc** hoặc **nghĩa** từ chính danh mục 262 từ; không “chế” ngữ cảnh ở runtime.

### 6.3. Màn hình kết quả

```text
Bài 12 — Luyện từ vựng
  Trả lời đúng      7 / 10
  Từ làm sai        3
  Cần ôn lại        5

  Dễ nhầm nhất
   • 切る ↔ 着る
   • 借りる ↔ 貸す
   • 開ける ↔ 開く

[Ôn 5 từ này]  [Làm lại bài]  [Về danh sách bài]
```

Số liệu minh họa phải được tính từ kết quả thật khi triển khai; không hardcode như dữ liệu thực tế.

---

## 7. Các cặp/nhóm cần luyện đối chiếu

| Nhóm | Từ | Cách học đúng |
|---|---|---|
| Đồng âm khác chữ | 切る（きる） ↔ 着る（きる） | Bắt buộc câu có ý nghĩa; nghe đơn lẻ không phân biệt |
| Mượn/cho mượn | 借りる（かりる） ↔ 貸す（かす） | Chọn hành động theo người nhận/người cho |
| Mở/chuyển trạng thái | 開ける（あける） ↔ 開く（あく） | Cấu trúc trợ từ を / が, giữ cách đọc nguồn |
| Trả lại/về nhà | 返す（かえす） ↔ 帰る（かえる） | Học trong câu rõ chủ thể và tân ngữ |
| Cắt/mặc | 切る ↔ 着る | Khác nét chữ, cùng cách đọc |
| Trọng lượng | 重い（おもい） ↔ 軽い（かるい） | Ghép cặp trái nghĩa |
| Mạnh/yếu | 強い（つよい） ↔ 弱い（よわい） | Ghép cặp trái nghĩa |
| Gần/xa | 近い（ちかい） ↔ 遠い（とおい） | `遠い` nằm trong bộ Kanji gốc; có thể liên kết từ bổ sung với giáo trình chính |
| Đúng/sai | 正しい（ただしい） ↔ 悪い（わるい） | Không coi là cặp trái nghĩa tuyệt đối trong mọi ngữ cảnh; giải thích sắc thái |
| Quan trọng | 大事な（だいじな） ↔ 大切な（たいせつな） | Cả hai gần nghĩa; hỏi khác biệt bằng ngữ cảnh rõ ràng |
| Phân biệt vật dài | 太い（ふとい） ↔ 細い（ほそい） | Trục to/dày ↔ mảnh/thon |
| Thứ tự học | 習う（ならう） ↔ 教える（おしえる） | Người học ↔ người dạy; không gọi là bị động |
| Đề thi/hỏi đáp | 質問する（しつもんする） ↔ 答える（こたえる） | Câu hỏi ↔ câu trả lời |
| Ngôn ngữ/ý kiến | 意味（いみ） ↔ 意見（いけん） | Nghĩa của từ ↔ ý kiến cá nhân |
| Trên/dưới/ngọai trừ | 以上（いじょう）/ 以下（いか）/ 以外（いがい） | Kiểm tra chính xác mức độ và cấu trúc |

**Nguyên tắc đối chiếu:** chỉ ghi nhận `contrastUsage` khi người học trả lời đúng một câu phân biệt có ngữ cảnh, không khi họ chỉ xem hai thẻ cạnh nhau.

---

## 8. QA checklist: dữ liệu, chức năng, trải nghiệm

### 8.1. Kiểm tra dữ liệu nguồn (bắt buộc tự động)

- [ ] Tổng **262** từ và đúng phân bố nguồn `100 / 100 / 62`.
- [ ] **262** `surface` riêng biệt, gán đủ `V001..V262`, không có ID trùng hoặc thiếu.
- [ ] **15 bài**, mỗi từ có đúng một `primaryLessonId`; tổng số từ phân phối đúng 262.
- [ ] Các chuỗi `meaningVi` / loại từ / Hiragana / Romaji / `ja-JP` đối chiếu nguyên bản với dòng TXT; không được rút gọn nghĩa.
- [ ] Chuỗi Kana nằm trong dữ liệu nguồn; không tự sinh kana từng Kanji khi chưa kiểm duyệt.
- [ ] Phát hiện bản ghi đồng âm (`切る`, `着る`) để cấm kiểu hỏi mơ hồ.
- [ ] Kiểm tra toàn bộ lựa chọn ABCD: bốn lựa chọn khác nhau, một `correctOptionId`, giải thích có nội dung.
- [ ] Các câu ví dụ và ngữ cảnh mới ghi `editorialStatus: draft` cho đến khi QA xong.

### 8.2. Kiểm tra hành vi web (E2E)

- [ ] Chọn **Bài 04**, xem `青い`, ẩn Hiragana, chọn đúng cách đọc → chỉ khi câu được chấm mới cập nhật tiến độ.
- [ ] Chọn **Bài 12**, gõ `かりる` cho `借りる` → nhận đúng; gõ sai âm được chỉ lỗi; không nâng thành thạo chỉ sau một câu.
- [ ] Chọn **Bài 14**, TTS đọc `きる` mà không có ngữ cảnh → **không tạo câu bắt phân biệt** `切る` và `着る`.
- [ ] Chọn **Bài 08**, hỏi `降りる` trong câu đi tàu → lưu vào kỹ năng ngữ cảnh, không nhầm với `乗る`.
- [ ] Chọn **Bài 15**, phân biệt `以上 / 以下 / 以外` theo nghĩa; đáp án chỉ có một phương án đúng.
- [ ] Làm sai 3 câu rồi rời trang → tải lại vẫn còn bài dang dở, các từ sai và lịch ôn.
- [ ] Xóa tất cả lịch sử từ Cài đặt chỉ sau xác nhận; import backup có cảnh báo và preview.
- [ ] Offline: đã cài/tải nội dung một lần, đóng mạng vẫn học được các chế độ không phụ thuộc TTS online.
- [ ] Màn hình 320px không tràn ngang; nút phát âm và kiểm tra đáp án sử dụng được bằng bàn phím.
- [ ] Khi bài có >20 từ, hiển thị theo nhóm nhỏ; không yêu cầu người học học xong trong một ngày hoặc một tuần.
- [ ] Không có điểm “đã thuộc” tăng lên do chỉ xem, lật thẻ, nghe hoặc chọn đáp án vừa được tiết lộ.

### 8.3. Các trường hợp biên kỹ thuật

- [ ] Có thể học khi `speechSynthesis.getVoices()` chưa sẵn sàng / không có giọng `ja-JP`.
- [ ] Reload giữa quiz không thay đổi câu/đáp án đã xáo trộn.
- [ ] Kết quả `readingRecall` phân biệt `きる`, `きーる`, `ぎる` và Kana nhập từ IME; tránh chấm sai unicode.
- [ ] Hợp nhất từ của giáo trình cũ và danh sách 262 không làm nhân đôi progress.
- [ ] Nâng phiên bản JSON/chương trình có migration; không mất dữ liệu IndexedDB.
- [ ] Backup sai định dạng, thiếu trường, không đúng `schemaVersion` bị từ chối rõ ràng.

---

## 9. Trình tự triển khai bằng Codex / coding agent (theo chức năng, không theo tuần)

**Mục tiêu:** nâng cấp web Kanji Garden hiện có theo đặc tả FE. Không tạo dự án StudyFlow, không phát triển backend.

1. **Khảo sát mã nguồn hiện tại:** đọc cấu trúc React, trang Lesson, quiz, review và IndexedDB; tận dụng component đã có, không tự tạo hệ thống trùng lặp.
2. **Nhập 262 từ:** tạo importer + validator + data mapping theo Bài 01..15 trong tài liệu này; kiểm tra `262/262` và bảo toàn tất cả trường TXT.
3. **Tích hợp nội dung bài:** tab `Từ vựng`, bộ lọc ★/☆, thẻ từ, tra cứu, TTS, giải thích.
4. **Luyện chủ động:** gõ Hiragana, chọn nghĩa, chọn Kanji, ghép cặp và nhóm dễ nhầm. Không tính lật thẻ là nhớ.
5. **Ngữ cảnh/quiz:** nhập bộ câu mẫu và 45 câu ABCD có trong file này, QA ngôn ngữ, tạo câu mới từ dữ liệu ở build time nếu đảm bảo một đáp án đúng.
6. **Ôn tập và tiến độ:** nối vào một bộ scheduler và một IndexedDB theo chuẩn cũ; không có Again/Hard/Good/Easy.
7. **Hoàn thiện UX mobile/offline:** PWA, backup JSON, trạng thái trống/lỗi, keyboard accessibility.
8. **Kiểm thử:** unit (importer, mapping, chấm Kana, scheduler), integration (bài học/quiz), E2E (lưu tiến độ/tải lại/offline), build và lint.

### Prompt ngắn để giao Codex

> Hãy đọc `THIET_KE_HE_THONG_WEB_HOC_KANJI_N4_FE.md`, `Kanji_N4_181_15_Bai_Giao_Trinh_Hoan_Chinh.md`, **tài liệu bổ sung 262 từ này** và 3 TXT nguồn. Hãy mở rộng website Kanji Garden frontend-only: giữ 15 bài, 181 Kanji mục tiêu, thêm đủ 262 từ có Hiragana/Romaji/nghĩa Việt **không thay đổi nghĩa gốc**; phân phối từ đúng theo bảng; ưu tiên từ ★; viết importer/validator dữ liệu; tích hợp tab Từ vựng, luyện đọc, gõ Kana, quiz ABCD, nghe, ngữ cảnh, luyện cặp dễ nhầm, ôn tự động và tiến độ IndexedDB. Không chia tuần, không backend/đăng nhập, không nút rating học thủ công, không trùng ID/progress. Nếu code đã tồn tại thì kiểm tra, tận dụng trước khi sửa. Test tất cả sau khi triển khai.

---

## 10. Tiêu chí nghiệm thu cuối (Definition of Done)

Hoàn thành khi **tất cả** điều kiện sau được đáp ứng:

- [ ] Web giữ nguyên 15 bài học và chính xác 181 Kanji mục tiêu theo giáo trình gốc.
- [ ] Có đầy đủ **262/262** từ bổ sung, tra được Kanji/Hiragana/Romaji/nghĩa/loại từ; đúng bài và đúng dữ liệu TXT.
- [ ] Không lặp từ trong catalog hoặc nhân đôi tiến độ vì nằm ở hai nguồn.
- [ ] Từ ★ có thể học toàn bộ trước; từ ☆ có thể học chủ động không bị khóa.
- [ ] Có ít nhất 2 dạng bài được chấm cho mỗi từ ★ ở nơi dữ liệu không mơ hồ; nếu dữ liệu chưa đủ, có fallback rõ ràng.
- [ ] Bộ **45 câu ABCD và 45 câu ví dụ bổ sung mới** đã trải qua QA tiếng Nhật/ngữ cảnh trước khi xuất bản; mọi lựa chọn đúng/sai rõ ràng.
- [ ] Có xem lỗi, ôn từ sai, cập nhật tiến độ tự động theo từng kỹ năng, không dùng rating thủ công.
- [ ] Hệ thống không khóa bài theo lịch, không hiển thị lộ trình tuần, không cần backend.
- [ ] Học lại sau refresh hoặc offline (trừ các tính năng phụ thuộc thiết bị/online), dữ liệu cá nhân vẫn còn khi không xóa trình duyệt.
- [ ] Trải nghiệm mobile và desktop trực quan, toàn bộ nội dung cốt lõi luôn có thể dùng không cần tài khoản.

> **Kết quả mong muốn:** Đây là một website để người học thật sự nhớ **181 Kanji** và luyện được **262 từ Nhật–Việt bổ sung** trong cùng 15 bài, từ nhận diện, phát âm, luyện nhớ đến sử dụng trong ngữ cảnh — không phải một trang liệt kê từ vựng.

