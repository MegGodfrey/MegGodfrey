import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Cpu, Globe, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/src/hooks/useAuth';

const CATEGORIES = [
  { name: 'Hardware', icon: Cpu, description: 'Laptop repairs, RAM upgrades, screen replacements.' },
  { name: 'Software', icon: Monitor, description: 'OS installation, software debugging, virus removal.' },
  { name: 'Mobile', icon: Smartphone, description: 'Phone setup, app troubleshooting, basic repairs.' },
  { name: 'Networking', icon: Globe, description: 'WiFi setup, router configuration, LAN issues.' },
];

export default function Dashboard() {
  const { user, login } = useAuth();

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="container mx-auto px-4 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4">Campus IT Support</Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Tech help from <span className="text-primary italic font-serif">students</span>, for students.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Got a broken screen? Software acting up? StudentServe connects you with skilled student technicians right on your campus.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" render={<Link to="/services" />}>
              Browse Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/profile" />}>
              Become a Provider
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">What do you need help with?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <cat.icon className="text-primary w-6 h-6" />
                  </div>
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0 h-auto" render={<Link to={`/services?category=${cat.name}`} />}>
                    View services
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Find a Service', desc: 'Browse various IT services offered by students in your campus.' },
              { step: '02', title: 'Request Help', desc: 'Describe your problem and send a request to a skilled student.' },
              { step: '03', title: 'Rate the Experience', desc: 'Once resolved, rate the service to help others find the best techies.' },
            ].map((item) => (
              <div key={item.step} className="space-y-4">
                <span className="text-5xl font-serif text-primary/20 font-bold">{item.step}</span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust factors */}
      <section className="container mx-auto px-4 flex flex-wrap justify-around gap-8 text-center text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <p className="font-semibold text-foreground">Verified Students</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Star className="w-8 h-8 text-primary" />
          <p className="font-semibold text-foreground">Community Rated</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Monitor className="w-8 h-8 text-primary" />
          <p className="font-semibold text-foreground">Campus Focused</p>
        </div>
      </section>
    </div>
  );
}
