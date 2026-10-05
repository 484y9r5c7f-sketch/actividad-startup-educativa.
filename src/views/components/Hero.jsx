import React from 'react';
import principalImg from '../../assets/principal.png';

const Hero = () => (
  <section className="hero-redesign" id="inicio">
    <div className="hero-redesign-container">
      <div className="hero-redesign-left">
        <div className="hero-logo">Edumotion</div>
        <h1 className="hero-title">Digital Learning Made Easy</h1>
        <p className="hero-desc">Discover a new way to learn with engaging video courses tailored to your needs.</p>
        <a href="#cursos" className="hero-btn">Get Started</a>
      </div>
      <div className="hero-redesign-right">
        <img src={principalImg} alt="Digital learning illustration" className="hero-redesign-img" />
      </div>
    </div>
  </section>
);

export default Hero;