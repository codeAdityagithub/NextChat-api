import { Router } from "express";
import messagePost from "../controllers/message/messagePost";

const router = Router();

router.post("/", messagePost);

export default router;
