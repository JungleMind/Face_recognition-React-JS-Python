import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Context from "./Context";
import './Accueil.css';
import face from './images/fond.png';
import ligne from './images/ligne.png';
import { Link } from 'react-router-dom';

const Accueil = () =>{
    return(
        <>
        <Context/>
            <div id='fond'>
                <div id='ligne'>
                <img src={ligne} alt="Face"/>
                </div>
                <div id='texte'>
                    <div id='titre'>
                        <h3>RECONNAISSANCE FACIALE</h3>
                    </div>
                    <div id='para'>
                        <p>Une plateforme pour vérifier si vous êtes enregistrés dans la base de données ou non.</p>
                    </div>
                    <Link id="link" to="/camera">
                        <div id='bouton'>
                            VERIFIER
                        </div>
                    </Link>
                    
                </div>
                <div id='image'>
                    <div id='scan'>

                    </div>
                    <img src={face} alt="Face"/>
                </div>
            
            </div>
        </>
    )
}

export default Accueil; 