// ===============================
// BÀI 1: QUẢN LÝ SINH VIÊN
// Tập trung: DOM, sự kiện, CRUD, localStorage
// ===============================

const STORAGE_KEY = 'btth03_students';

// 1. Lấy các phần tử DOM cần thao tác
const openStudentFormBtn = document.getElementById('openStudentFormBtn');
const closeStudentFormBtn = document.getElementById('closeStudentFormBtn');
const cancelStudentFormBtn = document.getElementById('cancelStudentFormBtn');
const studentModal = document.getElementById('studentModal');
const studentForm = document.getElementById('studentForm');
const studentTableBody = document.getElementById('studentTableBody');
const messageBox = document.getElementById('messageBox');
const totalStudents = document.getElementById('totalStudents');
const classAverage = document.getElementById('classAverage');
const formTitle = document.getElementById('formTitle');
const submitStudentBtn = document.getElementById('submitStudentBtn');

const studentCodeInput = document.getElementById('studentCode');
const fullNameInput = document.getElementById('fullName');
const birthDateInput = document.getElementById('birthDate');
const classNameInput = document.getElementById('className');
const gpaInput = document.getElementById('gpa');
const emailInput = document.getElementById('email');

let students = [];
let editingStudentId = null;

// 2. Đọc dữ liệu từ localStorage khi tải trang
function loadStudents() {
  const data = localStorage.getItem(STORAGE_KEY);
  students = data ? JSON.parse(data) : [];
}

// 3. Lưu dữ liệu xuống localStorage
function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// 4. Render danh sách sinh viên ra bảng
function renderStudents() {
  if (students.length === 0) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-row">Chưa có sinh viên nào. Hãy bấm nút "Thêm sinh viên".</td>
      </tr>
    `;
    updateStatistics();
    return;
  }

  studentTableBody.innerHTML = students.map(student => `
    <tr>
      <td>${escapeHTML(student.code)}</td>
      <td>${escapeHTML(student.fullName)}</td>
      <td>${escapeHTML(student.birthDate)}</td>
      <td>${escapeHTML(student.className)}</td>
      <td>${Number(student.gpa).toFixed(1)}</td>
      <td>${escapeHTML(student.email)}</td>
      <td>
        <div class="action-group">
          <button class="btn btn-warning" data-action="edit" data-id="${student.id}">Sửa</button>
          <button class="btn btn-danger" data-action="delete" data-id="${student.id}">Xóa</button>
        </div>
      </td>
    </tr>
  `).join('');

  updateStatistics();
}

// 5. Cập nhật thống kê tổng số sinh viên và điểm trung bình
function updateStatistics() {
  totalStudents.innerText = students.length;

  if (students.length === 0) {
    classAverage.innerText = '0.00';
    return;
  }

  const totalGpa = students.reduce((sum, student) => sum + Number(student.gpa), 0);
  classAverage.innerText = (totalGpa / students.length).toFixed(2);
}

function showMessage(text) {
  messageBox.innerText = text;
  messageBox.classList.remove('hidden');

  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, 2500);
}

function openModal() {
  studentModal.classList.add('show');
}

function closeModal() {
  studentModal.classList.remove('show');
  resetForm();
}

function resetForm() {
  studentForm.reset();
  editingStudentId = null;
  formTitle.innerText = 'Thêm sinh viên';
  submitStudentBtn.innerText = 'Lưu sinh viên';
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(error => {
    error.innerText = '';
  });
}

function setError(inputId, message) {
  const errorElement = document.getElementById(`${inputId}Error`);
  errorElement.innerText = message;
}

// Validation cơ bản theo yêu cầu bài tập về nhà
function validateStudentForm() {
  clearErrors();
  let isValid = true;

  const code = studentCodeInput.value.trim();
  const fullName = fullNameInput.value.trim();
  const birthDate = birthDateInput.value;
  const className = classNameInput.value.trim();
  const gpa = Number(gpaInput.value);
  const email = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (code === '') {
    setError('studentCode', 'Không được để trống mã sinh viên.');
    isValid = false;
  }

  const duplicatedCode = students.some(student => {
    return student.code.toLowerCase() === code.toLowerCase() && student.id !== editingStudentId;
  });

  if (duplicatedCode) {
    setError('studentCode', 'Mã sinh viên đã tồn tại.');
    isValid = false;
  }

  if (fullName === '') {
    setError('fullName', 'Không được để trống họ và tên.');
    isValid = false;
  }

  if (birthDate === '') {
    setError('birthDate', 'Vui lòng chọn ngày sinh.');
    isValid = false;
  }

  if (className === '') {
    setError('className', 'Không được để trống lớp học.');
    isValid = false;
  }

  if (gpaInput.value === '' || Number.isNaN(gpa) || gpa < 0 || gpa > 10) {
    setError('gpa', 'Điểm trung bình phải là số từ 0 đến 10.');
    isValid = false;
  }

  if (email === '') {
    setError('email', 'Không được để trống email.');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    setError('email', 'Email chưa đúng định dạng.');
    isValid = false;
  }

  return isValid;
}

function getStudentDataFromForm() {
  return {
    code: studentCodeInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    birthDate: birthDateInput.value,
    className: classNameInput.value.trim(),
    gpa: Number(gpaInput.value),
    email: emailInput.value.trim()
  };
}

function addStudent() {
  const newStudent = {
    id: Date.now().toString(),
    ...getStudentDataFromForm()
  };

  students.push(newStudent);
  saveStudents();
  renderStudents();
  closeModal();
  showMessage('Đã thêm sinh viên thành công.');
}

function updateStudent() {
  const index = students.findIndex(student => student.id === editingStudentId);

  if (index === -1) {
    showMessage('Không tìm thấy sinh viên cần cập nhật.');
    return;
  }

  students[index] = {
    id: editingStudentId,
    ...getStudentDataFromForm()
  };

  saveStudents();
  renderStudents();
  closeModal();
  showMessage('Đã cập nhật sinh viên thành công.');
}

function fillFormForEditing(studentId) {
  const student = students.find(item => item.id === studentId);

  if (!student) return;

  editingStudentId = student.id;
  studentCodeInput.value = student.code;
  fullNameInput.value = student.fullName;
  birthDateInput.value = student.birthDate;
  classNameInput.value = student.className;
  gpaInput.value = student.gpa;
  emailInput.value = student.email;

  formTitle.innerText = 'Cập nhật sinh viên';
  submitStudentBtn.innerText = 'Cập nhật';
  openModal();
}

function deleteStudent(studentId) {
  const answer = confirm('Bạn có chắc chắn muốn xóa sinh viên này không?');

  if (!answer) return;

  students = students.filter(student => student.id !== studentId);
  saveStudents();
  renderStudents();
  showMessage('Đã xóa sinh viên thành công.');
}

// 6. Gắn sự kiện cho các nút và form
openStudentFormBtn.addEventListener('click', () => {
  resetForm();
  openModal();
});

closeStudentFormBtn.addEventListener('click', closeModal);
cancelStudentFormBtn.addEventListener('click', closeModal);

studentModal.addEventListener('click', event => {
  if (event.target === studentModal) {
    closeModal();
  }
});

studentForm.addEventListener('submit', event => {
  event.preventDefault();

  if (!validateStudentForm()) return;

  if (editingStudentId) {
    updateStudent();
  } else {
    addStudent();
  }
});

// Event delegation: bắt sự kiện từ tbody thay vì gắn riêng từng nút
studentTableBody.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const studentId = button.dataset.id;

  if (action === 'edit') {
    fillFormForEditing(studentId);
  }

  if (action === 'delete') {
    deleteStudent(studentId);
  }
});

// 7. Khởi động ứng dụng
loadStudents();
renderStudents();
