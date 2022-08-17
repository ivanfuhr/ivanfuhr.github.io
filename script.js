addEventListener('keypress', (event) => {
    if (event.key == "p") {

        const allPos = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36"]

        const positions = window.prompt("Digite aqui os números que deseja apostar?");
        const splitedPositions = positions.split(", ");    

        allPos.forEach(pos => {

            if (splitedPositions.includes(pos)) {
                console.log(pos)
                document.querySelector(`[data-automation-locator="betPlace.straight-${pos}"]`).style.fill = "gold";
            } else {
                document.querySelector(`[data-automation-locator="betPlace.straight-${pos}"]`).style.fill = "";
            }
        });

    }
});