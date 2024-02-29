import { Router } from "express";
import messagePost from "../controllers/message/messagePost";
import imagePost from "../controllers/message/imagePost";

const router = Router();

router.post("/", messagePost);
router.post("/image", imagePost);

export default router;
