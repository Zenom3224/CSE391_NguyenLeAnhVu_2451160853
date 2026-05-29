# PBT_10 - Async JavaScript & API Integration

## PHẦN A - KIỂM TRA ĐỌC HIỂU

### Câu A1 - Sync vs Async

Thứ tự output dự đoán:

```text
1 - Start
4 - End
3 - Promise
6 - Promise 2
2 - Timeout 0ms
7 - Nested timeout
5 - Timeout 100ms
```

Giải thích:

JavaScript chạy code đồng bộ trước, nên `console.log("1 - Start")` chạy đầu tiên, sau đó các `setTimeout` được đưa vào Macrotask Queue, các `Promise.then()` được đưa vào Microtask Queue. Tiếp theo `console.log("4 - End")` chạy vì nó là code đồng bộ.

Sau khi call stack rỗng, Event Loop ưu tiên Microtask Queue trước Macrotask Queue. Vì vậy `Promise.resolve().then(...)` in ra `3 - Promise`, sau đó Promise thứ hai in ra `6 - Promise 2`. Trong Promise thứ hai có thêm một `setTimeout`, nên `7 - Nested timeout` được đưa vào Macrotask Queue sau.

Sau khi microtask chạy hết, macrotask mới chạy. `setTimeout` 0ms đầu tiên in ra `2 - Timeout 0ms`, tiếp theo là nested timeout in ra `7 - Nested timeout`, cuối cùng `setTimeout` 100ms in ra `5 - Timeout 100ms`.

---

### Câu A2 - Fetch API

```javascript
async function getData() {
    try {
        const response = await fetch("https://api.example.com/data");
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed:", error.message);
        return null;
    }
}
```

`async function getData()` khai báo một hàm bất đồng bộ. Hàm này luôn trả về một Promise.

`try...catch` dùng để bắt lỗi trong quá trình gọi API, xử lý dữ liệu JSON hoặc lỗi mạng.

`const response = await fetch(...)` dùng để gửi request đến API. `fetch()` trả về một Promise, nên cần `await` để đợi server phản hồi xong rồi mới lấy được response.

`response.ok` là thuộc tính cho biết request có thành công hay không. Nó thường `true` khi status nằm trong khoảng 200-299. Nó sẽ `false` với các status như `404 Not Found`, `500 Internal Server Error`, `429 Too Many Requests`.

`throw new Error(...)` chủ động tạo lỗi nếu response không thành công. Việc này giúp lỗi HTTP được đưa vào `catch` để xử lý chung.

`const data = await response.json()` dùng để chuyển body của response thành dữ liệu JavaScript. Cần `await` vì việc đọc body và parse JSON cũng là thao tác bất đồng bộ.

`return data` trả dữ liệu ra ngoài nếu gọi API thành công.

`catch` có thể bắt lỗi mạng, lỗi do mình `throw`, lỗi parse JSON sai định dạng. Riêng lỗi 404 hoặc 500 không tự rơi vào `catch` nếu không kiểm tra `response.ok` và tự `throw`.

---

### Câu A3 - Promise States

Sơ đồ trạng thái Promise:

```text
Pending
   |
   | thành công
   v
Fulfilled

Pending
   |
   | thất bại
   v
Rejected
```

Promise ban đầu ở trạng thái `Pending`. Nếu thao tác bất đồng bộ thành công, Promise chuyển sang `Fulfilled`. Nếu thao tác thất bại, Promise chuyển sang `Rejected`.

Callback Hell là tình trạng nhiều callback lồng nhau quá sâu, làm code khó đọc, khó debug và khó bảo trì.

Ví dụ callback hell:

```javascript
getUser(1, function(user) {
    getOrders(user.id, function(orders) {
        getOrderDetail(orders[0].id, function(detail) {
            getPayment(detail.paymentId, function(payment) {
                console.log(payment);
            });
        });
    });
});
```

Refactor bằng async/await:

```javascript
async function loadPayment() {
    try {
        const user = await getUser(1);
        const orders = await getOrders(user.id);
        const detail = await getOrderDetail(orders[0].id);
        const payment = await getPayment(detail.paymentId);
        console.log(payment);
    } catch (error) {
        console.error("Lỗi:", error.message);
    }
}
```

Async/await giúp code nhìn giống luồng chạy tuần tự hơn, dễ đọc và dễ xử lý lỗi bằng `try...catch`.

---

## PHẦN C - PHÂN TÍCH

### Câu C1 - Error Handling Strategy

Khi xây dựng app E-Commerce gọi nhiều API, cần xử lý lỗi theo từng nhóm để giao diện không bị đứng và người dùng hiểu chuyện gì đang xảy ra.

#### 1. Network errors

Network error xảy ra khi người dùng mất mạng, DNS lỗi hoặc trình duyệt không kết nối được đến server. Cách xử lý là hiển thị thông báo rõ ràng, giữ lại dữ liệu cũ nếu có, cho phép người dùng bấm thử lại.

```javascript
async function loadProducts() {
    try {
        showLoading();
        const res = await fetch("https://api.example.com/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderProducts(data);
    } catch (error) {
        showError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
        hideLoading();
    }
}
```

#### 2. API errors

Server trả lỗi HTTP thì cần xử lý theo từng mã lỗi:

```text
404: Không tìm thấy dữ liệu, có thể sản phẩm đã bị xóa.
500: Lỗi máy chủ, nên báo người dùng thử lại sau.
429: Gọi API quá nhiều lần, nên chờ một khoảng thời gian rồi thử lại.
```

```javascript
function handleHttpError(status) {
    if (status === 404) {
        return "Không tìm thấy dữ liệu cần lấy.";
    }

    if (status === 429) {
        return "Bạn đang gửi quá nhiều yêu cầu. Vui lòng chờ một lúc rồi thử lại.";
    }

    if (status >= 500) {
        return "Máy chủ đang gặp lỗi. Vui lòng thử lại sau.";
    }

    return "Có lỗi xảy ra khi gọi API.";
}
```

#### 3. Timeout

Timeout dùng để tránh việc API quá chậm làm app chờ mãi. Nếu API quá 10 giây chưa phản hồi thì hủy request.

```javascript
async function fetchWithTimeout(url, ms = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);

    try {
        const response = await fetch(url, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}
```

#### 4. Retry logic

Retry logic dùng khi lỗi mạng tạm thời. Có thể thử lại 3 lần trước khi báo lỗi cho người dùng.

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries) {
                throw lastError;
            }

            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        }
    }
}
```

Chiến lược tổng thể là luôn có loading state, success state, error state, có nút retry và không để một API lỗi làm hỏng toàn bộ ứng dụng.

---

### Câu C2 - Promise.all vs Promise.allSettled vs Promise.race

| Method | Khi nào resolve? | Khi nào reject? | Use case |
|---|---|---|---|
| `Promise.all()` | Khi tất cả Promise đều fulfilled | Chỉ cần một Promise rejected là rejected ngay | Dùng khi tất cả dữ liệu đều bắt buộc phải có |
| `Promise.allSettled()` | Khi tất cả Promise đã hoàn thành, dù thành công hay thất bại | Hầu như không reject do từng kết quả có status riêng | Dùng cho dashboard nhiều widget độc lập |
| `Promise.race()` | Khi Promise đầu tiên hoàn thành thành công | Khi Promise đầu tiên hoàn thành là lỗi | Dùng để xử lý timeout hoặc lấy kết quả phản hồi nhanh nhất |
| `Promise.any()` | Khi có Promise đầu tiên fulfilled | Khi tất cả Promise đều rejected | Dùng khi chỉ cần một nguồn dữ liệu thành công |

Ví dụ `Promise.all()`:

```javascript
async function loadCheckoutPage() {
    try {
        const [cart, user, shipping] = await Promise.all([
            fetch("/api/cart").then(r => r.json()),
            fetch("/api/user").then(r => r.json()),
            fetch("/api/shipping").then(r => r.json())
        ]);

        renderCheckout(cart, user, shipping);
    } catch (error) {
        showError("Không thể tải trang thanh toán.");
    }
}
```

Ví dụ `Promise.allSettled()`:

```javascript
async function loadDashboard() {
    const results = await Promise.allSettled([
        fetch("/api/weather").then(r => r.json()),
        fetch("/api/news").then(r => r.json()),
        fetch("/api/users").then(r => r.json())
    ]);

    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            renderWidget(index, result.value);
        } else {
            renderWidgetError(index, "Widget này đang lỗi.");
        }
    });
}
```

Ví dụ `Promise.race()`:

```javascript
function timeout(ms) {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timeout")), ms);
    });
}

async function loadProductWithTimeout() {
    try {
        const data = await Promise.race([
            fetch("/api/products").then(r => r.json()),
            timeout(10000)
        ]);

        renderProducts(data);
    } catch (error) {
        showError("API phản hồi quá chậm.");
    }
}
```

Ví dụ `Promise.any()`:

```javascript
async function loadProductFromBackupAPIs() {
    try {
        const product = await Promise.any([
            fetch("https://api-1.example.com/product/1").then(r => r.json()),
            fetch("https://api-2.example.com/product/1").then(r => r.json()),
            fetch("https://api-3.example.com/product/1").then(r => r.json())
        ]);

        renderProduct(product);
    } catch (error) {
        showError("Tất cả nguồn API đều thất bại.");
    }
}
```
