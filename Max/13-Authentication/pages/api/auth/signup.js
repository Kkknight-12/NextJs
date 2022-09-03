import { connectToDataBase } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

console.log("signUp RAN");
async function handler(req, resp) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      resp.status(422).json({ message: "Invalid input" });
      return;
    }

    const client = await connectToDataBase();

    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email: email });

    console.log("exists", existingUser);
    if (existingUser) {
      resp.status(422).json({ message: "User already exists." });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    await db.collection("users").insertOne({
      email: email,
      password: hashedPassword,
    });

    resp.status(201).json({ message: "Created User" });
    client.close();
  }
}
export default handler;