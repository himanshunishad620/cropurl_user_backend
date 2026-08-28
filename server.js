const app = require("./app");
const connectDB = require("./config/db");
connectDB();
app.listen(1000, () => console.log("Server Started on port 1000"));
