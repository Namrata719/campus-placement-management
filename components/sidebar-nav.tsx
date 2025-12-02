"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Calendar,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Building2,
  Users,
  ClipboardList,
  BarChart3,
  Sparkles,
  GraduationCap,
  Award,
  HelpCircle,
  Mail,
  Target,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

const studentNavItems = [
  { title: "Dashboard", href: "/student", icon: LayoutDashboard },
  { title: "My Profile", href: "/student/profile", icon: User },
  { title: "Browse Jobs", href: "/student/jobs", icon: Briefcase },
  { title: "My Applications", href: "/student/applications", icon: FileText },
  { title: "Schedule", href: "/student/schedule", icon: Calendar },
  { title: "Resume Manager", href: "/student/resume", icon: FileText },
  { title: "Notifications", href: "/student/notifications", icon: Bell },
  { title: "AI Career Coach", href: "/student/ai-coach", icon: Sparkles },
  { title: "Skill Analysis", href: "/student/skills", icon: Target },
  { title: "Email Helper", href: "/student/email-helper", icon: Mail },
  { title: "Feedback", href: "/student/feedback", icon: MessageSquare },
]

const tpoNavItems = [
  { title: "Dashboard", href: "/tpo", icon: LayoutDashboard },
  { title: "Students", href: "/tpo/students", icon: Users },
  { title: "Companies", href: "/tpo/companies", icon: Building2 },
  { title: "Jobs", href: "/tpo/jobs", icon: Briefcase },
  { title: "Schedule", href: "/tpo/schedule", icon: Calendar },
  { title: "Selection Pipeline", href: "/tpo/pipeline", icon: ClipboardList },
  { title: "Reports & Analytics", href: "/tpo/reports", icon: BarChart3 },
  { title: "AI Insights", href: "/tpo/ai-insights", icon: Sparkles },
  { title: "Settings", href: "/tpo/settings", icon: Settings },
]

const companyNavItems = [
  { title: "Dashboard", href: "/company", icon: LayoutDashboard },
  { title: "Company Profile", href: "/company/profile", icon: Building2 },
  { title: "Job Postings", href: "/company/jobs", icon: Briefcase },
  { title: "Applicants", href: "/company/applicants", icon: Users },
  { title: "Schedule", href: "/company/schedule", icon: Calendar },
  { title: "Offers", href: "/company/offers", icon: Award },
  { title: "AI Tools", href: "/company/ai-tools", icon: Sparkles },
  { title: "Settings", href: "/company/settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = user?.role === "student" ? studentNavItems : user?.role === "tpo" ? tpoNavItems : companyNavItems

  const roleLabel = user?.role === "student" ? "Student" : user?.role === "tpo" ? "TPO Admin" : "Recruiter"

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href={`/${user?.role || "student"}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">PlaceHub</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3" asChild>
          <Link href="/help">
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
