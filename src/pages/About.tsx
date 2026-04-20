import { motion } from 'motion/react';
import { ShieldCheck, Users, Zap, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-24">
      {/* Mission Section */}
      <section className="max-w-3xl mx-auto text-center space-y-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Empowering Campus Connections</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            StudentServe was born out of a simple observation: campuses are full of talented tech enthusiasts and people who need tech help. We bridge that gap by providing a secure, student-only marketplace for IT support.
          </p>
        </motion.div>
      </section>

      {/* Values */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Users, title: 'Community First', desc: 'Building trust among peers within the campus environment.' },
          { icon: ShieldCheck, title: 'Verified Skills', desc: 'Every provider is a student with a verified campus email.' },
          { icon: Zap, title: 'On-Campus Speed', desc: 'Get help where you live and study—no long wait times.' },
          { icon: Heart, title: 'Student Growth', desc: 'Helping skilled students build their professional portfolios.' },
        ].map((item, idx) => (
          <motion.div 
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-2xl bg-muted/50 space-y-4"
          >
            <item.icon className="w-10 h-10 text-primary" />
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Our Story */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Founded by a group of Information Technology students who tired of seeing their peers pay exorbitant prices at retail repair shops, StudentServe is designed to keep technical services affordable and accessible. 
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe that university is the perfect place to foster gig-economy skills while solving real-world problems for our neighbors in the dorms and lecture halls.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px]">
          <img 
            src="https://picsum.photos/seed/tech-support/800/600" 
            alt="Technological staff work" 
            className="w-full h-full object-cover shadow-inner"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>
    </div>
  );
}
