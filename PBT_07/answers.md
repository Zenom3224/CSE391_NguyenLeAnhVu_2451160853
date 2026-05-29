# PBT_07 - JavaScript Basics

## PHẦN A - KIỂM TRA ĐỌC HIỂU

### Câu A1 - var / let / const

#### Đoạn 1

```javascript
console.log(x);
var x = 5;
```

Kết quả dự đoán:

```text
undefined
```

Kết quả này xảy ra vì biến khai báo bằng `var` có hoisting. Biến `x` được đưa lên đầu phạm vi nhưng giá trị `5` chưa được gán trước khi `console.log(x)` chạy.

#### Đoạn 2

```javascript
console.log(y);
let y = 10;
```

Kết quả dự đoán:

```text
ReferenceError
```

Biến `y` được khai báo bằng `let`, nên không thể sử dụng trước khi khai báo. Vùng từ đầu block đến dòng khai báo được gọi là Temporal Dead Zone.

#### Đoạn 3

```javascript
const z = 15;
z = 20;
console.log(z);
```

Kết quả dự đoán:

```text
TypeError
```

Biến khai báo bằng `const` không thể bị gán lại giá trị mới. Vì vậy dòng `z = 20` gây lỗi.

#### Đoạn 4

```javascript
const arr = [1, 2, 3];
arr.push(4);
console.log(arr);
```

Kết quả dự đoán:

```text
[1, 2, 3, 4]
```

Mảng khai báo bằng `const` không được gán sang mảng khác, nhưng vẫn có thể thay đổi nội dung bên trong mảng.

#### Đoạn 5

```javascript
let a = 1;
{
    let a = 2;
    console.log("Trong block:", a);
}
console.log("Ngoài block:", a);
```

Kết quả dự đoán:

```text
Trong block: 2
Ngoài block: 1
```

Biến `a` bên trong block và biến `a` bên ngoài block là hai biến khác nhau vì `let` có phạm vi theo block.

---

### Câu A2 - Data Types & Coercion

```javascript
console.log(typeof null);              // object
console.log(typeof undefined);         // undefined
console.log(typeof NaN);               // number
console.log("5" + 3);                  // "53"
console.log("5" - 3);                  // 2
console.log("5" * "3");                // 15
console.log(true + true);              // 2
console.log([] + []);                  // ""
console.log([] + {});                  // "[object Object]"
console.log({} + []);                  // "[object Object]"
```

`typeof null` trả về `object` là một lỗi lịch sử của JavaScript. `NaN` có kiểu dữ liệu là `number` vì nó biểu diễn một giá trị số không hợp lệ.

`"5" + 3` cho kết quả `"53"` vì toán tử `+` có thể dùng để nối chuỗi. Khi có chuỗi, JavaScript chuyển số `3` thành chuỗi rồi nối lại.

`"5" - 3` cho kết quả `2` vì toán tử `-` chỉ dùng cho phép toán số học. JavaScript tự chuyển chuỗi `"5"` thành số `5` rồi thực hiện phép trừ.

---

### Câu A3 - So sánh == và ===

```javascript
console.log(5 == "5");                // true
console.log(5 === "5");               // false
console.log(null == undefined);       // true
console.log(null === undefined);      // false
console.log(NaN == NaN);              // false
console.log(0 == false);              // true
console.log(0 === false);             // false
console.log("" == false);             // true
```

Từ giờ nên dùng `===` thay vì `==`.

Lý do là `===` so sánh cả giá trị và kiểu dữ liệu, giúp kết quả rõ ràng hơn. Còn `==` có ép kiểu ngầm nên đôi khi tạo ra kết quả khó đoán.

---

### Câu A4 - Truthy & Falsy

Các giá trị Falsy trong JavaScript gồm:

```text
false
0
-0
0n
""
null
undefined
NaN
```

Dự đoán kết quả:

```javascript
if ("0") console.log("A");           // Có in
if ("") console.log("B");            // Không in
if ([]) console.log("C");            // Có in
if ({}) console.log("D");            // Có in
if (null) console.log("E");          // Không in
if (0) console.log("F");             // Không in
if (-1) console.log("G");            // Có in
if (" ") console.log("H");           // Có in
```

Kết quả in ra:

```text
A
C
D
G
H
```

Chuỗi `"0"` là truthy vì nó không phải chuỗi rỗng. Chuỗi `" "` cũng là truthy vì có chứa dấu cách. Mảng rỗng `[]` và object rỗng `{}` cũng là truthy.

---

### Câu A5 - Template Literals

#### Cách 1

```javascript
var greeting = `Xin chào ${name}! Bạn ${age} tuổi.`;
```

#### Cách 2

```javascript
var url = `https://api.example.com/users/${userId}/orders?page=${page}`;
```

#### Cách 3

```javascript
var html = `
<div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
    <span>Giá: ${price}đ</span>
</div>`;
```

---

## PHẦN C - SUY LUẬN

### Câu C1 - Debug JavaScript

Các lỗi trong đoạn code:

1. Dòng `if (giaSauGiam = 0)` dùng phép gán `=` thay vì phép so sánh.
2. Hàm chưa kiểm tra `giaBan` có phải là số hay không.
3. Hàm chưa kiểm tra `phanTramGiam` có phải là số hay không.
4. Giá bán không nên là số âm hoặc bằng 0.
5. Dùng `var` trong vòng lặp kết hợp với `setTimeout` làm cho kết quả in ra bị sai.
6. Nên dùng `let` hoặc `const` thay cho `var` để tránh lỗi liên quan đến phạm vi biến.
7. Test truyền `"100000"` là chuỗi, nên cần truyền số `100000` hoặc kiểm tra kiểu dữ liệu trước khi tính.
8. Code thiếu dấu chấm phẩy ở nhiều dòng, tuy JavaScript vẫn chạy nhưng nên viết đầy đủ để rõ ràng hơn.

Code đã sửa:

```javascript
function tinhGiaGiamGia(giaBan, phanTramGiam) {
    if (typeof giaBan !== "number" || Number.isNaN(giaBan) || giaBan <= 0) {
        return "Giá bán không hợp lệ";
    }

    if (typeof phanTramGiam !== "number" || Number.isNaN(phanTramGiam)) {
        return "Phần trăm giảm không hợp lệ";
    }

    if (phanTramGiam < 0 || phanTramGiam > 100) {
        return "Phần trăm giảm không hợp lệ";
    }

    const giamGia = giaBan * phanTramGiam / 100;
    const giaSauGiam = giaBan - giamGia;

    if (giaSauGiam === 0) {
        console.log("Sản phẩm miễn phí!");
    }

    return giaSauGiam;
}

const gia = tinhGiaGiamGia(100000, 20);
console.log("Giá sau giảm: " + gia + "đ");

const gia2 = tinhGiaGiamGia(50000, 110);
console.log("Giá: " + gia2);

for (let i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log("Item " + i);
    }, 1000);
}
```

Lỗi ẩn trong vòng lặp nằm ở biến `i` khi khai báo bằng `var`. `var` có phạm vi function scope nên các lần lặp dùng chung một biến `i`. Khi `setTimeout` chạy, vòng lặp đã kết thúc và `i` bằng 5, nên kết quả có thể in ra `Item 5` nhiều lần.

Khi sửa thành `let i`, mỗi vòng lặp có một biến `i` riêng theo block scope, nên kết quả in ra đúng từ `Item 0` đến `Item 4`.
