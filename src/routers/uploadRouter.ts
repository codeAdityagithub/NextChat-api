import { Router } from "express";
import uploadPost from "../controllers/upload/uploadPost";

const router = Router();

router.post("/", uploadPost);

export default router;
