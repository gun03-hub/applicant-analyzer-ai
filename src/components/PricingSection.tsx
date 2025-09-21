import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    features: ["10 analyses", "Basic insights", "Email support"],
    cta: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$39",
    period: "/mo",
    features: ["Unlimited analyses", "Advanced insights", "Priority support"],
    cta: "Start Pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "/mo",
    features: ["Unlimited analyses", "Team workspace", "SSO (coming soon)"],
    cta: "Contact Sales",
    highlight: false,
  },
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Choose a plan that fits your hiring workflow.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tiers.map((t) => (
            <Card key={t.name} className={`p-8 border ${t.highlight ? 'border-primary shadow-corporate' : 'border-border'}`}>
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-foreground">{t.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">{t.price}</span>
                    <span className="text-muted-foreground">{t.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  {t.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <Link to={t.cta === 'Contact Sales' ? '/contact-sales' : t.name === 'Pro' ? '/sign-up?plan=pro' : '/sign-up?plan=starter'}>
                    <Button variant={t.highlight ? 'hero' : 'outline'} className="w-full">{t.cta}</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
