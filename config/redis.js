const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

client.on("ready", () => {
  console.log("Redis ready!");
});

async function connectRedis() {
  try {
    await client.connect();
  } catch (error) {
    throw error;
  }
}

module.exports = {
  connectRedis,
  client,
};
