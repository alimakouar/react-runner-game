import { Link } from "react-router-dom";
import './main.css';

const Choice = () => {
    return ( <div id="choice">
        <h1>Choose Your Character</h1>
        <div>
            <Link to="/game/1">Male</Link>
            <Link to="/game/2">Female</Link>
        </div>
    </div> );
}
 
export default Choice;