import React from 'react';
import Banner from '../components/Banner';
import AboutSection from '../components/AboutSection';
import Courses from './Courses';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';

const Home = () => {
  return (
    <main>
      <Banner />
      <AboutSection />
      <Courses />
      <Testimonials />
      <ContactForm />
    </main>
  );
};

export default Home;
