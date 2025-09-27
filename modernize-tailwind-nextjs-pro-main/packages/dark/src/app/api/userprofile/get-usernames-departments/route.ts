import { NextResponse } from "next/server";

const users = [
  { id: 1, username: "mathew.anderson", department: "Design" },
  { id: 2, username: "sarah.johnson", department: "Engineering" },
  { id: 3, username: "david.smith", department: "Marketing" },
];

export async function GET() {
  try {
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
