import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Building2, Users, ArrowRight, Sparkles, Shield, BarChart3, Zap } from "lucide-react"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">PlaceMe</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Everyone
            </Link>
            <Link href="#ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Features
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </nav>





          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Placement Platform
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
                Streamline Campus Placements with <span className="text-primary">Intelligent Automation</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
                Connect students, companies, and placement cells on a unified platform. Leverage AI for resume analysis,
                job matching, and interview preparation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Start Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign In to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Everyone</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Whether you're a student seeking opportunities, a company hiring talent, or managing the placement cell,
                we've got you covered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="bg-card hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>For Students</CardTitle>
                  <CardDescription>Build your profile, apply to jobs, and track your placement journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      AI-powered resume builder
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Smart job recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Interview preparation coach
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Application status tracking
                    </li>
                  </ul>
                  <Link href="/register?role=student" className="mt-6 block">
                    <Button className="w-full bg-transparent" variant="outline">
                      Register as Student
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow border-primary/50 shadow-primary/10">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>For Placement Cell</CardTitle>
                  <CardDescription>Manage the entire placement process from a single dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Student & company management
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Drive scheduling & tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      AI-powered analytics & reports
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Bulk operations & imports
                    </li>
                  </ul>
                  <Link href="/login" className="mt-6 block">
                    <Button className="w-full">TPO Login</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>For Companies</CardTitle>
                  <CardDescription>Find and hire the best talent from top institutions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      AI-assisted JD creation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Smart candidate matching
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Interview scheduling
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Offer management
                    </li>
                  </ul>
                  <Link href="/register?role=company" className="mt-6 block">
                    <Button className="w-full bg-transparent" variant="outline">
                      Register as Company
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage campus placements efficiently
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Role-Based Access",
                  description: "Secure JWT authentication with granular permissions for each user role",
                },
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description: "Real-time insights into placement statistics, trends, and performance",
                },
                {
                  icon: Zap,
                  title: "Automated Workflows",
                  description: "Streamline applications, shortlisting, and interview scheduling",
                },
                {
                  icon: Sparkles,
                  title: "AI Integration",
                  description: "Gemini-powered features for resume analysis and job matching",
                },
              ].map((feature) => (
                <Card key={feature.title} className="bg-card border-border/50">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Section */}
        <section id="ai" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm mb-4">
                  <Sparkles className="h-4 w-4" />
                  Powered by Gemini AI
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">AI That Works For You</h2>
                <p className="text-muted-foreground">
                  Leverage artificial intelligence across every step of the placement process
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Resume Parser & Builder",
                    description:
                      "Automatically extract skills and experience. Generate professional resume content with AI suggestions.",
                  },
                  {
                    title: "Job Matching & Scoring",
                    description: "Get personalized job recommendations with AI-calculated match scores and gap analysis.",
                  },
                  {
                    title: "Interview Coach",
                    description:
                      "Practice with AI-generated questions. Get personalized tips based on your profile and target role.",
                  },
                  {
                    title: "JD Optimization",
                    description:
                      "Companies get AI assistance in writing clear, attractive job descriptions that attract the right talent.",
                  },
                  {
                    title: "Candidate Ranking",
                    description: "AI analyzes resumes against job requirements to suggest the best-fit candidates.",
                  },
                  {
                    title: "Report Generation",
                    description: "Generate comprehensive placement reports with AI-powered insights and recommendations.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 p-4 rounded-lg bg-card border border-border/50">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-2xl p-8 md:p-12 border border-primary/10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Placements?</h2>
              <p className="text-muted-foreground mb-8">
                Join hundreds of institutions already using PlaceMe for their campus hiring needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
