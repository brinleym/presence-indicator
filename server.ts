import type { Request, Response} from "express";

import express from "express";
import dotenv from "dotenv";
import { Redis } from 'ioredis';

// Configures dotenv
dotenv.config();

// Set up web server dependencies
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

// Set up Redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    // Add password if your Redis server requires authentication
    // password: process.env.REDIS_PASSWORD,
});

app.get("/", (request: Request, response: Response) => { 
  response.status(200).send("Hello World");
}); 

app.post("/ping", async (request: Request, response: Response) => {
  // curl -s -X POST http://localhost:3000/ping \
  //   -H 'Content-Type: application/json' -d '{"userId":"u1"}'
  const {userId} = request.body || {};
  if (!userId) return response.status(400).json({ error: 'userId required' });
  await redisClient.set(`presence:${userId}`, '', 'EX', 10);
  await redisClient.sadd('online_users', userId);
  response.status(200).json({ message: "User ping recorded" });
});

app.get("/who", async (request: Request, response: Response) => {
  return response.json({ users: await getOnline() });
});

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  throw new Error(error.message);
});

async function getOnline(): Promise<string[]> {
  const users = await redisClient.smembers('online_users');
  const alive = [];
  for (const u of users) {
    const keys = await redisClient.keys(`presence:${u}*`); // ok for small demo
    if (keys.length) alive.push(u);
    else await redisClient.srem('online_users', u);
  }
  return alive.sort();
}