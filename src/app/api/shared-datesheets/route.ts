import { NextResponse } from "next/server";

export async function POST() {
    return new NextResponse("Not implemented", { status: 501 });
}

export async function GET() {
    return NextResponse.json([]);
}
