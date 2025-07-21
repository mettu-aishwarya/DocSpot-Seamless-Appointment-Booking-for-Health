import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">DocSpot</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Making healthcare accessible and convenient for everyone. 
              Book appointments with trusted healthcare providers in just a few clicks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/doctors" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/specialties" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Specialties
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* For Healthcare Providers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Providers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/join-as-doctor" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Join as Doctor
                </Link>
              </li>
              <li>
                <Link to="/provider-resources" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Provider Resources
                </Link>
              </li>
              <li>
                <Link to="/practice-management" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Practice Management
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-300 hover:text-primary-400 transition-colors text-sm">
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">support@docspot.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-gray-300 text-sm">
                  123 Healthcare Ave<br />
                  Medical District, NY 10001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 DocSpot. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;