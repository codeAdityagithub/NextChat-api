import { Router } from "express";
import loginUser from "../controllers/auth/loginUser";

const router = Router();

router.post("/login", loginUser);

export default router;
