const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());

const limiter = rateLimit({
  windowMs: process.env.MAX_REQUESTS_PER_MINUTE * 60 * 1000,
  max: process.env.MAX_REQUESTS,
  message: `Too many requests, please try again in ${process.env.MAX_REQUESTS_PER_MINUTE} minutes`,
  standardHeaders: true,
});

const validateInput = (req, res, next) => {
  const { dealingWithAI } = req.body;
  if (!dealingWithAI) {
    res.status(400).send({ error: `String is empty` });
    return;
  }
  const wordCount = dealingWithAI.split(/\s+/).length;
  if (wordCount > process.env.MAX_WORDS) {
    res.status(400).send({ error: `String is too long (max ${process.env.MAX_WORDS} words)` });
    return;
  }
  next();
};

app.post("/v1/api/dealingWithAI", limiter, validateInput, async (req, res) => {
  try {
    const { dealingWithAI } = req.body.trim();
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${dealingWithAI}`,
      max_tokens: 100,
    });
    const data = completion.data.choices[0].text.trim();
    res.send({ data });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});