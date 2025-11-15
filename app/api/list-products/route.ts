import { Product } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB()

        const products = await Product.find().sort({ createdAt: -1 })
        return NextResponse.json({ message: 'Products fetched successfully', products }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Product fetching failed', error: error }, { status: 500 });

    }
}