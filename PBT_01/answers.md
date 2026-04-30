# Phần A
## Câu A1:
### Phần 1:Khi bạn gõ https://shopee.vn vào trình duyệt và nhấn Enter, hãy liệt kê đúng thứ tự ít nhất 5 bước xảy ra (từ DNS lookup đến render).
# Sau khi đọc (01_introduction_html_universe.md) em có thể rút ra 5 bước:

1. Bước 1: Trình duyệt tìm kiếm địa chỉ IP của server tương ứng với domain shopee.vn thông qua hệ thống phân giải tên miền (DNS).
2. Bước 2: Trình duyệt thiết lập kết nối TCP với server (và đàm phán TLS/SSL để bảo mật thành HTTPS).
3. Bước 3: Trình duyệt gửi một HTTP GET Request tới server để yêu cầu lấy nội dung trang web.
4. Bước 4: Server xử lý và trả về một HTTP Response chứa mã trạng thái (vd: 200 OK) kèm theo nội dung HTML.
5. Bước 5: Trình duyệt phân tích (parse) HTML, tải thêm các tài nguyên phụ (CSS, JS, Images) và render trang web lên màn hình.

### Phần 2:rong DevTools của Chrome, tab Network cho thấy thông tin gì? 
![Ảnh chụp màn hình](<screenshots/A1_Phần 2.png>)

## Phần A2:
```html
<div class="header">
    <div class="logo">ShopTLU</div>
    <div class="menu">
        <div><a href="/">Trang chủ</a></div>
        <div><a href="/products">Sản phẩm</a></div>
    </div>
</div>
<div class="main">
    <div class="product">
        <div class="title">iPhone 16 Pro</div>
        <div class="price">25.990.000đ</div>
        <div class="image"><img src="iphone.jpg"></div>
    </div>
</div>
<div class="footer">© 2026 ShopTLU</div>
```
Trang web bị Google đánh giá SEO thấp vì chỉ sử dụng toàn thẻ <div>, gây khó hiểu vì thiếu semantic:
4 lỗi semantic:
1. <div class="header"> Sửa thành <header>.
2. <div class="menu"> Sửa thành <nav>.
3. <div class="main"> Sửa thành <main>.
4. <div class="product"> Sửa thành <article> hoặc <section>.
5. <div class="footer"> Sửa thành <footer>.

## Phần A3:
```html
<div>Hộp 1</div>
<span>Text A</span>
<span>Text B</span>
<div>Hộp 2</div>
<span>Text C</span>
<strong>Text D</strong>
<div>Hộp 3</div>
```
Hộp 1  
Text A Text B  
Hộp 2  
Text C Text D  
Hộp 3  
Giải thích: bởi vì thẻ ```<div>``` là thẻ block nên luôn chiếm hết dòng thẻ ```<span>``` và thẻ ```<strong> là thẻ inline nên sẽ nằm cùng một dòng

## Phần A4:

1. Khác nhau giữa <thead>, <tbody>, <tfoot>:

<thead>: Chứa các hàng tiêu đề của bảng.

<tbody>: Chứa các hàng dữ liệu chính.

<tfoot>: Chứa các hàng tổng kết, tính toán hoặc ghi chú.

2. 3 lý do KHÔNG NÊN dùng table để tạo layout:

-Sai ngữ nghĩa (Semantic): Gây nhầm lẫn cho các công cụ đọc màn hình và ảnh hưởng xấu đến SEO.

-Không Responsive: Cấu trúc hàng,cột cứng nhắc, rất khó để tối ưu giao diện trên thiết bị di động.

-Code phức tạp, khó bảo trì: Tạo ra cấu trúc HTML lồng nhau quá sâu (tag soup), việc thêm/bớt thành phần rất dễ làm vỡ toàn bộ layout.

# Phần C

## Phần C1:

Bạn được giao thiết kế cấu trúc HTML cho trang **chi tiết sản phẩm** (giống trang sản phẩm Shopee/Tiki). Trang bao gồm:
- Header + Navigation
- Breadcrumb (Trang chủ > Điện thoại > iPhone 16)
- Khu vực ảnh sản phẩm (5 ảnh)
- Thông tin sản phẩm (tên, giá, đánh giá sao, mô tả)
- Bảng thông số kỹ thuật
- Khu vực đánh giá/bình luận
- Sidebar: Sản phẩm tương tự
- Footer

**Yêu cầu:** Viết **chỉ phần cấu trúc HTML** (không cần nội dung thật, chỉ cần đúng thẻ và nesting). Mỗi thẻ phải có comment giải thích tại sao bạn chọn thẻ đó.

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8"> <!-- meta: hỗ trợ hiển thị tiếng Việt có dấu -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- meta: hỗ trợ responsive trên thiết bị di động -->
    <title>Chi tiết sản phẩm - iPhone 16 Pro</title> <!-- title: tiêu đề hiển thị trên tab trình duyệt -->
</head>

<body>

    <!-- HEADER -->
    <header> <!-- header: định nghĩa phần đầu của trang web -->
        <div class="logo">ShopTLU</div> <!-- div: dùng để nhóm phần logo (không mang tính semantic đặc biệt) -->
        
        <nav> <!-- nav: xác định khu vực chứa các liên kết điều hướng chính -->
            <ul> <!-- ul: danh sách không thứ tự chứa các menu item -->
                <li><a href="/">Trang chủ</a></li> <!-- a: thẻ tạo siêu liên kết (hyperlink) -->
                <li><a href="/products">Sản phẩm</a></li>
            </ul>
        </nav>
    </header>

    <!-- BREADCRUMB -->
    <nav aria-label="breadcrumb"> <!-- nav: điều hướng phụ, giúp người dùng biết vị trí hiện tại -->
        <ol> <!-- ol: danh sách có thứ tự (vì luồng đi từ cấp to đến nhỏ: Trang chủ -> Điện thoại -> iPhone) -->
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/phones">Điện thoại</a></li>
            <li>iPhone 16 Pro</li> <!-- item hiện tại (không cần link) -->
        </ol>
    </nav>

    <!-- MAIN CONTENT -->
    <main> <!-- main: chứa nội dung chính, độc nhất của trang này -->

        <!-- KHU VỰC SẢN PHẨM -->
        <article class="product-detail"> <!-- article: bọc toàn bộ thông tin sản phẩm vì đây là một thực thể độc lập -->

            <!-- ẢNH SẢN PHẨM -->
            <section class="product-images"> <!-- section: phân vùng logic cho khu vực chứa hình ảnh -->
                <h2 class="sr-only">Hình ảnh sản phẩm</h2> <!-- h2: tiêu đề (có thể ẩn đi bằng CSS) tốt cho mục đích SEO/Accessibility -->
                
                <figure> <!-- figure: thẻ chuyên dùng để bọc hình ảnh minh họa -->
                    <img src="img1.jpg" alt="Mặt trước iPhone 16 Pro"> <!-- alt: bắt buộc phải có để mô tả ảnh cho bot SEO và người khiếm thị -->
                </figure>
                <figure><img src="img2.jpg" alt="Mặt lưng iPhone 16 Pro"></figure>
                <figure><img src="img3.jpg" alt="Cạnh bên iPhone 16 Pro"></figure>
                <figure><img src="img4.jpg" alt="Cụm camera iPhone 16 Pro"></figure>
                <figure><img src="img5.jpg" alt="Phụ kiện đi kèm iPhone 16 Pro"></figure>
            </section>

            <!-- THÔNG TIN SẢN PHẨM -->
            <section class="product-info"> <!-- section: phân vùng chứa thông tin cơ bản -->
                <h1>iPhone 16 Pro</h1> <!-- h1: tiêu đề quan trọng nhất trang, mô tả tên sản phẩm -->
                
                <p class="price"><strong>25.990.000đ</strong></p> <!-- strong: nhấn mạnh phần giá tiền -->

                <div class="rating"> <!-- div: gom nhóm cụm sao đánh giá -->
                    <span>★★★★☆</span> (100 đánh giá) <!-- span: thẻ inline để bọc text không phá vỡ dòng -->
                </div>

                <div class="description"> <!-- div: gom nhóm các đoạn văn mô tả -->
                    <h2>Mô tả sản phẩm</h2>
                    <p>Mô tả chi tiết về tính năng, thiết kế của điện thoại...</p> <!-- p: thẻ chứa đoạn văn bản -->
                </div>
            </section>

            <!-- BẢNG THÔNG SỐ -->
            <section class="specs"> <!-- section: phân vùng cho bảng thông số kỹ thuật -->
                <h2>Thông số kỹ thuật</h2>

                <table> <!-- table: biểu diễn dữ liệu có cấu trúc hàng - cột -->
                    <thead> <!-- thead: định nghĩa phần đầu bảng -->
                        <tr> <!-- tr: định nghĩa một hàng -->
                            <th>Thông số</th> <!-- th: định nghĩa ô tiêu đề của cột -->
                            <th>Chi tiết</th>
                        </tr>
                    </thead>

                    <tbody> <!-- tbody: phần thân chứa dữ liệu chính -->
                        <tr>
                            <td>Màn hình</td> <!-- td: định nghĩa một ô dữ liệu bình thường -->
                            <td>6.1 inch, Super Retina XDR OLED</td>
                        </tr>
                        <tr>
                            <td>Chip xử lý</td>
                            <td>Apple A18 Pro</td>
                        </tr>
                    </tbody>

                    <tfoot> <!-- tfoot: phần chân bảng, dùng để lưu ý/tổng kết -->
                        <tr>
                            <td colspan="2">Thông tin cấu hình chỉ mang tính chất tham khảo</td>
                        </tr>
                    </tfoot>
                </table>
            </section>

            <!-- ĐÁNH GIÁ / BÌNH LUẬN -->
            <section class="reviews"> <!-- section: phân vùng chứa danh sách các đánh giá -->
                <h2>Đánh giá từ khách hàng</h2>

                <article class="review-item"> <!-- article: mỗi một lời bình luận cũng là một nội dung độc lập -->
                    <header>
                        <strong>Nguyễn Văn A</strong> - <time datetime="2026-05-01">01/05/2026</time> <!-- time: định nghĩa thời gian chuẩn semantic -->
                    </header>
                    <p>Sản phẩm thiết kế đẹp, viền titan sang trọng.</p>
                </article>

                <article class="review-item">
                    <header>
                        <strong>Trần Thị B</strong> - <time datetime="2026-04-28">28/04/2026</time>
                    </header>
                    <p>Máy mượt, chụp ảnh rất nét.</p>
                </article>
            </section>

        </article>

    </main>

    <!-- SIDEBAR -->
    <aside> <!-- aside: chứa nội dung phụ, nằm ngoài luồng chính (sản phẩm tương tự) -->
        <h2>Sản phẩm tương tự</h2>

        <article class="related-product"> <!-- article: dùng lại cho từng sản phẩm gợi ý -->
            <h3><a href="/iphone-15-pro">iPhone 15 Pro</a></h3>
            <p>23.500.000đ</p>
        </article>

        <article class="related-product">
            <h3><a href="/samsung-s24-ultra">Samsung Galaxy S24 Ultra</a></h3>
            <p>26.000.000đ</p>
        </article>
    </aside>

    <!-- FOOTER -->
    <footer> <!-- footer: phần chân trang web, chứa bản quyền và thông tin chung -->
        <p>&copy; 2026 ShopTLU. All rights reserved.</p>
    </footer>

</body>
</html>
```

## Phần C2: Một đồng nghiệp nói: "Dùng <div> cho mọi thứ rồi thêm class là được, không cần semantic HTML. Tốn thời gian học thêm thẻ mới."

Viết 1 đoạn phản biện (200-300 từ), phải bao gồm:

Luận điểm của đồng nghiệp có vẻ tiết kiệm thời gian ban đầu nhưng lại gây ra nợ kỹ thuật lớn về sau. Việc sử dụng Semantic HTML là bắt buộc ở các dự án chuẩn vì hai lý do kỹ thuật cốt lõi:

Thứ nhất là SEO (Tối ưu hóa công cụ tìm kiếm). Các crawler của Google không có "mắt" để nhìn thấy các class CSS đẹp đẽ; chúng phân tích cấu trúc DOM. Khi dùng <article> hay <h1>, ta báo hiệu cho bot biết đâu là nội dung trọng tâm. Nếu dùng toàn <div>, mọi thông tin có giá trị ngang nhau, làm giảm thứ hạng tìm kiếm của trang web.
Thứ hai là Accessibility (Khả năng truy cập). Ví dụ, những người khiếm thị sử dụng Screen Reader có các phím tắt để nhảy từ <header> sang <main> hoặc nhảy qua các <nav>. Nếu chúng ta lạm dụng <div>, Screen Reader sẽ đọc mọi thứ như một khối văn bản phẳng, khiến việc điều hướng trở thành cực hình.

Tuy nhiên, <div> không hoàn toàn vô dụng. Một trường hợp thực tế bắt buộc phải dùng <div> là tạo các wrapper (khối bọc) phi ngữ nghĩa nhằm mục đích thuần túy về layout và styling. Ví dụ: khi bạn cần một container bọc ngoài thẻ <main> để set display: flex; max-width: 1200px; margin: auto; giới hạn chiều rộng của giao diện, thẻ <div> lúc này là lựa chọn hoàn hảo nhất vì nó không làm nhiễu cấu trúc semantic của trang.

# Phần B

## Phần B3:

Lỗi 1: Dòng 1 — Thẻ khai báo DOCTYPE viết sai cú pháp và thiếu định dạng tài liệu — Cần sửa thành <!DOCTYPE html>.

Lỗi 2: Dòng 3 — Thẻ <title> bị thiếu thẻ đóng tương ứng — Cần thêm </title> vào ngay sau chữ "Trang web".

Lỗi 3: Dòng 4 — Giá trị của thuộc tính charset viết sai chuẩn — Cần sửa "utf8" thành "UTF-8".

Lỗi 4: Dòng 6 — Thẻ đóng của tiêu đề chính bị viết sai cú pháp (thiếu dấu gạch chéo) — Cần sửa <h1> ở cuối dòng thành </h1>.

Lỗi 5: Dòng 10 — Thẻ đóng của liên kết "Trang chủ" bị sai cú pháp (thiếu dấu gạch chéo) — Cần sửa <a> ở cuối dòng thành </a>.

Lỗi 6: Dòng 17 — Thuộc tính src thiếu dấu ngoặc kép bọc giá trị và thẻ <img> đang thiếu thuộc tính bắt buộc alt — Cần sửa thành <img src="iphone.jpg" alt="iPhone 16 Pro">.

Lỗi 7: Dòng 19 — Lỗi lồng thẻ chéo nhau (Nesting error). Mở thẻ <b> bên trong thẻ <p> nhưng lại đóng </p> trước khi đóng </b> — Cần đảo lại thứ tự đóng thẻ cho đúng: <p>Giá: <b>25.990.000đ</b></p>.

Lỗi 8: Dòng 24 — Bảng dữ liệu thiếu cấu trúc semantic (<thead>, <tbody>) và đang dùng thẻ <td> cho các ô tiêu đề thay vì thẻ <th> — Cần bọc hàng đầu tiên bằng <thead> và đổi <td> thành <th>; sau đó bọc hàng thứ hai bằng <tbody>.

Lỗi 9: Dòng 36 — Sử dụng đến 2 thẻ <main> trong cùng một trang web (theo chuẩn HTML5 thì mỗi trang chỉ có 1 thẻ <main> duy nhất) — Cần đổi thẻ <main> thứ hai (đang bọc chữ "Sidebar content") thành thẻ <aside>.

Lỗi 10: Dòng 41 — Thẻ <p> ở phần chân trang bị thiếu thẻ đóng — Cần thêm </p> vào cuối dòng chữ "Copyright 2026".

## Phần B4: Phân tích shopee
### I
1. Thẻ Senmatic header
![alt text](<screenshots/Senmatic header.png>)

2. Thẻ Senmatic section
![alt text](<screenshots/Senmatic section.png>)

3. Thẻ Senmatic footer
![alt text](<screenshots/Senmatic footer.png>)

### II
Không tìm thấy thẻ table 

### III
em tìm được thẻ form nhưng mà nó không phải form input nên không gắn ạ!
