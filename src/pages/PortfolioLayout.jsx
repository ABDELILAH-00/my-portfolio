import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AntigravityBackground from '../components/ui/AntigravityBackground';

const PortfolioLayout = () => {
  return (
    <div className="relative w-full min-h-screen font-sans bg-transparent">
      <AntigravityBackground />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioLayout;
