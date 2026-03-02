document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    let talks = [];

    // Fetch talk data
    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.categories.some(category => category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    // Render schedule
    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        talksToRender.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + talk.duration * 60000);

            const talkElement = createTalkElement(talk, startTime, endTime);
            scheduleContainer.appendChild(talkElement);

            currentTime = new Date(endTime.getTime() + 10 * 60000); // 10 minute break

            if (index === 2) { // Lunch break after the 3rd talk
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60000);
                const breakElement = createBreakElement('Lunch Break', lunchStartTime, lunchEndTime);
                scheduleContainer.appendChild(breakElement);
                currentTime = lunchEndTime;
            }
        });
    }

    function createTalkElement(talk, startTime, endTime) {
        const div = document.createElement('div');
        div.classList.add('talk');

        div.innerHTML = `
            <div class="talk-time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
            <div class="talk-title">${talk.title}</div>
            <div class="talk-speakers">${talk.speakers.join(', ')}</div>
            <div class="talk-categories">${talk.categories.map(cat => `<span>${cat}</span>`).join('')}</div>
            <div class="talk-description">${talk.description}</div>
        `;
        return div;
    }

    function createBreakElement(title, startTime, endTime) {
        const div = document.createElement('div');
        div.classList.add('break');
        div.innerHTML = `
            <div class="talk-time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
            <div>${title}</div>
        `;
        return div;
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
