import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">MatchMaker AI</h1>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          <Link to="/sign-in">
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
            >
              Sign In
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button
              variant="corporate"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
