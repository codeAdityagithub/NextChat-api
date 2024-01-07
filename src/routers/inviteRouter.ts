import { Router } from "express";
import invitePost from "../controllers/invite/invitePost";
import inviteGet from "../controllers/invite/inviteGet";
import invitePut from "../controllers/invite/invitePut";

const router = Router();

router.post("/", invitePost);
router.get("/", inviteGet);
router.put("/", invitePut);

export default router;
