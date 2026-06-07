//console.log(`Hello`);

//window.alert(`I like pizza`);

document.getElementById(`myH1`).textContent = `Notebook`;
document.getElementById(`myP`).textContent = `Hello, World!`;

function rollDice() {
    const numOfDice = document.getElementById(`numOfDice`).value;
    const diceResult = document.getElementById(`diceResult`);
    const diceImages = document.getElementById(`diceImages`);
    const values = [];
    const images = [];
    for (let i = 0; i < 6; i++) {
        const value = Math.floor(Math.random() * 6) + 1;
    }
    for (let i = 0; i < numOfDice; i++) {
        const value = Math.floor(Math.random() * 6);
        values.push(value);
        images.push(`<img src="assest/dice/${value}.png"></img>`)

    }
}

