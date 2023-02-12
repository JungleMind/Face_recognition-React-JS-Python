import { Link } from "react-router-dom";
import './Context.css';
import logo from './images/logo.png'
export default function Context() {
  return (
    <>
      <header>
        {/* <nav className="navbar navbar-expand-md navbar-dark bg-dark"> */}
        <nav className="navbar navbar-expand-md">
          <div id="logo">
            {/* <img src={logo} alt="Logo" /> */}
            <h4>RF</h4>
          </div>
          <div class="navbar-nav ms-auto d-flex align-items-right">
            <div class="navbar-brand">
              <Link class="link" to="/accueil">
                <div class="align-items-center acc">
                  ACCUEIL
                </div>
              </Link>
            </div>

            <div class="navbar-brand">
              <Link class="link" to="/camera">
              <div class="align-items-center acc">
                  VERIFIER
                </div>
              </Link>
            </div>

            <div class="navbar-brand">
              <Link class="link" to="/liste">
              <div class="align-items-center acc">
                  PERSONNES
                </div>
              </Link>
            </div>

            {/* <div class="navbar-brand">
              <Link class="link" to="/ajout">
              <div class="align-items-center acc">
                  AJOUTER
                </div>
              </Link>
            </div> */}
          </div>
        </nav>
      </header>
    </>
  );
}
