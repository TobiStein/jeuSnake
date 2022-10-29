(async function() {

    let SNAKE = 1;
    let FOOD = 2;
    let x = 0;
    let y = 0;
    let delay = 100;
    let FOODBODY = [];
    let SNAKEBODY = [];
    let controle;
    let savedkey;
    let finDePartie = 0;
    let score = 0;

    await lireNiveau(1);

    // initialise le tableau WORLD
    let WORLD = new Array(x);
    
    updateWorld();

    // canvas 
    let canvas = document.getElementById('mycanvas');
    canvas.setAttribute('width', 20 * x);
    canvas.setAttribute('height', 20 * y);
    draw();

    // boucle tant que la partie n'est pas terminée
    let game = setInterval(function(){
        //Listener
        document.body.addEventListener('keydown', function(ev) {
            controle = ev.key;
            //  "ArrowDown", "ArrowLeft", "ArrowRight" et "ArrowUp"
        });
        step();
        if (finDePartie !== 0){
            finGame();
            clearInterval(game);
        }
        savedkey = controle;
    },delay);

    function finGame() {
        if (finDePartie === 1) {
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "#E76F51";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (finDePartie === 2) {
            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "#E9C46A";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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
            updateWorld()
            draw();
        } else {
            controle = savedkey;
        }
    }

    // verif :
    // p = position future et p2 = position a ajouter s'il mange qqch
    function verif(p,p2) {
        if(FOODBODY.length === 0){
            finDePartie = 2;
        }else{
            if(WORLD[p[0]][p[1]] === FOOD){
                score += 1;
                FOODBODY.shift();
                SNAKEBODY.push(p);
                SNAKEBODY.push(p2);
                SNAKEBODY.shift(); 
            } else if(WORLD[p[0]][p[1]] === SNAKE){
                finDePartie = 1;
            } else if(p[0] < 0 || p[0] >= x || p[1] < 0 || p[1] >= y){
                finDePartie = 1;
            } else {
                SNAKEBODY.push(p);
                SNAKEBODY.shift();
            }
        }
    }

    async function lireNiveau(num){
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
                    ctx.fillRect(i*20,j*20,20,20);
                }
                if (WORLD[i][j] === SNAKE) {
                    // couleur serpent
                    ctx.fillStyle = "#E9C46A";  
                    ctx.fillRect(i*20,j*20,20,20);
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