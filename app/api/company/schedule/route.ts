import { NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import { PlacementEvent } from "@/lib/models/PlacementEvent"
import { Company } from "@/lib/models/Company"

// GET: Fetch company's events
export async function GET(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectDB()

        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const events = await PlacementEvent.find({ companyId: company._id })
            .sort({ date: 1 })
            .lean()

        return NextResponse.json({
            success: true,
            events: events.map((event: any) => ({
                id: event._id.toString(),
                ...event
            }))
        })
    } catch (error: any) {
        console.error("Error fetching company schedule:", error)
        return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
    }
}

// POST: Schedule a new event
export async function POST(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        await connectDB()

        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const newEvent = await PlacementEvent.create({
            ...body,
            companyId: company._id,
            createdBy: userId,
            status: "scheduled"
        })

        return NextResponse.json({
            success: true,
            message: "Event scheduled successfully",
            event: newEvent
        })
    } catch (error: any) {
        console.error("Error scheduling event:", error)
        return NextResponse.json({ error: "Failed to schedule event" }, { status: 500 })
    }
}

// PUT: Update an event
export async function PUT(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id, ...updateData } = await req.json()
        await connectDB()

        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const event = await PlacementEvent.findOne({ _id: id, companyId: company._id })
        if (!event) {
            return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
        }

        Object.assign(event, updateData)
        await event.save()

        return NextResponse.json({
            success: true,
            message: "Event updated successfully",
            event
        })
    } catch (error: any) {
        console.error("Error updating event:", error)
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
    }
}

// DELETE: Cancel an event
export async function DELETE(req: NextRequest) {
    try {
        const userId = await verifyAuth(req)
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        await connectDB()

        const company = await Company.findOne({ userId })
        if (!company) {
            return NextResponse.json({ error: "Company not found" }, { status: 404 })
        }

        const event = await PlacementEvent.findOne({ _id: id, companyId: company._id })
        if (!event) {
            return NextResponse.json({ error: "Event not found or unauthorized" }, { status: 404 })
        }

        event.status = "cancelled"
        await event.save()

        return NextResponse.json({
            success: true,
            message: "Event cancelled successfully"
        })
    } catch (error: any) {
        console.error("Error cancelling event:", error)
        return NextResponse.json({ error: "Failed to cancel event" }, { status: 500 })
    }
}
