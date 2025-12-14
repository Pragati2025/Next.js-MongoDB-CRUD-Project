import mongoose, { Schema, model, models } from "mongoose";

const personSchema = new Schema({
  name: { type: String, required: true },
});

const Person = models.Person || model("Person", personSchema);
export default Person;
