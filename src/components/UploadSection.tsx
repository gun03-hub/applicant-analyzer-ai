import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Briefcase, Sparkles, Copy, ClipboardPaste } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UploadSection = () => {
  const [jobDescription, setJobDescription] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [resumeText, setResumeText] = useState("");
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

  const pasteFromClipboard = async (setter: (v: string) => void, label: string) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
      toast({ title: "Pasted from clipboard", description: `${label} text added.` });
    } catch (err: any) {
      toast({ title: "Paste failed", description: err.message || "Permission denied for clipboard.", variant: "destructive" });
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
    } catch (err: any) {
      toast({ title: "Copy failed", description: err.message || "Unable to copy to clipboard.", variant: "destructive" });
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    try {
      let jdTextFinal = jobDescriptionText.trim();
      let resumeTextFinal = resumeText.trim();

      if (!jdTextFinal) {
        if (jobDescription) {
          jdTextFinal = await extractTextFromFile(jobDescription);
        }
      }
      if (!resumeTextFinal) {
        if (resume) {
          resumeTextFinal = await extractTextFromFile(resume);
        }
      }

      if (!jdTextFinal || !resumeTextFinal) {
        toast({
          title: "Missing input",
          description: "Provide text or upload files for both job description and resume.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: {
          jobDescription: jdTextFinal,
          resumeText: resumeTextFinal,
        },
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
        description: error.message || "There was an error analyzing your input.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = (jobDescriptionText.trim().length > 0 || !!jobDescription) && (resumeText.trim().length > 0 || !!resume);

  return (
    <section id="upload-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Upload & Analyze in <span className="text-secondary">Seconds</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Paste or upload your job description and resume to get instant relevance scoring and detailed feedback.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Job Description */}
          <Card className="p-8 border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors group">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Job Description</h3>
              <Tabs defaultValue="upload" className="mt-2">
                <TabsList className="mx-auto">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
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
                </TabsContent>
                <TabsContent value="paste">
                  <div className="space-y-3 text-left">
                    <Textarea
                      value={jobDescriptionText}
                      onChange={(e) => setJobDescriptionText(e.target.value)}
                      placeholder="Paste job description text here"
                      className="min-h-[160px]"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => pasteFromClipboard(setJobDescriptionText, 'Job description')}>
                        <ClipboardPaste className="w-4 h-4" /> Paste
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(jobDescriptionText, 'Job description')} disabled={!jobDescriptionText.trim()}>
                        <Copy className="w-4 h-4" /> Copy
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>

          {/* Resume */}
          <Card className="p-8 border-2 border-dashed border-secondary/30 hover:border-secondary/50 transition-colors group">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Resume/CV</h3>
              <Tabs defaultValue="upload" className="mt-2">
                <TabsList className="mx-auto">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
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
                </TabsContent>
                <TabsContent value="paste">
                  <div className="space-y-3 text-left">
                    <Textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste resume text here"
                      className="min-h-[160px]"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => pasteFromClipboard(setResumeText, 'Resume')}>
                        <ClipboardPaste className="w-4 h-4" /> Paste
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(resumeText, 'Resume')} disabled={!resumeText.trim()}>
                        <Copy className="w-4 h-4" /> Copy
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
            disabled={isAnalyzing || !canAnalyze}
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
