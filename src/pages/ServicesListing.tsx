import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { ServiceListing } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

export default function ServicesListing() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        let q = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
        
        if (categoryFilter) {
          q = query(collection(db, 'services'), where('category', '==', categoryFilter), orderBy('createdAt', 'desc'));
        }
        
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceListing));
        setServices(fetched);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchServices();
  }, [categoryFilter]);

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">IT Services</h1>
          <p className="text-muted-foreground">Find the right expert for your tech problems.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search services..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {categoryFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          <Badge variant="secondary" className="pr-1">
            {categoryFilter}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto p-0 ml-1 hover:bg-transparent"
              render={<Link to="/services" />}
            >
              ×
            </Button>
          </Badge>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{service.category}</Badge>
                  <span className="text-sm font-semibold text-primary">{service.priceRange || 'Contact for price'}</span>
                </div>
                <CardTitle className="line-clamp-1">{service.title}</CardTitle>
                <CardDescription className="line-clamp-2">{service.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto border-t pt-4 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">By: {service.providerName}</span>
                <Button variant="default" size="sm" render={<Link to={`/services/${service.id}`} />}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">No services found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
