import { FaHeart } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} Uniminuto Edumotion — Hecho con <FaHeart className="heart-icon" /> en Bogotá - Colombia
        </p>
        <div className="footer-links">
          <a href="/privacidad">Privacidad</a>
          <a href="/terminos">Términos</a>
          <a href="/contacto">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
