import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./controllers/AppRouter";
import Footer from "./views/components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRouter />
        <Footer />
      </div>
    </BrowserRouter>
  );
}
