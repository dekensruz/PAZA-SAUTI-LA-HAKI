import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Team from './components/Team';
import Blog from './components/Blog';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-paza-blue selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <Team />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}

export default App;