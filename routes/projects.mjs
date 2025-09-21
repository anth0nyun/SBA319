import { Router } from "express";
import { projects } from "../data/store.mjs";

const router = Router();

// GET all projects
router.get("/", (req, res) => {
    res.json(projects);
});

export default router;