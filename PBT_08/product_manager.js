const products = [
    { id: 1, name: "iPhone 16", price: 25990000, category: "phone", stock: 15, rating: 4.5 },
    { id: 2, name: "MacBook Pro", price: 45990000, category: "laptop", stock: 8, rating: 4.8 },
    { id: 3, name: "AirPods Pro", price: 6990000, category: "accessory", stock: 50, rating: 4.3 },
    { id: 4, name: "iPad Air", price: 16990000, category: "tablet", stock: 0, rating: 4.6 },
    { id: 5, name: "Samsung S24", price: 22990000, category: "phone", stock: 20, rating: 4.4 },
    { id: 6, name: "Dell XPS 15", price: 35990000, category: "laptop", stock: 5, rating: 4.7 },
    { id: 7, name: "Galaxy Buds", price: 3490000, category: "accessory", stock: 100, rating: 4.1 },
    { id: 8, name: "Xiaomi Pad 6", price: 7990000, category: "tablet", stock: 25, rating: 4.2 },
    { id: 9, name: "Pixel 9", price: 19990000, category: "phone", stock: 12, rating: 4.6 },
    { id: 10, name: "ThinkPad X1", price: 32990000, category: "laptop", stock: 3, rating: 4.5 }
];

function formatMoney(number) {
    return number.toLocaleString("vi-VN") + "đ";
}

function getInStock(products) {
    return products.filter(product => product.stock > 0);
}

function filterProducts(products, category, minPrice, maxPrice) {
    return products.filter(product =>
        product.category === category &&
        product.price >= minPrice &&
        product.price <= maxPrice
    );
}

function sortByPrice(products, order = "asc") {
    return [...products].sort((a, b) => {
        if (order === "desc") {
            return b.price - a.price;
        }

        return a.price - b.price;
    });
}

function cheapestByCategory(products) {
    return products.reduce((result, product) => {
        const current = result[product.category];

        if (!current || product.price < current.price) {
            result[product.category] = product;
        }

        return result;
    }, {});
}

function totalInventoryValue(products) {
    return products.reduce((sum, product) => sum + product.price * product.stock, 0);
}

function formatProductList(products) {
    return products.map(product => ({
        name: product.name,
        formattedPrice: formatMoney(product.price)
    }));
}

function averageRating(products) {
    const totalRating = products.reduce((sum, product) => sum + product.rating, 0);
    return totalRating / products.length;
}

function searchProducts(products, keyword) {
    const lowerKeyword = keyword.toLowerCase();

    return products.filter(product =>
        product.name.toLowerCase().includes(lowerKeyword)
    );
}

console.log("=== IN-STOCK PRODUCTS ===");
console.table(getInStock(products).map(({ id, name, price, category, stock }) => ({
    id,
    name,
    price: formatMoney(price),
    category,
    stock
})));

console.log("\n=== PHONES 15-25 TRIỆU ===");
console.table(filterProducts(products, "phone", 15000000, 25000000).map(({ id, name, price, stock }) => ({
    id,
    name,
    price: formatMoney(price),
    stock
})));

console.log("\n=== SORT BY PRICE ASC ===");
console.table(sortByPrice(products, "asc").map(({ name, price }) => ({
    name,
    price: formatMoney(price)
})));

console.log("\n=== CHEAPEST BY CATEGORY ===");
console.log(cheapestByCategory(products));

console.log("\n=== TOTAL INVENTORY VALUE ===");
console.log(formatMoney(totalInventoryValue(products)));

console.log("\n=== FORMAT PRODUCT LIST ===");
console.table(formatProductList(products));

console.log("\n=== AVERAGE RATING ===");
console.log(averageRating(products).toFixed(2));

console.log("\n=== SEARCH KEYWORD: pro ===");
console.table(searchProducts(products, "pro").map(({ id, name, price }) => ({
    id,
    name,
    price: formatMoney(price)
})));

console.log("\n=== FIND PRODUCT ID 2 ===");
console.log(products.find(product => product.id === 2));
