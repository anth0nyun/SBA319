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
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
});

export default router;