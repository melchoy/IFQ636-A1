import mongoose from "mongoose";

export async function connectDatabase(mongodbUri: string) {
  await mongoose.connect(mongodbUri);
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
