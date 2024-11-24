function submitNames(){
    let MEDT_soccerGame_player1Name = document.getElementById("player1_name").value
    let MEDT_soccerGame_player2Name = document.getElementById("player2_name").value

    if(MEDT_soccerGame_player1Name == "" || MEDT_soccerGame_player2Name == ""){
        document.getElementById('names-answer').innerHTML = `<p>Please type in 2 names</p>`
        
    } else {
        location.href = "./game.html"
        sessionStorage.setItem("player1Name", MEDT_soccerGame_player1Name);
        sessionStorage.setItem("player2Name", MEDT_soccerGame_player2Name);
    }

}