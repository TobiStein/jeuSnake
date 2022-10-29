(async function() {

    let SNAKE = 1;
    let FOOD = 2;
    // [x,y] : x indice colonne ; y indice ligne
    let x = 0;
    let y = 0;
    let delay = 100;
    let FOODBODY = [];
    let SNAKEBODY = [];
    let controle;
    let savedkey;
    let finDePartie = 0;

    await lireNiveau(1);

    // initialise le tableau WORLD
    let WORLD = new Array(x);
    
    updateWorld();

    // canvas 
    let canvas = document.getElementById('mycanvas');
    canvas.setAttribute('width', 20 * x);
    canvas.setAttribute('height', 20 * y);
    draw();

    let game = setInterval(function(){
        //Listener
        document.body.addEventListener('keydown', function(ev) {
            controle = ev.key;
            //  "ArrowDown", "ArrowLeft", "ArrowRight" et "ArrowUp"
        });
        step();
        if (finDePartie === 1) {
            console.log("finDePartie");
            let ctx = canvas.getContext('2d');
            //clear before draw
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // couleur du fond
            ctx.fillStyle = "#E76F51";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            clearInterval(game);
        }
        savedkey = controle;
    },delay);
    
    

    // fonction step (prend en paramètre key)
    // fct step appeler à interval régulier (setInterval)
    function step() {
        // vérifie si ce sont les bonnes touches
        if (controle==="ArrowDown"||controle==="ArrowLeft"||controle==="ArrowRight"||controle==="ArrowUp"){
            let p;
            let indice = SNAKEBODY.length - 1;
            let p_x = SNAKEBODY[indice][0];
            let p_y = SNAKEBODY[indice][1];

            // met à jour SNAKEBODY en fonction du déplacement
            if(controle==="ArrowDown"){
                if(savedkey!=="ArrowUp"){
                    p = [p_x,p_y+1];
                    let p2 = [p_x,p_y+2];
                    verif(p,p2);
                }else{
                    controle="ArrowUp";
                }
            }
            if(controle==="ArrowLeft"){ 
                if(savedkey!=="ArrowRight"){
                    p = [p_x-1,p_y];
                    let p2 = [p_x-2,p_y];
                    verif(p,p2);
                }else{
                    controle="ArrowRight";
                }
            }
            if(controle==="ArrowRight"){ 
                if(savedkey!=="ArrowLeft"){
                    p = [p_x+1,p_y];
                    let p2 = [p_x+2,p_y];
                    verif(p,p2);   
                }else{
                    controle="ArrowLeft";
                }
            }
            if(controle==="ArrowUp"){ 
                if(savedkey!=="ArrowDown"){
                    p = [p_x,p_y-1];
                    let p2 = [p_x,p_y-2];
                    verif(p,p2);
                }else{
                    controle="ArrowDown";
                }
            }
            updateWorld()
            draw();

        }
    }

    // verif :
    // position tête = position fruit score + 1 et SNAKEBODY + 1
    // position tête = position mur, serpent ou limite monde = fin de partie
    function verif(p,p2) {
        if(WORLD[p[0]][p[1]] === FOOD){
            FOODBODY.shift();
            SNAKEBODY.push(p);
            SNAKEBODY.push(p2);
            SNAKEBODY.shift(); 
        } else if(WORLD[p[0]][p[1]] === SNAKE){
            finDePartie = 1;
        } else {
            SNAKEBODY.push(p);
            SNAKEBODY.shift();
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

        //clear before draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // couleur du fond
        ctx.fillStyle = "#2A9D8F";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < WORLD.length; i++){
            for (let j = 0; j < WORLD.length; j++){
                if (WORLD[i][j] === FOOD) {
                    ctx.fillStyle = "#E76F51";  
                    ctx.fillRect(i*20,j*20,20,20);
                }
                if (WORLD[i][j] === SNAKE) {
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