const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const { connectRedis } = require("./config/redis");
const app = require("./app");
const connectDB = require("./config/db");

async function startServer() {
  try {
    await connectRedis();
    await connectDB();

    const PORT = process.env.PORT || 1000;

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

startServer();
