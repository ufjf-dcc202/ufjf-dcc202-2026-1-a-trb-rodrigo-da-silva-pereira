const startBtn = document.getElementById("start-btn");

startBtn.addEventListener("click", function(){
    const difficultyInput = document.getElementById("difficulty");
    const difficulty = parseInt(difficultyInput.value);

    if (difficulty){
        if (difficulty < 3 || difficulty > 10){
            alert("A dificuldade do jogo precisa ser entre 3 e 10");
            return;
        }
    } else {
        alert("Escolha uma dificuldade para o jogo");
        return;
    }

    window.location.href = `index.html?dificuldade=${difficulty}`;
})