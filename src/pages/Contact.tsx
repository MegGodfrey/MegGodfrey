import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have a specific issue or feedback for the StudentServe platform? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <Card className="border-none shadow-none bg-muted/30">
               <CardHeader className="flex flex-row items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <Mail className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <CardTitle className="text-lg">Email Us</CardTitle>
                   <CardDescription>support@studentserve.edu</CardDescription>
                 </div>
               </CardHeader>
            </Card>

            <Card className="border-none shadow-none bg-muted/30">
               <CardHeader className="flex flex-row items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <MessageSquare className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <CardTitle className="text-lg">Live Chat</CardTitle>
                   <CardDescription>Available Mon-Fri, 9am-5pm</CardDescription>
                 </div>
               </CardHeader>
            </Card>

            <Card className="border-none shadow-none bg-muted/30">
               <CardHeader className="flex flex-row items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                   <MapPin className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <CardTitle className="text-lg">Office</CardTitle>
                   <CardDescription>Student Union, Room 402</CardDescription>
                 </div>
               </CardHeader>
            </Card>
          </div>
        </div>

        {/* Contact form */}
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll reply to your campus email.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Campus Email</Label>
                  <Input id="email" type="email" placeholder="j.doe@university.edu" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Feedback / Bug Report / Account Issue" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you today?" className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
