import Game from './components/Game';
import MainMenu from './components/mainMenu';
import Choice from './components/Choice';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/game/:choice" element={<Game />} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;