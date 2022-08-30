import { useRef, useState } from "react"
function HomePage() {
  const [feedbackItems, setFeedBackItems] = useState([])
  const emailInputref = useRef()
  const feedbackInputref = useRef()

  const submitFormHandler = (event) => {
    event.preventDefault()

    const enteredEmail = emailInputref.current.value
    const enteredFeedback = feedbackInputref.current.value

    const reqBody = { email: enteredEmail, text: enteredFeedback }

    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => console.log(data))
  }

  const loadFeedbackHandler = () => {
    fetch("/api/feedback")
      .then((resp) => resp.json())
      .then((data) => setFeedBackItems(data.feedback))
  }
  return (
    <div>
      <h1>The Home Page</h1>
      <form action="" onSubmit={submitFormHandler}>
        <div>
          <label htmlFor="email">Your Email Address</label>
          <input type="email" name="" id="email" ref={emailInputref} />
        </div>
        <div>
          <label htmlFor="feedback">Your Feedback</label>
          <textarea rows="5" id="feedback" ref={feedbackInputref} />
        </div>
        <button type="submit">Send Feedback</button>
      </form>
      <hr />
      <button onClick={loadFeedbackHandler}>Load Feedback</button>
      <ul>
        {feedbackItems.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default HomePage
