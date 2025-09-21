import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SignUp() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const plan = params.get("plan") || "starter";

  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "").trim();

    if (!name || !email || !password) {
      toast({ title: "Missing info", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Account created", description: `Welcome, ${name}` });
      const amount = plan === "pro" ? 3900 : 0;
      if (amount > 0) {
        navigate(`/pay?plan=${plan}&amount=${amount}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
      } else {
        navigate("/");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-sm text-muted-foreground mb-6">Selected plan: <span className="font-semibold uppercase">{plan}</span></p>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" type="text" placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" />
              </div>
              <Button className="w-full" variant="hero" disabled={loading}>{loading ? "Creating..." : "Get started"}</Button>
            </form>
            <p className="text-sm text-muted-foreground mt-6">
              Already have an account? <a href="/sign-in" className="text-primary underline">Sign in</a>
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
