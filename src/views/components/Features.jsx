import React from 'react';
import { FaCalendarAlt, FaUserCheck, FaEye, FaRocket, FaComments, FaMobileAlt } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: <FaCalendarAlt />,
      title: "Programas Flexibles",
      description: "Aprende a tu propio ritmo con horarios adaptables."
    },
    {
      icon: <FaUserCheck />,
      title: "Acompañamiento Personalizado",
      description: "Mentores y tutores que te guían en cada paso de tu aprendizaje."
    },
    {
      icon: <FaRocket />,
      title: "Resultados Rápidos",
      description: "Obtén certificaciones y habilidades prácticas en poco tiempo."
    },
    {
      icon: <FaComments />,
      title: "Comunidad Activa",
      description: "Conecta y comparte experiencias con otros estudiantes y expertos."
    },
    {
      icon: <FaMobileAlt />,
      title: "Acceso Multiplataforma",
      description: "Estudia desde cualquier dispositivo, en cualquier momento."
    },
    {
      icon: <FaEye />,
      title: "Alta Calidad Visual",
      description: "Disfruta de contenido y diseño visualmente atractivo."
    }
  ];

  return (
    <section className="features" id="caracteristicas">
      <h2>Características</h2>
      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;