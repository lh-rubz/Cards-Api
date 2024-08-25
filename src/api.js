const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

// Create MySQL connection pool
const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "root",
	database: "todo_app",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

const promisePool = pool.promise();

app.use(cors());
app.use(express.json());

// GET all cards
router.get("/cards", async (req, res) => {
	try {
		const [rows] = await promisePool.query("SELECT * FROM tasks");
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
		const [rows] = await promisePool.query(
			"SELECT * FROM tasks WHERE userId = ?",
			[userId]
		);
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
		const [rows] = await promisePool.query(
			"SELECT * FROM tasks WHERE id = ?",
			[taskId]
		);
		if (rows.length === 0) {
			return res.status(404).json({ error: "Task not found" });
		}
		res.json(rows[0]);
	} catch (error) {
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
		const [maxIdResult] = await promisePool.query(
			"SELECT MAX(id) AS maxId FROM tasks"
		);
		const maxId = maxIdResult[0].maxId;
		const newId = maxId !== null ? maxId + 1 : 1;

		const query =
			"INSERT INTO tasks (id, userId, title, completed) VALUES (?, ?, ?, ?)";
		const values = [newId, userId, title, completed];

		await promisePool.query(query, values);

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
		const [result] = await promisePool.query(
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
		const [deleteResult] = await promisePool.query(
			"DELETE FROM tasks WHERE id = ?",
			[taskId]
		);
		if (deleteResult.affectedRows === 0) {
			return res.status(404).json({ error: "Task not found" });
		}

		const [rows] = await promisePool.query("SELECT * FROM tasks");
		res.json(rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
