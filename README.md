# Dealing With AI

Dealing with AI is a web application that uses OpenAI's GPT-3 API. The API endpoint allows users to make requests to the OpenAI API for various natural language processing tasks such as sentence correction, paraphrasing, report making, programming, math, writing, website optimization and many more.

## Demo
### Frontend👉 https://dealing-with-ai.vercel.app/

![image](https://user-images.githubusercontent.com/61316762/222989171-5230e69e-1cd4-4fdd-b856-96b9a8d2f68d.png)

![image](https://user-images.githubusercontent.com/61316762/222989173-4a5241dd-61ce-48f7-8e1b-63ecf3d5ce4b.png)

## Tech Stack

The tech stack used in this application includes:

	- Node.js
	- Express.js
	- OpenAI API
	- dotenv
	- express-rate-limit
  
## API Endpoint

The API endpoint for Dealing with AI is located at /v1/api/dealingWithAI. It accepts HTTP POST requests with a JSON body that includes the following properties:

	- value: represents the user's input.
	- option: represents an option chosen by the user (if applicable).
	- language: represents the language used for the input.
	- task: represents the task to be performed by the AI.

Upon receiving the request, the API performs rate limiting with the help of a middleware function called limiter. It then validates the input using another middleware function called validateInput. If the input is valid, the API generates a response using the AI and returns it in the following JSON format:

	```json
	{
	  "data": "response"
	}
	```
## Code

The application code is written in JavaScript and uses Node.js and Express.js to handle HTTP requests. The OpenAI API is used to generate responses to user input.

The `stringClean` function removes leading and trailing whitespace and multiple consecutive newline characters from a string.

The `validateInput` middleware function is used to validate the user input before it is processed. It checks if the `value` field is not empty and if the number of words in the input is within the limit specified by the `MAX_CHARACTERS` environment variable.

The application also uses the dotenv package to load environment variables from a `.env` file. The `OPENAI_API_KEY`, `MAX_REQUESTS`, `MAX_REQUESTS_PER_MINUTE`,  `MAX_CHARACTERS`, and `PORT` variables are used to configure the `OpenAI API key`, rate limiting, and input validation.

## Installation

To run Dealing with AI locally, you need to have Node.js and npm (Node Package Manager) installed on your machine. You also need an OpenAI API key to access the GPT-3 API.

Follow these steps to install the application and its dependencies:

1. Clone the repository to your local machine.
	`git clone https://github.com/sauravhathi/dealingWithAI.git`
2. Navigate to the project directory.
	```bash
	cd dealingWithAI
	```
3. Install the dependencies using npm.
	```bash
	npm i
	```
4. Create a .env file in the project directory with the following contents:
	```json
	OPENAI_API_KEY="your-openai-api-key"
	PORT=3000
	MAX_CHARACTERS = 400
	MAX_REQUESTS = 4
	MAX_REQUESTS_PER_MINUTE = 2
	```
5. Replace `your-openai-api-key` with your actual OpenAI API key. The `MAX_REQUESTS`, `MAX_REQUESTS_PER_MINUTE`, and `MAX_CHARACTERS` variables are used to configure rate limiting and input validation.

## Usage

To start the application, run the following command in the project directory:
	`
	npm start 
	`
if you want to use nodemon
	`
	npm run server
	`

This will start the server on `http://localhost:3000`.

### postman api testing
![image](https://user-images.githubusercontent.com/61316762/222929101-372a85df-dc71-471f-bede-01a455011ec7.png)

#### rate-limit
![image](https://user-images.githubusercontent.com/61316762/222928929-9faf195e-73ad-45b5-8044-8385db037cf5.png)

![image](https://user-images.githubusercontent.com/61316762/222928932-2cb8e415-657a-4c92-b57b-cd78218b9ce5.png)

You can now send a POST request to the API endpoint `/v1/api/dealingWithAI` with a JSON body that includes a `value` field representing the user's input. Here is an example using `curl`:

	```bash
	curl --header "Content-Type: application/json" --request POST --data '{"value":"Hello, how are you?"}' http://localhost:3000/v1/api/dealingWithAI
	```

The response will be a JSON object with a `data` field containing the generated response from the GPT-3 model:

	```json
	{"data":"I'm good, thank you. How can I assist you?"}
	```

### Postman Tests for all features

The implementation uses a switch statement to check the value of the `option` property in the request body, and modifies the prompt accordingly based on the value of `option`. If `option` is not present, the original prompt is used.

Some of the options have additional properties, such as `language` and `task` for the `programming` option, and `task` for the `writing` and `website` options. These properties are optional and can be null.

1. Sentence Correction
	```json
	{
	  "value": "Which following correct",
	  "option": "sentence correction"
	}
	```
	#### request and response
	![image](https://user-images.githubusercontent.com/61316762/222971343-e1e10637-b559-4a24-acd9-a13a0c228a05.png)

2. Paraphraser
	```json
	{
	    "value": "hello everyone",
	    "option": "paraphraser"
	}
	```
	#### request and response
	![image](https://user-images.githubusercontent.com/61316762/222971292-1fc49810-121f-4f07-a9ec-cd584bca14de.png)

3. Report Making
	```json
	{
	    "value": "5G tech",
	    "option": "report making"
	}
	```
	#### request and response
	![image](https://user-images.githubusercontent.com/61316762/222971247-7795d78b-f822-4ca5-9a3b-8460fae51fac.png)
	
4. Programming
	```json
	{
	    "value": "int* a;a=5;string str = \"hello\"",
	    "option": "programming",
	    "language": "c++",
	    "task": "explain"
	}
	```
	#### request
	![image](https://user-images.githubusercontent.com/61316762/222970965-94939ece-ef66-4037-8952-193cd13a896f.png)
	#### response
	![image](https://user-images.githubusercontent.com/61316762/222970972-44085180-e830-4d93-bc0d-54d9f76d8504.png)

5. Math
	```json
	{
	  "value": "5+9",
	  "option": "math"
	}
	```
	#### request
	![image](https://user-images.githubusercontent.com/61316762/222971071-40f98145-f1aa-422d-8533-d8487cbbb7d1.png)
	#### response
	![image](https://user-images.githubusercontent.com/61316762/222971082-a96486e0-156a-4044-a05b-87a47c56196a.png)

6. Writing
	```json
	{
	  "value": "climate change",
	  "option": "writing",
	  "task": "essay"
	}
	```
	#### request and response
	![image](https://user-images.githubusercontent.com/61316762/222971147-8b2b5c07-8086-44f4-ab9e-94f82ad4c9f2.png)

7. Website
	```json
	{
	  "value": "bollywood movie",
	  "option": "website",
	  "task": "keywords"
	}
	```
	#### request and response
	![image](https://user-images.githubusercontent.com/61316762/222971182-af8f5027-bb2b-4e1a-8854-1e23cb6fb7bc.png)

Note that the input validation and rate limiting are applied to the API endpoint, so if the input is invalid or the rate limit is exceeded, an error response will be returned instead.
