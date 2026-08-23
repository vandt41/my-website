import { playFeedAnimation } from "./visualization.js";
const ESP32_IP = "192.168.1.4";      // Change to your ESP32 IP
const feedBtn =
    document.getElementById("feed");

const reloadBtn =
    document.getElementById("reloadStatus");
const feederStatus =
    document.getElementById("feederStatus");

const uartStatus =
    document.getElementById("uartStatus");

const ledStatus =
    document.getElementById("ledStatus");

const buttonStatus =
    document.getElementById("buttonStatus");

const rtcStatus =
    document.getElementById("rtcStatus");

const wifiStatus =
    document.getElementById("wifiStatus");

const bleStatus =
    document.getElementById("bleStatus");

const errorStatus =
    document.getElementById("errorStatus");

const lastFed =
    document.getElementById("lastFed");

// Function to fetch and update status
async function updateStatus() {
    try {
        const response =
            await fetch(`http://${ESP32_IP}/status`);

        if (!response.ok)
            throw new Error();

        const data =
            await response.json();

        // Update STM32 / feeder status
        feederStatus.textContent =
            data.feeder ? "READY" : "NOT READY";

        uartStatus.textContent =
            data.uart ? "READY" : "NOT READY";

        ledStatus.textContent =
            data.led ? "READY" : "NOT READY";

        buttonStatus.textContent =
            data.button ? "READY" : "NOT READY";

        rtcStatus.textContent =
            data.rtc ? "READY" : "NOT READY";

        // Update ESP32 connection status
        wifiStatus.textContent =
            data.wifi ? data.ssid : "DISCONNECTED";

        bleStatus.textContent =
            data.ble ? "CONNECTED" : "DISCONNECTED";

        // Error status
        errorStatus.textContent =
            data.error ? "ERROR" : "OK";

        // Enable buttons after successful connection
        feedBtn.disabled = false;
        reloadBtn.disabled = false;

        return true;

    } catch (error) {

        // ESP32 cannot be reached
        feederStatus.textContent = "OFFLINE";
        uartStatus.textContent = "NOT READY";
        ledStatus.textContent = "NOT READY";
        buttonStatus.textContent = "NOT READY";
        rtcStatus.textContent = "NOT READY";

        wifiStatus.textContent = "DISCONNECTED";
        bleStatus.textContent = "DISCONNECTED";
        errorStatus.textContent = "UNKNOWN";

        feedBtn.disabled = true;
        reloadBtn.disabled = true;

        return false;
    }
}

// Connect button - initial connection
document.getElementById("connect").onclick =
    async function () {
        const success = await updateStatus();
        if (!success) {
            alert("Cannot connect to ESP32");
        } else {
            console.log("PetFeeder connected!");
            esp32Status.textContent = "CONNECTED";
            connect.disabled = true;
        }
    };

// Reload button - refresh status
reloadBtn.onclick = async function () {

    // Disable button
    reloadBtn.disabled = true;

    // Start spinning animation
    reloadBtn.classList.add('spinning');

    // Update status
    const success = await updateStatus();

    // Stop spinning
    reloadBtn.classList.remove('spinning');

    // Re-enable button
    reloadBtn.disabled = false;

    if (success) {
        // Visual feedback
        const statusElements =
            document.querySelectorAll('.info-box span');

        statusElements.forEach(el => {
            el.style.transition = 'background-color 0.3s';
            el.style.backgroundColor = '#d4edda';

            setTimeout(() => {
                el.style.backgroundColor = 'transparent';
            }, 500);
        });
    } else {
        alert("Failed to refresh status");
    }
};

feedBtn.onclick = async function () {

    const response = await fetch(
        `http://${ESP32_IP}/feed`,
        {
            method: "POST"
        }
    );

    if (response.ok) {

        lastFed.textContent = "Just now";

        console.log("Feeding...");

        // Play 3D gate animation
        playFeedAnimation();

        // Update status after feeding
        setTimeout(updateStatus, 2000);
    }
    else {

        alert("Feed failed");
    }
};
