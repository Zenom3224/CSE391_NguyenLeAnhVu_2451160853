# PBT_09 - DOM Manipulation & Events

## PHẦN A - KIỂM TRA ĐỌC HIỂU

### Câu A1 - DOM Tree

#### 1. Sơ đồ DOM tree

```text
document
└── html
    └── body
        └── div#app
            ├── header
            │   ├── h1
            │   │   └── "Todo App"
            │   └── nav
            │       ├── a.active
            │       │   └── "All"
            │       ├── a
            │       │   └── "Active"
            │       └── a
            │           └── "Completed"
            └── main
                ├── form#todoForm
                │   ├── input#todoInput
                │   └── button[type="submit"]
                │       └── "Add"
                └── ul#todoList
                    ├── li.todo-item
                    │   └── "Learn HTML"
                    └── li.todo-item.completed
                        └── "Learn CSS"
```

#### 2. querySelector

```javascript
const h1 = document.querySelector("h1");
const input = document.querySelector("#todoForm input");
const todoItems = document.querySelectorAll(".todo-item");
const activeLink = document.querySelector("nav a.active");
const firstTodo = document.querySelector("#todoList li:first-child");
const navLinks = document.querySelectorAll("nav a");
```

---

### Câu A2 - innerHTML vs textContent

`textContent` dùng để lấy hoặc gán nội dung dạng văn bản thuần. Khi dùng `textContent`, trình duyệt sẽ không hiểu nội dung đó là HTML.

`innerHTML` dùng để lấy hoặc gán nội dung có chứa thẻ HTML. Khi dùng `innerHTML`, trình duyệt sẽ phân tích chuỗi đó thành các phần tử HTML.

Ví dụ dùng `textContent`:

```javascript
document.querySelector("#result").textContent = "<b>Xin chào</b>";
```

Kết quả hiển thị nguyên chuỗi `<b>Xin chào</b>`.

Ví dụ dùng `innerHTML`:

```javascript
document.querySelector("#result").innerHTML = "<b>Xin chào</b>";
```

Kết quả chữ "Xin chào" được in đậm.

`innerHTML` có thể gây lỗ hổng XSS vì nếu đưa thẳng dữ liệu người dùng nhập vào HTML, người dùng xấu có thể chèn mã độc hoặc sự kiện JavaScript vào trang.

Code nguy hiểm:

```javascript
const userInput = document.querySelector("#search").value;
document.querySelector("#result").innerHTML = userInput;
```

Ví dụ nếu user nhập:

```html
<img src=x onerror="alert('Hacked!')">
```

Trình duyệt có thể chạy đoạn mã trong `onerror`.

Cách sửa an toàn:

```javascript
const userInput = document.querySelector("#search").value;
document.querySelector("#result").textContent = userInput;
```

---

### Câu A3 - Event Bubbling

Khi click vào button, event xảy ra ở button trước, sau đó nổi dần lên phần tử cha là `#inner`, rồi tiếp tục lên `#outer`.

Output:

```text
BUTTON
INNER
OUTER
```

Nếu bỏ comment dòng:

```javascript
e.stopPropagation();
```

thì event sẽ dừng lại tại button, không nổi tiếp lên `#inner` và `#outer`.

Output khi có `stopPropagation()`:

```text
BUTTON
```

---

## PHẦN C - DEBUG & PHÂN TÍCH

### Câu C1 - Debug DOM Code

Các lỗi trong đoạn code:

1. `countDisplay` khai báo bằng `const`, nhưng trong reset lại gán `countDisplay = count`, điều này sai vì không được gán lại biến `const`.
2. Khi reset, phải sửa nội dung bằng `countDisplay.textContent = count`.
3. `addEventListener("onclick", ...)` sai tên sự kiện, đúng phải là `addEventListener("click", ...)`.
4. Dùng `innerHTML` để hiển thị số đếm là không cần thiết, nên dùng `textContent` an toàn hơn.
5. `historyList.innerHTML = null` không hợp lý, nên dùng `historyList.textContent = ""` hoặc `historyList.innerHTML = ""`.
6. Trong clear history, viết `item.remove;` chỉ tham chiếu tới hàm nhưng không gọi hàm. Đúng phải là `item.remove()`.
7. Khi lưu `count` vào localStorage, dữ liệu được lưu dạng chuỗi. Khi load lại cần chuyển về số bằng `Number()`.
8. Chỉ load lại `count` nhưng chưa load lại lịch sử.
9. Code bind sự kiện trực tiếp vào từng `li`, nếu lịch sử nhiều thì nên dùng event delegation trên `historyList`.
10. Nếu phần tử trong HTML chưa tồn tại mà JS chạy trước, `querySelector` có thể trả về `null`, nên đặt script cuối body hoặc dùng `defer`.

Code đã sửa:

```javascript
const countDisplay = document.querySelector(".count");
const historyList = document.getElementById("history");

let count = Number(localStorage.getItem("count")) || 0;
countDisplay.textContent = count;
historyList.innerHTML = localStorage.getItem("history") || "";

function updateCount(newCount) {
    count = newCount;
    countDisplay.textContent = count;
    addHistory("Count changed to " + count);
    saveData();
}

function addHistory(text) {
    const li = document.createElement("li");
    li.textContent = text;
    historyList.appendChild(li);
}

function saveData() {
    localStorage.setItem("count", String(count));
    localStorage.setItem("history", historyList.innerHTML);
}

document.querySelector("#incrementBtn").addEventListener("click", function() {
    updateCount(count + 1);
});

document.querySelector("#decrementBtn").addEventListener("click", function() {
    updateCount(count - 1);
});

document.querySelector("#resetBtn").addEventListener("click", () => {
    count = 0;
    countDisplay.textContent = count;
    historyList.textContent = "";
    saveData();
});

historyList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        e.target.remove();
        saveData();
    }
});

document.querySelector("#clearHistory").addEventListener("click", () => {
    historyList.textContent = "";
    saveData();
});
```

---

### Câu C2 - Performance

#### 1. Event Delegation

Bind event lên 1000 elements riêng lẻ là bad practice vì trình duyệt phải lưu 1000 event listeners. Khi số lượng phần tử lớn, việc này làm tốn bộ nhớ hơn, code khó quản lý hơn và những phần tử được thêm mới sau này cũng phải bind event lại.

Event Delegation giải quyết bằng cách bind một event listener lên phần tử cha. Khi user click vào phần tử con, event sẽ bubbling lên cha. Ta dùng `event.target` để kiểm tra user đã click vào phần tử nào.

Ví dụ:

```javascript
const list = document.querySelector("#list");

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("item")) {
        console.log("Click item:", e.target.textContent);
    }
});
```

Cách này chỉ cần một event listener cho cả danh sách.

#### 2. DocumentFragment

Code cũ append trực tiếp vào `document.body` 1000 lần, có thể làm trình duyệt phải cập nhật layout nhiều lần.

Code refactor:

```javascript
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = `Item ${i}`;
    fragment.appendChild(div);
}

document.body.appendChild(fragment);
```

`DocumentFragment` giống như một vùng chứa tạm thời trong bộ nhớ. Ta thêm 1000 phần tử vào fragment trước, sau đó mới append fragment vào DOM một lần. Vì vậy trình duyệt chỉ cần cập nhật DOM chính một lần, hiệu năng tốt hơn.
