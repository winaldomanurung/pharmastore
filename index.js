const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const port = process.env.PORT || 2000;
const routers = require("./src/routes");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    exposedHeaders: ["UID", "Auth-Token"],
  })
);

// Database connection
const connection = require("./src/config");
connection.connect((error) => {
  if (error) {
    console.log("Database connection error: ", error);
  }

  console.log(
    `Database connection is established at ID: ${connection.threadId}`
  );
});

app.get("/", (req, res) => {
  res.send("<h1>TEST</h1>");
});

app.use("/admin", routers.adminRouter);

app.listen(port, () => {
  console.log("Listening to Port: " + port);
});
