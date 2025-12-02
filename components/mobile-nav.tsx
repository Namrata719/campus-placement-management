"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import {
    LayoutDashboard,
    Briefcase,
    ClipboardList,
    FileText,
    Users,
    Building2,
    UserCheck,
    Award,
    Menu
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { DashboardSidebar } from "./sidebar"
import { Button } from "./ui/button"

export function MobileNav() {
    const pathname = usePathname()
    const { user } = useAuth()

    if (!user) return null

    const studentItems = [
        { title: "Home", href: "/student", icon: LayoutDashboard },
        { title: "Jobs", href: "/student/jobs", icon: Briefcase },
        { title: "Apps", href: "/student/applications", icon: ClipboardList },
        { title: "Profile", href: "/student/profile", icon: FileText },
    ]

    const tpoItems = [
        { title: "Home", href: "/tpo", icon: LayoutDashboard },
        { title: "Students", href: "/tpo/students", icon: Users },
        { title: "Companies", href: "/tpo/companies", icon: Building2 },
        { title: "Jobs", href: "/tpo/jobs", icon: Briefcase },
    ]

    const companyItems = [
        { title: "Home", href: "/company", icon: LayoutDashboard },
        { title: "Jobs", href: "/company/jobs", icon: Briefcase },
        { title: "Applicants", href: "/company/applicants", icon: UserCheck },
        { title: "Offers", href: "/company/offers", icon: Award },
    ]

    const items = user.role === "student" ? studentItems : user.role === "tpo" ? tpoItems : companyItems

    const isItemActive = (href: string) => {
        if (href === "/student" || href === "/tpo" || href === "/company") {
            return pathname === href
        }
        return pathname === href || pathname.startsWith(href + "/")
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 lg:hidden">
            {items.map((item) => {
                const isActive = isItemActive(item.href)
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                    </Link>
                )
            })}

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center gap-1 h-auto py-0 hover:bg-transparent">
                        <Menu className="h-5 w-5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <DashboardSidebar />
                </SheetContent>
            </Sheet>
        </div>
    )
}
