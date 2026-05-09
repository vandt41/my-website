let feederCharacteristic;

document.getElementById('connect').addEventListener('click', async () => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['594badb3-622e-4879-af44-495aadc913be'] // Replace with your UUID
        });
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService('594badb3-622e-4879-af44-495aadc913be');
        feederCharacteristic = await service.getCharacteristic('594badb3-622e-4879-af44-495aadc913be');

        document.getElementById('status').innerText = "Status: Connected!";
        document.getElementById('feed').disabled = false;
    } catch (err) {
        console.error(err);
    }
});

document.getElementById('feed').addEventListener('click', async () => {
    if (feederCharacteristic) {
        await feederCharacteristic.writeValue(new Uint8Array([1]));
        alert("Food Dispensed!");
    }
});
function openCamera() {

}