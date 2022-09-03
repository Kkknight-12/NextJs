import { MongoClient } from "mongodb";

export async function connectToDataBase() {
  const client = MongoClient.connect(
    "mongodb+srv://knight123:knight123@cartapp.fuwv0.mongodb.net/NextJsMax?retryWrites=true&w=majority"
  );
  return client;
}