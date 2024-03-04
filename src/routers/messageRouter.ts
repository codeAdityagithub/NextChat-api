import { Router } from "express";
import messagePost from "../controllers/message/messagePost";
import imagePost from "../controllers/message/imagePost";
import messageDelete from "../controllers/message/messageDelete";
import imageDelete from "../controllers/message/imageDelete";

const router = Router();

router.post("/", messagePost);
router.delete("/", messageDelete);
router.post("/image", imagePost);
router.delete("/image", imageDelete);

export default router;
