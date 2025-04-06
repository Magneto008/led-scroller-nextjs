import dbConnect from "./app/lib/db";

export async function register() {
  await dbConnect();
}
