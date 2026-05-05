function toggleLoginForm() {
    const form = document.getElementById("login-container");
    if (form.style.display === "none" || form.style.display === "") {
        form.style.display = "block";
    } else {
        form.style.display = "none";
        document.getElementById("login-container").style.display = "none";
    }
}

function showHighlight() {
    const highlightButton = document.getElementById("highlight-button");

    highlightButton.innerHTML = `
        <video src="cs2.mp4" width="500" controls autoplay muted loop></video>
        <pre>mot trong hang ty highlights anh tung lam dc</pre>
    `;
}

