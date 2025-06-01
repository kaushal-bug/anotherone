// Check authentication
function checkAuth() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (!user.username || user.type !== 'intern') {
        window.location.href = 'login.html';
    }
    return user;
}

const user = checkAuth();

// Update user name in header
document.getElementById('userName').textContent = user.name;

// Sample data (in a real app, this would come from a server)
const data = {
    team: [
        { name: 'John Doe', role: 'UI/UX Designer' },
        { name: 'Jane Smith', role: 'Frontend Developer' },
        { name: 'Mike Johnson', role: 'Backend Developer' },
        { name: user.name, role: 'Intern' }
    ],
    tasks: [
        { 
            id: 1, 
            title: 'Design Homepage', 
            status: 'in-progress', 
            dueDate: '2024-02-15',
            priority: 'high'
        },
        { 
            id: 2, 
            title: 'Implement Login Page', 
            status: 'completed', 
            dueDate: '2024-02-10',
            priority: 'medium'
        },
        { 
            id: 3, 
            title: 'Write Documentation', 
            status: 'pending', 
            dueDate: '2024-02-20',
            priority: 'low'
        }
    ],
    messages: []
};

// Render team members
function renderTeam() {
    const teamGrid = document.getElementById('teamMembers');
    teamGrid.innerHTML = data.team.map(member => `
        <div class="team-member">
            <h3>${member.name}</h3>
            <p>${member.role}</p>
        </div>
    `).join('');
}

// Render tasks
function renderTasks(filter = 'all') {
    const tasksList = document.getElementById('tasksList');
    const filteredTasks = filter === 'all' 
        ? data.tasks 
        : data.tasks.filter(task => task.status === filter);

    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-card priority-${task.priority}">
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div class="task-status ${task.status}">${task.status}</div>
        </div>
    `).join('');
}

// Update KPIs
function updateKPIs() {
    document.getElementById('tasksCompleted').textContent = 
        data.tasks.filter(t => t.status === 'completed').length;
    
    document.getElementById('tasksInProgress').textContent = 
        data.tasks.filter(t => t.status === 'in-progress').length;
    
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
    const deadlinesMet = Math.round((completedTasks / totalTasks) * 100);
    document.getElementById('deadlinesMet').textContent = `${deadlinesMet}%`;
}

// Handle message form submission
document.getElementById('messageForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = {
        id: Date.now(),
        content: e.target.querySelector('textarea').value,
        sender: user.name,
        timestamp: new Date().toISOString()
    };
    
    data.messages.push(message);
    // In a real app, this would be sent to a server
    e.target.reset();
    alert('Message sent to manager');
});

// Google Meet integration
function startMeeting() {
    const meetingId = Math.random().toString(36).substring(7);
    const meetUrl = `https://meet.google.com/${meetingId}`;
    window.open(meetUrl, '_blank');
}

function scheduleMeeting() {
    const calendarUrl = 'https://calendar.google.com/calendar/u/0/r/eventedit';
    window.open(calendarUrl, '_blank');
}

// Task filter handling
document.getElementById('taskStatusFilter').addEventListener('change', (e) => {
    renderTasks(e.target.value);
});

// Logout functionality
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize dashboard
renderTeam();
renderTasks();
updateKPIs(); 