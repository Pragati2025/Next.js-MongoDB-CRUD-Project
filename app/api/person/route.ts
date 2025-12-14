import { NextResponse } from "next/server";
import Person from "@/models/Person";
import { connectDB } from "@/lib/db";

await connectDB();

/* GET ALL PEOPLE */
export async function GET() {
  try {
    const people = await Person.find();
    return NextResponse.json(people);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}

/* CREATE PERSON */
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const person = await Person.create({ name });
    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
  }
}
