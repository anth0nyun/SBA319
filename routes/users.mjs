import { Router } from "express";
import { users, nextIds } from "../data/store.mjs";

const router = Router();

// GET all users
router.get("/", (req, res) => {
    res.json(users);
});

// POST new user
router.post("/", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name is required" });
    }

    const user = { id: nextIds.user++, name };
    users.push(user);
    res.status(201).json(user);
});

export default router;