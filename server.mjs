import express from "express";

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());

// route
app.get("/", (req, res) => {
    res.json({ message: "Task Manager API is running 🚀" });
});

// listener
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});