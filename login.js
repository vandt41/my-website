const startBtn = document.getElementById("countStartBtn");
const stopBtn = document.getElementById("countStopBtn");
const resetBtn = document.getElementById("countResetBtn");
const IncBtn = document.getElementById("IncBtn");
const countLabel = document.getElementById("countLabel");
const code = function () {
    count++;
    countLabel.textContent = count;
    localStorage.setItem("countValue", count);
}

let count;
if (localStorage.getItem("countValue")) {
    count = +localStorage.getItem("countValue");
    countLabel.textContent = count;
}
else count = 0;
IncBtn.onclick = function () {
    count += 5;
    countLabel.textContent = count;
    localStorage.setItem("countValue", count);

}
let countIntervalID;
startBtn.onclick = function () {
    countIntervalID = setInterval(code, 1000);
}
resetBtn.onclick = function () {
    localStorage.clear();
    count = 0;
    countLabel.textContent = 0;
}
stopBtn.onclick = function () {
    clearInterval(countIntervalID);
    countIntervalID = null;
}
