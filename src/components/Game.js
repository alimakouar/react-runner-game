import {
    useEffect,
    useRef,
    useState
} from 'react'

import useSound from 'use-sound';
import hurtSfx from './hurt.mp3';
import { useParams } from "react-router-dom";
import './game.css';

function sleep(time){
    return new Promise((resolve)=>setTimeout(resolve,time)
  )
}

const Game = () => {
    const ONGOING = 0;
    const PLAYERDIED = -1;
    const FINISHED = 1;
    const AIR = 0;
    const PLAYER = useParams().choice;
    const ENEMY = 2;
    const WALL = 5;
    const width = 7;
    const height = 10;
    const [board ,setBoard] = useState([]);
    const [playHurt] = useSound(hurtSfx, {volume: 0.25});

    
    let player = useRef({
        x: Math.floor(height / 2),
        y: Math.floor(width / 2)
    });
    let enemies = useRef([{
        x: 0,
        y: Math.floor(width / 2)
    }]);

    let boardBuf = useRef([]);
    let counter = useRef(0);
    let timer = useRef(15);
    let level = useRef(1);
    let lives = useRef(3);

    //*The gameState can be one of the following:
    //*onGoing : game is still running
    //*playerDied : game over, player ran out of lives
    //*finished : game over, player reached the goal
    let gameState = useRef(ONGOING);

    if(localStorage.getItem("highscore")===null){
        localStorage.setItem("highscore",0)
    }else{
        localStorage.setItem("highscore", Math.max(localStorage.getItem("highscore"),level.current-1))
    }
    const handleKeyPress = (event) => {
        if (event.key === "ArrowDown" && player.current.x<height-1){
            player.current.x += 1;
        }else if(event.key === "ArrowUp" && player.current.x>0){
            player.current.x -= 1;
        }else if(event.key === "ArrowRight" && player.current.y<width-2){
            player.current.y += 1;
        }else if(event.key === "ArrowLeft" && player.current.y>1){
            player.current.y -= 1;
        }
    }

    //*The board is filled with one of these values:
    //*0 : air
    //*1 : player
    //*2 : enemy
    //*5 : wall

    const drawBoard = () => {
        //init board with air
        boardBuf.current = [];
        for (let i = 0; i < height; i++) {
            let buf = []
            for (let j = 0; j < width; j++) {
                buf.push(AIR);
            }
            boardBuf.current.push(buf);
        }

        //fill in walls
        boardBuf.current.forEach((elem) => {
            elem[0] = WALL;
            elem[elem.length - 1] = WALL;
        });

        //fill the player in
        if (player.current.x<height) {
            boardBuf.current[player.current.x][player.current.y] = PLAYER;
        }

        //fill enemies in
        if(enemies.current.length){
            enemies.current.forEach((enemy) => {
                boardBuf.current[enemy.x][enemy.y] = ENEMY;
            })
        }
    }

    const calculateEnemyPositions = (c) => {
        //clear enemies that reached the bottom row
        enemies.current = enemies.current.filter((enemy) => enemy.x!==height)

        //generate new enemy position
        let newY = Math.ceil((Math.random()*10)%width)
        while (newY===0 || newY>=width-1){
            newY = Math.ceil((Math.random()*10)%width)
        }
        if(!(c%40)){
            enemies.current.push({x: 0, y:newY})
        }
    }

    const scrollBoard = (c) => {
        if (!(c%(22-(2*level.current)))) {
            player.current.x++;
            enemies.current.forEach((enemy) =>{
                enemy.x++;
            })
        }
        if(!(c%40)){
            timer.current--;
        }
        
    }

    const checkCollisions = () => {
        let collisions = enemies.current.filter((enemy) => enemy.x === player.current.x && enemy.y === player.current.y);
        enemies.current = enemies.current.filter((enemy) => !(enemy.x === player.current.x && enemy.y === player.current.y));
        if(collisions.length){
            lives.current--;
            playHurt();
            document.querySelector('.game').style.animation="shake 0.1s linear 2";
            sleep(500).then(()=>{
                document.querySelector('.game').removeAttribute('style');
            })
        }
    }

    const squareClass = (square) => {
        switch (square) {
            case PLAYER:
                return "square player"+PLAYER+"Square";
            case ENEMY:
                return "square enemySquare";
            case WALL:
                return "square wallSquare";
            case AIR:
                return "square airSquare"
            default:
                break;
        }
    }

    const tryAgain = () =>{
        // gameState.current = ONGOING;
        // player.current = {
        //     x: Math.floor(height / 2),
        //     y: Math.floor(width / 2)
        // };
        // enemies.current = [];
        // lives.current = 3;
        // boardBuf.current = [];
        // counter.current = 0;
        // timer.current = 30;
        // level.current = 1;
        // setBoard(boardBuf.current);
        window.location.reload(true);
    }

    const advanceLevel = () => {
        level.current++;
        gameState.current = ONGOING;
        player.current = {
            x: Math.floor(height / 2),
            y: Math.floor(width / 2)
        };
        enemies.current = [];
        boardBuf.current = [];
        counter.current = 0;
        timer.current = 20;
        setBoard(boardBuf.current);
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
    },[]);

    useEffect(() => {
        setTimeout(() => {
            drawBoard();
            counter.current = counter.current+1;
            scrollBoard(counter.current);
            if (gameState.current !== ONGOING) {
                return;
            }
            if (player.current.x<0 || player.current.x>=height || !lives.current) {
                gameState.current = PLAYERDIED;
                if (!lives.current) {
                    drawBoard();
                }
            }else if(!timer.current){
                gameState.current = FINISHED;
                setBoard(boardBuf.current);
            }
            calculateEnemyPositions(counter.current);
            checkCollisions();
            setBoard(boardBuf.current);
        }, 1000/60);
    },[counter.current]);

    if (gameState.current === PLAYERDIED){
        return (
            <div className="gameOver">
                <h3>:(</h3>
                <p>You Died!</p>
                <button onClick={tryAgain}>Try Again</button>
            </div>
        )
    }else if(gameState.current === FINISHED){
        return (
            <div className="nextLevel">
                {/* <h3>:D</h3> */}
                <h3>Great work</h3>
                <button onClick={advanceLevel}>Next Level</button>
            </div>
        )
        
    }

    return ( <div className = "game">
        <h1>Remaining Time : {timer.current}</h1>
        <h2>lives : {lives.current}</h2>
        {boardBuf.current.map((k, i)=>
            <div className="line" key={i}>
                {k.map((s, j) => 
                    <div className={squareClass(s)} key={j}>
                        {/* {s} */}
                    </div>
                )}
            </div>
        )}
        <h2>Level: {level.current}</h2>
        <h2>HighScore: {localStorage.getItem('highscore')}</h2>
        </div>
    );
}

export default Game;