import express from "express";
import { RegisterUser, LoginUser } from "../controllers/AuthController.js";

const router = express.Router();

// router.get("/", async(req, res) => {res.send("Authenticated")});

router.post('/register', RegisterUser)
router.post('/login', LoginUser)

export default router;
