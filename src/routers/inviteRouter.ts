import { Router } from "express";
import invitePost from "../controllers/invite/invitePost";
import inviteGet from "../controllers/invite/inviteGet";

const router = Router();

router.post("/", invitePost);
router.get("/", inviteGet);

export default router;
