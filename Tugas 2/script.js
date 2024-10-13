let todoList = [];

function addTask() {
  const input = document.getElementById('todoInput');
  const taskText = input.value.trim();

  if (taskText) {
    const task = {
      id: Date.now(),
      text: taskText,
      isEditing: false
    };
    todoList.push(task);
    input.value = '';
    renderList();
  }
}

function renderList() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';

  todoList.forEach(task => {
    const listItem = document.createElement('li');

    if (task.isEditing) {
      listItem.innerHTML = `
        <input type="text" id="editInput_${task.id}" value="${task.text}" class="task-text-edit">
        <div class="actions">
          <button class="edit" onclick="saveTask(${task.id})">Save</button>
          <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
    } else {
      listItem.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="actions">
          <button class="edit" onclick="editTask(${task.id})">Edit</button>
          <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
    }

    list.appendChild(listItem);
  });
}

function editTask(id) {
  const taskIndex = todoList.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    todoList[taskIndex].isEditing = true;
    renderList();
  }
}

function saveTask(id) {
  const taskIndex = todoList.findIndex(task => task.id === id);
  const newTaskText = document.getElementById(`editInput_${id}`).value.trim();

  if (taskIndex !== -1 && newTaskText) {
    todoList[taskIndex].text = newTaskText;
    todoList[taskIndex].isEditing = false;
    renderList();
  }
}

function deleteTask(id) {
  todoList = todoList.filter(task => task.id !== id);
  renderList();
}
