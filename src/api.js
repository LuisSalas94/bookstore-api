const express = require("express");
const serverless = require("serverless-http");
const app = express();
const data = require("../data.json");

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Welcome to the Bookstore API");
});

router.get("/books", (req, res) => {
	res.json(data);
});

router.get("/books/:id", (req, res) => {
	const { id } = req.params;
	const book = data.find((book) => book.isbn === id);
	if (!book) {
		res.status(404).send("Book not found");
	}
	return res.send(book);
});

router.get("/books/v1/query", (req, res) => {
	let { search, limit } = req.query;
	let books = [...data];

	//http://localhost:5000/api/v1/query?search=a
	if (search) {
		books = books.filter((book) => {
			search = search.toLowerCase();
			return (
				book.author.toLowerCase().includes(search) ||
				book.title.toLowerCase().includes(search)
			);
		});
	}

	//http://localhost:5000/api/v1/query?limit=3
	if (limit) {
		books = books.slice(0, Number(limit));
	}

	res.send(books);
});

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
