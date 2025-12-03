import Link from "next/link"
import Image from "next/image"
import { Building2, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-card mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* College Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/images/skn-logo.png"
                                alt="SKN Sinhgad College Logo"
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                            <div>
                                <h3 className="font-semibold">SKN Sinhgad</h3>
                                <p className="text-xs text-muted-foreground">Engineering Excellence</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            SKN Sinhgad College of Engineering
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Department of Electronics & Telecommunication
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-muted-foreground hover:text-primary transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Developer Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Developed By</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Akash Chandrashekhar Katte</li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3">
                            B.Tech ENTC (2022-26)
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>Korti, Pandharpur, Maharashtra</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 shrink-0" />
                                <span>info@sinhgad.edu</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 shrink-0" />
                                <span>+91 XXX XXX XXXX</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} PlaceMe - Campus Placement Management System. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
