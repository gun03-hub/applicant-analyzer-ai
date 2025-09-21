import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ContactSales() {
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '');
    toast({ title: 'Request sent', description: `Thanks ${name}, our team will reach out shortly.` });
    e.currentTarget.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Contact Sales</h1>
            <p className="text-muted-foreground mb-8">Tell us about your hiring needs and a specialist will contact you.</p>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team size</Label>
                  <Input id="teamSize" name="teamSize" type="number" min={1} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Share your goals, timelines, or questions" className="min-h-[140px]" />
              </div>
              <Button variant="hero" className="w-full">Send request</Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
