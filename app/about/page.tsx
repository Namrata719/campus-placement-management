"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Target, Award, GraduationCap, Code, Github, Linkedin } from "lucide-react"

const developers = [
    {
        name: "Mayuri Vitthal Auji",
        role: "Full Stack Developer",
        batch: "Final Year",
    },
    {
        name: "Mohini Kerba Dhulgunde",
        role: "Backend Developer",
        batch: "Final Year",
    },
    {
        name: "Namrata Prakash Mane",
        role: "Frontend Developer",
        batch: "Final Year",
    },
    {
        name: "Nikhil Patil",
        role: "Database & API Developer",
        batch: "Final Year",
    },
]


const features = [
    {
        icon: Users,
        title: "Student Management",
        description: "Comprehensive student profiles with academic records and placement tracking",
    },
    {
        icon: Building2,
        title: "Company Portal",
        description: "Easy job posting and candidate management for recruiting companies",
    },
    {
        icon: Target,
        title: "Smart Matching",
        description: "AI-powered job recommendations based on skills and eligibility",
    },
    {
        icon: Award,
        title: "Placement Analytics",
        description: "Real-time dashboards with placement statistics and insights",
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            P
                        </div>
                        <span className="font-semibold text-xl">PlaceMe</span>
                    </Link>
                    <Link href="/login">
                        <Button>Login</Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/sbgi-logo.png"
                            alt="SBGI Logo"
                            width={150}
                            height={150}
                            className="rounded-full shadow-lg"
                        />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Campus Placement Management System
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                        Developed by Computer Science Engineering Students of
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-8">
                        Sanjay Bhokare Group of Institutes, Miraj
                    </h2>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Badge variant="secondary" className="px-4 py-2 text-base">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Final Year Project 2022-26
                        </Badge>
                        <Badge variant="secondary" className="px-4 py-2 text-base">
                            <Code className="h-4 w-4 mr-2" />
                            Computer Science Engineering
                        </Badge>
                    </div>
                </div>
            </section>

            {/* About the Project */}
            <section className="py-16 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">About PlaceMe</h2>
                    <Card className="bg-card">
                        <CardContent className="p-8">
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                PlaceMe is a comprehensive Campus Placement Management System designed to streamline the entire
                                placement process for educational institutions. Built with modern web technologies including Next.js,
                                React, MongoDB, and TypeScript, this platform serves as a bridge between students, companies, and
                                placement coordinators.
                            </p>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The system automates job postings, application tracking, student profile management, and provides
                                real-time analytics to help placement officers make data-driven decisions. With AI-powered features
                                like job matching and resume analysis, PlaceMe ensures students find the best career opportunities.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {features.map((feature) => (
                            <Card key={feature.title} className="bg-card hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-primary" />
                                    </div>
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

            {/* Development Team */}
            <section className="py-16 container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-12 text-center">Development Team</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {developers.map((dev) => (
                        <Card key={dev.name} className="bg-card hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-12 w-12 text-primary" />
                                </div>
                                <CardTitle className="text-center text-lg">{dev.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-sm text-primary font-medium mb-2">{dev.role}</p>
                                <Badge variant="secondary">{dev.batch}</Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* College Info */}
            <section className="py-16 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-8">About Our Institution</h2>
                    <Card className="bg-card">
                        <CardContent className="p-8">
                            <div className="flex justify-center mb-6">
                                <Image
                                    src="/images/sbgi-logo.png"
                                    alt="SBGI Logo"
                                    width={120}
                                    height={120}
                                    className="rounded-full"
                                />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Sanjay Bhokare Group of Institutes, Miraj
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">
                                SBGI is a premier educational institution committed to providing quality technical education and
                                fostering innovation among students. The Computer Science & Engineering department is at the forefront
                                of technological advancements, encouraging students to develop practical solutions to real-world
                                problems.
                            </p>
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Badge variant="outline" className="px-4 py-2">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Established Excellence
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2">
                                    <Award className="h-4 w-4 mr-2" />
                                    Quality Education
                                </Badge>
                                <Badge variant="outline" className="px-4 py-2">
                                    <Code className="h-4 w-4 mr-2" />
                                    Innovation Hub
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Experience the future of campus placements with PlaceMe
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/register">
                            <Button size="lg">Get Started</Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
