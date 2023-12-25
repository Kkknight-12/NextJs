import express from "express";

const app = express();
const port = Number(process.env.PORT) || 3000;

const start = async () => {
  const payload = await fetch("https://api.github.com/users/alex-cory");
};

start();