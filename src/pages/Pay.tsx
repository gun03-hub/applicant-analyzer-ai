import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";

function generateReceiptNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `RCPT-${ts}-${rand}`;
}

export default function Pay() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paid, setPaid] = useState(false);
  const [receiptNo, setReceiptNo] = useState<string | null>(null);

  const plan = params.get("plan") || "pro";
  const amount = Number(params.get("amount") || 3900);
  const email = params.get("email") || "";
  const name = params.get("name") || "";

  const displayAmount = useMemo(() => (amount / 100).toFixed(2), [amount]);

  const [vpa, setVpa] = useState("merchant@upi");
  const [note, setNote] = useState(`MatchMaker ${plan} plan`);

  const upiLink = useMemo(() => {
    const url = new URL("upi://pay");
    url.searchParams.set("pa", vpa);
    url.searchParams.set("pn", name || "MatchMaker");
    url.searchParams.set("am", (amount / 100).toFixed(2));
    url.searchParams.set("cu", "INR");
    url.searchParams.set("tn", note);
    return url.toString();
  }, [vpa, name, amount, note]);

  const qrUrl = useMemo(() => {
    const encoded = encodeURIComponent(upiLink);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`;
  }, [upiLink]);

  const markPaid = () => {
    const r = generateReceiptNumber();
    setReceiptNo(r);
    setPaid(true);
    const receipt = {
      receipt_number: r,
      name,
      email,
      plan,
      amount_cents: amount,
      currency: "INR",
      issued_at: new Date().toISOString(),
      note,
    };
    localStorage.setItem(`receipt:${r}`, JSON.stringify(receipt));
    toast({ title: "Payment confirmed", description: `Receipt ${r} generated.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-8">
            <h1 className="text-2xl font-bold text-foreground">Pay for {plan.toUpperCase()}</h1>
            <p className="text-muted-foreground mt-1">Amount: ₹{displayAmount}</p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vpa">UPI ID (VPA)</Label>
                <Input id="vpa" value={vpa} onChange={(e) => setVpa(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <img src={qrUrl} alt="Payment QR" className="rounded-md border border-border" />
              <p className="text-xs text-muted-foreground">Scan with your UPI app to pay ₹{displayAmount}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="hero" onClick={markPaid} disabled={paid}>I have paid</Button>
              <Button variant="outline" onClick={() => navigate("/pricing")}>Back to Pricing</Button>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Receipt</h2>
            {!paid ? (
              <p className="text-muted-foreground">Complete payment to generate your receipt.</p>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Receipt #</span>
                  <span className="font-mono">{receiptNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="uppercase">{plan}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span>₹{displayAmount} INR</span>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button onClick={() => window.print()} variant="outline">Print / Save PDF</Button>
                  <Button onClick={() => navigate("/")} variant="corporate">Finish</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
