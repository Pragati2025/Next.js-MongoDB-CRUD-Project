import { NextResponse } from "next/server";
import Person from "@/models/Person";
import { connectDB } from "@/lib/db";

await connectDB();

/* UPDATE PERSON */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name } = await req.json();

    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedPerson) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPerson);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/* DELETE PERSON */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedPerson = await Person.findByIdAndDelete(id);

    if (!deletedPerson) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Person deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
