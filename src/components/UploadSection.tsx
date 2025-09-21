import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Briefcase, Sparkles, Type, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UploadSection = () => {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [jdInputMode, setJdInputMode] = useState<'file' | 'text'>('file');
  const [resume, setResume] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
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

  const handleAnalyze = async () => {
    const hasJobDescription = jobDescription || jobDescriptionText.trim();
    if (!hasJobDescription || !resume) {
      toast({
        title: "Missing Information",
        description: "Please provide both a job description and upload a resume to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // For now, simulate AI analysis
      // TODO: Replace with actual AI API call when backend is connected
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock results
      const mockResults = {
        relevanceScore: Math.floor(Math.random() * 30) + 70, // 70-100
        matchedSkills: ["React", "TypeScript", "Node.js", "Python"],
        missingSkills: ["Machine Learning", "AWS", "Docker"],
        recommendations: [
          "Add more specific project examples",
          "Include quantifiable achievements",
          "Highlight relevant certifications"
        ]
      };
      
      setResults(mockResults);
      toast({
        title: "Analysis Complete!",
        description: `Match score: ${mockResults.relevanceScore}%. View detailed results below.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your resume. Please try again.",
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
              <p className="text-muted-foreground">Upload file or paste job description text</p>
              
              {/* Toggle between file and text input */}
              <div className="flex justify-center space-x-2 mb-4">
                <Button
                  variant={jdInputMode === 'file' ? 'corporate' : 'outline'}
                  size="sm"
                  onClick={() => setJdInputMode('file')}
                >
                  <FileUp className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                <Button
                  variant={jdInputMode === 'text' ? 'corporate' : 'outline'}
                  size="sm"
                  onClick={() => setJdInputMode('text')}
                >
                  <Type className="w-4 h-4 mr-2" />
                  Paste Text
                </Button>
              </div>

              {jdInputMode === 'file' ? (
                jobDescription ? (
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
                )
              ) : (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Paste or type the job description here..."
                    value={jobDescriptionText}
                    onChange={(e) => setJobDescriptionText(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  {jobDescriptionText && (
                    <p className="text-sm text-muted-foreground">
                      {jobDescriptionText.length} characters
                    </p>
                  )}
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
            disabled={isAnalyzing || (!jobDescription && !jobDescriptionText.trim()) || !resume}
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