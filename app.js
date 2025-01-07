const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { login } = require("./controllers/users");
const { createUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

//temp mw
/*app.use((req, res, next) => {
  req.user = {
    _id: "67410247438f489190f17844",
  };
  next();
}); */

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
