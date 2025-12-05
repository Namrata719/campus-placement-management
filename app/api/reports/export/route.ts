import { type NextRequest, NextResponse } from "next/server"

// Mock data for export
const generateMockData = (type: string) => {
  switch (type) {
    case "students":
      return [
        { name: "John Doe", branch: "CSE", cgpa: 8.5, status: "Placed", company: "Google", ctc: 42 },
        { name: "Jane Smith", branch: "ECE", cgpa: 8.2, status: "Placed", company: "Microsoft", ctc: 38 },
        { name: "Bob Wilson", branch: "ME", cgpa: 7.8, status: "Not Placed", company: "-", ctc: 0 },
      ]
    case "companies":
      return [
        { company: "Google", offers: 12, avgCTC: 42.5, rolesOffered: "SDE, ML Engineer" },
        { company: "Microsoft", offers: 18, avgCTC: 38.2, rolesOffered: "SDE, PM" },
        { company: "Amazon", offers: 24, avgCTC: 32.8, rolesOffered: "SDE, Operations" },
      ]
    case "branch":
      return [
        { branch: "CSE", placed: 145, total: 160, placementRate: "90.6%", avgCTC: 18.5, highestCTC: 45 },
        { branch: "ECE", placed: 98, total: 120, placementRate: "81.7%", avgCTC: 14.2, highestCTC: 32 },
        { branch: "IT", placed: 88, total: 95, placementRate: "92.6%", avgCTC: 16.8, highestCTC: 38 },
      ]
    default:
      return []
  }
}

const convertToCSV = (data: Record<string, unknown>[]) => {
  if (data.length === 0) return ""

  const headers = Object.keys(data[0])
  const csvRows = [headers.join(",")]

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header]
      return typeof value === "string" && value.includes(",") ? `"${value}"` : value
    })
    csvRows.push(values.join(","))
  }

  return csvRows.join("\n")
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "students"
  const year = searchParams.get("year") || "2024-25"

  const data = generateMockData(type)
  const csv = convertToCSV(data)

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${type}-report-${year}.csv"`,
    },
  })
}
