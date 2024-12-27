let is24HourFormat = true;
let selectedTimeZone = 'local';
let isDarkMode = true;
let alarmTime = null; // Store the alarm time
let alarmSound = new Audio('assets/sounds/alarm.mp3'); // Path to your alarm sound

// Update Clock
function updateClock() {
    const now = selectedTimeZone === 'local' ? new Date() : new Date(new Date().toLocaleString("en-US", { timeZone: selectedTimeZone }));
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const isPM = hours >= 12;

    if (!is24HourFormat) {
        hours = hours % 12 || 12; // Convert to 12-hour format
    }
    const timeString = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}${!is24HourFormat ? (isPM ? ' PM' : ' AM') : ''}`;
    document.getElementById('time').textContent = timeString;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    document.getElementById('date').textContent = date;

    // Check if alarm time matches current time
    if (alarmTime && `${String(hours).padStart(2, '0')}:${minutes}` === alarmTime) {
        alarmSound.play(); // Play the alarm sound
        alert('Alarm ringing!');
        alarmTime = null; // Reset the alarm after it triggers
    }
}

// Toggle 12/24 Hour Format
document.getElementById('toggle-format').addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    updateClock();
    document.getElementById('toggle-format').textContent = is24HourFormat ? 'Switch to 12-Hour' : 'Switch to 24-Hour';
});

// Toggle Dark/Light Mode
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    isDarkMode = !isDarkMode;
    document.getElementById('toggle-theme').textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Time Zone Change
document.getElementById('time-zone').addEventListener('change', (e) => {
    selectedTimeZone = e.target.value;
    updateClock();
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

// Stopwatch
let stopwatchInterval;
let stopwatchTime = 0;

document.getElementById('start-stopwatch').addEventListener('click', () => {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    } else {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            const minutes = String(Math.floor(stopwatchTime / 60)).padStart(2, '0');
            const seconds = String(stopwatchTime % 60).padStart(2, '0');
            document.getElementById('stopwatch').textContent = `${minutes}:${seconds}`;
        }, 1000);
    }
});

document.getElementById('reset-stopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchTime = 0;
    document.getElementById('stopwatch').textContent = '00:00:00';
});

// Countdown Timer
let timerInterval;
document.getElementById('start-timer').addEventListener('click', () => {
    const input = document.getElementById('timer-input').value;
    let timeRemaining = parseInt(input, 10);
    if (isNaN(timeRemaining) || timeRemaining <= 0) {
        alert('Please enter a valid number of seconds.');
        return;
    }

    document.getElementById('countdown-timer').textContent = formatTime(timeRemaining);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alarmSound.play(); // Play sound when timer finishes
            alert('Timer finished!');
        }
        document.getElementById('countdown-timer').textContent = formatTime(timeRemaining);
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

// Update clock every second
setInterval(updateClock, 1000);
updateClock();
