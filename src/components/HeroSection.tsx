import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-matchmaker.jpg";
import { CheckCircle } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-primary font-medium text-sm">🚀 AI-Powered Resume Matching</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Stop Wading Through 
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Thousands</span> of Resumes
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                MatchMaker AI reads resumes like a seasoned recruiter and scores them against any job description in seconds. Get instant, fair feedback and find the perfect candidates faster.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Start Matching Resumes
              </Button>
              <Button variant="outline-corporate" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="text-foreground font-medium">Instant Scoring (0-100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="text-foreground font-medium">Missing Skills Detection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="text-foreground font-medium">Actionable Feedback</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="lg:pl-12">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-corporate">
              <h3 className="text-2xl font-bold text-foreground mb-6">Recruitment Made Simple</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gradient-primary rounded-xl">
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-primary-foreground/80 text-sm mt-1">Accuracy Rate</div>
                </div>
                <div className="text-center p-4 bg-gradient-secondary rounded-xl">
                  <div className="text-3xl font-bold text-white">5sec</div>
                  <div className="text-secondary-foreground/80 text-sm mt-1">Average Match Time</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <div className="text-3xl font-bold text-foreground">10K+</div>
                  <div className="text-muted-foreground text-sm mt-1">Resumes Processed</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-muted-foreground text-sm mt-1">Happy Recruiters</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};