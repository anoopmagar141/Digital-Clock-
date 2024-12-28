let is24HourFormat = true;
let selectedTimeZone = 'local';
let isDarkMode = true;
let alarmTime = null;
let alarmSound = new Audio('assets/sounds/alarm.mp3');

// Stopwatch Variables
let stopwatchInterval = null;
let stopwatchTime = 0;
let stopwatchRecords = [];

// Timer Variables
let timerInterval = null;

// Update Clock
function updateClock() {
    const now = selectedTimeZone === 'local' ? new Date() : new Date(new Date().toLocaleString("en-US", { timeZone: selectedTimeZone }));
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const isPM = hours >= 12;

    if (!is24HourFormat) {
        hours = hours % 12 || 12;
    }
    const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}${!is24HourFormat ? (isPM ? ' PM' : ' AM') : ''}`;
    document.getElementById('time').textContent = timeString;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    document.getElementById('date').textContent = date;

    // Greetings
    const greeting = hours < 12 ? 'Good Morning!' : hours < 18 ? 'Good Afternoon!' : 'Good Evening!';
    document.getElementById('greeting').textContent = greeting;

    // Quotes
    const quotes = [
        "Stay positive, work hard, make it happen.",
        "Walk slowly, but never backward.",
        "The secret of getting ahead is getting started.",
        "Believe you can and you're halfway there."
    ];
    document.getElementById('quote').textContent = quotes[now.getSeconds() % quotes.length];

    // Check Alarm
    if (alarmTime && `${String(hours).padStart(2, '0')}:${minutes}` === alarmTime) {
        alarmSound.play();
        alert('Alarm ringing!');
        alarmTime = null; // Reset alarm after triggering
    }
}

// Toggle 12/24 Hour Format
document.getElementById('toggle-format').addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    updateClock();
    document.getElementById('toggle-format').textContent = is24HourFormat ? 'Switch to 12-Hour' : 'Switch to 24-Hour';
});

// Toggle Light/Dark Mode
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    isDarkMode = !isDarkMode;
    document.getElementById('toggle-theme').textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Set Alarm
document.getElementById('set-alarm').addEventListener('click', () => {
    const alarmInput = document.getElementById('alarm-time').value;
    if (!alarmInput) {
        alert('Please set a valid alarm time.');
        return;
    }
    alarmTime = alarmInput;
    alert(`Alarm set for ${alarmTime}`);
});

// Stopwatch Functions
document.getElementById('start-stopwatch').addEventListener('click', () => {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            displayStopwatchTime();
        }, 1000);
    }
});

document.getElementById('pause-stopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
});

document.getElementById('reset-stopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    if (stopwatchTime > 0) {
        stopwatchRecords.push(formatTime(stopwatchTime));
    }
    stopwatchTime = 0;
    displayStopwatchTime();
    displayStopwatchRecords();
});

function displayStopwatchTime() {
    const minutes = String(Math.floor(stopwatchTime / 60)).padStart(2, '0');
    const seconds = String(stopwatchTime % 60).padStart(2, '0');
    document.getElementById('stopwatch').textContent = `${minutes}:${seconds}`;
}

function displayStopwatchRecords() {
    const recordsContainer = document.getElementById('previous-records');
    recordsContainer.innerHTML = '<h3>Previous Records</h3>';
    stopwatchRecords.forEach((record, index) => {
        const recordElement = document.createElement('p');
        recordElement.textContent = `#${index + 1}: ${record}`;
        recordsContainer.appendChild(recordElement);
    });
}

// Countdown Timer Functions
document.getElementById('start-timer').addEventListener('click', () => {
    const input = document.getElementById('timer-input').value;
    let timeRemaining = parseInt(input, 10);
    if (isNaN(timeRemaining) || timeRemaining <= 0) {
        alert('Please enter a valid number of seconds.');
        return;
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('countdown-timer').textContent = formatTime(timeRemaining);
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alarmSound.play();
            alert('Timer finished!');
        }
    }, 1000);
});

document.getElementById('reset-timer').addEventListener('click', () => {
    clearInterval(timerInterval);
    document.getElementById('countdown-timer').textContent = '00:00';
});

function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Classic Clock
function drawClassicClock() {
    const canvas = document.getElementById('classic-clock');
    const ctx = canvas.getContext('2d');
    const now = new Date();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#444';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw hour numbers
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6 - Math.PI / 2;
        ctx.fillText(
            i,
            centerX + Math.cos(angle) * (radius - 20),
            centerY + Math.sin(angle) * (radius - 20)
        );
    }

    // Hour hand
    const hourAngle = ((now.getHours() % 12) + now.getMinutes() / 60) * (Math.PI / 6) - Math.PI / 2;
    drawHand(ctx, centerX, centerY, hourAngle, radius * 0.5, 8);

    // Minute hand
    const minuteAngle = (now.getMinutes() + now.getSeconds() / 60) * (Math.PI / 30) - Math.PI / 2;
    drawHand(ctx, centerX, centerY, minuteAngle, radius * 0.75, 6);

    // Second hand
    const secondAngle = now.getSeconds() * (Math.PI / 30) - Math.PI / 2;
    drawHand(ctx, centerX, centerY, secondAngle, radius * 0.85, 2, '#f00');

    requestAnimationFrame(drawClassicClock);
}

function drawHand(ctx, x, y, angle, length, width, color = '#fff') {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}

// Initialize
setInterval(updateClock, 1000);
updateClock();
drawClassicClock();
