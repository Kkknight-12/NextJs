import fs from "fs";
import path from "path";

// path to send request
// /api/feedback

// get the path to the file
export function buildFeedbackPath() {
  return path.join(process.cwd(), "data", "feedback.json");
}

// read the file and convert it into JSON
export function extractFeedback(filepath) {
  const fileData = fs.readFileSync(filepath);
  const data = JSON.parse(fileData);
  return data;
}

// handle post and other( get ) request
export default function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    const email = req.body.email;
    const feedbackText = req.body.text;

    const newFeedBack = {
      id: new Date().toISOString(),
      email: email,
      text: feedbackText,
    };

    const filePath = buildFeedbackPath();
    const data = extractFeedback(filePath);
    data.push(newFeedBack);
    fs.writeFileSync(filePath, JSON.stringify(data));
    res.status(201).json({ message: "Success", feedback: newFeedBack });
  } else {
    //
    const filePath = buildFeedbackPath();
    const data = extractFeedback(filePath);
    res.status(200).json({ feedback: data });
  }
}