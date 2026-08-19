const RAW_GIST_URL = "https://gist.githubusercontent.com/vvseva/0d2c6341f8d776db8c364d12b46fc0ae/raw";
const POLINA_TICKET = 156;

const counterElement = document.getElementById("counter");
const statusElement = document.getElementById("status-message");

// Load air horn audio (using a public royalty-free airhorn sound)
const hornAudio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");

let hasCelebrated = false;
let audioUnlocked = false;

// Web browsers block auto-play audio until the user clicks or taps anywhere on the screen
document.addEventListener("click", () => {
  if (!audioUnlocked) {
    hornAudio.play().then(() => {
      hornAudio.pause();
      hornAudio.currentTime = 0;
      audioUnlocked = true;
    }).catch(() => {});
  }
}, { once: true });

function triggerCelebration() {
  // Play horn sound
  hornAudio.currentTime = 0;
  hornAudio.play().catch(e => console.log("Audio waiting for user click/tap first"));

  // Fire confetti streams from left and right corners
  if (typeof confetti === "function") {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

async function fetchQueueCount() {
  try {
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

    const peopleAhead = POLINA_TICKET - currentTicket;

    if (peopleAhead > 0) {
      counterElement.textContent = peopleAhead;
      statusElement.textContent = `NOW SERVING: #${currentTicket} | POLINA: #${POLINA_TICKET}`;
      hasCelebrated = false; // Reset if ticket rolls back
    } else if (peopleAhead === 0) {
      counterElement.textContent = "0";
      statusElement.textContent = `NOW SERVING #${POLINA_TICKET} - POLINA IS UP!`;
      
      // Trigger confetti and horn only once when reaching 0
      if (!hasCelebrated) {
        triggerCelebration();
        hasCelebrated = true;
      }
    } else {
      counterElement.textContent = "0";
      statusElement.textContent = `SERVED (PASSED BY ${Math.abs(peopleAhead)})`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    statusElement.textContent = "OFFLINE / RETRYING...";
  }
}

fetchQueueCount();
setInterval(fetchQueueCount, 5000);
