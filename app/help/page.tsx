import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  GraduationCap,
  Search,
  MessageCircle,
  Mail,
  FileQuestion,
  BookOpen,
  Users,
  Building2,
  ArrowLeft,
} from "lucide-react"

const faqs = [
  {
    question: "How do I update my profile?",
    answer:
      "Go to your dashboard and click on 'My Profile' in the sidebar. You can edit all your personal, academic, and skill information there. Make sure to keep your profile updated for better job matches.",
  },
  {
    question: "Can I apply to multiple companies?",
    answer:
      "Yes, you can apply to multiple companies as long as you meet their eligibility criteria. However, check your institute's placement policy regarding accepting multiple offers.",
  },
  {
    question: "How does the AI matching work?",
    answer:
      "Our AI analyzes your profile (skills, experience, education) against job requirements and calculates a match score. Higher scores indicate better fit for the role.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "After applying, your application goes through several stages: Applied → Shortlisted → Tests/Interviews → Offer. You'll receive notifications at each stage.",
  },
  {
    question: "How do I withdraw my application?",
    answer:
      "Go to 'My Applications', find the job you want to withdraw from, and click the 'Withdraw' button. Note that you may not be able to reapply after withdrawing.",
  },
  {
    question: "How are eligibility criteria determined?",
    answer:
      "Companies set their own eligibility criteria including CGPA requirements, branch preferences, backlog limits, etc. The TPO may also set institute-wide policies.",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">PlaceMe</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Help & Support</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions or reach out to our support team
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xl mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search for help..." className="pl-10" />
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-3 mb-12">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">For Students</CardTitle>
              <CardDescription>Profile, applications, interviews</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">For Companies</CardTitle>
              <CardDescription>Job posting, hiring process</CardDescription>
            </CardHeader>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">For TPO</CardTitle>
              <CardDescription>Administration, reports</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* FAQs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>Our support team is here to assist you</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1">
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Live Chat
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Mail className="mr-2 h-4 w-4" />
              Email Support
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
