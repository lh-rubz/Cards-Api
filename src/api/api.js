const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

// Create MySQL connection
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "todo_app",
});

connection.connect((err) => {
	if (err) {
		console.error("Error connecting to MySQL:", err.stack);
		return;
	}
	console.log("Connected to MySQL ");
});

app.use(cors());
app.use(express.json());

// GET all cards
router.get("/cards", async (req, res) => {
	try {
		const [rows] = await connection.promise().query("SELECT * FROM tasks");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET cards by userId
router.get("/cards/user/:userId", async (req, res) => {
	const userId = parseInt(req.params.userId, 10);
	if (isNaN(userId)) {
		return res.status(400).json({ error: "Invalid user ID" });
	}
	try {
		const [rows] = await connection
			.promise()
			.query("SELECT * FROM tasks WHERE userId = ?", [userId]);
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// GET a specific card by ID
router.get("/cards/:id", async (req, res) => {
	const taskId = parseInt(req.params.id, 10);

	if (isNaN(taskId)) {
		return res.status(400).json({ error: "Invalid task ID" });
	}

	try {
		const [rows] = await connection
			.promise()
			.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.json(rows[0]);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// GET cards by title (starts with)
router.get("/cards/search/:title", async (req, res) => {
	const { title } = req.params;
	console.log("Search title:", title); // Debugging line
	if (typeof title !== "string" || title.trim() === "") {
		return res.status(400).json({ error: "Invalid or missing title" });
	}
	try {
		const [rows] = await connection
			.promise()
			.query("SELECT * FROM tasks WHERE title LIKE ?", [`${title}%`]);
		res.json(rows);
	} catch (error) {
		console.error("Database query error:", error.message);
		res.status(500).json({ error: error.message });
	}
});
// POST a new card
router.post("/cards/user/:userId", async (req, res) => {
	const { userId } = req.params;
	const { title, completed } = req.body;

	if (
		typeof userId !== "number" ||
		typeof title !== "string" ||
		typeof completed !== "boolean"
	) {
		return res.status(400).json({ error: "Invalid input" });
	}

	try {
		const [maxIdResult] = await connection
			.promise()
			.query("SELECT MAX(id) AS maxId FROM tasks");
		const maxId = maxIdResult[0].maxId;
		const newId = maxId !== null ? maxId + 1 : 1;

		const query =
			"INSERT INTO tasks (id, userId, title, completed) VALUES (?, ?, ?, ?)";
		const values = [newId, userId, title, completed];

		await connection.promise().query(query, values);

		res.status(201).json({ id: newId, userId, title, completed });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// PUT (Update) a card
router.put("/cards/:id", async (req, res) => {
	const taskId = parseInt(req.params.id, 10);
	const { userId, title, completed } = req.body;

	if (
		isNaN(taskId) ||
		typeof userId !== "number" ||
		typeof title !== "string" ||
		typeof completed !== "boolean"
	) {
		return res.status(400).json({ error: "Invalid input" });
	}

	try {
		const [result] = await connection
			.promise()
			.query(
				"UPDATE tasks SET userId = ?, title = ?, completed = ? WHERE id = ?",
				[userId, title, completed, taskId]
			);
		if (result.affectedRows === 0) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.json({ id: taskId, userId, title, completed });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// DELETE a card and return the remaining tasks
router.delete("/cards/:id", async (req, res) => {
	const taskId = parseInt(req.params.id, 10);

	if (isNaN(taskId)) {
		return res.status(400).json({ error: "Invalid task ID" });
	}

	try {
		const [deleteResult] = await connection
			.promise()
			.query("DELETE FROM tasks WHERE id = ?", [taskId]);
		if (deleteResult.affectedRows === 0) {
			return res.status(404).json({ error: "Task not found" });
		}

		const [rows] = await connection.promise().query("SELECT * FROM tasks");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.use("/.netlify/functions/api", router);
// app.listen(5500, () => {
// 	console.log("listening on port 5500");
// });

module.exports.handler = serverless(app);
