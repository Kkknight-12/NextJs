import { connectDatabase, insertDocument } from "../../helpers/db-util"

async function handler(req, resp) {
  if (req.method === "POST") {
    const { email: userEmail } = req.body

    if (!userEmail || !userEmail.includes("@")) {
      resp.status(422).json({ message: "Invalid email address" })
      return
    }

    let client

    try {
      client = await connectDatabase()
    } catch (error) {
      resp.status(500).json({ message: "Connecting to the database failed!" })
      return
    }

    try {
      await insertDocument(client, "newsletter", { email: userEmail })
      client.close()
    } catch (error) {
      resp.status(500).json({ message: "Inserting the data failed" })
      return
    }

    resp.status(201).json({ message: "Singed Up!" })
  }
}

export default handler
