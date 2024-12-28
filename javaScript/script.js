let is24HourFormat = true;
let selectedTimeZone = 'local';
let isDarkMode = true;
let alarmTime = null; // Store the alarm time
let alarmSound = new Audio('assets/sounds/alarm.mp3'); // Replace with your alarm sound path
let stopwatchInterval = null;
let stopwatchTime = 0;
let timerInterval = null;
let previousRecords = [];
let quotes = [
    "Walk slowly but never backward.",
    "The best time to start was yesterday. The next best time is now.",
    "Dream big and dare to fail.",
    "Success is not final; failure is not fatal: It is the courage to continue that counts."
];

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

    // Greeting based on time
    const greeting = now.getHours() < 12 ? 'Good Morning!' : now.getHours() < 18 ? 'Good Afternoon!' : 'Good Evening!';
    document.getElementById('greeting').textContent = greeting;

    // Check alarm
    if (alarmTime && `${String(hours).padStart(2, '0')}:${minutes}` === alarmTime) {
        alarmSound.play();
        alert('Alarm ringing!');
        alarmTime = null; // Reset alarm
    }
}

// Set Random Quote
function updateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = `"${quotes[randomIndex]}"`;
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
    document.getElementById('alarm-status').textContent = `Alarm set for ${alarmTime}`;
});

// Stopwatch Functionality
document.getElementById('start-stopwatch').addEventListener('click', () => {
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        previousRecords.push(formatTime(stopwatchTime));
        displayPreviousRecords();
    } else {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            document.getElementById('stopwatch').textContent = formatTime(stopwatchTime);
        }, 1000);
    }
});

document.getElementById('reset-stopwatch').addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchTime = 0;
    document.getElementById('stopwatch').textContent = '00:00:00';
});

// Display Previous Stopwatch Records
function displayPreviousRecords() {
    const recordList = document.getElementById('previous-records');
    recordList.innerHTML = previousRecords.map((record, index) => `<p>${index + 1}. ${record}</p>`).join('');
}

// Countdown Timer
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

// Utility: Format Time
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Mini Clock
function updateMiniClock() {
    const now = new Date();
    const miniClock = document.getElementById('mini-clock');
    if (miniClock) {
        miniClock.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
}

// Initialize
setInterval(updateClock, 1000);
setInterval(updateMiniClock, 1000);
updateClock();
updateQuote();
