let feederCharacteristic;

document.getElementById("connect").onclick = async () => {

    try
    {
        const response =
            await fetch(`http://${ESP32_IP}/status`);

        if(!response.ok)
            throw new Error();

        const status = await response.json();

        feederStatusEl.textContent = "Online";

        feedBtn.disabled = false;
        cameraBtn.disabled = false;

        foodLevelEl.textContent = status.foodLevel + "%";
        lastFedEl.textContent = status.lastFed;
    }
    catch(e)
    {
        feederStatusEl.textContent = "Offline";
    }
};

feedBtn.onclick = async () => {

    const response =
        await fetch(`http://${ESP32_IP}/feed`,
        {
            method:"POST"
        });

    if(response.ok)
    {
        lastFedTime = Date.now();

        lastFedEl.textContent = "Just now";
    }
};
function openCamera() {

}