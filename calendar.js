// Calendar data and UI management
const calendarData = {
    tasks: [
        {
            id: 1,
            title: 'Frontend Implementation',
            type: 'ongoing',
            startDate: '2024-06-01',
            endDate: '2024-06-15',
            assignedTo: ['Amit Mishra', 'Romir Shetty']
        },
        {
            id: 2,
            title: 'Backend API Development',
            type: 'ongoing',
            startDate: '2024-06-10',
            endDate: '2024-06-30',
            assignedTo: ['Sajjad Ahmed Khan', 'Nikhil Khemani']
        },
        {
            id: 3,
            title: 'UI Design Review',
            type: 'due',
            dueDate: '2024-06-20',
            assignedTo: ['Ananya Purwar']
        },
        // Add more sample tasks here
    ],
    meetings: []  // Will be populated from Google Calendar
};

// Initialize calendar view
function initializeCalendar() {
    const calendarContainer = document.querySelector('.calendar-container');
    const months = generateMonthsData();
    renderCalendar(months);
    attachCalendarListeners();
}

// Generate months data from current date to August 1st
function generateMonthsData() {
    const months = [];
    const startDate = new Date();
    const endDate = new Date(2024, 7, 1); // August 1st, 2024

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
        const month = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
            weeks: generateWeeksForMonth(currentDate)
        };
        months.push(month);
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return months;
}

// Generate weeks for a given month
function generateWeeksForMonth(date) {
    const weeks = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    let currentWeek = [];
    let currentDate = new Date(firstDay);

    // Add empty days for the first week
    for (let i = 0; i < firstDay.getDay(); i++) {
        currentWeek.push(null);
    }

    while (currentDate <= lastDay) {
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill the last week with empty days
    while (currentWeek.length < 7) {
        currentWeek.push(null);
    }
    weeks.push(currentWeek);

    return weeks;
}

// Render calendar UI
function renderCalendar(months) {
    const calendarGrid = document.querySelector('.calendar-grid');
    calendarGrid.innerHTML = '';

    months.forEach(month => {
        const monthElement = createMonthElement(month);
        calendarGrid.appendChild(monthElement);
    });
}

// Create month element
function createMonthElement(month) {
    const monthElement = document.createElement('div');
    monthElement.className = 'month-container';
    
    const monthHeader = document.createElement('div');
    monthHeader.className = 'month-header';
    monthHeader.textContent = new Date(month.year, month.month).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const weekdaysHeader = createWeekdaysHeader();
    const weeksContainer = createWeeksContainer(month.weeks);
    
    monthElement.appendChild(monthHeader);
    monthElement.appendChild(weekdaysHeader);
    monthElement.appendChild(weeksContainer);
    
    return monthElement;
}

// Create weekdays header
function createWeekdaysHeader() {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const header = document.createElement('div');
    header.className = 'weekdays-header';
    
    weekdays.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'weekday';
        dayElement.textContent = day;
        header.appendChild(dayElement);
    });
    
    return header;
}

// Create weeks container
function createWeeksContainer(weeks) {
    const container = document.createElement('div');
    container.className = 'weeks-container';
    
    weeks.forEach(week => {
        const weekElement = document.createElement('div');
        weekElement.className = 'week';
        
        week.forEach(day => {
            const dayElement = createDayElement(day);
            weekElement.appendChild(dayElement);
        });
        
        container.appendChild(weekElement);
    });
    
    return container;
}

// Create day element
function createDayElement(date) {
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    
    if (date) {
        dayElement.dataset.date = date.toISOString().split('T')[0];
        dayElement.innerHTML = `
            <div class="day-header">
                <span class="day-number">${date.getDate()}</span>
            </div>
            <div class="day-content">
                ${getTasksForDate(date)}
            </div>
        `;
        
        if (isToday(date)) {
            dayElement.classList.add('today');
        }
    } else {
        dayElement.classList.add('empty');
    }
    
    return dayElement;
}

// Get tasks for a specific date
function getTasksForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = calendarData.tasks.filter(task => {
        if (task.type === 'due') {
            return task.dueDate === dateStr;
        } else {
            return dateStr >= task.startDate && dateStr <= task.endDate;
        }
    });
    
    const meetings = calendarData.meetings.filter(meeting => {
        const meetingDate = new Date(meeting.start.dateTime || meeting.start.date).toISOString().split('T')[0];
        return meetingDate === dateStr;
    });
    
    return [...dayTasks, ...meetings].map(item => `
        <div class="calendar-item ${item.type || 'meeting'}">
            <span class="item-title">${item.title || item.summary}</span>
            ${item.assignedTo ? `<span class="item-assignees">${item.assignedTo.join(', ')}</span>` : ''}
        </div>
    `).join('');
}

// Check if date is today
function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Update calendar with Google Calendar events
function updateCalendarUI(events) {
    calendarData.meetings = events;
    renderCalendar(generateMonthsData());
}

// Attach calendar event listeners
function attachCalendarListeners() {
    const container = document.querySelector('.calendar-container');
    let isScrolling = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isScrolling = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isScrolling = false;
    });

    container.addEventListener('mouseup', () => {
        isScrolling = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
    });
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCalendar); 