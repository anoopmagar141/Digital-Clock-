let selectedTimeZone = 'local'; // Default time zone is local
let isDarkMode = true; // Default is dark mode
let alarmTime = null; // Alarm time
let alarmSound = new Audio('assets/sounds/alarm.mp3'); // Alarm sound file
let timerInterval = null; // Timer interval for countdown timer

// Update Clock
function updateClock() {
    const now = selectedTimeZone === 'local' ? new Date() : new Date(new Date().toLocaleString("en-US", { timeZone: selectedTimeZone }));
    let hours = now.getHours(); // Get the time in 24-hour format
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const isPM = hours >= 12;

    // Always convert to 12-hour format
    const displayHours = hours % 12 || 12; // If hours are 0 (midnight), it should display 12
    
    // Format time in 12-hour
    const timeString = `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds}${isPM ? ' PM' : ' AM'}`;
    document.getElementById('time').textContent = timeString;

    // Format date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    document.getElementById('date').textContent = date;

    // Update Greeting based on 12-hour clock
    let greeting = '';
    if (hours < 12) {
        greeting = 'Good Morning!';
    } else if (hours < 17) {
        greeting = 'Good Afternoon!';
    } else {
        greeting = 'Good Evening!';
    }

    // Set the greeting text
    document.getElementById('greeting').textContent = greeting;

    // Update Quote every 2 seconds
    const quotes = [
        "Stay positive, work hard, make it happen.",
        "Walk slowly, but never backward.",
        "The secret of getting ahead is getting started.",
        "Believe you can and you're halfway there."
    ];
    document.getElementById('quote').textContent = quotes[Math.floor(now.getSeconds() / 2) % quotes.length];

    // Check for Alarm
    checkAlarm(now);
}

// Toggle Light/Dark Mode
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode'); // Ensure dark mode can be toggled
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

// Check if the current time matches the alarm time
function checkAlarm(now) {
    if (alarmTime && now.getHours() === parseInt(alarmTime.split(':')[0]) && now.getMinutes() === parseInt(alarmTime.split(':')[1])) {
        alarmSound.play();
        alert('Alarm ringing!');
        alarmTime = null; // Reset alarm after it rings
    }
}

// Stopwatch Functions
let stopwatchInterval = null;
let stopwatchTime = 0;

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
    stopwatchTime = 0;
    displayStopwatchTime();
});

function displayStopwatchTime() {
    const minutes = String(Math.floor(stopwatchTime / 60)).padStart(2, '0');
    const seconds = String(stopwatchTime % 60).padStart(2, '0');
    document.getElementById('stopwatch').textContent = `${minutes}:${seconds}`;
}

// Countdown Timer Functions
document.getElementById('start-timer').addEventListener('click', () => {
    const input = document.getElementById('timer-input').value;
    let timeRemaining = parseInt(input, 10);
    if (isNaN(timeRemaining) || timeRemaining <= 0) {
        alert('Please enter a valid number of seconds.');
        return;
    }

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

// Format the time for countdown timer
function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Classic Clock Drawing
function drawClassicClock() {
    const canvas = document.getElementById('classic-clock');
    const ctx = canvas.getContext('2d');
    const now = new Date();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 90;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw clock hands
    const hour = now.getHours() % 12;
    const minute = now.getMinutes();
    const second = now.getSeconds();

    // Hour hand
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((Math.PI * 2) * (hour / 12));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius / 2);
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();

    // Minute hand
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((Math.PI * 2) * (minute / 60));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.8);
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();

    // Second hand
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((Math.PI * 2) * (second / 60));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius * 0.9);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// Update clock every second
setInterval(() => {
    updateClock();
    drawClassicClock();
}, 1000);

// Change Time Zone
function changeTimeZone(timeZone) {
    selectedTimeZone = timeZone;
    updateClock(); // Update clock when time zone changes
}

document.getElementById('time-zone-select').addEventListener('change', (event) => {
    changeTimeZone(event.target.value);
});
