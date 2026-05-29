const foods = [
    { name: "Phở bò", price: 65000, quantity: 2 },
    { name: "Trà đá", price: 5000, quantity: 3 },
    { name: "Bún chả", price: 55000, quantity: 1 },
];

const dayName = "Monday";
const useTip = true;

let total = 0;

for (let i = 0; i < foods.length; i++) {
    total += foods[i].price * foods[i].quantity;
}

let discountPercent = 0;

if (total > 1000000) {
    discountPercent = 15;
} else if (total > 500000) {
    discountPercent = 10;
}

if (dayName === "Wednesday") {
    discountPercent += 5;
}

const discountMoney = total * discountPercent / 100;
const totalAfterDiscount = total - discountMoney;
const vat = totalAfterDiscount * 8 / 100;
const tip = useTip ? totalAfterDiscount * 5 / 100 : 0;
const finalTotal = totalAfterDiscount + vat + tip;

function formatMoney(number) {
    const rounded = Math.round(number);
    return rounded.toLocaleString("vi-VN") + "đ";
}

function printLine(left, right) {
    const width = 38;
    const content = left + right.padStart(width - left.length, " ");
    console.log("║ " + content.padEnd(width, " ") + " ║");
}

console.log("╔════════════════════════════════════════╗");
console.log("║          HÓA ĐƠN NHÀ HÀNG             ║");
console.log("╠════════════════════════════════════════╣");

for (let i = 0; i < foods.length; i++) {
    const item = foods[i];
    const left = `${i + 1}. ${item.name} x${item.quantity} @${formatMoney(item.price)}`;
    const right = formatMoney(item.price * item.quantity);
    printLine(left, right);
}

console.log("╠════════════════════════════════════════╣");
printLine("Tổng cộng:", formatMoney(total));

const discountText = discountMoney === 0 ? formatMoney(discountMoney) : "-" + formatMoney(discountMoney);
printLine(`Giảm giá (${discountPercent}%):`, discountText);

printLine("VAT (8%):", formatMoney(vat));
printLine(useTip ? "Tip (5%):" : "Tip:", formatMoney(tip));
console.log("╠════════════════════════════════════════╣");
printLine("THANH TOÁN:", formatMoney(finalTotal));
console.log("╚════════════════════════════════════════╝");
