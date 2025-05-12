import React from 'react';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Calculator from './components/Calculator';
import Hero from './components/Hero';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <div id="calculator">
          <Calculator />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
