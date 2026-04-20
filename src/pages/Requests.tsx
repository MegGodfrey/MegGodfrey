import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db, handleFirestoreError } from '@/src/lib/firebase';
import { useAuth } from '@/src/hooks/useAuth';
import { ServiceRequest } from '@/src/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RequestsManagement() {
  const { user } = useAuth();
  const [requestsAsSeeker, setRequestsAsSeeker] = useState<ServiceRequest[]>([]);
  const [requestsAsProvider, setRequestsAsProvider] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const qSeeker = query(collection(db, 'requests'), where('seekerId', '==', user.uid));
    const unsubscribeSeeker = onSnapshot(qSeeker, (snap) => {
      setRequestsAsSeeker(snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceRequest)));
    });

    const qProvider = query(collection(db, 'requests'), where('providerId', '==', user.uid));
    const unsubscribeProvider = onSnapshot(qProvider, (snap) => {
      setRequestsAsProvider(snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceRequest)));
      setLoading(false);
    });

    return () => {
      unsubscribeSeeker();
      unsubscribeProvider();
    };
  }, [user]);

  const updateStatus = async (requestId: string, status: ServiceRequest['status']) => {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status,
        updatedAt: serverTimestamp()
      });
      toast.success(`Request marked as ${status}`);
    } catch (e) {
      handleFirestoreError(e, 'update', `/requests/${requestId}`);
    }
  };

  const getStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'accepted': return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Accepted</Badge>;
      case 'in-progress': return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">In Progress</Badge>;
      case 'completed': return <Badge variant="secondary" className="bg-green-100 text-green-700">Completed</Badge>;
      case 'cancelled': return <Badge variant="secondary" className="bg-red-100 text-red-700">Cancelled</Badge>;
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      <h1 className="text-3xl font-bold">My Service Requests</h1>
      
      <Tabs defaultValue="seeker">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="seeker" className="text-xs sm:text-sm">Help I Need</TabsTrigger>
          <TabsTrigger value="provider" className="text-xs sm:text-sm">Services I Provide</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seeker" className="mt-6 space-y-6">
          {requestsAsSeeker.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">You haven't requested any services yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requestsAsSeeker.sort((a, b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis()).map(req => (
                <RequestCard 
                  key={req.id} 
                  request={req} 
                  isProvider={false} 
                  onStatusUpdate={updateStatus}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="provider" className="mt-6 space-y-6">
           {requestsAsProvider.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg border-2 border-dashed">
              <p className="text-muted-foreground">No one has requested your services yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {requestsAsProvider.sort((a, b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis()).map(req => (
                <RequestCard 
                  key={req.id} 
                  request={req} 
                  isProvider={true} 
                  onStatusUpdate={updateStatus}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface RequestCardProps {
  request: ServiceRequest;
  isProvider: boolean;
  onStatusUpdate: (id: string, s: ServiceRequest['status']) => void;
  getStatusBadge: (s: ServiceRequest['status']) => React.ReactNode;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, isProvider, onStatusUpdate, getStatusBadge }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const submitReview = async () => {
    setIsSubmittingReview(true);
    try {
      const reviewRef = doc(collection(db, 'reviews'));
      
      await runTransaction(db, async (transaction) => {
        // 1. Get current provider profile
        const providerRef = doc(db, 'users', request.providerId);
        const providerSnap = await transaction.get(providerRef);
        
        if (!providerSnap.exists()) throw new Error("Provider not found");
        
        const providerData = providerSnap.data();
        const currentTotal = providerData.totalReviews || 0;
        const currentAvg = providerData.averageRating || 0;
        
        const newTotal = currentTotal + 1;
        const newAvg = (currentAvg * currentTotal + rating) / newTotal;

        // 2. Create review
        transaction.set(reviewRef, {
          id: reviewRef.id,
          requestId: request.id,
          providerId: request.providerId,
          seekerId: request.seekerId,
          rating,
          comment,
          createdAt: serverTimestamp()
        });

        // 3. Update provider stats
        transaction.update(providerRef, {
          totalReviews: newTotal,
          averageRating: newAvg
        });

        // 4. Update request with reviewId
        transaction.update(doc(db, 'requests', request.id), {
          reviewId: reviewRef.id,
          updatedAt: serverTimestamp()
        });
      });
      
      toast.success('Review submitted! Thank you.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">{request.serviceTitle}</CardTitle>
          <CardDescription>
            {isProvider ? `From: ${request.seekerName}` : `Provider: ${request.providerName}`}
          </CardDescription>
        </div>
        <div className="flex shrink-0">
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm border-l-4 border-primary/20 pl-4 italic bg-muted/30 py-2 rounded-r-md">"{request.description}"</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><Clock className="w-3 h-3" />Requested: {request.createdAt?.toDate().toLocaleDateString()}</div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end pt-2 border-t mt-4">
        {isProvider ? (
          <>
            {request.status === 'pending' && <Button size="sm" onClick={() => onStatusUpdate(request.id, 'accepted')}>Accept</Button>}
            {request.status === 'accepted' && <Button size="sm" variant="outline" onClick={() => onStatusUpdate(request.id, 'in-progress')}>Start Work</Button>}
            {request.status === 'in-progress' && <Button size="sm" onClick={() => onStatusUpdate(request.id, 'completed')}>Mark Completed</Button>}
            {['pending', 'accepted'].includes(request.status) && <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => onStatusUpdate(request.id, 'cancelled')}>Cancel</Button>}
          </>
        ) : (
          <>
            {request.status === 'pending' && <Button size="sm" variant="outline" onClick={() => onStatusUpdate(request.id, 'cancelled')}>Cancel Request</Button>}
            {request.status === 'completed' && !request.reviewId && (
              <Dialog>
                <DialogTrigger render={<Button size="sm" />}>
                  Rate Service
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rate the service</DialogTitle>
                    <DialogDescription>Let others know how {request.providerName} performed.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-8 h-8 cursor-pointer transition-colors ${rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Your Feedback</Label>
                      <Textarea 
                        placeholder="Was the problem resolved? Friendly provider?" 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button disabled={isSubmittingReview} onClick={submitReview}>
                      {isSubmittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit Review
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {request.reviewId && <Badge variant="outline" className="text-green-600 border-green-600">Rated</Badge>}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
