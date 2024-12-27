let is24HourFormat = true;
let selectedTimeZone = 'local';
let isDarkMode = true;

// Clock Functions
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
}

// Alarm Functions
function setAlarm() {
    const alarmTime = document.getElementById('alarm-time').value;
    const alarmStatus = document.getElementById('alarm-status');
    if (!alarmTime) {
        alert('Please set a valid alarm time.');
        return;
    }
    alarmStatus.textContent = `Alarm set for ${alarmTime}`;
    const checkAlarm = setInterval(() => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (alarmTime === currentTime) {
            alert('Alarm ringing!');
            clearInterval(checkAlarm);
            alarmStatus.textContent = '';
        }
    }, 1000);
}

// Key Bindings
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'A':
            document.getElementById('alarm-time').focus();
            break;
        case 'S':
            // Toggle stopwatch
            break;
        case 'T':
            document.getElementById('timer-input').focus();
            break;
        case 'F':
            is24HourFormat = !is24HourFormat;
            updateClock();
            break;
        case 'M':
            document.body.classList.toggle('light-mode');
            break;
    }
});

setInterval(updateClock, 1000);
updateClock();
document.getElementById('set-alarm').addEventListener('click', setAlarm);
