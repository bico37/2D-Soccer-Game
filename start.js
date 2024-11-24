let choise1 = document.getElementById('choise1');
let choise2 = document.getElementById('choise2');
let choise3 = document.getElementById('choise3');

function setGameMode(mode) {
    choise1.style.border="2px solid black"
    choise2.style.border="2px solid black"
    choise3.style.border="2px solid black"
    
    if (mode == 'slow') {
        console.log(mode )
        choise1.style.border= "4px solid green"
    } else if (mode == 'normal') {
        choise2.style.border= "4px solid green"
    } else if (mode == 'fast') {
        choise3.style.border= "4px solid green"
    }

    // Speichere die Auswahl im Local Storage
    sessionStorage.setItem('selectedGameMode', mode);
}

