import bodyParser from "body-parser";
import express from "express";
import spotify from "./routes/spotify";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.use("/api/player", spotify);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at localhost:${PORT}`);
});
