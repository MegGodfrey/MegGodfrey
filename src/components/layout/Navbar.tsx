import { Link } from 'react-router-dom';
import { useAuth } from '@/src/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Monitor, User as UserIcon, LogOut, ClipboardList, Menu } from 'lucide-react';

export default function Navbar() {
  const { user, profile, login, logout } = useAuth();

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
                {user && (
                   <Link to="/requests" className="text-lg font-medium hover:text-primary transition-colors">
                    My Requests
                  </Link>
                )}
                <Link to="/profile" className="text-lg font-medium hover:text-primary transition-colors">
                  Profile
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
              {!user && (
                <div className="mt-auto pt-6 border-t">
                  <Link to="/login" className="block">
                    <Button className="w-full py-6 text-lg">
                      Sign In with Google
                    </Button>
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight text-primary">
            <Monitor className="w-6 h-6" />
            <span>StudentServe</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-10 w-10 rounded-full" />}>
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={<Link to="/profile" />}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link to="/requests" />}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      <span>My Requests</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm" className="px-6 font-bold">Log In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
