import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("ERRO: Erro no servidor");
  }
  console.log(uri);
  try {
    await mongoose.connect(uri);
  } catch (error) {
    console.log("Erro ao ligar a BD");
    process.exit(1);
  }
}
