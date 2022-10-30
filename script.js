(async function() {

    let SNAKE = 1;
    let FOOD = 2;
    let x = 0;
    let y = 0;
    let delay = 150;
    let FOODBODY = [];
    let SNAKEBODY = [];
    let controle;
    let savedkey;
    let endOfGame = 0;
    let score = 0;
    let htmlscore = document.getElementById("score");
    let neverendMode = 0;

    // initialise le tableau WORLD
    let WORLD = new Array(x);

    // canvas 
    let canvas = document.getElementById('mycanvas');

    // bouton pour commencer une partie
    document.getElementById("play").addEventListener('click', async function(){
        // réinitialiser les valeurs
        neverendMode = 0
        controle = 0;
        savedkey = 0;
        endOfGame = 0;
        score = 0;
        htmlscore.textContent = "SCORE : "+score;

        let neverend = document.getElementById('neverend');
        if(neverend.checked){
            // si mode sans fin selectionnée :
            x = 20;
            y = 20;
            // récupère delay selon l'option de difficulté sélectionné
            let e = document.getElementById("difficulty");
            delay = e.value;
            FOODBODY = [[10,10]];
            SNAKEBODY = [[2,1],[3,1],[4,1],[4,2]];
            neverendMode = 1
        }else{
            // prendre les données du niveau sélectionné
            let e = document.getElementById("level-select");
            let value = e.value;
            await readLevel(value);
        }

        // lance le jeu
        document.getElementById('game').classList.remove('invisible');
        play();
    });

    // bouton pour recommencer une partie après avoir perdu
    document.getElementById("try").addEventListener('click', function(){
        document.getElementById('gameover').classList.add('invisible');
        document.getElementById('game').classList.add('invisible');
    });

    // bouton pour recommencer une partie après avoir gagné
    document.getElementById("replay").addEventListener('click', function(){
        document.getElementById('victory').classList.add('invisible');
        document.getElementById('game').classList.add('invisible');
    });

    function play(){
        updateWorld();
        draw();
        
        // boucle tant que la partie n'est pas terminée
        let game = setInterval(function(){
            //Listener
            document.body.addEventListener('keydown', function(ev) {
                controle = ev.key;
                //  "ArrowDown", "ArrowLeft", "ArrowRight" et "ArrowUp"
            });
            step();
            if (endOfGame !== 0){
                endGame();
                clearInterval(game);
            }
            savedkey = controle;
        },delay);
    }

    function endGame() {
        if (endOfGame === 1) {
            // si on a perdu
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "#E76F51";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.getElementById('gameover').classList.remove('invisible');
        }
        if (endOfGame === 2) {
            // si on a gagné
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "#E9C46A";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.getElementById('victory').classList.remove('invisible');
        }
    }
    
    // fonction step
    function step() {
        // vérifie si ce sont les bonnes touches
        if (controle==="ArrowDown"||controle==="ArrowLeft"||controle==="ArrowRight"||controle==="ArrowUp"){
            let p;
            let p2;
            let indice = SNAKEBODY.length - 1;
            let p_x = SNAKEBODY[indice][0];
            let p_y = SNAKEBODY[indice][1];

            // met à jour SNAKEBODY en fonction du déplacement
            if(controle==="ArrowDown"){
                if(savedkey!=="ArrowUp"){
                    p = [p_x,p_y+1];
                    p2 = [p_x,p_y+2];
                    verif(p,p2);
                }else{
                    controle="ArrowUp";
                }
            }
            if(controle==="ArrowLeft"){ 
                if(savedkey!=="ArrowRight"){
                    p = [p_x-1,p_y];
                    p2 = [p_x-2,p_y];
                    verif(p,p2);
                }else{
                    controle="ArrowRight";
                }
            }
            if(controle==="ArrowRight"){ 
                if(savedkey!=="ArrowLeft"){
                    p = [p_x+1,p_y];
                    p2 = [p_x+2,p_y];
                    verif(p,p2);   
                }else{
                    controle="ArrowLeft";
                }
            }
            if(controle==="ArrowUp"){ 
                if(savedkey!=="ArrowDown"){
                    let p = [p_x,p_y-1];
                    let p2 = [p_x,p_y-2];
                    verif(p,p2);
                }else{
                    controle="ArrowDown";
                }
            }
            // met à jour le tableau WORLD et redessine
            updateWorld()
            draw();
        } else {
            // pour éviter qu'appuyer sur une autre touche arrête le jeu
            controle = savedkey;
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    // verif :
    // p = position future et p2 = position a ajouter s'il mange qqch
    function verif(p,p2) {
        if(FOODBODY.length === 0){
            endOfGame = 2;
        }else{
            if(p[0] < 0 || p[0] >= x || p[1] < 0 || p[1] >= y){
                endOfGame = 1;
            } else if(WORLD[p[0]][p[1]] === FOOD){
                score += 1;
                htmlscore.textContent = "SCORE : "+score;
                if(neverendMode === 1){
                    let aleatoire = getRandomInt(1);
                    let fruit
                    if(aleatoire===1){
                        fruit = [getRandomInt(19),getRandomInt(20)];
                    } else {
                        fruit = [getRandomInt(20),getRandomInt(19)];
                    }
                    FOODBODY.push(fruit);
                }
                FOODBODY.shift();
                SNAKEBODY.push(p);
                SNAKEBODY.push(p2);
                SNAKEBODY.shift(); 
            } else if(WORLD[p[0]][p[1]] === SNAKE){
                endOfGame = 1;
            } else {
                SNAKEBODY.push(p);
                SNAKEBODY.shift();
            }
        }
    }

    async function readLevel(num){
        let url = "niveaux/niveau"+num+".json"
        let promesse = fetch(url).then(function(response){
            if (response.ok) {
                return response.json();
            } else {
                throw ("Error " + response.status);
            }
        }).then(function(data){
            // récupère les infos du json
            x = data.dimensions[0];
            y = data.dimensions[1];
            SNAKEBODY = data.snake;
            FOODBODY = data.food;
            delay = data.delay;
    
        }).catch(function(err){
            console.log(err);
        });
        return promesse;
    }

    function draw(){
        let ctx = canvas.getContext('2d');

        // nettoie le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // couleur de fond
        ctx.fillStyle = "#2A9D8F";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < WORLD.length; i++){
            for (let j = 0; j < WORLD.length; j++){
                if (WORLD[i][j] === FOOD) {
                    // couleur nourriture
                    ctx.fillStyle = "#E76F51";  
                    ctx.fillRect(i*(canvas.width/x),j*(canvas.height/y),canvas.width/x,canvas.height/y);
                }
                if (WORLD[i][j] === SNAKE) {
                    // couleur serpent
                    ctx.fillStyle = "#E9C46A";  
                    ctx.fillRect(i*(canvas.width/x),j*(canvas.height/y),canvas.width/x,canvas.height/y);
                }
            }
        }
    }

    function updateWorld(){
        for (let i = 0; i < x; i++) {
            WORLD[i] = new Array(y);
        }
        // placer SNAKEBODY dans WORLD
        for (let i = 0; i < SNAKEBODY.length; i++){
            let a = SNAKEBODY[i][0];
            let b = SNAKEBODY[i][1];
            WORLD[a][b] = SNAKE;
        }
    
        // placer le premier dans FOODBODY dans WORLD
        if(FOODBODY.length!==0){
            let a = FOODBODY[0][0];
            let b = FOODBODY[0][1];
            WORLD[a][b] = FOOD;
        }
    }
})();