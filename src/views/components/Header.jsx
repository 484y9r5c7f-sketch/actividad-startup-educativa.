import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

export default function Header() {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Edumotion" />
          </Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Inicio</Link></li>
          <li><a href="#cursos">Cursos</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li>
          <li><Link to="/seguridad">Seguridad</Link></li>
          <li><button className="btn-primary">Comenzar</button></li>
        </ul>
      </nav>
    </header>
  );
}
