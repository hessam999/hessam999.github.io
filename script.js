// Function to calculate the Julian Date
function getJulianDate(date) {
    return date / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5;
}

// Function to calculate the moon's age in hours
function getMoonAge(date) {
    const jd = getJulianDate(date);
    const newMoonJd = 2451549.5; // Julian Date of a known new moon (e.g., January 6, 2000)
    const moonCycle = 29.530588853; // Length of a lunar cycle in days
    const phase = (jd - newMoonJd) / moonCycle;
    const moonAge = (phase - Math.floor(phase)) * moonCycle * 24; // Convert to hours
    return moonAge;
}

// Function to calculate the sun's altitude at a given time
function getSunAltitude(date, latitude, longitude) {
    const jd = getJulianDate(date);
    const n = jd - 2451545.0;
    const L = (280.46 + 0.9856474 * n) % 360;
    const g = (357.528 + 0.9856003 * n) % 360;
    const lambda = L + 1.915 * Math.sin((g * Math.PI) / 180) + 0.02 * Math.sin((2 * g * Math.PI) / 180);
    const epsilon = 23.439 - 0.0000004 * n;
    const alpha = (Math.atan2(Math.cos((epsilon * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180), Math.cos((lambda * Math.PI) / 180))) * 180 / Math.PI;
    const delta = (Math.asin(Math.sin((epsilon * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180))) * 180 / Math.PI;
    const H = (15 * (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 - 12) + longitude - alpha) % 360;
    const altitude = (Math.asin(Math.sin((latitude * Math.PI) / 180) * Math.sin((delta * Math.PI) / 180) + Math.cos((latitude * Math.PI) / 180) * Math.cos((delta * Math.PI) / 180) * Math.cos((H * Math.PI) / 180))) * 180 / Math.PI;
    return altitude;
}

// Function to calculate the moon's altitude at a given time
function getMoonAltitude(date, latitude, longitude) {
    // Simplified calculation for demonstration purposes
    // In a real-world scenario, use a more accurate algorithm or API
    const jd = getJulianDate(date);
    const n = jd - 2451545.0;
    const L = (218.316 + 13.176396 * n) % 360;
    const M = (134.963 + 13.064993 * n) % 360;
    const F = (93.272 + 13.229350 * n) % 360;
    const lambda = L + 6.289 * Math.sin((M * Math.PI) / 180);
    const beta = 5.128 * Math.sin((F * Math.PI) / 180);
    const delta = (Math.asin(Math.sin((beta * Math.PI) / 180) * Math.sin((23.439 * Math.PI) / 180) + Math.cos((beta * Math.PI) / 180) * Math.cos((23.439 * Math.PI) / 180) * Math.sin((lambda * Math.PI) / 180))) * 180 / Math.PI;
    const H = (15 * (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 - 12) + longitude - (L + 180)) % 360;
    const altitude = (Math.asin(Math.sin((latitude * Math.PI) / 180) * Math.sin((delta * Math.PI) / 180) + Math.cos((latitude * Math.PI) / 180) * Math.cos((delta * Math.PI) / 180) * Math.cos((H * Math.PI) / 180))) * 180 / Math.PI;
    return altitude;
}

// Function to calculate the elongation (angular separation) between the sun and the moon
function getElongation(date, latitude, longitude) {
    const sunAltitude = getSunAltitude(date, latitude, longitude);
    const moonAltitude = getMoonAltitude(date, latitude, longitude);
    return Math.abs(moonAltitude - sunAltitude);
}

// Function to check moon visibility based on Mohammad Odeh's algorithm
function checkMoonVisibility(latitude, longitude, date = new Date()) {
    const moonAge = getMoonAge(date);
    const moonAltitude = getMoonAltitude(date, latitude, longitude);
    const elongation = getElongation(date, latitude, longitude);

    // Mohammad Odeh's criteria
    const isMoonOldEnough = moonAge >= 15; // Moon age >= 15 hours
    const isMoonHighEnough = moonAltitude >= 5; // Moon altitude >= 5 degrees
    const isElongationSufficient = elongation >= 8; // Elongation >= 8 degrees

    console.log("moonAge:"+moonAge+" - moonAltitude:"+moonAltitude+" - elongation:"+elongation);
    return isMoonOldEnough && isMoonHighEnough && isElongationSufficient;
}

// Function to format a Date object into the required string format
function formatDateTimeLocal(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function updateText(latitude, longitude, datetime) {
    // Check moon visibility
    const isMoonVisible = checkMoonVisibility(latitude, longitude, datetime);

    // Display the result
    const resultDiv = document.getElementById('result');
    if (isMoonVisible) {
        resultDiv.textContent = "The moon is visible in your location! 🌙";
        resultDiv.style.color = "green";
    } else {
        resultDiv.textContent = "The moon is not visible in your location. 🌑";
        resultDiv.style.color = "red";
    }
    return resultDiv;
}

// // Example usage
// const latitude = 40.7128; // New York City latitude
// const longitude = -74.0060; // New York City longitude
// const date = new Date(); // Current date and time

// const isMoonVisible = checkMoonVisibility(latitude, longitude, date);
// console.log(isMoonVisible ? "The moon is visible!" : "The moon is not visible.");