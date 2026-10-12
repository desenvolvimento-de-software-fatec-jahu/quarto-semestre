import mongoose from "mongoose";

export async function connectDatabase() {
  const databaseUrl =
    process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/todo_app";

  await mongoose.connect(databaseUrl);
  console.log("MongoDB conectado");
}