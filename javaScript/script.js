let selectedTimeZone = 'local'; // Default time zone is local
let isDarkMode = true; // Default is dark mode
let alarmTime = null; // Alarm time
let alarmSound = new Audio('assets/sounds/alarm.mp3'); // Alarm sound file
let buttonClickSound = new Audio('assets/sounds/button-click.mp3'); // Button click sound
let timerInterval = null; // Timer interval for countdown timer
let isStopwatchRunning = false; // Flag to check if the stopwatch is running
let isCountdownRunning = false; // Flag to check if the countdown is running

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

// Function to play sound when a button is clicked
function playButtonClickSound() {
    buttonClickSound.play();
}

// Toggle Light/Dark Mode
document.getElementById('toggle-theme').addEventListener('click', () => {
    playButtonClickSound(); // Play sound when button is clicked
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode'); // Ensure dark mode can be toggled
    isDarkMode = !isDarkMode;
    document.getElementById('toggle-theme').textContent = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
});

// Set Alarm
document.getElementById('set-alarm').addEventListener('click', () => {
    playButtonClickSound(); // Play sound when button is clicked

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
    if (alarmTime) {
        const [alarmHour, alarmMinuteWithPeriod] = alarmTime.split(':'); // Split time into hour and minute+AM/PM
        const alarmMinute = alarmMinuteWithPeriod.slice(0, 2); // Minute part
        const alarmPeriod = alarmMinuteWithPeriod.slice(3); // AM/PM part

        let alarmTimeHour = parseInt(alarmHour, 10);
        if (alarmPeriod === 'PM' && alarmTimeHour !== 12) {
            alarmTimeHour += 12; // Convert PM time into 24-hour format
        } else if (alarmPeriod === 'AM' && alarmTimeHour === 12) {
            alarmTimeHour = 0; // Convert 12 AM to 0 hour
        }

        // Check if the current time matches the alarm time (hours, minutes, and seconds)
        if (now.getHours() === alarmTimeHour && now.getMinutes() === parseInt(alarmMinute, 10) && now.getSeconds() === 0) {
            alarmSound.play();
            alert('Alarm ringing!');
            alarmTime = null; // Reset alarm after it rings
        }
    }
}

// Stopwatch Functions
let stopwatchInterval = null;
let stopwatchTime = 0;

document.getElementById('start-stopwatch').addEventListener('click', () => {
    playButtonClickSound(); // Play sound when button is clicked
    if (!stopwatchInterval) {
        isStopwatchRunning = true; // Set flag to true
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            displayStopwatchTime();
        }, 1000);
    }
});

document.getElementById('pause-stopwatch').addEventListener('click', () => {
    playButtonClickSound(); // Play sound when button is clicked
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    isStopwatchRunning = false; // Set flag to false
});

document.getElementById('reset-stopwatch').addEventListener('click', () => {
    playButtonClickSound(); // Play sound when button is clicked
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchTime = 0;
    isStopwatchRunning = false; // Set flag to false
    displayStopwatchTime();
});

function displayStopwatchTime() {
    const minutes = String(Math.floor(stopwatchTime / 60)).padStart(2, '0');
    const seconds = String(stopwatchTime % 60).padStart(2, '0');
    document.getElementById('stopwatch').textContent = `${minutes}:${seconds}`;
}

// Countdown Timer Functions
document.getElementById('start-timer').addEventListener('click', () => {
    playButtonClickSound(); // Play sound when button is clicked
    const input = document.getElementById('timer-input').value;
    let timeRemaining = parseInt(input, 10);
    if (isNaN(timeRemaining) || timeRemaining <= 0) {
        alert('Please enter a valid number of seconds.');
        return;
    }

    isCountdownRunning = true; // Set flag to true
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('countdown-timer').textContent = formatTime(timeRemaining);
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            alarmSound.play();
            alert('Timer finished!');
            isCountdownRunning = false; // Reset flag after timer finishes
        }
    }, 1000);
});

document.getElementById('reset-timer').addEventListener('click', () => {
    playButtonClickSound(); // Play sound when button is clicked
    clearInterval(timerInterval);
    document.getElementById('countdown-timer').textContent = '00:00';
    isCountdownRunning = false; // Set flag to false
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
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
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
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.restore();

    // Second hand
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((Math.PI * 2) * (second / 60));
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
    ctx.restore();
}

// Start Clock Update
setInterval(updateClock, 1000);
setInterval(drawClassicClock, 1000);
