const express = require("express");
require("dotenv").config();
const DB = require("./Config/DB");
const cors = require("cors");

const deployRoutes = require("./routes/deployRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// DB Connection
DB.DBConnection();

app.use(express.json());
app.use(
  cors({
    origin: ["https://mini-hosting-panel.netlify.app", "http://localhost:5173"],
    credentials: true,
  }),
);

app.use("/api", deployRoutes);

app.get("/", (req, res) => {
  res.send("App is running");
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
