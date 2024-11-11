import express from "express";
import main from "./OpenAIService";

/*
Start Express server
*/
const app = express();
const port = 3000;
app.use(express.json());
app.listen(port, () =>
  console.log(
    `Server running at http://localhost:${port}. Listening for GET /api/runTask requests`
  )
);

const openAIService = main;

app.get("/api/runTask", async (req, res) => {
  await openAIService();
  res.json({ message: "Task completed" });
});
