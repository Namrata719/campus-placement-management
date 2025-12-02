"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import {
  Download,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  IndianRupee,
  GraduationCap,
  Award,
  Sparkles,
  RefreshCw,
  Loader2
} from "lucide-react"

const ctcDistribution = [
  { range: "< 5 LPA", count: 45, color: "hsl(var(--chart-1))" },
  { range: "5-10 LPA", count: 120, color: "hsl(var(--chart-2))" },
  { range: "10-15 LPA", count: 180, color: "hsl(var(--chart-3))" },
  { range: "15-25 LPA", count: 140, color: "hsl(var(--chart-4))" },
  { range: "25-40 LPA", count: 85, color: "hsl(var(--chart-5))" },
  { range: "> 40 LPA", count: 46, color: "hsl(var(--primary))" },
]

const monthlyTrend = [
  { month: "Aug", offers: 12, companies: 3 },
  { month: "Sep", offers: 45, companies: 8 },
  { month: "Oct", offers: 89, companies: 15 },
  { month: "Nov", offers: 156, companies: 22 },
  { month: "Dec", offers: 234, companies: 18 },
  { month: "Jan", offers: 312, companies: 25 },
  { month: "Feb", offers: 398, companies: 20 },
  { month: "Mar", offers: 456, companies: 12 },
  { month: "Apr", offers: 516, companies: 8 },
]

const sectorDistribution = [
  { name: "IT/Software", value: 45, color: "#3b82f6" },
  { name: "Core Engineering", value: 15, color: "#10b981" },
  { name: "Finance", value: 18, color: "#f59e0b" },
  { name: "Consulting", value: 12, color: "#8b5cf6" },
  { name: "E-commerce", value: 10, color: "#ec4899" },
]

const yearComparison = [
  { metric: "Total Placed", current: 516, previous: 478, change: 7.9 },
  { metric: "Average CTC", current: 14.8, previous: 12.5, change: 18.4 },
  { metric: "Highest CTC", current: 45, previous: 38, change: 18.4 },
  { metric: "Companies Visited", current: 142, previous: 125, change: 13.6 },
  { metric: "Placement %", current: 81.2, previous: 76.8, change: 5.7 },
]

export default function ReportsPage() {
  const [academicYear, setAcademicYear] = useState("2024-25")
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [metrics, setMetrics] = useState<any>(null)
  const [branchData, setBranchData] = useState<any[]>([])
  const [topRecruiters, setTopRecruiters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/tpo/reports")
      const json = await res.json()
      if (json.success) {
        setMetrics(json.data.metrics)
        setBranchData(json.data.branchWiseData)
        setTopRecruiters(json.data.topRecruiters)
      }
    } catch (error) {
      console.error("Failed to fetch reports")
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = (reportType: string) => {
    console.log(`Exporting ${reportType} as CSV for ${academicYear}`)
  }

  const handleGenerateAIReport = async () => {
    setIsGeneratingReport(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGeneratingReport(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Placement Reports</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2023-24">2023-24</SelectItem>
              <SelectItem value="2022-23">2022-23</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => handleExportCSV("full")}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button onClick={handleGenerateAIReport} disabled={isGeneratingReport}>
            {isGeneratingReport ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate AI Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Eligible for placement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Placed Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.placedStudents || 0}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              {metrics?.placementRate || 0}% placement rate
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average CTC</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.avgCTC || 0} LPA</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +18.4% vs last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Highest CTC</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.highestCTC || 0} LPA</div>
            <p className="text-xs text-muted-foreground">Google - SDE Role</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.companiesVisited || 0}</div>
            <p className="text-xs text-muted-foreground">Participated this year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="branch">Branch-wise</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">YoY Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* CTC Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>CTC Distribution</CardTitle>
                <CardDescription>Package ranges across all placements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ctcDistribution}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="range" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sector Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sector Distribution</CardTitle>
                <CardDescription>Placement breakdown by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {sectorDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Placement Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Placement Trend</CardTitle>
              <CardDescription>Cumulative offers and company visits throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="offers"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary)/0.2)"
                      name="Total Offers"
                    />
                    <Area
                      type="monotone"
                      dataKey="companies"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2)/0.2)"
                      name="Companies/Month"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branch" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Branch-wise Placement Statistics</CardTitle>
                <CardDescription>Detailed breakdown by department</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExportCSV("branch")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {branchData.map((branch) => {
                  const percentage = branch.total > 0 ? Math.round((branch.placed / branch.total) * 100) : 0
                  return (
                    <div key={branch.branch} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-medium w-12">{branch.branch}</span>
                          <Badge variant="secondary">
                            {branch.placed}/{branch.total} placed
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Avg: <span className="text-foreground font-medium">{branch.avgCTC} LPA</span>
                          </span>
                          <span className="text-muted-foreground">
                            Max: <span className="text-foreground font-medium">{branch.highestCTC} LPA</span>
                          </span>
                          <span className="font-semibold text-primary">{percentage}%</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branch Comparison Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={branchData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="branch" type="category" className="text-xs" width={50} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="placed" fill="hsl(var(--primary))" name="Placed" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="total" fill="hsl(var(--muted))" name="Total" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Recruiting Companies</CardTitle>
                <CardDescription>Companies with most offers this year</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExportCSV("companies")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRecruiters.map((company, index) => (
                  <div
                    key={company.company}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{company.company}</h4>
                        <div className="flex gap-2 mt-1">
                          {company.roles.map((role: string) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{company.offers}</p>
                        <p className="text-muted-foreground text-xs">Offers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{company.avgCTC}</p>
                        <p className="text-muted-foreground text-xs">Avg CTC (LPA)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offer Accumulation Over Time</CardTitle>
              <CardDescription>How placements progressed through the academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="offers"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      name="Cumulative Offers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Year-over-Year Comparison</CardTitle>
              <CardDescription>Performance metrics compared to previous academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {yearComparison.map((item) => (
                  <div key={item.metric} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{item.metric}</h4>
                      <p className="text-sm text-muted-foreground">Previous: {item.previous}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">{item.current}</span>
                      <Badge variant={item.change > 0 ? "default" : "destructive"} className="flex items-center gap-1">
                        {item.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
