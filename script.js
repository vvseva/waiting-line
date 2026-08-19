// Your exact Raw Gist URL
const RAW_GIST_URL = "https://gist.githubusercontent.com/vvseva/0d2c6341f8d776db8c364d12b46fc0ae/raw";

// Polina's fixed ticket number
const POLINA_TICKET = 156;

const counterElement = document.getElementById("counter");
const statusElement = document.getElementById("status-message");

async function fetchQueueCount() {
  try {
    // Fetching via a proxy with timestamp parameter forces fresh data instantly without GitHub rate limits
    const cacheBuster = Date.now();
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(RAW_GIST_URL)}&timestamp=${cacheBuster}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

    const data = await response.json();
    const currentTicket = parseInt(data.contents.trim(), 10);

    if (isNaN(currentTicket)) {
      counterElement.textContent = "ERR";
      statusElement.textContent = "INVALID TICKET NUMBER IN GIST";
      return;
    }

    // Calculate how many people are ahead of Polina
    const peopleAhead = POLINA_TICKET - currentTicket;

    if (peopleAhead > 0) {
      counterElement.textContent = peopleAhead;
      statusElement.textContent = `NOW SERVING: #${currentTicket} | POLINA: #${POLINA_TICKET}`;
    } else if (peopleAhead === 0) {
      counterElement.textContent = "0";
      statusElement.textContent = `NOW SERVING #${POLINA_TICKET} - POLINA IS UP!`;
    } else {
      counterElement.textContent = "0";
      statusElement.textContent = `SERVED (PASSED BY ${Math.abs(peopleAhead)})`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    statusElement.textContent = "OFFLINE / RETRYING...";
  }
}

// Initial fetch on page load
fetchQueueCount();

// Refresh every 5 seconds
setInterval(fetchQueueCount, 5000);
