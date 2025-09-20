import { Card } from "@/components/ui/card";
import { Brain, Zap, Target, Users, BarChart3, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Semantic Matching",
    description: "Our advanced LLM understands context, not just keywords. It reads between the lines to find true skill alignment.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Lightning Fast Results",
    description: "Get comprehensive relevance scores in under 5 seconds. No more waiting hours for manual reviews.",
    color: "text-secondary"
  },
  {
    icon: Target,
    title: "Precision Scoring (0-100)",
    description: "Every resume gets a clear, numerical score with detailed breakdowns of strengths and gaps.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Recruiter Dashboard",
    description: "Searchable, sortable candidate database with filtering by score, skills, experience, and more.",
    color: "text-secondary"
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Understand hiring patterns, identify skill gaps, and optimize your job descriptions for better matches.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Bias-Free Evaluation",
    description: "Consistent, fair assessment based on qualifications alone. Reduce unconscious bias in your hiring process.",
    color: "text-secondary"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Features for <span className="text-primary">Modern Recruiting</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MatchMaker AI combines cutting-edge technology with proven recruitment principles to deliver 
            unmatched accuracy and speed in candidate evaluation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 hover:shadow-corporate transition-all duration-300 group border-border/50 hover:border-primary/30"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-foreground mb-12">
            How It Works
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Upload JD", desc: "Paste or upload your job description" },
              { step: "02", title: "Add Resumes", desc: "Upload candidate resumes in any format" },
              { step: "03", title: "AI Analysis", desc: "Our engine analyzes and scores matches" },
              { step: "04", title: "Get Results", desc: "Review scores, gaps, and recommendations" }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto text-white font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};