import { playFeedAnimation } from "./visualization.js";

const ESP32_IP = "192.168.1.5";
const ESP32_URL = `http://${ESP32_IP}`;

// =========================================================
// DOM ELEMENTS
// =========================================================

const feedBtn =
document.getElementById("feed");

const reloadBtn =
document.getElementById("reloadStatus");

const esp32Status =
document.getElementById("esp32Status");

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

// =========================================================
// UPDATE STATUS
// =========================================================

async function updateStatus()
{
try
{
const response =
await fetch(
`${ESP32_URL}/status`,
{
method: "GET",
cache: "no-cache"
}
);

    if (!response.ok)
    {
        throw new Error(
            `HTTP ${response.status}`
        );
    }

    const data =
        await response.json();


    // -------------------------------------------------
    // ESP32
    // -------------------------------------------------

    esp32Status.textContent =
        data.wifi
            ? "CONNECTED"
            : "DISCONNECTED";


    // -------------------------------------------------
    // WiFi
    // -------------------------------------------------

    wifiStatus.textContent =
        data.wifi
            ? data.ssid
            : "DISCONNECTED";


    // -------------------------------------------------
    // BLE
    // -------------------------------------------------

    bleStatus.textContent =
        data.ble
            ? "CONNECTED"
            : "DISCONNECTED";


    // -------------------------------------------------
    // STM32 peripherals
    // -------------------------------------------------

    feederStatus.textContent =
        data.feeder
            ? "READY"
            : "NOT READY";

    uartStatus.textContent =
        data.uart
            ? "READY"
            : "NOT READY";

    ledStatus.textContent =
        data.led
            ? "READY"
            : "NOT READY";

    buttonStatus.textContent =
        data.button
            ? "READY"
            : "NOT READY";

    rtcStatus.textContent =
        data.rtc
            ? "READY"
            : "NOT READY";


    // -------------------------------------------------
    // Error
    // -------------------------------------------------

    errorStatus.textContent =
        data.error
            ? "ERROR"
            : "OK";


    // =================================================
    // DETERMINE WHETHER FEEDER IS READY
    // =================================================
    //
    // Feed is allowed only if:
    //
    // ESP32 WiFi is connected
    // STM32 feeder is ready
    // STM32 UART is ready
    // No STM32 error
    //

    const systemReady =
        data.wifi === true &&
        data.feeder === true &&
        data.uart === true;

    feedBtn.disabled =
        !systemReady;
    modelStatus.textContent = "Ready";
    reloadBtn.disabled = false;


    console.log(
        "System status:",
        data
    );

    return true;
}
catch (error)
{
    console.error(
        "Failed to get ESP32 status:",
        error
    );


    // -------------------------------------------------
    // ESP32 unreachable
    // -------------------------------------------------

    esp32Status.textContent =
        "DISCONNECTED";

    wifiStatus.textContent =
        "DISCONNECTED";

    bleStatus.textContent =
        "DISCONNECTED";


    // -------------------------------------------------
    // STM32 unavailable
    // -------------------------------------------------

    feederStatus.textContent =
        "OFFLINE";

    uartStatus.textContent =
        "NOT READY";

    ledStatus.textContent =
        "NOT READY";

    buttonStatus.textContent =
        "NOT READY";

    rtcStatus.textContent =
        "NOT READY";


    errorStatus.textContent =
        "UNKNOWN";


    // -------------------------------------------------
    // Disable controls
    // -------------------------------------------------

    feedBtn.disabled = true;
    reloadBtn.disabled = true;

    return false;
}

}

// =========================================================
// RELOAD STATUS BUTTON
// =========================================================

reloadBtn.onclick =
async function()
{
reloadBtn.disabled = true;

    reloadBtn.classList.add(
        "spinning"
    );

    const success =
        await updateStatus();

    reloadBtn.classList.remove(
        "spinning"
    );

    if (!success)
    {
        alert(
            "Failed to connect to ESP32"
        );

        return;
    }

    reloadBtn.disabled = false;


    // Visual feedback

    const statusElements =
        document.querySelectorAll(
            ".info-box span"
        );

    statusElements.forEach(
        element =>
        {
            element.style.transition =
                "background-color 0.3s";

            element.style.backgroundColor =
                "#d4edda";

            setTimeout(
                () =>
                {
                    element.style.backgroundColor =
                        "transparent";
                },
                500
            );
        }
    );
};


// =========================================================
// FEED BUTTON
// =========================================================

feedBtn.onclick =
async function()
{
// Prevent double clicking
feedBtn.disabled = true;


    try
    {
        console.log(
            "Sending feed request..."
        );

        const response =
            await fetch(
                `${ESP32_URL}/feed`,
                {
                    method: "POST"
                }
            );


        if (!response.ok)
        {
            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "Feed response:",
            data
        );


        if (!data.success)
        {
            throw new Error(
                data.error ||
                "Feed request rejected"
            );
        }


        // ------------------------------------------------
        // Feeding accepted by ESP32
        // ------------------------------------------------

        console.log(
            "Feed command sent successfully"
        );

        lastFed.textContent =
            "Just now";


        // 3D visualization

        playFeedAnimation();


        // // ------------------------------------------------
        // // Wait for STM32 to finish feeding
        // // ------------------------------------------------

        setTimeout(
            updateStatus,
            2000
        );
    }
    catch(error)
    {
        console.error(
            "Feed request failed:",
            error
        );

        alert(
            `Feed failed: ${error.message}`
        );


        // Check whether system is still available

        await updateStatus();
    }
};


// =========================================================
// INITIAL STATUS CHECK
// =========================================================

updateStatus();

// =========================================================
// AUTOMATIC STATUS REFRESH
// =========================================================
//
// Check ESP32 every 5 seconds.
//
// If WiFi disappears:
//     Feed -> disabled
//
// If WiFi comes back:
//     Feed -> enabled
//
// =========================================================

// setInterval(
// updateStatus,
// 5000
// );
