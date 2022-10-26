(async function() {

    let SNAKE = 1;
    let FOOD = 2;
    // [x,y] : x indice colonne ; y indice ligne
    let x = 0;
    let y = 0;
    let delay = 100;
    let FOODBODY = [];
    let SNAKEBODY = [];

   await lireNiveau(1);

    console.log(x);
    console.log(y);

    // initialise le tableau WORLD
    let WORLD = new Array(x);
    for (let i = 0; i < x; i++) {
        WORLD[i] = new Array(y);
    }

    // placer SNAKEBODY dans WORLD
    for (let i = 0; i < SNAKEBODY.length; i++){
        let a = SNAKEBODY[i][0];
        let b = SNAKEBODY[i][1];
        WORLD[a][b] = SNAKE;
    }

    // placer FOODBODY dans WORLD
    for (let i = 0; i < FOODBODY.length; i++){
        let a = FOODBODY[i][0];
        let b = FOODBODY[i][1];
        WORLD[a][b] = FOOD;
    }

    draw();
    

    // ajouter position à SNAKEBODY push
    // supprimer position à SNAKEBODY shift

    // passer l'evenement keydown en paramètre d'un listener
    // enregistrer une de ces valeurs dans un attribut key
    //  "ArrowDown", "ArrowLeft", "ArrowRight" et "ArrowUp"

    // fonction step (prend en paramètre key)
    // fct step appeler à interval régulier (setInterval)

    // TODO : step
    // if key est diff et if pas d'obstacle : changer direction

    // update position tête :
    // si droite/gauche changer x de SNAKEBODY[0]
    // si bas/droit changer y de SNAKEBODY[0]

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
})();