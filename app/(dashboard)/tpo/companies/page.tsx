"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Download } from "lucide-react"
import {
  Search,
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  Loader2
} from "lucide-react"
import { toast } from "sonner"

interface Company {
  id: string
  name: string
  website: string
  industry: string
  location: string
  status: "approved" | "pending" | "rejected"
  contactPerson: string
  contactEmail: string
  contactPhone: string
  activeJobs: number
  totalHires: number
  avgCTC: string
  registeredAt: string
}

export default function TPOCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tpo/companies")
      const data = await res.json()
      if (data.success) {
        setCompanies(data.data)
      } else {
        toast.error("Failed to fetch companies")
      }
    } catch (error) {
      toast.error("Failed to fetch companies")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/tpo/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: id, status }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Company ${status} successfully`)
        fetchCompanies()
      } else {
        toast.error("Failed to update status")
      }
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "pending") {
      return matchesSearch && company.status === "pending"
    }
    return matchesSearch
  })

  const pendingCompanies = companies.filter((c) => c.status === "pending")
  const approvedCompanies = companies.filter((c) => c.status === "approved")


  // Additional State
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [newCompany, setNewCompany] = useState({
    name: "",
    website: "",
    industry: "",
    location: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: ""
  })

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company)
    setIsDetailsOpen(true)
  }

  const handleViewJobs = (company: Company) => {
    // Redirect to jobs page filtered by company
    // Since we don't have a company filter in the URL yet, we can just redirect to jobs page
    // Or ideally: window.location.href = `/tpo/jobs?company=${company.id}`
    window.location.href = `/tpo/jobs`
  }

  const handleAddCompany = async () => {
    if (!newCompany.name || !newCompany.contactEmail) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      const res = await fetch("/api/tpo/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany),
      })
      const data = await res.json()

      if (data.success) {
        toast.success("Company added successfully")
        setIsAddCompanyOpen(false)
        setNewCompany({
          name: "", website: "", industry: "", location: "",
          contactPerson: "", contactEmail: "", contactPhone: ""
        })
        fetchCompanies()
      } else {
        toast.error(data.error || "Failed to add company")
      }
    } catch (error) {
      toast.error("Failed to add company")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCompany(prev => ({ ...prev, [name]: value }))
  }

  const handleExport = () => {
    const headers = ["Name", "Industry", "Website", "Location", "Contact Person", "Email", "Phone", "Status", "Active Jobs", "Total Hires"]
    const csvContent = [
      headers.join(","),
      ...companies.map(c => [
        `"${c.name}"`,
        `"${c.industry}"`,
        c.website,
        `"${c.location}"`,
        `"${c.contactPerson}"`,
        c.contactEmail,
        c.contactPhone,
        c.status,
        c.activeJobs,
        c.totalHires
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "companies_export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Export started")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Management</h1>
          <p className="text-muted-foreground">Manage company registrations and partnerships</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddCompanyOpen(true)}>
            <Building2 className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{companies.length}</p>
                <p className="text-sm text-muted-foreground">Total Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedCompanies.length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCompanies.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{companies.reduce((acc, c) => acc + c.activeJobs, 0)}</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Companies</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending Approval
              {pendingCompanies.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {pendingCompanies.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No companies found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {company.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.industry}</p>
                        </div>
                      </div>
                      <Badge variant={company.status === "approved" ? "default" : "secondary"}>{company.status}</Badge>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        <a
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          {company.website}
                          <ExternalLink className="h-3 w-3 inline ml-1" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {company.contactEmail}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-3 border-t border-b mb-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{company.activeJobs}</p>
                        <p className="text-xs text-muted-foreground">Active Jobs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{company.totalHires}</p>
                        <p className="text-xs text-muted-foreground">Total Hires</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{company.avgCTC}</p>
                        <p className="text-xs text-muted-foreground">Avg CTC</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {company.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleStatusUpdate(company.id, "approved")}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleStatusUpdate(company.id, "rejected")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleViewDetails(company)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => handleViewJobs(company)}
                          >
                            View Jobs
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No pending companies.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="border-yellow-500/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-yellow-500/10 text-yellow-600">
                            {company.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.industry}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        {company.website}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Contact: {company.contactPerson}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {company.contactEmail}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {company.contactPhone}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">
                      Registered on {new Date(company.registeredAt).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(company.id, "approved")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(company.id, "rejected")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Company Dialog */}
      <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
            <DialogDescription>Register a new company for placements</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input name="name" value={newCompany.name} onChange={handleInputChange} placeholder="e.g. Acme Corp" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Input name="industry" value={newCompany.industry} onChange={handleInputChange} placeholder="e.g. IT Services" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input name="website" value={newCompany.website} onChange={handleInputChange} placeholder="e.g. www.acme.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input name="location" value={newCompany.location} onChange={handleInputChange} placeholder="e.g. Bangalore" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Person</label>
                <Input name="contactPerson" value={newCompany.contactPerson} onChange={handleInputChange} placeholder="Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input name="contactEmail" value={newCompany.contactEmail} onChange={handleInputChange} placeholder="Email" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCompanyOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCompany}>Add Company</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedCompany.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{selectedCompany.name}</h2>
                  <p className="text-muted-foreground">{selectedCompany.industry}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase">Location</label>
                    <p className="font-medium">{selectedCompany.location}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase">Website</label>
                    <p className="font-medium">{selectedCompany.website}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase">Contact Person</label>
                    <p className="font-medium">{selectedCompany.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase">Email</label>
                    <p className="font-medium">{selectedCompany.contactEmail}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase">Phone</label>
                    <p className="font-medium">{selectedCompany.contactPhone}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase">Status</label>
                    <Badge>{selectedCompany.status}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
