import { Link } from 'react-router-dom';
import { Monitor, Facebook, Twitter, Github, Gamepad2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, login } = useAuth();

  return (
    <footer className="border-t bg-muted/30 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight text-primary">
              <Monitor className="w-6 h-6" />
              <span>StudentServe</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Connecting skilled student technicians with fellow students for on-campus IT support and hardware repairs.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Services
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  Become a Provider
                </Link>
              </li>
              {!user && (
                <li className="pt-2 border-t mt-2">
                  <button onClick={login} className="text-primary hover:underline font-medium">
                    Sign In / Join Now
                  </button>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t flex flex-col items-center gap-4 text-sm text-muted-foreground text-center">
          <p>© {currentYear} StudentServe. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-2">
            <span className="hover:text-primary cursor-pointer transition-colors" title="Facebook">
              <Facebook className="w-5 h-5" />
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors" title="Twitter">
              <Twitter className="w-5 h-5" />
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors" title="GitHub">
              <Github className="w-5 h-5" />
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors" title="Discord">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <span className="hover:text-primary cursor-pointer transition-colors" title="WhatsApp">
              <MessageCircle className="w-5 h-5" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
