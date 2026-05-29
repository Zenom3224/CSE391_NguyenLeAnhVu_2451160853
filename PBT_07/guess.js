const params = new URLSearchParams(window.location.search);
const secretNumber = params.get("demo") === "1" ? 42 : Math.floor(Math.random() * 100) + 1;
const guessedNumbers = [];
const history = [];

let count = 0;
let maxTurn = 7;
let isWin = false;

while (count < maxTurn) {
    let input = prompt(`Lần đoán ${count + 1}/${maxTurn}: Nhập số từ 1 đến 100`);

    if (input === null) {
        alert("Bạn đã thoát game.");
        history.push("Người chơi đã thoát game.");
        break;
    }

    let guess = Number(input);

    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
        alert("Vui lòng nhập số nguyên từ 1 đến 100.");
        history.push(`Input không hợp lệ: ${input}`);
        continue;
    }

    let isDuplicate = false;

    for (let i = 0; i < guessedNumbers.length; i++) {
        if (guessedNumbers[i] === guess) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        alert("Bạn đã đoán số này rồi!");
        history.push(`Đoán lại số ${guess}, không tính lượt.`);
        continue;
    }

    guessedNumbers.push(guess);
    count++;

    if (guess === secretNumber) {
        alert(`Đúng rồi! Bạn đoán đúng sau ${count} lần!`);
        history.push(`Lần ${count}: ${guess} - Đúng rồi!`);
        isWin = true;
        break;
    } else if (guess < secretNumber) {
        alert("Cao hơn");
        history.push(`Lần ${count}: ${guess} - Cao hơn`);
    } else {
        alert("Thấp hơn");
        history.push(`Lần ${count}: ${guess} - Thấp hơn`);
    }
}

if (!isWin && count === maxTurn) {
    alert(`Bạn đã hết lượt. Đáp án đúng là ${secretNumber}.`);
    history.push(`Hết lượt. Đáp án đúng là ${secretNumber}.`);
}

const resultBox = document.getElementById("result");
resultBox.innerHTML = `
    <strong>Kết quả chơi:</strong><br>
    Số lần đoán hợp lệ: ${count}<br>
    Các số đã đoán: ${guessedNumbers.join(", ") || "Chưa có"}<br>
    <hr>
    ${history.join("<br>")}
`;
