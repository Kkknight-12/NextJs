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