const express = require("express");
const multer = require("multer");
require("dotenv").config();
const cors = require("cors");
const app = express();
const userRoute = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoute");
const { dbConnection } = require("./database/db");

app.use(multer().any());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/accounts", userRoute);
app.use("/api/chats", chatRoutes);

const url = process.env.URL;

const port = process.env.PORT || 5000;
dbConnection(url);

app.listen(port, () => {
  console.log(`server start on port ${port}`);
});
