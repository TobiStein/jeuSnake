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

    await lireNiveau(1);

    // initialise le tableau WORLD
    let WORLD = new Array(x);

    updateWorld();
    draw();

    // ajouter position à SNAKEBODY
    function push(tete) {
        let tempTab = new Array(SNAKEBODY.length + 1);
        tempTab[0] = tete;
        for(let i=1; i < tempTab.length; i++){
            tempTab[i] = SNAKEBODY[i-1];
        }
        SNAKEBODY = tempTab;
    }

    // supprimer position à SNAKEBODY shift
    function shift(){
        let tempTab = new Array(SNAKEBODY.length - 1);
        for(let i=0; i < tempTab.length; i++){
            tempTab[i] = SNAKEBODY[i];
        }
        SNAKEBODY = tempTab; 
    }

    setInterval(function(){
        //Listener
        document.body.addEventListener('keydown', function(ev) {
            controle = ev.key;
            console.log(controle);
            //  "ArrowDown", "ArrowLeft", "ArrowRight" et "ArrowUp"
        });
        step();
        savedkey = controle;
    },delay);
    
    

    // fonction step (prend en paramètre key)
    // fct step appeler à interval régulier (setInterval)
    function step() {
        // vérifie si ce sont les bonnes touches
        if (controle=="ArrowDown"||controle=="ArrowLeft"||controle=="ArrowRight"||controle=="ArrowUp"){
            let p;
            let p_x = SNAKEBODY[0][0];
            let p_y = SNAKEBODY[0][1];

            // met à jour SNAKEBODY en fonction du déplacement
            if(controle=="ArrowDown"){
                if(savedkey!="ArrowUp"){
                    p = [p_x+1,p_y]; 
                    push(p);
                    shift();
                }else{
                    controle="ArrowUp";
                }
            }
            if(controle=="ArrowLeft"){ 
                if(savedkey!="ArrowRight"){
                    p = [p_x,p_y-1];
                    push(p);
                    shift(); 
                }else{
                    controle="ArrowRight";
                }
            }
            if(controle=="ArrowRight"){ 
                if(savedkey!="ArrowLeft"){
                    p = [p_x,p_y+1];
                    push(p);
                    shift();  
                }else{
                    controle="ArrowLeft";
                }
            }
            if(controle=="ArrowUp"){ 
                if(savedkey!="ArrowDown"){
                    p = [p_x-1,p_y];
                    push(p);
                    shift();   
                }else{
                    controle="ArrowDown";
                }
            }

            updateWorld();
            draw();

        }
    }

    // verif :
    // position tête = position fruit score + 1 et SNAKEBODY + 1
    // position tête = position mur, serpent ou limite monde = fin de partie

    // update SNAKEBODY
    // update WORLD

    // Effacer canvas
    // redessiner canvas

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
            console.log(x);
            console.log(y);
            SNAKEBODY = data.snake;
            FOODBODY = data.food;
            delay = data.delay;
    
        }).catch(function(err){
            console.log(err);
        });
        return promesse;
    }

    function draw(){
        // canvas 
        let canvas = document.getElementById('mycanvas');
        canvas.setAttribute('width', 20 * x);
        canvas.setAttribute('height', 20 * y);
        let ctx = canvas.getContext('2d');

        //clear before draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // couleur du fond
        ctx.fillStyle = "#2A9D8F";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < WORLD.length; i++){
            for (let j = 0; j < WORLD.length; j++){
                if (WORLD[i][j] == FOOD) {
                    ctx.fillStyle = "#E76F51";  
                    ctx.fillRect(i*20,j*20,20,20);
                }
                if (WORLD[i][j] == SNAKE) {
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
            let a = SNAKEBODY[i][1];
            let b = SNAKEBODY[i][0];
            WORLD[a][b] = SNAKE;
        }

        // placer FOODBODY dans WORLD
        for (let i = 0; i < FOODBODY.length; i++){
            let a = FOODBODY[i][1];
            let b = FOODBODY[i][0];
            WORLD[a][b] = FOOD;
        }
    }
})();