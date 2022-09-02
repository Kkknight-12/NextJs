import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
} from "../../../helpers/db-util";

async function handler(req, resp) {
  const eventId = req.query.eventId;

  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    resp.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    // if invalid input
    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim === ""
    ) {
      resp.status(422).json({ message: "Invalid input" });
      client.close();
      return;
    }

    console.log(email, name, text);
    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    let result;

    try {
      result = await insertDocument(client, "comments", newComment);
      newComment._id =
        result.insertedId[
          resp
            .status(201)
            .json({ message: "Added Comment.", comment: newComment })
        ];
    } catch (error) {
      resp.status(500).json({ message: "inserting comment failed" });
    }
  }
  if (req.method === "GET") {
    try {
      const documents = getAllDocuments(client, "comments", { _id: -1 });
      resp.status(200).json({ comments: documents });
    } catch (error) {
      resp.status(500).json({ message: "Getting comments failed" });
    }
  }
  client.close();
}
export default handler;