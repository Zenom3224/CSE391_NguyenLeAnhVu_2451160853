function pipe(...fns) {
    return function(initialValue) {
        return fns.reduce((value, fn) => fn(value), initialValue);
    };
}

const process = pipe(
    x => x * 2,
    x => x + 10,
    x => x.toString(),
    x => "Kết quả: " + x
);

console.log("=== PIPE ===");
console.log(process(5));

function memoize(fn) {
    const cache = {};

    return function(...args) {
        const key = JSON.stringify(args);

        if (key in cache) {
            return cache[key];
        }

        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

const expensiveCalc = memoize((n) => {
    console.log("Đang tính...");
    let result = 0;

    for (let i = 0; i < n; i++) {
        result += i;
    }

    return result;
});

console.log("\n=== MEMOIZE ===");
console.log(expensiveCalc(1000000));
console.log(expensiveCalc(1000000));

function debounce(fn, delay) {
    let timerId;

    return function(...args) {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

const search = debounce((query) => {
    console.log("Searching:", query);
}, 500);

console.log("\n=== DEBOUNCE ===");
search("i");
search("ip");
search("iph");
search("iphone");

async function retry(fn, maxAttempts = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn(attempt);
        } catch (error) {
            lastError = error;
            console.log(`Lần thử ${attempt} thất bại: ${error.message}`);
        }
    }

    throw lastError;
}

console.log("\n=== RETRY ===");

let failCount = 0;

async function unstableTask() {
    failCount++;

    if (failCount < 3) {
        throw new Error("Lỗi tạm thời");
    }

    return "Thành công sau khi thử lại";
}

retry(unstableTask, 3)
    .then(result => console.log(result))
    .catch(error => console.log("Thất bại:", error.message));

setTimeout(() => {
    console.log("Kết thúc demo debounce");
}, 800);
