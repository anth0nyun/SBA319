import { Router } from "express";
import { tasks, nextIds } from "../data/store.mjs";

const router = Router();

// GET all tasks
router.get("/", (req, res) => {
    res.json(tasks);
});

// GET one task by id
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id == id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
});

// POST new task
router.post("/", (req, res) => {
    const { title, completed = false, priority = "low", projectId, assignedTo } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const task = {
        id: nextIds.task++,
        title,
        completed,
        priority,
        projectId,
        assignedTo
    };

    tasks.push(task);
    res.status(201).json(task);
});

// PUT update task 
router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id == id);

    if (index == -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const { title, completed, priority, projectId, assignedTo } = req.body;

    // overwrite existing task
    tasks[index] = { id, title, completed, priority, projectId, assignedTo };

    res.json(tasks[index]);
});



export default router;