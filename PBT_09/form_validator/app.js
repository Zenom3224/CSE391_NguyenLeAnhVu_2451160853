const form = document.querySelector("#registerForm");
const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");
const phone = document.querySelector("#phone");
const submitBtn = document.querySelector("#submitBtn");
const modal = document.querySelector("#successModal");
const successInfo = document.querySelector("#successInfo");

const validState = {
    name: false,
    email: false,
    password: false,
    confirm: false,
    phone: false
};

function setInputState(input, messageElement, isValid, message) {
    input.classList.toggle("valid", isValid);
    input.classList.toggle("invalid", !isValid);
    messageElement.textContent = message;
    messageElement.classList.toggle("ok", isValid);
}

function checkFormValid() {
    submitBtn.disabled = !Object.values(validState).every(Boolean);
}

function validateName() {
    const value = fullName.value.trim();
    const isValid = value.length >= 2 && value.length <= 50;
    validState.name = isValid;
    document.querySelector("#nameStatus").textContent = isValid ? "✅" : "❌";
    setInputState(fullName, document.querySelector("#nameMsg"), isValid, isValid ? "Tên hợp lệ." : "Tên cần từ 2 đến 50 ký tự.");
    checkFormValid();
}

function validateEmail() {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = pattern.test(email.value.trim());
    validState.email = isValid;
    setInputState(email, document.querySelector("#emailMsg"), isValid, isValid ? "Email hợp lệ." : "Email chưa hợp lệ.");
    checkFormValid();
}

function getPasswordStrength(value) {
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    if (value.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) return "strong";
    if (value.length >= 8 && /[A-Za-z]/.test(value) && hasNumber) return "medium";
    if (value.length > 0) return "weak";
    return "none";
}

function validatePassword() {
    const value = password.value;
    const strength = getPasswordStrength(value);
    const bar = document.querySelector("#strengthBar");
    bar.className = "";

    if (strength !== "none") bar.classList.add(strength);

    let message = "Mật khẩu cần ít nhất 8 ký tự.";
    if (strength === "weak") message = "Mật khẩu yếu.";
    if (strength === "medium") message = "Mật khẩu trung bình.";
    if (strength === "strong") message = "Mật khẩu mạnh.";

    const isValid = strength === "medium" || strength === "strong";
    validState.password = isValid;
    setInputState(password, document.querySelector("#passwordMsg"), isValid, message);
    validateConfirm();
    checkFormValid();
}

function validateConfirm() {
    const isValid = confirmPassword.value.length > 0 && confirmPassword.value === password.value;
    validState.confirm = isValid;
    setInputState(confirmPassword, document.querySelector("#confirmMsg"), isValid, isValid ? "Mật khẩu xác nhận khớp." : "Mật khẩu xác nhận chưa khớp.");
    checkFormValid();
}

function formatPhone(value) {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
}

function validatePhone() {
    phone.value = formatPhone(phone.value);
    const digits = phone.value.replace(/\D/g, "");
    const isValid = digits.length === 10;
    validState.phone = isValid;
    setInputState(phone, document.querySelector("#phoneMsg"), isValid, isValid ? "Số điện thoại hợp lệ." : "Số điện thoại cần có 10 chữ số.");
    checkFormValid();
}

fullName.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
password.addEventListener("input", validatePassword);
confirmPassword.addEventListener("input", validateConfirm);
phone.addEventListener("input", validatePhone);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submitBtn.disabled) return;

    successInfo.textContent = "";
    const lines = [
        `Họ tên: ${fullName.value.trim()}`,
        `Email: ${email.value.trim()}`,
        `Số điện thoại: ${phone.value}`
    ];
    lines.forEach(text => {
        const p = document.createElement("p");
        p.textContent = text;
        successInfo.appendChild(p);
    });
    modal.classList.add("open");
});

document.querySelector("#closeModal").addEventListener("click", () => modal.classList.remove("open"));
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
});
