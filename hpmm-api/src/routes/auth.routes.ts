import { Router } from "express";
import { login, checkSession, logout } from "../controllers/auth.controller";
import { authenticateSession } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/check-session", authenticateSession, checkSession);
router.get("/logout", authenticateSession, logout);

export default router;
