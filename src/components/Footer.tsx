import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/10 bg-black/80 backdrop-blur-xl mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-light text-white tracking-tight">PromptX</h3>
            <p className="text-sm text-zinc-400 font-light leading-relaxed">
              Advanced AI prompt engineering platform for creating perfect prompts with intelligent suggestions.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white tracking-wide">PRODUCT</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  API
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white tracking-wide">COMPANY</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-white tracking-wide">LEGAL</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 font-light">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-500 font-light">
              © {new Date().getFullYear()} PromptX. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-6">
              <a 
                href="#" 
                className="text-zinc-400 hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-zinc-400 hover:text-white transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-zinc-400 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-zinc-400 hover:text-white transition-colors duration-300"
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