import { NextResponse } from "next/server";

const users = [
  { id: 1, username: "mathew.anderson", department: "Design" },
  { id: 2, username: "sarah.johnson", department: "Engineering" },
  { id: 3, username: "david.smith", department: "Marketing" },
  { id: 4, username: "jessica.williams", department: "Sales" },
  { id: 5, username: "michael.brown", department: "Human Resources" },
  { id: 6, username: "emily.jones", department: "Finance" },
  { id: 7, username: "chris.davis", department: "IT" },
  { id: 8, username: "lisa.miller", department: "Operations" },
];

export async function GET() {
  try {
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
