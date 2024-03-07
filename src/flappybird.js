//board(设置背景宽度和长度)
let board;
let boardwidth =360;
let boardHeight =640;
let context;

//bird
let birdwidth =34;
let birdHeight =24;
let birdX = boardwidth/8;
let birdY = boardHeight/2;

let bird ={
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdHeight
}

//pipes
let pipeArray =[];
let pipeWidth =50;
let pipeHeight =400;
let pipeX =boardwidth;
let pipeY =0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX =-2;//pipes moving left speed
let velocityY =0;//bird jump speed
let gravity =0.4;

let gameover = false;
let score =0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardwidth;
    context = board.getContext("2d");//used for drawing on the board

    //draw flappy bird
    //context.fillStyle = "green";
    //context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "../assets/flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg=new Image();
    topPipeImg.src = "../assets/toppipe.png";

    bottomPipeImg=new Image();
    bottomPipeImg.src = "../assets/botpipe.png";


    requestAnimationFrame(update);
    setInterval(placePipes,1500);//every 1.5 seconds
    document.addEventListener("keydown", moveBird);

}
function update(){
    requestAnimationFrame(update);
    if (gameover) {
        return;
    }
    context.clearRect(0,0,board.width,board.height);

    //bird
    velocityY +=gravity;
    //bird.y +=velocityY;
    bird.y=Math.max(bird.y+velocityY,0);//apply gravity to current bird.y,limit the bird.y to top of the canvas
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>board.height){
        gameover = true;//掉下去游戏结束
    }

    //pipes
    for(let i = 0; i < pipeArray.length;i++)
    {
        let pipe =pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        
        //判断是否通过，如果通过score加1
        if(!pipe.passed && bird.x > pipe.x +pipe.width)
        {
            score +=0.5;//because there are two pipes!0.5*2=1
            pipe.passed = true;
        } 

        if(detectCollision(bird,pipe))
        {
            gameover =true;
        }
    
    }

    //clear pipes
    while (pipeArray.length >0 && pipeArray[0].x< -pipeWidth)
    {
        pipeArray.shift();//remove first element from the array
    }



    //score
    context.fillStyle ="white";
    context.font="45px sans-serif";
    context.fillText(score,5,45);

    if(gameover){
        context.fillText("GAME OVER",5,90);
    }
}
function placePipes() {
    if(gameover){
        return;
    }
     
    let randomPipeY = pipeY -pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4-Math.random()*60;

    let topPipe ={
        img : topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed :false

    }
    pipeArray.push(topPipe);

    let bottomPipe={
        img:bottomPipeImg,
        x:pipeX,
        y:randomPipeY+pipeHeight+openingSpace,
        width :pipeWidth,
        height : pipeHeight,
        passed :false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if (e.code =="Sapce" || e.code == "ArrowUp"||e.code =="keyX"){
        //jump
        velocityY=-6;

        //reset game
        if(gameover)
        {
            bird.y=birdY;
            pipeArray=[];
            score=0;
            gameover =false;
        }

    }
}

function detectCollision(a,b){
    return  a.x < b.x +b.width &&
            a.x + a.width >b.x &&
            a.y < b.y +b.height &&
            a.y + a.height > b.y;
}