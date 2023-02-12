import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Person from './Person';
import Camera from './Camera';
import Home from './Home';
import Liste from './Liste';
import About from './About';
import Edit from './Edit';
import Accueil from './Accueil';
// import Personne from './Personne';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="accueil" element={<Accueil />} />
          <Route index element={<Accueil/>} />
          <Route path="camera" element={<Camera />} />
          <Route path="liste" element={<Liste />} />
          <Route path="ajout" element={<Person />} />
          <Route path="update/:id" element={<Edit />} />
          <Route path="about/:id" element={<About />} />
          {/* <Route path="ajout" element={<Personne />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
