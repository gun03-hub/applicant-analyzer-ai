import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Briefcase, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UploadSection = () => {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (file.type === 'text/plain') {
          resolve(text);
        } else {
          // For other file types, we'll need the user to copy-paste for now
          // In a real implementation, you'd use PDF.js, mammoth.js, etc.
          reject(new Error(`File type ${file.type} requires server-side processing. Please save as .txt file and upload again.`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

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

  const handleAnalyze = async () => {
    if (!jobDescription || !resume) {
      toast({
        title: "Missing Files",
        description: "Please upload both a job description and resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Extract text from uploaded files
      const [jdText, resumeText] = await Promise.all([
        extractTextFromFile(jobDescription),
        extractTextFromFile(resume)
      ]);

      // Call the AI analysis function
      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          jobDescription: jdText,
          resumeText: resumeText
        }
      });

      if (error) {
        throw error;
      }

      setResults(data);
      toast({
        title: "Analysis Complete!",
        description: `Match score: ${data.relevanceScore}%. View detailed results below.`,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "There was an error analyzing your files. Please try again with .txt files.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
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
              <p className="text-muted-foreground">Upload job description file (.txt format recommended)</p>
              
              {jobDescription ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-primary">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{jobDescription.name}</span>
                  </div>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setJobDescription(null)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Remove file
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
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
              <p className="text-muted-foreground">Upload resume file (.txt format recommended)</p>
              
              {resume ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-secondary">
                    <FileText className="w-4 h-4" />
                    <span className="font-medium">{resume.name}</span>
                  </div>
                  <Button
                    variant="ghost" 
                    size="sm"
                    onClick={() => setResume(null)}
                    className="text-muted-foreground hover:text-secondary"
                  >
                    Remove file
                  </Button>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
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

        {/* Results Section */}
        {results && (
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">Analysis Results</h3>
                <div className="text-4xl font-bold text-primary mb-2">{results.relevanceScore}%</div>
                <p className="text-muted-foreground">Relevance Score</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Matched Skills</h4>
                  <div className="space-y-2">
                    {results.matchedSkills.map((skill: string, index: number) => (
                      <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Missing Skills</h4>
                  <div className="space-y-2">
                    {results.missingSkills.map((skill: string, index: number) => (
                      <div key={index} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {results.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="text-sm text-muted-foreground bg-background/50 p-2 rounded">
                        • {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};