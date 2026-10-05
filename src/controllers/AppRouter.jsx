import { Routes, Route } from "react-router-dom";
import Home from "../views/pages/Home";
import NotFound from "../views/pages/NotFound";
import Privacidad from "../views/pages/Privacidad";
import Terminos from "../views/pages/Terminos";
import Contacto from "../views/pages/Contacto";
import Seguridad from "../views/pages/Seguridad";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/seguridad" element={<Seguridad />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
