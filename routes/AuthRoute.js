import express from "express";
import { RegisterUser } from "../controllers/AuthController.js";

const router = express.Router();

// router.get("/", async(req, res) => {res.send("Authenticated")});

router.post('/register', RegisterUser)

export default router;
