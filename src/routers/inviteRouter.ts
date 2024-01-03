import { Router } from "express";
import invitePost from "../controllers/invite/invitePost";

const router = Router();

router.post("/", invitePost);

export default router;
