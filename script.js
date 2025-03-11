document.getElementById('moonForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;

    // Simulate a moon visibility check (this is a placeholder)
    const isMoonVisible = checkMoonVisibility(latitude, longitude);

    const resultDiv = document.getElementById('result');
    if (isMoonVisible) {
        resultDiv.textContent = "The moon is visible in your location!";
        resultDiv.style.color = "green";
    } else {
        resultDiv.textContent = "The moon is not visible in your location.";
        resultDiv.style.color = "red";
    }
});

function checkMoonVisibility(latitude, longitude) {
    // This is a placeholder function.
    // In a real-world scenario, you would call an API or use an algorithm
    // to determine moon visibility based on the provided coordinates.
    // For simplicity, we'll just return a random true/false.
    return Math.random() > 0.5;
}