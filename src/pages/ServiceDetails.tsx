import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '@/src/lib/firebase';
import { useAuth } from '@/src/hooks/useAuth';
import { ServiceListing, UserProfile } from '@/src/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowLeft, Star, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, login } = useAuth();
  
  const [service, setService] = useState<ServiceListing | null>(null);
  const [provider, setProvider] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'services', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const serviceData = { id: snap.id, ...snap.data() } as ServiceListing;
          setService(serviceData);
          
          // Fetch provider profile
          const userRef = doc(db, 'users', serviceData.providerId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setProvider({ uid: userSnap.id, ...userSnap.data() } as UserProfile);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleRequest = async () => {
    if (!user || !service || !id) {
      login();
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please describe what you need help with.');
      return;
    }

    setRequesting(true);
    try {
      await addDoc(collection(db, 'requests'), {
        seekerId: user.uid,
        seekerName: user.displayName || 'Anonymous',
        providerId: service.providerId,
        providerName: service.providerName,
        serviceId: id,
        serviceTitle: service.title,
        status: 'pending',
        description: description,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      toast.success('Service request sent successfully!');
      navigate('/requests');
    } catch (e) {
      handleFirestoreError(e, 'create', '/requests');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Service not found.</p>
        <Button variant="link" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const isOwnService = user?.uid === service.providerId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to listings
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{service.category}</Badge>
              <Badge variant="secondary">{service.priceRange || 'Contact for price'}</Badge>
            </div>
            <h1 className="text-4xl font-bold">{service.title}</h1>
            <p className="text-lg whitespace-pre-wrap leading-relaxed">{service.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Request this service</CardTitle>
              <CardDescription>
                Briefly explain your problem or what you need help with. The provider will reach out to you once they accept the request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isOwnService ? (
                <div className="p-4 bg-muted rounded-md text-sm text-center">
                  This is your own service listing.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Your Problem / Request details</Label>
                    <Textarea 
                      id="desc" 
                      placeholder="E.g. My laptop screen is flickering... I need help installing Photoshop..." 
                      className="min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={requesting} 
                    onClick={handleRequest}
                  >
                    {requesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {user ? 'Send Service Request' : 'Log in to Request'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Provider Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-2 border-2 border-primary/20">
                <AvatarImage src={provider?.photoURL || ''} />
                <AvatarFallback className="text-xl">{provider?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <CardTitle>{provider?.displayName}</CardTitle>
              <CardDescription>IT Service Provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{provider?.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-muted-foreground">({provider?.totalReviews || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Joined {provider?.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
                </div>
              </div>
              
              {provider?.bio && (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About Provider</Label>
                  <p className="text-sm italic">"{provider.bio}"</p>
                </div>
              )}

              {provider?.skills && provider.skills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expertise</Label>
                  <div className="flex flex-wrap gap-1">
                    {provider.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-[10px] uppercase font-bold tracking-tight">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
