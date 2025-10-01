import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative border-t border-white/10 bg-black/90 backdrop-blur-xl mt-auto w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8">
          {/* Brand Section */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-light text-white tracking-tight">PrompX</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xs">
              Advanced AI prompt engineering platform for creating perfect prompts with intelligent suggestions.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-medium text-white tracking-wider">PRODUCT</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <button onClick={() => scrollToSection('features')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('pricing')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('api')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  API
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('documentation')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Documentation
                </button>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-medium text-white tracking-wider">COMPANY</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <button onClick={() => scrollToSection('about')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('blog')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('careers')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-medium text-white tracking-wider">LEGAL</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <button onClick={() => scrollToSection('privacy')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('terms')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('cookies')} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-light block py-1">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-xs sm:text-sm text-zinc-500 font-light text-center sm:text-left">
              © {new Date().getFullYear()} PrompX. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-5 sm:gap-6">
              <a 
                href="https://twitter.com/prompx" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/prompx" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/prompx" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@prompx.com" 
                className="text-zinc-400 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;