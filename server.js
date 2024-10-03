

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import  {connectDB} from "./db/db.connection.js";
import { twitter_routes } from "./api.js";

const app = express();
app.use(cors());
app.use(express.json())
connectDB();

app.use(twitter_routes);
app.get('/home', (req, res) => {
  res.status(200).send('hello from server');
})
// app.use(
//   cors({
//     origin: "https://localhost:3000",
//   })
// );

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`server is started on port ${port}`);
});
