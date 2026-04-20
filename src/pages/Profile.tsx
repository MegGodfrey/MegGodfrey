import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError } from '@/src/lib/firebase';
import { useAuth } from '@/src/hooks/useAuth';
import { ServiceListing, ServiceCategory } from '@/src/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES: ServiceCategory[] = ['Hardware', 'Software', 'Networking', 'Mobile', 'Other'];

export default function Profile() {
  const { user, profile } = useAuth();
  const [myServices, setMyServices] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile edit state
  const [bio, setBio] = useState('');
  const [skillsStr, setSkillsStr] = useState('');

  // New service state
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: 'Software' as ServiceCategory,
    priceRange: ''
  });

  useEffect(() => {
    if (!user) return;
    
    async function fetchServices() {
      try {
        const q = query(collection(db, 'services'), where('providerId', '==', user.uid));
        const snap = await getDocs(q);
        setMyServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceListing)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchServices();
    if (profile) {
      setBio(profile.bio || '');
      setSkillsStr(profile.skills?.join(', ') || '');
    }
  }, [user, profile]);

  const updateProfileData = async () => {
    if (!user) return;
    const skills = skillsStr.split(',').map(s => s.trim()).filter(s => s !== '');
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bio,
        skills,
        updatedAt: serverTimestamp()
      });
      toast.success('Profile updated!');
      setIsEditingProfile(false);
    } catch (e) {
      handleFirestoreError(e, 'update', `/users/${user.uid}`);
    }
  };

  const addService = async () => {
    if (!user) return;
    if (!newService.title || !newService.description) {
      toast.error('Title and description are required.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...newService,
        providerId: user.uid,
        providerName: user.displayName || 'Anonymous',
        createdAt: serverTimestamp()
      });
      setMyServices([...myServices, { id: docRef.id, ...newService, providerId: user.uid, providerName: user.displayName || 'Anonymous', createdAt: null as any }]);
      toast.success('Service added successfully!');
      setIsAdding(false);
      setNewService({ title: '', description: '', category: 'Software', priceRange: '' });
    } catch (e) {
      handleFirestoreError(e, 'create', '/services');
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      setMyServices(myServices.filter(s => s.id !== serviceId));
      toast.success('Service deleted.');
    } catch (e) {
      handleFirestoreError(e, 'delete', `/services/${serviceId}`);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      {/* Profile Header */}
      <Card className="bg-primary/5">
        <CardHeader className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            <img src={user?.photoURL || ''} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{user?.displayName}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                {isEditingProfile ? 'Cancel' : <><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</>}
              </Button>
            </div>
            
            {isEditingProfile ? (
              <div className="space-y-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell students about your expertise..." />
                </div>
                <div className="space-y-2">
                  <Label>Skills (comma separated)</Label>
                  <Input value={skillsStr} onChange={e => setSkillsStr(e.target.value)} placeholder="E.g. Python, Laptop Repair, Web Dev" />
                </div>
                <Button onClick={updateProfileData} className="w-full md:w-auto"><Save className="w-4 h-4 mr-2" /> Save Profile</Button>
              </div>
            ) : (
              <>
                <p className="italic text-muted-foreground max-w-xl">
                  {profile?.bio || 'No bio yet. Tell the campus what you can do!'}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {profile?.skills?.map((skill: string) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                     )) || <span className="text-xs text-muted-foreground">No skills listed yet.</span>}
                </div>
              </>
            )}

            <div className="flex items-center gap-2 pt-2 text-sm justify-center md:justify-start">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-lg">{profile?.averageRating?.toFixed(1) || '0.0'}</span>
              <span className="text-muted-foreground">({profile?.totalReviews || 0} reviews)</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Services Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Service Listings</h2>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger render={<Button />}>
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Offer a new service</DialogTitle>
                <DialogDescription>List your IT skills to help other students.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input id="title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} placeholder="E.g. Fast Laptop Hard Drive Upgrade" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cat">Category</Label>
                  <Select value={newService.category} onValueChange={(v: any) => setNewService({...newService, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Pricing Description</Label>
                  <Input id="price" value={newService.priceRange} onChange={e => setNewService({...newService, priceRange: e.target.value})} placeholder="E.g. $20 flat rate + parts" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Detailed Description</Label>
                  <Textarea id="desc" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="What exactly do you offer? How long does it take?" className="min-h-[100px]" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addService}>Publish Service</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {myServices.length === 0 ? (
          <div className="text-center py-16 bg-muted rounded-xl border-4 border-dashed">
            <h3 className="text-lg font-semibold mb-2">No services yet</h3>
            <p className="text-muted-foreground mb-4">Start offering your skills to build your campus reputation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myServices.map(service => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">{service.category}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => deleteService(service.id)} className="text-destructive h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm line-clamp-2 text-muted-foreground">{service.description}</p>
                </CardContent>
                <CardFooter className="justify-between text-xs font-mono">
                  <span className="text-primary font-bold">{service.priceRange || 'Contact for price'}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
