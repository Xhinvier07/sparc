import React from 'react';
import { FaLeaf, FaEnvelope, FaLightbulb, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="SPARC Logo" className="h-8 w-auto" />
              <h2 className="text-xl font-bold">SPARC</h2>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Track and analyze your electricity consumption to save money and 
              reduce your environmental footprint.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Energy Saving Tips */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <FaLeaf className="mr-2 text-green-400" />
              Energy-Saving Tips
            </h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li className="flex items-start">
                <FaLightbulb className="text-accent mr-2 mt-1 flex-shrink-0" />
                <span>Use energy-efficient LED bulbs throughout your home</span>
              </li>
              <li className="flex items-start">
                <FaLightbulb className="text-accent mr-2 mt-1 flex-shrink-0" />
                <span>Unplug electronics and chargers when not in use</span>
              </li>
              <li className="flex items-start">
                <FaLightbulb className="text-accent mr-2 mt-1 flex-shrink-0" />
                <span>Set air conditioners to energy-efficient temperatures (24-26°C)</span>
              </li>
              <li className="flex items-start">
                <FaLightbulb className="text-accent mr-2 mt-1 flex-shrink-0" />
                <span>Use natural light during the day instead of artificial lighting</span>
              </li>
              <li className="flex items-start">
                <FaLightbulb className="text-accent mr-2 mt-1 flex-shrink-0" />
                <span>Run full loads in washing machines and dishwashers</span>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4">
              <FaEnvelope className="mr-2 text-blue-400" />
              Contact Us
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Have questions or suggestions? Reach out to us at:
            </p>
            <a href="mailto:support@sparc-calculator.com" className="text-accent hover:text-accent-dark transition-colors">
              jansenmoral@gmail.com
            </a>
            
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <p className="text-gray-400 text-xs mb-3">Get energy saving tips and updates</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-grow bg-gray-800 text-white px-3 py-2 rounded-l text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <button className="bg-accent text-primary px-3 py-2 rounded-r text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© {currentYear} SPARC by Jansen Moral. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 