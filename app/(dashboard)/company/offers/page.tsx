"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Send, CheckCircle, Clock, IndianRupee, FileText, Edit } from "lucide-react"

export default function CompanyOffersPage() {
  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const res = await fetch("/api/company/offers")
      const data = await res.json()
      if (data.success) {
        setOffers(data.data)
      } else {
        // toast.error("Failed to fetch offers")
      }
    } catch (error) {
      // toast.error("Failed to fetch offers")
    } finally {
      setLoading(false)
    }
  }

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.candidateName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const acceptedOffers = offers.filter((o) => o.status === "accepted")
  const pendingOffers = offers.filter((o) => o.status === "offered") // 'offered' is pending acceptance

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Offer Management</h1>
          <p className="text-muted-foreground">Track and manage candidate offers</p>
        </div>
        <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send New Offer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Offer Letter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Candidate</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rahul">Rahul Sharma - SDE</SelectItem>
                    <SelectItem value="priya">Priya Patel - SDE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue="Software Development Engineer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTC (LPA)</Label>
                  <Input type="number" placeholder="e.g., 15" />
                </div>
                <div className="space-y-2">
                  <Label>Joining Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="e.g., Bangalore" />
              </div>

              <div className="space-y-2">
                <Label>Offer Expiry Date</Label>
                <Input type="date" />
              </div>

              <Button className="w-full" onClick={() => setIsOfferDialogOpen(false)}>
                <Send className="mr-2 h-4 w-4" />
                Send Offer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{offers.length}</p>
                <p className="text-sm text-muted-foreground">Total Offers</p>
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
                <p className="text-2xl font-bold">{acceptedOffers.length}</p>
                <p className="text-sm text-muted-foreground">Accepted</p>
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
                <p className="text-2xl font-bold">{pendingOffers.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">14.75 LPA</p>
                <p className="text-sm text-muted-foreground">Avg CTC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Offers</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>CTC</TableHead>
                  <TableHead>Offer Date</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joining</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {offer.candidateName
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{offer.candidateName}</p>
                          <p className="text-xs text-muted-foreground">{offer.branch}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{offer.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {offer.ctc}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(offer.offerDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(offer.joiningDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          offer.status === "accepted"
                            ? "default"
                            : offer.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {offer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {offer.joiningStatus ? (
                        <Badge className="bg-green-500">Confirmed</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}