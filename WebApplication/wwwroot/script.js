let tasks = [];

/* ---------------------------
   Authorization functions
-----------------------------*/

// Login user
async function loginUser(email, password) {
    try {
        const response = await fetch('/api/account/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Login error');
        alert('Logged in successfully');
        showTasksSection();
        loadTasks();
    } catch (error) {
        console.error(error);
        alert('Failed to log in. Check your credentials.');
    }
}

// Register user
async function registerUser(email, password) {
    try {
        const response = await fetch('/api/account/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Registration error');
        alert('Registered successfully. You are now logged in.');
        showTasksSection();
        loadTasks();
    } catch (error) {
        console.error(error);
        alert('Failed to register. Please try again.');
    }
}

// Logout user
async function logoutUser() {
    try {
        const response = await fetch('/api/account/logout', { method: 'POST' });
        if (!response.ok) throw new Error('Logout error');
        alert('You have been logged out.');
        document.getElementById('auth-forms').style.display = 'block';
        document.getElementById('tasks-section').style.display = 'none';
        tasks = [];
    } catch (error) {
        console.error(error);
        alert('Failed to log out.');
    }
}

// Show tasks section and hide auth forms
function showTasksSection() {
    document.getElementById('auth-forms').style.display = 'none';
    document.getElementById('tasks-section').style.display = 'block';
}

/* ---------------------------
   Task functions
-----------------------------*/

// Load tasks from the backend
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Error loading tasks');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// Add a new task
async function addTask(name, dueDate) {
    const newTask = {
        name: name,
        dueDate: dueDate,
        completed: false,
        isImportant: false
    };

    try {z
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        if (!response.ok) throw new Error('Error creating task');
        const createdTask = await response.json();
        tasks.push(createdTask);
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error deleting task');
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// Delete all completed tasks
async function deleteCompletedTasks() {
    try {
        const response = await fetch('/api/tasks/completed', { method: 'DELETE' });
        if (!response.ok) throw new Error('Error deleting completed tasks');
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// Toggle task completion
async function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.completed = !task.completed;

    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('Error updating task');
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// Toggle task priority
async function toggleTaskPriority(id) {
    try {
        const response = await fetch(`/api/tasks/${id}/priority`, { method: 'PUT' });
        if (!response.ok) throw new Error('Error toggling task priority');
        const updatedTask = await response.json();
        const index = tasks.findIndex(t => t.id === id);
        if (index !== -1) tasks[index] = updatedTask;
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// Filter tasks by query
function filterTasks(query) {
    return tasks.filter(task =>
        task.name.toLowerCase().includes(query.toLowerCase())
    );
}

// Render tasks in the table
function renderTasks(filteredTasks = null) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const tasksToRender = filteredTasks || tasks;

    tasksToRender.forEach(task => {
        const row = document.createElement('tr');

        row.innerHTML = `
      <td>${task.completed ? `<s>${task.name}</s>` : task.name}</td>
      <td>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</td>
      <td>
        ${task.completed ? 'Completed' : 'Pending'}<br>
        ${task.isImportant ? '<strong>Important</strong>' : 'Normal'}
      </td>
      <td>
        <button onclick="toggleTaskCompletion(${task.id})">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button onclick="toggleTaskPriority(${task.id})">
          ${task.isImportant ? 'Make Normal' : 'Make Important'}
        </button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;
        taskList.appendChild(row);
    });
}

/* ---------------------------
   Event listeners
-----------------------------*/

// Login
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    if (!email || !password) {
        alert('Please enter email and password to log in');
        return;
    }
    loginUser(email, password);
});

// Register
document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    if (!email || !password) {
        alert('Please enter email and password to register');
        return;
    }
    registerUser(email, password);
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    logoutUser();
});

// Add task
document.getElementById('add-task').addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value.trim();
    const taskDate = document.getElementById('task-date').value;
    if (!taskName || !taskDate) {
        alert('Please enter task name and date.');
        return;
    }
    addTask(taskName, taskDate);
    document.getElementById('task-name').value = '';
    document.getElementById('task-date').value = '';
});

// Filter tasks
document.getElementById('filter').addEventListener('input', (e) => {
    const query = e.target.value;
    const filteredTasks = filterTasks(query);
    renderTasks(filteredTasks);
});

// Delete completed tasks
document.getElementById('delete-completed').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        deleteCompletedTasks();
    }
});
