import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { PlacementEvent } from "@/lib/models/PlacementEvent"
import { Company } from "@/lib/models/Company"

export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const events = await PlacementEvent.find().sort({ date: 1, startTime: 1 }).lean()

        const companyIds = events.map((e: any) => e.companyId).filter((id: any) => id)
        const companies = await Company.find({ _id: { $in: companyIds } }).lean()
        const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c]))

        const formattedEvents = events.map((event: any) => {
            const company: any = event.companyId ? companyMap.get(event.companyId.toString()) : null
            return {
                id: event._id,
                title: event.title,
                company: company ? company.name : "N/A",
                type: event.type,
                date: new Date(event.date).toISOString().split('T')[0],
                startTime: event.startTime,
                endTime: event.endTime,
                venue: event.venue || "Online",
                mode: event.mode,
                status: event.status,
                registeredCount: event.registeredStudents?.length || 0
            }
        })

        return NextResponse.json({ success: true, data: formattedEvents })
    } catch (error) {
        console.error("Error fetching events:", error)
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()
        const body = await req.json()

        const newEvent = await PlacementEvent.create({
            title: body.title,
            companyId: body.companyId,
            type: body.type,
            date: new Date(body.date),
            startTime: body.startTime,
            endTime: body.endTime,
            venue: body.venue,
            mode: body.mode,
            description: body.description,
            status: "scheduled",
            createdBy: userId
        })

        return NextResponse.json({ success: true, data: newEvent })
    } catch (error) {
        console.error("Error creating event:", error)
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
    }
}
