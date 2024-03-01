import { Router } from "express";
import uploadPost from "../controllers/upload/uploadPost";
import uploadGet from "../controllers/upload/uploadGet";

const router = Router();

router.post("/", uploadPost);
router.get("/:fileName", uploadGet);

export default router;
