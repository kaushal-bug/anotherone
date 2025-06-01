// Custom Cursor
const cursor = document.createElement('div');
const cursorDot = document.createElement('div');
cursor.className = 'cursor';
cursorDot.className = 'cursor-dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.8)';
    cursorDot.style.transform = 'scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursorDot.style.transform = 'scale(1)';
});

// Sidebar Toggle
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const sidebarToggle = document.createElement('button');
sidebarToggle.className = 'sidebar-toggle';
sidebarToggle.innerHTML = '<i data-feather="menu"></i>';
document.body.appendChild(sidebarToggle);

let sidebarActive = false;
sidebarToggle.addEventListener('click', () => {
    sidebarActive = !sidebarActive;
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('sidebar-active');
    sidebarToggle.innerHTML = sidebarActive ? 
        '<i data-feather="x"></i>' : 
        '<i data-feather="menu"></i>';
    feather.replace();
});

// Horizontal Scrolling for Task Board
const taskBoard = document.querySelector('.task-board');
const scrollButtons = document.createElement('div');
scrollButtons.className = 'scroll-buttons';
scrollButtons.innerHTML = `
    <button class="scroll-button" onclick="scrollTasks('left')">
        <i data-feather="chevron-left"></i>
    </button>
    <button class="scroll-button" onclick="scrollTasks('right')">
        <i data-feather="chevron-right"></i>
    </button>
`;
taskBoard.parentElement.insertBefore(scrollButtons, taskBoard);

function scrollTasks(direction) {
    const scrollAmount = 320; // card width + gap
    const currentScroll = taskBoard.scrollLeft;
    const newScroll = direction === 'left' ? 
        currentScroll - scrollAmount : 
        currentScroll + scrollAmount;
    
    taskBoard.scrollTo({
        left: newScroll,
        behavior: 'smooth'
    });
}

// Check authentication
function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user.username || user.type !== 'manager') {
        window.location.href = 'login.html';
    }
    return user;
}

const user = checkAuth();

// Update user name in header
document.getElementById('userName').textContent = user.name || 'Manager';

// Global search functionality
const searchInput = document.getElementById('globalSearch');
const searchModal = document.getElementById('searchModal');
const searchResults = document.getElementById('searchResults');

// Search data structure
const searchableData = {
    interns: data.interns.map(intern => ({
        type: 'intern',
        title: intern.name,
        subtitle: intern.role,
        details: `${intern.activeTasks} active tasks`,
        searchText: `${intern.name} ${intern.role} ${intern.email}`.toLowerCase()
    })),
    tasks: data.tasks.map(task => ({
        type: 'task',
        title: task.title,
        subtitle: `Due: ${new Date(task.dueDate).toLocaleDateString()}`,
        details: task.description,
        searchText: `${task.title} ${task.description} ${task.assignees.join(' ')}`.toLowerCase()
    })),
    messages: data.messages.map(msg => ({
        type: 'message',
        title: msg.subject,
        subtitle: `From: ${msg.from}`,
        details: msg.content,
        searchText: `${msg.subject} ${msg.from} ${msg.content}`.toLowerCase()
    }))
};

// Search functionality
function performSearch(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    for (const category in searchableData) {
        const categoryResults = searchableData[category]
            .filter(item => item.searchText.includes(searchTerm))
            .map(item => ({
                ...item,
                category
            }));
        results.push(...categoryResults);
    }

    return results;
}

// Render search results
function renderSearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="empty-results">
                <i data-feather="search"></i>
                <p>No results found</p>
            </div>
        `;
        feather.replace();
        return;
    }

    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item ${result.category}">
            <div class="result-icon">
                <i data-feather="${getIconForType(result.type)}"></i>
            </div>
            <div class="result-content">
                <h3>${result.title}</h3>
                <p class="subtitle">${result.subtitle}</p>
                <p class="details">${result.details}</p>
            </div>
        </div>
    `).join('');
    
    feather.replace();
}

function getIconForType(type) {
    const icons = {
        intern: 'user',
        task: 'check-square',
        message: 'mail'
    };
    return icons[type] || 'file';
}

// Search event handlers
searchInput.addEventListener('focus', () => {
    searchModal.style.display = 'flex';
    if (searchInput.value) {
        const results = performSearch(searchInput.value);
        renderSearchResults(results);
    }
});

searchInput.addEventListener('input', (e) => {
    const results = performSearch(e.target.value);
    renderSearchResults(results);
});

// Close search modal
function closeSearchModal() {
    searchModal.style.display = 'none';
}

// Close modal when clicking outside
searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeSearchModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Command/Ctrl + K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    // Escape to close search modal
    if (e.key === 'Escape' && searchModal.style.display === 'flex') {
        closeSearchModal();
    }
});

// Sample data (in a real app, this would come from a server)
const data = {
    interns: [
        { 
            name: 'Sarah Wilson', 
            role: 'Frontend Intern',
            email: 'sarah.w@slashexp.com',
            phone: '+1 234-567-8901',
            activeTasks: 3,
            totalTasks: 12,
            performance: 92,
            status: 'active'
        },
        { 
            name: 'Alex Chen', 
            role: 'Backend Intern',
            email: 'alex.c@slashexp.com',
            phone: '+1 234-567-8902',
            activeTasks: 2,
            totalTasks: 8,
            performance: 88,
            status: 'active'
        }
    ],
    tasks: [
        { 
            id: 1, 
            title: 'Design Homepage', 
            description: 'Create a modern homepage design using Figma',
            assignees: ['Sarah Wilson'],
            status: 'in-progress', 
            dueDate: '2024-02-15',
            priority: 'high',
            progress: 65
        },
        { 
            id: 2, 
            title: 'Implement API Endpoints', 
            description: 'Develop RESTful API endpoints for user authentication',
            assignees: ['Alex Chen'],
            status: 'completed', 
            dueDate: '2024-02-10',
            priority: 'medium',
            progress: 100
        }
    ],
    messages: [
        {
            id: 1,
            from: 'Sarah Wilson',
            subject: 'Homepage Design Update',
            content: 'I have completed the initial mockups for review.',
            timestamp: '2024-02-12T10:30:00',
            read: false,
            flagged: true
        },
        {
            id: 2,
            from: 'Alex Chen',
            subject: 'API Documentation',
            content: 'Please review the updated API documentation.',
            timestamp: '2024-02-12T09:15:00',
            read: true,
            flagged: false
        }
    ],
    analytics: {
        taskCompletion: {
            completed: 45,
            inProgress: 15,
            todo: 10
        },
        weeklyProgress: [
            { week: 'Week 1', completed: 12 },
            { week: 'Week 2', completed: 15 },
            { week: 'Week 3', completed: 8 },
            { week: 'Week 4', completed: 10 }
        ]
    }
};

// Render interns table
function renderInternsTable() {
    const tbody = document.querySelector('#internsTable tbody');
    tbody.innerHTML = data.interns.map(intern => `
        <tr>
            <td>
                <div class="user-info-cell">
                    <div class="user-avatar">${intern.name.charAt(0)}</div>
                    <div class="user-details">
                        <span class="user-name">${intern.name}</span>
                        <span class="user-status ${intern.status}">${intern.status}</span>
                    </div>
                </div>
            </td>
            <td>${intern.role}</td>
            <td>
                <div class="contact-info">
                    <a href="mailto:${intern.email}">${intern.email}</a>
                    <span>${intern.phone}</span>
                </div>
            </td>
            <td>${intern.activeTasks}/${intern.totalTasks}</td>
            <td>
                <div class="performance-indicator">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${intern.performance}%"></div>
                    </div>
                    <span>${intern.performance}%</span>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="icon-btn" onclick="viewInternDetails('${intern.name}')">👁️</button>
                    <button class="icon-btn" onclick="assignTask('${intern.name}')">📋</button>
                    <button class="icon-btn" onclick="sendMessage('${intern.name}')">✉️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render task board
function renderTaskBoard() {
    ['todo', 'inProgress', 'completed'].forEach(status => {
        const container = document.getElementById(`${status}Tasks`);
        const filteredTasks = data.tasks.filter(task => {
            return (status === 'todo' && task.status === 'pending') ||
                   (status === 'inProgress' && task.status === 'in-progress') ||
                   (status === 'completed' && task.status === 'completed');
        });

        container.innerHTML = filteredTasks.map(task => `
            <div class="task-card priority-${task.priority}">
                <div class="task-header">
                    <h4>${task.title}</h4>
                    <span class="priority-badge">${task.priority}</span>
                </div>
                <div class="task-body">
                    <p>${task.description}</p>
                    <div class="assignees">
                        ${task.assignees.map(assignee => `
                            <span class="assignee-chip">${assignee.charAt(0)}</span>
                        `).join('')}
                    </div>
                </div>
                <div class="task-footer">
                    <span class="due-date">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progress}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

// Render analytics charts
function renderAnalytics() {
    // Task Completion Chart
    new Chart(document.getElementById('taskCompletionChart'), {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'In Progress', 'To Do'],
            datasets: [{
                data: [
                    data.analytics.taskCompletion.completed,
                    data.analytics.taskCompletion.inProgress,
                    data.analytics.taskCompletion.todo
                ],
                backgroundColor: ['#10B981', '#F59E0B', '#6B7280']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#E2E8F0'
                    }
                },
                title: {
                    display: true,
                    text: 'Task Completion Status',
                    color: '#E2E8F0'
                }
            }
        }
    });

    // Progress Trend Chart
    new Chart(document.getElementById('progressTrendChart'), {
        type: 'line',
        data: {
            labels: data.analytics.weeklyProgress.map(w => w.week),
            datasets: [{
                label: 'Tasks Completed',
                data: data.analytics.weeklyProgress.map(w => w.completed),
                borderColor: '#6366F1',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#1E293B'
                    },
                    ticks: {
                        color: '#E2E8F0'
                    }
                },
                x: {
                    grid: {
                        color: '#1E293B'
                    },
                    ticks: {
                        color: '#E2E8F0'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#E2E8F0'
                    }
                }
            }
        }
    });
}

// Render messages
function renderMessages() {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = data.messages.map(message => `
        <div class="message-card ${message.read ? '' : 'unread'} ${message.flagged ? 'flagged' : ''}">
            <div class="message-header">
                <div class="message-from">
                    <div class="user-avatar">${message.from.charAt(0)}</div>
                    <span>${message.from}</span>
                </div>
                <span class="message-time">${new Date(message.timestamp).toLocaleString()}</span>
            </div>
            <div class="message-subject">${message.subject}</div>
            <div class="message-content">${message.content}</div>
            <div class="message-actions">
                <button class="icon-btn" onclick="toggleMessageFlag(${message.id})">🚩</button>
                <button class="icon-btn" onclick="markMessageRead(${message.id})">✓</button>
                <button class="icon-btn" onclick="replyToMessage(${message.id})">↩️</button>
            </div>
        </div>
    `).join('');
}

// Task Modal Functions
function showNewTaskModal() {
    document.getElementById('newTaskModal').style.display = 'flex';
}

function closeNewTaskModal() {
    document.getElementById('newTaskModal').style.display = 'none';
}

// Handle new task form submission
document.getElementById('newTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        dueDate: document.getElementById('taskDueDate').value,
        priority: document.getElementById('taskPriority').value,
        assignees: Array.from(document.querySelectorAll('#assigneeList input:checked'))
            .map(input => input.value)
    };
    
    // Add new task to data
    data.tasks.push({
        id: Date.now(),
        ...formData,
        status: 'pending',
        progress: 0
    });

    // Update UI
    renderTaskBoard();
    closeNewTaskModal();
});

// Initialize dashboard
renderInternsTable();
renderTaskBoard();
renderAnalytics();
renderMessages();

// Export functionality
function exportInternData() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Name,Role,Email,Active Tasks,Total Tasks,Performance\n" +
        data.interns.map(intern => 
            `${intern.name},${intern.role},${intern.email},${intern.activeTasks},${intern.totalTasks},${intern.performance}%`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "intern_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Message actions
function markAllRead() {
    data.messages.forEach(message => message.read = true);
    renderMessages();
}

function toggleMessageFlag(messageId) {
    const message = data.messages.find(m => m.id === messageId);
    if (message) {
        message.flagged = !message.flagged;
        renderMessages();
    }
}

function markMessageRead(messageId) {
    const message = data.messages.find(m => m.id === messageId);
    if (message) {
        message.read = true;
        renderMessages();
    }
}

function replyToMessage(messageId) {
    const message = data.messages.find(m => m.id === messageId);
    if (message) {
        // In a real app, this would open a reply composer
        alert(`Replying to: ${message.from}`);
    }
}

// Initialize Feather icons
feather.replace();

// Google Meet Integration
const createMeetBtn = document.getElementById('createMeetBtn');
const scheduleMeetBtn = document.getElementById('scheduleMeetBtn');
const meetTitle = document.getElementById('meetTitle');
const meetEmbed = document.getElementById('meetEmbed');

// Function to create a new Google Meet
async function createGoogleMeet() {
    try {
        // Note: This requires Google Calendar API integration
        const meetLink = 'https://meet.google.com/new';
        window.open(meetLink, '_blank');
    } catch (error) {
        console.error('Error creating meet:', error);
        showNotification('Error creating meet. Please try again.', 'error');
    }
}

// Function to schedule a Google Meet
async function scheduleGoogleMeet() {
    const title = meetTitle.value.trim();
    if (!title) {
        showNotification('Please enter a meeting title', 'warning');
        return;
    }

    try {
        // Note: This requires Google Calendar API integration
        const calendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(title)}&add=meet`;
        window.open(calendarLink, '_blank');
    } catch (error) {
        console.error('Error scheduling meet:', error);
        showNotification('Error scheduling meet. Please try again.', 'error');
    }
}

createMeetBtn.addEventListener('click', createGoogleMeet);
scheduleMeetBtn.addEventListener('click', scheduleGoogleMeet);

// Daily Updates Management
const internFilter = document.getElementById('internFilter');
const refreshUpdatesBtn = document.getElementById('refreshUpdatesBtn');
const completedTasksList = document.getElementById('completedTasksList');
const plannedTasksList = document.getElementById('plannedTasksList');
const blockersList = document.getElementById('blockersList');

// Sample data structure for updates
let dailyUpdates = {
    'amit': {
        completed: [
            { title: 'Design System Components', description: 'Completed the new button and input components', time: '2 hours ago' },
            { title: 'User Research', description: 'Conducted interviews with 5 users', time: '4 hours ago' }
        ],
        planned: [
            { title: 'Navigation Menu', description: 'Implement responsive navigation', time: 'Due tomorrow' },
            { title: 'Color Palette', description: 'Create dark mode color scheme', time: 'Due in 2 days' }
        ],
        blockers: [
            { title: 'API Integration', description: 'Waiting for backend endpoint documentation', time: 'Blocked for 1 day' }
        ]
    },
    'sajjad': {
        completed: [
            { title: 'Frontend Setup', description: 'Set up React project structure', time: '3 hours ago' },
            { title: 'Component Library', description: 'Installed and configured UI library', time: '5 hours ago' }
        ],
        planned: [
            { title: 'Authentication', description: 'Implement user login flow', time: 'Due tomorrow' },
            { title: 'Dashboard Layout', description: 'Create responsive grid layout', time: 'Due in 3 days' }
        ],
        blockers: [
            { title: 'Database Access', description: 'Need database credentials from DevOps', time: 'Blocked for 2 days' }
        ]
    }
};

// Function to render updates
function renderUpdates(intern = 'all') {
    // Clear existing lists
    completedTasksList.innerHTML = '';
    plannedTasksList.innerHTML = '';
    blockersList.innerHTML = '';

    // Function to create update item HTML
    const createUpdateItem = (update) => `
        <div class="update-item">
            <h5>${update.title}</h5>
            <p>${update.description}</p>
            <div class="update-meta">
                <span><i data-feather="clock"></i> ${update.time}</span>
            </div>
        </div>
    `;

    // Function to render updates for a specific intern
    const renderInternUpdates = (internData) => {
        internData.completed.forEach(update => {
            completedTasksList.innerHTML += createUpdateItem(update);
        });
        internData.planned.forEach(update => {
            plannedTasksList.innerHTML += createUpdateItem(update);
        });
        internData.blockers.forEach(update => {
            blockersList.innerHTML += createUpdateItem(update);
        });
    };

    if (intern === 'all') {
        Object.values(dailyUpdates).forEach(renderInternUpdates);
    } else {
        renderInternUpdates(dailyUpdates[intern]);
    }

    // Re-initialize Feather icons for new content
    feather.replace();
}

// Event listeners for updates
internFilter.addEventListener('change', (e) => renderUpdates(e.target.value));
refreshUpdatesBtn.addEventListener('click', () => {
    // In a real application, this would fetch fresh data from the server
    renderUpdates(internFilter.value);
    showNotification('Updates refreshed successfully', 'success');
});

// Initialize updates on page load
renderUpdates();

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
        <p>${message}</p>
    `;

    // Add to document
    document.body.appendChild(notification);

    // Initialize Feather icon
    feather.replace();

    // Remove after delay
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 