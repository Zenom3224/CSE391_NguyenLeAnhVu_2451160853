// ===============================
// BÀI 2: QUẢN LÝ CÔNG VIỆC CÁ NHÂN
// Tập trung: DOM, sự kiện, CRUD, localStorage
// ===============================

const STORAGE_KEY = 'btth03_tasks';

// 1. Lấy các phần tử DOM
const openTaskFormBtn = document.getElementById('openTaskFormBtn');
const closeTaskFormBtn = document.getElementById('closeTaskFormBtn');
const cancelTaskFormBtn = document.getElementById('cancelTaskFormBtn');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const messageBox = document.getElementById('messageBox');
const formTitle = document.getElementById('formTitle');
const submitTaskBtn = document.getElementById('submitTaskBtn');

const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');

const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskDeadlineInput = document.getElementById('taskDeadline');
const taskPriorityInput = document.getElementById('taskPriority');
const taskCompletedInput = document.getElementById('taskCompleted');

let tasks = [];
let editingTaskId = null;

// 2. Đọc dữ liệu từ localStorage
function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY);
  tasks = data ? JSON.parse(data) : [];
}

// 3. Lưu dữ liệu vào localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// 4. Render danh sách công việc
function renderTasks() {
  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-box">Chưa có công việc nào. Hãy bấm nút "Thêm công việc".</div>
    `;
    updateTaskSummary();
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <article class="task-card ${task.completed ? 'completed' : ''}">
      <div class="task-top">
        <div>
          <h2 class="task-title">${escapeHTML(task.title)}</h2>
          <p>${escapeHTML(task.description)}</p>
          <div class="task-meta">
            <span class="badge">Hạn: ${escapeHTML(task.deadline)}</span>
            <span class="badge gray">Ưu tiên: ${escapeHTML(task.priority)}</span>
            <span class="badge gray">${task.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}</span>
          </div>
        </div>

        <div class="action-group">
          <button class="btn btn-warning" data-action="edit" data-id="${task.id}">Sửa</button>
          <button class="btn btn-danger" data-action="delete" data-id="${task.id}">Xóa</button>
        </div>
      </div>

      <label class="status-line">
        <input type="checkbox" data-action="toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
        Hoàn thành công việc
      </label>
    </article>
  `).join('');

  updateTaskSummary();
}

// 5. Cập nhật thống kê
function updateTaskSummary() {
  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  totalTasks.innerText = tasks.length;
  completedTasks.innerText = completedCount;
  pendingTasks.innerText = pendingCount;
}

function showMessage(text) {
  messageBox.innerText = text;
  messageBox.classList.remove('hidden');

  setTimeout(() => {
    messageBox.classList.add('hidden');
  }, 2500);
}

function openModal() {
  taskModal.classList.add('show');
}

function closeModal() {
  taskModal.classList.remove('show');
  resetForm();
}

function resetForm() {
  taskForm.reset();
  editingTaskId = null;
  formTitle.innerText = 'Thêm công việc';
  submitTaskBtn.innerText = 'Lưu công việc';
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

// Validation cơ bản
function validateTaskForm() {
  clearErrors();
  let isValid = true;

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const deadline = taskDeadlineInput.value;

  if (title === '') {
    setError('taskTitle', 'Không được để trống tiêu đề công việc.');
    isValid = false;
  }

  if (title.length > 80) {
    setError('taskTitle', 'Tiêu đề không nên dài quá 80 ký tự.');
    isValid = false;
  }

  if (description === '') {
    setError('taskDescription', 'Không được để trống mô tả.');
    isValid = false;
  }

  if (deadline === '') {
    setError('taskDeadline', 'Vui lòng chọn hạn hoàn thành.');
    isValid = false;
  }

  return isValid;
}

function getTaskDataFromForm() {
  return {
    title: taskTitleInput.value.trim(),
    description: taskDescriptionInput.value.trim(),
    deadline: taskDeadlineInput.value,
    priority: taskPriorityInput.value,
    completed: taskCompletedInput.checked
  };
}

function addTask() {
  const newTask = {
    id: Date.now().toString(),
    ...getTaskDataFromForm()
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  closeModal();
  showMessage('Đã thêm công việc thành công.');
}

function updateTask() {
  const index = tasks.findIndex(task => task.id === editingTaskId);

  if (index === -1) {
    showMessage('Không tìm thấy công việc cần cập nhật.');
    return;
  }

  tasks[index] = {
    id: editingTaskId,
    ...getTaskDataFromForm()
  };

  saveTasks();
  renderTasks();
  closeModal();
  showMessage('Đã cập nhật công việc thành công.');
}

function fillFormForEditing(taskId) {
  const task = tasks.find(item => item.id === taskId);

  if (!task) return;

  editingTaskId = task.id;
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskDeadlineInput.value = task.deadline;
  taskPriorityInput.value = task.priority;
  taskCompletedInput.checked = task.completed;

  formTitle.innerText = 'Cập nhật công việc';
  submitTaskBtn.innerText = 'Cập nhật';
  openModal();
}

function deleteTask(taskId) {
  const answer = confirm('Bạn có chắc chắn muốn xóa công việc này không?');

  if (!answer) return;

  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
  showMessage('Đã xóa công việc thành công.');
}

function toggleTaskStatus(taskId) {
  const task = tasks.find(item => item.id === taskId);

  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
  showMessage('Đã cập nhật trạng thái công việc.');
}

// 6. Gắn sự kiện
openTaskFormBtn.addEventListener('click', () => {
  resetForm();
  openModal();
});

closeTaskFormBtn.addEventListener('click', closeModal);
cancelTaskFormBtn.addEventListener('click', closeModal);

taskModal.addEventListener('click', event => {
  if (event.target === taskModal) {
    closeModal();
  }
});

taskForm.addEventListener('submit', event => {
  event.preventDefault();

  if (!validateTaskForm()) return;

  if (editingTaskId) {
    updateTask();
  } else {
    addTask();
  }
});

// Event delegation: xử lý nút sửa, xóa và checkbox trong danh sách động
taskList.addEventListener('click', event => {
  const actionElement = event.target.closest('[data-action]');
  if (!actionElement) return;

  const action = actionElement.dataset.action;
  const taskId = actionElement.dataset.id;

  if (action === 'edit') {
    fillFormForEditing(taskId);
  }

  if (action === 'delete') {
    deleteTask(taskId);
  }

  if (action === 'toggle') {
    toggleTaskStatus(taskId);
  }
});

// 7. Khởi động ứng dụng
loadTasks();
renderTasks();
