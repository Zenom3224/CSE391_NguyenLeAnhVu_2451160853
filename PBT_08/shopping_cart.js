function createCart() {
    let items = [];
    let discount = {
        code: "",
        percent: 0,
        money: 0
    };

    function formatMoney(number) {
        return Math.round(number).toLocaleString("vi-VN") + "đ";
    }

    function getRawTotal() {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function getDiscountMoney() {
        const rawTotal = getRawTotal();
        const percentDiscount = rawTotal * discount.percent / 100;
        return percentDiscount + discount.money;
    }

    return {
        addItem(product, quantity = 1) {
            const found = items.find(item => item.id === product.id);

            if (found) {
                found.quantity += quantity;
            } else {
                items.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity
                });
            }
        },

        removeItem(productId) {
            items = items.filter(item => item.id !== productId);
        },

        updateQuantity(productId, newQuantity) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
                return;
            }

            const found = items.find(item => item.id === productId);

            if (found) {
                found.quantity = newQuantity;
            }
        },

        getTotal() {
            const total = getRawTotal() - getDiscountMoney();
            return total > 0 ? total : 0;
        },

        applyDiscount(code) {
            if (code === "SALE10") {
                discount = { code, percent: 10, money: 0 };
            } else if (code === "SALE20") {
                discount = { code, percent: 20, money: 0 };
            } else if (code === "FREESHIP") {
                discount = { code, percent: 0, money: 30000 };
            } else {
                discount = { code: "", percent: 0, money: 0 };
                console.log("Mã giảm giá không hợp lệ");
            }
        },

        printCart() {
            console.log("┌────────────────────────────────────────────────────────────┐");
            console.log("│ # │ Sản phẩm         │ SL │ Đơn giá       │ Tổng          │");
            console.log("├────────────────────────────────────────────────────────────┤");

            items.forEach((item, index) => {
                const line =
                    "│ " +
                    String(index + 1).padEnd(1) + " │ " +
                    item.name.padEnd(16) + " │ " +
                    String(item.quantity).padStart(2) + " │ " +
                    formatMoney(item.price).padStart(12) + " │ " +
                    formatMoney(item.price * item.quantity).padStart(13) + " │";
                console.log(line);
            });

            console.log("├────────────────────────────────────────────────────────────┤");

            if (discount.code) {
                console.log("│ Mã giảm giá: " + discount.code.padEnd(44) + "│");
                console.log("│ Giảm: " + formatMoney(getDiscountMoney()).padStart(49) + " │");
            }

            console.log("│ Tổng cộng: " + formatMoney(this.getTotal()).padStart(47) + " │");
            console.log("└────────────────────────────────────────────────────────────┘");
        },

        getItemCount() {
            return items.reduce((sum, item) => sum + item.quantity, 0);
        },

        clearCart() {
            items = [];
            discount = { code: "", percent: 0, money: 0 };
        }
    };
}

const cart = createCart();

cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);
cart.addItem({ id: 3, name: "AirPods Pro", price: 6990000 }, 2);
cart.addItem({ id: 1, name: "iPhone 16", price: 25990000 }, 1);

console.log("=== GIỎ HÀNG BAN ĐẦU ===");
cart.printCart();

cart.applyDiscount("SALE10");

console.log("\n=== SAU KHI ÁP DỤNG SALE10 ===");
cart.printCart();

console.log("\nSố SP:", cart.getItemCount());

cart.removeItem(3);
console.log("Sau xóa:", cart.getItemCount());

console.log("\n=== GIỎ HÀNG SAU KHI XÓA AIRPODS ===");
cart.printCart();

cart.updateQuantity(1, 1);
console.log("\n=== GIỎ HÀNG SAU KHI CẬP NHẬT SỐ LƯỢNG ===");
cart.printCart();

cart.clearCart();
console.log("\nSau khi xóa toàn bộ, số SP:", cart.getItemCount());
