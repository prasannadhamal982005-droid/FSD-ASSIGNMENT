const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const error = document.getElementById('error');

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();

  // Error Handling
  if (taskText === "") {
    error.textContent = "Please enter a task!";
    return;
  }

  error.textContent = ""; // Clear error if valid

  // Create task item
  const li = document.createElement('li');
  li.innerHTML = `${taskText} <span onclick="deleteTask(this)">✖</span>`;
  taskList.appendChild(li);

  // Clear input
  taskInput.value = "";
});

function deleteTask(element) {
  element.parentElement.remove();
}
