// Replace with your raw Gist URL or Gist ID
const GIST_ID = "0d2c6341f8d776db8c364d12b46fc0ae";
const GIST_URL = `https://api.github.com/gists/${GIST_ID}`;

const counterElement = document.getElementById("counter");
const statusElement = document.getElementById("status-message");

async function fetchQueueCount() {
  try {
    // Cache-busting parameter to ensure fresh data on every request
    const response = await fetch(`${GIST_URL}?nocache=${new Date().getTime()}`);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    
    // Reads the first file inside your Gist
    const firstFileName = Object.keys(data.files)[0];
    const content = data.files[firstFileName].content.trim();
    const count = parseInt(content, 10);

    if (isNaN(count)) {
      counterElement.textContent = "ERR";
      statusElement.textContent = "INVALID DATA IN GIST";
    } else {
      counterElement.textContent = count;
      
      if (count === 0) {
        statusElement.textContent = "POLINA IS NEXT UP!";
      } else if (count < 0) {
        statusElement.textContent = "PASSED / SERVED";
      } else {
        statusElement.textContent = "UPDATED REAL-TIME";
      }
    }
  } catch (error) {
    console.error("Fetch error:", error);
    statusElement.textContent = "OFFLINE / RETRYING...";
  }
}

// Initial fetch on page load
fetchQueueCount();

// Auto-refresh every 5 seconds
setInterval(fetchQueueCount, 5000);
