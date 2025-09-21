// imports
import express from "express";
import { requestLogger } from "./middleware/requestLogger.mjs";
import { requireJson } from "./middleware/requireJson.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";
import usersRouter from "./routes/users.mjs";
import projectsRouter from "./routes/projects.mjs";
import tasksRouter from "./routes/tasks.mjs";

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(requestLogger);
app.use(requireJson);

// root route
app.get("/", (req, res) => {
    res.json({ message: "Task Manager API is running 🚀" });
});

// API routes
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/tasks", tasksRouter);

// error handler
app.use(errorHandler);

// listener
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});