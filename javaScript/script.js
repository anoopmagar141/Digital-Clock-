// Default time zone is local
let selectedTimeZone = 'local';
let isDarkMode = true; // Default is dark mode
let alarmTime = null; // Alarm time
let alarmSound = new Audio('assets/sounds/alarm.mp3'); // Alarm sound file
let buttonClickSound = new Audio('assets/sounds/button-click.mp3'); // Button click sound
let timerInterval = null; // Timer interval for countdown timer

// Update Clock
function updateClock() {
    const now = selectedTimeZone === 'local' ? new Date() : new Date(new Date().toLocaleString("en-US", { timeZone: selectedTimeZone }));
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const isPM = hours >= 12;

    const displayHours = hours % 12 || 12;

    const timeString = `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds}${isPM ? ' PM' : ' AM'}`;
    document.getElementById('time').textContent = timeString;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    document.getElementById('date').textContent = date;

    let greeting = '';
    if (hours < 12) {
        greeting = 'Good Morning!';
    } else if (hours < 17) {
        greeting = 'Good Afternoon!';
    } else {
        greeting = 'Good Evening!';
    }
    document.getElementById('greeting').textContent = greeting;

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

// Listen to timezone change
document.getElementById('time-zone-select').addEventListener('change', (e) => {
    selectedTimeZone = e.target.value;  // Update the selected time zone
    updateClock();  // Refresh the clock with the updated time zone
});

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
        const [alarmHour, alarmMinuteWithPeriod] = alarmTime.split(':');
        const alarmMinute = alarmMinuteWithPeriod.slice(0, 2);
        const alarmPeriod = alarmMinuteWithPeriod.slice(3);

        let alarmTimeHour = parseInt(alarmHour, 10);
        if (alarmPeriod === 'PM' && alarmTimeHour !== 12) {
            alarmTimeHour += 12;
        } else if (alarmPeriod === 'AM' && alarmTimeHour === 12) {
            alarmTimeHour = 0;
        }

        if (now.getHours() === alarmTimeHour && now.getMinutes() === parseInt(alarmMinute, 10) && now.getSeconds() === 0) {
            alarmSound.play();
            alert('Alarm ringing!');
            alarmTime = null;
        }
    }
}

// Classic Clock Drawing (optional, if you want to draw the clock face)
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

// Initial clock update
updateClock();
setInterval(updateClock, 1000);
setInterval(drawClassicClock, 1000);
