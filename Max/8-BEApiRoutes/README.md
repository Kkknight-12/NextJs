# Backend API Routes

### First Api

We can add our own API routes to NextJs. by simply creating a new sub folder inside of pages. That **subfolder** has to be called **api.** The folder name is optional it must be api to add the api routes. Inside the api folder you can add pages of any name of your choice. 

- index.js → to handle request directed to just at →  /api

Files and folder inside the API folder would be treated in a special way. Any file inside api folder we dont export react component. Here we create a function which may get two parametes

- request object →
- response object →

and the function itself must be exported. 

```jsx

// path to send request
// /api/feedback

export default function handler(req, res) {
	res.send(200).json({ message: 'hi' } ) ; // just like express
}
```

As the file create is in API folder, NExt js will take this function to execute for incoming requests sent to `/api/feedback`  . Inside of this function we can not just handle get request and we don’t have to send back HTML code. Instead this allow us to execute any server side code of our choice. Any code we write in here will never end up in client side code bundle. 

![Screenshot 2022-09-01 at 9.20.11 PM.png](Backend%20API%20Routes%20489509cf86df49279c92f58f4b25449b/Screenshot_2022-09-01_at_9.20.11_PM.png)

Remember all kind of request ( POST, GET, UPDATE, PATCH, DELETE )  to route  `/api/feedback` will trigger this function.

we can also use all node js features here like → fs, path

### Use API routes for pre-rendering page

FrontEnd code

pages/ feedback/ index.js

```jsx

import { extractFeedback, buildFeedbackPath } from "../api/feedback"

export async function getStaticProps() {
  const filePath = **buildFeedbackPath**()
  const data = **extractFeedback**(filePath)
  return {
    props: {
      feedbackItems: data,
    },
  }
}
```

Since the Frond end and Backend is part of one project, all served by one server. We can write any Node js logic directly inside getStaticProps.

Here in this case **`buildFeedbackPath`** and **`extractFeedback`** can be directly executed in **`getStaticProps`.**

Both the function are exported from the Backend and can be imported in our frontend file to be used by **`getStaticProps` .**  

![Screenshot 2022-09-01 at 10.16.18 PM.png](Backend%20API%20Routes%20489509cf86df49279c92f58f4b25449b/Screenshot_2022-09-01_at_10.16.18_PM.png)

BE code

api/ feedback.js

```jsx
import fs from "fs";
import path from "path";

// path to send request
// /api/feedback

// get the path to the file
export function **buildFeedbackPath**() {
  return path.join(process.cwd(), "data", "feedback.json");
}

// read the file and convert it into JSON
export function **extractFeedback**(filepath) {
  const fileData = fs.readFileSync(filepath);
  const data = JSON.parse(fileData);
  return data;
}
```

![Screenshot 2022-09-01 at 10.16.30 PM.png](Backend%20API%20Routes%20489509cf86df49279c92f58f4b25449b/Screenshot_2022-09-01_at_10.16.30_PM.png)

<aside>
💡 Next js will note that the import is from the backend which will be used only inside the getStaticProps and therefore that code will not be included in client side bundle.

</aside>

component

pages/ feedback/ index.js

```jsx
import { useState } from "react"

function FeedbackPage(props) {
  const [feedbackData, setFeedbackData] = useState()

  const loadFeedBackHandler = (id) => {
    console.log(id)
    fetch(`/api/${id}`) // /api/some-feedback-id
      .then((response) => response.json())
      .then((data) => setFeedbackData(data.feedback))
  }

  return (
    <>
      {feedbackData && <p>{feedbackData.text}</p>}
      <ul>
        {props.feedbackItems.map((item) => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => loadFeedBackHandler(item.id)}>
              Show Details
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
```

So now we have the code here inside of our regular page instead of using fetch and sending request to our own API route because when working with your own API routes and when requiring them in your regular pages you should not send HTTP request to them but instead leverage the fact that it’s all running on the same server and therefore just import it and directly run that code. 

### Dynamic API Routes

A dynamic API route → lets say you don’t wanna have just  `/api/feedback/` which handle POST and GET request but also wanna support `/api/feedback/somefeedback-id`  to just fetch the single piece of data for that specific feedback item. Because may be you need somewhere on your page. For Example on your feedback page, you could say that for every list item you are rendering here you also like a show detail button which when clicked you wanna show detail for that feedback item hence you wanna fetch the full data for that feedback item. 

pages/feedback/index.js

```jsx
import { useState } from "react"

function FeedbackPage(props) {
  const [feedbackData, setFeedbackData] = useState()

  const loadFeedBackHandler = (id) => {
    console.log(id)
    fetch(`/api/${id}`) // /api/some-feedback-id
      .then((response) => response.json())
      .then((data) => setFeedbackData(data.feedback))
  }

  return (
    <>
      {feedbackData && <p>{feedbackData.text}</p>}
      <ul>
        {props.feedbackItems.map((item) => (
          <li key={item.id}>
            {item.text}
            <button onClick={() => loadFeedBackHandler(item.id)}>
              Show Details
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
```

![Screenshot 2022-09-01 at 11.42.44 PM.png](Backend%20API%20Routes%20489509cf86df49279c92f58f4b25449b/Screenshot_2022-09-01_at_11.42.44_PM.png)

```jsx
import { extractFeedback, buildFeedbackPath } from "../api/feedback"

export async function getStaticProps() {
  const filePath = buildFeedbackPath()
  const data = extractFeedback(filePath)
  return {
    props: {
      feedbackItems: data,
    },
  }
}
```

pages/api/[feedbackId.js]

```jsx
import { buildFeedbackPath, extractFeedback } from "./feedback";

function handler(req, resp) {
  /* 
    request has a method named query which 
    give access query parameters and regular parameter
    */
  // accessing feedbackId because we
  // have give file name [feedbackId.js]
  const feedbackId = req.query.feedbackId;
  const filePath = buildFeedbackPath();
  const feedbackData = extractFeedback(filePath);
  const selectedFeedBack = feedbackData.find(
    (feedBack) => feedBack.id === feedbackId
  );
  resp.status(200).json({ feedback: selectedFeedBack });
}

export default handler;
```

![Screenshot 2022-09-01 at 11.42.10 PM.png](Backend%20API%20Routes%20489509cf86df49279c92f58f4b25449b/Screenshot_2022-09-01_at_11.42.10_PM.png)

### Structuring API Routes

There are some alternative to how we name and structure our files inside of API folder which is why we can have different approach for our regular pages. 

- we can also have catch all dynamic API Routes by adding three dots in front of any placeholder name of your choice.   → […feedbackId.js]
    - this will not only handle request to `/api/somevalue` but also to   `/api/somevalue/something-else` . just like we did in pages.

It is also importance how NextJs priorities these routes if we send request to /api/feedback

```jsx
| pages
|      - api
|          - [feedbackId.js]
|          -  feedback.js
```

it’s decoded in the feedback.js file. It will be executed. As seen request to  `/api/feedback` are not consumed by  […feedbackId.js] as NextJs is smart enough. So of there is a more specific page for a given path value like we have a feedback.js in this case, so it will use more specific file than the more generic dynamic file. 

 **Structuring files**

```jsx
| pages
|      - api
|					 - [feedbackId.js]
|          - feedback-> **Folder**
|                            - **index**.js
```