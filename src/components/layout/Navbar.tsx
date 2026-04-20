import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Monitor, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" /> StudentServe
                </SheetTitle>
                <SheetDescription>
                  Campus IT Support Marketplace
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-8">
                <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
                  Home
                </Link>
                <Link to="/services" className="text-lg font-medium hover:text-primary transition-colors">
                  Find Services
                </Link>
                <Link to="/profile" className="text-lg font-medium hover:text-primary transition-colors">
                  Become a Provider
                </Link>
                <div className="border-t pt-4 mt-2 space-y-4">
                  <Link to="/about" className="text-lg font-medium hover:text-primary transition-colors block">
                    About Us
                  </Link>
                  <Link to="/faq" className="text-lg font-medium hover:text-primary transition-colors block">
                    FAQ
                  </Link>
                  <Link to="/contact" className="text-lg font-medium hover:text-primary transition-colors block">
                    Contact Support
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight text-primary">
            <Monitor className="w-6 h-6" />
            <span>StudentServe</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/services">
            <Button size="sm" variant="outline">Browse Services</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
