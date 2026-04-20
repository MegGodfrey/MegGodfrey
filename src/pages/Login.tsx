import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, LogIn } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { user, login, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Monitor className="w-10 h-10 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
              <CardDescription className="text-base">
                Sign in to your StudentServe account to manage services and requests.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              size="lg" 
              onClick={login} 
              className="w-full py-7 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            
            <p className="text-sm text-center text-muted-foreground px-8">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
            
            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Secure Authentication
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
