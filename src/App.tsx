import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/src/hooks/useAuth';
import Navbar from '@/src/components/layout/Navbar';
import Dashboard from '@/src/pages/Dashboard';
import ServicesListing from '@/src/pages/ServicesListing';
import ServiceDetails from '@/src/pages/ServiceDetails';
import RequestsManagement from '@/src/pages/Requests';
import Profile from '@/src/pages/Profile';
import Login from '@/src/pages/Login';
import About from '@/src/pages/About';
import FAQ from '@/src/pages/FAQ';
import Contact from '@/src/pages/Contact';
import Terms from '@/src/pages/Terms';
import Footer from '@/src/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/services" element={<ServicesListing />} />
              <Route path="/services/:id" element={<ServiceDetails />} />
              <Route path="/requests" element={<RequestsManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

