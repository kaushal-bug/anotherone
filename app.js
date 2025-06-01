// Data Management
let data = {
    interns: [],
    tasks: [],
    updates: []
};

// Load data from localStorage if available
function loadData() {
    const savedData = localStorage.getItem('internDashboardData');
    if (savedData) {
        data = JSON.parse(savedData);
        updateUI();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('internDashboardData', JSON.stringify(data));
}

// Navigation
document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
        document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
        
        const pageId = link.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        link.classList.add('active');
    });
});

// Role Toggle
const roleToggle = document.getElementById('roleToggle');
roleToggle.addEventListener('change', () => {
    document.body.classList.toggle('manager-view', roleToggle.checked);
    updateUI();
});

// Intern Management
document.getElementById('addInternBtn').addEventListener('click', () => {
    document.getElementById('addInternModal').style.display = 'block';
});

document.getElementById('addInternForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newIntern = {
        id: Date.now(),
        name: form.querySelector('input[placeholder="Full Name"]').value,
        role: form.querySelector('input[placeholder="Role"]').value,
        email: form.querySelector('input[placeholder="Email"]').value,
        phone: form.querySelector('input[placeholder="Phone"]').value,
        tasks: []
    };
    
    data.interns.push(newIntern);
    saveData();
    updateUI();
    form.reset();
    document.getElementById('addInternModal').style.display = 'none';
});

// Task Management
document.getElementById('addTaskBtn').addEventListener('click', () => {
    document.getElementById('addTaskModal').style.display = 'block';
});

document.getElementById('addTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newTask = {
        id: Date.now(),
        title: form.querySelector('input[placeholder="Task Title"]').value,
        description: form.querySelector('textarea').value,
        assignedTo: form.querySelector('select').value,
        priority: form.querySelectorAll('select')[1].value,
        dueDate: form.querySelector('input[type="date"]').value,
        status: 'todo',
        comments: [],
        createdAt: new Date().toISOString()
    };
    
    data.tasks.push(newTask);
    if (newTask.assignedTo) {
        const intern = data.interns.find(i => i.id === parseInt(newTask.assignedTo));
        if (intern) {
            intern.tasks.push(newTask.id);
        }
    }
    saveData();
    updateUI();
    form.reset();
    document.getElementById('addTaskModal').style.display = 'none';
});

// Update Management
document.getElementById('updateForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newUpdate = {
        id: Date.now(),
        taskId: form.querySelector('#updateTaskSelect').value,
        content: form.querySelector('#updateText').value,
        timestamp: new Date().toISOString(),
        files: [] // Would handle file upload in a real implementation
    };
    
    data.updates.push(newUpdate);
    saveData();
    updateUI();
    form.reset();
});

// UI Updates
function updateUI() {
    updateDashboardStats();
    updateInternsList();
    updateTasksBoard();
    updateTaskSelect();
    updateUpdatesList();
}

function updateDashboardStats() {
    document.getElementById('totalTasks').textContent = data.tasks.length;
    document.getElementById('completedTasks').textContent = data.tasks.filter(t => t.status === 'completed').length;
    document.getElementById('overdueTasks').textContent = data.tasks.filter(t => {
        return new Date(t.dueDate) < new Date() && t.status !== 'completed';
    }).length;
    document.getElementById('activeInterns').textContent = data.interns.length;

    // Update intern progress list
    const progressList = document.getElementById('internProgressList');
    progressList.innerHTML = '';
    
    data.interns.forEach(intern => {
        const internTasks = data.tasks.filter(t => t.assignedTo === intern.id.toString());
        const completedTasks = internTasks.filter(t => t.status === 'completed').length;
        const progress = internTasks.length ? (completedTasks / internTasks.length) * 100 : 0;
        
        const progressItem = document.createElement('div');
        progressItem.className = 'progress-item';
        progressItem.innerHTML = `
            <div class="progress-header">
                <span>${intern.name}</span>
                <span>${Math.round(progress)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${progress}%"></div>
            </div>
        `;
        progressList.appendChild(progressItem);
    });
}

function updateInternsList() {
    const internsList = document.getElementById('internsList');
    internsList.innerHTML = '';
    
    data.interns.forEach(intern => {
        const internTasks = data.tasks.filter(t => t.assignedTo === intern.id.toString());
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${intern.name}</h3>
            <p><i class="fas fa-briefcase"></i> ${intern.role}</p>
            <p><i class="fas fa-envelope"></i> ${intern.email}</p>
            ${intern.phone ? `<p><i class="fas fa-phone"></i> ${intern.phone}</p>` : ''}
            <div class="task-stats">
                <span>Tasks: ${internTasks.length}</span>
                <span>Completed: ${internTasks.filter(t => t.status === 'completed').length}</span>
            </div>
        `;
        internsList.appendChild(card);
    });
}

function updateTasksBoard() {
    ['todo', 'inProgress', 'completed'].forEach(status => {
        const column = document.getElementById(`${status}Tasks`);
        column.innerHTML = '';
        
        const tasks = data.tasks.filter(t => t.status === status);
        tasks.forEach(task => {
            const assignedIntern = data.interns.find(i => i.id === parseInt(task.assignedTo));
            const taskCard = document.createElement('div');
            taskCard.className = `card priority-${task.priority}`;
            taskCard.draggable = true;
            taskCard.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <div class="task-meta">
                    <span><i class="fas fa-user"></i> ${assignedIntern ? assignedIntern.name : 'Unassigned'}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
            `;
            
            // Add drag and drop functionality
            taskCard.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.id);
            });
            
            column.appendChild(taskCard);
        });
    });
}

function updateTaskSelect() {
    const select = document.getElementById('updateTaskSelect');
    select.innerHTML = '<option value="">Select Task</option>';
    
    data.tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.id;
        option.textContent = task.title;
        select.appendChild(option);
    });
}

function updateUpdatesList() {
    const updatesList = document.getElementById('updatesList');
    updatesList.innerHTML = '';
    
    data.updates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .forEach(update => {
            const task = data.tasks.find(t => t.id === parseInt(update.taskId));
            if (!task) return;
            
            const updateCard = document.createElement('div');
            updateCard.className = 'card';
            updateCard.innerHTML = `
                <h4>${task.title}</h4>
                <p>${update.content}</p>
                <small>${new Date(update.timestamp).toLocaleString()}</small>
            `;
            updatesList.appendChild(updateCard);
        });
}

// Drag and Drop for Tasks
document.querySelectorAll('.task-list').forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });
    
    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        const task = data.tasks.find(t => t.id === parseInt(taskId));
        if (task) {
            task.status = column.parentElement.getAttribute('data-status');
            saveData();
            updateUI();
        }
    });
});

// Close modals
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.modal').style.display = 'none';
    });
});

// Search and Filter functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterTasks(searchTerm);
});

document.getElementById('statusFilter').addEventListener('change', (e) => {
    const status = e.target.value;
    filterTasks('', status);
});

document.getElementById('dateFilter').addEventListener('change', (e) => {
    const date = e.target.value;
    filterTasks('', '', date);
});

function filterTasks(search = '', status = '', date = '') {
    const filteredTasks = data.tasks.filter(task => {
        const matchesSearch = !search || 
            task.title.toLowerCase().includes(search) || 
            task.description.toLowerCase().includes(search);
        const matchesStatus = !status || task.status === status;
        const matchesDate = !date || task.dueDate === date;
        return matchesSearch && matchesStatus && matchesDate;
    });
    
    // Update task board with filtered tasks
    updateTasksBoard(filteredTasks);
}

// Export functionality
function exportData() {
    const exportData = {
        interns: data.interns,
        tasks: data.tasks,
        updates: data.updates,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intern-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize the dashboard
loadData();
updateUI(); 