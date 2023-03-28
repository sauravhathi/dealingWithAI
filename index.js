// Import required dependencies and modules
const express = require("express"); // express framework
const cors = require("cors"); // CORS middleware
const { Configuration, OpenAIApi } = require("openai"); // OpenAI API wrapper
const dotenv = require("dotenv"); // loads environment variables from .env file
const rateLimit = require("express-rate-limit"); // rate limiting middleware

const app = express(); // create express application instance
const port = process.env.PORT || 5000; // set the server port, either from environment variable or default to 3000
app.use(cors()); // use CORS middleware to allow cross-origin requests
dotenv.config(); // load environment variables from .env file

// Initialize OpenAI API client with API key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json()); // use express middleware to parse incoming JSON request bodies

// Set up rate limiting middleware with configuration from environment variables
const limiter = rateLimit({
  windowMs: process.env.MAX_REQUESTS_PER_MINUTE * 60 * 1000, // time window for rate limiting in milliseconds
  max: process.env.MAX_REQUESTS, // maximum number of requests allowed in the time window
  message: JSON.stringify({
    error: `Too many requests, you can only make ${process.env.MAX_REQUESTS} requests per ${process.env.MAX_REQUESTS_PER_MINUTE} minutes. Please try again later.`,
  }), // error message to be returned when rate limit is exceeded
  standardHeaders: true, // set standard headers for rate limiting response
});

// Utility function to clean input strings
const stringClean = (value) => {
  return value.trim().replace(/(\r\n|\n|\r)/gm, "");
};

// Middleware function to validate incoming request body
const validateInput = (req, res, next) => {
  const { value } = req.body;
  const question = stringClean(value);

  // Check if the 'value' property is present in the request body
  if (!question) {
    res.status(400).send({ error: `String is empty` });
    return;
  }

  // Check if the length of the input string is greater than the maximum allowed length
  const charCount = question.length;

  // If the length of the input string is greater than the maximum allowed length, send an error response to the client
  if (charCount > process.env.MAX_CHARACTERS) {
    res.status(400).send({ error: `String is too long (max ${process.env.MAX_CHARACTERS} characters)` });
    return;
  }

  // next() function to call the next middleware function in the request-response cycle
  next();
};

// This route handles incoming POST requests to the '/v1/api/dealingWithAI' endpoint
app.post("/v1/api/dealingWithAI", limiter, validateInput, async (req, res) => {
  try {
    // set the Access-Control-Allow-Origin header to allow all origins
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    const { value, option, language, task, number } = req.body; // Extract the 'value', 'option', 'language', and 'task' properties from the request body
    let prompt = stringClean(value); // Clean the input string by removing any leading/trailing whitespaces or line breaks

    if (option) { // If the 'option' property is present in the request body
      switch (option) { // Check the value of the 'option' property
        case "sentence correction":
          prompt = `Correct it ${prompt}`; // If the value is 'sentence correction', prepend the string 'Correct it ' to the input string
          break;
        case "paraphraser":
          prompt = `Paraphrase it ${prompt}`; // If the value is 'paraphraser', prepend the string 'Paraphrase it ' to the input string
          break;
        case "report making":
          prompt = `Create report ${prompt}`; // If the value is 'report making', prepend the string 'Create report ' to the input string
          break;
        case "table of content":
          prompt = `write table of content ${prompt}`; // If the value is 'table of content', prepend the string 'write table of content ' to the input string
        case "compare review papers":
          prompt = `${prompt} comparison of existing papers ${number} don't add conclusion and introduction` // comparing review papers, task is the name of the paper to be compared with the input paper and the conclusion and introduction are not added
          break;
        case "apa citation":
          prompt = `APA citation ${prompt}`; // generate APA citation or reference
          break;
        case "programming":
          const codePrompt = `${language || "C++"}${task ? task : "Solve"}${prompt}`; // If the value is 'programming', concatenate the 'language', 'task' (if present), and input string
          prompt = codePrompt.length > process.env.MAX_CHARACTERS ? `${language}${task}` : codePrompt; // If the length of the concatenated string is greater than the maximum allowed length, only use the 'language' and 'task' strings
          break;
        case "math":
          prompt = `Solve ${prompt}`; // If the value is 'math', prepend the string 'Solve ' to the input string
          break;
        case "writing":
          prompt = `Write ${task}${prompt}`; // If the value is 'writing', concatenate the 'task' and input string with the 'Write ' string
          break;
        case "website":
          prompt = `provide SEO ${task}${prompt}`; // If the value is 'website', concatenate the 'task' and input string with the 'provide SEO ' string
          break;
        default:
          break;
      }
    }

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // Use the 'gpt-3.5-turbo' model
      messages: [{ role: "user", content: prompt }],
    });

    const data = completion.data.choices[0].message.content.trim(); // Extract the generated text from the OpenAI response
    res.send({ data }); // Send the generated text back to the client as the response
  } catch (error) {
    res.status(500).send({ error: "Something went wrong" }); // If an error occurs, send an error response to the client
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`); // Start the server and log a message to the console
});
