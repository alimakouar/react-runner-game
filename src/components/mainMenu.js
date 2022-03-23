import { Link } from "react-router-dom";
import './main.css';
import React from "react";
import ReactDOM from 'react-dom';
import Music from "./Music";

const stopMusic = () => {
    const cl = ReactDOM.render(Music, document.querySelector('d'));
    cl.log();
  };

const MainMenu = () => {
    return ( 
    <div id="mainmenu">
        <h1>ENSAM RUNNER</h1>
        <Music/>
        <Link to="/choice" onClick={stopMusic}>Start Game</Link>
    </div>
    );
}

export default MainMenu;