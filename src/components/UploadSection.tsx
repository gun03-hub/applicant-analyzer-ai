import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Briefcase, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UploadSection = () => {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (file: File, type: 'jd' | 'resume') => {
    if (type === 'jd') {
      setJobDescription(file);
      toast({
        title: "Job Description Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      setResume(file);
      toast({
        title: "Resume Uploaded", 
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const handleAnalyze = () => {
    if (!jobDescription || !resume) {
      toast({
        title: "Missing Files",
        description: "Please upload both a job description and resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete!",
        description: "Your resume match analysis is ready.",
      });
    }, 3000);
  };

  return (
    <section id="upload-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Upload & Analyze in <span className="text-secondary">Seconds</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your job description and resume to get instant relevance scoring and detailed feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Job Description Upload */}
          <Card className="p-8 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors group">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Job Description</h3>
              <p className="text-muted-foreground">Upload the job description you want to match against</p>
              
              {jobDescription ? (
                <div className="flex items-center justify-center space-x-2 text-primary">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{jobDescription.name}</span>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'jd')}
                    className="hidden"
                    id="jd-upload"
                  />
                  <label htmlFor="jd-upload">
                    <Button variant="corporate" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Job Description
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </Card>

          {/* Resume Upload */}
          <Card className="p-8 border-2 border-dashed border-secondary/30 hover:border-secondary/50 transition-colors group">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Resume/CV</h3>
              <p className="text-muted-foreground">Upload the candidate's resume for analysis</p>
              
              {resume ? (
                <div className="flex items-center justify-center space-x-2 text-secondary">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">{resume.name}</span>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'resume')}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload">
                    <Button variant="orange" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Resume
                      </span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Analysis Button */}
        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-12 py-6"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription || !resume}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Match
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};