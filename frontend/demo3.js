// ===== 30-DAY STREAK GRID =====
(function() {
    const grid = document.getElementById('daysGrid');
    const topics = [
        { lang: 'HTML', topic: 'tags & structure', status: 'completed' },
        { lang: 'HTML', topic: 'forms & tables', status: 'completed' },
        { lang: 'CSS', topic: 'selectors & colors', status: 'completed' },
        { lang: 'CSS', topic: 'box model', status: 'completed' },
        { lang: 'CSS', topic: 'flexbox', status: 'completed' },
        { lang: 'JS', topic: 'variables & data', status: 'completed' },
        { lang: 'JS', topic: 'functions', status: 'completed' },
        { lang: 'JS', topic: 'arrays & loops', status: 'completed' },
        { lang: 'JS', topic: 'DOM intro', status: 'completed' },
        { lang: 'JS', topic: 'events', status: 'completed' },
        { lang: 'DB', topic: 'SQL basics', status: 'in-progress' },
        { lang: 'DB', topic: 'CRUD ops', status: 'in-progress' },
        { lang: 'Backend', topic: 'Node.js setup', status: 'locked' },
        { lang: 'Backend', topic: 'express routes', status: 'locked' },
        { lang: 'DB', topic: 'MongoDB intro', status: 'locked' },
        { lang: 'HTML', topic: 'semantic HTML', status: 'completed' },
        { lang: 'CSS', topic: 'grid layout', status: 'completed' },
        { lang: 'JS', topic: 'async JS', status: 'in-progress' },
        { lang: 'JS', topic: 'fetch API', status: 'locked' },
        { lang: 'Backend', topic: 'REST APIs', status: 'locked' },
        { lang: 'DB', topic: 'joins', status: 'locked' },
        { lang: 'HTML', topic: 'canvas', status: 'locked' },
        { lang: 'CSS', topic: 'animations', status: 'locked' },
        { lang: 'JS', topic: 'classes', status: 'locked' },
        { lang: 'Backend', topic: 'auth', status: 'locked' },
        { lang: 'DB', topic: 'indexes', status: 'locked' },
        { lang: 'HTML', topic: 'SVG', status: 'locked' },
        { lang: 'CSS', topic: 'variables', status: 'locked' },
        { lang: 'JS', topic: 'design patterns', status: 'locked' },
        { lang: 'Project', topic: 'fullstack mini', status: 'locked' }
    ];
    
    const iconMap = { 
        'HTML': '<i class="fab fa-html5"></i>', 
        'CSS': '<i class="fab fa-css3-alt"></i>', 
        'JS': '<i class="fab fa-js"></i>', 
        'DB': '<i class="fas fa-database"></i>', 
        'Backend': '<i class="fas fa-server"></i>', 
        'Project': '<i class="fas fa-code-branch"></i>' 
    };

    topics.forEach((item, index) => {
        const day = document.createElement('div');
        day.className = `day-circle ${item.status}`;
        day.setAttribute('data-tooltip', `${item.lang}: ${item.topic}`);
        day.innerHTML = `${index + 1}<span>${item.lang}</span>`;
        grid.appendChild(day);
    });
})();


// ===== 2026 CALENDAR =====
(function() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const grid = document.getElementById('year2026Grid');
    const monthLabel = document.getElementById('currentMonthName');
    let currentMonthIndex = 0;
    let isAnimating = false;

    function populateCalendar(monthIndex) {
        grid.innerHTML = '';
        
        // Add month marker
        const marker = document.createElement('div');
        marker.className = 'month-marker';
        marker.innerHTML = `<i class="fas fa-calendar-alt"></i> ${monthNames[monthIndex]} 2026`;
        grid.appendChild(marker);
        
        // Get first day of month (0 = Monday in our grid)
        // 2026 starts on Thursday (month 0, day 1 is Thursday)
        const firstDay = new Date(2026, monthIndex, 1).getDay();
        const daysInMonth = new Date(2026, monthIndex + 1, 0).getDate();
        
        // Adjust for Monday start (our grid starts Monday)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        
        // Empty cells before first day
        for (let i = 0; i < adjustedFirstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'day-cell';
            empty.style.opacity = '0.3';
            grid.appendChild(empty);
        }
        
        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            cell.className = 'day-cell';
            
            // Random filled days for demo
            if (Math.random() > 0.6) {
                cell.classList.add('filled');
            }
            
            const dayOfWeek = new Date(2026, monthIndex, d).getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                cell.classList.add('weekend');
            }
            
            cell.innerText = d;
            grid.appendChild(cell);
        }
    }

    function renderMonth(monthIndex, direction) {
        if (isAnimating) return;
        
        if (direction) {
            isAnimating = true;
            const oldGrid = grid.cloneNode(true);
            grid.parentNode.appendChild(oldGrid);
            oldGrid.classList.add(direction === 'left' ? 'slide-left' : 'slide-right');
            
            populateCalendar(monthIndex);
            
            setTimeout(() => {
                oldGrid.remove();
                monthLabel.innerText = `${monthNames[monthIndex]} 2026`;
                setTimeout(() => {
                    grid.classList.remove('slide-left');
                    isAnimating = false;
                }, 50);
            }, 400);
        } else {
            populateCalendar(monthIndex);
            monthLabel.innerText = `${monthNames[monthIndex]} 2026`;
            isAnimating = false;
        }
    }

    // Initialize
    renderMonth(0);

    // Navigation buttons
    document.getElementById('prevMonth').onclick = () => {
        if (isAnimating) return;
        currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;
        renderMonth(currentMonthIndex, 'right');
    };

    document.getElementById('nextMonth').onclick = () => {
        if (isAnimating) return;
        currentMonthIndex = (currentMonthIndex + 1) % 12;
        renderMonth(currentMonthIndex, 'left');
    };
})();


// ===== STUDENT PORTAL LOGIC =====
(function() {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    
    function showToast(msg, isSuccess = false) {
        toastMsg.innerText = msg;
        toast.style.background = isSuccess ? '#2f9e5a' : '#d94f4f';
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 2500);
    }

    const loginBtn = document.getElementById('loginBtn');
    const usernameInp = document.getElementById('username');
    const passwordInp = document.getElementById('password');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const user = usernameInp.value.trim();
            const pass = passwordInp.value.trim();
            
            if (user === 'student' && pass === '2026') {
                showToast('✓ login successful (demo)', true);
                const card = document.querySelector('.portal-card');
                if (card) {
                    card.style.boxShadow = '0 0 50px #5fe07e';
                    setTimeout(() => card.style.boxShadow = '', 1000);
                }
            } else {
                showToast('✗ incorrect username or password');
                const card = document.querySelector('.portal-card');
                if (card) {
                    card.classList.add('shake');
                    setTimeout(() => card.classList.remove('shake'), 500);
                }
            }
        });
    }

    // Social login buttons
    const googleLogin = document.getElementById('googleLogin');
    if (googleLogin) {
        googleLogin.addEventListener('click', () => {
            showToast('⚡ continue with Google (demo)', false);
        });
    }
    
    const phoneLogin = document.getElementById('phoneLogin');
    if (phoneLogin) {
        phoneLogin.addEventListener('click', () => {
            showToast('📱 phone login demo', false);
        });
    }
})();