document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('clear-completed').addEventListener('click', clearCompletedTasks);
document.getElementById('sort-tasks').addEventListener('change', sortTasks);
document.getElementById('search-bar').addEventListener('input', filterTasks);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

let editingTaskId = null;


function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}


function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    document.getElementById('task-list').innerHTML = ''; 
    tasks.forEach(task => renderTask(task));
    updateProgress();
}


function addTask(e) {
    e.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;

    if (editingTaskId) {
       
        const tasks = getTasksFromLocalStorage();
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        tasks[taskIndex] = { id: editingTaskId, name: taskName, dueDate, completed: false, priority };
        saveTasksToLocalStorage(tasks);
        editingTaskId = null; 
    } else {
      
        const task = {
            id: Date.now(),
            name: taskName,
            dueDate: dueDate,
            completed: false,
            priority: priority
        };
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasksToLocalStorage(tasks);
    }

   
    loadTasks(); 
    e.target.reset();
    updateProgress();
}


function renderTask(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="${isOverdue(task.dueDate) ? 'overdue' : ''}" >${task.name } (Due: ${task.dueDate}) - Priority: ${task.priority}</span>
        <button onclick="editTask(${task.id})" style="color:white;background:purple;">Edit</button>
        <button onclick="deleteTask(${task.id})" style="color:white;background:red;">Delete</button>
        <button onclick="toggleComplete(${task.id})" " style="color:white;background:green;">${task.completed ? 'Undo' : 'Complete'}</button>
    `;
    taskList.appendChild(li);
}

function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
}


function editTask(taskId) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    document.getElementById('task-name').value = task.name;
    document.getElementById('task-due-date').value = task.dueDate;
    document.getElementById('task-priority').value = task.priority;
    editingTaskId = taskId; 
}




function deleteTask(taskId) {
    if(confirm("Are you sure you want to delete?")==true){

        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasksToLocalStorage(tasks);
        loadTasks(); 
    }
}


function toggleComplete(taskId) {
    const tasks = getTasksFromLocalStorage();
    const task = tasks.find(t => t.id === taskId);
    task.completed = !task.completed;
    saveTasksToLocalStorage(tasks);
    loadTasks(); 
}


function clearCompletedTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => !task.completed);
    saveTasksToLocalStorage(tasks);
    loadTasks();
}



function sortTasks() {
    const sortBy = document.getElementById('sort-tasks').value;
    let tasks = getTasksFromLocalStorage();
    if (sortBy === 'dueDate') {
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else {
        tasks.sort((a, b) => a.name.localeCompare(b.name));
    }
    saveTasksToLocalStorage(tasks);
    loadTasks(); 
}

function filterTasks() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const tasks = getTasksFromLocalStorage();
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(query));
    document.getElementById('task-list').innerHTML = '';
    filteredTasks.forEach(task => renderTask(task));
}


function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
}


function updateProgress() {
    const tasks = getTasksFromLocalStorage();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    document.getElementById('progress-bar').value = progress;
    document.getElementById('progress-text').innerText = `${Math.round(progress)}%`;
}