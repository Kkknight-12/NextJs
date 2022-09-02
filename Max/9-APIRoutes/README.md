# API Routes Project

### News Letter

```jsx
import { useRef } from "react"

function NewsletterRegistration() {
  const emailInputRef = useRef()
  function registrationHandler(event) {
    event.preventDefault()

    const enteredEmail = emailInputRef.current.value
    // fetch user input (state or refs)
    // optional: validate input
    // send valid data to API
    fetch("/api/newsletter", {
      method: "POST",
      body: JSON.stringify({ email: enteredEmail }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
  }

  return (
    <section className={classes.newsletter}>
     
      <form onSubmit={registrationHandler}>
        
      </form>
    </section>
  )
}

export default NewsletterRegistration
```

api/newletter.js

```jsx

async function handler(req, resp) {
  if (req.method === "POST") {
    const { email: userEmail } = req.body

    if (!userEmail || !userEmail.includes("@")) {
      resp.status(422).json({ message: "Invalid email address" })
      return
    }

    resp.status(201).json({ message: "Singed Up!" })
  }
}

export default handler
```

### Comment API

```jsx

function Comments(props) {

			const [comments, setComments] = useState([])

				// GET
			  useEffect(() => {
			    if (showComments) {
			      fetch("/api/comments/" + eventId)
			        .then((response) => response.json())
			        .then((data) => {
			          setComments(data.comments)
			        })
			    }
			  }, [showComments])

			// POST
			function addCommentHandler(commentData) {
			    // send data to API
			    fetch("/api/comments/" + eventId, {
			      method: "POST",
			      body: JSON.stringify(commentData),
			      headers: {
			        "Content-Type": "application/json",
			      },
			    })
			      .then((response) => response.json())
			      .then((data) => console.log(data))
			  }
			

		return (
					<NewComment onAddComment={addCommentHandler} />
					<CommentList items={comments} />
		)

}
```

api./comments/[eventId.js]

```jsx

async function handler(req, resp) {
  const eventId = req.query.eventId

  if (req.method === "POST") {
    const { email, name, text } = req.body

    // if invalid input
    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim === ""
    ) {
      resp.status(422).json({ message: "Invalid input" })
      client.close()
      return
    }

    console.log(email, name, text)
    const newComment = {
      email,
      name,
      text,
      id: new Date().toISOString(),
    }
   resp.status(201).json({ message: "Added Comment.", comment: newComment })
  }

  if (req.method === "GET") {
    dummyList = [ { id: 'c1', name: 'Max ', text: 'A first comment!' } ]
  
		resp.status(200).json({ comments: dummyList })
  }

}
export default handler
```

### Setting up MongoDb Database

install

```jsx
npm i mpngodb
```

helpers/db-utils.js

```jsx
import { MongoClient } from "mongodb"

export async function **connectDatabase**() {
  const client = await MongoClient.connect(
    "mongodb+srv://nextjsMongoDb:nextjsMongoDb@cluster0.mdte5.mongodb.net/events?retryWrites=true&w=majority"
  )
  return client
}

export async function **insertDocument**(client, collection, document) {
  const db = client.db()

  const result = await db.collection(collection).insertOne(document)
  return result
}

export async function getAllDocuments(client, collection, sort) {
  const db = client.db()

  const documents = await db
    .collection(collection)
    .find()
    .sort(sort) // sort in descending order | + 1 for ascedning
    .toArray()

  return document
}
```

```jsx
import { **connectDatabase**, **insertDocument** } from "../../helpers/db-util"

async function handler(req, resp) {
  if (req.method === "POST") {
    const { email: userEmail } = req.body

    if (!userEmail || !userEmail.includes("@")) {
      resp.status(422).json({ message: "Invalid email address" })
      return
    }

    let client

    try {
      client = await **connectDatabase**()
    } catch (error) {
      resp.status(500).json({ message: "Connecting to the database failed!" })
      return
    }

    try {
      await **insertDocument**(client, "newsletter", { email: userEmail })
      client.close()
    } catch (error) {
      resp.status(500).json({ message: "Inserting the data failed" })
      return
    }

    resp.status(201).json({ message: "Singed Up!" })
  }
}

export default handler
```

### Inserting Comment in Database and Getting Data from Database

api/comments/[eventId.js]

```jsx
import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
} from "../../../helpers/db-util";

async function handler(req, resp) {
  const eventId = req.query.eventId;

  let client;
  try {
    client = await **connectDatabase**();
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
      result = await **insertDocument**(client, "comments", newComment);
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
      const documents = **getAllDocuments**(client, "comments", { _id: -1 });
      resp.status(200).json({ comments: documents });
    } catch (error) {
      resp.status(500).json({ message: "Getting comments failed" });
    }
  }
  client.close();
}
export default handler;
```