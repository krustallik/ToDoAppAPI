let tasks = [];

// ����������� ������ ������� � �������
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('������� ��� ����������� �������');

        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// ������ �������� (POST)
async function addTask(name, dueDate) {
    const newTask = {
        name: name,
        dueDate: dueDate,
        completed: false
    };

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        if (!response.ok) throw new Error('������� ��� �������� ��������');

        // ������ ������� ��������� ��'���
        const createdTask = await response.json();
        tasks.push(createdTask);
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// �������� �������� (DELETE)
async function deleteTask(id) {
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('������� ��� �������� ��������');

        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// ������ ������ �������� (PUT)
async function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // ���������� completed
    task.completed = !task.completed;

    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('������� ��� �������� ��������');

        renderTasks();
    } catch (error) {
        console.error(error);
    }
}

// Գ�������� ������� (����� �������� �� ����)
function filterTasks(query) {
    return tasks.filter(task =>
        task.name.toLowerCase().includes(query.toLowerCase())
    );
}

// ³��������� �������� � �������
function renderTasks(filteredTasks = null) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    const tasksToRender = filteredTasks || tasks;

    tasksToRender.forEach(task => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${task.completed ? `<s>${task.name}</s>` : task.name}</td>
            <td>${task.dueDate}</td>
            <td>${task.completed ? 'Completed' : 'Pending'}</td>
            <td>
                <button class="complete" onclick="toggleTaskCompletion(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
            </td>
        `;
        taskList.appendChild(row);
    });
}

// ������� ����
document.getElementById('add-task').addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value.trim();
    const taskDate = document.getElementById('task-date').value;

    if (taskName === '' || taskDate === '') {
        alert('���� �����, ������ ����� �� ����.');
        return;
    }

    addTask(taskName, taskDate);
    document.getElementById('task-name').value = '';
    document.getElementById('task-date').value = '';
});

document.getElementById('filter').addEventListener('input', (e) => {
    const query = e.target.value;
    const filteredTasks = filterTasks(query);
    renderTasks(filteredTasks);
});

// �����������
loadTasks();
