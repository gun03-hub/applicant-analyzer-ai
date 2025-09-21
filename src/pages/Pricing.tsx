import { Header } from "@/components/Header";
import { PricingSection } from "@/components/PricingSection";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="py-16 bg-gradient-subtle border-b border-border">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-3">Pricing</h1>
            <p className="text-muted-foreground text-lg">Flexible plans that scale with your hiring needs.</p>
          </div>
        </section>
        <PricingSection />
      </main>
    </div>
  );
}
