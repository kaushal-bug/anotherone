// Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeModals();
    initializeTaskManagement();
    initializeGoalsManagement();
    initializeMeetingsManagement();
});

// Modal Management
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeButtons = document.querySelectorAll('.close-btn, [data-dismiss="modal"]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Task Management
function initializeTaskManagement() {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addTaskForm = document.getElementById('addTaskForm');
    const taskColumns = {
        todo: document.getElementById('todoTasks'),
        inProgress: document.getElementById('inProgressTasks'),
        done: document.getElementById('doneTasks')
    };

    // Load tasks from storage
    loadTasks();

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            const modal = document.getElementById('addTaskModal');
            modal.style.display = 'flex';
        });
    }

    if (addTaskForm) {
        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const taskData = {
                id: Date.now(),
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                project: document.getElementById('taskProject').value,
                priority: document.getElementById('taskPriority').value,
                deadline: document.getElementById('taskDeadline').value,
                status: 'todo',
                assignedTo: googleAuth.getCurrentUser()?.email,
                createdAt: new Date().toISOString()
            };

            addTask(taskData);
            saveTasks();
            document.getElementById('addTaskModal').style.display = 'none';
            addTaskForm.reset();
        });
    }

    // Initialize drag and drop
    Object.values(taskColumns).forEach(column => {
        if (column) {
            column.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    const afterElement = getDragAfterElement(column, e.clientY);
                    if (afterElement) {
                        column.insertBefore(draggable, afterElement);
                    } else {
                        column.appendChild(draggable);
                    }
                }
            });

            column.addEventListener('drop', (e) => {
                e.preventDefault();
                const taskCard = document.querySelector('.dragging');
                if (taskCard) {
                    const newStatus = column.id.replace('Tasks', '');
                    updateTaskStatus(taskCard, newStatus);
                    saveTasks();
                }
            });
        }
    });
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentUser = googleAuth.getCurrentUser();
    
    // Clear existing tasks
    document.getElementById('todoTasks').innerHTML = '';
    document.getElementById('inProgressTasks').innerHTML = '';
    document.getElementById('doneTasks').innerHTML = '';

    // Filter and display tasks
    tasks.filter(task => task.assignedTo === currentUser?.email)
         .forEach(task => addTask(task));
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-card').forEach(card => {
        const task = {
            id: card.dataset.id,
            title: card.querySelector('h4').textContent,
            description: card.querySelector('p').textContent,
            project: card.querySelector('.task-project').textContent,
            priority: card.classList.contains('priority-high') ? 'high' : 
                     card.classList.contains('priority-medium') ? 'medium' : 'low',
            deadline: card.querySelector('.task-deadline').textContent,
            status: card.parentElement.id.replace('Tasks', ''),
            assignedTo: googleAuth.getCurrentUser()?.email
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(taskData) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card priority-${taskData.priority}`;
    taskCard.draggable = true;
    taskCard.dataset.id = taskData.id;
    taskCard.innerHTML = `
        <div class="task-header">
            <h4>${taskData.title}</h4>
            <span class="task-priority">${taskData.priority}</span>
        </div>
        <p>${taskData.description}</p>
        <div class="task-meta">
            <span class="task-project">${taskData.project}</span>
            <span class="task-deadline">${taskData.deadline}</span>
        </div>
        <div class="task-actions">
            <button class="btn secondary-btn btn-sm" onclick="requestFeedback(this)">
                <i data-feather="message-square"></i> Feedback
            </button>
            <button class="btn primary-btn btn-sm" onclick="markAsDone(this)">
                <i data-feather="check"></i> Done
            </button>
        </div>
    `;

    const column = document.getElementById(`${taskData.status}Tasks`);
    if (column) {
        column.appendChild(taskCard);
        feather.replace();
    }

    // Add drag events
    taskCard.addEventListener('dragstart', () => {
        taskCard.classList.add('dragging');
    });

    taskCard.addEventListener('dragend', () => {
        taskCard.classList.remove('dragging');
    });
}

function updateTaskStatus(taskCard, newStatus) {
    const taskId = taskCard.dataset.id;
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Goals Management
function initializeGoalsManagement() {
    const addGoalBtn = document.getElementById('addGoalBtn');
    const addGoalForm = document.getElementById('addGoalForm');

    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => {
            const modal = document.getElementById('addGoalModal');
            modal.style.display = 'flex';
        });
    }

    if (addGoalForm) {
        addGoalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goalData = {
                title: document.getElementById('goalTitle').value,
                category: document.getElementById('goalCategory').value,
                mentor: document.getElementById('goalMentor').value,
                deadline: document.getElementById('goalDeadline').value,
                description: document.getElementById('goalDescription').value
            };

            addGoal(goalData);
            document.getElementById('addGoalModal').style.display = 'none';
            addGoalForm.reset();
        });
    }

    // Enable reflection notes on Fridays
    const today = new Date();
    if (today.getDay() === 5) { // Friday
        const reflectionNotes = document.querySelectorAll('.reflection-notes');
        reflectionNotes.forEach(notes => {
            notes.disabled = false;
        });
    }
}

function addGoal(goalData) {
    const goalCard = document.createElement('div');
    goalCard.className = 'goal-card';
    goalCard.innerHTML = `
        <div class="goal-header">
            <h4>${goalData.title}</h4>
            <span class="goal-category">${goalData.category}</span>
        </div>
        <p>${goalData.description}</p>
        <div class="goal-meta">
            <span class="goal-mentor">Mentor: ${goalData.mentor}</span>
            <span class="goal-deadline">Due: ${goalData.deadline}</span>
        </div>
        <div class="goal-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span class="progress-text">0%</span>
        </div>
        <div class="reflection-notes-container">
            <textarea class="reflection-notes" placeholder="Weekly reflection notes..." disabled></textarea>
        </div>
    `;

    const goalsList = document.querySelector('.goals-list');
    if (goalsList) {
        goalsList.appendChild(goalCard);
    }
}

// Meetings Management
async function initializeMeetingsManagement() {
    const connectGoogleBtn = document.getElementById('connectGoogleBtn');
    const requestMeetingBtn = document.getElementById('requestMeetingBtn');
    const requestMeetingForm = document.getElementById('requestMeetingForm');
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');

    if (connectGoogleBtn) {
        connectGoogleBtn.addEventListener('click', handleGoogleAuth);
    }

    if (requestMeetingBtn) {
        requestMeetingBtn.addEventListener('click', () => {
            const modal = document.getElementById('requestMeetingModal');
            modal.style.display = 'flex';
        });
    }

    if (requestMeetingForm) {
        requestMeetingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const meetingData = {
                title: document.getElementById('meetingTitle').value,
                date: document.getElementById('meetingDate').value,
                time: document.getElementById('meetingTime').value,
                agenda: document.getElementById('meetingAgenda').value,
                participants: Array.from(document.getElementById('meetingParticipants').selectedOptions).map(option => option.value)
            };

            await requestMeeting(meetingData);
            document.getElementById('requestMeetingModal').style.display = 'none';
            requestMeetingForm.reset();
        });
    }

    if (prevWeekBtn && nextWeekBtn) {
        prevWeekBtn.addEventListener('click', () => navigateCalendar('prev'));
        nextWeekBtn.addEventListener('click', () => navigateCalendar('next'));
    }

    // Initialize calendar with tasks and deadlines
    await updateCalendarDisplay();
}

async function updateCalendarDisplay() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;

    try {
        // Get tasks and deadlines
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const currentUser = googleAuth.getCurrentUser();
        const userTasks = tasks.filter(task => task.assignedTo === currentUser?.email);

        // Clear existing events
        calendarGrid.innerHTML = '';

        // Add calendar header
        const daysHeader = document.createElement('div');
        daysHeader.className = 'calendar-header';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-header';
            dayCell.textContent = day;
            daysHeader.appendChild(dayCell);
        });
        calendarGrid.appendChild(daysHeader);

        // Create calendar grid
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

        let currentDate = new Date(startDate);
        let currentWeek = document.createElement('div');
        currentWeek.className = 'calendar-week';

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startDate.getDay(); i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            currentWeek.appendChild(emptyCell);
        }

        while (currentDate <= endDate) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            // Add date number
            const dateNumber = document.createElement('div');
            dateNumber.className = 'date-number';
            dateNumber.textContent = currentDate.getDate();
            dayCell.appendChild(dateNumber);

            // Add tasks for this day
            const dayTasks = userTasks.filter(task => {
                const taskDate = new Date(task.deadline);
                return taskDate.toDateString() === currentDate.toDateString();
            });

            if (dayTasks.length > 0) {
                const tasksList = document.createElement('div');
                tasksList.className = 'day-tasks';
                dayTasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.className = `task-item priority-${task.priority}`;
                    taskItem.textContent = task.title;
                    tasksList.appendChild(taskItem);
                });
                dayCell.appendChild(tasksList);
            }

            currentWeek.appendChild(dayCell);

            // Start new week
            if (currentDate.getDay() === 6) {
                calendarGrid.appendChild(currentWeek);
                currentWeek = document.createElement('div');
                currentWeek.className = 'calendar-week';
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Add remaining empty cells
        if (currentDate.getDay() !== 0) {
            for (let i = currentDate.getDay(); i < 7; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day empty';
                currentWeek.appendChild(emptyCell);
            }
            calendarGrid.appendChild(currentWeek);
        }

    } catch (error) {
        console.error('Error updating calendar:', error);
        showNotification('Error loading calendar data', 'error');
    }
}

function requestMeeting(meetingData) {
    // Here you would typically send the meeting request to your backend
    console.log('Meeting requested:', meetingData);
    showNotification('Meeting request sent successfully!', 'success');
}

function navigateCalendar(direction) {
    const currentWeekElement = document.getElementById('currentWeek');
    const currentDate = new Date(currentWeekElement.getAttribute('data-date') || Date.now());
    
    if (direction === 'prev') {
        currentDate.setDate(currentDate.getDate() - 7);
    } else {
        currentDate.setDate(currentDate.getDate() + 7);
    }

    currentWeekElement.setAttribute('data-date', currentDate.toISOString());
    currentWeekElement.textContent = `Week of ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    
    updateCalendarDisplay();
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i data-feather="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}"></i>
        <p>${message}</p>
    `;
    
    document.body.appendChild(notification);
    feather.replace();
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 